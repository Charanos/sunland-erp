import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { formatKES } from "@/lib/utils/format";
import type { ListingDetail } from "@/lib/services/web/listings";
import { ListingStatusBadge } from "../primitives/badge";
import { SITE } from "../constants/site";
import { WEB_ICON_STROKE, webIcons } from "../icons";
import { Breadcrumbs } from "../primitives/breadcrumbs";
import { Container } from "../primitives/container";
import { Eyebrow } from "../primitives/eyebrow";
import { ListingCard, type ListingCardData } from "../primitives/listing-card";
import { ListingGallery } from "./listing-gallery";
import { ListingHeroActions } from "./listing-hero-actions";
import { ListingEnquiryRail } from "./listing-enquiry-rail";
import { ListingDetailOccupancy } from "./listing-detail-occupancy";
import { ListingInteractiveMap } from "./listing-interactive-map";
import { viewingMessage, whatsappLink } from "../constants/whatsapp";

/**
 * The listing detail page.
 *
 * Designed to production-grade luxury standards:
 * - Clear, atmospheric dark hero with ambient depth and collision-free header spacing.
 * - Prominent property metadata, status badges, and interactive utility actions.
 * - Adaptive master photo mosaic matching any image count flawlessly.
 * - Plain cost transparency, building occupancy metrics, and sticky conversion rail.
 */
