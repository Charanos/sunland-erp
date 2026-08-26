"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { WEB_ICON_STROKE, webIcons } from "../icons";
import { WebButtonLink } from "../primitives/button";

const TRANSACTION_PILLARS = [
  {
    id: "sales",
    number: "01",
    tabTitle: "Prime Sales",
    microTag: "CMA & Buyer Vetting",
    title: "Prime Residential Sales & Buyer Qualification",
    sla: "SLA: Certified CMA Valuation Included",
    icon: "home" as const,
    summary: "Precision pricing, 4K editorial marketing, and institutional buyer verification ensuring maximum capital realization without protracted days on market.",
    specs: [
      {
        title: "Evidence-Based CMA Pricing",
        desc: "Valuation backed by real Land Registry settled transactions and comparable market absorption rates.",
      },
      {
        title: "Editorial 4K Media & Drone Production",
        desc: "Architectural photography, cinematic video walkthroughs, and bespoke print marketing dossiers.",
      },
      {
        title: "Strict Buyer KYC & Funding Clearance",
        desc: "Pre-qualification of bank loan guarantees or certified proof of liquid funds before viewing.",
      },
      {
        title: "Direct Advocate Conveyancing Liaison",
        desc: "End-to-end management of sale agreements, rates clearances, and Land Registry title transfers.",
      },
    ],
  },
  {
    id: "letting",
    number: "02",
    tabTitle: "High-Yield Letting",
    microTag: "14-Day Placement",
    title: "Accelerated Letting & Tenant Onboarding",
    sla: "SLA: < 14 Days Avg. Placement",
    icon: "key" as const,
    summary: "Targeted multi-channel marketing targeting diplomatic missions, multinationals, and vetted corporate executives with zero tenant placement fees under management.",
    specs: [
      {
        title: "Multi-Portal & ERP Syndication",
        desc: "Simultaneous distribution across premier property portals, ERP database, and expat networks.",
      },
      {
        title: "Metropol CRB & Income Clearance",
        desc: "48-hour credit scoring, employer confirmation, and certified bank statement audits.",
      },
      {
        title: "Legally Enforceable Tenancy Agreements",
        desc: "Digital lease contracts drafted in strict compliance with Kenya tenancy legislation.",
      },
      {
        title: "Security Deposit Escrow Account",
        desc: "Ring-fenced deposit administration with photographic move-in inventory check-ins.",
      },
    ],
  },
  {
    id: "off-market",
    number: "03",
    tabTitle: "Off-Market Mandates",
    microTag: "Private Portfolio",
    title: "Confidential & Off-Market Portfolio Disposals",
    sla: "SLA: Strict NDA Protection",
    icon: "shield" as const,
    summary: "Discreet transaction handling for ultra-high-net-worth individuals, institutional funds, and family offices seeking private acquisition or disposal without public portal indexing.",
    specs: [
      {
        title: "Private Investor Matching",
        desc: "Direct presentation to pre-cleared family offices and institutional acquisition funds.",
      },
      {
        title: "Non-Disclosure Governance",
        desc: "Mandatory NDA execution prior to sharing property identifiers, yield ledgers, or floor plans.",
      },
      {
        title: "Block & Bulk Unit Packaging",
        desc: "Commercial structuring of whole multi-family residential blocks and commercial floors.",
      },
      {
        title: "Cross-Border Expatriate Routing",
        desc: "Direct marketing to Kenyan diaspora and international investors via banking partner desks.",
      },
    ],
  },
  {
    id: "settlement",
    number: "04",
    tabTitle: "Escrow & Closing",
    microTag: "Deed & Tax Settlement",
    title: "Transaction Escrow, Tax & Title Conveyancing",
    sla: "SLA: 100% Audit Settlement",
    icon: "doc" as const,
    summary: "Flawless legal settlement with comprehensive handling of KRA Capital Gains Tax (CGT), Stamp Duty valuation assessments, and secure closing escrow.",
    specs: [
      {
        title: "Capital Gains Tax (CGT) Advisory",
        desc: "Accurate computation and filing coordination for statutory KRA Capital Gains Tax obligations.",
      },
      {
        title: "Land Control Board Approvals",
        desc: "Expedited LCB clearances for freehold and agricultural parcels across Nairobi peri-urban zones.",
      },
      {
        title: "Sectional Title Splitting Coordination",
        desc: "Guidance on conversion of sub-leases to Sectional Properties Act 2020 titles.",
      },
      {
        title: "Completion Escrow Safeguards",
        desc: "Disbursement management ensuring funds release only upon confirmed title registration.",
      },
    ],
  },
] as const;

