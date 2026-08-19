import { cn } from "@/lib/utils/cn";
import { WEB_ICON_STROKE, webIcons, type WebIconName } from "../icons";

/**
 * One figure in a listing specification row: an icon, then a monospaced value.
 *
 * Carried over from `SpecChip` in the ERP properties board, with the chip
 * border dropped in favour of the hairlines above and below the whole row
 * that the listing card spec calls for. The structure is the same, and so is
 * the rule that matters most: an absent count is omitted along with its icon,
 * never rendered as 0. A card claiming "0 bd" is worse than a card that does
 * not mention bedrooms, and industrial stock genuinely has neither beds nor
 * baths.
 *
 * The unit word is announced but not shown, so "2 bd" reads as "2 bedrooms"
 * to a screen reader while staying compact on a 350px card.
 */
export function SpecChip({
  icon,
  value,
  /** Spoken unit, e.g. "bedrooms". Icons are decorative and hidden. */
  unit,
  className,
}: {
  icon: WebIconName;
  value: string | number | null | undefined;
  unit: string;
  className?: string;
}) {
  // The whole point of this component: nothing renders rather than a zero.
  if (value === null || value === undefined || value === "" || value === 0) return null;

  const IconComponent = webIcons[icon];

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-ink-400", className)}>
      <IconComponent size={16} stroke={WEB_ICON_STROKE} aria-hidden="true" className="shrink-0" />
      <span className="web-numeric text-[13px] text-ink-500">{value}</span>
      <span className="sr-only">{unit}</span>
    </span>
  );
}

/**
 * The row the chips sit in. Hairlines above and below, per the card spec.
 * Renders nothing when every chip inside it resolved to null, so a card for a
 * plot of land does not carry an empty bordered strip.
 */
export function SpecRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const hasContent = Array.isArray(children)
    ? children.some((child) => child !== null && child !== undefined && child !== false)
    : Boolean(children);

  if (!hasContent) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-1.5 border-y border-line-soft py-3.5",
        className
      )}
    >
      {children}
    </div>
  );
}
