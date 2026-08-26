"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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
import type { AreaGroup, WebArea } from "@/components/web/constants/locations.content";

const TYPE_COLORS = ["#0ea5e9", "#0f766e", "#4f46e5", "#8b5cf6", "#10b981", "#64748b"];
const AREA_COLORS = ["#151936", "#1e2448", "#2a3160", "#363f78", "#434d90", "#5260a8"];

export type FootprintArea = { name: string; count: number };
export type FootprintType = { propertyType: string; count: number };
export type FootprintRegion = { region: string; count: number };

export type FootprintGroupData = {
  id: AreaGroup;
  title: string;
  count: number;
  share: number;
  sampleAreas: string;
  areas: WebArea[];
};

type ViewId = "coverage" | "areas" | "types";

function TooltipCard({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-xl border border-slate-200/90 bg-white/95 px-3.5 py-2.5 shadow-lg backdrop-blur-md">
      <p className="font-mono text-[11px] font-medium text-[#151936]">{title}</p>
      {lines.map((line) => (
        <p key={line} className="mt-0.5 font-mono text-[11px] text-slate-500 font-normal">
          {line}
        </p>
      ))}
    </div>
  );
}

function TreemapTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const datum = payload[0]?.payload as { name?: string; size?: number; group?: string } | undefined;
  if (!datum?.name) return null;
  return (
    <TooltipCard
      title={datum.name}
      lines={[
        `${datum.size} live ${datum.size === 1 ? "listing" : "listings"}`,
        datum.group ? `Zone: ${datum.group}` : "",
      ].filter(Boolean)}
    />
  );
}

function RadialTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const datum = payload[0]?.payload as
    | { label?: string; count?: number; share?: number }
    | undefined;
  if (!datum?.label) return null;
  return <TooltipCard title={datum.label} lines={[`${datum.count} active units · ${datum.share}% of book`]} />;
}

function CoverageTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const datum = payload[0]?.payload as
    | { region?: string; count?: number; cumulative?: number }
    | undefined;
  if (!datum?.region) return null;
  return (
    <TooltipCard
      title={datum.region}
      lines={[
        `${datum.count} ${datum.count === 1 ? "area" : "areas"} covered`,
        `${datum.cumulative}% cumulative share`,
      ]}
    />
  );
}

