/**
 * The shape Recharts hands a custom tooltip.
 *
 * Three chart components each typed this callback `any`, which is the one
 * annotation that cannot be wrong and therefore cannot help: it silently
 * accepts `entry.valeu`, `payload.length` on undefined, and a `formatKES(...)`
 * call on a string. Recharts' own `TooltipProps` generic is awkward to satisfy
 * across differently-shaped series, so this describes exactly the fields these
 * tooltips actually read, and nothing more.
 *
 * `value` is deliberately `number | string`: Recharts passes through whatever
 * the dataset holds, and a formatter that assumes number is precisely the bug
 * this type exists to surface at the call site.
 */
export type ChartTooltipEntry = {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string | number;
  payload?: Record<string, unknown>;
};

export type ChartTooltipProps = {
  active?: boolean;
  payload?: ChartTooltipEntry[];
  label?: string | number;
};

/**
 * Narrow a tooltip value to a number.
 *
 * Takes `unknown` rather than `number | string` on purpose: Recharts' own
 * `ValueType` is `number | string | Array<number | string>`, and the value
 * reaching a formatter can also be `undefined` for a series with a gap. Typing
 * the parameter narrowly forced every call site to either cast or fail to
 * compile, which is how the `any` annotations got there in the first place.
 * Accepting anything and returning a real number moves the one piece of
 * defensive logic into one place.
 */
export function toChartNumber(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    // Strips currency prefixes and thousands separators before parsing.
    const parsed = Number(value.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  // A stacked series hands the formatter the range as [from, to]; the value
  // being labelled is the upper bound.
  if (Array.isArray(value)) return toChartNumber(value[value.length - 1]);
  return 0;
}
