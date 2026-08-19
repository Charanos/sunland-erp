"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { HEADER_NAV } from "../constants/site";
import { MobileDrawer } from "./mobile-drawer";

/**
 * The site header.
 *
 * Modular 3-island floating navigation with fluid GSAP animation:
 * - Left: Prominent Brand Logo (clean, background-free, fluidly scaling)
 * - Center: Luminous Frosted Capsule with Navigation Links
 * - Right: Sleek Luxury "Sign in" CTA & Mobile Drawer
 * - Backdrop: GSAP-interpolated floating pill with bg-tertiary-gradient
 */
export function WebHeader() {
  const pathname = usePathname();
  const scrollDirection = useScrollDirection();

  const isHome = pathname === "/";
  const isTransparent = isHome && scrollDirection === "top";
  const isHidden = scrollDirection === "down";

  const headerRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pillBgRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const hasMountedRef = useRef(false);

  useGSAP(
    () => {
      if (!headerRef.current || !pillBgRef.current || !logoRef.current || !containerRef.current)
        return;

      // 1. Fluid reveal/hide on directional scroll
      if (hasMountedRef.current) {
        if (isHidden) {
          gsap.to(headerRef.current, {
            yPercent: -130,
            opacity: 0,
            duration: 0.42,
            ease: "power3.inOut",
            overwrite: "auto",
          });
        } else {
          gsap.to(headerRef.current, {
            yPercent: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power3.out",
            overwrite: "auto",
          });
        }
      }

      // 2. Initial setup on first render without jarring flash
      if (!hasMountedRef.current) {
        hasMountedRef.current = true;
        gsap.set(pillBgRef.current, {
          opacity: isTransparent ? 0 : 1,
          scale: isTransparent ? 0.97 : 1,
        });
        gsap.set(logoRef.current, {
          scale: isTransparent ? 1 : 0.76,
          transformOrigin: "left center",
        });
        gsap.set(containerRef.current, {
          paddingTop: isTransparent ? "1.5rem" : "0.65rem",
          paddingBottom: isTransparent ? "0rem" : "0.65rem",
          paddingLeft: isTransparent ? "clamp(1.5rem, 3.5vw, 3.5rem)" : "clamp(1rem, 2vw, 2rem)",
          paddingRight: isTransparent ? "clamp(1.5rem, 3.5vw, 3.5rem)" : "clamp(1rem, 2vw, 2rem)",
        });
        gsap.set(headerRef.current, {
          top: isTransparent ? "0px" : "12px",
          yPercent: 0,
          opacity: 1,
        });
        return;
      }

      // 3. Fluid GSAP Timeline for Hero-Transparent <-> Scrolled Floating Pill
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (isTransparent) {
        tl.to(headerRef.current, { top: "0px", duration: 0.55 }, 0)
          .to(
            pillBgRef.current,
            { opacity: 0, scale: 0.97, duration: 0.45, ease: "power2.inOut" },
            0
          )
          .to(
            containerRef.current,
            {
              paddingTop: "1.5rem",
              paddingBottom: "0rem",
              paddingLeft: "clamp(1.5rem, 3.5vw, 3.5rem)",
              paddingRight: "clamp(1.5rem, 3.5vw, 3.5rem)",
              duration: 0.55,
            },
            0
          )
          .to(logoRef.current, { scale: 1, duration: 0.55, transformOrigin: "left center" }, 0);
      } else {
        tl.to(headerRef.current, { top: "12px", duration: 0.55 }, 0)
          .to(pillBgRef.current, { opacity: 1, scale: 1, duration: 0.55, ease: "power3.out" }, 0)
          .to(
            containerRef.current,
            {
              paddingTop: "0.65rem",
              paddingBottom: "0.65rem",
              paddingLeft: "clamp(1rem, 2vw, 2rem)",
              paddingRight: "clamp(1rem, 2vw, 2rem)",
              duration: 0.55,
            },
            0
          )
          .to(logoRef.current, { scale: 0.76, duration: 0.55, transformOrigin: "left center" }, 0);
      }
    },
    { dependencies: [isTransparent, isHidden, pathname] }
  );

  return (
    <>
      <header
        ref={headerRef}
        className="fixed left-0 right-0 z-50 flex justify-center px-3 sm:px-4"
      >
        <div
          ref={containerRef}
          className="relative mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4"
        >
          {/* GSAP-Controlled Floating Pill Backdrop */}
          <div
            ref={pillBgRef}
            className="pointer-events-none absolute inset-0 -z-10 rounded-full border border-white/10 bg-tertiary-gradient shadow-[0_14px_36px_rgba(12,31,36,0.45)] backdrop-blur-xl"
          />

          {/* Left: Prominent Brand Logo (Clean, Background-free & GSAP Scaling) */}
          <Link
            ref={logoRef}
            href="/"
            aria-label="Sunland Real Estates, home"
            className="shrink-0 transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
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

          {/* Center: Modular Floating Navigation Capsule */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1 rounded-full border border-white/20 bg-slate-950/40 px-3.5 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-2xl">
              {HEADER_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="rounded-full px-4 py-1.5 font-mono text-[12.5px] font-medium uppercase text-slate-100/95 transition-all duration-200 hover:bg-white/15 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right: Sleek Luxury "Sign in" CTA & Mobile Drawer */}
          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/login"
              className="web-control hidden h-9 items-center justify-center rounded-full border border-white/40 bg-white/95 px-6 text-xs font-medium uppercase tracking-widest text-[#151936] shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-[1.03] hover:border-white/60 hover:bg-[#151936] hover:text-white hover:shadow-[0_6px_24px_rgba(0,0,0,0.4)] active:scale-[0.98] sm:inline-flex"
            >
              Sign in
            </Link>

            <MobileDrawer triggerClassName="text-white transition-colors hover:bg-white/10" />
          </div>
        </div>
      </header>
      {!isHome && <div className="h-[96px]" aria-hidden="true" />}
    </>
  );
}
