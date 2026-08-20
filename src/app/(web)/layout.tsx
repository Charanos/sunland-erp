import type { Metadata } from "next";
import Script from "next/script";
import { FloatingContact } from "@/components/web/layout/floating-contact";
import { SkipLink } from "@/components/web/layout/skip-link";
import { WebHeader } from "@/components/web/layout/web-header";
import { RevealController } from "@/components/web/motion/reveal-controller";
import { SmoothScrollProvider } from "@/components/web/motion/smooth-scroll-provider";

/**
 * The public site shell.
 *
 * Deliberately does NOT wrap children in `AppProviders`. The marketing site
 * needs neither TanStack Query nor the ERP Zustand stores nor the realtime
 * client, and doc 03 §7 budgets 180KB of JavaScript on the home page. Pulling
 * the dashboard provider tree into a page a stranger loads on 3G would spend
 * that budget before a single component rendered.
 *
 * `.web-root` scopes the Terrain Web token layer (src/app/web-theme.css) so
 * the ERP's own body and type rules stay exactly where they are.
 */
export const metadata: Metadata = {
  title: {
    default: "Property management, sales and letting in Nairobi | Sunland",
    template: "%s | Sunland Real Estates",
  },
  description:
    "We let, sell and manage homes, land and commercial space across Nairobi, the coast and upcountry.",
};

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="web-root flex min-h-screen flex-col">
      {/* Runs before the parser reaches the body, so `.web-preanim` (see
          web-theme.css) is already on <html> at the very first paint,
          eliminating the flash where a GSAP entrance snaps visible content
          to hidden a frame after hydration. Each entrance effect removes the
          class itself once its timeline is built; the 2.5s fallback here is
          what stops a hero staying invisible forever if that JS never
          arrives at all, matching the "ships visible by default" contract
          the entrance animations themselves already follow. */}
      <Script id="web-preanim-gate" strategy="beforeInteractive">
        {`document.documentElement.classList.add("web-preanim");
setTimeout(function () {
  document.documentElement.classList.remove("web-preanim");
}, 2500);`}
      </Script>
      <SkipLink />
      <WebHeader />
      <RevealController />
      <SmoothScrollProvider />
      <main id="content" className="flex-1">
        {children}
      </main>
      <FloatingContact />
    </div>
  );
}
