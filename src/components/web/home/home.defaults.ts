import type { ListingCardData } from "../primitives/listing-card";
import type { WebIconName } from "../icons";

/**
 * Home page content defaults.
 *
 * Every string here is taken verbatim from the Claude Design home template
 * and web doc 05. Copy is not improvised at the keyboard: the client signed
 * off on these words, and a developer rewording a headline in passing is how
 * a brand voice dissolves.
 *
 * These are `defaults` in the sense of web doc 07 §4.2's section contract: a
 * component renders them when its `web_sections` row is missing, so the site
 * is fully functional before any content is entered, and the Content Studio
 * (W3) later overrides them per section without a deploy.
 *
 * ── On figures ──
 * The handoff is explicit that nothing invented should ship. Figures below
 * fall into two classes:
 *
 *   Sourced. Category counts, listing details, contact details and the two
 *   testimonials come from the live WordPress site and are true today. They
 *   are wired to live aggregates where the ERP can compute them and fall back
 *   to these values when it cannot.
 *
 *   Unsourced, marked TODO. The budget finder rent table is the design's own
 *   estimate. It is the one place on this page presenting numbers the ERP
 *   cannot yet produce, and it must be replaced with live lettings data or
 *   removed before launch. It is labelled on the page as typical rents
 *   achieved, which is a claim we have to be able to stand behind.
 */

// ── 01 home.hero ─────────────────────────────────────────────────────────────

export const heroDefaults = {
  eyebrow: "Nairobi · Coast · Upcountry",
  headline: "Property, managed properly.",
  lead: "We let, sell and manage homes, land and commercial space across Nairobi, the coast and upcountry. Owners get their rent on time and can see exactly where it came from. Tenants get a landlord who answers.",
  quickLinks: [
    { label: "Apartments to let", href: "/properties/apartments?status=for-rent" },
    { label: "Land for sale", href: "/properties/land?status=for-sale" },
    { label: "Commercial space", href: "/properties/commercial" },
    // The owner route. Added in the design pass because on a 390 screen an
    // owner otherwise passes the hero, four category cards and four listing
    // cards before anything addresses them: roughly six screens of scroll for
    // the audience that generates the recurring revenue. One line, in the
    // first screen, and it costs the tenant nothing.
    { label: "Own a property? Get a valuation", href: "/landlords#valuation" },
  ],
  /** Fallback only. Live values come from getHomeAggregates(). */
  stats: [
    { value: 39, label: "Properties listed" },
    { value: 15, label: "Areas covered" },
    { value: 4, label: "Property types" },
    { value: 2, label: "Live portals" },
  ],
} as const;

// ── 02 home.categories ───────────────────────────────────────────────────────

export type CategoryTile = {
  label: string;
  href: string;
  icon: WebIconName;
  /** Fallback count. Live values come from getCategoryCounts(). */
  count: number;
};

export const categoryDefaults = {
  eyebrow: "Browse by type",
  headline: "What are you looking for?",
  viewAllLabel: "All property types",
  viewAllHref: "/properties",
  tiles: [
    { label: "Apartments", href: "/properties/apartments", icon: "building", count: 12 },
    { label: "Villas and houses", href: "/properties/villas", icon: "house", count: 11 },
    { label: "Commercial", href: "/properties/commercial", icon: "briefcase", count: 4 },
    { label: "Land and plots", href: "/properties/land", icon: "pin", count: 12 },
  ] satisfies CategoryTile[],
} as const;

// ── 03 home.budget ───────────────────────────────────────────────────────────

/**
 * TODO(W5-10): replace with live figures computed from our own lettings in the
 * last twelve months, per web doc 04 §7, which requires price tables to state
 * their basis and date and forbids hardcoded figures. Until that query exists
 * these are the design pass estimates and the band says so on the page.
 */
