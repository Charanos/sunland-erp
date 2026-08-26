import Image from "next/image";
import { ABOUT_STORY } from "@/components/web/constants/about.content";
import { WEB_AREAS } from "@/components/web/constants/locations.content";
import { WEB_ICON_STROKE, webIcons } from "@/components/web/icons";
import { Container } from "@/components/web/primitives/container";

const STORY_PILLARS = [
  {
    icon: "shield" as const,
    title: "Arrears & Cashflow Protection",
    desc: "Day-one reconciliation and direct tenant ledger tracking with zero hidden float.",
  },
  {
    icon: "briefcase" as const,
    title: "Transparent Maintenance Oversight",
    desc: "Three competitive supplier quotes, photo handovers, and full invoice backup.",
  },
  {
    icon: "chart" as const,
    title: "Real-Time Client ERP Portal",
    desc: "Live access to statements, receipts, and occupancy health 24 hours a day.",
  },
] as const;

/**
 * 01 — the chapter opener.
 *
 * `figures` arrives live from `getHomeAggregates()` where the query succeeded,
 * and falls back to `ABOUT_STORY.figures` where it did not. That distinction is
 * the point of this section rather than a detail of it: the argument being made
 * two paragraphs above is that the owner should not have to take a number on
 * trust, and a hand-typed count under that sentence undercuts it.
 */
export function AboutStorySection({
  figures = ABOUT_STORY.figures,
}: {
  figures?: readonly { value: string; label: string }[];
}) {
  const ShieldIcon = webIcons.shield;
  const BriefcaseIcon = webIcons.briefcase;
  const ChartIcon = webIcons.chart;

  const pillarIcons = {
    shield: ShieldIcon,
    briefcase: BriefcaseIcon,
    chart: ChartIcon,
  };

  return (
    <section aria-labelledby="story-heading" className="bg-surface-0 py-20 sm:py-24 lg:py-28 border-t border-line">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center xl:gap-16">
          {/* ── Left Column: Open Editorial Narrative & Breathable Pillars ── */}
          <div data-reveal className="lg:col-span-6 xl:col-span-7">
            {/* Section Eyebrow */}
            <div className="flex items-center gap-2 mb-3.5">
              <span className="h-px w-5 bg-brand-yellow" />
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500 font-medium">
                Operating Philosophy & Mandate
              </p>
            </div>

            {/* Section Headline */}
            <h2
              id="story-heading"
              className="font-editorial text-3xl sm:text-4xl lg:text-[44px] font-medium leading-[1.12] text-ink-900 tracking-tight"
            >
              {ABOUT_STORY.title}
            </h2>

            {/* Lead Narrative Statement */}
            <p className="mt-5 text-[17.5px] sm:text-[19px] leading-relaxed text-ink-900 font-normal border-l-2 border-brand-yellow pl-4 sm:pl-5">
              {ABOUT_STORY.paragraphs[0]}
            </p>

            {/* Supporting Story Paragraph */}
            <p className="mt-4 text-web-sm sm:text-base leading-relaxed text-slate-600 font-normal">
              {ABOUT_STORY.paragraphs[1]}
            </p>

            {/* 3 Uncarded, Open Differentiator Pillars */}
            <div data-reveal-group className="mt-9 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-7 border-t border-line">
              {STORY_PILLARS.map((pillar) => {
                const IconComponent = pillarIcons[pillar.icon];
                return (
                  <div key={pillar.title} className="group flex flex-col space-y-2.5">
                    <span className="flex size-8.5 shrink-0 items-center justify-center rounded-lg bg-surface-1 border border-line-soft text-ink-900 shadow-2xs transition-transform duration-300 group-hover:scale-105">
                      <IconComponent size={16} stroke={WEB_ICON_STROKE} />
                    </span>
                    <h3 className="font-editorial text-web-body font-medium leading-snug text-ink-900">
                      {pillar.title}
                    </h3>
                    <p className="text-web-xs leading-relaxed text-slate-500 font-normal">
                      {pillar.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Footnote on Geographic Coverage */}
            <div className="mt-7 flex items-start gap-2.5 border-t border-line-soft pt-4 font-mono text-xs text-slate-500 leading-relaxed">
              <span className="size-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
              {/* Counted, not typed. This line read "20 areas" as a literal
                  after the copy was inlined, so it would have gone on claiming
                  twenty the moment a twenty-first was added to WEB_AREAS —
                  while the footprint section directly above showed the real
                  number. */}
              <p>
                We work across{" "}
                <span className="font-medium text-slate-700">{WEB_AREAS.length} areas</span>, from
                Kilimani and Lavington to Tatu City, Nyali, and upcountry acreage in Nyeri and
                Elgeyo Marakwet. Where we cannot service a property properly, we say so.
              </p>
            </div>
          </div>

          {/* ── Right Column: Photography Anchor & Clean Uncarded Metrics ── */}
          <div data-reveal data-reveal-x="24" className="lg:col-span-6 xl:col-span-5 flex flex-col gap-6">
            {/* Visual Frame */}
            <div className="group relative aspect-[16/11] sm:aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line bg-slate-900 shadow-md">
              <Image
                src="/images/about-story.jpg"
                alt="Nairobi commercial and residential architectural landscape"
                fill
                sizes="(min-width: 1024px) 500px, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-deep/80 via-transparent to-transparent"
              />

              {/* Floating Top Badge */}
              <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-3.5 py-1 font-mono text-web-micro font-medium text-white border border-white/20 shadow-sm">
                <span className="size-1.5 rounded-full bg-brand-yellow" />
                <span>Nairobi Headquarters & Regional Hubs</span>
              </div>

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-white font-mono text-xs">
                <span className="text-slate-300">Active Asset Management</span>
                <span className="text-white/80 font-medium">Since 2018</span>
              </div>
            </div>

            {/* Uncarded Metric Strip with Mono Numerals */}
            <dl data-reveal-group className="grid grid-cols-3 divide-x divide-line pt-3 border-t border-line-soft">
              {figures.map((figure, idx) => (
                <div
                  key={figure.label}
                  className={`flex flex-col ${
                    idx === 0 ? "pr-4 sm:pr-6" : idx === 1 ? "px-4 sm:px-6" : "pl-4 sm:pl-6"
                  }`}
                >
                  <dd className="font-mono text-2xl sm:text-[32px] font-semibold tracking-tight text-ink-900 leading-none">
                    {figure.value}
                  </dd>
                  <dt className="font-mono mt-2 text-web-nano uppercase tracking-[0.15em] text-slate-400 font-medium leading-tight">
                    {figure.label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}
