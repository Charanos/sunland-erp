import { SITE } from "../constants/site";
import { BandArtwork } from "../primitives/band-artwork";
import { WebButtonLink } from "../primitives/button";
import { Container } from "../primitives/container";
import { ctaDefaults } from "./home.defaults";

/**
 * 11 home.cta, dark band on the tertiary ground.
 *
 * Closes on the same kind of ground it opened on, which is what makes the
 * page feel bound rather than trailing off. One decision, split by audience:
 * owners left, tenants right.
 *
 * The tertiary gradient carries the depth so the yellow does not have to
 * shout to be the only one in view. Exactly one yellow element here, the
 * primary button, and the secondary is a ghost.
 */
export function HomeCta() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="web-tertiary relative overflow-hidden py-28 text-center lg:py-36"
    >
      <BandArtwork icon="house" position="right" />

      <Container className="relative">
        <h2 id="cta-heading" className="web-title mx-auto max-w-[14em] text-web-h1 text-on-dark-hi">
          {ctaDefaults.headline}
        </h2>
        <p className="web-subtitle mx-auto mt-5 max-w-[46ch] text-web-lead text-on-dark">
          {ctaDefaults.lead}
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <WebButtonLink href={ctaDefaults.primaryCta.href} variant="primary" size="lg">
            {ctaDefaults.primaryCta.label}
          </WebButtonLink>
          <WebButtonLink href={ctaDefaults.secondaryCta.href} variant="ghostDark" size="lg">
            {ctaDefaults.secondaryCta.label}
          </WebButtonLink>
        </div>

        <p className="mt-10 text-sm text-on-dark-lo">
          Or call{" "}
          <a
            href={SITE.phoneHref}
            className="web-numeric text-on-dark-hi underline-offset-4 hover:underline"
          >
            {SITE.phone}
          </a>
          . {SITE.officeHours}
        </p>
      </Container>
    </section>
  );
}
