import { SITE } from "./site";
import type { WebIconName } from "../icons";

/**
 * Contact page content, from the Claude Design contact template.
 *
 * The page's whole argument is in its h1: a person, not a ticket queue. So
 * every channel card carries a real value and a real expectation ("Mon–Sat,
 * 8am to 6pm", "Replies within one working day"), and the routing table names
 * the person who handles each kind of enquiry.
 *
 * The old site listed a Twitter icon pointing at "#". A contact method that
 * does not work is worse than one that is absent, because the visitor spends
 * their attempt on it. Social links are therefore omitted here until real
 * handles are supplied, rather than rendered as dead chips.
 */

export const CONTACT_HERO = {
  eyebrow: "Talk to us",
  headline: "A person, not a ticket queue.",
  lead: "Call between 8am and 6pm Monday to Saturday and someone will pick up. Messages sent outside those hours get a reply the next working morning.",
} as const;

export type ContactChannel = {
  icon: WebIconName;
  label: string;
  value: string;
  note: string;
  href?: string;
  external?: boolean;
  /** Whether the value renders in JetBrains Mono. */
  mono: boolean;
};

export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    icon: "phone",
    label: "Call",
    value: SITE.phone,
    note: "Mon–Sat, 8am to 6pm",
    href: SITE.phoneHref,
    mono: true,
  },
  {
    icon: "chat",
    label: "WhatsApp",
    value: SITE.whatsapp,
    note: "Best for photos and documents",
    href: SITE.whatsappHref,
    external: true,
    mono: true,
  },
  {
    icon: "mail",
    label: "Email",
    value: SITE.email,
    note: "Replies within one working day",
    href: SITE.emailHref,
    mono: true,
  },
  {
    icon: "pin",
    label: "Office",
    value: "International House, 8th Floor, Mama Ngina Street, Nairobi",
    note: "P.O. Box 37987-00100",
    mono: false,
  },
];

/**
 * Who handles what.
 *
 * Naming the person is the point of the page. A caller who asks for Lewis
 * about a statement gets to the right desk first time, which is the whole
 * difference between this and a switchboard.
 */
export const CONTACT_ROUTING = {
  title: "Who to ask for",
  rows: [
    { subject: "Viewings and lettings", person: "Judy Wacera" },
    { subject: "Repairs and statements", person: "Lewis Maina" },
    { subject: "Mandates and disputes", person: "Paul Amos" },
  ],
} as const;

export const CONTACT_FORM = {
  title: "Send us a message",
  lead: "Tell us what you need and we will put the right person on it.",
  /** Routes the enquiry to the right queue, and pre-frames the conversation. */
  audienceLabel: "I am…",
  audiences: ["Looking to rent", "Buying", "A property owner", "A tenant with an issue"],
  subjectLabel: "What is it about?",
  subjects: [
    "A property I saw on the site",
    "Property management",
    "A valuation",
    "Commercial space",
    "A maintenance issue",
    "Something else",
  ],
  messagePlaceholder: "The more detail the better: area, budget, when you need it.",
  consent:
    "I agree to Sunland contacting me about this enquiry. We never sell or share your details.",
  submitLabel: "Send message",
} as const;

export const CONTACT_ROUTER_CARDS = [
  {
    audience: "Owners",
    title: "Request a valuation",
    body: "Free appraisal, written figure in three working days.",
    href: "/landlords#valuation",
  },
  {
    audience: "Tenants",
    title: "Report a maintenance issue",
    body: "Log it in the tenant portal and it becomes a tracked job.",
    href: "/login",
  },
  {
    audience: "Everyone else",
    title: "Browse what is available",
    body: "Every property on our books, priced as we will quote them.",
    href: "/properties",
  },
] as const;
