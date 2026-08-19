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
        "text-[10.5px] uppercase tracking-[0.14em]",
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
 * sourced with plenty of bright skies. 72% navy is. The ERP solves the same
 * problem on `ImageStatusPill` with a white/95 carrier; navy reads better
 * against this palette and against the top scrim above it.
 */
export function WebMediaBadge({
  children,
  dot,
  className,
}: {
  children: ReactNode;
  /** Tailwind background class for the status dot. */
  dot?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "web-control inline-flex items-center gap-1.5 rounded-web-full px-2.5 py-1",
        "bg-brand-dark/72 text-on-dark-hi backdrop-blur-md",
        "ring-1 ring-white/20",
        "text-[10.5px] uppercase tracking-[0.14em]",
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
