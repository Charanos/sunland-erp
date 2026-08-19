import { cn } from "@/lib/utils/cn";

/**
 * The label above a section title: a short yellow rule, then mono uppercase
 * text at wide tracking.
 *
 * The rule is one of the four permitted uses of Sunland Yellow on a light
 * ground (a fill, a 1px rule, or a tint behind an icon, never type). It does
 * not count against the one-yellow-element-per-viewport budget, because it is
 * a 28px hairline rather than something competing for attention.
 */
export function Eyebrow({
  children,
  tone = "light",
  align = "left",
  className,
}: {
  children: React.ReactNode;
  /** `light` sits on a white or tint band, `dark` on brand-dark or tertiary. */
  tone?: "light" | "dark";
  /** Alignment of the eyebrow text and golden rule */
  align?: "left" | "right";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3",
        align === "right" && "sm:flex-row-reverse sm:justify-start",
        className
      )}
    >
      <span aria-hidden="true" className="h-px w-7 shrink-0 bg-brand-yellow" />
      <p className={cn("web-eyebrow m-0", tone === "dark" ? "text-on-dark-lo" : "text-ink-400")}>
        {children}
      </p>
    </div>
  );
}
