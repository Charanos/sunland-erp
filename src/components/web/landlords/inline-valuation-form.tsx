"use client";

import { useActionState, useId, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitValuationEnquiry } from "@/lib/actions/web/enquiries";
import { FORM_TIMESTAMP_FIELD, HONEYPOT_FIELD } from "@/lib/actions/web/form-fields";
import { cn } from "@/lib/utils/cn";
import { LANDLORDS } from "../constants/landlords.content";
import { SITE } from "../constants/site";
import { WEB_ICON_STROKE, webIcons } from "../icons";

/**
 * The valuation form, inline at the foot of the landlord hub.
 *
 * Inline rather than a link to a separate page, per web doc 04 §4.7:
 * every extra click here costs conversions, and an owner who has just read
 * the fee table is at the highest intent they will reach on this site.
 *
 * Submissions land in `web_enquiries` tagged `valuation`, with the property
 * type, unit count and current rent carried as metadata so whoever picks it up
 * can price the visit before making it.
 */

function SubmitButton() {
  // Read from a child of the form: the hook reports the nearest enclosing
  // form's state, so reading it alongside the form would always see idle.
  const { pending } = useFormStatus();
  const ArrowIcon = webIcons.arrow;

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="w-full group relative overflow-hidden inline-flex items-center justify-center gap-2.5 rounded-full bg-brand-yellow hover:bg-brand-yellow-h  px-7 py-3.5 text-web-xs font-medium uppercase tracking-[0.14em] font-mono shadow-[0_4px_20px_rgba(21,25,54,0.25)] hover:shadow-[0_6px_28px_rgba(21,25,54,0.35)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed cursor-pointer"
    >
      <span>{pending ? "Sending…" : LANDLORDS.valuation.form.submitLabel}</span>
      <ArrowIcon size={16} stroke={WEB_ICON_STROKE} className="group-hover:translate-x-1 transition-transform" />
    </button>
  );
}

