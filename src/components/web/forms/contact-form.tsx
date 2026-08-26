"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { CONTACT_FORM } from "../constants/contact.content";
import { SITE } from "../constants/site";

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
 * TODO(W4-1): POST to the enquiry endpoint per web doc 07 §6.3, creating a
 * `contacts` row and a `leads` row assigned from the audience and subject,
 * with the Head of Strategy as the fallback assignee.
 *
 * Until then it does not pretend to send. A visitor who believes a message
 * reached us and then waits is worse off than one told to pick up the phone.
 */
export function ContactForm() {
  const baseId = useId();
  const [audience, setAudience] = useState<string>(CONTACT_FORM.audiences[0]);
  const [attempted, setAttempted] = useState(false);

  const labelClass = "web-subtitle mb-1.5 block text-web-micro text-ink-500";
  const inputClass =
    "w-full rounded-web-full border border-line-strong bg-surface-0 px-4 py-2.5 text-web-sm text-ink-900 placeholder:text-ink-400 focus:border-ink-900 focus:outline-none";

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setAttempted(true);
      }}
      className="grid gap-4"
    >
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${baseId}-fax`}>Fax</label>
        <input id={`${baseId}-fax`} name="fax" tabIndex={-1} autoComplete="off" />
      </div>

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
            className={inputClass}
          />
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
          className={inputClass}
        />
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
          className="w-full resize-y rounded-web-card border border-line-strong bg-surface-0 px-4 py-3 text-web-sm text-ink-900 placeholder:text-ink-400 focus:border-ink-900 focus:outline-none"
        />
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

      <button
        type="submit"
        className="web-control web-hit rounded-web-full bg-brand-yellow px-6 py-[11px] text-web-micro uppercase tracking-[0.12em] text-brand-dark transition-colors hover:bg-brand-yellow-h"
      >
        {CONTACT_FORM.submitLabel}
      </button>

      {attempted && (
        <p
          role="status"
          className="rounded-web-card border border-line bg-surface-1 p-3.5 text-web-xs leading-relaxed text-ink-700"
        >
          Online messages open with the new site. Call{" "}
          <a href={SITE.phoneHref} className="web-numeric text-ink-900 underline underline-offset-4">
            {SITE.phone}
          </a>{" "}
          or WhatsApp{" "}
          <a
            href={SITE.whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="web-numeric text-ink-900 underline underline-offset-4"
          >
            {SITE.whatsapp}
          </a>{" "}
          and someone will pick it up now.
        </p>
      )}
    </form>
  );
}
