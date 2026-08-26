"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { jumpSmoothScrollTo } from "@/lib/motion/smooth-scroll";

/**
 * Decides where a page starts, on every client-side route change.
 *
 * ── The bug this replaces ──
 *
 * Lenis (`smooth-scroll.ts`) owns the real scroll position but only learns
 * where it is from native `scroll` events or its own `scrollTo` — it never
 * observes an external jump. Next's router moving `window.scrollY` on
 * navigation left Lenis's internal target sitting at the old page's offset,
 * so the very next tick eased the new page back toward that stale value:
 * a page that visibly loads half-scrolled. `jumpSmoothScrollTo` closes that
 * gap; this component decides what value to close it *to*.
 *
 * ── Why that is two different answers, not one ──
 *
 * A multi-page site gets this for free from the browser and visitors already
 * expect it without noticing: clicking through to a new page starts at the
 * top, like opening a new document. Pressing Back returns to the list
 * exactly where it was left, scroll position included — losing that on a
 * property or article grid is the "wait, where was I" moment that makes
 * people re-scan a page they already read. One rule ("always top") gets the
 * first case right and breaks the second; this tells the two apart instead.
 *
 * The distinguishing signal is `popstate`: the browser fires it only for
 * Back/Forward, never for a `<Link>` click or `router.push`. That is the one
 * reliable way to ask "did the visitor ask to go back, or go somewhere new"
 * from inside the app.
 *
 * ── Why positions are tracked continuously, not captured on the way out ──
 *
 * Capturing scroll position in a navigation handler only sees wherever the
 * visitor happened to be at the exact instant they clicked away, which is
 * fragile — a click can land mid-scroll, or via a control that does not
 * pass through the handler at all. Recording on every scroll event instead
 * means whatever position last existed for a page is always the one on file,
 * with no dependence on how the visitor left it.
 *
 * ── What this deliberately leaves alone ──
 *
 * Only `pathname` is watched, not the full URL. `/properties` filtering by
 * query string re-suspends its results grid in place by design (see
 * `listing-index.tsx`) — resetting scroll on every filter click would undo
 * that. A destination carrying its own `#hash` is also left alone: that is
 * a deliberate scroll target the visitor (or the link) chose, not a case
 * for either rule here.
 *
 * `history.scrollRestoration` is set to `"manual"` for exactly as long as
 * this component is mounted — i.e. only inside the public site's route
 * group — so the browser's own restoration, which can race the SPA's data
 * fetching and content height in ways that are exactly this bug's other
 * cause, never runs while this owns the decision. It is restored to the
 * browser default on unmount, so leaving the public site (into the ERP or
 * auth routes, both outside this layout) does not leak the override where
 * nothing here is around to honour it.
 */
export function RouteScrollManager() {
  const pathname = usePathname();
  const currentPath = useRef(pathname);
  const isFirstRun = useRef(true);
  const wasPopNavigation = useRef(false);
  const positions = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const previous = history.scrollRestoration;
    history.scrollRestoration = "manual";

    const onPopState = () => {
      wasPopNavigation.current = true;
    };
    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
      history.scrollRestoration = previous;
    };
  }, []);

  // Keeps a running note of where the visitor is on whichever page is
  // current, so a later Back to it has somewhere real to return to.
  useEffect(() => {
    const key = pathname;
    const onScroll = () => {
      positions.current.set(key, window.scrollY);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    // The first run is the page this tab opened on, not a navigation the
    // visitor made inside the app — the browser's own load-time behaviour,
    // and the pre-paint correction in useScrollDirection, already own that
    // moment correctly.
    if (isFirstRun.current) {
      isFirstRun.current = false;
      currentPath.current = pathname;
      return;
    }
    if (pathname === currentPath.current) return;
    currentPath.current = pathname;

    const wasPop = wasPopNavigation.current;
    wasPopNavigation.current = false;

    // The destination named its own scroll target; that wins over both
    // rules below.
    if (window.location.hash) return;

    // `jumpSmoothScrollTo` moves the real page itself — through Lenis when
    // it exists, natively when it does not — so this is the one call
    // needed; a separate `window.scrollTo` here would be redundant with
    // what it already does internally on both paths.
    const target = wasPop ? (positions.current.get(pathname) ?? 0) : 0;
    jumpSmoothScrollTo(target);
  }, [pathname]);

  return null;
}
