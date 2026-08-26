import { and, desc, eq, getTableColumns, ilike, inArray, or, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { contacts, leads } from "@/db/schema/crm";
import { properties, users } from "@/db/schema";
import { webEnquiries, type webEnquiryKind, type webEnquiryStatus } from "@/db/schema/web";
import { writeAudit } from "@/lib/authz/audit";
import { authorize } from "@/lib/authz/can";
import { ConflictError, DomainValidationError, NotFoundError } from "@/lib/authz/errors";
import { resolveEntityId } from "@/lib/services/entity";
import { toISOStringSafe } from "@/lib/services/properties";
import type { CallerContext } from "@/lib/services/types";

/**
 * Triage for the public site's enquiry inbox.
 *
 * `web_enquiries` is where the five public forms write. It exists so anonymous
 * input never lands directly in `crm.leads`: the public site has no captcha,
 * and the pipeline is a surface real people work from every day. This module is
 * the other half of that decision — without a reader, submissions accumulate
 * unseen and staging is just a slower way of discarding them.
 *
 * ── Permissions ──
 *
 * Reuses `crm.lead.read` / `crm.lead.write` rather than inventing
 * `web.enquiry.*`. A web enquiry is a lead that has not been accepted yet;
 * anyone trusted to work the pipeline is trusted to triage its inbox, and a new
 * permission would need role mappings before a single person could see the
 * screen.
 *
 * ── Entity scoping ──
 *
 * `web_enquiries.entity_id` is nullable, unlike every internal table: a visitor
 * belongs to no entity when they submit. Rows are therefore visible to any
 * caller with pipeline read on any entity, and an entity is assigned at
 * conversion. That is deliberate — an unassigned enquiry that only appears
 * under the entity nobody happens to have selected is an enquiry nobody
 * answers.
 */

export type WebEnquiryStatus = (typeof webEnquiryStatus.enumValues)[number];
export type WebEnquiryKind = (typeof webEnquiryKind.enumValues)[number];

export async function listWebEnquiries(
  ctx: CallerContext,
  filters: {
    status?: WebEnquiryStatus | "open";
    kind?: WebEnquiryKind;
    search?: string;
    limit?: number;
  } = {}
) {
  const entityId = ctx.entityId ? await resolveEntityId(ctx.entityId) : null;
  await authorize(ctx, "crm.lead.read", entityId);

  let conditions: SQL | undefined;

  if (filters.status === "open") {
    // The default working set: everything still awaiting a decision. Converted,
    // spam and archived rows are deliberately out of the way — the inbox is a
    // queue, and a queue that shows finished work stops being one.
    conditions = inArray(webEnquiries.status, ["new", "triaged"]);
  } else if (filters.status) {
    conditions = eq(webEnquiries.status, filters.status);
  }

  if (filters.kind) {
    conditions = and(conditions, eq(webEnquiries.kind, filters.kind));
  }

  if (filters.search) {
    const q = `%${filters.search}%`;
    conditions = and(
      conditions,
      or(
        ilike(webEnquiries.name, q),
        ilike(webEnquiries.email, q),
        ilike(webEnquiries.phone, q),
        ilike(webEnquiries.message, q)
      )
    );
  }

  const rows = await db
    .select({
      ...getTableColumns(webEnquiries),
      propertyName: properties.name,
      reviewedByName: users.name,
    })
    .from(webEnquiries)
    .leftJoin(properties, eq(properties.id, webEnquiries.propertyId))
    .leftJoin(users, eq(users.id, webEnquiries.reviewedById))
    .where(conditions)
    .orderBy(desc(webEnquiries.createdAt))
    .limit(filters.limit ?? 200);

  return rows.map((row) => ({
    ...row,
    createdAt: toISOStringSafe(row.createdAt),
    updatedAt: toISOStringSafe(row.updatedAt),
    reviewedAt: toISOStringSafe(row.reviewedAt),
    // The abuse columns are never sent to a browser. They exist for the
    // throttle, and a hashed IP on screen is noise a triager cannot act on.
    ipHash: undefined,
    userAgent: undefined,
  }));
}

/** Counts per status, for the inbox tabs. One query, not five. */
export async function getWebEnquiryCounts(ctx: CallerContext) {
  const entityId = ctx.entityId ? await resolveEntityId(ctx.entityId) : null;
  await authorize(ctx, "crm.lead.read", entityId);

  const rows = await db
    .select({ status: webEnquiries.status, kind: webEnquiries.kind })
    .from(webEnquiries);

  const byStatus: Record<string, number> = {};
  const byKind: Record<string, number> = {};
  for (const row of rows) {
    byStatus[row.status] = (byStatus[row.status] ?? 0) + 1;
    byKind[row.kind] = (byKind[row.kind] ?? 0) + 1;
  }
  return { byStatus, byKind, total: rows.length };
}

/**
 * Move an enquiry between triage states.
 *
 * Deliberately cannot set `converted` — that state means "a lead exists", and
 * the only thing allowed to assert it is the function that creates the lead.
 * Letting it be set by hand would produce rows claiming a conversion with a
 * null `converted_lead_id`.
 */
export async function setWebEnquiryStatus(
  ctx: CallerContext,
  enquiryId: string,
  status: Exclude<WebEnquiryStatus, "converted">
) {
  const entityId = ctx.entityId ? await resolveEntityId(ctx.entityId) : null;
  await authorize(ctx, "crm.lead.write", entityId);

  const [existing] = await db
    .select()
    .from(webEnquiries)
    .where(eq(webEnquiries.id, enquiryId))
    .limit(1);
  if (!existing) throw new NotFoundError("Enquiry not found");

  if (existing.status === "converted") {
    throw new ConflictError(
      "This enquiry has already been converted to a lead and cannot be reopened."
    );
  }

  return db.transaction(async (tx) => {
    const [updated] = await tx
      .update(webEnquiries)
      .set({
        status,
        reviewedById: ctx.user.id,
        reviewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(webEnquiries.id, enquiryId))
      .returning();

    await writeAudit(tx, ctx, {
      action: "web.enquiry.triage",
      associatedType: "web_enquiry",
      associatedId: enquiryId,
      summary: `${ctx.user.name} marked a website enquiry as ${status}`,
      entityId: existing.entityId ?? entityId,
      before: existing,
      after: updated,
    });

    return updated;
  });
}

/**
 * Accept an enquiry: create the contact and the lead, and record the link.
 *
 * One transaction, because a contact created without its lead is an orphan the
 * triager cannot see or retry, and an enquiry marked converted without a lead
 * is a submission that has silently vanished.
 *
 * The contact is matched on email or phone before being created — a landlord
 * who submits the valuation form twice should not become two contacts, and the
 * public forms have no way to know they already exist in the CRM.
 */
export async function convertWebEnquiryToLead(
  ctx: CallerContext,
  enquiryId: string,
  options: { entityId?: string; assignedToId?: string | null } = {}
) {
  const entityId = await resolveEntityId(options.entityId ?? ctx.entityId ?? "group");
  await authorize(ctx, "crm.lead.write", entityId);

  const [enquiry] = await db
    .select()
    .from(webEnquiries)
    .where(eq(webEnquiries.id, enquiryId))
    .limit(1);
  if (!enquiry) throw new NotFoundError("Enquiry not found");

  if (enquiry.status === "converted") {
    throw new ConflictError("This enquiry has already been converted.");
  }
  if (!enquiry.email && !enquiry.phone) {
    throw new DomainValidationError(
      "This enquiry has no email or phone, so there is no way to reach the contact it would create."
    );
  }

  return db.transaction(async (tx) => {
    // Match an existing contact before creating one.
    const matchers: SQL[] = [];
    if (enquiry.email) matchers.push(eq(contacts.email, enquiry.email));
    if (enquiry.phone) matchers.push(eq(contacts.phone, enquiry.phone));

    const [match] = await tx
      .select()
      .from(contacts)
      .where(and(eq(contacts.entityId, entityId), or(...matchers)))
      .limit(1);

    let contactId: string;
    let contactName: string;

    if (match) {
      contactId = match.id;
      contactName = match.displayName;
    } else {
      const [created] = await tx
        .insert(contacts)
        .values({
          entityId,
          // A valuation enquiry is an owner; the other two are buyers or
          // tenants and cannot be told apart without reading the message.
          type: enquiry.kind === "valuation" ? "landlord" : "buyer",
          displayName: enquiry.name,
          email: enquiry.email,
          phone: enquiry.phone,
          source: "website",
        })
        .returning();
      contactId = created.id;
      contactName = created.displayName;
    }

    const subject =
      enquiry.kind === "valuation"
        ? "Valuation request"
        : enquiry.kind === "viewing"
          ? "Viewing request"
          : "Website enquiry";

    const [lead] = await tx
      .insert(leads)
      .values({
        entityId,
        title: `${contactName} · ${subject}`,
        contactId,
        propertyId: enquiry.propertyId,
        assignedToId: options.assignedToId ?? null,
        source: "website",
        // The whole submission travels into the lead's notes. A triager who
        // opens the lead a week later should not have to go back to the inbox
        // to find out what was actually asked.
        notes:
          [
            enquiry.message,
            enquiry.preferredDate &&
              `Preferred: ${enquiry.preferredDate} ${enquiry.preferredSlot ?? ""}`.trim(),
            enquiry.areaSlug && `Area: ${enquiry.areaSlug}`,
          ]
            .filter(Boolean)
            .join("\n\n") || null,
      })
      .returning();

    const [updated] = await tx
      .update(webEnquiries)
      .set({
        status: "converted",
        entityId,
        convertedLeadId: lead.id,
        reviewedById: ctx.user.id,
        reviewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(webEnquiries.id, enquiryId))
      .returning();

    await writeAudit(tx, ctx, {
      action: "web.enquiry.convert",
      associatedType: "web_enquiry",
      associatedId: enquiryId,
      summary: `${ctx.user.name} converted a website enquiry from ${enquiry.name} into a lead`,
      entityId,
      before: enquiry,
      after: updated,
    });

    return { enquiry: updated, lead, contactId };
  });
}
