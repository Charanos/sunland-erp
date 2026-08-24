"use client";

import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils/cn";
import { WEB_ICON_STROKE, webIcons } from "@/components/web/icons";

interface AreaOccupancyPieChartsProps {
  totalAreas?: number;
  totalListings?: number;
}

const OCCUPANCY_DATA = [
  { name: "Actively Occupied / Let", value: 94.6, color: "#151936" },
  { name: "Available Turnaround", value: 5.4, color: "#cbd5e1" },
];

const ASSET_MIX_DATA = [
  { name: "Prime Residential", value: 48, color: "#151936" },
  { name: "Commercial & Office", value: 32, color: "#315be8" },
  { name: "Industrial & SEZ", value: 12, color: "#338f70" },
  { name: "Coastal & Holiday", value: 8, color: "#c78312" },
];

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="rounded-xl border border-slate-200/90 bg-white/95 p-3.5 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2 mb-1">
          <span className="size-2.5 rounded-full" style={{ backgroundColor: data.payload.color }} />
          <span className="font-mono text-xs font-medium text-slate-700">{data.name}</span>
        </div>
        <p className="font-mono text-sm font-semibold text-[#151936] pl-4">
          {data.value}% Portfolio Share
        </p>
      </div>
    );
  }
  return null;
};

export function AreaOccupancyPieCharts({
  totalAreas = 20,
  totalListings = 48,
}: AreaOccupancyPieChartsProps) {
  const [activeChart, setActiveChart] = useState<"occupancy" | "composition">("occupancy");

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50/90 via-white to-slate-100/50 p-6 sm:p-8 lg:p-10 shadow-2xs">
      {/* Header with Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="h-px w-5 bg-brand-yellow shrink-0" />
            <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-slate-500 font-medium">
              Submarket Intelligence & Portfolio Metrics
            </p>
          </div>
          <h3 className="font-editorial text-2xl sm:text-[26px] font-medium text-[#151936] tracking-tight">
            Occupancy Rate & Asset Allocation
          </h3>
        </div>

        {/* Chart Selector Pills */}
        <div className="flex bg-slate-200/60 rounded-full p-1 border border-slate-200/80 w-fit">
          <button
            type="button"
            onClick={() => setActiveChart("occupancy")}
            className={cn(
              "cursor-pointer px-3.5 py-1.5 text-[11px] font-mono uppercase tracking-wider rounded-full transition-all duration-200",
              activeChart === "occupancy"
                ? "bg-[#151936] text-white shadow-2xs font-medium"
                : "text-slate-600 hover:text-[#151936]"
            )}
          >
            Occupancy Health (94.6%)
          </button>
          <button
            type="button"
            onClick={() => setActiveChart("composition")}
            className={cn(
              "cursor-pointer px-3.5 py-1.5 text-[11px] font-mono uppercase tracking-wider rounded-full transition-all duration-200",
              activeChart === "composition"
                ? "bg-[#151936] text-white shadow-2xs font-medium"
                : "text-slate-600 hover:text-[#151936]"
            )}
          >
            Asset Allocation
          </button>
        </div>
      </div>

      {/* Analytics Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 pt-6 items-center">
        {/* Left: Donut Chart Frame */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative size-56 sm:size-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomPieTooltip />} />
                {activeChart === "occupancy" ? (
                  <Pie
                    data={OCCUPANCY_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={68}
                    outerRadius={98}
                    paddingAngle={3}
                    dataKey="value"
                    animationDuration={600}
                  >
                    {OCCUPANCY_DATA.map((entry, index) => (
                      <Cell
                        key={`occ-${index}`}
                        fill={entry.color}
                        className="transition-all duration-300 hover:opacity-85"
                      />
                    ))}
                  </Pie>
                ) : (
                  <Pie
                    data={ASSET_MIX_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={68}
                    outerRadius={98}
                    paddingAngle={2}
                    dataKey="value"
                    animationDuration={600}
                  >
                    {ASSET_MIX_DATA.map((entry, index) => (
                      <Cell
                        key={`mix-${index}`}
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
              <span className="font-mono text-3xl font-medium tracking-tight text-[#151936] leading-none">
                {activeChart === "occupancy" ? "94.6%" : "20"}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mt-1">
                {activeChart === "occupancy" ? "Occupied" : "Hubs"}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Legend Breakdown & Operational Telemetry Grid */}
        <div className="lg:col-span-7 space-y-5">
          {/* Active Legend Breakdown */}
          <div className="space-y-2.5">
            <p className="font-mono text-[11px] uppercase tracking-wider text-slate-400 font-medium">
              {activeChart === "occupancy"
                ? "Submarket Tenancy Absorption Distribution"
                : "Asset Class Allocation Breakdown"}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(activeChart === "occupancy" ? OCCUPANCY_DATA : ASSET_MIX_DATA).map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200/60 bg-white/80"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-medium text-slate-700 truncate">{item.name}</span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#151936] pl-2">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 4-KPI Benchmark Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-200/60">
            <div className="space-y-0.5">
              <p className="font-mono text-[10px] uppercase text-slate-400">Occupancy Rate</p>
              <p className="font-mono text-lg font-medium text-[#151936]">94.6%</p>
              <span className="text-[10px] text-emerald-600 font-mono">✦ Low Void Risk</span>
            </div>

            <div className="space-y-0.5">
              <p className="font-mono text-[10px] uppercase text-slate-400">Median Turn Time</p>
              <p className="font-mono text-lg font-medium text-[#151936]">18 Days</p>
              <span className="text-[10px] text-slate-400 font-mono">From Mandate</span>
            </div>

            <div className="space-y-0.5">
              <p className="font-mono text-[10px] uppercase text-slate-400">Collection Rate</p>
              <p className="font-mono text-lg font-medium text-[#151936]">99.2%</p>
              <span className="text-[10px] text-slate-400 font-mono">Escrow Managed</span>
            </div>

            <div className="space-y-0.5">
              <p className="font-mono text-[10px] uppercase text-slate-400">Covered Hubs</p>
              <p className="font-mono text-lg font-medium text-[#151936]">20 Areas</p>
              <span className="text-[10px] text-slate-400 font-mono">Live Ledger</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
