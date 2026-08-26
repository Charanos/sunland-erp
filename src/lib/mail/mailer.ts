import nodemailer, { type Transporter } from "nodemailer";

/**
 * Outbound mail for the public site.
 *
 * Only the double opt-in flow needs this today: a confirmation link the
 * subscriber has to click, and the unsubscribe link carried in every send.
 * That is what makes the list lawful to mail and what stops one person
 * signing up someone else's address.
 *
 * ── Degrading honestly when SMTP is not configured ──
 *
 * There is no mail server in local development and none in CI. Rather than
 * throw and take a form submission down with it, `sendMail` reports whether it
 * actually sent. Callers use that to decide what to tell the visitor, so a
 * missing SMTP config produces "we have your address, confirmation is coming"
 * rather than a false "check your inbox" for a mail that was never dispatched.
 *
 * The transport is created once and memoised. Nodemailer pools connections
 * internally; building a transport per send would open a TCP connection per
 * form submission.
 */

export type MailResult =
  | { sent: true; messageId: string }
  | { sent: false; reason: "not-configured" | "send-failed"; error?: string };

type MailInput = {
  to: string;
  subject: string;
  /** Plain-text body. Always required — never send HTML alone. */
  text: string;
  html?: string;
  /**
   * RFC 8058 one-click unsubscribe. Gmail and Yahoo require this on bulk mail,
   * and it is the difference between an unsubscribe and a spam report.
   */
  listUnsubscribeUrl?: string;
};

let cached: Transporter | null = null;
let cachedKey = "";

function readConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASSWORD?.trim();
  const from = process.env.MAIL_FROM?.trim();

  if (!host || !user || !pass || !from) return null;

  const port = Number(process.env.SMTP_PORT ?? 587);
  return {
    host,
    // 465 is implicit TLS; 587 negotiates STARTTLS after connecting. Deriving
    // this from the port rather than a separate flag removes the combination
    // that silently sends credentials in the clear.
    port,
    secure: port === 465,
    auth: { user, pass },
    from,
  };
}

function getTransport() {
  const config = readConfig();
  if (!config) return null;

  const key = `${config.host}:${config.port}:${config.auth.user}`;
  if (cached && cachedKey === key) return { transport: cached, from: config.from };

  cached = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth,
    pool: true,
    maxConnections: 3,
  });
  cachedKey = key;
  return { transport: cached, from: config.from };
}

/** True when SMTP is configured well enough to attempt a send. */
export function isMailConfigured() {
  return readConfig() !== null;
}

export async function sendMail(input: MailInput): Promise<MailResult> {
  const resolved = getTransport();
  if (!resolved) return { sent: false, reason: "not-configured" };

  try {
    const info = await resolved.transport.sendMail({
      from: resolved.from,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
      headers: input.listUnsubscribeUrl
        ? {
            "List-Unsubscribe": `<${input.listUnsubscribeUrl}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          }
        : undefined,
    });
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    // Never rethrow into a form submission. A mail server being down is not a
    // reason to lose the address the visitor just gave us.
    console.error("[mail] send failed", error);
    return {
      sent: false,
      reason: "send-failed",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
