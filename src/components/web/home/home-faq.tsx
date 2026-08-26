import Link from "next/link";
import { SITE } from "../constants/site";
import { WEB_ICON_STROKE, webIcons } from "../icons";
import { SectionBand } from "../primitives/section-band";
import { Eyebrow } from "../primitives/eyebrow";
import { faqDefaults } from "./home.defaults";

/**
 * 10 home.faq, light band.
 *
 * Production-grade FAQ featuring:
 * 1. Executive Advisory Concierge Card on the left with response telemetry and bg-tertiary-gradient CTA.
 * 2. Luxury individual card-based accordion items on the right with category pills and smooth morphing controls.
 */
export function HomeFaq({ tone = "light" }: { tone?: "light" | "tint" }) {
  const PlusIcon = webIcons.plus;
  const ChatIcon = webIcons.chat;
  const ArrowIcon = webIcons.arrow;
  const PhoneIcon = webIcons.phone;

  return (
    <SectionBand tone={tone} labelledBy="faq-heading" className="relative bg-white py-20 sm:py-24 lg:py-28">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16 xl:gap-20 items-start">
        {/* Left Column: Heading & Advisory Concierge Card */}
        <div className="lg:sticky lg:top-32" data-reveal>
          <Eyebrow tone="light">{faqDefaults.eyebrow}</Eyebrow>
          <h2
            id="faq-heading"
            className="mt-4 font-editorial text-[clamp(2.5rem,4vw,3.75rem)] font-medium leading-[1.08] tracking-tight text-ink-900"
          >
            {faqDefaults.headline}
          </h2>
          <p className="web-subtitle mt-4 text-web-sm sm:text-base leading-relaxed text-slate-500 max-w-[42ch]">
            {faqDefaults.lead}
          </p>

          {/* Elevated Advisory Concierge Card */}
          <div className="mt-8 sm:mt-10 rounded-[24px] border border-line-strong bg-gradient-to-b from-surface-0 via-surface-0 to-slate-50/80 p-6 sm:p-7 shadow-[0_12px_32px_rgba(21,25,54,0.06)] backdrop-blur-xs">
            <div className="flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-brand-dark text-white shadow-xs">
                <ChatIcon size={20} stroke={WEB_ICON_STROKE} />
              </span>
              <div>
                <p className="font-editorial text-[21px] font-medium leading-tight text-ink-900">
                  Have a specific question?
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse motion-reduce:animate-none" />
                  <p className="font-mono text-xs text-slate-500">
                    Average response time: &lt; 2 hours
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Contact Line */}
            <div className="mt-5 pt-4 border-t border-line flex items-center justify-between font-mono text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <PhoneIcon size={12} stroke={WEB_ICON_STROKE} />
                <span>Direct Line:</span>
              </span>
              <a
                href={SITE.phoneHref}
                className="font-medium text-ink-900 hover:underline"
              >
                {SITE.phone}
              </a>
            </div>

            <div className="mt-5">
              <Link
                href={faqDefaults.cta.href}
                className="group w-full inline-flex items-center justify-center gap-2 rounded-full bg-tertiary-gradient text-white px-6 py-3.5 font-mono text-web-micro uppercase tracking-[0.14em] font-medium shadow-md hover:opacity-95 transition-all cursor-pointer"
              >
                <span>{faqDefaults.cta.label}</span>
                <ArrowIcon
                  size={12}
                  stroke={WEB_ICON_STROKE}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Luxury Carded Accordion Stack */}
        <div className="space-y-3.5" data-reveal-group>
          {faqDefaults.items.map((item) => (
            <details
              key={item.question}
              name="home-faq"
              className="group rounded-[20px] border border-line bg-surface-0 p-5 sm:p-6 shadow-2xs transition-all duration-300 hover:border-slate-300 hover:shadow-xs open:border-slate-300 open:bg-surface-0 open:shadow-xs"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left [&::-webkit-details-marker]:hidden">
                <div className="min-w-0 flex-1">
                  <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-0.5 font-mono text-web-nano font-medium uppercase tracking-[0.14em] text-slate-500 mb-2">
                    {item.category}
                  </span>
                  <h3 className="font-editorial text-[20px] sm:text-[22px] font-medium leading-snug text-ink-900 transition-colors duration-200 group-hover:text-blue-900">
                    {item.question}
                  </h3>
                </div>

                {/* Tactile Morphing Toggle Button */}
                <span
                  aria-hidden="true"
                  className="flex size-8.5 shrink-0 items-center justify-center rounded-full border border-line bg-surface-1 text-slate-500 transition-all duration-300 group-hover:border-ink-900 group-hover:bg-brand-dark group-hover:text-white group-open:rotate-45 group-open:border-ink-900 group-open:bg-brand-dark group-open:text-white shadow-xs"
                >
                  <PlusIcon size={15} stroke={WEB_ICON_STROKE} />
                </span>
              </summary>

              <div className="overflow-hidden mt-3.5 border-t border-line/70 pt-3.5">
                <p className="pr-4 sm:pr-8 text-web-sm sm:text-web-sm leading-relaxed text-slate-600 font-normal">
                  {item.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </SectionBand>
  );
}
