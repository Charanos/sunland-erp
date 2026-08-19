import type { Metadata } from "next";
import Link from "next/link";
import {
  ABOUT_COMMITMENTS,
  ABOUT_HERO,
  ABOUT_STORY,
  ABOUT_TEAM,
  ABOUT_TESTIMONIALS,
  ABOUT_VISIT,
} from "@/components/web/constants/about.content";
import { SITE } from "@/components/web/constants/site";
import { WEB_ICON_STROKE, webIcons } from "@/components/web/icons";
import { Breadcrumbs } from "@/components/web/primitives/breadcrumbs";
import { WebButtonLink } from "@/components/web/primitives/button";
import { Container } from "@/components/web/primitives/container";
import { Eyebrow } from "@/components/web/primitives/eyebrow";
import { SectionBand } from "@/components/web/primitives/section-band";

export const metadata: Metadata = {
  title: "About Sunland Real Estates, and the people who run it",
  description: ABOUT_HERO.lead,
};

export const revalidate = 3600;

/**
 * About.
 *
 * No stock handshakes and no founding myth. The argument is that this is a
 * management business rather than a transaction shop, and every section
 * supports it: what we do, the four commitments, the three people who will
 * answer, two real testimonials, and the address.
 *
 * The team lives here as `#team` rather than on its own page. Three people
 * and a hiring card is a section, not a page, and splitting it would cost
 * this page its most human moment to produce a thin one next door.
 */
