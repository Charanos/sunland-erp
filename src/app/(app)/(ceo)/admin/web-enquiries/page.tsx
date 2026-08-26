"use client";

import { useUIStore } from "@/store/ui";
import { WebEnquiriesBoard } from "@/components/sunland/web-enquiries-board";

export default function WebEnquiriesPage() {
  const { activeEntityId } = useUIStore();

  return <WebEnquiriesBoard entityId={activeEntityId} />;
}
