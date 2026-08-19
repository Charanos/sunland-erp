"use client";

import { useGSAP } from "@gsap/react";
import { IconArrowUpRight } from "@tabler/icons-react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { StatBlock, type WebStat } from "../primitives/stat-block";
import { HeroSearch } from "./hero-search";
import { heroDefaults } from "./home.defaults";

/**
 * 01 home.hero, cinematic full-bleed luxury band.
 *
 * Breathable, unboxed layout that lets the architectural sunset villa and
 * high-contrast typography shine with precision and executive prestige.
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
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".gsap-bg",
        { scale: 1.08, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.8, ease: "power2.out" }
      )
        .fromTo(
          ".gsap-eyebrow-line",
          { scaleX: 0 },
          { scaleX: 1, transformOrigin: "left center", duration: 0.7, ease: "power3.out" },
          "-=1.1"
        )
        .fromTo(
          ".gsap-eyebrow-text",
          { opacity: 0, x: -12 },
          { opacity: 1, x: 0, duration: 0.6 },
          "-=0.5"
        )
        .fromTo(
          ".gsap-headline",
          { y: 35, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.0, ease: "power4.out" },
          "-=0.6"
        )
        .fromTo(
          ".gsap-lead",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.6"
        )
        .fromTo(
          ".gsap-search-panel",
          { y: 24, opacity: 0, scale: 0.98 },
          { y: 0, opacity: 1, scale: 1, duration: 0.85, ease: "power3.out" },
          "-=0.5"
        )
        .fromTo(
          ".gsap-pill",
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, stagger: 0.05, ease: "back.out(1.5)" },
          "-=0.4"
        )
        .fromTo(
          ".gsap-telemetry-hud",
          { x: 30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
          "-=0.9"
        )
        .fromTo(
          ".stat-tile",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.07, ease: "power2.out" },
          "-=0.6"
        );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      aria-labelledby="hero-heading"
      className="web-dark overflow-hidden relative"
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateRows: "1fr auto",
      }}
    >
      {/* Full-bleed cinematic background image */}
      <div className="absolute inset-0 z-0 gsap-bg">
        <Image
          src="/images/hero-bg-4k.jpg"
          alt="Luxury architectural property at sunset"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Layered atmospheric scrims: Deep obsidian gradient on left for crystal-clear readability, warm twilight radiance on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/23 via-slate-950/13 via-50% to-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/17 via-transparent via-35% to-slate-950/90" />
        <div className="pointer-events-none absolute -bottom-32 left-1/4 h-96 w-96 rounded-full bg-[#f3df27]/5 blur-3xl" />
      </div>

      {/* Grid row 1: Top spacing spacer */}
      <div aria-hidden="true" className="min-h-[120px] sm:min-h-[140px] lg:min-h-[160px]" />

      {/* Grid row 2: Content cluster */}
      <div style={{ position: "relative", zIndex: 10 }} className="pb-8 lg:pb-12 pt-6">
        <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-8 lg:px-12 xl:px-14 flex flex-col gap-6 lg:gap-8">
          {/* Upper Row: Left = Eyebrow + Headline + Lead, Right = Breathable Telemetry HUD */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-12 w-full">
            {/* Left Column: Eyebrow + Title + Lead */}
            <div className="w-full lg:max-w-2xl xl:max-w-3xl flex flex-col gap-3">
              {/* Eyebrow strip */}
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="gsap-eyebrow-line h-[2px] w-8 shrink-0 bg-[#f3df27]"
                />
                <p className="gsap-eyebrow-text web-eyebrow text-slate-200 font-medium tracking-[0.2em] uppercase">
                  {heroDefaults.eyebrow}
                </p>
              </div>

              {/* Display Headline */}
              <h1
                id="hero-heading"
                className="gsap-headline font-editorial text-white text-[clamp(2.5rem,4.5vw,4.5rem)] font-medium tracking-tight leading-[1.05]"
                style={{ textShadow: "0 4px 28px rgba(0,0,0,0.7)" }}
              >
                {heroDefaults.headline}
              </h1>

              {/* Editorial Lead Paragraph */}
              <p className="gsap-lead text-slate-200/90 text-sm sm:text-base font-normal leading-relaxed max-w-2xl text-shadow-sm">
                {heroDefaults.lead}
              </p>
            </div>

            {/* Right Column: Floating Unboxed Telemetry HUD */}
            {stats && stats.length > 0 && (
              <div className="gsap-telemetry-hud shrink-0 w-full lg:w-auto lg:max-w-[420px]">
                <StatBlock stats={stats} variant="hud" />
              </div>
            )}
          </div>

          {/* Lower Row: Floating Search Dock & Clean Quick Links */}
          <div className="w-full flex flex-col gap-3 relative z-30">
            <div className="gsap-search-panel w-full relative z-40">
              <HeroSearch areas={areas} />
            </div>

            {/* Clean, De-boxed Quick Links & Landlord Valuation Link */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-2 text-xs font-mono">
              <div className="flex flex-wrap items-center gap-2 text-slate-300">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                  Popular:
                </span>
                {heroDefaults.quickLinks.slice(0, 3).map((link, idx) => (
                  <span key={link.href} className="inline-flex items-center gap-2">
                    <Link
                      href={link.href}
                      className="gsap-pill text-slate-300 hover:text-white transition-colors duration-200 hover:underline underline-offset-4"
                    >
                      {link.label}
                    </Link>
                    {idx < 2 && <span className="text-slate-500 font-mono">·</span>}
                  </span>
                ))}
              </div>

              {/* Minimalist Landlord Valuation Link */}
              <Link
                href="/landlords#valuation"
                className="gsap-pill inline-flex items-center gap-1.5 text-[#f3df27] hover:text-[#ffe838] transition-colors duration-200 hover:underline underline-offset-4 font-medium"
              >
                <span>Own a property? Get a free valuation</span>
                <IconArrowUpRight size={13} stroke={2.5} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