export function AboutFootprintInteractive({
  areas,
  types,
  regions,
  groups,
  allAreas,
}: {
  areas: FootprintArea[];
  types: FootprintType[];
  regions: FootprintRegion[];
  groups: FootprintGroupData[];
  allAreas: WebArea[];
}) {
  const [selectedGroup, setSelectedGroup] = useState<AreaGroup | "all">("all");

  const hasAreas = areas.length > 0;
  const hasTypes = types.length > 0;
  const hasCoverage = regions.length > 0;

  const [view, setView] = useState<ViewId | null>(null);
  const activeView: ViewId = view ?? (hasCoverage ? "coverage" : hasAreas ? "areas" : "types");

  // Filtered areas for Treemap based on selected group
  const filteredWebAreas = useMemo(() => {
    if (selectedGroup === "all") return allAreas;
    return allAreas.filter((a) => a.group === selectedGroup);
  }, [allAreas, selectedGroup]);

  // Treemap data
  const treemapData = useMemo(() => {
    return filteredWebAreas.map((area, index) => {
      const liveStock = areas.find((a) => a.name.toLowerCase() === area.name.toLowerCase())?.count ?? 1;
      return {
        name: area.name,
        size: liveStock,
        group: area.group,
        fill: AREA_COLORS[index % AREA_COLORS.length],
      };
    });
  }, [filteredWebAreas, areas]);

  // Radial data
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

  // Coverage Pareto data (filtered or highlighted)
  const coverageData = useMemo(() => {
    const activeRegions = selectedGroup === "all"
      ? allAreas
      : allAreas.filter((a) => a.group === selectedGroup);

    const regionCounts = activeRegions.reduce<Record<string, number>>((acc, area) => {
      acc[area.region] = (acc[area.region] ?? 0) + 1;
      return acc;
    }, {});

    const total = Object.values(regionCounts).reduce((sum, c) => sum + c, 0);
    if (total === 0) return [];

    let running = 0;
    return Object.entries(regionCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([region, count]) => {
        running += count;
        return {
          region,
          count,
          cumulative: Math.round((running / total) * 100),
        };
      });
  }, [allAreas, selectedGroup]);

  const tabs = [
    { id: "coverage" as const, label: "Coverage", enabled: hasCoverage },
    { id: "areas" as const, label: "By area", enabled: hasAreas },
    { id: "types" as const, label: "By type", enabled: hasTypes },
  ].filter((tab) => tab.enabled);

  const activeGroupData = groups.find((g) => g.id === selectedGroup);

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:items-start xl:gap-16">
      {/* ── Left Column: Interactive Telemetry Chart ── */}
      <div data-reveal className="lg:col-span-7 lg:order-1 xl:col-span-7">
        <div className="rounded-2xl border border-line bg-surface-0 p-5 shadow-xs sm:p-7">
          {/* Chart Header & Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line-soft pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-[#151936] shrink-0" />
                <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-slate-500 font-medium">
                  {selectedGroup === "all" ? "Whole Portfolio Footprint" : `${activeGroupData?.title} Focus`}
                </p>
              </div>
              <p className="mt-1 font-editorial text-[19px] font-medium leading-tight text-[#151936]">
                {activeView === "coverage"
                  ? `Regional Distribution (${filteredWebAreas.length} Areas)`
                  : activeView === "areas"
                  ? `Submarket Allocation (${filteredWebAreas.length} Zones)`
                  : "Asset Class Allocation"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {selectedGroup !== "all" && (
                <button
                  type="button"
                  onClick={() => setSelectedGroup("all")}
                  className="rounded-full bg-surface-1 border border-line px-3 py-1 font-mono text-[10.5px] text-slate-600 hover:text-[#151936] transition-colors"
                >
                  Show all ✕
                </button>
              )}

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
                      aria-selected={activeView === tab.id}
                      onClick={() => setView(tab.id)}
                      className={cn(
                        "rounded-full px-3 py-1 font-medium uppercase tracking-[0.12em] transition-all",
                        activeView === tab.id
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
          </div>

          {/* Dynamic Recharts Frame */}
          <div className="mt-5 h-[270px] w-full sm:h-[310px]">
            {activeView === "coverage" && (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={coverageData} margin={{ top: 8, right: 8, bottom: 0, left: -22 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
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
                    tick={{ fontSize: 10, fill: "#94a3b8", fontFamily: "var(--font-jetbrains)" }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip content={<CoverageTooltip />} cursor={{ fill: "rgba(21,25,54,0.03)" }} />
                  <Bar
                    yAxisId="count"
                    dataKey="count"
                    fill="#151936"
                    radius={[5, 5, 0, 0]}
                    maxBarSize={38}
                    isAnimationActive={true}
                  />
                  <Line
                    yAxisId="cumulative"
                    type="monotone"
                    dataKey="cumulative"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 3.5, fill: "#ffffff", stroke: "#10b981", strokeWidth: 2 }}
                    activeDot={{ r: 5, fill: "#10b981", stroke: "#ffffff", strokeWidth: 2 }}
                    isAnimationActive={true}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}

            {activeView === "areas" && (
              <ResponsiveContainer width="100%" height="100%">
                <Treemap
                  data={treemapData}
                  dataKey="size"
                  stroke="#ffffff"
                  isAnimationActive={true}
                >
                  <Tooltip content={<TreemapTooltip />} />
                </Treemap>
              </ResponsiveContainer>
            )}

            {activeView === "types" && (
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  data={radialData}
                  innerRadius="28%"
                  outerRadius="96%"
                  startAngle={90}
                  endAngle={-270}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar dataKey="share" background cornerRadius={8} isAnimationActive={true} />
                  <Tooltip content={<RadialTooltip />} />
                </RadialBarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Radial Legend if in Type mode */}
          {activeView === "types" && (
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-line-soft pt-4 sm:grid-cols-3">
              {radialData.map((datum) => (
                <li key={datum.label} className="flex items-center gap-2 font-mono text-[11px]">
                  <span
                    aria-hidden="true"
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: datum.fill }}
                  />
                  <span className="truncate text-slate-600 font-normal">{datum.label}</span>
                  <span className="ml-auto shrink-0 font-medium text-[#151936]">{datum.share}%</span>
                </li>
              ))}
            </ul>
          )}

          {/* Active Area Tags when a category is selected */}
          <div className="mt-4 border-t border-line-soft pt-3.5 flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-slate-400 mr-1 font-medium">
              Active Zones:
            </span>
            {filteredWebAreas.map((area) => (
              <Link
                key={area.slug}
                href={`/locations/${area.slug}`}
                className="inline-flex items-center rounded-md bg-surface-1 border border-line-soft px-2 py-0.5 font-mono text-[10.5px] text-slate-600 hover:text-[#151936] hover:border-slate-400 transition-colors font-normal"
              >
                {area.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Column: Editorial Context & 3 Interactive Stats ── */}
      <div data-reveal data-reveal-x="24" className="lg:col-span-5 lg:order-2">
        <div className="mb-3.5 flex items-center gap-2">
          <span aria-hidden="true" className="h-px w-5 bg-brand-yellow" />
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            Operating footprint
          </p>
        </div>

        <h2
          id="footprint-heading"
          className="font-editorial text-3xl font-medium leading-[1.12] tracking-tight text-[#151936] sm:text-4xl lg:text-[40px]"
        >
          The book, as it stands today
        </h2>

        <p className="mt-5 max-w-[48ch] text-[15px] leading-relaxed text-slate-600 font-normal">
          These are not marketing figures. They are the same counts the
          portfolio dashboard runs on, read at the moment this page loaded,
          and they move when the book moves.
        </p>

        {/* 3 Interactive Group Rows (No heavy boxes, no yellow text) */}
        <div className="mt-8 divide-y divide-line border-y border-line">
          {groups.map((group) => {
            const isSelected = selectedGroup === group.id;

            return (
              <button
                key={group.title}
                type="button"
                onClick={() => setSelectedGroup(isSelected ? "all" : group.id)}
                className={cn(
                  "w-full text-left py-4 px-3 -mx-3 rounded-xl transition-all duration-200 cursor-pointer group",
                  isSelected
                    ? "bg-surface-1/80 border-l-2 border-l-[#151936]"
                    : "hover:bg-surface-1/40"
                )}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "size-2 rounded-full shrink-0 transition-all",
                          isSelected
                            ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]"
                            : "bg-[#151936] opacity-40 group-hover:opacity-80"
                        )}
                      />
                      <h3 className="font-medium text-[15px] leading-snug truncate text-[#151936]">
                        {group.title}
                      </h3>
                    </div>
                    <p className="mt-1 pl-4 text-xs text-slate-400 font-mono font-normal truncate">
                      {group.sampleAreas}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="font-mono text-2xl font-medium tracking-tight text-[#151936]">
                      {String(group.count).padStart(2, "0")}
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400 font-normal">
                      {group.share}% share
                    </div>
                  </div>
                </div>

                {/* Refined Proportional Bar */}
                <div className="mt-2.5 ml-4 h-1 w-[calc(100%-16px)] overflow-hidden rounded-full bg-slate-200/60">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500 ease-out",
                      isSelected ? "bg-emerald-500" : "bg-[#151936]"
                    )}
                    style={{ width: `${group.share}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Footnote on Mandate Discretion */}
        <div className="mt-5 flex items-start gap-2 font-mono text-xs text-slate-400 font-normal leading-relaxed">
          <span className="size-1 rounded-full bg-slate-400 shrink-0 mt-1.5" />
          <p>
            Click any zone above to filter the live portfolio chart. Where we cannot service a
            property properly, we say so.
          </p>
        </div>
      </div>
    </div>
  );
}
