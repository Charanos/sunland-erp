import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { WEB_AREAS, type WebArea } from "../constants/locations.content";
import { WEB_ICON_STROKE, webIcons } from "../icons";
import { WebButtonLink } from "../primitives/button";
import { SectionBand } from "../primitives/section-band";
import { locationDefaults } from "./home.defaults";
import { SectionHeading } from "./section-heading";

export type LocationTile = {
  name: string;
  slug?: string;
  count?: number;
  imageUrl?: string;
  tagline?: string;
  guideValue?: string;
  guideLabel?: string;
  blurb?: string;
  region?: string;
};

/** Format benchmark price gracefully */
function formatBenchmarkPrice(guide?: string): string {
  if (!guide) return "";
  if (guide.toLowerCase().includes("request")) return "Price on Request";
  if (guide.startsWith("from ")) {
    const rest = guide.slice(5);
    return `From KES ${rest}`;
  }
  if (/^\d/.test(guide)) {
    return `KES ${guide}`;
  }
  return guide;
}

// Curated 8 bento areas with verified high-resolution photography and benchmark data
const BENTO_AREAS_SLUGS = [
  "kilimani",
  "lavington",
  "runda",
  "westlands",
  "riverside-drive",
  "kileleshwa",
  "parklands",
  "spring-valley",
];

/**
 * 06 home.locations, light band.
 *
 * Executive Bento Grid showcasing premier Nairobi hubs with high-resolution
 * local photography, benchmark rental & acquisition pricing, and active mandate telemetry.
 */
