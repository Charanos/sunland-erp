"use client";

import { useActionState, useId, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitContactEnquiry } from "@/lib/actions/web/enquiries";
import { FORM_TIMESTAMP_FIELD, HONEYPOT_FIELD } from "@/lib/actions/web/form-fields";
import { cn } from "@/lib/utils/cn";
import { CONTACT_FORM } from "../constants/contact.content";
import { SITE } from "../constants/site";
import { generalMessage, whatsappLink } from "../constants/whatsapp";

/**
 * The general enquiry form.
 *
 * The audience selector at the top is not decoration: it routes the enquiry
 * to the right queue before anyone reads it, and it changes what the visitor
 * writes in the message box. A tenant with a leak and an owner considering a
 * mandate are answered by different people on different timescales.
 *
 * The mockup draws the audience choices as styled labels with no input behind
 * them, which cannot be operated by keyboard and is invisible to a screen
 * reader. They are drawn faithfully here and built as a real radio group.
 *
 * Submissions land in `web_enquiries`, not straight in the sales pipeline.
 * The audience and subject travel with the row as metadata so triage can route
 * it without reading the message first. See the table's doc comment for why
 * anonymous input is staged rather than written to `crm.leads`.
 */

function SubmitButton() {
  // Read from a child of the form: the hook reports the nearest enclosing
  // form's state, so calling it in the component that renders the form
  // would always see "not pending".
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="web-control web-hit rounded-web-full bg-brand-yellow px-6 py-[11px] text-web-micro uppercase tracking-[0.12em] text-brand-dark transition-colors hover:bg-brand-yellow-h disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "Sending…" : CONTACT_FORM.submitLabel}
    </button>
  );
}

export function ContactForm() {
  const baseId = useId();
  const [audience, setAudience] = useState<string>(CONTACT_FORM.audiences[0]);
  const [state, formAction] = useActionState(submitContactEnquiry, null);

  // Stamped once at mount. The action refuses submissions that arrive faster
  // than a person could plausibly type.
  const [renderedAt] = useState(() => Date.now());

  const errors = state && !state.ok ? (state.fieldErrors ?? {}) : {};
  const errorFor = (field: string) => errors[field];
  const errorClass = "font-mono mt-1.5 block text-web-nano text-rose-600";

  const labelClass = "web-subtitle mb-1.5 block text-web-micro text-ink-500";
  const inputClass =
    "w-full rounded-web-full border border-line-strong bg-surface-0 px-4 py-2.5 text-web-sm text-ink-900 placeholder:text-ink-400 focus:border-ink-900 focus:outline-none";

  return (
    <form action={formAction} className="grid gap-4">
      {/* Honeypot. The field name comes from the shared constant so the form
          and the check that reads it cannot drift apart. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${baseId}-fax`}>Fax</label>
        <input id={`${baseId}-fax`} name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name={FORM_TIMESTAMP_FIELD} value={renderedAt} />

      <fieldset>
        <legend className={labelClass}>{CONTACT_FORM.audienceLabel}</legend>
        <div className="flex flex-wrap gap-1.5">
          {CONTACT_FORM.audiences.map((option) => {
            const active = audience === option;
            return (
              <label
                key={option}
                className={cn(
                  "web-hit inline-flex cursor-pointer items-center rounded-web-full px-4 py-1.5 text-web-xs transition-colors",
                  active
                    ? "bg-brand-dark text-on-dark-hi"
                    : "border border-line-strong text-ink-500 hover:border-ink-400",
                  // The ring lives on the label, because the input is visually
                  // hidden and would otherwise focus invisibly.
                  "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-dark"
                )}
              >
                <input
                  type="radio"
                  name="audience"
                  value={option}
                  checked={active}
                  onChange={() => setAudience(option)}
                  className="sr-only"
                />
                {option}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${baseId}-name`} className={labelClass}>
            Name
          </label>
          <input
            id={`${baseId}-name`}
            name="name"
            required
            placeholder="Full name"
            aria-invalid={errorFor("name") ? true : undefined}
            aria-describedby={errorFor("name") ? `${baseId}-name-error` : undefined}
            className={cn(inputClass, errorFor("name") && "border-rose-400")}
          />
          {errorFor("name") && (
            <span id={`${baseId}-name-error`} className={errorClass}>
              {errorFor("name")}
            </span>
          )}
        </div>
        <div>
          <label htmlFor={`${baseId}-phone`} className={labelClass}>
            Phone
          </label>
          <input
            id={`${baseId}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder="07XX XXX XXX"
            className={cn(inputClass, "web-numeric text-sm")}
          />
        </div>
      </div>

      <div>
        <label htmlFor={`${baseId}-email`} className={labelClass}>
          Email
        </label>
        <input
          id={`${baseId}-email`}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={errorFor("email") ? true : undefined}
          aria-describedby={errorFor("email") ? `${baseId}-email-error` : undefined}
          className={cn(inputClass, errorFor("email") && "border-rose-400")}
        />
        {errorFor("email") && (
          <span id={`${baseId}-email-error`} className={errorClass}>
            {errorFor("email")}
          </span>
        )}
      </div>

      <div>
        <label htmlFor={`${baseId}-subject`} className={labelClass}>
          {CONTACT_FORM.subjectLabel}
        </label>
        <select id={`${baseId}-subject`} name="subject" className={inputClass}>
          {CONTACT_FORM.subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${baseId}-message`} className={labelClass}>
          Message
        </label>
        <textarea
          id={`${baseId}-message`}
          name="message"
          rows={5}
          required
          placeholder={CONTACT_FORM.messagePlaceholder}
          aria-invalid={errorFor("message") ? true : undefined}
          aria-describedby={errorFor("message") ? `${baseId}-message-error` : undefined}
          className={cn(
            "w-full resize-y rounded-web-card border bg-surface-0 px-4 py-3 text-web-sm text-ink-900 placeholder:text-ink-400 focus:border-ink-900 focus:outline-none",
            errorFor("message") ? "border-rose-400" : "border-line-strong"
          )}
        />
        {errorFor("message") && (
          <span id={`${baseId}-message-error`} className={errorClass}>
            {errorFor("message")}
          </span>
        )}
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-web-xs leading-relaxed text-ink-500">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 size-4 shrink-0 accent-[var(--color-brand-dark)]"
        />
        {CONTACT_FORM.consent}
      </label>

      <SubmitButton />

      {state?.ok && (
        <p
          role="status"
          className="rounded-web-card border border-accent-mint-line bg-accent-mint-soft p-3.5 text-web-xs leading-relaxed text-ink-700"
        >
          Thank you — that has reached us. We reply within one working day. If it
          is urgent, call{" "}
          <a href={SITE.phoneHref} className="web-numeric text-ink-900 underline underline-offset-4">
            {SITE.phone}
          </a>{" "}
          or WhatsApp{" "}
          <a
            href={whatsappLink(generalMessage())}
            target="_blank"
            rel="noreferrer"
            className="web-numeric text-ink-900 underline underline-offset-4"
          >
            {SITE.whatsapp}
          </a>{" "}
          and someone will pick it up now.
        </p>
      )}

      {/* A failure that is not tied to one field — a throttle, or the database
          being unreachable. Field-level problems are announced beside their
          own input above, because a summary panel reporting an error whose
          source is off-screen is worse than no panel at all. */}
      {state && !state.ok && Object.keys(errors).length === 0 && (
        <p
          role="alert"
          className="rounded-web-card border border-rose-200 bg-rose-50 p-3.5 text-web-xs leading-relaxed text-ink-700"
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
