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
  eyebrow: "Direct Mandate Routing",
  title: "Start from where you are",
  lead: "Whether you are an asset owner, seeking a vetted residence, acquiring prime property, or scaling corporate facilities, route your mandate directly to the specialized desk.",
  /**
   * One object per card, carrying every string the card renders.
   *
   * This was previously split in two: four cards here supplying `href` and
   * `icon`, and six parallel arrays inside the page component supplying the
   * copy, each indexed by array position. Nothing tied the two together, so
   * reordering a card here — or inserting a fifth — silently repaired the
   * hrefs while leaving every badge, title, description and CTA label attached
   * to the wrong destination. A card is one thing; it belongs in one object.
   */
  cards: [
    {
      audience: "Landlords & Owners",
      title: "Valuation, letting & management",
      body: "Complimentary appraisal, structured lease drafting, and full automated property management with 0% finder's fee.",
      highlight: "0% Finder Fee · 5th Payout",
      cta: "Valuation & Portal",
      href: "/landlords",
      icon: "house" as WebIconName,
    },
    {
      audience: "Tenants & Residents",
      title: "Browse curated rentals",
      body: "Browse authentic residential stock with verified pricing, zero finder's fees, and streamlined digital tenancy.",
      highlight: "Zero Tenant Fee · Verified Stock",
      cta: "Explore Rentals",
      href: "/properties/for-rent",
      icon: "key" as WebIconName,
    },
    {
      audience: "Buyers & Investors",
      title: "Homes, plots & prime blocks",
      body: "Prime residential and commercial acquisitions backed by official registry title verification and escrow closing.",
      highlight: "Registry Checked · Escrow Closing",
      cta: "Properties For Sale",
      href: "/properties/for-sale",
      icon: "doc" as WebIconName,
    },
    {
      audience: "Corporate & SEZ",
      title: "Offices, retail & logistics",
      body: "Strategic tenant and landlord representation for Grade-A office towers, retail frontage, and SEZ logistics godowns.",
      highlight: "450k+ Sq Ft · SEZ Advisory",
      cta: "Commercial Desk",
      href: "/contact",
      icon: "briefcase" as WebIconName,
    },
  ],
} as const;
