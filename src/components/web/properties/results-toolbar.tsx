"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useId } from "react";
import { WEB_ICON_STROKE, webIcons } from "../icons";
import { SORT_OPTIONS } from "../constants/listing-taxonomy";

/**
 * The bar above the results grid: count, applied filter chips, and sort.
 *
 * The count carries `aria-live="polite"`. That is the whole reason this is a
 * client component: a sighted user sees the grid change, and a screen reader
 * user needs to be told "14 results" without having to go looking. Doc 03
 * §3.3 requires it and it is the single most commonly skipped line in that
 * spec.
 *
 * Applied filters render as removable chips rather than only as ticked boxes
 * in a rail that may be scrolled off screen or collapsed into a sheet. A
 * visitor who cannot see why the grid is empty will not think to reopen the
 * sheet to find out.
 */
export function ResultsToolbar({
  total,
  chips,
}: {
  total: number;
  /** Applied filters, each with the param and value needed to remove it. */
  chips: { label: string; param: string; value?: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sortId = useId();

  const CloseIcon = webIcons.close;
  const currentSort = searchParams.get("sort") ?? "newest";

  const push = (params: URLSearchParams) => {
    params.delete("page");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const removeChip = (param: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === undefined) {
      params.delete(param);
    } else {
      const remaining = params.getAll(param).filter((item) => item !== value);
      params.delete(param);
      for (const item of remaining) params.append(param, item);
    }
    push(params);
  };

  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-web-full border border-line bg-surface-0 px-5 py-3.5">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <p aria-live="polite" className="web-numeric text-[13.5px] text-ink-900">
          {total} {total === 1 ? "result" : "results"}
        </p>

        {chips.length > 0 && <span aria-hidden="true" className="h-4 w-px bg-line" />}

        {chips.map((chip) => (
          <span
            key={`${chip.param}-${chip.value ?? chip.label}`}
            className="inline-flex items-center gap-1.5 rounded-web-full bg-surface-2 py-1 pl-3 pr-1.5 text-[12.5px] text-ink-900"
          >
            {chip.label}
            <button
              type="button"
              onClick={() => removeChip(chip.param, chip.value)}
              aria-label={`Remove ${chip.label} filter`}
              className="web-hit inline-flex size-5 items-center justify-center rounded-web-full text-ink-400 transition-colors hover:text-ink-900"
            >
              <CloseIcon size={13} stroke={WEB_ICON_STROKE} aria-hidden="true" />
            </button>
          </span>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <label htmlFor={sortId} className="web-subtitle text-[13px] text-ink-400">
          Sort
        </label>
        <select
          id={sortId}
          value={currentSort}
          onChange={(event) => {
            const params = new URLSearchParams(searchParams.toString());
            if (event.target.value === "newest") params.delete("sort");
            else params.set("sort", event.target.value);
            push(params);
          }}
          className="rounded-web-full border border-line-strong bg-surface-0 px-3 py-1.5 text-[13.5px] text-ink-900 focus:border-ink-900 focus:outline-none"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