export function InlineValuationForm() {
  const baseId = useId();
  const [intent, setIntent] = useState<string>(LANDLORDS.valuation.form.intents[0]);
  const [state, formAction] = useActionState(submitValuationEnquiry, null);

  // Stamped once at mount; the action refuses submissions that arrive faster
  // than a person could plausibly type.
  const [renderedAt] = useState(() => Date.now());

  // "Submit another" dismisses the success panel. Tracked against the state
  // object itself rather than a boolean: `useActionState` hands back a new
  // object on every submission, so the next success is never swallowed by a
  // dismissal that belonged to the previous one.
  const [dismissed, setDismissed] = useState<unknown>(null);
  const submitted = state?.ok === true && dismissed !== state;
  const errors = state && !state.ok ? (state.fieldErrors ?? {}) : {};
  const errorFor = (field: string) => errors[field];
  const errorClass = "font-mono mt-1.5 block text-web-nano text-rose-600";

  const ArrowIcon = webIcons.arrow;
  const CheckIcon = webIcons.check;
  const ShieldIcon = webIcons.shield;

  const labelClass = "block font-medium text-web-xs text-ink-900 mb-2";
  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-web-sm text-ink-900 placeholder:text-slate-400 focus:border-ink-900 focus:ring-1 focus:ring-ink-900 focus:outline-none transition-all shadow-2xs";

  if (submitted) {
    return (
      <div className="py-8 space-y-6">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckIcon size={20} stroke={2.5} />
          </span>
          <div>
            <h3 className="font-editorial text-[24px] font-medium text-ink-900">
              Valuation Request Received
            </h3>
            <p className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-medium">
              Priority Consultation Dispatched
            </p>
          </div>
        </div>

        <p className="text-web-sm leading-relaxed text-slate-600 font-normal">
          Thank you. A senior property manager will review your property specifications and call you within one working day to arrange the on-site walkthrough.
        </p>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
          <p className="text-xs font-mono uppercase tracking-widest text-slate-400 font-medium">
            Immediate Inquiries
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink-900 font-medium">Direct Line:</span>
            <a href={SITE.phoneHref} className="font-mono text-sm text-ink-900 font-medium underline">
              {SITE.phone}
            </a>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setDismissed(state)}
          className="text-xs font-mono uppercase tracking-wider text-slate-500 hover:text-ink-900 transition-colors underline cursor-pointer"
        >
          Submit another property request
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {/* Honeypot. The field name comes from the shared constant so the form
          and the check that reads it cannot drift apart. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${baseId}-website`}>Website</label>
        <input id={`${baseId}-website`} name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name={FORM_TIMESTAMP_FIELD} value={renderedAt} />

      {/* Row 1: Name & Phone */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${baseId}-name`} className={labelClass}>
            Your name <span className="text-rose-500">*</span>
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
            Telephone number <span className="text-rose-500">*</span>
          </label>
          <input
            id={`${baseId}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder="07XX XXX XXX"
            className={cn(inputClass, "font-mono")}
          />
        </div>
      </div>

      {/* Row 2: Email */}
      <div>
        <label htmlFor={`${baseId}-email`} className={labelClass}>
          Email address
        </label>
        <input
          id={`${baseId}-email`}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          className={inputClass}
        />
      </div>

      {/* Row 3: Area & Property Type */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${baseId}-area`} className={labelClass}>
            Location / Neighborhood <span className="text-rose-500">*</span>
          </label>
          <input
            id={`${baseId}-area`}
            name="area"
            required
            placeholder="e.g. Kilimani, Riverside"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={`${baseId}-type`} className={labelClass}>
            Property specification
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

      {/* Intent Radio Group - Uncarded Segmented Grid */}
      <fieldset className="pt-1">
        <legend className={labelClass}>What is your primary objective?</legend>
        <div className="grid grid-cols-3 gap-2">
          {LANDLORDS.valuation.form.intents.map((option) => {
            const active = intent === option;
            return (
              <label
                key={option}
                className={cn(
                  "flex cursor-pointer items-center justify-center rounded-xl py-2.5 px-3 text-center text-web-xs sm:text-web-xs transition-all font-medium select-none border",
                  active
                    ? "bg-brand-dark text-white border-ink-900 shadow-xs"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50/50"
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
                <span>{option}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Additional Notes */}
      <div>
        <label htmlFor={`${baseId}-notes`} className={labelClass}>
          Additional notes <span className="font-normal text-slate-400 text-xs">(optional)</span>
        </label>
        <textarea
          id={`${baseId}-notes`}
          name="notes"
          rows={3}
          placeholder={LANDLORDS.valuation.form.notesPlaceholder}
          className={cn(inputClass, "resize-y")}
        />
      </div>

      {/* Consent Checkbox */}
      <label className="flex cursor-pointer items-start gap-3 text-web-xs leading-relaxed text-slate-500 pt-1">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 size-4 shrink-0 rounded accent-ink-900"
        />
        <span>{LANDLORDS.valuation.form.consent}</span>
      </label>

      {/* Submit Button */}
      <div className="pt-2">
        <SubmitButton />
      </div>

      {/* A failure not tied to one field — a throttle, or the database being
          unreachable. Field problems are announced beside their own input. */}
      {state && !state.ok && Object.keys(errors).length === 0 && (
        <p
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-web-xs leading-relaxed text-ink-700"
        >
          {state.message}
        </p>
      )}

      {/* Reassurance Footer */}
      <div className="pt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-200/80">
        <span className="flex items-center gap-1.5 font-mono">
          <ShieldIcon size={13} className="text-emerald-600" />
          100% Confidential & Free
        </span>
        <div className="flex items-center gap-1">
          <span>Or call:</span>
          <a href={SITE.phoneHref} className="text-slate-700 font-mono font-medium hover:underline">
            {SITE.phone}
          </a>
        </div>
      </div>
    </form>
  );
}
