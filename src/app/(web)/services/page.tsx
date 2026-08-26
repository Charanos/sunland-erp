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
import { Container } from "@/components/web/primitives/container";
import { WebBadge } from "@/components/web/primitives/badge";
import { ServicesHero } from "@/components/web/services/services-hero";
import { PropertyManagementService } from "@/components/web/services/property-management-service";
import { SalesLettingService } from "@/components/web/services/sales-letting-service";
import { ValuationService } from "@/components/web/services/valuation-service";
import { CommercialService } from "@/components/web/services/commercial-service";

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
      <ServicesHero />

      {SERVICE_SECTIONS.map((section) => {
        if (section.id === "management") {
          return <PropertyManagementService key={section.id} />;
        }
        if (section.id === "letting") {
          return <SalesLettingService key={section.id} />;
        }
        if (section.id === "valuation") {
          return <ValuationService key={section.id} />;
        }
        if (section.id === "commercial") {
          return <CommercialService key={section.id} />;
        }
        return <ServiceBand key={section.id} section={section} />;
      })}

      {/* Architectural Open Directory Router Section */}
      <section
        id="services-router"
        aria-labelledby="router-heading"
        className="border-t border-line py-24 lg:py-32 bg-surface-0"
      >
        <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12 xl:px-14">
          
          {/* Editorial Section Header: Centered */}
          <div data-reveal className="mx-auto max-w-2xl text-center pb-14 sm:pb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span aria-hidden="true" className="h-px w-8 bg-ink-900" />
              <p className="font-mono text-web-micro uppercase tracking-[0.22em] text-ink-900 font-medium">
                {SERVICES_ROUTER.eyebrow}
              </p>
              <span aria-hidden="true" className="h-px w-8 bg-ink-900" />
            </div>

            <h2
              id="router-heading"
              className="font-editorial text-[clamp(2.5rem,4.2vw,3.75rem)] font-medium leading-[1.06] tracking-tight text-ink-900 text-balance"
            >
              {SERVICES_ROUTER.title}
            </h2>

            <p className="mt-4 text-web-sm sm:text-web-body leading-relaxed text-ink-500 font-normal max-w-[50ch] mx-auto">
              {SERVICES_ROUTER.lead}
            </p>
          </div>

          {/* Open 4-Column Architectural Directory Grid.
              data-reveal-group staggers the four cards as they arrive rather
              than fading the slab whole — the row reads as dealing out, which
              is the point of a directory. */}
          <div
            data-reveal-group
            className="border-y border-line grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-line"
          >
            {SERVICES_ROUTER.cards.map((card, idx) => {
              const IconComponent = webIcons[card.icon];
              // Padded ordinal from the card's own position, so the numbering
              // cannot drift out of step with the copy the way six parallel
              // arrays did.
              const stepNumber = String(idx + 1).padStart(2, "0");

              return (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group relative flex flex-col justify-between p-8 sm:p-9 lg:p-10 transition-colors duration-300 hover:bg-surface-1/60"
                >
                  {/* Subtle Top Border Hover Accent */}
                  <span
                    aria-hidden="true"
                    className="absolute top-0 inset-x-0 h-[2px] bg-ink-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                  />

                  {/* Top Meta Row: Monospace Numeral + Minimalist Glyph */}
                  <div>
                    <div className="flex items-center justify-between pb-6 border-b border-line-soft">
                      <span className="font-mono text-2xl sm:text-3xl font-light text-ink-300 group-hover:text-ink-900 transition-colors duration-300">
                        {stepNumber}
                      </span>

                      <IconComponent
                        size={22}
                        stroke={WEB_ICON_STROKE}
                        aria-hidden="true"
                        className="text-ink-400 group-hover:text-ink-900 group-hover:scale-110 transition-all duration-300"
                      />
                    </div>

                    {/* Target Audience Primitive Badge */}
                    <div className="mt-8">
                      <WebBadge tone="neutral" className="border border-line-soft font-mono font-medium text-web-nano tracking-[0.14em]">
                        {card.audience}
                      </WebBadge>
                    </div>

                    {/* Main Title (Clean sans-serif as per typography rules) */}
                    <h3 className="mt-3.5 text-[20px] sm:text-[21px] font-medium tracking-tight text-ink-900 leading-[1.25] group-hover:text-ink-950 transition-colors">
                      {card.title}
                    </h3>

                    {/* Narrative Description */}
                    <p className="mt-3 text-web-xs sm:text-web-sm leading-relaxed text-ink-500 font-normal">
                      {card.body}
                    </p>
                  </div>

                  {/* Bottom Highlight & Action Trigger */}
                  <div className="mt-10 pt-6 border-t border-line-soft space-y-4">
                    <div className="inline-flex items-center gap-2 py-1 px-2.5 rounded-full bg-emerald-500/8 border border-emerald-500/20 text-emerald-800 text-web-nano font-mono font-medium">
                      <span className="size-1.5 rounded-full bg-emerald-600 shrink-0 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                      <span>{card.highlight}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="font-mono text-web-micro font-semibold uppercase tracking-[0.14em] text-ink-900 group-hover:text-ink-950 transition-colors">
                        {card.cta}
                      </span>
                      <div className="flex size-7.5 items-center justify-center rounded-full border border-line bg-surface-0 text-ink-700 group-hover:bg-ink-900 group-hover:text-white group-hover:border-ink-900 group-hover:translate-x-1 transition-all duration-300 shadow-2xs">
                        <ArrowIcon size={14} stroke={WEB_ICON_STROKE} aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </section>
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
            <p className="web-numeric text-web-micro text-ink-900">{section.number}</p>
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
                    className="flex items-center gap-3 border-b border-line-soft py-3 text-web-sm text-ink-500"
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
                        "text-web-sm",
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
                    <dt className="web-control mt-1 text-web-micro uppercase tracking-[0.14em] text-ink-400">
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
