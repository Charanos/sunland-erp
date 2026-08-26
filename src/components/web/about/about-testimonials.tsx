import { ABOUT_TESTIMONIALS } from "@/components/web/constants/about.content";
import { WEB_ICON_STROKE, webIcons } from "@/components/web/icons";
import { Container } from "@/components/web/primitives/container";

/**
 * 04 — two real testimonials.
 *
 * Dark ground, centred eyebrow. Open blockquotes with a vertical rule divider.
 * Clean layout without bottom footnote.
 */
export function AboutTestimonials() {
  const QuoteIcon = webIcons.quote;

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="web-dark relative overflow-hidden bg-gradient-to-b from-brand-dark via-brand-mid to-brand-deep py-20 sm:py-24 lg:py-28"
    >
      <Container>
        <h2 id="testimonials-heading" className="sr-only">
          What clients say
        </h2>

        <div data-reveal className="flex items-center justify-center gap-3">
          <span aria-hidden="true" className="h-px w-6 bg-brand-yellow" />
          <p className="font-mono text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
            {ABOUT_TESTIMONIALS.eyebrow}
          </p>
          <span aria-hidden="true" className="h-px w-6 bg-brand-yellow" />
        </div>

        <ul
          data-reveal-group
          className="mt-12 grid gap-12 lg:mt-14 lg:grid-cols-2 lg:gap-0 lg:divide-x lg:divide-white/10"
        >
          {ABOUT_TESTIMONIALS.items.map((item, idx) => (
            <li
              key={item.name}
              className={idx === 0 ? "lg:pr-12 xl:pr-16" : "lg:pl-12 xl:pl-16"}
            >
              <figure className="flex h-full flex-col justify-between">
                <div>
                  <QuoteIcon
                    size={24}
                    stroke={WEB_ICON_STROKE}
                    aria-hidden="true"
                    className="shrink-0 text-brand-yellow"
                  />

                  <blockquote className="mt-5 font-editorial text-[24px] font-medium leading-[1.38] text-white sm:text-[27px] lg:text-[29px]">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                </div>

                <figcaption className="mt-8 border-t border-white/12 pt-4 font-mono text-web-micro uppercase tracking-[0.16em] text-slate-400">
                  <span aria-hidden="true" className="mr-2">
                    &mdash;
                  </span>
                  <span className="font-medium text-slate-200">{item.name}</span>
                  <span className="mx-1.5 text-slate-500">·</span>
                  <span>{item.role}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
