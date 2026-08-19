import type { Metadata } from "next";
import { Suspense } from "react";
import { ListingIndex } from "@/components/web/properties/listing-index";
import { ListingIndexSkeleton } from "@/components/web/properties/listing-index-skeleton";

export const metadata: Metadata = {
  title: "Properties to let and for sale in Nairobi",
  description:
    "Apartments, villas, land and commercial space on our books today, with the price we will actually quote you.",
};

export const revalidate = 3600;

/**
 * The listing index.
 *
 * The Suspense boundary is here rather than in a `loading.tsx`, because a
 * route-level loading file at `/properties` also wraps `/properties/[segment]`,
 * and a wrapped segment flushes its shell with a 200 before resolving, which
 * turns a missing listing into a soft 404. Placing the boundary explicitly
 * keeps the skeleton on the page that needs it and leaves the segment route
 * free to return a real 404.
 */
export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  return (
    <Suspense
      // Re-suspends when the filters change, so the skeleton reappears rather
      // than the previous result set sitting there looking current.
      key={JSON.stringify(params)}
      fallback={<ListingIndexSkeleton />}
    >
      <ListingIndex
        searchParams={params}
        basePath="/properties"
        crumbs={[{ label: "Home", href: "/" }, { label: "Properties" }]}
        title="Properties in Nairobi and beyond"
        lead="Apartments, villas, land and commercial space. Everything below is on our books today, with the price we will actually quote you."
      />
    </Suspense>
  );
}
