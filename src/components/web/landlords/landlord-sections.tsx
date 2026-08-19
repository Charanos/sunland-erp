import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { LANDLORDS } from "../constants/landlords.content";
import { WEB_ICON_STROKE, webIcons } from "../icons";
import { WebButtonLink } from "../primitives/button";
import { Container } from "../primitives/container";
import { Eyebrow } from "../primitives/eyebrow";
import { SectionBand } from "../primitives/section-band";

/**
 * The landlord hub, section by section, from the Claude Design template.
 *
 * Split into named sections in one file rather than one component per file:
 * they are only ever composed in this order, on this page, and eight files
 * that each import the same three primitives is worse to read than one.
 */

/** Shared section intro: rule, eyebrow, title, optional lead. */
function SectionIntro({
  eyebrow,
  title,
  lead,
  id,
  tone = "light",
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  id: string;
  tone?: "light" | "dark";
}) {
  return (
    <div className="mb-12 max-w-[640px]">
      <Eyebrow tone={tone === "dark" ? "dark" : "light"}>{eyebrow}</Eyebrow>
      <h2
        id={id}
        className={cn(
          "web-title mt-4 text-web-h2",
          tone === "dark" ? "text-on-dark-hi" : "text-ink-900"
        )}
      >
        {title}
      </h2>
      {lead && (
        <p
          className={cn(
            "web-subtitle mt-5 text-web-lead",
            tone === "dark" ? "text-on-dark" : "text-ink-500"
          )}
        >
          {lead}
        </p>
      )}
    </div>
  );
}

// ── 01 Hero ──────────────────────────────────────────────────────────────────

/**
 * Full editorial hero, not the compact interior band.
 *
 * This page is a destination in its own right, reached from an advert or a
 * referral as often as from the nav, so it opens like a landing page rather
 * than like a section of one. The stat grid is the proof: four figures an
 * owner can check against any competitor.
 */
