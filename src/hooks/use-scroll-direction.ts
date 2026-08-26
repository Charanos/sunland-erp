"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

export type ScrollDirection = "up" | "down" | "top";

/**
 * Scroll direction, for headers that hide on the way down and return on the
 * way up.
 *
 * Three states rather than two: "top" is distinct from "up" because a header
 * sitting over a hero should be transparent at rest and solid once it has
 * anything behind it, which is a different question from which way the
 * visitor is currently moving.
 *
 * Three implementation notes, all load-bearing:
 *
 * The listener registers once, on mount. Keeping `scrollDirection` in the
 * dependency array would tear down and re-register on every direction change,
 * and `lastScrollY` would reset to the current position each time, which
 * quietly breaks the jitter threshold below. The current direction is read
 * from a ref instead.
 *
 * The `useState` initializer always returns `"top"`, on the server and on the
 * client alike — it does not read `window.scrollY`. A consumer in this repo
 * (`WebHeader`) freezes its very first render's derived state into a
 * `useState` lazy initializer of its own for the "no flash before JS" SSR
 * contract, on the documented assumption that this hook's initial value is
 * identical on both sides. Reading real scroll position here would break
 * that assumption and reintroduce a hydration mismatch on every page that
 * loads already scrolled — trading one flash for a worse one.
 *
 * The correction for "loaded already scrolled" instead happens in a
 * `useLayoutEffect`, which commits before the browser paints, so the visitor
 * never sees the momentarily-wrong `"top"` frame. It is a genuinely separate
 * codepath from the scroll listener below, not a call to the same `update()`
 * — `update()` seeds `lastScrollY` from `window.scrollY` and then diffs
 * against it, so calling it on mount always measures a delta of zero and can
 * never detect "already scrolled" on its own. That was the previous bug: a
 * page restored mid-scroll stayed stuck reporting `"top"` forever, not just
 * for a frame, because nothing after mount ever supplied a non-zero delta
 * without the visitor scrolling further first.
 */
export function useScrollDirection(): ScrollDirection {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>("top");
  const directionRef = useRef<ScrollDirection>("top");

  useLayoutEffect(() => {
    if (window.scrollY <= 50) return;
    directionRef.current = "up";
    // This is the documented exception to the rule below, not an oversight:
    // a one-time measurement of real scroll position, corrected before the
    // browser's first paint so a page loaded mid-scroll never flashes the
    // "top" frame. A `useEffect` here would run after paint and produce the
    // exact flash this exists to prevent.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setScrollDirection("up");
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const update = () => {
      const scrollY = window.scrollY;
      const delta = scrollY - lastScrollY;

      let next: ScrollDirection = directionRef.current;

      if (scrollY <= 50) {
        // The very top, so the header can sit transparent over the hero.
        next = "top";
      } else if (Math.abs(delta) > 5) {
        // The 5px threshold absorbs trackpad and momentum jitter, which would
        // otherwise flip the header several times a second.
        next = delta > 0 ? "down" : "up";
      }

      lastScrollY = scrollY > 0 ? scrollY : 0;

      if (next !== directionRef.current) {
        directionRef.current = next;
        setScrollDirection(next);
      }
    };

    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return scrollDirection;
}
