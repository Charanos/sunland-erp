import { formatKES } from "@/lib/utils/format";
import { SITE } from "./site";

/**
 * Pre-filled WhatsApp messages for the site's conversion points.
 *
 * ── Why these are curated per context ──
 *
 * Every WhatsApp CTA on the site used to open with some variant of "Hello
 * Sunland, I would like to view X (Ref Y)" — or, on the general CTAs, with
 * nothing at all. An empty thread puts the work of explaining back on the
 * visitor at the exact moment they decided to act, and the agent who picks it
 * up has to ask which property before they can help.
 *
 * A message that already carries the reference, the location and the asking
 * price means the first reply can be an answer rather than a question. That is
 * the whole conversion argument: fewer round trips between "interested" and
 * "booked".
 *
 * ── Tone ──
 *
 * First person, because the visitor is the one sending it — a template written
 * in the company's voice reads as a bot the moment it lands. Warm but not
 * chatty, and no emoji: this is a property worth millions of shillings and the
 * message should sound like someone who means it.
 *
 * ── Formatting ──
 *
 * WhatsApp renders `*text*` as bold, which is why the property name is wrapped
 * that way — it makes the thread scannable for an agent working several
 * conversations at once. Line breaks survive `encodeURIComponent`; anything
 * more elaborate does not, so the shape stays deliberately plain.
 */

/** Everything a listing CTA can know. All optional but `title`. */
export type ListingMessageContext = {
  title: string;
  reference?: string | null;
  location?: string | null;
  priceKes?: number | null;
  /** " / mo" for rentals — appended to the price so a rent does not read as a sale. */
  priceSuffix?: string | null;
  propertyType?: string | null;
  bedrooms?: number | null;
  /** Free text, e.g. "Saturday" — the visitor's words, not a parsed date. */
  preferredDate?: string | null;
  preferredSlot?: string | null;
  /** In-person or a live video walkthrough. */
  tourType?: "in_person" | "video" | null;
};

const SIGN_OFF = "Could you let me know the next step?";

/** The property block that every listing message shares. */
function listingBlock(context: ListingMessageContext): string {
  const lines = [`*${context.title}*`];

  // Reference and location on one line: an agent scanning a thread reads them
  // together, and two short lines waste more space than they earn.
  const identity = [context.reference ? `Ref ${context.reference}` : null, context.location]
    .filter(Boolean)
    .join(" · ");
  if (identity) lines.push(identity);

  if (typeof context.priceKes === "number" && context.priceKes > 0) {
    lines.push(`${formatKES(context.priceKes)}${context.priceSuffix ?? ""}`);
  }

  return lines.join("\n");
}

/**
 * "I want to see this one."
 *
 * The highest-intent message on the site, so it carries the most context —
 * including the visitor's preferred time when the enquiry rail collected one,
 * which is the difference between booking a viewing in one reply and three.
 */
export function viewingMessage(context: ListingMessageContext): string {
  const parts = ["Hello Sunland, I would like to arrange a viewing.", listingBlock(context)];

  const when = [context.preferredDate, context.preferredSlot].filter(Boolean).join(", ");
  if (when) {
    // The timing gets its own line rather than being folded into the sentence.
    // The date is the visitor's own words — "Tomorrow", "Sat 14 Jun" — so
    // inlining it produces either a capital mid-sentence or a comma pile-up.
    const how =
      context.tourType === "video"
        ? "a live video tour"
        : context.tourType === "in_person"
          ? "an in-person viewing"
          : "a viewing";
    parts.push([`I would prefer ${how}.`, `Preferred time: ${when}`].join("\n"));
    parts.push("Does that suit you?");
  } else {
    parts.push("When would be convenient?");
  }

  return parts.join("\n\n");
}

/** "Tell me more about this one" — a question, not yet a booking. */
export function listingEnquiryMessage(context: ListingMessageContext): string {
  return [
    "Hello Sunland, I am interested in this property and had a few questions.",
    listingBlock(context),
    SIGN_OFF,
  ].join("\n\n");
}

/** From an area page: no specific listing yet, but a clear brief. */
export function areaMessage(areaName: string, intent?: string): string {
  const opening = intent
    ? `Hello Sunland, I am looking for ${intent} in ${areaName}.`
    : `Hello Sunland, I am looking for a property in ${areaName}.`;
  return [opening, "Could you tell me what is available at the moment?"].join("\n\n");
}

/** The landlord side: an owner asking what their property is worth. */
export function valuationMessage(area?: string | null, propertyType?: string | null): string {
  const what = [propertyType, area ? `in ${area}` : null].filter(Boolean).join(" ");
  return [
    what
      ? `Hello Sunland, I would like a valuation for my ${what}.`
      : "Hello Sunland, I would like a valuation for my property.",
    "What would you need from me to get started?",
  ].join("\n\n");
}

/** Landlord management enquiry — the other half of the owner journey. */
export function managementMessage(): string {
  return [
    "Hello Sunland, I have a property I am considering putting under management.",
    "Could you talk me through how your service works and what it would cost?",
  ].join("\n\n");
}

/** A named service line, from the services pages. */
export function serviceMessage(serviceName: string): string {
  return [`Hello Sunland, I would like to talk to someone about ${serviceName}.`, SIGN_OFF].join(
    "\n\n"
  );
}

/** The general fallback — footer, floating button, contact page. */
export function generalMessage(): string {
  return "Hello Sunland, I would like to speak to someone about a property.";
}

/**
 * Turn a message into a wa.me link.
 *
 * Kept as the single place that knows the URL shape, so a change of number or
 * of query parameter is one edit rather than eleven.
 */
export function whatsappLink(message?: string): string {
  if (!message) return SITE.whatsappHref;
  return `${SITE.whatsappHref}?text=${encodeURIComponent(message)}`;
}
