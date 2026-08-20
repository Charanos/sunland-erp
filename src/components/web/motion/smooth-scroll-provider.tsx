"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { destroySmoothScroll, initSmoothScroll, resizeSmoothScroll, smoothScrollTo } from "@/lib/motion/smooth-scroll";

/**
 * Mounts the site's momentum scroll and teaches in-page hash links to use it.
 */
export function SmoothScrollProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  useEffect(() => {
    resizeSmoothScroll();
    const timer = setTimeout(() => {
      resizeSmoothScroll();
    }, 120);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return null;
}
