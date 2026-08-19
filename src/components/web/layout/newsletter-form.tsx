"use client";

import { useId, useState } from "react";
import { SITE } from "../constants/site";
import { WebButton } from "../primitives/button";

/**
 * Footer newsletter signup.
 *
 * TODO(W4-8): wire to the property alerts pipeline. `web_subscribers` with
 * double opt-in, one-click unsubscribe, and matching on publish do not exist
 * yet, and neither does the endpoint.
 *
 * Until they do this form does not pretend to work. Taking an address and
 * showing a success panel that files it nowhere is worse than the WordPress
 * site we are replacing: it is a promise we would silently break, and the
 * visitor would never find out. So the field is real, the submission is
 * refused honestly, and the phone number is offered instead, which is the
 * channel this market converts on anyway.
 */
export function NewsletterForm() {
  const emailId = useId();
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
      className="flex flex-col gap-3 sm:flex-row sm:items-end relative"
    >
      <div className="flex-1">
        {/* Visible label above the input, never placeholder-only. */}
        <label
          htmlFor={emailId}
          className="font-mono block text-[10px] uppercase tracking-[0.16em] text-slate-400 mb-1.5"
        >
          Email address
        </label>
        <input
          id={emailId}
          type="email"
          name="email"
          autoComplete="email"
          required
          aria-describedby={submitted ? `${emailId}-status` : undefined}
          className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-slate-400 focus:border-brand-yellow focus:bg-white/10 focus:outline-none transition-all shadow-inner"
          placeholder="you@example.com"
        />
      </div>
      <WebButton
        type="submit"
        variant="primary"
        size="md"
        className="shrink-0 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        Subscribe
      </WebButton>

      {submitted && (
        <p
          id={`${emailId}-status`}
          role="status"
          className="text-xs font-mono text-emerald-400 sm:absolute sm:-bottom-6 sm:left-0 mt-2"
        >
          The alert list opens with the new site. Call {SITE.phone} and we will add you now.
        </p>
      )}
    </form>
  );
}