export function ListingDetailView({
  listing,
  similar,
}: {
  listing: ListingDetail;
  similar: ListingCardData[];
}) {
  const CheckIcon = webIcons.check;
  const WhatsappIcon = webIcons.whatsapp;
  const ArrowIcon = webIcons.arrow;
  const PinIcon = webIcons.pin;
  const BedIcon = webIcons.bed;
  const BathIcon = webIcons.bath;
  const AreaIcon = webIcons.area;
  const ParkingIcon = webIcons.parking;

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
      {/* ── Atmospheric Luxury Hero Section with Cinematic Background ── */}
      <section className="web-dark web-hero-l3 relative bg-brand-dark border-b border-dark-line">
        {/* Full-bleed Cinematic Property Background Image (Matching Home Hero Visuals) */}
        {listing.images.length > 0 && (
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-brand-deep">
            <Image
              src={listing.images[0].url}
              alt=""
              aria-hidden="true"
              fill
              priority
              quality={100}
              sizes="100vw"
              className="object-cover object-center opacity-80 sm:opacity-85"
            />
            {/* 1. Top dissolve scrim */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-72 sm:h-96 bg-gradient-to-b from-brand-dark via-black/60 via-60% to-transparent"
            />
            {/* 2. Symmetrical horizontal mask */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 via-50% to-black/55"
            />
            {/* 3. Subtle bottom clearance scrim */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent via-30% to-transparent"
            />
          </div>
        )}

        <Container className="relative z-1">
          {/* Top Command Bar: Breadcrumbs on Left, Utility Actions on Right */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/15">
            <Breadcrumbs
              tone="dark"
              items={[
                { label: "Home", href: "/" },
                { label: "Properties", href: "/properties" },
                { label: areaName, href: `/locations/${areaSlug}` },
                { label: listing.title },
              ]}
            />
            <ListingHeroActions
              propertyId={listing.id}
              title={listing.title}
              reference={listing.reference}
            />
          </div>

          {/* Hero Title & Metadata Header */}
          <div className="pt-7 pb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="min-w-0 max-w-4xl">
              {/* Badges Strip */}
              <div className="flex flex-wrap items-center gap-2 mb-3.5">
                {/* The real status primitive rather than a hand-rolled copy —
                    already built for exactly this ("a badge sitting over a
                    photograph") and already refined for the tighter,
                    proportional box every other badge on the site now uses. */}
                <ListingStatusBadge status={listing.status} />

                {/* Secondary, outlined tier: deliberately not filled, so the
                    coloured status pill above stays the one thing the eye
                    lands on first. Sized to the same text-web-nano/leading-4
                    mechanics as WebMediaBadge — not `.web-control` (a fixed
                    20px line box, unlayered so no utility can override it)
                    and not raw `text-xs` (Tailwind's own 12px scale, not
                    this site's --text-web-* one) — which is what made these
                    read a size heavier than everything around them. */}
                <span className="inline-flex rounded-web-full border border-dark-line px-2.5 py-0.5 font-mono text-web-nano font-medium uppercase leading-4 tracking-[0.1em] text-on-dark">
                  {isRental ? "To let" : "For sale"}
                </span>
                {listing.propertyType && (
                  <span className="inline-flex rounded-web-full border border-dark-line px-2.5 py-0.5 font-mono text-web-nano font-medium uppercase leading-4 tracking-[0.1em] text-on-dark">
                    {listing.propertyType}
                  </span>
                )}
                <span className="inline-flex rounded-web-full border border-dark-line px-2.5 py-0.5 font-mono text-web-nano font-medium leading-4 tracking-[0.05em] text-on-dark-lo">
                  Ref {listing.reference}
                </span>
              </div>

              {/* Major Sectional Page Title */}
              <h1 className="web-title text-web-h1 leading-[1.08] tracking-[-0.015em] text-on-dark-hi font-medium">
                {listing.title}
              </h1>

              {/* Location with Pin */}
              <p className="mt-2.5 flex items-center gap-1.5 text-base text-on-dark-lo">
                <PinIcon size={16} stroke={WEB_ICON_STROKE} aria-hidden="true" className="shrink-0 opacity-70" />
                <span>{listing.location}</span>
              </p>
            </div>

            {/* Quick Price Indicator (Desktop) */}
            {listing.priceKes !== null && (
              <div className="hidden lg:block text-right shrink-0">
                <p className="web-control text-web-nano uppercase tracking-[0.16em] text-on-dark-lo mb-1">
                  {isRental ? "Monthly Rent" : "Asking Price"}
                </p>
                <div className="flex items-baseline justify-end gap-1.5">
                  <span className="web-numeric text-3xl tracking-[-0.025em] text-on-dark-hi">
                    {formatKES(listing.priceKes)}
                  </span>
                  {listing.priceSuffix && (
                    <span className="web-numeric text-sm text-on-dark-lo">
                      {listing.priceSuffix.replace("/ mo", "/ month")}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Adaptive Master Gallery */}
          <div className="mt-2">
            <ListingGallery allImages={listing.images} title={listing.title} />
          </div>
        </Container>
      </section>

      {/* ── Main Specification & Information Workspace ── */}
      <main className="bg-surface-0 pt-14 sm:pt-16 pb-28 sm:pb-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)] lg:items-start">
            <div className="min-w-0 space-y-16 sm:space-y-20">
              {/* ── Open Architectural Specification Strip ── */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-8 sm:py-9 border-y border-slate-200 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80">
                {listing.bedrooms !== null && listing.bedrooms !== undefined && (
                  <div className="flex flex-col items-start sm:px-5 first:pl-0">
                    <div className="flex items-center gap-2 text-ink-400 mb-1.5">
                      <BedIcon size={17} stroke={WEB_ICON_STROKE} aria-hidden="true" />
                      <span className="web-control text-web-nano uppercase tracking-[0.14em] font-medium">Bedrooms</span>
                    </div>
                    <span className="web-numeric text-3xl sm:text-4xl font-normal tracking-tight text-ink-900">
                      {listing.bedrooms} <span className="text-xs font-normal text-ink-400">Beds</span>
                    </span>
                  </div>
                )}

                {listing.bathrooms !== null && listing.bathrooms !== undefined && (
                  <div className="flex flex-col items-start pt-5 sm:pt-0 sm:px-5">
                    <div className="flex items-center gap-2 text-ink-400 mb-1.5">
                      <BathIcon size={17} stroke={WEB_ICON_STROKE} aria-hidden="true" />
                      <span className="web-control text-web-nano uppercase tracking-[0.14em] font-medium">Bathrooms</span>
                    </div>
                    <span className="web-numeric text-3xl sm:text-4xl font-normal tracking-tight text-ink-900">
                      {listing.bathrooms} <span className="text-xs font-normal text-ink-400">Baths</span>
                    </span>
                  </div>
                )}

                {listing.area && (
                  <div className="flex flex-col items-start pt-5 sm:pt-0 sm:px-5">
                    <div className="flex items-center gap-2 text-ink-400 mb-1.5">
                      <AreaIcon size={17} stroke={WEB_ICON_STROKE} aria-hidden="true" />
                      <span className="web-control text-web-nano uppercase tracking-[0.14em] font-medium">Total Area</span>
                    </div>
                    <span className="web-numeric text-3xl sm:text-4xl font-normal tracking-tight text-ink-900">
                      {listing.area}
                    </span>
                  </div>
                )}

                {listing.parkingSpaces !== null && listing.parkingSpaces !== undefined && (
                  <div className="flex flex-col items-start pt-5 sm:pt-0 sm:px-5 last:pr-0">
                    <div className="flex items-center gap-2 text-ink-400 mb-1.5">
                      <ParkingIcon size={17} stroke={WEB_ICON_STROKE} aria-hidden="true" />
                      <span className="web-control text-web-nano uppercase tracking-[0.14em] font-medium">Parking</span>
                    </div>
                    <span className="web-numeric text-3xl sm:text-4xl font-normal tracking-tight text-ink-900">
                      {listing.parkingSpaces} <span className="text-xs font-normal text-ink-400">Cars</span>
                    </span>
                  </div>
                )}
              </div>

              {/* ── About This Property (Open Editorial Narrative) ── */}
              {listing.description && (
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="web-title text-web-h3 text-ink-900">About this property</h2>
                    <span className="inline-flex items-center gap-1.5 text-xs text-ink-400 font-medium bg-slate-100 px-3.5 py-1 rounded-full">
                      Ref #{listing.reference}
                    </span>
                  </div>

                  {/* Highlights row */}
                  <div className="flex flex-wrap gap-2 pt-0.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-yellow/15 border border-brand-yellow/30 px-3.5 py-1.5 text-xs font-medium text-brand-dark">
                      ✦ Verified Listing
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-medium text-ink-700">
                      ✦ {listing.propertyType}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-medium text-ink-700">
                      ✦ Prime {areaName}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-medium text-ink-700">
                      ✦ Move-in Ready
                    </span>
                  </div>

                  <div className="space-y-5 border-l-2 border-brand-yellow/60 pl-6 text-ink-600 leading-relaxed pt-2">
                    {listing.description.split(/\n{2,}/).map((paragraph, i) => (
                      <p key={i} className="web-prose text-ink-600">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              )}

              {/* ── Features and Amenities (Flowing Open Tag Matrix) ── */}
              {listing.amenities.length > 0 && (
                <section className="space-y-6">
                  <div>
                    <h2 className="web-title text-web-h3 text-ink-900">Features & Fittings</h2>
                    <p className="text-sm text-ink-500 mt-1">
                      Included premium amenities, services, and architectural specifications.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 pt-2">
                    {listing.amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center gap-3 text-sm text-ink-800 font-medium"
                      >
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                          <CheckIcon size={12} stroke={WEB_ICON_STROKE} aria-hidden="true" />
                        </span>
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* ── Financial Transparency & Costs (Open Line-Divided Table) ── */}
              <section className="space-y-6">
                <div>
                  <h2 className="web-title text-web-h3 text-ink-900">Costs & Financial Breakdown</h2>
                  <p className="text-sm text-ink-500 mt-1">
                    Clear breakdown of all fees. Zero hidden broker markups.
                  </p>
                </div>

                <div className="border-y border-slate-200 divide-y divide-slate-100">
                  {isRental && rent ? (
                    <>
                      <CostRow label="Monthly Rent" value={formatKES(rent)} emphasis />
                      {deposit && <CostRow label="Refundable Security Deposit" value={formatKES(deposit)} />}
                      <CostRow label="Tenant Finder / Agency Fee" value="KES 0 (Waived)" />
                      {moveInTotal && (
                        <CostRow label="Total Estimated Move-In Cost" value={formatKES(moveInTotal)} total />
                      )}
                    </>
                  ) : listing.priceKes ? (
                    <>
                      <CostRow label="Agreed Asking Price" value={formatKES(listing.priceKes)} emphasis />
                      <CostRow label="Estimated Stamp Duty (4% Urban Rate)" value={formatKES(Math.round(listing.priceKes * 0.04))} />
                      <CostRow label="Legal & Conveyancing Estimate (~1.5%)" value={formatKES(Math.round(listing.priceKes * 0.015))} />
                      <CostRow label="Buyer Brokerage / Commission" value="KES 0 (Direct to Sunland)" />
                      <CostRow
                        label="Total Estimated Acquisition Investment"
                        value={formatKES(Math.round(listing.priceKes * 1.055))}
                        total
                      />
                    </>
                  ) : null}
                </div>

                <p className="text-xs text-ink-400 leading-relaxed pt-2">
                  <span className="font-medium text-ink-700">Sunland Transparency Guarantee: </span>
                  {isRental
                    ? "Security deposits are held in escrow against property condition and fully refunded upon lease handover. Sunland never charges prospective tenants viewing or application fees."
                    : "Stamp duty is payable directly to Kenya Revenue Authority (KRA) via Lands Ministry eCitizen. Legal conveyancing figures are standard LSK guideline estimates."}
                </p>
              </section>

              {/* ── Interactive Functional Map & Neighborhood Points of Interest ── */}
              <ListingInteractiveMap
                location={listing.location}
                areaName={areaName}
                areaSlug={areaSlug}
              />

              {listing.units && (
                <section className="space-y-6">
                  <div>
                    <h2 className="web-title text-web-h3 text-ink-900">Building Occupancy & Unit Availability</h2>
                    <p className="text-sm text-ink-500 mt-1">
                      Live unit availability, layout distribution, and tenancy health for this development.
                    </p>
                  </div>
                  <ListingDetailOccupancy data={listing.units} propertyTitle={listing.title} />
                </section>
              )}
            </div>

            <ListingEnquiryRail
              propertyId={listing.id}
              listingTitle={listing.title}
              reference={listing.reference}
              location={listing.location}
              priceKes={listing.priceKes}
              priceSuffix={listing.priceSuffix}
              propertyType={listing.propertyType}
            />
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
              href={whatsappLink(
                viewingMessage({
                  title: listing.title,
                  reference: listing.reference,
                  location: listing.location,
                  priceKes: listing.priceKes,
                  priceSuffix: listing.priceSuffix,
                  propertyType: listing.propertyType,
                  bedrooms: listing.bedrooms,
                })
              )}
              target="_blank"
              rel="noreferrer"
              className="web-subtitle web-hit inline-flex items-center gap-2 rounded-web-full bg-brand-yellow px-6 py-2 text-sm text-brand-dark"
            >
              <WhatsappIcon size={16} stroke={WEB_ICON_STROKE} aria-hidden="true" />
              Book a viewing
            </a>
          </div>
        </div>
      </div>
    </>
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
        "relative flex items-baseline justify-between gap-5 py-4 sm:py-4.5 px-1",
        total && "font-medium text-ink-900 pt-5"
      )}
    >
      <span
        className={cn(
          "text-sm sm:text-base",
          total ? "font-medium text-ink-900" : emphasis ? "text-ink-900 font-medium" : "text-ink-500"
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "web-numeric",
          total ? "text-xl sm:text-2xl tracking-[-0.02em] font-medium text-ink-900" : "text-sm sm:text-base text-ink-600"
        )}
      >
        {value}
      </span>
    </div>
  );
}
