"use client";

import Image from "next/image";
import { useRef } from "react";
import { useHeroMotion } from "@/lib/motion/use-hero-motion";
import { SERVICES_HERO } from "../constants/services.content";
import { WEB_ICON_STROKE, webIcons } from "../icons";
import { Breadcrumbs } from "../primitives/breadcrumbs";

/** The licensing and governance claims along the hero's base rule. */
const SERVICES_CREDENTIALS = [
  "EARB & ISK Licensed Practitioners",
  "Full ERP Lifecycle Management",
  "Institutional Portfolio Governance",
] as const;

/**
 * Animated hero shell for /services.
 *
 * This hero previously had no motion at all while three of its siblings did,
 * which is why the site felt like it lost its footing on this page: the header
 * animated in over a hero that was simply already there. It now runs the same
 * `useHeroMotion` choreography as the rest, with the practice directory marked
 * `hero-aside-item` so the four rows deal themselves out rather than appearing
 * as one slab.
 */
export function ServicesHero() {
  const ArrowIcon = webIcons.arrow;
  const CheckIcon = webIcons.check;

  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);

  useHeroMotion({ scopeRef: sectionRef, headlineRef, leadRef });

  return (
    <section
      ref={sectionRef}
      aria-labelledby="services-hero-heading"
      className="web-dark relative z-10 web-hero-l2 bg-brand-dark"
    >
      {/* ── Background ── */}
      <div className="hero-bg gsap-enter pointer-events-none absolute inset-0 z-0 overflow-hidden bg-brand-deep">
        <Image
          src="/images/services-hero.jpg"
          // Decorative: the section is already labelled by its h1, and the
          // photograph carries no information the copy does not. It cannot be
          // both aria-hidden and carry a described alt, which is what it was
          // doing before — the two cancel out and only confuse a maintainer.
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          // `unoptimized` was the reason this hero looked soft: it ships the
          // raw 1376px JPEG at whatever the browser asks for, with no AVIF and
          // no srcset, so a wide display upscaled an already-compressed file.
          quality={90}
          className="hero-bg-media object-cover object-center opacity-85"
        />
        {/* Layered atmospheric scrims — balanced for text clarity and nav blending */}
        <div
          aria-hidden="true"
          className="hero-scrim absolute inset-0 bg-gradient-to-b from-black/60 via-transparent via-30% to-transparent"
        />
        <div
          aria-hidden="true"
          className="hero-scrim absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 via-45% to-black/25 lg:to-transparent"
        />
        <div
          aria-hidden="true"
          className="hero-scrim absolute inset-0 bg-gradient-to-t from-brand-deep via-brand-deep/70 via-20% to-transparent"
        />
      </div>

      {/* ── Content (Left-Aligned Editorial Architecture) ── */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-end px-6 sm:px-8 lg:px-12 xl:px-14">
        {/* Breadcrumbs row — hairline rule + subtle trail */}


        <div className="w-full grid gap-12 lg:gap-16 lg:grid-cols-[1.15fr_minmax(0,0.85fr)] items-end">
          {/* Left Column: Headline & Strategic Narrative */}
          <div className="space-y-6">
            <div className="mb-6 flex items-center gap-2.5 opacity-85">
              <span
                aria-hidden="true"
                className="hero-crumb-line gsap-enter inline-block h-px w-6 shrink-0 bg-white/50"
              />
              {/* The shared primitive rather than a hand-rolled trail: it is
                  the only version that emits a real <nav aria-label> and drops
                  the link on the current page, and it is what /areas already
                  uses. Three spellings of one component across five heroes is
                  how the chevron ends up a different glyph on every page. */}
              <span className="hero-crumb-text gsap-enter">
                <Breadcrumbs
                  items={[{ label: "Home", href: "/" }, { label: "Services" }]}
                  tone="dark"
                />
              </span>
            </div>

            <h1
              id="services-hero-heading"
              ref={headlineRef}
              className="font-editorial gsap-enter text-[clamp(2.4rem,4.4vw,4.6rem)] font-medium leading-[1.05] tracking-tight text-white drop-shadow-md text-balance"
            >
              {SERVICES_HERO.headline}
            </h1>

            <p
              ref={leadRef}
              className="web-subtitle gsap-enter max-w-[58ch] text-web-sm sm:text-web-body leading-relaxed text-slate-200/90 drop-shadow-sm font-normal"
            >
              {SERVICES_HERO.lead}
            </p>
          </div>

          {/* Right Column: Architectural Capability Directory (Jump Nav) */}
          <div className="w-full">
            <div className="hero-aside-item gsap-enter flex items-center justify-between pb-3 mb-1 border-b border-white/15">
              <span className="font-mono text-web-micro uppercase tracking-[0.2em] text-slate-400 font-medium">
                Practice Directory
              </span>
              {/* Derived, so adding a fifth practice cannot leave the label
                  claiming four. */}
              <span className="font-mono text-web-micro text-brand-yellow font-medium">
                {SERVICES_HERO.jumpLinks.length} Practice Areas
              </span>
            </div>

            <nav aria-label="Services Practice Directory" className="divide-y divide-white/10">
              {SERVICES_HERO.jumpLinks.map((link, index) => {
                const num = `0${index + 1}`;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className="hero-aside-item gsap-enter group flex items-center justify-between gap-4 py-4 sm:py-4.5 transition-all duration-200 hover:pl-2"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs text-brand-yellow/80 transition-colors group-hover:text-brand-yellow font-medium">
                        {num}
                      </span>
                      <span className="text-web-sm sm:text-web-body text-slate-200 transition-colors group-hover:text-white font-normal">
                        {link.label}
                      </span>
                    </div>

                    <span className="flex size-7 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-300 transition-all duration-300 group-hover:border-brand-yellow group-hover:bg-brand-yellow group-hover:text-brand-dark group-hover:scale-110">
                      <ArrowIcon
                        size={12}
                        stroke={WEB_ICON_STROKE}
                        aria-hidden="true"
                        className="shrink-0 -rotate-45"
                      />
                    </span>
                  </a>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Strip: Quality Credibility Markers */}
        <div className="mt-10 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-6 text-xs text-slate-300">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            {SERVICES_CREDENTIALS.map((credential) => (
              <div key={credential} className="hero-detail gsap-enter flex items-center gap-2">
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckIcon size={11} stroke={WEB_ICON_STROKE} aria-hidden="true" />
                </span>
                <span>{credential}</span>
              </div>
            ))}
          </div>

          <div className="hero-detail gsap-enter font-mono text-web-micro uppercase tracking-widest text-slate-400">
            Nairobi &amp; Regional Practice
          </div>
        </div>
      </div>
    </section>
  );
}
