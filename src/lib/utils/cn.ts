import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Class merger for the whole app.
 *
 * ── Why this is not the bare `twMerge` ──
 *
 * tailwind-merge resolves conflicts by sorting every class into a group and
 * keeping the last one per group. It knows Tailwind's built-in scales; it does
 * not know a theme's custom ones. Faced with `text-web-nano` it falls back to
 * its `text-*` heuristic and files it under **text-colour**, because that is
 * what an unrecognised `text-<something>` usually is.
 *
 * The consequence is silent and severe: in any `cn()` call that carries both a
 * size token and a colour — which is most controls — the colour is the later
 * class, so tailwind-merge drops the size as a redundant conflict. The element
 * then inherits its parent's font-size. That is how the nav links, buttons and
 * badges ended up rendering at 16px while their source said 10px, and why the
 * markup looked right in every file: the class was there, it just never
 * survived the merge.
 *
 * It only showed up where `cn()` was used. Components with a plain string
 * className rendered at the correct size, which made the bug look like a
 * design inconsistency rather than a tooling one.
 *
 * Declaring the custom scales below puts them in the right groups, so a size
 * and a colour no longer collide. Any new `--text-web-*` step must be added
 * here as well as to `@theme`, or it will be dropped the same way.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      // Mirrors the --text-web-* namespace in src/app/web-theme.css, plus the
      // two custom steps the ERP theme adds in globals.css. `xxs` alone is on
      // 451 elements; every one of them was losing its size class in any cn()
      // call that also carried a colour, exactly as the web tokens were.
      "font-size": [
        {
          text: [
            "xxs",
            "ms",
            "web-display",
            "web-h1",
            "web-h2",
            "web-h3",
            "web-h4",
            "web-lead",
            "web-body",
            "web-sm",
            "web-xs",
            "web-tiny",
            "web-micro",
            "web-nano",
          ],
        },
      ],
      // Mirrors --radius-web-*, for the same reason: an unrecognised
      // `rounded-web-full` would otherwise be grouped by guesswork.
      rounded: [
        { rounded: ["web-sm", "web-md", "web-lg", "web-xl", "web-card", "web-panel", "web-full"] },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
