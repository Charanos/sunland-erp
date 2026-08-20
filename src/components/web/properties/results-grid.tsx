import Link from "next/link";
import { ListingCard, type ListingCardData } from "../primitives/listing-card";
import { WebButtonLink } from "../primitives/button";

/**
 * The results grid, and the empty state that matters more than it does.
 *
 * Six of the eight listing card states the design draws are what the current
 * dataset actually produces, and "no results" is the one a visitor reaches by
 * doing exactly what the filters invited them to do. An empty grid with a
 * shrug is where an enquiry dies.
 */
export function ResultsGrid({ listings }: { listings: ListingCardData[] }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {listings.map((listing, index) => (
        <li key={listing.id}>
          <ListingCard
            listing={listing}
            // h2 on the index: the page h1 is the facet title, and every card
            // title is a sibling section beneath it.
            headingLevel={2}
            priority={index < 3}
          />
        </li>
      ))}
    </ul>
  );
}

/**
 * Zero results.
 *
 * Says what happened, why, and how to fix it, then offers alternatives that
 * are real result sets rather than decoration: each one relaxes the most
 * restrictive filter rather than guessing. And it offers to take the
 * requirement, because someone who searched for a four bedroom in Runda under
 * 90,000 is a lead, not a bounce.
 */
export function EmptyResults({
  alternatives,
  clearHref,
}: {
  alternatives: { label: string; href: string }[];
  clearHref: string;
}) {
  return (
    <div className="rounded-web-card border border-line bg-surface-0 p-8 sm:p-12">
      <h2 className="web-title text-web-h3 text-ink-900">Nothing matches that combination yet.</h2>
      <p className="web-prose mt-3 text-ink-500">
        We do not have anything on the books for those filters right now. Try one of these, or tell
        us what you need and we will call you when something lands.
      </p>

      {alternatives.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2">
          {alternatives.map((alternative) => (
            <li key={alternative.href}>
              <Link
                href={alternative.href}
                className="web-control web-hit inline-flex rounded-web-full border border-line px-4 py-2 text-[11.5px] tracking-[0.08em] text-ink-900 transition-colors hover:border-ink-900"
              >
                {alternative.label}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <WebButtonLink href="/contact" variant="primary" size="md">
          Tell us what you need
        </WebButtonLink>
        <WebButtonLink href={clearHref} variant="outline" size="md">
          Clear filters
        </WebButtonLink>
      </div>
    </div>
  );
}

/**
 * The closing panel on every index page.
 *
 * A visitor who scrolled the whole grid and did not enquire is telling us the
 * stock is not right. This is the one place on the index where we ask for the
 * requirement instead of waiting for a listing to earn it.
 */
export function RegisterRequirement() {
  return (
    <div className="mt-7 rounded-web-card border border-line bg-surface-0 p-8">
      <h2 className="web-title text-web-h3 text-ink-900">Nothing quite right?</h2>
      <p className="web-prose mt-3 text-ink-500">
        Tell us what you are after and your budget. We will call you when something matching lands,
        usually before it goes on the site.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <WebButtonLink href="/contact" variant="primary" size="md">
          Register your requirement
        </WebButtonLink>
        <WebButtonLink href="/contact" variant="outline" size="md" icon="arrow" iconTrailing>
          Talk to a consultant
        </WebButtonLink>
      </div>
    </div>
  );
}
