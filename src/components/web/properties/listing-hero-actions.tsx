"use client";

import { useState, useTransition } from "react";
import { toggleSavedListing } from "@/lib/actions/web/saved-listings";
import { cn } from "@/lib/utils/cn";
import { WEB_ICON_STROKE, webIcons } from "../icons";

/**
 * Share, save and print for a listing.
 *
 * Save is the only public write path that needs a session. The control is
 * optimistic — the heart fills the moment it is pressed, because waiting on a
 * round trip to acknowledge a bookmark feels broken — but the optimism is
 * reverted if the server disagrees, so the icon never lies about what was
 * stored.
 *
 * An anonymous visitor pressing save is not an error. The action says "sign in
 * to save listings" and that message is shown beside the control, which is
 * more useful than a silent no-op or a thrown 401.
 */
export function ListingHeroActions({
  propertyId,
  title,
  reference,
}: {
  /** Null when the caller has no row id — the control then stays hidden. */
  propertyId: string | null;
  title: string;
  reference: string;
}) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();

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
    if (!propertyId || isSaving) return;

    // Flip first, reconcile after. The server is the authority on what was
    // actually stored, so a refusal puts the icon back where it was rather
    // than leaving a filled heart over a row that does not exist.
    const optimistic = !saved;
    setSaved(optimistic);
    setSaveNotice(null);

    startSaving(async () => {
      const result = await toggleSavedListing(propertyId);
      if (result.ok) {
        setSaved(result.data?.saved ?? optimistic);
        return;
      }
      setSaved(!optimistic);
      setSaveNotice(result.message);
    });
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

      {/* Save Button — only where there is a property row to save. */}
      {propertyId && (
      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving}
        aria-disabled={isSaving}
        aria-pressed={saved}
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
      )}

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

      {/* Shown beside the control that caused it. A toast would put this
          message somewhere other than the thing the visitor just pressed. */}
      {propertyId && saveNotice && (
        <span role="status" className="font-mono text-web-nano text-slate-300">
          {saveNotice}
        </span>
      )}
    </div>
  );
}
