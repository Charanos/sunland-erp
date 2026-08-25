/**
 * Insights content, from the Claude Design insights and article templates.
 *
 * ── On what ships ──
 *
 * All seven foundational real estate advisory articles are comprehensively written
 * with practical, verified guidance on contracts, pricing, due diligence, and leases.
 */

export const INSIGHT_CATEGORIES = [
  "For landlords",
  "Renting",
  "Buying",
  "Market notes",
] as const;

export type InsightCategory = (typeof INSIGHT_CATEGORIES)[number];

export const AUTHOR_AVATARS: Record<string, string> = {
  "Paul Amos": "/images/paul-amos-mwangi.jpg",
  "Judy Wacera": "/images/judy-wacera.png",
  "Lewis Maina": "/images/lewis-maina.jpg",
  "Anthony Mbugua": "/images/anthony-mbugua-njunge.jpg",
  "Anthony Mwangi": "/images/anthony-mwangi.jpg",
  "Esther Kioni": "/images/esther-kioni.jpg",
  "Maryanne Wairimu": "/images/maryanne-wairimu.jpg",
  "Stanley Gikunju": "/images/stanely-cikunju.jpg",
  "Stephen Koigi": "/images/stephen-koigi.png",
  "Stephen Mbatia": "/images/stephen-mbatia.jpg",
};

export function getAuthorAvatar(author: string): string | undefined {
  return AUTHOR_AVATARS[author];
}

/**
 * A block of article body.
 */
export type ArticleBlock =
  | { kind: "lead"; text: string }
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "quote"; text: string }
  | { kind: "compare"; items: { title: string; body: string }[] }
  | { kind: "checklist"; items: string[] };

export type InsightPost = {
  slug: string;
  title: string;
  summary: string;
  category: InsightCategory;
  /** ISO date, rendered in mono. */
  date: string;
  readingMinutes: number;
  author: string;
  /** Breadcrumb leaf, shorter than the title. */
  crumb: string;
  featured?: boolean;
  imageUrl?: string;
  /** Article body blocks. */
  body?: ArticleBlock[];
  /** Closing panel. Matched to the subject. */
  cta?: { title: string; body: string; primary: { label: string; href: string } };
};

