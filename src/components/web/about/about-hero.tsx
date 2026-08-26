"use client";

import Image from "next/image";
import { useRef } from "react";
import { useHeroMotion } from "@/lib/motion/use-hero-motion";
import { ABOUT_HERO } from "../constants/about.content";
import { WEB_ICON_STROKE, webIcons } from "../icons";
import { Breadcrumbs } from "../primitives/breadcrumbs";
import { WebButtonLink } from "../primitives/button";

const ABOUT_GUARANTEES = [
  { lead: "Whole-Life", rest: "Asset Mandate" },
  { lead: "100%", rest: "Named Accountability" },
  { lead: "20+", rest: "Nairobi Hubs" },
] as const;

export function AboutHero() {
  const ArrowIcon = webIcons.arrow;
  const CheckIcon = webIcons.check;

  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);

  useHeroMotion({ scopeRef: sectionRef, headlineRef, leadRef });

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-hero-heading"
      className="web-dark relative z-10 flex min-h-[58svh] sm:min-h-[62svh] lg:min-h-[66svh] flex-col overflow-hidden bg-brand-dark pb-10 sm:pb-12 pt-28 sm:pt-32 lg:pt-40"
    >
      {/* ── Background Photography & Layered Atmospheric Scrims (Right Scrim Blend) ── */}
      <div className="hero-bg gsap-enter pointer-events-none absolute inset-0 z-0 overflow-hidden bg-brand-deep">
        <Image
          src="/images/about-hero.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          quality={100}
          className="hero-bg-media object-cover object-left sm:object-center opacity-80"
        />
        {/* Layered atmospheric scrims identical to Properties/Landlords hero */}
        <div
          aria-hidden="true"
          className="hero-scrim absolute inset-0 bg-gradient-to-b from-black/40 via-transparent via-35% to-transparent"
        />
        <div
          aria-hidden="true"
          className="hero-scrim absolute inset-0 bg-gradient-to-l from-black/65 via-black/30 via-55% to-transparent"
        />
        <div
          aria-hidden="true"
          className="hero-scrim absolute inset-0 bg-gradient-to-b from-transparent via-brand-deep/30 to-brand-dark"
        />
      </div>

      {/* ── Editorial Content (Flipped Right-Aligned Typography & Controls) ── */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-end px-6 sm:px-8 lg:px-12 xl:px-14">
        {/* Breadcrumb row — aligned right */}
        <div className="mb-6 flex items-center lg:flex-row-reverse gap-2.5 opacity-85 lg:ml-auto">
          <span
            aria-hidden="true"
            className="hero-crumb-line gsap-enter inline-block h-px w-6 shrink-0 bg-brand-yellow"
          />
          <span className="hero-crumb-text gsap-enter">
            <Breadcrumbs
              items={[{ label: "Home", href: "/" }, { label: "About" }]}
              tone="dark"
            />
          </span>
        </div>

        {/* Headline & Lead Column — Full width without max-w restriction */}
        <div className="w-full lg:text-right lg:ml-auto">
          <h1
            id="about-hero-heading"
            ref={headlineRef}
            className="web-title gsap-enter w-full text-[clamp(2.4rem,4.2vw,4.5rem)] font-normal leading-[1.06] tracking-tight text-white drop-shadow-md lg:text-right lg:ml-auto"
          >
            {ABOUT_HERO.headline}
          </h1>

          {/* Lead */}
          <div className="mt-5 flex flex-col lg:flex-row-reverse lg:items-end justify-between gap-6 pt-1">
            <p
              ref={leadRef}
              className="web-subtitle gsap-enter max-w-[64ch] text-base sm:text-lg leading-relaxed text-slate-200/90 font-normal drop-shadow-sm lg:text-right lg:ml-auto"
            >
              {ABOUT_HERO.lead}
            </p>
          </div>
        </div>

        {/* ── Base Rule: Action Triggers & Credibility Badges (Flipped) ── */}
        <div className="mt-8 sm:mt-10 flex flex-wrap-reverse items-center justify-between gap-6 border-t border-white/15 pt-5 sm:pt-6 lg:flex-row-reverse">
          {/* Action Row - Aligned to Right */}
          <div className="hero-detail gsap-enter flex flex-wrap items-center lg:justify-end gap-3.5">
            <WebButtonLink href="#team" variant="primary" size="md">
              Meet the Team
            </WebButtonLink>

            <a
              href="#commitments"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-xs font-mono font-medium uppercase tracking-wider text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/40 active:scale-95"
            >
              <span>Our Commitments</span>
              <ArrowIcon size={14} stroke={WEB_ICON_STROKE} aria-hidden="true" />
            </a>
          </div>

          {/* Core Institutional Trust Badges - Aligned to Left */}
          <div className="flex flex-wrap items-center gap-y-2.5 gap-x-6 sm:gap-x-8 font-mono text-xs text-slate-300">
            {ABOUT_GUARANTEES.map((g) => (
              <div key={g.lead} className="hero-detail gsap-enter flex items-center gap-2">
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckIcon size={11} stroke={2.5} aria-hidden="true" />
                </span>
                <span>
                  <strong className="text-white font-medium">{g.lead}</strong>{" "}
                  <span className="text-slate-400">{g.rest}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
