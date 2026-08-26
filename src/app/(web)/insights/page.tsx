import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import {
  INSIGHT_CATEGORIES,
  INSIGHTS_HERO,
  INSIGHTS_NEWSLETTER,
  publishedPosts,
  getAuthorAvatar,
} from "@/components/web/constants/insights.content";
import { NewsletterForm } from "@/components/web/layout/newsletter-form";
import { Container } from "@/components/web/primitives/container";
import { InsightsHero } from "@/components/web/insights/insights-hero";
import { WEB_ICON_STROKE, webIcons } from "@/components/web/icons";
import { WebMediaBadge } from "@/components/web/primitives/badge";

export const metadata: Metadata = {
  title: "Research & Market Insights | Sunland Real Estates",
  description: INSIGHTS_HERO.lead,
};

export const revalidate = 3600;

export default async function InsightsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const raw = Array.isArray(params.category) ? params.category[0] : params.category;
  const active = INSIGHT_CATEGORIES.find((category) => category === raw);

  const all = publishedPosts();
  const posts = active ? all.filter((post) => post.category === active) : all;
  const featured = posts.find((post) => post.featured) ?? posts[0];
  const rest = featured ? posts.filter((post) => post.slug !== featured.slug) : posts;

  const ArrowRightIcon = webIcons.arrow;
  const DocIcon = webIcons.doc;

  return (
    <>
      {/* ── 01. Blended Hero Section (Left-Aligned Title, Editorial Action Bar) ── */}
      {/* The full published count, not the filtered one: the pill is a claim
          about the library, and it should not shrink when someone narrows to a
          category. The filtered figure is already shown on the pills below. */}
      <InsightsHero articleCount={all.length} />

      {/* ── 02. Main Insights Directory Workspace ── */}
      <main className="bg-surface-0 pb-24 pt-12 sm:pt-14 border-t border-line">
        <Container>
          {/* Category Filter Pills & Count Telemetry */}
          <div className="mb-10 sm:mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-line pb-6">
            <nav aria-label="Filter by category" className="flex flex-wrap items-center gap-2">
              <FilterPill href="/insights" active={!active}>
                All Categories ({all.length})
              </FilterPill>
              {INSIGHT_CATEGORIES.map((category) => {
                const categoryCount = all.filter((p) => p.category === category).length;
                return (
                  <FilterPill
                    key={category}
                    href={`/insights?category=${encodeURIComponent(category)}`}
                    active={active === category}
                  >
                    <span>{category}</span>
                    <span
                      className={cn(
                        "size-4 rounded-full flex items-center justify-center text-web-nano",
                        active === category
                          ? "bg-white/20 text-white"
                          : "bg-surface-2 text-ink-500"
                      )}
                    >
                      {categoryCount}
                    </span>
                  </FilterPill>
                );
              })}
            </nav>

            <p aria-live="polite" className="font-mono text-xs text-ink-400">
              Showing <strong className="text-ink-900 font-medium">{posts.length}</strong> verified{" "}
              {posts.length === 1 ? "guide" : "guides"}
            </p>
          </div>

          {/* ── 03. Featured Showcase Whitepaper ── */}
          {featured && (
            <div className="mb-16 sm:mb-20">
              <div className="flex items-center gap-2 mb-6">
                <span aria-hidden="true" className="h-px w-5 bg-brand-yellow" />
                <p className="font-mono text-web-nano uppercase tracking-[0.22em] text-slate-500 font-medium">
                  Featured Master Advisory
                </p>
              </div>

              <Link
                href={`/insights/${featured.slug}`}
                data-reveal
                className="group relative grid gap-8 lg:gap-12 rounded-[28px] border border-line bg-surface-1 p-6 sm:p-8 lg:p-10 lg:grid-cols-12 lg:items-center transition-all duration-300 hover:shadow-[0_20px_45px_rgba(21,25,54,0.08)] hover:border-slate-300"
              >
                {/* Media Image Column */}
                <div className="lg:col-span-6 relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-900 shadow-xs">
                  <Image
                    src={
                      featured.imageUrl ??
                      "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80"
                    }
                    alt={featured.title}
                    fill
                    sizes="(min-width: 1024px) 600px, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
                  />
                  <WebMediaBadge caps={false} dot="bg-brand-yellow" className="absolute left-4 top-4 z-10">
                    {featured.category} · Featured
                  </WebMediaBadge>
                </div>

                {/* Content Column */}
                <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
                  <div>
                    <h2 className="font-editorial text-2xl sm:text-3xl lg:text-[34px] font-medium leading-[1.18] text-ink-900 transition-colors group-hover:text-blue-950">
                      {featured.title}
                    </h2>
                    <p className="mt-3.5 text-web-sm sm:text-base leading-relaxed text-slate-600 font-normal">
                      {featured.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3 font-mono text-xs text-slate-500">
                      {getAuthorAvatar(featured.author) && (
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-line">
                          <Image
                            src={getAuthorAvatar(featured.author)!}
                            alt={featured.author}
                            fill
                            // 48px to match size-12, not the 32px this asked
                            // for: an undersized `sizes` makes the optimizer
                            // serve a 32px file that the browser then stretches
                            // to 48, which is why these portraits looked soft.
                            sizes="48px"
                            className="object-cover object-center"
                          />
                        </div>
                      )}
                      <span className="font-medium text-ink-900">{featured.author}</span>
                      <span aria-hidden="true">·</span>
                      <span>{featured.date}</span>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1">
                        <DocIcon size={12} stroke={WEB_ICON_STROKE} />
                        {featured.readingMinutes} min read
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-2 font-mono text-xs font-medium text-ink-900 group-hover:text-blue-900 group-hover:translate-x-1 transition-all">
                      <span>Read Whitepaper</span>
                      <ArrowRightIcon size={13} stroke={2} />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* ── 04. Three-in-a-Row Articles Grid ── */}
          {rest.length > 0 && (
            <div className="mb-20">
              <div className="flex items-center justify-between pb-5 border-b border-line-soft mb-8">
                <div className="flex items-center gap-2.5">
                  <span aria-hidden="true" className="h-px w-5 bg-brand-yellow" />
                  <p className="font-mono text-web-nano uppercase tracking-[0.22em] text-slate-500 font-medium">
                    Published Research & Briefings
                  </p>
                </div>
                <span className="font-mono text-xs text-slate-400">
                  {rest.length} {rest.length === 1 ? "Article" : "Articles"}
                </span>
              </div>

              {/* Staggered by list item, so a three-up row resolves left to
                  right rather than the whole grid blinking on at once. */}
              <ul
                data-reveal-group
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10"
              >
                {rest.map((post) => (
                  <li key={post.slug}>
                    <article className="group relative flex h-full flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1">
                      {/* Media Image Frame (Clean 16:10 Ratio) */}
                      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-900 shadow-2xs transition-shadow duration-300 group-hover:shadow-md">
                        <Image
                          src={
                            post.imageUrl ??
                            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80"
                          }
                          alt={post.title}
                          fill
                          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent"
                        />
                        <WebMediaBadge caps={false} className="absolute left-3.5 top-3.5 z-10">
                          {post.category}
                        </WebMediaBadge>
                      </div>

                      {/* Content Section below photo */}
                      <div className="flex flex-1 flex-col justify-between pt-4.5 pb-1">
                        <div>
                          <h3 className="font-editorial text-[22px] sm:text-[23px] font-medium leading-[1.2] text-ink-900 transition-colors group-hover:text-blue-950">
                            <Link
                              href={`/insights/${post.slug}`}
                              className="after:absolute after:inset-0"
                            >
                              {post.title}
                            </Link>
                          </h3>

                          <p className="mt-2.5 text-web-xs leading-relaxed text-slate-600 font-normal line-clamp-2">
                            {post.summary}
                          </p>
                        </div>

                        {/* Author & Telemetry Footer */}
                        <div className="mt-5 border-t border-slate-200/80 pt-3.5 flex items-center justify-between font-mono text-xs text-slate-500">
                          <div className="flex items-center gap-2.5">
                            {getAuthorAvatar(post.author) && (
                              <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-line">
                                <Image
                                  src={getAuthorAvatar(post.author)!}
                                  alt={post.author}
                                  fill
                                  sizes="28px"
                                  className="object-cover object-center"
                                />
                              </div>
                            )}
                            <span className="font-medium text-ink-900">{post.author}</span>
                            <span>·</span>
                            <span>{post.readingMinutes} min</span>
                          </div>

                          <div className="flex size-8 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-600 shadow-2xs transition-all duration-300 group-hover:translate-x-0.5 group-hover:border-ink-900 group-hover:bg-brand-dark group-hover:text-white">
                            <ArrowRightIcon size={13} stroke={2} aria-hidden="true" />
                          </div>
                        </div>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── 05. Executive Newsletter & Advisory Consultation ── */}
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-brand-dark via-[#10132c] to-brand-deep p-8 sm:p-12 lg:p-14 text-white shadow-2xl">
            {/* The two halves arrive from opposite sides: the pitch rises,
                the form slides in from the right. Revealing the inner grid
                rather than the panel keeps the gradient card itself static,
                which is what stops its edge shifting against the band. */}
            <div data-reveal-group data-reveal-x="24" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-6 space-y-3">
                <div className="flex items-center gap-2">
                  <span aria-hidden="true" className="h-px w-5 bg-brand-yellow" />
                  <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-300 font-medium">
                    Executive Real Estate Dispatch
                  </p>
                </div>
                <h2 className="font-editorial text-3xl sm:text-4xl font-medium leading-tight text-white">
                  {INSIGHTS_NEWSLETTER.title}
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-slate-300/90 font-normal max-w-[48ch]">
                  {INSIGHTS_NEWSLETTER.body}
                </p>
              </div>

              <div className="lg:col-span-6">
                <NewsletterForm />
              </div>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}

function FilterPill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-web-micro uppercase tracking-wider transition-all duration-200",
        active
          ? "bg-brand-dark text-white font-medium shadow-sm"
          : "border border-line bg-surface-0 text-ink-600 hover:text-ink-900 hover:bg-surface-1 hover:border-ink-400"
      )}
    >
      {children}
    </Link>
  );
}
