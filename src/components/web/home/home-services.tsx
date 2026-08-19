import Link from "next/link";
import { WEB_ICON_STROKE, webIcons } from "../icons";
import { SectionBand } from "../primitives/section-band";
import { serviceDefaults } from "./home.defaults";
import { SectionHeading } from "./section-heading";

/**
 * 07 home.services, tint band.
 *
 * For the visitor who arrived for one thing and needs another: someone
 * looking for a two bedroom who also owns a flat they are tired of managing.
 *
 * The icon sits in a yellow tint circle at 16%. That is a tint, not a fill,
 * and does not count against the one-yellow-element rule: it carries no text,
 * it is not competing for the eye, and it is one of the four permitted uses
 * of yellow on a light ground.
 */
export function HomeServices() {
  const ArrowIcon = webIcons.arrow;

  return (
    <SectionBand tone="tint" labelledBy="services-heading">
      <SectionHeading
        id="services-heading"
        eyebrow={serviceDefaults.eyebrow}
        title={serviceDefaults.headline}
        align="stack"
      />

      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {serviceDefaults.cards.map((card) => {
          const IconComponent = webIcons[card.icon];

          return (
            <li key={card.href}>
              <Link
                href={card.href}
                className="group flex h-full flex-col rounded-web-card border border-line bg-surface-0 p-6 transition-all duration-200 hover:-translate-y-[3px] hover:border-line-strong hover:shadow-web-md"
              >
                <span
                  aria-hidden="true"
                  className="inline-flex size-12 items-center justify-center rounded-web-full bg-brand-yellow/16 text-ink-900"
                >
                  <IconComponent size={24} stroke={WEB_ICON_STROKE} />
                </span>

                <h3 className="web-title-card mt-6 text-web-h3 text-ink-900">{card.title}</h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-ink-500">{card.body}</p>

                <span className="web-control mt-6 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-ink-900">
                  Learn more
                  <ArrowIcon
                    size={16}
                    stroke={WEB_ICON_STROKE}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </SectionBand>
  );
}
