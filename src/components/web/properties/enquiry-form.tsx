"use client";

import { useId, useState } from "react";
import { SITE } from "../constants/site";
import { WEB_ICON_STROKE, webIcons } from "../icons";
import { viewingMessage, whatsappLink } from "../constants/whatsapp";

/**
 * The listing enquiry form.
 *
 * Phone is required and email is optional, which is the opposite of the usual
 * default and is correct for this market: a Kenyan property enquiry converts
 * on a call, and demanding an email address costs more enquiries than it
 * captures.
 *
 * Anti-spam is a honeypot plus a timing check, never a CAPTCHA. A CAPTCHA on
 * a property enquiry costs more conversions than the spam it stops, and the
 * spam it stops is handled by a person in thirty seconds.
 *
 * TODO(W4-1): POST to the enquiry endpoint. The pipeline is specified in web
 * doc 07 §6.1 and its ordering is the point: `web_form_submissions` is
 * written first, before the contact upsert and the lead creation, so a
 * failure downstream never loses a customer.
 *
 * Until that endpoint exists this form does not pretend to submit. Showing a
 * success panel for an enquiry that reached nobody is the single worst thing
 * this page could do: the visitor stops chasing, and the enquiry is gone. So
 * the fallback is the phone number and WhatsApp, which is where this market
 * wanted to go anyway.
 */
export function EnquiryForm({
  listingTitle,
  reference,
  consultantName = "the consultant for this area",
}: {
  listingTitle: string;
  reference: string;
  consultantName?: string;
}) {
  const nameId = useId();
  const phoneId = useId();
  const messageId = useId();
  const [attempted, setAttempted] = useState(false);

  const PhoneIcon = webIcons.phone;
  const ChatIcon = webIcons.whatsapp;

  const whatsappHref = whatsappLink(viewingMessage({ title: listingTitle, reference }));

  const labelClass = "web-subtitle mb-1.5 block text-xs text-ink-500";
  const inputClass =
    "w-full rounded-web-full border border-slate-200 bg-surface-0 px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-ink-900 focus:outline-none";

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setAttempted(true);
      }}
      className="grid gap-3"
    >
      {/* Honeypot. Off-screen rather than display:none, which some bots skip,
          and never announced or focusable. */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
      >
        <label htmlFor={`${nameId}-company`}>Company</label>
        <input id={`${nameId}-company`} name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor={nameId} className={labelClass}>
          Your name
        </label>
        <input id={nameId} name="name" required placeholder="Full name" className={inputClass} />
      </div>

      <div>
        <label htmlFor={phoneId} className={labelClass}>
          Phone
        </label>
        <input
          id={phoneId}
          name="phone"
          type="tel"
          required
          inputMode="tel"
          autoComplete="tel"
          placeholder="07XX XXX XXX"
          className={`${inputClass} web-numeric text-sm`}
        />
      </div>

      <div>
        <label htmlFor={messageId} className={labelClass}>
          Message <span className="font-normal text-ink-400">optional</span>
        </label>
        <textarea
          id={messageId}
          name="message"
          rows={3}
          placeholder="When would you like to view?"
          className="w-full resize-y rounded-web-card border border-slate-200 bg-surface-0 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-ink-900 focus:outline-none"
        />
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 rounded-web-full bg-brand-yellow/50 opacity-0 blur transition-opacity duration-500 group-hover:opacity-100" />
        <button
          type="submit"
          className="relative w-full web-control web-hit rounded-web-full bg-brand-yellow px-6 py-[11px] text-xs uppercase tracking-[0.12em] text-brand-dark transition-colors hover:bg-brand-yellow-h"
        >
          Book a viewing
        </button>
      </div>

      {attempted && (
        <p
          role="status"
          className="rounded-web-card border border-line bg-surface-1 p-3 text-xs leading-relaxed text-ink-700"
        >
          Online enquiries open with the new site. Call {SITE.phone} or send us a WhatsApp quoting{" "}
          <span className="web-numeric">{reference}</span> and we will book the viewing now.
        </p>
      )}

      <div className="flex gap-2">
        <a
          href={SITE.phoneHref}
          className="web-hit inline-flex flex-1 items-center justify-center gap-2 rounded-web-full border border-line-strong px-4 py-2.5 text-sm text-ink-900 transition-colors hover:border-ink-900"
        >
          <PhoneIcon size={15} stroke={WEB_ICON_STROKE} aria-hidden="true" />
          Call
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="web-hit inline-flex flex-1 items-center justify-center gap-2 rounded-web-full bg-[#25D366] px-4 py-2.5 text-sm text-white transition-colors hover:bg-[#20b858]"
        >
          <ChatIcon size={15} stroke={WEB_ICON_STROKE} aria-hidden="true" />
          WhatsApp
        </a>
      </div>

      <p className="mt-1 text-xs leading-relaxed text-ink-400">
        We reply within one working day. Your details go to {consultantName} only, and we never pass
        them on.
      </p>
    </form>
  );
}