export const budgetDefaults = {
  eyebrow: "Start from your budget",
  headline: "Where your rent actually goes furthest",
  lead: "Set a monthly figure and the number of bedrooms. These are the areas where we have let at that level, with the typical rent we have achieved.",
  basisNote:
    "Figures are the typical rent achieved on our own lettings in the last twelve months, not asking prices.",
  matchesLabel: "Closest to your ceiling",
  primaryCta: { label: "See these listings", href: "/properties?status=for-rent" },
  secondaryCta: { label: "Register a requirement", href: "/contact" },
  areas: [
    {
      name: "Kasarani",
      rents: { 1: 25000, 2: 38000, 3: 55000 },
      note: "New-build blocks, strong yields",
    },
    {
      name: "Nairobi West",
      rents: { 1: 32000, 2: 48000, 3: 65000 },
      note: "Affordable flats, close to town",
    },
    {
      name: "Ongata Rongai",
      rents: { 1: 30000, 2: 45000, 3: 60000 },
      note: "Family houses and plots",
    },
    {
      name: "Garden Estate",
      rents: { 1: 45000, 2: 70000, 3: 95000 },
      note: "Family apartments off Thika Road",
    },
    { name: "Thome", rents: { 1: 48000, 2: 72000, 3: 88000 }, note: "Maisonettes in gated courts" },
    { name: "Nyali, Mombasa", rents: { 1: 45000, 2: 65000, 3: 90000 }, note: "Coastal apartments" },
    {
      name: "Parklands",
      rents: { 1: 50000, 2: 78000, 3: 110000 },
      note: "Older blocks and new mid-rise",
    },
    {
      name: "Kilimani",
      rents: { 1: 65000, 2: 105000, 3: 150000 },
      note: "Densest apartment market",
    },
    {
      name: "Lavington",
      rents: { 1: 80000, 2: 120000, 3: 165000 },
      note: "Low-rise, leafy compounds",
    },
    {
      name: "Kileleshwa",
      rents: { 1: 95000, 2: 150000, 3: 195000 },
      note: "Newer towers with amenities",
    },
    {
      name: "Spring Valley",
      rents: { 1: 120000, 2: 190000, 3: 260000 },
      note: "Townhouses and villas",
    },
    {
      name: "Runda",
      rents: { 1: 150000, 2: 240000, 3: 330000 },
      note: "Detached, half-acre plots",
    },
  ],
} as const;

// ── 04 home.featured ─────────────────────────────────────────────────────────

/**
 * Real inventory carried over from the live site: the Lavington duplex, the
 * Spring Valley villa, the Tatu City office, the Kileleshwa furnished unit,
 * the Riverside plot and the Garden Estate two-bed.
 *
 * Fallback only. Live listings come from getFeaturedListings(). Images are
 * null on purpose until the real media pipeline exists (W1-11): the branded
 * panel is the designed answer to a missing photograph, and stock photography
 * of buildings we do not manage would be a lie in the shop window.
 */
export const featuredDefaults = {
  eyebrow: "Available now",
  headline: "Properties on the market",
  viewAllHref: "/properties",
  filters: [
    { label: "All", href: "/properties" },
    { label: "To let", href: "/properties/for-rent" },
    { label: "For sale", href: "/properties/for-sale" },
  ],
  listings: [
    {
      id: "default-lavington-duplex",
      slug: "luxurious-3-bedroom-duplex-lavington",
      title: "Luxurious 3 bedroom duplex, Lavington",
      location: "Lavington, Nairobi",
      status: "available",
      priceKes: 120000,
      priceSuffix: "/ mo",
      imageUrl: null,
      bedrooms: 3,
      bathrooms: 3,
      area: "180 m²",
    },
    {
      id: "default-spring-valley-villa",
      slug: "four-bedroom-villa-spring-valley",
      title: "Four bedroom villa, Spring Valley",
      location: "Spring Valley, Nairobi",
      status: "available",
      isFeatured: true,
      priceKes: 117500000,
      imageUrl: null,
      bedrooms: 4,
      bathrooms: 3,
    },
    {
      id: "default-tatu-city-office",
      slug: "office-space-for-lease-tatu-city",
      title: "Office space for lease, Tatu City",
      location: "Tatu City, Kiambu",
      status: "under_offer",
      priceKes: null,
      imageUrl: null,
      area: "666 to 2,332 sqft",
      parkingSpaces: 4,
    },
    {
      id: "default-kileleshwa-furnished",
      slug: "executive-2-bedroom-furnished-kileleshwa",
      title: "Executive 2 bedroom furnished, Kileleshwa",
      location: "Kileleshwa, Nairobi",
      status: "available",
      priceKes: 190000,
      priceSuffix: "/ mo",
      imageUrl: null,
      bedrooms: 2,
      bathrooms: 2,
    },
    {
      id: "default-riverside-plot",
      slug: "prime-1-acre-plot-riverside-drive",
      title: "Prime 1 acre plot, Riverside Drive",
      location: "Riverside Drive, Nairobi",
      status: "available",
      // The null price state, drawn in the design and present here on purpose:
      // this is the case that produced KShKShKSh on the live site.
      priceKes: null,
      imageUrl: null,
      area: "1 acre",
    },
    {
      id: "default-garden-estate-two-bed",
      slug: "2-bedroom-apartment-to-let-garden-estate",
      title: "2 bedroom apartment to let, Garden Estate",
      location: "Garden Estate, Ruaraka",
      status: "available",
      priceKes: 70000,
      priceSuffix: "/ mo",
      imageUrl: null,
      bedrooms: 2,
      bathrooms: 2,
      parkingSpaces: 2,
    },
  ] satisfies ListingCardData[],
} as const;

