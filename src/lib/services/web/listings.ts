import { and, asc, desc, eq, gte, ilike, inArray, lte, ne, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { properties } from "@/db/schema/properties";
import { toListingStatus } from "@/components/web/constants/listing-status";
import { generateListingSlug, type SortValue } from "@/components/web/constants/listing-taxonomy";
import type { ListingCardData } from "@/components/web/primitives/listing-card";

/**
 * The public listing catalogue.
 *
 * Same boundary rules as `home.ts`: explicit select lists, no import path to
 * internal services (enforced by ESLint), read only, and every function fails
 * soft so a marketing page renders when the database does not answer.
 *
 * Two things here are load-bearing beyond that:
 *
 * 1. **Filters are allowlisted, not sanitised.** A client-supplied sort or
 *    filter key that is not recognised is dropped before the query is built,
 *    never interpolated and cleaned afterwards. Everything else is a bound
 *    parameter through Drizzle.
 *
 * 2. **Unavailable stock stays visible.** Let and sold listings remain
 *    queryable and indexed, rendered desaturated by the card. Hiding them
 *    would delete the price context that earns the location pages their
 *    organic traffic, and a visitor comparing areas needs to see what
 *    actually went, not only what is left.
 */

export type ListingFilters = {
  /** "for-rent" | "for-sale", from a facet segment or a query parameter. */
  status?: "for-rent" | "for-sale";
  /** Facet segment: apartments | villas | commercial | land. */
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  /** "1" | "2" | "3" | "4+" */
  bedrooms?: string[];
  sort?: SortValue;
  page?: number;
  pageSize?: number;
};

export type ListingResults = {
  listings: ListingCardData[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const EMPTY_RESULTS: ListingResults = {
  listings: [],
  total: 0,
  page: 1,
  pageSize: 9,
  totalPages: 0,
};

/**
 * Facet segment to the free-text values the ERP's `propertyType` column
 * actually holds.
 *
 * This mapping exists because `properties.propertyType` is free text, which
 * is precisely the problem `web_property_types` solves in W1-10. Until that
 * taxonomy lands, matching on a controlled list of known values beats
 * matching on whatever an operator typed.
 */
const CATEGORY_TO_TYPES: Record<string, string[]> = {
  apartments: ["apartment", "flat", "studio"],
  villas: ["residential", "villa", "house", "maisonette", "townhouse", "bungalow"],
  commercial: ["commercial", "office", "retail", "industrial", "warehouse", "godown"],
  land: ["land", "plot"],
};

function buildConditions(filters: ListingFilters): SQL[] {
  const conditions: SQL[] = [];

  // Off-market is an internal state and never reaches the public site.
  const notOffMarket = ne(properties.status, "off_market");
  conditions.push(notOffMarket);

  if (filters.status === "for-rent") {
    conditions.push(sql`lower(${properties.listingType}) not like '%sale%'`);
  } else if (filters.status === "for-sale") {
    conditions.push(sql`lower(${properties.listingType}) like '%sale%'`);
  }

  if (filters.category) {
    const types = CATEGORY_TO_TYPES[filters.category];
    // An unknown category yields no condition rather than an empty result set:
    // the route resolver has already rejected segments that are not facets, so
    // reaching here with one would be a bug, not a visitor action.
    if (types && types.length > 0) {
      const typeMatch = or(...types.map((type) => ilike(properties.propertyType, type)));
      if (typeMatch) conditions.push(typeMatch);
    }
  }

  if (filters.location) {
    conditions.push(ilike(properties.location, `%${filters.location}%`));
  }

  // Price filters apply to whichever column carries the price for this
  // listing type, so "under 150,000" means rent on a rental and asking price
  // on a sale rather than silently comparing the two.
  const priceColumn =
    filters.status === "for-sale" ? properties.askingPriceKes : properties.monthlyRentKes;

  if (typeof filters.minPrice === "number" && Number.isFinite(filters.minPrice)) {
    conditions.push(gte(priceColumn, String(filters.minPrice)));
  }
  if (typeof filters.maxPrice === "number" && Number.isFinite(filters.maxPrice)) {
    conditions.push(lte(priceColumn, String(filters.maxPrice)));
  }

  if (filters.bedrooms && filters.bedrooms.length > 0) {
    const exact = filters.bedrooms
      .filter((value) => value !== "4+")
      .map(Number)
      .filter(Number.isFinite);
    const wantsFourPlus = filters.bedrooms.includes("4+");

    const bedroomClauses: SQL[] = [];
    if (exact.length > 0) bedroomClauses.push(inArray(properties.bedrooms, exact));
    if (wantsFourPlus) bedroomClauses.push(gte(properties.bedrooms, 4));

    const combined = bedroomClauses.length === 1 ? bedroomClauses[0] : or(...bedroomClauses);
    if (combined) conditions.push(combined);
  }

  return conditions;
}

function orderFor(sort: SortValue) {
  switch (sort) {
    case "price-asc":
      // Nulls last: "price on request" belongs at the end of a cheapest-first
      // list, not at the top pretending to be free.
      return [
        sql`coalesce(${properties.monthlyRentKes}, ${properties.askingPriceKes}) asc nulls last`,
      ];
    case "price-desc":
      return [
        sql`coalesce(${properties.monthlyRentKes}, ${properties.askingPriceKes}) desc nulls last`,
      ];
    case "bedrooms":
      return [desc(properties.bedrooms), asc(properties.name)];
    default:
      return [desc(properties.isFeatured), desc(properties.createdAt)];
  }
}

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

/** The explicit public projection. Every field below was chosen. */
const listingColumns = {
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
};

/**
 * Derived from the table type rather than from `listingColumns`, so
 * nullability is inherited exactly: a hand-written mapped type over the
 * column objects silently drops `| null` and then every price looks
 * non-nullable to the compiler, which is the one thing this file must get
 * right.
 */
type ListingRow = Pick<typeof properties.$inferSelect, keyof typeof listingColumns>;

function toCardData(row: ListingRow): ListingCardData {
  const isRental = !row.listingType.toLowerCase().includes("sale");
  const rent = row.monthlyRentKes ? Number(row.monthlyRentKes) : null;
  const asking = row.askingPriceKes ? Number(row.askingPriceKes) : null;
  const price = isRental ? rent : asking;
  const primary = row.media?.find((item) => item.isPrimary) ?? row.media?.[0] ?? null;

  return {
    id: row.id,
    slug: generateListingSlug(row.name, row.propertyCode),
    title: row.name,
    location: row.location,
    status: toListingStatus(row.status, row.listingType),
    isFeatured: row.isFeatured,
    // Null, never 0. A zero here renders as a currency string and becomes the
    // KShKShKSh defect in a new font.
    priceKes: price && price > 0 ? price : null,
    priceSuffix: isRental && price ? "/ mo" : null,
    imageUrl: primary?.url ?? null,
    imageAlt: primary?.alt ?? null,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    area: formatArea(row.sizeSqft, row.landAreaSqft),
    parkingSpaces: row.parkingSpaces,
  };
}

export async function getListings(filters: ListingFilters = {}): Promise<ListingResults> {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(48, Math.max(1, filters.pageSize ?? 9));

  try {
    const conditions = buildConditions(filters);
    const where = conditions.length > 1 ? and(...conditions) : conditions[0];

    const [rows, [countRow]] = await Promise.all([
      db
        .select(listingColumns)
        .from(properties)
        .where(where)
        .orderBy(...orderFor(filters.sort ?? "newest"))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      db.select({ total: sql<number>`count(*)::int` }).from(properties).where(where),
    ]);

    const total = countRow?.total ?? 0;

    return {
      listings: rows.map(toCardData),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (error) {
    console.error("[web/listings] query failed", error);
    return { ...EMPTY_RESULTS, page, pageSize };
  }
}

/** Facet counts for the filter rail. A zero is a real answer here. */
export async function getFacetCounts(): Promise<Record<string, number>> {
  try {
    const rows = await db
      .select({ propertyType: properties.propertyType, count: sql<number>`count(*)::int` })
      .from(properties)
      .where(ne(properties.status, "off_market"))
      .groupBy(properties.propertyType);

    const counts: Record<string, number> = {
      apartments: 0,
      villas: 0,
      commercial: 0,
      land: 0,
    };

    for (const row of rows) {
      const type = row.propertyType.toLowerCase().trim();
      for (const [segment, types] of Object.entries(CATEGORY_TO_TYPES)) {
        if (types.includes(type)) counts[segment] += row.count;
      }
    }

    return counts;
  } catch (error) {
    console.error("[web/listings] facet counts failed", error);
    return {};
  }
}

export type ListingDetail = ListingCardData & {
  description: string | null;
  propertyType: string;
  reference: string;
  images: { url: string; alt: string }[];
  amenities: string[];
  yearBuilt: number | null;
};

/**
 * A single listing by slug.
 *
 * The slug is derived rather than stored until W1-1 adds
 * `listing_publications`, so resolution loads the candidate set and matches in
 * memory. That is acceptable at 39 listings and is explicitly not acceptable
 * at 3,900, which is why the publication table carries a real indexed slug
 * column.
 */
export async function getListingBySlug(slug: string): Promise<ListingDetail | null> {
  try {
    const rows = await db
      .select({
        ...listingColumns,
        description: properties.description,
        amenities: properties.amenities,
        yearBuilt: properties.yearBuilt,
      })
      .from(properties)
      .where(ne(properties.status, "off_market"));

    const match = rows.find((row) => generateListingSlug(row.name, row.propertyCode) === slug);
    if (!match) return null;

    const card = toCardData(match);

    return {
      ...card,
      description: match.description,
      propertyType: match.propertyType,
      reference: match.propertyCode,
      // Alt text is required before an image can be a listing hero. Where the
      // record has none we synthesise a descriptive default rather than ship
      // an empty alt, which a screen reader announces as the file name.
      images: (match.media ?? [])
        .filter((item) => Boolean(item.url))
        .map((item, index, all) => ({
          url: item.url,
          alt: item.alt || `${match.name}, photo ${index + 1} of ${all.length}`,
        })),
      amenities: match.amenities ?? [],
      yearBuilt: match.yearBuilt,
    };
  } catch (error) {
    console.error("[web/listings] detail lookup failed", error);
    return null;
  }
}

/** Similar listings for the detail page. Never includes the current one. */
export async function getSimilarListings(
  listing: Pick<ListingDetail, "id" | "location" | "propertyType">,
  limit = 3
): Promise<ListingCardData[]> {
  try {
    const rows = await db
      .select(listingColumns)
      .from(properties)
      .where(
        and(
          ne(properties.status, "off_market"),
          ne(properties.id, listing.id),
          or(
            ilike(properties.location, `%${listing.location.split(",")[0].trim()}%`),
            eq(properties.propertyType, listing.propertyType)
          )
        )
      )
      .orderBy(desc(properties.isFeatured), desc(properties.createdAt))
      .limit(limit);

    return rows.map(toCardData);
  } catch (error) {
    console.error("[web/listings] similar lookup failed", error);
    return [];
  }
}
