import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import {
  INSIGHT_CATEGORIES,
  INSIGHTS_HERO,
  INSIGHTS_NEWSLETTER,
  publishedPosts,
  type InsightPost,
} from "@/components/web/constants/insights.content";
import { NewsletterForm } from "@/components/web/layout/newsletter-form";
import { WebButtonLink } from "@/components/web/primitives/button";
import { Breadcrumbs } from "@/components/web/primitives/breadcrumbs";
import { Container } from "@/components/web/primitives/container";
import { Eyebrow } from "@/components/web/primitives/eyebrow";

export const metadata: Metadata = {
  title: "Insights on Nairobi property, for owners and tenants",
  description: INSIGHTS_HERO.lead,
};

export const revalidate = 3600;

/**
 * The insights index.
 *
 * Filter pills, a wide featured card, a grid, and the newsletter panel, all
 * driven by the posts array. Only articles with a written body appear: the
 * remaining six in the editorial plan are held in the content file until
 * theirs exist, so the index never links to an empty page.
 *
 * Category filtering runs off `?category=`, server-side, so a filtered view
 * is shareable and crawlable rather than living in client state.
 */
export default async function InsightsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const raw = Array.isArray(params.category) ? params.category[0] : params.category;
  // Allowlisted: an unrecognised category shows everything rather than an
  // empty grid for a category that does not exist.
  const active = INSIGHT_CATEGORIES.find((category) => category === raw);

  const all = publishedPosts();
  const posts = active ? all.filter((post) => post.category === active) : all;
  const featured = posts.find((post) => post.featured) ?? posts[0];
  const rest = featured ? posts.filter((post) => post.slug !== featured.slug) : posts;

  return (
    <>
      <section
        aria-labelledby="insights-heading"
        className="web-dark px-5 pb-18 pt-8 sm:px-8 lg:px-14"
      >
        <div className="mx-auto w-full max-w-[1320px]">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Insights" }]}
            className="mb-9"
          />
          <Eyebrow tone="dark">{INSIGHTS_HERO.eyebrow}</Eyebrow>
          <h1
            id="insights-heading"
            className="web-title mt-5 max-w-[20em] text-[clamp(2.25rem,1.5rem+3.4vw,3.5rem)] leading-[1.06] tracking-[-0.015em] text-on-dark-hi"
          >
            {INSIGHTS_HERO.headline}
          </h1>
          <p className="web-subtitle mt-5 max-w-[58ch] text-web-lead text-on-dark">
            {INSIGHTS_HERO.lead}
          </p>
        </div>
      </section>

      <main className="bg-surface-0 pb-24 pt-14">
        <Container>
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-7">
            <nav aria-label="Filter by category" className="flex flex-wrap gap-1.5">
              <FilterPill href="/insights" active={!active}>
                All
              </FilterPill>
              {INSIGHT_CATEGORIES.map((category) => (
                <FilterPill
                  key={category}
                  href={`/insights?category=${encodeURIComponent(category)}`}
                  active={active === category}
                >
                  {category}
                </FilterPill>
              ))}
            </nav>
            <p aria-live="polite" className="web-numeric text-[13px] text-ink-400">
              {posts.length} {posts.length === 1 ? "article" : "articles"}
            </p>
          </div>

          {featured ? (
            <>
              <Link
                href={`/insights/${featured.slug}`}
                className="group mb-12 grid gap-10 border-b border-line pb-12 lg:grid-cols-2 lg:items-center"
              >
                <ArticlePanel post={featured} ratio="aspect-[16/10]" />
                <div>
                  <span className="web-numeric inline-flex rounded-web-full border border-line px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-ink-500">
                    {featured.category} · Featured
                  </span>
                  <h2 className="web-title mt-4.5 text-web-h2 text-ink-900">{featured.title}</h2>
                  <p className="web-subtitle mt-4 max-w-[60ch] text-web-lead text-ink-500">
                    {featured.summary}
                  </p>
                  <p className="web-numeric mt-5 flex flex-wrap gap-3 text-[13px] text-ink-400">
                    <span>{featured.date}</span>
                    <span aria-hidden="true">·</span>
                    <span>{featured.readingMinutes} min read</span>
                    <span aria-hidden="true">·</span>
                    <span>{featured.author}</span>
                  </p>
                </div>
              </Link>

              {rest.length > 0 && (
                <ul className="mb-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post) => (
                    <li key={post.slug}>
                      <Link
                        href={`/insights/${post.slug}`}
                        className="group block h-full overflow-hidden rounded-web-card border border-line transition-all duration-200 hover:-translate-y-[3px] hover:shadow-web-md"
                      >
                        <ArticlePanel post={post} ratio="aspect-[16/9]" rounded={false} />
                        <div className="p-6">
                          <span className="web-numeric inline-flex rounded-web-full border border-line px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-ink-500">
                            {post.category}
                          </span>
                          <h3 className="web-title-card mt-3.5 text-[23px] leading-snug text-ink-900">
                            {post.title}
                          </h3>
                          <p className="mt-3 text-[14.5px] leading-relaxed text-ink-500">
                            {post.summary}
                          </p>
                          <p className="web-numeric mt-4 flex gap-2.5 text-xs text-ink-400">
                            <span>{post.date}</span>
                            <span aria-hidden="true">·</span>
                            <span>{post.readingMinutes} min</span>
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <div className="mb-14 rounded-web-card border border-line bg-surface-1 p-8 sm:p-12">
              <h2 className="web-title text-web-h2 text-ink-900">
                {active ? `Nothing under ${active} yet.` : "Nothing published yet."}
              </h2>
              <p className="web-prose mt-4 max-w-[68ch] text-ink-500">
                We are writing the first pieces now: what a management agreement should say, what a
                two bedroom in Kilimani costs and why, and how to check a title before you pay a
                deposit. They appear here when they are worth reading, and not before.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {active && (
                  <WebButtonLink href="/insights" variant="outline" size="md">
                    All articles
                  </WebButtonLink>
                )}
                <WebButtonLink href="/landlords" variant="primary" size="md">
                  For property owners
                </WebButtonLink>
                <WebButtonLink href="/locations" variant="outline" size="md">
                  What areas cost
                </WebButtonLink>
              </div>
            </div>
          )}

          <div className="grid items-center gap-10 rounded-web-panel border border-line bg-surface-1 p-10 lg:grid-cols-2">
            <div>
              <h2 className="web-title text-[28px] leading-tight text-ink-900">
                {INSIGHTS_NEWSLETTER.title}
              </h2>
              <p className="mt-3 max-w-[52ch] text-[15.5px] leading-relaxed text-ink-500">
                {INSIGHTS_NEWSLETTER.body}
              </p>
            </div>
            <NewsletterForm />
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
        "web-numeric web-hit inline-flex rounded-web-full px-4 py-1.5 text-[11.5px] tracking-[0.08em] transition-colors",
        active
          ? "bg-brand-dark text-on-dark-hi"
          : "border border-line-strong text-ink-500 hover:border-ink-900"
      )}
    >
      {children}
    </Link>
  );
}

/**
 * Article artwork.
 *
 * The design places a photograph. We have none for these pieces, and the
 * branded panel is the established answer everywhere else on this site, so it
 * is the answer here too rather than a stock photograph of a stranger signing
 * something.
 *
 * TODO(W5-11): `web_posts.heroMediaId`, with alt text required before publish.
 */
function ArticlePanel({
  post,
  ratio,
  rounded = true,
}: {
  post: InsightPost;
  ratio: string;
  rounded?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex items-center justify-center bg-surface-2",
        ratio,
        rounded && "rounded-web-panel"
      )}
    >
      <span className="web-title-light text-[64px] leading-none text-brand-dark/15">
        {post.category.charAt(0)}
      </span>
    </div>
  );
}
