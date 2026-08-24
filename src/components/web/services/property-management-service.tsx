"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { WEB_ICON_STROKE, webIcons } from "../icons";
import { WebButtonLink } from "../primitives/button";

const MANAGEMENT_PILLARS = [
  {
    id: "vetting",
    number: "01",
    tabTitle: "Tenant Vetting",
    microTag: "CRB & KYC Screening",
    title: "Institutional Tenant Onboarding & Vetting",
    sla: "SLA: 48h Metropol CRB Verification",
    icon: "userCheck" as const,
    summary: "Rigorous institutional vetting before keys are handed over, protecting capital yield, asset integrity, and community stability.",
    specs: [
      {
        title: "CRB Credit & Default Screening",
        desc: "Metropol credit bureau scoring and historical arrears cross-referencing.",
      },
      {
        title: "Income & Employer Verification",
        desc: "Formal employer confirmation and 6-month certified bank statement analysis.",
      },
      {
        title: "Prior Landlord KYC Reference",
        desc: "Direct verification with previous property managers and government ID/PIN clearance.",
      },
      {
        title: "Statutory Lease Execution",
        desc: "Legally enforceable digital lease agreements registered under Kenya Law.",
      },
    ],
  },
  {
    id: "financial",
    number: "02",
    tabTitle: "Financial Core",
    microTag: "5th Guaranteed Remittance",
    title: "Financial Governance & 5th Remittance",
    sla: "SLA: Disbursed by 5th Monthly",
    icon: "coin" as const,
    summary: "Guaranteed monthly cash flow with automated bank/M-Pesa reconciliation and zero undocumented deductions.",
    specs: [
      {
        title: "Guaranteed 5th Remittance",
        desc: "Automated disbursement directly to your bank account or M-Pesa on/before the 5th.",
      },
      {
        title: "ERP Paybill Webhook Matching",
        desc: "Automated instant rent reconciliation eliminating manual deposit slips.",
      },
      {
        title: "Escrow & Utility Administration",
        desc: "Dedicated escrow accounting for water, KPLC, service charge, and security.",
      },
      {
        title: "Live Landlord Ledger & PDF Exports",
        desc: "24/7 access to your real-time unit ledgers with downloadable monthly statements.",
      },
    ],
  },
  {
    id: "facilities",
    number: "03",
    tabTitle: "Facilities ERP",
    microTag: "Photo Work Orders",
    title: "Facilities & Photo Work Orders",
    sla: "SLA: Zero Contractor Markup",
    icon: "wrench" as const,
    summary: "Transparent maintenance with photographic proof on every repair and pre-negotiated contractor rates with zero markup.",
    specs: [
      {
        title: "Timestamped Photo Dossiers",
        desc: "Before-and-after photographic evidence attached to every single repair invoice.",
      },
      {
        title: "KES 10,000 Approval Threshold",
        desc: "Strict automated cap; any expenditure above KES 10,000 requires 1-click landlord signoff.",
      },
      {
        title: "Direct Contractor Pricing",
        desc: "Zero contractor markup — you pay the exact verified tradesman invoice rate.",
      },
      {
        title: "24/7 Emergency Rapid Response",
        desc: "Immediate on-site containment for plumbing bursts, power faults, and structural issues.",
      },
    ],
  },
  {
    id: "legal",
    number: "04",
    tabTitle: "Legal & Tax",
    microTag: "Sectional Act & KRA",
    title: "Legal, Statutory & Tax Compliance",
    sla: "SLA: Sectional Properties Act 2020",
    icon: "doc" as const,
    summary: "Comprehensive compliance with statutory property laws, tenancy legislation, and KRA withholding tax requirements.",
    specs: [
      {
        title: "Statutory Law Compliance",
        desc: "Full alignment with Sectional Properties Act 2020 and Landlord & Tenant Act.",
      },
      {
        title: "Formal Arrears Escalation",
        desc: "Strict statutory demand notices and structured dispute resolution protocols.",
      },
      {
        title: "Annual KRA Tax Schedules",
        desc: "Automated withholding tax and annual rental income tax computation schedules.",
      },
      {
        title: "Digital Move-In/Out Inventories",
        desc: "Comprehensive photographic condition inventories signed digitally at handover.",
      },
    ],
  },
] as const;

const KEY_METRICS = [
  {
    value: "10%",
    label: "Management fee",
    sub: "Of rent collected (8% for 10+ units)",
    highlight: "Standard Tier",
  },
  {
    value: "5th",
    label: "Guaranteed remittance",
    sub: "Disbursed monthly via RTGS / M-Pesa",
    highlight: "Guaranteed SLA",
  },
  {
    value: "0%",
    label: "Tenant finding fee",
    sub: "Included free with management mandate",
    highlight: "Zero Placement Fee",
  },
  {
    value: "60 Days",
    label: "Notice period",
    sub: "Either party, zero exit penalties",
    highlight: "Zero Lock-in",
  },
];

