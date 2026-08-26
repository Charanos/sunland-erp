/**
 * Field names shared between the public forms and the actions that read them.
 *
 * ── Why these are not in `shared.ts` ──
 *
 * `shared.ts` imports `next/headers` and the `db` client, which makes it a
 * server-only module. The forms are client components and need these two names
 * to render the inputs, so importing them from there pulls the whole server
 * module — database client included — into the browser bundle, and the build
 * fails on it.
 *
 * Splitting the constants out keeps one source of truth for the names without
 * that: a rename here changes the input and the check that reads it together,
 * which is the whole point, and nothing server-side comes along for the ride.
 *
 * This file must stay free of imports for that reason.
 */

/**
 * The honeypot input every public form renders.
 *
 * A field a human never sees and never fills. Bots that parse the DOM and
 * complete every input give themselves away by putting something in it.
 *
 * Deliberately not named "honeypot" — the name is what a scraper reads.
 */
export const HONEYPOT_FIELD = "company_website";

/**
 * Hidden field carrying the moment the form was rendered.
 *
 * The action compares it against submission time: a person cannot read a form,
 * type a name and a phone number and submit inside three seconds, but a script
 * does it in fifty milliseconds.
 */
export const FORM_TIMESTAMP_FIELD = "rendered_at";
