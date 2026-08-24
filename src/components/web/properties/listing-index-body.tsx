import { Suspense } from "react";
import { CATEGORY_FACETS, type ListingFacet } from "../constants/listing-taxonomy";
import { FilterRail } from "./filter-rail";
import { EmptyResults, RegisterRequirement, ResultsGrid } from "./results-grid";
import { ResultsToolbar } from "./results-toolbar";
import { WebPagination } from "../primitives/pagination";
import { getListings, type ListingFilters } from "@/lib/services/web/listings";

// ── Skeleton for the results column only ────────────────────────────────────
function ResultsSkeleton() {
  return (
    <section aria-label="Results" aria-busy="true" className="min-w-0">
      <div className="h-[54px] w-full animate-pulse rounded-xl bg-slate-200/70" />
      <ul className="mt-6 grid gap-x-6 gap-y-10 sm:gap-y-12 sm:grid-cols-2 lg:gap-x-8 lg:gap-y-14">
        {Array.from({ length: 9 }).map((_, i) => (
          <li key={i} className="flex flex-col gap-3">
            <div className="aspect-[16/10] w-full animate-pulse rounded-2xl bg-slate-200/70" />
            <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-200/60" />
            <div className="h-3 w-1/2 animate-pulse rounded-full bg-slate-200/50" />
            <div className="h-6 w-2/5 animate-pulse rounded-full bg-slate-200/70" />
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * The async data-fetching shell for the results column ONLY.
 *
 * This component is the sole thing that re-suspends when filters change.
 * FilterRail, the hero and the page layout are NOT inside this boundary.
 */
async function PropertiesResults({
  filters,
  chips,
  alternatives,
  basePath,
  carriedParams,
}: {
  filters: ListingFilters;
  chips: { label: string; param: string; value?: string }[];
  alternatives: { label: string; href: string }[];
  basePath: string;
  carriedParams: Record<string, string | undefined>;
}) {
  const results = await getListings(filters);

  return (
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
  );
}

/**
 * Computes the filter state from searchParams, then renders the two-column
 * grid: a sticky FilterRail (never suspends) alongside a Suspense-bounded
 * results column (suspends only when filterKey changes).
 *
 * Accepts pre-fetched `counts` from the parent ListingIndex so we don't
 * double-fetch what was already resolved.
 */
export async function ListingIndexBody({
  facet,
  searchParams,
  basePath,
  counts,
}: {
  facet?: ListingFacet;
  searchParams: Record<string, string | string[] | undefined>;
  basePath: string;
  counts: Record<string, number>;
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
    category: selectedCategories[0],
    location: single("location"),
    minPrice: toNumber(single("min")),
    maxPrice: toNumber(single("max")),
    bedrooms: many("beds"),
    sort: single("sort") as ListingFilters["sort"],
    page: Number(single("page")) || 1,
    pageSize: 9,
  };

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

  // Stable key that changes only when filter state changes — causes only the
  // results column to remount, never the FilterRail or surrounding layout.
  const filterKey = JSON.stringify(filters);

  // Derive a result count estimate for the FilterRail submit button from the
  // facet counts (cached, no extra DB round-trip). This is an approximation
  // — the rail shows "Show ~N Results". Exact count is shown in the toolbar
  // once PropertiesResults resolves.
  const estimatedCount = (() => {
    if (filters.category && counts[filters.category] !== undefined) {
      return counts[filters.category];
    }
    return Object.values(counts).reduce((s, n) => s + n, 0);
  })();

  return (
    <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-8 lg:px-12 xl:px-14">
      <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">

        {/* FilterRail — client component, reads URL directly via useSearchParams,
            reflects filter changes instantly without waiting for server fetch */}
        <div className="ph-reveal-rail lg:sticky lg:top-30 lg:self-start mb-5 lg:mb-0">
          <FilterRail
            counts={counts}
            resultCount={estimatedCount}
            lockedFacet={facet ? { kind: facet.kind, segment: facet.segment } : undefined}
          />
        </div>

        {/* Results column — the ONLY part that re-suspends on filter/page change.
            #results-anchor is the scroll target used by PropertiesPageReveal
            when the user paginates or changes a filter. */}
        <div className="min-w-0">
          <div id="results-anchor" aria-hidden="true" className="pointer-events-none absolute" />
          <Suspense key={filterKey} fallback={<ResultsSkeleton />}>
            <PropertiesResults
              filters={filters}
              chips={chips}
              alternatives={alternatives}
              basePath={basePath}
              carriedParams={carriedParams}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
