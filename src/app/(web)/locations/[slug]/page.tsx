import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { formatKES } from "@/lib/utils/format";
import {
  AREA_GROUPS,
  findAreaEditorial,
  WEB_AREAS,
} from "@/components/web/constants/locations.content";
import { WEB_ICON_STROKE, webIcons } from "@/components/web/icons";
import { Breadcrumbs } from "@/components/web/primitives/breadcrumbs";
import { WebButtonLink } from "@/components/web/primitives/button";
import { Container } from "@/components/web/primitives/container";
import { Eyebrow } from "@/components/web/primitives/eyebrow";
import { ListingCard } from "@/components/web/primitives/listing-card";
import { getListings } from "@/lib/services/web/listings";
import { areaMatchTerm, findLocation, getLocationStats } from "@/lib/services/web/locations";

export const revalidate = 3600;

export function generateStaticParams() {
  return WEB_AREAS.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const area = findLocation(slug);
  if (!area) return { title: "Area not found" };

  return {
    title: `Renting and buying in ${area.name}: prices and what it is like`,
    description: `What property costs in ${area.name}, ${area.region}, and what Sunland currently has available there.`,
  };
}

/**
 * An area hub.
 *
 * The organic traffic engine. It answers "what does a two bedroom in Kilimani
 * cost" with figures from real inventory, which is the query type search
 * engines and AI assistants reward and which no competitor on a static
 * WordPress site can keep current.
 *
 * Editorial blocks render only where real copy exists. The design writes one
 * area in full as the pattern; the rest get a complete page from live data
 * and simply do not pretend to an opinion nobody has written. Filling
 * nineteen neighbourhoods with generated prose would destroy the specificity
 * that makes this template worth citing.
 */
