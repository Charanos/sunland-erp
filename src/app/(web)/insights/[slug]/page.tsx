import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  findPost,
  publishedPosts,
  type ArticleBlock,
  type InsightPost,
} from "@/components/web/constants/insights.content";
import { WEB_ICON_STROKE, webIcons } from "@/components/web/icons";
import { Breadcrumbs } from "@/components/web/primitives/breadcrumbs";
import { WebButtonLink } from "@/components/web/primitives/button";
import { Container } from "@/components/web/primitives/container";

export const revalidate = 3600;

/** Only written articles have routes. An unwritten slug is a genuine 404. */
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

/**
 * An insight article.
 *
 * A 760px measure, prose at 17px on a 1.8 line height, and every figure in
 * mono. The body is a block union rather than raw HTML, so the measure, the
 * heading scale and the checklist treatment are applied by the template and
 * cannot be broken by whoever writes the next one.
 *
 * Every article ends with a call to action matched to its subject, per doc 04
 * §9: a landlord piece closes on management, a tenant piece would close on
 * listings.
 *
 * TODO(W5-3): emit Article structured data with author, datePublished and
 * dateModified from these same fields.
 */
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

  return (
    <>
      <article>
        <header className="web-dark px-5 pb-16 pt-8 sm:px-8 lg:px-14">
          <div className="mx-auto w-full max-w-[760px]">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Insights", href: "/insights" },
                { label: post.crumb },
              ]}
              className="mb-8"
            />

            <span className="web-numeric inline-flex rounded-web-full border border-dark-line px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-on-dark">
              {post.category}
            </span>

            <h1 className="web-title mt-5 text-[clamp(2.125rem,1.5rem+3vw,3.25rem)] leading-[1.08] tracking-[-0.015em] text-on-dark-hi">
              {post.title}
            </h1>
            <p className="mt-5 text-web-lead leading-relaxed text-on-dark">{post.summary}</p>

            <div className="mt-7 flex flex-wrap items-center gap-4 border-t border-dark-line pt-6">
              <span
                aria-hidden="true"
                className="web-numeric flex size-11 shrink-0 items-center justify-center rounded-web-full bg-dark-raise text-sm text-on-dark-hi"
              >
                {post.author
                  .split(" ")
                  .map((part) => part.charAt(0))
                  .join("")}
              </span>
              <div>
                <p className="text-[14.5px] text-on-dark-hi">{post.author}</p>
                <p className="web-numeric text-[12.5px] text-on-dark-lo">
                  <time dateTime={post.date}>{post.date}</time> · {post.readingMinutes} min read
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="bg-surface-0 px-5 pb-24 pt-16 sm:px-8 lg:px-14">
          <div className="mx-auto w-full max-w-[760px]">
            {post.body?.map((block, index) => (
              <Block key={`${block.kind}-${index}`} block={block} />
            ))}

            <p className="web-prose mt-6 text-ink-500">
              Read{" "}
              <Link
                href="/landlords#how"
                className="border-b border-line-strong text-ink-900 transition-colors hover:border-ink-900"
              >
                how our own management works
              </Link>{" "}
              next.
            </p>

            {post.cta && (
              <div className="mt-12 rounded-web-panel border border-line bg-surface-1 p-8">
                <h2 className="web-title text-[26px] leading-tight text-ink-900">
                  {post.cta.title}
                </h2>
                <p className="mt-3 max-w-[56ch] text-[15.5px] leading-relaxed text-ink-500">
                  {post.cta.body}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <WebButtonLink href={post.cta.primary.href} variant="primary" size="md">
                    {post.cta.primary.label}
                  </WebButtonLink>
                  <WebButtonLink
                    href="/contact"
                    variant="outline"
                    size="md"
                    icon="arrow"
                    iconTrailing
                  >
                    Contact us
                  </WebButtonLink>
                </div>
              </div>
            )}
          </div>
        </div>
      </article>

      {readNext.length > 0 && (
        <section aria-labelledby="read-next-heading" className="bg-surface-1 py-20 lg:py-24">
          <Container>
            <h2 id="read-next-heading" className="web-title text-web-h2 text-ink-900">
              Read next
            </h2>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

function Block({ block }: { block: ArticleBlock }) {
  const CheckIcon = webIcons.check;

  switch (block.kind) {
    case "lead":
      return <p className="mb-6 text-[19px] leading-[1.65] text-ink-900">{block.text}</p>;

    case "p":
      return <p className="mb-6 text-[17px] leading-[1.8] text-ink-500">{block.text}</p>;

    case "h2":
      return (
        <h2 className="web-title mb-4 mt-12 text-[30px] leading-tight text-ink-900">
          {block.text}
        </h2>
      );

    case "quote":
      return (
        <blockquote className="mb-6 rounded-r-web-card border-l-2 border-brand-yellow bg-surface-1 px-6 py-5">
          <p className="text-[16.5px] leading-[1.75] text-ink-900">{block.text}</p>
        </blockquote>
      );

    case "compare":
      return (
        <div className="mb-5 overflow-hidden rounded-web-card border border-line">
          {block.items.map((item, index) => (
            <div
              key={item.title}
              className={index > 0 ? "border-t border-line-soft px-6 py-4.5" : "px-6 py-4.5"}
            >
              <p className="web-subtitle text-[15.5px] text-ink-900">{item.title}</p>
              <p className="mt-1.5 text-[14.5px] leading-[1.7] text-ink-500">{item.body}</p>
            </div>
          ))}
        </div>
      );

    case "checklist":
      return (
        <ul className="mb-8">
          {block.items.map((item) => (
            <li
              key={item}
              className="flex gap-3.5 border-t border-line-soft py-3.5 last:border-b"
            >
              <CheckIcon
                size={18}
                stroke={WEB_ICON_STROKE}
                aria-hidden="true"
                className="mt-1 shrink-0 text-ink-900"
              />
              <span className="text-base leading-[1.7] text-ink-500">{item}</span>
            </li>
          ))}
        </ul>
      );
  }
}

function ReadNextCard({ post }: { post: InsightPost }) {
  return (
    <Link
      href={`/insights/${post.slug}`}
      className="block h-full overflow-hidden rounded-web-card border border-line bg-surface-0 transition-all duration-200 hover:-translate-y-[3px] hover:shadow-web-md"
    >
      <div
        aria-hidden="true"
        className="flex aspect-[16/9] items-center justify-center bg-surface-2"
      >
        <span className="web-title-light text-[56px] leading-none text-brand-dark/15">
          {post.category.charAt(0)}
        </span>
      </div>
      <div className="p-5">
        <p className="web-numeric text-xs text-ink-400">
          <time dateTime={post.date}>{post.date}</time> · {post.readingMinutes} min
        </p>
        <p className="web-title-card mt-2.5 text-[22px] leading-snug text-ink-900">{post.title}</p>
      </div>
    </Link>
  );
}
