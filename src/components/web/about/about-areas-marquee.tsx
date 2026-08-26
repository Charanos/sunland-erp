"use client";

import Image from "next/image";
import Link from "next/link";
import { WEB_AREAS, type WebArea } from "@/components/web/constants/locations.content";
import { SectionBand } from "@/components/web/primitives/section-band";
import { WEB_ICON_STROKE, webIcons } from "@/components/web/icons";
import { GalleryMarquee } from "@/components/web/home/gallery-marquee";

/**
 * 05 — Regional Coverage Hubs Marquee.
 *
 * Distinct from the home residences gallery, this marquee highlights
 * Sunland's active regional footprint across Nairobi's prime enclaves,
 * commercial districts, satellite towns, and the Kenyan coast.
 */

// Curate key hubs with fallback photos for complete coverage
const PROMINENT_HUBS: (WebArea & { photo: string; regionBadge: string })[] = [
  {
    ...WEB_AREAS.find((a) => a.slug === "kilimani")!,
    photo: "/images/areas/kilimani.jpg",
    regionBadge: "Urban Living",
  },
  {
    ...WEB_AREAS.find((a) => a.slug === "lavington")!,
    photo: "/images/areas/lavington.jpg",
    regionBadge: "Prime Residential",
  },
  {
    ...WEB_AREAS.find((a) => a.slug === "westlands")!,
    photo: "/images/areas/westlands.jpg",
    regionBadge: "Commercial Hub",
  },
  {
    ...WEB_AREAS.find((a) => a.slug === "runda")!,
    photo: "/images/areas/runda.jpg",
    regionBadge: "Diplomatic Enclave",
  },
  {
    ...WEB_AREAS.find((a) => a.slug === "karen")!,
    photo: "/images/areas/karen.jpg",
    regionBadge: "Leafy Acreage",
  },
  {
    ...WEB_AREAS.find((a) => a.slug === "upper-hill")!,
    photo: "/images/areas/upper-hill.jpg",
    regionBadge: "Financial District",
  },
  {
    ...WEB_AREAS.find((a) => a.slug === "kileleshwa")!,
    photo: "/images/areas/kileleshwa.jpg",
    regionBadge: "Executive Towers",
  },
  {
    ...WEB_AREAS.find((a) => a.slug === "muthaiga")!,
    photo: "/images/areas/muthaiga.jpg",
    regionBadge: "Historic Estates",
  },
  {
    ...WEB_AREAS.find((a) => a.slug === "tatu-city")!,
    photo: "/images/areas/tatu-city.jpg",
    regionBadge: "Mixed-Use City",
  },
  {
    ...WEB_AREAS.find((a) => a.slug === "nyali")!,
    photo: "/images/areas/nyali.jpg",
    regionBadge: "Coastal Belt",
  },
].filter(Boolean);

export function AboutAreasMarquee() {
  const PinIcon = webIcons.pin;
  const ArrowIcon = webIcons.arrow;

  return (
    <SectionBand
      bleed
      tone="light"
      className="relative overflow-hidden py-10 sm:py-14 bg-surface-0 border-y border-line"
    >
      {/* ── Panoramic Marquee Container ── */}
      <div className="relative w-full overflow-hidden">
        {/* Left & Right Gradient Dissolve Vignettes */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 sm:w-32 lg:w-48 bg-gradient-to-r from-surface-0 via-surface-0/80 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 sm:w-32 lg:w-48 bg-gradient-to-l from-surface-0 via-surface-0/80 to-transparent"
        />

        {/* Infinite Moving Hubs Ribbon */}
        <GalleryMarquee>
          {[...PROMINENT_HUBS, ...PROMINENT_HUBS].map((hub, idx) => (
            <Link
              key={`${hub.slug}-${idx}`}
              href={`/locations/${hub.slug}`}
              aria-hidden={idx >= PROMINENT_HUBS.length ? "true" : undefined}
              className="group relative h-[240px] sm:h-[290px] lg:h-[320px] w-[300px] sm:w-[400px] lg:w-[460px] shrink-0 overflow-hidden rounded-[24px] bg-[#151936] shadow-[0_16px_36px_rgba(21,25,54,0.1)] transition-all duration-300 hover:shadow-[0_20px_45px_rgba(21,25,54,0.18)]"
            >
              {/* High-Resolution Area Photography */}
              <Image
                src={hub.photo}
                alt={`${hub.name} — ${hub.region}`}
                fill
                sizes="(max-width: 640px) 300px, (max-width: 1024px) 400px, 460px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Cinematic Gradient Scrim */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#151936]/90 via-[#151936]/35 to-black/20 opacity-80 transition-opacity duration-500 group-hover:opacity-90"
              />

              {/* Hairline Glass Border */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[24px] ring-1 ring-inset ring-white/15 group-hover:ring-white/30 transition-all"
              />

              {/* Top Glass Badges */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
                <span className="inline-flex items-center rounded-full bg-black/60 backdrop-blur-md px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white border border-white/20">
                  {hub.regionBadge}
                </span>

                <span className="inline-flex items-center rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 font-mono text-[10px] text-white/90 border border-white/20">
                  {hub.guideValue}
                </span>
              </div>

              {/* Bottom Area Identity Metadata */}
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 z-10">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <h3 className="font-editorial text-[22px] sm:text-[25px] font-medium leading-tight text-white drop-shadow-sm group-hover:text-brand-yellow transition-colors">
                      {hub.name}
                    </h3>
                    <p className="mt-1 flex items-center gap-1.5 font-mono text-xs text-slate-200/90 line-clamp-1">
                      <PinIcon size={12} stroke={WEB_ICON_STROKE} className="text-brand-yellow shrink-0" />
                      <span>{hub.tagline ?? hub.blurb}</span>
                    </p>
                  </div>

                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-brand-yellow group-hover:text-[#151936] group-hover:border-brand-yellow group-hover:translate-x-0.5 shadow-sm">
                    <ArrowIcon size={14} stroke={2} aria-hidden="true" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </GalleryMarquee>
      </div>

      {/* ── Subtitle Footer Ribbon ── */}
      <div data-reveal className="mt-6 sm:mt-8 text-center px-4">
        <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
          <span className="h-px w-5 bg-brand-yellow" />
          <span>20 Active Regional Hubs · Direct Mandate Coverage</span>
          <span className="h-px w-5 bg-brand-yellow" />
        </div>
      </div>
    </SectionBand>
  );
}
