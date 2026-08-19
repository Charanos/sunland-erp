import type { Metadata } from "next";
import { FloatingContact } from "@/components/web/layout/floating-contact";
import { SkipLink } from "@/components/web/layout/skip-link";
import { WebFooter } from "@/components/web/layout/web-footer";
import { WebHeader } from "@/components/web/layout/web-header";

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
      <SkipLink />
      <WebHeader />
      <main id="content" className="flex-1">
        {children}
      </main>
      <WebFooter />
      <FloatingContact />
    </div>
  );
}
