"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { WEB_ICON_STROKE, webIcons } from "../icons";
import { WebButtonLink } from "../primitives/button";

const VALUATION_PILLARS = [
  {
    id: "appraisals",
    number: "01",
    tabTitle: "Market Appraisals",
    microTag: "Letting & Sale Pricing",
    title: "Comparative Market Analysis & Disposal Appraisals",
    icon: "chart" as const,
    summary: "Evidence-based market pricing derived from real settled Land Registry transactions and yield analytics across Nairobi & Coastal corridors, rather than speculative asking rates.",
    specs: [
      {
        title: "Verified Land Registry Comparables",
        desc: "Historical transaction data analysis filtering out aspirational portal asking rates.",
      },
      {
        title: "Yield & Absorption Rate Modeling",
        desc: "Rental yield forecasting, vacancy duration velocity, and tenant demand modeling.",
      },
      {
        title: "Physical Asset Condition Audit",
        desc: "On-site structural evaluation, specification assessment, and capital appreciation factors.",
      },
      {
        title: "Complimentary 48-Hour Appraisal",
        desc: "Zero-fee preliminary valuation report for prospective vendors, landlords, and asset owners.",
      },
    ],
  },
  {
    id: "mortgage",
    number: "02",
    tabTitle: "Bank & Mortgage",
    microTag: "Institutional Lending",
    title: "Bank Secured Lending & Mortgage Valuations",
    icon: "shield" as const,
    summary: "Certified valuation dossiers structured for commercial banks, SACCOs, and institutional mortgage providers compliant with Central Bank of Kenya lending covenants.",
    specs: [
      {
        title: "Tier-1 Bank Panel Formats",
        desc: "Standardized reporting fully accepted by major financial institutions and credit risk committees.",
      },
      {
        title: "Open Market & Forced Sale Values",
        desc: "Definitive Open Market Valuation (OMV) and Forced Sale Valuation (FSV) calculations.",
      },
      {
        title: "Title Deed & Cadastral Verification",
        desc: "Official registry searches, survey boundary checks, and beacon re-establishment verification.",
      },
      {
        title: "3-Day Fast-Track Delivery",
        desc: "Expedited report submission directly to your bank's credit risk underwriting department.",
      },
    ],
  },
  {
    id: "statutory",
    number: "03",
    tabTitle: "Statutory & Probate",
    microTag: "Legal & Tax Advisory",
    title: "Court Probate, Succession & Statutory Tax Valuations",
    icon: "doc" as const,
    summary: "Legally enforceable valuation schedules for High Court probate succession, compulsory acquisition claims, and KRA Capital Gains Tax baseline determination.",
    specs: [
      {
        title: "High Court Probate Recognition",
        desc: "Certified estate distribution schedules compliant with the Law of Succession Act.",
      },
      {
        title: "KRA Capital Gains Tax Baselines",
        desc: "Definitive market value baselines for Stamp Duty assessment and Capital Gains Tax filings.",
      },
      {
        title: "Compulsory Acquisition Representation",
        desc: "Expert representation and compensation negotiation under the National Land Commission framework.",
      },
      {
        title: "Insurance Reinstatement Costing",
        desc: "Accurate replacement cost calculations protecting asset owners against under-insurance penalties.",
      },
    ],
  },
  {
    id: "portfolio",
    number: "04",
    tabTitle: "Portfolio Audits",
    microTag: "Multi-Unit DCF Modeling",
    title: "Institutional Portfolio & Balance Sheet Asset Audits",
    icon: "coin" as const,
    summary: "Rigorous discounted cash flow (DCF) yield modeling and balance sheet asset audits for institutional developers, real estate funds, REITs, and multi-asset landlords.",
    specs: [
      {
        title: "Discounted Cash Flow (DCF) Yield Modeling",
        desc: "Net Present Value (NPV) and Internal Rate of Return (IRR) multi-year cash flow projections.",
      },
      {
        title: "Highest & Best Use (HBU) Studies",
        desc: "Feasibility appraisals for commercial development, greenfield plots, and redevelopment parcels.",
      },
      {
        title: "Sectional Properties Act 2020 Audits",
        desc: "Valuation of individual sectional unit shares and undivided common property rights.",
      },
      {
        title: "IFRS-Compliant Balance Sheet Revaluation",
        desc: "Fair value assessments fully compliant with International Financial Reporting Standards.",
      },
    ],
  },
] as const;

