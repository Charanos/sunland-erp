import { type NextRequest, NextResponse } from "next/server";
import { confirmSubscription } from "@/lib/actions/web/subscribe";

/**
 * The target of the link in the double opt-in email.
 *
 * A GET, because it is reached by clicking a link in a mail client. That makes
 * it prefetchable — some clients and security scanners fetch every URL in a
 * message before the recipient sees it — which is exactly why the token is
 * single-use and burned on confirm rather than left live.
 *
 * Redirects to /insights with an outcome in the query string rather than
 * rendering its own page: the visitor came from an email and should land
 * somewhere that looks like the site, not on a bare confirmation screen.
 */
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const outcome = await confirmSubscription(token);

  const destination = new URL("/insights", request.nextUrl.origin);
  destination.searchParams.set("subscription", outcome);
  return NextResponse.redirect(destination);
}