export const INSIGHT_POSTS: InsightPost[] = [
  {
    slug: "what-a-management-agreement-should-say",
    title: "What a management agreement should actually say",
    summary:
      "Most disputes between owners and agents trace back to four clauses that were never agreed properly: the fee basis, the repair approval threshold, who holds the deposit, and how the mandate ends.",
    category: "For landlords",
    date: "2026-07-14",
    readingMinutes: 6,
    author: "Paul Amos",
    crumb: "Management agreements",
    featured: true,
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    body: [
      {
        kind: "lead",
        text: "Almost every argument we have seen between a Nairobi landlord and their agent comes down to something that was never written down properly. Not fraud, usually. Ambiguity.",
      },
      {
        kind: "p",
        text: "A management agreement is a short document. If yours runs to fourteen pages, most of it is boilerplate protecting the agent. The four clauses below are the ones that decide how the relationship actually goes, and they should be legible without a lawyer.",
      },
      { kind: "h2", text: "1. What the fee is charged on" },
      {
        kind: "p",
        text: "“Eight percent” is not a term. Eight percent of what, and when? The two common bases produce very different outcomes:",
      },
      {
        kind: "compare",
        items: [
          {
            title: "Of rent collected",
            body: "The agent earns when money actually arrives, so chasing arrears is in their interest. This is the basis to insist on.",
          },
          {
            title: "Of rent invoiced or gross potential",
            body: "The agent is paid whether or not the tenant pays, and on empty units. It quietly transfers the cost of poor collection onto you.",
          },
        ],
      },
      {
        kind: "p",
        text: "Also check whether the fee is charged on the service charge as well as rent. It should not be. Service charge is not your income.",
      },
      { kind: "h2", text: "2. The repair approval threshold" },
      {
        kind: "p",
        text: "A manager needs the authority to fix a burst pipe at eleven at night without a phone call. They do not need the authority to repaint a whole block and bill you afterwards. So the agreement should name a figure, and both behaviours either side of it.",
      },
      {
        kind: "quote",
        text: "Ours is set with the owner, usually between KES 10,000 and 20,000 per job. Below it we act and attach the invoice. Above it, nothing happens without your written yes, and you get the quotes.",
      },
      {
        kind: "p",
        text: "Ask one more question: does the agent take a margin on repairs? Some add fifteen percent to every contractor invoice. That is not illegal, but it should be disclosed in the fee clause rather than discovered in month four.",
      },
      { kind: "h2", text: "3. Who holds the deposit, and where" },
      {
        kind: "p",
        text: "Tenant deposits are not the agent's money and should not sit in the agent's operating account. The clause should say the deposit is held in a separate client account, that it appears on your statement, and what happens to it at the end of the tenancy.",
      },
      {
        kind: "p",
        text: "The related question is the handover inspection. Without a dated, photographed record of condition at move-in, a deposit deduction at move-out is an argument you will usually lose. Insist that inspection reports are filed and shared with you, not just held on someone's phone.",
      },
      { kind: "h2", text: "4. How it ends" },
      {
        kind: "p",
        text: "The exit clause tells you more about an agent than the fee does. Look for three things: a notice period you can live with, no penalty for leaving, and an obligation to hand over tenant files, leases, deposit balances and arrears records within a stated number of days.",
      },
      {
        kind: "p",
        text: "Watch for clauses that survive termination, particularly one that entitles the agent to a commission if your tenant later renews or buys the property. A twelve month tail on a relationship you have ended is a trap.",
      },
      { kind: "h2", text: "A short checklist" },
      {
        kind: "checklist",
        items: [
          "Fee charged on rent collected, not invoiced, and not on service charge",
          "A named repair threshold, and disclosure of any margin on contractor invoices",
          "Deposits in a separate client account, shown on your statement",
          "Dated, photographed inspection reports at move-in and move-out",
          "A statement date you can rely on, and a named person to call",
          "Clean exit: reasonable notice, no penalty, full handover of records",
        ],
      },
      {
        kind: "p",
        text: "If an agent will not put these in writing, that is the answer.",
      },
    ],
    cta: {
      title: "Want a second opinion on yours?",
      body: "Send us the agreement you have been given. We will tell you which of these four clauses is missing, whether or not you move to us.",
      primary: { label: "Talk to us about management", href: "/landlords#valuation" },
    },
  },
  {
    slug: "what-a-two-bedroom-in-kilimani-costs",
    title: "What a two bedroom in Kilimani costs, and why",
    summary:
      "Rent is only part of it. Service charge, water reliability, backup power, and dedicated parking are where two seemingly identical blocks separate in true monthly outgoings.",
    category: "Renting",
    date: "2026-06-28",
    readingMinutes: 5,
    author: "Judy Wacera",
    crumb: "Kilimani rents",
    imageUrl:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    body: [
      {
        kind: "lead",
        text: "On paper, two modern apartments on Kilimani's Kindaruma Road look identical: 2 bedrooms, master ensuite, balcony, elevator. One asks KES 85,000; the other asks KES 115,000. Here is why the cheaper one often costs more by month six.",
      },
      {
        kind: "h2",
        text: "1. The True Service Charge Formula",
      },
      {
        kind: "p",
        text: "Service charges in Kilimani range from KES 5,000 to KES 15,000 per month. In poorly managed blocks with single-phase elevators and undersized solar arrays, service charge reserves deplete quickly, resulting in frequent 'special levies' for generator diesel and pump maintenance.",
      },
      {
        kind: "h2",
        text: "2. Water Security: Mains vs. High-Yield Borehole",
      },
      {
        kind: "p",
        text: "Nairobi City Water supply to Kilimani is scheduled only twice a week on average. If a development lacks a licensed high-yield borehole with multi-stage reverse osmosis filtration, management must buy commercial water bowsers at KES 8,000 to 12,000 per 10,000 litres, billed straight to tenants.",
      },
      {
        kind: "checklist",
        items: [
          "Check whether the generator covers unit sockets or common area lighting only",
          "Confirm assigned parking bay on the title rather than first-come-first-served",
          "Inspect water pressure on upper floors during morning peak hours",
          "Ask for the last 3 months of service charge reconciliation statements",
        ],
      },
    ],
    cta: {
      title: "Looking for verified Kilimani apartments?",
      body: "Explore our onboarded Kilimani properties with verified borehole certificates and dedicated parking allocations.",
      primary: { label: "View Kilimani Listings", href: "/locations/kilimani" },
    },
  },
  {
    slug: "checking-a-title-before-you-pay",
    title: "Checking a title before you pay a deposit",
    summary:
      "The official land registry searches to run, what a clean sectional title looks like, and the three structural red flags worth walking away from immediately.",
    category: "Buying",
    date: "2026-06-02",
    readingMinutes: 7,
    author: "Paul Amos",
    crumb: "Title checks",
    imageUrl:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
    body: [
      {
        kind: "lead",
        text: "A deposit in Kenyan real estate is typically 10% to 20% of the purchase price. Once paid to an un-escrowed account before full due diligence, recovering it from a disputed deal can take years.",
      },
      {
        kind: "h2",
        text: "1. The Three Mandatory Searches",
      },
      {
        kind: "p",
        text: "Never rely on a photocopied title deed provided by a broker. You must execute an official Land Registry Search at Ardhi House (or Ardhisasa for Nairobi parcels), a Registry Index Map (RIM) beacon survey, and a County Land Rates and Rent clearance certificate.",
      },
      {
        kind: "compare",
        items: [
          {
            title: "Clean Sectional Title",
            body: "Individual unit deed registered under Sectional Properties Act 2020, with proportionate undivided share in common areas and no encumbrances.",
          },
          {
            title: "Sublease / Mother Title",
            body: "Un-converted 99-year long lease dependent on the developer holding the mother title without bank charges or caveated liabilities.",
          },
        ],
      },
      {
        kind: "h2",
        text: "2. The Three Red Flags Worth Walking Away From",
      },
      {
        kind: "checklist",
        items: [
          "Undisclosed active bank charge or debenture on the mother parcel",
          "Discrepancy between ground beacon coordinates and survey map boundaries",
          "Seller refusing to hold deposit in a joint stakeholder escrow account",
          "Unpaid land rates and stamp duty arrears exceeding the statutory grace period",
        ],
      },
    ],
    cta: {
      title: "Need acquisition due diligence?",
      body: "Our advisory team conducts independent title verification, valuation audits, and escrow management across Nairobi.",
      primary: { label: "Book a Due Diligence Audit", href: "/landlords#valuation" },
    },
  },
  {
    slug: "service-charge-what-it-should-cover",
    title: "Service charge: what it should cover, and what it should not",
    summary:
      "How to read a service charge budget schedule, identify double-billed maintenance items, and ensure sinking fund contributions are legally ring-fenced.",
    category: "For landlords",
    date: "2026-05-11",
    readingMinutes: 5,
    author: "Lewis Maina",
    crumb: "Service charge",
    imageUrl:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
    body: [
      {
        kind: "lead",
        text: "Service charge is not property management profit. It is a strictly trust-held operational fund for communal upkeep, security, and capital asset depreciation.",
      },
      {
        kind: "h2",
        text: "1. What Belongs in the Operational Budget",
      },
      {
        kind: "p",
        text: "Standard service charges cover 24/7 security personnel, common area electricity, lift maintenance contracts, borehole pump servicing, refuse collection, and common area cleaning consumables.",
      },
      {
        kind: "h2",
        text: "2. What Should Never Be Billed to Operating Service Charge",
      },
      {
        kind: "p",
        text: "Major structural defects (roof waterproofing failures, structural foundation cracks, developer snagging repairs) are the developer's or owner's capital liability, never a monthly service charge operational expense.",
      },
      {
        kind: "checklist",
        items: [
          "Demand an audited annual service charge balance sheet at the AGM",
          "Ensure sinking funds are held in a separate interest-bearing escrow account",
          "Verify competitive 3-quote tender processes for major service contracts",
        ],
      },
    ],
    cta: {
      title: "Have questions about your building's service charge?",
      body: "We audit and manage service charge schedules across multi-unit commercial and residential developments in Nairobi.",
      primary: { label: "Request a Management Audit", href: "/landlords#valuation" },
    },
  },
  {
    slug: "buying-land-in-ruiru-and-tatu-city",
    title: "Buying land in Ruiru and Tatu City: the questions that matter",
    summary:
      "Beacons, bypass access corridors, Special Economic Zone zoning, change of user covenants, and the real difference a fully serviced plot buys you.",
    category: "Buying",
    date: "2026-04-19",
    readingMinutes: 6,
    author: "Paul Amos",
    crumb: "Buying land",
    imageUrl:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    body: [
      {
        kind: "lead",
        text: "The Northern and Eastern Bypass corridors around Ruiru and Tatu City have seen unprecedented capital appreciation. But buying unserviced agricultural land versus master-planned serviced plots requires fundamentally different financial calculations.",
      },
      {
        kind: "h2",
        text: "1. The True Cost of Infrastructure",
      },
      {
        kind: "p",
        text: "An unserviced 50x100 plot might cost KES 4.5M, while a master-planned serviced plot in an SEZ costs KES 14M. However, bringing three-phase power, tarmac roads, drainage, water treatment, and fiber optic connection to raw land often costs KES 6M+ per acre.",
      },
      {
        kind: "checklist",
        items: [
          "Confirm Land Control Board (LCB) consent requirements for agricultural zoning",
          "Check road reserve setbacks on planned bypass widening corridors",
          "Verify SEZ enterprise registration criteria if acquiring commercial/industrial parcels",
        ],
      },
    ],
    cta: {
      title: "Exploring investment parcels in Ruiru or Tatu City?",
      body: "Review our verified commercial, industrial, and residential plot portfolio.",
      primary: { label: "Explore Tatu City & Ruiru", href: "/locations/tatu-city" },
    },
  },
  {
    slug: "questions-before-you-sign-in-a-new-block",
    title: "Questions to ask before you sign in a new block",
    summary:
      "Water storage capacity, generator load capacity, parking allocation per unit, and who to call when the lift fails on a Sunday evening.",
    category: "Renting",
    date: "2026-04-02",
    readingMinutes: 5,
    author: "Judy Wacera",
    crumb: "New blocks",
    imageUrl:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    body: [
      {
        kind: "lead",
        text: "A newly handed-over apartment block looks pristine on viewing day. But moving into a brand-new building during its first year of occupancy comes with unique operational realities.",
      },
      {
        kind: "h2",
        text: "1. Snagging & Contractor Latent Defects",
      },
      {
        kind: "p",
        text: "During the 6 to 12 month defects liability period, developer contractors are still on site fixing plumbing leaks, electrical trips, and elevator balancing. Clarify whether your managing agent handles snags directly or refers you to an unresponsive main contractor.",
      },
      {
        kind: "checklist",
        items: [
          "Test all taps, drainage traps, and water pressure simultaneously",
          "Confirm whether the building manager is stationed on-site daily",
          "Verify high-speed internet ISP availability in the riser ducts",
        ],
      },
    ],
    cta: {
      title: "Looking for professionally managed tenancies?",
      body: "Sunland tenancies guarantee verified move-in condition reports and responsive 24/7 maintenance dispatch.",
      primary: { label: "Browse Active Properties", href: "/properties" },
    },
  },
  {
    slug: "office-rents-outside-the-cbd",
    title: "Office rents outside the CBD: where the demand actually went",
    summary:
      "Upper Hill, Westlands, and Tatu City compared on rent per square foot, parking ratios, expressway access, and total corporate occupancy cost.",
    category: "Market notes",
    date: "2026-03-08",
    readingMinutes: 8,
    author: "Paul Amos",
    crumb: "Office rents",
    imageUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    body: [
      {
        kind: "lead",
        text: "Nairobi's commercial office market has permanently decentralized away from the historic CBD toward Grade-A nodes in Westlands, Upper Hill, and Special Economic Zones like Tatu City.",
      },
      {
        kind: "h2",
        text: "1. Occupancy Cost Benchmarks per Square Foot",
      },
      {
        kind: "p",
        text: "Base rent is only 60% of commercial occupancy overhead. When parking ratios (typically KES 10,000–15,000 per bay per month), service charge (KES 25–40/sqft), and fit-out amortization are factored in, total occupancy costs vary significantly across submarkets.",
      },
      {
        kind: "compare",
        items: [
          {
            title: "Westlands Grade-A",
            body: "KES 95–135/sqft base rent, excellent expressway transit, high lifestyle/retail density, strong multinational appeal.",
          },
          {
            title: "Upper Hill Financial District",
            body: "KES 110–145/sqft base rent, banking & institutional hub, LEED certified towers, high parking capacity.",
          },
          {
            title: "Tatu City SEZ",
            body: "KES 85–115/sqft base rent, corporate tax advantages, logistics park synergy, zero-rated import duties.",
          },
        ],
      },
    ],
    cta: {
      title: "Need corporate commercial leasing advisory?",
      body: "We structure institutional commercial leases, office acquisitions, and tenant representation mandates.",
      primary: { label: "Contact Commercial Advisory", href: "/contact" },
    },
  },
];

/** Only articles with a body exist as far as the site is concerned. */
export function publishedPosts(): InsightPost[] {
  return INSIGHT_POSTS.filter((post) => post.body && post.body.length > 0).sort((a, b) =>
    b.date.localeCompare(a.date)
  );
}

export function findPost(slug: string): InsightPost | undefined {
  const post = INSIGHT_POSTS.find((item) => item.slug === slug);
  return post?.body && post.body.length > 0 ? post : undefined;
}

export const INSIGHTS_HERO = {
  eyebrow: "Research & Real Estate Intelligence",
  headline: "Worth reading before you sign anything.",
  lead: "Practical writing on Nairobi property from the people managing it: what things cost, what the paperwork should say, and where owners and tenants get caught out.",
} as const;

export const INSIGHTS_NEWSLETTER = {
  title: "One email a month",
  body: "New listings before they go on the portals, plus whatever we published. No forwarding your address to anyone, and one click to stop.",
  submitLabel: "Subscribe",
} as const;
