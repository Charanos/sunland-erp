import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { LANDLORDS } from "../constants/landlords.content";
import { WEB_ICON_STROKE, webIcons } from "../icons";
import { WebButtonLink } from "../primitives/button";
import { Container } from "../primitives/container";
import { Eyebrow } from "../primitives/eyebrow";
import { SectionBand } from "../primitives/section-band";
import { LandlordRentChart } from "./landlord-chart";

/**
 * The landlord hub, section by section, from the Claude Design template.
 *
 * Split into named sections in one file rather than one component per file:
 * they are only ever composed in this order, on this page, and eight files
 * that each import the same three primitives is worse to read than one.
 */

/** Shared section intro: rule, eyebrow, title, optional lead. */
function SectionIntro({
  eyebrow,
  title,
  lead,
  id,
  tone = "light",
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  id: string;
  tone?: "light" | "dark";
}) {
  const isDark = tone === "dark";

  return (
    <div className="mb-12 max-w-4xl" data-reveal>
      <Eyebrow tone={isDark ? "dark" : "light"}>{eyebrow}</Eyebrow>
      <h2
        id={id}
        className={cn(
          "mt-4 font-editorial text-[clamp(2.25rem,3.8vw,3.6rem)] font-medium leading-[1.1] tracking-tight",
          isDark ? "text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]" : "text-ink-900"
        )}
      >
        {title}
      </h2>
      {lead && (
        <p
          className={cn(
            "web-subtitle mt-4 max-w-[72ch] text-web-sm sm:text-base leading-relaxed font-normal",
            isDark ? "text-slate-300/90" : "text-slate-600"
          )}
        >
          {lead}
        </p>
      )}
    </div>
  );
}

export { LandlordHero } from "./landlord-hero";


// ── 02 Promises ──────────────────────────────────────────────────────────────

