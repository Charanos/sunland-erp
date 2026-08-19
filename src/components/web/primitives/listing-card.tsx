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
 * Designed as a luxury architectural asset panel with deep midnight gradient,
 * ambient radiance, and a refined gold-accented monogram.
 */
function BrandedFallback() {
  return (
    <div className="relative flex size-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#121630] via-[#181e45] to-[#0d1127] p-6 text-center select-none">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(243,223,39,0.12),transparent_65%)]"
      />

      {/* Luxury Monogram */}
      <div className="relative flex size-16 items-center justify-center rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
        <span className="font-editorial text-3xl font-medium tracking-wider text-white">S</span>
        <span className="absolute -bottom-1 size-1.5 rounded-full bg-brand-yellow" />
      </div>

      {/* Discreet label */}
      <span className="relative mt-3.5 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
        Verified Portfolio Asset
      </span>
    </div>
  );
}

export function ListingCard({
  listing,
  headingLevel = 3,
  priority = false,
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
  const ArrowIcon = webIcons.arrow;

  return (
    <article
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-[22px] border border-slate-200/90 bg-white transition-all duration-300 ease-out",
        "shadow-[0_8px_24px_rgba(21,25,54,0.04),0_1px_2px_rgba(0,0,0,0.02)]",
        isAvailable &&
          "hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-[0_20px_45px_rgba(21,25,54,0.1),0_4px_12px_rgba(0,0,0,0.03)] focus-within:-translate-y-1.5 focus-within:shadow-[0_20px_45px_rgba(21,25,54,0.1)]",
        className
      )}
    >
      {/* Media */}
      <div
        className={cn(
          "web-scrim-top relative aspect-[16/11] overflow-hidden rounded-t-[21px] bg-slate-900",
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
              "object-cover transition-transform duration-500 ease-out motion-reduce:transition-none",
              isAvailable && "group-hover:scale-[1.05] motion-reduce:group-hover:scale-100"
            )}
          />
        ) : (
          <BrandedFallback />
        )}

        <div className="absolute inset-x-3.5 top-3.5 z-10 flex items-start justify-between gap-2">
          <ListingStatusBadge status={listing.status} />
          {listing.isFeatured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-yellow px-2.5 py-1 font-mono text-[10.5px] font-semibold uppercase tracking-wider text-[#151936] shadow-xs">
              Featured
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          <Heading className="font-editorial text-[21px] sm:text-[23px] font-medium leading-[1.2] text-[#151936] transition-colors group-hover:text-blue-700 min-h-[3.35rem]">
            <Link href={`/properties/${listing.slug}`} className="after:absolute after:inset-0">
              <span className="line-clamp-2">{listing.title}</span>
            </Link>
          </Heading>

          <p className="mt-2 flex items-center gap-1.5 truncate text-xs text-slate-500 font-normal">
            <PinIcon size={15} stroke={WEB_ICON_STROKE} aria-hidden="true" className="shrink-0 text-slate-400" />
            <span className="truncate">{listing.location}</span>
          </p>
        </div>

        <div className="my-4 border-y border-slate-100 py-3 min-h-[46px] flex items-center">
          <SpecRow className="w-full border-0 py-0 my-0">
            <SpecChip icon="bed" value={listing.bedrooms} unit="bedrooms" />
            <SpecChip icon="bath" value={listing.bathrooms} unit="bathrooms" />
            <SpecChip icon="area" value={listing.area} unit="floor area" />
            <SpecChip icon="parking" value={listing.parkingSpaces} unit="parking spaces" />
          </SpecRow>
        </div>

        <div className="mt-auto flex items-center justify-between pt-1">
          <div className="flex items-baseline gap-1.5">
            {listing.priceKes === null ? (
              <p className={cn("text-base font-medium", isAvailable ? "text-slate-600" : "text-slate-400")}>
                Price on request
              </p>
            ) : (
              <>
                <p
                  className={cn(
                    "font-mono text-[22px] sm:text-[24px] font-medium tracking-tight",
                    isAvailable ? "text-[#151936]" : "text-slate-500"
                  )}
                >
                  {formatKES(listing.priceKes)}
                </p>
                {listing.priceSuffix && (
                  <span className="text-xs text-slate-400">{listing.priceSuffix}</span>
                )}
              </>
            )}
          </div>

          <div className="flex size-8.5 items-center justify-center rounded-full border border-slate-200/80 bg-slate-50 text-slate-500 shadow-xs transition-all duration-300 group-hover:translate-x-1 group-hover:border-[#151936] group-hover:bg-[#151936] group-hover:text-white">
            <ArrowIcon size={14} stroke={2} aria-hidden="true" />
          </div>
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
