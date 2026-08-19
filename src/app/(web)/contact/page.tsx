import type { Metadata } from "next";
import Link from "next/link";
import {
  CONTACT_CHANNELS,
  CONTACT_FORM,
  CONTACT_HERO,
  CONTACT_ROUTER_CARDS,
  CONTACT_ROUTING,
} from "@/components/web/constants/contact.content";
import { ContactForm } from "@/components/web/forms/contact-form";
import { WEB_ICON_STROKE, webIcons } from "@/components/web/icons";
import { Breadcrumbs } from "@/components/web/primitives/breadcrumbs";
import { Container } from "@/components/web/primitives/container";
import { Eyebrow } from "@/components/web/primitives/eyebrow";
import { SectionBand } from "@/components/web/primitives/section-band";

export const metadata: Metadata = {
  title: "Contact Sunland Real Estates, Nairobi",
  description: CONTACT_HERO.lead,
};

/**
 * Contact.
 *
 * Four channels that all work, a routing table that names the person, and a
 * form whose first question is who you are so the enquiry reaches the right
 * desk. The old site's contact block listed a Twitter icon pointing at "#",
 * which is the specific failure this page corrects: a contact method that
 * does not work costs the visitor their attempt.
 */
export default function ContactPage() {
  const ArrowIcon = webIcons.arrow;

  return (
    <>
      <section
        aria-labelledby="contact-heading"
        className="web-dark px-5 pb-18 pt-8 sm:px-8 lg:px-14"
      >
        <div className="mx-auto w-full max-w-[1320px]">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Contact" }]}
            className="mb-9"
          />
          <Eyebrow tone="dark">{CONTACT_HERO.eyebrow}</Eyebrow>
          <h1
            id="contact-heading"
            className="web-title mt-5 max-w-[18em] text-[clamp(2.25rem,1.5rem+3.4vw,3.5rem)] leading-[1.06] tracking-[-0.015em] text-on-dark-hi"
          >
            {CONTACT_HERO.headline}
          </h1>
          <p className="web-subtitle mt-5 max-w-[56ch] text-web-lead text-on-dark">
            {CONTACT_HERO.lead}
          </p>
        </div>
      </section>

      <main className="bg-surface-0 pb-24 pt-18">
        <Container>
          <div className="grid gap-14 lg:grid-cols-2 lg:items-start">
            <div>
              <h2 className="sr-only">How to reach us</h2>

              <ul className="grid gap-4 sm:grid-cols-2">
                {CONTACT_CHANNELS.map((channel) => {
                  const IconComponent = webIcons[channel.icon];

                  const inner = (
                    <>
                      <div className="mb-3.5 flex items-center gap-2.5">
                        <IconComponent
                          size={18}
                          stroke={WEB_ICON_STROKE}
                          aria-hidden="true"
                          className="text-ink-900"
                        />
                        <p className="web-numeric text-[10.5px] uppercase tracking-[0.16em] text-ink-400">
                          {channel.label}
                        </p>
                      </div>
                      <p
                        className={
                          channel.mono
                            ? "web-numeric text-[19px] tracking-[-0.01em] text-ink-900"
                            : "text-[15px] leading-relaxed text-ink-900"
                        }
                      >
                        {channel.value}
                      </p>
                      <p
                        className={
                          channel.mono
                            ? "mt-1.5 text-[13.5px] text-ink-500"
                            : "web-numeric mt-1.5 text-[13px] text-ink-500"
                        }
                      >
                        {channel.note}
                      </p>
                    </>
                  );

                  return (
                    <li key={channel.label}>
                      {channel.href ? (
                        <a
                          href={channel.href}
                          {...(channel.external
                            ? { target: "_blank", rel: "noreferrer" }
                            : {})}
                          className="block h-full rounded-web-card border border-line p-6 transition-colors hover:border-ink-900"
                        >
                          {inner}
                        </a>
                      ) : (
                        <div className="h-full rounded-web-card border border-line p-6">
                          {inner}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>

              <section aria-labelledby="routing-heading" className="mt-10">
                <h2
                  id="routing-heading"
                  className="web-control text-[11px] uppercase tracking-[0.2em] text-ink-400"
                >
                  {CONTACT_ROUTING.title}
                </h2>
                <dl className="mt-5">
                  {CONTACT_ROUTING.rows.map((row) => (
                    <div
                      key={row.subject}
                      className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-line-soft py-4 last:border-b"
                    >
                      <dt className="min-w-[160px] text-[15.5px] text-ink-900">{row.subject}</dt>
                      <dd className="text-[14.5px] text-ink-500">{row.person}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            </div>

            <div className="rounded-web-panel border border-line p-8 shadow-web-md">
              <h2 className="web-title text-[26px] leading-tight text-ink-900">
                {CONTACT_FORM.title}
              </h2>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-400">
                {CONTACT_FORM.lead}
              </p>
              <div className="mt-7">
                <ContactForm />
              </div>
            </div>
          </div>
        </Container>
      </main>

      <SectionBand tone="tint" labelledBy="contact-router-heading">
        <h2 id="contact-router-heading" className="sr-only">
          Common next steps
        </h2>
        <ul className="grid gap-5 md:grid-cols-3">
          {CONTACT_ROUTER_CARDS.map((card) => (
            <li key={card.href}>
              <Link
                href={card.href}
                className="group flex h-full flex-col rounded-web-card border border-line bg-surface-0 p-7 transition-colors hover:border-ink-900"
              >
                <p className="web-control text-[11px] uppercase tracking-[0.16em] text-ink-400">
                  {card.audience}
                </p>
                <p className="web-title-card mt-3 text-[22px] leading-tight text-ink-900">
                  {card.title}
                </p>
                <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-ink-500">
                  {card.body}
                </p>
                <ArrowIcon
                  size={16}
                  stroke={WEB_ICON_STROKE}
                  aria-hidden="true"
                  className="mt-5 text-ink-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-ink-900"
                />
              </Link>
            </li>
          ))}
        </ul>
      </SectionBand>
    </>
  );
}
