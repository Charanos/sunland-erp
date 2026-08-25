"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useHeroMotion } from "@/lib/motion/use-hero-motion";
import { Breadcrumbs } from "@/components/web/primitives/breadcrumbs";
import { InsightPost, getAuthorAvatar } from "@/components/web/constants/insights.content";

/**
 * The article hero, sharing `useHeroMotion` with the five directory heroes.
 *
 * An article page is where a visitor arrives from search rather than from the
 * home page, so it is the hero most likely to be someone's first impression of
 * the site. It has no business being the one running its own private copy of
 * the choreography.
 */
export function ArticleHero({ post }: { post: InsightPost }) {
  const headerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);

  const authorAvatar = getAuthorAvatar(post.author);

  useHeroMotion({ scopeRef: headerRef, headlineRef, leadRef });

  return (
    <header
      ref={headerRef}
      className="web-dark relative z-10 flex min-h-[60svh] sm:min-h-[65svh] flex-col justify-end overflow-hidden bg-[#090d1f] pt-32 sm:pt-36 lg:pt-54 pb-16 sm:pb-20 text-white"
    >
      {/* Background Photography with Refined Scrims */}
      <div className="hero-bg gsap-enter pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#090d1f]">
        <Image
          src={
            post.imageUrl ??
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
          }
          alt={post.title}
          fill
          priority
          sizes="100vw"
          quality={90}
          className="hero-bg-media object-cover object-center opacity-80"
        />
        {/* Layered atmospheric scrims matching Areas page hero, placed at top */}
        <div
          aria-hidden="true"
          className="hero-scrim absolute inset-0 bg-gradient-to-b from-black/50 via-transparent via-35% to-transparent"
        />
        <div
          aria-hidden="true"
          className="hero-scrim absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 via-55% to-transparent"
        />
        <div
          aria-hidden="true"
          className="hero-scrim absolute inset-0 bg-gradient-to-b from-[#090d1f] via-[#090d1f]/40 to-transparent"
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[980px] flex-col justify-end px-5 sm:px-8">
        <div className="hero-crumb-text gsap-enter mb-8 flex flex-wrap items-center justify-between gap-3">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Insights", href: "/insights" },
              { label: post.crumb },
            ]}
            className="text-slate-300 opacity-90"
          />

          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-mono text-white/90 backdrop-blur-md">
            <span className="size-1.5 rounded-full bg-brand-yellow" />
            <span>{post.category} · Whitepaper</span>
          </div>
        </div>

        <h1
          ref={headlineRef}
          className="font-editorial gsap-enter text-3xl sm:text-4xl lg:text-[46px] font-medium leading-[1.12] tracking-tight text-white"
        >
          {post.title}
        </h1>

        <p
          ref={leadRef}
          className="gsap-enter mt-5 text-base sm:text-lg leading-relaxed text-slate-200/90 font-normal"
        >
          {post.summary}
        </p>

        <div className="hero-detail gsap-enter mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-6">
          <div className="flex items-center gap-3">
            {authorAvatar ? (
              <div className="relative size-11 shrink-0 overflow-hidden rounded-full border border-white/20 shadow-xs">
                <Image
                  src={authorAvatar}
                  alt={post.author}
                  fill
                  sizes="44px"
                  className="object-cover object-center"
                />
              </div>
            ) : (
              <span
                aria-hidden="true"
                className="font-mono flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 border border-white/20 text-xs font-medium text-white shadow-xs"
              >
                {post.author
                  .split(" ")
                  .map((part) => part.charAt(0))
                  .join("")}
              </span>
            )}
            <div>
              <p className="text-sm font-medium text-white">{post.author}</p>
              <p className="font-mono text-xs text-slate-400">
                <time dateTime={post.date}>{post.date}</time> · {post.readingMinutes} min read
              </p>
            </div>
          </div>

          <Link
            href="/insights"
            className="font-mono text-xs text-slate-300 hover:text-brand-yellow transition-colors inline-flex items-center gap-1.5"
          >
            <span>← All Research</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
