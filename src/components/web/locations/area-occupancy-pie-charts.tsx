"use client";

import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils/cn";
import type { ChartTooltipProps } from "@/components/web/primitives/chart-tooltip";

export interface AssetClassSlice {
  name: string;
  value: number;
  count?: number;
  color: string;
}

export interface OccupancySlice {
  name: string;
  value: number;
  color: string;
}

export interface AreaOccupancyPieChartsProps {
  totalAreas?: number;
  totalListings?: number;
  occupancyRate?: number;
  medianTurnDays?: number;
  collectionRate?: number;
  customAssetMix?: AssetClassSlice[];
  customOccupancyMix?: OccupancySlice[];
}

const DEFAULT_OCCUPANCY_RATE = 94.6;
const DEFAULT_MEDIAN_TURN_DAYS = 18;
const DEFAULT_COLLECTION_RATE = 99.2;

const DEFAULT_ASSET_MIX: AssetClassSlice[] = [
  { name: "Prime Residential", value: 48, count: 26, color: "#151936" },
  { name: "Commercial & Office", value: 32, count: 17, color: "#2563eb" },
  { name: "Industrial & SEZ", value: 12, count: 6, color: "#0d9488" },
  { name: "Coastal & Holiday", value: 8, count: 4, color: "#d97706" },
];

const CustomPieTooltip = ({ active, payload }: ChartTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    // The slice's own datum, where the colour and unit count live. Typed as
    // the AssetClassSlice it always is, rather than reaching through `any`.
    const slice = data.payload as Partial<AssetClassSlice> | undefined;
    return (
      <div className="rounded-xl border border-slate-200/90 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2 mb-1">
          <span className="size-2.5 rounded-full" style={{ backgroundColor: slice?.color }} />
          <span className="font-mono text-xs font-medium text-slate-800">{data.name}</span>
        </div>
        <p className="font-mono text-sm font-semibold text-ink-900 pl-4.5">
          {data.value}% Portfolio Share
          {slice?.count && (
            <span className="text-xs font-normal text-slate-500 block mt-0.5">
              {slice.count} Active Properties
            </span>
          )}
        </p>
      </div>
    );
  }
  return null;
};

