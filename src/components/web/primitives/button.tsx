import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { WEB_ICON_STROKE, webIcons, type WebIconName } from "../icons";

/**
 * The public site button.
 *
 * Built fresh rather than extending `@/components/ui/button`, because the two
 * have incompatible contracts. The ERP button is Nunito, fixed-height and
 * rounded-lg; this one is JetBrains Mono uppercase, fully round, and sized by
 * vertical padding on a 20px line box with no `height` or `min-height` at all,
 * so a label that wraps or a translated string grows the control instead of
 * clipping it. Sharing one component would mean one surface losing its rules.
 *
 * Buttons that navigate render as links. A div with an onClick is not a
 * button, and a button that changes the URL is not a button either.
 */
export type WebButtonVariant = "primary" | "secondary" | "outline" | "ghostDark" | "link";
export type WebButtonSize = "sm" | "md" | "lg";

const variantClass: Record<WebButtonVariant, string> = {
  // The one action per viewport. Yellow fill, dark text: yellow never carries
  // text itself, it carries the surface the text sits on.
  primary: "bg-brand-yellow text-brand-dark hover:bg-brand-yellow-h shadow-web-sm",
  // Supporting action on light surfaces.
  secondary: "bg-brand-dark text-on-dark-hi hover:bg-ink-700",
  // Tertiary: filter reset, "view all".
  outline: "border border-line bg-transparent text-ink-900 hover:border-ink-900 hover:bg-surface-1",
  // Inside dark bands, beside a yellow primary.
  ghostDark:
    "border border-dark-line bg-dark-raise text-on-dark-hi hover:bg-dark-raise-hi hover:border-on-dark-lo",
  link: "text-ink-900 underline-offset-4 hover:underline",
};

/**
 * Padding on a 20px line box, per the section 08 amendment: 11px primary,
 * 10px secondary. The arbitrary values here are the specified control sizes,
 * not ad-hoc spacing; a parallel class vocabulary for three numbers would be
 * worse. Height is deliberately absent. The 44px touch floor comes from
 * `.web-hit`, which extends the hit area without touching the visual box.
 */
const sizeClass: Record<WebButtonSize, string> = {
  sm: "px-4 py-1.5 text-[11px] tracking-[0.1em]",
  md: "px-5 py-2.5 text-xs tracking-[0.12em]",
  lg: "px-7 py-[11px] text-[13px] tracking-[0.12em]",
};

type CommonProps = {
  children: ReactNode;
  variant?: WebButtonVariant;
  size?: WebButtonSize;
  icon?: WebIconName;
  /** Render the icon after the label. The default for forward actions. */
  iconTrailing?: boolean;
  className?: string;
};

function buttonClass({
  variant = "primary",
  size = "md",
  className,
}: Pick<CommonProps, "variant" | "size" | "className">) {
  return cn(
    "web-control web-hit inline-flex items-center justify-center gap-2 uppercase",
    "rounded-web-full transition-all duration-150 ease-out",
    "active:translate-y-px",
    "disabled:pointer-events-none disabled:opacity-60",
    variant === "link" ? "px-0 py-0 normal-case tracking-normal" : sizeClass[size],
    variantClass[variant],
    className
  );
}

function ButtonLabel({
  children,
  icon,
  iconTrailing = false,
}: Pick<CommonProps, "children" | "icon" | "iconTrailing">) {
  const IconComponent = icon ? webIcons[icon] : null;

  return (
    <>
      {IconComponent && !iconTrailing && (
        <IconComponent size={16} stroke={WEB_ICON_STROKE} aria-hidden="true" />
      )}
      {children}
      {IconComponent && iconTrailing && (
        <IconComponent size={16} stroke={WEB_ICON_STROKE} aria-hidden="true" />
      )}
    </>
  );
}

export function WebButton({
  children,
  variant,
  size,
  icon,
  iconTrailing,
  className,
  loading = false,
  disabled,
  type = "button",
  ...props
}: CommonProps & { loading?: boolean } & Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "className"
  >) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonClass({ variant, size, className }), loading && "relative")}
      {...props}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="absolute size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {/* While loading the label stays in the DOM but hidden, so the button
          keeps its width and nothing shifts under the pointer. */}
      <span className={cn("contents", loading && "invisible")}>
        <ButtonLabel icon={icon} iconTrailing={iconTrailing}>
          {children}
        </ButtonLabel>
      </span>
    </button>
  );
}

export function WebButtonLink({
  children,
  href,
  variant,
  size,
  icon,
  iconTrailing,
  className,
  external = false,
  ...props
}: CommonProps & {
  href: string;
  /** Renders a plain anchor for tel:, mailto:, WhatsApp and off-site links. */
  external?: boolean;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "href">) {
  const classes = buttonClass({ variant, size, className });
  const label = (
    <ButtonLabel icon={icon} iconTrailing={iconTrailing}>
      {children}
    </ButtonLabel>
  );

  if (external) {
    return (
      <a href={href} rel="noreferrer" className={classes} {...props}>
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {label}
    </Link>
  );
}
