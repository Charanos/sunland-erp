import { NextResponse } from "next/server";
import { handleRouteError } from "@/lib/authz/errors";
import {
  convertWebEnquiryToLead,
  setWebEnquiryStatus,
  type WebEnquiryStatus,
} from "@/lib/services/web-enquiries";
import { requireCallerContext } from "@/lib/services/types";

/**
 * Triage actions on one enquiry.
 *
 * Two distinct operations behind one PATCH, discriminated on `action`:
 *
 *   { action: "status", status: "triaged" | "spam" | "archived" }
 *   { action: "convert", assignedToId?: string }
 *
 * `converted` is deliberately not reachable through the status branch. That
 * state asserts a lead exists, and only the convert path can honestly make
 * that claim — the service enforces it too, this is just the front door.
 */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const ctx = await requireCallerContext(body.entityId ?? null, request);

    if (body.action === "convert") {
      const result = await convertWebEnquiryToLead(ctx, id, {
        entityId: body.entityId ?? undefined,
        assignedToId: body.assignedToId ?? null,
      });
      return NextResponse.json({ success: true, ...result });
    }

    const enquiry = await setWebEnquiryStatus(
      ctx,
      id,
      body.status as Exclude<WebEnquiryStatus, "converted">
    );
    return NextResponse.json({ success: true, enquiry });
  } catch (error) {
    return handleRouteError(error);
  }
}
