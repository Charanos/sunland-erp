import Link from "next/link";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { cn } from "@/lib/utils/cn";
import { WEB_ICON_STROKE } from "../icons";

/**
 * Pagination for the public site.
 *
 * The visual language is carried over from `PaginationControls` in
 * `src/components/ui/erp-primitives.tsx`: the mono "Showing 1 to 6 of 39"
 * line, Prev and Next with chevrons, numbered buttons in mono, the active
 * page filled in brand dark, disabled at 40%, the whole control in a bordered
 * panel, and the early return that hides it entirely at one page.
 *
 * One structural difference, and it is the reason this is not just an import:
 * the ERP version takes an `onPageChange` callback and is a client component.
 * A crawler cannot fire a callback. Web doc 08 W1-5 requires real links, so
 * this is a server component rendering `<Link>` with the page in the query
 * string, which also means a paginated result set can be shared and bookmarked.
 *
 * Built now, at W0, so W1-5 has it ready. The home page uses "View all" instead.
 */
export function WebPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  itemLabel = "properties",
  /** Base path, e.g. "/properties/apartments". Filters are preserved. */
  basePath,
  searchParams,
  className,
}: {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize?: number;
  itemLabel?: string;
  basePath: string;
  /** Current filter state, so paging does not silently clear the filters. */
  searchParams?: Record<string, string | undefined>;
  className?: string;
}) {
  if (totalPages <= 1) return null;

  const hrefFor = (page: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams ?? {})) {
      if (value) params.set(key, value);
    }
    // Page one is the canonical URL and carries no page parameter, so the
    // first page of a facet has exactly one address rather than two.
    if (page > 1) params.set("page", String(page));
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  const startItem = pageSize ? (currentPage - 1) * pageSize + 1 : null;
  const endItem = pageSize && totalItems ? Math.min(currentPage * pageSize, totalItems) : null;

  const stepClass =
    "inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider text-slate-700 transition-colors hover:border-[#151936] hover:text-[#151936]";
  const disabledClass = "pointer-events-none opacity-40";

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200/70 pt-6 sm:flex-row",
        className
      )}
    >
      <p className="font-mono text-xs text-slate-500">
        {startItem && endItem && totalItems ? (
          <>
            Showing <span className="font-medium text-[#151936]">{startItem}</span> to{" "}
            <span className="font-medium text-[#151936]">{endItem}</span> of{" "}
            <span className="font-medium text-[#151936]">{totalItems}</span> {itemLabel}
          </>
        ) : (
          <>
            Page <span className="font-medium text-[#151936]">{currentPage}</span> of{" "}
            <span className="font-medium text-[#151936]">{totalPages}</span>
          </>
        )}
      </p>

      <div className="flex items-center gap-1.5">
        <Link
          href={hrefFor(currentPage - 1)}
          rel="prev"
          aria-label="Previous page"
          aria-disabled={currentPage <= 1 || undefined}
          tabIndex={currentPage <= 1 ? -1 : undefined}
          className={cn(stepClass, currentPage <= 1 && disabledClass)}
        >
          <IconChevronLeft size={14} stroke={WEB_ICON_STROKE} aria-hidden="true" />
          Prev
        </Link>

        <div className="flex items-center gap-1 px-1">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <Link
              key={page}
              href={hrefFor(page)}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
              className={cn(
                "inline-flex size-8 items-center justify-center rounded-full font-mono text-xs font-medium transition-colors",
                page === currentPage
                  ? "bg-[#151936] text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              {page}
            </Link>
          ))}
        </div>

        <Link
          href={hrefFor(currentPage + 1)}
          rel="next"
          aria-label="Next page"
          aria-disabled={currentPage >= totalPages || undefined}
          tabIndex={currentPage >= totalPages ? -1 : undefined}
          className={cn(stepClass, currentPage >= totalPages && disabledClass)}
        >
          Next
          <IconChevronRight size={14} stroke={WEB_ICON_STROKE} aria-hidden="true" />
        </Link>
      </div>
    </nav>
  );
}
