"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { DUR, STAGGER } from "@/lib/motion/web-motion";

/**
 * Scroll reveal for the marketing pages.
 *
 * ── What may and may not be animated ──
 *
 * This page joins its dark bands with a scrim trick: the hero fades to black
 * at its bottom edge, and the section below opens with a black-to-transparent
 * gradient pinned to its own top edge. The two blacks meet and the seam
 * disappears. The same pairing runs again between the closing call to action
 * and the footer.
 *
 * That means **a scrim can never be transformed**. Move it a single pixel, or
 * fade it independently of the band behind it, and the join it exists to hide
 * becomes the most visible thing on the page. It is the reason this controller
 * reveals named content elements rather than whole sections: a section wrapper
 * contains its scrims, so animating the wrapper animates the trick.
 *
 * The rule, stated plainly for whoever adds the next band:
 *
 *   Animate headings, cards, list items, figures. Never a section, never a
 *   background layer, never anything with `aria-hidden` and `absolute`.
 *
 * `data-reveal` on one element reveals it as a unit. `data-reveal-group` on a
 * parent reveals each direct child as its own staggered entry. `data-reveal-x`
 * on either swaps the default vertical rise for a horizontal slide, so a page
 * is not every single block performing the identical fade-up: a value like
 * `-28` enters from the left, `28` from the right, the sign is the direction.
 *
 * ── Why IntersectionObserver and not ScrollTrigger ──
 *
 * ScrollTrigger is a scroll-position engine, and this needs one boolean per
 * element: has it come into view yet. IntersectionObserver answers exactly
 * that, natively, off the main thread, with no plugin registration order to
 * get wrong and no layout recalculation when images load late.
 *
 * GSAP still runs the tween, so reveals share the site's easing language.
 * Nothing on these pages needs a scroll-position engine: the hero parallax
 * derives its one number from a passive scroll listener, so ScrollTrigger is
 * not in the bundle at all.
 *
 * ── The no-JavaScript contract ──
 *
 * Markup ships visible. The hidden state is applied here, in a layout effect,
 * before paint. If this file never runs, nothing was ever hidden and the page
 * reads exactly as the HTML describes it. The inverse, hiding in CSS and
 * relying on script to restore, turns any script failure into a blank page.
 */
export function RevealController() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    const singles = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    const groups = gsap.utils.toArray<HTMLElement>("[data-reveal-group]");
    if (singles.length === 0 && groups.length === 0) return;

    // Anything already on screen is left untouched. A reveal that plays for
    // content the visitor is already reading is a flicker, not a reveal, and
    // on a short viewport the first band is often partly visible at load.
    const fold = window.innerHeight * 0.92;
    const isBelowFold = (el: HTMLElement) => el.getBoundingClientRect().top > fold;

    // Each trigger element carries its own targets and its own starting
    // offset, so one observer can drive a page where most things rise and a
    // few deliberately arrive from a side.
    const pending = new Map<HTMLElement, { targets: HTMLElement[]; x: number; y: number }>();

    // `data-reveal-x="-28"` slides a block in from the left, `"28"` from the
    // right. Omitted, it just rises 24px, which is the default for every
    // section that has not asked for anything more specific. This is what
    // lets one generic controller still produce a page where the landlord
    // band's console arrives from the right against a column that rises,
    // rather than every single element on the page performing an identical
    // fade-up.
    const readOffset = (el: HTMLElement) => {
      const raw = el.dataset.revealX;
      const x = raw ? Number(raw) : 0;
      return { x: Number.isFinite(x) ? x : 0, y: x ? 0 : 24 };
    };

    for (const el of singles) {
      if (!isBelowFold(el)) continue;
      pending.set(el, { targets: [el], ...readOffset(el) });
    }

    for (const group of groups) {
      if (!isBelowFold(group)) continue;
      // Direct children only: a nested grid would otherwise have its items
      // staggered twice, once by its own group and once by its ancestor's.
      const children = Array.from(group.children).filter(
        (node): node is HTMLElement => node instanceof HTMLElement
      );
      if (children.length > 0) pending.set(group, { targets: children, ...readOffset(group) });
    }

    if (pending.size === 0) return;

    for (const { targets, x, y } of pending.values()) {
      gsap.set(targets, { opacity: 0, x, y });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          const el = entry.target as HTMLElement;
          const record = pending.get(el);
          observer.unobserve(el);
          pending.delete(el);
          if (!record) continue;

          gsap.to(record.targets, {
            opacity: 1,
            x: 0,
            y: 0,
            duration: DUR.base,
            ease: "sun.rise",
            stagger: record.targets.length > 1 ? STAGGER.cards : 0,
            // Hands the resting state back to the stylesheet, so an
            // interrupted reveal can never strand an element at opacity 0.
            clearProps: "opacity,transform",
          });
        }
      },
      // Fires a little before the element's leading edge reaches the fold, so
      // the motion resolves as it becomes readable rather than after.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 }
    );

    for (const el of pending.keys()) observer.observe(el);

    return () => {
      observer.disconnect();
      // Anything still hidden when this unmounts is restored, so a route
      // change mid-reveal cannot leave content invisible.
      for (const { targets } of pending.values()) {
        gsap.set(targets, { clearProps: "opacity,transform" });
      }
    };
  }, []);

  return null;
}
