"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";
import { DUR, registerWebMotion, splitLines, STAGGER } from "@/lib/motion/web-motion";
import { Breadcrumbs } from "../primitives/breadcrumbs";

/**
 * Animated hero shell for /locations.
 * Mirrors the PropertiesHero motion language and layout for a unified aesthetic.
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

  useGSAP(
    () => {
      registerWebMotion();

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "sun.rise", clearProps: "opacity,transform" },
        });

        // Background breathes in
        tl.from(".lh-bg", {
          scale: 1.12,
          opacity: 0,
          duration: DUR.scene,
          ease: "sun.settle",
        });

        // Scrims fade in after bg
        tl.from(
          ".lh-scrim",
          { opacity: 0, duration: DUR.panel, ease: "sun.settle" },
          "<0.25"
        );

        // Breadcrumbs line -> text
        tl.from(
          ".lh-crumb-line",
          { scaleX: 0, transformOrigin: "left center", duration: DUR.base },
          0.32
        ).from(
          ".lh-crumb-text",
          { opacity: 0, x: -12, duration: DUR.base * 0.85 },
          "<0.16"
        );

        // Headline words rise
        if (headlineRef.current) {
          splitLines(headlineRef.current, (self) =>
            tl.from(
              self.words,
              {
                yPercent: 115,
                rotate: 2,
                opacity: 0,
                duration: DUR.base * 1.2,
                stagger: STAGGER.words,
                ease: "sun.rise",
              },
              "<0.08"
            )
          );
        }

        // Lead lines cascade
        if (leadRef.current) {
          splitLines(leadRef.current, (self) =>
            tl.from(
              self.lines,
              {
                yPercent: 100,
                opacity: 0,
                duration: DUR.base,
                stagger: STAGGER.tight,
              },
              "<0.28"
            )
          );
        }
      });

      // Desktop parallax
      media.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const section = sectionRef.current;
          const image = section?.querySelector<HTMLElement>(".lh-bg-media");
          if (!section || !image) return;

          const quickY = gsap.quickTo(image, "yPercent", {
            duration: 0.45,
            ease: "none",
          });
          const quickScaleX = gsap.quickTo(image, "scaleX", {
            duration: 0.45,
            ease: "none",
          });
          const quickScaleY = gsap.quickTo(image, "scaleY", {
            duration: 0.45,
            ease: "none",
          });

          let frame = 0;
          const update = () => {
            frame = 0;
            const height = section.offsetHeight || 1;
            const progress = Math.min(
              Math.max(-section.getBoundingClientRect().top / height, 0),
              1
            );
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
        }
      );

      return () => media.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="web-dark relative z-10 flex min-h-[68svh] sm:min-h-[72svh] flex-col overflow-hidden pb-14 pt-32 sm:pt-36 lg:pt-44"
    >
      {/* ── Background ── */}
      <div className="lh-bg pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#090d1f]">
        <Image
          src="/images/areas-hero.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          quality={100}
          className="lh-bg-media object-cover object-center opacity-80"
        />
        {/* Layered atmospheric scrims */}
        <div
          aria-hidden="true"
          className="lh-scrim absolute inset-0 bg-gradient-to-b from-black/50 via-transparent via-35% to-transparent"
        />
        <div
          aria-hidden="true"
          className="lh-scrim absolute inset-0 bg-gradient-to-l from-black/70 via-black/35 via-55% to-transparent"
        />
        <div
          aria-hidden="true"
          className="lh-scrim absolute inset-0 bg-gradient-to-b from-transparent via-[#090d1f]/40 to-[#151936]"
        />
      </div>

      {/* ── Content (Right-Aligned Typography Flip) ── */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-end px-6 sm:px-8 lg:px-12 xl:px-14">
        {/* Breadcrumbs row — aligned right, hairline on right */}
        <div className="mb-6 flex items-center lg:flex-row-reverse gap-2.5 opacity-85 lg:ml-auto">
          <span
            aria-hidden="true"
            className="lh-crumb-line inline-block h-px w-6 shrink-0 bg-white/50"
          />
          <span className="lh-crumb-text">
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
            className="web-title w-full text-[clamp(2.4rem,4.2vw,4.5rem)] font-normal leading-[1.06] tracking-tight text-white drop-shadow-md lg:text-right"
          >
            {headline}
          </h1>

          {/* Lead row */}
          <div className="mt-5 flex flex-col lg:flex-row-reverse lg:items-end justify-between gap-6 pt-1">
            <p
              ref={leadRef}
              className="web-subtitle max-w-[62ch] text-base sm:text-lg leading-relaxed text-slate-200/90 drop-shadow-sm lg:text-right lg:ml-auto"
            >
              {lead}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
