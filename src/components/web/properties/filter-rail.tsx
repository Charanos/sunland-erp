"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useId, useState } from "react";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { cn } from "@/lib/utils/cn";
import {
  BEDROOM_OPTIONS,
  CATEGORY_FACETS,
  FEATURE_OPTIONS,
  STATUS_FACETS,
} from "../constants/listing-taxonomy";
import { WEB_ICON_STROKE, webIcons } from "../icons";

/**
 * The listing filter rail.
 *
 * Sticky on desktop at 1280 and above, a bottom sheet on mobile. Both drive
 * the same state, which is the URL: submitting updates the query string, the
 * server re-renders the results, and the filtered view can be shared,
 * bookmarked and hit with the back button. Filter state living in a store
 * would break all three.
 *
 * It is a real `<form>` with real labels. The JavaScript path pushes on
 * change for immediate feedback; without JavaScript the same form still
 * submits by GET to the same path and produces the same result. That is not
 * ceremony: this site is read on cheap Androids over 3G, where the HTML
 * arrives long before the bundle does.
 *
 * Accessibility contract (doc 03 §3.3): every control has a visible label,
 * applied filters render as removable chips, "Clear all" resets to the facet
 * baseline rather than to the site root, and the result region announces its
 * count via aria-live, which lives on the results toolbar.
 */
