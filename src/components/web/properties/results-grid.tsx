import Link from "next/link";
import { ListingCard, type ListingCardData } from "../primitives/listing-card";
import { WebButtonLink } from "../primitives/button";
import { WEB_ICON_STROKE, webIcons } from "../icons";

/**
 * The results grid, and the empty state that matters more than it does.
 */
export function ResultsGrid({ listings }: { listings: ListingCardData[] }) {
  return (
    <ul className="grid gap-x-6 gap-y-10 sm:gap-y-12 lg:gap-x-8 lg:gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
      {listings.map((listing, index) => (
        <li key={listing.id} className="ph-reveal-card">
          <ListingCard
            listing={listing}
            headingLevel={2}
            priority={index < 3}
          />
        </li>
      ))}
    </ul>
  );
}

/**
 * Zero results state.
 */
export function EmptyResults({
  alternatives,
  clearHref,
}: {
  alternatives: { label: string; href: string }[];
  clearHref: string;
}) {
  const SearchIcon = webIcons.search;

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-slate-200/90 bg-white p-8 sm:p-12 shadow-[0_8px_30px_rgba(21,25,54,0.03)]">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-ink-900 mb-5">
        <SearchIcon size={22} stroke={WEB_ICON_STROKE} aria-hidden="true" />
      </div>

      <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-ink-900 leading-tight">
        Nothing matches that exact combination yet.
      </h2>
      
      <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-600">
        We do not have active inventory for those exact criteria right now. Try relaxing your filters, or register your specific requirement and our portfolio advisory team will notify you before new assets go public.
      </p>

      {alternatives.length > 0 && (
        <div className="mt-6">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Suggested alternatives
          </p>
          <ul className="flex flex-wrap gap-2">
            {alternatives.map((alternative) => (
              <li key={alternative.href}>
                <Link
                  href={alternative.href}
                  className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 font-mono text-web-micro font-medium text-ink-900 transition-all hover:border-ink-900 hover:bg-brand-dark hover:text-white"
                >
                  {alternative.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3 pt-2">
        <WebButtonLink href="/contact" variant="primary" size="md">
          Tell us what you need
        </WebButtonLink>
        <WebButtonLink href={clearHref} variant="outline" size="md">
          Clear all filters
        </WebButtonLink>
      </div>
    </div>
  );
}

export function RegisterRequirement() {
  return (
    <div className="relative mt-16 sm:mt-20 overflow-hidden rounded-3xl border border-white/12 bg-tertiary-gradient shadow-[0_20px_60px_rgba(21,25,54,0.35)] backdrop-blur-md">
      {/* Ambient radiance — top-right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-[350px] rounded-full bg-white/5 blur-[80px]"
      />
      {/* Amber accent glow — bottom-left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -left-10 size-[260px] rounded-full bg-brand-yellow/8 blur-[70px]"
      />
      {/* Hairline top rule */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative z-10 grid gap-8 p-8 sm:p-10 lg:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
        {/* Left: identity label (decorative) */}
        <div className="hidden lg:flex lg:items-center lg:justify-center">
          <div className="flex flex-col items-center gap-3 opacity-20 select-none">
            <div className="size-16 rounded-2xl border border-white/20 bg-white/5 flex items-center justify-center">
              <span className="font-editorial text-3xl font-normal text-white">S</span>
            </div>
            <span className="font-mono text-web-nano tracking-[0.3em] uppercase text-white">Sunland</span>
          </div>
        </div>

        {/* Right: content */}
        <div className="lg:max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3.5 py-1 font-mono text-web-micro font-medium uppercase tracking-widest text-brand-yellow backdrop-blur-md mb-5">
            Bespoke Search
          </span>

          <h2 className="font-editorial text-2xl sm:text-3xl lg:text-[2.15rem] font-normal leading-tight text-white">
            Looking for a specific off-market asset?
          </h2>

          <p className="mt-3.5 text-web-sm leading-relaxed text-slate-400">
            Over 35% of our prime Nairobi mandates trade privately before public listing. Share your requirements with our acquisitions desk and we&apos;ll reach out within 24 hours.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <WebButtonLink href="/contact" variant="primary" size="md">
              Register requirement
            </WebButtonLink>
            <WebButtonLink
              href="/contact"
              variant="outline"
              size="md"
              icon="arrow"
              iconTrailing
              className="border-white/20 bg-white/5 text-white hover:border-white/40 hover:bg-white/10"
            >
              Talk to our desk
            </WebButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
