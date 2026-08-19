"use client";

import Image from "next/image";
import { useState } from "react";
import { WEB_ICON_STROKE, webIcons } from "../icons";
import { SectionBand } from "../primitives/section-band";
import { Eyebrow } from "../primitives/eyebrow";
import { proofDefaults } from "./home.defaults";
import { cn } from "@/lib/utils/cn";

/**
 * 08 home.proof, light band.
 *
 * Client social proof on the left paired with core commitments and right-aligned title.
 */
export function HomeProof() {
  const [activeIndex, setActiveIndex] = useState(0);
  const testimonials = proofDefaults.testimonials;
  const current = testimonials[activeIndex] ?? testimonials[0];

  const QuoteIcon = webIcons.quote;
  const ChevronLeftIcon = webIcons.chevronLeft;
  const ChevronRightIcon = webIcons.chevronRight;
  const CheckIcon = webIcons.check;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <SectionBand tone="tint" labelledBy="proof-heading" className="relative bg-[#f8fafc]">
      <div className="grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20 items-center">
        {/* Left Column: Interactive Multi-Role Testimonial Showcase */}
        <div className="order-2 lg:order-1">
          {/* Category Filter Switcher */}
          <div className="flex flex-wrap items-center gap-2.5 mb-6">
            {testimonials.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "font-mono text-[10px] sm:text-xs uppercase tracking-wider px-4 py-2 rounded-full transition-all duration-300 cursor-pointer border shadow-xs",
                  idx === activeIndex
                    ? "bg-brand-yellow text-[#151936] border-brand-yellow hover:scale-[1.02]"
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 hover:scale-[1.02]"
                )}
              >
                {item.badge}
              </button>
            ))}
          </div>

          {/* Luxury Dark Testimonial Card */}
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#151936] p-8 sm:p-10 shadow-[0_30px_60px_rgba(21,25,54,0.3),0_4px_16px_rgba(0,0,0,0.1)] text-white">
            {/* Ambient Interior Glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-brand-yellow/10 blur-[80px]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-10 -bottom-10 size-48 rounded-full bg-blue-500/10 blur-[60px]"
            />

            {/* Ambient Background Watermark */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-6 top-4 text-white/[0.03] select-none"
            >
              <QuoteIcon size={140} stroke={0.8} />
            </div>

            {/* Testimonial Quote */}
            <figure className="relative z-10">
              <blockquote className="font-editorial text-[24px] sm:text-[28px] font-medium leading-[1.4] text-white drop-shadow-sm">
                &ldquo;{current.quote}&rdquo;
              </blockquote>

              {/* Author & Property Footnote */}
              <figcaption className="mt-10 flex items-center justify-between border-t border-white/10 pt-7">
                <div className="flex items-center gap-4">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-full border-2 border-brand-yellow bg-slate-800 shadow-[0_0_15px_rgba(234,179,8,0.3)] ring-2 ring-white/10">
                    <Image
                      src={current.avatarUrl}
                      alt={current.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <p className="font-medium text-white text-base">
                        {current.name}
                      </p>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 font-mono text-[9.5px] font-medium text-emerald-400">
                        <CheckIcon size={10} stroke={2.5} />
                        Verified
                      </span>
                    </div>
                    <p className="font-mono text-xs text-slate-300/80 mt-1">
                      {current.role} · {current.property}
                    </p>
                  </div>
                </div>

                {/* Tactile Prev/Next Controls */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous testimonial"
                    className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur-sm transition-all hover:bg-brand-yellow hover:border-brand-yellow hover:text-[#151936] hover:scale-105 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] cursor-pointer"
                  >
                    <ChevronLeftIcon size={18} stroke={WEB_ICON_STROKE} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next testimonial"
                    className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur-sm transition-all hover:bg-brand-yellow hover:border-brand-yellow hover:text-[#151936] hover:scale-105 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] cursor-pointer"
                  >
                    <ChevronRightIcon size={18} stroke={WEB_ICON_STROKE} />
                  </button>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Right Column: Title, Subtitle, and Core Operational Commitments */}
        <div className="order-1 lg:order-2">
          <Eyebrow tone="light">{proofDefaults.eyebrow}</Eyebrow>
          <h2
            id="proof-heading"
            className="mt-4 font-editorial text-[clamp(2.5rem,4vw,3.75rem)] font-medium leading-[1.08] tracking-tight text-[#151936]"
          >
            {proofDefaults.headline}
          </h2>
          <p className="web-subtitle mt-4 text-[15px] sm:text-base leading-relaxed text-slate-500 max-w-[50ch]">
            {proofDefaults.lead}
          </p>

          {/* Three Core Commitments - Uncarded Editorial */}
          <div className="mt-12 space-y-8">
            {proofDefaults.points.map((point) => {
              const IconComponent = webIcons[point.icon];

              return (
                <div
                  key={point.title}
                  className="group flex items-start gap-6 relative"
                >
                  <div className="absolute left-4 top-10 bottom-[-2rem] w-px bg-slate-200 last:hidden group-last:hidden" />
                  
                  <span
                    aria-hidden="true"
                    className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-50 border border-slate-200/60 text-slate-400 transition-colors duration-300 group-hover:bg-[#151936] group-hover:border-[#151936] group-hover:text-white"
                  >
                    <IconComponent size={18} stroke={WEB_ICON_STROKE} />
                  </span>
                  <div>
                    <h3 className="font-editorial text-[22px] font-medium text-[#151936]">
                      {point.title}
                    </h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-slate-500">
                      {point.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SectionBand>
  );
}
