"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils/cn";
import { DUR, registerWebMotion, STAGGER } from "@/lib/motion/web-motion";
import { WEB_AREAS } from "@/components/web/constants/locations.content";
import { WEB_ICON_STROKE, webIcons, type WebIconName } from "../icons";

/**
 * The executive portfolio command dial card.
 *
 * Props control which feature sections are rendered:
 *   showStatusRail   – Full estate health & allocation progress bar (about page)
 *   showCoverageHubs – Active regional hub pills drawer
 *   showSlaFooter    – Contractual SLA / escrow sub-footer with sign-in link
 *   footnote         – Simple inline stat + link bar (home hero compact mode)
 */

export type DialSlice = {
  label: string;
  href: string;
  count: number;
  icon: WebIconName;
  color: string;
};

const RADIUS = 78;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP_DEGREES = 3;

export type DialFootnoteStat = { kind: "stat"; value: string; label: string };
export type DialFootnoteLink = { kind: "link"; label: string; href: string };
export type DialFootnoteItem = DialFootnoteStat | DialFootnoteLink;

/** Status segments for the estate portfolio health rail */
const STATUS_SEGMENTS = [
  { label: "Available", color: "#10b981", pct: 42 },
  { label: "Occupied", color: "#0ea5e9", pct: 31 },
  { label: "Under Offer", color: "#f59e0b", pct: 13 },
  { label: "Maintenance", color: "#f43f5e", pct: 8 },
  { label: "Off Market", color: "#94a3b8", pct: 6 },
];

