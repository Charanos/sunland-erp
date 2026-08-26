import Link from "next/link";
import { SITE } from "../constants/site";
import { WEB_ICON_STROKE, webIcons } from "../icons";
import { Container } from "../primitives/container";

/**
 * Full-screen centered 404 Error Dossier.
 *
 * Bleeds and blends into the top navigation with an atmospheric dissolve scrim,
 * featuring centered executive typography, primary bg-tertiary-gradient CTA,
 * secondary owner/contact actions, and direct desk telemetry without a footer.
 */
export function NotFoundContent() {
  const ArrowIcon = webIcons.arrow;

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center min-h-[calc(100vh-80px)] overflow-hidden bg-surface-0 py-16 sm:py-24">
      {/* ── Top Header Scrim (Architectural curved canopy with luminous eased dissolve) ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-36 sm:h-44 overflow-hidden z-0"
      >
        <svg
          viewBox="0 0 1440 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="scrim-404-fade" x1="0" y1="0" x2="0" y2="180" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#151936" stopOpacity="1" />
              <stop offset="28%" stopColor="#151936" stopOpacity="0.95" />
              <stop offset="48%" stopColor="#151936" stopOpacity="0.78" />
              <stop offset="68%" stopColor="#151936" stopOpacity="0.45" />
              <stop offset="84%" stopColor="#151936" stopOpacity="0.18" />
              <stop offset="94%" stopColor="#151936" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#151936" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="scrim-404-glow" cx="50%" cy="0%" r="65%">
              <stop offset="0%" stopColor="#253575" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#151936" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#151936" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path
            d="M0,0 L1440,0 L1440,105 C1100,155 340,155 0,105 Z"
            fill="url(#scrim-404-fade)"
          />
          <path
            d="M0,0 L1440,0 L1440,105 C1100,155 340,155 0,105 Z"
            fill="url(#scrim-404-glow)"
          />
        </svg>
      </div>

      <Container className="relative z-10 flex flex-col items-center text-center">
        {/* Eyebrow Pill */}
        <div data-reveal className="mb-5 inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface-0 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500 shadow-2xs">
          <span className="size-1.5 rounded-full bg-brand-yellow" />
          <span>Error 404 · Page Not Located</span>
        </div>

        {/* Hero Editorial Heading */}
        <h1
          data-reveal
          className="font-editorial text-4xl sm:text-5xl lg:text-[58px] font-medium leading-[1.12] tracking-tight text-[#151936] max-w-4xl"
        >
          That page is not on our books.
        </h1>

        {/* Explanatory Lead */}
        <p
          data-reveal
          className="mt-5 max-w-2xl text-[15.5px] sm:text-[17px] leading-relaxed text-slate-600 font-normal"
        >
          The link may be out of date, or the listing may have been let, acquired, or archived. Everything currently on the market is indexed in our live portfolio.
        </p>

        {/* Executive Action Cluster */}
        <div
          data-reveal
          className="mt-9 flex flex-wrap items-center justify-center gap-3.5"
        >
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 rounded-full bg-tertiary-gradient text-white px-7 py-3.5 font-mono text-[11.5px] uppercase tracking-[0.14em] font-medium shadow-md hover:opacity-95 hover:shadow-lg transition-all cursor-pointer"
          >
            <span>Browse Properties</span>
            <ArrowIcon size={12} stroke={WEB_ICON_STROKE} />
          </Link>

          <Link
            href="/landlords"
            className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface-0 px-6 py-3.5 font-mono text-[11.5px] uppercase tracking-[0.14em] text-[#151936] hover:border-slate-400 hover:shadow-xs transition-all cursor-pointer"
          >
            <span>For Owners</span>
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-brand-yellow text-[#151936] px-6 py-3.5 font-mono text-[11.5px] uppercase tracking-[0.14em] font-medium shadow-sm hover:brightness-105 transition-all cursor-pointer"
          >
            <span>Contact Us</span>
          </Link>
        </div>

        {/* Direct Concierge Telemetry */}
        <p
          data-reveal
          className="mt-12 font-mono text-xs text-slate-400 flex flex-wrap items-center justify-center gap-1.5"
        >
          <span>Direct Advisory Desk:</span>
          <a
            href={SITE.phoneHref}
            className="font-medium text-[#151936] underline-offset-4 hover:underline"
          >
            {SITE.phone}
          </a>
          <span className="text-slate-300">·</span>
          <span>{SITE.officeHours}</span>
        </p>
      </Container>
    </div>
  );
}
