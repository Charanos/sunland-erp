"use client";

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";

/**
 * The motion language for the public site.
 *
 * One file so the header and the hero move to the same rules. Before this, each
 * component invented its own durations and reached for whatever built-in ease
 * looked close, which is why the two never felt like one system: the header
 * condensed on `power3` over 550ms while the hero rose on `power4` over 1000ms,
 * and the eye reads that as two different products.
 *
 * ── The eases ──
 *
 * Four curves, each with a job. They are cubic-beziers rather than GSAP's
 * built-in `powerN` family because the built-ins are symmetric families tuned
 * for general use, and a brand's motion should be as specific as its type.
 *
 * `sun.rise`     Entrances. Leaves the origin hard and lands over a long flat
 *                tail, so an element arrives early and settles late. This is
 *                what stops a stagger reading as a mechanical conveyor.
 * `sun.settle`   Panels and surfaces. Softer departure than `rise`, because a
 *                large rectangle moving fast reads as a jolt where a word does
 *                not.
 * `sun.glide`    Reversible state, chiefly the header condensing. Symmetric,
 *                so condensing and expanding are the same gesture played in
 *                opposite directions.
 * `sun.snap`     Small interactive feedback: the nav indicator, a chip. Quick
 *                out, no overshoot, because overshoot on a 40px element reads
 *                as a bug rather than as character.
 */

/**
 * Registration happens at module scope, not inside a function a component
 * calls during render.
 *
 * This is load-bearing and was a real bug. `gsap.timeline({ scrollTrigger })`
 * only recognises those vars if ScrollTrigger is registered at the moment the
 * timeline is constructed. Registering from inside a `useGSAP` callback meant
 * whichever component ran first registered the plugin, but any timeline built
 * in that same pass had already read its vars: the `scrollTrigger` key was
 * silently dropped, no error was thrown, and the hero parallax and every
 * scroll reveal simply never ran.
 *
 * A module-scope side effect runs once at import time, which is always before
 * any component body that imported it. The window guard keeps it inert during
 * server rendering.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase, SplitText);

  CustomEase.create("sun.rise", "0.16, 1, 0.28, 1");
  CustomEase.create("sun.settle", "0.22, 1, 0.36, 1");
  CustomEase.create("sun.glide", "0.65, 0, 0.35, 1");
  CustomEase.create("sun.snap", "0.33, 1, 0.5, 1");
}

/**
 * Kept as a no-op-safe entry point so call sites read intentionally and so a
 * component that uses the motion language cannot forget to import this module,
 * which is what actually triggers the registration above.
 */
export function registerWebMotion() {
  // Intentionally empty: importing this module is the registration.
}

/**
 * The duration scale.
 *
 * Ratios, not arbitrary numbers. Each step is roughly 1.5x the one below, which
 * is the same reasoning as a type scale: related values that are visibly
 * distinct without anyone having to remember which is which.
 */
export const DUR = {
  /** Indicator moves, chip states. */
  snap: 0.32,
  /** Most element entrances. */
  base: 0.72,
  /** Panels, surfaces, the header condense. */
  panel: 0.9,
  /** The background image, which should feel geological next to the rest. */
  scene: 1.9,
} as const;

/** Stagger values, so a cascade in the header matches one in the hero. */
export const STAGGER = {
  tight: 0.045,
  words: 0.06,
  cards: 0.08,
} as const;

/**
 * Whether the visitor has asked for less movement.
 *
 * Read at call time rather than cached: a visitor can change the system setting
 * with the page open, and `matchMedia` in a `gsap.matchMedia()` context will
 * re-run the branch when they do.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Split an element into masked lines and words, ready to animate.
 *
 * Wraps `SplitText.create` with the settings this site always wants:
 *
 * - `mask: "lines"` gives each line an `overflow: hidden` parent, which is what
 *   makes a headline rise out of its own baseline rather than fade in on top of
 *   the photograph. It is the single gesture that makes the hero look authored.
 * - `autoSplit` re-splits when the font finally loads or the box is resized.
 *   Without it, lines measured against the fallback font are wrong the moment
 *   Cormorant arrives, and the mask clips mid-glyph.
 * - `onSplit` returns the tween so GSAP owns it across those re-splits.
 *
 * The caller must `revert()` the returned instance on cleanup, or the wrapper
 * elements stay in the DOM and the next split nests inside them.
 */
export function splitLines(
  target: Element,
  build: (self: SplitText) => gsap.core.Animation | void
): SplitText {
  return SplitText.create(target, {
    type: "lines,words",
    mask: "lines",
    // Screen readers should hear the sentence, not a bag of words.
    aria: "auto",
    autoSplit: true,
    linesClass: "sun-line",
    wordsClass: "sun-word",
    onSplit: build,
  });
}
