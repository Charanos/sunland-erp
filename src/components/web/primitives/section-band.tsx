import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { Container } from "./container";

/**
 * The structural primitive that gives the site its rhythm.
 *
 * Dark, light, tint, dark is a breathing pattern. The dark bands are the only
 * places the site raises its voice, and both of the original two were placed
 * where a claim is being made: what we do, and how we run it. The light and
 * tint bands between are where the visitor works, and work wants a light
 * ground.
 *
 * Tint is never decorative. It appears only to separate two sections that
 * would otherwise touch white to white.
 *
 * `tertiary` is the ERP's dark emerald gradient, carried across. It exists so
 * a dark band can carry depth without spending the page's single yellow
 * element on it. Rules: a ground only, never type and never a control fill, at
 * most twice per page, and never on two adjacent bands.
 */
export type BandTone = "light" | "tint" | "dark" | "tertiary";

const toneClass: Record<BandTone, string> = {
  light: "bg-surface-0 text-ink-700",
  tint: "bg-surface-1 text-ink-700",
  dark: "web-dark",
  tertiary: "web-tertiary",
};

/**
 * Section vertical rhythm: 96px mobile, 128px desktop, between bands.
 * Consistency here does more for perceived quality than any single component.
 */
const spacingClass = {
  tight: "py-16 lg:py-20",
  default: "py-24 lg:py-32",
  loose: "py-28 lg:py-36",
} as const;

export function SectionBand({
  children,
  tone = "light",
  spacing = "default",
  bleed = false,
  id,
  labelledBy,
  className,
  innerClassName,
}: {
  children: ReactNode;
  tone?: BandTone;
  spacing?: keyof typeof spacingClass;
  /** Skip the container, for bands whose content genuinely runs edge to edge. */
  bleed?: boolean;
  id?: string;
  /** Wires the band to its own heading, so screen readers announce the region. */
  labelledBy?: string;
  className?: string;
  innerClassName?: string;
}) {
  const isDark = tone === "dark" || tone === "tertiary";

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-tone={tone}
      className={cn(
        "relative overflow-hidden",
        toneClass[tone],
        spacingClass[spacing],
        // Adjacent light bands would otherwise blur into one another. A tint
        // band between them is the intended separator, but a hairline covers
        // the case where two lights do end up neighbours.
        !isDark && "border-t border-line/60 first:border-t-0",
        className
      )}
    >
      {bleed ? children : <Container className={innerClassName}>{children}</Container>}
    </section>
  );
}
