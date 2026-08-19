import { WEB_ICON_STROKE, webIcons } from "../icons";
import { SectionBand } from "../primitives/section-band";
import { proofDefaults } from "./home.defaults";
import { SectionHeading } from "./section-heading";

/**
 * 08 home.proof, light band.
 *
 * Social proof, honestly presented.
 *
 * Attributed quotes only, and no rating component exists until real ratings
 * do. The current site renders "0.0 (0)" on every listing card, which is
 * worse than showing nothing: it does not fail to provide social proof, it
 * actively advertises its absence. Deleting that is one of the reasons this
 * rebuild exists, so it does not get reintroduced here in a nicer font.
 *
 * With fewer than two testimonials this renders a single static quote with no
 * carousel controls, because controls that page between one item are a lie
 * about how much we have.
 */
export function HomeProof() {
  const quote = proofDefaults.testimonials[0];

  return (
    <SectionBand tone="light" labelledBy="proof-heading">
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            id="proof-heading"
            eyebrow={proofDefaults.eyebrow}
            title={proofDefaults.headline}
            align="stack"
          />

          {quote && (
            <figure className="mt-8">
              <blockquote className="web-title-light text-web-h3 leading-snug text-ink-900">
                {quote.quote}
              </blockquote>
              <figcaption className="web-subtitle mt-5 text-sm text-ink-900">
                {quote.name}
                <span className="font-normal text-ink-400"> · {quote.role}</span>
              </figcaption>
            </figure>
          )}
        </div>

        <ul className="flex flex-col justify-center gap-8">
          {proofDefaults.points.map((point) => {
            const IconComponent = webIcons[point.icon];

            return (
              <li key={point.title} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="inline-flex size-10 shrink-0 items-center justify-center rounded-web-full bg-surface-2 text-ink-900"
                >
                  <IconComponent size={20} stroke={WEB_ICON_STROKE} />
                </span>
                <div>
                  <p className="web-title-card text-xl text-ink-900">{point.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-500">{point.body}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </SectionBand>
  );
}
