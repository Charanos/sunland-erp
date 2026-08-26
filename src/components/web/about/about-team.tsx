"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { ABOUT_TEAM } from "@/components/web/constants/about.content";
import { PEOPLE, type Person } from "@/components/web/constants/people";
import { SITE } from "@/components/web/constants/site";
import { WEB_ICON_STROKE, webIcons } from "@/components/web/icons";
import { Container } from "@/components/web/primitives/container";

/**
 * 03 — The Team & Leadership Section.
 *
 * Executive architectural redesign:
 * 1. Interactive Department Filter: All (10), Executive Board (4), Property Operations (3), Commercial & Finance (3)
 * 2. CEO Leadership Spotlight: Paul Amos Mwangi in an authoritative editorial showcase with quote, published guides, and direct line
 * 3. 3x3 Symmetrical Portrait Cards: 9 team members presented with framed photography, clear role typography, legible bio, and contact actions
 * 4. Full-Width Career Banner: "Join the Sunland Team" spanning the grid footer without breaking symmetry
 */

type Department = "all" | "leadership" | "operations" | "advisory";

const DEPARTMENTS: { id: Department; label: string; count: number }[] = [
  { id: "all", label: "All Members", count: 10 },
  { id: "leadership", label: "Executive Board & Leadership", count: 4 },
  { id: "operations", label: "Asset & Property Operations", count: 3 },
  { id: "advisory", label: "Commercial, Finance & Advisory", count: 3 },
];

function getPersonDepartment(person: Person): Department {
  const role = person.role.toLowerCase();
  if (
    role.includes("chief executive") ||
    role.includes("commercial director") ||
    role.includes("board member") ||
    role.includes("general manager")
  ) {
    return "leadership";
  }
  if (
    role.includes("property management") ||
    role.includes("facility management") ||
    role.includes("administration & content")
  ) {
    return "operations";
  }
  return "advisory";
}

function getRoleBadge(person: Person): string {
  const role = person.role.toLowerCase();
  if (role.includes("chief executive")) return "CEO";
  if (role.includes("commercial director")) return "Director";
  if (role.includes("board member")) return "Board";
  if (role.includes("general manager")) return "Operations";
  if (role.includes("property management")) return "Management";
  if (role.includes("facility")) return "Facility";
  if (role.includes("accountant")) return "Finance";
  if (role.includes("realtor")) return "Advisory";
  if (role.includes("business development")) return "Strategy";
  if (role.includes("content")) return "Administration";
  return "Specialist";
}

