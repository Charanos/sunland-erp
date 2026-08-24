"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { WEB_ICON_STROKE, webIcons } from "../icons";
import { WebButtonLink } from "../primitives/button";

const COMMERCIAL_PILLARS = [
  {
    id: "offices",
    number: "01",
    tabTitle: "Grade-A Offices",
    microTag: "Corporate & Tech Parks",
    title: "Grade-A Corporate Offices & Business Parks",
    icon: "building" as const,
    summary: "Strategic landlord representation and tenant representation across Nairobi's premier commercial corridors including Westlands, Upper Hill, Riverside, and Gigiri diplomatic nodes.",
    specs: [
      {
        title: "Multi-National Tenant Profiling",
        desc: "Direct placement of diplomatic missions, Fortune 500 multinationals, and top-tier financial institutions.",
      },
      {
        title: "Commercial Lease Structuring",
        desc: "Institutional lease covenants with structured escalation clauses, fit-out grace periods, and break clauses.",
      },
      {
        title: "Open-Book Service Charge Auditing",
        desc: "Rigorous quarterly reconciliation of common area maintenance, generator fuel, and security overheads.",
      },
      {
        title: "Fit-Out & Handover Management",
        desc: "Technical coordination of Cat-A/Cat-B office fit-outs with architectural and MEP engineering signoff.",
      },
    ],
  },
  {
    id: "logistics",
    number: "02",
    tabTitle: "Logistics & Godowns",
    microTag: "Tatu City & SEZ Belt",
    title: "Industrial Logistics Parks, Warehouses & Godowns",
    icon: "wrench" as const,
    summary: "End-to-end advisory for modern logistics hubs, light manufacturing facilities, and distribution godowns along the Mombasa Road ICD corridor and Tatu City Special Economic Zone (SEZ).",
    specs: [
      {
        title: "High-Bay Clearance Specifications",
        desc: "Marketing facilities with 9m+ eave heights, FM2 flooring, dock levelers, and heavy axle access.",
      },
      {
        title: "SEZ Tax Incentive Advisory",
        desc: "Advising occupiers on Special Economic Zone tax exemptions, customs duty waivers, and VAT relief.",
      },
      {
        title: "Long-Tenor Institutional Leases",
        desc: "Negotiation of 5 to 10-year triple-net (NNN) institutional industrial lease agreements.",
      },
      {
        title: "Heavy Power & Utility Allocation",
        desc: "Direct coordination of high-kVA dedicated transformer substations and borehole water reserves.",
      },
    ],
  },
  {
    id: "retail",
    number: "03",
    tabTitle: "Retail & Showrooms",
    microTag: "High-Footfall Plazas",
    title: "Retail Hubs, Automotive Showrooms & Mixed-Use",
    icon: "home" as const,
    summary: "Curated tenant mix structuring for neighborhood convenience retail, highway automotive showrooms, and lifestyle strip malls maximizing footfall density and tenant sales yield.",
    specs: [
      {
        title: "Anchor Tenant Strategy & Placement",
        desc: "Pre-leasing to tier-1 supermarket chains, international QSR franchises, and banking anchor institutions.",
      },
      {
        title: "Turnover Rent & Minimum Base Modeling",
        desc: "Structuring hybrid base rent plus turnover participation lease structures for prime retail nodes.",
      },
      {
        title: "High-Visibility Frontage Allocation",
        desc: "Optimizing frontage glass display zoning and designated customer parking stall allocations.",
      },
      {
        title: "Mall Governance & Tenant Associations",
        desc: "Drafting operational house rules, opening hour mandates, and shared marketing fund charters.",
      },
    ],
  },
  {
    id: "development",
    number: "04",
    tabTitle: "Development Land",
    microTag: "Industrial & Masterplan",
    title: "Commercial Parcels & Masterplanned Industrial Land",
    icon: "mapPin" as const,
    summary: "Acquisition, change of user, and joint venture (JV) structuring for commercial mixed-use land, masterplanned development acreage, and greenfield infrastructure corridors.",
    specs: [
      {
        title: "Change of User & NEMA Environmental Clearance",
        desc: "Coordination of zoning conversions, physical planning approvals, and EIA environmental licenses.",
      },
      {
        title: "Joint Venture (JV) Structuring",
        desc: "Drafting SPV equity structures, land-for-equity ratios, and developer exit frameworks.",
      },
      {
        title: "Bulk Infrastructure Readiness",
        desc: "Verification of paved spine roads, high-voltage power lines, drainage outfalls, and fiber trunks.",
      },
      {
        title: "Clean Title & Freehold Due Diligence",
        desc: "Exhaustive registry search verification eliminating boundary disputes and historical caveats.",
      },
    ],
  },
] as const;

