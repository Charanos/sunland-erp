import { WEB_AREAS } from "./locations.content";
import { SERVICE_SECTIONS } from "./services.content";
import type { WebIconName } from "../icons";

/**
 * About page content, from the Claude Design about template.
 *
 * The team lives on this page as a `#team` section rather than on its own
 * route. Splitting it would cost this page its most human section to produce a
 * thin one next door, and the roster is shared with the article bylines either
 * way. The header, footer and sitemap all link `/about#team`.
 *
 * Copy is verbatim from the design. In particular the testimonial footnote
 * stays: publishing two reviews and declining to build a star rating out of
 * them is the credibility move, and removing that line to look bigger would
 * undo it.
 */

export const ABOUT_HERO = {
  eyebrow: "About Sunland",
  headline: "A property company that answers the phone.",
  lead: "Sunland Real Estates is a Nairobi agency and property manager. We sell, let and run residential and commercial property, and we hold the mandate for the whole life of the asset rather than disappearing after the deal.",
} as const;

export const ABOUT_STORY = {
  title: "What we actually do",
  paragraphs: [
    "Most agencies in this market are transaction shops: they find a buyer or a tenant, take the commission, and move on. The owner is left managing the asset with a phone and a notebook. We built the business the other way round, around management, because that is where an owner's returns are actually won or lost.",
    "So we do the unglamorous parts: chasing arrears on day one, getting three quotes for a roof, sitting through a service charge dispute, inspecting a unit at handover so the deposit argument never happens. And we put all of it in a system the owner can log into, because trust that depends on a monthly phone call is not trust.",
    `We work across ${WEB_AREAS.length} areas, from Kilimani and Lavington to Tatu City, the coast at Nyali, and upcountry acreage in Nyeri and Elgeyo Marakwet. Where we cannot service a property properly, we say so.`,
  ],
  /**
   * Fallback only. `AboutStorySection` takes live values from
   * `getHomeAggregates()` and falls back to these when the query fails.
   *
   * This block used to carry that same promise while the page imported no
   * services at all, so the fallback was the only thing that ever rendered and
   * two of the three numbers were typed in by hand. On a page arguing that the
   * owner should not have to take a figure on trust, that was self-defeating.
   * Everything derivable is now derived.
   */
  figures: [
    { value: "39", label: "Properties listed" },
    { value: String(WEB_AREAS.length), label: "Areas covered" },
    { value: String(SERVICE_SECTIONS.length), label: "Service lines" },
  ],
  mediaLabel: "The Nairobi skyline",
} as const;

export const ABOUT_COMMITMENTS = {
  eyebrow: "How we work",
  /** States the count in words, so `cards` below cannot change length without
   *  this line being updated with it. */
  title: "Four commitments",
  cards: [
    {
      number: "01",
      icon: "chart" as WebIconName,
      title: "Honest figures",
      body: "We quote what a property will realistically achieve, with the comparables attached. Winning a mandate on a flattering number costs the owner three months.",
    },
    {
      number: "02",
      icon: "user" as WebIconName,
      title: "One accountable person",
      body: "Every property has a named manager with their number on your statement. Not a group chat and not a rotating desk.",
    },
    {
      number: "03",
      icon: "wallet" as WebIconName,
      title: "Money you can trace",
      body: "Client funds sit separately from ours. Every deduction is itemised with an invoice, and the portal shows the position live.",
    },
    {
      number: "04",
      icon: "users" as WebIconName,
      title: "Tenants treated properly",
      body: "A tenant who is answered stays, pays and looks after the place. We charge them no finder's fee and we fix what breaks.",
    },
  ],
} as const;

export const ABOUT_TEAM = {
  eyebrow: "Our team",
  title: "The people you will deal with",
  lead: "Ten people, each with a name, a title and a face. You will speak to the same person next year.",
  /**
   * Members are not listed here. The roster lives in `people.ts` and is shared
   * with the article bylines in `/insights`, so a person's photograph, title
   * and byline cannot disagree across the site.
   *
   * They previously lived here as three entries with roles that had drifted
   * from the published ones, alongside seven photographs with no titles at all.
   * Both problems are the same problem: two lists of the same people.
   */
  hiring: {
    title: "Join us",
    body: "We hire consultants and property managers who can hold a client relationship without being chased. Send us a note even when nothing is advertised.",
    cta: { label: "Get in touch", href: "/contact" },
  },
} as const;

export const ABOUT_TESTIMONIALS = {
  eyebrow: "From clients",
  items: [
    {
      quote:
        "They listened to our needs, showed us properties that matched our vision, and walked us through every step with patience and professionalism. Thanks to them, we found our dream home.",
      name: "Brian W.",
      role: "homeowner, Nairobi",
    },
    {
      quote:
        "Their team was professional, transparent and incredibly efficient. They handled everything from start to finish and kept me informed the whole way.",
      name: "Ramadhan M.",
      role: "landlord, Nairobi",
    },
  ],
} as const;

export const ABOUT_VISIT = {
  title: "Come and see us",
  ctas: [
    { label: "Contact us", href: "/contact", variant: "primary" as const },
    { label: "Browse properties", href: "/properties", variant: "outline" as const },
  ],
  mediaLabel: "The Sunland office on Mama Ngina Street",
} as const;
