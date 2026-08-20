"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { DUR, registerWebMotion } from "@/lib/motion/web-motion";
import { cn } from "@/lib/utils/cn";
import { HEADER_NAV } from "../constants/site";
import { MobileDrawer } from "./mobile-drawer";

/** The two visual end states, shared by the animated and reduced paths, and
 *  by the SSR-safe inline styles below. Module scope: nothing in it depends
 *  on props or state, so it does not need to be recreated every render. */
const HEADER_STATES = {
  transparent: {
    header: { top: "0px" },
    pill: { opacity: 0, scale: 0.97 },
    logo: { scale: 1, transformOrigin: "left center" },
    navList: { backgroundColor: "rgba(21, 25, 54, 0)", borderColor: "rgba(255, 255, 255, 0)", boxShadow: "none" },
    container: {
      paddingTop: "1.5rem",
      paddingBottom: "0rem",
      paddingLeft: "clamp(1.5rem, 3.5vw, 3.5rem)",
      paddingRight: "clamp(1.5rem, 3.5vw, 3.5rem)",
    },
  },
  condensed: {
    header: { top: "12px" },
    pill: { opacity: 1, scale: 1 },
    logo: { scale: 0.76, transformOrigin: "left center" },
    navList: { backgroundColor: "#151936", borderColor: "rgba(255, 255, 255, 0.12)", boxShadow: "0 4px 20px rgba(21,25,54,0.35)" },
    container: {
      paddingTop: "0.65rem",
      paddingBottom: "0.65rem",
      paddingLeft: "clamp(1rem, 2vw, 2rem)",
      paddingRight: "clamp(1rem, 2vw, 2rem)",
    },
  },
} as const;

/**
 * The site header.
 *
 * Three islands over a floating pill: the logo, a frosted navigation capsule,
 * and the sign-in action with the mobile trigger. On the home page it starts
 * transparent over the hero and condenses into the pill on scroll; everywhere
 * else it is the pill from the first paint.
 *
 * ── Three things this file has to get right ──
 *
 * **Motion is optional.** The whole condense-and-hide behaviour runs inside a
 * `gsap.matchMedia()` branch gated on `prefers-reduced-motion: no-preference`.
 * The reduced-motion branch sets the same end states with no tweens, so the
 * header still condenses, it just does not animate. Nothing is ever left in a
 * transformed or faded state that only a tween can undo.
 *
 * **The header must not move while the drawer is open.** Hiding on scroll-down
 * is fine on its own, but the drawer trigger lives in here, and a header that
 * slides away underneath an open dialog is disorienting. `drawerOpen` pins it.
 *
 * **Nothing `position: fixed` may render inside this element.** GSAP leaves a
 * transform on the header, and a transformed ancestor becomes the containing
 * block for fixed descendants, so `fixed inset-0` inside here means "the
 * header box" rather than "the viewport". That is what broke the mobile
 * drawer, and it is why `MobileDrawer` portals its panel to the body.
 */
