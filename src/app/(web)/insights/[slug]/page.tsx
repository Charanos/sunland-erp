import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  findPost,
  publishedPosts,
  type InsightPost,
  getAuthorAvatar,
} from "@/components/web/constants/insights.content";
import { WEB_ICON_STROKE, webIcons } from "@/components/web/icons";
import { WebButtonLink } from "@/components/web/primitives/button";
import { Container } from "@/components/web/primitives/container";
import { ArticleHero } from "@/components/web/insights/article-hero";
import { ArticleInteractiveTools } from "@/components/web/insights/article-interactive-tools";
import { ArticleBodyBlocks } from "@/components/web/insights/article-body-blocks";
import { WebMediaBadge } from "@/components/web/primitives/badge";

export const revalidate = 3600;

export function generateStaticParams() {
  return publishedPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) return { title: "Article not found" };

  return {
    title: `${post.title} | Sunland Insights`,
    description: post.summary,
    authors: [{ name: post.author }],
  };
}

export default async function InsightArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) notFound();

  const readNext = publishedPosts()
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3);

  const ArrowRightIcon = webIcons.arrow;
  const CheckIcon = webIcons.check;

  return (
    <>
      <article>
        {/* ── 01. Cinematic Article Hero ── */}
        <ArticleHero post={post} />

        {/* ── 02. Interactive Article Body & Reading Utility ── */}
        <div className="bg-surface-0 px-5 pb-24 pt-12 sm:pt-16 sm:px-8 lg:px-14 border-t border-line">
          <div className="mx-auto w-full max-w-[980px]">
            {/* Reading Toolbar & Quick Table of Contents */}
            <ArticleInteractiveTools post={post} />

            {/* High-End Block Renderer (Lead, Quotes, Compare Matrix, Checklists & Data Models) */}
            <ArticleBodyBlocks blocks={post.body ?? []} slug={post.slug} />

            {/* ── 03. Author & Practitioner Authority Spotlight (Uncarded Editorial Strip) ── */}
            <div className="mt-16 pt-8 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                {getAuthorAvatar(post.author) ? (
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-full border border-line shadow-sm">
                    <Image
                      src={getAuthorAvatar(post.author)!}
                      alt={post.author}
                      fill
                      sizes="56px"
                      className="object-cover object-center"
                    />
                  </div>
                ) : (
                  <span
                    aria-hidden="true"
                    className="font-mono flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-dark text-sm font-medium text-white shadow-sm"
                  >
                    {post.author
                      .split(" ")
                      .map((part) => part.charAt(0))
                      .join("")}
                  </span>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-editorial text-base sm:text-lg font-medium text-ink-900">
                      {post.author}
                    </p>
                    <span className="rounded-full bg-surface-1 border border-line px-2.5 py-0.5 font-mono text-web-nano font-medium text-slate-700">
                      Advisory Author
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 max-w-[44ch]">
                    Specializing in institutional property asset management, leases, and contract due diligence across Nairobi.
                  </p>
                </div>
              </div>

              <WebButtonLink
                href="/contact"
                variant="outline"
                size="sm"
                icon="chat"
                iconTrailing
                className="shrink-0"
              >
                Request Consultation
              </WebButtonLink>
            </div>

            {/* ── 04. Executive Consultation & Action Callout ── */}
            {post.cta && (
              <div className="mt-12 rounded-3xl border border-slate-800 bg-gradient-to-br from-brand-dark via-[#10132c] to-brand-deep p-8 sm:p-12 text-white shadow-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <span aria-hidden="true" className="h-px w-5 bg-brand-yellow" />
                  <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-300 font-medium">
                    Direct Practitioner Advisory
                  </p>
                </div>

                <h2 className="font-editorial text-2xl sm:text-3xl lg:text-[34px] font-medium leading-tight text-white">
                  {post.cta.title}
                </h2>
                <p className="mt-4 max-w-[62ch] text-web-sm sm:text-base leading-relaxed text-slate-300 font-normal">
                  {post.cta.body}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-white/10 pt-6">
                  <WebButtonLink href={post.cta.primary.href} variant="primary" size="md">
                    {post.cta.primary.label}
                  </WebButtonLink>

                  <WebButtonLink
                    href="/contact"
                    variant="outline"
                    size="md"
                    icon="arrow"
                    iconTrailing
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    Contact Advisory Team
                  </WebButtonLink>

                  <div className="ml-auto flex items-center gap-2 text-xs font-mono text-slate-400">
                    <CheckIcon size={14} stroke={WEB_ICON_STROKE} className="text-emerald-400" />
                    <span>Confidential & Independent</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* ── 05. Overhauled High-Fidelity "Read Next" Showcase ── */}
      {readNext.length > 0 && (
        <section aria-labelledby="read-next-heading" className="bg-surface-1 py-20 lg:py-24 border-t border-line">
          <Container>
            <div className="flex items-center justify-between pb-5 border-b border-line-soft mb-10">
              <div className="flex items-center gap-2.5">
                <span aria-hidden="true" className="h-px w-5 bg-brand-yellow" />
                <h2 id="read-next-heading" className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500 font-medium">
                  Related Research & Advisories
                </h2>
              </div>
              <Link
                href="/insights"
                className="web-hit font-mono text-xs text-slate-500 hover:text-ink-900 transition-colors inline-flex items-center gap-1"
              >
                <span>View All Research</span>
                <ArrowRightIcon size={12} stroke={2} />
              </Link>
            </div>

            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {readNext.map((item) => (
                <li key={item.slug}>
                  <ReadNextCard post={item} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
    </>
  );
}

function ReadNextCard({ post }: { post: InsightPost }) {
  const ArrowRightIcon = webIcons.arrow;

  return (
    <article className="group relative flex h-full flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1">
      {/* Media Image Frame with Scrims & Badge */}
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
        <WebMediaBadge caps={false} dot="bg-brand-yellow" className="absolute left-3.5 top-3.5 z-10">
          {post.category}
        </WebMediaBadge>
      </div>

      {/* Content Section below photo */}
      <div className="flex flex-1 flex-col justify-between pt-4.5 pb-1">
        <div>
          <h3 className="font-editorial text-[21px] sm:text-[22px] font-medium leading-[1.2] text-ink-900 transition-colors group-hover:text-blue-950">
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
            {getAuthorAvatar(post.author) ? (
              <div className="relative size-6 shrink-0 overflow-hidden rounded-full border border-line">
                <Image
                  src={getAuthorAvatar(post.author)!}
                  alt={post.author}
                  fill
                  sizes="24px"
                  className="object-cover object-center"
                />
              </div>
            ) : null}
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
  );
}
