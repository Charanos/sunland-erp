"use client";

import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, TooltipContentProps } from "recharts";
import { formatCompactKES } from "@/lib/utils/format";

const CustomTooltip = ({ active, payload, label }: Partial<TooltipContentProps<number, string>>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-web-card border border-line bg-surface-0/95 p-3.5 shadow-web-md backdrop-blur-md">
        <p className="label-caps mb-2 text-ink-400">{label}</p>
        <div className="space-y-1.5 text-sm font-medium">
          {payload.map((entry, i) => (
            <p
              key={i}
              className="flex items-center justify-between gap-6"
              style={{ color: entry.color ?? "#151936" }}
            >
              <span>{entry.name}:</span>
              <span className="web-numeric text-ink-900">
                {formatCompactKES(entry.value as number)}
              </span>
            </p>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function ListingDetailChart({ priceKes }: { priceKes: number | null }) {
  const data = useMemo(() => {
    if (!priceKes) return [];
    
    // Simulate a 6 month trend based on the current price.
    // In production, this would come from the database (e.g. historical aggregates).
    const months = ["Mar", "Apr", "May", "Jun", "Jul", "Aug"];
    const baseAvg = priceKes * 0.92; // Avg is slightly lower

    return months.map((month, index) => {
      // Create some variance (-2% to +3%)
      const variance = (index % 3) * 0.015;
      const avgVariance = ((index + 1) % 3) * 0.01;

      return {
        month,
        price: Math.round(priceKes * (1 + variance)),
        "Area avg": Math.round(baseAvg * (1 + avgVariance)),
      };
    });
  }, [priceKes]);

  if (data.length === 0) return null;

  return (
    <div className="h-40 w-full mt-4 border-t border-line-soft pt-4">
      <div className="mb-4">
        <h3 className="label-caps text-ink-400">Price Trend &middot; 6 Months</h3>
      </div>
      <ResponsiveContainer width="100%" height="100%" minHeight={0} minWidth={0}>
        <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-brand-yellow)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--color-brand-yellow)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#e3e3e8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#e3e3e8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            stroke="#6b7080"
            tickLine={false}
            axisLine={false}
            dy={8}
            className="text-xs font-medium"
          />
          <YAxis
            stroke="#6b7080"
            tickLine={false}
            axisLine={false}
            dx={-4}
            className="web-numeric text-xs"
            tickFormatter={(value) => formatCompactKES(value)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="Area avg"
            stroke="#b9c2b2"
            fillOpacity={1}
            fill="url(#colorAvg)"
            animationDuration={800}
          />
          <Area
            type="monotone"
            dataKey="price"
            name="Property"
            stroke="var(--color-ink-900)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorPrice)"
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
