"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { LANDLORDS } from "../constants/landlords.content";
import { SITE } from "../constants/site";

/**
 * The valuation form, inline at the foot of the landlord hub.
 *
 * Inline rather than a link to a separate page, per web doc 04 §4.7:
 * every extra click here costs conversions, and an owner who has just read
 * the fee table is at the highest intent they will reach on this site.
 *
 * The field set is the design's: name, phone, email, area, type, intent, notes, consent. It asks for the
 * minimum a consultant needs to make the call, and nothing that could be
 * asked on that call instead.
 *
 * Intent is a real radio group, not the styled pills the mockup draws as
 * labels. The mockup's version has no input behind it and cannot be operated
 * by keyboard or reported to a screen reader, so it is drawn faithfully and
 * built correctly.
 *
 * TODO(W4-2): POST to the valuation endpoint in web doc 07 §6.2, which upserts
 * a `contacts` row and opens a `valuations` row at stage `requested`, then
 * notifies the Head of Strategy. `web_form_submissions` is written first, so a
 * failure downstream never loses an owner.
 */
export function InlineValuationForm() {
  const baseId = useId();
  const [intent, setIntent] = useState<string>(LANDLORDS.valuation.form.intents[0]);
  const [attempted, setAttempted] = useState(false);

  const labelClass = "web-subtitle mb-1.5 block text-[12.5px] text-ink-500";
  const inputClass =
    "w-full rounded-web-full border border-line-strong bg-surface-0 px-4 py-2.5 text-[14.5px] text-ink-900 placeholder:text-ink-400 focus:border-ink-900 focus:outline-none";

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setAttempted(true);
      }}
      className="grid gap-4 rounded-web-panel border border-line bg-surface-0 p-8"
    >
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${baseId}-website`}>Website</label>
        <input id={`${baseId}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${baseId}-name`} className={labelClass}>
            Your name
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${baseId}-area`} className={labelClass}>
            Area
          </label>
          <input
            id={`${baseId}-area`}
            name="area"
            required
            placeholder="e.g. Kileleshwa"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={`${baseId}-type`} className={labelClass}>
            Property type
          </label>
          <select id={`${baseId}-type`} name="propertyType" className={inputClass}>
            {LANDLORDS.valuation.form.propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset>
        <legend className={labelClass}>What do you want to do?</legend>
        <div className="flex flex-wrap gap-1.5">
          {LANDLORDS.valuation.form.intents.map((option) => {
            const active = intent === option;
            return (
              <label
                key={option}
                className={cn(
                  "web-hit inline-flex cursor-pointer items-center rounded-web-full px-4 py-1.5 text-[13.5px] transition-colors",
                  active
                    ? "bg-brand-dark text-on-dark-hi"
                    : "border border-line-strong text-ink-500 hover:border-ink-400",
                  // The visible focus ring has to live on the label, because
                  // the input it belongs to is visually hidden.
                  "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-dark"
                )}
              >
                <input
                  type="radio"
                  name="intent"
                  value={option}
                  checked={active}
                  onChange={() => setIntent(option)}
                  className="sr-only"
                />
                {option}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div>
        <label htmlFor={`${baseId}-notes`} className={labelClass}>
          Anything else <span className="font-normal text-ink-400">optional</span>
        </label>
        <textarea
          id={`${baseId}-notes`}
          name="notes"
          rows={3}
          placeholder={LANDLORDS.valuation.form.notesPlaceholder}
          className="w-full resize-y rounded-web-card border border-line-strong bg-surface-0 px-4 py-3 text-[14.5px] text-ink-900 placeholder:text-ink-400 focus:border-ink-900 focus:outline-none"
        />
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-[13px] leading-relaxed text-ink-500">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 size-4 shrink-0 accent-[var(--color-brand-dark)]"
        />
        {LANDLORDS.valuation.form.consent}
      </label>

      <button
        type="submit"
        className="web-control web-hit rounded-web-full bg-brand-yellow px-6 py-[11px] text-[12.5px] uppercase tracking-[0.12em] text-brand-dark transition-colors hover:bg-brand-yellow-h"
      >
        {LANDLORDS.valuation.form.submitLabel}
      </button>

      {attempted && (
        <p
          role="status"
          className="rounded-web-card border border-line bg-surface-1 p-3.5 text-[13px] leading-relaxed text-ink-700"
        >
          Online requests open with the new site. Call{" "}
          <a href={SITE.phoneHref} className="web-numeric text-ink-900 underline underline-offset-4">
            {SITE.phone}
          </a>{" "}
          and a consultant will arrange the visit now, usually within one working day.
        </p>
      )}

      <p className="text-[12.5px] leading-relaxed text-ink-400">
        Or call{" "}
        <a href={SITE.phoneHref} className="web-numeric text-ink-500 underline-offset-4 hover:underline">
          {SITE.phone}
        </a>
        , {SITE.officeHours}
      </p>
    </form>
  );
}
