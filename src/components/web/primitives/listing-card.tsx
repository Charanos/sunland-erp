import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { formatKES } from "@/lib/utils/format";
import { LISTING_STATUS_CONFIG, type ListingStatus } from "../constants/listing-status";
import { WEB_ICON_STROKE, webIcons } from "../icons";
import { ListingStatusBadge, WebMediaBadge } from "./badge";
import { SpecChip, SpecRow } from "./spec-chip";

/**
 * The most-used component on the site, so it is specified and built before
 * anything that contains it. Home, the listing index and every facet page
 * render this exact component.
 *
 * The states below are not edge cases. Six of the eight are what the current
 * dataset actually produces: the happy path is the minority case. A listing
 * with no photograph, no price, an overflowing title, or a status of "let" is
 * normal, and each one has a designed answer rather than a broken render.
 */

export type ListingCardData = {
  id: string;
  slug: string;
  title: string;
  location: string;
  status: ListingStatus;
  isFeatured?: boolean;
  /** Null renders "Price on request", never an empty currency string. */
  priceKes: number | null;
  /** " / mo" for rentals, absent for sales. */
  priceSuffix?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  /** Pre-formatted, because land is in acres and offices in square feet. */
  area?: string | null;
  parkingSpaces?: number | null;
};

/**
 * The branded fallback for a listing with no usable photograph.
 *
 * Never a broken image glyph and never a stretched photo. A rejected image
 * falling through to this panel is the better of the two outcomes and should
 * be treated as acceptable rather than as a gap to fill.
 *
 * TODO: the design pass asks for the Sunland mark as a single-colour SVG.
 * Until that asset exists this stands in with the Cormorant "S", exactly as
 * the design templates do.
 */
function BrandedFallback() {
  return (
    <div className="flex size-full items-center justify-center bg-surface-2">
      <span aria-hidden="true" className="web-title-light select-none text-6xl text-brand-dark/20">
        S
      </span>
    </div>
  );
}

export function ListingCard({
  listing,
  /** The component takes its heading level rather than guessing: h3 under a
   *  section h2 on the home page, h2 under the page h1 on the index. */
  headingLevel = 3,
  /** The first row on a page loads eagerly; everything below the fold is lazy. */
  priority = false,
  /** On a tinted band the location line steps to ink-500, because ink-400 on
   *  surface-2 fails contrast while ink-400 on surface-0 passes. */
  onTint = false,
  className,
}: {
  listing: ListingCardData;
  headingLevel?: 2 | 3;
  priority?: boolean;
  onTint?: boolean;
  className?: string;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const status = LISTING_STATUS_CONFIG[listing.status];
  const isAvailable = status.isAvailable;
  const PinIcon = webIcons.pin;

  return (
    <article
      className={cn(
        "group relative rounded-web-card border border-line bg-surface-0 transition-all duration-200 ease-out",
        "shadow-web-sm",
        // Unavailable stock stays visible and indexed on facet pages for the
        // price context that earns location pages their traffic, but it stops
        // behaving like an offer: no lift, no hover shadow.
        isAvailable &&
          "hover:-translate-y-[3px] hover:border-line-strong hover:shadow-web-md focus-within:-translate-y-[3px] focus-within:shadow-web-md",
        className
      )}
    >
      {/* Media. Ratio locked by the container so nothing depends on trusting
          the source, with a top scrim so the badge holds contrast over a
          bright sky. */}
      <div
        className={cn(
          "web-scrim-top relative aspect-[4/3] overflow-hidden rounded-t-web-card",
          !isAvailable && "saturate-[0.55]"
        )}
      >
        {listing.imageUrl ? (
          <Image
            src={listing.imageUrl}
            alt={listing.imageAlt ?? listing.title}
            fill
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
            priority={priority}
            loading={priority ? undefined : "lazy"}
            className={cn(
              "object-cover transition-transform duration-[400ms] ease-out motion-reduce:transition-none",
              isAvailable && "group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
            )}
          />
        ) : (
          <BrandedFallback />
        )}

        <div className="absolute inset-x-3.5 top-3.5 z-10 flex items-start justify-between gap-2">
          <ListingStatusBadge status={listing.status} />
          {listing.isFeatured && <WebMediaBadge>Featured</WebMediaBadge>}
        </div>
      </div>

      <div className="p-5">
        <Heading className="web-title-card text-web-h3 text-ink-900">
          {/* The whole card is one link and its accessible name is the listing
              title alone, not "Details". The overlay covers the card so the
              media and specs are part of the target without nesting anything
              interactive inside the anchor. */}
          <Link href={`/properties/${listing.slug}`} className="after:absolute after:inset-0">
            <span className="line-clamp-2">{listing.title}</span>
          </Link>
        </Heading>

        <p
          className={cn(
            "web-subtitle mt-1.5 flex items-center gap-1.5 truncate text-sm",
            onTint ? "text-ink-500" : "text-ink-400"
          )}
        >
          <PinIcon size={16} stroke={WEB_ICON_STROKE} aria-hidden="true" className="shrink-0" />
          <span className="truncate">{listing.location}</span>
        </p>

        <SpecRow className="mt-4">
          <SpecChip icon="bed" value={listing.bedrooms} unit="bedrooms" />
          <SpecChip icon="bath" value={listing.bathrooms} unit="bathrooms" />
          <SpecChip icon="area" value={listing.area} unit="floor area" />
          <SpecChip icon="parking" value={listing.parkingSpaces} unit="parking spaces" />
        </SpecRow>

        <div className="mt-4 flex items-baseline gap-1.5">
          {listing.priceKes === null ? (
            // The state that produced KShKShKSh on the live site. Prose, so it
            // is set in Nunito: mono is reserved for figures you can rely on.
            <p className={cn("text-web-lead", isAvailable ? "text-ink-500" : "text-ink-400")}>
              Price on request
            </p>
          ) : (
            <>
              <p
                className={cn(
                  "web-numeric text-[22px] tracking-[-0.02em]",
                  isAvailable ? "text-ink-900" : "text-ink-500"
                )}
              >
                {formatKES(listing.priceKes)}
              </p>
              {listing.priceSuffix && (
                // A separate node so the suffix never wraps onto its own line.
                <span className="text-sm text-ink-400">{listing.priceSuffix}</span>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  );
}

/**
 * The loading state. Identical box model to the real card, because a skeleton
 * that is a different height to the thing it stands in for spends the entire
 * CLS budget on its own arrival. No spinner, no "Finding properties" text.
 */
export function ListingCardSkeleton() {
  return (
    <div className="rounded-web-card border border-line bg-surface-0 shadow-web-sm">
      <div className="web-skeleton aspect-[4/3] rounded-t-web-card" />
      <div className="p-5">
        <div className="web-skeleton h-6 w-4/5 rounded-web-sm" />
        <div className="web-skeleton mt-2.5 h-4 w-1/2 rounded-web-sm" />
        <div className="my-4 flex gap-4 border-y border-line-soft py-3.5">
          <div className="web-skeleton h-4 w-12 rounded-web-sm" />
          <div className="web-skeleton h-4 w-12 rounded-web-sm" />
          <div className="web-skeleton h-4 w-16 rounded-web-sm" />
        </div>
        <div className="web-skeleton h-7 w-2/5 rounded-web-sm" />
      </div>
    </div>
  );
}
