import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { WEB_ICON_STROKE, webIcons, type WebIconName } from "../icons";

/**
 * Filter and quick-link pills.
 *
 * Sentence case at 0.08em, per the section 08 amendment, which is what
 * separates them from buttons (uppercase, 0.12em) and badges (uppercase,
 * 0.14em). Padding of 8px on a 20px line box, no height.
 *
 * The active state is tertiary emerald, not yellow. The design pass shows the
 * active "All" pill carrying the yellow in its 390 frame, but that frame is
 * the properties index, where nothing else on screen is yellow. On the home
 * page the featured band sits between the hero (yellow search button) and the
 * landlord band (yellow valuation button), so a yellow pill would be the
 * second or third yellow element in view. The tertiary accent, carried over
 * from the ERP, is what that band should use instead.
 */
export function WebPill({
  children,
  href,
  active = false,
  tone = "light",
  icon,
  count,
  className,
}: {
  children: ReactNode;
  /** Pills are navigation. Filters change the URL, so they are links. */
  href?: string;
  active?: boolean;
  /** `light` on white or tint bands, `dark` on brand-dark or tertiary. */
  tone?: "light" | "dark";
  icon?: WebIconName;
  /** A result count, rendered in mono beside the label. */
  count?: number;
  className?: string;
}) {
  const IconComponent = icon ? webIcons[icon] : null;

  const base = cn(
    "web-control web-hit inline-flex items-center gap-2 rounded-web-full px-4 py-2",
    "text-web-xs tracking-[0.08em] transition-all duration-150 ease-out",
    className
  );

  const toneClass = active
    ? "bg-tertiary-emerald text-on-dark-hi hover:bg-tertiary-emerald-hi"
    : tone === "dark"
      ? "border border-dark-line bg-dark-raise text-on-dark hover:bg-dark-raise-hi hover:text-on-dark-hi"
      : "border border-line bg-surface-0 text-ink-500 hover:border-ink-400 hover:text-ink-900";

  const content = (
    <>
      {IconComponent && <IconComponent size={15} stroke={WEB_ICON_STROKE} aria-hidden="true" />}
      {children}
      {typeof count === "number" && (
        <span className={cn("web-numeric text-web-micro", active ? "opacity-80" : "text-ink-400")}>
          {count}
        </span>
      )}
    </>
  );

  if (!href) {
    return (
      <span className={cn(base, toneClass)} data-active={active || undefined}>
        {content}
      </span>
    );
  }

  return (
    <Link
      href={href}
      // The filter that is already applied is still a link, but announcing it
      // as the current one is the difference between a list of options and a
      // list of options with a state.
      aria-current={active ? "true" : undefined}
      className={cn(base, toneClass)}
      data-active={active || undefined}
    >
      {content}
    </Link>
  );
}
