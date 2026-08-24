import { Suspense } from "react";
import { type Crumb } from "../primitives/breadcrumbs";
import { Breadcrumbs } from "../primitives/breadcrumbs";
import { type ListingFacet } from "../constants/listing-taxonomy";
import { PropertiesHero } from "./properties-hero";
import { PropertiesPageReveal } from "./properties-page-reveal";
import { ListingIndexBody } from "./listing-index-body";
import { FilterRail } from "./filter-rail";
import { getFacetCounts } from "@/lib/services/web/listings";

/**
 * The listing index template, shared by `/properties` and every facet page.
 *
 * Architecture (filter-change optimisation):
 *
 *   ┌─ ListingIndex (server, renders once per route) ──────────────────────┐
 *   │  PropertiesHero       ← static, never re-suspends                    │
 *   │  PropertiesPageReveal ← client, mounts once                          │
 *   │  ┌─ below-fold grid ─────────────────────────────────────────────┐   │
 *   │  │  FilterRail  ← client component, reads URL itself — instant   │   │
 *   │  │  ┌─ <Suspense key={filterKey}> ───────────────────────────┐   │   │
 *   │  │  │  PropertiesResults  ← ONLY this re-suspends on change  │   │   │
 *   │  │  └───────────────────────────────────────────────────────┘   │   │
 *   │  └──────────────────────────────────────────────────────────────┘   │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 * When the user changes a filter or navigates a page:
 *   • Hero stays visible (no flash, no re-animation)
 *   • FilterRail updates instantly (client, reads URL via useSearchParams)
 *   • Only the results grid shows a skeleton while the new fetch resolves
 */
export async function ListingIndex({
  facet,
  searchParams,
  basePath,
  crumbs,
  title,
  lead,
}: {
  facet?: ListingFacet;
  searchParams: Record<string, string | string[] | undefined>;
  basePath: string;
  crumbs: Crumb[];
  title: string;
  lead: string;
}) {
  // Fetch facet counts here (fast / cached) so the FilterRail can render
  // immediately with accurate counts independent of the results fetch.
  const counts = await getFacetCounts();

  // Derive a total for the hero pill by summing all facet category counts.
  // This avoids an extra getListings() call just for the hero number.
  const totalForHero = Object.values(counts).reduce((sum, n) => sum + n, 0);

  return (
    <>
      {/* ── Hero — static, never re-renders on filter change ────────────── */}
      <PropertiesHero
        title={title}
        lead={lead}
        breadcrumbSlot={<Breadcrumbs items={crumbs} tone="dark" />}
        countSlot={
          <span className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-brand-yellow">
            {totalForHero > 0
              ? `${totalForHero} ${totalForHero === 1 ? "property" : "properties"}`
              : "Properties"}
          </span>
        }
      />

      {/* Scoped reveal orchestrator */}
      <PropertiesPageReveal />

      {/* ── Below-fold body ─────────────────────────────────────────────── */}
      <div className="bg-[#fbfcff] pb-28 pt-10">
        <Suspense
          fallback={
            // While ListingIndexBody itself resolves (facet counts), show
            // the FilterRail shell with the pre-fetched counts we already have.
            <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-8 lg:px-12 xl:px-14">
              <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
                <div className="ph-reveal-rail lg:sticky lg:top-24 lg:self-start mb-5 lg:mb-0">
                  <FilterRail
                    counts={counts}
                    resultCount={0}
                    lockedFacet={
                      facet ? { kind: facet.kind, segment: facet.segment } : undefined
                    }
                  />
                </div>
                <div className="min-w-0">
                  <div className="h-[54px] w-full animate-pulse rounded-xl bg-slate-200/70" />
                  <ul className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <li key={i} className="flex flex-col gap-3">
                        <div className="aspect-[16/10] animate-pulse rounded-2xl bg-slate-200/70" />
                        <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-200/60" />
                        <div className="h-3 w-1/2 animate-pulse rounded-full bg-slate-200/50" />
                        <div className="h-6 w-2/5 animate-pulse rounded-full bg-slate-200/70" />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          }
        >
          <ListingIndexBody
            facet={facet}
            searchParams={searchParams}
            basePath={basePath}
            counts={counts}
          />
        </Suspense>
      </div>
    </>
  );
}
