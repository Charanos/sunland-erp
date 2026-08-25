"use client";

import Image from "next/image";
import { useRef } from "react";
import { useHeroMotion } from "@/lib/motion/use-hero-motion";

/**
 * Animated hero shell for /properties and its facet pages.
 *
 * The choreography — scene, scrims, breadcrumb rule, masked headline, cascading
 * lead, accent pill, desktop parallax — lives in `useHeroMotion`, shared with
 * every other L2 hero so all five read as one hand. This file keeps only what
 * is genuinely specific to Properties: the photograph, the left-aligned
 * composition, and the live count pill sitting inline with the lead.
 *
 * No element is hidden by CSS that only a tween can reveal. The hidden state is
 * applied inside a reduced-motion branch guard, so if JS is slow or absent the
 * page is fully readable.
 */
export function PropertiesHero({
  title,
  lead,
  breadcrumbSlot,
  countSlot,
  children,
}: {
  title: string;
  lead: string;
  /** Rendered breadcrumbs node — passed as a slot so the parent (server) owns href logic */
  breadcrumbSlot: React.ReactNode;
  /** The live count pill — server-rendered, passed as a slot */
  countSlot: React.ReactNode;
  /** Content below the title/lead row (filter search bar etc.) */
  children?: React.ReactNode;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);

  useHeroMotion({ scopeRef: sectionRef, headlineRef, leadRef });

  return (
    <section
      ref={sectionRef}
      className="web-dark relative z-10 flex min-h-[68svh] sm:min-h-[72svh] flex-col overflow-hidden pb-14 pt-32 sm:pt-36 lg:pt-44"
    >
      {/* ── Background ── */}
      <div className="hero-bg gsap-enter pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#090d1f]">
        <Image
          src="/images/properties-hero.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority
          // The source is 1376px wide, so on a wide desktop this is already
          // being upscaled by CSS. Letting the optimizer serve AVIF at 90 is
          // what keeps that upscale from also carrying JPEG ringing on top of
          // it; `unoptimized` here would ship the raw file and do both.
          sizes="100vw"
          quality={90}
          className="hero-bg-media object-cover object-center opacity-80"
        />
        {/* Layered atmospheric scrims */}
        <div
          aria-hidden="true"
          className="hero-scrim absolute inset-0 bg-gradient-to-b from-black/40 via-transparent via-35% to-transparent"
        />
        <div
          aria-hidden="true"
          className="hero-scrim absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 via-55% to-transparent"
        />
        <div
          aria-hidden="true"
          className="hero-scrim absolute inset-0 bg-gradient-to-b from-transparent via-[#090d1f]/30 to-[#151936]"
        />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-end px-6 sm:px-8 lg:px-12 xl:px-14">
        {/* Breadcrumbs row — invisible rule used as an animation target */}
        <div className="mb-6 flex items-center gap-2.5 opacity-85">
          <span
            aria-hidden="true"
            className="hero-crumb-line gsap-enter inline-block h-px w-6 shrink-0 bg-white/50"
          />
          <span className="hero-crumb-text gsap-enter">{breadcrumbSlot}</span>
        </div>

        <div className="w-full">
          {/* Headline */}
          <h1
            ref={headlineRef}
            className="web-title gsap-enter w-full text-[clamp(2.4rem,4.2vw,4.5rem)] font-normal leading-[1.06] tracking-tight text-white drop-shadow-md"
          >
            {title}
          </h1>

          {/* Lead + count row */}
          <div className="mt-5 flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-1">
            {lead && (
              <p
                ref={leadRef}
                className="web-subtitle gsap-enter max-w-[62ch] text-base sm:text-lg leading-relaxed text-slate-200/90 drop-shadow-sm"
              >
                {lead}
              </p>
            )}

            {/* Count pill — the yellow beat */}
            <div className="hero-accent gsap-enter flex shrink-0 items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 backdrop-blur-md shadow-sm">
              {countSlot}
            </div>
          </div>
        </div>

        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
