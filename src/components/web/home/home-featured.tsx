"use client";

import { useMemo, useState } from "react";
import { WebButtonLink } from "../primitives/button";
import { ListingCard, type ListingCardData } from "../primitives/listing-card";
import { SectionBand } from "../primitives/section-band";
import { featuredDefaults } from "./home.defaults";
import { SectionHeading } from "./section-heading";
import { cn } from "@/lib/utils/cn";

/**
 * 04 home.featured, tint band.
 *
 * Displays curated verified properties with live client-side category filtering (All, To Let, For Sale).
 */
export function HomeFeatured({ listings }: { listings: ListingCardData[] }) {
  const [activeTab, setActiveTab] = useState<"all" | "for-rent" | "for-sale">("all");

  const filteredListings = useMemo(() => {
    if (activeTab === "all") return listings;
    if (activeTab === "for-rent") {
      return listings.filter(
        (l) =>
          l.priceSuffix?.includes("mo") ||
          l.slug.includes("to-let") ||
          l.slug.includes("furnished") ||
          l.slug.includes("duplex") ||
          l.slug.includes("apartment")
      );
    }
    if (activeTab === "for-sale") {
      return listings.filter(
        (l) =>
          !l.priceSuffix?.includes("mo") &&
          (l.slug.includes("villa") || l.slug.includes("plot") || l.slug.includes("sale") || (l.priceKes && l.priceKes > 1_000_000))
      );
    }
    return listings;
  }, [listings, activeTab]);

  if (listings.length < 3) return null;

  const rentCount = listings.filter(
    (l) =>
      l.priceSuffix?.includes("mo") ||
      l.slug.includes("to-let") ||
      l.slug.includes("furnished") ||
      l.slug.includes("duplex") ||
      l.slug.includes("apartment")
  ).length;

  const saleCount = listings.filter(
    (l) =>
      !l.priceSuffix?.includes("mo") &&
      (l.slug.includes("villa") || l.slug.includes("plot") || l.slug.includes("sale") || (l.priceKes && l.priceKes > 1_000_000))
  ).length;

  const tabs = [
    { id: "all", label: "All Properties", count: listings.length },
    { id: "for-rent", label: "To let", count: rentCount },
    { id: "for-sale", label: "For sale", count: saleCount },
  ];

  return (
    <SectionBand tone="tint" labelledBy="featured-heading" className="relative bg-[#f8fafc]">
      <SectionHeading
        id="featured-heading"
        eyebrow={featuredDefaults.eyebrow}
        title={featuredDefaults.headline}
        lead="Explore verified residences, commercial spaces, and investment plots currently represented by Sunland."
        align="split-right"
        action={
          <WebButtonLink href={featuredDefaults.viewAllHref} variant="outline" size="md" icon="arrow" iconTrailing>
            View all
          </WebButtonLink>
        }
      />

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        {/* Interactive Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-web-micro font-medium tracking-wide uppercase transition-all duration-200 cursor-pointer",
                  active
                    ? "bg-brand-dark text-white shadow-xs"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.2 text-web-nano font-mono",
                    active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  )}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <p className="font-mono text-xs text-slate-400">
          Showing {filteredListings.length} of {listings.length} verified listings
        </p>
      </div>

      <ul data-reveal-group className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
        {filteredListings.map((listing, index) => (
          <li key={listing.id} className="flex h-full">
            <ListingCard
              listing={listing}
              headingLevel={3}
              priority={index < 3}
              className="w-full h-full"
            />
          </li>
        ))}
      </ul>
    </SectionBand>
  );
}
