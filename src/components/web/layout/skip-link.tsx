/**
 * Skip to content.
 *
 * The first focusable element on every page, per doc 03 §6. Visually hidden
 * until focused, at which point it must be genuinely visible: a skip link
 * that stays off-screen when focused is worse than none, because a keyboard
 * user activates it without ever knowing it was there.
 */
export function SkipLink() {
  return (
    <a
      href="#content"
      className="web-control sr-only rounded-web-full bg-brand-yellow px-5 py-3 text-xs uppercase tracking-[0.12em] text-brand-dark focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
    >
      Skip to content
    </a>
  );
}
