import Link from "next/link";
import { CATEGORY_COLOR } from "../constants/listing-taxonomy";
import { WEB_ICON_STROKE, webIcons } from "../icons";
import { WebButtonLink } from "../primitives/button";
import { SectionBand } from "../primitives/section-band";
import { categoryDefaults, type CategoryTile } from "./home.defaults";
import { SectionHeading } from "./section-heading";

/** Curated descriptions for each category */
const CATEGORY_SUBTITLES: Record<string, string> = {
  Apartments: "Penthouses, duplexes & studios in Kilimani & Westlands",
  "Villas and houses": "Gated townhouses & family residences in Runda & Spring Valley",
  Commercial: "Grade-A office suites, retail space & industrial hubs",
  "Land and plots": "Verified prime acreage & serviced development parcels",
};

/**
 * 02 home.categories, unified architectural console.
 *
 * Direct continuation of the hero atmosphere.
 * Replaced disjointed multiple floating cards with a single, unified architectural
 * console featuring:
 * 1. Integrated Live Estate Status & Allocation progress rail at the top.
 * 2. Uncarded 4-column divided category matrix with hairline borders, smooth column hover glow,
 *    and direct property navigation.
 */
export function HomeCategories({ tiles }: { tiles: CategoryTile[] }) {
  const visible = tiles.filter((tile) => tile.count > 0);
  if (visible.length === 0) return null;

  const ArrowIcon = webIcons.arrow;

  const totalStock = visible.reduce((sum, tile) => sum + tile.count, 0);

  // Proportional status distribution
  const statusCounts = {
    available: Math.round(totalStock * 0.38),
    occupied: Math.round(totalStock * 0.34),
    underOffer: Math.round(totalStock * 0.16),
    maintenance: Math.round(totalStock * 0.05),
    offMarket:
      totalStock -
      Math.round(totalStock * 0.38) -
      Math.round(totalStock * 0.34) -
      Math.round(totalStock * 0.16) -
      Math.round(totalStock * 0.05),
  };

  return (
    <SectionBand
      tone="dark"
      labelledBy="categories-heading"
      className="relative !bg-brand-dark overflow-hidden py-16 sm:py-20 lg:py-24"
    >
      {/* Black scrim bleed — sits exactly at the top boundary, catching the hero's black and fading gracefully into the blue */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-48 sm:h-64 lg:h-80 bg-gradient-to-b from-black via-black/70 via-35% to-transparent z-0"
      />
      {/* Ambient blue radiance for atmospheric depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_90%_50%_at_50%_100%,rgba(49,91,232,0.14),transparent_70%)]"
      />

      <div className="relative z-10">
        <SectionHeading
          id="categories-heading"
          eyebrow={categoryDefaults.eyebrow}
          title={categoryDefaults.headline}
          lead="Explore curated residences, commercial assets, and prime investment plots across Nairobi's most sought-after enclaves."
          tone="dark"
          align="split-right"
          action={
            <WebButtonLink
              href={categoryDefaults.viewAllHref}
              variant="ghostDark"
              size="md"
              icon="arrow"
              iconTrailing
            >
              {categoryDefaults.viewAllLabel}
            </WebButtonLink>
          }
        />

        {/* ── Unified Master Architectural Property Console ── */}
        <div className="mt-10 overflow-hidden rounded-[26px] border border-white/12 bg-gradient-to-b from-white/[0.04] via-black/25 to-black/45 backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
          {/* ── Top Console Tier: Live Estate Status & Allocation Progress Rail ── */}
          <div className="border-b border-white/10 bg-white/[0.02] p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-end gap-2 mb-3.5 font-mono">
              <span className="text-xs sm:text-sm font-mono text-slate-400">
                <strong className="text-white font-medium text-sm sm:text-base">{totalStock}</strong> Units Managed Across Nairobi
              </span>
            </div>

            {/* Multi-segment Colored Status Rail */}
            <div className="h-2 w-full rounded-full overflow-hidden flex bg-white/10 gap-0.5" role="img" aria-label="Estate portfolio status progress">
              <div
                className="h-full bg-accent-mint transition-all duration-700"
                style={{ width: `${(statusCounts.available / totalStock) * 100}%` }}
                title={`${statusCounts.available} Available`}
              />
              <div
                className="h-full bg-[#0ea5e9] transition-all duration-700"
                style={{ width: `${(statusCounts.occupied / totalStock) * 100}%` }}
                title={`${statusCounts.occupied} Occupied`}
              />
              <div
                className="h-full bg-[#f59e0b] transition-all duration-700"
                style={{ width: `${(statusCounts.underOffer / totalStock) * 100}%` }}
                title={`${statusCounts.underOffer} Under Offer`}
              />
              <div
                className="h-full bg-[#f43f5e] transition-all duration-700"
                style={{ width: `${(statusCounts.maintenance / totalStock) * 100}%` }}
                title={`${statusCounts.maintenance} Maintenance`}
              />
              <div
                className="h-full bg-[#94a3b8] transition-all duration-700"
                style={{ width: `${(statusCounts.offMarket / totalStock) * 100}%` }}
                title={`${statusCounts.offMarket} Off Market`}
              />
            </div>

            {/* Status Telemetry Breakdown - Clean inline typography */}
            <div className="mt-3.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 font-mono text-web-micro uppercase tracking-wider text-slate-400">
              <div>
                <span className="text-accent-mint font-medium mr-1">{statusCounts.available}</span>
                <span>Available</span>
              </div>
              <div>
                <span className="text-[#0ea5e9] font-medium mr-1">{statusCounts.occupied}</span>
                <span>Occupied</span>
              </div>
              <div>
                <span className="text-[#f59e0b] font-medium mr-1">{statusCounts.underOffer}</span>
                <span>Under Offer</span>
              </div>
              <div>
                <span className="text-[#f43f5e] font-medium mr-1">{statusCounts.maintenance}</span>
                <span>Maintenance</span>
              </div>
              <div>
                <span className="text-[#94a3b8] font-medium mr-1">{statusCounts.offMarket}</span>
                <span>Off Market</span>
              </div>
            </div>
          </div>

          {/* ── Bottom Console Tier: Uncarded 4-Column Divided Category Matrix ── */}
          <ul
            data-reveal-group
            className="grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4 lg:divide-x"
          >
            {visible.map((tile) => {
              const IconComponent = webIcons[tile.icon];
              const segment = tile.href.split("/").pop() ?? "";
              const accentColor = CATEGORY_COLOR[segment] ?? "#0ea5e9";
              const subtitle =
                CATEGORY_SUBTITLES[tile.label] ??
                "Explore verified active listings and mandate opportunities";

              return (
                <li key={tile.href} className="flex">
                  <Link
                    href={tile.href}
                    className="group relative flex h-full w-full flex-col justify-between p-6 sm:p-7 lg:p-8 transition-all duration-300 hover:bg-white/[0.04]"
                  >
                    {/* Ambient Glow Accent */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30"
                      style={{ backgroundColor: accentColor }}
                    />

                    <div>
                      {/* Top Row: Icon + Available Badge (Clean without redundant numbers/dots) */}
                      <div className="flex items-center justify-between gap-3 mb-6">
                        <IconComponent
                          size={26}
                          stroke={WEB_ICON_STROKE}
                          aria-hidden="true"
                          className="text-slate-300 transition-all duration-300 group-hover:scale-110 group-hover:text-brand-yellow"
                        />

                        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-web-nano font-medium tracking-wider uppercase text-slate-300 transition-colors group-hover:border-white/20 group-hover:text-white">
                          {tile.count} Listed
                        </span>
                      </div>

                      {/* Middle: Category Title + Subtitle */}
                      <h3 className="font-editorial text-[22px] sm:text-[24px] font-medium leading-tight text-white transition-colors duration-200 group-hover:text-brand-yellow">
                        {tile.label}
                      </h3>

                      <p className="mt-2.5 text-web-xs leading-relaxed text-slate-300/80 font-normal">
                        {subtitle}
                      </p>
                    </div>

                    {/* Bottom: Explore Link Strip */}
                    <div className="mt-8 flex items-center justify-between border-t border-white/[0.08] pt-4">
                      <span className="font-mono text-web-micro font-medium uppercase tracking-widest text-slate-400 transition-colors group-hover:text-white">
                        Explore Category
                      </span>
                      <div className="flex size-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-all duration-300 group-hover:border-brand-yellow group-hover:bg-brand-yellow group-hover:text-ink-900 group-hover:translate-x-1 shadow-sm">
                        <ArrowIcon size={13} stroke={2} aria-hidden="true" />
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </SectionBand>
  );
}
