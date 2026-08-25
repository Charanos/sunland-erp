"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { RefObject } from "react";
import { DUR, registerWebMotion, splitLines, STAGGER } from "./web-motion";

/**
 * The entrance and parallax shared by every L2 page hero.
 *
 * ── Why this is a hook and not five copies ──
 *
 * Properties, Areas and Insights each carried a byte-identical copy of this
 * choreography, and Services and Landlords carried none at all, so two of the
 * five page heroes simply did not move. Five copies of one gesture is not five
 * bespoke heroes, it is one gesture with four opportunities to drift: the
 * parallax block alone was forty-five duplicated lines, already diverging in
 * its class prefix (`ph-`, `lh-`, `ih-`) for no reason a visitor could see.
 *
 * The motion belongs to the *role* an element plays in a hero, not to the page
 * it happens to sit on. So the contract is a small set of class names, and any
 * hero that marks its parts up with them gets the site's hero language for
 * free. A page that wants a different rhythm changes the copy it passes, not
 * the curve it moves on.
 *
 * ── The contract ──
 *
 * | class              | role                                              |
 * |--------------------|---------------------------------------------------|
 * | `hero-bg`          | the photograph's wrapper; settles over DUR.scene   |
 * | `hero-bg-media`    | the `<Image>` itself; the parallax target          |
 * | `hero-scrim`       | gradient overlays; fade in behind the copy         |
 * | `hero-crumb-line`  | the hairline rule that draws before the trail      |
 * | `hero-crumb-text`  | the breadcrumb trail                               |
 * | `hero-accent`      | the one pill that pops last, the yellow beat       |
 * | `hero-aside-item`  | rows of a right-hand column; stagger in            |
 * | `hero-detail`      | the bottom credibility strip; staggers in last     |
 *
 * Every one of them also carries `gsap-enter`, which is what the pre-hydration
 * gate in web-theme.css keys off. See the note on `web-preanim` below.
 *
 * ── Selectors are scoped, so the names need no page prefix ──
 *
 * `useGSAP`'s `scope` resolves every selector string inside `scopeRef`, and a
 * page has exactly one hero, so `.hero-bg` cannot collide with anything. The
 * `ph-`/`lh-`/`ih-` prefixes were guarding against a problem that scoping had
 * already solved.
 */
