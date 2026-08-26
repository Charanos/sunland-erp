"use client";

import Image from "next/image";
import { useRef } from "react";
import { useHeroMotion } from "@/lib/motion/use-hero-motion";
import { WEB_ICON_STROKE, webIcons } from "@/components/web/icons";
import { Breadcrumbs } from "@/components/web/primitives/breadcrumbs";

/** The editorial-independence claims, as data so the row staggers uniformly. */
const INSIGHTS_ASSURANCES = [
  { lead: "100% Verified", rest: "Realized Data" },
  { lead: "Zero", rest: "Sponsored Content" },
  { lead: "Practitioner", rest: "Authored" },
] as const;

/**
 * Animated hero shell for /insights.
 *
 * Shares `useHeroMotion` with every other L2 hero. The credibility strip along
 * the bottom is marked `hero-detail`, which is what earns it the staggered
 * entrance rather than arriving as one block.
 */
export function InsightsHero({ articleCount }: { articleCount: number }) {
  const CheckIcon = webIcons.check;

  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);

  useHeroMotion({ scopeRef: sectionRef, headlineRef, leadRef });

  return (
    <section
      ref={sectionRef}
      aria-labelledby="insights-hero-heading"
      className="web-dark relative z-10 flex min-h-[68svh] sm:min-h-[72svh] lg:min-h-[76svh] flex-col overflow-hidden pb-14 pt-32 sm:pt-36 lg:pt-44"
    >
      {/* ── Background Photography & Layered Scrims ── */}
      <div className="hero-bg gsap-enter pointer-events-none absolute inset-0 z-0 overflow-hidden bg-brand-deep">
        <Image
          src="/images/insights-hero-right.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          quality={100}
          className="hero-bg-media object-cover object-center opacity-80"
        />
        <div aria-hidden="true" className="hero-scrim absolute inset-0 bg-gradient-to-b from-black/40 via-transparent via-35% to-transparent" />
        <div aria-hidden="true" className="hero-scrim absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 via-55% to-transparent" />
        <div aria-hidden="true" className="hero-scrim absolute inset-0 bg-gradient-to-b from-transparent via-brand-deep/30 to-brand-dark" />
      </div>

      {/* ── Content (Left-Aligned Unified Typography) ── */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-end px-6 sm:px-8 lg:px-12 xl:px-14">
        {/* Breadcrumbs row */}
        <div className="mb-6 flex items-center gap-2.5 opacity-85">
          <span aria-hidden="true" className="hero-crumb-line gsap-enter inline-block h-px w-6 shrink-0 bg-white/50" />
          <span className="hero-crumb-text gsap-enter">
            <Breadcrumbs
              items={[{ label: "Home", href: "/" }, { label: "Insights" }]}
              tone="dark"
            />
          </span>
        </div>

        <div className="w-full">
          {/* Headline — identical typography, size, and weight to Properties Hero */}
          <h1
            id="insights-hero-heading"
            ref={headlineRef}
            className="web-title gsap-enter w-full text-[clamp(2.4rem,4.2vw,4.5rem)] font-normal leading-[1.06] tracking-tight text-white drop-shadow-md"
          >
            Worth reading before you sign anything.
          </h1>

          {/* Lead + count row */}
          <div className="mt-5 flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-1">
            <p ref={leadRef} className="web-subtitle gsap-enter max-w-[64ch] text-base sm:text-lg leading-relaxed text-slate-200/90 drop-shadow-sm">
              Practical writing on Nairobi property from the people managing it: what things cost,
              what the paperwork should say, and where owners and tenants get caught out.
            </p>

            {/* Live Count Pill */}
            <div className="hero-accent gsap-enter flex shrink-0 items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 backdrop-blur-md shadow-sm text-xs font-mono text-white">
              <span className="size-1.5 rounded-full bg-brand-yellow" />
              {/* Counted from the published set, not typed in. A hardcoded "7"
                  silently becomes a lie the first time an article is added. */}
              <span>
                {articleCount} Verified {articleCount === 1 ? "Advisory" : "Advisories"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Row & Guarantees Bar - filter removed, keeping guarantees with some style polish */}
        <div className="mt-8 pt-6 border-t border-white/15">
          <div className="flex flex-wrap items-center gap-y-3 gap-x-8 text-web-xs text-slate-300 font-medium">
            {INSIGHTS_ASSURANCES.map((item) => (
              <div key={item.lead} className="hero-detail gsap-enter flex items-center gap-2.5">
                <span className="flex size-4.5 items-center justify-center rounded-full bg-brand-yellow/20 text-brand-yellow">
                  <CheckIcon size={12} stroke={WEB_ICON_STROKE} aria-hidden="true" />
                </span>
                <span>
                  {/* font-medium, not semibold: the §08 amendment puts body
                      emphasis at 500, and the matching strip on /landlords
                      already reads at 500. Two strips of the same component at
                      two weights is the kind of drift nobody reports but
                      everybody feels. */}
                  <strong className="text-white font-medium tracking-wide">{item.lead}</strong>{" "}
                  {item.rest}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
