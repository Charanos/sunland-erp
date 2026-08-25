import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { formatKES } from "@/lib/utils/format";
import {
  AREA_GROUPS,
  findAreaEditorial,
  WEB_AREAS,
} from "@/components/web/constants/locations.content";
import { WEB_ICON_STROKE, webIcons } from "@/components/web/icons";
import { Breadcrumbs } from "@/components/web/primitives/breadcrumbs";
import { WebButtonLink } from "@/components/web/primitives/button";
import { Container } from "@/components/web/primitives/container";
import { ListingCard } from "@/components/web/primitives/listing-card";
import { ListingHeroActions } from "@/components/web/properties/listing-hero-actions";
import { AreaPriceChart } from "@/components/web/locations/area-price-chart";
import { AreaInteractiveMap } from "@/components/web/locations/area-interactive-map";
import { getListings } from "@/lib/services/web/listings";
import { areaMatchTerm, findLocation, getLocationStats } from "@/lib/services/web/locations";

export const revalidate = 3600;

export function generateStaticParams() {
  return WEB_AREAS.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const area = findLocation(slug);
  if (!area) return { title: "Area not found | Sunland Real Estates" };

  return {
    title: `${area.name}, ${area.region} — Property Market Guide & Live Listings | Sunland`,
    description: `Comprehensive real estate market guide for ${area.name}, ${area.region}. Typical rents, sale values, neighborhood infrastructure, and active property mandates.`,
  };
}

const DEFAULT_SUBMARKET_AMENITIES = [
  "Borehole Water & Secondary Storage",
  "Full Backup Generators on Common Areas",
  "24/7 Monitored Security Corridors",
  "High-Speed Fibre Optic Connectivity",
  "Premier International Academies Nearby",
  "Modern Retail Centres & Supermarkets",
  "Direct Arterial & Bypass Road Links",
  "Dedicated Residential Gated Barriers",
  "Fully Equipped Medical Clinics & Care",
];

