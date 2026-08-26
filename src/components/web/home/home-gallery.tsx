import Image from "next/image";
import Link from "next/link";
import { SectionBand } from "../primitives/section-band";
import { WEB_ICON_STROKE, webIcons } from "../icons";
import { GalleryMarquee } from "./gallery-marquee";

/**
 * 09.5 home.gallery, full bleed panoramic cinematic showcase.
 *
 * Infinite panoramic marquee of premier residences under Sunland mandate,
 * scrolling smoothly from left to right and directly linked to real property detail pages.
 */

export type FeaturedGalleryProperty = {
  slug: string;
  title: string;
  location: string;
  category: string;
  price: string;
  image: string;
};

export const GALLERY_PROPERTIES: FeaturedGalleryProperty[] = [
  {
    slug: "luxury-3-bedroom-duplex-penthouse-lavington",
    title: "Luxury 3 Bedroom Duplex Penthouse",
    location: "Lavington, Nairobi",
    category: "Duplex Penthouse",
    price: "KES 180,000 / mo",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
  },
  {
    slug: "contemporary-5-bedroom-villa-karen",
    title: "Contemporary 5 Bed Ambassadorial Villa",
    location: "Karen, Nairobi",
    category: "Executive Villa",
    price: "KES 145,000,000",
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85",
  },
  {
    slug: "4-bedroom-penthouse-suite-riverside",
    title: "4 Bedroom Penthouse Suite",
    location: "Riverside Drive, Nairobi",
    category: "Penthouse Suite",
    price: "KES 52,000,000",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85",
  },
  {
    slug: "5-bedroom-colonial-estate-muthaiga",
    title: "5 Bedroom Grand Estate",
    location: "Muthaiga, Nairobi",
    category: "Diplomatic Manor",
    price: "KES 240,000,000",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85",
  },
  {
    slug: "four-bedroom-luxury-villa-spring-valley",
    title: "Four Bedroom Luxury Villa",
    location: "Spring Valley, Nairobi",
    category: "Private Sanctuary",
    price: "KES 117,500,000",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
  },
  {
    slug: "beachfront-4-bedroom-villa-nyali",
    title: "Beachfront 4 Bedroom Coastal Haven",
    location: "Nyali, Coast",
    category: "Coastal Estate",
    price: "KES 88,000,000",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85",
  },
  {
    slug: "4-bedroom-townhouse-runda",
    title: "4 Bedroom Gated Community Townhouse",
    location: "Runda, Nairobi",
    category: "Gated Townhouse",
    price: "KES 280,000 / mo",
    image:
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1600&q=85",
  },
  {
    slug: "executive-2-bedroom-furnished-kileleshwa",
    title: "Executive 2 Bedroom Furnished Suite",
    location: "Kileleshwa, Nairobi",
    category: "Furnished Residence",
    price: "KES 140,000 / mo",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=85",
  },
];

export function HomeGallery() {
  const PinIcon = webIcons.pin;
  const ArrowIcon = webIcons.arrowOut;
  const items = GALLERY_PROPERTIES;

  return (
    <SectionBand
      bleed
      tone="light"
      className="relative overflow-hidden py-8 sm:py-12 bg-white border-y border-slate-100/80"
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

        {/* Infinite Moving Ribbon — Left to Right */}
        <GalleryMarquee direction="ltr">
          {[...items, ...items].map((item, idx) => (
            <Link
              key={`${item.slug}-${idx}`}
              href={`/properties/${item.slug}`}
              aria-hidden={idx >= items.length ? "true" : undefined}
              className="group relative h-[260px] sm:h-[320px] lg:h-[360px] w-[340px] sm:w-[460px] lg:w-[540px] shrink-0 overflow-hidden rounded-[24px] bg-[#151936] shadow-[0_16px_36px_rgba(21,25,54,0.1)] transition-all duration-300 hover:shadow-[0_22px_48px_rgba(21,25,54,0.18)] cursor-pointer"
            >
              {/* High-Resolution Architectural Photography */}
              <Image
                src={item.image}
                alt={`${item.title} — ${item.location}`}
                fill
                sizes="(max-width: 640px) 340px, (max-width: 1024px) 460px, 540px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Ambient Atmospheric Gradient Overlay */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#151936]/90 via-[#151936]/30 to-black/15 opacity-80 transition-opacity duration-500 group-hover:opacity-90"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/45 to-transparent"
              />

              {/* Inset Hairline Glass Border */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[24px] ring-1 ring-inset ring-white/15 group-hover:ring-white/30 transition-all"
              />

              {/* Top Bar: Category Pill + Uncarded Price */}
              <div className="absolute top-4 inset-x-4 sm:top-5 sm:inset-x-5 flex items-center justify-between z-10">
                <span className="inline-flex items-center rounded-full bg-black/55 backdrop-blur-md px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white border border-white/20 shadow-xs">
                  {item.category}
                </span>

                <span className="font-mono text-[15px] sm:text-base lg:text-[17px] font-medium tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  {item.price}
                </span>
              </div>

              {/* Bottom Architectural Metadata Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 z-10">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <h3 className="font-editorial text-[21px] sm:text-[25px] font-medium leading-tight text-white drop-shadow-sm group-hover:text-brand-yellow transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 flex items-center gap-1.5 font-mono text-xs text-slate-200/90">
                      <PinIcon size={12} stroke={WEB_ICON_STROKE} className="text-brand-yellow shrink-0" />
                      <span>{item.location}</span>
                    </p>
                  </div>

                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-brand-yellow group-hover:text-[#151936] group-hover:border-brand-yellow group-hover:scale-105 shadow-sm">
                    <ArrowIcon size={13} stroke={2} aria-hidden="true" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </GalleryMarquee>
      </div>
    </SectionBand>
  );
}
