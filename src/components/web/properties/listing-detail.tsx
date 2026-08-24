import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { formatKES } from "@/lib/utils/format";
import type { ListingDetail } from "@/lib/services/web/listings";
import { LISTING_STATUS_CONFIG } from "../constants/listing-status";
import { SITE } from "../constants/site";
import { WEB_ICON_STROKE, webIcons } from "../icons";
import { Breadcrumbs } from "../primitives/breadcrumbs";
import { Container } from "../primitives/container";
import { Eyebrow } from "../primitives/eyebrow";
import { ListingCard, type ListingCardData } from "../primitives/listing-card";
import { EnquiryForm } from "./enquiry-form";
import { ListingGallery } from "./listing-gallery";
import { ListingDetailChart } from "./listing-detail-chart";
import { ListingDetailOccupancy } from "./listing-detail-occupancy";

/**
 * The listing detail page.
 *
 * The most valuable page on the site: everything else exists to bring someone
 * here, and everything on it exists to turn a look into an enquiry.
 *
 * Three structural decisions carried from the design:
 *
 * 1. **The cost table is stated plainly.** Rent, service charge, deposit, and
 *    the move-in total, with "Agency fee, tenant: None" said out loud. The
 *    single most common reason a Kenyan property enquiry goes cold is a cost
 *    that appears after the viewing. Publishing the total is the cheapest
 *    trust we can buy.
 *
 * 2. **A sticky enquiry rail on desktop, a fixed bar on mobile.** The price
 *    and the action stay on screen through 2,000 pixels of description.
 *
 * 3. **Every figure is monospaced.** Prices, areas, counts, distances and the
 *    reference. A price set in Nunito is a defect, not a preference.
 */
