import Link from "next/link";
import { WEB_ICON_STROKE, webIcons } from "../icons";
import { SectionBand } from "../primitives/section-band";
import { serviceDefaults } from "./home.defaults";
import { SectionHeading } from "./section-heading";

/**
 * 07 home.services, tint band.
 *
 * Visual service feature panels with institutional metrics, bespoke typography, and micro-interactions.
 */
export function HomeServices() {
  const ArrowIcon = webIcons.arrow;

  return (
    <SectionBand tone="tint" labelledBy="services-heading" className="relative bg-[#f8fafc]">
      <SectionHeading
        id="services-heading"
        eyebrow={serviceDefaults.eyebrow}
        title={serviceDefaults.headline}
        lead="Specialized real estate mandates managed with operational precision, verified local market intelligence, and institutional accountability."
        align="stack"
      />

      <ul data-reveal-group className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
        {serviceDefaults.cards.map((card) => {
          const IconComponent = webIcons[card.icon];

          return (
            <li key={card.href} className="flex h-full">
              <Link
                href={card.href}
                className="group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[24px] border border-slate-200/90 bg-white p-7 sm:p-8 shadow-[0_10px_30px_rgba(21,25,54,0.04),0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-[0_24px_50px_rgba(21,25,54,0.1),0_4px_12px_rgba(0,0,0,0.03)]"
              >
                {/* Top Row: Numeral & Category Tag + Uncarded Floating Icon */}
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-brand-yellow">
                        {card.num}
                      </span>
                      <span className="rounded-full bg-slate-100/90 px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-slate-500">
                        {card.tag}
                      </span>
                    </div>

                    <span
                      aria-hidden="true"
                      className="text-slate-400 transition-all duration-300 group-hover:scale-110 group-hover:text-[#151936]"
                    >
                      <IconComponent size={24} stroke={WEB_ICON_STROKE} />
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-editorial mt-6 text-2xl font-medium leading-[1.2] text-[#151936] transition-colors group-hover:text-blue-700">
                    {card.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-500 font-normal">
                    {card.body}
                  </p>
                </div>

                {/* Bottom Section: Metric Badge + Interactive Action Row */}
                <div className="mt-8">
                  {/* Highlight Metric Pill */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 px-3.5 py-2.5 transition-colors group-hover:bg-blue-50/50 group-hover:border-blue-100/80">
                    <span className="font-mono text-[11px] font-medium text-slate-700">
                      {card.highlight}
                    </span>
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                  </div>

                  {/* Footer Row */}
                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[#151936]">
                      Explore Mandate
                    </span>
                    <div className="flex size-7.5 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition-all duration-300 group-hover:translate-x-1 group-hover:border-[#151936] group-hover:bg-[#151936] group-hover:text-white shadow-xs">
                      <ArrowIcon size={14} stroke={2} aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </SectionBand>
  );
}
