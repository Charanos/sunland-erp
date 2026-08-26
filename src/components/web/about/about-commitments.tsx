import Image from "next/image";
import { ABOUT_COMMITMENTS } from "@/components/web/constants/about.content";
import { WEB_ICON_STROKE, webIcons } from "@/components/web/icons";
import { Container } from "@/components/web/primitives/container";
import {
  PortfolioDial,
  type DialSlice,
} from "@/components/web/primitives/portfolio-dial";

/**
 * 02 — the four commitments.
 *
 * Cinematic dark band featuring the /images/insights-hero-right.jpg background
 * photography with exact hero layered scrims (left-lateral mask).
 * Icons positioned on the right of each commitment row for optimal editorial balance.
 * Mounts the comprehensive executive PortfolioDial card on the sticky right column.
 *
 * Mobile: single column — section header + dial card first, commitment rows below.
 * lg+: two-column layout, commitment rows left, sticky dial card right.
 */

const COMMITMENT_DELIVERABLES: Record<string, string> = {
  "Honest figures": "Realized comparable sales & zero inflated promises.",
  "One accountable person": "Dedicated property manager direct phone & WhatsApp line.",
  "Money you can trace": "Dedicated client escrow account & real-time portal audit ledger.",
  "Tenants treated properly": "Zero finder fees for tenants & 24hr maintenance dispatch.",
};

/**
 * Presentation defaults for the portfolio ring.
 *
 * Deliberate, and deliberately temporary. The public site ships ahead of the
 * read API, and a demo that renders an empty ring communicates less than one
 * that shows the shape the product takes. Live counts overrule these the moment
 * `getCategoryCounts()` returns anything.
 *
 * TODO(api): delete this constant once the listings read API lands. At that
 * point an empty response should hide the ring rather than fall back, matching
 * the contract `getHomeAggregates()` already sets for the home hero, where
 * "0 properties listed" is judged a worse claim than no claim.
 */
const DEFAULT_PORTFOLIO_SLICES: DialSlice[] = [
  {
    label: "Villas and houses",
    href: "/properties/villas",
    count: 45,
    icon: "house",
    color: "#0f766e",
  },
  {
    label: "Apartments",
    href: "/properties/apartments",
    count: 24,
    icon: "building",
    color: "#0ea5e9",
  },
  {
    label: "Commercial",
    href: "/properties/commercial",
    count: 19,
    icon: "briefcase",
    color: "#6366f1",
  },
  {
    label: "Land and plots",
    href: "/properties/land",
    count: 19,
    icon: "pin",
    color: "#8b5cf6",
  },
];

export function AboutCommitments({
  portfolioSlices,
}: {
  /** Live counts. Overrules the presentation defaults when non-empty. */
  portfolioSlices?: DialSlice[];
}) {
  const CheckIcon = webIcons.check;

  const slices =
    portfolioSlices && portfolioSlices.length > 0 ? portfolioSlices : DEFAULT_PORTFOLIO_SLICES;

  return (
    <section
      aria-labelledby="commitments-heading"
      className="web-dark relative overflow-hidden bg-brand-deep py-20 sm:py-24 lg:py-28 border-t border-line"
    >
      {/* ── Background Photography & Layered Scrims (Left-Masked Hero Scrim) ── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-brand-deep">
        <Image
          src="/images/insights-hero-right.jpg"
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          quality={90}
          className="object-cover object-center opacity-80"
        />
        {/* Top Fade */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent via-35% to-transparent"
        />
        {/* Left Lateral Mask for maximum text readability */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 via-55% to-transparent"
        />
        {/* Bottom Dusk Transition to next section */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-deep/30 to-brand-dark"
        />
      </div>

      <Container className="relative z-10">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-6">

          {/* ── Right Column (DOM: first on mobile for logical reading order) ── */}
          {/* On mobile: renders first so user reads heading + dial before the list */}
          {/* On lg+: sticky column on the right */}
          <div className="lg:col-span-6 lg:order-2 lg:sticky lg:top-28 lg:max-w-[560px] lg:ml-auto">
            <div data-reveal data-reveal-x="24">
              <div className="mb-3 flex items-center gap-2">
                <span aria-hidden="true" className="h-px w-5 bg-brand-yellow" />
                <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                  {ABOUT_COMMITMENTS.eyebrow}
                </p>
              </div>

              <h2
                id="commitments-heading"
                className="font-editorial text-[2rem] font-medium leading-[1.1] tracking-tight text-white drop-shadow-md sm:text-4xl lg:text-[40px]"
              >
                {ABOUT_COMMITMENTS.title}
              </h2>

              <p className="mt-4 max-w-[44ch] text-web-sm leading-relaxed text-slate-300 font-normal sm:mt-5 sm:text-web-sm">
                These are the terms every mandate is held to, whether the
                property is one unit or forty.
              </p>

              {/* ── Comprehensive Executive Portfolio Dial ── */}
              <div className="mt-6 sm:mt-8">
                <PortfolioDial
                  slices={slices}
                  totalLabel="LISTED"
                  showStatusRail={true}
                  showCoverageHubs={true}
                  showSlaFooter={true}
                />
              </div>
            </div>
          </div>

          {/* ── Left Column: Commitment Rows ── */}
          {/* On mobile: renders below the dial card */}
          {/* On lg+: left column, order-1 */}
          <div className="lg:col-span-6 lg:order-1">
            <ol data-reveal-group className="divide-y divide-white/12 border-y border-white/12">
              {ABOUT_COMMITMENTS.cards.map((card) => {
                const IconComponent = webIcons[card.icon];
                const deliverable = COMMITMENT_DELIVERABLES[card.title];

                return (
                  <li
                    key={card.number}
                    className="group py-5 sm:py-7 transition-colors duration-300"
                  >
                    {/* Header row: title + icon badge */}
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-editorial text-[19px] font-medium leading-tight text-white transition-colors sm:text-[22px]">
                        {card.title}
                      </h3>
                      <span
                        aria-hidden="true"
                        className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 border border-white/15 text-white backdrop-blur-md shadow-md transition-all duration-300 group-hover:scale-105 group-hover:bg-white group-hover:text-ink-900 group-hover:shadow-lg mt-0.5"
                      >
                        <IconComponent size={16} stroke={WEB_ICON_STROKE} />
                      </span>
                    </div>

                    {/* Body copy — full width, no truncation */}
                    <p className="mt-2 text-web-xs leading-relaxed text-slate-300 font-normal sm:text-web-sm">
                      {card.body}
                    </p>

                    {/* Deliverable Checkpoint — wraps freely on small screens */}
                    {deliverable && (
                      <div className="mt-3 flex items-start gap-2 font-mono text-web-micro text-slate-300 font-normal pt-2 border-t border-white/10">
                        <span className="flex size-3.5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5">
                          <CheckIcon size={10} stroke={2.5} />
                        </span>
                        <span className="leading-relaxed">{deliverable}</span>
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>

        </div>
      </Container>
    </section>
  );
}
