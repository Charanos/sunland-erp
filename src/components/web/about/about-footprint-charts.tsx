"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  Treemap,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils/cn";
import type { ChartTooltipProps } from "@/components/web/primitives/chart-tooltip";

/**
 * The operating footprint.
 *
 * ── Why these three chart types ──
 *
 * The site already uses area charts on listing detail, bar on areas and
 * insights, and pie on submarket occupancy. A fourth bar chart here would make
 * About look like a page that ran out of ideas. Each of these is picked because
 * the shape of its data suits it:
 *
 * - **Treemap** for where the book sits. Concentration is the point — twenty
 *   areas is a picket fence as bars and unreadable as a pie.
 * - **RadialBar** for the mix by property type. Reads as share-of-whole without
 *   claiming the precision of a pie, and holds six categories legibly.
 * - **ComposedChart** for coverage: bars for areas per region, with a line for
 *   the running cumulative share. A Pareto, and the honest summary of this
 *   firm's reach — thirteen of twenty areas are Nairobi and the tail runs to
 *   the coast and upcountry.
 *
 * ── Why coverage is the fallback ──
 *
 * The first two need the database. The third is built from `WEB_AREAS`, the
 * editorial list of where the firm will take a mandate, so it renders whether
 * or not a query succeeded. That matters: an empty column where a chart should
 * be is worse than a chart of something true but static, and the section
 * previously collapsed to blank whitespace whenever the database was
 * unreachable.
 *
 * Coverage is a statement of reach, not of current stock, and is labelled as
 * such so the two are never confused.
 *
 * ── Colour ──
 *
 * Sourced from the ERP's property-type palette, so a landlord who later signs
 * into the dashboard finds the same colour meaning the same thing — the parity
 * decision the home hero's portfolio dial already made. Deliberately NOT the
 * Terrain semantic set: emerald/amber/rose carry status meaning (available /
 * under offer / let) and reusing them decoratively would imply a health signal
 * that is not being made.
 */

/** ERP property-type palette, mirrored from `unified-market-board`. */
const TYPE_COLORS = ["#0ea5e9", "#0f766e", "#4f46e5", "#8b5cf6", "#f59e0b", "#64748b"];

/** Neutral ramp for the treemap: weight is the signal, not hue. */
const AREA_COLORS = ["#151936", "#1e2448", "#2a3160", "#363f78", "#434d90", "#5260a8"];

export type FootprintArea = { name: string; count: number };
export type FootprintType = { propertyType: string; count: number };
export type FootprintRegion = { region: string; count: number };

type ViewId = "areas" | "types" | "coverage";

function Card({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-xl border border-slate-200/90 bg-white/95 px-3.5 py-2.5 shadow-lg backdrop-blur-md">
      <p className="font-mono text-[11px] font-medium text-[#151936]">{title}</p>
      {lines.map((line) => (
        <p key={line} className="mt-0.5 font-mono text-[11px] text-slate-500">
          {line}
        </p>
      ))}
    </div>
  );
}

function TreemapTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const datum = payload[0]?.payload as { name?: string; size?: number } | undefined;
  if (!datum?.name) return null;
  return (
    <Card
      title={datum.name}
      lines={[`${datum.size} live ${datum.size === 1 ? "listing" : "listings"}`]}
    />
  );
}

function RadialTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const datum = payload[0]?.payload as
    | { label?: string; count?: number; share?: number }
    | undefined;
  if (!datum?.label) return null;
  return <Card title={datum.label} lines={[`${datum.count} · ${datum.share}% of book`]} />;
}

function CoverageTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const datum = payload[0]?.payload as
    | { region?: string; count?: number; cumulative?: number }
    | undefined;
  if (!datum?.region) return null;
  return (
    <Card
      title={datum.region}
      lines={[
        `${datum.count} ${datum.count === 1 ? "area" : "areas"}`,
        `${datum.cumulative}% of coverage cumulative`,
      ]}
    />
  );
}

