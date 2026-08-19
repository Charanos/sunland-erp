"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { StatBlock, type WebStat } from "../primitives/stat-block";
import { heroDefaults } from "./home.defaults";
import { HeroSearch } from "./hero-search";

/**
 * 01 home.hero, cinematic full-bleed band.
 *
 * Content is pinned to the bottom of the section so the architecture is
 * visible above it, with the headline sitting directly over the search panel.
 *
 * ── Two things that were wrong and are load-bearing ──
 *
 * **Height.** `100vh` on a phone measures the viewport with the URL bar
 * retracted, so the section was taller than the visible screen and the search
 * panel, its lowest and most important element, sat under the fold on first
 * paint. `.web-hero-shell` uses `100svh`, the small viewport, and below 640px
 * lets the hero size to its content against a floor.
 *
 * **The entrance must not be able to hide the page.** Every animated element
 * used to be tweened from `opacity: 0`, which is fine when the bundle arrives
 * and catastrophic when it does not: on a slow connection, or with JavaScript
 * blocked, the visitor got an empty hero. The markup now ships visible and
 * GSAP sets the `from` state itself, inside a `matchMedia` branch that never
 * runs under `prefers-reduced-motion: reduce`. Nothing is hidden by CSS that
 * only a tween can bring back.
 */
export function HomeHero({
  stats,
  areas,
}: {
  /** Null hides the strip entirely rather than rendering zeros. */
  stats: WebStat[] | null;
  areas: string[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // `from` rather than `fromTo`: the resting state is what the markup
        // already renders, so GSAP only has to describe where things start.
        // If this never runs, the hero is simply already correct.
        tl.from(".gsap-bg", { scale: 1.08, opacity: 0, duration: 1.8, ease: "power2.out" })
          .from(
            ".gsap-eyebrow-line",
            { scaleX: 0, transformOrigin: "left center", duration: 0.7 },
            "-=1.1"
          )
          .from(".gsap-eyebrow-text", { opacity: 0, x: -12, duration: 0.6 }, "-=0.5")
          .from(".gsap-headline", { y: 35, opacity: 0, duration: 1.0, ease: "power4.out" }, "-=0.6")
          .from(".gsap-search-panel", { y: 24, opacity: 0, duration: 0.85 }, "-=0.5")
          .from(
            ".gsap-pill",
            { y: 12, opacity: 0, duration: 0.45, stagger: 0.05, ease: "back.out(1.5)" },
            "-=0.4"
          )
          .from(".gsap-telemetry-hud", { x: 30, opacity: 0, duration: 0.9 }, "-=0.8")
          .from(
            ".stat-tile",
            { y: 16, opacity: 0, duration: 0.5, stagger: 0.07, ease: "power2.out" },
            "-=0.6"
          );

        return () => tl.kill();
      });

      // Reduced motion: no branch registered, so nothing is ever set to
      // opacity 0 and the hero renders at rest.

      return () => media.revert();
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      aria-labelledby="hero-heading"
      className="web-dark web-hero-shell relative grid grid-rows-[1fr_auto] overflow-hidden"
    >
      <div className="gsap-bg gsap-enter absolute inset-0 z-0">
        <Image
          src="/images/hero-bg-4k.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority
          // Explicit, because the browser picks a candidate before layout and
          // a full-width guess ships a 4K image to a 390px phone.
          sizes="100vw"
          quality={82}
          className="object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-slate-950/65 via-slate-950/20 to-slate-950/92"
        />
      </div>

      {/* Row 1 absorbs the free space so the cluster below sits on the floor.
          On mobile it collapses, because the shell is content-height there. */}
      <div aria-hidden="true" className="min-h-[18svh] sm:min-h-0" />

      {/* Row 2: the content cluster. Top padding clears the transparent
          header, which is 72px on a phone and 96px above 640. */}
      <div className="relative z-raised pb-10 pt-24 sm:pt-28 lg:pb-14">
        <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-8 lg:px-12 xl:px-14">
          {/* Upper row: the pitch on the left, the figures on the right. The
              search panel is deliberately NOT in this grid, because a search
              field is the widest control on the page and boxing it into 60% of
              the viewport shrinks the location input, which is the field
              everyone actually types in. */}
          <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-[1.55fr_1fr] lg:gap-10 xl:grid-cols-[1.6fr_0.9fr]">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="gsap-eyebrow-line gsap-enter h-[2px] w-10 shrink-0 bg-[#f3df27]/90"
                />
                <p className="gsap-eyebrow-text gsap-enter web-eyebrow font-medium uppercase tracking-[0.2em] text-slate-200">
                  {heroDefaults.eyebrow}
                </p>
              </div>

              <h1
                id="hero-heading"
                className="gsap-headline gsap-enter mb-4 font-editorial text-[clamp(2.5rem,5.2vw,5.5rem)] font-medium leading-[1.05] tracking-tight text-white lg:whitespace-nowrap"
                style={{ textShadow: "0 4px 24px rgba(0,0,0,0.6)" }}
              >
                {heroDefaults.headline}
              </h1>

              {/* The lead was in the design and had been dropped. It is the
                  only place the hero says what the business actually does, and
                  a headline of three words cannot carry that alone. */}
              <p className="gsap-headline gsap-enter mb-6 max-w-[54ch] text-[15px] leading-relaxed text-slate-200/90 sm:text-base">
                {heroDefaults.lead}
              </p>

            </div>

            {stats && stats.length > 0 && (
              <div className="gsap-telemetry-hud gsap-enter">
                <StatBlock stats={stats} variant="hud" />
              </div>
            )}
          </div>

          {/* Full-bleed search, the width of the content column. */}
          <div className="gsap-search-panel gsap-enter mt-8 lg:mt-10">
            <HeroSearch areas={areas} />
          </div>

          <div className="mt-3.5 flex flex-wrap items-center gap-x-2.5 gap-y-2">
            <span className="gsap-pill gsap-enter web-control text-[11px] font-medium uppercase tracking-[0.16em] text-slate-300">
              Popular:
            </span>
            {heroDefaults.quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="gsap-pill gsap-enter web-control web-hit rounded-full border border-white/15 bg-slate-950/40 px-4 py-1.5 text-xs tracking-wide text-slate-200 shadow-sm backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-white/35 hover:bg-slate-950/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-yellow"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
