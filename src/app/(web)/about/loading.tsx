import { Container } from "@/components/web/primitives/container";

/**
 * Route-level loading state for /about.
 *
 * The page is an async server component: it awaits `getHomeAggregates()` and
 * `getCategoryCounts()` before it can render anything at all. Without this file
 * Next holds the previous route on screen for the whole round trip, so a
 * visitor clicking About from the header sees nothing happen — and on a cold
 * serverless connection that pause is long enough to look broken.
 *
 * ── Why these shapes ──
 *
 * Skeletons mirror the box model of what replaces them, which is where most of
 * the Cumulative Layout Shift budget is won or lost. The hero block is the tall
 * dark band, the story block is the asymmetric editorial split, and the
 * footprint block reserves the chart column that would otherwise pop in and
 * shove everything below it down the page.
 *
 * No spinner and no "Loading about…" text. A spinner communicates duration it
 * cannot predict, and the shape of the page communicates more than a label.
 * `.web-skeleton` carries the pulse and already collapses to a flat fill under
 * `prefers-reduced-motion: reduce`.
 */
export default function AboutLoading() {
  return (
    <div aria-busy="true" aria-live="polite">
      {/* Screen readers get the one thing the visual skeleton cannot say. */}
      <span className="sr-only">Loading the about page</span>

      {/* Hero: the dark band, at its real min-height so the fold does not jump. */}
      <div className="web-dark min-h-[58svh] bg-brand-deep pt-28 sm:min-h-[62svh] sm:pt-32 lg:min-h-[66svh] lg:pt-40">
        <Container>
          <div className="flex h-full flex-col justify-end pb-10 sm:pb-12">
            <div className="ml-auto flex w-full max-w-[680px] flex-col items-end gap-4">
              <div className="web-skeleton h-3 w-40 rounded-full opacity-30" />
              <div className="web-skeleton h-12 w-full rounded-lg opacity-25 sm:h-16" />
              <div className="web-skeleton h-12 w-4/5 rounded-lg opacity-25 sm:h-16" />
              <div className="web-skeleton mt-2 h-4 w-full rounded opacity-20" />
              <div className="web-skeleton h-4 w-3/4 rounded opacity-20" />
            </div>
          </div>
        </Container>
      </div>

      {/* Story: editorial left, media and figures right. */}
      <div className="border-t border-line bg-surface-0 py-20 sm:py-24 lg:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 xl:gap-16">
            <div className="flex flex-col gap-4 lg:col-span-6 xl:col-span-7">
              <div className="web-skeleton h-3 w-52 rounded-full" />
              <div className="web-skeleton h-10 w-3/4 rounded-lg" />
              <div className="web-skeleton mt-3 h-20 w-full rounded" />
              <div className="web-skeleton h-16 w-full rounded" />
              <div className="mt-6 grid grid-cols-1 gap-6 border-t border-line pt-7 sm:grid-cols-3">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="flex flex-col gap-2.5">
                    <div className="web-skeleton size-8.5 rounded-lg" />
                    <div className="web-skeleton h-4 w-4/5 rounded" />
                    <div className="web-skeleton h-10 w-full rounded" />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:col-span-6 xl:col-span-5">
              <div className="web-skeleton aspect-[16/11] w-full rounded-2xl sm:aspect-[4/3]" />
              <div className="grid grid-cols-3 gap-4 border-t border-line-soft pt-3">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <div className="web-skeleton h-8 w-14 rounded" />
                    <div className="web-skeleton h-3 w-20 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Footprint: reserves the chart column, which is the tallest thing on
          the page that depends on a query resolving. */}
      <div className="border-t border-line bg-surface-0 py-20 sm:py-24 lg:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 xl:gap-16">
            <div className="lg:col-span-7">
              <div className="web-skeleton h-[380px] w-full rounded-2xl sm:h-[420px]" />
            </div>
            <div className="flex flex-col gap-4 lg:col-span-5">
              <div className="web-skeleton h-3 w-44 rounded-full" />
              <div className="web-skeleton h-10 w-4/5 rounded-lg" />
              <div className="web-skeleton h-16 w-full rounded" />
              <div className="mt-4 flex flex-col gap-3 border-y border-line py-4">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="web-skeleton h-10 w-full rounded" />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
