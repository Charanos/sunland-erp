"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { WEB_ICON_STROKE, webIcons } from "../icons";
import { SectionBand } from "../primitives/section-band";
import { SectionHeading } from "./section-heading";
import { budgetDefaults } from "./home.defaults";

const BUDGET_PRESETS = [50_000, 80_000, 120_000, 180_000, 250_000];

/**
 * 03 home.budget, light band on white ground.
 *
 * Answers the primary question a renter arrives with: "what can I get for what I have".
 * Features interactive budget stepping, range sliding, bedroom switching, and live stock matching.
 */
export function HomeBudget() {
  const [budget, setBudget] = useState(120_000);
  const [beds, setBeds] = useState<1 | 2 | 3>(2);
  const budgetId = useId();

  const MinusIcon = webIcons.minus;
  const PlusIcon = webIcons.plus;
  const ArrowIcon = webIcons.arrow;
  const CheckIcon = webIcons.check;

  const format = (value: number) => `KES ${Math.round(value).toLocaleString("en-KE")}`;

  const { matches, areaCount, shortfallLine } = useMemo(() => {
    const within = budgetDefaults.areas
      .filter((area) => area.rents[beds] <= budget)
      .sort((a, b) => b.rents[beds] - a.rents[beds]);

    // Alternatives are ordered by proximity to the ceiling, not alphabetically
    const top = within.slice(0, 3).map((area) => ({
      name: area.name,
      note: area.note,
      typical: format(area.rents[beds]),
      isAtCeiling: budget - area.rents[beds] === 0,
      headroom:
        budget - area.rents[beds] > 0
          ? `${format(budget - area.rents[beds])} under budget`
          : "at your ceiling",
    }));

    const cheapest = budgetDefaults.areas.reduce((lowest, area) =>
      area.rents[beds] < lowest.rents[beds] ? area : lowest
    );

    const bedWord = beds === 1 ? "a 1-bedroom" : beds === 2 ? "a 2-bedroom" : "a 3-bedroom";

    return {
      matches: top,
      areaCount: within.length,
      shortfallLine:
        within.length === 0
          ? `The lowest typical rent for ${bedWord} is about ${format(cheapest.rents[beds])} in ${cheapest.name}. Tell us your ceiling and we will alert you when stock lands.`
          : "",
    };
  }, [budget, beds]);

  const nudgeClass =
    "web-hit inline-flex size-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 transition-all hover:border-[#151936] hover:bg-[#151936] hover:text-white active:scale-95 shadow-xs cursor-pointer";

  return (
    <SectionBand tone="light" labelledBy="budget-heading" className="relative bg-white">
      {/* Background ambient gradient for visual richness */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(49,91,232,0.03),transparent_70%)]"
      />

      <SectionHeading
        id="budget-heading"
        eyebrow={budgetDefaults.eyebrow}
        title={budgetDefaults.headline}
        lead={budgetDefaults.lead}
        tone="light"
      />

      <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16 items-start">
        {/* 01. Left Column: Interactive Calculator Card */}
        <div className="relative rounded-[24px] border border-slate-200/90 bg-white p-7 sm:p-9 shadow-[0_20px_50px_rgba(21,25,54,0.06),0_1px_3px_rgba(0,0,0,0.04)] transition-all">
          <div className="flex items-center justify-between">
            <label
              htmlFor={budgetId}
              className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500"
            >
              Monthly budget (KES)
            </label>
            <span className="font-mono text-[11px] text-slate-400">
              Min: 20k · Max: 500k
            </span>
          </div>

          {/* Stepper Input Row */}
          <div className="mt-3.5 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setBudget((value) => Math.max(20_000, value - 10_000))}
              aria-label="Decrease budget by 10,000"
              className={nudgeClass}
            >
              <MinusIcon size={18} stroke={WEB_ICON_STROKE} aria-hidden="true" />
            </button>

            <div className="relative min-w-0 flex-1">
              <input
                id={budgetId}
                inputMode="numeric"
                value={budget.toLocaleString("en-KE")}
                onChange={(event) => {
                  const parsed = Number.parseInt(event.target.value.replace(/[^0-9]/g, ""), 10);
                  setBudget(Number.isNaN(parsed) ? 0 : Math.min(parsed, 500_000));
                }}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-center font-mono text-2xl sm:text-3xl font-medium tracking-tight text-[#151936] shadow-inner transition-all focus:border-[#151936] focus:bg-white focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => setBudget((value) => Math.min(500_000, value + 10_000))}
              aria-label="Increase budget by 10,000"
              className={nudgeClass}
            >
              <PlusIcon size={18} stroke={WEB_ICON_STROKE} aria-hidden="true" />
            </button>
          </div>

          {/* Smooth Range Slider */}
          <div className="mt-5">
            <input
              type="range"
              min={20_000}
              max={350_000}
              step={5_000}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              aria-label="Budget slider"
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-100 accent-[#151936] focus:outline-none"
            />
          </div>

          {/* Quick Preset Pills */}
          <div className="mt-4 flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-slate-400 mr-1">
              Presets:
            </span>
            {BUDGET_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setBudget(preset)}
                className={cn(
                  "web-hit rounded-full px-3 py-1 font-mono text-[11px] font-medium transition-all cursor-pointer",
                  budget === preset
                    ? "bg-[#151936] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {preset >= 1000 ? `${preset / 1000}k` : preset}
              </button>
            ))}
          </div>

          {/* Bedrooms Selector */}
          <div className="mt-8">
            <label className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
              Select Bedrooms
            </label>
            <div className="mt-3 grid grid-cols-3 gap-2.5" role="group" aria-label="Bedrooms">
              {([1, 2, 3] as const).map((count) => {
                const active = beds === count;
                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setBeds(count)}
                    aria-pressed={active}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-2xl py-3 text-xs sm:text-[13px] font-medium font-mono uppercase tracking-wider transition-all cursor-pointer",
                      active
                        ? "bg-[#151936] text-white shadow-sm ring-2 ring-[#151936] ring-offset-2"
                        : "border border-slate-200/90 bg-slate-50/80 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                    )}
                  >
                    {active && <CheckIcon size={14} stroke={2.5} className="text-[#f3df27]" />}
                    {count} {count === 1 ? "Bed" : "Beds"}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Real-time Match Indicator Callout */}
          <div aria-live="polite" className="mt-8 flex items-center border-t border-slate-100 pt-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-3xl sm:text-4xl font-medium tracking-tight text-[#151936]">
                {areaCount}
              </span>
              <div className="text-left">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-800">
                  {areaCount === 1 ? "Area Available" : "Areas Available"}
                </p>
                <p className="text-xs text-slate-500">
                  within {format(budget)} for {beds} bed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 02. Right Column: Matched Areas Results */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
              {budgetDefaults.matchesLabel}
            </p>
            <span className="font-mono text-xs text-slate-400">
              Typical Rent Achieved
            </span>
          </div>

          {matches.length > 0 ? (
            <ul className="divide-y divide-slate-100">
              {matches.map((match) => (
                <li
                  key={match.name}
                  className="group flex items-center justify-between gap-4 py-5 transition-all rounded-2xl px-3 -mx-3 hover:bg-slate-50/80"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-editorial text-2xl font-medium text-[#151936] transition-colors group-hover:text-blue-700">
                      {match.name}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="text-[13px] text-slate-500">
                        {match.note}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-[11px] font-medium",
                          match.isAtCeiling
                            ? "bg-slate-100 text-slate-700 border border-slate-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                        )}
                      >
                        {match.headroom}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="font-mono text-xl font-medium text-[#151936]">
                      {match.typical}
                    </p>
                    <span className="font-mono text-[10px] text-slate-400 uppercase">
                      / month
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-6 rounded-2xl border border-amber-200/80 bg-amber-50/50 p-6 text-slate-700">
              <p className="font-medium text-slate-900 mb-1">Budget floor notice</p>
              <p className="text-sm leading-relaxed text-slate-600">
                {shortfallLine}
              </p>
            </div>
          )}

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={budgetDefaults.primaryCta.href}
              className="web-control web-hit inline-flex items-center gap-2.5 rounded-full bg-tertiary-gradient px-7 py-3 text-xs font-medium uppercase tracking-[0.12em] text-white shadow-[0_4px_16px_rgba(18,42,32,0.25)] transition-all hover:shadow-[0_6px_22px_rgba(18,42,32,0.4)] hover:scale-[1.02] active:scale-[0.98]"
            >
              {budgetDefaults.primaryCta.label}
              <ArrowIcon size={16} stroke={WEB_ICON_STROKE} aria-hidden="true" />
            </Link>

            <Link
              href={budgetDefaults.secondaryCta.href}
              className="web-control web-hit inline-flex items-center rounded-full border border-slate-300 bg-white px-7 py-3 text-xs font-medium uppercase tracking-[0.12em] text-[#151936] transition-all hover:border-slate-400 hover:bg-slate-50"
            >
              {budgetDefaults.secondaryCta.label}
            </Link>
          </div>

          <p className="mt-6 text-xs leading-relaxed text-slate-400">
            {budgetDefaults.basisNote}
          </p>
        </div>
      </div>
    </SectionBand>
  );
}
