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
  /** Live listing count, omitted entirely rather than shown as zero. */
  count?: number;
};

/**
 * 06 home.locations, light band.
 *
 * Unequal tiles, one large, three medium, four small. This is the only place
 * on the home page where density is welcome, because the visitor is scanning
 * for their own area rather than deciding whether to trust us. Density is
 * earned by intent: it belongs on the index and here, and is refused on the
 * bands above.
 *
 * Tiles link to `/locations/{slug}`, never to a filtered query URL. A
 * location hub answers "what is Kilimani like, and what does it cost", which
 * is the query that earns organic traffic; a filter URL answers "show me
 * stock" and cannot rank.
 *
 * No stock photography. Where a tile has no real photograph it renders the
 * branded ground rather than a stand-in image of a building we do not manage.
 */
export function HomeLocations({ tiles }: { tiles: LocationTile[] }) {
  if (tiles.length === 0) return null;

  return (
    <SectionBand tone="light" labelledBy="locations-heading">
      <SectionHeading
        id="locations-heading"
        eyebrow={locationDefaults.eyebrow}
        title={locationDefaults.headline}
        action={
          <WebButtonLink href={locationDefaults.viewAllHref} variant="outline" size="md">
            {locationDefaults.viewAllLabel}
          </WebButtonLink>
        }
      />

      <ul className="mt-12 grid auto-rows-[168px] grid-cols-2 gap-4 lg:grid-cols-4">
        {tiles.slice(0, 8).map((tile, index) => (
          <li
            key={tile.slug}
            className={cn(
              // One large, three medium, four small. The first tile takes a
              // 2x2 block on desktop; the rest fill around it.
              index === 0 && "col-span-2 row-span-2",
              index > 0 && index < 4 && "lg:col-span-1"
            )}
          >
            <Link
              href={`/locations/${tile.slug}`}
              className="group web-scrim relative flex h-full flex-col justify-end overflow-hidden rounded-web-card border border-line bg-brand-dark p-5 transition-all duration-200 hover:-translate-y-[3px] hover:shadow-web-md"
            >
              {/* Branded ground, not stock photography. When the real media
                  pipeline lands (W1-11) a photograph slots in behind this and
                  the scrim already guarantees the label stays readable. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-6 -top-6 text-on-dark-hi/[0.07] transition-transform duration-500 group-hover:scale-110"
              >
                {(() => {
                  const PinIcon = webIcons.pin;
                  return <PinIcon size={index === 0 ? 220 : 140} stroke={WEB_ICON_STROKE} />;
                })()}
              </span>

              <p
                className={cn(
                  "web-title-card relative text-on-dark-hi",
                  index === 0 ? "text-web-h3" : "text-xl"
                )}
              >
                {tile.name}
              </p>
              {typeof tile.count === "number" && tile.count > 0 && (
                <p className="web-numeric relative mt-1 text-[13px] text-on-dark-lo">
                  {tile.count} listed
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </SectionBand>
  );
}
