"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { HEADER_NAV, SITE } from "../constants/site";
import { WEB_ICON_STROKE, webIcons } from "../icons";

/**
 * The mobile navigation drawer.
 *
 * The only client component in the header, and the only one that needs to be:
 * everything else in the shell is static markup. Contract, from doc 03 §6:
 * focus is trapped while open, Escape closes it, focus returns to the trigger
 * on close, the trigger reports state via aria-expanded, and the background
 * does not scroll underneath.
 *
 * "List your property" is pinned at the top of the drawer rather than buried
 * at the bottom, per web doc 02 §4.1. An owner who opens the menu on a phone
 * should not have to scroll past six tenant-facing links to find the one
 * thing addressed to them.
 */
export function MobileDrawer({ triggerClassName }: { triggerClassName?: string } = {}) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const MenuIcon = webIcons.menu;
  const CloseIcon = webIcons.close;
  const PhoneIcon = webIcons.phone;

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    // Focus the panel itself rather than its first link, so a screen reader
    // announces the dialog before reading out navigation.
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
      document.body.style.overflow = overflow;
      previouslyFocused?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Open menu"
        className={cn(
          "web-hit inline-flex size-10 items-center justify-center rounded-full transition-colors lg:hidden",
          triggerClassName ?? "text-white hover:bg-white/10"
        )}
      >
        <MenuIcon size={22} stroke={WEB_ICON_STROKE} aria-hidden="true" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* The scrim */}
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-slate-950/70 backdrop-blur-md"
          />

          <div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            tabIndex={-1}
            className={cn(
              "web-dark absolute inset-y-0 right-0 flex w-[min(88vw,360px)] h-full flex-col overflow-y-auto bg-[#151936] text-white border-l border-white/15 p-6 shadow-2xl z-50",
              "web-slide-in-right"
            )}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="font-editorial text-xl text-white font-medium tracking-tight">
                {SITE.name}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="web-hit inline-flex size-10 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <CloseIcon size={20} stroke={WEB_ICON_STROKE} aria-hidden="true" />
              </button>
            </div>

            {/* Pinned owner route */}
            <Link
              href="/landlords/valuation"
              onClick={() => setOpen(false)}
              className="web-control mt-6 w-full flex h-11 items-center justify-center rounded-full bg-[#f3df27] hover:bg-[#ffe838] active:bg-[#e6d220] text-xs uppercase tracking-[0.14em] font-medium text-[#151936] shadow-[0_4px_18px_rgba(243,223,39,0.35)] transition-all cursor-pointer"
            >
              List your property
            </Link>

            <nav aria-label="Primary" className="mt-6">
              <ul className="flex flex-col">
                {HEADER_NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block border-b border-white/10 py-3.5 font-mono text-sm uppercase tracking-wider text-slate-200 transition-colors hover:text-white hover:pl-1 font-medium"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-auto pt-8 border-t border-white/10 flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="web-control block text-xs uppercase tracking-[0.14em] text-slate-300 transition-colors hover:text-white font-medium"
              >
                Sign in to your portal →
              </Link>
              <a
                href={SITE.phoneHref}
                className="web-numeric flex items-center gap-2 text-sm text-slate-200 font-medium"
              >
                <PhoneIcon size={16} stroke={WEB_ICON_STROKE} aria-hidden="true" />
                {SITE.phone}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
