"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

export type WebStat = {
  value: number;
  label: string;
  suffix?: string;
};

const DURATION_MS = 900;

function useCountUp(target: number, enabled: boolean) {
  const [animated, setAnimated] = useState(0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / DURATION_MS, 1);
      const eased = 1 - (1 - progress) ** 3;
      setAnimated(Math.round(target * eased));
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [target, enabled]);

  return enabled ? animated : target;
}

const STAT_METAS: Record<string, { sub: string }> = {
  "properties listed": {
    sub: "Verified stock live",
  },
  "areas covered": {
    sub: "Nairobi & Coast",
  },
  "property types": {
    sub: "Homes, Land & Comms",
  },
  "live portals": {
    sub: "Owner & Tenant sync",
  },
};

function Stat({ stat, animate }: { stat: WebStat; animate: boolean }) {
  const value = useCountUp(stat.value, animate);

  return (
    <div>
      <p className="web-numeric text-3xl sm:text-4xl text-slate-900 font-medium tracking-tight leading-none">
        <span aria-hidden="true">
          {value.toLocaleString("en-KE")}
          {stat.suffix}
        </span>
        <span className="sr-only">
          {stat.value.toLocaleString("en-KE")}
          {stat.suffix}
        </span>
      </p>
      <p className="web-control mt-1.5 text-xs uppercase tracking-[0.16em] text-slate-500 font-medium">
        {stat.label}
      </p>
    </div>
  );
}

export function StatBlock({
  stats,
  className,
  variant = "strip",
}: {
  stats: WebStat[];
  className?: string;
  variant?: "strip" | "hud";
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setAnimate(true);
        observer.disconnect();
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (stats.length === 0) return null;

  if (variant === "hud") {
    return (
      <div
        ref={containerRef}
        className={cn(
          "w-full rounded-[24px] sm:rounded-[28px] border border-white/20 bg-slate-950/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.35)] overflow-hidden transition-all duration-300 hover:border-white/30 relative",
          className
        )}
      >
        {/* Specular top light edge */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
        />

        {/* 2x2 Grid with Precision Cross-Hairline Boundaries */}
        <div className="grid grid-cols-2 divide-x divide-y divide-white/10">
          {stats.map((stat) => {
            const meta = STAT_METAS[stat.label.toLowerCase()] ?? {
              sub: "Live system figure",
            };

            return (
              <div
                key={stat.label}
                className="stat-tile p-5 sm:p-6 flex flex-col justify-between hover:bg-white/[0.025] transition-colors"
              >
                {/* Header row: Label */}
                <div>
                  <span className="text-[10.5px] uppercase tracking-[0.18em] font-mono font-medium text-slate-400 block truncate">
                    {stat.label}
                  </span>
                </div>

                {/* Big Metric Numeral */}
                <p className="web-numeric text-3xl sm:text-[36px] text-white font-medium tracking-tight leading-none my-2">
                  <span aria-hidden="true">
                    {animate ? stat.value.toLocaleString("en-KE") : stat.value}
                    {stat.suffix}
                  </span>
                  <span className="sr-only">
                    {stat.value.toLocaleString("en-KE")}
                    {stat.suffix}
                  </span>
                </p>

                {/* Micro Subtitle */}
                <p className="text-xs font-mono text-slate-400/90 truncate">{meta.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Minimalist Integrated Footer */}
        <div className="px-6 py-3.5 bg-black/30 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Direct Landlord & Tenant Portals</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4", className)}
    >
      {stats.map((stat) => (
        <Stat key={stat.label} stat={stat} animate={animate} />
      ))}
    </div>
  );
}
