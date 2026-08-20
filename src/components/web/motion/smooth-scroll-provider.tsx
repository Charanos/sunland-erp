"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { destroySmoothScroll, initSmoothScroll, resizeSmoothScroll, smoothScrollTo } from "@/lib/motion/smooth-scroll";

/**
 * Inner watcher: reads `useSearchParams` so it MUST live inside a <Suspense>
 * boundary. Next.js requires this for any component that calls useSearchParams
 * during static generation (prerender).
 */
function SearchParamsWatcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    resizeSmoothScroll();
    const timer = setTimeout(() => {
      resizeSmoothScroll();
    }, 120);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return null;
}

/**
 * Mounts the site's momentum scroll and teaches in-page hash links to use it.
 * The outer shell never calls useSearchParams directly, so it is safe to render
 * at build time. The inner SearchParamsWatcher is deferred behind Suspense.
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

  return (
    <Suspense fallback={null}>
      <SearchParamsWatcher />
    </Suspense>
  );
}
