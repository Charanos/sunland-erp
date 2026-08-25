"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useHeroMotion } from "@/lib/motion/use-hero-motion";
import { LANDLORDS } from "../constants/landlords.content";
import { WEB_ICON_STROKE, webIcons } from "../icons";
import { Breadcrumbs } from "../primitives/breadcrumbs";
import { WebButtonLink } from "../primitives/button";

/** The three commercial guarantees along the hero's base rule. */
const LANDLORD_GUARANTEES = [
  { lead: "5th of Month", rest: "Guaranteed Remittance" },
  { lead: "10%", rest: "Management Fee" },
  { lead: "0%", rest: "Tenant Finding Fee" },
] as const;

/**
 * Animated hero shell for /landlords.
 *
 * Like /services this carried the sibling heroes' class names but none of their
 * motion, so the highest-value page on the site was the one that sat still. It
 * now runs the shared `useHeroMotion`, with the action row and guarantee strip
 * marked `hero-detail` so they resolve after the argument has been made.
 */
export function LandlordHero() {
  const ArrowIcon = webIcons.arrow;
  const CheckIcon = webIcons.check;

  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);

  useHeroMotion({ scopeRef: sectionRef, headlineRef, leadRef });

  return (
    <section
      ref={sectionRef}
      aria-labelledby="landlord-hero-heading"
      className="web-dark relative z-10 flex min-h-[68svh] sm:min-h-[72svh] lg:min-h-[78svh] flex-col overflow-hidden bg-brand-dark pb-14 pt-32 sm:pt-36 lg:pt-44"
    >
      {/* ── Background ── */}
      <div className="hero-bg gsap-enter pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#090d1f]">
        <Image
          // The .jpg, not the .png. Both files are the same 1376x768 frame, but
          // the PNG is 1.5MB to the JPEG's 883KB because PNG is a lossless
          // format being asked to store a photograph. Combined with the
          // `unoptimized` flag that was here, this hero was shipping a megabyte
          // and a half of un-negotiable bytes before the optimizer saw it.
          src="/images/landlords-hero.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          quality={90}
          className="hero-bg-media object-cover object-center opacity-80"
        />
        {/* Layered atmospheric scrims identical to Properties Hero */}
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
          className="hero-scrim absolute inset-0 bg-gradient-to-b from-transparent via-[#090d1f]/30 to-[#151936]"
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
              items={[{ label: "Home", href: "/" }, { label: "Landlords" }]}
              tone="dark"
            />
          </span>
        </div>

        <div className="w-full lg:text-right lg:ml-auto">
          {/* Headline — identical typography, size, and weight to Properties Hero */}
          <h1
            id="landlord-hero-heading"
            ref={headlineRef}
            className="web-title gsap-enter w-full text-[clamp(2.4rem,4.2vw,4.5rem)] font-normal leading-[1.06] tracking-tight text-white drop-shadow-md"
          >
            Every unit tracked. Every shilling accounted for.
          </h1>

          {/* Lead + count row — right aligned text */}
          <div className="mt-5 flex flex-col lg:flex-row-reverse lg:items-end justify-between gap-6 pt-1">
            <p
              ref={leadRef}
              className="web-subtitle gsap-enter max-w-[64ch] text-base sm:text-lg leading-relaxed text-slate-200/90 drop-shadow-sm lg:text-right lg:ml-auto"
            >
              We manage residential, commercial, and mixed-use property across Nairobi on our dedicated ERP platform. Tenants are vetted, rent is reconciled the day it lands, repairs are quoted with photos, and you track live portfolio performance 24/7.
            </p>
          </div>
        </div>

        {/* Action Row & Guarantees Bar - Flipped */}
        <div className="mt-8 flex flex-wrap-reverse items-center justify-between gap-6 border-t border-white/15 pt-6 lg:flex-row-reverse">
          <div className="hero-detail gsap-enter flex flex-wrap items-center lg:justify-end gap-4">
            <Link
              href="/login"
              className="text-xs font-medium text-slate-300 hover:text-brand-yellow transition-colors inline-flex items-center gap-1.5 lg:mr-2"
            >
              <span>Owner ERP Portal</span>
              <ArrowIcon size={13} stroke={WEB_ICON_STROKE} aria-hidden="true" />
            </Link>

            <WebButtonLink href="#valuation" variant="primary" size="lg">
              {LANDLORDS.hero.primary.label}
            </WebButtonLink>

            <a
              href="#fees"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur-md transition-all hover:bg-white/15 hover:border-white/30"
            >
              <span>Explore Fee Structure</span>
              <ArrowIcon size={16} stroke={WEB_ICON_STROKE} aria-hidden="true" />
            </a>
          </div>

          {/* Three Key Trust Badges */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-300 font-medium">
            {LANDLORD_GUARANTEES.map((guarantee) => (
              <div key={guarantee.lead} className="hero-detail gsap-enter flex items-center gap-2">
                <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckIcon size={11} stroke={WEB_ICON_STROKE} aria-hidden="true" />
                </span>
                <span>
                  <strong className="text-white font-medium">{guarantee.lead}</strong>{" "}
                  {guarantee.rest}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
