"use client";

import { useEffect, useRef, useState } from "react";

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
 * Two implementation notes, both load-bearing:
 *
 * The listener registers once, on mount. Keeping `scrollDirection` in the
 * dependency array would tear down and re-register on every direction change,
 * and `lastScrollY` would reset to the current position each time, which
 * quietly breaks the jitter threshold below. The current direction is read
 * from a ref instead.
 *
 * There is no initial `setState` in the effect body. The initial value is
 * already "top", so setting it again on mount is a render for no change, and
 * the first real scroll event corrects it anyway.
 */
export function useScrollDirection(): ScrollDirection {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>("top");
  const directionRef = useRef<ScrollDirection>("top");

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

    // Read once on mount so a page restored mid-scroll starts correct.
    update();

    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return scrollDirection;
}
