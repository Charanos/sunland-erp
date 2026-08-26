import Image from "next/image";
import Link from "next/link";
import { getAuthorAvatar } from "../constants/people";
import { SectionBand } from "../primitives/section-band";
import { SectionHeading } from "./section-heading";
import { WEB_ICON_STROKE, webIcons } from "../icons";
import { WebMediaBadge } from "../primitives/badge";

export type InsightPost = {
  category: string;
  title: string;
  summary?: string;
  date: string;
  readingTime: string;
  slug: string;
  /** Byline. Resolves to a portrait through the shared roster. */
  author?: string;
  imageUrl?: string;
};

/**
 * 09 — Home Insights & Advisory Previews.
 *
 * Uncarded editorial layout matching the insights directory:
 * - High-impact section heading with advisory lead copy and direct "All 7 Insights" action.
 * - 3 Uncarded featured articles with 16:10 photography, category badges,
 *   substantive advisory summary, author avatar, reading time, and interactive arrow affordance.
 */
export function HomeInsights({ posts }: { posts: InsightPost[] }) {
  if (posts.length < 3) return null;

  const ArrowRightIcon = webIcons.arrow;
  const DocIcon = webIcons.doc;

  return (
    <SectionBand tone="tint" labelledBy="insights-heading" className="py-20 sm:py-24 lg:py-28">
      <SectionHeading
        id="insights-heading"
        eyebrow="Market Intelligence"
        title="Field guidance on leases, titles & true costs"
        lead="Direct analysis on lease terms, title registry checks, service charge auditing, and realistic submarket yields across Nairobi."
        align="split-right"
        action={
          <Link
            href="/insights"
            className="group inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface-0 px-5 py-2.5 font-mono text-web-micro uppercase tracking-[0.14em] text-ink-900 shadow-xs transition-all duration-200 hover:bg-brand-dark hover:text-white hover:border-ink-900 hover:shadow-md cursor-pointer"
          >
            <DocIcon size={14} stroke={WEB_ICON_STROKE} />
            <span>All 7 Articles</span>
            <ArrowRightIcon
              size={13}
              stroke={WEB_ICON_STROKE}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        }
      />

      <ul className="mt-10 sm:mt-12 grid gap-8 sm:gap-10 sm:grid-cols-2 lg:grid-cols-3" data-reveal-group>
        {posts.slice(0, 3).map((post) => {
          const avatarUrl = post.author ? getAuthorAvatar(post.author) : undefined;

          return (
            <li key={post.slug}>
              <article className="group relative flex h-full flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1">
                {/* Media Image Frame (Clean 16:10 Ratio) */}
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-900 shadow-2xs transition-shadow duration-300 group-hover:shadow-md">
                  {post.imageUrl && (
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  )}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent"
                  />
                  <WebMediaBadge caps={false} className="absolute left-3.5 top-3.5 z-10">
                    {post.category}
                  </WebMediaBadge>
                </div>

                {/* Uncarded Content Section below photo */}
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

                    {post.summary && (
                      <p className="mt-2.5 text-web-xs leading-relaxed text-slate-600 font-normal line-clamp-2">
                        {post.summary}
                      </p>
                    )}
                  </div>

                  {/* Author & Telemetry Footer */}
                  <div className="mt-5 border-t border-slate-200/80 pt-3.5 flex items-center justify-between font-mono text-xs text-slate-500">
                    <div className="flex items-center gap-2.5">
                      {avatarUrl && (
                        <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-line bg-surface-2 shadow-xs">
                          <Image
                            src={avatarUrl}
                            alt={post.author ?? ""}
                            fill
                            sizes="40px"
                            className="object-cover object-top"
                          />
                        </div>
                      )}
                      <span className="font-medium text-ink-900">{post.author}</span>
                      <span>·</span>
                      <span>{post.readingTime}</span>
                    </div>

                    <div className="flex size-8 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-600 shadow-2xs transition-all duration-300 group-hover:translate-x-0.5 group-hover:border-ink-900 group-hover:bg-brand-dark group-hover:text-white">
                      <ArrowRightIcon size={13} stroke={2} aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </SectionBand>
  );
}
