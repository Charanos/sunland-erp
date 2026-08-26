"use server";

import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { webSubscribers } from "@/db/schema/web";
import { isMailConfigured, sendMail } from "@/lib/mail/mailer";
import {
  type ActionResult,
  checkSubmissionShape,
  cleanEmail,
  cleanText,
  getIpHash,
  getSiteOrigin,
  isRateLimited,
} from "./shared";

/**
 * Newsletter and property-alert signup, with real double opt-in.
 *
 * The address is stored immediately but sits at `pending` until the visitor
 * clicks the link in the confirmation mail. That is what makes the list lawful
 * to send to, and it is the only thing stopping one person subscribing someone
 * else's address to a list they never asked for.
 *
 * ── What the visitor is told, and why it varies ──
 *
 * The form this replaces refused honestly rather than showing a success panel
 * for an address it filed nowhere. That instinct was right and is preserved:
 * the message returned here reflects what actually happened.
 *
 *   mail sent          -> "Check your inbox to confirm."
 *   SMTP not configured -> "You are on the list" + how to reach us
 *
 * The second case still stores the address, so nothing is lost when the mail
 * server is not wired up yet — but it never claims an email is coming when
 * none was dispatched.
 */

const CONFIRM_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const token = () => crypto.randomBytes(32).toString("base64url");

export async function subscribeToAlerts(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const shapeProblem = checkSubmissionShape(formData);
  if (shapeProblem) return { ok: false, message: shapeProblem };

  const email = cleanEmail(formData.get("email"));
  if (!email) {
    return {
      ok: false,
      message: "Check the highlighted field.",
      fieldErrors: { email: "That does not look like an email address." },
    };
  }

  const ipHash = await getIpHash();
  if (await isRateLimited(ipHash)) {
    return { ok: false, message: "Too many attempts just now. Try again in a few minutes." };
  }

  const source = cleanText(formData.get("source"), 64) ?? "footer";
  const confirmToken = token();
  const unsubscribeToken = token();
  const expiresAt = new Date(Date.now() + CONFIRM_TTL_MS);

  let status: "pending" | "confirmed" = "pending";
  let sendTo: string | null = email;
  let unsubToken = unsubscribeToken;
  let confToken = confirmToken;

  try {
    // Idempotent on the unique email index. Re-subscribing issues a fresh
    // confirmation token rather than erroring — a visitor who lost the first
    // mail should be able to ask for another by submitting again.
    const [row] = await db
      .insert(webSubscribers)
      .values({
        email,
        status: "pending",
        confirmToken,
        confirmTokenExpiresAt: expiresAt,
        unsubscribeToken,
        source,
        ipHash,
      })
      .onConflictDoUpdate({
        target: webSubscribers.email,
        set: {
          confirmToken,
          confirmTokenExpiresAt: expiresAt,
          updatedAt: new Date(),
        },
      })
      .returning({
        status: webSubscribers.status,
        confirmToken: webSubscribers.confirmToken,
        unsubscribeToken: webSubscribers.unsubscribeToken,
      });

    if (!row) throw new Error("upsert returned no row");

    status = row.status === "confirmed" ? "confirmed" : "pending";
    confToken = row.confirmToken ?? confirmToken;
    unsubToken = row.unsubscribeToken;

    // Already confirmed: say so and send nothing. Re-mailing a confirmed
    // subscriber every time they resubmit is how a list gets reported as spam.
    if (status === "confirmed") {
      return { ok: true, message: "You are already on the list." };
    }
  } catch (error) {
    console.error("[web/actions] subscribe failed", error);
    return {
      ok: false,
      message: "We could not save that just now. Please try again shortly.",
    };
  }

  if (!isMailConfigured()) {
    return {
      ok: true,
      message:
        "You are on the list. Alerts begin when the service launches — call 0703 100 875 if you would like them sooner.",
    };
  }

  const origin = await getSiteOrigin();
  const confirmUrl = `${origin}/api/web/subscribe/confirm?token=${encodeURIComponent(confToken)}`;
  const unsubscribeUrl = `${origin}/api/web/subscribe/unsubscribe?token=${encodeURIComponent(unsubToken)}`;

  const result = await sendMail({
    to: sendTo!,
    subject: "Confirm your Sunland property alerts",
    text: [
      "Someone — we hope you — asked for property alerts from Sunland Real Estates.",
      "",
      "Confirm that address and we will start sending them:",
      confirmUrl,
      "",
      "If this was not you, ignore this email. Nothing is sent until the link above is clicked.",
      "",
      `Unsubscribe at any time: ${unsubscribeUrl}`,
      "Sunland Real Estates · 0703 100 875",
    ].join("\n"),
    listUnsubscribeUrl: unsubscribeUrl,
  });

  if (!result.sent) {
    // The address is stored either way. Do not claim a mail is coming.
    return {
      ok: true,
      message:
        "You are on the list, but our confirmation email did not go out. Call 0703 100 875 and we will confirm you manually.",
    };
  }

  sendTo = null;
  return { ok: true, message: "Almost there — check your inbox for the confirmation link." };
}

/**
 * Confirm a pending subscription. Called by the emailed link.
 *
 * Returns a plain outcome rather than redirecting so the caller decides what
 * the visitor sees. An expired token is a distinct outcome from an unknown
 * one: the first deserves "ask for another", the second is either a typo or a
 * link someone tried to guess.
 */
export async function confirmSubscription(
  rawToken: string
): Promise<"confirmed" | "already" | "expired" | "unknown"> {
  const value = rawToken.trim();
  if (!value) return "unknown";

  try {
    const [row] = await db
      .select({
        id: webSubscribers.id,
        status: webSubscribers.status,
        expiresAt: webSubscribers.confirmTokenExpiresAt,
      })
      .from(webSubscribers)
      .where(eq(webSubscribers.confirmToken, value))
      .limit(1);

    if (!row) return "unknown";
    if (row.status === "confirmed") return "already";
    if (row.expiresAt && row.expiresAt.getTime() < Date.now()) return "expired";

    await db
      .update(webSubscribers)
      .set({
        status: "confirmed",
        confirmedAt: new Date(),
        // Burn the token. A confirmation link that keeps working is a link
        // that can re-confirm an address someone has since unsubscribed.
        confirmToken: null,
        confirmTokenExpiresAt: null,
        updatedAt: new Date(),
      })
      .where(eq(webSubscribers.id, row.id));

    return "confirmed";
  } catch (error) {
    console.error("[web/actions] confirm failed", error);
    return "unknown";
  }
}

/**
 * One-click unsubscribe. The token never expires, deliberately — an
 * unsubscribe link that has stopped working is worse than none, and is what
 * turns an unsubscribe into a spam report.
 */
export async function unsubscribe(rawToken: string): Promise<"done" | "unknown"> {
  const value = rawToken.trim();
  if (!value) return "unknown";

  try {
    const updated = await db
      .update(webSubscribers)
      .set({ status: "unsubscribed", unsubscribedAt: new Date(), updatedAt: new Date() })
      .where(eq(webSubscribers.unsubscribeToken, value))
      .returning({ id: webSubscribers.id });

    return updated.length > 0 ? "done" : "unknown";
  } catch (error) {
    console.error("[web/actions] unsubscribe failed", error);
    return "unknown";
  }
}
