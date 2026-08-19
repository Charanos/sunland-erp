import { WEB_ICON_STROKE, webIcons } from "../icons";
import { BandArtwork } from "../primitives/band-artwork";
import { WebButtonLink } from "../primitives/button";
import { Container } from "../primitives/container";
import { Eyebrow } from "../primitives/eyebrow";
import { landlordDefaults } from "./home.defaults";

/**
 * 05 home.landlords, dark band on flat brand dark.
 *
 * The highest-value section on the site and the one the current site lacks
 * entirely. A property owner landing on sunland.co.ke today sees a tenant
 * facing catalogue and nothing addressed to them, despite being the audience
 * that produces mandates, which produce recurring management fees.
 *
 * Flat brand dark, not the tertiary gradient. The statement panel has to read
 * as a screenshot of a real system, and a gradient behind it undermines
 * exactly the argument the band exists to make. This is also where the page
 * spends its most valuable yellow: "Request a valuation".
 *
 * The reference set pins live system readouts over a clean architectural
 * render in the hero. We move it here instead. Ours is not a rendering with
 * invented metrics, it is the statement a real owner logs in to see, and
 * putting a dashboard in front of a tenant who wants a two bedroom in
 * Kileleshwa spends the fold on the lower value audience.
 */
export function HomeLandlords() {
  const PhoneIcon = webIcons.phone;
  const { statement } = landlordDefaults;

  return (
    <section
      aria-labelledby="landlords-heading"
      className="web-dark relative overflow-hidden py-24 lg:py-32"
    >
      <BandArtwork icon="chart" position="right" />

      <Container className="relative">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div>
            <Eyebrow tone="dark">{landlordDefaults.eyebrow}</Eyebrow>
            <h2 id="landlords-heading" className="web-title mt-4 text-web-h2 text-on-dark-hi">
              {landlordDefaults.headline}
            </h2>
            <p className="web-subtitle mt-5 max-w-[62ch] text-web-lead text-on-dark">
              {landlordDefaults.lead}
            </p>

            <ol className="mt-10">
              {landlordDefaults.steps.map((step) => (
                <li
                  key={step.number}
                  className="flex gap-5 border-t border-dark-line py-5 last:border-b"
                >
                  <span className="web-numeric shrink-0 text-sm text-brand-yellow">
                    {step.number}
                  </span>
                  <div>
                    <p className="web-title-card text-xl text-on-dark-hi">{step.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-on-dark">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-9 flex flex-wrap gap-4">
              <WebButtonLink href={landlordDefaults.primaryCta.href} variant="primary" size="lg">
                {landlordDefaults.primaryCta.label}
              </WebButtonLink>
              <WebButtonLink
                href={landlordDefaults.secondaryCta.href}
                variant="ghostDark"
                size="lg"
              >
                {landlordDefaults.secondaryCta.label}
              </WebButtonLink>
            </div>
          </div>

          <div>
            {/* The raised glass panel only reads as a system on a dark ground,
                which is the reason this band returns to dark at position five. */}
            <div className="rounded-web-panel border border-dark-line bg-dark-raise p-5 shadow-web-lg backdrop-blur-md sm:p-7">
              <div className="flex items-center justify-between border-b border-dark-line pb-4">
                <span className="web-title-light text-xl tracking-[0.04em] text-on-dark-hi">
                  Sunland
                </span>
                <span className="web-control text-[10px] uppercase tracking-[0.14em] text-on-dark-lo">
                  {statement.portalLabel}
                </span>
              </div>

              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <p className="web-title-card text-lg text-on-dark-hi">{statement.title}</p>
                  <p className="web-subtitle mt-0.5 text-[13px] text-on-dark-lo">
                    {statement.subtitle}
                  </p>
                </div>
                <span className="web-control rounded-web-full bg-positive-bg px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--color-positive-fg)]">
                  {statement.badge}
                </span>
              </div>

              <dl className="mt-6">
                {statement.rows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-baseline justify-between gap-4 border-t border-dark-line py-3"
                  >
                    <dt className="text-sm text-on-dark">{row.label}</dt>
                    <dd className="web-numeric text-sm text-on-dark-hi">{row.value}</dd>
                  </div>
                ))}
                <div className="flex items-baseline justify-between gap-4 border-t border-dark-line pt-4">
                  <dt className="web-subtitle text-sm text-on-dark-hi">{statement.total.label}</dt>
                  <dd className="web-numeric text-xl text-on-dark-hi">{statement.total.value}</dd>
                </div>
              </dl>

              <div className="mt-6 flex items-center gap-3 rounded-web-card border border-dark-line bg-dark-raise p-3">
                <span
                  aria-hidden="true"
                  className="web-numeric flex size-10 shrink-0 items-center justify-center rounded-web-full bg-dark-raise-hi text-[13px] text-on-dark-hi"
                >
                  {statement.manager.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="web-subtitle truncate text-[13px] text-on-dark-hi">
                    {statement.manager.name}
                  </p>
                  <p className="web-numeric text-[13px] text-on-dark-lo">
                    {statement.manager.phone}
                  </p>
                </div>
                <span className="web-control inline-flex shrink-0 items-center gap-1.5 rounded-web-full border border-dark-line px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-on-dark-hi">
                  <PhoneIcon size={14} stroke={WEB_ICON_STROKE} aria-hidden="true" />
                  Call
                </span>
              </div>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-on-dark-lo">{statement.caption}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
