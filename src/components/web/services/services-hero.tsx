"use client";

import Image from "next/image";
import Link from "next/link";
import { SERVICES_HERO } from "../constants/services.content";
import { WEB_ICON_STROKE, webIcons } from "../icons";

export function ServicesHero() {
  const ArrowIcon = webIcons.arrow;
  const CheckIcon = webIcons.check;

  return (
    <section
      aria-labelledby="services-hero-heading"
      className="web-dark relative z-10 flex min-h-[72svh] sm:min-h-[76svh] lg:min-h-[82svh] flex-col overflow-hidden bg-brand-dark pb-12 pt-32 sm:pt-36 lg:pt-44"
    >
      {/* ── Background ── */}
      <div className="ph-bg pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#090d1f]">
        <Image
          src="/images/services-hero.jpg"
          alt="Sunland Real Estates luxury advisory workspace"
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          quality={100}
          unoptimized
          className="ph-bg-media object-cover object-center opacity-85"
        />
        {/* Layered atmospheric scrims — perfectly balanced for text clarity and nav blending */}
        <div
          aria-hidden="true"
          className="ph-scrim absolute inset-0 bg-gradient-to-b from-black/60 via-transparent via-30% to-transparent"
        />
        <div
          aria-hidden="true"
          className="ph-scrim absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 via-45% to-black/25 lg:to-transparent"
        />
        <div
          aria-hidden="true"
          className="ph-scrim absolute inset-0 bg-gradient-to-t from-[#090d1f] via-[#090d1f]/70 via-20% to-transparent"
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
            className="inline-block h-px w-6 shrink-0 bg-white/50"
          />
          <span className="text-xs text-slate-200/90 font-medium tracking-wide">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="mx-2 text-slate-400">›</span>
            <span className="text-white">Services</span>
          </span>
        </div>


            <h1
              id="services-hero-heading"
              className="font-editorial text-[clamp(2.4rem,4.4vw,4.6rem)] font-medium leading-[1.05] tracking-tight text-white drop-shadow-md text-balance"
            >
              {SERVICES_HERO.headline}
            </h1>

            <p className="web-subtitle max-w-[58ch] text-[15.5px] sm:text-[17px] leading-relaxed text-slate-200/90 drop-shadow-sm font-normal">
              {SERVICES_HERO.lead}
            </p>
          </div>

          {/* Right Column: Architectural Capability Directory (Jump Nav) */}
          <div className="w-full">
            <div className="flex items-center justify-between pb-3 mb-1 border-b border-white/15">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400 font-medium">
                Practice Directory
              </span>
              <span className="font-mono text-[11px] text-brand-yellow font-medium">
                4 Practice Areas
              </span>
            </div>

            <nav aria-label="Services Practice Directory" className="divide-y divide-white/10">
              {SERVICES_HERO.jumpLinks.map((link, index) => {
                const num = `0${index + 1}`;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className="group flex items-center justify-between gap-4 py-4.5 transition-all duration-200 hover:pl-2"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs text-brand-yellow/80 transition-colors group-hover:text-brand-yellow font-medium">
                        {num}
                      </span>
                      <span className="text-[15.5px] sm:text-[16px] text-slate-200 transition-colors group-hover:text-white font-normal">
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
            <div className="flex items-center gap-2">
              <span className="flex size-4 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckIcon size={11} stroke={WEB_ICON_STROKE} aria-hidden="true" />
              </span>
              <span>EARB & ISK Licensed Practitioners</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex size-4 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckIcon size={11} stroke={WEB_ICON_STROKE} aria-hidden="true" />
              </span>
              <span>Full ERP Lifecycle Management</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex size-4 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckIcon size={11} stroke={WEB_ICON_STROKE} aria-hidden="true" />
              </span>
              <span>Institutional Portfolio Governance</span>
            </div>
          </div>

          <div className="font-mono text-[11px] uppercase tracking-widest text-slate-400">
            Nairobi & Regional Practice
          </div>
        </div>
      </div>
    </section>
  );
}