export function FilterRail({
  counts,
  resultCount,
  /** The facet this page is pinned to. Its filter is fixed, not removable. */
  lockedFacet,
  className,
}: {
  counts: Record<string, number>;
  resultCount: number;
  lockedFacet?: { kind: "status" | "category"; segment: string };
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const locationId = useId();

  // The sheet is modal; the results behind it must hold still.
  useBodyScrollLock(open);
  const minId = useId();
  const maxId = useId();

  const CloseIcon = webIcons.close;
  const FilterIcon = webIcons.sliders;

  const current = useCallback((key: string) => searchParams.get(key) ?? "", [searchParams]);

  const currentList = useCallback((key: string) => searchParams.getAll(key), [searchParams]);

  /** One place that writes the URL, so every control behaves identically. */
  const apply = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      // Any filter change returns to page one. Staying on page 4 of a result
      // set that now has two pages is a blank screen the visitor did not ask
      // for.
      params.delete("page");
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const toggleInList = (key: string, value: string) =>
    apply((params) => {
      const existing = params.getAll(key);
      params.delete(key);
      const next = existing.includes(value)
        ? existing.filter((item) => item !== value)
        : [...existing, value];
      for (const item of next) params.append(key, item);
    });

  const setSingle = (key: string, value: string) =>
    apply((params) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });

  const clearAll = () => {
    // Resets to the facet baseline, not to /properties. Someone filtering
    // inside "Apartments" who clears expects all apartments, not all stock.
    router.push(pathname, { scroll: false });
    setOpen(false);
  };

  const activeCategories = currentList("category");
  const activeBedrooms = currentList("beds");
  const activeFeatures = currentList("feature");
  const activeStatus = current("status");

  const hasActiveFilters =
    activeCategories.length > 0 ||
    activeBedrooms.length > 0 ||
    activeFeatures.length > 0 ||
    Boolean(activeStatus) ||
    Boolean(current("location")) ||
    Boolean(current("min")) ||
    Boolean(current("max"));

  const sectionClass = "border-b border-slate-200/70 pb-5 mb-5";
  const legendClass = "font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-slate-500 mb-3 block";
  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:border-[#151936] focus:outline-none focus:ring-1 focus:ring-[#151936] transition-all";

  const body = (
    <form
      method="get"
      action={pathname}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        apply((params) => {
          for (const key of ["location", "min", "max"]) {
            const value = data.get(key);
            if (typeof value === "string" && value.trim()) params.set(key, value.trim());
            else params.delete(key);
          }
        });
        setOpen(false);
      }}
    >
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-slate-200/70 pb-3">
        <h2 className="font-mono text-[11.5px] font-medium uppercase tracking-[0.18em] text-slate-900">
          Refine Search
        </h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-[11.5px] font-medium text-slate-500 underline decoration-slate-300 underline-offset-2 transition-colors hover:text-[#151936]"
          >
            Reset
          </button>
        )}
      </div>

      {/* Status */}
      {lockedFacet?.kind !== "status" && (
        <fieldset className={sectionClass}>
          <legend className={legendClass}>Status</legend>
          <div className="grid grid-cols-3 gap-1 rounded-full bg-slate-200/60 p-1 border border-slate-200/80">
            <button
              type="button"
              onClick={() => { setSingle("status", ""); setOpen(false); }}
              aria-pressed={!activeStatus}
              className={cn(
                "rounded-full py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider transition-all",
                !activeStatus
                  ? "bg-[#151936] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              Any
            </button>
            {STATUS_FACETS.map((facet) => (
              <button
                key={facet.segment}
                type="button"
                onClick={() => { setSingle("status", facet.segment); setOpen(false); }}
                aria-pressed={activeStatus === facet.segment}
                className={cn(
                  "rounded-full py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider transition-all",
                  activeStatus === facet.segment
                    ? "bg-[#151936] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                {facet.label}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {/* Property Type */}
      {lockedFacet?.kind !== "category" && (
        <fieldset className={sectionClass}>
          <legend className={legendClass}>Property Type</legend>
          <div className="grid gap-1.5">
            {CATEGORY_FACETS.map((facet) => {
              const checked = activeCategories.includes(facet.segment);
              const count = counts[facet.segment];

              return (
                <label
                  key={facet.segment}
                  className={cn(
                    "flex min-h-8.5 cursor-pointer items-center justify-between rounded-lg px-2 py-1 text-[13.5px] transition-colors",
                    checked
                      ? "font-medium text-[#151936]"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      name="category"
                      value={facet.segment}
                      checked={checked}
                      onChange={() => toggleInList("category", facet.segment)}
                      className="size-4 shrink-0 rounded border-slate-300 accent-[#151936]"
                    />
                    <span>{facet.label}</span>
                  </div>
                  {typeof count === "number" && (
                    <span className="font-mono text-[11px] text-slate-400">
                      {count}
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* Location */}
      <div className={sectionClass}>
        <label htmlFor={locationId} className={legendClass}>
          Location
        </label>
        <input
          id={locationId}
          name="location"
          defaultValue={current("location")}
          placeholder="e.g. Karen, Westlands, Runda"
          className={inputClass}
        />
      </div>

      {/* Monthly Rent / Price */}
      <div className={sectionClass}>
        <p className={legendClass}>
          {activeStatus === "for-sale" ? "Price Range, KES" : "Monthly Rent, KES"}
        </p>
        <div className="flex items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <input
              id={minId}
              name="min"
              inputMode="numeric"
              aria-label="Minimum price"
              defaultValue={current("min")}
              placeholder="Min"
              className={inputClass}
            />
          </div>
          <span aria-hidden="true" className="text-xs font-mono text-slate-400">
            —
          </span>
          <div className="relative min-w-0 flex-1">
            <input
              id={maxId}
              name="max"
              inputMode="numeric"
              aria-label="Maximum price"
              defaultValue={current("max")}
              placeholder="Max"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Bedrooms */}
      <fieldset className={sectionClass}>
        <legend className={legendClass}>Bedrooms</legend>
        <div className="grid grid-cols-4 gap-1.5">
          {BEDROOM_OPTIONS.map((option) => {
            const active = activeBedrooms.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => { toggleInList("beds", option); setOpen(false); }}
                aria-pressed={active}
                className={cn(
                  "flex items-center justify-center rounded-xl py-2 font-mono text-xs font-medium transition-all border",
                  active
                    ? "border-[#151936] bg-[#151936] text-white shadow-xs"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Features */}
      <fieldset className="mb-6">
        <legend className={legendClass}>Amenities</legend>
        <div className="grid gap-1.5">
          {FEATURE_OPTIONS.map((feature) => (
            <label
              key={feature.value}
              className={cn(
                "flex min-h-8 cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1 text-[13px] transition-colors",
                activeFeatures.includes(feature.value)
                  ? "font-medium text-[#151936]"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <input
                type="checkbox"
                name="feature"
                value={feature.value}
                checked={activeFeatures.includes(feature.value)}
                onChange={() => toggleInList("feature", feature.value)}
                className="size-4 shrink-0 rounded border-slate-300 accent-[#151936]"
              />
              <span>{feature.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        className="w-full rounded-full bg-[#151936] px-5 py-3 font-mono text-xs font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-slate-800 active:scale-[0.99]"
      >
        {resultCount > 0
          ? `Show ${resultCount} ${resultCount === 1 ? "Result" : "Results"}`
          : "Apply Filters"}
      </button>
    </form>
  );

  return (
    <>
      {/* Mobile filter trigger */}
      <div className={cn("lg:hidden", className)}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200/90 bg-white px-5 py-3 font-mono text-xs font-medium uppercase tracking-wider text-[#151936] shadow-xs transition-colors hover:bg-slate-50"
        >
          <FilterIcon size={16} stroke={WEB_ICON_STROKE} aria-hidden="true" />
          Filter Properties
          {hasActiveFilters && (
            <span className="rounded-full bg-[#151936] px-2 py-0.5 font-mono text-[10px] text-white">
              Active
            </span>
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="fixed inset-0 z-overlay flex items-end lg:hidden">
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => setOpen(false)}
            className="absolute inset-0 cursor-default bg-[#090d1f]/60 backdrop-blur-sm animate-fade-in"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
            className="relative max-h-[88vh] w-full overflow-y-auto rounded-t-[28px] border-t border-slate-200/80 bg-white p-6 shadow-2xl animate-slide-up"
          >
            {/* Drag Handle Indicator */}
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close filters"
              className="absolute right-5 top-5 inline-flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200"
            >
              <CloseIcon size={18} stroke={WEB_ICON_STROKE} aria-hidden="true" />
            </button>
            {body}
          </div>
        </div>
      )}

      {/* Desktop Sticky Uncarded Aside */}
      <aside
        aria-label="Filters"
        className={cn(
          "sticky top-24 hidden w-full max-w-[270px] pr-2 lg:block",
          className
        )}
      >
        {body}
      </aside>
    </>
  );
}
