import {
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { entities, timestamps, users } from "@/db/schema/platform";
import { leads } from "@/db/schema/crm";
import { properties } from "@/db/schema/properties";

/**
 * Tables owned by the public marketing site.
 *
 * ── Why a staging table rather than writing straight to `leads` ──
 *
 * `crm.leads` is the sales team's live pipeline. Everything already in it was
 * put there by an authenticated person who had `crm.lead.write`. The public
 * forms have no such gate: there is no captcha and no rate limiting anywhere
 * in this repo, so the first crawler that finds the contact form would be
 * writing rows that a human then has to hand-clean out of the pipeline they
 * work from every day.
 *
 * So public submissions land here first. Nothing is discarded — the visitor's
 * message is a real, queryable row the moment they press send — but it becomes
 * a `contact` + `lead` only when someone in the ERP accepts it. `convertedLeadId`
 * records that decision so the trail from web form to pipeline stays intact.
 *
 * This is also the natural home for the abuse signals (`ipHash`, `userAgent`)
 * that have no business being columns on a CRM contact.
 */

export const webEnquiryKind = pgEnum("web_enquiry_kind", [
  // A viewing or general question about one listing — the enquiry rail.
  "viewing",
  // "What is my property worth" — the landlord valuation form.
  "valuation",
  // The /contact page's general form.
  "contact",
]);

export const webEnquiryStatus = pgEnum("web_enquiry_status", [
  "new",
  // Someone has looked at it but not yet decided.
  "triaged",
  // Accepted — `convertedLeadId` points at the lead it became.
  "converted",
  "spam",
  "archived",
]);

export const webEnquiries = pgTable(
  "web_enquiries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    // Nullable, unlike every internal table: an anonymous visitor does not
    // belong to an entity yet. Triage assigns one when it converts the row.
    entityId: uuid("entity_id").references(() => entities.id),
    kind: webEnquiryKind("kind").notNull(),
    status: webEnquiryStatus("status").default("new").notNull(),

    // What the visitor typed. Only `name` is structurally required — a phone
    // number or an email will do as the reply channel, and demanding both
    // loses enquiries from people who will only give one.
    name: text("name").notNull(),
    email: text("email"),
    phone: text("phone"),
    message: text("message"),

    // Context the form knew and the visitor should not have to retype.
    propertyId: uuid("property_id").references(() => properties.id),
    areaSlug: text("area_slug"),
    // Free text rather than a timestamp: the enquiry rail collects "Saturday
    // morning", not an instant, and rounding a preference to a UTC timestamp
    // invents precision the visitor did not give.
    preferredDate: text("preferred_date"),
    preferredSlot: text("preferred_slot"),
    // Which audience they picked on the contact form, which service line the
    // valuation came from — shape varies per `kind`, so it is not a column.
    metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),

    // Where they were standing when they submitted. Useful for attribution
    // and for spotting a form being hit from a path that does not render it.
    sourcePath: text("source_path"),

    // ── Abuse signals ──
    // Hashed, not raw. This is a marketing enquiry, not a security log; the
    // throttle only needs to know "same origin as five seconds ago", and a
    // raw IP is personal data with a retention obligation attached.
    ipHash: text("ip_hash"),
    userAgent: text("user_agent"),

    // ── Triage ──
    convertedLeadId: uuid("converted_lead_id").references(() => leads.id),
    reviewedById: uuid("reviewed_by_id").references(() => users.id),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => ({
    statusIdx: index("web_enquiries_status_idx").on(table.status),
    kindIdx: index("web_enquiries_kind_idx").on(table.kind),
    createdAtIdx: index("web_enquiries_created_at_idx").on(table.createdAt),
    // The throttle's read path: recent submissions from one origin.
    ipHashIdx: index("web_enquiries_ip_hash_idx").on(table.ipHash),
  })
);

/**
 * Newsletter and property-alert subscribers, with real double opt-in.
 *
 * An address sits at `pending` until the visitor clicks the link in the
 * confirmation email, which is what makes this list lawful to send to and
 * what stops one person subscribing someone else's address. Both tokens are
 * single-purpose and unguessable; `unsubscribeToken` never expires, because a
 * one-click unsubscribe that has stopped working is worse than none.
 */
export const webSubscriberStatus = pgEnum("web_subscriber_status", [
  "pending",
  "confirmed",
  "unsubscribed",
  // Set when the confirmation mail hard-bounces, so a bad address stops being
  // retried without losing the record that it was offered.
  "bounced",
]);

export const webSubscribers = pgTable(
  "web_subscribers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    status: webSubscriberStatus("status").default("pending").notNull(),

    confirmToken: text("confirm_token"),
    confirmTokenExpiresAt: timestamp("confirm_token_expires_at", { withTimezone: true }),
    confirmedAt: timestamp("confirmed_at", { withTimezone: true }),

    // No expiry, deliberately. See the note above.
    unsubscribeToken: text("unsubscribe_token").notNull(),
    unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true }),

    // Which form they came through, so the list can be segmented later.
    source: text("source"),
    ipHash: text("ip_hash"),
    ...timestamps,
  },
  (table) => ({
    // Case-folded at the application boundary before insert, so this unique
    // index is the real guarantee that one address appears once.
    emailIdx: uniqueIndex("web_subscribers_email_idx").on(table.email),
    statusIdx: index("web_subscribers_status_idx").on(table.status),
    confirmTokenIdx: index("web_subscribers_confirm_token_idx").on(table.confirmToken),
    unsubscribeTokenIdx: uniqueIndex("web_subscribers_unsubscribe_token_idx").on(
      table.unsubscribeToken
    ),
  })
);

/**
 * Listings a signed-in visitor has saved.
 *
 * The only public write path that requires a session, which is why it is the
 * only one that touches `users` directly rather than going through the
 * enquiry staging table — there is nothing to triage about a bookmark.
 */
export const userSavedListings = pgTable(
  "user_saved_listings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    propertyId: uuid("property_id")
      .references(() => properties.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    // Saving twice is the same as saving once. The unique index makes the
    // action idempotent at the database rather than in a read-then-write race.
    userPropertyIdx: uniqueIndex("user_saved_listings_user_property_idx").on(
      table.userId,
      table.propertyId
    ),
    userIdx: index("user_saved_listings_user_idx").on(table.userId),
  })
);
