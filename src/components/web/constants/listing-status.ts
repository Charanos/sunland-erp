/**
 * Public listing status vocabulary.
 *
 * Deliberately mirrors the shape of STATUS_CONFIG in
 * `src/components/sunland/property-constants.ts` - `{ label, dot, ... }`, one
 * object consumed by the card, the filter pills and (from W1-5) the index.
 * Anyone who has worked on the portfolio boards will recognise it.
 *
 * Two differences, both intentional:
 *
 * 1. The vocabulary is public, not operational. The ERP distinguishes
 *    `occupied` from `off_market` from `maintenance` because a manager needs
 *    to act on each differently. A visitor needs to know one thing: can I have
 *    this or not. So four public states, mapped from the five internal ones.
 *
 * 2. Badges over photographs carry their own dark glass carrier rather than
 *    the 20% semantic fill. 20% emerald over an unknown photograph is not a
 *    contrast guarantee; 72% navy is. The ERP solves the same problem with a
 *    white/95 carrier on ImageStatusPill; navy reads better on this palette.
 *
 * Colour never carries meaning alone (doc 03 §6): every status pairs a dot
 * with a word, which is how the ERP already does it.
 */

export type ListingStatus = "available" | "under_offer" | "let" | "sold";

export type ListingStatusConfig = {
  /** The word beside the dot. Never omitted, never replaced by colour alone. */
  label: string;
  /** Dot fill, for the carrier badge over media. */
  dot: string;
  /** Foreground on the dark glass carrier. */
  fg: string;
  /** Whether the listing is still an offer. Drives the desaturated card
   *  treatment: unavailable stock stays visible and indexed for price
   *  context, but stops looking like something you can enquire about. */
  isAvailable: boolean;
};

export const LISTING_STATUS_CONFIG: Record<ListingStatus, ListingStatusConfig> = {
  available: {
    label: "Available now",
    dot: "bg-emerald-400",
    fg: "text-[var(--color-positive-fg)]",
    isAvailable: true,
  },
  under_offer: {
    label: "Under offer",
    dot: "bg-amber-400",
    fg: "text-[var(--color-pending-fg)]",
    isAvailable: true,
  },
  let: {
    label: "Let",
    dot: "bg-rose-400",
    fg: "text-[var(--color-critical-fg)]",
    isAvailable: false,
  },
  sold: {
    label: "Sold",
    dot: "bg-rose-400",
    fg: "text-[var(--color-critical-fg)]",
    isAvailable: false,
  },
};

/**
 * Internal `properties.status` to public listing status.
 *
 * `maintenance` maps to `let` rather than surfacing as its own state: that a
 * unit is having its plumbing done is an operational fact, and publishing it
 * tells a prospect nothing except that the building has problems.
 *
 * `off_market` should not reach a published listing at all, but maps
 * defensively rather than throwing, since a render is not the place to
 * discover a data problem.
 */
export function toListingStatus(
  propertyStatus: string,
  listingType: string | null | undefined
): ListingStatus {
  const isSale = (listingType ?? "").toLowerCase().includes("sale");

  switch (propertyStatus) {
    case "available":
      return "available";
    case "under_offer":
      return "under_offer";
    case "occupied":
    case "maintenance":
    case "off_market":
      return isSale ? "sold" : "let";
    default:
      return "available";
  }
}
