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
import { Eyebrow } from "@/components/web/primitives/eyebrow";

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

      <section id="valuation" aria-labelledby="valuation-heading" className="bg-surface-1 py-24 lg:py-28">
        <Container>
          <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
            <div>
              <Eyebrow>{LANDLORDS.valuation.eyebrow}</Eyebrow>
              <h2 id="valuation-heading" className="web-title mt-4 text-web-h2 text-ink-900">
                {LANDLORDS.valuation.title}
              </h2>
              <p className="web-subtitle mt-5 max-w-[56ch] text-web-lead text-ink-500">
                {LANDLORDS.valuation.lead}
              </p>

              <ol className="mt-8 max-w-[52ch]">
                {LANDLORDS.valuation.steps.map((step, index) => (
                  <li key={step} className="flex gap-3.5 border-t border-line py-3.5 last:border-b">
                    <span
                      aria-hidden="true"
                      className="web-numeric pt-0.5 text-[12.5px] text-ink-400"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[14.5px] leading-relaxed text-ink-500">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <InlineValuationForm />
          </div>
        </Container>
      </section>
    </>
  );
}