const KEY_METRICS = [
  {
    value: "450k+",
    label: "Square feet",
    sub: "Prime commercial space under advisory",
  },
  {
    value: "5.5 Yrs",
    label: "Avg. lease term",
    sub: "Institutional long-tenor covenants",
  },
  {
    value: "97.2%",
    label: "Occupancy rate",
    sub: "Logistics & office parks portfolio",
  },
  {
    value: "0%",
    label: "Service charge leakage",
    sub: "Audited open-book reconciliation",
  },
];

export function CommercialService() {
  const [activePillar, setActivePillar] = useState<number>(0);
  const ArrowIcon = webIcons.arrow;
  const CheckIcon = webIcons.check;
  const ShieldIcon = webIcons.shield;

  const currentPillar = COMMERCIAL_PILLARS[activePillar];

  return (
    <section
      id="commercial"
      aria-labelledby="commercial-heading"
      className="scroll-mt-20 border-b border-line py-20 lg:py-28 bg-surface-1"
    >
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12 xl:px-14">
        {/* Section Header: Serif Title Left (7 cols), Narrative Right (5 cols) - Matching Service 02 */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end pb-12 border-b border-line-soft">
          {/* Left Column: Main Serif Title */}
          <div className="lg:col-span-7">
            <h2
              id="commercial-heading"
              className="font-editorial text-[clamp(2.25rem,3.8vw,3.5rem)] font-medium leading-[1.08] tracking-tight text-ink-900 text-balance"
            >
              Commercial and industrial asset advisory & leasing
            </h2>
          </div>

          {/* Right Column: Eyebrow + Narrative Context */}
          <div className="lg:col-span-5 space-y-4 lg:pl-4">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-brand-yellow" />
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-900 font-medium">
                Practice 04 · Commercial & Industrial
              </p>
            </div>
            <p className="text-[15.5px] sm:text-[16.5px] leading-relaxed text-ink-500 font-normal max-w-[48ch]">
              Offices, retail hubs, logistics parks, and industrial godowns across Nairobi, Tatu City, and the Mombasa Road corridor. Structured on institutional lease terms with open-book service charge governance.
            </p>
          </div>
        </div>

        {/* Main Content Grid: Interactive Machinery Left, 4K Visuals Right (Matching Service 02) */}
        <div className="mt-14 grid gap-14 lg:gap-20 lg:grid-cols-12 lg:items-start">
          
          {/* Left Column: Interactive Machinery (7 cols) */}
          <div className="lg:col-span-7 space-y-9">
            
            {/* Header and Control Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-line-soft">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-400 font-medium">
                Commercial Operations Machinery
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-ink-900 font-medium">
                4 Asset Classes
              </span>
            </div>

            {/* Desktop Nav Style Tertiary-Glass Capsule Tab Selector */}
            <div className="relative rounded-2xl sm:rounded-full border border-white/15 bg-tertiary-gradient-glass p-1.5 shadow-[0_16px_40px_rgba(12,31,36,0.25),inset_0_1px_1px_rgba(255,255,255,0.12)] backdrop-blur-2xl">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-1.5">
                {COMMERCIAL_PILLARS.map((pillar, idx) => {
                  const isActive = activePillar === idx;
                  return (
                    <button
                      key={pillar.id}
                      type="button"
                      onClick={() => setActivePillar(idx)}
                      className={cn(
                        "group relative flex items-center justify-center gap-2 py-2.5 px-3 sm:px-4 rounded-xl sm:rounded-full transition-all duration-200 cursor-pointer text-center select-none",
                        isActive
                          ? "bg-white text-[#151936] shadow-[0_4px_16px_rgba(0,0,0,0.2)] font-semibold"
                          : "text-slate-200 hover:text-white hover:bg-white/10 font-medium"
                      )}
                    >
                      <span className={cn(
                        "font-mono text-[11px] tracking-wider transition-colors",
                        isActive ? "text-[#151936] font-bold" : "text-slate-300/80 group-hover:text-slate-200"
                      )}>
                        {pillar.number}
                      </span>
                      <span className="text-[12.5px] sm:text-[13.5px] tracking-tight whitespace-nowrap">
                        {pillar.tabTitle}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Pillar Detail View */}
            <div className="space-y-8 pt-1">
              
              {/* Pillar Title */}
              <div className="space-y-3">
                <h3 className="font-editorial text-[26px] sm:text-[30px] font-medium text-ink-900 tracking-tight leading-[1.12]">
                  {currentPillar.title}
                </h3>

                <p className="text-[15px] sm:text-[15.5px] leading-relaxed text-ink-600 font-normal max-w-[58ch]">
                  {currentPillar.summary}
                </p>
              </div>

              {/* Unboxed Key Deliverables & Verification Editorial List */}
              <div className="pt-6 border-t border-line-soft">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-400 font-medium mb-5">
                  Key Deliverables & Verification
                </p>

                <div className="grid sm:grid-cols-2 gap-x-10 gap-y-5">
                  {currentPillar.specs.map((spec) => (
                    <div key={spec.title} className="space-y-1">
                      <div className="flex items-start gap-2.5">
                        <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 mt-0.5">
                          <CheckIcon size={11} stroke={WEB_ICON_STROKE} aria-hidden="true" />
                        </span>
                        <h4 className="text-[14px] font-medium text-ink-900 tracking-tight leading-snug">
                          {spec.title}
                        </h4>
                      </div>
                      <p className="pl-[26px] text-[12.5px] leading-relaxed text-ink-500 font-normal">
                        {spec.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Row */}
              <div className="pt-6 border-t border-line-soft flex flex-wrap items-center gap-4">
                <WebButtonLink
                  href="/landlords#valuation"
                  variant="primary"
                  size="lg"
                  className="bg-tertiary-gradient text-white shadow-md hover:brightness-110 border-0 px-7 py-3.5 rounded-full text-sm font-medium"
                >
                  Request Commercial Mandate
                </WebButtonLink>

                <Link
                  href="/properties/commercial"
                  className="inline-flex items-center gap-2 text-sm font-medium text-ink-700 hover:text-ink-900 transition-colors border border-line px-5 py-3 rounded-full hover:border-line-strong bg-white/70 shadow-2xs"
                >
                  <span>Browse Commercial Spaces</span>
                  <ArrowIcon size={14} stroke={WEB_ICON_STROKE} aria-hidden="true" />
                </Link>
              </div>

            </div>
          </div>

          {/* Right Column: Full-Height 4K Showcase with Home Hero Glass HUD (5 cols, sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="relative min-h-[640px] sm:min-h-[700px] lg:min-h-[760px] w-full rounded-[22px] overflow-hidden border border-line-soft bg-surface-2 group flex flex-col justify-center items-center p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
              
              {/* 4K Background Image */}
              <Image
                src="/images/services/commercial.jpg"
                alt="State-of-the-art commercial office tower and logistics business park in Nairobi"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                quality={100}
                unoptimized
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />

              {/* Multi-layered Cinematic Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/30 pointer-events-none" />

              {/* Bottom Floating Frosted Glass HUD Widget (Home Hero Vibe) */}
              <div className="relative z-10 rounded-[18px] border border-white/15 bg-black/30 backdrop-blur-xl p-5 sm:p-6 shadow-[0_24px_55px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.12)] text-white space-y-4">
                {/* HUD Header */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/10">
                  <div>
                    <p className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-brand-yellow font-semibold">
                      Commercial Benchmark Ledger
                    </p>
                    <p className="text-xs font-normal text-slate-200 mt-0.5">
                      Nairobi & Special Economic Zones
                    </p>
                  </div>
                  <span className="font-mono text-[10px] text-slate-300 uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded">
                    Institutional
                  </span>
                </div>

                {/* 2x2 High-Contrast Monospace Stat Grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-4 pt-1">
                  {KEY_METRICS.map((metric) => (
                    <div key={metric.label} className="space-y-1">
                      <div className="font-mono text-[26px] sm:text-[30px] font-medium tracking-tight text-white leading-none">
                        {metric.value}
                      </div>
                      <div className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-slate-300 font-medium pt-0.5">
                        {metric.label}
                      </div>
                      <div className="text-[11px] text-slate-300/80 font-normal leading-snug">
                        {metric.sub}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footnote Reassurance Line */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300 font-mono">
                  <span className="flex items-center gap-1.5">
                    <ShieldIcon size={12} stroke={WEB_ICON_STROKE} className="text-emerald-400 shrink-0" />
                    <span>Commercial Lease Governance</span>
                  </span>
                  <span className="text-slate-400">Open-Book Audited</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
