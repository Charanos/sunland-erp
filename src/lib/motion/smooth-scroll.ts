"use client";

import Lenis from "lenis";
import gsap from "gsap";

/**
 * The site's momentum scroll.
 *
 * ── Why this exists at all ──
 *
 * `scroll-behavior: smooth` only affects programmatic and anchor scrolls; it
 * does nothing to ordinary wheel or touch scrolling, which is what actually
 * defines how a page feels under the hand. Lenis intercepts the real scroll
 * input and eases it, which is the only way to get the weighted, decelerating
 * motion this site's other bespoke timing already promises elsewhere.
 *
 * ── Why a singleton, not a hook ──
 *
 * There is exactly one scrollable document. A hook invites two components to
 * each instantiate their own Lenis, which is two competing raf loops each
 * trying to own `window.scrollTo`. This module owns the one instance and
 * everything else asks it for things: the ticker, `scrollTo`, pause and
 * resume.
 *
 * ── Why the GSAP ticker drives it, not its own rAF ──
 *
 * `useGSAP` hooks across the header, the hero and the reveal system are
 * already inside GSAP's own `requestAnimationFrame` loop. Giving Lenis a
 * second independent rAF would mean two callbacks racing to read and write
 * scroll-derived layout on the same frame, in an order the browser does not
 * guarantee. `gsap.ticker.add()` puts Lenis's step inside the same loop
 * everything else already runs in, which is Lenis's own documented GSAP
 * integration, not an improvised one.
 *
 * ── Reduced motion ──
 *
 * Never constructed at all under `prefers-reduced-motion: reduce`. Lenis's
 * own easing options cannot be set to "instant"; the only correct way to
 * honour the preference is to leave native scrolling completely alone.
 */

let lenis: Lenis | null = null;
let tickerFn: ((time: number) => void) | null = null;

/** Idempotent: safe to call from more than one mounted component. */
export function initSmoothScroll(): void {
  if (typeof window === "undefined" || lenis) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  lenis = new Lenis({
    // A shade lighter than Lenis's own default (0.1). Heavier damping reads
    // as sluggish on a page whose other motion is already fast and precise;
    // this keeps the lag just perceptible enough to feel weighted.
    lerp: 0.11,
    smoothWheel: true,
    // Native touch momentum already feels right on a phone. Lenis smoothing
    // touch input on top of the OS's own inertia is where "smooth scroll"
    // libraries most commonly turn a page rubbery instead of premium.
    syncTouch: false,
  });

  // gsap.ticker reports seconds; Lenis wants milliseconds.
  tickerFn = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tickerFn);
}

export function destroySmoothScroll(): void {
  if (tickerFn) gsap.ticker.remove(tickerFn);
  tickerFn = null;
  lenis?.destroy();
  lenis = null;
}

/** Paused while a drawer or dialog holds the body still, so Lenis is not
 *  fighting `useBodyScrollLock`'s own position:fixed trick for ownership of
 *  the scroll position underneath an open overlay. */
export function stopSmoothScroll(): void {
  lenis?.stop();
}

/**
 * Resume after `stopSmoothScroll()`.
 *
 * `resyncTo`, when given, snaps Lenis's internal target and animated scroll
 * values to that position before resuming. Lenis only learns the page moved
 * by listening for native `scroll` events; while the body is `position:fixed`
 * during a lock, the window never scrolls, so nothing dispatches one and its
 * internal state stays exactly where it was the instant `stopSmoothScroll()`
 * ran. Resuming without this, after `useBodyScrollLock` restores the native
 * position, would have Lenis ease from that stale pre-lock target back to
 * wherever the page actually is, a visible jump-then-slide. `force: true` is
 * required because the instance is still stopped at the moment this runs.
 */
export function startSmoothScroll(resyncTo?: number): void {
  if (lenis && resyncTo !== undefined) {
    lenis.scrollTo(resyncTo, { immediate: true, force: true });
  }
  lenis?.start();
}

/**
 * Smoothly scroll to a target, honouring the fixed header.
 *
 * Falls back to the native instant jump when Lenis was never constructed,
 * which is both the reduced-motion path and the "script has not run yet"
 * path, so a click that lands before hydration still works.
 *
 * The offset is read from the header's live height rather than a constant:
 * the header is 72px on a phone and 96px above 640px, and it also condenses
 * on scroll on the home page, so a fixed number is wrong somewhere on every
 * page. Reading `offsetHeight` at the moment of the click is the only value
 * that is never stale.
 */
export function smoothScrollTo(target: HTMLElement | string): void {
  const headerHeight = document.querySelector("header")?.getBoundingClientRect().height ?? 0;
  // A little extra air below the header, so a heading does not sit flush
  // against it.
  const offset = -(headerHeight + 16);

  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.1 });
    return;
  }

  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: "smooth" });
}