export default async function AreaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const area = findLocation(slug);
  if (!area) notFound();

  const editorial = findAreaEditorial(slug);
  const term = areaMatchTerm(area.name);

  const [stats, results] = await Promise.all([
    getLocationStats(term),
    getListings({ location: term, pageSize: 4 }),
  ]);

  const groupTitle = AREA_GROUPS.find((group) => group.id === area.group)?.title ?? area.region;

  // Nearby areas in the same category
  const nearby = WEB_AREAS.filter(
    (item) => item.slug !== area.slug && item.group === area.group
  ).slice(0, 4);

  const CheckIcon = webIcons.check;
  const ArrowIcon = webIcons.arrow;
  const PinIcon = webIcons.pin;
  const PhoneIcon = webIcons.phone;
  const ShieldIcon = webIcons.shield;
  const ChartIcon = webIcons.chart;

  const bgImage = area.imageUrl || "/images/areas-hero.jpg";
  const amenitiesList = editorial?.amenities ?? DEFAULT_SUBMARKET_AMENITIES;

  return (
    <>
      {/* ── 01. Atmospheric Cinematic Full-Bleed Hero Section ── */}
      <section
        aria-labelledby="area-heading"
        className="web-dark relative overflow-hidden bg-brand-dark pt-28 sm:pt-32 lg:pt-36 pb-14 sm:pb-18 border-b border-dark-line"
      >
        {/* Full-bleed Background Photography */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#090d1f]">
          <Image
            src={bgImage}
            alt={area.name}
            fill
            priority
            quality={100}
            sizes="100vw"
            className="object-cover object-center opacity-75 sm:opacity-80"
          />

          {/* 1. Top Dissolve Scrim */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-72 sm:h-96 bg-gradient-to-b from-[#090d1f] via-[#090d1f]/65 via-60% to-transparent"
          />

          {/* 2. Lateral Vignette Scrim */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 via-55% to-black/60"
          />

          {/* 3. Subtle Bottom Clearance Scrim */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent via-30% to-transparent"
          />
        </div>

        <Container className="relative z-10">
          {/* Top Navigation & Utility Command Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/15">
            <Breadcrumbs
              tone="dark"
              items={[
                { label: "Home", href: "/" },
                { label: "Areas", href: "/locations" },
                { label: area.name },
              ]}
            />
            <ListingHeroActions
              title={`${area.name} Real Estate Market Guide`}
              reference={`LOC-${area.slug.toUpperCase()}`}
            />
          </div>

          {/* Main Hero Header Row */}
          <div className="pt-8 pb-4 grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <div className="min-w-0">
              {/* Category Badges Strip */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#151936]/80 border border-white/20 px-3 py-1 font-mono text-[10.5px] font-medium text-white backdrop-blur-md">
                  <PinIcon size={12} stroke={WEB_ICON_STROKE} className="text-brand-yellow" />
                  <span>{area.region}</span>
                </span>

                <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 font-mono text-[10.5px] font-medium uppercase tracking-wider text-slate-200 backdrop-blur-md">
                  {groupTitle}
                </span>

                {stats.total > 0 ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 text-[10.5px] font-mono font-medium text-emerald-300 backdrop-blur-md">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {stats.total} Live {stats.total === 1 ? "Mandate" : "Mandates"}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-[10.5px] font-mono font-medium text-slate-300 backdrop-blur-md">
                    <ShieldIcon size={11} stroke={WEB_ICON_STROKE} />
                    Verified Submarket Guide
                  </span>
                )}
              </div>

              {/* Major Sectional Serif Title */}
              <h1
                id="area-heading"
                className="title-serif text-[clamp(2.5rem,4.5vw,4.25rem)] font-medium leading-[1.04] tracking-tight text-white drop-shadow-md"
              >
                {area.name}
              </h1>

              {/* Evocative Tagline / Subtitle */}
              <p className="mt-4 max-w-[58ch] text-[16px] sm:text-lg leading-relaxed text-slate-200/95 drop-shadow-sm font-normal">
                {area.tagline ? `${area.tagline}. ` : ""}
                {area.blurb}
              </p>
            </div>

            {/* Right-Side Glassmorphic Telemetry HUD */}
            <div className="rounded-2xl border border-white/15 bg-[#151936]/70 p-5 sm:p-6 backdrop-blur-xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-[10.5px] uppercase tracking-widest text-brand-yellow font-medium">
                  Submarket Guidance
                </span>
                <span className="font-mono text-[10px] text-slate-400">Sunland Ledger</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    {area.guideLabel}
                  </p>
                  <p className="font-mono text-[22px] sm:text-[24px] font-medium text-white tracking-tight leading-none">
                    {area.guideValue}
                  </p>
                </div>

                <div className="border-l border-white/10 pl-4 space-y-1">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
                    Active On Books
                  </p>
                  <p className="font-mono text-[22px] sm:text-[24px] font-medium text-white tracking-tight leading-none">
                    {stats.total}{" "}
                    <span className="text-xs font-normal text-slate-300">units</span>
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/landlords#valuation"
                  className="flex items-center justify-between rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 px-3.5 py-2.5 text-xs text-white transition-all font-medium group"
                >
                  <span>Request {area.name} Valuation</span>
                  <ArrowIcon
                    size={14}
                    stroke={WEB_ICON_STROKE}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 02. Main Specification & Information Workspace (Open & Free-Flowing) ── */}
      <main className="bg-surface-0 pt-14 sm:pt-16 pb-28 sm:pb-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)] lg:items-start">
            {/* Left Column: Submarket Editorial, Amenities, Pricing Matrix & Active Inventory */}
            <div className="min-w-0 space-y-16 sm:space-y-20 lg:space-y-24">
              
              {/* ── 02.1 Overview & Living Profile (Open Editorial Narrative) ── */}
              {editorial && (
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="web-title text-web-h3 text-ink-900">About {area.name}</h2>
                    <span className="inline-flex items-center gap-1.5 text-xs text-ink-400 font-medium bg-slate-100 px-3.5 py-1 rounded-full">
                      Ref #LOC-{area.slug.toUpperCase()}
                    </span>
                  </div>

                  {/* Highlights row */}
                  <div className="flex flex-wrap gap-2 pt-0.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-yellow/15 border border-brand-yellow/30 px-3.5 py-1.5 text-xs font-medium text-brand-dark">
                      ✦ Verified Submarket
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-medium text-ink-700">
                      ✦ {groupTitle}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-medium text-ink-700">
                      ✦ {area.region}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-medium text-ink-700">
                      ✦ Active Ledger
                    </span>
                  </div>

                  <div className="space-y-5 border-l-2 border-brand-yellow/60 pl-6 text-ink-600 leading-relaxed pt-2">
                    {editorial.livingHere.map((paragraph, idx) => (
                      <p key={idx} className="web-prose text-ink-600">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              )}

              {/* ── 02.2 Submarket Amenities & Infrastructure (Open Flowing Grid) ── */}
              <section className="space-y-6">
                <div>
                  <h2 className="web-title text-web-h3 text-ink-900">Features & Amenities</h2>
                  <p className="text-sm text-ink-500 mt-1">
                    Key civic infrastructure, utilities reliability, security standards, and lifestyle conveniences in {area.name}.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 pt-2">
                  {amenitiesList.map((amenity) => (
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

              {/* ── 02.3 Financial Transparency & Pricing Matrix (Freed from 2-Column Grid) ── */}
              <section className="space-y-8">
                <div>
                  <h2 className="web-title text-web-h3 text-ink-900">Submarket Pricing & Cost Transparency</h2>
                  <p className="text-sm text-ink-500 mt-1">
                    {editorial?.costsNote ??
                      `Guide figures derived from active and historical property mandates let or sold in ${area.name}.`}
                  </p>
                </div>

                  {/* Part A: Full-Width Realized Cost Matrix */}
                <div className="w-full">
                  <div className="pb-3 border-b border-slate-100 mb-2">
                    <h4 className="font-editorial text-xl font-medium text-[#151936]">Realized Cost Matrix</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Historical and active booking bands</p>
                  </div>

                  <div className="border-y border-slate-200 divide-y divide-slate-100">
                    {(editorial?.costRows && editorial.costRows.length > 0
                      ? editorial.costRows
                      : stats.priceRows.length > 0
                      ? stats.priceRows.map((r) => ({
                          type: r.label,
                          toLet: r.typicalRent ? formatKES(r.typicalRent) : area.guideValue,
                          forSale: "On Request",
                          emphasis: r.bedrooms === 2,
                        }))
                      : [
                          { type: "1 Bedroom Executive", toLet: "45–65k", forSale: "7.5–10.5M" },
                          { type: "2 Bedroom Apartment", toLet: area.guideValue, forSale: "12–18M", emphasis: true },
                          { type: "3 Bedroom Apartment", toLet: "95–160k", forSale: "18–28M" },
                          { type: "4 Bed Townhouse / Villa", toLet: "180–320k", forSale: "35–65M" },
                        ]
                    ).map((row) => (
                      <div
                        key={row.type}
                        className={cn(
                          "flex items-center justify-between py-4 text-sm transition-colors",
                          row.emphasis && "bg-brand-yellow/5 px-3 -mx-3 rounded-lg font-medium"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          {row.emphasis && (
                            <span className="size-2 rounded-full bg-emerald-500" />
                          )}
                          <span className="text-[#151936] text-[15px]">{row.type}</span>
                        </div>
                        <div className="flex items-center gap-6 sm:gap-10 text-right">
                          <span className="font-mono font-medium text-[#151936] text-base">
                            {row.toLet} <span className="text-xs text-slate-400 font-normal">/ mo</span>
                          </span>
                          <span className="font-mono text-slate-500 text-sm min-w-[80px]">
                            {row.forSale}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="mt-3.5 text-xs leading-relaxed text-slate-400 font-normal">
                    Ranges reflect realized contracts on Sunland&apos;s active book over the last 12 months. Service charges and utilities are billed separately.
                  </p>
                </div>

                {/* Part B: Full-Width Interactive Price Spectrum (Recharts) */}
                <div className="w-full pt-4">
                  <AreaPriceChart
                    editorialRows={
                      editorial?.costRows && editorial.costRows.length > 0
                        ? editorial.costRows
                        : [
                            { type: "1 Bedroom Executive", toLet: "45–65k", forSale: "7.5–10.5M" },
                            { type: "2 Bedroom Apartment", toLet: area.guideValue, forSale: "12–18M", emphasis: true },
                            { type: "3 Bedroom Apartment", toLet: "95–160k", forSale: "18–28M" },
                            { type: "4 Bed Townhouse / Villa", toLet: "180–320k", forSale: "35–65M" },
                          ]
                    }
                    liveRows={stats.priceRows}
                  />
                </div>
              </section>

              {/* ── 02.4 Location & Transit Matrix (Freed from 2-Column Grid) ── */}
              {editorial && (
                <section className="space-y-8">
                  <div>
                    <h2 className="web-title text-web-h3 text-ink-900">Location & Transit Matrix</h2>
                    <p className="text-sm text-ink-500 mt-1">
                      Geographic orientation, commuter arterial distances, and on-the-ground advisory for {area.name}.
                    </p>
                  </div>

                  {/* Part A: Interactive Map Shell (Working Google Embed) */}
                  <div className="w-full">
                    <AreaInteractiveMap areaName={area.name} region={area.region} />
                  </div>

                  {/* Part B: Key Distance Milestones (Expansive 4-Column Metric Grid) */}
                  <div className="w-full space-y-4 pt-2">
                    <p className="font-mono text-xs uppercase tracking-wider text-slate-500 font-medium pb-2 border-b border-slate-200">
                      Key Distance & Transit Milestones
                    </p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                      {editorial.distances.map((row) => (
                        <div
                          key={row.place}
                          className="flex flex-col justify-between p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all"
                        >
                          <span className="text-xs text-slate-500 font-normal line-clamp-1">{row.place}</span>
                          <div className="mt-2 flex items-baseline justify-between">
                            <span className="font-mono text-2xl font-medium text-[#151936]">
                              {row.value}
                            </span>
                            <span className="font-mono text-[10px] uppercase text-slate-400">Direct</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Part C: Worth Knowing Before Signing (Spacious 2-Column Checklist) */}
                  <div className="w-full space-y-4 pt-2">
                    <p className="font-mono text-xs uppercase tracking-wider text-slate-500 font-medium pb-2 border-b border-slate-200">
                      Worth Knowing & Due Diligence Checklist
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
                      {editorial.worthKnowing.map((item) => (
                        <div
                          key={item}
                          className="flex items-start gap-3 py-2 text-sm leading-relaxed text-slate-700 font-normal"
                        >
                          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/60 mt-0.5">
                            <CheckIcon size={12} stroke={WEB_ICON_STROKE} aria-hidden="true" />
                          </span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* ── 02.5 Active Inventory Listings in This Area ── */}
              <section className="space-y-6 pt-4 border-t border-line">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="web-title text-web-h3 text-ink-900">
                      Available in {area.name} now
                    </h2>
                    <p className="text-sm text-ink-500">
                      Verified properties currently onboarded and ready for viewing.
                    </p>
                  </div>

                  {results.listings.length > 0 && (
                    <Link
                      href={`/properties?location=${encodeURIComponent(term)}`}
                      className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#151936] hover:text-brand-dark transition-colors font-medium"
                    >
                      <span>View All ({stats.total})</span>
                      <ArrowIcon size={14} stroke={WEB_ICON_STROKE} />
                    </Link>
                  )}
                </div>

                {results.listings.length > 0 ? (
                  <div className="pt-2">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      {results.listings.map((listing, index) => (
                        <li key={listing.id}>
                          <ListingCard
                            listing={listing}
                            headingLevel={3}
                            priority={index < 2}
                          />
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8 pt-4 text-center sm:hidden">
                      <WebButtonLink
                        href={`/properties?location=${encodeURIComponent(term)}`}
                        variant="outline"
                        size="md"
                        className="w-full justify-center"
                      >
                        Explore all {stats.total} listings in {area.name}
                      </WebButtonLink>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-slate-200/90 bg-surface-1 p-8 sm:p-10 text-center space-y-4">
                    <div className="size-11 rounded-full bg-slate-200 flex items-center justify-center mx-auto text-slate-500">
                      <PinIcon size={18} stroke={WEB_ICON_STROKE} />
                    </div>
                    <h4 className="font-editorial text-2xl font-medium text-[#151936]">
                      No active listings in {area.name} today
                    </h4>
                    <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                      New mandates are onboarded weekly. Register your target criteria and our named submarket consultant will alert you before public syndication.
                    </p>
                    <div className="pt-2">
                      <WebButtonLink href="/contact" variant="primary" size="md">
                        Register a Requirement
                      </WebButtonLink>
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* ── 03. Right Column: Sticky Mandate Appraisal & Submarket Rail ── */}
            <aside className="lg:sticky lg:top-28 space-y-6">
              {/* Asset Owner Valuation Box */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
                  <span className="font-mono text-[10.5px] uppercase tracking-widest text-slate-400 font-medium">
                    Owner Advisory
                  </span>
                  <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-emerald-700 font-medium">
                    <ChartIcon size={10} stroke={2.5} /> Active Ledger
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="font-editorial text-[24px] font-medium leading-snug text-[#151936]">
                    What your {area.name} property would fetch
                  </h4>
                  <p className="text-[14px] leading-relaxed text-slate-600 font-normal">
                    {stats.total > 0
                      ? `We manage and let units in ${area.name}. An appraisal consultant will provide exact realized comparables and tenant demand metrics for your configuration.`
                      : `A senior consultant specializing in ${area.name} can provide actionable price guidance, lease structuring, and full management terms.`}
                  </p>
                </div>

                <div className="pt-1 space-y-2.5">
                  <WebButtonLink
                    href="/landlords#valuation"
                    variant="primary"
                    size="md"
                    className="w-full justify-center text-center"
                  >
                    Request Free Valuation
                  </WebButtonLink>

                  <p className="text-[11.5px] text-center text-slate-400 font-normal">
                    Completely free with zero obligation to list.
                  </p>
                </div>
              </div>

              {/* Nearby / Sister Submarkets Navigation */}
              {nearby.length > 0 && (
                <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                    Complementary Submarkets
                  </p>
                  <ul className="divide-y divide-slate-100 border-t border-slate-100">
                    {nearby.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/locations/${item.slug}`}
                          className="group flex items-center justify-between gap-3 py-3 text-[14px] text-[#151936] transition-colors hover:text-blue-900"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="size-1.5 rounded-full bg-slate-300 group-hover:bg-[#151936] transition-colors" />
                            <span className="truncate font-medium">{item.name}</span>
                          </div>
                          <span className="font-mono text-[12px] text-slate-500 shrink-0">
                            {item.guideValue}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Direct Consultant Hotline Desk */}
              <div className="rounded-2xl border border-slate-200/90 bg-surface-1 p-6 space-y-3.5">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-600 font-medium">
                  <PhoneIcon size={13} stroke={WEB_ICON_STROKE} />
                  <span>Submarket Advisory Desk</span>
                </div>
                <p className="text-[13.5px] leading-relaxed text-slate-600 font-normal">
                  Speak directly with our dedicated portfolio manager for {area.name} regarding off-market listings or tenant onboarding.
                </p>
                <div className="pt-1">
                  <a
                    href="tel:+254703100875"
                    className="inline-flex items-center gap-2 font-mono text-[13px] font-medium text-[#151936] hover:text-brand-dark transition-colors"
                  >
                    <span>+254 703 100 875</span>
                    <ArrowIcon size={13} stroke={WEB_ICON_STROKE} />
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </main>

      {/* ── 04. Closing Requirement Callout Banner ── */}
      <section
        aria-labelledby="area-cta-heading"
        className="web-dark py-20 sm:py-24 bg-[#090d1f] border-t border-white/10"
      >
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-brand-yellow">
                <span className="h-px w-6 bg-brand-yellow" />
                <span>Bespoke Property Search</span>
              </div>
              <h2
                id="area-cta-heading"
                className="font-editorial text-[clamp(2.2rem,3.5vw,3.2rem)] font-medium leading-[1.08] text-white tracking-tight"
              >
                Looking for space in {area.name}?
              </h2>
              <p className="text-[15.5px] leading-relaxed text-slate-300 font-normal max-w-[56ch]">
                Tell us your target unit configuration, timeline, and budget. We will present matching options immediately, including verified properties before public listing.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3.5 lg:justify-end">
              <WebButtonLink href="/contact" variant="primary" size="lg">
                Register Requirement
              </WebButtonLink>
              <WebButtonLink href="/locations" variant="ghostDark" size="lg">
                Explore All Areas
              </WebButtonLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
