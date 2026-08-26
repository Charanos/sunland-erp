import { NextResponse } from "next/server";
import { handleRouteError } from "@/lib/authz/errors";
import {
  getWebEnquiryCounts,
  listWebEnquiries,
  type WebEnquiryKind,
  type WebEnquiryStatus,
} from "@/lib/services/web-enquiries";
import { requireCallerContext } from "@/lib/services/types";

/**
 * The public site's enquiry inbox.
 *
 * Read-only here; state changes go to /api/web-enquiries/[id], because a PATCH
 * on a collection is a route that has to guess what it is addressing.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const entityId = searchParams.get("entityId") ?? null;
    const ctx = await requireCallerContext(entityId, request);

    // "open" is not a status in the enum — it is the default working set of
    // new + triaged, which is what a queue should show.
    const status = (searchParams.get("status") as WebEnquiryStatus | "open" | null) ?? "open";
    const kind = (searchParams.get("kind") as WebEnquiryKind | null) ?? undefined;
    const search = searchParams.get("search") ?? undefined;

    const [enquiries, counts] = await Promise.all([
      listWebEnquiries(ctx, { status, kind, search }),
      getWebEnquiryCounts(ctx),
    ]);

    return NextResponse.json({ enquiries, counts });
  } catch (error) {
    return handleRouteError(error);
  }
}
