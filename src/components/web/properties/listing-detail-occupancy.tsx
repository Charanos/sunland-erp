"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  TooltipContentProps,
} from "recharts";
import { cn } from "@/lib/utils/cn";
import { formatCompactKES, formatKES } from "@/lib/utils/format";
import { WEB_ICON_STROKE, webIcons } from "../icons";

export interface OccupancyDataPoint {
  type: string;
  total: number;
  occupied: number;
  vacant: number;
  pricePerUnit?: number;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: Partial<TooltipContentProps<number, string>>) => {
  if (active && payload && payload.length) {
    const raw = payload[0].payload as OccupancyDataPoint;
    const total = raw.total;
    const occupied = raw.occupied;
    const vacant = raw.vacant;
    const occRate = Math.round((occupied / total) * 100);

    return (
      <div className="rounded-2xl border border-slate-700/60 bg-brand-dark/95 p-4 shadow-2xl backdrop-blur-xl text-white min-w-[210px] space-y-2.5">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <p className="font-medium text-sm text-white">{label}</p>
          <span className="inline-flex items-center rounded-full bg-brand-yellow/20 px-2 py-0.5 text-xxs font-medium text-brand-yellow">
            {occRate}% Occupied
          </span>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="size-2 rounded-full bg-slate-400" />
              Occupied Units
            </span>
            <span className="web-numeric font-medium text-white">{occupied} units</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="size-2 rounded-full bg-brand-yellow" />
              Available to Let
            </span>
            <span className="web-numeric font-medium text-brand-yellow">
              {vacant} {vacant === 1 ? "unit" : "units"}
            </span>
          </div>

          <div className="border-t border-white/10 pt-1.5 flex items-center justify-between gap-4 text-slate-400">
            <span>Total Capacity</span>
            <span className="web-numeric text-white">{total} units</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function ListingDetailOccupancy({
  data,
  propertyTitle,
}: {
  data: OccupancyDataPoint[];
  propertyTitle?: string;
}) {
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");

  const ShieldIcon = webIcons.shield;

  // Aggregate asset totals
  const { totalUnits, totalOccupied, totalVacant, overallOccupancyRate } = useMemo(() => {
    const total = data.reduce((acc, curr) => acc + curr.total, 0);
    const occupied = data.reduce((acc, curr) => acc + curr.occupied, 0);
    const vacant = data.reduce((acc, curr) => acc + curr.vacant, 0);
    const rate = total > 0 ? Math.round((occupied / total) * 100) : 0;
    return {
      totalUnits: total,
      totalOccupied: occupied,
      totalVacant: vacant,
      overallOccupancyRate: rate,
    };
  }, [data]);

  if (data.length === 0) return null;

  return (
    <div className="space-y-8">
      {/* ── Open Asset Health KPI Summary Strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-7 sm:py-8 border-y border-slate-200 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80">
        <div className="flex flex-col items-start sm:px-5 first:pl-0">
          <p className="text-xxs uppercase tracking-[0.14em] font-medium text-ink-400">Total Asset Units</p>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="web-numeric text-3xl sm:text-4xl font-normal text-ink-900">{totalUnits}</span>
            <span className="text-xs text-ink-400">Units</span>
          </div>
        </div>

        <div className="flex flex-col items-start pt-5 sm:pt-0 sm:px-5">
          <p className="text-xxs uppercase tracking-[0.14em] font-medium text-ink-400">Occupancy Rate</p>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="web-numeric text-3xl sm:text-4xl font-normal text-emerald-700">{overallOccupancyRate}%</span>
            <span className="text-xs text-emerald-600 font-medium">Strong</span>
          </div>
        </div>

        <div className="flex flex-col items-start pt-5 sm:pt-0 sm:px-5">
          <p className="text-xxs uppercase tracking-[0.14em] font-medium text-ink-400">Occupied Leases</p>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="web-numeric text-3xl sm:text-4xl font-normal text-ink-900">{totalOccupied}</span>
            <span className="text-xs text-ink-400">Tenants</span>
          </div>
        </div>

        <div className="flex flex-col items-start pt-5 sm:pt-0 sm:px-5 last:pr-0">
          <p className="text-xxs uppercase tracking-[0.14em] font-medium text-brand-dark">Vacant & Ready</p>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="web-numeric text-3xl sm:text-4xl font-normal text-brand-dark">{totalVacant}</span>
            <span className="text-xs font-medium text-brand-dark">To Let</span>
          </div>
        </div>
      </div>

      {/* ── Main Visualization & Table Workspace ── */}
      <div className="rounded-[24px] border border-slate-200 bg-white p-7 sm:p-8 shadow-sm space-y-6">
        {/* Workspace Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div>
            <h3 className="text-sm font-medium text-ink-900">Unit Type Inventory Breakdown</h3>
            <p className="text-xs text-ink-400 mt-1">
              Live capacity breakdown across all layout configurations.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Legend */}
            <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-ink-500">
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-slate-300" />
                <span>Occupied ({totalOccupied})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-brand-yellow" />
                <span className="text-ink-900 font-medium">Available ({totalVacant})</span>
              </div>
            </div>

            {/* View Switcher Toggle */}
            <div className="flex items-center rounded-xl bg-slate-100 p-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => setViewMode("chart")}
                className={cn(
                  "rounded-lg px-3.5 py-1.5 transition-all",
                  viewMode === "chart" ? "bg-white text-ink-900 shadow-sm" : "text-ink-500 hover:text-ink-900"
                )}
              >
                Distribution Chart
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={cn(
                  "rounded-lg px-3.5 py-1.5 transition-all",
                  viewMode === "table" ? "bg-white text-ink-900 shadow-sm" : "text-ink-500 hover:text-ink-900"
                )}
              >
                Inventory Table
              </button>
            </div>
          </div>
        </div>

        {/* ── VIEW 1: Enhanced Recharts Bar Visualization ── */}
        {viewMode === "chart" && (
          <div className="h-80 w-full pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 15, right: 15, left: -10, bottom: 5 }}
                barSize={40}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="type"
                  stroke="#94a3b8"
                  tickLine={false}
                  axisLine={false}
                  dy={8}
                  className="text-xs font-medium"
                />
                <YAxis
                  stroke="#94a3b8"
                  tickLine={false}
                  axisLine={false}
                  dx={-4}
                  className="web-numeric text-xs font-medium"
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(241, 245, 249, 0.6)" }} />
                <Bar
                  dataKey="occupied"
                  name="Occupied"
                  stackId="occupancy"
                  fill="#cbd5e1"
                  radius={[0, 0, 6, 6]}
                  animationDuration={800}
                />
                <Bar
                  dataKey="vacant"
                  name="Available"
                  stackId="occupancy"
                  fill="#f3df27"
                  radius={[6, 6, 0, 0]}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ── VIEW 2: Live Inventory Matrix Table ── */}
        {viewMode === "table" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xxs uppercase tracking-[0.14em] font-medium text-ink-400">
                  <th className="pb-3 pl-2">Layout / Unit Type</th>
                  <th className="pb-3 text-center">Total Units</th>
                  <th className="pb-3 text-center">Occupied</th>
                  <th className="pb-3 text-center">Available</th>
                  <th className="pb-3 text-right pr-2">Occupancy Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((unit) => {
                  const rate = Math.round((unit.occupied / unit.total) * 100);
                  return (
                    <tr key={unit.type} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 pl-2 font-medium text-ink-900 flex items-center gap-2">
                        <span className="size-2 rounded-full bg-brand-dark" />
                        <span>{unit.type}</span>
                      </td>
                      <td className="py-3.5 text-center web-numeric text-ink-600">{unit.total}</td>
                      <td className="py-3.5 text-center web-numeric text-slate-600">{unit.occupied}</td>
                      <td className="py-3.5 text-center">
                        {unit.vacant > 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200/60">
                            {unit.vacant} Ready to Let
                          </span>
                        ) : (
                          <span className="text-xs text-ink-400">0 (Fully Let)</span>
                        )}
                      </td>
                      <td className="py-3.5 text-right pr-2">
                        <div className="inline-flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${rate}%` }}
                            />
                          </div>
                          <span className="web-numeric font-medium text-ink-900 text-xs">{rate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Audit Footnote */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-ink-400">
          <ShieldIcon size={14} stroke={WEB_ICON_STROKE} aria-hidden="true" className="text-emerald-600 shrink-0" />
          <span>Live audit from Sunland Property Management ERP. Availability refreshed every 24h.</span>
        </div>
      </div>
    </div>
  );
}
