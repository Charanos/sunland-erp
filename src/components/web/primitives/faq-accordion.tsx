import { cn } from "@/lib/utils/cn";
import { WEB_ICON_STROKE, webIcons } from "../icons";

export type FaqItem = { question: string; answer: string };

/**
 * The FAQ accordion, shared by the home page, the landlord hub and every
 * service page.
 *
 * Built on native `<details>` and `<summary>`. No accordion library, no
 * JavaScript, no `aria-expanded` to keep in sync by hand: the browser gives
 * keyboard operation, correct semantics and open state for free, and it works
 * before hydration. That last part matters more here than anywhere else on
 * the site, because doc 06 calls the landlord FAQ the highest-value AI SEO
 * surface we have, and a crawler that has to run JavaScript to read an answer
 * often does not.
 *
 * `name` groups the items so only one is open at a time where that is wanted.
 * Omit it and they open independently, which is right on a long reference
 * list where someone is comparing two answers.
 *
 * TODO(W5-3): emit FAQPage structured data from the same array.
 */
export function FaqAccordion({
  items,
  /** Set to make the group exclusive, one open at a time. */
  name,
  tone = "light",
  className,
}: {
  items: FaqItem[];
  name?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const PlusIcon = webIcons.plus;
  const isDark = tone === "dark";

  return (
    <div className={className}>
      {items.map((item) => (
        <details
          key={item.question}
          name={name}
          className={cn(
            "group border-t last:border-b",
            isDark ? "border-dark-line" : "border-line"
          )}
        >
          <summary className="web-hit flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left [&::-webkit-details-marker]:hidden">
            <span
              className={cn("web-title-card text-xl", isDark ? "text-on-dark-hi" : "text-ink-900")}
            >
              {item.question}
            </span>
            <PlusIcon
              size={20}
              stroke={WEB_ICON_STROKE}
              aria-hidden="true"
              className={cn(
                "shrink-0 transition-transform duration-200 group-open:rotate-45",
                isDark ? "text-on-dark-lo" : "text-ink-400"
              )}
            />
          </summary>
          <p className={cn("web-prose pb-6", isDark ? "text-on-dark" : "text-ink-500")}>
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
