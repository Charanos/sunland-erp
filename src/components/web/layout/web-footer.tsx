import Link from "next/link";
import { FOOTER_NAV, LEGAL_NAV, SITE } from "../constants/site";
import { Container } from "../primitives/container";
import { NewsletterForm } from "./newsletter-form";

/**
 * The site footer.
 *
 * Four link columns plus an office block, the newsletter, and a base bar.
 * Every link resolves to a real page. That is not a decorative standard: the
 * current site's footer sends "Gallery" to /properties and points both Terms
 * and Privacy at "#", which is a trust and compliance gap, not a typo.
 *
 * Privacy and Terms are wired here before the pages exist. They 404 until
 * W2-5 writes them, which is visible and fixable, where a "#" is neither.
 */
export function WebFooter() {
  return (
    <footer className="web-dark border-t border-dark-line">
      <Container className="py-16 lg:py-20">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {FOOTER_NAV.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="web-control text-[10px] uppercase tracking-[0.14em] text-on-dark-lo">
                {column.title}
              </h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-on-dark transition-colors hover:text-on-dark-hi"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="web-control text-[10px] uppercase tracking-[0.14em] text-on-dark-lo">
              Office
            </h2>
            <address className="mt-4 text-sm not-italic leading-relaxed text-on-dark">
              {SITE.addressLine} {SITE.postalAddress}
            </address>
            <div className="mt-4 flex flex-col gap-1.5">
              <a
                href={SITE.phoneHref}
                className="web-numeric text-sm text-on-dark-hi transition-colors hover:text-brand-yellow"
              >
                {SITE.phone}
              </a>
              <a
                href={SITE.emailHref}
                className="web-numeric text-sm text-on-dark-hi transition-colors hover:text-brand-yellow"
              >
                {SITE.email}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-6 border-t border-dark-line pt-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="web-title-card text-xl text-on-dark-hi">New listings, once a month</p>
            <p className="web-subtitle mt-1.5 text-sm text-on-dark-lo">
              Before they reach the portals. One click to stop, and we never pass your address on.
            </p>
          </div>
          <NewsletterForm />
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-dark-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="web-numeric text-[12px] text-on-dark-lo">
            © {new Date().getFullYear()} Sunland Real Estates Limited. {SITE.tagline}
          </p>
          <ul className="flex flex-wrap gap-6">
            {LEGAL_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[13px] text-on-dark-lo transition-colors hover:text-on-dark-hi"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