export function AboutTeam({
  articleCounts = {},
}: {
  /** Author name to published-article count, from `publishedPosts()`. */
  articleCounts?: Record<string, number>;
}) {
  const [activeDept, setActiveDept] = useState<Department>("all");

  const ArrowIcon = webIcons.arrow;
  const MailIcon = webIcons.mail;
  const PhoneIcon = webIcons.phone;
  const CheckIcon = webIcons.check;
  const BriefcaseIcon = webIcons.briefcase;

  // Split CEO from the rest for executive spotlight
  const ceo = PEOPLE[0];
  const otherMembers = useMemo(() => PEOPLE.slice(1), []);

  const filteredMembers = useMemo(() => {
    if (activeDept === "all") return otherMembers;
    return PEOPLE.filter((p) => getPersonDepartment(p) === activeDept);
  }, [activeDept, otherMembers]);

  const showCeoSpotlight = activeDept === "all" || activeDept === "leadership";

  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      className="scroll-mt-20 border-t border-line bg-surface-0 py-20 sm:py-24 lg:py-28 relative overflow-hidden"
    >
      <Container>
        {/* ── Section Header & Filter Strip ── */}
        <div data-reveal className="mb-12 flex flex-col gap-6 lg:mb-14">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[620px]">
              <div className="mb-3.5 flex items-center gap-2">
                <span aria-hidden="true" className="h-px w-5 bg-brand-yellow" />
                <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                  {ABOUT_TEAM.eyebrow}
                </p>
              </div>
              <h2
                id="team-heading"
                className="font-editorial text-3xl font-medium leading-[1.12] tracking-tight text-[#151936] sm:text-4xl lg:text-[40px]"
              >
                {ABOUT_TEAM.title}
              </h2>
              <p className="mt-3.5 text-[15px] sm:text-[16px] leading-relaxed text-slate-600 font-normal">
                {ABOUT_TEAM.lead}
              </p>
            </div>

            {/* Live Count & Roster Reassurance */}
            <div className="flex items-center gap-3 self-start lg:self-auto shrink-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface-1 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-600 shadow-sm">
                <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                <span>10 Mandate Specialists</span>
              </div>
            </div>
          </div>

          {/* Interactive Department Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-line">
            {DEPARTMENTS.map((dept) => {
              const isActive = activeDept === dept.id;
              return (
                <button
                  key={dept.id}
                  type="button"
                  onClick={() => setActiveDept(dept.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[11.5px] transition-all duration-200 cursor-pointer",
                    isActive
                      ? "bg-[#151936] text-white shadow-sm font-medium"
                      : "bg-surface-1 border border-line text-slate-600 hover:border-slate-300 hover:text-[#151936]"
                  )}
                >
                  <span>{dept.label}</span>
                  <span
                    className={cn(
                      "font-mono text-[10.5px] tabular-nums rounded-full px-1.5 py-0.2",
                      isActive ? "bg-white/20 text-white" : "bg-slate-200/70 text-slate-600"
                    )}
                  >
                    {dept.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── CEO Leadership Spotlight Card (Shown on "All" or "Executive Leadership") ── */}
        {showCeoSpotlight && ceo && (
          <div
            data-reveal
            className="mb-8 overflow-hidden rounded-[26px] border border-line-strong bg-gradient-to-br from-white via-surface-1 to-surface-2 shadow-[0_12px_35px_rgba(21,25,54,0.04)]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Left Column: Framed Executive Portrait */}
              <div className="lg:col-span-5 relative min-h-[360px] sm:min-h-[420px] lg:min-h-full bg-surface-2 overflow-hidden">
                <Image
                  src={ceo.photo}
                  alt={ceo.fullName ?? ceo.name}
                  fill
                  priority
                  sizes="(min-width: 1024px) 460px, 100vw"
                  className="object-cover object-top transition-transform duration-700 hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#151936]/40 via-transparent to-transparent" />
                
                {/* Executive Badge on Photo */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-[#151936]/80 backdrop-blur-md border border-white/20 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white">
                  <span className="size-1.5 rounded-full bg-brand-yellow" />
                  <span>Executive Leadership</span>
                </div>
              </div>

              {/* Right Column: Executive Credentials & Leadership Quote */}
              <div className="lg:col-span-7 p-7 sm:p-9 lg:p-10 flex flex-col justify-between">
                <div>
                  {/* Role Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-[#151936]/5 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#151936] font-medium">
                      <span className="size-1.5 rounded-full bg-brand-yellow" />
                      {ceo.role}
                    </span>
                    <span className="font-mono text-[11px] text-slate-500 tracking-wider uppercase">
                      Mandate Director
                    </span>
                  </div>

                  <h3 className="font-editorial text-[28px] sm:text-[32px] font-medium leading-tight text-[#151936]">
                    {ceo.fullName ?? ceo.name}
                  </h3>

                  <p className="mt-4 text-[15px] sm:text-[15.5px] leading-relaxed text-slate-600 font-normal">
                    {ceo.bio}
                  </p>

                  {/* Editorial Leadership Quote with bg-tertiary-gradient */}
                  {ceo.quote && (
                    <div className="mt-6 rounded-2xl bg-tertiary-gradient-glass text-white p-5 sm:p-6 shadow-md border border-white/10 relative overflow-hidden">
                      <p className="text-[14.5px] sm:text-[15px] leading-relaxed text-slate-100 font-normal italic">

                        &ldquo;{ceo.quote}&rdquo;
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Credential & Direct Action Bar */}
                <div className="mt-8 pt-5 border-t border-line flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {articleCounts[ceo.name] > 0 && (
                      <Link
                        href="/insights"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong bg-white px-3 py-1.5 font-mono text-[11px] text-slate-600 transition-all hover:bg-[#151936] hover:text-white hover:border-[#151936] shadow-sm"
                      >
                        <span>{articleCounts[ceo.name]} Published Guides</span>
                        <ArrowIcon size={11} stroke={WEB_ICON_STROKE} />
                      </Link>
                    )}
                    {ceo.contacts?.includes("email") && (
                      <a
                        href={SITE.emailHref}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong bg-white px-3 py-1.5 font-mono text-[11px] text-[#151936] transition-all hover:bg-[#151936] hover:text-white hover:border-[#151936] shadow-sm font-medium"
                      >
                        <MailIcon size={12} stroke={WEB_ICON_STROKE} />
                        <span>Direct Email</span>
                      </a>
                    )}
                  </div>

                  <span className="font-mono text-[11px] text-slate-500 inline-flex items-center gap-1">
                    <CheckIcon size={12} stroke={2.5} className="text-emerald-600" />
                    <span>Direct Mandate Oversight</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Team Grid: 3-Column Symmetrical Layout (Clean 3x3 Matrix) ── */}
        <div className="mt-8">
          {activeDept !== "all" && (
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-mono text-[12px] uppercase tracking-[0.16em] text-slate-500 font-medium">
                {DEPARTMENTS.find((d) => d.id === activeDept)?.label} ({filteredMembers.length})
              </h3>
            </div>
          )}

          <ul
            data-reveal-group
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredMembers.map((person) => {
              const articles = articleCounts[person.name] ?? 0;
              const badge = getRoleBadge(person);

              return (
                <li
                  key={person.name}
                  className="group flex flex-col justify-between rounded-[22px] border border-line bg-surface-1 p-5 transition-all duration-300 hover:border-slate-300 hover:bg-white hover:shadow-[0_10px_30px_rgba(21,25,54,0.06)]"
                >
                  <div>
                    {/* Framed Portrait Box */}
                    <div className="relative aspect-[4/3.2] w-full overflow-hidden rounded-xl bg-surface-2 mb-4">
                      <Image
                        src={person.photo}
                        alt={person.fullName ?? person.name}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

                      {/* Tag Badge on Portrait */}
                      <span className="absolute top-2.5 right-2.5 rounded-md bg-[#151936]/80 backdrop-blur-md px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-white">
                        {badge}
                      </span>

                      {/* Guide badge on photo if available */}
                      {articles > 0 && (
                        <Link
                          href="/insights"
                          className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 rounded-md bg-white/90 backdrop-blur-md px-2 py-0.5 font-mono text-[10px] text-[#151936] hover:bg-white transition-colors shadow-sm"
                        >
                          <span>{articles} {articles === 1 ? "guide" : "guides"}</span>
                          <ArrowIcon size={9} stroke={WEB_ICON_STROKE} />
                        </Link>
                      )}
                    </div>

                    {/* Role & Name */}
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500 font-medium leading-none mb-1.5">
                      {person.role}
                    </p>
                    <h4 className="font-editorial text-[20px] font-medium leading-tight text-[#151936] transition-colors">
                      {person.fullName ?? person.name}
                    </h4>

                    {/* Bio Snippet */}
                    <p className="mt-2.5 text-[13.5px] leading-relaxed text-slate-600 font-normal line-clamp-3">
                      {person.bio}
                    </p>
                  </div>

                  {/* Direct Contact Actions */}
                  <div className="mt-4 pt-3.5 border-t border-line flex items-center justify-between font-mono text-[11px]">
                    <div className="flex items-center gap-3">
                      {person.contacts?.includes("email") && (
                        <a
                          href={SITE.emailHref}
                          className="inline-flex items-center gap-1 text-slate-600 hover:text-[#151936] transition-colors"
                        >
                          <MailIcon size={12} stroke={WEB_ICON_STROKE} />
                          <span>Email</span>
                        </a>
                      )}
                      {person.contacts?.includes("call") && (
                        <a
                          href={SITE.phoneHref}
                          className="inline-flex items-center gap-1 text-slate-600 hover:text-[#151936] transition-colors"
                        >
                          <PhoneIcon size={12} stroke={WEB_ICON_STROKE} />
                          <span>Call</span>
                        </a>
                      )}
                      {!person.contacts?.length && (
                        <span className="text-slate-400 text-[10.5px]">
                          Desk: Nairobi HQ
                        </span>
                      )}
                    </div>

                    <span className="text-slate-400 text-[10px] uppercase tracking-wider">
                      Verified Mandate
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ── Full-Width Luxury Career & Talent Acquisition Banner ── */}
        <div
          data-reveal
          className="mt-12 overflow-hidden rounded-[26px] border border-line bg-gradient-to-r from-surface-1 via-white to-surface-1 p-7 sm:p-9 lg:p-10 shadow-sm"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-[620px]">
              <div className="mb-2.5 flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-brand-yellow" />
                <p className="font-mono text-[10.5px] font-medium uppercase tracking-[0.2em] text-slate-500">
                  Careers &amp; Partnerships
                </p>
              </div>
              <h3 className="font-editorial text-2xl sm:text-[26px] font-medium leading-snug text-[#151936]">
                {ABOUT_TEAM.hiring.title}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-slate-600 font-normal">
                {ABOUT_TEAM.hiring.body}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
              <Link
                href={ABOUT_TEAM.hiring.cta.href}
                className="inline-flex items-center gap-2 rounded-xl bg-[#151936] px-5 py-3 font-mono text-[12px] uppercase tracking-[0.14em] text-white transition-all duration-200 hover:bg-[#1f254e] hover:shadow-md cursor-pointer"
              >
                <BriefcaseIcon size={14} stroke={WEB_ICON_STROKE} />
                <span>{ABOUT_TEAM.hiring.cta.label}</span>
                <ArrowIcon size={13} stroke={WEB_ICON_STROKE} />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