export function useHeroMotion({
  scopeRef,
  headlineRef,
  leadRef,
}: {
  /** The `<section>`. Scopes every selector and measures the parallax. */
  scopeRef: RefObject<HTMLElement | null>;
  /**
   * Split into masked words. A client hero passes a ref; a hero rendered by a
   * server component cannot, so `.hero-headline` inside the scope is used
   * instead. Omit both to leave the headline still.
   */
  headlineRef?: RefObject<HTMLElement | null>;
  /** Split into masked lines. Falls back to `.hero-lead`, as above. */
  leadRef?: RefObject<HTMLElement | null>;
}) {
  useGSAP(
    () => {
      registerWebMotion();

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        // clearProps on every tween is what stops an interrupted entrance from
        // stranding an element at opacity 0: a from() writes the START state as
        // inline style, and if the tween is killed or reverted mid-flight those
        // styles stay. Clearing what GSAP touched degrades a broken entrance to
        // "no animation", never to "invisible".
        const tl = gsap.timeline({
          defaults: { ease: "sun.rise", clearProps: "opacity,transform" },
        });

        /**
         * Add a step only if this hero actually has that part.
         *
         * The class contract is a menu, not a checklist: Properties has an
         * accent pill and no aside, Services has an aside and no pill, an
         * article hero has neither and no breadcrumb rule. Handing GSAP a
         * selector that matches nothing is harmless to the animation but logs
         * "target not found" for every absent role on every page load, which
         * buries real warnings in noise. Resolving the nodes here and skipping
         * empty sets keeps the console honest, and passing elements rather
         * than a selector string saves GSAP re-querying them.
         */
        const part = (
          selector: string,
          vars: gsap.TweenVars,
          position: gsap.Position
        ) => {
          const nodes = scopeRef.current?.querySelectorAll<HTMLElement>(selector);
          if (!nodes || nodes.length === 0) return;
          tl.from(Array.from(nodes), vars, position);
        };

        // ── The scene ──────────────────────────────────────────────────────
        // The photograph is deliberately geological next to the copy: it is
        // still settling when the words have finished arriving, which is what
        // gives the band depth instead of the flat "everything lands together"
        // of a template.
        part(
          ".hero-bg",
          { scale: 1.12, opacity: 0, duration: DUR.scene, ease: "sun.settle" },
          0
        );

        // Scrims trail the photograph rather than arriving with it, so the
        // image reads as being *graded* on screen rather than as two stacked
        // layers fading up together.
        part(
          ".hero-scrim",
          { opacity: 0, duration: DUR.panel, ease: "sun.settle" },
          "<0.25"
        );

        // ── The rule, then the trail it introduces ─────────────────────────
        // Drawing the rule first reads as the breadcrumb's underline arriving
        // ahead of it, rather than as two unrelated things fading in together.
        part(
          ".hero-crumb-line",
          { scaleX: 0, transformOrigin: "left center", duration: DUR.base },
          0.32
        );
        part(
          ".hero-crumb-text",
          { opacity: 0, x: -12, duration: DUR.base * 0.85 },
          "<0.16"
        );

        // ── The headline, masked ───────────────────────────────────────────
        // Words rise out of their own line box rather than fading in over the
        // photograph. This is the signature gesture and the whole reason for
        // SplitText: a fade cannot be made to look authored, a mask can. The
        // slight rotation stops a row of words rising in perfect parallel from
        // reading as a lift rather than as type settling.
        const headline =
          headlineRef?.current ??
          scopeRef.current?.querySelector<HTMLElement>(".hero-headline") ??
          null;

        if (headline) {
          splitLines(headline, (self) =>
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

        // The lead moves by line, not by word: a paragraph animated per word
        // draws attention to the animation instead of to the sentence.
        const lead =
          leadRef?.current ??
          scopeRef.current?.querySelector<HTMLElement>(".hero-lead") ??
          null;

        if (lead) {
          splitLines(lead, (self) =>
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

        // ── The accent pill, the final beat ────────────────────────────────
        // back.out overshoots, which on a small pill reads as arrival. The same
        // curve on a large panel would read as a wobble, which is why only this
        // element gets it.
        part(
          ".hero-accent",
          { scale: 0.78, opacity: 0, duration: DUR.base, ease: "back.out(1.8)" },
          "<0.22"
        );

        // ── Supporting columns ─────────────────────────────────────────────
        // A right-hand directory or a credibility strip is a list, so it enters
        // as a list. Staggering these rather than fading the block whole is the
        // difference between a hero that assembles and one that just appears.
        part(
          ".hero-aside-item",
          { opacity: 0, x: 18, duration: DUR.base, stagger: STAGGER.tight },
          "<0.05"
        );
        part(
          ".hero-detail",
          { opacity: 0, y: 12, duration: DUR.base, stagger: STAGGER.tight },
          "<0.12"
        );
      });

      // ── Parallax on exit, desktop only ───────────────────────────────────
      // A passive scroll listener rather than ScrollTrigger: this needs exactly
      // one number, how far through the hero the page has scrolled, and that is
      // three lines of arithmetic. A scroll-position engine for that costs
      // ~40KB and an initialisation order that has to be exactly right.
      //
      // Gated above 1024px deliberately. Parallax on a phone means compositing
      // a full-bleed image on every frame of a touch scroll, on the hardware
      // least able to afford it, for an effect largely lost on a small screen.
      media.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const section = scopeRef.current;
          const image = section?.querySelector<HTMLElement>(".hero-bg-media");
          if (!section || !image) return;

          const quickY = gsap.quickTo(image, "yPercent", { duration: 0.45, ease: "none" });
          // scaleX/scaleY rather than the `scale` shorthand: GSAP tracks a
          // composite "scale" as a single transform-cache entry, and once
          // yPercent is also being written to the same element that entry can
          // no longer be isolated for clearProps. The two axes are each their
          // own entry and reset cleanly.
          const quickScaleX = gsap.quickTo(image, "scaleX", { duration: 0.45, ease: "none" });
          const quickScaleY = gsap.quickTo(image, "scaleY", { duration: 0.45, ease: "none" });

          let frame = 0;
          const update = () => {
            frame = 0;
            const height = section.offsetHeight || 1;
            // 0 at rest, 1 once the hero has fully left the top of the screen.
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
            // At most one write per frame, so a momentum scroll cannot queue
            // work faster than the compositor drains it.
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

      // Hand the pre-hydration gate back, exactly as the home hero does.
      //
      // Every from() above has already written its hidden start state as inline
      // style by the time this line runs, and inline style outranks the CSS
      // rule regardless of whether the class is still on <html>. Removing it
      // here rather than inside the branch is what guarantees a split headline
      // is never painted unsplit: SplitText has already wrapped it above. The
      // reduced-motion path hides nothing, so it has nothing to hand back, and
      // the layout's own timeout covers a bundle that never arrives at all.
      document.documentElement.classList.remove("web-preanim");

      return () => media.revert();
    },
    { scope: scopeRef }
  );
}
