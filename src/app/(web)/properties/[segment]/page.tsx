import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findFacet } from "@/components/web/constants/listing-taxonomy";
import { ListingDetailView } from "@/components/web/properties/listing-detail";
import { ListingIndex } from "@/components/web/properties/listing-index";
import { getListingBySlug, getSimilarListings } from "@/lib/services/web/listings";

/**
 * The shared segment under `/properties`, resolved per ADR W3.
 *
 * `/properties/apartments` is a category facet. `/properties/two-bedroom-
 * kilimani-sl2411` is a listing. They occupy the same URL segment because the
 * alternative, `/properties/listing/{slug}`, adds a permanently dead segment
 * to the most important URL on the site.
 *
 * Resolution order is the whole safety mechanism, and it runs one way only:
 *
 *   1. Reserved segment? Render the facet. Always wins.
 *   2. Otherwise look the slug up as a listing.
 *   3. Neither? 404.
 *
 * Checking the reserved list first means a listing can never shadow a
 * category page even if a bad slug got past generation, which is the failure
 * that silently deletes a ranking page.
 */
export const revalidate = 3600;

type Params = { segment: string };
type SearchParams = Record<string, string | string[] | undefined>;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { segment } = await params;

  const facet = findFacet(segment);
  if (facet) {
    return { title: facet.title, description: facet.lead };
  }

  const listing = await getListingBySlug(segment);
  if (!listing) return { title: "Property not found" };

  return {
    title: `${listing.title} | ${listing.location}`,
    description:
      listing.description?.slice(0, 300) ??
      `${listing.title} in ${listing.location}, available through Sunland Real Estates.`,
  };
}

export default async function PropertySegmentPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { segment } = await params;

  // 1. Facets win, unconditionally.
  const facet = findFacet(segment);
  if (facet) {
    return (
      <ListingIndex
        facet={facet}
        searchParams={await searchParams}
        basePath={`/properties/${facet.segment}`}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Properties", href: "/properties" },
          { label: facet.label },
        ]}
        title={facet.title}
        lead={facet.lead}
      />
    );
  }

  // 2. Fall through to a listing.
  const listing = await getListingBySlug(segment);
  if (!listing) notFound();

  const similar = await getSimilarListings(listing);

  return <ListingDetailView listing={listing} similar={similar} />;
}
