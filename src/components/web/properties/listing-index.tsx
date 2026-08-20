import Image from "next/image";
import { PageHeader } from "../layout/page-header";
import { Container } from "../primitives/container";
import { WebPagination } from "../primitives/pagination";
import { Breadcrumbs, type Crumb } from "../primitives/breadcrumbs";
import { CATEGORY_FACETS, type ListingFacet } from "../constants/listing-taxonomy";
import { FilterRail } from "./filter-rail";
import { EmptyResults, RegisterRequirement, ResultsGrid } from "./results-grid";
import { ResultsToolbar } from "./results-toolbar";
import { getFacetCounts, getListings, type ListingFilters } from "@/lib/services/web/listings";

/**
 * The listing index template, shared by `/properties` and every facet page
 * beneath it.
 *
 * One component rather than five near-copies, because the facets differ only
 * in which filter is pinned and what the heading says. Five copies is five
 * places to forget the aria-live count.
 *
 * Filter state round-trips through the URL: the server reads `searchParams`,
 * queries, and renders. Nothing about the result set lives in client state,
 * so the back button, a shared link and a crawler all see the same page.
 */
export async function ListingIndex({
  facet,
  searchParams,
  basePath,
  crumbs,
  title,
  lead,
}: {
  /** Present on a facet page, absent on /properties. */
  facet?: ListingFacet;
  searchParams: Record<string, string | string[] | undefined>;
  basePath: string;
  crumbs: Crumb[];
  title: string;
  lead: string;
}) {
  const single = (key: string) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };
  const many = (key: string) => {
    const value = searchParams[key];
    if (Array.isArray(value)) return value;
    return value ? [value] : [];
  };

  const toNumber = (value: string | undefined) => {
    if (!value) return undefined;
    const parsed = Number(value.replace(/[^0-9]/g, ""));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
  };

  // The facet pins its own filter. A query parameter cannot override it:
  // /properties/apartments?category=land would otherwise render land under an
  // "Apartments in Nairobi" heading, which is a page that contradicts itself.
  const categoryFromFacet = facet?.kind === "category" ? facet.segment : undefined;
  const statusFromFacet =
    facet?.kind === "status" ? (facet.segment as "for-rent" | "for-sale") : undefined;

  const selectedCategories = categoryFromFacet ? [categoryFromFacet] : many("category");
  const statusParam = single("status");
  const status =
    statusFromFacet ??
    (statusParam === "for-rent" || statusParam === "for-sale" ? statusParam : undefined);

  const filters: ListingFilters = {
    status,
    // The service takes one category; a multi-select rail is a W1-13 concern
    // once the real taxonomy exists. Until then the first selection wins,
    // which is honest about what the query actually does.
    category: selectedCategories[0],
    location: single("location"),
    minPrice: toNumber(single("min")),
    maxPrice: toNumber(single("max")),
    bedrooms: many("beds"),
    sort: single("sort") as ListingFilters["sort"],
    page: Number(single("page")) || 1,
    pageSize: 9,
  };

  const [results, counts] = await Promise.all([getListings(filters), getFacetCounts()]);

  const chips: { label: string; param: string; value?: string }[] = [];
  for (const segment of selectedCategories) {
    if (segment === categoryFromFacet) continue;
    const match = CATEGORY_FACETS.find((item) => item.segment === segment);
    if (match) chips.push({ label: match.label, param: "category", value: segment });
  }
  for (const beds of many("beds")) {
    chips.push({ label: `${beds} bd`, param: "beds", value: beds });
  }
  if (filters.location) chips.push({ label: filters.location, param: "location" });
  if (filters.minPrice)
    chips.push({ label: `Min ${filters.minPrice.toLocaleString("en-KE")}`, param: "min" });
  if (filters.maxPrice)
    chips.push({ label: `Max ${filters.maxPrice.toLocaleString("en-KE")}`, param: "max" });

  // Alternatives relax the most restrictive filter first, so each suggestion
  // is a real result set rather than a guess that lands on another empty page.
  const alternatives: { label: string; href: string }[] = [];
  if (filters.maxPrice) {
    alternatives.push({
      label: `Up to ${Math.round(filters.maxPrice * 1.3).toLocaleString("en-KE")}`,
      href: `${basePath}?max=${Math.round(filters.maxPrice * 1.3)}`,
    });
  }
  if (filters.bedrooms && filters.bedrooms.length > 0) {
    alternatives.push({ label: "Any number of bedrooms", href: basePath });
  }
  if (filters.location) {
    alternatives.push({ label: "Any area", href: basePath });
  }

  const carriedParams: Record<string, string | undefined> = {
    status: statusFromFacet ? undefined : statusParam,
    location: filters.location,
    min: single("min"),
    max: single("max"),
    sort: single("sort"),
  };

  return (
    <>
      <section className="web-dark relative z-10 flex min-h-[48svh] sm:min-h-[52svh] flex-col overflow-hidden pb-14 pt-32 sm:pt-36 lg:pt-44">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#090d1f]">
          <Image
            src="/images/properties-hero.jpg"
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="100vw"
            quality={100}
            className="object-cover object-center opacity-70"
          />
          {/* Layered atmospheric scrims for header transparency contrast and editorial legibility */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent via-35% to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 via-55% to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-transparent via-[#090d1f]/40 to-[#151936]"
          />
        </div>

        <Container className="relative z-10 flex flex-1 flex-col justify-end">
          <Breadcrumbs items={crumbs} tone="dark" className="mb-6 opacity-85" />
          
          <div className="w-full">
            <h1 className="web-title w-full text-[clamp(2.4rem,4.2vw,4.5rem)] font-normal leading-[1.06] tracking-tight text-white drop-shadow-md">
              {title}
            </h1>

            <div className="mt-5 flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-1">
              {lead && (
                <p className="web-subtitle max-w-[62ch] text-base sm:text-lg leading-relaxed text-slate-200/90 drop-shadow-sm">
                  {lead}
                </p>
              )}

              <div className="flex shrink-0 items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 backdrop-blur-md shadow-sm">
                <span aria-hidden="true" className="inline-block size-2 rounded-full bg-brand-yellow animate-pulse" />
                <span className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-brand-yellow">
                  {results.total} {results.total === 1 ? "property" : "properties"}
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <div className="bg-[#fbfcff] pb-28 pt-10">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
            <FilterRail
              counts={counts}
              resultCount={results.total}
              lockedFacet={facet ? { kind: facet.kind, segment: facet.segment } : undefined}
              className="mb-5 lg:mb-0"
            />

            <section aria-label="Results" className="min-w-0">
              <ResultsToolbar total={results.total} chips={chips} />

              {results.listings.length > 0 ? (
                <>
                  <ResultsGrid listings={results.listings} />
                  <WebPagination
                    currentPage={results.page}
                    totalPages={results.totalPages}
                    totalItems={results.total}
                    pageSize={results.pageSize}
                    basePath={basePath}
                    searchParams={carriedParams}
                  />
                  <RegisterRequirement />
                </>
              ) : (
                <EmptyResults alternatives={alternatives} clearHref={basePath} />
              )}
            </section>
          </div>
        </Container>
      </div>
    </>
  );
}