export default async function AreaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const area = findLocation(slug);
  if (!area) notFound();

  const editorial = findAreaEditorial(slug);
  const term = areaMatchTerm(area.name);

  const [stats, results] = await Promise.all([
    getLocationStats(term),
    getListings({ location: term, pageSize: 3 }),
  ]);

  const groupTitle = AREA_GROUPS.find((group) => group.id === area.group)?.title ?? area.region;

  // Nearby means the same group, which is a better proxy for "would you also
  // consider this" than raw geography: someone looking at Kilimani is
  // choosing between prime apartment areas, not between Kilimani and a godown
  // in Baba Dogo two kilometres away.
  const nearby = WEB_AREAS.filter(
    (item) => item.slug !== area.slug && item.group === area.group
  ).slice(0, 4);

  const CheckIcon = webIcons.check;
  const ArrowIcon = webIcons.arrow;

  /** Hero figures: editorial where written, otherwise computed. */
  const heroStats =
    editorial?.stats ??
    [
      stats.total > 0 ? { value: String(stats.total), label: "On our books" } : null,
      stats.minRent ? { value: formatKES(stats.minRent), label: "From, monthly" } : null,
      { value: area.guideValue, label: area.guideLabel },
    ].filter((stat): stat is { value: string; label: string } => stat !== null);

  return (
    <>
      <section
        aria-labelledby="area-heading"
        className="web-dark relative overflow-hidden px-5 pb-18 pt-8 sm:px-8 lg:px-14"
      >
        <div className="relative mx-auto w-full max-w-[1320px]">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Areas", href: "/locations" },
              { label: area.name },
            ]}
            className="mb-9"
          />

          <div className="grid gap-14 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end">
            <div>
              <Eyebrow tone="dark">{groupTitle}</Eyebrow>
              <h1
                id="area-heading"
                className="web-title mt-4.5 text-[clamp(2.25rem,1.5rem+3.4vw,3.5rem)] leading-[1.06] tracking-[-0.015em] text-on-dark-hi"
              >
                {area.name}
              </h1>
              <p className="web-subtitle mt-4.5 max-w-[54ch] text-web-lead text-on-dark">
                {area.blurb}
              </p>
            </div>

            {heroStats.length > 0 && (
              <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-web-panel border border-dark-line bg-dark-line">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="bg-brand-dark/50 p-5">
                    <dd className="web-numeric text-2xl tracking-[-0.02em] text-on-dark-hi">
                      {stat.value}
                    </dd>
                    <dt className="web-control mt-1.5 text-[11px] uppercase tracking-[0.14em] text-on-dark-lo">
                      {stat.label}
                    </dt>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </section>

      <main className="bg-surface-0 pt-20">
        <Container>
          <div className="grid gap-16 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)] lg:items-start">
            <div className="min-w-0">
              {editorial && (
                <section className="mb-14">
                  <h2 className="web-title text-web-h2 text-ink-900">
                    What it is like to live here
                  </h2>
                  {editorial.livingHere.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 40)}
                      className="web-prose mt-5 max-w-[68ch] leading-[1.75] text-ink-500"
                    >
                      {paragraph}
                    </p>
                  ))}
                </section>
              )}

              {/* Guide table where written, computed table otherwise. Both
                  state their basis; neither ever shows a bare zero. */}
              {editorial ? (
                <section className="mb-14">
                  <h2 className="web-title text-web-h2 text-ink-900">What things cost</h2>
                  <p className="mt-2 max-w-[64ch] text-[15px] leading-relaxed text-ink-400">
                    {editorial.costsNote}
                  </p>

                  <div className="mt-6 overflow-x-auto rounded-web-card border border-line">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-surface-1">
                          <th className="web-control border-b border-line px-5 py-3.5 text-left text-[11px] uppercase tracking-[0.14em] text-ink-400">
                            Type
                          </th>
                          <th className="web-control border-b border-line px-5 py-3.5 text-right text-[11px] uppercase tracking-[0.14em] text-ink-400">
                            To let, monthly
                          </th>
                          <th className="web-control border-b border-line px-5 py-3.5 text-right text-[11px] uppercase tracking-[0.14em] text-ink-400">
                            For sale
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {editorial.costRows.map((row) => (
                          <tr key={row.type}>
                            <td className="border-b border-line-soft px-5 py-3.5 text-[14.5px] text-ink-900">
                              {row.type}
                            </td>
                            <td
                              className={cn(
                                "web-numeric whitespace-nowrap border-b border-line-soft px-5 py-3.5 text-right text-sm",
                                row.emphasis ? "text-ink-900" : "text-ink-500"
                              )}
                            >
                              {row.toLet}
                            </td>
                            <td
                              className={cn(
                                "web-numeric whitespace-nowrap border-b border-line-soft px-5 py-3.5 text-right text-sm",
                                row.forSale === "—"
                                  ? "text-ink-400"
                                  : row.emphasis
                                    ? "text-ink-900"
                                    : "text-ink-500"
                              )}
                            >
                              {row.forSale}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ) : (
                stats.priceRows.length > 0 && (
                  <section className="mb-14">
                    <h2 className="web-title text-web-h2 text-ink-900">What things cost</h2>
                    <div className="mt-6 overflow-hidden rounded-web-card border border-line">
                      <div className="grid grid-cols-3 gap-4 bg-surface-1 px-5 py-3">
                        <span className="web-control text-[10px] uppercase tracking-[0.14em] text-ink-400">
                          Size
                        </span>
                        <span className="web-control text-right text-[10px] uppercase tracking-[0.14em] text-ink-400">
                          Typical rent
                        </span>
                        <span className="web-control text-right text-[10px] uppercase tracking-[0.14em] text-ink-400">
                          Available now
                        </span>
                      </div>
                      {stats.priceRows.map((row) => (
                        <div
                          key={row.bedrooms}
                          className="grid grid-cols-3 gap-4 border-t border-line-soft px-5 py-4"
                        >
                          <span className="text-[15px] text-ink-700">{row.label}</span>
                          <span className="web-numeric text-right text-[15px] text-ink-900">
                            {row.typicalRent ? formatKES(row.typicalRent) : "No data"}
                          </span>
                          <span className="web-numeric text-right text-[15px] text-ink-500">
                            {row.available}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-4 max-w-[64ch] text-[13.5px] leading-relaxed text-ink-400">
                      Based on {stats.total} {stats.total === 1 ? "property" : "properties"} we
                      currently have listed in {area.name}. Figures from our own book, not asking
                      prices collected from portals, which is why the sample is small and stated.
                    </p>
                  </section>
                )
              )}

              {editorial && (
                <section className="mb-14">
                  <h2 className="web-title text-web-h2 text-ink-900">
                    Getting around and getting things
                  </h2>
                  <div className="mt-6 grid gap-x-10 sm:grid-cols-2">
                    <div>
                      <p className="web-control mb-3 text-[11px] uppercase tracking-[0.16em] text-ink-400">
                        Distances
                      </p>
                      <dl>
                        {editorial.distances.map((row) => (
                          <div
                            key={row.place}
                            className="flex justify-between gap-3 border-b border-line-soft py-3"
                          >
                            <dt className="text-[14.5px] text-ink-500">{row.place}</dt>
                            <dd className="web-numeric whitespace-nowrap text-[13.5px] text-ink-400">
                              {row.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>

                    <div>
                      <p className="web-control mb-3 text-[11px] uppercase tracking-[0.16em] text-ink-400">
                        Worth knowing
                      </p>
                      <ul>
                        {editorial.worthKnowing.map((item) => (
                          <li
                            key={item}
                            className="flex items-center gap-3 border-b border-line-soft py-3 text-[14.5px] text-ink-500"
                          >
                            <CheckIcon
                              size={15}
                              stroke={WEB_ICON_STROKE}
                              aria-hidden="true"
                              className="shrink-0 text-ink-900 opacity-55"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>
              )}

              <section className="mb-14">
                <h2 className="web-title text-web-h2 text-ink-900">
                  Available in {area.name} now
                </h2>

                {results.listings.length > 0 ? (
                  <>
                    <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                      {results.listings.map((listing, index) => (
                        <li key={listing.id}>
                          <ListingCard listing={listing} headingLevel={3} priority={index < 3} />
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/properties?location=${encodeURIComponent(term)}`}
                      className="web-subtitle mt-6 inline-flex items-center gap-2 border-b border-line-strong pb-1 text-[14.5px] text-ink-900 transition-colors hover:border-ink-900"
                    >
                      All {stats.total} {stats.total === 1 ? "property" : "properties"} in{" "}
                      {area.name}
                      <ArrowIcon size={16} stroke={WEB_ICON_STROKE} aria-hidden="true" />
                    </Link>
                  </>
                ) : (
                  <div className="mt-6 rounded-web-card border border-line bg-surface-1 p-8">
                    <p className="web-prose text-ink-500">
                      Nothing on the books in {area.name} at this moment. That changes weekly, and
                      we will call you before a matching property reaches the site.
                    </p>
                    <WebButtonLink href="/contact" variant="primary" size="md" className="mt-6">
                      Register a requirement
                    </WebButtonLink>
                  </div>
                )}
              </section>
            </div>

            <aside className="lg:sticky lg:top-[100px]">
              <div className="rounded-web-panel border border-line p-7 shadow-web-md">
                <p className="web-control text-[11px] uppercase tracking-[0.18em] text-ink-400">
                  Own here?
                </p>
                <h2 className="web-title-card mt-2 text-2xl leading-tight text-ink-900">
                  What your {area.name} property would fetch
                </h2>
                <p className="mt-3.5 text-[14.5px] leading-relaxed text-ink-500">
                  {stats.total > 0
                    ? `We let ${stats.total} ${stats.total === 1 ? "property" : "properties"} in this area. A consultant can tell you what yours should achieve, and what is holding the figure down.`
                    : "A consultant who covers this area can tell you what yours should achieve, and what is holding the figure down."}
                </p>
                <WebButtonLink
                  href="/landlords#valuation"
                  variant="primary"
                  size="md"
                  className="mt-5 w-full justify-center"
                >
                  Request a valuation
                </WebButtonLink>
                <p className="mt-3.5 text-[12.5px] leading-relaxed text-ink-400">
                  Free, and no obligation to list with us.
                </p>
              </div>

              {nearby.length > 0 && (
                <nav aria-label="Nearby areas" className="mt-4 rounded-web-panel border border-line p-7">
                  <p className="web-control mb-4 text-[11px] uppercase tracking-[0.18em] text-ink-400">
                    Nearby areas
                  </p>
                  <ul>
                    {nearby.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/locations/${item.slug}`}
                          className="flex justify-between gap-3 border-t border-line-soft py-3 text-[14.5px] text-ink-900 transition-colors last:border-b hover:text-brand-dark"
                        >
                          {item.name}
                          <span className="web-numeric shrink-0 text-[13px] text-ink-400">
                            {item.guideValue}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </aside>
          </div>
        </Container>
      </main>

      <section aria-labelledby="area-cta-heading" className="web-dark mt-20 py-24 lg:py-28">
        <Container>
          <div className="max-w-[56ch]">
            <h2 id="area-cta-heading" className="web-title text-web-h2 text-on-dark-hi">
              Looking in {area.name}?
            </h2>
            <p className="web-subtitle mt-4 text-web-lead text-on-dark">
              Tell us the size and the budget and we will send what fits, including properties that
              have not reached the site yet.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <WebButtonLink href="/contact" variant="primary" size="lg">
                Register a requirement
              </WebButtonLink>
              <WebButtonLink href="/locations" variant="ghostDark" size="lg">
                All areas
              </WebButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

