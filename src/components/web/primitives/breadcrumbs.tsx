import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { WEB_ICON_STROKE, webIcons } from "../icons";

export type Crumb = { label: string; href?: string };

/**
 * Breadcrumbs, on every page below L1, mirroring the URL exactly.
 *
 * The last crumb is the current page and is not a link. Marking it up as one
 * is a small lie that costs a keyboard user a tab stop and tells a crawler
 * the page links to itself.
 *
 * TODO(W5-3): emit BreadcrumbList structured data from this same array, so
 * the trail in search results matches the trail on the page rather than being
 * maintained twice.
 */
export function Breadcrumbs({
  items,
  tone = "dark",
  className,
}: {
  items: Crumb[];
  tone?: "light" | "dark";
  className?: string;
}) {
  const ChevronIcon = webIcons.chevronRight;
  const isDark = tone === "dark";

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol
        className={cn(
          "flex flex-wrap items-center gap-2.5 text-web-xs",
          isDark ? "text-on-dark-lo" : "text-ink-400"
        )}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2.5">
              {index > 0 && (
                <ChevronIcon
                  size={14}
                  stroke={WEB_ICON_STROKE}
                  aria-hidden="true"
                  className="opacity-60"
                />
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={cn(
                    "transition-colors",
                    isDark ? "hover:text-on-dark-hi" : "hover:text-ink-900"
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={isDark ? "text-on-dark" : "text-ink-700"}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
