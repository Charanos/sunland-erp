import { Breadcrumbs, type Crumb } from "../primitives/breadcrumbs";
import { WebPagination } from "../primitives/pagination";
import { CATEGORY_FACETS, type ListingFacet } from "../constants/listing-taxonomy";
import { FilterRail } from "./filter-rail";
import { EmptyResults, RegisterRequirement, ResultsGrid } from "./results-grid";
import { ResultsToolbar } from "./results-toolbar";
import { PropertiesHero } from "./properties-hero";
import { PropertiesPageReveal } from "./properties-page-reveal";
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
      {/* ── Animated hero (client component) ───────────────────────────── */}
      <PropertiesHero
        title={title}
        lead={lead}
        breadcrumbSlot={
          <Breadcrumbs items={crumbs} tone="dark" />
        }
        countSlot={
          <>
            <span className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-brand-yellow">
              {results.total} {results.total === 1 ? "property" : "properties"}
            </span>
          </>
        }
      />

      {/* Scoped reveal orchestrator — no dependency on RevealController */}
      <PropertiesPageReveal />

      {/* ── Below-fold body ─────────────────────────────────────────────── */}
      <div className="bg-[#fbfcff] pb-28 pt-10">
        <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-8 lg:px-12 xl:px-14">
          <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">

            {/* ── FilterRail — sticky on desktop ──────────────────────────── */}
            <div className="ph-reveal-rail lg:sticky lg:top-24 lg:self-start mb-5 lg:mb-0">
              <FilterRail
                counts={counts}
                resultCount={results.total}
                lockedFacet={facet ? { kind: facet.kind, segment: facet.segment } : undefined}
              />
            </div>

            {/* ── Results column ──────────────────────────────────────────── */}
            <section aria-label="Results" className="min-w-0">
              <div className="ph-reveal-toolbar">
                <ResultsToolbar total={results.total} chips={chips} />
              </div>

              {results.listings.length > 0 ? (
                <>
                  <div className="mt-6">
                    <ResultsGrid listings={results.listings} />
                  </div>

                  <div className="ph-reveal-footer mt-4">
                    <WebPagination
                      currentPage={results.page}
                      totalPages={results.totalPages}
                      totalItems={results.total}
                      pageSize={results.pageSize}
                      basePath={basePath}
                      searchParams={carriedParams}
                    />
                  </div>

                  <div className="ph-reveal-cta">
                    <RegisterRequirement />
                  </div>
                </>
              ) : (
                <div className="ph-reveal-empty">
                  <EmptyResults alternatives={alternatives} clearHref={basePath} />
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

