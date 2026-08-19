"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils/cn";
import { DUR, registerWebMotion, STAGGER } from "@/lib/motion/web-motion";
import { WEB_ICON_STROKE, webIcons, type WebIconName } from "../icons";

/**
 * The portfolio dial: what is on the books, by type, as one ring.
 *
 * ── Why a ring, and why this one ──
 *
 * Of the four figures the hero used to show, exactly one is a distribution.
 * The total, the area count and the portal count are all scalars, and a chart of a scalar
 * is decoration. The property-type split is a real composition that sums to
 * the total, so it is the only thing here a chart can honestly say something
 * about.
 *
 * The scalar still leads: the total sits in the hole and is readable in half a
 * second, which is all a hero gets. The ring is the second layer, for the
 * visitor who looks twice. Putting the number inside the chart rather than
 * beside it is what lets one element do both jobs.
 *
 * Segments are links. That is the strongest argument for the thing existing:
 * it turns a decorative statistic into the fastest route into the catalogue.
 *
 * ── Why this is hand-drawn SVG and not Recharts ──
 *
 * Recharts is in the project and earns its weight on the ERP dashboards. Here
 * it would cost roughly 100KB gzipped plus the d3 tree, and `ResponsiveContainer`
 * measures after mount, so this column would be empty on first paint. That is
 * the LCP and no-JavaScript failure the hero was just hardened against.
 *
 * Four arcs on one circle is `stroke-dasharray`. It server-renders as real
 * markup, needs no measurement, and animates by drawing itself, which is a
 * gesture no library pie can produce.
 *
 * ── Colour ──
 *
 * The ring is a tonal ramp of white, not four hues. The design system allows
 * one yellow element per viewport and that is the search button; a yellow
 * segment would compete with it for the same glance. Yellow is held back for
 * the hovered or focused segment, so it means "this one" rather than "this is
 * a chart".
 */

export type DialSlice = {
  label: string;
  href: string;
  count: number;
  /** The same glyph HomeCategories uses one section down, so the two rhyme. */
  icon: WebIconName;
  /** Hex, carried over from the ERP portfolio donut. See CATEGORY_COLOR. */
  color: string;
};

const RADIUS = 78;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
/** Degrees of blank between segments, so adjacent arcs stay countable. */
const GAP_DEGREES = 3;

export type DialFootnoteStat = { kind: "stat"; value: string; label: string };
export type DialFootnoteLink = { kind: "link"; label: string; href: string };
export type DialFootnoteItem = DialFootnoteStat | DialFootnoteLink;

function ArrowRightIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function PortfolioDial({
  slices,
  totalLabel = "Listed",
  footnote,
  className,
}: {
  slices: DialSlice[];
  totalLabel?: string;
  /**
   * The row beneath the ring. A stat is a real count, kept in mono; a link
   * names what it actually points at rather than making the visitor infer
   * meaning from a bare number. "2" told nobody it meant an owner portal and a
   * tenant portal; the link now says that outright and goes there.
   */
  footnote?: DialFootnoteItem[];
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);

  // Largest first, so the tonal ramp encodes rank rather than array order.
  const ordered = [...slices].filter((slice) => slice.count > 0).sort((a, b) => b.count - a.count);
  const total = ordered.reduce((sum, slice) => sum + slice.count, 0);

  useGSAP(
    () => {
      registerWebMotion();
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline();

        // The arcs draw themselves. Each starts fully offset, which is the
        // same value the stylesheet would produce for a zero-length arc, and
        // clearProps hands the resting state back to the markup afterwards.
        tl.from(".dial-arc", {
          strokeDashoffset: (index, target: SVGCircleElement) =>
            Number(target.dataset.length ?? 0) + Number(target.dataset.offset ?? 0),
          duration: DUR.panel,
          ease: "sun.settle",
          stagger: STAGGER.cards,
          clearProps: "strokeDashoffset",
        })
          .from(
            ".dial-total",
            { opacity: 0, scale: 0.9, duration: DUR.base, ease: "sun.rise", clearProps: "all" },
            "<0.25"
          )
          .from(
            ".dial-legend-row",
            {
              opacity: 0,
              x: -10,
              duration: DUR.base * 0.8,
              stagger: STAGGER.tight,
              ease: "sun.rise",
              clearProps: "all",
            },
            "<0.1"
          );
      });

      return () => media.revert();
    },
    { scope: rootRef, dependencies: [total] }
  );

  if (ordered.length === 0 || total === 0) return null;

  // Each arc is a dash of its own length followed by a gap the size of the
  // rest of the circle, rotated to where the preceding arcs left off.
  //
  // The start angle is a prefix sum rather than a running counter: derived
  // values computed during render must not depend on mutation, or a re-render
  // that bails out part way through leaves the ring drawn from a stale cursor.
  const arcs = ordered.map((slice, index) => {
    const share = slice.count / total;
    const degrees = share * 360;
    const length = Math.max(((degrees - GAP_DEGREES) / 360) * CIRCUMFERENCE, 0);
    const preceding = ordered.slice(0, index).reduce((sum, item) => sum + item.count, 0);
    const rotation = (preceding / total) * 360;

    return {
      ...slice,
      share,
      length,
      rotation,
    };
  });

  return (
    <div
      ref={rootRef}
      className={cn(
        "w-full rounded-[18px] border border-white/12 bg-[#151936] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:rounded-[22px]",
        className
      )}
    >
      <div className="flex items-center gap-5">
        <div className="relative shrink-0">
          <svg
            viewBox="0 0 200 200"
            className="size-[112px] -rotate-90 sm:size-[124px]"
            role="img"
            aria-label={`Portfolio by type: ${arcs
              .map((arc) => `${arc.label}, ${arc.count}`)
              .join("; ")}. ${total} in total.`}
          >
            {/* The track. Gives the ring a body when a segment is tiny. */}
            <circle
              cx="100"
              cy="100"
              r={RADIUS}
              fill="none"
              stroke="rgb(255 255 255 / 0.08)"
              strokeWidth="13"
            />

            {arcs.map((arc) => {
              const offset = (arc.rotation / 360) * CIRCUMFERENCE;
              const isActive = active === arc.href;

              return (
                <circle
                  key={arc.href}
                  className="dial-arc origin-center transition-[stroke,stroke-width] duration-200"
                  data-length={arc.length}
                  data-offset={offset}
                  cx="100"
                  cy="100"
                  r={RADIUS}
                  fill="none"
                  stroke={isActive ? "var(--color-brand-yellow, #f3df27)" : arc.color}
                  strokeWidth={isActive ? 16 : 13}
                  strokeLinecap="butt"
                  // One dash of the arc's length, then a gap long enough that
                  // it never repeats, positioned by a negative offset.
                  strokeDasharray={`${arc.length} ${CIRCUMFERENCE}`}
                  strokeDashoffset={-offset}
                />
              );
            })}
          </svg>

          {/* The scalar, in the hole. The reason this reads in half a second. */}
          <div className="dial-total pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="web-numeric text-[26px] leading-none tracking-tight text-white sm:text-[30px]">
              {total}
            </span>
            <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-slate-400">
              {totalLabel}
            </span>
          </div>
        </div>

        {/* The legend is the navigation. Every row is a real link into the
            catalogue, which is what stops this being an ornament. */}
        <ul className="min-w-0 flex-1">
          {arcs.map((arc) => {
            const IconComponent = webIcons[arc.icon];
            const isActive = active === arc.href;

            return (
              <li key={arc.href} className="dial-legend-row">
                <Link
                  href={arc.href}
                  onMouseEnter={() => setActive(arc.href)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(arc.href)}
                  onBlur={() => setActive(null)}
                  className="group flex items-center gap-2.5 rounded-md py-[3px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-yellow"
                >
                  <IconComponent
                    aria-hidden="true"
                    size={14}
                    stroke={WEB_ICON_STROKE}
                    className="shrink-0 transition-colors"
                    style={{ color: isActive ? "var(--color-brand-yellow, #f3df27)" : arc.color }}
                  />
                  <span className="min-w-0 flex-1 truncate text-[12px] text-slate-300 transition-colors group-hover:text-white">
                    {arc.label}
                  </span>
                  <span className="web-numeric shrink-0 text-[12px] tabular-nums text-slate-400 transition-colors group-hover:text-white">
                    {arc.count}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {footnote && footnote.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-3.5">
          {footnote.map((item) =>
            item.kind === "stat" ? (
              <div key={item.label} className="flex items-baseline gap-1.5">
                <span className="web-numeric text-[15px] leading-none text-white">
                  {item.value}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">
                  {item.label}
                </span>
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="web-hit group ml-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-300 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-yellow"
              >
                {item.label}
                <ArrowRightIcon />
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
}
