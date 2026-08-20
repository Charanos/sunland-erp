"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";
import { DUR, registerWebMotion, splitLines, STAGGER } from "@/lib/motion/web-motion";

/**
 * Animated hero shell for /properties and its facet pages.
 *
 * Deliberately mirroring home-hero's motion language so both pages feel
 * authored by the same hand:
 *   - Scene (bg) settles on sun.settle over DUR.scene — geological slowness
 *   - Breadcrumbs draw their rule then slide their text, identical to the home eyebrow
 *   - Headline words rise out of masked line boxes (splitLines)
 *   - Lead lines cascade after the headline settles
 *   - Count pill pops in last, the yellow element as the final beat
 *   - Desktop parallax: bg drifts at 0.55x scroll speed, scale expands as the
 *     hero exits, using the same quickTo pattern as home-hero
 *
 * No element is hidden by CSS that only a tween can reveal. The hidden state
 * is applied synchronously inside useGSAP, inside the reduced-motion branch
 * guard, so if JS is slow or absent the page is fully readable.
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

  useGSAP(
    () => {
      registerWebMotion();

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "sun.rise", clearProps: "opacity,transform" },
        });

        // ── Scene ────────────────────────────────────────────────────────────
        // The photograph breathes in slowly — geological relative to the copy.
        tl.from(".ph-bg", {
          scale: 1.12,
          opacity: 0,
          duration: DUR.scene,
          ease: "sun.settle",
        });

        // ── Scrims fade in after bg, reinforcing depth ────────────────────────
        tl.from(
          ".ph-scrim",
          { opacity: 0, duration: DUR.panel, ease: "sun.settle" },
          "<0.25"
        );

        // ── Breadcrumbs rule → text, echoing home eyebrow rhythm ─────────────
        tl.from(
          ".ph-crumb-line",
          { scaleX: 0, transformOrigin: "left center", duration: DUR.base },
          0.32
        ).from(
          ".ph-crumb-text",
          { opacity: 0, x: -12, duration: DUR.base * 0.85 },
          "<0.16"
        );

        // ── Headline: masked word rise ────────────────────────────────────────
        // SplitText wraps each word in an overflow:hidden parent. Words rise
        // out of their own baseline — this is the signature gesture that makes
        // the hero look authored rather than templated.
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

        // ── Lead: line by line ─────────────────────────────────────────────────
        // A paragraph animated per word draws attention to the animation.
        // Per line reads as the copy settling, not as a magic trick.
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

        // ── Count pill — the yellow beat, lands last ──────────────────────────
        tl.from(
          ".ph-count-pill",
          {
            scale: 0.78,
            opacity: 0,
            duration: DUR.base,
            ease: "back.out(1.8)",
          },
          "<0.22"
        );
      });

      // ── Desktop parallax ──────────────────────────────────────────────────
      // The bg drifts slower than the page as the hero exits — same quickTo
      // approach as home-hero. Gated to 1024px+: on mobile compositing a
      // full-bleed image on every touch-scroll frame is too expensive for
      // the effect gained.
      media.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const section = sectionRef.current;
          const image = section?.querySelector<HTMLElement>(".ph-bg-media");
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
      <div className="ph-bg pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#090d1f]">
        <Image
          src="/images/properties-hero.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          quality={100}
          className="ph-bg-media object-cover object-center opacity-80"
        />
        {/* Layered atmospheric scrims */}
        <div
          aria-hidden="true"
          className="ph-scrim absolute inset-0 bg-gradient-to-b from-black/40 via-transparent via-35% to-transparent"
        />
        <div
          aria-hidden="true"
          className="ph-scrim absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 via-55% to-transparent"
        />
        <div
          aria-hidden="true"
          className="ph-scrim absolute inset-0 bg-gradient-to-b from-transparent via-[#090d1f]/30 to-[#151936]"
        />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-end px-6 sm:px-8 lg:px-12 xl:px-14">
        {/* Breadcrumbs row — invisible rule used as an animation target */}
        <div className="mb-6 flex items-center gap-2.5 opacity-85">
          <span
            aria-hidden="true"
            className="ph-crumb-line inline-block h-px w-6 shrink-0 bg-white/50"
          />
          <span className="ph-crumb-text">{breadcrumbSlot}</span>
        </div>

        <div className="w-full">
          {/* Headline */}
          <h1
            ref={headlineRef}
            className="web-title w-full text-[clamp(2.4rem,4.2vw,4.5rem)] font-normal leading-[1.06] tracking-tight text-white drop-shadow-md"
          >
            {title}
          </h1>

          {/* Lead + count row */}
          <div className="mt-5 flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-1">
            {lead && (
              <p
                ref={leadRef}
                className="web-subtitle max-w-[62ch] text-base sm:text-lg leading-relaxed text-slate-200/90 drop-shadow-sm"
              >
                {lead}
              </p>
            )}

            {/* Count pill — the yellow beat */}
            <div className="ph-count-pill flex shrink-0 items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 backdrop-blur-md shadow-sm">
              {countSlot}
            </div>
          </div>
        </div>

        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
