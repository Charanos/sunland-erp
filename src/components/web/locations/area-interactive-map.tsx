"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { WEB_ICON_STROKE, webIcons } from "../icons";

interface AreaInteractiveMapProps {
  areaName: string;
  region: string;
}

export function AreaInteractiveMap({ areaName, region }: AreaInteractiveMapProps) {
  const [mapMode, setMapMode] = useState<"roadmap" | "satellite">("roadmap");
  const PinIcon = webIcons.pin;

  // Google Maps embed URL with direct query parameter (zero API key requirement)
  const mapQuery = encodeURIComponent(`${areaName}, ${region}, Kenya`);
  const mapUrl = `https://maps.google.com/maps?q=${mapQuery}&t=${mapMode === "satellite" ? "k" : "m"}&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-2xs">
      {/* Google Maps Embedded Frame */}
      <div className="relative h-[340px] sm:h-[400px] w-full">
        <iframe
          title={`Map view of ${areaName}`}
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="size-full filter saturate-[0.95]"
        />

        {/* Top Badges Strip */}
        <div className="absolute inset-x-4 top-4 z-10 flex items-center justify-between gap-3 pointer-events-none">
          {/* Approximate Location Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-dark/90 border border-white/15 px-3.5 py-1.5 font-mono text-web-nano font-medium text-white backdrop-blur-md shadow-xs">
            <PinIcon size={12} stroke={WEB_ICON_STROKE} aria-hidden="true" className="text-brand-yellow" />
            <span>{areaName} Submarket Hub</span>
          </div>

          {/* Map Controls */}
          <div className="pointer-events-auto flex items-center rounded-full bg-white/95 border border-slate-200/80 p-1 shadow-xs backdrop-blur-md">
            <button
              type="button"
              onClick={() => setMapMode("roadmap")}
              className={cn(
                "cursor-pointer px-3 py-1 text-web-nano font-mono uppercase tracking-wider rounded-full transition-all",
                mapMode === "roadmap"
                  ? "bg-brand-dark text-white font-medium shadow-xs"
                  : "text-slate-500 hover:text-ink-900"
              )}
            >
              Map
            </button>
            <button
              type="button"
              onClick={() => setMapMode("satellite")}
              className={cn(
                "cursor-pointer px-3 py-1 text-web-nano font-mono uppercase tracking-wider rounded-full transition-all",
                mapMode === "satellite"
                  ? "bg-brand-dark text-white font-medium shadow-xs"
                  : "text-slate-500 hover:text-ink-900"
              )}
            >
              Satellite
            </button>
          </div>
        </div>
      </div>

      {/* Subtle Security & Boundary Disclaimer */}
      <div className="border-t border-slate-200/70 bg-white/95 px-5 py-3 flex items-center justify-between gap-3 text-xs text-slate-500 font-normal">
        <p className="flex items-center gap-1.5">
          <span className="font-medium text-slate-700 font-mono text-web-micro uppercase tracking-wider">Demarcation:</span>
          <span>Verified municipal zone and submarket perimeter boundaries.</span>
        </p>
        <span className="font-mono text-web-nano text-slate-400 hidden sm:inline">Sunland Spatial Registry</span>
      </div>
    </div>
  );
}