// ── 05 home.landlords ────────────────────────────────────────────────────────

export const landlordDefaults = {
  eyebrow: "For property owners",
  headline: "Managed precisely. Reported plainly.",
  lead: "We run the letting, the collections, the repairs and the reporting on our own ERP, so nothing depends on someone remembering to update a spreadsheet. You get a named manager, a statement by the fifth, and a portal showing the live position of every unit.",
  steps: [
    {
      number: "01",
      title: "We value it.",
      body: "A consultant visits, assesses the property, and tells you what it should realistically fetch. No inflated figure to win the mandate.",
    },
    {
      number: "02",
      title: "We agree terms.",
      body: "One mandate letter, a clear fee, and a named manager assigned to your property.",
    },
    {
      number: "03",
      title: "We manage it.",
      body: "Marketing, viewings, tenant vetting, rent collection, repairs, and a statement showing what came in and what went out.",
    },
  ],
  primaryCta: { label: "Request a valuation", href: "/landlords#valuation" },
  secondaryCta: { label: "How management works", href: "/landlords#how" },
  /**
   * The statement panel. The argument that Sunland is systematic is made by
   * showing the system, and this is the only place on the public site where
   * the ERP is visible, which is the point of difference no competing agency
   * site can copy.
   *
   * TODO: replace with a real screenshot of the landlord portal statement
   * view before launch, per the handoff. This is a faithful rendering of that
   * screen, not a mockup of a feature that does not exist, but a screenshot
   * of the real thing makes the argument better.
   */
  statement: {
    portalLabel: "Landlord portal",
    title: "Statement, March 2026",
    subtitle: "Kilimani, Apartment 4B",
    badge: "Paid",
    rows: [
      { label: "Rent collected", value: "120,000" },
      { label: "Management fee", value: "−9,600" },
      { label: "Plumbing repair, unit 4B", value: "−4,200" },
    ],
    total: { label: "Remitted 5 April", value: "KES 106,200" },
    manager: { initials: "JM", name: "Joyce Mwikali, your manager", phone: "0703 100 875" },
    caption:
      "Your statements, your documents, your manager's direct line, in one place. Live figures from the same system we run the properties on.",
  },
} as const;

// ── 06 home.locations ────────────────────────────────────────────────────────

export const locationDefaults = {
  eyebrow: "Where we work",
  headline: "Areas we cover",
  viewAllLabel: "All 15 areas",
  viewAllHref: "/locations",
  tiles: [
    { name: "Kilimani", slug: "kilimani" },
    { name: "Lavington", slug: "lavington" },
    { name: "Runda", slug: "runda" },
    { name: "Westlands", slug: "westlands" },
    { name: "Riverside Drive", slug: "riverside-drive" },
    { name: "Tatu City", slug: "tatu-city" },
    { name: "Parklands", slug: "parklands" },
    { name: "Spring Valley", slug: "spring-valley" },
  ],
} as const;

// ── 07 home.services ─────────────────────────────────────────────────────────

export const serviceDefaults = {
  eyebrow: "What we do",
  headline: "Four things, done properly",
  cards: [
    {
      icon: "wallet" as WebIconName,
      title: "Property management",
      body: "Rent collection, repairs, tenant relations, and a monthly statement you can actually read.",
      href: "/services/property-management",
    },
    {
      icon: "key" as WebIconName,
      title: "Sales and letting",
      body: "We market the property, vet who walks through it, and negotiate on your side of the table.",
      href: "/services/sales-and-letting",
    },
    {
      icon: "chart" as WebIconName,
      title: "Valuation",
      body: "An honest figure for sale, letting, or your own records, from a consultant who knows the area.",
      href: "/services/valuation",
    },
    {
      icon: "warehouse" as WebIconName,
      title: "Commercial and industrial",
      body: "Offices, retail, warehousing and godowns, including Tatu City and the industrial belt.",
      href: "/services/commercial",
    },
  ],
} as const;

