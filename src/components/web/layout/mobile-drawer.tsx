"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { cn } from "@/lib/utils/cn";
import { HEADER_NAV, SITE } from "../constants/site";
import { WEB_ICON_STROKE, webIcons } from "../icons";

/**
 * The mobile navigation drawer.
 *
 * ── Why this is portalled, which is the whole bug ──
 *
 * The drawer used to render where it sits in the tree, inside `<header>`. The
 * header is animated by GSAP, and **a transform on an element makes it the
 * containing block for every `position: fixed` descendant**. So `fixed
 * inset-0` stopped meaning "the viewport" and started meaning "the header
 * box": the drawer was laid out and clipped inside a 70px strip at the top of
 * the screen, sitting behind the page content instead of over it.
 *
 * Nothing about the drawer's own CSS was wrong, which is what made it hard to
 * see. The fix is to render it into `document.body`, outside the transformed
 * ancestor, where `fixed` means what it says.
 *
 * The same trap applies to anything else fixed that ends up inside an
 * animated container, which is why the layering scale in `web-theme.css`
 * exists alongside this and why the drawer takes `--z-overlay` and
 * `--z-panel` rather than yet another `z-50`.
 *
 * ── The rest of the contract, from doc 03 §6 ──
 *
 * Focus is trapped while open, Escape closes, focus returns to the trigger,
 * the trigger reports state through `aria-expanded`, and the page behind does
 * not scroll or lose its position.
 */
export function MobileDrawer({
  triggerClassName,
  onOpenChange,
}: {
  triggerClassName?: string;
  /** Lets the header hold itself still while the drawer is open. */
  onOpenChange?: (open: boolean) => void;
} = {}) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const pathname = usePathname();

  const MenuIcon = webIcons.menu;
  const CloseIcon = webIcons.close;
  const PhoneIcon = webIcons.phone;
  const ArrowIcon = webIcons.arrow;

  useBodyScrollLock(open);

  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  // Any navigation closes the drawer. Covers the browser back button and a
  // link to the page you are already on, neither of which fires onClick.
  //
  // Compared during render rather than in an effect: an effect would paint the
  // new page with the drawer still open for one frame, then close it.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const trigger = triggerRef.current;

    // Focus the panel itself rather than its first link, so a screen reader
    // announces the dialog before it starts reading out navigation.
    panelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      // The trap: wrap at both ends rather than letting focus escape to the
      // page behind, which is still rendered and still tabbable.
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      // Prefer the trigger we own over whatever had focus, so closing always
      // lands somewhere predictable even if the drawer was opened by script.
      (trigger ?? previouslyFocused)?.focus();
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const panel = (
    <div className="web-drawer-root fixed inset-0 z-overlay lg:hidden">
      {/* The scrim. A real button so it is dismissible by pointer, but taken
          out of the tab order: Escape and the close button are the keyboard
          paths, and a focusable scrim just adds a stop that announces nothing. */}
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className="web-fade-in absolute inset-0 h-full w-full cursor-default bg-slate-950/70 backdrop-blur-md"
      />

      <div
        ref={panelRef}
        id={panelId}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        tabIndex={-1}
        className={cn(
          "web-dark web-slide-in-right absolute inset-y-0 right-0 z-panel flex h-full w-[min(88vw,380px)] flex-col",
          "border-l border-white/15 bg-[#151936] shadow-[0_0_60px_rgba(0,0,0,0.5)] outline-none",
          // The panel scrolls, not the page. `overscroll-contain` stops a
          // flick at the end of the list from chaining into the body behind.
          "overflow-y-auto overscroll-contain",
          // Respects the notch and the home indicator on a modern phone.
          "[padding-bottom:env(safe-area-inset-bottom)] [padding-top:env(safe-area-inset-top)]"
        )}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <span className="font-editorial text-xl font-medium tracking-tight text-white">
            {SITE.shortName}
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="web-hit -mr-2 inline-flex size-11 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-yellow"
          >
            <CloseIcon size={20} stroke={WEB_ICON_STROKE} aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-1 flex-col px-6 pb-6">
          {/* The owner route, pinned. On a phone an owner should not scroll
              past six tenant-facing links to reach the one thing addressed to
              them. Web doc 02 §4.1. */}
          <Link
            href="/landlords#valuation"
            onClick={() => setOpen(false)}
            className="web-control mt-6 flex h-12 w-full items-center justify-center rounded-full bg-brand-yellow text-xs font-medium uppercase tracking-[0.14em] text-[#151936] shadow-[0_4px_18px_rgba(243,223,39,0.35)] transition-colors hover:bg-brand-yellow-h focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            List your property
          </Link>

          <nav aria-label="Primary" className="mt-7">
            <ul className="flex flex-col">
              {HEADER_NAV.map((item) => {
                const active = isActive(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        // 52px rows: comfortably above the 44px minimum, and
                        // big enough to hit while holding a phone one-handed.
                        "web-hit group flex items-center justify-between gap-3 border-b border-white/10 py-4 font-mono text-sm font-medium uppercase tracking-wider transition-colors",
                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-yellow",
                        active ? "text-brand-yellow" : "text-slate-200 hover:text-white"
                      )}
                    >
                      {item.label}
                      <ArrowIcon
                        size={16}
                        stroke={WEB_ICON_STROKE}
                        aria-hidden="true"
                        className={cn(
                          "shrink-0 transition-all duration-200",
                          active
                            ? "text-brand-yellow opacity-100"
                            : "opacity-0 group-hover:translate-x-0.5 group-hover:opacity-60"
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-auto flex flex-col gap-4 border-t border-white/10 pt-7">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="web-control web-hit inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-300 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-yellow"
            >
              Sign in to your portal
              <ArrowIcon size={14} stroke={WEB_ICON_STROKE} aria-hidden="true" />
            </Link>

            <a
              href={SITE.phoneHref}
              className="web-numeric web-hit flex items-center gap-2.5 text-base font-medium text-white transition-colors hover:text-brand-yellow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-yellow"
            >
              <PhoneIcon size={16} stroke={WEB_ICON_STROKE} aria-hidden="true" />
              {SITE.phone}
            </a>
            <p className="text-xs leading-relaxed text-slate-400">{SITE.officeHours}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Open menu"
        className={cn(
          "web-hit inline-flex size-11 items-center justify-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:hidden",
          triggerClassName ?? "text-white hover:bg-white/10"
        )}
      >
        <MenuIcon size={22} stroke={WEB_ICON_STROKE} aria-hidden="true" />
      </button>

      {/* Portalled to the body, out of the header's transformed subtree.
          No mounted guard is needed: `open` starts false and can only become
          true from a click, so this never runs during server rendering and
          never touches `document` before hydration. */}
      {open && createPortal(panel, document.body)}
    </>
  );
}
