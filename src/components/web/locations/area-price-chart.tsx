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
  Cell,
} from "recharts";
import { formatCompactKES, formatKES } from "@/lib/utils/format";
import type { LocationPriceRow } from "@/lib/services/web/locations";

interface AreaPriceChartProps {
  editorialRows?: { type: string; toLet: string; forSale: string; emphasis?: boolean }[];
  liveRows?: LocationPriceRow[];
}

function parseRangeAverage(val: string): number | null {
  if (!val || val === "—" || val.includes("request")) return null;

  const numbers = val.match(/\d+(\.\d+)?/g);
  if (!numbers) return null;

  const isK = val.toLowerCase().includes("k");
  const isM = val.toLowerCase().includes("m");
  const isSqft = val.toLowerCase().includes("sqft");

  if (isSqft) return null;

  let sum = 0;
  for (const n of numbers) {
    sum += parseFloat(n);
  }
  let avg = sum / numbers.length;

  if (isK) avg *= 1000;
  if (isM) avg *= 1000000;

  return avg;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-200/90 bg-white/95 p-4 shadow-lg backdrop-blur-md">
        <p className="font-mono text-[11px] uppercase tracking-wider text-slate-400 mb-2">{label}</p>
        <div className="space-y-1.5 text-sm font-medium text-[#151936]">
          {payload.map((entry: any, i: number) => (
            <p key={i} className="flex items-center justify-between gap-6">
              <span className="flex items-center gap-2">
                <span className="size-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-slate-600">{entry.name}:</span>
              </span>
              <span className="font-mono font-medium text-[#151936]">
                {formatKES(entry.value)}
              </span>
            </p>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function AreaPriceChart({ editorialRows, liveRows }: AreaPriceChartProps) {
  const [metric, setMetric] = useState<"rent" | "sale">("rent");

  const data = useMemo(() => {
    if (editorialRows) {
      return editorialRows
        .map((row) => {
          const rentVal = parseRangeAverage(row.toLet);
          const saleVal = parseRangeAverage(row.forSale);
          return {
            name: row.type,
            rent: rentVal,
            sale: saleVal,
            emphasis: row.emphasis,
            originalRent: row.toLet,
            originalSale: row.forSale,
          };
        })
        .filter((row) => (metric === "rent" ? row.rent !== null : row.sale !== null));
    }

    if (liveRows) {
      if (metric === "sale") return [];
      return liveRows
        .filter((row) => row.typicalRent !== null)
        .map((row) => ({
          name: row.label,
          rent: row.typicalRent,
          sale: null,
          emphasis: false,
          originalRent: row.typicalRent ? String(row.typicalRent) : "",
          originalSale: "",
        }));
    }

    return [];
  }, [editorialRows, liveRows, metric]);

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="w-full pt-4 pb-2">
      {/* Visual Header with Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200/80 mb-6">
        <div>
          <h4 className="font-editorial text-xl sm:text-2xl font-medium text-[#151936]">
            Submarket Yield & Pricing Spectrum
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            {metric === "rent"
              ? "Average realized monthly rent benchmarks across unit configurations"
              : "Average capital acquisition valuations across property categories"}
          </p>
        </div>

        {editorialRows && (
          <div className="flex bg-slate-100/90 rounded-full p-1 border border-slate-200/70">
            <button
              type="button"
              onClick={() => setMetric("rent")}
              className={`cursor-pointer px-4 py-1.5 text-[11px] font-mono uppercase tracking-wider rounded-full transition-all duration-200 ${
                metric === "rent"
                  ? "bg-[#151936] text-white shadow-xs font-medium"
                  : "text-slate-500 hover:text-[#151936]"
              }`}
            >
              Monthly Rent
            </button>
            <button
              type="button"
              onClick={() => setMetric("sale")}
              className={`cursor-pointer px-4 py-1.5 text-[11px] font-mono uppercase tracking-wider rounded-full transition-all duration-200 ${
                metric === "sale"
                  ? "bg-[#151936] text-white shadow-xs font-medium"
                  : "text-slate-500 hover:text-[#151936]"
              }`}
            >
              Sale Valuation
            </button>
          </div>
        )}
      </div>

      {/* Full-width Responsive Chart Frame */}
      <div className="h-[300px] sm:h-[340px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 15, right: 15, left: -5, bottom: 25 }}
            barCategoryGap="28%"
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#475569" }}
              dy={12}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#64748B" }}
              tickFormatter={(val) => formatCompactKES(val)}
              width={65}
            />
            <Tooltip cursor={{ fill: "#F8FAFC", opacity: 0.8 }} content={<CustomTooltip />} />
            <Bar
              dataKey={metric}
              name={metric === "rent" ? "Avg. Monthly Rent" : "Avg. Sale Valuation"}
              radius={[6, 6, 0, 0]}
              maxBarSize={64}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.emphasis ? "#151936" : "#cbd5e1"}
                  className="transition-all duration-300 hover:opacity-85"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
