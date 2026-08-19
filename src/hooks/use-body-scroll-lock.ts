"use client";

import { useEffect } from "react";

/**
 * Lock body scroll while an overlay is open.
 *
 * `document.body.style.overflow = "hidden"` is the usual one-liner and it is
 * wrong in two ways that both show up on real devices:
 *
 * 1. **Desktop layout shift.** Removing the scrollbar widens the viewport by
 *    its width, so the whole page jumps sideways the instant a drawer opens
 *    and jumps back on close. Compensating with padding on the body keeps the
 *    layout still.
 *
 * 2. **iOS Safari scroll loss.** `overflow: hidden` on body does not reliably
 *    stop the page underneath, and when it does, Safari forgets where the
 *    visitor was. Position-fixing the body with a negative top offset holds
 *    the page still and remembers the offset, and restoring it puts them back
 *    exactly where they were rather than at the top of a long listing page.
 *
 * The fixed elements that should stay put while locked, the header and the
 * drawer itself, are unaffected: they are portalled or outside the locked
 * body flow, and the compensating padding is applied to the body rather than
 * to a wrapper, so it does not move them.
 */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const { body, documentElement } = document;
    const scrollY = window.scrollY;

    // The gutter the scrollbar was occupying. Zero on touch devices and on
    // desktops set to overlay scrollbars, which is the check that keeps this
    // from adding phantom padding on a phone.
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;

    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.left = previous.left;
      body.style.right = previous.right;
      body.style.width = previous.width;
      body.style.overflow = previous.overflow;
      body.style.paddingRight = previous.paddingRight;

      // Instant, not smooth: this is a restore, not a navigation, and a
      // smooth scroll here animates the page back under the visitor's cursor.
      window.scrollTo({ top: scrollY, behavior: "instant" as ScrollBehavior });
    };
  }, [locked]);
}
