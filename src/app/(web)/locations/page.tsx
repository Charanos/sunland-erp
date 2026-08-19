import type { Metadata } from "next";
import Link from "next/link";
import {
  AREA_GROUPS,
  AREAS_CTA,
  AREAS_HERO,
  WEB_AREAS,
  type WebArea,
} from "@/components/web/constants/locations.content";
import { WebButtonLink } from "@/components/web/primitives/button";
import { Breadcrumbs } from "@/components/web/primitives/breadcrumbs";
import { Container } from "@/components/web/primitives/container";
import { Eyebrow } from "@/components/web/primitives/eyebrow";
import { getLocationCounts } from "@/lib/services/web/locations";

export const metadata: Metadata = {
  title: "Areas we cover in Nairobi and beyond",
  description: AREAS_HERO.lead,
};

export const revalidate = 3600;

/**
 * The areas hub.
 *
 * Three groups rather than one flat grid, because they are read differently:
 * the prime residential belt gets photo cards because that is where most
 * tenant searches start, and the commercial and satellite areas get compact
 * tiles because someone looking for a godown in Baba Dogo is scanning for the
 * name, not the view.
 *
 * The headline count comes from the data. The design's h1 says "Fifteen
 * areas" over twenty tiles; deriving it means the headline cannot drift from
 * what is actually on the page.
 */
export default async function LocationsPage() {
  const counts = await getLocationCounts();
  const headline = AREAS_HERO.headlineTemplate.replace("{count}", String(WEB_AREAS.length));

  return (
    <>
      <section
        aria-labelledby="areas-heading"
        className="web-dark px-5 pb-18 pt-8 sm:px-8 lg:px-14"
      >
        <div className="mx-auto w-full max-w-[1320px]">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Areas" }]}
            className="mb-9"
          />
          <Eyebrow tone="dark">{AREAS_HERO.eyebrow}</Eyebrow>
          <h1
            id="areas-heading"
            className="web-title mt-5 max-w-[17em] text-[clamp(2.25rem,1.5rem+3.4vw,3.5rem)] leading-[1.06] tracking-[-0.015em] text-on-dark-hi"
          >
            {headline}
          </h1>
          <p className="web-subtitle mt-5 max-w-[58ch] text-web-lead text-on-dark">
            {AREAS_HERO.lead}
          </p>
        </div>
      </section>

      <main className="bg-surface-0 pb-24 pt-18">
        <Container>
          {AREA_GROUPS.map((group) => {
            const areas = WEB_AREAS.filter((area) => area.group === group.id);
            if (areas.length === 0) return null;

            const isFeatured = group.id === "prime";

            return (
              <section key={group.id} aria-labelledby={`group-${group.id}`} className="mb-16">
                <h2
                  id={`group-${group.id}`}
                  className="web-control mb-6 text-[11px] uppercase tracking-[0.2em] text-ink-400"
                >
                  {group.title}
                </h2>

                <ul
                  className={
                    isFeatured
                      ? "grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
                      : "grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
                  }
                >
                  {areas.map((area) =>
                    isFeatured ? (
                      <li key={area.slug}>
                        <FeatureAreaCard area={area} count={counts[area.slug]} />
                      </li>
                    ) : (
                      <li key={area.slug}>
                        <CompactAreaCard area={area} count={counts[area.slug]} />
                      </li>
                    )
                  )}
                </ul>
              </section>
            );
          })}

          <div className="grid items-center gap-8 rounded-web-panel border border-line bg-surface-1 p-10 md:grid-cols-2">
            <div>
              <h2 className="web-title text-[28px] leading-tight text-ink-900">
                {AREAS_CTA.title}
              </h2>
              <p className="mt-3 max-w-[56ch] text-[15.5px] leading-relaxed text-ink-500">
                {AREAS_CTA.body}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
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
        </Container>
      </main>
    </>
  );
}

/**
 * A prime-belt area card.
 *
 * The design puts a photograph behind the name with a gradient scrim. We have
 * no photography of these neighbourhoods, and stock imagery captioned
 * "Kilimani" on a page whose argument is "these figures come from properties
 * we actually let" would undercut the claim. The panel keeps the composition,
 * carries the name at the same weight and position, and says nothing untrue.
 *
 * TODO(W5-9): swap in commissioned neighbourhood photography.
 */
function FeatureAreaCard({ area, count }: { area: WebArea; count?: number }) {
  return (
    <Link
      href={`/locations/${area.slug}`}
      className="group block overflow-hidden rounded-web-card border border-line transition-all duration-200 hover:-translate-y-[3px] hover:shadow-web-md"
    >
      <div className="relative flex aspect-[3/2] items-end bg-brand-dark">
        <span
          aria-hidden="true"
          className="web-title-light absolute right-5 top-3 text-[88px] leading-none text-white/[0.07]"
        >
          S
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brand-dark/88"
        />
        <span className="web-title-card relative p-5 text-[28px] text-on-dark-hi">
          {area.name}
        </span>
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-line-soft pb-3">
          <span className="web-subtitle text-[13.5px] text-ink-400">{area.guideLabel}</span>
          <span className="web-numeric whitespace-nowrap text-[13.5px] text-ink-900">
            {area.guideValue}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-ink-500">{area.blurb}</p>
        {typeof count === "number" && count > 0 && (
          <p className="web-numeric mt-3 text-[12.5px] text-ink-400">{count} listed now</p>
        )}
      </div>
    </Link>
  );
}

/** A compact tile for the commercial and satellite groups. */
function CompactAreaCard({ area, count }: { area: WebArea; count?: number }) {
  return (
    <Link
      href={`/locations/${area.slug}`}
      className="flex h-full flex-col gap-2 rounded-web-card border border-line p-5 transition-colors hover:border-ink-900"
    >
      <span className="web-title-card text-[21px] text-ink-900">{area.name}</span>
      <span className="text-[13.5px] leading-relaxed text-ink-500">{area.blurb}</span>
      <span className="web-numeric mt-auto pt-2 text-[12.5px] text-ink-400">
        {area.guideLabel}, {area.guideValue}
        {typeof count === "number" && count > 0 && ` · ${count} listed`}
      </span>
    </Link>
  );
}
