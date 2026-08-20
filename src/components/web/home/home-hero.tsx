"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { DUR, registerWebMotion, splitLines, STAGGER } from "@/lib/motion/web-motion";
import {
  PortfolioDial,
  type DialFootnoteItem,
  type DialSlice,
} from "../primitives/portfolio-dial";
import { HeroSearch } from "./hero-search";
import { heroDefaults } from "./home.defaults";

/**
 * 01 home.hero, cinematic full-bleed band.
 *
 * Content is pinned to the bottom of the section so the architecture is
 * visible above it, with the headline sitting directly over the search panel.
 *
 * ── Two things that were wrong and are load-bearing ──
 *
 * **Height.** `100vh` on a phone measures the viewport with the URL bar
 * retracted, so the section was taller than the visible screen and the search
 * panel, its lowest and most important element, sat under the fold on first
 * paint. `.web-hero-shell` uses `100svh`, the small viewport, and below 640px
 * lets the hero size to its content against a floor.
 *
 * **The entrance must not be able to hide the page.** Every animated element
 * used to be tweened from `opacity: 0`, which is fine when the bundle arrives
 * and catastrophic when it does not: on a slow connection, or with JavaScript
 * blocked, the visitor got an empty hero. The markup now ships visible and
 * GSAP sets the `from` state itself, inside a `matchMedia` branch that never
 * runs under `prefers-reduced-motion: reduce`. Nothing is hidden by CSS that
 * only a tween can bring back.
 */
