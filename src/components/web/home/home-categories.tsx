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
 * 02 home.categories, unified dark band.
 *
 * Direct continuation of the hero atmosphere, leading the visitor into
 * the property catalogue by type.
 */
export function HomeCategories({ tiles }: { tiles: CategoryTile[] }) {
  const visible = tiles.filter((tile) => tile.count > 0);
  if (visible.length === 0) return null;

  const ArrowIcon = webIcons.arrow;

  return (
    <SectionBand tone="dark" labelledBy="categories-heading" className="relative">
      {/* Ambient dusk radiance continuing the hero's atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(49,91,232,0.1),transparent_70%)]"
      />

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

      {/* 1.5 card scroll-snap on a phone, so the row visibly continues past
          the edge rather than looking like it ends at four. */}
      <ul className="mt-12 -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {visible.map((tile) => {
          const IconComponent = webIcons[tile.icon];
          const segment = tile.href.split("/").pop() ?? "";
          const accentColor = CATEGORY_COLOR[segment] ?? "#0ea5e9";
          const subtitle =
            CATEGORY_SUBTITLES[tile.label] ??
            "Explore verified active listings and mandate opportunities";

          return (
            <li key={tile.href} className="w-[78%] shrink-0 snap-start sm:w-auto sm:shrink">
              <Link
                href={tile.href}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[22px] border border-white/10 bg-gradient-to-b from-white/[0.06] via-white/[0.025] to-transparent p-6 sm:p-7 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1.5 hover:border-white/25 hover:shadow-[0_20px_50px_rgba(0,0,0,0.45),0_0_30px_rgba(243,223,39,0.08)]"
              >
                {/* Glow accent matching the category theme */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-35"
                  style={{ backgroundColor: accentColor }}
                />

                {/* Top header: Uncarded Standalone Icon + Status Pill */}
                <div className="flex items-center justify-between gap-4">
                  <IconComponent
                    size={28}
                    stroke={WEB_ICON_STROKE}
                    aria-hidden="true"
                    className="text-slate-300/90 transition-all duration-300 group-hover:scale-110 group-hover:text-brand-yellow"
                  />
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10.5px] font-medium tracking-wider uppercase text-slate-300 transition-colors group-hover:border-white/20 group-hover:text-white">
                    <span className="size-1.5 rounded-full bg-brand-yellow/90" />
                    {tile.count} Available
                  </span>
                </div>

                {/* Body: Title + Curated Sub-descriptor */}
                <div className="mt-8 mb-6">
                  <p className="font-editorial text-[25px] font-medium leading-tight text-white transition-colors duration-200 group-hover:text-brand-yellow sm:text-[27px]">
                    {tile.label}
                  </p>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-slate-300/80">
                    {subtitle}
                  </p>
                </div>

                {/* Footer: Explore link + arrow circle */}
                <div className="mt-auto flex items-center justify-between border-t border-white/[0.08] pt-4">
                  <span className="font-mono text-[11px] font-medium uppercase tracking-widest text-slate-400 transition-colors group-hover:text-slate-200">
                    Explore Catalogue
                  </span>
                  <div className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-all duration-300 group-hover:border-brand-yellow group-hover:bg-brand-yellow group-hover:text-[#151936] group-hover:translate-x-1 shadow-sm">
                    <ArrowIcon size={15} stroke={2} aria-hidden="true" />
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </SectionBand>
  );
}
