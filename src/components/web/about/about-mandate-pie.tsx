"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * The mandate split ring dial, sitting under the commitments heading.
 *
 * Implemented using pure hand-drawn SVG rings matching the Home Hero PortfolioDial
 * architecture, with zero runtime Recharts delay, crisp stroke-dasharray arcs,
 * and synchronized hover interactions.
 */

const SEGMENT_COLORS = ["#151936", "#3b4478", "#8a93c4"];
const RADIUS = 64;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP_DEGREES = 3.5;

type Segment = { title: string; count: number };

export function AboutMandatePie({ segments }: { segments: Segment[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeSegment, setActiveSegment] = useState<string | null>(null);

  const total = segments.reduce((sum, segment) => sum + segment.count, 0);
  if (total === 0) return null;

  const data = segments.map((segment, index) => ({
    ...segment,
    share: Math.round((segment.count / total) * 100),
    color: SEGMENT_COLORS[index % SEGMENT_COLORS.length],
  }));

  const arcs = data.map((slice, index) => {
    const share = slice.count / total;
    const degrees = share * 360;
    const length = Math.max(((degrees - GAP_DEGREES) / 360) * CIRCUMFERENCE, 0);
    const preceding = data.slice(0, index).reduce((sum, item) => sum + item.count, 0);
    const rotation = (preceding / total) * 360;

    return {
      ...slice,
      share,
      length,
      rotation,
    };
  });

  return (
    <div
      ref={rootRef}
      className="mt-8 rounded-2xl border border-line bg-surface-0 p-5 shadow-xs sm:p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="size-1.5 rounded-full bg-[#151936] shrink-0" />
        <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-slate-500 font-medium">
          Where mandates are held
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* SVG Ring Dial */}
        <div className="relative shrink-0">
          <svg
            viewBox="0 0 160 160"
            className="size-[120px] -rotate-90 sm:size-[128px]"
            role="img"
            aria-label={`Mandate distribution: ${arcs
              .map((arc) => `${arc.title}, ${arc.count} areas`)
              .join("; ")}. ${total} areas total.`}
          >
            {/* Background Track */}
            <circle
              cx="80"
              cy="80"
              r={RADIUS}
              fill="none"
              stroke="rgba(21, 25, 54, 0.08)"
              strokeWidth="14"
            />

            {/* Segment Arcs */}
            {arcs.map((arc) => {
              const offset = (arc.rotation / 360) * CIRCUMFERENCE;
              const isActive = activeSegment === arc.title;

              return (
                <circle
                  key={arc.title}
                  cx="80"
                  cy="80"
                  r={RADIUS}
                  fill="none"
                  stroke={isActive ? "#10b981" : arc.color}
                  strokeWidth={isActive ? "16" : "14"}
                  strokeDasharray={`${arc.length} ${CIRCUMFERENCE}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="round"
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setActiveSegment(arc.title)}
                  onMouseLeave={() => setActiveSegment(null)}
                />
              );
            })}
          </svg>

          {/* Center Hole Information */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-2xl font-medium leading-none text-[#151936]">
              {total}
            </span>
            <span className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-slate-400 font-medium">
              Areas
            </span>
          </div>
        </div>

        {/* Legend Rows */}
        <ul className="flex-1 w-full space-y-2.5">
          {data.map((item) => {
            const isActive = activeSegment === item.title;

            return (
              <li
                key={item.title}
                onMouseEnter={() => setActiveSegment(item.title)}
                onMouseLeave={() => setActiveSegment(null)}
                className={cn(
                  "flex items-center justify-between gap-3 text-xs rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer",
                  isActive ? "bg-surface-1" : "hover:bg-surface-1/60"
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={cn(
                      "size-2 rounded-full shrink-0 transition-transform",
                      isActive ? "scale-125 bg-emerald-500" : ""
                    )}
                    style={{ backgroundColor: isActive ? undefined : item.color }}
                  />
                  <span
                    className={cn(
                      "truncate font-normal transition-colors",
                      isActive ? "text-[#151936] font-medium" : "text-slate-600"
                    )}
                  >
                    {item.title}
                  </span>
                </div>

                <span className="font-mono font-medium text-[#151936] shrink-0">
                  {item.share}%
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="mt-4 border-t border-line-soft pt-3 font-mono text-[11px] leading-relaxed text-slate-400 font-normal">
        Coverage footprint, not current stock. Live listings update in real time above.
      </p>
    </div>
  );
}
