import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { Breadcrumbs, type Crumb } from "../primitives/breadcrumbs";
import { Container } from "../primitives/container";

/**
 * The compact dark band that opens every interior page.
 *
 * Shorter than the home hero on purpose. A visitor on a facet page has
 * already decided to look at property; spending 90vh restating the brand
 * pushes the first listing card below the fold, which is the opposite of what
 * this page is for. Web doc 04 §2.1 calls it a compact band, and 36px above
 * the breadcrumb with 40px below the lead is what that means in practice.
 *
 * The right-hand `meta` slot carries the result count in mono, so the visitor
 * knows how much there is before scrolling.
 */
export function PageHeader({
  crumbs,
  title,
  lead,
  meta,
  tone = "dark",
  children,
  className,
}: {
  crumbs: Crumb[];
  title: string;
  lead?: string;
  /** Mono figure on the right, e.g. "39 properties". */
  meta?: ReactNode;
  tone?: "dark" | "tertiary";
  /** Optional slot beneath the lead, for facet pills or a search field. */
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden pb-10 pt-9",
        tone === "tertiary" ? "web-tertiary" : "web-dark",
        className
      )}
    >
      <Container>
        <Breadcrumbs items={crumbs} tone="dark" className="mb-6" />

        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[60ch]">
            <h1 className="web-title text-[clamp(2rem,1.4rem+2.4vw,3rem)] leading-[1.1] tracking-[-0.015em] text-on-dark-hi">
              {title}
            </h1>
            {lead && <p className="web-subtitle mt-3 text-base text-on-dark-lo">{lead}</p>}
          </div>
          {meta && <p className="web-numeric whitespace-nowrap text-sm text-on-dark">{meta}</p>}
        </div>

        {children && <div className="mt-8">{children}</div>}
      </Container>
    </section>
  );
}
