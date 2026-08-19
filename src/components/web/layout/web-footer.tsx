import Link from "next/link";
import { FOOTER_NAV, LEGAL_NAV, SITE } from "../constants/site";
import { Container } from "../primitives/container";
import { NewsletterForm } from "./newsletter-form";
import { WEB_ICON_STROKE, webIcons } from "../icons";

/**
 * The site footer.
 *
 * Production-grade dark footer seamlessly bleeding from HomeCta.
 * Features 4 navigation columns, physical office directory, glassmorphic newsletter signup, and regulatory credentials.
 */
export function WebFooter() {
  const PinIcon = webIcons.pin;
  const PhoneIcon = webIcons.phone;
  const MailIcon = webIcons.chat;

  return (
    <footer className="relative overflow-hidden bg-[#090d1f] text-white border-t border-white/[0.08]">
      {/* Ambient Lighting Bridge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-48 left-1/3 size-[600px] rounded-full bg-blue-600/[0.06] blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-10 size-[400px] rounded-full bg-brand-yellow/[0.03] blur-[120px]"
      />

      <Container className="relative z-10 py-16 lg:py-20">
        {/* Navigation & Directory Grid */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {FOOTER_NAV.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-yellow">
                {column.title}
              </h2>
              <ul className="mt-5 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-[14px] text-slate-300/85 transition-colors duration-200 hover:text-white hover:translate-x-0.5 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Physical Office Column */}
          <div>
            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-yellow">
              Office
            </h2>
            <address className="mt-5 flex items-start gap-2 text-[13.5px] not-italic leading-relaxed text-slate-300/85">
              <PinIcon size={14} stroke={WEB_ICON_STROKE} className="text-brand-yellow shrink-0 mt-1" />
              <span>
                {SITE.addressLine} {SITE.postalAddress}
              </span>
            </address>
            <div className="mt-5 flex flex-col gap-2.5">
              <a
                href={SITE.phoneHref}
                className="flex items-center gap-2 font-mono text-[13px] text-white transition-colors hover:text-brand-yellow"
              >
                <PhoneIcon size={13} stroke={WEB_ICON_STROKE} className="text-brand-yellow" />
                {SITE.phone}
              </a>
              <a
                href={SITE.emailHref}
                className="flex items-center gap-2 font-mono text-[13px] text-white transition-colors hover:text-brand-yellow"
              >
                <MailIcon size={13} stroke={WEB_ICON_STROKE} className="text-brand-yellow" />
                {SITE.email}
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter Signup Row */}
        <div className="mt-16 rounded-[22px] border border-white/10 bg-white/[0.03] p-7 sm:p-9 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <p className="font-editorial text-2xl sm:text-[26px] font-medium text-white">
                New listings, once a month
              </p>
              <p className="web-subtitle mt-1.5 text-sm text-slate-300/80 max-w-[50ch]">
                Direct to your inbox before they reach external portals. One click to unsubscribe, zero spam.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom Legal & Regulatory Bar */}
        <div className="mt-14 flex flex-col gap-4 border-t border-white/[0.08] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-slate-400">
            © {new Date().getFullYear()} Sunland Real Estates Limited. {SITE.tagline}
          </p>
          <ul className="flex flex-wrap gap-6">
            {LEGAL_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-mono text-xs text-slate-400 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      {/* Cinematic Grand Watermark Typography (Awwwards-grade luxury background watermark) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 inset-x-0 overflow-hidden select-none text-center z-0 translate-y-[18%]"
      >
        <span className="block font-editorial text-[clamp(5rem,18vw,16rem)] font-light uppercase tracking-[0.18em] leading-none text-white/[0.04] bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-transparent bg-clip-text">
          SUNLAND
        </span>
      </div>
    </footer>
  );
}
