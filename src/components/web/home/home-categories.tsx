import Link from "next/link";
import { WEB_ICON_STROKE, webIcons } from "../icons";
import { WebButtonLink } from "../primitives/button";
import { SectionBand } from "../primitives/section-band";
import { categoryDefaults, type CategoryTile } from "./home.defaults";
import { SectionHeading } from "./section-heading";

/**
 * 02 home.categories, light band.
 *
 * Relief after the dark fold, and the second entry intent: a visitor who did
 * not arrive with an area in mind arrived with a type in mind.
 *
 * A category with no live stock is removed, never shown at zero. The old site
 * renders "0.0 (0)" and empty counts across its cards, which advertises the
 * absence of inventory rather than the presence of any.
 */
export function HomeCategories({ tiles }: { tiles: CategoryTile[] }) {
  const visible = tiles.filter((tile) => tile.count > 0);
  if (visible.length === 0) return null;

  return (
    <SectionBand tone="light" labelledBy="categories-heading">
      <SectionHeading
        id="categories-heading"
        eyebrow={categoryDefaults.eyebrow}
        title={categoryDefaults.headline}
        action={
          <WebButtonLink href={categoryDefaults.viewAllHref} variant="outline" size="md">
            {categoryDefaults.viewAllLabel}
          </WebButtonLink>
        }
      />

      {/* 1.5 card scroll-snap on a phone, so the row visibly continues past
          the edge rather than looking like it ends at four. */}
      <ul className="mt-12 -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {visible.map((tile) => {
          const IconComponent = webIcons[tile.icon];

          return (
            <li key={tile.href} className="w-[68%] shrink-0 snap-start sm:w-auto sm:shrink">
              <Link
                href={tile.href}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-web-card border border-line bg-surface-1 p-6 transition-all duration-200 hover:-translate-y-[3px] hover:border-tertiary-emerald hover:shadow-web-md"
              >
                <IconComponent
                  size={28}
                  stroke={WEB_ICON_STROKE}
                  aria-hidden="true"
                  className="text-ink-400 transition-colors group-hover:text-tertiary-emerald"
                />
                <div className="mt-16">
                  <p className="web-title-card text-web-h3 text-ink-900">{tile.label}</p>
                  <p className="web-numeric mt-1 text-[13px] text-ink-400">
                    {tile.count} available
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </SectionBand>
  );
}