export function LandlordPromises() {
  const CheckIcon = webIcons.check;
  const ShieldIcon = webIcons.shield;

  return (
    <SectionBand
      tone="light"
      labelledBy="promises-heading"
      className="!overflow-visible relative bg-white py-24 lg:py-32 border-b border-slate-200/80"
    >
      <div className="grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20 items-start">
        {/* Left Column: Sticky Editorial Heading & Guarantee Reassurance */}
        <div className="lg:sticky lg:top-32" data-reveal>
          <Eyebrow tone="light">{LANDLORDS.promises.eyebrow}</Eyebrow>
          <h2
            id="promises-heading"
            className="mt-4 font-editorial text-[clamp(2.5rem,4vw,3.75rem)] font-medium leading-[1.08] tracking-tight text-ink-900"
          >
            {LANDLORDS.promises.title}
          </h2>
          <p className="web-subtitle mt-4 text-web-sm sm:text-base leading-relaxed text-slate-600 max-w-[46ch]">
            {LANDLORDS.promises.lead}
          </p>

          {/* Institutional Trust Footnote */}
          <div className="mt-10 pt-8 border-t border-slate-200/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-700 font-mono">
              <ShieldIcon size={15} stroke={WEB_ICON_STROKE} className="text-emerald-600" />
              <span>Standard Mandate Protection</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed font-normal max-w-[42ch]">
              All service-level agreements, remittance deadlines, and expenditure thresholds are contractual obligations written directly into your management agreement.
            </p>
          </div>
        </div>

        {/* Right Column: Spacious Line-Divided Guarantee Rows */}
        <div className="border-t border-slate-200/90 divide-y divide-slate-200/90" data-reveal-group>
          {LANDLORDS.promises.cards.map((card) => {
            const IconComponent = webIcons[card.icon];

            return (
              <div key={card.title} className="py-8 sm:py-10 first:pt-6 last:pb-6 space-y-4">
                {/* Header Row: Icon + Title */}
                <div className="flex items-center gap-4">
                  <span
                    aria-hidden="true"
                    className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100/90 text-ink-900 shadow-xs"
                  >
                    <IconComponent size={20} stroke={WEB_ICON_STROKE} />
                  </span>
                  <h3 className="font-editorial text-2xl sm:text-[27px] font-medium leading-snug text-ink-900">
                    {card.title}
                  </h3>
                </div>

                {/* Body Narrative */}
                <p className="text-web-sm sm:text-web-sm leading-relaxed text-slate-600 font-normal pl-0 sm:pl-15">
                  {card.body}
                </p>

                {/* Concrete Deliverable Line */}
                <div className="pt-2 pl-0 sm:pl-15">
                  <div className="flex items-start gap-2 text-sm text-slate-800">
                    <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mt-0.5">
                      <CheckIcon size={11} stroke={2.5} />
                    </span>
                    <p className="leading-relaxed">
                      <strong className="font-medium text-ink-900">What you get:</strong>{" "}
                      <span className="text-slate-600">
                        {card.outcome.charAt(0).toUpperCase() + card.outcome.slice(1)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionBand>
  );
}

// ── 03 Timeline ──────────────────────────────────────────────────────────────

export function LandlordTimeline() {
  const ArrowIcon = webIcons.arrow;
  const CheckIcon = webIcons.check;

  const deliverables: Record<string, string> = {
    "Day 1": "Photographic condition audit & valuation comparables",
    "Day 2–3": "One clear mandate letter with your repair threshold",
    "Day 2-3": "One clear mandate letter with your repair threshold",
    "Week 1": "Syndicated multi-portal listing with HDR photography",
    "Offer": "Complete tenant vetting dossier & landlord references",
    "Monthly": "Itemised unit statement & direct disbursement",
    "Ongoing": "Quarterly photo inspections & 60-day renewal review",
  };

  return (
    <SectionBand
      tone="tint"
      id="how"
      labelledBy="timeline-heading"
      className="!overflow-visible relative bg-[#f8fafc] py-24 lg:py-32 border-b border-slate-200/80"
    >
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-20 items-start">
        {/* Left Column: Connected Architectural Timeline Spine */}
        <div className="relative" data-reveal-group>
          {/* Continuous vertical hairline spine */}
          <div
            aria-hidden="true"
            className="absolute left-[7px] sm:left-[9px] top-3 bottom-6 w-[1.5px] bg-slate-200/90"
          />

          <div className="space-y-12 sm:space-y-14">
            {LANDLORDS.timeline.steps.map((step, index) => (
              <div key={step.when} className="group relative flex gap-6 sm:gap-8 items-start">
                {/* Milestone Node Pin */}
                <div className="relative z-10 flex size-4 sm:size-5 shrink-0 items-center justify-center bg-[#f8fafc]">
                  <span className="size-2.5 rounded-full border-[1.5px] border-slate-300 bg-white transition-all duration-300 group-hover:scale-125 group-hover:border-ink-900 group-hover:bg-brand-dark" />
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  {/* Milestone Step Header */}
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-web-micro font-medium uppercase tracking-widest text-ink-900">
                      {step.when}
                    </span>
                    <span className="h-px w-6 bg-slate-200" />
                    <span className="font-mono text-web-nano uppercase tracking-widest text-slate-400 font-medium">
                      Milestone 0{index + 1}
                    </span>
                  </div>

                  {/* Milestone Title */}
                  <h3 className="font-editorial mt-2.5 text-[24px] sm:text-[27px] font-medium leading-snug text-ink-900">
                    {step.title}
                  </h3>

                  {/* Body Narrative */}
                  <p className="mt-2.5 text-web-sm leading-relaxed text-slate-600 font-normal max-w-[56ch]">
                    {step.body}
                  </p>

                  {/* Specific Deliverable Checkpoint */}
                  {deliverables[step.when] && (
                    <div className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-3 border-t border-slate-200/60 max-w-[56ch]">
                      <div className="flex items-center gap-1.5 text-emerald-700 font-mono text-web-micro uppercase tracking-wider font-medium">
                        <CheckIcon size={12} stroke={2.5} />
                        <span>Deliverable</span>
                      </div>
                      <span className="text-slate-300 hidden sm:inline">·</span>
                      <span className="text-web-sm text-slate-600 font-normal">
                        {deliverables[step.when]}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Sticky Editorial Context & Velocity Telemetry (Shifted to Right) */}
        <div className="lg:sticky lg:top-32 space-y-8" data-reveal>
          <div>
            <Eyebrow tone="light">{LANDLORDS.timeline.eyebrow}</Eyebrow>
            <h2
              id="timeline-heading"
              className="mt-4 font-editorial text-[clamp(2.5rem,4vw,3.75rem)] font-medium leading-[1.08] tracking-tight text-ink-900"
            >
              {LANDLORDS.timeline.title}
            </h2>
            <p className="web-subtitle mt-4 text-web-sm sm:text-base leading-relaxed text-slate-600 max-w-[44ch]">
              A transparent, milestone-driven lifecycle from initial appraisal to monthly dividend remittances. No silent gaps, no surprise deductions.
            </p>
          </div>

          {/* Asset Velocity Telemetry Strip */}
          <div className="grid grid-cols-2 gap-y-7 gap-x-8 border-t border-slate-200/80 pt-7">
            <div className="space-y-1.5">
              <div className="font-mono text-[28px] font-medium leading-none tracking-tight text-ink-900">
                18<span className="text-sm text-slate-500 ml-1.5 font-normal">Days</span>
              </div>
              <p className="text-xs text-slate-500 font-normal">Average time to let</p>
            </div>
            <div className="space-y-1.5">
              <div className="font-mono text-[28px] font-medium leading-none tracking-tight text-ink-900">
                100<span className="text-sm text-slate-500 ml-1 font-normal">%</span>
              </div>
              <p className="text-xs text-slate-500 font-normal">Accompanied viewings</p>
            </div>
            <div className="space-y-1.5">
              <div className="font-mono text-[28px] font-medium leading-none tracking-tight text-ink-900">
                5th<span className="text-xs text-slate-500 ml-1.5 font-normal">Monthly</span>
              </div>
              <p className="text-xs text-slate-500 font-normal">Guaranteed payout date</p>
            </div>
            <div className="space-y-1.5">
              <div className="font-mono text-[28px] font-medium leading-none tracking-tight text-ink-900">
                0<span className="text-sm text-slate-500 ml-1.5 font-normal">KES</span>
              </div>
              <p className="text-xs text-slate-500 font-normal">Upfront onboarding cost</p>
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <WebButtonLink href="#valuation" variant="primary" size="lg">
              <span>Request Free Appraisal</span>
              <ArrowIcon size={16} stroke={WEB_ICON_STROKE} aria-hidden="true" />
            </WebButtonLink>

            <p className="text-xs text-slate-500 font-normal leading-relaxed">
              Direct telephone line with your named portfolio manager from day one.
            </p>
          </div>
        </div>
      </div>
    </SectionBand>
  );
}

// ── 04 Fees ──────────────────────────────────────────────────────────────────

export function LandlordFees() {
  const CheckIcon = webIcons.check;
  const CrossIcon = webIcons.close;

  return (
    <SectionBand tone="light" labelledBy="fees-heading">
      <SectionIntro
        id="fees-heading"
        eyebrow={LANDLORDS.fees.eyebrow}
        title={LANDLORDS.fees.title}
        lead={LANDLORDS.fees.lead}
      />

      <div className="mt-4 grid lg:grid-cols-3 border-t border-slate-200/80 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80">
        {LANDLORDS.fees.tiers.map((tier, index) => (
          <div
            key={tier.name}
            className={cn(
              "relative py-12 lg:py-16",
              index === 0 ? "lg:pr-14" : index === 1 ? "lg:px-14" : "lg:pl-14"
            )}
          >
            {/* Alignment container for the badge so the titles line up even if a badge is missing */}
            <div className="h-8 mb-5 flex items-center">
              {tier.badge && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 font-mono text-web-nano font-medium uppercase tracking-widest text-ink-900 shadow-sm">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  {tier.badge}
                </span>
              )}
            </div>

            <h3 className="font-editorial text-[30px] lg:text-[34px] font-medium leading-tight text-ink-900">
              {tier.name}
            </h3>
            <p className="mt-2.5 text-web-sm leading-relaxed text-slate-500 font-normal max-w-[28ch]">
              {tier.tagline}
            </p>

            {/* Editorial Number Presentation */}
            <div className="mt-10 flex items-baseline gap-2.5 border-b border-slate-200/80 pb-10">
              <span className="font-editorial text-[56px] lg:text-[64px] font-medium leading-none tracking-tight text-ink-900">
                {tier.figure}
              </span>
              <span className="text-web-sm text-slate-500 font-normal max-w-[14ch] leading-snug">
                {tier.unit}
              </span>
            </div>

            {/* Inclusions and Exclusions */}
            <ul className="mt-10 space-y-5">
              {tier.includes.map((item) => (
                <li key={item} className="flex items-start gap-3.5 text-web-sm text-slate-700 font-normal leading-relaxed">
                  <span className="flex size-[18px] shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white mt-[3px] shadow-sm">
                    <CheckIcon size={12} stroke={3.5} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
              {tier.excludes.map((item) => (
                <li key={item} className="flex items-start gap-3.5 text-web-sm text-slate-400 font-normal leading-relaxed">
                  <span className="flex size-[18px] shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-300 mt-[3px]">
                    <CrossIcon size={11} stroke={2} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SectionBand>
  );
}

// ── 05 The ERP band ──────────────────────────────────────────────────────────

/**
 * The differentiator band.
 *
 * Every capability named maps to a module that exists in this repository. That
 * is the only reason it can be published: a claim about a system we have not
 * built is the fastest way to lose an owner at the first statement.
 */
export function LandlordErp() {
  const BuildingIcon = webIcons.building;
  const ArrowIcon = webIcons.arrow;

  return (
    <section
      aria-labelledby="erp-heading"
      className="web-dark relative overflow-hidden py-24 lg:py-32 bg-brand-deep"
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-emerald-500/5 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 left-0 h-[600px] w-[600px] rounded-full bg-brand-yellow/5 blur-[140px]" />

      <BuildingIcon
        size={680}
        stroke={0.35}
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-24 text-white opacity-[0.03]"
      />

      <Container className="relative">
        {/* Tier 1: Narrative & Live Dashboard Showcase */}
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-16">
          <div>
            {/* Bespoke Architectural Eyebrow */}
            <div className="mb-6 flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-7 shrink-0 bg-brand-yellow" />
              <div className="flex items-center gap-2 font-mono text-web-micro uppercase tracking-[0.22em] text-slate-300">
                <span className="font-editorial lowercase text-brand-yellow text-web-sm italic tracking-normal leading-none">sys.</span>
                <span>{LANDLORDS.erp.eyebrow}</span>
                <span className="text-white/20">/</span>
                <span className="text-emerald-400 font-medium">Core Ledger</span>
              </div>
            </div>

            <h2
              id="erp-heading"
              className="font-editorial text-[clamp(2.5rem,4vw,3.75rem)] font-medium leading-[1.06] tracking-tight text-white max-w-xl text-balance"
            >
              {LANDLORDS.erp.title}
            </h2>

            <p className="mt-5 text-web-sm sm:text-base leading-relaxed text-slate-300 max-w-[50ch] font-normal">
              {LANDLORDS.erp.lead}
            </p>

            {/* Core Ledger Pillars - Open Hairline List */}
            <div className="mt-10 border-t border-b border-white/10 divide-y divide-white/10">
              {LANDLORDS.erp.rows.map((row) => {
                const IconComponent = webIcons[row.icon];
                return (
                  <div
                    key={row.label}
                    className="group flex items-center justify-between gap-4 py-4 transition-colors hover:bg-white/[0.02]"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="text-brand-yellow shrink-0">
                        <IconComponent size={18} stroke={WEB_ICON_STROKE} aria-hidden="true" />
                      </span>
                      <span className="text-web-sm font-medium text-white">
                        {row.label}
                      </span>
                      <span className="text-slate-400 text-web-xs font-normal hidden sm:inline">
                        — {row.value}
                      </span>
                    </div>

                    <span className="font-mono text-web-nano uppercase tracking-widest text-emerald-400/90 font-medium shrink-0">
                      Live Hook
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={LANDLORDS.erp.portalLink.href}
                className="web-hit inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-3 text-web-sm font-medium text-ink-900 shadow-lg shadow-white/10 transition-all hover:bg-slate-100 hover:scale-[1.02]"
              >
                <span>{LANDLORDS.erp.portalLink.label}</span>
                <ArrowIcon size={16} stroke={WEB_ICON_STROKE} aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Right Console Showcase */}
          <div className="relative">
            <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-r from-emerald-500/20 via-brand-yellow/10 to-indigo-500/20 blur-xl opacity-70" />
            <LandlordPortfolioMock />
          </div>
        </div>

        {/* Tier 2: Infrastructure Architecture - Full-Width Architectural Matrix */}
        <div className="mt-28 pt-20 border-t border-white/10">
          {/* Asymmetric Editorial Header - Title on the Right */}
          <div className="mb-16 grid lg:grid-cols-[1fr_minmax(0,1.2fr)] gap-8 lg:gap-14 items-end">
            {/* Left Column: Context Narrative & Live Telemetry */}
            <div className="space-y-4 lg:pr-10 lg:border-r border-white/10">
              <p className="text-web-sm sm:text-web-sm leading-relaxed text-slate-300 font-normal">
                Every transaction, repair photograph, tenant vetting dossier, and M-Pesa reference is permanently indexed against the unit ledger. No silent gaps, no undocumented deductions.
              </p>
              <div className="flex items-center gap-4 font-mono text-web-micro uppercase tracking-widest text-slate-400 pt-1">
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  6 Core Modules Active
                </span>
                <span className="text-white/20">/</span>
                <span>100% Audited Ledger</span>
              </div>
            </div>

            {/* Right Column: Golden Eyebrow & Major Serif Title (Far Right Anchored) */}
            <div className="lg:text-right lg:ml-auto">
              <div className="flex items-center lg:flex-row-reverse gap-3 mb-3">
                <span aria-hidden="true" className="h-px w-8 bg-brand-yellow" />
                <p className="font-mono text-web-micro uppercase tracking-[0.22em] text-brand-yellow font-medium">
                  Infrastructure Architecture
                </p>
              </div>
              <h3 className="font-editorial text-[clamp(2.4rem,3.8vw,3.6rem)] font-medium leading-[1.08] tracking-tight text-white max-w-xl text-balance">
                Engineered for total portfolio transparency
              </h3>
            </div>
          </div>

          {/* 3x2 Hairline Architectural Matrix */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 border-y border-white/10 divide-y sm:divide-y-0 divide-white/10">
            {LANDLORDS.erp.capabilities.map((capability, index) => {
              const IconComponent = webIcons[capability.icon];
              const specs = [
                "Instant Paybill Webhook",
                "30 / 60 / 90+ Day Ageing",
                "Photo Audit & Invoices",
                "Encrypted Vault Storage",
                "Self-Service Tenant Desk",
                "Immutable Append-Only Log",
              ];

              return (
                <div
                  key={capability.title}
                  className={cn(
                    "group relative overflow-hidden p-8 lg:p-10 transition-all duration-300 hover:bg-white/[0.02]",
                    index % 3 !== 0 && "lg:border-l lg:border-white/10",
                    index >= 3 && "lg:border-t lg:border-white/10",
                    index % 2 !== 0 && "sm:border-l sm:border-white/10 lg:border-l-0",
                    index >= 2 && "sm:border-t sm:border-white/10 lg:border-t-0"
                  )}
                >
                  {/* Absolutely Placed Background Watermark Artwork */}
                  <IconComponent
                    size={160}
                    stroke={1.0}
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-6 -right-6 text-white opacity-[0.025] transition-all duration-500 group-hover:scale-105 group-hover:opacity-[0.05] group-hover:text-brand-yellow"
                  />

                  <h4 className="relative z-10 font-editorial text-[22px] font-medium text-white leading-snug tracking-tight">
                    {capability.title}
                  </h4>

                  <p className="relative z-10 mt-3 text-web-sm leading-relaxed text-slate-400 font-normal">
                    {capability.body}
                  </p>

                  <div className="relative z-10 mt-6 pt-4 border-t border-white/5 flex items-center gap-2 font-mono text-web-nano uppercase tracking-wider text-emerald-400/90 font-medium">
                    <span className="size-1 rounded-full bg-emerald-500/80" />
                    <span>{specs[index]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * The portfolio mock.
 *
 * Illustrative, and labelled "Portfolio" rather than dressed up as this
 * visitor's own data. Marked `aria-hidden` because a screen reader reading out
 * four invented unit balances as though they were real would be actively
 * misleading; the surrounding prose already states what the portal does.
 */
function LandlordPortfolioMock() {
  const ChartIcon = webIcons.chart;
  const ShieldIcon = webIcons.shield;

  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden rounded-[24px] bg-surface-0 shadow-2xl ring-1 ring-white/10 flex flex-col"
    >
      {/* Console Chrome Header */}
      <div className="flex h-12 items-center justify-between border-b border-slate-100 bg-slate-50/80 px-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-slate-300" />
            <span className="size-2.5 rounded-full bg-slate-300" />
            <span className="size-2.5 rounded-full bg-slate-300" />
          </div>
          <span className="h-3 w-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <span className="flex size-5 items-center justify-center rounded bg-brand-dark text-white shadow-xs">
              <span className="font-editorial text-xs italic leading-none pt-0.5">S</span>
            </span>
            <span className="font-mono text-web-micro uppercase tracking-widest text-ink-900 font-medium">
              Sunland ERP
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-web-nano">
          <div className="flex items-center gap-1.5 uppercase tracking-wider text-slate-600 font-medium">
            <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
            <span>Live Sync</span>
          </div>
          <span className="text-slate-300">/</span>
          <span className="uppercase tracking-widest text-slate-400 hidden sm:inline">
            Mandate #SL-884
          </span>
        </div>
      </div>

      <div className="p-6">
        {/* Metric Summary Bar */}
        <div className="grid grid-cols-3 gap-3 border-b border-slate-100 pb-5">
          <div>
            <p className="font-mono text-web-nano uppercase tracking-wider text-slate-400 mb-1">
              Collected, Mar
            </p>
            <p className="font-editorial text-[26px] lg:text-[28px] font-medium leading-none tracking-tight text-ink-900">
              1.42<span className="text-web-body">M</span>
            </p>
            <span className="inline-flex items-center gap-0.5 text-web-nano font-mono text-emerald-600 font-medium mt-1">
              <ChartIcon size={10} stroke={2.5} /> +12.4%
            </span>
          </div>

          <div className="border-l border-slate-100 pl-3">
            <p className="font-mono text-web-nano uppercase tracking-wider text-slate-400 mb-1">
              Occupancy
            </p>
            <p className="font-editorial text-[26px] lg:text-[28px] font-medium leading-none tracking-tight text-ink-900">
              96<span className="text-web-body">%</span>
            </p>
            <span className="text-web-nano font-mono text-slate-500 font-normal mt-1 block">
              4 of 4 Active
            </span>
          </div>

          <div className="border-l border-slate-100 pl-3">
            <p className="font-mono text-web-nano uppercase tracking-wider text-slate-400 mb-1">
              Open Jobs
            </p>
            <p className="font-editorial text-[26px] lg:text-[28px] font-medium leading-none tracking-tight text-ink-900">
              2
            </p>
            <span className="text-web-nano font-mono text-amber-600 font-medium mt-1 block">
              In Approval
            </span>
          </div>
        </div>

        {/* The Recharts Interactive Area Graph */}
        <div className="mt-4 pt-1">
          <LandlordRentChart />
        </div>

        {/* Live Remittances Feed - Open Hairline List */}
        <div className="mt-5 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3.5">
            <span className="font-mono text-web-nano uppercase tracking-widest text-slate-400 font-medium">
              Live Remittance Feed
            </span>
            <span className="font-mono text-web-nano uppercase tracking-wider text-slate-400">
              Autopay Matched
            </span>
          </div>

          <div className="divide-y divide-slate-100/90 border-t border-slate-100">
            {LANDLORDS.erp.dashboard.units.map((unit) => (
              <div
                key={unit.name}
                className="flex items-center justify-between gap-3 py-2.5 transition-colors hover:bg-slate-50/50"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-6 rounded bg-slate-100 flex items-center justify-center font-editorial text-xs font-medium text-ink-900 shrink-0">
                    {unit.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-web-xs font-medium text-ink-900">
                      {unit.name}
                    </p>
                    <p className="text-web-nano font-mono text-slate-400">
                      M-Pesa Webhook · 04 Mar
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-mono text-web-micro font-medium text-ink-900">
                    KES {unit.amount}
                  </p>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 font-mono text-web-nano uppercase tracking-wider font-medium",
                      unit.state === "paid" ? "text-emerald-600" : "text-amber-600"
                    )}
                  >
                    <span
                      className={cn(
                        "size-1 rounded-full",
                        unit.state === "paid" ? "bg-emerald-500" : "bg-amber-500"
                      )}
                    />
                    {unit.state === "paid" ? "Settled" : "Partial"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Security Badge */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-web-nano text-slate-400 font-mono">
          <span className="flex items-center gap-1.5">
            <ShieldIcon size={12} className="text-emerald-500" />
            256-Bit Encrypted Vault
          </span>
          <span>Paybill 880100 Linked</span>
        </div>
      </div>
    </div>
  );
}

// ── 06 Testimonial and FAQ ───────────────────────────────────────────────────

export function LandlordProof() {
  const QuoteIcon = webIcons.quote;
  const ShieldIcon = webIcons.shield;

  return (
    <SectionBand tone="light" labelledBy="landlord-proof-heading" className="bg-white py-24 lg:py-32 border-b border-slate-200/80">
      <div className="grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-20 items-start">
        {/* Left Column: Client Proof & Mandate Endorsement */}
        <div className="space-y-10">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span aria-hidden="true" className="h-px w-7 bg-brand-yellow shrink-0" />
              <p
                id="landlord-proof-heading"
                className="font-mono text-web-micro uppercase tracking-[0.22em] text-slate-500 font-medium"
              >
                {LANDLORDS.testimonial.eyebrow}
              </p>
            </div>

            {/* Decorative Quote Icon & Editorial Quote */}
            <div className="relative">
              <QuoteIcon
                size={72}
                stroke={0.7}
                aria-hidden="true"
                className="text-slate-100 absolute -top-8 -left-4 pointer-events-none -z-10"
              />
              <blockquote className="font-editorial text-[clamp(1.85rem,2.6vw,2.5rem)] font-medium leading-[1.28] tracking-tight text-ink-900 text-pretty">
                &ldquo;{LANDLORDS.testimonial.quote}&rdquo;
              </blockquote>
            </div>

            {/* Client Signature Profile */}
            <div className="mt-8 flex items-center gap-4 pt-6 border-t border-slate-200/80">
              <div className="size-11 rounded-full bg-brand-dark text-white flex items-center justify-center font-editorial text-lg font-medium shadow-xs shrink-0">
                R
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-editorial text-[18px] font-medium text-ink-900">
                    {LANDLORDS.testimonial.name}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 font-mono text-web-nano uppercase tracking-wider text-emerald-700 font-medium">
                    <ShieldIcon size={10} stroke={2.5} /> Verified Landlord
                  </span>
                </div>
                <p className="text-web-xs text-slate-500 font-normal">
                  8-Unit Portfolio · Kilimani & Lavington
                </p>
              </div>
            </div>
          </div>

          {/* Social Proof Telemetry Strip */}
          <div className="grid grid-cols-2 gap-8 border-t border-slate-200/80 pt-8">
            <div className="space-y-1">
              <p className="font-editorial text-[36px] font-medium leading-none text-ink-900">
                98.4<span className="text-[20px]">%</span>
              </p>
              <p className="text-xs text-slate-500 font-normal">Annual landlord retention rate</p>
            </div>
            <div className="space-y-1">
              <p className="font-editorial text-[36px] font-medium leading-none text-ink-900">
                24<span className="text-[20px]">h</span>
              </p>
              <p className="text-xs text-slate-500 font-normal">Average repair dispatch turnaround</p>
            </div>
          </div>
        </div>

        {/* Right Column: Open Uncarded FAQ Accordion */}
        <div className="lg:pl-6">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span aria-hidden="true" className="h-px w-6 bg-brand-yellow shrink-0" />
              <h3 className="font-mono text-web-micro uppercase tracking-[0.22em] text-slate-500 font-medium">
                Mandate Clarity
              </h3>
            </div>
            <h4 className="font-editorial text-[26px] sm:text-[30px] font-medium leading-tight text-ink-900">
              Common questions
            </h4>
          </div>

          <FaqList />
        </div>
      </div>
    </SectionBand>
  );
}

/**
 * The four common questions, on native `<details>` with custom uncarded styling.
 */
function FaqList() {
  const PlusIcon = webIcons.plus;

  return (
    <div className="border-t border-slate-200/90 divide-y divide-slate-200/90">
      {LANDLORDS.faq.map((item) => (
        <details key={item.question} name="landlord-faq" className="group">
          <summary className="web-hit flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-editorial text-[18.5px] sm:text-[20px] font-medium text-ink-900 transition-colors hover:text-slate-600 group-open:text-ink-900 [&::-webkit-details-marker]:hidden">
            <span>{item.question}</span>
            <span
              aria-hidden="true"
              className="flex size-8 shrink-0 items-center justify-center rounded-full border border-slate-200/10 bg-slate-50/60 text-slate-500 transition-all duration-200 group-hover:border-slate-400 group-hover:text-ink-900 group-open:rotate-45 group-open:border-slate-200/20 group-open:text-ink-900 group-open:bg-slate-100"
            >
              <PlusIcon size={16} stroke={2} />
            </span>
          </summary>
          <p className="pb-6 text-web-sm leading-relaxed text-slate-600 font-normal max-w-[56ch]">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
