"use client";

import Image from "next/image";
import { useRef } from "react";
import { useHeroMotion } from "@/lib/motion/use-hero-motion";
import { Breadcrumbs } from "../primitives/breadcrumbs";

/**
 * Animated hero shell for /locations.
 *
 * Shares `useHeroMotion` with every other L2 hero, so the choreography is
 * identical by construction rather than by three files agreeing to stay in
 * sync. What is deliberately its own here is the composition: Areas flips the
 * copy to the right edge, against a photograph weighted left, so the directory
 * below it does not open on the same axis every other page does.
 */
export function LocationsHero({
  headline,
  lead,
}: {
  headline: string;
  lead: string;
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
      <div className="hero-bg gsap-enter pointer-events-none absolute inset-0 z-0 overflow-hidden bg-brand-deep">
        <Image
          src="/images/areas-hero.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          quality={90}
          // object-center is deliberate: this frame was chosen for how it sits
          // against the right-aligned headline, and the centre band is what
          // that balance was judged on. Do not re-anchor it to chase more of
          // the skyline — the composition is the point, not the crop.
          className="hero-bg-media object-cover object-center opacity-80"
        />
        {/* Layered atmospheric scrims */}
        <div
          aria-hidden="true"
          className="hero-scrim absolute inset-0 bg-gradient-to-b from-black/50 via-transparent via-35% to-transparent"
        />
        <div
          aria-hidden="true"
          className="hero-scrim absolute inset-0 bg-gradient-to-l from-black/70 via-black/35 via-55% to-transparent"
        />
        <div
          aria-hidden="true"
          className="hero-scrim absolute inset-0 bg-gradient-to-b from-transparent via-brand-deep/40 to-brand-dark"
        />
      </div>

      {/* ── Content (Right-Aligned Typography Flip) ── */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-end px-6 sm:px-8 lg:px-12 xl:px-14">
        {/* Breadcrumbs row — aligned right, hairline on right */}
        <div className="mb-6 flex items-center lg:flex-row-reverse gap-2.5 opacity-85 lg:ml-auto">
          <span
            aria-hidden="true"
            className="hero-crumb-line gsap-enter inline-block h-px w-6 shrink-0 bg-white/50"
          />
          <span className="hero-crumb-text gsap-enter">
            <Breadcrumbs
              items={[{ label: "Home", href: "/" }, { label: "Areas" }]}
              tone="dark"
            />
          </span>
        </div>

        <div className="w-full lg:text-right lg:ml-auto">
          {/* Headline */}
          <h1
            ref={headlineRef}
            className="web-title gsap-enter w-full text-[clamp(2.4rem,4.2vw,4.5rem)] font-normal leading-[1.06] tracking-tight text-white drop-shadow-md lg:text-right"
          >
            {headline}
          </h1>

          {/* Lead row */}
          <div className="mt-5 flex flex-col lg:flex-row-reverse lg:items-end justify-between gap-6 pt-1">
            <p
              ref={leadRef}
              className="web-subtitle gsap-enter max-w-[62ch] text-base sm:text-lg leading-relaxed text-slate-200/90 drop-shadow-sm lg:text-right lg:ml-auto"
            >
              {lead}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
