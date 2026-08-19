import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import {
  SERVICE_SECTIONS,
  SERVICES_HERO,
  SERVICES_ROUTER,
  type ServiceSection,
} from "@/components/web/constants/services.content";
import { WEB_ICON_STROKE, webIcons } from "@/components/web/icons";
import { WebButtonLink } from "@/components/web/primitives/button";
import { Breadcrumbs } from "@/components/web/primitives/breadcrumbs";
import { Container } from "@/components/web/primitives/container";
import { Eyebrow } from "@/components/web/primitives/eyebrow";
import { SectionBand } from "@/components/web/primitives/section-band";

export const metadata: Metadata = {
  title: "Our services: management, sales, letting, valuation",
  description: SERVICES_HERO.lead,
};

export const revalidate = 3600;

/**
 * Services.
 *
 * One page with four anchored sections, per the design. The alternating
 * light and tint bands with the media panel swapping sides give the eye a
 * rhythm down a long page, and each section is self-contained enough to be
 * linked to directly from the header, the footer and the hero jump nav.
 */
export default function ServicesPage() {
  const ArrowIcon = webIcons.arrow;

  return (
    <>
      <section
        aria-labelledby="services-heading"
        className="web-dark px-5 pb-24 pt-8 sm:px-8 lg:px-14"
      >
        <div className="mx-auto w-full max-w-[1320px]">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Services" }]}
            className="mb-10"
          />

          <div className="grid gap-14 lg:grid-cols-2 lg:items-end">
            <div>
              <Eyebrow tone="dark">{SERVICES_HERO.eyebrow}</Eyebrow>
              <h1
                id="services-heading"
                className="web-title mt-5 max-w-[16em] text-[clamp(2.5rem,1.5rem+4.4vw,4rem)] leading-[1.05] tracking-[-0.015em] text-on-dark-hi"
              >
                {SERVICES_HERO.headline}
              </h1>
              <p className="web-subtitle mt-6 max-w-[54ch] text-web-lead text-on-dark">
                {SERVICES_HERO.lead}
              </p>
            </div>

            {/* In-page jump nav. On a page this long it is the table of
                contents, and it doubles as the mobile summary of what is
                below the fold. */}
            <nav aria-label="Services" className="border-t border-dark-line">
              {SERVICES_HERO.jumpLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="web-hit flex items-center justify-between gap-4 border-b border-dark-line py-4.5 text-base text-on-dark-hi transition-colors hover:text-brand-yellow"
                >
                  {link.label}
                  <ArrowIcon
                    size={18}
                    stroke={WEB_ICON_STROKE}
                    aria-hidden="true"
                    className="shrink-0 text-brand-yellow"
                  />
                </a>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {SERVICE_SECTIONS.map((section) => (
        <ServiceBand key={section.id} section={section} />
      ))}

      <SectionBand tone="light" labelledBy="router-heading">
        <div className="mb-10 max-w-[600px]">
          <Eyebrow>{SERVICES_ROUTER.eyebrow}</Eyebrow>
          <h2 id="router-heading" className="web-title mt-4 text-web-h2 text-ink-900">
            {SERVICES_ROUTER.title}
          </h2>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES_ROUTER.cards.map((card) => {
            const IconComponent = webIcons[card.icon];

            return (
              <li key={card.href}>
                <Link
                  href={card.href}
                  className="group flex h-full flex-col rounded-web-card border border-line p-7 transition-all duration-200 hover:-translate-y-[3px] hover:border-line-strong hover:shadow-web-md"
                >
                  <IconComponent
                    size={22}
                    stroke={WEB_ICON_STROKE}
                    aria-hidden="true"
                    className="text-ink-400 transition-colors group-hover:text-ink-900"
                  />
                  <p className="web-control mt-5 text-[11px] uppercase tracking-[0.16em] text-ink-400">
                    {card.audience}
                  </p>
                  <p className="web-title-card mt-3 text-[22px] leading-tight text-ink-900">
                    {card.title}
                  </p>
                  <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-ink-500">
                    {card.body}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </SectionBand>
    </>
  );
}

/**
 * One service section.
 *
 * The media panel alternates sides down the page. It is ordered after the
 * prose in the DOM regardless, so the reading and tab order stay
 * content-first and the visual swap is a `lg:order` concern only.
 */
function ServiceBand({ section }: { section: ServiceSection }) {
  const CheckIcon = webIcons.check;
  const headingId = `${section.id}-heading`;

  return (
    <section
      id={section.id}
      aria-labelledby={headingId}
      className={cn(
        "py-24 lg:py-28",
        section.tone === "tint" ? "bg-surface-1" : "bg-surface-0",
        // Anchored sections need clearance under the sticky header, or the
        // heading lands behind it when someone follows a jump link.
        "scroll-mt-20"
      )}
    >
      <Container>
        <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
          <div className={cn(section.mediaSide === "left" && "lg:order-2")}>
            <p className="web-numeric text-[12.5px] text-ink-900">{section.number}</p>
            <h2 id={headingId} className="web-title mt-4 text-web-h2 text-ink-900">
              {section.title}
            </h2>

            {section.body.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="web-prose mt-5 max-w-[64ch] text-ink-500">
                {paragraph}
              </p>
            ))}

            {section.points && (
              <ul className="mt-8 grid gap-x-8 sm:grid-cols-2">
                {section.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-3 border-b border-line-soft py-3 text-[14.5px] text-ink-500"
                  >
                    <CheckIcon
                      size={15}
                      stroke={WEB_ICON_STROKE}
                      aria-hidden="true"
                      className="shrink-0 text-ink-900 opacity-55"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            )}

            {section.rows && (
              <dl className="mt-8 max-w-[52ch] overflow-hidden rounded-web-card border border-line">
                {section.rows.map((row, index) => (
                  <div
                    key={row.label}
                    className={cn(
                      "flex items-baseline justify-between gap-4 px-5 py-4",
                      index > 0 && "border-t border-line-soft",
                      row.emphasis && "bg-surface-1"
                    )}
                  >
                    <dt
                      className={cn(
                        "text-[14.5px]",
                        row.emphasis ? "text-ink-900" : "text-ink-500"
                      )}
                    >
                      {row.label}
                    </dt>
                    <dd
                      className={cn(
                        "web-numeric text-sm",
                        row.emphasis ? "text-ink-900" : "text-ink-500"
                      )}
                    >
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              {section.ctas.map((cta) => (
                <WebButtonLink
                  key={cta.href}
                  href={cta.href}
                  variant={cta.variant}
                  size="md"
                  {...(cta.variant === "outline"
                    ? { icon: "arrow" as const, iconTrailing: true }
                    : {})}
                >
                  {cta.label}
                </WebButtonLink>
              ))}
            </div>
          </div>

          <div className={cn(section.mediaSide === "left" && "lg:order-1")}>
            <ServiceMedia label={section.mediaLabel} />

            {section.figures && (
              <dl className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-web-card border border-line bg-line">
                {section.figures.map((figure) => (
                  <div key={figure.label} className="bg-surface-0 p-5">
                    <dd className="web-numeric text-[22px] tracking-[-0.02em] text-ink-900">
                      {figure.value}
                    </dd>
                    <dt className="web-control mt-1 text-[11px] uppercase tracking-[0.14em] text-ink-400">
                      {figure.label}
                    </dt>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * The media panel.
 *
 * The design places a photograph here. We do not have photography of our own
 * for these sections yet, and the rule established for listings applies with
 * more force on a services page: stock imagery of buildings we do not manage,
 * used to illustrate managing buildings, is a claim we cannot support. So the
 * branded panel stands in, with the intended subject in its label.
 *
 * TODO(W2-3): replace with commissioned photography once the shoot lands.
 * Each panel's `label` is the brief.
 */
function ServiceMedia({ label }: { label: string }) {
  return (
    <div
      role="img"
      aria-label={`Photography pending: ${label}`}
      className="flex aspect-[4/3] items-center justify-center rounded-web-panel bg-surface-2"
    >
      <span aria-hidden="true" className="web-title-light text-[80px] leading-none text-brand-dark/18">
        S
      </span>
    </div>
  );
}
