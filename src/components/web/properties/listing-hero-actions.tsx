"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { WEB_ICON_STROKE, webIcons } from "../icons";

export function ListingHeroActions({ title, reference }: { title: string; reference: string }) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const ShareIcon = webIcons.share;
  const SaveIcon = webIcons.save;
  const PrintIcon = webIcons.print;
  const CheckIcon = webIcons.check;

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      const url = window.location.href;
      if (navigator.share) {
        try {
          await navigator.share({ title, text: `Check out ${title} on Sunland Real Estates`, url });
          return;
        } catch (e) {
          // Fall back to clipboard copy
        }
      }
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        // Fallback silently
      }
    }
  };

  const handleSave = () => {
    setSaved((prev) => !prev);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Share Button */}
      <button
        type="button"
        onClick={handleShare}
        aria-label="Share property"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-web-full border border-dark-line px-3.5 py-1.5 text-xs tracking-wider uppercase text-on-dark transition-all hover:border-on-dark hover:text-on-dark-hi hover:bg-dark-raise",
          copied && "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
        )}
      >
        {copied ? (
          <>
            <CheckIcon size={14} stroke={WEB_ICON_STROKE} aria-hidden="true" />
            <span>Link Copied</span>
          </>
        ) : (
          <>
            <ShareIcon size={14} stroke={WEB_ICON_STROKE} aria-hidden="true" />
            <span>Share</span>
          </>
        )}
      </button>

      {/* Save Button */}
      <button
        type="button"
        onClick={handleSave}
        aria-label={saved ? "Remove from saved" : "Save property"}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-web-full border border-dark-line px-3.5 py-1.5 text-xs tracking-wider uppercase text-on-dark transition-all hover:border-on-dark hover:text-on-dark-hi hover:bg-dark-raise",
          saved && "border-rose-500/50 bg-rose-500/15 text-rose-400"
        )}
      >
        <SaveIcon
          size={14}
          stroke={WEB_ICON_STROKE}
          aria-hidden="true"
          className={cn(saved && "fill-rose-400 text-rose-400")}
        />
        <span>{saved ? "Saved" : "Save"}</span>
      </button>

      {/* Print Button */}
      <button
        type="button"
        onClick={handlePrint}
        aria-label="Print property brochure"
        className="hidden sm:inline-flex items-center gap-1.5 rounded-web-full border border-dark-line px-3.5 py-1.5 text-xs tracking-wider uppercase text-on-dark transition-all hover:border-on-dark hover:text-on-dark-hi hover:bg-dark-raise"
      >
        <PrintIcon size={14} stroke={WEB_ICON_STROKE} aria-hidden="true" />
        <span>Print</span>
      </button>
    </div>
  );
}
