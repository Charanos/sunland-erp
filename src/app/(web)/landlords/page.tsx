import type { Metadata } from "next";
import { LANDLORDS } from "@/components/web/constants/landlords.content";
import { InlineValuationForm } from "@/components/web/landlords/inline-valuation-form";
import {
  LandlordErp,
  LandlordFees,
  LandlordHero,
  LandlordPromises,
  LandlordProof,
  LandlordTimeline,
} from "@/components/web/landlords/landlord-sections";
import { Container } from "@/components/web/primitives/container";

export const metadata: Metadata = {
  title: "Property management for Nairobi landlords",
  description: LANDLORDS.hero.lead,
};

export const revalidate = 3600;

/**
 * The landlord hub.
 *
 * The largest structural addition to the site: the old WordPress installation
 * addressed property owners nowhere at all, despite owners being the audience
 * that produces mandates, and mandates being the recurring revenue.
 *
 * The page argues in one direction and ends in a form. Hero states the claim,
 * promises answer the three objections owners actually arrive with, the
 * timeline answers "when do I get paid", fees answer the question every owner
 * asks on the first call, the ERP band proves the claim with a system no
 * competitor has, and the proof band borrows someone else's credibility.
 * Then it asks, inline, at the point of highest intent.
 *
 * The valuation ask appears three times: hero, ERP band and the closing form.
 * On this page that repetition is the design, not a smell.
 */
export default function LandlordsPage() {
  return (
    <>
      <LandlordHero />
      <LandlordPromises />
      <LandlordTimeline />
      <LandlordFees />
      <LandlordErp />
      <LandlordProof />

      <section
        id="valuations"
        aria-labelledby="valuation-heading"
        className="scroll-mt-12 bg-[#f8fafc] py-24 lg:py-32 border-t border-slate-200/80 relative"
      >
        {/* Support both #valuations and #valuation anchors */}
        <div id="valuation" className="absolute -top-12 left-0 pointer-events-none" aria-hidden="true" />
        <Container>
          <div className="grid gap-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:gap-20 items-start">
            {/* Left Column: Valuation Value Proposition & Milestones */}
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span aria-hidden="true" className="h-px w-7 bg-brand-yellow shrink-0" />
                  <p className="font-mono text-web-micro uppercase tracking-[0.22em] text-slate-500 font-medium">
                    {LANDLORDS.valuation.eyebrow}
                  </p>
                </div>

                <h2 id="valuation-heading" className="font-editorial text-[clamp(2.5rem,4vw,3.75rem)] font-medium leading-[1.06] tracking-tight text-ink-900">
                  {LANDLORDS.valuation.title}
                </h2>

                <p className="mt-5 text-web-sm sm:text-base leading-relaxed text-slate-600 font-normal max-w-[50ch]">
                  {LANDLORDS.valuation.lead}
                </p>
              </div>

              {/* Deliverable Milestones - Uncarded, Hairline Divided */}
              <div className="border-t border-slate-200/90 divide-y divide-slate-200/90">
                <div className="py-4.5 flex items-start gap-4">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                    <span className="size-1.5 rounded-full bg-emerald-600" />
                  </span>
                  <div>
                    <h3 className="font-editorial text-[18.5px] font-medium text-ink-900">
                      Discovery Consultation
                    </h3>
                    <p className="text-web-sm leading-relaxed text-slate-600 font-normal mt-0.5">
                      We call within one working day to understand unit configurations, current lease status, and target yields.
                    </p>
                  </div>
                </div>

                <div className="py-4.5 flex items-start gap-4">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                    <span className="size-1.5 rounded-full bg-emerald-600" />
                  </span>
                  <div>
                    <h3 className="font-editorial text-[18.5px] font-medium text-ink-900">
                      On-Site Appraisal Walkthrough
                    </h3>
                    <p className="text-web-sm leading-relaxed text-slate-600 font-normal mt-0.5">
                      A senior consultant inspects the premises (typically 45 mins), evaluating finishes, fixtures, and tenant appeal.
                    </p>
                  </div>
                </div>

                <div className="py-4.5 flex items-start gap-4">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                    <span className="size-1.5 rounded-full bg-emerald-600" />
                  </span>
                  <div>
                    <h3 className="font-editorial text-[18.5px] font-medium text-ink-900">
                      Written Comparable Dossier
                    </h3>
                    <p className="text-web-sm leading-relaxed text-slate-600 font-normal mt-0.5">
                      Receive a definitive figure backed by recent submarket transactions and our live rental ledger comparables.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Uncarded Elegant Valuation Form */}
            <InlineValuationForm />
          </div>
        </Container>
      </section>
    </>
  );
}
