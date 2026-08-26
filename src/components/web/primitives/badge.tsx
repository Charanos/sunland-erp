import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { LISTING_STATUS_CONFIG, type ListingStatus } from "../constants/listing-status";

/**
 * Badges for the public site.
 *
 * Same vocabulary as the ERP `badge-pill` / `badge-tone-*` system in
 * globals.css, which is already JetBrains Mono 500, uppercase and fully
 * round. Rebuilt here rather than imported because the ERP tones resolve
 * against `--primary` and `--sidebar` and are tuned for the `#f4f6f0`
 * dashboard ground, not `--color-surface-0`. Same shape, different palette.
 *
 * The dot-plus-label pairing is carried over deliberately. Colour never
 * carries meaning alone (doc 03 §6), and the portfolio boards already got
 * this right.
 */

export type WebBadgeTone = "neutral" | "positive" | "critical" | "pending" | "brand";

const toneClass: Record<WebBadgeTone, string> = {
  neutral: "bg-surface-2 text-ink-500",
  positive: "bg-positive-bg text-emerald-800",
  critical: "bg-critical-bg text-rose-800",
  pending: "bg-pending-bg text-amber-800",
  brand: "bg-brand-dark/6 text-brand-dark",
};

/** A badge on a solid surface, where the background is known. */
export function WebBadge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: WebBadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "web-control inline-flex items-center gap-1.5 rounded-web-full px-2.5 py-1",
        "text-web-nano uppercase tracking-[0.14em]",
        toneClass[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

/**
 * A badge sitting over a photograph.
 *
 * The semantic background tokens are dropped here on purpose: 20% emerald over
 * an unknown photograph is not a contrast guarantee, and our library is phone
 * sourced with plenty of bright skies. A dark carrier is. The ERP solves the
 * same problem on `ImageStatusPill` with a white/95 carrier; dark reads better
 * against this palette and against the top scrim above it.
 *
 * ── Why black/60 and not brand-dark/72 ──
 *
 * The pages converged on `bg-black/60 + border-white/15 + shadow-xs` across a
 * dozen hand-rolled copies while this primitive still said `brand-dark/72 +
 * ring-white/20`. The shipped recipe is what the design was signed off on, so
 * the primitive moves to meet it rather than dragging twelve call sites back to
 * an older shape. `border` rather than `ring` for the same reason — that is
 * the box model those call sites already reserve space for.
 *
 * `caps` defaults to true because the status badges this was written for are
 * uppercase, but most media badges carry a proper noun — a region, a category,
 * a place name — where forcing caps shouts a label that reads as content.
 */

export type WebMediaBadgeTone = "glass" | "mint";

const mediaToneClass: Record<WebMediaBadgeTone, string> = {
  glass: "border-white/15 text-white",
  mint: "border-accent-mint/30 text-accent-mint-line",
};

export function WebMediaBadge({
  children,
  dot,
  tone = "glass",
  caps = true,
  className,
}: {
  children: ReactNode;
  /** Tailwind background class for the status dot. */
  dot?: string;
  tone?: WebMediaBadgeTone;
  /** Uppercase the label. Off for proper nouns — regions, categories, places. */
  caps?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "web-control inline-flex items-center gap-1.5 rounded-web-full px-3 py-1",
        "border bg-black/60 shadow-xs backdrop-blur-md",
        "text-web-nano",
        caps && "uppercase tracking-[0.14em]",
        mediaToneClass[tone],
        className
      )}
    >
      {dot && <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", dot)} />}
      {children}
    </span>
  );
}

/** The listing status badge, driven by the shared config. */
export function ListingStatusBadge({
  status,
  className,
}: {
  status: ListingStatus;
  className?: string;
}) {
  const config = LISTING_STATUS_CONFIG[status];

  return (
    <WebMediaBadge dot={config.dot} className={className}>
      {config.label}
    </WebMediaBadge>
  );
}
