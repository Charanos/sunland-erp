import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { Eyebrow } from "../primitives/eyebrow";

/**
 * The heading block every band opens with: eyebrow, title, optional lead, and
 * an optional action on the right.
 *
 * Extracted because eleven bands repeating the same three elements by hand is
 * eleven chances for one of them to drift half a step out of alignment, and
 * section rhythm is the thing that carries perceived quality here more than
 * any individual component.
 */
export function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
  action,
  tone = "light",
  align = "split",
  className,
}: {
  /** Wires the band's aria-labelledby to this heading. */
  id: string;
  eyebrow: string;
  title: string;
  lead?: string;
  action?: ReactNode;
  tone?: "light" | "dark";
  /** `split` puts the action on the right at desktop; `stack` centres nothing. */
  align?: "split" | "stack";
  className?: string;
}) {
  const isDark = tone === "dark";

  return (
    <div
      className={cn(
        align === "split" && "flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className={cn(align === "split" && "max-w-3xl")}>
        <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
        <h2
          id={id}
          className={cn("web-title mt-4 text-web-h2", isDark ? "text-on-dark-hi" : "text-ink-900")}
        >
          {title}
        </h2>
        {lead && (
          <p
            className={cn(
              "web-subtitle mt-4 max-w-[62ch] text-web-lead",
              isDark ? "text-on-dark" : "text-ink-500"
            )}
          >
            {lead}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