const KEY_METRICS = [
  {
    value: "FREE",
    label: "Market appraisal",
    sub: "Complimentary preliminary review",
  },
  {
    value: "3 Days",
    label: "Turnaround time",
    sub: "Fast-track formal valuation dossier",
  },
  {
    value: "100%",
    label: "Bank acceptance",
    sub: "Tier-1 bank & mortgage approved",
  },
  {
    value: "KES 0",
    label: "Hidden disbursements",
    sub: "Transparent upfront quotation",
  },
];

export function ValuationService() {
  const [activePillar, setActivePillar] = useState<number>(0);
  const ArrowIcon = webIcons.arrow;
  const CheckIcon = webIcons.check;
  const ShieldIcon = webIcons.shield;

  const currentPillar = VALUATION_PILLARS[activePillar];

  return (
    <section
      id="valuation"
      aria-labelledby="valuation-heading"
      className="scroll-mt-20 border-b border-line py-20 lg:py-28 bg-surface-0"
    >
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12 xl:px-14">
        {/* Section Header: Narrative Left (5 cols), Serif Title Right (7 cols) */}
        <div
          data-reveal-group
          className="grid gap-8 lg:grid-cols-12 lg:items-end pb-12 border-b border-line-soft"
        >
          {/* Left Column: Eyebrow + Narrative Context */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-brand-yellow" />
              <p className="font-mono text-web-micro uppercase tracking-[0.22em] text-ink-900 font-medium">
                Practice 03 · Valuation & Advisory
              </p>
            </div>
            <p className="text-web-sm sm:text-web-body leading-relaxed text-ink-500 font-normal max-w-[48ch]">
              A written figure grounded in empirical market reality rather than speculative asking prices. Certified by registered valuers for bank lending, court probate, tax compliance, and portfolio audits.
            </p>
          </div>

          {/* Right Column: Main Serif Title */}
          <div className="lg:col-span-7 lg:pl-2">
            <h2
              id="valuation-heading"
              className="font-editorial text-right text-[clamp(2.25rem,3.8vw,3.5rem)] font-medium leading-[1.08] tracking-tight text-ink-900 text-balance"
            >
              Property valuation grounded in empirical market reality
            </h2>
          </div>
        </div>

        {/* Main Content Grid: Visuals Left, Interactive Machinery Right (Matching Service 01) */}
        <div className="mt-14 grid gap-14 lg:gap-20 lg:grid-cols-12 lg:items-start">
          
          {/* Left Column: Full-Height 4K Showcase with Home Hero Glass HUD (5 cols, sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="relative min-h-[640px] sm:min-h-[700px] lg:min-h-[760px] w-full rounded-[22px] overflow-hidden border border-line-soft bg-surface-2 group flex flex-col justify-between p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
              
              {/* 4K Background Image */}
              <Image
                src="/images/services/valuation.jpg"
                alt="Executive real estate valuer and surveyor in Nairobi"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                quality={90}
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />

              {/* Multi-layered Cinematic Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-black/30 pointer-events-none" />

              {/* Bottom Floating Frosted Glass HUD Widget (Home Hero Vibe) */}
              <div className="relative z-10 rounded-[18px] border border-white/15 bg-black/30 backdrop-blur-xl p-5 sm:p-6 shadow-[0_24px_55px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.12)] text-white space-y-4">
                {/* HUD Header */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/10">
                  <div>
                    <p className="font-mono text-web-nano uppercase tracking-[0.22em] text-brand-yellow font-semibold">
                      Valuation Benchmark Ledger
                    </p>
                    <p className="text-xs font-normal text-slate-200 mt-0.5">
                      Institution of Surveyors of Kenya
                    </p>
                  </div>
                  <span className="font-mono text-web-nano text-slate-300 uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded">
                    Certified
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
                    <span>Valuers Act Cap 532 Licensed</span>
                  </span>
                  <span className="text-slate-400">ISK Registered</span>
                </div>
              </div>

              

              {/* Top Floating Telemetry Status Pill */}
              <div className="relative z-10 flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3.5 py-1.5 backdrop-blur-md text-white text-xs font-mono tracking-wider shadow-sm">
                  <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse motion-reduce:animate-none" />
                  <span>CERTIFIED VALUATION DESK</span>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-web-micro font-mono text-slate-200 backdrop-blur-md">
                  <span>VRB & ISK Accredited</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Machinery (7 cols) */}
          <div className="lg:col-span-7 space-y-9 lg:pl-2">
            
            {/* Header and Control Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-line-soft">
              <span className="font-mono text-web-micro uppercase tracking-[0.2em] text-ink-400 font-medium">
                Valuation Advisory Machinery
              </span>
              <span className="font-mono text-web-micro uppercase tracking-wider text-ink-900 font-medium">
                4 Certified Practices
              </span>
            </div>

            {/* Desktop Nav Style Tertiary-Glass Capsule Tab Selector */}
            <div className="relative rounded-2xl sm:rounded-full border border-white/15 bg-tertiary-gradient-glass p-1.5 shadow-[0_16px_40px_rgba(12,31,36,0.25),inset_0_1px_1px_rgba(255,255,255,0.12)] backdrop-blur-2xl">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-1.5">
                {VALUATION_PILLARS.map((pillar, idx) => {
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
                        isActive ? "text-ink-900 font-semibold" : "text-slate-300/80 group-hover:text-slate-200"
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
              
              {/* Pillar Title - Right Aligned */}
              <div className="space-y-3 text-right">
                <h3 className="font-editorial text-[26px] sm:text-[30px] font-medium text-ink-900 tracking-tight leading-[1.12]">
                  {currentPillar.title}
                </h3>

                <p className="text-web-sm sm:text-web-sm leading-relaxed text-ink-600 font-normal max-w-[58ch] ml-auto">
                  {currentPillar.summary}
                </p>
              </div>

              {/* Unboxed Key Deliverables & Verification Editorial List */}
              <div className="pt-6 border-t border-line-soft">
                <p className="font-mono text-web-nano uppercase tracking-[0.2em] text-ink-400 font-medium mb-5 text-right">
                  Key Deliverables & Verification
                </p>

                <div className="grid sm:grid-cols-2 gap-x-10 gap-y-5">
                  {currentPillar.specs.map((spec) => (
                    <div key={spec.title} className="space-y-1 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <h4 className="text-web-sm font-medium text-ink-900 tracking-tight leading-snug">
                          {spec.title}
                        </h4>
                        <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700">
                          <CheckIcon size={11} stroke={WEB_ICON_STROKE} aria-hidden="true" />
                        </span>
                      </div>
                      <p className="text-web-micro leading-relaxed text-ink-500 font-normal">
                        {spec.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Row - Right Aligned for Uniformity */}
              <div className="pt-6 border-t border-line-soft flex flex-wrap items-center justify-end gap-4">
                <Link
                  href="/landlords"
                  className="inline-flex items-center gap-2 text-sm font-medium text-ink-700 hover:text-ink-900 transition-colors border border-line px-5 py-3 rounded-full hover:border-line-strong bg-white/70 shadow-2xs"
                >
                  <span>Explore Landlord Suite</span>
                  <ArrowIcon size={14} stroke={WEB_ICON_STROKE} aria-hidden="true" />
                </Link>

                <WebButtonLink
                  href="/landlords#valuation"
                  variant="primary"
                  size="lg"
                  className="bg-tertiary-gradient text-white shadow-md hover:brightness-110 border-0 px-7 py-3.5 rounded-full text-sm font-medium"
                >
                  Request Valuation Appraisal
                </WebButtonLink>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
