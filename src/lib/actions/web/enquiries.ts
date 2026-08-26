"use server";

import { db } from "@/db";
import { webEnquiries } from "@/db/schema/web";
import {
  type ActionResult,
  checkSubmissionShape,
  cleanEmail,
  cleanPhone,
  cleanText,
  getIpHash,
  getSourcePath,
  getUserAgent,
  isRateLimited,
} from "./shared";

/**
 * The three enquiry forms: listing viewing requests, landlord valuations, and
 * the general contact form.
 *
 * All three write to `web_enquiries` rather than straight to `crm.leads`. The
 * reasoning is in the table's own doc comment; the short version is that the
 * sales pipeline is a working surface for real people and this repo has no
 * captcha, so anonymous input is staged and becomes a lead when someone
 * accepts it.
 *
 * Nothing here throws. A form submission that hits a database problem returns
 * a refusal the visitor can act on — with the phone number, which is the
 * channel this market converts on anyway — rather than a stack trace and a
 * lost enquiry.
 */

type EnquiryKind = "viewing" | "valuation" | "contact";

async function insertEnquiry(
  kind: EnquiryKind,
  formData: FormData,
  fields: {
    name: string;
    email: string | null;
    phone: string | null;
    message: string | null;
    propertyId?: string | null;
    areaSlug?: string | null;
    preferredDate?: string | null;
    preferredSlot?: string | null;
    metadata?: Record<string, unknown>;
  }
): Promise<ActionResult> {
  const shapeProblem = checkSubmissionShape(formData);
  if (shapeProblem) {
    // Deliberately shaped like a success from the bot's point of view: it gets
    // no signal about which check it failed. A real person cannot reach here.
    return { ok: false, message: shapeProblem };
  }

  const ipHash = await getIpHash();
  if (await isRateLimited(ipHash)) {
    return {
      ok: false,
      message:
        "That is a few enquiries in a short window. Give it a few minutes, or call 0703 100 875 and we will pick up.",
    };
  }

  try {
    const [row] = await db
      .insert(webEnquiries)
      .values({
        kind,
        name: fields.name,
        email: fields.email,
        phone: fields.phone,
        message: fields.message,
        propertyId: fields.propertyId ?? null,
        areaSlug: fields.areaSlug ?? null,
        preferredDate: fields.preferredDate ?? null,
        preferredSlot: fields.preferredSlot ?? null,
        metadata: fields.metadata ?? {},
        sourcePath: await getSourcePath(),
        ipHash,
        userAgent: await getUserAgent(),
      })
      .returning({ id: webEnquiries.id });

    if (!row) throw new Error("insert returned no row");
    return { ok: true };
  } catch (error) {
    console.error(`[web/actions] ${kind} enquiry failed`, error);
    return {
      ok: false,
      message:
        "We could not record that just now. Please call 0703 100 875 — we would rather take it by phone than lose it.",
    };
  }
}

/**
 * A viewing request or question about one listing.
 *
 * `propertyId` is optional even though the form always knows it: a listing can
 * be delisted between page render and submission, and the FK would reject the
 * row. Losing the property reference is recoverable — the message still names
 * it — but losing the enquiry is not.
 */
export async function submitViewingEnquiry(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const name = cleanText(formData.get("name"), 120);
  const email = cleanEmail(formData.get("email"));
  const phone = cleanPhone(formData.get("phone"));

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "Please tell us your name.";
  // One reply channel is enough. Demanding both loses enquiries from people
  // who will give a phone number but not an address, and vice versa.
  if (!email && !phone) {
    fieldErrors.phone = "Add a phone number or an email so we can reply.";
  }
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, message: "Check the highlighted fields.", fieldErrors };
  }

  const propertyId = cleanText(formData.get("propertyId"), 64);
  const isUuid =
    propertyId !== null &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(propertyId);

  return insertEnquiry("viewing", formData, {
    name: name!,
    email,
    phone,
    message: cleanText(formData.get("message"), 2000),
    propertyId: isUuid ? propertyId : null,
    preferredDate: cleanText(formData.get("preferredDate"), 64),
    preferredSlot: cleanText(formData.get("preferredSlot"), 64),
    metadata: {
      listingRef: cleanText(formData.get("listingRef"), 120),
      listingTitle: cleanText(formData.get("listingTitle"), 200),
    },
  });
}

/** "What is my property worth" — the landlord valuation form. */
export async function submitValuationEnquiry(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const name = cleanText(formData.get("name"), 120);
  const email = cleanEmail(formData.get("email"));
  const phone = cleanPhone(formData.get("phone"));

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "Please tell us your name.";
  if (!phone && !email) {
    fieldErrors.phone = "Add a phone number or an email so we can reply.";
  }
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, message: "Check the highlighted fields.", fieldErrors };
  }

  return insertEnquiry("valuation", formData, {
    name: name!,
    email,
    phone,
    message: cleanText(formData.get("message"), 2000),
    areaSlug: cleanText(formData.get("area"), 120),
    metadata: {
      propertyType: cleanText(formData.get("propertyType"), 64),
      units: cleanText(formData.get("units"), 32),
      currentRent: cleanText(formData.get("currentRent"), 64),
    },
  });
}

/** The /contact page's general form. */
export async function submitContactEnquiry(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const name = cleanText(formData.get("name"), 120);
  const email = cleanEmail(formData.get("email"));
  const phone = cleanPhone(formData.get("phone"));
  const message = cleanText(formData.get("message"), 2000);

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "Please tell us your name.";
  if (!email && !phone) {
    fieldErrors.email = "Add an email or a phone number so we can reply.";
  }
  if (!message) fieldErrors.message = "Tell us what you need, even briefly.";
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, message: "Check the highlighted fields.", fieldErrors };
  }

  return insertEnquiry("contact", formData, {
    name: name!,
    email,
    phone,
    message,
    metadata: {
      audience: cleanText(formData.get("audience"), 64),
      subject: cleanText(formData.get("subject"), 120),
    },
  });
}
