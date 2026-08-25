"use client";

import { useRef } from "react";
import { useHeroMotion } from "@/lib/motion/use-hero-motion";

/**
 * A `<section>` that runs the shared hero choreography.
 *
 * The five directory heroes are client components already, so they call
 * `useHeroMotion` directly with refs. The area and listing detail heroes are
 * not: they live inside `async` server components that await params and hit
 * the database, and their markup is interleaved with that server-fetched
 * data. Lifting them wholesale into client components would mean plumbing a
 * dozen props across a boundary purely to gain an animation.
 *
 * This is the seam instead. It renders the same `<section>` the page already
 * had — same tag, same classes, same children — and adds only the ref that
 * gives the hook something to scope selectors to and measure parallax
 * against. The page swaps one element name and marks its parts with the
 * class contract; nothing about the layout moves.
 *
 * The headline and lead are found by class rather than by ref, since a server
 * component cannot hand one down. `.hero-headline` and `.hero-lead` are the
 * two the hook looks for.
 */
export function HeroMotionSection({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"section">) {
  const sectionRef = useRef<HTMLElement>(null);

  useHeroMotion({ scopeRef: sectionRef });

  return (
    <section ref={sectionRef} {...props}>
      {children}
    </section>
  );
}
