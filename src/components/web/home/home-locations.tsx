import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { WEB_ICON_STROKE, webIcons } from "../icons";
import { WebButtonLink } from "../primitives/button";
import { SectionBand } from "../primitives/section-band";
import { locationDefaults } from "./home.defaults";
import { SectionHeading } from "./section-heading";

export type LocationTile = {
  name: string;
  slug: string;
  count?: number;
  imageUrl?: string;
  tagline?: string;
};

/**
 * 06 home.locations, light band.
 *
 * Visual bento-grid showcasing premier Nairobi and regional markets with rich photographic imagery.
 */
export function HomeLocations({ tiles }: { tiles: LocationTile[] }) {
  if (tiles.length === 0) return null;

  const ArrowIcon = webIcons.arrowOut;
  const PinIcon = webIcons.pin;

  return (
    <SectionBand tone="light" labelledBy="locations-heading" className="relative bg-white">
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
            {locationDefaults.viewAllLabel}
          </WebButtonLink>
        }
      />

      <ul className="mt-12 grid auto-rows-[200px] sm:auto-rows-[220px] grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {tiles.slice(0, 8).map((tile, index) => {
          const isHero = index === 0;
          const isAnchor = index === 7;
          return (
            <li
              key={tile.slug}
              className={cn(
                // Hero tile (Kilimani): 2x2 on desktop, 2-col on mobile
                isHero && "col-span-2 row-span-2",
                // Middle tiles: 1x1
                index > 0 && index < 7 && "col-span-1 row-span-1",
                // Anchor tile (Spring Valley): 2x1 wide panoramic to completely seal the grid
                isAnchor && "col-span-2 row-span-1"
              )}
            >
              <Link
                href={`/locations/${tile.slug}`}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[22px] border border-slate-200/80 bg-slate-900 p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(21,25,54,0.18),0_4px_12px_rgba(0,0,0,0.06)]"
              >
                {/* Background Photography */}
                {tile.imageUrl && (
                  <Image
                    src={tile.imageUrl}
                    alt={tile.name}
                    fill
                    sizes={isHero ? "(min-width: 1024px) 600px, 100vw" : "(min-width: 1024px) 300px, 50vw"}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                )}

                {/* Multi-stop Scrim for perfect contrast */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#151936] via-[#151936]/45 to-[#151936]/10 transition-opacity duration-300 group-hover:via-[#151936]/35"
                />

                {/* Top Action Pill */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#151936]/70 border border-white/15 px-2.5 py-1 font-mono text-[10.5px] font-medium text-white backdrop-blur-md">
                    <PinIcon size={12} stroke={WEB_ICON_STROKE} />
                    <span>Nairobi</span>
                  </span>

                  <span className="flex size-8 items-center justify-center rounded-full bg-white/10 border border-white/20 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-brand-yellow group-hover:text-[#151936] group-hover:scale-110 shadow-xs">
                    <ArrowIcon size={14} stroke={2} />
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="relative z-10">
                  <p
                    className={cn(
                      "font-editorial font-medium leading-tight text-white transition-colors group-hover:text-brand-yellow",
                      isHero ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl"
                    )}
                  >
                    {tile.name}
                  </p>

                  {tile.tagline && (
                    <p className="mt-1 text-xs text-slate-300/90 font-normal line-clamp-1">
                      {tile.tagline}
                    </p>
                  )}

                  {typeof tile.count === "number" && tile.count > 0 && (
                    <p className="font-mono mt-2 text-[11px] text-emerald-400">
                      {tile.count} active mandates
                    </p>
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
