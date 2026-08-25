"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { DUR, registerWebMotion, splitLines, STAGGER } from "@/lib/motion/web-motion";
import { WEB_ICON_STROKE, webIcons } from "@/components/web/icons";

export function InsightsHero({ activeCategory }: { activeCategory?: string }) {
  const CheckIcon = webIcons.check;

  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const guaranteesRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerWebMotion();
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "sun.rise", clearProps: "opacity,transform" },
        });

        // ── Scene
        tl.from(".ih-bg", {
          scale: 1.12,
          opacity: 0,
          duration: DUR.scene,
          ease: "sun.settle",
        });

        tl.from(".ih-scrim", { opacity: 0, duration: DUR.panel, ease: "sun.settle" }, "<0.25");

        // ── Breadcrumbs
        tl.from(".ih-crumb-line", { scaleX: 0, transformOrigin: "left center", duration: DUR.base }, 0.32)
          .from(".ih-crumb-text", { opacity: 0, x: -12, duration: DUR.base * 0.85 }, "<0.16");

        // ── Headline
        if (headlineRef.current) {
          splitLines(headlineRef.current, (self) =>
            tl.from(
              self.words,
              { yPercent: 115, rotate: 2, opacity: 0, duration: DUR.base * 1.2, stagger: STAGGER.words, ease: "sun.rise" },
              "<0.08"
            )
          );
        }

        // ── Lead
        if (leadRef.current) {
          splitLines(leadRef.current, (self) =>
            tl.from(
              self.lines,
              { yPercent: 100, opacity: 0, duration: DUR.base, stagger: STAGGER.tight },
              "<0.28"
            )
          );
        }

        // ── Count Pill
        tl.from(
          ".ih-count-pill",
          { scale: 0.78, opacity: 0, duration: DUR.base, ease: "back.out(1.8)" },
          "<0.22"
        );

        // ── Guarantees
        if (guaranteesRef.current) {
            tl.from(
                guaranteesRef.current.children,
                { opacity: 0, y: 10, duration: DUR.base, stagger: 0.1 },
                "<0.1"
            );
        }
      });

      // ── Desktop parallax
      media.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const section = sectionRef.current;
        const image = section?.querySelector<HTMLElement>(".ih-bg-media");
        if (!section || !image) return;

        const quickY = gsap.quickTo(image, "yPercent", { duration: 0.45, ease: "none" });
        const quickScaleX = gsap.quickTo(image, "scaleX", { duration: 0.45, ease: "none" });
        const quickScaleY = gsap.quickTo(image, "scaleY", { duration: 0.45, ease: "none" });

        let frame = 0;
        const update = () => {
          frame = 0;
          const height = section.offsetHeight || 1;
          const progress = Math.min(Math.max(-section.getBoundingClientRect().top / height, 0), 1);
          const scale = 1 + progress * 0.065;
          quickY(progress * 16);
          quickScaleX(scale);
          quickScaleY(scale);
        };

        const onScroll = () => {
          if (frame === 0) frame = requestAnimationFrame(update);
        };

        update();
        window.addEventListener("scroll", onScroll, { passive: true });

        return () => {
          window.removeEventListener("scroll", onScroll);
          if (frame) cancelAnimationFrame(frame);
          gsap.set(image, { clearProps: "yPercent,scaleX,scaleY" });
        };
      });

      return () => media.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="insights-hero-heading"
      className="web-dark relative z-10 flex min-h-[68svh] sm:min-h-[72svh] lg:min-h-[76svh] flex-col overflow-hidden pb-14 pt-32 sm:pt-36 lg:pt-44"
    >
      {/* ── Background Photography & Layered Scrims ── */}
      <div className="ih-bg pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#090d1f]">
        <Image
          src="/images/insights-hero-right.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          quality={100}
          className="ih-bg-media object-cover object-center opacity-80"
        />
        <div aria-hidden="true" className="ih-scrim absolute inset-0 bg-gradient-to-b from-black/40 via-transparent via-35% to-transparent" />
        <div aria-hidden="true" className="ih-scrim absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 via-55% to-transparent" />
        <div aria-hidden="true" className="ih-scrim absolute inset-0 bg-gradient-to-b from-transparent via-[#090d1f]/30 to-[#151936]" />
      </div>

      {/* ── Content (Left-Aligned Unified Typography) ── */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-end px-6 sm:px-8 lg:px-12 xl:px-14">
        {/* Breadcrumbs row */}
        <div className="mb-6 flex items-center gap-2.5 opacity-85">
          <span aria-hidden="true" className="ih-crumb-line inline-block h-px w-6 shrink-0 bg-white/50" />
          <span className="ih-crumb-text text-xs text-slate-200/90 font-medium tracking-wide">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2 text-slate-400">›</span>
            <span className="text-white">Insights</span>
          </span>
        </div>

        <div className="w-full">
          {/* Headline — identical typography, size, and weight to Properties Hero */}
          <h1
            id="insights-hero-heading"
            ref={headlineRef}
            className="web-title w-full text-[clamp(2.4rem,4.2vw,4.5rem)] font-normal leading-[1.06] tracking-tight text-white drop-shadow-md"
          >
            Worth reading before you sign anything.
          </h1>

          {/* Lead + count row */}
          <div className="mt-5 flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-1">
            <p ref={leadRef} className="web-subtitle max-w-[64ch] text-base sm:text-lg leading-relaxed text-slate-200/90 drop-shadow-sm">
              Practical writing on Nairobi property from the people managing it: what things cost,
              what the paperwork should say, and where owners and tenants get caught out.
            </p>

            {/* Live Count Pill */}
            <div className="ih-count-pill flex shrink-0 items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 backdrop-blur-md shadow-sm text-xs font-mono text-white">
              <span className="size-1.5 rounded-full bg-brand-yellow" />
              <span>7 Verified Advisories</span>
            </div>
          </div>
        </div>

        {/* Action Row & Guarantees Bar - filter removed, keeping guarantees with some style polish */}
        <div className="mt-8 pt-6 border-t border-white/15">
          <div ref={guaranteesRef} className="flex flex-wrap items-center gap-y-3 gap-x-8 text-[13px] text-slate-300 font-medium">
            <div className="flex items-center gap-2.5">
              <span className="flex size-4.5 items-center justify-center rounded-full bg-brand-yellow/20 text-brand-yellow">
                <CheckIcon size={12} stroke={WEB_ICON_STROKE} aria-hidden="true" />
              </span>
              <span><strong className="text-white font-semibold tracking-wide">100% Verified</strong> Realized Data</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="flex size-4.5 items-center justify-center rounded-full bg-brand-yellow/20 text-brand-yellow">
                <CheckIcon size={12} stroke={WEB_ICON_STROKE} aria-hidden="true" />
              </span>
              <span><strong className="text-white font-semibold tracking-wide">Zero</strong> Sponsored Content</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="flex size-4.5 items-center justify-center rounded-full bg-brand-yellow/20 text-brand-yellow">
                <CheckIcon size={12} stroke={WEB_ICON_STROKE} aria-hidden="true" />
              </span>
              <span><strong className="text-white font-semibold tracking-wide">Practitioner</strong> Authored</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
