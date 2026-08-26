import type { Metadata } from "next";
import {
  AREAS_CTA,
  AREAS_HERO,
  WEB_AREAS,
} from "@/components/web/constants/locations.content";
import { WebButtonLink } from "@/components/web/primitives/button";
import { Container } from "@/components/web/primitives/container";
import { LocationsHero } from "@/components/web/locations/locations-hero";
import { LocationsDirectory } from "@/components/web/locations/locations-directory";
import { getLocationCounts } from "@/lib/services/web/locations";

export const metadata: Metadata = {
  title: "Areas we cover in Nairobi and beyond | Sunland Real Estates",
  description: AREAS_HERO.lead,
};

export const revalidate = 3600;

export default async function LocationsPage() {
  const counts = await getLocationCounts();
  const headline = AREAS_HERO.headlineTemplate.replace("{count}", String(WEB_AREAS.length));

  return (
    <>
      <LocationsHero headline={headline} lead={AREAS_HERO.lead} />

      <main className="bg-surface-0 pb-24 sm:pb-32">
        {/* Dynamic Architectural Locations Directory */}
        <LocationsDirectory areas={WEB_AREAS} counts={counts} />

        {/* Closing Valuation & Mandate Banner */}
        <Container className="pt-16 sm:pt-20">
          <div className="rounded-2xl border border-line bg-surface-1 p-8 sm:p-12 md:p-14 transition-all">
            <div className="grid items-center gap-8 md:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-mono text-web-micro uppercase tracking-widest text-ink-400">
                  <span className="h-px w-5 bg-ink-400" />
                  <span>Submarket Coverage Advisory</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-ink-900">
                  {AREAS_CTA.title}
                </h2>
                <p className="max-w-[56ch] text-web-sm sm:text-base leading-relaxed text-ink-500 font-normal">
                  {AREAS_CTA.body}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 md:justify-end">
                {AREAS_CTA.ctas.map((cta) => (
                  <WebButtonLink
                    key={cta.href}
                    href={cta.href}
                    variant={cta.variant}
                    size="md"
                    {...(cta.variant === "outline"
                      ? { icon: "arrow" as const, iconTrailing: true }
                      : {})}
                  >
                    {cta.label}
                  </WebButtonLink>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
