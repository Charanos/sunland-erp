import type { Metadata } from "next";
import { ListingIndex } from "@/components/web/properties/listing-index";

export const metadata: Metadata = {
  title: "Properties to let and for sale in Nairobi",
  description:
    "Apartments, villas, land and commercial space on our books today, with the price we will actually quote you.",
};

export const revalidate = 3600;

/**
 * The /properties route.
 *
 * Suspense architecture:
 *
 *   Previously this page wrapped the entire ListingIndex in a
 *   `<Suspense key={JSON.stringify(params)}>`, which caused the hero,
 *   FilterRail and all layout to re-suspend (flash to skeleton) on every
 *   filter change.
 *
 *   The boundary is now inside ListingIndexBody → only the results grid
 *   re-suspends. The hero stays visible, the FilterRail updates instantly
 *   (it reads the URL itself as a client component), and pagination
 *   navigates without a full-page flash.
 */
export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  return (
    <ListingIndex
      searchParams={params}
      basePath="/properties"
      crumbs={[{ label: "Home", href: "/" }, { label: "Properties" }]}
      title="Properties in Nairobi and beyond"
      lead="Apartments, villas, land and commercial space. Everything below is on our books today, with the price we will actually quote you."
    />
  );
}
