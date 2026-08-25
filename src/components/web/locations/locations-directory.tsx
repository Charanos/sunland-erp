"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { type AreaGroup, type WebArea } from "@/components/web/constants/locations.content";
import { WEB_ICON_STROKE, webIcons } from "@/components/web/icons";
import { Container } from "@/components/web/primitives/container";
import { AreaOccupancyPieCharts } from "@/components/web/locations/area-occupancy-pie-charts";
import { cn } from "@/lib/utils/cn";

interface LocationsDirectoryProps {
  areas: WebArea[];
  counts: Record<string, number>;
}

// 8 Curated slugs for the Masterpiece Bento Grid
const BENTO_SLUGS = [
  "kilimani",
  "lavington",
  "runda",
  "westlands",
  "riverside-drive",
  "tatu-city",
  "parklands",
  "spring-valley",
];

function formatBenchmarkPrice(guideValue: string) {
  if (guideValue.toLowerCase().includes("request")) {
    return "POA · On Request";
  }
  if (guideValue.startsWith("from ")) {
    return `KES ${guideValue.replace("from ", "From ")}`;
  }
  if (guideValue.includes("sqft")) {
    return `KES ${guideValue}`;
  }
  return `KES ${guideValue}`;
}

export function LocationsDirectory({ areas, counts }: LocationsDirectoryProps) {
  const [selectedGroup, setSelectedGroup] = useState<AreaGroup | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const ArrowOutIcon = webIcons.arrowOut;
  const ArrowRightIcon = webIcons.arrow;
  const PinIcon = webIcons.pin;
  const SearchIcon = webIcons.search;
  const CloseIcon = webIcons.close;

  // Filtered areas based on active category & search query
  const filteredAreas = useMemo(() => {
    return areas.filter((area) => {
      const matchesGroup = selectedGroup === "all" || area.group === selectedGroup;
      const matchesSearch =
        searchQuery.trim() === "" ||
        area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        area.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (area.tagline && area.tagline.toLowerCase().includes(searchQuery.toLowerCase())) ||
        area.blurb.toLowerCase().includes(searchQuery.toLowerCase()) ||
        area.guideLabel.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesGroup && matchesSearch;
    });
  }, [areas, selectedGroup, searchQuery]);

  const groupCounts = useMemo(() => {
    return {
      all: areas.length,
      prime: areas.filter((a) => a.group === "prime").length,
      commercial: areas.filter((a) => a.group === "commercial").length,
      satellite: areas.filter((a) => a.group === "satellite").length,
    };
  }, [areas]);

  const totalLiveProperties = useMemo(() => {
    return Object.values(counts).reduce((sum, count) => sum + count, 0);
  }, [counts]);

  // Dynamic Asset Breakdown derived from loaded submarkets
  const dynamicAssetMix = useMemo(() => {
    const total = areas.length;
    if (total === 0) return undefined;
    const primeCount = areas.filter((a) => a.group === "prime").length;
    const commercialCount = areas.filter((a) => a.group === "commercial").length;
    const satelliteCount = areas.filter((a) => a.group === "satellite").length;

    return [
      {
        name: "Prime Residential",
        value: Math.round((primeCount / total) * 100),
        count: primeCount,
        color: "#151936",
      },
      {
        name: "Commercial & Office",
        value: Math.round((commercialCount / total) * 100),
        count: commercialCount,
        color: "#2563eb",
      },
      {
        name: "Satellite & Coast",
        value: Math.round((satelliteCount / total) * 100),
        count: satelliteCount,
        color: "#0d9488",
      },
    ];
  }, [areas]);

  // When on "All Hubs" with no search query, split into Bento Anchors + Remaining 3-in-a-row cards
  const isDefaultAllView = selectedGroup === "all" && searchQuery.trim() === "";

  const bentoAreas = useMemo(() => {
    if (!isDefaultAllView) return [];
    return BENTO_SLUGS.map((slug) => areas.find((a) => a.slug === slug)).filter(
      Boolean
    ) as WebArea[];
  }, [areas, isDefaultAllView]);

  const openCardAreas = useMemo(() => {
    if (isDefaultAllView) {
      return areas.filter((a) => !BENTO_SLUGS.includes(a.slug));
    }
    return filteredAreas;
  }, [areas, filteredAreas, isDefaultAllView]);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-surface-0 border-t border-line">
      <Container>
        {/* ── Submarket Portfolio & Occupancy Pie Charts ── */}
        <div className="mb-14 sm:mb-16">
          <AreaOccupancyPieCharts
            totalAreas={areas.length}
            totalListings={totalLiveProperties}
            customAssetMix={dynamicAssetMix}
          />
        </div>

        {/* Filter & Telemetry Control Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-8 sm:pb-10 border-b border-line">
          {/* Segmented Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedGroup("all")}
              className={cn(
                "cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-[11.5px] uppercase tracking-wider transition-all duration-200",
                selectedGroup === "all"
                  ? "bg-[#151936] text-white font-medium shadow-sm"
                  : "border border-line bg-surface-0 text-ink-600 hover:text-ink-900 hover:bg-surface-1 hover:border-ink-400"
              )}
            >
              <span>All Hubs</span>
              <span
                className={cn(
                  "size-4.5 rounded-full flex items-center justify-center text-[10px]",
                  selectedGroup === "all" ? "bg-white/20 text-white" : "bg-surface-2 text-ink-500"
                )}
              >
                {groupCounts.all}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedGroup("prime")}
              className={cn(
                "cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-[11.5px] uppercase tracking-wider transition-all duration-200",
                selectedGroup === "prime"
                  ? "bg-[#151936] text-white font-medium shadow-sm"
                  : "border border-line bg-surface-0 text-ink-600 hover:text-ink-900 hover:bg-surface-1 hover:border-ink-400"
              )}
            >
              <span>Prime Residential</span>
              <span
                className={cn(
                  "size-4.5 rounded-full flex items-center justify-center text-[10px]",
                  selectedGroup === "prime" ? "bg-white/20 text-white" : "bg-surface-2 text-ink-500"
                )}
              >
                {groupCounts.prime}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedGroup("commercial")}
              className={cn(
                "cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-[11.5px] uppercase tracking-wider transition-all duration-200",
                selectedGroup === "commercial"
                  ? "bg-[#151936] text-white font-medium shadow-sm"
                  : "border border-line bg-surface-0 text-ink-600 hover:text-ink-900 hover:bg-surface-1 hover:border-ink-400"
              )}
            >
              <span>Commercial & Mixed</span>
              <span
                className={cn(
                  "size-4.5 rounded-full flex items-center justify-center text-[10px]",
                  selectedGroup === "commercial" ? "bg-white/20 text-white" : "bg-surface-2 text-ink-500"
                )}
              >
                {groupCounts.commercial}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedGroup("satellite")}
              className={cn(
                "cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-[11.5px] uppercase tracking-wider transition-all duration-200",
                selectedGroup === "satellite"
                  ? "bg-[#151936] text-white font-medium shadow-sm"
                  : "border border-line bg-surface-0 text-ink-600 hover:text-ink-900 hover:bg-surface-1 hover:border-ink-400"
              )}
            >
              <span>Satellite & Coast</span>
              <span
                className={cn(
                  "size-4.5 rounded-full flex items-center justify-center text-[10px]",
                  selectedGroup === "satellite" ? "bg-white/20 text-white" : "bg-surface-2 text-ink-500"
                )}
              >
                {groupCounts.satellite}
              </span>
            </button>
          </div>

          {/* Search + Telemetry Counter */}
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline font-mono text-[11.5px] text-ink-400">
              Showing <strong className="text-ink-900 font-medium">{filteredAreas.length}</strong> of{" "}
              {areas.length} verified submarkets
            </span>

            <div className="relative w-full sm:w-64">
              <SearchIcon
                size={14}
                stroke={WEB_ICON_STROKE}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter locations..."
                className="w-full h-9.5 pl-9 pr-8 rounded-full border border-line bg-surface-1 text-[13px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-ink-900 focus:bg-surface-0 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-900 p-0.5"
                >
                  <CloseIcon size={12} stroke={WEB_ICON_STROKE} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── 01. The Curated 8-Hub Luxury Masterpiece Bento Grid ── */}
        {isDefaultAllView && bentoAreas.length > 0 && (
          <div className="pt-8 sm:pt-10">
            <div className="flex items-center justify-between pb-5 border-b border-line-soft mb-6">
              <div className="flex items-center gap-2.5">
                <span aria-hidden="true" className="h-px w-6 bg-brand-yellow" />
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500 font-medium">
                  Premier Submarket Anchors
                </p>
              </div>
              {/* Derived: the label tracked a literal 8 while the grid renders
                  whatever bentoAreas holds. */}
              <span className="font-mono text-xs text-slate-400">
                {bentoAreas.length} Curated Hubs
              </span>
            </div>

            <ul
              data-reveal-group
              className="grid auto-rows-[250px] sm:auto-rows-[270px] lg:auto-rows-[290px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {bentoAreas.map((tile, index) => {
                const isHero = index === 0; // Kilimani 2x2
                const isAnchor = index === 7; // Spring Valley 2x1 panoramic anchor
                const liveCount = counts[tile.slug] ?? 0;

                return (
                  <li
                    key={tile.slug}
                    className={cn(
                      isHero && "sm:col-span-2 sm:row-span-2",
                      !isHero && !isAnchor && "sm:col-span-1 sm:row-span-1",
                      isAnchor && "sm:col-span-2 sm:row-span-1"
                    )}
                  >
                    <Link
                      href={`/locations/${tile.slug}`}
                      className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[26px] border border-white/10 bg-slate-950 p-6 sm:p-7 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_22px_50px_rgba(9,13,31,0.35)]"
                    >
                      {/* Background Photography */}
                      {tile.imageUrl && (
                        <Image
                          src={tile.imageUrl}
                          alt={tile.name}
                          fill
                          sizes={
                            isHero
                              ? "(min-width: 1024px) 700px, 100vw"
                              : isAnchor
                              ? "(min-width: 1024px) 700px, 100vw"
                              : "(min-width: 1024px) 350px, 50vw"
                          }
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      )}

                      {/* Multi-stage Luxury Scrims */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#090d1f] via-[#090d1f]/60 via-45% to-black/20 transition-opacity duration-300 group-hover:via-[#090d1f]/50"
                      />
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent"
                      />

                      {/* Top Action Row: Minimal Region Tag + Sleek Arrow Action */}
                      <div className="relative z-10 flex items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-black/45 backdrop-blur-md px-3.5 py-1 font-mono text-[10.5px] font-medium text-white border border-white/10 shadow-xs">
                          <PinIcon size={11} stroke={WEB_ICON_STROKE} className="text-brand-yellow" />
                          <span>{tile.region}</span>
                        </span>

                        <span className="flex size-8.5 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white transition-all duration-300 group-hover:bg-brand-yellow group-hover:text-[#151936] group-hover:scale-105 shadow-xs">
                          <ArrowOutIcon size={13} stroke={2} />
                        </span>
                      </div>

                      {/* Bottom Content Row */}
                      <div className="relative z-10 mt-auto pt-4">
                        {isHero ? (
                          <>
                            <h3 className="font-editorial text-3xl sm:text-4xl lg:text-[44px] font-medium leading-[1.08] text-white tracking-tight transition-colors group-hover:text-brand-yellow">
                              {tile.name}
                            </h3>
                            {tile.tagline && (
                              <p className="mt-2 text-sm sm:text-base text-slate-200 font-normal max-w-[46ch] line-clamp-2">
                                {tile.blurb}
                              </p>
                            )}

                            {/* Refined Seamless Price Telemetry */}
                            <div className="mt-5 flex items-baseline justify-between border-t border-white/20 pt-3.5">
                              <div className="flex items-baseline gap-2">
                                <span className="font-mono text-2xl sm:text-3xl font-medium tracking-tight text-white">
                                  {formatBenchmarkPrice(tile.guideValue)}
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
                                {liveCount > 0 && (
                                  <span className="hidden sm:inline-flex items-center gap-1.5 text-emerald-300 text-xs font-mono font-medium pl-3 border-l border-white/20">
                                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    {liveCount} Active Mandates
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

                            {/* Refined Seamless Price Telemetry */}
                            <div className="mt-3.5 flex items-baseline justify-between border-t border-white/15 pt-2.5">
                              <div className="flex items-baseline gap-1.5">
                                <span className="font-mono text-xl sm:text-2xl font-medium tracking-tight text-white">
                                  {formatBenchmarkPrice(tile.guideValue)}
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
                              <p className="mt-0.5 text-xs text-slate-300/90 font-normal line-clamp-1">
                                {tile.tagline}
                              </p>
                            )}

                            {/* Refined Seamless Price Telemetry */}
                            <div className="mt-3.5 flex items-baseline justify-between border-t border-white/15 pt-2.5">
                              <div className="flex items-baseline gap-1">
                                <span className="font-mono text-base sm:text-[17px] font-medium tracking-tight text-white">
                                  {formatBenchmarkPrice(tile.guideValue)}
                                </span>
                                {!tile.guideValue.includes("sqft") &&
                                  !tile.guideValue.toLowerCase().includes("request") && (
                                    <span className="text-[11px] font-normal text-slate-400 font-sans">
                                      /mo
                                    </span>
                                  )}
                              </div>
                              <span className="text-[11px] font-mono text-slate-400/90 capitalize truncate max-w-[120px] text-right">
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
          </div>
        )}

        {/* ── 02. The Open Cards Like Properties (Three in a Row) ── */}
        {openCardAreas.length > 0 && (
          <div className={cn(isDefaultAllView ? "mt-16 pt-12 border-t border-line" : "pt-8 sm:pt-10")}>
            {isDefaultAllView && (
              <div className="flex items-center justify-between pb-6 border-b border-line-soft mb-8">
                <div className="flex items-center gap-2.5">
                  <span aria-hidden="true" className="h-px w-6 bg-brand-yellow" />
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-slate-500 font-medium">
                    Regional, Commercial & Emerging Submarkets
                  </p>
                </div>
                <span className="font-mono text-xs text-slate-400">
                  {openCardAreas.length} Verified Areas
                </span>
              </div>
            )}

            {/* Three in a Row Open Property-Style Cards */}
            <div
              data-reveal-group
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10"
            >
              {openCardAreas.map((area) => {
                const liveCount = counts[area.slug] ?? 0;

                return (
                  <article
                    key={area.slug}
                    className="group relative flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1"
                  >
                    {/* Media Frame (Clean 16:10 Rounded Photo with Badges) */}
                    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-900 shadow-2xs transition-shadow duration-300 group-hover:shadow-md">
                      {area.imageUrl ? (
                        <Image
                          src={area.imageUrl}
                          alt={`${area.name} submarket`}
                          fill
                          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#151936] to-[#090d1f]" />
                      )}

                      {/* Subtle Top Scrim for Badges */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-transparent"
                      />

                      {/* Top Badges: Region + Live Listings (if available) */}
                      <div className="absolute inset-x-3.5 top-3.5 z-10 flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 border border-white/15 px-3 py-1 font-mono text-[10.5px] font-medium text-white backdrop-blur-md shadow-xs">
                          <PinIcon size={11} stroke={WEB_ICON_STROKE} className="text-brand-yellow" />
                          <span>{area.region}</span>
                        </span>

                        {liveCount > 0 && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 border border-emerald-500/30 px-3 py-1 font-mono text-[10.5px] font-medium text-emerald-300 backdrop-blur-md shadow-xs">
                            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            {liveCount} Listed
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Open Content Below Photo (On Crisp White Canvas) */}
                    <div className="flex flex-1 flex-col justify-between pt-4.5 pb-1">
                      <div>
                        <h3 className="font-editorial text-[22px] sm:text-[24px] font-normal leading-[1.2] text-[#151936] transition-colors group-hover:text-blue-950">
                          <Link href={`/locations/${area.slug}`} className="after:absolute after:inset-0">
                            {area.name}
                          </Link>
                        </h3>

                        {/* Location & Tagline */}
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 font-normal">
                          <PinIcon
                            size={12}
                            stroke={WEB_ICON_STROKE}
                            aria-hidden="true"
                            className="shrink-0 text-slate-400"
                          />
                          <span>
                            {area.region}
                            {area.tagline ? ` · ${area.tagline}` : ""}
                          </span>
                        </p>

                        <p className="mt-2.5 text-[13.5px] leading-relaxed text-slate-600 font-normal line-clamp-2">
                          {area.blurb}
                        </p>
                      </div>

                      {/* Pricing Benchmark & Action Row */}
                      <div className="mt-5 border-t border-slate-200/80 pt-3.5 flex items-center justify-between">
                        <div>
                          <span className="block text-[10.5px] font-mono text-slate-500 uppercase tracking-wider">
                            {area.guideLabel}
                          </span>
                          <div className="flex items-baseline gap-1 mt-0.5">
                            <span className="font-mono text-xl sm:text-[22px] font-medium tracking-tight text-[#151936]">
                              {formatBenchmarkPrice(area.guideValue)}
                            </span>
                            {!area.guideValue.includes("sqft") &&
                              !area.guideValue.toLowerCase().includes("request") && (
                                <span className="text-xs font-normal text-slate-500 font-sans">
                                  /mo
                                </span>
                              )}
                          </div>
                        </div>

                        <div className="flex size-9 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-600 shadow-xs transition-all duration-300 group-hover:border-[#151936] group-hover:bg-[#151936] group-hover:text-white group-hover:scale-105">
                          <ArrowRightIcon size={14} stroke={2} aria-hidden="true" />
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty Search Result State */}
        {filteredAreas.length === 0 && (
          <div className="py-20 text-center max-w-md mx-auto space-y-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-surface-1 text-ink-400 mx-auto border border-line">
              <PinIcon size={20} stroke={WEB_ICON_STROKE} />
            </div>
            <h3 className="text-xl font-medium text-ink-900">
              No areas matching &ldquo;{searchQuery}&rdquo;
            </h3>
            <p className="text-sm text-ink-500 leading-relaxed">
              We frequently take on private mandates and properties in submarkets beyond our primary directory.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedGroup("all");
                }}
                className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-line bg-surface-1 px-5 py-2 text-xs font-mono uppercase tracking-wider text-ink-700 hover:bg-surface-2 transition-colors"
              >
                Reset Filter
              </button>
              <Link
                href="/landlords#valuation"
                className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2 text-xs font-mono uppercase tracking-wider text-white hover:bg-ink-800 transition-colors"
              >
                Ask About Your Area
              </Link>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
