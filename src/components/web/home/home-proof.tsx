"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { DUR, STAGGER } from "@/lib/motion/web-motion";
import { ABOUT_TESTIMONIALS } from "../constants/about.content";
import { WEB_ICON_STROKE, webIcons } from "../icons";
import { SectionBand } from "../primitives/section-band";
import { Eyebrow } from "../primitives/eyebrow";
import { proofDefaults } from "./home.defaults";

/**
 * 08 home.proof, light band.
 *
 * Client social proof on the left paired with core commitments and right-aligned title.
 * Fetches directly from the unified ABOUT_TESTIMONIALS source of truth without avatars,
 * matching the executive editorial aesthetic across the platform.
 */
export function HomeProof() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const testimonials = ABOUT_TESTIMONIALS.items;
  const current = testimonials[activeIndex] ?? testimonials[0];

  const QuoteIcon = webIcons.quote;
  const ChevronLeftIcon = webIcons.chevronLeft;
  const ChevronRightIcon = webIcons.chevronRight;

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (section.getBoundingClientRect().top < window.innerHeight * 0.92) return;

      const testimonial = section.querySelector<HTMLElement>(".proof-testimonial");
      const copy = section.querySelector<HTMLElement>(".proof-copy");
      const commitments = Array.from(
        section.querySelectorAll<HTMLElement>(".proof-commitments > div")
      );

      const targets = [testimonial, copy, ...commitments].filter(
        (el): el is HTMLElement => el !== null
      );
      if (targets.length === 0) return;

      if (testimonial) gsap.set(testimonial, { opacity: 0, x: -32, rotate: -1.5 });
      if (copy) gsap.set(copy, { opacity: 0, x: 32 });
      if (commitments.length > 0) gsap.set(commitments, { opacity: 0, y: 18 });

      const play = () => {
        const tl = gsap.timeline({ defaults: { clearProps: "opacity,transform" } });
        if (testimonial) {
          tl.to(testimonial, {
            opacity: 1,
            x: 0,
            rotate: 0,
            duration: DUR.panel,
            ease: "sun.settle",
          });
        }
        if (copy) {
          tl.to(
            copy,
            { opacity: 1, x: 0, duration: DUR.base, ease: "sun.rise" },
            testimonial ? "<0.1" : 0
          );
        }
        if (commitments.length > 0) {
          tl.to(
            commitments,
            { opacity: 1, y: 0, duration: DUR.base, ease: "sun.rise", stagger: STAGGER.cards },
            "<0.25"
          );
        }
      };

      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries[0]?.isIntersecting) return;
          observer.disconnect();
          play();
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.01 }
      );
      observer.observe(section);

      return () => observer.disconnect();
    },
    { scope: sectionRef, dependencies: [] }
  );

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <SectionBand tone="tint" labelledBy="proof-heading" className="relative bg-[#f8fafc] py-20 sm:py-24 lg:py-28">
      <div ref={sectionRef} className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-16 xl:gap-20 items-center">
        {/* Left Column: Unified Executive Client Testimonial Card */}
        <div className="order-2 lg:order-1 proof-testimonial">
          <div className="group relative overflow-hidden rounded-[28px] border border-white/12 bg-gradient-to-b from-[#151936] via-[#10142d] to-[#0d1024] p-8 sm:p-10 shadow-[0_24px_50px_rgba(21,25,54,0.28)] text-white backdrop-blur-xl">
            {/* Subtle Ambient Glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-brand-yellow/12 blur-[80px]"
            />

            {/* Ambient Large Brand Yellow Quotation Artwork */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-18 -top-4 text-brand-yellow/[0.12] select-none transition-transform duration-500 group-hover:scale-105 group-hover:text-brand-yellow/[0.16]"
            >
              <QuoteIcon size={150} stroke={1} />
            </div>

            {/* Top Bar: Quote Icon & Pagination Indicator */}
            <div className="relative z-10 flex items-center justify-end">

              <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-slate-400">
                <span className="text-brand-yellow font-medium">0{activeIndex + 1}</span>
                <span>/</span>
                <span>0{testimonials.length}</span>
              </div>
            </div>

            {/* Testimonial Quote */}
            <figure className="relative z-10 mt-6">
              <blockquote className="font-editorial text-[22px] sm:text-[25px] lg:text-[27px] font-medium leading-[1.38] text-white drop-shadow-sm min-h-[110px] flex items-center">
                &ldquo;{current.quote}&rdquo;
              </blockquote>

              {/* Author & Attribution Footer with Controls */}
              <figcaption className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/12 pt-5">
                <div className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-slate-400">
                  <span aria-hidden="true" className="mr-2 text-slate-500">
                    &mdash;
                  </span>
                  <span className="font-medium text-slate-200">{current.name}</span>
                  <span className="mx-1.5 text-slate-500">·</span>
                  <span>{current.role}</span>
                </div>

                {/* Tactile Prev/Next Controls */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous testimonial"
                    className="flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur-sm transition-all hover:bg-brand-yellow hover:border-brand-yellow hover:text-[#151936] hover:scale-105 shadow-xs cursor-pointer"
                  >
                    <ChevronLeftIcon size={16} stroke={WEB_ICON_STROKE} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next testimonial"
                    className="flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur-sm transition-all hover:bg-brand-yellow hover:border-brand-yellow hover:text-[#151936] hover:scale-105 shadow-xs cursor-pointer"
                  >
                    <ChevronRightIcon size={16} stroke={WEB_ICON_STROKE} />
                  </button>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>

        {/* Right Column: Title, Subtitle, and Core Operational Commitments */}
        <div className="order-1 lg:order-2">
          <div className="proof-copy">
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
          </div>

          {/* Three Core Commitments - Uncarded Editorial */}
          <div className="proof-commitments mt-10 sm:mt-12 space-y-7 sm:space-y-8">
            {proofDefaults.points.map((point) => {
              const IconComponent = webIcons[point.icon];

              return (
                <div
                  key={point.title}
                  className="group flex items-start gap-5 sm:gap-6 relative"
                >
                  <div className="absolute left-4 top-10 bottom-[-2rem] w-px bg-slate-200 last:hidden group-last:hidden" />

                  <span
                    aria-hidden="true"
                    className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-50 border border-slate-200/60 text-slate-400 transition-colors duration-300 group-hover:bg-[#151936] group-hover:border-[#151936] group-hover:text-white"
                  >
                    <IconComponent size={18} stroke={WEB_ICON_STROKE} />
                  </span>
                  <div>
                    <h3 className="font-editorial text-[21px] sm:text-[22px] font-medium text-[#151936]">
                      {point.title}
                    </h3>
                    <p className="mt-1 text-[14.5px] sm:text-[15px] leading-relaxed text-slate-500">
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
