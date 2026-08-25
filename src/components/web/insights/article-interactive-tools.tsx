"use client";

import { useEffect, useState } from "react";
import { WEB_ICON_STROKE, webIcons } from "@/components/web/icons";
import { InsightPost } from "@/components/web/constants/insights.content";

export function ArticleInteractiveTools({ post }: { post: InsightPost }) {
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [saved, setSaved] = useState(false);

  const CheckIcon = webIcons.check;
  const ShareIcon = webIcons.share;
  const SaveIcon = webIcons.save;
  const PrintIcon = webIcons.print;
  const ChatIcon = webIcons.chat;

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleWhatsApp = () => {
    if (typeof window !== "undefined") {
      const text = encodeURIComponent(`Check out this advisory on Sunland: "${post.title}"\n${window.location.href}`);
      window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
    }
  };

  const headings = post.body?.filter((b) => b.kind === "h2") as { kind: "h2"; text: string }[] || [];

  return (
    <>
      {/* ── 01. Top Reading Scroll Progress Bar ── */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-black/5"
      >
        <div
          className="h-full bg-emerald-500 transition-all duration-150 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
          style={{ width: `${Math.min(100, Math.max(0, scrollProgress * 100))}%` }}
        />
      </div>

      {/* ── 02. Minimal Editorial Reading Toolbar (Uncarded & Clean) ── */}
      <aside className="mb-10 sm:mb-12 pb-6 border-b border-line">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left: Metadata Quick Telemetry */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-1 px-3 py-1 text-[#151936] font-medium border border-line">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Verified Advisory
            </span>
            <span>·</span>
            <span>{post.readingMinutes} min read</span>
            <span>·</span>
            <span>Published {post.date}</span>
          </div>

          {/* Right: Quick Action Controls */}
          <div className="flex items-center gap-2">
            {/* Copy Link Button with dynamic feedback */}
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-0 px-3.5 py-1.5 text-xs font-mono text-slate-700 hover:text-[#151936] hover:border-slate-400 hover:bg-surface-1 transition-all shadow-2xs cursor-pointer active:scale-95"
              aria-label="Copy article link"
            >
              {copied ? (
                <>
                  <CheckIcon size={13} stroke={2} className="text-emerald-600" />
                  <span className="text-emerald-600 font-medium">Link Copied!</span>
                </>
              ) : (
                <>
                  <ShareIcon size={13} stroke={WEB_ICON_STROKE} />
                  <span>Share</span>
                </>
              )}
            </button>

            {/* WhatsApp Share */}
            <button
              type="button"
              onClick={handleWhatsApp}
              className="inline-flex items-center justify-center size-8 rounded-full border border-line bg-surface-0 text-slate-700 hover:text-emerald-600 hover:border-emerald-300 hover:bg-surface-1 transition-all shadow-2xs cursor-pointer"
              title="Share via WhatsApp"
              aria-label="Share via WhatsApp"
            >
              <ChatIcon size={14} stroke={WEB_ICON_STROKE} />
            </button>

            {/* Print / Save PDF */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center justify-center size-8 rounded-full border border-line bg-surface-0 text-slate-700 hover:text-[#151936] hover:border-slate-400 hover:bg-surface-1 transition-all shadow-2xs cursor-pointer"
              title="Print / Save PDF"
              aria-label="Print or save as PDF"
            >
              <PrintIcon size={14} stroke={WEB_ICON_STROKE} />
            </button>

            {/* Bookmark */}
            <button
              type="button"
              onClick={() => setSaved(!saved)}
              className={`inline-flex items-center justify-center size-8 rounded-full border transition-all shadow-2xs cursor-pointer ${
                saved
                  ? "bg-rose-50 border-rose-200 text-rose-600"
                  : "bg-surface-0 border-line text-slate-700 hover:text-rose-600 hover:border-rose-200 hover:bg-surface-1"
              }`}
              title={saved ? "Saved to reading list" : "Save for later"}
              aria-label={saved ? "Saved" : "Save"}
            >
              <SaveIcon size={14} stroke={WEB_ICON_STROKE} className={saved ? "fill-rose-600" : ""} />
            </button>
          </div>
        </div>

        {/* Section Fast-Links (Table of Contents pill navigation) */}
        {headings.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-slate-400 mr-1">
              Table of Contents:
            </span>
            {headings.map((h, i) => {
              const anchor = `section-${i + 1}`;
              return (
                <a
                  key={h.text}
                  href={`#${anchor}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-0 px-3 py-1 font-mono text-[11px] text-slate-600 hover:text-[#151936] hover:border-slate-400 transition-all hover:bg-surface-1"
                >
                  <span className="text-[10px] text-slate-900 font-bold">0{i + 1}</span>
                  <span className="line-clamp-1 max-w-[22ch]">
                    {h.text.replace(/^\d+\.\s*/, "")}
                  </span>
                </a>
              );
            })}
          </div>
        )}
      </aside>
    </>
  );
}
