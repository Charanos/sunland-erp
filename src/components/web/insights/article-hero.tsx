"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { DUR, registerWebMotion, splitLines, STAGGER } from "@/lib/motion/web-motion";
import { Breadcrumbs } from "@/components/web/primitives/breadcrumbs";
import { InsightPost, getAuthorAvatar } from "@/components/web/constants/insights.content";

export function ArticleHero({ post }: { post: InsightPost }) {
  const headerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const leadRef = useRef<HTMLParagraphElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const breadcrumbRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerWebMotion();
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "sun.rise", clearProps: "opacity,transform" },
        });

        // ── Scene
        tl.from(".ah-bg", {
          scale: 1.12,
          opacity: 0,
          duration: DUR.scene,
          ease: "sun.settle",
        });

        tl.from(".ah-scrim", { opacity: 0, duration: DUR.panel, ease: "sun.settle" }, "<0.25");

        // ── Breadcrumbs & Tag
        if (breadcrumbRef.current) {
          tl.from(
            breadcrumbRef.current.children,
            { opacity: 0, y: 10, duration: DUR.base, stagger: 0.1 },
            0.32
          );
        }

        // ── Headline
        if (headlineRef.current) {
          splitLines(headlineRef.current, (self) =>
            tl.from(
              self.words,
              {
                yPercent: 115,
                rotate: 2,
                opacity: 0,
                duration: DUR.base * 1.2,
                stagger: STAGGER.words,
                ease: "sun.rise",
              },
              "<0.08"
            )
          );
        }

        // ── Lead
        if (leadRef.current) {
          splitLines(leadRef.current, (self) =>
            tl.from(
              self.lines,
              {
                yPercent: 100,
                opacity: 0,
                duration: DUR.base,
                stagger: STAGGER.tight,
              },
              "<0.28"
            )
          );
        }

        // ── Meta Footer
        if (metaRef.current) {
          tl.from(
            metaRef.current.children,
            { opacity: 0, y: 10, duration: DUR.base, stagger: 0.1 },
            "<0.2"
          );
        }
      });

      // ── Desktop parallax
      media.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const header = headerRef.current;
        const image = header?.querySelector<HTMLElement>(".ah-bg-media");
        if (!header || !image) return;

        const quickY = gsap.quickTo(image, "yPercent", { duration: 0.45, ease: "none" });
        const quickScaleX = gsap.quickTo(image, "scaleX", { duration: 0.45, ease: "none" });
        const quickScaleY = gsap.quickTo(image, "scaleY", { duration: 0.45, ease: "none" });

        let frame = 0;
        const update = () => {
          frame = 0;
          const height = header.offsetHeight || 1;
          const progress = Math.min(Math.max(-header.getBoundingClientRect().top / height, 0), 1);
          const scale = 1 + progress * 0.05;
          quickY(progress * 16);
          quickScaleX(scale);
          quickScaleY(scale);
        };

        const onScroll = () => {
          if (frame === 0) frame = requestAnimationFrame(update);
        };

        update();
        window.addEventListener("scroll", onScroll, { passive: true });

        return () => {
          window.removeEventListener("scroll", onScroll);
          if (frame) cancelAnimationFrame(frame);
          gsap.set(image, { clearProps: "yPercent,scaleX,scaleY" });
        };
      });

      return () => media.revert();
    },
    { scope: headerRef }
  );

  const authorAvatar = getAuthorAvatar(post.author);

  return (
    <header
      ref={headerRef}
      className="web-dark relative z-10 flex min-h-[60svh] sm:min-h-[65svh] flex-col justify-end overflow-hidden bg-[#090d1f] pt-32 sm:pt-36 lg:pt-54 pb-16 sm:pb-20 text-white"
    >
      {/* Background Photography with Refined Scrims */}
      <div className="ah-bg pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#090d1f]">
        <Image
          src={
            post.imageUrl ??
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
          }
          alt={post.title}
          fill
          priority
          quality={100}
          className="ah-bg-media object-cover object-center opacity-80"
        />
        {/* Layered atmospheric scrims matching Areas page hero, placed at top */}
        <div
          aria-hidden="true"
          className="ah-scrim absolute inset-0 bg-gradient-to-b from-black/50 via-transparent via-35% to-transparent"
        />
        <div
          aria-hidden="true"
          className="ah-scrim absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 via-55% to-transparent"
        />
        <div
          aria-hidden="true"
          className="ah-scrim absolute inset-0 bg-gradient-to-b from-[#090d1f] via-[#090d1f]/40 to-transparent"
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[980px] flex-col justify-end px-5 sm:px-8">
        <div ref={breadcrumbRef} className="mb-8 flex flex-wrap items-center justify-between gap-3">
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
          className="font-editorial text-3xl sm:text-4xl lg:text-[46px] font-medium leading-[1.12] tracking-tight text-white"
        >
          {post.title}
        </h1>

        <p
          ref={leadRef}
          className="mt-5 text-base sm:text-lg leading-relaxed text-slate-200/90 font-normal"
        >
          {post.summary}
        </p>

        <div ref={metaRef} className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-6">
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
