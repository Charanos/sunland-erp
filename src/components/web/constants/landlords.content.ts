import type { FaqItem } from "../primitives/faq-accordion";
import { WEB_AREAS } from "./locations.content";
import type { WebIconName } from "../icons";

/**
 * Landlord hub content, taken from the Claude Design landlord template.
 *
 * The design is materially stronger than the earlier copy deck draft in three
 * places, and where they disagree the design wins:
 *
 *   1. It publishes real fee percentages instead of describing fees in prose.
 *      Every owner asks on the first call; answering before they ask is the
 *      whole point of the page.
 *   2. It replaces four abstract steps with a timeline keyed to elapsed time,
 *      because the question an owner is actually asking is "when do I get
 *      paid".
 *   3. It puts the valuation form inline at the foot of the page rather than
 *      linking away, which is also what web doc 04 §4.7 asks for.
 *
 * These become `web_sections` rows at W3. Until then they are the section
 * contract's defaults, so the page is complete before any content is entered.
 */

export const LANDLORDS = {
  hero: {
    eyebrow: "For property owners",
    headline: "Every unit tracked. Every shilling accounted for.",
    lead: "We manage residential and commercial property across Nairobi, and we run it on our own system. Tenants are vetted, rent is reconciled the day it lands, repairs are quoted and invoiced, and you can see all of it whenever you care to look.",
    primary: { label: "Request a valuation", href: "#valuation" },
    secondary: { label: "How it works", href: "#how" },
    reassurance:
      "A free appraisal, terms in writing, and no fee until the property is let or sold.",
    /** Fallback only. Live values come from getLandlordAggregates(). */
    stats: [
      { value: "39", label: "Properties on our books" },
      { value: String(WEB_AREAS.length), label: "Areas we cover" },
      { value: "5th", label: "Rent remitted by, monthly" },
      { value: "1", label: "Named manager per property" },
    ],
  },

  /**
   * Not "here are three pain points". Each card names the frustration an owner
   * arrives with, then the mechanism that answers it, then what they actually
   * get. The third line is the one that matters: a promise with no deliverable
   * attached is marketing, and these owners have heard it before.
   */
  promises: {
    eyebrow: "Why owners move to us",
    title: "Three things we put in writing",
    lead: "Owners tell us the same three frustrations when they leave a previous agent. Each one is answered by something specific in how we work, and each is written into your mandate.",
    cards: [
      {
        number: "01",
        icon: "wallet" as WebIconName,
        title: "Rent reconciled the day it lands",
        body: "Payments arrive in a client account, are matched to the unit and the tenant automatically, and appear on your statement the same day. M-Pesa, bank transfer or cheque.",
        outcome: "a monthly statement per unit, and a portal you can check any time.",
      },
      {
        number: "02",
        icon: "wrench" as WebIconName,
        title: "Repairs quoted, approved, invoiced",
        body: "Every maintenance issue becomes a tracked job: photographs, a quote, your approval threshold, then the contractor invoice attached to the statement.",
        outcome: "anything above your threshold waits for your yes, in writing.",
      },
      {
        number: "03",
        icon: "user" as WebIconName,
        title: "One manager, named on your statement",
        body: "A named property manager owns your building, and their direct line sits on every statement we send. Not a shared inbox and not a WhatsApp group.",
        outcome: "a name, a number, and a reply within one working day.",
      },
    ],
  },

  /**
   * A timeline rather than four abstract steps. The left column is elapsed
   * time, which is the axis the owner is actually measuring.
   */
  timeline: {
    eyebrow: "How management works",
    title: "From first call to first payout",
    steps: [
      {
        when: "Day 1",
        title: "We visit and value",
        body: "A consultant walks the property, notes its condition, and gives you a realistic letting or sale figure with the comparables behind it. If the number is lower than you hoped, we say so then, not after three months of silence.",
      },
      {
        when: "Day 2–3",
        title: "You get terms in writing",
        body: "One mandate letter: the fee, what it covers, your repair approval threshold, and the named manager assigned to you. Nothing hidden in a schedule at the back.",
      },
      {
        when: "Week 1",
        title: "We photograph and list",
        body: "Professional photographs, a written description, and the listing goes live here and on the portals we syndicate to. Viewings are accompanied, always.",
      },
      {
        when: "Offer",
        title: "We vet before we recommend",
        body: "Identity, employment or business records, previous landlord reference. You see the file and you make the final call on who moves in.",
      },
      {
        when: "Monthly",
        title: "Rent in, statement out, by the 5th",
        body: "Collections are reconciled per unit, deductions are itemised with invoices attached, and the balance is remitted to your account by the fifth of the following month.",
      },
      {
        when: "Ongoing",
        title: "Inspections and renewals",
        body: "Quarterly inspection with photographs, arrears chased from day one, and a renewal conversation with a market rent recommendation two months before the lease ends.",
      },
    ],
  },

  /**
   * Real percentages, published.
   *
   * The copy deck allowed a version without figures if the client would not
   * publish rates. The design publishes them, which is the stronger position.
   * The caveat above the cards is load-bearing and must not be dropped: these
   * are indicative and confirmed in the mandate.
   */
  fees: {
    eyebrow: "What it costs",
    title: "Fees, before you ask",
    lead: "Percentages are indicative and confirmed in your mandate letter. They depend on the property, the number of units, and how much of the work sits with us.",
    tiers: [
      {
        name: "Letting only",
        tagline: "You keep the day to day.",
        figure: "1",
        unit: "month's rent, once",
        featured: false,
        badge: null,
        includes: ["Photography and listing", "Accompanied viewings", "Tenant vetting and lease"],
        excludes: ["No ongoing collection"],
      },
      {
        name: "Full management",
        tagline: "We run it end to end.",
        figure: "10",
        unit: "% of rent collected",
        featured: true,
        badge: "Most owners",
        includes: [
          "Everything in letting only",
          "Rent collection and arrears",
          "Repairs and vendor management",
          "Quarterly inspections",
          "Monthly statement and portal",
        ],
        excludes: [],
      },
      {
        name: "Sale",
        tagline: "Marketing to completion.",
        figure: "2.5",
        unit: "% of sale price",
        featured: false,
        badge: null,
        includes: [
          "Valuation and pricing strategy",
          "Photography and listing",
          "Buyer qualification",
          "Negotiation and conveyancing liaison",
        ],
        excludes: [],
      },
    ],
  },

  /**
   * The ERP band: the one claim on this site no competing agency can make,
   * because they do not have the system. Everything named here maps to a
   * module that exists in this repository, which is why it can be published.
   */
  erp: {
    eyebrow: "Powered by the Sunland ERP",
    title: "The system your property runs on",
    lead: "Most agencies run on spreadsheets and goodwill. We built an ERP for this: leases, collections, arrears, maintenance and documents in one ledger, with an owner portal on top of it. You are not sent a monthly PDF, you are given the live position.",
    rows: [
      {
        icon: "doc" as WebIconName,
        label: "Statements",
        value: "Per unit, per month, downloadable",
      },
      { icon: "chart" as WebIconName, label: "Arrears", value: "Who is behind, and by how long" },
      {
        icon: "wrench" as WebIconName,
        label: "Maintenance",
        value: "Open jobs, quotes, invoices, photos",
      },
      {
        icon: "lock" as WebIconName,
        label: "Documents",
        value: "Leases, mandate, inspection reports",
      },
    ],
    portalLink: { label: "Sign in to the portal", href: "/login" },
    capabilities: [
      {
        icon: "sync" as WebIconName,
        title: "M-Pesa reconciliation",
        body: "Paybill collections matched to the unit automatically, not keyed in by hand at month end.",
      },
      {
        icon: "chart" as WebIconName,
        title: "Arrears ledger",
        body: "Every tenant's balance and ageing, with the reminders already sent recorded against it.",
      },
      {
        icon: "wrench" as WebIconName,
        title: "Job tracking",
        body: "Photographs in, quote attached, your approval logged, invoice filed against the unit.",
      },
      {
        icon: "lock" as WebIconName,
        title: "Document vault",
        body: "Leases, mandates, inspection reports and titles, held where both of us can find them.",
      },
      {
        icon: "users" as WebIconName,
        title: "Tenant portal",
        body: "Your tenants raise issues and see their own statements, which is why fewer calls reach you.",
      },
      {
        icon: "shield" as WebIconName,
        title: "Audit trail",
        body: "Who changed what, and when. It is the reason a disputed figure takes minutes, not weeks.",
      },
    ],
    /**
     * Illustrative of the real owner portal, and labelled as a portfolio view
     * rather than dressed up as this visitor's own data.
     */
    dashboard: {
      summary: [
        { value: "KES 1.42M", label: "Collected, Mar" },
        { value: "96%", label: "Occupancy" },
        { value: "2", label: "Open jobs" },
      ],
      units: [
        { name: "Apartment 4B, Kilimani", amount: "106,200", state: "paid" as const },
        { name: "Duplex 2, Lavington", amount: "110,400", state: "paid" as const },
        { name: "Unit 7, Garden Estate", amount: "64,400", state: "part" as const },
        { name: "Office 3, Tatu City", amount: "244,800", state: "paid" as const },
      ],
    },
  },

  testimonial: {
    eyebrow: "From an owner",
    quote:
      "Their team was professional, transparent and incredibly efficient. They handled everything from start to finish and kept me informed the whole way.",
    name: "Ramadhan M.",
    role: "landlord, Nairobi",
  },

  faq: [
    {
      question: "Am I locked into a long contract?",
      answer:
        "No. The mandate runs for twelve months and either side can end it with two months' written notice. We would rather keep you by doing the job.",
    },
    {
      question: "Who holds the deposit?",
      answer:
        "We do, in a client account, separate from our operating funds. It is itemised on your statement and returned to the tenant at the end of the tenancy less agreed deductions.",
    },
    {
      question: "What happens if a tenant stops paying?",
      answer:
        "Arrears are chased from day one: reminder, call, formal demand, then instructions to counsel if it goes that far. You are told at each step, not at the end.",
    },
    {
      question: "Can I keep my current tenant?",
      answer:
        "Yes. We take over the existing lease, re-paper it if it needs it, and run an inspection so both sides start with an agreed record of condition.",
    },
  ] satisfies FaqItem[],

  /** The valuation ask is inline at the foot of this page, not a link away. */
  valuation: {
    eyebrow: "Free, no obligation",
    title: "Request a valuation",
    lead: "Tell us where the property is and what it is. A consultant will call to arrange a visit, usually within one working day, and you will have a written figure within three.",
    steps: [
      "We call to understand the property and arrange a visit.",
      "A consultant inspects it, typically 45 minutes.",
      "You get a written figure with the comparables behind it. No commitment.",
    ],
    /** Field labels and options, verbatim from the design's form. */
    form: {
      propertyTypes: [
        "Apartment or flat",
        "House or villa",
        "Block of units",
        "Commercial",
        "Land",
      ],
      intents: ["Let it out", "Sell it", "Just want a figure"],
      consent:
        "I agree to Sunland contacting me about this request. We do not add you to a mailing list.",
      submitLabel: "Request my valuation",
      notesPlaceholder: "Number of units, current rent, when it is available",
    },
  },
} as const;
