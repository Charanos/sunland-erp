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
  /** `split` puts action on right; `split-right` puts action on left and title on right; `stack` centres nothing. */
  align?: "split" | "split-right" | "stack";
  className?: string;
}) {
  const isDark = tone === "dark";
  const isSplitRight = align === "split-right";

  return (
    <div
      className={cn(
        align === "split" && "flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between",
        isSplitRight && "flex flex-col gap-6 sm:flex-row-reverse sm:items-end sm:justify-between",
        className
      )}
    >
      <div className={cn(action ? "max-w-4xl lg:max-w-5xl" : "max-w-5xl", isSplitRight && "sm:text-right")}>
        <Eyebrow tone={tone} align={isSplitRight ? "right" : "left"}>
          {eyebrow}
        </Eyebrow>
        <h2
          id={id}
          className={cn(
            "mt-3 font-editorial text-[clamp(2.25rem,3.6vw,3.5rem)] font-medium leading-[1.1] tracking-tight",
            isDark ? "text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]" : "text-ink-900"
          )}
        >
          {title}
        </h2>
        {lead && (
          <p
            className={cn(
              "web-subtitle mt-3 max-w-[72ch] text-[15px] sm:text-base leading-relaxed",
              isSplitRight && "sm:ml-auto",
              isDark ? "text-slate-300/90" : "text-ink-500"
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