export function AreaOccupancyPieCharts({
  totalAreas = 20,
  totalListings = 53,
  occupancyRate = DEFAULT_OCCUPANCY_RATE,
  medianTurnDays = DEFAULT_MEDIAN_TURN_DAYS,
  collectionRate = DEFAULT_COLLECTION_RATE,
  customAssetMix,
  customOccupancyMix,
}: AreaOccupancyPieChartsProps) {
  // Default open to "composition" (Asset Allocation) as requested
  const [activeChart, setActiveChart] = useState<"composition" | "occupancy">("composition");

  const assetMixData = useMemo(() => {
    return customAssetMix && customAssetMix.length > 0 ? customAssetMix : DEFAULT_ASSET_MIX;
  }, [customAssetMix]);

  const occupancyData = useMemo<OccupancySlice[]>(() => {
    if (customOccupancyMix && customOccupancyMix.length > 0) {
      return customOccupancyMix;
    }
    const voidRate = +(100 - occupancyRate).toFixed(1);
    return [
      { name: "Actively Tenanted & Let", value: occupancyRate, color: "#151936" },
      { name: "Turnaround / Available", value: voidRate, color: "#cbd5e1" },
    ];
  }, [customOccupancyMix, occupancyRate]);

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50/90 via-white to-slate-100/50 p-6 sm:p-8 lg:p-10 shadow-2xs">
      {/* Header with Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="h-px w-5 bg-brand-yellow shrink-0" />
            <p className="font-mono text-web-nano uppercase tracking-[0.2em] text-slate-500 font-medium">
              Submarket Intelligence & Portfolio Metrics
            </p>
          </div>
          <h3 className="font-editorial text-2xl sm:text-[26px] font-medium text-ink-900 tracking-tight">
            Portfolio Allocation & Tenancy Absorption
          </h3>
        </div>

        {/* Chart Selector Pills (Asset Allocation FIRST & Default) */}
        <div className="flex bg-slate-200/60 rounded-full p-1 border border-slate-200/80 w-fit">
          <button
            type="button"
            onClick={() => setActiveChart("composition")}
            className={cn(
              "cursor-pointer px-4 py-1.5 text-web-micro font-mono uppercase tracking-wider rounded-full transition-all duration-200",
              activeChart === "composition"
                ? "bg-brand-dark text-white shadow-2xs font-medium"
                : "text-slate-600 hover:text-ink-900"
            )}
          >
            Asset Allocation
          </button>
          <button
            type="button"
            onClick={() => setActiveChart("occupancy")}
            className={cn(
              "cursor-pointer px-4 py-1.5 text-web-micro font-mono uppercase tracking-wider rounded-full transition-all duration-200",
              activeChart === "occupancy"
                ? "bg-brand-dark text-white shadow-2xs font-medium"
                : "text-slate-600 hover:text-ink-900"
            )}
          >
            Occupancy Health ({occupancyRate}%)
          </button>
        </div>
      </div>

      {/* Analytics Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 pt-6 items-center">
        {/* Left: Donut Chart Frame */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative size-56 sm:size-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomPieTooltip />} />
                {activeChart === "composition" ? (
                  <Pie
                    data={assetMixData}
                    cx="50%"
                    cy="50%"
                    innerRadius={72}
                    outerRadius={104}
                    paddingAngle={3}
                    dataKey="value"
                    animationDuration={600}
                  >
                    {assetMixData.map((entry, index) => (
                      <Cell
                        key={`asset-${index}`}
                        fill={entry.color}
                        className="transition-all duration-300 hover:opacity-85"
                      />
                    ))}
                  </Pie>
                ) : (
                  <Pie
                    data={occupancyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={72}
                    outerRadius={104}
                    paddingAngle={3}
                    dataKey="value"
                    animationDuration={600}
                  >
                    {occupancyData.map((entry, index) => (
                      <Cell
                        key={`occ-${index}`}
                        fill={entry.color}
                        className="transition-all duration-300 hover:opacity-85"
                      />
                    ))}
                  </Pie>
                )}
              </PieChart>
            </ResponsiveContainer>

            {/* Centered Donut KPI Ring */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-mono text-3xl sm:text-[32px] font-medium tracking-tight text-ink-900 leading-none">
                {activeChart === "composition" ? `${totalAreas}` : `${occupancyRate}%`}
              </span>
              <span className="font-mono text-web-nano uppercase tracking-widest text-slate-400 mt-1">
                {activeChart === "composition" ? "Covered Hubs" : "Occupied"}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Legend Breakdown & Operational Telemetry Grid */}
        <div className="lg:col-span-7 space-y-5">
          {/* Active Legend Breakdown */}
          <div className="space-y-2.5">
            <p className="font-mono text-web-micro uppercase tracking-wider text-slate-400 font-medium">
              {activeChart === "composition"
                ? "Asset Class Allocation & Property Distribution"
                : "Submarket Tenancy Absorption & Availability"}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(activeChart === "composition" ? assetMixData : occupancyData).map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-slate-200/70 bg-white/90 shadow-2xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-medium text-slate-700 truncate">{item.name}</span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-ink-900 pl-2 shrink-0">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 4-KPI Benchmark Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3.5 border-t border-slate-200/60">
            <div className="space-y-0.5">
              <p className="font-mono text-web-nano uppercase text-slate-400">Occupancy Rate</p>
              <p className="font-mono text-lg font-medium text-ink-900">{occupancyRate}%</p>
              <span className="text-web-nano text-emerald-600 font-mono">✦ Low Void Risk</span>
            </div>

            <div className="space-y-0.5">
              <p className="font-mono text-web-nano uppercase text-slate-400">Median Turn Time</p>
              <p className="font-mono text-lg font-medium text-ink-900">{medianTurnDays} Days</p>
              <span className="text-web-nano text-slate-400 font-mono">From Mandate</span>
            </div>

            <div className="space-y-0.5">
              <p className="font-mono text-web-nano uppercase text-slate-400">Collection Rate</p>
              <p className="font-mono text-lg font-medium text-ink-900">{collectionRate}%</p>
              <span className="text-web-nano text-slate-400 font-mono">Escrow Managed</span>
            </div>

            <div className="space-y-0.5">
              <p className="font-mono text-web-nano uppercase text-slate-400">Portfolio Scale</p>
              <p className="font-mono text-lg font-medium text-ink-900">{totalListings} Units</p>
              <span className="text-web-nano text-slate-400 font-mono">{totalAreas} Submarkets</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
