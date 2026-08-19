import { WEB_ICON_STROKE, webIcons } from "../icons";
import { WebButtonLink } from "../primitives/button";
import { SectionBand } from "../primitives/section-band";
import { Eyebrow } from "../primitives/eyebrow";
import { faqDefaults } from "./home.defaults";

/**
 * 10 home.faq, light band.
 *
 * Production-grade FAQ with numeral-free editorial accordion and refined advisory concierge.
 */
export function HomeFaq({ tone = "light" }: { tone?: "light" | "tint" }) {
  const PlusIcon = webIcons.plus;
  const ChatIcon = webIcons.chat;

  return (
    <SectionBand tone={tone} labelledBy="faq-heading" className="relative bg-white py-20 lg:py-28">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-20 items-start">
        {/* Left Column: Heading & Advisory Concierge Card */}
        <div className="lg:sticky lg:top-32">
          <Eyebrow tone="light">{faqDefaults.eyebrow}</Eyebrow>
          <h2
            id="faq-heading"
            className="mt-4 font-editorial text-[clamp(2.5rem,4vw,3.75rem)] font-medium leading-[1.08] tracking-tight text-[#151936]"
          >
            {faqDefaults.headline}
          </h2>
          <p className="web-subtitle mt-4 text-[15px] sm:text-base leading-relaxed text-slate-500 max-w-[42ch]">
            {faqDefaults.lead}
          </p>

          {/* Elevated Advisory Concierge Card */}
          <div className="mt-10 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-6 sm:p-7 shadow-[0_4px_20px_rgba(21,25,54,0.03)] backdrop-blur-xs">
            <div className="flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-yellow/15 border border-brand-yellow/30 text-[#151936] shadow-xs">
                <ChatIcon size={20} stroke={WEB_ICON_STROKE} />
              </span>
              <div>
                <p className="font-editorial text-[21px] font-medium leading-tight text-[#151936]">
                  Have a specific question?
                </p>
                <p className="font-mono text-xs text-slate-500 mt-1">
                  Average response time: &lt; 2 hours
                </p>
              </div>
            </div>

            <div className="mt-6">
              <WebButtonLink
                href={faqDefaults.cta.href}
                variant="primary"
                size="md"
                icon="arrow"
                iconTrailing
                className="w-full shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {faqDefaults.cta.label}
              </WebButtonLink>
            </div>
          </div>
        </div>

        {/* Right Column: Refined Numeral-Free Accordion Panels */}
        <div className="border-t border-slate-200/90">
          {faqDefaults.items.map((item) => (
            <details
              key={item.question}
              name="home-faq"
              className="group border-b border-slate-200/90 transition-colors duration-200"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 sm:py-7 text-left [&::-webkit-details-marker]:hidden">
                <div className="min-w-0 flex-1">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-[0.14em] text-slate-500 mb-2">
                    {item.category}
                  </span>
                  <h3 className="font-editorial text-[21px] sm:text-[25px] font-medium leading-snug text-[#151936] transition-colors duration-200 group-hover:text-blue-700">
                    {item.question}
                  </h3>
                </div>

                {/* Tactile Morphing Toggle Button */}
                <span
                  aria-hidden="true"
                  className="flex size-9 shrink-0 items-center justify-center rounded-full border border-slate-200/80 bg-slate-50 text-slate-500 transition-all duration-300 group-hover:border-[#151936] group-hover:bg-[#151936] group-hover:text-white group-open:rotate-45 group-open:border-[#151936] group-open:bg-[#151936] group-open:text-white shadow-xs"
                >
                  <PlusIcon size={16} stroke={WEB_ICON_STROKE} />
                </span>
              </summary>

              <div className="overflow-hidden">
                <p className="pb-8 pr-6 sm:pr-14 text-[15px] sm:text-[15.5px] leading-relaxed text-slate-600 font-normal">
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
