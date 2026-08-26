"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { ABOUT_VISIT } from "@/components/web/constants/about.content";
import { SITE } from "@/components/web/constants/site";
import { WEB_ICON_STROKE, webIcons } from "@/components/web/icons";
import { Container } from "@/components/web/primitives/container";

/**
 * 05 — Nairobi Headquarters & Interactive Concierge Map.
 *
 * Production-grade office dossier featuring:
 * 1. Physical HQ coordinates, office hours, direct lines, and advisory appointment CTAs.
 * 2. Full interactive Google Maps console on the right with Roadmap / Satellite toggles
 *    and direct turn-by-turn navigation link to International House, Mama Ngina Street.
 */
export function AboutVisit() {
  const [mapMode, setMapMode] = useState<"roadmap" | "satellite">("roadmap");
  const PhoneIcon = webIcons.phone;
  const ChatIcon = webIcons.chat;
  const MailIcon = webIcons.mail;
  const ArrowOutIcon = webIcons.arrowOut;

  // Google Maps embed URL targeting International House on Mama Ngina Street
  const mapUrl = `https://maps.google.com/maps?q=International+House+Mama+Ngina+Street+Nairobi+Kenya&t=${
    mapMode === "satellite" ? "k" : "m"
  }&z=16&ie=UTF8&iwloc=&output=embed`;

  const directionsUrl = `https://maps.google.com/?q=International+House+Mama+Ngina+Street+Nairobi+CBD`;

  return (
    <section
      id="visit"
      aria-labelledby="visit-heading"
      className="scroll-mt-20 border-t border-line bg-surface-1 py-20 sm:py-24 lg:py-28 relative overflow-hidden"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center xl:gap-16">
          {/* ── Left Column: HQ Details, Hours & Communication Desk ── */}
          <div data-reveal className="lg:col-span-6 xl:col-span-6">
            <div className="mb-3.5 flex items-center gap-2">
              <span aria-hidden="true" className="h-px w-5 bg-brand-yellow" />
              <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                Find us · Nairobi Headquarters
              </p>
            </div>

            <h2
              id="visit-heading"
              className="font-editorial text-3xl font-medium leading-[1.12] tracking-tight text-ink-900 sm:text-4xl lg:text-[42px]"
            >
              {ABOUT_VISIT.title}
            </h2>

            <p className="mt-3.5 text-web-sm sm:text-base leading-relaxed text-slate-600 font-normal">
              Our headquarters is situated on the 8th floor of International House on Mama Ngina Street. Walk-ins and private advisory appointments welcome.
            </p>

            {/* Communication Desk & Schedule Breakdown */}
            <dl className="mt-6 divide-y divide-line border-y border-line">
              <div className="flex items-baseline justify-between gap-4 py-3.5">
                <dt className="font-mono text-web-micro uppercase tracking-[0.14em] text-slate-400">
                  Desk Hours
                </dt>
                <dd className="font-mono text-web-xs font-medium text-ink-900">
                  {SITE.officeHours}
                </dd>
              </div>

              <div className="flex items-baseline justify-between gap-4 py-3.5">
                <dt className="flex items-center gap-1.5 font-mono text-web-micro uppercase tracking-[0.14em] text-slate-400">
                  <PhoneIcon size={13} stroke={WEB_ICON_STROKE} />
                  <span>Direct Line</span>
                </dt>
                <dd>
                  <a
                    href={SITE.phoneHref}
                    className="font-mono text-web-xs font-medium text-ink-900 underline-offset-4 hover:underline"
                  >
                    {SITE.phone}
                  </a>
                </dd>
              </div>

              <div className="flex items-baseline justify-between gap-4 py-3.5">
                <dt className="flex items-center gap-1.5 font-mono text-web-micro uppercase tracking-[0.14em] text-slate-400">
                  <ChatIcon size={13} stroke={WEB_ICON_STROKE} />
                  <span>WhatsApp Concierge</span>
                </dt>
                <dd>
                  <a
                    href={SITE.whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-web-xs font-medium text-ink-900 underline-offset-4 hover:underline"
                  >
                    {SITE.whatsapp}
                  </a>
                </dd>
              </div>

              <div className="flex items-baseline justify-between gap-4 py-3.5">
                <dt className="flex items-center gap-1.5 font-mono text-web-micro uppercase tracking-[0.14em] text-slate-400">
                  <MailIcon size={13} stroke={WEB_ICON_STROKE} />
                  <span>Email Desk</span>
                </dt>
                <dd>
                  <a
                    href={SITE.emailHref}
                    className="font-mono text-web-xs font-medium text-ink-900 underline-offset-4 hover:underline"
                  >
                    {SITE.email}
                  </a>
                </dd>
              </div>
            </dl>

            {/* Executive Action CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-tertiary-gradient text-white px-6 py-3 font-mono text-web-micro uppercase tracking-[0.14em] font-medium shadow-sm hover:opacity-95 transition-all cursor-pointer"
              >
                <span>Contact Us</span>
              </Link>

              <Link
                href="/properties"
                className="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-surface-0 px-5 py-3 font-mono text-web-micro uppercase tracking-[0.14em] text-slate-700 hover:border-slate-400 hover:text-ink-900 transition-all cursor-pointer"
              >
                <span>Browse Properties</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>

              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-yellow text-ink-900 px-5 py-3 font-mono text-web-micro uppercase tracking-[0.14em] font-medium shadow-sm hover:brightness-105 transition-all cursor-pointer"
              >
                <span>Get Directions</span>
                <ArrowOutIcon size={12} stroke={WEB_ICON_STROKE} />
              </a>
            </div>
          </div>

          {/* ── Right Column: Interactive Map & Building Dossier Console ── */}
          <div data-reveal data-reveal-x="24" className="lg:col-span-6 xl:col-span-6">
            <div className="relative overflow-hidden rounded-[26px] border border-line-strong bg-surface-0 shadow-md">
              {/* Top Controls Strip */}
              <div className="absolute top-4 inset-x-4 z-10 flex items-center justify-between gap-3 pointer-events-none">
                {/* Location Badge */}
                <div className="inline-flex items-center gap-2 rounded-full bg-brand-dark/90 backdrop-blur-md border border-white/20 px-3.5 py-1.5 font-mono text-web-micro text-white shadow-sm">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>International House · 8th Floor</span>
                </div>

                {/* Map View Toggle Controls */}
                <div className="pointer-events-auto flex items-center rounded-full bg-white/95 border border-slate-200 p-1 shadow-sm backdrop-blur-md">
                  <button
                    type="button"
                    onClick={() => setMapMode("roadmap")}
                    className={cn(
                      "cursor-pointer px-3 py-1 text-web-micro font-mono uppercase tracking-wider rounded-full transition-all",
                      mapMode === "roadmap"
                        ? "bg-brand-dark text-white font-medium shadow-xs"
                        : "text-slate-500 hover:text-ink-900"
                    )}
                  >
                    Map
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapMode("satellite")}
                    className={cn(
                      "cursor-pointer px-3 py-1 text-web-micro font-mono uppercase tracking-wider rounded-full transition-all",
                      mapMode === "satellite"
                        ? "bg-brand-dark text-white font-medium shadow-xs"
                        : "text-slate-500 hover:text-ink-900"
                    )}
                  >
                    Satellite
                  </button>
                </div>
              </div>

              {/* Embedded Google Maps Frame */}
              <div className="relative h-[380px] sm:h-[440px] lg:h-[480px] w-full">
                <iframe
                  title="Sunland Real Estates Headquarters Map"
                  src={mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="size-full filter saturate-[0.95]"
                />
              </div>

              {/* Bottom Concierge & Directions Sub-Bar */}
              <div className="border-t border-line bg-surface-0 px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="font-mono text-xs text-slate-500">
                  Mama Ngina St &amp; City Hall Way · Nairobi CBD
                </p>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-web-micro font-medium text-ink-900 hover:underline"
                >
                  <span>Open in Google Maps</span>
                  <ArrowOutIcon size={12} stroke={WEB_ICON_STROKE} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
