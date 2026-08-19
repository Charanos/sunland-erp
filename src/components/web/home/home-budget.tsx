"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { WEB_ICON_STROKE, webIcons } from "../icons";
import { BandArtwork } from "../primitives/band-artwork";
import { Container } from "../primitives/container";
import { Eyebrow } from "../primitives/eyebrow";
import { budgetDefaults } from "./home.defaults";

/**
 * 03 home.budget, dark band on the tertiary ground.
 *
 * Not in web doc 04, which specifies nine home bands. The design pass added
 * it, and it earns its place: it is the only section that answers the
 * question a renter actually arrives with, which is not "show me apartments"
 * but "what can I get for what I have".
 *
 * Two colour decisions, both deliberate:
 *
 * The ground is the ERP's tertiary gradient rather than flat brand dark. It
 * separates this band from the hero four screens earlier, so the page does
 * not read as one long dark stretch interrupted by light ones.
 *
 * There is no yellow in this band at all. Active states are tertiary emerald.
 * A budget finder is a tool, not a call to action, and spending the page's
 * single yellow element here would take it from the valuation button in the
 * landlord band, which is the highest value action on the site.
 *
 * The one genuinely stateful band on the page, hence the client component.
 */
export function HomeBudget() {
  const [budget, setBudget] = useState(120_000);
  const [beds, setBeds] = useState<1 | 2 | 3>(2);
  const budgetId = useId();

  const MinusIcon = webIcons.minus;
  const PlusIcon = webIcons.plus;
  const ArrowIcon = webIcons.arrow;

  const format = (value: number) => `KES ${Math.round(value).toLocaleString("en-KE")}`;

  const { matches, areaCount, shortfallLine } = useMemo(() => {
    const within = budgetDefaults.areas
      .filter((area) => area.rents[beds] <= budget)
      .sort((a, b) => b.rents[beds] - a.rents[beds]);

    // Alternatives are ordered by proximity to the ceiling, not alphabetically:
    // someone with 120,000 wants the best area they can afford, not the
    // cheapest one on the list.
    const top = within.slice(0, 3).map((area) => ({
      name: area.name,
      note: area.note,
      typical: format(area.rents[beds]),
      headroom:
        budget - area.rents[beds] > 0
          ? `${format(budget - area.rents[beds])} under budget`
          : "at your ceiling",
    }));

    const cheapest = budgetDefaults.areas.reduce((lowest, area) =>
      area.rents[beds] < lowest.rents[beds] ? area : lowest
    );

    const bedWord = beds === 1 ? "a one bedroom" : beds === 2 ? "a two bedroom" : "a three bedroom";

    return {
      matches: top,
      areaCount: within.length,
      // A zero-result state that says what the floor actually is and offers a
      // way to be told when something lands, rather than an empty panel.
      shortfallLine:
        within.length === 0
          ? `The lowest we see for ${bedWord} is about ${format(cheapest.rents[beds])} in ${cheapest.name}. Tell us your ceiling and we will call when something lands.`
          : "",
    };
  }, [budget, beds]);

  const bedChipClass = (active: boolean) =>
    cn(
      "web-control web-hit rounded-web-full px-[18px] py-1.5 text-[11.5px] tracking-[0.08em] transition-all duration-150",
      active
        ? "bg-on-dark-hi text-brand-dark"
        : "border border-dark-line text-on-dark hover:bg-dark-raise-hi"
    );

  const nudgeClass =
    "web-hit inline-flex size-10 items-center justify-center rounded-web-full border border-dark-line text-on-dark-hi transition-colors hover:bg-dark-raise-hi";

  return (
    <section
      aria-labelledby="budget-heading"
      className="web-tertiary relative overflow-hidden py-24 lg:py-32"
    >
      <BandArtwork icon="wallet" position="left" />

      <Container className="relative">
        <div className="max-w-3xl">
          <Eyebrow tone="dark">{budgetDefaults.eyebrow}</Eyebrow>
          <h2 id="budget-heading" className="web-title mt-4 text-web-h2 text-on-dark-hi">
            {budgetDefaults.headline}
          </h2>
          <p className="web-subtitle mt-4 max-w-[62ch] text-web-lead text-on-dark">
            {budgetDefaults.lead}
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <div className="rounded-web-panel border border-dark-line bg-dark-raise p-6 sm:p-8">
            <label
              htmlFor={budgetId}
              className="web-control block text-[10px] uppercase tracking-[0.14em] text-on-dark-lo"
            >
              Monthly budget, KES
            </label>
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setBudget((value) => Math.max(20_000, value - 10_000))}
                aria-label="Decrease budget by 10,000"
                className={nudgeClass}
              >
                <MinusIcon size={18} stroke={WEB_ICON_STROKE} aria-hidden="true" />
              </button>
              <input
                id={budgetId}
                inputMode="numeric"
                value={budget.toLocaleString("en-KE")}
                onChange={(event) => {
                  const parsed = Number.parseInt(event.target.value.replace(/[^0-9]/g, ""), 10);
                  setBudget(Number.isNaN(parsed) ? 0 : Math.min(parsed, 500_000));
                }}
                className="web-numeric min-w-0 flex-1 rounded-web-full border border-dark-line bg-transparent px-5 py-2.5 text-center text-2xl text-on-dark-hi focus:border-on-dark-lo focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setBudget((value) => Math.min(500_000, value + 10_000))}
                aria-label="Increase budget by 10,000"
                className={nudgeClass}
              >
                <PlusIcon size={18} stroke={WEB_ICON_STROKE} aria-hidden="true" />
              </button>
            </div>

            <p className="web-control mt-8 text-[10px] uppercase tracking-[0.14em] text-on-dark-lo">
              Bedrooms
            </p>
            <div className="mt-3 flex gap-2" role="group" aria-label="Bedrooms">
              {([1, 2, 3] as const).map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setBeds(count)}
                  aria-pressed={beds === count}
                  className={bedChipClass(beds === count)}
                >
                  {count} bed
                </button>
              ))}
            </div>

            {/* The count is announced rather than only shown, because it is the
                thing that changes when the visitor moves the budget. */}
            <p aria-live="polite" className="mt-8 border-t border-dark-line pt-6 text-sm">
              <span className="web-numeric text-3xl text-on-dark-hi">{areaCount}</span>
              <span className="web-subtitle ml-2 text-on-dark-lo">
                areas within {format(budget)} for {beds} bed
              </span>
            </p>
          </div>

          <div>
            <p className="web-control text-[10px] uppercase tracking-[0.14em] text-on-dark-lo">
              {budgetDefaults.matchesLabel}
            </p>

            {matches.length > 0 ? (
              <ul className="mt-4">
                {matches.map((match) => (
                  <li
                    key={match.name}
                    className="flex items-baseline justify-between gap-4 border-b border-dark-line py-4"
                  >
                    <div className="min-w-0">
                      <p className="web-title-card text-xl text-on-dark-hi">{match.name}</p>
                      <p className="web-subtitle mt-0.5 truncate text-[13px] text-on-dark-lo">
                        {match.note} · {match.headroom}
                      </p>
                    </div>
                    <p className="web-numeric shrink-0 text-lg text-on-dark-hi">{match.typical}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="web-subtitle mt-4 border-b border-dark-line pb-6 text-web-lead text-on-dark">
                {shortfallLine}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={budgetDefaults.primaryCta.href}
                className="web-control web-hit inline-flex items-center gap-2 rounded-web-full bg-on-dark-hi px-6 py-2.5 text-[12px] uppercase tracking-[0.12em] text-brand-dark transition-opacity hover:opacity-90"
              >
                {budgetDefaults.primaryCta.label}
                <ArrowIcon size={16} stroke={WEB_ICON_STROKE} aria-hidden="true" />
              </Link>
              <Link
                href={budgetDefaults.secondaryCta.href}
                className="web-control web-hit inline-flex items-center rounded-web-full border border-dark-line px-6 py-2.5 text-[12px] uppercase tracking-[0.12em] text-on-dark-hi transition-colors hover:bg-dark-raise-hi"
              >
                {budgetDefaults.secondaryCta.label}
              </Link>
            </div>

            <p className="mt-6 text-[13px] leading-relaxed text-on-dark-lo">
              {budgetDefaults.basisNote}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
