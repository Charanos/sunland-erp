"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import gsap from "gsap";
import { DUR, registerWebMotion, STAGGER } from "@/lib/motion/web-motion";

/**
 * Scroll-reveal orchestrator + pagination scroll anchor, scoped to the
 * properties page body.
 *
 * Two responsibilities:
 *
 * 1. INITIAL REVEAL — on first mount, hides and stagger-reveals the FilterRail,
 *    toolbar, and listing cards as they scroll into view. Uses its own
 *    IntersectionObserver with no isBelowFold heuristic (the global
 *    RevealController skips elements that are within 92% of the viewport at
 *    load, which incorrectly skips cards sitting just below the hero).
 *
 * 2. RESULTS SCROLL — on filter/page URL change, scrolls the results section
 *    into view smoothly. This prevents two problems:
 *      a. Pagination without scroll: the user clicks "Next" and the grid
 *         updates but their position stays mid-page — they don't know anything
 *         changed.
 *      b. Pagination with default scroll=true: the browser jumps to the very
 *         top of the page (the hero), which is jarring and far from the grid.
 *    The target is the `#results-anchor` element, placed at the top of the
 *    results section, yielding a smooth scroll that lands just above the
 *    toolbar.
 *
 * 3. POST-NAVIGATION RE-REVEAL — re-runs card reveals after a Suspense
 *    boundary resolves new cards (filter change / page change). The initial
 *    reveal runs once on mount; subsequent navigation remounts PropertiesResults,
 *    so new cards need a fresh reveal cycle. This is driven by a
 *    MutationObserver watching the results section for DOM changes.
 */
export function PropertiesPageReveal() {
  const didInit = useRef(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ── Pagination scroll ──────────────────────────────────────────────────────
  // Fires whenever the URL's filter/page params change. Scrolls to the top
  // of the results section, NOT the page top. Does not fire on first render.
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    const anchor = document.getElementById("results-anchor");
    if (!anchor) return;
    const navHeight = 80; // approximate condensed nav height
    const top = anchor.getBoundingClientRect().top + window.scrollY - navHeight - 16;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, [pathname, searchParams]);

  // ── Reveal logic ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    registerWebMotion();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    runReveal();

    // Re-run reveal each time PropertiesResults remounts new cards.
    // MutationObserver watches the results section for childList changes —
    // when the Suspense boundary replaces the skeleton with real cards,
    // this fires and we reveal the fresh cards.
    const resultsSection = document.querySelector("[aria-label='Results']");
    if (!resultsSection) return;

    let revealTimer: ReturnType<typeof setTimeout>;
    const mut = new MutationObserver(() => {
      // Debounce: React may batch multiple DOM mutations in one frame.
      clearTimeout(revealTimer);
      revealTimer = setTimeout(() => runReveal(true), 60);
    });
    mut.observe(resultsSection, { childList: true, subtree: true });

    return () => {
      mut.disconnect();
      clearTimeout(revealTimer);
    };
  }, []);

  return null;
}

/**
 * Core reveal pass. Called on first mount and after every Suspense resolution.
 * @param rerun true when called for a filter/page change (skips rail re-animation)
 */
function runReveal(rerun = false) {
  const rail = document.querySelector<HTMLElement>(".ph-reveal-rail");
  const toolbar = document.querySelector<HTMLElement>(".ph-reveal-toolbar");
  const cards = gsap.utils.toArray<HTMLElement>(".ph-reveal-card");
  const footer = document.querySelector<HTMLElement>(".ph-reveal-footer");
  const cta = document.querySelector<HTMLElement>(".ph-reveal-cta");
  const empty = document.querySelector<HTMLElement>(".ph-reveal-empty");

  if (!toolbar && cards.length === 0 && !empty) return;

  // ── Apply hidden states ──────────────────────────────────────────────────
  // On rerun (filter change) skip rail — it's already visible and sticky.
  if (!rerun && rail) gsap.set(rail, { x: -32, opacity: 0 });
  if (toolbar) gsap.set(toolbar, { y: 20, opacity: 0 });
  if (cards.length > 0) gsap.set(cards, { y: 28, opacity: 0 });
  if (footer) gsap.set(footer, { y: 20, opacity: 0 });
  if (cta) gsap.set(cta, { y: 24, opacity: 0 });
  if (empty) gsap.set(empty, { y: 20, opacity: 0 });

  const revealed = new Set<Element>();

  const reveal = (
    targets: HTMLElement | HTMLElement[],
    extras?: gsap.TweenVars
  ) =>
    gsap.to(targets, {
      x: 0,
      y: 0,
      opacity: 1,
      duration: DUR.base,
      ease: "sun.rise",
      clearProps: "opacity,transform",
      ...extras,
    });

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting || revealed.has(entry.target)) continue;
        revealed.add(entry.target);
        observer.unobserve(entry.target);

        const el = entry.target as HTMLElement;

        if (!rerun && el === rail) {
          reveal(el, { x: -32, ease: "sun.settle" });
        } else if (el === toolbar) {
          reveal(el);
        } else if (el.classList.contains("ph-reveal-card")) {
          // Batch: grab all cards currently in the viewport and stagger them.
          const inView = cards.filter((c) => {
            if (revealed.has(c)) return false;
            const r = c.getBoundingClientRect();
            return r.top < window.innerHeight && r.bottom > 0;
          });
          inView.forEach((c) => {
            revealed.add(c);
            observer.unobserve(c);
          });
          const batch = [el, ...inView.filter((c) => c !== el)];
          const stillHidden = batch.filter(
            (c) => (gsap.getProperty(c, "opacity") as number) < 0.5
          );
          if (stillHidden.length > 0) {
            gsap.to(stillHidden, {
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
    { rootMargin: "-4% 0px 0px 0px", threshold: 0.03 }
  );

  const targets: (HTMLElement | null)[] = [
    rerun ? null : rail,
    toolbar,
    ...cards,
    footer,
    cta,
    empty,
  ];
  for (const t of targets) {
    if (t) observer.observe(t);
  }

  // Disconnect after a generous window — any element not intersecting within
  // 12s doesn't need animation (user never scrolled to it).
  setTimeout(() => observer.disconnect(), 12_000);
}
