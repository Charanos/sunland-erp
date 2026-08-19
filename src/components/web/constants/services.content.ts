import type { WebIconName } from "../icons";

/**
 * Services content, from the Claude Design services template.
 *
 * The design makes services ONE page with four anchored sections, not a hub
 * plus four detail pages. That is the better structure and it is why the
 * earlier `/services/{slug}` routes were removed:
 *
 *   - The four services are read comparatively. An owner deciding between
 *     letting only and full management wants both on one screen, not two
 *     page loads apart.
 *   - Four thin detail pages compete with each other and with the landlord
 *     hub for the same queries. One substantial page does not.
 *   - Every conversion path from here already lands somewhere better: the
 *     valuation form on the landlord hub, or the listing index.
 *
 * Anchors are stable (`#management`, `#letting`, `#valuation`, `#commercial`)
 * because the header, the footer and the in-page jump nav all target them.
 */

export type ServiceSection = {
  id: string;
  number: string;
  title: string;
  /** Paragraphs, in order. */
  body: string[];
  /** Checklist items, where the section has one. */
  points?: string[];
  /** Two-column figure rows, where the section has a fee or spec table. */
  rows?: { label: string; value: string; emphasis?: boolean }[];
  /** Three-cell figure strip beside the image, hub section only. */
  figures?: { value: string; label: string }[];
  ctas: { label: string; href: string; variant: "primary" | "outline" }[];
  /** Which side the media sits on at desktop width. */
  mediaSide: "left" | "right";
  tone: "light" | "tint";
  /** Alt text for the media panel, describing what it stands for. */
  mediaLabel: string;
};

export const SERVICES_HERO = {
  eyebrow: "What we do",
  headline: "Four things, done properly.",
  lead: "We are a property agency and manager, not a listings board. That means the same people who value your property market it, place the tenant, and answer the phone two years later.",
  jumpLinks: [
    { label: "Property management", href: "#management" },
    { label: "Sales and letting", href: "#letting" },
    { label: "Valuation", href: "#valuation" },
    { label: "Commercial and industrial", href: "#commercial" },
  ],
} as const;

export const SERVICE_SECTIONS: ServiceSection[] = [
  {
    id: "management",
    number: "01",
    title: "Property management",
    tone: "light",
    mediaSide: "right",
    mediaLabel: "A managed apartment interior in Nairobi",
    body: [
      "We take the whole running of a property off your hands: marketing, tenant placement, rent collection, arrears, repairs, inspections and renewals. Every property gets one named manager, and every month you get a statement showing what was collected and what was spent, per unit.",
      "It suits owners with anything from a single let apartment to a block of thirty units, and owners living abroad who need someone accountable on the ground.",
    ],
    points: [
      "Tenant vetting and leases",
      "Rent collection and arrears",
      "Repairs with itemised invoices",
      "Quarterly inspections",
      "Service charge administration",
      "Owner portal access",
    ],
    figures: [
      { value: "8%", label: "Of rent collected" },
      { value: "5th", label: "Remitted monthly by" },
      { value: "2 mo", label: "Notice, either side" },
    ],
    ctas: [
      { label: "Request a valuation", href: "/landlords#valuation", variant: "primary" },
      { label: "How it works", href: "/landlords#how", variant: "outline" },
    ],
  },
  {
    id: "letting",
    number: "02",
    title: "Sales and letting",
    tone: "tint",
    mediaSide: "left",
    mediaLabel: "A villa marketed for sale by Sunland",
    body: [
      "For owners who want the property let or sold and will handle the rest themselves. We price it, photograph it, market it here and on the portals, run accompanied viewings, and negotiate on your side of the table.",
      "For buyers and tenants, the same team is on the other end: we will tell you when a property is wrong for you rather than push it, because the good outcome is a tenancy that lasts.",
    ],
    rows: [
      { label: "Letting fee", value: "1 month's rent" },
      { label: "Sale commission", value: "2.5% of price" },
      { label: "Tenant finder's fee", value: "None" },
    ],
    ctas: [{ label: "See what we have on", href: "/properties", variant: "outline" }],
  },
  {
    id: "valuation",
    number: "03",
    title: "Valuation",
    tone: "light",
    mediaSide: "right",
    mediaLabel: "An interior being assessed for valuation",
    body: [
      "A written figure for letting, sale, or your own records, based on what comparable properties in that area actually achieved rather than what was asked for them. We will give you the comparables so you can see the reasoning.",
      "Owners also use us for bank and probate valuations, service charge reviews, and rent reviews at renewal.",
    ],
    rows: [
      { label: "Letting or sale appraisal", value: "Free", emphasis: true },
      { label: "Formal written valuation", value: "On quotation" },
      { label: "Turnaround", value: "3 working days" },
    ],
    ctas: [{ label: "Request a valuation", href: "/landlords#valuation", variant: "primary" }],
  },
  {
    id: "commercial",
    number: "04",
    title: "Commercial and industrial",
    tone: "tint",
    mediaSide: "left",
    mediaLabel: "Office space available for lease",
    body: [
      "Offices, retail units, warehousing and godowns, including space at Tatu City and along the industrial belt. Commercial letting runs on different terms to residential: longer leases, escalation clauses, fit-out periods and service charge reconciliation, and we handle all of it.",
      "For occupiers we run the search the other way round: your requirement, our shortlist, and an honest read on which landlord is straightforward to deal with.",
    ],
    points: [
      "Office space",
      "Retail and showroom",
      "Warehousing and godowns",
      "Land for development",
    ],
    ctas: [
      { label: "Commercial listings", href: "/properties/commercial", variant: "outline" },
    ],
  },
];

/**
 * The closing band routes by audience rather than by service, because a
 * visitor who has read four service descriptions and still not acted does not
 * know which service they need. They do know who they are.
 */
export const SERVICES_ROUTER = {
  eyebrow: "Not sure which you need?",
  title: "Start from where you are",
  cards: [
    {
      audience: "I own a property",
      title: "Get it valued and let",
      body: "Free appraisal, then either letting only or full management.",
      href: "/landlords",
      icon: "house" as WebIconName,
    },
    {
      audience: "I am looking to rent",
      title: "Browse what is available",
      body: "Real stock, real prices, no finder's fee to us.",
      href: "/properties/for-rent",
      icon: "key" as WebIconName,
    },
    {
      audience: "I want to buy",
      title: "Homes, plots and blocks",
      body: "Including title checks before you pay a deposit.",
      href: "/properties/for-sale",
      icon: "doc" as WebIconName,
    },
    {
      audience: "I need space for a business",
      title: "Tell us the requirement",
      body: "Office, retail or warehousing, and we will shortlist.",
      href: "/contact",
      icon: "briefcase" as WebIconName,
    },
  ],
} as const;
