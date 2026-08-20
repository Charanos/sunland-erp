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
 *
 * ── Two round FABs on a phone, full pills from sm up ──
 *
 * Both controls were full-width pills at every size. A pill wide enough to
 * hold "WhatsApp us" is wide enough to land on top of whatever card happens
 * to be scrolled underneath it, and on a single-column mobile layout
 * something always is: the whole point of a floating control is that it sits
 * over content, not beside it. A 44px circle is small enough that it reads as
 * a corner ornament rather than a bar laid across the page, and an icon is
 * enough to say "call" or "chat" without a label. The full pill, with room to
 * breathe beside the content it floats over, returns at sm.
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
        "fixed right-4 z-float flex flex-col items-end gap-2 sm:bottom-8 sm:right-8 sm:gap-2.5",
        // env(safe-area-inset-bottom) clears the home-indicator gesture bar
        // on a notched phone; bottom-4 alone sits partly under it there. The
        // calc floor keeps a sane gap on the many phones that report 0.
        "bottom-[calc(env(safe-area-inset-bottom,0px)+1rem)] sm:bottom-8",
        "transition-all duration-200 ease-out",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      )}
    >
      <a
        href={SITE.whatsappHref}
        target="_blank"
        rel="noreferrer"
        tabIndex={-1}
        className="web-control inline-flex size-11 items-center justify-center gap-2 rounded-web-full border border-line bg-surface-0 text-[11px] uppercase tracking-[0.12em] text-ink-900 shadow-web-md transition-colors hover:bg-surface-1 sm:size-auto sm:px-4 sm:py-2.5"
      >
        <ChatIcon size={17} stroke={WEB_ICON_STROKE} className="sm:hidden" />
        <ChatIcon size={16} stroke={WEB_ICON_STROKE} className="hidden sm:block" />
        {/* Both actions are aria-hidden on the wrapper (see above), so this
            is a visual label only, not an accessibility concern. */}
        <span className="hidden sm:inline">WhatsApp us</span>
      </a>
      <a
        href={SITE.phoneHref}
        tabIndex={-1}
        className="web-numeric inline-flex size-11 items-center justify-center gap-2 rounded-web-full bg-brand-dark text-sm text-on-dark-hi shadow-web-lg transition-colors hover:bg-ink-700 sm:size-auto sm:px-5 sm:py-3"
      >
        <PhoneIcon size={17} stroke={WEB_ICON_STROKE} />
        <span className="hidden sm:inline">{SITE.phone}</span>
      </a>
    </div>
  );
}
