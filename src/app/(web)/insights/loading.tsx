import { Container } from "@/components/web/primitives/container";

/**
 * Route-level loading state for /insights.
 *
 * `/insights` reads `searchParams` for the category filter, so Next renders it
 * on demand rather than serving prerendered HTML — it and `/properties` are
 * the two public routes where a visitor actually waits. (`/insights/[slug]` is
 * prerendered via `generateStaticParams`, so it never reaches this file except
 * on a cold path outside the static set.)
 *
 * Every category switch is a fresh navigation, which makes this skeleton the
 * thing standing between the click and the new grid. Reserving the wrong
 * heights here would be worse than reserving none, so the shapes follow the
 * real page: the `.web-hero-l2` band, the filter-pill row with its count
 * telemetry, the featured article's 12-column split, and the 1/2/3-column card
 * grid below it.
 *
 * `.web-skeleton` carries the pulse and already flattens to a static fill
 * under `prefers-reduced-motion: reduce`.
 */
export default function InsightsLoading() {
  return (
    <div aria-busy="true" aria-live="polite">
      {/* Screen readers get the one thing the visual skeleton cannot say. */}
      <span className="sr-only">Loading insights</span>

      {/* ── Hero, on the same L2 tier the real hero uses ── */}
      <div className="web-dark web-hero-l2 relative z-10 bg-brand-deep">
        <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-end px-6 sm:px-8 lg:px-12 xl:px-14">
          <div className="mb-6 flex items-center gap-2.5">
            <span aria-hidden="true" className="h-px w-6 shrink-0 bg-white/30" />
            <div className="web-skeleton h-3 w-36 rounded-full opacity-30" />
          </div>

          <div className="web-skeleton h-12 w-3/4 max-w-[720px] rounded-lg opacity-25 sm:h-16" />

          <div className="mt-5 flex flex-col justify-between gap-6 pt-1 sm:flex-row sm:items-end">
            <div className="flex flex-1 flex-col gap-2.5">
              <div className="web-skeleton h-4 w-full max-w-[62ch] rounded opacity-20" />
              <div className="web-skeleton h-4 w-1/2 max-w-[38ch] rounded opacity-20" />
            </div>
            <div className="web-skeleton h-8 w-36 shrink-0 rounded-full opacity-25" />
          </div>
        </div>
      </div>

      {/* ── Directory workspace ── */}
      <div className="border-t border-line bg-surface-0 pb-24 pt-12 sm:pt-14">
        <Container>
          {/* Filter pills, with the count telemetry opposite them. */}
          <div className="mb-10 flex flex-col justify-between gap-5 border-b border-line pb-6 sm:mb-12 sm:flex-row sm:items-center">
            <div className="flex flex-wrap items-center gap-2">
              {[72, 96, 84, 110, 88].map((width, index) => (
                <div
                  key={index}
                  className="web-skeleton h-9 rounded-full"
                  style={{ width }}
                />
              ))}
            </div>
            <div className="web-skeleton h-3 w-32 shrink-0 rounded-full" />
          </div>

          {/* Featured article: the 12-column editorial split. */}
          <div className="mb-20 grid gap-8 rounded-[28px] border border-line bg-surface-1 p-6 sm:p-8 lg:grid-cols-12 lg:items-center lg:gap-12 lg:p-10">
            <div className="lg:col-span-6">
              <div className="web-skeleton aspect-[16/10] w-full rounded-2xl" />
            </div>
            <div className="flex flex-col gap-4 lg:col-span-6">
              <div className="web-skeleton h-3 w-28 rounded-full" />
              <div className="web-skeleton h-9 w-full rounded-lg" />
              <div className="web-skeleton h-9 w-3/4 rounded-lg" />
              <div className="web-skeleton mt-1 h-4 w-full rounded" />
              <div className="web-skeleton h-4 w-5/6 rounded" />
              <div className="web-skeleton mt-2 h-4 w-40 rounded" />
            </div>
          </div>

          {/* Section rule above the grid. */}
          <div className="mb-8 flex items-center justify-between border-b border-line-soft pb-5">
            <div className="flex items-center gap-2.5">
              <span aria-hidden="true" className="h-px w-5 bg-brand-yellow" />
              <div className="web-skeleton h-3 w-44 rounded-full" />
            </div>
            <div className="web-skeleton h-3 w-20 rounded-full" />
          </div>

          {/* The article grid. */}
          <div className="grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-3">
                <div className="web-skeleton aspect-[16/10] w-full rounded-2xl" />
                <div className="web-skeleton h-3 w-24 rounded-full" />
                <div className="web-skeleton h-5 w-full rounded" />
                <div className="web-skeleton h-5 w-2/3 rounded" />
                <div className="web-skeleton mt-1 h-3 w-32 rounded-full" />
              </div>
            ))}
          </div>
        </Container>
      </div>
    </div>
  );
}