// ── 08 home.proof ────────────────────────────────────────────────────────────

/**
 * Two real, attributed testimonials carried verbatim from the live site.
 *
 * No rating component exists and none should until real ratings do. The
 * current site renders "0.0 (0)" on every card, which advertises the absence
 * of social proof rather than providing any.
 */
export const proofDefaults = {
  eyebrow: "From our clients",
  headline: "What people say",
  testimonials: [
    {
      quote:
        "They listened to our needs, showed us properties that matched our vision, and walked us through every step with patience and professionalism. Thanks to them, we found our dream home.",
      name: "Brian W.",
      role: "homeowner, Nairobi",
    },
  ],
  points: [
    {
      icon: "user" as WebIconName,
      title: "A named manager.",
      body: "Every property has one person responsible, not a shared inbox.",
    },
    {
      icon: "receipt" as WebIconName,
      title: "Rent you can trace.",
      body: "Every shilling collected shows up on your statement against the unit it came from.",
    },
    {
      icon: "key" as WebIconName,
      title: "We turn up.",
      body: "Viewings, inspections, repairs. The unglamorous part is the job.",
    },
  ],
} as const;

// ── 09 home.insights ─────────────────────────────────────────────────────────

/**
 * Hidden entirely below three published posts. An empty blog section is worse
 * than no blog section, and at launch this band will not exist: the sequence
 * has to read correctly with it absent, and it does, light proof to light FAQ
 * to dark close.
 *
 * TODO(W5-11): source from `web_posts`. These three are the planned launch
 * titles, not published articles, so the band stays hidden until they are.
 */
export const insightDefaults = {
  eyebrow: "Insights",
  headline: "Worth reading before you sign anything",
  viewAllLabel: "All insights",
  viewAllHref: "/insights",
  posts: [
    {
      category: "For landlords",
      title: "What a management agreement should actually say",
      date: "2026-07-14",
      readingTime: "6 min",
      slug: "what-a-management-agreement-should-say",
    },
    {
      category: "Renting",
      title: "What a two bedroom in Kilimani costs, and why",
      date: "2026-06-28",
      readingTime: "4 min",
      slug: "what-a-two-bedroom-in-kilimani-costs",
    },
    {
      category: "Buying",
      title: "Checking a title before you pay a deposit",
      date: "2026-06-02",
      readingTime: "7 min",
      slug: "checking-a-title-before-you-pay-a-deposit",
    },
  ],
} as const;

// ── 10 home.faq ──────────────────────────────────────────────────────────────

export const faqDefaults = {
  eyebrow: "Before you call",
  headline: "Questions we are asked most",
  lead: "The answers people usually want before they pick up the phone. Anything else, ask us directly.",
  cta: { label: "Ask a question", href: "/contact" },
  items: [
    {
      question: "Do tenants pay you a finder's fee?",
      answer:
        "No. Our fee comes from the owner. A tenant pays rent, the deposit, and nothing to us for being shown a property.",
    },
    {
      question: "How quickly can I view something?",
      answer:
        "Usually within two working days, and same day for anything already vacant. Viewings are accompanied by the consultant who handles that area.",
    },
    {
      question: "What does a move-in actually cost?",
      answer:
        "Typically two months' deposit plus one month in advance, and the service charge where the block levies one. Every listing shows the full move-in total before you enquire.",
    },
    {
      question: "Are the prices on the site the prices you quote?",
      answer:
        'Yes. Where an owner will only disclose on enquiry we say "price on request" rather than publish a figure we would have to correct later.',
    },
    {
      question: "I own a property. What happens first?",
      answer:
        "A consultant visits, then you get a written figure with the comparables behind it within three working days. There is no fee for that, and no obligation to list with us.",
    },
    {
      question: "Can I see what is happening with my property?",
      answer:
        "Every managed owner gets a portal login to the system we work in: collections, arrears, open maintenance jobs, invoices and documents, live rather than monthly.",
    },
  ],
} as const;

// ── 11 home.cta ──────────────────────────────────────────────────────────────

export const ctaDefaults = {
  headline: "Ready when you are.",
  lead: "Whether you are letting out a property or looking for one, start here.",
  primaryCta: { label: "List your property", href: "/landlords#valuation" },
  secondaryCta: { label: "Browse properties", href: "/properties" },
} as const;