export function WebHeader() {
  const pathname = usePathname();
  const scrollDirection = useScrollDirection();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isHome = pathname === "/";
  const isTransparent = isHome && scrollDirection === "top";
  const isHidden = scrollDirection === "down" && !drawerOpen;

  const headerRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pillBgRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const hasMountedRef = useRef(false);
  const navListRef = useRef<HTMLUListElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  // Stable, so the drawer's effect does not re-run on every header render.
  const handleOpenChange = useCallback((open: boolean) => setDrawerOpen(open), []);

  const states = HEADER_STATES;
  const target = isTransparent ? states.transparent : states.condensed;

  /**
   * The state the header renders in before any effect has run, frozen at the
   * value computed on the very first render and never touched again.
   *
   * `isHome` comes from `usePathname()` and `scrollDirection`'s initial value
   * is always `"top"`, on the server and on the client alike, so `target`
   * here is already correct at SSR time with no script required. Without
   * this, every visual property below lived only in a `gsap.set()` inside
   * `useGSAP`, which cannot run before the browser's first paint: the header
   * would flash in whatever bare state the Tailwind classes implied (opaque
   * pill, full-size logo, solid nav capsule) and then visibly snap to the
   * correct one a frame later. `useRef`'s initializer runs once; every
   * render after this one passes a fresh `target` that the lazy initializer
   * quietly ignores, which is what keeps this frozen rather than fighting
   * GSAP's own inline-style mutations on every subsequent condense/reveal.
   * A `useState` lazy initializer rather than `useRef(target).current`: the
   * latter reads `.current` in the render body, which the refs lint rule
   * (correctly, in general) flags as unsafe outside an effect.
   */
  const [initialTarget] = useState(() => target);

  useGSAP(
    () => {
      registerWebMotion();

      const header = headerRef.current;
      const pill = pillBgRef.current;
      const logo = logoRef.current;
      const container = containerRef.current;
      const navList = navListRef.current;
      if (!header || !pill || !logo || !container || !navList) return;

      const isFirstRun = !hasMountedRef.current;
      hasMountedRef.current = true;

      const media = gsap.matchMedia();

      // No preference stated, or motion explicitly welcome: the full thing.
      media.add("(prefers-reduced-motion: no-preference)", () => {
        if (isFirstRun) {
          gsap.set(header, { ...target.header, yPercent: 0, opacity: 1 });
          gsap.set(pill, target.pill);
          gsap.set(logo, target.logo);
          gsap.set(container, target.container);
          gsap.set(navList, target.navList);
          return;
        }

        // Leaving is quicker than arriving. A header that takes as long to go
        // as it does to come back feels like it is arguing with the scroll.
        gsap.to(header, {
          yPercent: isHidden ? -130 : 0,
          opacity: isHidden ? 0 : 1,
          duration: isHidden ? DUR.snap * 1.3 : DUR.base,
          ease: isHidden ? "sun.glide" : "sun.rise",
          overwrite: "auto",
        });

        gsap
          .timeline({ defaults: { ease: "sun.glide", duration: DUR.panel } })
          .to(header, target.header, 0)
          .to(pill, target.pill, 0)
          .to(container, target.container, 0)
          .to(logo, target.logo, 0)
          .to(navList, target.navList, 0);
      });

      // Reduced motion: identical end states, no tweens, and the header never
      // hides. Sliding a navigation bar off screen is exactly the kind of
      // movement this preference is asking us not to make.
      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(header, { ...target.header, yPercent: 0, opacity: 1 });
        gsap.set(pill, target.pill);
        gsap.set(logo, target.logo);
        gsap.set(container, target.container);
        gsap.set(navList, target.navList);
      });

      return () => media.revert();
    },
    { dependencies: [isTransparent, isHidden, pathname] }
  );

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  /**
   * The magnetic indicator.
   *
   * One pill that travels between nav items rather than six items each fading
   * their own background in and out. The difference is that a single moving
   * object gives the eye something to follow, so the nav reads as one control
   * being operated rather than as six buttons reacting independently.
   *
   * It measures live from the DOM instead of tracking an index, because the
   * items are variable width and the capsule's padding changes when the header
   * condenses. Reading `offsetLeft` and `offsetWidth` at move time is always
   * right; a cached table is right until the first font swap.
   *
   * Purely decorative: the accessible current-page signal is `aria-current`
   * and the yellow rule, both of which stand on their own with this removed.
   */
  const moveIndicator = useCallback((target: HTMLElement | null, animate = true) => {
    const indicator = indicatorRef.current;
    const list = navListRef.current;
    if (!indicator || !list) return;

    if (!target) {
      gsap.to(indicator, { opacity: 0, duration: DUR.snap, ease: "sun.snap" });
      return;
    }

    gsap.to(indicator, {
      x: target.offsetLeft,
      width: target.offsetWidth,
      opacity: 1,
      duration: animate ? DUR.snap : 0,
      ease: "sun.snap",
      overwrite: "auto",
    });
  }, []);

  /** Where the indicator rests: the current page, or nowhere. */
  const restIndicator = useCallback(
    (animate = true) => {
      const list = navListRef.current;
      if (!list) return;
      moveIndicator(list.querySelector<HTMLElement>("[data-active='true']"), animate);
    },
    [moveIndicator]
  );

  // Settle on the active item once the capsule has its real width. Two frames:
  // one for layout, one for the font. Without the wait the indicator lands on a
  // fallback-font measurement and then visibly corrects itself.
  useEffect(() => {
    registerWebMotion();
    const id = requestAnimationFrame(() => restIndicator(false));
    const onFonts = () => restIndicator(false);
    document.fonts?.ready.then(onFonts);
    return () => cancelAnimationFrame(id);
  }, [restIndicator]);

  useEffect(() => {
    // Smoothly glide indicator to the new active item on route navigation
    if (pathname) restIndicator(true);
  }, [pathname, restIndicator]);

  return (
    <>
      <header
        ref={headerRef}
        // `z-header` from the layering scale, not a bare z-50. The drawer
        // scrim and panel sit above this on purpose. `top` is the one value
        // GSAP owns that Tailwind's `top-0` would otherwise render wrong on
        // a condensed-by-default page for the first paint.
        className="fixed left-0 right-0 top-0 z-header flex justify-center px-3 sm:px-4"
        style={{ top: initialTarget.header.top }}
      >
        <div
          ref={containerRef}
          className="relative mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4"
          style={initialTarget.container}
        >
          {/* The floating pill, opacity driven by GSAP with frosted glassmorphism. */}
          <div
            ref={pillBgRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 rounded-full border border-white/15 bg-tertiary-gradient-glass shadow-[0_16px_40px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.12)] backdrop-blur-2xl"
            style={{ opacity: initialTarget.pill.opacity, transform: `scale(${initialTarget.pill.scale})` }}
          />

          <Link
            ref={logoRef}
            href="/"
            aria-label="Sunland Real Estates, home"
            className="web-hit shrink-0 rounded-lg transition-transform duration-300 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-yellow active:scale-[0.98]"
            style={{ transform: `scale(${initialTarget.logo.scale})`, transformOrigin: initialTarget.logo.transformOrigin }}
          >
            <Image
              src="/logo.png"
              alt="Sunland Real Estates"
              width={200}
              height={106}
              priority
              className="h-9 w-auto object-contain drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)] sm:h-15"
            />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul
              ref={navListRef}
              onMouseLeave={() => restIndicator()}
              onBlur={(event) => {
                // Only rest when focus has actually left the capsule, not when
                // it moves between two links inside it.
                if (!event.currentTarget.contains(event.relatedTarget as Node)) restIndicator();
              }}
              className="relative flex items-center gap-1 rounded-full border border-transparent p-1"
              style={initialTarget.navList}
            >
              {/* Travels between items. Behind the links, so it never
                  intercepts a pointer. */}
              <span
                ref={indicatorRef}
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-1 h-[calc(100%-0.5rem)] rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] opacity-0"
              />
              {HEADER_NAV.map((item) => {
                const active = isActive(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      data-active={active ? "true" : undefined}
                      onMouseEnter={(event) => moveIndicator(event.currentTarget)}
                      onFocus={(event) => moveIndicator(event.currentTarget)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative z-10 block rounded-full px-4 py-1.5 font-mono text-[12.5px] font-medium uppercase transition-colors duration-200",
                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-yellow",
                        active ? "text-[#151936]" : "text-slate-200 hover:text-[#151936]"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/login"
              className="web-control hidden h-9 items-center justify-center rounded-full border border-white/40 bg-white/95 px-6 text-xs font-medium uppercase tracking-widest text-[#151936] shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-[1.03] hover:border-white/60 hover:bg-[#151936] hover:text-white hover:shadow-[0_6px_24px_rgba(0,0,0,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-yellow active:scale-[0.98] sm:inline-flex"
            >
              Sign in
            </Link>

            <MobileDrawer
              onOpenChange={handleOpenChange}
              triggerClassName="text-white bg-black/10 backdrop-blur-md transition-colors hover:bg-white/20"
            />
          </div>
        </div>
      </header>

      {/* Spacer for the fixed header on every page that does not open with a
          full-bleed hero. Sized to the real condensed height at each
          breakpoint rather than one magic number: the logo is 36px under 640
          and 60px above it, so a flat 96px left a visible gap on a phone. */}
      {!isHome && <div aria-hidden="true" className="h-[72px] sm:h-[96px]" />}
    </>
  );
}
