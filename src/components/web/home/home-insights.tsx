import Link from "next/link";
import { WebButtonLink } from "../primitives/button";
import { SectionBand } from "../primitives/section-band";
import { insightDefaults } from "./home.defaults";
import { SectionHeading } from "./section-heading";

export type InsightPost = {
  category: string;
  title: string;
  date: string;
  readingTime: string;
  slug: string;
};

/**
 * 09 home.insights, tint band.
 *
 * Hidden entirely below three published posts. An empty blog section is worse
 * than no blog section, and at launch this band will not exist at all, so the
 * sequence has to read correctly with it absent. It does: light proof, light
 * FAQ, dark close.
 *
 * Which means the default here is to render nothing. The caller passes posts
 * once `web_posts` exists (W5-11) and the band appears on its own.
 */
export function HomeInsights({ posts }: { posts: InsightPost[] }) {
  if (posts.length < 3) return null;

  return (
    <SectionBand tone="tint" labelledBy="insights-heading">
      <SectionHeading
        id="insights-heading"
        eyebrow={insightDefaults.eyebrow}
        title={insightDefaults.headline}
        action={
          <WebButtonLink href={insightDefaults.viewAllHref} variant="outline" size="md">
            {insightDefaults.viewAllLabel}
          </WebButtonLink>
        }
      />

      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 3).map((post) => (
          <li key={post.slug}>
            <Link
              href={`/insights/${post.slug}`}
              className="group flex h-full flex-col rounded-web-card border border-line bg-surface-0 p-6 transition-all duration-200 hover:-translate-y-[3px] hover:border-line-strong hover:shadow-web-md"
            >
              <span className="web-control self-start rounded-web-full bg-surface-2 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-ink-500">
                {post.category}
              </span>
              <h3 className="web-title-card mt-5 flex-1 text-web-h3 text-ink-900">{post.title}</h3>
              <p className="web-numeric mt-5 text-[13px] text-ink-400">
                <time dateTime={post.date}>{post.date}</time> · {post.readingTime}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </SectionBand>
  );
}
