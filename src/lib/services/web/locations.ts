import { and, ilike, ne, sql } from "drizzle-orm";
import { db } from "@/db";
import { properties } from "@/db/schema/properties";
import { WEB_AREAS } from "@/components/web/constants/locations.content";

/**
 * Location hubs.
 *
 * These pages answer "what is Kilimani like, and what does it cost", which is
 * the query type that earns organic traffic and AI citations. A filter URL
 * answers "show me stock" and cannot rank for it, which is why the two are
 * separate templates rather than one with a different heading.
 *
 * The price context is computed from live listings and always states its
 * basis and its sample size. Web doc 04 §7 forbids hardcoded figures here for
 * a reason: a static price table is wrong within a quarter, and being
 * confidently wrong about rents is worse for trust than saying nothing.
 */

/**
 * The area taxonomy lives with the rest of the page content, so the hub, the
 * detail pages and the sitemap all read one list. Re-exported here because
 * every consumer of this service also needs it, and importing content from a
 * service module is the wrong direction.
 *
 * TODO(W1-2): move to `web_locations` with coordinates and a parent
 * hierarchy, so a parent area can aggregate child inventory.
 */
export { WEB_AREAS as WEB_LOCATIONS, findArea as findLocation } from "@/components/web/constants/locations.content";
export type { WebArea as WebLocation } from "@/components/web/constants/locations.content";

export type LocationPriceRow = {
  bedrooms: number;
  label: string;
  typicalRent: number | null;
  available: number;
};

export type LocationStats = {
  total: number;
  minRent: number | null;
  priceRows: LocationPriceRow[];
};

/**
 * Live price context for one area.
 *
 * Returns nulls rather than zeros where there is no evidence: a row reading
 * "3 bedrooms, KES 0" is worse than a row reading "no data". The caller drops
 * empty rows entirely, and the page states how many properties the figures
 * are based on.
 */
export async function getLocationStats(name: string): Promise<LocationStats> {
  const empty: LocationStats = { total: 0, minRent: null, priceRows: [] };

  try {
    const rows = await db
      .select({
        bedrooms: properties.bedrooms,
        // Median would be more honest than mean on a small sample, but a
        // sample this small is better described by its own size, which the
        // caveat line states.
        typicalRent: sql<number | null>`round(avg(${properties.monthlyRentKes}))::int`,
        available: sql<number>`count(*)::int`,
      })
      .from(properties)
      .where(
        and(
          ne(properties.status, "off_market"),
          ilike(properties.location, `%${name}%`),
          sql`${properties.monthlyRentKes} is not null`
        )
      )
      .groupBy(properties.bedrooms);

    const [totals] = await db
      .select({
        total: sql<number>`count(*)::int`,
        minRent: sql<number | null>`min(${properties.monthlyRentKes})::int`,
      })
      .from(properties)
      .where(and(ne(properties.status, "off_market"), ilike(properties.location, `%${name}%`)));

    const priceRows = rows
      .filter((row) => row.bedrooms !== null && row.bedrooms > 0)
      .map((row) => ({
        bedrooms: row.bedrooms as number,
        label:
          (row.bedrooms as number) >= 4
            ? "4 bedrooms and above"
            : `${row.bedrooms} bedroom${(row.bedrooms as number) > 1 ? "s" : ""}`,
        typicalRent: row.typicalRent,
        available: row.available,
      }))
      .sort((a, b) => a.bedrooms - b.bedrooms);

    return {
      total: totals?.total ?? 0,
      minRent: totals?.minRent ?? null,
      priceRows,
    };
  } catch (error) {
    console.error("[web/locations] stats failed", error);
    return empty;
  }
}

/**
 * The string to match a property's free-text `location` against.
 *
 * Names like "Nyali, Mombasa" and "Iten, Elgeyo Marakwet" carry their county
 * for the reader's benefit, but no property row stores the pair, so matching
 * on the full name silently returns zero. Only the leading segment is the
 * place name.
 */
export function areaMatchTerm(name: string): string {
  return name.split(",")[0].trim();
}

/** Live counts per area, for the hub tiles and the home page. */
export async function getLocationCounts(): Promise<Record<string, number>> {
  try {
    const rows = await db
      .select({ location: properties.location, count: sql<number>`count(*)::int` })
      .from(properties)
      .where(ne(properties.status, "off_market"))
      .groupBy(properties.location);

    const counts: Record<string, number> = {};
    for (const location of WEB_AREAS) {
      counts[location.slug] = rows
        .filter((row) =>
          row.location.toLowerCase().includes(areaMatchTerm(location.name).toLowerCase())
        )
        .reduce((sum, row) => sum + row.count, 0);
    }
    return counts;
  } catch (error) {
    console.error("[web/locations] counts failed", error);
    return {};
  }
}
