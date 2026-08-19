import { WebButtonLink } from "../primitives/button";
import { ListingCard, type ListingCardData } from "../primitives/listing-card";
import { WebPill } from "../primitives/pill";
import { SectionBand } from "../primitives/section-band";
import { featuredDefaults } from "./home.defaults";
import { SectionHeading } from "./section-heading";

/**
 * 04 home.featured, tint band.
 *
 * Tint so white cards separate from the ground without a shadow having to do
 * that work.
 *
 * The section hides below three cards rather than looking short of stock. A
 * grid with two listings in it says less about our inventory than no grid at
 * all, and a visitor counts.
 *
 * The status pills use the tertiary emerald active state, not yellow. The
 * design pass shows the active "All" pill carrying the yellow, but that frame
 * is the properties index, where nothing else on screen is yellow. Here the
 * band sits between the hero search button and the landlord valuation button,
 * so a yellow pill would be the third yellow element in view and the rule is
 * one.
 */
export function HomeFeatured({ listings }: { listings: ListingCardData[] }) {
  if (listings.length < 3) return null;

  return (
    <SectionBand tone="tint" labelledBy="featured-heading">
      <SectionHeading
        id="featured-heading"
        eyebrow={featuredDefaults.eyebrow}
        title={featuredDefaults.headline}
        action={
          <WebButtonLink href={featuredDefaults.viewAllHref} variant="outline" size="md">
            View all
          </WebButtonLink>
        }
      />

      <div className="mt-8 flex flex-wrap items-center gap-2">
        {featuredDefaults.filters.map((filter, index) => (
          <WebPill key={filter.href} href={filter.href} active={index === 0}>
            {filter.label}
          </WebPill>
        ))}
        <p className="web-numeric ml-auto text-[13px] text-ink-400">{listings.length} shown</p>
      </div>

      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing, index) => (
          <li key={listing.id}>
            <ListingCard
              listing={listing}
              headingLevel={3}
              // Only the first row loads eagerly. Everything below the fold is
              // lazy, which is most of the image weight on this page.
              priority={index < 3}
              onTint
            />
          </li>
        ))}
      </ul>
    </SectionBand>
  );
}
