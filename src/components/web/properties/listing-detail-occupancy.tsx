"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, TooltipContentProps } from "recharts";
import { cn } from "@/lib/utils/cn";

interface OccupancyDataPoint {
  type: string;
  total: number;
  occupied: number;
  vacant: number;
}

const CustomTooltip = ({ active, payload, label }: Partial<TooltipContentProps<number, string>>) => {
  if (active && payload && payload.length) {
    const total = payload[0].payload.total;
    const occupied = payload.find((p) => p.dataKey === "occupied")?.value ?? 0;
    const vacant = payload.find((p) => p.dataKey === "vacant")?.value ?? 0;

    return (
      <div className="rounded-web-card border border-line bg-surface-0/95 p-3.5 shadow-web-md backdrop-blur-md">
        <p className="label-caps mb-2 text-ink-400">{label}</p>
        <div className="space-y-1.5 text-sm font-medium">
          <p className="flex items-center justify-between gap-6 text-ink-900">
            <span>Occupied</span>
            <span className="web-numeric">{occupied}</span>
          </p>
          <p className="flex items-center justify-between gap-6 text-ink-500">
            <span>Vacant</span>
            <span className="web-numeric">{vacant}</span>
          </p>
          <div className="my-2 h-px w-full bg-line-soft" />
          <p className="flex items-center justify-between gap-6 text-ink-900">
            <span>Total Units</span>
            <span className="web-numeric">{total}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function ListingDetailOccupancy({ data }: { data: OccupancyDataPoint[] }) {
  if (data.length === 0) return null;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%" minHeight={0} minWidth={0}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
          barSize={32}
        >
          <XAxis
            dataKey="type"
            stroke="#6b7080"
            tickLine={false}
            axisLine={false}
            dy={8}
            className="text-sm font-medium"
          />
          <YAxis
            stroke="#6b7080"
            tickLine={false}
            axisLine={false}
            dx={-4}
            className="web-numeric text-xs"
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
          <Bar
            dataKey="occupied"
            stackId="a"
            fill="#e3e3e8"
            radius={[0, 0, 4, 4]}
            animationDuration={800}
            animationEasing="ease-out"
          />
          <Bar
            dataKey="vacant"
            stackId="a"
            fill="var(--color-brand-yellow)"
            radius={[4, 4, 0, 0]}
            animationDuration={800}
            animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