export function HomeHero({
  portfolio,
  footnote,
  areas,
}: {
  /** The property-type split. Empty hides the dial rather than drawing zero. */
  portfolio: DialSlice[];
  /** The row beneath the ring: a real count, and the explicit portal link. */
  footnote: DialFootnoteItem[];
  areas: string[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      registerWebMotion();

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        // clearProps everywhere is what stops the entrance from stranding an
        // element. A from() tween writes inline styles for the START state; if
        // it is killed, reverted or unmounted mid-flight those styles stay, and
        // the element is left invisible. Clearing what GSAP touched means an
        // interrupted entrance degrades to "no animation", never to "gone".
        const tl = gsap.timeline({
          defaults: { ease: "sun.rise", clearProps: "opacity,transform" },
        });

        // ── The scene ────────────────────────────────────────────────────────
        // The photograph settles for nearly two seconds under everything else.
        // It is the only element allowed to still be moving when the copy has
        // finished arriving, which is what gives the band depth rather than the
        // flat "everything lands at once" of a template.
        tl.from(".gsap-bg", {
          scale: 1.14,
          opacity: 0,
          duration: DUR.scene,
          ease: "sun.settle",
        });

        // ── The rule, then the words it introduces ───────────────────────────
        // The rule draws before the eyebrow moves, so it reads as the eyebrow's
        // underline arriving first rather than as two things fading together.
        tl.from(
          ".gsap-eyebrow-line",
          { scaleX: 0, transformOrigin: "left center", duration: DUR.base },
          0.35
        ).from(
          ".gsap-eyebrow-text",
          { opacity: 0, x: -14, duration: DUR.base * 0.8 },
          "<0.18"
        );

        // ── The headline, masked ─────────────────────────────────────────────
        // Words rise out of their own line box rather than fading in over the
        // photograph. This is the hero's signature gesture and the reason for
        // SplitText: a fade cannot be made to look authored, a mask can.
        //
        // The slight rotation is what stops six words rising in perfect
        // parallel from reading as a lift rather than as type settling.
        if (headlineRef.current) {
          splitLines(headlineRef.current, (self) =>
            tl.from(
              self.words,
              {
                yPercent: 118,
                rotate: 2.5,
                opacity: 0,
                duration: DUR.base * 1.25,
                stagger: STAGGER.words,
                ease: "sun.rise",
              },
              "<0.1"
            )
          );
        }

        // The lead moves by line, not by word: a paragraph animated per word
        // draws attention to the animation instead of to the sentence.
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
              "<0.34"
            )
          );
        }

        // ── The instrument panel ─────────────────────────────────────────────
        // Enters from the right as one object, then its tiles resolve inside
        // it. Animating the tiles alone would make the panel look assembled on
        // screen; animating only the panel wastes the four figures inside it.
        tl.from(
          ".gsap-telemetry-hud",
          { x: 44, opacity: 0, duration: DUR.panel, ease: "sun.settle" },
          "<0.1"
        );

        // ── The search panel lands last ──────────────────────────────────────
        // It is the page's primary action, so it arrives after the argument has
        // been made, on the softer curve a large white surface needs.
        tl.from(
          ".gsap-search-panel",
          { y: 34, scale: 0.985, opacity: 0, duration: DUR.panel, ease: "sun.settle" },
          "<0.12"
        )
          // The one yellow element on the page is the final beat.
          .from(
            ".gsap-search-panel button[type='submit']",
            { scale: 0.82, opacity: 0, duration: DUR.base, ease: "back.out(1.7)" },
            "<0.3"
          )
          .from(
            ".gsap-pill",
            { y: 14, opacity: 0, duration: DUR.base * 0.7, stagger: STAGGER.tight },
            "<0.15"
          );

        // matchMedia().revert() below tears all of this down, including the
        // SplitText wrappers.
      });

      // Reduced motion never hides anything (see the .gsap-enter rule this
      // pairs with), so there is nothing to reveal here; only the branch
      // above hid content, so only it needs to hand back.
      //
      // Lifting the gate has to happen after every from() and splitLines()
      // call above, not before: those calls apply their hidden start state
      // (opacity 0, the split words' own offsets) synchronously the instant
      // they run, so by this line every animated element is already hidden
      // by GSAP's own inline styles, which outrank the CSS rule regardless
      // of whether the class is still on <html>. Doing it here rather than
      // inside the branch itself is what guarantees the split headline is
      // never visible unsplit: SplitText has already wrapped it above.
      document.documentElement.classList.remove("web-preanim");

      // ── Parallax on exit, desktop only ──────────────────────────────────
      // The photograph drifts slower than the page as the hero leaves.
      //
      // A scroll listener rather than ScrollTrigger: this needs one number,
      // how far through the hero the page has scrolled, and computing it is
      // three lines. Pulling in a scroll-position engine for that was costing
      // roughly 40KB and an initialisation order that had to be exactly right.
      //
      // Gated above 1024px on purpose. Parallax on a phone means compositing
      // a full-bleed image on every frame of a touch scroll, on the hardware
      // least able to afford it, for an effect largely lost on a small screen.
      media.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const section = containerRef.current;
        const image = section?.querySelector<HTMLElement>(".gsap-bg-media");
        if (!section || !image) return;

        const quickY = gsap.quickTo(image, "yPercent", { duration: 0.4, ease: "none" });
        // scaleX/scaleY rather than the "scale" shorthand: GSAP tracks a
        // composite "scale" as one entry in its transform cache, and once
        // yPercent is also being written on the same element that entry can
        // no longer be isolated for clearProps, which is exactly what GSAP's
        // own "scale not eligible for reset" warning is telling us. The two
        // axes are each their own cache entry and reset cleanly.
        const quickScaleX = gsap.quickTo(image, "scaleX", { duration: 0.4, ease: "none" });
        const quickScaleY = gsap.quickTo(image, "scaleY", { duration: 0.4, ease: "none" });

        let frame = 0;
        const update = () => {
          frame = 0;
          const height = section.offsetHeight || 1;
          // 0 at rest, 1 when the hero has fully left the top of the screen.
          const progress = Math.min(Math.max(-section.getBoundingClientRect().top / height, 0), 1);
          const scale = 1 + progress * 0.06;
          quickY(progress * 14);
          quickScaleX(scale);
          quickScaleY(scale);
        };

        const onScroll = () => {
          // One write per frame at most, so a fast wheel or a momentum scroll
          // cannot queue up work faster than the compositor drains it.
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
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      aria-labelledby="hero-heading"
      className="web-dark web-hero-shell relative grid grid-rows-[1fr_auto] overflow-hidden"
    >
      <div className="gsap-bg gsap-enter absolute inset-0 z-0">
        <Image
          src="/images/hero-home.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority
          // Explicit, because the browser picks a candidate before layout and
          // a full-width guess ships a 4K image to a 390px phone.
          sizes="(max-aspect-ratio: 1/1) 300vw, 100vw"
          quality={100}
          className="gsap-bg-media object-cover object-center"
        />
        {/* Layered atmospheric scrims: Balanced black gradient on left for text contrast while keeping architecture vibrant */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-black/25 via-black/25 via-50% to-black/10 lg:to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent via-35% to-transparent"
        />
        {/* Bottom dissolve — scrim flows into black so it bleeds seamlessly into the category section below */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-72 sm:h-96 bg-gradient-to-b from-transparent via-black/55 via-40% to-black"
        />
      </div>

      {/* Row 1 absorbs the free space so the cluster below sits on the floor.
          On mobile it collapses, because the shell is content-height there. */}
      <div aria-hidden="true" className="min-h-[18svh] sm:min-h-0" />

      {/* Row 2: the content cluster. Top padding clears the transparent
          header, which is 72px on a phone and 96px above 640. */}
      <div className="gsap-hero-content relative z-raised pb-10 pt-24 sm:pt-28 lg:pb-14">
        <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-8 lg:px-12 xl:px-14">
          {/* Upper row: the pitch on the left, the figures on the right. The
              search panel is deliberately NOT in this grid, because a search
              field is the widest control on the page and boxing it into 60% of
              the viewport shrinks the location input, which is the field
              everyone actually types in. */}
          <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(250px,340px)] lg:gap-12 xl:gap-16">
            <div>
              <div className="mb-0 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="gsap-eyebrow-line gsap-enter h-[2px] w-10 shrink-0 bg-[#f3df27]/90"
                />
                <p className="gsap-eyebrow-text gsap-enter web-eyebrow font-medium uppercase tracking-[0.2em] text-slate-200">
                  {heroDefaults.eyebrow}
                </p>
              </div>

              <h1
                ref={headlineRef}
                id="hero-heading"
                className="gsap-headline gsap-enter mb-0 font-editorial text-[clamp(3.2rem,5.2vw,4.5rem)] font-medium  text-white text-balance xl:whitespace-nowrap"
                style={{ textShadow: "0 4px 24px rgba(0,0,0,0.6)" }}
              >
                {heroDefaults.headline}
              </h1>

              {/* The lead was in the design and had been dropped. It is the
                  only place the hero says what the business actually does, and
                  a headline of three words cannot carry that alone. */}
              <p className="gsap-lead gsap-enter mb-0 max-w-[66ch] text-pretty text-[15px] leading-[1.65] text-slate-200/90 sm:text-[17px]">
                {heroDefaults.lead}
              </p>
            </div>

            {portfolio.length > 0 && (
              <div className="gsap-telemetry-hud gsap-enter w-full justify-self-end">
                <PortfolioDial slices={portfolio} totalLabel="Listed" footnote={footnote} />
              </div>
            )}
          </div>

          {/* Full-bleed search, the width of the content column. */}
          <div className="gsap-search-panel gsap-enter mt-8 lg:mt-10">
            <HeroSearch areas={areas} />
          </div>

          <div className="mt-5.5 flex flex-wrap items-center gap-x-2.5 gap-y-2">
            <span className="gsap-pill gsap-enter web-control text-[11px] font-medium uppercase tracking-[0.16em] text-slate-300">
              Popular:
            </span>
            {heroDefaults.quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="gsap-pill gsap-enter web-control web-hit rounded-full border border-white/15 bg-slate-950/40 px-4 py-1.5 text-xs tracking-wide text-slate-200 shadow-sm backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-white/35 hover:bg-slate-950/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-yellow"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
