import Image from "next/image";
import { galleryDefaults } from "./home.defaults";
import { SectionBand } from "../primitives/section-band";
import { WEB_ICON_STROKE, webIcons } from "../icons";

/**
 * 09.5 home.gallery, full bleed panoramic cinematic showcase.
 *
 * Pure visual interconnector between Proof and FAQ.
 * Features an infinite panoramic marquee of premier residences with edge gradient vignettes.
 */
export function HomeGallery() {
  const PinIcon = webIcons.pin;
  const items = [...galleryDefaults.items, ...galleryDefaults.items];

  return (
    <SectionBand
      bleed
      tone="light"
      className="relative overflow-hidden py-6 sm:py-10 bg-white border-y border-slate-100/80"
    >
      {/* Cinematic Full-Bleed Panoramic Marquee */}
      <div className="relative w-full overflow-hidden">
        {/* Left & Right Gradient Dissolve Vignettes */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-20 w-20 sm:w-36 lg:w-56 bg-gradient-to-r from-white via-white/80 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-20 w-20 sm:w-36 lg:w-56 bg-gradient-to-l from-white via-white/80 to-transparent"
        />

        {/* Infinite Moving Ribbon */}
        <div className="flex w-max animate-web-marquee gap-5 sm:gap-6 py-2 will-change-transform">
          {items.map((item, idx) => (
            <div
              key={`${item.title}-${idx}`}
              className="group relative h-[260px] sm:h-[320px] lg:h-[360px] w-[340px] sm:w-[460px] lg:w-[540px] shrink-0 overflow-hidden rounded-[22px] bg-[#151936] shadow-[0_16px_36px_rgba(21,25,54,0.08),0_2px_8px_rgba(0,0,0,0.04)] cursor-pointer"
            >
              {/* High-Resolution Architectural Photography */}
              <Image
                src={item.image}
                alt={`${item.title} — ${item.location}`}
                fill
                sizes="(max-width: 640px) 340px, (max-width: 1024px) 460px, 540px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />

              {/* Ambient Atmospheric Gradient Overlay */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#151936]/90 via-[#151936]/25 to-black/10 opacity-75 transition-opacity duration-500 group-hover:opacity-90"
              />

              {/* Inset Hairline Glass Border */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[22px] ring-1 ring-inset ring-white/15"
              />

              {/* Architectural Metadata Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7 z-10">
                <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-md px-2.5 py-0.5 font-mono text-[9.5px] uppercase tracking-wider text-white border border-white/25 mb-2 shadow-xs">
                  {item.category}
                </span>
                <h3 className="font-editorial text-[21px] sm:text-[25px] font-medium leading-tight text-white drop-shadow-sm">
                  {item.title}
                </h3>
                <p className="mt-1 flex items-center gap-1.5 font-mono text-xs text-slate-200/85">
                  <PinIcon size={12} stroke={WEB_ICON_STROKE} className="text-brand-yellow shrink-0" />
                  {item.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionBand>
  );
}
