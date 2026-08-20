"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { DUR, registerWebMotion, STAGGER } from "@/lib/motion/web-motion";

/**
 * Scroll-reveal orchestrator scoped to the properties page body.
 *
 * Why this rather than the global RevealController?
 *
 * RevealController has an `isBelowFold` guard: elements already within 92% of
 * the viewport at load are skipped (correct behaviour for a normal editorial
 * page). The properties grid sits immediately below a 68svh hero, so on a
 * large monitor the first two rows of cards can already be in that window at
 * load time and never enter `pending`. Nothing is hidden, nothing animates.
 *
 * This component owns its own IntersectionObserver and applies hidden state
 * unconditionally, then reveals on intersection — no fold heuristic. It is
 * intentionally scoped to this page via class selectors rather than global
 * data-* attributes, so it cannot interfere with any other page's reveal.
 *
 * Targets (wired by the server-rendered listing-index markup):
 *   .ph-reveal-rail      — FilterRail column (slides from left)
 *   .ph-reveal-toolbar   — ResultsToolbar row (rises)
 *   .ph-reveal-card      — individual listing card <li> (staggered rise)
 *   .ph-reveal-footer    — Pagination row (rises)
 *   .ph-reveal-cta       — RegisterRequirement block (rises)
 *   .ph-reveal-empty     — EmptyResults block (rises)
 */
export function PropertiesPageReveal() {
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    registerWebMotion();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // ── Collect targets ───────────────────────────────────────────────────
    const rail = document.querySelector<HTMLElement>(".ph-reveal-rail");
    const toolbar = document.querySelector<HTMLElement>(".ph-reveal-toolbar");
    const cards = gsap.utils.toArray<HTMLElement>(".ph-reveal-card");
    const footer = document.querySelector<HTMLElement>(".ph-reveal-footer");
    const cta = document.querySelector<HTMLElement>(".ph-reveal-cta");
    const empty = document.querySelector<HTMLElement>(".ph-reveal-empty");

    if (!rail && !toolbar && cards.length === 0) return;

    // ── Apply hidden states immediately ────────────────────────────────────
    // These are written synchronously before the first paint so there is
    // never a flicker where content is visible then jumps hidden.
    if (rail) gsap.set(rail, { x: -32, opacity: 0 });
    if (toolbar) gsap.set(toolbar, { y: 20, opacity: 0 });
    if (cards.length > 0) gsap.set(cards, { y: 28, opacity: 0 });
    if (footer) gsap.set(footer, { y: 20, opacity: 0 });
    if (cta) gsap.set(cta, { y: 24, opacity: 0 });
    if (empty) gsap.set(empty, { y: 20, opacity: 0 });

    // ── Shared reveal config ───────────────────────────────────────────────
    const reveal = (targets: HTMLElement | HTMLElement[], extras?: gsap.TweenVars) =>
      gsap.to(targets, {
        x: 0,
        y: 0,
        opacity: 1,
        duration: DUR.base,
        ease: "sun.rise",
        clearProps: "opacity,transform",
        ...extras,
      });

    // ── IntersectionObserver — no fold pre-check ───────────────────────────
    // Each target fires its own reveal the first time it enters the viewport.
    // Using `rootMargin: "-8% 0px"` so the animation resolves just as the
    // element becomes readable, not as its top pixel barely peeks over the fold.
    const observed = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || observed.has(entry.target)) continue;
          observed.add(entry.target);
          observer.unobserve(entry.target);

          const el = entry.target as HTMLElement;

          if (el === rail) {
            reveal(el, { x: -32, ease: "sun.settle" });
          } else if (el === toolbar) {
            reveal(el);
          } else if (el.classList.contains("ph-reveal-card")) {
            // For individual cards we fire a single stagger on the whole
            // batch that is now intersecting. We collect all un-revealed cards
            // and stagger them together — one smooth wave, not N individual tweens.
            const batch = cards.filter((c) => !observed.has(c));
            // Mark all visible cards as observed so subsequent intersections
            // don't re-trigger them.
            batch.forEach((c) => {
              if (entry.target === c || c.getBoundingClientRect().top < window.innerHeight) {
                observed.add(c);
                observer.unobserve(c);
              }
            });
            const toAnimate = cards.filter((c) => observed.has(c) && c !== entry.target);
            // Always include the intersecting card itself
            const all = [el, ...toAnimate.filter((c) => c !== el)];
            // Only animate those still at hidden state (not yet cleared)
            const pending = all.filter(
              (c) => gsap.getProperty(c, "opacity") !== 1
            );
            if (pending.length) {
              gsap.to(pending, {
                y: 0,
                opacity: 1,
                duration: DUR.base,
                ease: "sun.rise",
                stagger: { each: STAGGER.cards, from: "start" },
                clearProps: "opacity,transform",
              });
            }
          } else if (el === footer) {
            reveal(el);
          } else if (el === cta) {
            reveal(el, { duration: DUR.panel, ease: "sun.settle" });
          } else if (el === empty) {
            reveal(el);
          }
        }
      },
      { rootMargin: "-6% 0px 0px 0px", threshold: 0.04 }
    );

    const targets: (HTMLElement | null)[] = [rail, toolbar, ...cards, footer, cta, empty];
    for (const t of targets) {
      if (t) observer.observe(t);
    }

    return () => {
      observer.disconnect();
      // Restore any still-hidden elements so a route change cannot
      // strand content at opacity 0.
      for (const t of targets) {
        if (t) gsap.set(t, { clearProps: "opacity,transform" });
      }
    };
  }, []);

  return null;
}
