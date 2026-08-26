import Link from "next/link";
import { WEB_ICON_STROKE, webIcons } from "../icons";
import { SectionBand } from "../primitives/section-band";
import { WebBadge } from "../primitives/badge";
import { serviceDefaults } from "./home.defaults";

/**
 * 07 home.services, open architectural directory band.
 *
 * Open 4-column directory architecture with hairline dividers, primitive design tokens,
 * high-contrast monospace numbering, and interactive micro-interactions.
 */
export function HomeServices() {
  const ArrowIcon = webIcons.arrow;

  return (
    <SectionBand
      tone="light"
      labelledBy="services-heading"
      className="relative bg-surface-0 border-t border-line py-20 lg:py-28"
    >
      {/* Centered Editorial Header */}
      <div className="mx-auto max-w-2xl text-center pb-14 sm:pb-16" data-reveal>
        <div className="flex items-center justify-center gap-3 mb-4">
          <span aria-hidden="true" className="h-px w-8 bg-brand-yellow" />
          <p className="font-mono text-web-micro uppercase tracking-[0.22em] text-ink-900 font-medium">
            {serviceDefaults.eyebrow}
          </p>
          <span aria-hidden="true" className="h-px w-8 bg-brand-yellow" />
        </div>

        <h2
          id="services-heading"
          className="font-editorial text-[clamp(2.25rem,3.8vw,3.5rem)] font-medium leading-[1.08] tracking-tight text-ink-900 text-balance"
        >
          {serviceDefaults.headline}
        </h2>

        <p className="mt-4 text-web-sm sm:text-web-body leading-relaxed text-ink-500 font-normal max-w-[52ch] mx-auto">
          Specialized real estate mandates managed with operational precision, verified local market intelligence, and institutional accountability.
        </p>
      </div>

      {/* Open 4-Column Architectural Directory Grid */}
      <div className="border-y border-line grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-line">
        {serviceDefaults.cards.map((card) => {
          const IconComponent = webIcons[card.icon];

          return (
            <Link
              key={card.href}
              href={card.href}
              className="group relative flex flex-col justify-between p-8 sm:p-9 lg:p-10 transition-colors duration-300 hover:bg-surface-1/60"
            >
              {/* Subtle Top Border Hover Accent */}
              <span
                aria-hidden="true"
                className="absolute top-0 inset-x-0 h-[2px] bg-ink-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
              />

              {/* Top Meta Row: Monospace Numeral + Minimalist Glyph */}
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-line-soft">
                  <span className="font-mono text-2xl sm:text-3xl font-light text-ink-300 group-hover:text-ink-900 transition-colors duration-300">
                    {card.num}
                  </span>

                  <IconComponent
                    size={22}
                    stroke={WEB_ICON_STROKE}
                    aria-hidden="true"
                    className="text-ink-400 group-hover:text-ink-900 group-hover:scale-110 transition-all duration-300"
                  />
                </div>

                {/* Category Primitive Badge */}
                <div className="mt-8">
                  <WebBadge tone="neutral" className="border border-line-soft font-mono font-medium text-web-nano tracking-[0.14em]">
                    {card.tag}
                  </WebBadge>
                </div>

                {/* Main Title (Clean sans-serif as per typography rules) */}
                <h3 className="mt-3.5 text-[20px] sm:text-[21px] font-medium tracking-tight text-ink-900 leading-[1.25] group-hover:text-ink-950 transition-colors">
                  {card.title}
                </h3>

                {/* Narrative Description */}
                <p className="mt-3 text-web-xs sm:text-web-sm leading-relaxed text-ink-500 font-normal">
                  {card.body}
                </p>
              </div>

              {/* Bottom Highlight & Action Trigger */}
              <div className="mt-10 pt-6 border-t border-line-soft space-y-4">
                <div className="inline-flex items-center gap-2 py-1 px-2.5 rounded-full bg-emerald-500/8 border border-emerald-500/20 text-emerald-800 text-web-nano font-mono font-medium">
                  <span className="size-1.5 rounded-full bg-emerald-600 shrink-0 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                  <span>{card.highlight}</span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="font-mono text-web-micro font-semibold uppercase tracking-[0.14em] text-ink-900 group-hover:text-ink-950 transition-colors">
                    Explore Mandate
                  </span>
                  <div className="flex size-7.5 items-center justify-center rounded-full border border-line bg-surface-0 text-ink-700 group-hover:bg-ink-900 group-hover:text-white group-hover:border-ink-900 group-hover:translate-x-1 transition-all duration-300 shadow-2xs">
                    <ArrowIcon
                      size={14}
                      stroke={WEB_ICON_STROKE}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </SectionBand>
  );
}