export function PropertyManagementService() {
  const [activePillar, setActivePillar] = useState<number>(0);
  const ArrowIcon = webIcons.arrow;
  const CheckIcon = webIcons.check;
  const ShieldIcon = webIcons.shield;
  const PhoneIcon = webIcons.phone;

  const currentPillar = MANAGEMENT_PILLARS[activePillar];

  return (
    <section
      id="management"
      aria-labelledby="management-heading"
      className="scroll-mt-20 border-b border-line py-20 lg:py-28 bg-surface-0"
    >
      <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12 xl:px-14">
        {/* Section Header: Narrative Left (5 cols), Serif Title Right (7 cols) */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end pb-12 border-b border-line-soft">
          {/* Left Column: Eyebrow + Narrative Context */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-brand-yellow" />
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-900 font-medium">
                Practice 01 · Full Asset Lifecycle
              </p>
            </div>
            <p className="text-[15.5px] sm:text-[16.5px] leading-relaxed text-ink-500 font-normal max-w-[48ch]">
              We take the entire operational weight off your shoulders. Every property is assigned a named manager, every transaction is backed by real-time ERP auditing, and rent is remitted on the 5th without exception.
            </p>
          </div>

          {/* Right Column: Main Serif Title */}
          <div className="lg:col-span-7 lg:pl-2">
            <h2
              id="management-heading"
              className="font-editorial lg:text-right text-[clamp(2.25rem,3.8vw,3.5rem)] font-medium leading-[1.08] tracking-tight text-ink-900 text-balance"
            >
              Property management engineered for absolute certainty
            </h2>
          </div>
        </div>

        {/* Main Content Grid: Visuals Left, Interactive Machinery Right */}
        <div className="mt-14 grid gap-14 lg:gap-20 lg:grid-cols-12 lg:items-start">
          
          {/* Left Column (Flipped): Full-Height 4K Showcase with Home Hero Glass HUD (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="relative min-h-[640px] sm:min-h-[700px] lg:min-h-[780px] w-full rounded-[22px] overflow-hidden border border-line-soft bg-surface-2 group flex flex-col justify-center items-center p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
              
              {/* 4K Background Image */}
              <Image
                src="/images/services/property-management.jpg"
                alt="High-end managed apartment interior in Nairobi"
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
                      Portfolio Benchmark Ledger
                    </p>
                    <p className="text-xs font-normal text-slate-200 mt-0.5">
                      Kilimani · Lavington · Riverside · Westlands
                    </p>
                  </div>
                  <span className="font-mono text-[10px] text-slate-300 uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded">
                    Live Telemetry
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
                    <span>Contractual SLA Guaranteed</span>
                  </span>
                  <span className="text-slate-400">Zero Exit Penalties</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Flipped): Interactive Pillar Machinery (7 cols) */}
          <div className="lg:col-span-7 space-y-9 lg:pl-2">
            
            {/* Header and Control Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-line-soft">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-400 font-medium">
                Operational Core Machinery
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-ink-900 font-medium">
                4 Active Safeguards
              </span>
            </div>

            {/* Architectural Practice Selector Index */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 border-b border-line-soft pb-6">
              {MANAGEMENT_PILLARS.map((pillar, idx) => {
                const isActive = activePillar === idx;
                return (
                  <button
                    key={pillar.id}
                    type="button"
                    onClick={() => setActivePillar(idx)}
                    className={cn(
                      "group relative text-left pt-2 transition-all duration-200 cursor-pointer",
                      isActive ? "text-ink-900" : "text-ink-400 hover:text-ink-700"
                    )}
                  >
                    {/* Top Architectural Indicator Rule */}
                    <div className={cn(
                      "h-[2px] w-full transition-all duration-300 mb-3",
                      isActive ? "bg-brand-dark" : "bg-line-soft group-hover:bg-line"
                    )} />

                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(
                        "font-mono text-[11px] tracking-wider transition-colors",
                        isActive ? "text-brand-dark font-medium" : "text-ink-400 group-hover:text-ink-600"
                      )}>
                        {pillar.number}
                      </span>
                      <span className={cn(
                        "font-mono text-[9.5px] uppercase tracking-widest transition-colors line-clamp-1",
                        isActive ? "text-ink-500 font-medium" : "text-ink-300 group-hover:text-ink-400"
                      )}>
                        {pillar.microTag}
                      </span>
                    </div>

                    <div className={cn(
                      "text-[14.5px] sm:text-[15.5px] font-medium leading-snug tracking-tight transition-colors",
                      isActive ? "text-ink-900 font-medium" : "text-ink-500 group-hover:text-ink-800"
                    )}>
                      {pillar.tabTitle}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Pillar Detail View */}
            <div className="space-y-8 pt-1">
              
              {/* Pillar Title & SLA Tag */}
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
                  Request Management Valuation
                </WebButtonLink>

                <Link
                  href="/landlords"
                  className="inline-flex items-center gap-2 text-sm font-medium text-ink-700 hover:text-ink-900 transition-colors border border-line px-5 py-3 rounded-full hover:border-line-strong bg-white/70 shadow-2xs"
                >
                  <span>Explore Landlord Suite</span>
                  <ArrowIcon size={14} stroke={WEB_ICON_STROKE} aria-hidden="true" />
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
