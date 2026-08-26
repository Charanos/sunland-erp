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
let resizeObserver: ResizeObserver | null = null;

/** Idempotent: safe to call from more than one mounted component. */
export function initSmoothScroll(): void {
  if (typeof window === "undefined" || lenis) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
    syncTouch: false,
    autoResize: true,
  });

  // gsap.ticker reports seconds; Lenis wants milliseconds.
  tickerFn = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tickerFn);

  if (typeof ResizeObserver !== "undefined" && document.body) {
    resizeObserver = new ResizeObserver(() => {
      lenis?.resize();
    });
    resizeObserver.observe(document.body);
  }
}

export function resizeSmoothScroll(): void {
  lenis?.resize();
}

export function destroySmoothScroll(): void {
  if (tickerFn) gsap.ticker.remove(tickerFn);
  tickerFn = null;
  resizeObserver?.disconnect();
  resizeObserver = null;
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
 * Snap Lenis's internal position to `y`, with no easing.
 *
 * Lenis only learns the page moved by reading native `scroll` events or by
 * going through its own `scrollTo`; it never observes an external
 * `window.scrollTo` call. So on a route change, a router (or our own code)
 * calling `window.scrollTo(0, 0)` moves the real page but leaves Lenis's
 * `animatedScroll`/target sitting at wherever the previous page's offset
 * was — and on the very next tick, Lenis eases the page from that stale
 * value back toward its own understanding of "correct", which is what reads
 * as a page loading half-scrolled. This keeps the two in lockstep. Safe to
 * call before Lenis exists (reduced motion, or before hydration): the
 * native fallback below covers the same intent.
 */
export function jumpSmoothScrollTo(y: number): void {
  if (lenis) {
    lenis.scrollTo(y, { immediate: true, force: true });
    return;
  }
  window.scrollTo(0, y);
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