const DEFAULT_PROMINENT_HUBS = [
  { name: "Kilimani", slug: "kilimani" },
  { name: "Lavington", slug: "lavington" },
  { name: "Westlands", slug: "westlands" },
  { name: "Runda", slug: "runda" },
  { name: "Upper Hill", slug: "upper-hill" },
  { name: "Tatu City", slug: "tatu-city" },
  { name: "Nyali Coast", slug: "nyali" },
];

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
  showStatusRail = false,
  showCoverageHubs = true,
  showSlaFooter = true,
  className,
}: {
  slices: DialSlice[];
  totalLabel?: string;
  footnote?: DialFootnoteItem[];
  showStatusRail?: boolean;
  showCoverageHubs?: boolean;
  showSlaFooter?: boolean;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);

  const ShieldIcon = webIcons.shield;
  const PinIcon = webIcons.pin;

  // Largest first, so the tonal ramp encodes rank rather than array order.
  const ordered = [...slices].filter((slice) => slice.count > 0).sort((a, b) => b.count - a.count);
  const total = ordered.reduce((sum, slice) => sum + slice.count, 0);

  useGSAP(
    () => {
      registerWebMotion();
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline();

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

        // `.dial-rail-segment` only exists in the DOM when `showStatusRail`
        // renders it (the About page's card). The home hero's dial mounts
        // with the prop at its default `false`, so this selector matched
        // nothing there — GSAP logged "target not found" on every mount, in
        // dev doubled by Strict Mode's double-invoke. Gating the tween on the
        // same condition that gates the markup was the actual fix; the
        // console noise was a symptom, not a separate problem.
        if (showStatusRail) {
          tl.from(
            ".dial-rail-segment",
            {
              scaleX: 0,
              duration: DUR.base * 0.9,
              stagger: STAGGER.tight * 0.5,
              ease: "sun.settle",
              transformOrigin: "left center",
              clearProps: "all",
            },
            "<0.2"
          );
        }
      });

      return () => media.revert();
    },
    { scope: rootRef, dependencies: [total, showStatusRail] }
  );

  if (ordered.length === 0 || total === 0) return null;

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
        "w-full overflow-hidden rounded-[22px] border border-white/15 bg-black/35 backdrop-blur-xl shadow-[0_24px_55px_rgba(0,0,0,0.5)]",
        className
      )}
    >
      {/* ── Top Section: Circular SVG Portfolio Dial + Category Slices ── */}
      <div className="p-5 sm:p-6 pb-5">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="relative shrink-0">
            <svg
              viewBox="0 0 200 200"
              className="size-[108px] -rotate-90 sm:size-[124px]"
              role="img"
              aria-label={`Portfolio by type: ${arcs
                .map((arc) => `${arc.label}, ${arc.count}`)
                .join("; ")}. ${total} in total.`}
            >
              {/* Background track */}
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
                    strokeDasharray={`${arc.length} ${CIRCUMFERENCE}`}
                    strokeDashoffset={-offset}
                  />
                );
              })}
            </svg>

            {/* Central Total Scalar */}
            <div className="dial-total pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-[24px] font-medium leading-none tracking-tight text-white sm:text-[30px]">
                {total}
              </span>
              <span className="mt-1 font-mono text-web-nano uppercase tracking-[0.16em] text-slate-400 font-medium">
                {totalLabel}
              </span>
            </div>
          </div>

          {/* Category Rows */}
          <ul className="min-w-0 flex-1 space-y-0.5">
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
                    className="group flex items-center gap-2 rounded-md py-[4px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-yellow"
                  >
                    <IconComponent
                      aria-hidden="true"
                      size={13}
                      stroke={WEB_ICON_STROKE}
                      className="shrink-0 transition-colors"
                      style={{ color: isActive ? "var(--color-brand-yellow, #f3df27)" : arc.color }}
                    />
                    <span className="min-w-0 flex-1 text-web-micro text-slate-300 transition-colors group-hover:text-white font-normal leading-snug">
                      {arc.label}
                    </span>
                    <span className="font-mono shrink-0 text-web-micro tabular-nums text-slate-400 transition-colors group-hover:text-white font-medium">
                      {arc.count}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Optional standalone footnote bar (compact mode – home hero) */}
        {!showCoverageHubs && footnote && footnote.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-3.5">
            {footnote.map((item) =>
              item.kind === "stat" ? (
                <div key={item.label} className="flex items-baseline gap-1.5 font-mono">
                  <span className="text-web-sm font-medium leading-none text-white">
                    {item.value}
                  </span>
                  <span className="text-web-nano uppercase tracking-[0.14em] text-slate-400 font-medium">
                    {item.label}
                  </span>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="web-hit group ml-auto flex items-center gap-1.5 font-mono text-web-nano uppercase tracking-[0.14em] text-slate-300 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-yellow"
                >
                  {item.label}
                  <ArrowRightIcon />
                </Link>
              )
            )}
          </div>
        )}
      </div>

      {/* ── Estate Portfolio Health & Allocation Status Rail ── */}
      {showStatusRail && (
        <div className="border-t border-white/10 bg-white/[0.025] px-5 py-4 sm:px-6">
          {/* Rail header */}
          <div className="mb-2.5 flex items-center justify-between font-mono text-web-nano uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              Live Estate Portfolio Status
            </span>
            <span className="text-slate-500 font-medium">Allocation %</span>
          </div>

          {/* Segmented progress bar */}
          <div className="flex h-2 w-full overflow-hidden rounded-full gap-px" role="img" aria-label="Portfolio allocation by status">
            {STATUS_SEGMENTS.map((seg) => (
              <div
                key={seg.label}
                className="dial-rail-segment h-full rounded-sm"
                style={{ width: `${seg.pct}%`, backgroundColor: seg.color }}
                title={`${seg.label}: ${seg.pct}%`}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1.5">
            {STATUS_SEGMENTS.map((seg) => (
              <div key={seg.label} className="flex items-center gap-1.5">
                <span
                  className="size-2 shrink-0 rounded-sm"
                  style={{ backgroundColor: seg.color }}
                />
                <span className="font-mono text-web-nano text-slate-400 leading-none">
                  {seg.label}
                </span>
                <span className="font-mono text-web-nano text-slate-500 tabular-nums leading-none">
                  {seg.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Active Regional Mandate Hubs ── */}
      {showCoverageHubs && (
        <div className="border-t border-white/10 bg-white/[0.03] px-5 py-4 sm:px-6">
          <div className="flex items-center justify-between font-mono text-web-nano uppercase tracking-wider mb-2.5">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              Active Coverage Hubs
            </span>
            <Link
              href="/locations"
              className="text-slate-400 hover:text-white transition-colors underline-offset-2 hover:underline"
            >
              All {WEB_AREAS.length} Areas →
            </Link>
          </div>

          {/* Regional Area Pills — wraps freely on all screen sizes */}
          <div className="flex flex-wrap gap-1.5">
            {DEFAULT_PROMINENT_HUBS.map((hub) => (
              <Link
                key={hub.slug}
                href={`/locations/${hub.slug}`}
                className="inline-flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 font-mono text-web-micro text-slate-300 hover:text-white hover:bg-white/15 hover:border-white/20 transition-all"
              >
                <PinIcon size={10} stroke={2} className="text-slate-400 shrink-0" />
                <span>{hub.name}</span>
              </Link>
            ))}
            <Link
              href="/locations"
              className="inline-flex items-center rounded-lg bg-white/5 border border-white/10 px-2 py-1 font-mono text-web-micro text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              +{WEB_AREAS.length - DEFAULT_PROMINENT_HUBS.length} more
            </Link>
          </div>
        </div>
      )}

      {/* ── Sub-Footer: Verified SLA Reassurance & Owner/Tenant Portal Link ── */}
      {showSlaFooter && (
        <div className="border-t border-white/8 bg-black/20 px-5 py-2.5 sm:px-6 flex items-center justify-between font-mono text-web-nano text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldIcon size={11} stroke={2} className="text-emerald-400" />
            <span>Contractual SLA & Escrow</span>
          </span>
          <Link
            href="/login"
            className="group flex items-center gap-1.5 uppercase tracking-wider text-slate-300 transition-colors hover:text-white"
          >
            <span>Owner &amp; Tenant Sign-in</span>
            <ArrowRightIcon />
          </Link>
        </div>
      )}
    </div>
  );
}
