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
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
    >
      <div className="flex-1">
        {/* Visible label above the input, never placeholder-only. */}
        <label
          htmlFor={emailId}
          className="web-control block text-[10px] uppercase tracking-[0.14em] text-on-dark-lo"
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
          className="mt-2 w-full rounded-web-full border border-dark-line bg-dark-raise px-5 py-2.5 text-sm text-on-dark-hi placeholder:text-on-dark-lo focus:border-on-dark-lo focus:outline-none"
          placeholder="you@example.com"
        />
      </div>
      <WebButton type="submit" variant="ghostDark" size="md">
        Subscribe
      </WebButton>

      {submitted && (
        <p
          id={`${emailId}-status`}
          role="status"
          className="text-sm text-on-dark sm:absolute sm:mt-20"
        >
          The alert list opens with the new site. Call {SITE.phone} and we will add you now.
        </p>
      )}
    </form>
  );
}