export function HomeLocations({ tiles = [] }: { tiles?: LocationTile[] }) {
  const ArrowIcon = webIcons.arrowOut;
  const PinIcon = webIcons.pin;

  // Build live counts map from incoming props (by slug or normalized name)
  const countsMap = new Map<string, number>();
  for (const t of tiles) {
    if (t.slug) countsMap.set(t.slug.toLowerCase(), t.count ?? 0);
    if (t.name) {
      countsMap.set(t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), t.count ?? 0);
      countsMap.set(t.name.toLowerCase(), t.count ?? 0);
    }
  }

  // Derive the 8 curated bento tiles from WEB_AREAS with fallback
  const bentoAreas: (WebArea & { liveCount: number })[] = BENTO_AREAS_SLUGS.map((slug) => {
    const area = WEB_AREAS.find((a) => a.slug === slug);
    if (!area) return null;
    const liveCount =
      countsMap.get(slug) ??
      countsMap.get(area.name.toLowerCase()) ??
      0;
    return {
      ...area,
      liveCount,
    };
  }).filter((a): a is WebArea & { liveCount: number } => a !== null);

  if (bentoAreas.length === 0) return null;

  return (
    <SectionBand tone="light" labelledBy="locations-heading" className="relative bg-white py-20 sm:py-24 lg:py-28">
      <SectionHeading
        id="locations-heading"
        eyebrow={locationDefaults.eyebrow}
        title={locationDefaults.headline}
        lead="Explore residential, commercial, and investment opportunities across Nairobi's most distinguished addresses."
        align="split-right"
        action={
          <WebButtonLink
            href={locationDefaults.viewAllHref}
            variant="outline"
            size="md"
            icon="arrow"
            iconTrailing
          >
            All 20 areas
          </WebButtonLink>
        }
      />

      {/* ── Production-Grade 8-Tile Bento Grid ── */}
      <ul
        data-reveal-group
        className="mt-12 grid auto-rows-[250px] sm:auto-rows-[270px] lg:auto-rows-[290px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {bentoAreas.map((tile, index) => {
          const isHero = index === 0; // Kilimani 2x2 Hero Showcase
          const isAnchor = index === 7; // Spring Valley 2x1 Panoramic Anchor
          const priceFormatted = formatBenchmarkPrice(tile.guideValue);

          return (
            <li
              key={tile.slug}
              className={cn(
                // Hero tile (Kilimani): 2x2 on tablet/desktop, 1-col on mobile
                isHero && "sm:col-span-2 sm:row-span-2",
                // Middle tiles: 1x1 standard cards
                !isHero && !isAnchor && "sm:col-span-1 sm:row-span-1",
                // Anchor tile (Spring Valley): 2x1 wide panoramic anchor
                isAnchor && "sm:col-span-2 sm:row-span-1"
              )}
            >
              <Link
                href={`/locations/${tile.slug}`}
                className="group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[26px] border border-slate-200/90 bg-brand-deep p-6 sm:p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-[0_24px_55px_rgba(9,13,31,0.3)] cursor-pointer"
              >
                {/* High-Resolution Area Photography */}
                {tile.imageUrl && (
                  <Image
                    src={tile.imageUrl}
                    alt={tile.name}
                    fill
                    sizes={
                      isHero || isAnchor
                        ? "(min-width: 1024px) 700px, 100vw"
                        : "(min-width: 1024px) 350px, 50vw"
                    }
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                )}

                {/* Multi-Stage Cinematic Scrims */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-deep via-brand-deep/60 via-45% to-black/25 transition-opacity duration-300 group-hover:via-brand-deep/50"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent"
                />

                {/* Top Action Row: Region Tag + Interactive Arrow Button */}
                <div className="relative z-10 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-md px-3.5 py-1 font-mono text-web-nano font-medium text-white border border-white/15 shadow-xs">
                    <PinIcon size={11} stroke={WEB_ICON_STROKE} className="text-brand-yellow" />
                    <span>{tile.region ?? "Nairobi"}</span>
                  </span>

                  <span className="flex size-8.5 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white transition-all duration-300 group-hover:bg-brand-yellow group-hover:text-ink-900 group-hover:scale-105 shadow-xs">
                    <ArrowIcon size={13} stroke={2} />
                  </span>
                </div>

                {/* Bottom Content Area */}
                <div className="relative z-10 mt-auto pt-4">
                  {isHero ? (
                    <>
                      <h3 className="font-editorial text-3xl sm:text-4xl lg:text-[44px] font-medium leading-[1.08] text-white tracking-tight transition-colors group-hover:text-brand-yellow">
                        {tile.name}
                      </h3>
                      {tile.blurb && (
                        <p className="mt-2 text-sm sm:text-base text-slate-200 font-normal max-w-[46ch] line-clamp-2">
                          {tile.blurb}
                        </p>
                      )}

                      {/* Benchmark Price Telemetry Bar */}
                      <div className="mt-5 flex flex-wrap items-baseline justify-between border-t border-white/20 pt-3.5 gap-2">
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono text-2xl sm:text-3xl font-medium tracking-tight text-white">
                            {priceFormatted}
                          </span>
                          {!tile.guideValue.includes("sqft") &&
                            !tile.guideValue.toLowerCase().includes("request") && (
                              <span className="text-sm font-normal text-slate-300 font-sans">
                                / month
                              </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-300 capitalize">
                            {tile.guideLabel}
                          </span>
                          {tile.liveCount > 0 && (
                            <span className="hidden sm:inline-flex items-center gap-1.5 text-emerald-300 text-xs font-mono font-medium pl-3 border-l border-white/20">
                              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              {tile.liveCount} Active Mandates
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  ) : isAnchor ? (
                    <>
                      <h3 className="font-editorial text-2xl sm:text-3xl font-medium leading-tight text-white transition-colors group-hover:text-brand-yellow">
                        {tile.name}
                      </h3>
                      {tile.tagline && (
                        <p className="mt-1 text-xs sm:text-sm text-slate-200 font-normal max-w-[50ch] line-clamp-1">
                          {tile.tagline}
                        </p>
                      )}

                      {/* Benchmark Price Telemetry Bar */}
                      <div className="mt-3.5 flex flex-wrap items-baseline justify-between border-t border-white/15 pt-2.5 gap-2">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-mono text-xl sm:text-2xl font-medium tracking-tight text-white">
                            {priceFormatted}
                          </span>
                          {!tile.guideValue.includes("sqft") &&
                            !tile.guideValue.toLowerCase().includes("request") && (
                              <span className="text-xs font-normal text-slate-300 font-sans">
                                / mo
                              </span>
                            )}
                        </div>
                        <span className="text-xs font-mono text-slate-300 capitalize">
                          {tile.guideLabel}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="font-editorial text-2xl font-medium leading-snug text-white transition-colors group-hover:text-brand-yellow">
                        {tile.name}
                      </h3>
                      {tile.tagline && (
                        <p className="mt-1 text-xs text-slate-300/90 font-normal line-clamp-1">
                          {tile.tagline}
                        </p>
                      )}

                      {/* Benchmark Price Telemetry */}
                      <div className="mt-3 flex items-baseline justify-between border-t border-white/15 pt-2">
                        <span className="font-mono text-sm sm:text-base font-medium text-white tracking-tight">
                          {priceFormatted}
                        </span>
                        <span className="text-web-micro font-mono text-slate-400 capitalize truncate ml-2">
                          {tile.guideLabel}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </SectionBand>
  );
}