export function AboutFootprintCharts({
  areas,
  types,
  regions,
}: {
  areas: FootprintArea[];
  types: FootprintType[];
  /** Static, from WEB_AREAS. Always present, so a chart always renders. */
  regions: FootprintRegion[];
}) {
  const treemapData = useMemo(
    () =>
      areas
        .filter((area) => area.count > 0)
        .map((area, index) => ({
          name: area.name,
          size: area.count,
          fill: AREA_COLORS[index % AREA_COLORS.length],
        })),
    [areas]
  );

  const radialData = useMemo(() => {
    const total = types.reduce((sum, type) => sum + type.count, 0);
    if (total === 0) return [];
    return types
      .filter((type) => type.count > 0)
      .sort((a, b) => b.count - a.count)
      .map((type, index) => ({
        label: type.propertyType,
        count: type.count,
        share: Math.round((type.count / total) * 100),
        fill: TYPE_COLORS[index % TYPE_COLORS.length],
      }));
  }, [types]);

  const coverageData = useMemo(() => {
    const total = regions.reduce((sum, region) => sum + region.count, 0);
    if (total === 0) return [];
    let running = 0;
    return [...regions]
      .sort((a, b) => b.count - a.count)
      .map((region) => {
        running += region.count;
        return {
          region: region.region,
          count: region.count,
          cumulative: Math.round((running / total) * 100),
        };
      });
  }, [regions]);

  const hasAreas = treemapData.length > 0;
  const hasTypes = radialData.length > 0;
  const hasCoverage = coverageData.length > 0;

  // Prefer live data; fall back to coverage, which is always available.
  const [view, setView] = useState<ViewId | null>(null);
  const active: ViewId = view ?? (hasAreas ? "areas" : hasTypes ? "types" : "coverage");

  if (!hasAreas && !hasTypes && !hasCoverage) return null;

  const tabs = [
    { id: "areas" as const, label: "By area", enabled: hasAreas },
    { id: "types" as const, label: "By type", enabled: hasTypes },
    { id: "coverage" as const, label: "Coverage", enabled: hasCoverage },
  ].filter((tab) => tab.enabled);

  const heading =
    active === "areas"
      ? "Where the portfolio sits"
      : active === "types"
        ? "What we manage"
        : "Where we take mandates";

  return (
    <div className="rounded-2xl border border-line bg-surface-0 p-5 shadow-xs sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line-soft pb-4">
        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-slate-400 font-medium">
            {active === "coverage" ? "Editorial coverage" : "Live from the book"}
          </p>
          <p className="mt-1 font-editorial text-[19px] font-medium leading-tight text-[#151936]">{heading}</p>
        </div>

        {tabs.length > 1 && (
          <div
            role="tablist"
            aria-label="Footprint view"
            className="flex items-center rounded-full bg-surface-1 border border-line-soft p-1 font-mono text-[10.5px]"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active === tab.id}
                onClick={() => setView(tab.id)}
                className={cn(
                  "rounded-full px-3 py-1 font-medium uppercase tracking-[0.12em] transition-all",
                  active === tab.id
                    ? "bg-[#151936] text-white shadow-2xs"
                    : "text-slate-500 hover:text-[#151936]"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 h-[260px] w-full sm:h-[300px]">
        {active === "areas" && (
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={treemapData}
              dataKey="size"
              // The stroke is what separates tiles; adjacent navy blocks would
              // otherwise read as one shape.
              stroke="#ffffff"
              isAnimationActive={false}
            >
              <Tooltip content={<TreemapTooltip />} />
            </Treemap>
          </ResponsiveContainer>
        )}

        {active === "types" && (
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              data={radialData}
              innerRadius="28%"
              outerRadius="96%"
              startAngle={90}
              endAngle={-270}
            >
              {/* Domain pinned 0-100 so each ring reads as a share of the whole
                  book rather than against the largest category. */}
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar dataKey="share" background cornerRadius={8} isAnimationActive={false} />
              <Tooltip content={<RadialTooltip />} />
            </RadialBarChart>
          </ResponsiveContainer>
        )}

        {active === "coverage" && (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={coverageData} margin={{ top: 8, right: 8, bottom: 0, left: -22 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eeeef3" vertical={false} />
              <XAxis
                dataKey="region"
                tickLine={false}
                axisLine={false}
                interval={0}
                tick={{ fontSize: 10, fill: "#94a3b8", fontFamily: "var(--font-jetbrains)" }}
                angle={-30}
                textAnchor="end"
                height={56}
              />
              <YAxis
                yAxisId="count"
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                tick={{ fontSize: 10, fill: "#94a3b8", fontFamily: "var(--font-jetbrains)" }}
              />
              <YAxis
                yAxisId="cumulative"
                orientation="right"
                domain={[0, 100]}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: "#cbd5e1", fontFamily: "var(--font-jetbrains)" }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CoverageTooltip />} cursor={{ fill: "rgba(21,25,54,0.04)" }} />
              <Bar
                yAxisId="count"
                dataKey="count"
                fill="#151936"
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
                isAnimationActive={false}
              />
              <Line
                yAxisId="cumulative"
                type="monotone"
                dataKey="cumulative"
                stroke="#f3df27"
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: "#151936", stroke: "#f3df27", strokeWidth: 1.5 }}
                activeDot={{ r: 5, fill: "#f3df27", stroke: "#151936", strokeWidth: 2 }}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* The legend is the readable half of a radial chart, so it is markup
          rather than a Recharts <Legend>: real text, selectable, and announced
          in the order the data is sorted. */}
      {active === "types" && (
        <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-line-soft pt-4 sm:grid-cols-3">
          {radialData.map((datum) => (
            <li key={datum.label} className="flex items-center gap-2 font-mono text-[11px]">
              <span
                aria-hidden="true"
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: datum.fill }}
              />
              <span className="truncate text-slate-600">{datum.label}</span>
              <span className="ml-auto shrink-0 text-[#151936]">{datum.share}%</span>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 border-t border-line-soft pt-4 font-mono text-[11px] leading-relaxed text-slate-400">
        {active === "areas" &&
          `Tile size is live listing count. ${treemapData.length} areas currently carrying stock.`}
        {active === "types" && "Share of the managed and listed book, by property type."}
        {active === "coverage" &&
          "Bars are areas per region; the line is cumulative share of coverage."}
      </p>
    </div>
  );
}
