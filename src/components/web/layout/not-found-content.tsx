import { SITE } from "../constants/site";
import { WebButtonLink } from "../primitives/button";
import { Container } from "../primitives/container";

/**
 * The 404 body, shared by the `(web)` route group's not-found and the root
 * one.
 *
 * Two boundaries need it. `(web)/not-found.tsx` catches a `notFound()` thrown
 * inside a marketing page, such as a listing slug that resolves to nothing.
 * The root `not-found.tsx` catches a URL that matches no route at all, which
 * is what a dead backlink from the old WordPress site produces. Both should
 * look like the same website, so the content lives in one place.
 *
 * Plain, not cute. Someone who followed a broken link from a search result
 * does not want a joke, they want the three places they were probably
 * heading, and a phone number.
 */
export function NotFoundContent() {
  return (
    <Container className="flex min-h-[60vh] flex-col justify-center py-24">
      <p className="web-eyebrow text-ink-400">Error 404</p>
      <h1 className="web-title mt-4 max-w-[14em] text-web-h1 text-ink-900">
        That page is not here.
      </h1>
      <p className="web-prose mt-5 text-ink-500">
        The link may be out of date, or the listing may have been let or sold. Everything currently
        on the market is on the properties page.
      </p>

      <div className="mt-10 flex flex-wrap gap-4">
        <WebButtonLink href="/properties" variant="secondary" size="lg">
          Browse properties
        </WebButtonLink>
        <WebButtonLink href="/landlords" variant="outline" size="lg">
          For owners
        </WebButtonLink>
        <WebButtonLink href="/contact" variant="outline" size="lg">
          Contact us
        </WebButtonLink>
      </div>

      <p className="mt-10 text-sm text-ink-400">
        Or call{" "}
        <a
          href={SITE.phoneHref}
          className="web-numeric text-ink-900 underline-offset-4 hover:underline"
        >
          {SITE.phone}
        </a>
        . {SITE.officeHours}
      </p>
    </Container>
  );
}
