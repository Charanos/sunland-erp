"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const data6M = [
  { month: "Jan", amount: 1080000, occupancy: 92 },
  { month: "Feb", amount: 1150000, occupancy: 94 },
  { month: "Mar", amount: 1220000, occupancy: 94 },
  { month: "Apr", amount: 1280000, occupancy: 96 },
  { month: "May", amount: 1360000, occupancy: 96 },
  { month: "Jun", amount: 1420000, occupancy: 98 },
];

const data1Y = [
  { month: "Jul", amount: 890000, occupancy: 88 },
  { month: "Aug", amount: 920000, occupancy: 90 },
  { month: "Sep", amount: 960000, occupancy: 90 },
  { month: "Oct", amount: 1040000, occupancy: 92 },
  { month: "Nov", amount: 1060000, occupancy: 92 },
  { month: "Dec", amount: 1050000, occupancy: 92 },
  { month: "Jan", amount: 1080000, occupancy: 92 },
  { month: "Feb", amount: 1150000, occupancy: 94 },
  { month: "Mar", amount: 1220000, occupancy: 94 },
  { month: "Apr", amount: 1280000, occupancy: 96 },
  { month: "May", amount: 1360000, occupancy: 96 },
  { month: "Jun", amount: 1420000, occupancy: 98 },
];

export function LandlordRentChart() {
  const [timeRange, setTimeRange] = useState<"6M" | "1Y">("6M");
  const chartData = timeRange === "6M" ? data6M : data1Y;

  return (
    <div className="w-full">
      {/* Chart Header & Controls */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse motion-reduce:animate-none" />
          <span className="text-web-micro font-mono uppercase tracking-wider text-slate-500 font-medium">
            Remittance Curve (KES)
          </span>
        </div>
        <div className="flex items-center gap-1 bg-slate-100/80 p-0.5 rounded-lg border border-slate-200/60">
          <button
            type="button"
            onClick={() => setTimeRange("6M")}
            className={`px-2 py-0.5 text-web-nano font-mono rounded transition-all ${
              timeRange === "6M"
                ? "bg-white text-ink-900 font-medium shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            6M
          </button>
          <button
            type="button"
            onClick={() => setTimeRange("1Y")}
            className={`px-2 py-0.5 text-web-nano font-mono rounded transition-all ${
              timeRange === "1Y"
                ? "bg-white text-ink-900 font-medium shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            1Y
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-[150px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="60%" stopColor="#10b981" stopOpacity={0.08} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#94a3b8", fontFamily: "ui-monospace, monospace" }}
              dy={6}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: "#94a3b8", fontFamily: "ui-monospace, monospace" }}
              tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
              domain={["dataMin - 100000", "dataMax + 80000"]}
            />
            <Tooltip
              cursor={{ stroke: "#10b981", strokeWidth: 1, strokeDasharray: "3 3" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const dataPoint = payload[0].payload;
                  return (
                    <div className="bg-[#111633] text-white px-3 py-2 rounded-lg shadow-xl border border-slate-700/80 text-left">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="text-web-nano font-mono text-slate-400 uppercase tracking-wider">
                          {dataPoint.month} Remittance
                        </span>
                        <span className="text-web-nano font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                          {dataPoint.occupancy}% Occ.
                        </span>
                      </div>
                      <p className="text-web-xs font-mono font-medium text-emerald-400">
                        KES {(payload[0].value as number).toLocaleString()}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#059669"
              strokeWidth={2.2}
              fillOpacity={1}
              fill="url(#colorRentGradient)"
              activeDot={{ r: 4.5, fill: "#10b981", stroke: "#ffffff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
