"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { WEB_ICON_STROKE, webIcons } from "../icons";

interface PointOfInterest {
  name: string;
  category: "schools" | "shopping" | "healthcare" | "transit";
  distance: string;
  driveTime: string;
}

const NEIGHBORHOOD_POIS: Record<string, PointOfInterest[]> = {
  karen: [
    { name: "The Hub Karen", category: "shopping", distance: "1.2 km", driveTime: "4 mins" },
    { name: "Watermark Business Park", category: "shopping", distance: "2.5 km", driveTime: "6 mins" },
    { name: "Hillcrest International School", category: "schools", distance: "2.8 km", driveTime: "7 mins" },
    { name: "Banda School", category: "schools", distance: "3.5 km", driveTime: "9 mins" },
    { name: "The Karen Hospital", category: "healthcare", distance: "1.8 km", driveTime: "5 mins" },
    { name: "Karen Country Club", category: "shopping", distance: "2.1 km", driveTime: "6 mins" },
    { name: "Southern Bypass Interchange", category: "transit", distance: "3.2 km", driveTime: "8 mins" },
  ],
  lavington: [
    { name: "Lavington Mall", category: "shopping", distance: "650 m", driveTime: "2 mins" },
    { name: "Jaffery Sports Club", category: "shopping", distance: "1.1 km", driveTime: "4 mins" },
    { name: "Braeburn School Gitanga", category: "schools", distance: "1.4 km", driveTime: "5 mins" },
    { name: "Rusinga School", category: "schools", distance: "1.8 km", driveTime: "6 mins" },
    { name: "Nairobi Women's Hospital", category: "healthcare", distance: "1.5 km", driveTime: "5 mins" },
    { name: "James Gichuru / Express Way Link", category: "transit", distance: "2.2 km", driveTime: "6 mins" },
  ],
  kilimani: [
    { name: "Yaya Centre", category: "shopping", distance: "450 m", driveTime: "2 mins" },
    { name: "Adlife Plaza", category: "shopping", distance: "600 m", driveTime: "3 mins" },
    { name: "French School (Lycée Denis Diderot)", category: "schools", distance: "1.2 km", driveTime: "5 mins" },
    { name: "Cavina School", category: "schools", distance: "1.6 km", driveTime: "6 mins" },
    { name: "The Nairobi Hospital", category: "healthcare", distance: "1.9 km", driveTime: "6 mins" },
    { name: "Argwings Kodhek Commuter Route", category: "transit", distance: "300 m", driveTime: "1 min" },
  ],
  kileleshwa: [
    { name: "Kasuku Centre", category: "shopping", distance: "550 m", driveTime: "2 mins" },
    { name: "Kenya High School", category: "schools", distance: "1.3 km", driveTime: "4 mins" },
    { name: "Kileleshwa Medical Plaza", category: "healthcare", distance: "900 m", driveTime: "3 mins" },
    { name: "Riverside Drive Corridor", category: "transit", distance: "1.5 km", driveTime: "5 mins" },
  ],
  runda: [
    { name: "Village Market", category: "shopping", distance: "2.4 km", driveTime: "6 mins" },
    { name: "Two Rivers Mall", category: "shopping", distance: "3.1 km", driveTime: "8 mins" },
    { name: "International School of Kenya (ISK)", category: "schools", distance: "4.2 km", driveTime: "10 mins" },
    { name: "Rosslyn Academy", category: "schools", distance: "2.9 km", driveTime: "7 mins" },
    { name: "Aga Khan University Hospital (Gigiri)", category: "healthcare", distance: "3.0 km", driveTime: "8 mins" },
    { name: "UN Complex Gigiri", category: "transit", distance: "2.7 km", driveTime: "7 mins" },
  ],
};

const DEFAULT_POIS: PointOfInterest[] = [
  { name: "Prime Shopping Centre", category: "shopping", distance: "1.1 km", driveTime: "4 mins" },
  { name: "Top International School", category: "schools", distance: "1.8 km", driveTime: "6 mins" },
  { name: "Specialist Medical Centre", category: "healthcare", distance: "1.5 km", driveTime: "5 mins" },
  { name: "Major Expressway Link", category: "transit", distance: "2.0 km", driveTime: "6 mins" },
];

/**
 * The filter chips, and the single source of the category union.
 *
 * `as const` plus a derived type is what removes the `as any` the click handler
 * needed: the chip ids and the state's accepted values are now the same list,
 * so adding a category to this array is a compile error everywhere it has not
 * been handled, rather than a cast that silently accepts a typo.
 */
const POI_FILTERS = [
  { id: "all", label: "All" },
  { id: "schools", label: "Schools" },
  { id: "shopping", label: "Shopping & Dining" },
  { id: "healthcare", label: "Healthcare" },
  { id: "transit", label: "Transit" },
] as const;

