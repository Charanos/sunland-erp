"use client";

import { useActionState, useId, useState } from "react";
import { useFormStatus } from "react-dom";
import { subscribeToAlerts } from "@/lib/actions/web/subscribe";
import { FORM_TIMESTAMP_FIELD, HONEYPOT_FIELD } from "@/lib/actions/web/form-fields";
import { SITE } from "../constants/site";
import { WebButton } from "../primitives/button";

/**
 * Footer newsletter signup, wired to real double opt-in.
 *
 * This form used to refuse honestly and point at the phone number, because
 * taking an address and showing a success panel that files it nowhere is worse
 * than the site we are replacing — it is a promise broken silently, and the
 * visitor never finds out.
 *
 * That reasoning still holds; what changed is that the promise can now be
 * kept. The address is stored, a confirmation mail goes out, and nothing is
 * sent until the visitor clicks the link in it. Crucially the message below
 * comes from the action rather than being hardcoded, so when SMTP is not
 * configured the visitor is told they are on the list — not to check an inbox
 * for a mail that was never dispatched.
 */

function SubmitButton() {
  // useFormStatus must be read from a child of the form, not the component
  // that renders it — the hook reads the nearest enclosing form's state.
  const { pending } = useFormStatus();

  return (
    <WebButton
      type="submit"
      variant="primary"
      size="md"
      disabled={pending}
      aria-disabled={pending}
      className="shrink-0 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
    >
      {pending ? "Sending…" : "Subscribe"}
    </WebButton>
  );
}

export function NewsletterForm() {
  const emailId = useId();
  const honeypotId = useId();
  const [state, formAction] = useActionState(subscribeToAlerts, null);

  // Stamped once at mount. The action rejects submissions that arrive faster
  // than a person could plausibly type, which is most naive form spam.
  const [renderedAt] = useState(() => Date.now());

  const fieldError = state && !state.ok ? state.fieldErrors?.email : undefined;
  const statusId = `${emailId}-status`;

  return (
    <form action={formAction} className="relative flex flex-col gap-3 sm:flex-row sm:items-end">
      {/* Honeypot. Hidden from sight and from assistive technology, and
          excluded from tab order — a person cannot reach it, so anything in
          it came from something parsing the DOM. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={honeypotId}>Company website</label>
        <input
          id={honeypotId}
          type="text"
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <input type="hidden" name={FORM_TIMESTAMP_FIELD} value={renderedAt} />
      <input type="hidden" name="source" value="footer" />

      <div className="flex-1">
        {/* Visible label above the input, never placeholder-only. */}
        <label
          htmlFor={emailId}
          className="font-mono mb-1.5 block text-web-nano uppercase tracking-[0.16em] text-slate-400"
        >
          Email address
        </label>
        <input
          id={emailId}
          type="email"
          name="email"
          autoComplete="email"
          required
          aria-invalid={fieldError ? true : undefined}
          aria-describedby={state ? statusId : undefined}
          className={`w-full rounded-full border bg-white/5 px-5 py-3 text-sm text-white shadow-inner transition-all placeholder:text-slate-400 focus:bg-white/10 focus:outline-none ${
            fieldError
              ? "border-rose-400/70 focus:border-rose-300"
              : "border-white/15 focus:border-brand-yellow"
          }`}
          placeholder="you@example.com"
        />
      </div>

      <SubmitButton />

      {state && (
        <p
          id={statusId}
          role="status"
          className={`font-mono mt-2 text-xs sm:absolute sm:-bottom-6 sm:left-0 ${
            state.ok ? "text-accent-mint" : "text-rose-300"
          }`}
        >
          {/* Field-level problems are announced beside the field they belong
              to. Anything else — a throttle, a database issue — falls back to
              the phone number, which is what this market converts on. */}
          {fieldError ??
            state.message ??
            (state.ok ? "You are on the list." : `Something went wrong. Call ${SITE.phone}.`)}
        </p>
      )}
    </form>
  );
}
