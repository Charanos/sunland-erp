"use client";

import { useEffect } from "react";
import Link from "next/link";
import { SITE } from "@/components/web/constants/site";
import { WEB_ICON_STROKE, webIcons } from "@/components/web/icons";
import { Container } from "@/components/web/primitives/container";

/**
 * 500 Global Web Error Boundary.
 *
 * Full-screen centered executive dossier with dark dissolve scrim,
 * retry trigger, direct phone link, and WhatsApp concierge.
 */
export default function WebError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[web] unhandled render error", error);
  }, [error]);

  const PhoneIcon = webIcons.phone;
  const ChatIcon = webIcons.chat;

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center min-h-[calc(100vh-80px)] overflow-hidden bg-surface-0 py-16 sm:py-24 text-center">
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
            <linearGradient id="scrim-500-fade" x1="0" y1="0" x2="0" y2="180" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#151936" stopOpacity="1" />
              <stop offset="28%" stopColor="#151936" stopOpacity="0.95" />
              <stop offset="48%" stopColor="#151936" stopOpacity="0.78" />
              <stop offset="68%" stopColor="#151936" stopOpacity="0.45" />
              <stop offset="84%" stopColor="#151936" stopOpacity="0.18" />
              <stop offset="94%" stopColor="#151936" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#151936" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="scrim-500-glow" cx="50%" cy="0%" r="65%">
              <stop offset="0%" stopColor="#253575" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#151936" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#151936" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path
            d="M0,0 L1440,0 L1440,105 C1100,155 340,155 0,105 Z"
            fill="url(#scrim-500-fade)"
          />
          <path
            d="M0,0 L1440,0 L1440,105 C1100,155 340,155 0,105 Z"
            fill="url(#scrim-500-glow)"
          />
        </svg>
      </div>

      <Container className="relative z-10 flex flex-col items-center text-center">
        {/* Eyebrow Pill */}
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface-0 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500 shadow-2xs">
          <span className="size-1.5 rounded-full bg-rose-500 animate-pulse" />
          <span>Error 500 · Temporary Interruption</span>
        </div>

        {/* Hero Editorial Heading */}
        <h1 className="font-editorial text-4xl sm:text-5xl lg:text-[58px] font-medium leading-[1.12] tracking-tight text-[#151936] max-w-4xl">
          This page did not load.
        </h1>

        {/* Explanatory Lead */}
        <p className="mt-5 max-w-2xl text-[15.5px] sm:text-[17px] leading-relaxed text-slate-600 font-normal">
          The fault is ours, not yours. You can retry the request right away, or connect directly with our advisory desk.
        </p>

        {/* Executive Action Cluster */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-tertiary-gradient text-white px-7 py-3.5 font-mono text-[11.5px] uppercase tracking-[0.14em] font-medium shadow-md hover:opacity-95 hover:shadow-lg transition-all cursor-pointer"
          >
            <span>Try Again</span>
          </button>

          <a
            href={SITE.phoneHref}
            className="inline-flex items-center gap-2 rounded-full bg-brand-yellow text-[#151936] px-6 py-3.5 font-mono text-[11.5px] uppercase tracking-[0.14em] font-medium shadow-sm hover:brightness-105 transition-all cursor-pointer"
          >
            <PhoneIcon size={12} stroke={WEB_ICON_STROKE} />
            <span>Call {SITE.phone}</span>
          </a>

          <a
            href={SITE.whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface-0 px-6 py-3.5 font-mono text-[11.5px] uppercase tracking-[0.14em] text-[#151936] hover:border-slate-400 hover:shadow-xs transition-all cursor-pointer"
          >
            <ChatIcon size={12} stroke={WEB_ICON_STROKE} />
            <span>WhatsApp</span>
          </a>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface-0 px-6 py-3.5 font-mono text-[11.5px] uppercase tracking-[0.14em] text-[#151936] hover:border-slate-400 hover:shadow-xs transition-all cursor-pointer"
          >
            <span>Return Home</span>
          </Link>
        </div>

        {/* Reference Incident Code */}
        {error.digest && (
          <p className="mt-12 font-mono text-xs text-slate-400">
            Incident Reference: <span className="font-semibold text-slate-600">{error.digest}</span>
          </p>
        )}
      </Container>
    </div>
  );
}