export default function AboutPage() {
  const ArrowIcon = webIcons.arrow;
  const QuoteIcon = webIcons.quote;
  const MailIcon = webIcons.mail;
  const PhoneIcon = webIcons.phone;

  return (
    <>
      <section
        aria-labelledby="about-heading"
        className="web-dark px-5 pb-20 pt-8 sm:px-8 lg:px-14"
      >
        <div className="mx-auto w-full max-w-[1320px]">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "About" }]}
            className="mb-10"
          />
          <Eyebrow tone="dark">{ABOUT_HERO.eyebrow}</Eyebrow>
          <h1
            id="about-heading"
            className="web-title mt-5 max-w-[20em] text-[clamp(2.25rem,1.5rem+3.4vw,3.5rem)] leading-[1.06] tracking-[-0.015em] text-on-dark-hi"
          >
            {ABOUT_HERO.headline}
          </h1>
          <p className="web-subtitle mt-6 max-w-[58ch] text-web-lead text-on-dark">
            {ABOUT_HERO.lead}
          </p>
        </div>
      </section>

      <SectionBand tone="light" labelledBy="story-heading">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 id="story-heading" className="web-title text-web-h2 text-ink-900">
              {ABOUT_STORY.title}
            </h2>
            {ABOUT_STORY.paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="web-prose mt-5 max-w-[66ch] leading-[1.75] text-ink-500"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="grid gap-4">
            <BrandPanel label={ABOUT_STORY.mediaLabel} ratio="aspect-[10/7]" />
            <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-web-card border border-line bg-line">
              {ABOUT_STORY.figures.map((figure) => (
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
          </div>
        </div>
      </SectionBand>

      <SectionBand tone="tint" labelledBy="commitments-heading">
        <div className="mb-11 max-w-[560px]">
          <Eyebrow>{ABOUT_COMMITMENTS.eyebrow}</Eyebrow>
          <h2 id="commitments-heading" className="web-title mt-4 text-web-h2 text-ink-900">
            {ABOUT_COMMITMENTS.title}
          </h2>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ABOUT_COMMITMENTS.cards.map((card) => {
            const IconComponent = webIcons[card.icon];
            return (
              <li
                key={card.number}
                className="rounded-web-card border border-line bg-surface-0 p-7"
              >
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
                <h3 className="web-title-card text-[21px] leading-tight text-ink-900">
                  {card.title}
                </h3>
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-500">{card.body}</p>
              </li>
            );
          })}
        </ul>
      </SectionBand>

      {/* Anchored: the header, footer and sitemap all link /about#team. */}
      <section
        id="team"
        aria-labelledby="team-heading"
        className="scroll-mt-20 bg-surface-0 py-24 lg:py-28"
      >
        <Container>
          <div className="mb-11 max-w-[600px]">
            <Eyebrow>{ABOUT_TEAM.eyebrow}</Eyebrow>
            <h2 id="team-heading" className="web-title mt-4 text-web-h2 text-ink-900">
              {ABOUT_TEAM.title}
            </h2>
            <p className="web-subtitle mt-4 text-web-lead text-ink-500">{ABOUT_TEAM.lead}</p>
          </div>

          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ABOUT_TEAM.members.map((member) => (
              <li key={member.name} className="overflow-hidden rounded-web-card border border-line">
                <div
                  role="img"
                  aria-label={`Portrait pending: ${member.name}, ${member.role}`}
                  className="flex aspect-[4/5] items-center justify-center bg-surface-2"
                >
                  <span
                    aria-hidden="true"
                    className="web-numeric text-4xl tracking-[0.06em] text-brand-dark/25"
                  >
                    {member.initials}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="web-title-card text-[22px] text-ink-900">{member.name}</h3>
                  <p className="web-control mt-1 text-[11px] uppercase tracking-[0.16em] text-ink-400">
                    {member.role}
                  </p>
                  <p className="mt-3.5 text-[14.5px] leading-relaxed text-ink-500">{member.bio}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {member.contacts.includes("email") && (
                      <a
                        href={SITE.emailHref}
                        className="web-hit inline-flex items-center gap-1.5 rounded-web-full border border-line-strong px-3.5 py-1.5 text-[13px] text-ink-900 transition-colors hover:border-ink-900"
                      >
                        <MailIcon size={14} stroke={WEB_ICON_STROKE} aria-hidden="true" />
                        Email
                      </a>
                    )}
                    {member.contacts.includes("call") && (
                      <a
                        href={SITE.phoneHref}
                        className="web-hit inline-flex items-center gap-1.5 rounded-web-full border border-line-strong px-3.5 py-1.5 text-[13px] text-ink-900 transition-colors hover:border-ink-900"
                      >
                        <PhoneIcon size={14} stroke={WEB_ICON_STROKE} aria-hidden="true" />
                        Call
                      </a>
                    )}
                  </div>
                </div>
              </li>
            ))}

            {/* The hiring card. Dashed border so it reads as an invitation
                rather than as a fourth person. */}
            <li className="flex flex-col justify-center gap-3.5 rounded-web-card border border-dashed border-line-strong bg-surface-1 p-7">
              <h3 className="web-title-card text-[22px] leading-tight text-ink-900">
                {ABOUT_TEAM.hiring.title}
              </h3>
              <p className="text-[14.5px] leading-relaxed text-ink-500">{ABOUT_TEAM.hiring.body}</p>
              <Link
                href={ABOUT_TEAM.hiring.cta.href}
                className="web-hit inline-flex items-center gap-2 self-start rounded-web-full border border-line-strong bg-surface-0 px-5 py-2 text-sm text-ink-900 transition-colors hover:border-ink-900"
              >
                {ABOUT_TEAM.hiring.cta.label}
                <ArrowIcon size={16} stroke={WEB_ICON_STROKE} aria-hidden="true" />
              </Link>
            </li>
          </ul>
        </Container>
      </section>

      <section aria-labelledby="testimonials-heading" className="web-dark py-24 lg:py-28">
        <Container>
          <h2 id="testimonials-heading" className="sr-only">
            What clients say
          </h2>
          <Eyebrow tone="dark" className="mb-10">
            {ABOUT_TESTIMONIALS.eyebrow}
          </Eyebrow>

          <ul className="grid gap-8 lg:grid-cols-2">
            {ABOUT_TESTIMONIALS.items.map((item) => (
              <li key={item.name}>
                <figure className="h-full rounded-web-panel border border-dark-line bg-dark-raise p-8">
                  <QuoteIcon
                    size={26}
                    stroke={WEB_ICON_STROKE}
                    aria-hidden="true"
                    className="text-brand-yellow"
                  />
                  <blockquote className="web-title-light mt-4.5 text-[22px] leading-[1.4] text-on-dark-hi">
                    {item.quote}
                  </blockquote>
                  <figcaption className="mt-5 text-sm text-on-dark-lo">
                    <span className="text-on-dark-hi">{item.name}</span> · {item.role}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-[13px] text-on-dark-lo">{ABOUT_TESTIMONIALS.note}</p>
        </Container>
      </section>

      <SectionBand tone="light" labelledBy="visit-heading">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 id="visit-heading" className="web-title text-web-h2 text-ink-900">
              {ABOUT_VISIT.title}
            </h2>
            <p className="web-prose mt-4 max-w-[56ch] leading-[1.75] text-ink-500">
              {SITE.addressLine} {SITE.postalAddress} Open {SITE.officeHours.toLowerCase()}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {ABOUT_VISIT.ctas.map((cta) => (
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

          <BrandPanel label={ABOUT_VISIT.mediaLabel} ratio="aspect-[3/2]" />
        </div>
      </SectionBand>
    </>
  );
}

/**
 * Stand-in for photography we have not commissioned yet.
 *
 * The label carries the intended subject, so it doubles as the brief for the
 * shoot and as a real accessible name in the meantime.
 *
 * TODO(W2-4): replace with commissioned photography.
 */
function BrandPanel({ label, ratio }: { label: string; ratio: string }) {
  return (
    <div
      role="img"
      aria-label={`Photography pending: ${label}`}
      className={`flex ${ratio} items-center justify-center rounded-web-panel bg-surface-2`}
    >
      <span
        aria-hidden="true"
        className="web-title-light text-[80px] leading-none text-brand-dark/18"
      >
        S
      </span>
    </div>
  );
}
