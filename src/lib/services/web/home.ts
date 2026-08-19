import { and, desc, eq, isNotNull, ne, sql } from "drizzle-orm";
import { db } from "@/db";
import { properties } from "@/db/schema/properties";
import type { ListingCardData } from "@/components/web/primitives/listing-card";
import { toListingStatus } from "@/components/web/constants/listing-status";

/**
 * Public read model for the home page.
 *
 * THE BOUNDARY. Everything under `src/lib/services/web/` is the security
 * perimeter of the public site, and it holds by construction rather than by
 * review:
 *
 * 1. Explicit select lists only. Never `select()` a whole row and delete keys
 *    afterwards, because the next column someone adds to `properties` is then
 *    public by default. Every field below was chosen.
 * 2. No import path to internal services. Enforced by a `no-restricted-imports`
 *    rule in eslint.config.mjs, so a mistake fails the build rather than
 *    getting caught in review, or not.
 * 3. Read only. Anonymous writes arrive in W4 and run through the `system:web`
 *    principal with the same `authorize` and `writeAudit` treatment as any
 *    internal mutation.
 *
 * Fields deliberately excluded: `entityId`, `ownerContactId`, `unitBreakdown`,
 * and every timestamp. A landlord's identity and the internal entity structure
 * are not public facts.
 *
 * Every function fails soft. A marketing page must render when the database is
 * unreachable: the visitor gets the designed defaults instead of a 500, and
 * the failure surfaces in logs rather than in the shop window.
 */

/**
 * Until `listing_publications` exists (W1-1), a listing has no stored slug.
 * Deriving one here keeps every card link stable and readable, and the
 * property code guarantees uniqueness without a database round trip.
 *
 * TODO(W1-1): replace with `listing_publications.slug`, generated once and
 * checked against RESERVED_LISTING_SEGMENTS per ADR W3, so a listing can
 * never shadow /properties/apartments.
 */
function deriveSlug(name: string, propertyCode: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${base}-${propertyCode.toLowerCase()}`;
}

/** Area is pre-formatted here because land is in acres and offices in sqft. */
function formatArea(sizeSqft: number | null, landAreaSqft: number | null): string | null {
  if (sizeSqft && sizeSqft > 0) return `${sizeSqft.toLocaleString("en-KE")} sqft`;
  if (landAreaSqft && landAreaSqft > 0) {
    const acres = landAreaSqft / 43_560;
    return acres >= 0.25
      ? `${acres.toFixed(2).replace(/\.?0+$/, "")} acre`
      : `${landAreaSqft.toLocaleString("en-KE")} sqft`;
  }
  return null;
}

export type CategoryCount = { propertyType: string; count: number };

/**
 * Live count of published listings per category.
 *
 * A category with zero live listings is dropped by the caller, never rendered
 * as "0 Properties". The old site advertises the absence of its own stock.
 */
export async function getCategoryCounts(): Promise<CategoryCount[]> {
  try {
    const rows = await db
      .select({
        propertyType: properties.propertyType,
        count: sql<number>`count(*)::int`,
      })
      .from(properties)
      .where(ne(properties.status, "off_market"))
      .groupBy(properties.propertyType);

    return rows.filter((row) => row.count > 0);
  } catch (error) {
    console.error("[web/home] category counts unavailable", error);
    return [];
  }
}

/**
 * Featured listings for the home page.
 *
 * `isFeatured` first, then newest, exactly as web doc 04 §1.3 specifies. The
 * caller decides whether the result is enough to render the band: below three
 * cards the section hides rather than looking short of stock.
 */
export async function getFeaturedListings(limit = 6): Promise<ListingCardData[]> {
  try {
    const rows = await db
      .select({
        id: properties.id,
        name: properties.name,
        propertyCode: properties.propertyCode,
        propertyType: properties.propertyType,
        listingType: properties.listingType,
        status: properties.status,
        location: properties.location,
        askingPriceKes: properties.askingPriceKes,
        monthlyRentKes: properties.monthlyRentKes,
        bedrooms: properties.bedrooms,
        bathrooms: properties.bathrooms,
        sizeSqft: properties.sizeSqft,
        landAreaSqft: properties.landAreaSqft,
        parkingSpaces: properties.parkingSpaces,
        media: properties.media,
        isFeatured: properties.isFeatured,
      })
      .from(properties)
      .where(ne(properties.status, "off_market"))
      .orderBy(desc(properties.isFeatured), desc(properties.createdAt))
      .limit(limit);

    return rows.map((row) => {
      const isRental = !row.listingType.toLowerCase().includes("sale");
      const rent = row.monthlyRentKes ? Number(row.monthlyRentKes) : null;
      const asking = row.askingPriceKes ? Number(row.askingPriceKes) : null;
      const price = isRental ? rent : asking;
      const primary = row.media?.find((item) => item.isPrimary) ?? row.media?.[0] ?? null;

      return {
        id: row.id,
        slug: deriveSlug(row.name, row.propertyCode),
        title: row.name,
        location: row.location,
        status: toListingStatus(row.status, row.listingType),
        isFeatured: row.isFeatured,
        // Explicitly null rather than 0 when a price is absent, so the card
        // renders "Price on request" instead of a currency placeholder. This
        // is the KShKShKSh defect, fixed at the source rather than the view.
        priceKes: price && price > 0 ? price : null,
        priceSuffix: isRental && price ? "/ mo" : null,
        imageUrl: primary?.url ?? null,
        imageAlt: primary?.alt ?? null,
        bedrooms: row.bedrooms,
        bathrooms: row.bathrooms,
        area: formatArea(row.sizeSqft, row.landAreaSqft),
        parkingSpaces: row.parkingSpaces,
      } satisfies ListingCardData;
    });
  } catch (error) {
    console.error("[web/home] featured listings unavailable", error);
    return [];
  }
}

export type HomeAggregates = {
  totalListings: number;
  areasCovered: number;
  propertyTypes: number;
};

/**
 * The hero trust strip.
 *
 * Live aggregates, never hardcoded marketing numbers. Returns null on any
 * failure so the caller hides the strip entirely: doc 04 §1.1 is explicit
 * that a failed stats query hides rather than rendering zeros, and "0
 * properties listed" is a worse claim than no claim.
 */
export async function getHomeAggregates(): Promise<HomeAggregates | null> {
  try {
    const [row] = await db
      .select({
        totalListings: sql<number>`count(*)::int`,
        areasCovered: sql<number>`count(distinct ${properties.location})::int`,
        propertyTypes: sql<number>`count(distinct ${properties.propertyType})::int`,
      })
      .from(properties)
      .where(and(ne(properties.status, "off_market"), isNotNull(properties.location)));

    if (!row || row.totalListings === 0) return null;
    return row;
  } catch (error) {
    console.error("[web/home] aggregates unavailable", error);
    return null;
  }
}

/** Distinct areas with live stock, for the areas band and the search combobox. */
export async function getAreasWithStock(limit = 8): Promise<{ name: string; count: number }[]> {
  try {
    const rows = await db
      .select({
        name: properties.location,
        count: sql<number>`count(*)::int`,
      })
      .from(properties)
      .where(and(ne(properties.status, "off_market"), eq(properties.listingType, "let")))
      .groupBy(properties.location)
      .orderBy(desc(sql`count(*)`))
      .limit(limit);

    return rows;
  } catch (error) {
    console.error("[web/home] areas unavailable", error);
    return [];
  }
}
