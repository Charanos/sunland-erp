"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { HEADER_NAV } from "../constants/site";
import { MobileDrawer } from "./mobile-drawer";

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

  // Stable, so the drawer's effect does not re-run on every header render.
  const handleOpenChange = useCallback((open: boolean) => setDrawerOpen(open), []);

  /** The two visual end states, shared by the animated and reduced paths. */
  const states = {
    transparent: {
      header: { top: "0px" },
      pill: { opacity: 0, scale: 0.97 },
      logo: { scale: 1, transformOrigin: "left center" },
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
      container: {
        paddingTop: "0.65rem",
        paddingBottom: "0.65rem",
        paddingLeft: "clamp(1rem, 2vw, 2rem)",
        paddingRight: "clamp(1rem, 2vw, 2rem)",
      },
    },
  };

  useGSAP(
    () => {
      const header = headerRef.current;
      const pill = pillBgRef.current;
      const logo = logoRef.current;
      const container = containerRef.current;
      if (!header || !pill || !logo || !container) return;

      const target = isTransparent ? states.transparent : states.condensed;
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
          return;
        }

        gsap.to(header, {
          yPercent: isHidden ? -130 : 0,
          opacity: isHidden ? 0 : 1,
          duration: isHidden ? 0.42 : 0.5,
          ease: isHidden ? "power3.inOut" : "power3.out",
          overwrite: "auto",
        });

        gsap
          .timeline({ defaults: { ease: "power3.out", duration: 0.55 } })
          .to(header, target.header, 0)
          .to(pill, { ...target.pill, ease: isTransparent ? "power2.inOut" : "power3.out" }, 0)
          .to(container, target.container, 0)
          .to(logo, target.logo, 0);
      });

      // Reduced motion: identical end states, no tweens, and the header never
      // hides. Sliding a navigation bar off screen is exactly the kind of
      // movement this preference is asking us not to make.
      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(header, { ...target.header, yPercent: 0, opacity: 1 });
        gsap.set(pill, target.pill);
        gsap.set(logo, target.logo);
        gsap.set(container, target.container);
      });

      return () => media.revert();
    },
    { dependencies: [isTransparent, isHidden, pathname] }
  );

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        ref={headerRef}
        // `z-header` from the layering scale, not a bare z-50. The drawer
        // scrim and panel sit above this on purpose.
        className="fixed left-0 right-0 top-0 z-header flex justify-center px-3 sm:px-4"
      >
        <div
          ref={containerRef}
          className="relative mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4"
        >
          {/* The floating pill, opacity driven by GSAP. */}
          <div
            ref={pillBgRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 rounded-full border border-white/10 bg-tertiary-gradient shadow-[0_14px_36px_rgba(12,31,36,0.45)] backdrop-blur-xl"
          />

          <Link
            ref={logoRef}
            href="/"
            aria-label="Sunland Real Estates, home"
            className="web-hit shrink-0 rounded-lg transition-transform duration-300 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-yellow active:scale-[0.98]"
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
            <ul className="flex items-center gap-1 rounded-full border border-white/20 bg-slate-950/40 px-3.5 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-2xl">
              {HEADER_NAV.map((item) => {
                const active = isActive(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative block rounded-full px-4 py-1.5 font-mono text-[12.5px] font-medium uppercase transition-all duration-200",
                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-yellow",
                        active
                          ? "bg-white/12 text-white"
                          : "text-slate-100/95 hover:bg-white/15 hover:text-white"
                      )}
                    >
                      {item.label}
                      {/* The design marks the current section with a yellow
                          rule. It was missing entirely, so a visitor two pages
                          deep had nothing telling them where they were. */}
                      {active && (
                        <span
                          aria-hidden="true"
                          className="absolute inset-x-4 -bottom-0.5 h-px bg-brand-yellow"
                        />
                      )}
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
              triggerClassName="text-white transition-colors hover:bg-white/10"
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
