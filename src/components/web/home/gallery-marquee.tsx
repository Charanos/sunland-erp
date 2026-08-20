"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * The gallery ribbon's motion wrapper.
 *
 * ── The bug this exists to fix ──
 *
 * A CSS `animation: … infinite` never stops. The ribbon carries twelve large
 * photographs and a promoted compositing layer, and it was animating all of
 * them continuously whether or not the section was anywhere near the screen.
 * On a phone that is a measurable, permanent battery draw for something the
 * visitor is not looking at, and it is running during the hero, during the
 * search, during everything.
 *
 * An IntersectionObserver pauses it whenever the band is off screen. Cheap,
 * passive, and it costs nothing when the observer is unsupported because the
 * fallback is simply "keep playing", which is the old behaviour.
 *
 * ── Why the layer promotion is conditional too ──
 *
 * `will-change: transform` held permanently keeps a very wide layer in memory
 * for the life of the page. It is applied only while the ribbon is actually
 * moving, which is the whole point of the hint: promote for the animation,
 * release afterwards.
 *
 * ── Reduced motion ──
 *
 * The global stylesheet rule collapses animation durations to 1ms, which for
 * a marquee means it jumps instantly to its end position and sits there,
 * showing the second half of a duplicated list. That is worse than not
 * animating. Here the animation is not applied at all under reduced motion,
 * and the ribbon becomes a normal horizontally scrollable row the visitor
 * drives themselves.
 */
export function GalleryMarquee({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      // A little margin so it is already moving by the time it is looked at,
      // rather than visibly starting from rest as it crosses the edge.
      { rootMargin: "200px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const animating = inView && !reduced;

  return (
    <div
      ref={ref}
      // Under reduced motion this is a real scroll container the visitor
      // operates, so it needs to be reachable and focusable to be usable by
      // keyboard. While animating it is decorative and stays out of the way.
      {...(reduced
        ? { tabIndex: 0, role: "region", "aria-label": "Featured residences, scroll to browse" }
        : {})}
      className={
        reduced
          ? "relative w-full overflow-x-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-yellow"
          : "relative w-full overflow-hidden"
      }
    >
      <div
        className={`flex w-max gap-5 py-2 sm:gap-6 ${animating ? "animate-web-marquee" : ""}`}
        style={{
          // Promoted only while it moves, then released.
          willChange: animating ? "transform" : "auto",
          animationPlayState: animating ? "running" : "paused",
        }}
      >
        {children}
      </div>
    </div>
  );
}
