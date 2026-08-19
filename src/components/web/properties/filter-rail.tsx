"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useId, useState } from "react";
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

  const sectionClass = "border-b border-line-soft pb-5 mb-5";
  const legendClass = "web-subtitle mb-3 block text-[13px] text-ink-900";
  const chipClass =
    "web-control web-hit inline-flex items-center rounded-web-full px-[15px] py-1.5 text-[11.5px] tracking-[0.08em] transition-all duration-150";
  const inputClass =
    "w-full rounded-web-full border border-line-strong bg-surface-0 px-3.5 py-2 text-[14.5px] text-ink-900 placeholder:text-ink-400 focus:border-ink-900 focus:outline-none";

  const body = (
    <form
      // The no-JS fallback: this submits by GET to the current path and the
      // server renders the same filtered page.
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
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h2 className="web-control text-[11px] uppercase tracking-[0.2em] text-ink-400">Refine</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="web-hit border-b border-line-strong text-[13px] text-ink-900 transition-colors hover:border-ink-900"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Status. Hidden when the page is already a status facet: offering to
          re-choose the thing the URL has fixed is how filters contradict
          their own page. */}
      {lockedFacet?.kind !== "status" && (
        <fieldset className={sectionClass}>
          <legend className={legendClass}>Status</legend>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setSingle("status", "")}
              aria-pressed={!activeStatus}
              className={cn(
                chipClass,
                !activeStatus
                  ? "bg-brand-dark text-on-dark-hi"
                  : "border border-line-strong text-ink-500 hover:border-ink-400"
              )}
            >
              Any
            </button>
            {STATUS_FACETS.map((facet) => (
              <button
                key={facet.segment}
                type="button"
                onClick={() => setSingle("status", facet.segment)}
                aria-pressed={activeStatus === facet.segment}
                className={cn(
                  chipClass,
                  activeStatus === facet.segment
                    ? "bg-brand-dark text-on-dark-hi"
                    : "border border-line-strong text-ink-500 hover:border-ink-400"
                )}
              >
                {facet.label}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {lockedFacet?.kind !== "category" && (
        <fieldset className={sectionClass}>
          <legend className={legendClass}>Property type</legend>
          <div className="grid gap-2.5">
            {CATEGORY_FACETS.map((facet) => {
              const checked = activeCategories.includes(facet.segment);
              const count = counts[facet.segment];

              return (
                <label
                  key={facet.segment}
                  className="flex min-h-8 cursor-pointer items-center gap-2.5 text-[14.5px] text-ink-500"
                >
                  <input
                    type="checkbox"
                    name="category"
                    value={facet.segment}
                    checked={checked}
                    onChange={() => toggleInList("category", facet.segment)}
                    className="size-4 shrink-0 accent-[var(--color-brand-dark)]"
                  />
                  {facet.label}
                  {typeof count === "number" && (
                    <span className="web-numeric ml-auto text-[12.5px] text-ink-400">{count}</span>
                  )}
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      <div className={sectionClass}>
        <label htmlFor={locationId} className={legendClass}>
          Location
        </label>
        <input
          id={locationId}
          name="location"
          defaultValue={current("location")}
          placeholder="Any area"
          className={inputClass}
        />
      </div>

      <div className={sectionClass}>
        <p className={legendClass}>Monthly rent, KES</p>
        <div className="flex items-center gap-2">
          <input
            id={minId}
            name="min"
            inputMode="numeric"
            aria-label="Minimum rent"
            defaultValue={current("min")}
            placeholder="Min"
            className={cn(inputClass, "web-numeric min-w-0 flex-1 px-3 text-[13.5px]")}
          />
          <span aria-hidden="true" className="text-ink-400">
            to
          </span>
          <input
            id={maxId}
            name="max"
            inputMode="numeric"
            aria-label="Maximum rent"
            defaultValue={current("max")}
            placeholder="Max"
            className={cn(inputClass, "web-numeric min-w-0 flex-1 px-3 text-[13.5px]")}
          />
        </div>
      </div>

      <fieldset className={sectionClass}>
        <legend className={legendClass}>Bedrooms</legend>
        <div className="flex flex-wrap gap-1.5">
          {BEDROOM_OPTIONS.map((option) => {
            const active = activeBedrooms.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => toggleInList("beds", option)}
                aria-pressed={active}
                className={cn(
                  "web-numeric web-hit inline-flex min-w-10 items-center justify-center rounded-web-full px-2.5 py-1.5 text-[13.5px] transition-all duration-150",
                  active
                    ? "bg-brand-dark text-on-dark-hi"
                    : "border border-line-strong text-ink-500 hover:border-ink-400"
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="mb-6">
        <legend className={legendClass}>Features</legend>
        <div className="grid gap-2.5">
          {FEATURE_OPTIONS.map((feature) => (
            <label
              key={feature.value}
              className="flex min-h-8 cursor-pointer items-center gap-2.5 text-[14.5px] text-ink-500"
            >
              <input
                type="checkbox"
                name="feature"
                value={feature.value}
                checked={activeFeatures.includes(feature.value)}
                onChange={() => toggleInList("feature", feature.value)}
                className="size-4 shrink-0 accent-[var(--color-brand-dark)]"
              />
              {feature.label}
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="submit"
        className="web-control web-hit w-full rounded-web-full bg-brand-yellow px-6 py-2.5 text-xs uppercase tracking-[0.12em] text-brand-dark transition-colors hover:bg-brand-yellow-h"
      >
        Show {resultCount} {resultCount === 1 ? "match" : "matches"}
      </button>
    </form>
  );

  return (
    <>
      {/* Mobile: a single 44px row that opens the sheet, so the first listing
          card is above the fold at 390 rather than buried under a filter rail. */}
      <div className={cn("lg:hidden", className)}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          className="web-control web-hit flex w-full items-center justify-center gap-2 rounded-web-full border border-line bg-surface-0 px-5 py-2.5 text-[11.5px] uppercase tracking-[0.12em] text-ink-900"
        >
          <FilterIcon size={16} stroke={WEB_ICON_STROKE} aria-hidden="true" />
          Filters
          {hasActiveFilters && (
            <span className="web-numeric rounded-web-full bg-brand-dark px-2 py-0.5 text-[10px] text-on-dark-hi">
              on
            </span>
          )}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end lg:hidden">
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => setOpen(false)}
            className="absolute inset-0 cursor-default bg-brand-dark/60 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
            className="relative max-h-[85vh] w-full overflow-y-auto rounded-t-web-lg bg-surface-0 p-6 shadow-web-lg"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close filters"
              className="web-hit absolute right-4 top-4 inline-flex size-11 items-center justify-center rounded-web-full text-ink-500"
            >
              <CloseIcon size={20} stroke={WEB_ICON_STROKE} aria-hidden="true" />
            </button>
            {body}
          </div>
        </div>
      )}

      <aside
        aria-label="Filters"
        className={cn(
          "sticky top-[100px] hidden max-w-[300px] rounded-web-card border border-line bg-surface-0 p-6 lg:block",
          className
        )}
      >
        {body}
      </aside>
    </>
  );
}
