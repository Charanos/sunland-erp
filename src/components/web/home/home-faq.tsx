import { WEB_ICON_STROKE, webIcons } from "../icons";
import { WebButtonLink } from "../primitives/button";
import { SectionBand } from "../primitives/section-band";
import { faqDefaults } from "./home.defaults";
import { SectionHeading } from "./section-heading";

/**
 * 10 home.faq, light band.
 *
 * Not in web doc 04. Added in the design pass, and it does real work: these
 * are the six questions the office answers on the phone every week, and
 * answering them here is the difference between a call that starts at
 * "what do you charge" and one that starts at "I would like to view it".
 *
 * Built on native `<details>` and `<summary>`. No accordion library, no
 * JavaScript, no `aria-expanded` to keep in sync by hand: the browser gives
 * us keyboard operation, correct semantics and open state for free, and it
 * works before hydration. This is a server component for exactly that reason.
 *
 * The tone is a prop rather than a constant. Tint is never decorative here:
 * it appears only to separate two sections that would otherwise touch white
 * to white. With the insights band above rendering (tint), this band is
 * light; with insights hidden, which is its state until posts exist, this
 * band takes the tint so the proof band above it still has an edge.
 *
 * TODO(W5-3): emit FAQPage structured data from this content once the SEO
 * wave lands, so the answers can surface in results and AI citations.
 */
export function HomeFaq({ tone = "light" }: { tone?: "light" | "tint" }) {
  const PlusIcon = webIcons.plus;

  return (
    <SectionBand tone={tone} labelledBy="faq-heading">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <div>
          <SectionHeading
            id="faq-heading"
            eyebrow={faqDefaults.eyebrow}
            title={faqDefaults.headline}
            lead={faqDefaults.lead}
            align="stack"
          />
          <WebButtonLink href={faqDefaults.cta.href} variant="outline" size="md" className="mt-8">
            {faqDefaults.cta.label}
          </WebButtonLink>
        </div>

        <div>
          {faqDefaults.items.map((item) => (
            <details
              key={item.question}
              name="home-faq"
              className="group border-t border-line last:border-b"
            >
              <summary className="web-hit flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left [&::-webkit-details-marker]:hidden">
                <span className="web-title-card text-xl text-ink-900">{item.question}</span>
                <PlusIcon
                  size={20}
                  stroke={WEB_ICON_STROKE}
                  aria-hidden="true"
                  className="shrink-0 text-ink-400 transition-transform duration-200 group-open:rotate-45"
                />
              </summary>
              <p className="web-prose pb-6 text-ink-500">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </SectionBand>
  );
}
