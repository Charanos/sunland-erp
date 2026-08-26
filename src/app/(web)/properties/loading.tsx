/**
 * Route-level loading state for /properties and every facet page under it.
 *
 * `/properties` and `/properties/[segment]` are the two genuinely dynamic
 * routes on the public site — they read `searchParams` for filters, so Next
 * renders them on demand rather than serving prerendered HTML. That makes this
 * the one place on the site where a visitor reliably waits.
 *
 * ── What this does that ListingIndex's own Suspense cannot ──
 *
 * `ListingIndex` already wraps its results grid in `<Suspense>`, so changing a
 * filter re-suspends only the grid and leaves the hero alone. But that
 * boundary sits *inside* a component that first does `await getFacetCounts()`.
 * On the initial navigation to /properties nothing inside it has rendered yet,
 * so the internal fallback cannot show, and Next holds the previous route on
 * screen until the counts resolve. This file covers exactly that gap and then
 * hands over to the finer-grained boundary.
 *
 * Because it lives at the `properties` segment it also covers every facet page
 * beneath it — `/properties/for-sale`, `/properties/apartments` and the rest —
 * which all render through the same template.
 *
 * The shapes mirror `PropertiesHero` (the `.web-hero-l2` tier) and the
 * `[300px_minmax(0,1fr)]` rail-plus-grid body, since matching the box model of
 * what replaces the skeleton is where the layout-shift budget is won.
 * `.web-skeleton` carries the pulse and flattens to a static fill under
 * `prefers-reduced-motion: reduce`.
 */
export default function PropertiesLoading() {
  return (
    <div aria-busy="true" aria-live="polite">
      {/* Screen readers get the one thing the visual skeleton cannot say. */}
      <span className="sr-only">Loading properties</span>

      {/* ── Hero, on the same L2 tier the real hero uses ── */}
      <div className="web-dark web-hero-l2 relative z-10 bg-brand-deep">
        <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-end px-6 sm:px-8 lg:px-12 xl:px-14">
          {/* Breadcrumb row: hairline plus label. */}
          <div className="mb-6 flex items-center gap-2.5">
            <span aria-hidden="true" className="h-px w-6 shrink-0 bg-white/30" />
            <div className="web-skeleton h-3 w-40 rounded-full opacity-30" />
          </div>

          {/* Headline — clamp(2.4rem, 4.2vw, 4.5rem). */}
          <div className="web-skeleton h-12 w-3/4 max-w-[760px] rounded-lg opacity-25 sm:h-16" />

          {/* Lead and count pill share a row on desktop. */}
          <div className="mt-5 flex flex-col justify-between gap-6 pt-1 sm:flex-row sm:items-end">
            <div className="flex flex-1 flex-col gap-2.5">
              <div className="web-skeleton h-4 w-full max-w-[62ch] rounded opacity-20" />
              <div className="web-skeleton h-4 w-2/3 max-w-[44ch] rounded opacity-20" />
            </div>
            <div className="web-skeleton h-8 w-40 shrink-0 rounded-full opacity-25" />
          </div>
        </div>
      </div>

      {/* ── Below-fold body: filter rail plus results grid ── */}
      <div className="bg-[#fbfcff] pb-28 pt-10">
        <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-8 lg:px-12 xl:px-14">
          <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start">
            {/* Filter rail. Sticky on desktop, stacked above the grid on
                mobile — the same order the real rail takes. */}
            <div className="mb-5 lg:sticky lg:top-24 lg:mb-0 lg:self-start">
              <div className="flex flex-col gap-5 rounded-2xl border border-line bg-white p-5">
                {[0, 1, 2, 3].map((group) => (
                  <div key={group} className="flex flex-col gap-2.5">
                    <div className="web-skeleton h-3 w-28 rounded-full" />
                    {[0, 1, 2].map((row) => (
                      <div key={row} className="flex items-center justify-between gap-3">
                        <div className="web-skeleton h-3.5 w-32 rounded" />
                        <div className="web-skeleton h-3.5 w-8 rounded" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Results: the sort bar, then the card grid. */}
            <div className="min-w-0">
              <div className="web-skeleton h-[54px] w-full rounded-xl" />
              <ul className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2">
                {Array.from({ length: 9 }).map((_, index) => (
                  <li key={index} className="flex flex-col gap-3">
                    <div className="web-skeleton aspect-[16/10] w-full rounded-2xl" />
                    <div className="web-skeleton h-4 w-3/4 rounded-full" />
                    <div className="web-skeleton h-3 w-1/2 rounded-full" />
                    <div className="web-skeleton h-6 w-2/5 rounded-full" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
