/**
 * Route-level loading state for the home page.
 *
 * This is the slowest route on the site: `page.tsx` awaits four queries in
 * parallel — `getHomeAggregates`, `getCategoryCounts`, `getFeaturedListings`
 * and `getAreasWithStock` — and renders nothing until the slowest resolves.
 * Without this file Next holds the *previous* route on screen for that whole
 * round trip, so a visitor arriving from anywhere on the site sees the old
 * page sit there, apparently ignoring their click.
 *
 * ── Why these shapes ──
 *
 * The skeleton mirrors the box model of what replaces it, which is where the
 * Cumulative Layout Shift budget is won or lost. Three bands are reserved:
 *
 *   1. The hero, on `.web-hero-shell` — the same 100svh tier the real hero
 *      uses, so the fold does not jump when it swaps in. It repeats the real
 *      hero's `grid-rows-[1fr_auto]`, which is what floors the content
 *      cluster; reserving a plain block here would put the copy in the middle
 *      of the screen and then snap it down.
 *   2. The categories band, dark, matching `py-16 sm:py-20 lg:py-24` and the
 *      1/2/4-column divided grid.
 *   3. The featured listings band, whose three cards are the tallest thing
 *      below the fold that waits on a query.
 *
 * Everything further down (`HomeServices`, `HomeProof`, `HomeFaq`, `HomeCta`)
 * renders from constants and needs no query, so reserving space for it would
 * be inventing work the page does not do.
 *
 * No spinner and no "Loading…" text. A spinner communicates a duration it
 * cannot predict, and the shape of the page says more than a label.
 * `.web-skeleton` carries the pulse and already flattens to a static fill
 * under `prefers-reduced-motion: reduce`.
 */
export default function HomeLoading() {
  return (
    <div aria-busy="true" aria-live="polite">
      {/* Screen readers get the one thing the visual skeleton cannot say. */}
      <span className="sr-only">Loading the home page</span>

      {/* ── Hero ── */}
      <div className="web-dark web-hero-shell relative grid grid-rows-[1fr_auto] overflow-hidden bg-brand-deep">
        {/* Row 1 absorbs free space so the cluster sits on the floor, exactly
            as the real hero does. Collapses below 640, where the shell is
            content-height. */}
        <div aria-hidden="true" className="min-h-[18svh] sm:min-h-0" />

        {/* Row 2: the content cluster. Padding clears the transparent header. */}
        <div className="relative z-raised pb-10 pt-24 sm:pt-28 lg:pb-14">
          <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-8 lg:px-12 xl:px-14">
            <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,440px)] lg:gap-12 xl:gap-16">
              <div className="flex flex-col gap-4">
                {/* Eyebrow: rule plus label, the pairing the hero opens on. */}
                <div className="flex items-center gap-3">
                  <span aria-hidden="true" className="h-[2px] w-10 shrink-0 bg-brand-yellow/40" />
                  <div className="web-skeleton h-3 w-44 rounded-full opacity-30" />
                </div>
                {/* Headline: clamp(3.2rem, 5.2vw, 4.5rem) is roughly 56–72px. */}
                <div className="web-skeleton h-14 w-4/5 rounded-lg opacity-25 sm:h-16" />
                <div className="web-skeleton h-4 w-full max-w-[52ch] rounded opacity-20" />
                <div className="web-skeleton h-4 w-2/3 max-w-[40ch] rounded opacity-20" />
              </div>

              {/* The portfolio dial column. */}
              <div className="w-full justify-self-end">
                <div className="web-skeleton h-[220px] w-full rounded-2xl opacity-20" />
              </div>
            </div>

            {/* Full-bleed search panel, the width of the content column. */}
            <div className="web-skeleton mt-8 h-16 w-full rounded-full opacity-25 lg:mt-10" />

            {/* Quick-link pills. */}
            <div className="mt-5.5 flex flex-wrap items-center gap-x-2.5 gap-y-2">
              {[68, 92, 76, 84].map((width, index) => (
                <div
                  key={index}
                  className="web-skeleton h-7 rounded-full opacity-20"
                  style={{ width }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Categories ── */}
      <div className="relative overflow-hidden bg-brand-dark py-16 sm:py-20 lg:py-24">
        <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-8 lg:px-12 xl:px-14">
          <div className="flex flex-col gap-4">
            <div className="web-skeleton h-3 w-40 rounded-full opacity-30" />
            <div className="web-skeleton h-9 w-2/3 max-w-[520px] rounded-lg opacity-25" />
          </div>

          {/* The status progress bar that sits under the heading. */}
          <div className="web-skeleton mt-8 h-2 w-full rounded-full opacity-20" />

          <div className="mt-8 grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="flex flex-col gap-3 px-0 py-6 sm:px-6 sm:py-0">
                <div className="web-skeleton size-9 rounded-lg opacity-25" />
                <div className="web-skeleton h-5 w-3/4 rounded opacity-25" />
                <div className="web-skeleton h-3 w-full rounded opacity-15" />
                <div className="web-skeleton h-5 w-24 rounded-full opacity-20" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Featured listings ── */}
      <div className="border-t border-line bg-surface-0 py-20 sm:py-24 lg:py-28">
        <div className="mx-auto w-full max-w-[1440px] px-6 sm:px-8 lg:px-12 xl:px-14">
          <div className="flex flex-col gap-4">
            <div className="web-skeleton h-3 w-36 rounded-full" />
            <div className="web-skeleton h-9 w-2/3 max-w-[480px] rounded-lg" />
          </div>

          {/* The category tab row above the grid. */}
          <div className="mt-6 flex flex-wrap gap-2.5">
            {[96, 112, 88, 104].map((width, index) => (
              <div key={index} className="web-skeleton h-9 rounded-full" style={{ width }} />
            ))}
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <div key={index} className="flex flex-col gap-3">
                {/* Card media, on the same responsive aspect the cards use. */}
                <div className="web-skeleton aspect-[16/11] w-full rounded-2xl" />
                <div className="web-skeleton h-3 w-24 rounded-full" />
                <div className="web-skeleton h-5 w-4/5 rounded" />
                <div className="web-skeleton h-4 w-1/2 rounded" />
                <div className="web-skeleton mt-1 h-6 w-32 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