type PoiCategory = (typeof POI_FILTERS)[number]["id"];

export function ListingInteractiveMap({
  location,
  areaName,
  areaSlug,
}: {
  location: string;
  areaName: string;
  areaSlug: string;
}) {
  const [selectedCategory, setSelectedCategory] = useState<PoiCategory>("all");
  const [mapMode, setMapMode] = useState<"roadmap" | "satellite">("roadmap");

  const PinIcon = webIcons.pin;
  const ArrowIcon = webIcons.arrow;

  const normalizedKey = areaSlug.toLowerCase().replace(/[^a-z0-9]+/g, "-").split("-")[0];
  const pois = NEIGHBORHOOD_POIS[normalizedKey] || DEFAULT_POIS;

  const filteredPois = useMemo(() => {
    if (selectedCategory === "all") return pois;
    return pois.filter((p) => p.category === selectedCategory);
  }, [pois, selectedCategory]);

  const mapQuery = encodeURIComponent(`${location}, Nairobi, Kenya`);
  const mapUrl = `https://maps.google.com/maps?q=${mapQuery}&t=${mapMode === "satellite" ? "k" : "m"}&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <section className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="web-title text-web-h3 text-ink-900">Location & Neighborhood</h2>
          <p className="text-sm text-ink-500 mt-1">
            Explore nearby amenities, schools, retail, and connectivity in {areaName}.
          </p>
        </div>

        {/* Satellite / Standard Toggle */}
        <div className="flex items-center rounded-xl bg-slate-100 p-1 text-xs font-medium">
          <button
            type="button"
            onClick={() => setMapMode("roadmap")}
            className={cn(
              "rounded-lg px-3 py-1.5 transition-all",
              mapMode === "roadmap" ? "bg-white text-ink-900 shadow-sm" : "text-ink-500 hover:text-ink-900"
            )}
          >
            Map
          </button>
          <button
            type="button"
            onClick={() => setMapMode("satellite")}
            className={cn(
              "rounded-lg px-3 py-1.5 transition-all",
              mapMode === "satellite" ? "bg-white text-ink-900 shadow-sm" : "text-ink-500 hover:text-ink-900"
            )}
          >
            Satellite
          </button>
        </div>
      </div>

      {/* ── Interactive Map Shell ── */}
      <div className="relative overflow-hidden rounded-[22px] border border-slate-200 bg-slate-100 shadow-sm">
        {/* Google Maps Embedded Frame */}
        <div className="relative h-[360px] sm:h-[400px] w-full">
          <iframe
            title={`Map view of ${location}`}
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="size-full filter saturate-[0.95]"
          />

          {/* Approximate Privacy Badge */}
          <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-brand-dark/90 px-3.5 py-1.5 text-xs text-white backdrop-blur-md shadow-md border border-white/10">
            <PinIcon size={14} stroke={WEB_ICON_STROKE} aria-hidden="true" className="text-brand-yellow" />
            <span>Approximate Location in {areaName}</span>
          </div>
        </div>

        {/* Security & Verification Notice */}
        <div className="border-t border-slate-200/80 bg-white p-4.5 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-ink-500">
          <p className="leading-relaxed">
            <span className="font-medium text-ink-700">Privacy & Security:</span> Exact house number and gate pin are provided upon viewing confirmation.
          </p>
          <Link
            href={`/locations/${areaSlug}`}
            className="inline-flex items-center gap-1.5 font-medium text-ink-900 transition-colors hover:text-brand-dark shrink-0"
          >
            <span>Explore {areaName} Guide</span>
            <ArrowIcon size={14} stroke={WEB_ICON_STROKE} aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* ── Key Points of Interest (POIs) Strip ── */}
      <div className="space-y-4 pt-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-xs uppercase tracking-wider font-medium text-ink-400">
            Nearby Key Establishments
          </h3>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-1 text-xs">
            {POI_FILTERS.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "rounded-lg px-2.5 py-1 transition-all text-xs font-medium",
                  selectedCategory === cat.id
                    ? "bg-brand-dark text-white shadow-sm"
                    : "bg-slate-100 text-ink-600 hover:bg-slate-200"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Open POI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-1 divide-y sm:divide-y-0 divide-slate-100 pt-2">
          {filteredPois.map((poi) => (
            <div
              key={poi.name}
              className="flex items-center justify-between py-3.5 border-b border-slate-100 last:border-0 transition-colors"
            >
              <div className="min-w-0 pr-3">
                <p className="text-sm font-medium text-ink-900 truncate">{poi.name}</p>
                <p className="text-xxs uppercase tracking-wider text-ink-400 capitalize mt-0.5">{poi.category}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="web-numeric text-xs font-medium text-ink-900 block">{poi.distance}</span>
                <span className="text-web-micro text-emerald-600 font-medium">{poi.driveTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
