"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { SITE } from "../constants/site";
import { WEB_ICON_STROKE, webIcons } from "../icons";

/**
 * The persistent contact control, bottom right.
 *
 * Hidden over the hero, where the search panel and the header phone number
 * already carry the intent, and revealed once the visitor has scrolled past
 * roughly 80% of the first screen. A floating button competing with the fold
 * is clutter; the same button four screens down is the shortest path to a
 * conversation.
 *
 * Phone first, WhatsApp second: this market converts on a call, which is also
 * why the enquiry form treats phone as required and email as optional.
 */
export function FloatingContact() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const PhoneIcon = webIcons.phone;
  const ChatIcon = webIcons.chat;

  return (
    <div
      // Hidden from assistive technology entirely: both actions already exist
      // in the header and the footer, and a screen reader user does not need
      // the same phone number announced a third time from a floating region.
      aria-hidden="true"
      className={cn(
        "fixed bottom-4 right-4 z-float flex flex-col items-end gap-2.5 sm:bottom-8 sm:right-8",
        "transition-all duration-200 ease-out",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      )}
    >
      <a
        href={SITE.whatsappHref}
        target="_blank"
        rel="noreferrer"
        tabIndex={-1}
        className="web-control inline-flex items-center gap-2 rounded-web-full border border-line bg-surface-0 px-4 py-2.5 text-[11px] uppercase tracking-[0.12em] text-ink-900 shadow-web-md transition-colors hover:bg-surface-1"
      >
        <ChatIcon size={16} stroke={WEB_ICON_STROKE} />
        WhatsApp us
      </a>
      <a
        href={SITE.phoneHref}
        tabIndex={-1}
        className="web-numeric inline-flex items-center gap-2 rounded-web-full bg-brand-dark px-5 py-3 text-sm text-on-dark-hi shadow-web-lg transition-colors hover:bg-ink-700"
      >
        <PhoneIcon size={16} stroke={WEB_ICON_STROKE} />
        {SITE.phone}
      </a>
    </div>
  );
}
