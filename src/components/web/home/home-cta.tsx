import Image from "next/image";
import { WebButtonLink } from "../primitives/button";
import { Container } from "../primitives/container";
import { Eyebrow } from "../primitives/eyebrow";
import { ctaDefaults } from "./home.defaults";

/**
 * 11 home.cta, cinematic dark closing band.
 *
 * Interconnected with the hero background (horizontally mirrored) and bleeding seamlessly into the footer.
 * Features grand editorial headline, primary actions, and an oversized brand emblem.
 */
export function HomeCta() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="relative overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28 text-center bg-[#090d1f] text-white"
    >
      {/* Horizontally Flipped Cinematic Hero Background */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/images/hero-home.jpg"
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          quality={100}
          className="object-cover object-center scale-x-[-1] opacity-35"
        />

        {/* Atmospheric Scrims & Smooth Section Transitions */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-transparent via-[#090d1f]/75 to-[#090d1f]/95"
        />
        {/* Bottom dissolve — scrim flows into black so it bleeds seamlessly into the footer below */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-black"
        />
        <div
          aria-hidden="true"
          className="absolute -top-32 left-1/2 -translate-x-1/2 size-[650px] rounded-full bg-blue-600/10 blur-[120px]"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 right-1/4 size-[450px] rounded-full bg-brand-yellow/5 blur-[100px]"
        />
      </div>

      {/* data-reveal here is safe: this Container holds only the heading,
          lead and buttons. The scrims and glows above are siblings on the
          section itself, outside this element, so nothing that hides the
          hero-to-footer seam ever moves. */}
      <Container className="relative z-10" data-reveal>
        <div className="flex justify-center">
          <Eyebrow tone="dark">NEXT STEPS</Eyebrow>
        </div>

        <h2
          id="cta-heading"
          className="mt-4 font-editorial text-[clamp(2.5rem,5vw,4.5rem)] font-medium leading-[1.06] tracking-tight text-white drop-shadow-md max-w-[14em] mx-auto"
        >
          {ctaDefaults.headline}
        </h2>

        <p className="web-subtitle mx-auto mt-5 max-w-[48ch] text-base sm:text-lg leading-relaxed text-slate-300">
          {ctaDefaults.lead}
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <WebButtonLink
            href={ctaDefaults.primaryCta.href}
            variant="primary"
            size="lg"
            className="shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            {ctaDefaults.primaryCta.label}
          </WebButtonLink>
          <WebButtonLink
            href={ctaDefaults.secondaryCta.href}
            variant="ghostDark"
            size="lg"
            className="border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/15 hover:border-white/40 shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            {ctaDefaults.secondaryCta.label}
          </WebButtonLink>
        </div>
      </Container>
    </section>
  );
}
