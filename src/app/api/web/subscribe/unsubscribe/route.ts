import { type NextRequest, NextResponse } from "next/server";
import { unsubscribe } from "@/lib/actions/web/subscribe";

/**
 * One-click unsubscribe.
 *
 * Handles both GET (the link a person clicks) and POST (RFC 8058, which Gmail
 * and Yahoo call directly when the recipient uses the mail client's own
 * unsubscribe button). Supporting only the GET would mean those buttons appear
 * to work and do nothing, which is how a sender ends up reported as spam.
 *
 * The token never expires, deliberately — see the note on the schema.
 */
export const dynamic = "force-dynamic";

async function run(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  return unsubscribe(token);
}

export async function GET(request: NextRequest) {
  const outcome = await run(request);
  const destination = new URL("/", request.nextUrl.origin);
  destination.searchParams.set("subscription", outcome === "done" ? "unsubscribed" : "unknown");
  return NextResponse.redirect(destination);
}

export async function POST(request: NextRequest) {
  const outcome = await run(request);
  // RFC 8058 expects a 2xx with no body. The mail client shows its own
  // confirmation; a redirect here would be followed and discarded.
  return new NextResponse(null, { status: outcome === "done" ? 200 : 404 });
}
