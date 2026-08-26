import Image from "next/image";
import { getAuthorAvatar } from "../constants/people";
import { WEB_ICON_STROKE, webIcons } from "../icons";
import { BandArtwork } from "../primitives/band-artwork";
import { WebButtonLink } from "../primitives/button";
import { Container } from "../primitives/container";
import { Eyebrow } from "../primitives/eyebrow";
import { landlordDefaults } from "./home.defaults";

/**
 * 05 home.landlords, dark band on brand dark.
 *
 * Demonstrates systematic asset management and live landlord portal reporting.
 */
export function HomeLandlords() {
  const PhoneIcon = webIcons.phone;
  const CheckIcon = webIcons.check;
  const ShieldIcon = webIcons.shield;
  const { statement } = landlordDefaults;
  const managerPhoto = getAuthorAvatar(statement.manager.name);

  return (
    <section
      aria-labelledby="landlords-heading"
      className="web-dark relative overflow-hidden py-24 lg:py-32 bg-brand-dark"
    >
      {/* Ambient dusk radiance for depth and luxury */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_80%_45%,rgba(49,91,232,0.15),transparent_70%)]"
      />

      <BandArtwork icon="chart" position="right" />

      <Container className="relative">
        {/* Top: Uninhibited Wide Heading */}
        <div className="max-w-5xl" data-reveal>
          <Eyebrow tone="dark">{landlordDefaults.eyebrow}</Eyebrow>
          <h2
            id="landlords-heading"
            className="mt-4 font-editorial text-[clamp(2.5rem,4.2vw,4rem)] font-medium leading-[1.08] tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
          >
            {landlordDefaults.headline}
          </h2>
          <p className="web-subtitle mt-4 max-w-[75ch] text-web-sm sm:text-base leading-relaxed text-slate-300/90">
            {landlordDefaults.lead}
          </p>
        </div>

        {/* 2-Column Split: Uncarded Steps (Left) & White Statement Card (Right) */}
        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16 items-start">
          {/* Left Column: Uncarded Numbered Timeline & CTAs */}
          <div>
            <ol className="divide-y divide-white/10" data-reveal-group>
              {landlordDefaults.steps.map((step) => (
                <li
                  key={step.number}
                  className="flex items-start gap-5 py-6 first:pt-0 last:pb-0"
                >
                  <span className="font-mono text-base font-semibold text-brand-yellow shrink-0 mt-0.5">
                    {step.number}
                  </span>
                  <div>
                    <p className="font-editorial text-2xl font-medium text-white">
                      {step.title}
                    </p>
                    <p className="mt-1.5 text-web-sm leading-relaxed text-slate-300/85">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <WebButtonLink
                href={landlordDefaults.primaryCta.href}
                variant="primary"
                size="lg"
                icon="arrow"
                iconTrailing
                className="shadow-[0_4px_20px_rgba(243,223,39,0.25)] hover:scale-[1.02] active:scale-[0.98]"
              >
                {landlordDefaults.primaryCta.label}
              </WebButtonLink>
              <WebButtonLink
                href={landlordDefaults.secondaryCta.href}
                variant="ghostDark"
                size="lg"
              >
                {landlordDefaults.secondaryCta.label}
              </WebButtonLink>
            </div>
          </div>

          {/* Right Column: High-Contrast White ERP Statement Console.
              Slides in from the right rather than rising, so the console
              reads as arriving from a different axis than the timeline beside
              it, the one deliberate directional beat on this band. */}
          <div data-reveal data-reveal-x="32">
            <div className="relative overflow-hidden rounded-[26px] border border-slate-200/90 bg-white p-7 sm:p-9 shadow-[0_24px_60px_rgba(0,0,0,0.35),0_2px_6px_rgba(0,0,0,0.06)] text-slate-900">
              {/* Console Top Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="font-editorial text-2xl font-medium tracking-wide text-ink-900">
                    Sunland
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-mono text-web-nano font-medium uppercase tracking-wider text-slate-600">
                    ERP Live
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse motion-reduce:animate-none" />
                  <span className="font-mono text-web-micro font-medium uppercase tracking-[0.14em] text-slate-500">
                    {statement.portalLabel}
                  </span>
                </div>
              </div>

              {/* Statement Title & Paid Status */}
              <div className="mt-6 flex items-start justify-between gap-4">
                <div>
                  <p className="font-editorial text-2xl font-medium text-ink-900">
                    {statement.title}
                  </p>
                  <p className="font-mono mt-1 text-xs text-slate-500">
                    {statement.subtitle} · Active Tenancy
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-3 py-1 font-mono text-web-micro font-semibold uppercase tracking-wider text-emerald-700 shadow-xs">
                  <CheckIcon size={13} stroke={2.5} />
                  {statement.badge}
                </span>
              </div>

              {/* Ledger Breakdown */}
              <dl className="mt-6 space-y-1">
                {statement.rows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between gap-4 border-t border-slate-100 py-3.5"
                  >
                    <dt className="text-web-xs text-slate-600">{row.label}</dt>
                    <dd className="font-mono text-sm font-medium text-ink-900">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* Net Remittance Callout Box */}
              <div className="mt-5 flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4.5 shadow-xs">
                <div>
                  <p className="font-mono text-web-micro font-semibold uppercase tracking-wider text-emerald-800">
                    {statement.total.label}
                  </p>
                  <p className="text-xs text-emerald-600/90 mt-0.5">
                    Direct RTGS Disbursement
                  </p>
                </div>
                <span className="font-mono text-2xl font-semibold tracking-tight text-emerald-900">
                  {statement.total.value}
                </span>
              </div>

              {/* Property Manager Card */}
              <div className="mt-6 flex items-center justify-between gap-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  {/* A real face, resolved from the shared roster. The portal
                      mock's whole argument is that a named human owns the
                      property, and a monogram of an invented colleague was the
                      one element undercutting it. */}
                  {managerPhoto ? (
                    <span className="relative size-10 shrink-0 overflow-hidden rounded-full shadow-xs">
                      <Image
                        src={managerPhoto}
                        alt={statement.manager.name}
                        fill
                        sizes="40px"
                        className="object-cover object-top"
                      />
                    </span>
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-dark font-mono text-xs font-semibold text-white shadow-xs"
                    >
                      {statement.manager.name
                        .split(" ")
                        .map((part) => part.charAt(0))
                        .join("")}
                    </span>
                  )}
                  <div className="min-w-0 truncate">
                    <p className="truncate text-xs font-semibold text-ink-900">
                      {statement.manager.name}, {statement.manager.title}
                    </p>
                    <p className="font-mono text-xs text-slate-500">
                      {statement.manager.phone}
                    </p>
                  </div>
                </div>

                <a
                  href={`tel:${statement.manager.phone.replace(/\s+/g, "")}`}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand-dark px-4 py-2 font-mono text-web-micro font-medium uppercase tracking-wider text-white transition-all hover:bg-slate-800 shadow-xs"
                >
                  <PhoneIcon size={13} stroke={WEB_ICON_STROKE} aria-hidden="true" />
                  Call
                </a>
              </div>
            </div>

            {/* Security / System Footnote */}
            <p className="mt-5 flex items-center gap-2 text-xs leading-relaxed text-slate-400">
              <ShieldIcon size={14} stroke={WEB_ICON_STROKE} className="text-emerald-400 shrink-0" />
              <span>{statement.caption}</span>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
