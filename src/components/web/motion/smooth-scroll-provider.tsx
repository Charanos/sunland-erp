"use client";

import { useEffect } from "react";
import { destroySmoothScroll, initSmoothScroll, smoothScrollTo } from "@/lib/motion/smooth-scroll";

/**
 * Mounts the site's momentum scroll and teaches in-page hash links to use it.
 *
 * ── The click handler ──
 *
 * Delegated to `document` rather than attached per-link, because the site has
 * hash links scattered across content that is largely static server-rendered
 * markup (footer columns, the services jump nav, the landlord hub's own
 * internal anchors) which would otherwise each need converting to a client
 * component just to intercept a click. One listener here covers all of them
 * without touching a single one of those files.
 *
 * It only intercepts a same-page hash: an `href` of exactly `#id`. A link like
 * `/properties#results` is deliberately left to Next's router, because that
 * is a navigation to a different page that happens to land on an anchor, not
 * a same-page jump, and Lenis has nothing to smooth until the new page has
 * actually mounted.
 *
 * `history.pushState` records the hash so the back button and a shared link
 * both still land in the right place; Lenis is what makes getting there
 * smooth rather than instant.
 */
export function SmoothScrollProvider() {
  useEffect(() => {
    initSmoothScroll();

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const link = (event.target as Element).closest("a[href^='#']");
      if (!link) return;

      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;

      const el = document.querySelector<HTMLElement>(hash);
      if (!el) return;

      event.preventDefault();
      smoothScrollTo(el);
      history.pushState(null, "", hash);
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      destroySmoothScroll();
    };
  }, []);

  return null;
}
