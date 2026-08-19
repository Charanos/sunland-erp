import { HomeBudget } from "@/components/web/home/home-budget";
import { HomeCategories } from "@/components/web/home/home-categories";
import { HomeCta } from "@/components/web/home/home-cta";
import { HomeFaq } from "@/components/web/home/home-faq";
import { HomeFeatured } from "@/components/web/home/home-featured";
import { HomeHero } from "@/components/web/home/home-hero";
import { HomeInsights, type InsightPost } from "@/components/web/home/home-insights";
import { HomeLandlords } from "@/components/web/home/home-landlords";
import { HomeLocations } from "@/components/web/home/home-locations";
import { HomeProof } from "@/components/web/home/home-proof";
import { HomeServices } from "@/components/web/home/home-services";
import {
  categoryDefaults,
  featuredDefaults,
  heroDefaults,
  locationDefaults,
  type CategoryTile,
} from "@/components/web/home/home.defaults";
import type { ListingCardData } from "@/components/web/primitives/listing-card";
import type { WebStat } from "@/components/web/primitives/stat-block";
import {
  getAreasWithStock,
  getCategoryCounts,
  getFeaturedListings,
  getHomeAggregates,
} from "@/lib/services/web/home";

/**
 * The home page.
 *
 * Eleven bands, ordered for a first-time visitor who does not yet know
 * whether this is a listings site or an agency. The answer has to arrive in
 * the first screen: both, and the agency part is the differentiator.
 *
 * Dark, light, dark, tint, dark, light, tint, light, tint, light, dark is a
 * breathing pattern. The dark bands are the only places the site raises its
 * voice, and each is placed where a claim is being made: what we do, what
 * your money buys, how we run it, and what to do next.
 *
 * A server component. Only six islands ship JavaScript: the mobile drawer,
 * the hero search, the budget finder, the stat counters, the floating contact
 * control and the newsletter field. Everything else is markup.
 *
 * ── Data ──
 * Each band renders live ERP aggregates where they exist and the designed
 * defaults where they do not. The fallback is not a nicety: `.env.local` has
 * no DATABASE_URL in a fresh checkout, and a marketing page that 500s because
 * a count query failed is a worse outcome than one showing last week's
 * figures. Every service function here fails soft and logs.
 */

// The public site is served from cache, so a crawler on listings never
// competes with a Finance query. One hour is short enough that a publish
// shows up the same morning and long enough that the database is not in the
// request path for a visitor.
export const revalidate = 3600;

/**
 * Live category counts, keyed onto the designed tiles.
 *
 * The ERP's `propertyType` is free text ("Apartment", "Commercial",
 * "Residential"), which is exactly the problem `web_property_types` solves in
 * W1-10. Until that taxonomy exists this maps what the column actually
 * contains onto the four public categories rather than trusting the strings
 * to line up.
 */
const TYPE_TO_CATEGORY: Record<string, string> = {
  apartment: "Apartments",
  flat: "Apartments",
  residential: "Villas and houses",
  villa: "Villas and houses",
  house: "Villas and houses",
  maisonette: "Villas and houses",
  commercial: "Commercial",
  office: "Commercial",
  industrial: "Commercial",
  land: "Land and plots",
  plot: "Land and plots",
};

function resolveCategoryTiles(counts: { propertyType: string; count: number }[]): CategoryTile[] {
  if (counts.length === 0) return [...categoryDefaults.tiles];

  const live = new Map<string, number>();
  for (const row of counts) {
    const category = TYPE_TO_CATEGORY[row.propertyType.toLowerCase().trim()];
    if (!category) continue;
    live.set(category, (live.get(category) ?? 0) + row.count);
  }

  if (live.size === 0) return [...categoryDefaults.tiles];

  // A category with no live stock is dropped by HomeCategories, never shown
  // at zero, so a count of 0 here is a real instruction rather than a gap.
  return categoryDefaults.tiles.map((tile) => ({
    ...tile,
    count: live.get(tile.label) ?? 0,
  }));
}

export default async function HomePage() {
  const [aggregates, categoryCounts, liveListings, liveAreas] = await Promise.all([
    getHomeAggregates(),
    getCategoryCounts(),
    getFeaturedListings(6),
    getAreasWithStock(8),
  ]);

  // Doc 04 §1.1: if the stats query fails the strip hides entirely rather
  // than rendering zeros. The designed figures stand in only when the query
  // succeeded but the aggregate is genuinely a fresh install.
  const stats: WebStat[] | null = aggregates
    ? [
        { value: aggregates.totalListings, label: "Properties listed" },
        { value: aggregates.areasCovered, label: "Areas covered" },
        { value: aggregates.propertyTypes, label: "Property types" },
        { value: 2, label: "Live portals" },
      ]
    : [...heroDefaults.stats];

  // The band hides below three cards. Falling back to the designed six when
  // the ERP holds fewer keeps the page whole while the catalogue migration
  // (W1-9) is still outstanding.
  const listings: ListingCardData[] =
    liveListings.length >= 3 ? liveListings : [...featuredDefaults.listings];

  const searchAreas =
    liveAreas.length > 0
      ? liveAreas.map((area) => area.name)
      : locationDefaults.tiles.map((tile) => tile.name);

  const locationTiles = [...locationDefaults.tiles];

  // Insights hides below three published posts, which is its state until
  // W5-11. When it is absent the proof and FAQ bands become neighbours, and
  // two white grounds touching is exactly what the tint exists to prevent.
  const insightPosts: InsightPost[] = [];
  const showInsights = insightPosts.length >= 3;

  return (
    <>
      <HomeHero stats={stats} areas={searchAreas} />
      <HomeCategories tiles={resolveCategoryTiles(categoryCounts)} />
      <HomeBudget />
      <HomeFeatured listings={listings} />
      <HomeLandlords />
      <HomeLocations tiles={locationTiles} />
      <HomeServices />
      <HomeProof />
      {/* Renders nothing until three posts exist. At launch this band is
          absent by design, and the sequence reads correctly without it. */}
      <HomeInsights posts={insightPosts} />
      <HomeFaq tone={showInsights ? "light" : "tint"} />
      <HomeCta />
    </>
  );
}