const KEY_METRICS = [
  {
    value: "2.5%",
    label: "Sale commission",
    sub: "Transparent institutional mandate",
  },
  {
    value: "1 Mo",
    label: "Letting placement",
    sub: "Included free under management",
  },
  {
    value: "14 Days",
    label: "Days on market",
    sub: "Average placement turnaround",
  },
  {
    value: "98.6%",
    label: "Achieved ratio",
    sub: "Asking-to-achieved price accuracy",
  },
];

export function SalesLettingService() {
  const [activePillar, setActivePillar] = useState<number>(0);
  const ArrowIcon = webIcons.arrow;
  const CheckIcon = webIcons.check;
  const ShieldIcon = webIcons.shield;

  const currentPillar = TRANSACTION_PILLARS[activePillar];

  return (
    <section
      id="letting"
      aria-labelledby="letting-heading"
      className="scroll-mt-20 border-b border-line py-20 lg:py-28 bg-surface-1"
    >
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12 xl:px-14">
        {/* Section Header: Serif Title Left (7 cols), Narrative Right (5 cols) */}
        <div
          data-reveal-group
          className="grid gap-8 lg:grid-cols-12 lg:items-end pb-12 border-b border-line-soft"
        >
          {/* Left Column: Main Serif Title */}
          <div className="lg:col-span-7">
            <h2
              id="letting-heading"
              className="font-editorial text-[clamp(2.25rem,3.8vw,3.5rem)] font-medium leading-[1.08] tracking-tight text-ink-900 text-balance"
            >
              Strategic sales and high-yield letting execution
            </h2>
          </div>

          {/* Right Column: Eyebrow + Narrative Context */}
          <div className="lg:col-span-5 space-y-4 lg:pl-4">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-brand-yellow" />
              <p className="font-mono text-web-micro uppercase tracking-[0.22em] text-ink-900 font-medium">
                Practice 02 · Transaction Execution
              </p>
            </div>
            <p className="text-web-sm sm:text-web-body leading-relaxed text-ink-500 font-normal max-w-[48ch]">
              Whether selling a trophy residence or securing a high-yield tenant, we engineer transactions with data-driven pricing, vetted counterparties, and seamless legal settlement.
            </p>
          </div>
        </div>

        {/* Main Content Grid: Interactive Machinery Left, 4K Visuals Right (Alternating Cadence) */}
        <div className="mt-14 grid gap-14 lg:gap-20 lg:grid-cols-12 lg:items-start">
          
          {/* Left Column: Interactive Machinery (7 cols) */}
          <div className="lg:col-span-7 space-y-9">
            
            {/* Header and Control Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-line-soft">
              <span className="font-mono text-web-micro uppercase tracking-[0.2em] text-ink-400 font-medium">
                Transaction Machinery
              </span>
              <span className="font-mono text-web-micro uppercase tracking-wider text-ink-900 font-medium">
                4 Execution Protocols
              </span>
            </div>

            {/* Desktop Nav Style Tertiary-Glass Capsule Tab Selector */}
            <div className="relative rounded-2xl sm:rounded-full border border-white/15 bg-tertiary-gradient-glass p-1.5 shadow-[0_16px_40px_rgba(12,31,36,0.25),inset_0_1px_1px_rgba(255,255,255,0.12)] backdrop-blur-2xl">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-1.5">
                {TRANSACTION_PILLARS.map((pillar, idx) => {
                  const isActive = activePillar === idx;
                  return (
                    <button
                      key={pillar.id}
                      type="button"
                      onClick={() => setActivePillar(idx)}
                      className={cn(
                        "group relative flex items-center justify-center gap-2 py-2.5 px-3 sm:px-4 rounded-xl sm:rounded-full transition-all duration-200 cursor-pointer text-center select-none",
                        isActive
                          ? "bg-white text-ink-900 shadow-[0_4px_16px_rgba(0,0,0,0.2)] font-semibold"
                          : "text-slate-200 hover:text-white hover:bg-white/10 font-medium"
                      )}
                    >
                      <span className={cn(
                        "font-mono text-web-micro tracking-wider transition-colors",
                        isActive ? "text-ink-900 font-bold" : "text-slate-300/80 group-hover:text-slate-200"
                      )}>
                        {pillar.number}
                      </span>
                      <span className="text-web-micro sm:text-web-xs tracking-tight whitespace-nowrap">
                        {pillar.tabTitle}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Pillar Detail View */}
            <div className="space-y-8 pt-1">
              
              {/* Pillar Title & SLA Tag */}
              <div className="space-y-3">
                <h3 className="font-editorial text-[26px] sm:text-[30px] font-medium text-ink-900 tracking-tight leading-[1.12]">
                  {currentPillar.title}
                </h3>

                <p className="text-web-sm sm:text-web-sm leading-relaxed text-ink-600 font-normal max-w-[58ch]">
                  {currentPillar.summary}
                </p>
              </div>

              {/* Unboxed Key Deliverables & Verification Editorial List */}
              <div className="pt-6 border-t border-line-soft">
                <p className="font-mono text-web-nano uppercase tracking-[0.2em] text-ink-400 font-medium mb-5">
                  Key Deliverables & Verification
                </p>

                <div className="grid sm:grid-cols-2 gap-x-10 gap-y-5">
                  {currentPillar.specs.map((spec) => (
                    <div key={spec.title} className="space-y-1">
                      <div className="flex items-start gap-2.5">
                        <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700 mt-0.5">
                          <CheckIcon size={11} stroke={WEB_ICON_STROKE} aria-hidden="true" />
                        </span>
                        <h4 className="text-web-sm font-medium text-ink-900 tracking-tight leading-snug">
                          {spec.title}
                        </h4>
                      </div>
                      <p className="pl-[26px] text-web-micro leading-relaxed text-ink-500 font-normal">
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
                  Instruct a Sale / Letting Mandate
                </WebButtonLink>

                <Link
                  href="/properties"
                  className="inline-flex items-center gap-2 text-sm font-medium text-ink-700 hover:text-ink-900 transition-colors border border-line px-5 py-3 rounded-full hover:border-line-strong bg-white/70 shadow-2xs"
                >
                  <span>Browse Active Listings</span>
                  <ArrowIcon size={14} stroke={WEB_ICON_STROKE} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Full-Height 4K Showcase with Home Hero Glass HUD (5 cols, sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="relative min-h-[640px] sm:min-h-[700px] lg:min-h-[760px] w-full rounded-[22px] overflow-hidden border border-line-soft bg-surface-2 group flex flex-col justify-between p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
              
              {/* 4K Background Image */}
              <Image
                src="/images/services/sales-letting.jpg"
                alt="Architectural luxury villa in Karen Nairobi marketed by Sunland"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                quality={90}
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />

              {/* Multi-layered Cinematic Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/30 pointer-events-none" />

              {/* Top Floating Telemetry Status Pill */}
              <div className="relative z-10 flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3.5 py-1.5 backdrop-blur-md text-white text-xs font-mono tracking-wider shadow-sm">
                  <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse" />
                  <span>ACTIVE TRANSACTION DESK</span>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-web-micro font-mono text-slate-200 backdrop-blur-md">
                  <span>KES 1.8B Transacted</span>
                </div>
              </div>

              {/* Bottom Floating Frosted Glass HUD Widget (Home Hero Vibe) */}
              <div className="relative z-10 rounded-[18px] border border-white/15 bg-black/30 backdrop-blur-xl p-5 sm:p-6 shadow-[0_24px_55px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.12)] text-white space-y-4">
                {/* HUD Header */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/10">
                  <div>
                    <p className="font-mono text-web-nano uppercase tracking-[0.22em] text-brand-yellow font-semibold">
                      Transaction Benchmark Ledger
                    </p>
                    <p className="text-xs font-normal text-slate-200 mt-0.5">
                      Karen · Runda · Muthaiga · Nyali
                    </p>
                  </div>
                  <span className="font-mono text-web-nano text-slate-300 uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded">
                    Prime Metrics
                  </span>
                </div>

                {/* 2x2 High-Contrast Monospace Stat Grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-4 pt-1">
                  {KEY_METRICS.map((metric) => (
                    <div key={metric.label} className="space-y-1">
                      <div className="font-mono text-[26px] sm:text-[30px] font-medium tracking-tight text-white leading-none">
                        {metric.value}
                      </div>
                      <div className="font-mono text-web-nano uppercase tracking-[0.14em] text-slate-300 font-medium pt-0.5">
                        {metric.label}
                      </div>
                      <div className="text-web-micro text-slate-300/80 font-normal leading-snug">
                        {metric.sub}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footnote Reassurance Line */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-web-micro text-slate-300 font-mono">
                  <span className="flex items-center gap-1.5">
                    <ShieldIcon size={12} stroke={WEB_ICON_STROKE} className="text-emerald-400 shrink-0" />
                    <span>Conveyancing Liaison Included</span>
                  </span>
                  <span className="text-slate-400">Escrow Safeguards</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