export function ListingDetailView({
  listing,
  similar,
}: {
  listing: ListingDetail;
  similar: ListingCardData[];
}) {
  const status = LISTING_STATUS_CONFIG[listing.status];
  const CheckIcon = webIcons.check;
  const ArrowIcon = webIcons.arrow;

  const isRental = Boolean(listing.priceSuffix);
  const rent = listing.priceKes;

  // Deposit and advance follow the stated business rule on the home FAQ,
  // "two months' deposit plus one month in advance". Service charge is not a
  // column on `properties`, so its row is omitted rather than guessed: a
  // number we cannot source is worse than a number we do not show.
  const deposit = isRental && rent ? rent * 2 : null;
  const moveInTotal = isRental && rent && deposit ? deposit + rent : null;

  const areaName = listing.location.split(",")[0].trim();
  const areaSlug = areaName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <>
      <div className="web-dark pt-7">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Properties", href: "/properties" },
              { label: areaName, href: `/locations/${areaSlug}` },
              { label: listing.title },
            ]}
          />
        </Container>
      </div>

      <section aria-label="Photographs" className="web-dark px-5 pb-10 pt-6 sm:px-8 lg:px-14">
        <div className="mx-auto w-full max-w-[1320px]">
          <ListingGallery images={listing.images} title={listing.title} />
        </div>
      </section>

      <main className="bg-surface-0 pt-12">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)] lg:items-start">
            <div className="min-w-0">
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="web-control inline-flex items-center gap-1.5 rounded-web-full bg-positive-bg px-3 py-1 text-xs uppercase tracking-[0.08em] text-emerald-800">
                  <span aria-hidden="true" className={cn("size-1.5 rounded-full", status.dot)} />
                  {status.label}
                </span>
                <span className="web-control inline-flex rounded-web-full border border-line px-3 py-1 text-xs uppercase tracking-[0.08em] text-ink-500">
                  {isRental ? "To let" : "For sale"}
                </span>
                <span className="web-numeric inline-flex rounded-web-full border border-line px-3 py-1 text-xs tracking-[0.04em] text-ink-500">
                  Ref {listing.reference}
                </span>
              </div>

              <h1 className="web-title text-web-h1 text-ink-900">
                {listing.title}
              </h1>
              <p className="web-subtitle mt-2.5 text-base text-ink-400">{listing.location}</p>

              <dl className="mt-8 grid grid-cols-2 divide-y divide-line-soft border-y border-line-soft sm:grid-cols-4 sm:divide-x sm:divide-y-0">
                <SpecFigure value={listing.bedrooms} label="Bedrooms" />
                <SpecFigure value={listing.bathrooms} label="Bathrooms" />
                <SpecFigure value={listing.area} label="Area" />
                <SpecFigure value={listing.parkingSpaces} label="Parking" />
              </dl>

              {listing.description && (
                <section className="mt-11">
                  <h2 className="web-title text-web-h3 text-ink-900">About this property</h2>
                  <div className="mt-4 space-y-4 border-l-2 border-brand-yellow/40 pl-5">
                    {listing.description.split(/\n{2,}/).map((paragraph) => (
                      <p key={paragraph.slice(0, 40)} className="web-prose text-ink-500">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              )}

              {listing.amenities.length > 0 && (
                <section className="mt-11">
                  <h2 className="web-title text-web-h3 text-ink-900">Features and fittings</h2>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {listing.amenities.map((amenity) => (
                      <li
                        key={amenity}
                        className="flex items-center gap-2.5 rounded-full border border-line-soft px-4 py-2 text-sm text-ink-500 transition-colors hover:border-line hover:bg-surface-1"
                      >
                        <CheckIcon
                          size={15}
                          stroke={WEB_ICON_STROKE}
                          aria-hidden="true"
                          className="shrink-0 text-ink-900 opacity-55"
                        />
                        {amenity}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {isRental && rent && (
                <section className="mt-11">
                  <h2 className="web-title text-web-h3 text-ink-900">Costs, plainly</h2>
                  <div className="mt-5 overflow-hidden rounded-web-card border border-line">
                    <CostRow label="Monthly rent" value={formatKES(rent)} emphasis />
                    {deposit && <CostRow label="Deposit, refundable" value={formatKES(deposit)} />}
                    <CostRow label="Agency fee, tenant" value="None" />
                    {moveInTotal && (
                      <CostRow label="Move-in total" value={formatKES(moveInTotal)} total />
                    )}
                  </div>
                  <p className="mt-4 rounded-xl bg-surface-1 p-4 text-sm leading-relaxed text-ink-500">
                    Deposit is held against damage and returned at the end of the tenancy less any
                    deductions, itemised. We do not charge tenants a finder&apos;s fee. Service
                    charge, where the block levies one, is quoted on enquiry.
                  </p>
                </section>
              )}

              <section className="mt-11">
                <h2 className="web-title text-web-h3 text-ink-900">The area</h2>
                <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-surface-1">
                  <div className="flex h-40 items-center justify-center bg-surface-2">
                    <div className="flex flex-col items-center gap-2 text-ink-400">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <span className="label-caps">Map View</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="web-prose text-ink-500">
                      This property is in {areaName}. Location on the map is approximate until a viewing
                      is booked, which is deliberate: an exact pin on a vacant unit is a security
                      problem for the owner and the neighbours.
                    </p>
                    <Link
                      href={`/locations/${areaSlug}`}
                      className="web-subtitle mt-5 inline-flex items-center gap-2 border-b border-line-strong pb-1 text-sm text-ink-900 transition-colors hover:border-ink-900"
                    >
                      What {areaName} is like to live in
                      <ArrowIcon size={16} stroke={WEB_ICON_STROKE} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </section>

              {listing.units && (
                <section className="mt-11 pb-16">
                  <h2 className="web-title text-web-h3 text-ink-900">Building Occupancy</h2>
                  <p className="web-prose mt-2 text-ink-500">
                    Live availability breakdown for this property.
                  </p>
                  <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-surface-0 shadow-web-sm">
                    <div className="p-6">
                      <ListingDetailOccupancy data={listing.units} />
                    </div>
                  </div>
                </section>
              )}
            </div>

            <aside aria-label="Enquire" className="lg:sticky lg:top-[100px] lg:-mt-6">
              <div className="overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="border-b border-line-soft p-6 pb-5">
                  {listing.priceKes === null ? (
                    <p className="text-web-lead text-ink-900">Price on request</p>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="web-numeric text-3xl tracking-[-0.025em] text-ink-900">
                        {formatKES(listing.priceKes)}
                      </span>
                      {listing.priceSuffix && (
                        <span className="web-numeric text-sm text-ink-400">
                          {listing.priceSuffix.replace("/ mo", "/ month")}
                        </span>
                      )}
                    </div>
                  )}
                  <p className="web-subtitle mt-1 text-sm text-ink-400">
                    No tenant agency fee.
                  </p>
                  <ListingDetailChart priceKes={listing.priceKes} />
                </div>
                <div className="p-6">
                  <EnquiryForm listingTitle={listing.title} reference={listing.reference} />
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </main>

      {similar.length > 0 && (
        <section aria-labelledby="similar-heading" className="bg-surface-1 py-20 lg:py-24">
          <Container>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
              <div>
                <Eyebrow>Also available</Eyebrow>
                <h2 id="similar-heading" className="web-title mt-3.5 text-web-h2 text-ink-900">
                  Similar in {areaName} and nearby
                </h2>
              </div>
              <Link
                href="/properties"
                className="web-subtitle inline-flex items-center gap-2 border-b border-line-strong pb-1 text-sm text-ink-900 transition-colors hover:border-ink-900"
              >
                All properties
                <ArrowIcon size={16} stroke={WEB_ICON_STROKE} aria-hidden="true" />
              </Link>
            </div>

            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((item) => (
                <li key={item.id}>
                  <ListingCard listing={item} headingLevel={3} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* The mobile enquiry bar. Fixed rather than sticky-at-the-bottom-of-a-
          section, because on a phone the rail above is 2,000 pixels up. */}
      <div className="sticky bottom-0 z-sticky border-t border-dark-line bg-brand-dark/96 px-5 py-3 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-3">
          {listing.priceKes === null ? (
            <p className="text-sm text-on-dark-hi">Price on request</p>
          ) : (
            <p className="flex items-baseline gap-1.5">
              <span className="web-numeric text-xl tracking-[-0.02em] text-on-dark-hi">
                {formatKES(listing.priceKes)}
              </span>
              {listing.priceSuffix && (
                <span className="web-numeric text-xs text-on-dark-lo">
                  {listing.priceSuffix.replace("/ mo", "/ month")}
                </span>
              )}
            </p>
          )}
          <div className="flex gap-2">
            <a
              href={SITE.phoneHref}
              className="web-hit inline-flex items-center rounded-web-full border border-dark-line px-5 py-2 text-sm text-on-dark-hi"
            >
              Call
            </a>
            <a
              href={`${SITE.whatsappHref}?text=${encodeURIComponent(`Hello Sunland, I would like to view ${listing.title} (Ref ${listing.reference}).`)}`}
              target="_blank"
              rel="noreferrer"
              className="web-subtitle web-hit inline-flex items-center rounded-web-full bg-brand-yellow px-6 py-2 text-sm text-brand-dark"
            >
              Book a viewing
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

/** One figure in the specification strip. Absent values drop the whole cell. */
function SpecFigure({
  value,
  label,
}: {
  value: string | number | null | undefined;
  label: string;
}) {
  if (value === null || value === undefined || value === "" || value === 0) return null;

  return (
    <div className="px-5 py-5 text-center sm:px-6 sm:text-left">
      <dd className="web-numeric text-2xl tracking-[-0.02em] text-ink-900">{value}</dd>
      <dt className="web-control mt-1 text-xxs uppercase tracking-[0.16em] text-ink-400">
        {label}
      </dt>
    </div>
  );
}

function CostRow({
  label,
  value,
  emphasis = false,
  total = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
  total?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex items-baseline justify-between gap-5 px-5 py-4",
        (emphasis || total) && "bg-surface-1",
        !emphasis && "border-t border-line-soft",
        total && "border-t border-line before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-brand-yellow"
      )}
    >
      <span
        className={cn(
          "text-base",
          total ? "web-subtitle text-ink-900" : emphasis ? "text-ink-900" : "text-ink-500"
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "web-numeric",
          total ? "text-lg tracking-[-0.02em] text-ink-900" : "text-base text-ink-500"
        )}
      >
        {value}
      </span>
    </div>
  );
}
