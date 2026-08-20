import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * The content measure for every band on the site.
 *
 * 1320px with fluid gutters, matching the design templates. Full-bleed bands
 * break the container; their inner content does not, which is what keeps the
 * left edge of every headline on the page aligned regardless of how the band
 * behind it is coloured.
 */
export function Container({
  children,
  className,
  as: Component = "div",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "nav";
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Component
      className={cn("mx-auto w-full max-w-[1440px] px-6 sm:px-8 lg:px-12 xl:px-14", className)}
      {...rest}
    >
      {children}
    </Component>
  );
}
