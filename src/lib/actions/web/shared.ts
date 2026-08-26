import crypto from "node:crypto";
import { and, eq, gte, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { webEnquiries } from "@/db/schema/web";
import { FORM_TIMESTAMP_FIELD, HONEYPOT_FIELD } from "./form-fields";

/**
 * Shared plumbing for the public site's write paths.
 *
 * ── Why this lives outside `src/lib/services/web/*` ──
 *
 * That directory is the public site's *read* boundary and carries an ESLint
 * rule forbidding it from importing the internal service layer, because the
 * internal services return landlord contacts, mandate fee rates and internal
 * valuations. Writes need different things — the `db` client, schema tables,
 * session lookup — so they get their own module rather than punching a hole in
 * a boundary that exists for a good reason.
 */

/** What every public action returns. Discriminated so the UI cannot forget a case. */
export type ActionResult<T = undefined> =
  | { ok: true; data?: T; message?: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

/**
 * How long a form must have been on screen before a submission is believable.
 *
 * A human cannot read a viewing-request form, type a name and a phone number,
 * and submit in under three seconds. A script can do it in fifty milliseconds.
 * The form stamps its render time in a hidden field and this checks the delta.
 */
const MIN_FILL_MS = 3_000;

// Re-exported so server-side callers have one import, while the client forms
// take them from ./form-fields directly — this module cannot be imported from
// a client component, since it pulls in next/headers and the db client.
export { FORM_TIMESTAMP_FIELD, HONEYPOT_FIELD };

/** Per-origin submission ceiling, counted against the staging table itself. */
const THROTTLE_WINDOW_MS = 10 * 60 * 1000;
const THROTTLE_MAX = 5;

/**
 * A stable, non-reversible token for "same origin as a moment ago".
 *
 * Salted with a server secret so the hashes cannot be rainbow-tabled back to
 * addresses, and truncated because we need equality, not cryptographic
 * strength. This is a marketing enquiry table, not a security log: storing raw
 * IPs would make it personal data with a retention obligation attached, for no
 * gain over this.
 */
export async function getIpHash(): Promise<string | null> {
  const headerList = await headers();
  // x-forwarded-for is a client-settable header. It is trustworthy only
  // because a proxy in front of this app overwrites it; behind no proxy the
  // throttle degrades to "shared bucket", which is still better than nothing
  // and is never used for authorisation.
  const forwarded = headerList.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || headerList.get("x-real-ip")?.trim();
  if (!ip) return null;

  const salt = process.env.WEB_IP_SALT ?? "sunland-web";
  return crypto.createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

export async function getUserAgent(): Promise<string | null> {
  const headerList = await headers();
  return headerList.get("user-agent")?.slice(0, 500) ?? null;
}

/**
 * Cheap structural checks that run before anything touches the database.
 *
 * Returns a refusal message, or null when the submission looks human. The
 * message is deliberately vague — telling a bot which check it failed is
 * telling it how to pass next time — but it is never shown to a real person,
 * because a real person cannot trip these.
 */
export function checkSubmissionShape(formData: FormData): string | null {
  const honeypot = formData.get(HONEYPOT_FIELD);
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return "This submission could not be accepted.";
  }

  const renderedAt = Number(formData.get(FORM_TIMESTAMP_FIELD));
  if (Number.isFinite(renderedAt) && renderedAt > 0) {
    const elapsed = Date.now() - renderedAt;
    // Only the too-fast case is rejected. A form left open for an hour is a
    // person who got distracted, not an attack.
    if (elapsed < MIN_FILL_MS) return "This submission could not be accepted.";
  }

  return null;
}

/**
 * Per-origin rate limit, counted against rows already in the staging table.
 *
 * No in-memory counter: this app runs on serverless functions where memory is
 * per-instance and resets constantly, so an in-process map would be a limit
 * that quietly does not apply. The table is the shared state that already
 * exists, and `web_enquiries_ip_hash_idx` is there to make this read cheap.
 */
export async function isRateLimited(ipHash: string | null): Promise<boolean> {
  if (!ipHash) return false;

  try {
    const since = new Date(Date.now() - THROTTLE_WINDOW_MS);
    const [row] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(webEnquiries)
      .where(and(eq(webEnquiries.ipHash, ipHash), gte(webEnquiries.createdAt, since)));

    return (row?.count ?? 0) >= THROTTLE_MAX;
  } catch (error) {
    // If the throttle read fails the database is already in trouble. Refusing
    // every submission would turn a degraded database into a site that cannot
    // be contacted at all, so this fails open and the insert below will
    // surface the real error.
    console.error("[web/actions] throttle check failed", error);
    return false;
  }
}

/** Trim, collapse whitespace, and cap length. Returns null for empty input. */
export function cleanText(value: FormDataEntryValue | null, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.replace(/\s+/g, " ").trim().slice(0, maxLength);
  return trimmed === "" ? null : trimmed;
}

/** Lower-cased and trimmed, so the unique index on `web_subscribers` means what it says. */
export function cleanEmail(value: FormDataEntryValue | null): string | null {
  const text = cleanText(value, 254);
  if (!text) return null;
  const lowered = text.toLowerCase();
  // Deliberately permissive. Strict address validation rejects real addresses
  // (apostrophes, plus tags, new TLDs) far more often than it catches typos,
  // and the confirmation mail is the real proof an address works.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lowered) ? lowered : null;
}

/** Keeps digits, spaces and the few punctuation marks phone numbers use. */
export function cleanPhone(value: FormDataEntryValue | null): string | null {
  const text = cleanText(value, 32);
  if (!text) return null;
  const stripped = text.replace(/[^\d+()\-\s]/g, "").trim();
  // Kenyan mobile numbers are 10 digits locally, 12 in E.164. Anything under
  // 7 digits is not a phone number in any format.
  return stripped.replace(/\D/g, "").length >= 7 ? stripped : null;
}

/** The path the visitor was on, for attribution. Never trusted for routing. */
export async function getSourcePath(): Promise<string | null> {
  const headerList = await headers();
  const referer = headerList.get("referer");
  if (!referer) return null;
  try {
    return new URL(referer).pathname.slice(0, 255);
  } catch {
    return null;
  }
}

/** Absolute site origin, for links that must survive leaving the browser. */
export async function getSiteOrigin(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (configured) return configured;

  const headerList = await headers();
  const host = headerList.get("host");
  const proto = headerList.get("x-forwarded-proto") ?? "https";
  return host ? `${proto}://${host}` : "https://sunland.co.ke";
}