export function LandlordHero({ stats }: { stats?: { value: string; label: string }[] }) {
  const figures = stats ?? [...LANDLORDS.hero.stats];
  const ArrowIcon = webIcons.arrow;

  return (
    <section
      aria-labelledby="landlord-hero-heading"
      className="web-dark relative overflow-hidden px-5 py-24 sm:px-8 lg:px-14 lg:py-28"
    >
      <Image
        src="/images/hero-bg.jpg"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-20"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-brand-dark/72 to-brand-dark/94"
      />

      <div className="relative mx-auto grid w-full max-w-[1320px] gap-16 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-center">
        <div>
          <Eyebrow tone="dark">{LANDLORDS.hero.eyebrow}</Eyebrow>
          <h1
            id="landlord-hero-heading"
            className="web-title mt-5 max-w-[16em] text-[clamp(2.5rem,1.5rem+4.4vw,4rem)] leading-[1.05] tracking-[-0.015em] text-on-dark-hi"
          >
            {LANDLORDS.hero.headline}
          </h1>
          <p className="web-subtitle mt-6 max-w-[54ch] text-web-lead text-on-dark">
            {LANDLORDS.hero.lead}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <WebButtonLink href={LANDLORDS.hero.primary.href} variant="primary" size="lg">
              {LANDLORDS.hero.primary.label}
            </WebButtonLink>
            <a
              href={LANDLORDS.hero.secondary.href}
              className="web-hit inline-flex items-center gap-2 rounded-web-full border border-dark-line px-7 py-2.5 text-[15px] text-on-dark-hi transition-colors hover:bg-dark-raise"
            >
              {LANDLORDS.hero.secondary.label}
              <ArrowIcon size={16} stroke={WEB_ICON_STROKE} aria-hidden="true" />
            </a>
          </div>

          <p className="mt-7 text-sm text-on-dark-lo">{LANDLORDS.hero.reassurance}</p>
        </div>

        {/* Hairline grid: 1px gaps over a translucent background, so the cells
            read as one instrument panel rather than four floating boxes. */}
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-web-panel border border-dark-line bg-dark-line">
          {figures.map((stat) => (
            <div key={stat.label} className="bg-brand-dark/55 px-6 py-7">
              <dd className="web-numeric text-[30px] tracking-[-0.02em] text-on-dark-hi">
                {stat.value}
              </dd>
              <dt className="web-control mt-1.5 text-[11px] uppercase tracking-[0.16em] text-on-dark-lo">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

// ── 02 Promises ──────────────────────────────────────────────────────────────

export function LandlordPromises() {
  return (
    <SectionBand tone="light" labelledBy="promises-heading">
      <SectionIntro
        id="promises-heading"
        eyebrow={LANDLORDS.promises.eyebrow}
        title={LANDLORDS.promises.title}
        lead={LANDLORDS.promises.lead}
      />

      <ul className="grid gap-5 md:grid-cols-3">
        {LANDLORDS.promises.cards.map((card) => {
          const IconComponent = webIcons[card.icon];

          return (
            <li key={card.number} className="rounded-web-card border border-line p-7">
              <div className="mb-5 flex items-center justify-between gap-3">
                <span
                  aria-hidden="true"
                  className="flex size-10 items-center justify-center rounded-web-full border border-line-soft bg-surface-1 text-ink-900"
                >
                  <IconComponent size={20} stroke={WEB_ICON_STROKE} />
                </span>
                <span className="web-numeric text-[11px] tracking-[0.14em] text-ink-400">
                  {card.number}
                </span>
              </div>

              <h3 className="web-title-card text-[23px] leading-tight text-ink-900">
                {card.title}
              </h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-500">{card.body}</p>

              {/* The deliverable. A promise without one is marketing. */}
              <p className="mt-5 border-t border-line-soft pt-4 text-sm leading-relaxed text-ink-900">
                <span className="web-subtitle">What you get:</span> {card.outcome}
              </p>
            </li>
          );
        })}
      </ul>
    </SectionBand>
  );
}

// ── 03 Timeline ──────────────────────────────────────────────────────────────

export function LandlordTimeline() {
  return (
    <section id="how" aria-labelledby="timeline-heading" className="bg-surface-1 py-24 lg:py-28">
      <Container>
        <SectionIntro
          id="timeline-heading"
          eyebrow={LANDLORDS.timeline.eyebrow}
          title={LANDLORDS.timeline.title}
        />

        <ol className="overflow-hidden rounded-web-panel border border-line bg-surface-0">
          {LANDLORDS.timeline.steps.map((step) => (
            <li
              key={step.when}
              className="grid gap-2 border-t border-line-soft px-6 py-7 first:border-t-0 sm:grid-cols-[88px_minmax(0,1fr)] sm:gap-6 sm:px-8"
            >
              <span className="web-numeric text-[13px] text-ink-900">{step.when}</span>
              <div>
                <h3 className="web-subtitle text-[17px] text-ink-900">{step.title}</h3>
                <p className="mt-2 max-w-[70ch] text-[14.5px] leading-relaxed text-ink-500">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

// ── 04 Fees ──────────────────────────────────────────────────────────────────

export function LandlordFees() {
  return (
    <SectionBand tone="light" labelledBy="fees-heading">
      <SectionIntro
        id="fees-heading"
        eyebrow={LANDLORDS.fees.eyebrow}
        title={LANDLORDS.fees.title}
        lead={LANDLORDS.fees.lead}
      />

      <ul className="grid gap-5 md:grid-cols-3">
        {LANDLORDS.fees.tiers.map((tier) => (
          <li
            key={tier.name}
            className={cn(
              "relative rounded-web-panel p-8",
              tier.featured ? "border-[1.5px] border-brand-dark" : "border border-line"
            )}
          >
            {tier.badge && (
              <span className="web-control absolute -top-3 left-8 inline-flex rounded-web-full bg-brand-yellow px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-brand-dark">
                {tier.badge}
              </span>
            )}

            <h3 className="web-title-card text-2xl text-ink-900">{tier.name}</h3>
            <p className="web-subtitle mt-1.5 text-sm text-ink-400">{tier.tagline}</p>

            <p className="mt-6 flex items-baseline gap-1.5">
              <span className="web-numeric text-[34px] tracking-[-0.03em] text-ink-900">
                {tier.figure}
              </span>
              <span className="text-[15px] text-ink-500">{tier.unit}</span>
            </p>

            <ul className="mt-6 grid gap-3 border-t border-line-soft pt-5">
              {tier.includes.map((item) => (
                <li key={item} className="text-[14.5px] text-ink-500">
                  {item}
                </li>
              ))}
              {tier.excludes.map((item) => (
                <li key={item} className="text-[14.5px] text-ink-400">
                  {item}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </SectionBand>
  );
}

// ── 05 The ERP band ──────────────────────────────────────────────────────────

/**
 * The differentiator band.
 *
 * Every capability named maps to a module that exists in this repository. That
 * is the only reason it can be published: a claim about a system we have not
 * built is the fastest way to lose an owner at the first statement.
 */
export function LandlordErp() {
  const BuildingIcon = webIcons.building;
  const ArrowIcon = webIcons.arrow;

  return (
    <section
      aria-labelledby="erp-heading"
      className="web-dark relative overflow-hidden py-24 lg:py-28"
    >
      <BuildingIcon
        size={620}
        stroke={0.4}
        aria-hidden="true"
        className="pointer-events-none absolute -right-36 -top-32 text-white opacity-[0.06]"
      />

      <Container className="relative">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start lg:gap-20">
          <div>
            <SectionIntro
              id="erp-heading"
              eyebrow={LANDLORDS.erp.eyebrow}
              title={LANDLORDS.erp.title}
              lead={LANDLORDS.erp.lead}
              tone="dark"
            />

            <dl className="mb-8">
              {LANDLORDS.erp.rows.map((row) => {
                const IconComponent = webIcons[row.icon];
                return (
                  <div
                    key={row.label}
                    className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-dark-line py-4 last:border-b"
                  >
                    <dt className="inline-flex min-w-[170px] items-center gap-3 text-[15.5px] text-on-dark-hi">
                      <IconComponent
                        size={18}
                        stroke={WEB_ICON_STROKE}
                        aria-hidden="true"
                        className="text-brand-yellow"
                      />
                      {row.label}
                    </dt>
                    <dd className="text-[14.5px] text-on-dark-lo">{row.value}</dd>
                  </div>
                );
              })}
            </dl>

            <Link
              href={LANDLORDS.erp.portalLink.href}
              className="web-hit inline-flex items-center gap-2 rounded-web-full border border-dark-line px-6 py-2.5 text-[14.5px] text-on-dark-hi transition-colors hover:bg-dark-raise"
            >
              {LANDLORDS.erp.portalLink.label}
              <ArrowIcon size={16} stroke={WEB_ICON_STROKE} aria-hidden="true" />
            </Link>

            <ul className="mt-8 grid gap-px overflow-hidden rounded-web-panel border border-dark-line bg-dark-line sm:grid-cols-2 lg:grid-cols-3">
              {LANDLORDS.erp.capabilities.map((capability) => {
                const IconComponent = webIcons[capability.icon];
                return (
                  <li key={capability.title} className="bg-brand-dark/55 px-5 py-6">
                    <IconComponent
                      size={20}
                      stroke={WEB_ICON_STROKE}
                      aria-hidden="true"
                      className="text-brand-yellow"
                    />
                    <p className="web-subtitle mt-3.5 text-[14.5px] text-on-dark-hi">
                      {capability.title}
                    </p>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-on-dark-lo">
                      {capability.body}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>

          <LandlordPortfolioMock />
        </div>
      </Container>
    </section>
  );
}

/**
 * The portfolio mock.
 *
 * Illustrative, and labelled "Portfolio" rather than dressed up as this
 * visitor's own data. Marked `aria-hidden` because a screen reader reading out
 * four invented unit balances as though they were real would be actively
 * misleading; the surrounding prose already states what the portal does.
 */
function LandlordPortfolioMock() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden rounded-web-panel bg-surface-0 shadow-[0_32px_70px_rgb(0_0_0/0.42)]"
    >
      <div className="flex h-11 items-center gap-2.5 border-b border-line bg-surface-1 px-4.5">
        <span className="web-title-light text-[17px] tracking-[0.04em] text-ink-900">Sunland</span>
        <span className="web-control ml-auto text-[11px] uppercase tracking-[0.16em] text-ink-400">
          Portfolio
        </span>
      </div>

      <div className="p-6">
        <div className="mb-5 grid grid-cols-3 gap-4 border-b border-line-soft pb-5">
          {LANDLORDS.erp.dashboard.summary.map((item) => (
            <div key={item.label}>
              <p className="web-numeric text-xl tracking-[-0.02em] text-ink-900">{item.value}</p>
              <p className="web-control mt-1 text-[11px] uppercase tracking-[0.12em] text-ink-400">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        <div>
          {LANDLORDS.erp.dashboard.units.map((unit) => (
            <div
              key={unit.name}
              className="flex items-center gap-3 border-b border-line-soft py-3 last:border-b-0"
            >
              <span className="min-w-0 flex-1 truncate text-[14.5px] text-ink-900">
                {unit.name}
              </span>
              <span className="web-numeric text-[13.5px] text-ink-500">{unit.amount}</span>
              <span
                className={cn(
                  "web-numeric inline-flex shrink-0 rounded-web-full px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em]",
                  unit.state === "paid"
                    ? "bg-positive-bg text-emerald-800"
                    : "bg-warning-bg text-amber-800"
                )}
              >
                {unit.state === "paid" ? "Paid" : "Part paid"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 06 Testimonial and FAQ ───────────────────────────────────────────────────

export function LandlordProof() {
  return (
    <SectionBand tone="light" labelledBy="landlord-proof-heading">
      <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
        <figure className="max-w-[60ch]">
          <h2
            id="landlord-proof-heading"
            className="web-control text-[11px] uppercase tracking-[0.22em] text-ink-400"
          >
            {LANDLORDS.testimonial.eyebrow}
          </h2>
          <blockquote className="web-title-light mt-7 text-[clamp(1.5rem,1.2rem+1.2vw,2rem)] leading-[1.35] text-ink-900 text-pretty">
            {LANDLORDS.testimonial.quote}
          </blockquote>
          <figcaption className="mt-6 text-[14.5px] text-ink-400">
            <span className="web-subtitle text-ink-900">{LANDLORDS.testimonial.name}</span> ·{" "}
            {LANDLORDS.testimonial.role}
          </figcaption>
        </figure>

        <div className="rounded-web-panel border border-line bg-surface-1 p-8">
          <h3 className="web-control text-[11px] uppercase tracking-[0.2em] text-ink-400">
            Common questions
          </h3>
          <FaqList />
        </div>
      </div>
    </SectionBand>
  );
}

/**
 * The four common questions, on native `<details>`.
 *
 * Not the shared `FaqAccordion`: that one is styled for a full-width band with
 * a 20px title and a plus affordance, and this sits inside a tinted card at
 * 15.5px. Forcing one component to do both would mean three tone props to
 * serve two callers.
 */
function FaqList() {
  return (
    <div className="mt-5">
      {LANDLORDS.faq.map((item) => (
        <details key={item.question} name="landlord-faq" className="group border-t border-line">
          <summary className="web-hit flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[15.5px] text-ink-900 [&::-webkit-details-marker]:hidden">
            {item.question}
            <span
              aria-hidden="true"
              className="shrink-0 text-ink-400 transition-transform duration-200 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="pb-4 text-[14.5px] leading-relaxed text-ink-500">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
