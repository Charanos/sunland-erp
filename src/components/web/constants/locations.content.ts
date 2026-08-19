/**
 * The areas Sunland covers, from the Claude Design areas template.
 *
 * Three groups, because they are read differently: the prime residential belt
 * gets photo cards because that is where most tenant searches start, and the
 * commercial and satellite areas get compact tiles because someone looking
 * for a godown in Baba Dogo is scanning for the name, not the view.
 *
 * ── On the guide prices ──
 *
 * Every tile carries a guide figure, and the hero says these come from
 * properties we let rather than asking prices seen elsewhere. That claim has
 * to be true, so these are marked as the design's estimates and the area
 * detail page computes its price table from live inventory instead.
 *
 * TODO(W1-2): move to `web_locations` and compute the guide from the same
 * aggregate the detail page uses, so the hub and the detail page can never
 * disagree. Until then the hub is guidance and the detail page is evidence,
 * and only the detail page states a basis.
 *
 * ── On the count ──
 *
 * The design's h1 reads "Fifteen areas" while the template lists twenty
 * tiles. The page derives the number from this array rather than hardcoding
 * either, so the headline cannot drift from what is on the page.
 */

export type AreaGroup = "prime" | "commercial" | "satellite";

export type WebArea = {
  slug: string;
  name: string;
  region: string;
  group: AreaGroup;
  /** Guide price label and figure, e.g. "2 bed, to let" / "85–130k". */
  guideLabel: string;
  guideValue: string;
  blurb: string;
};

export const AREA_GROUPS: { id: AreaGroup; title: string }[] = [
  { id: "prime", title: "Nairobi, prime residential" },
  { id: "commercial", title: "Nairobi, commercial and mixed" },
  { id: "satellite", title: "Satellite towns, coast and upcountry" },
];

export const WEB_AREAS: WebArea[] = [
  // Prime residential, rendered as photo cards.
  {
    slug: "kilimani",
    name: "Kilimani",
    region: "Nairobi",
    group: "prime",
    guideLabel: "2 bed, to let",
    guideValue: "85–130k",
    blurb:
      "Dense apartment stock, walkable to Yaya and the CBD. Best value per square metre in the prime belt.",
  },
  {
    slug: "lavington",
    name: "Lavington",
    region: "Nairobi",
    group: "prime",
    guideLabel: "3 bed, to let",
    guideValue: "120–180k",
    blurb:
      "Low-rise, leafy, mostly gated compounds of six to twelve units. Strong with families.",
  },
  {
    slug: "kileleshwa",
    name: "Kileleshwa",
    region: "Nairobi",
    group: "prime",
    guideLabel: "2 bed, furnished",
    guideValue: "150–200k",
    blurb: "Newer towers with amenities, popular with expatriate and corporate tenants.",
  },
  {
    slug: "runda",
    name: "Runda",
    region: "Nairobi",
    group: "prime",
    guideLabel: "4–5 bed house",
    guideValue: "300–450k",
    blurb:
      "Detached houses on half-acre plots. Diplomatic and executive lets, long tenancies.",
  },
  {
    slug: "spring-valley",
    name: "Spring Valley",
    region: "Nairobi",
    group: "prime",
    guideLabel: "4 bed, for sale",
    guideValue: "95–130M",
    blurb:
      "Townhouses and villas, quiet lanes off Lower Kabete Road. Mostly owner-occupied.",
  },
  {
    slug: "parklands",
    name: "Parklands",
    region: "Nairobi",
    group: "prime",
    guideLabel: "2–3 bed, to let",
    guideValue: "70–120k",
    blurb: "Close to Westlands and the Aga Khan. Older blocks alongside new mid-rise.",
  },

  // Commercial and mixed, compact tiles.
  {
    slug: "westlands",
    name: "Westlands",
    region: "Nairobi",
    group: "commercial",
    guideLabel: "Office",
    guideValue: "from 95/sqft",
    blurb: "Offices, retail and serviced apartments.",
  },
  {
    slug: "riverside-drive",
    name: "Riverside Drive",
    region: "Nairobi",
    group: "commercial",
    guideLabel: "Land",
    guideValue: "on request",
    blurb: "Embassies, offices and prime plots.",
  },
  {
    slug: "upper-hill",
    name: "Upper Hill",
    region: "Nairobi",
    group: "commercial",
    guideLabel: "Office",
    guideValue: "from 110/sqft",
    blurb: "Grade A offices and city apartments.",
  },
  {
    slug: "garden-estate",
    name: "Garden Estate",
    region: "Ruaraka",
    group: "commercial",
    guideLabel: "2 bed",
    guideValue: "from 65k",
    blurb: "Family apartments off Thika Road.",
  },
  {
    slug: "thome",
    name: "Thome",
    region: "Nairobi",
    group: "commercial",
    guideLabel: "3 bed",
    guideValue: "from 80k",
    blurb: "Maisonettes and gated courts.",
  },
  {
    slug: "baba-dogo",
    name: "Baba Dogo",
    region: "Nairobi",
    group: "commercial",
    guideLabel: "Warehouse",
    guideValue: "on request",
    blurb: "Godowns and light industrial.",
  },
  {
    slug: "nairobi-west",
    name: "Nairobi West",
    region: "Nairobi",
    group: "commercial",
    guideLabel: "2 bed",
    guideValue: "from 45k",
    blurb: "Affordable flats and commercial units.",
  },
  {
    slug: "kasarani",
    name: "Kasarani",
    region: "Nairobi",
    group: "commercial",
    guideLabel: "1 bed",
    guideValue: "from 25k",
    blurb: "New-build blocks, strong yields.",
  },

  // Satellite, coast and upcountry.
  {
    slug: "tatu-city",
    name: "Tatu City",
    region: "Kiambu",
    group: "satellite",
    guideLabel: "Office",
    guideValue: "105/sqft",
    blurb: "Offices, warehousing and serviced plots.",
  },
  {
    slug: "ruiru",
    name: "Ruiru",
    region: "Kiambu",
    group: "satellite",
    guideLabel: "50×100",
    guideValue: "from 4.5M",
    blurb: "Plots and new estates off the bypass.",
  },
  {
    slug: "ongata-rongai",
    name: "Ongata Rongai",
    region: "Kajiado",
    group: "satellite",
    guideLabel: "3 bed",
    guideValue: "from 45k",
    blurb: "Family houses and plots.",
  },
  {
    slug: "nyali",
    name: "Nyali, Mombasa",
    region: "Mombasa",
    group: "satellite",
    guideLabel: "2 bed",
    guideValue: "from 60k",
    blurb: "Coastal apartments and holiday lets.",
  },
  {
    slug: "nyeri",
    name: "Nyeri",
    region: "Nyeri",
    group: "satellite",
    guideLabel: "Land",
    guideValue: "on request",
    blurb: "Town plots and agricultural land.",
  },
  {
    slug: "iten",
    name: "Iten, Elgeyo Marakwet",
    region: "Elgeyo Marakwet",
    group: "satellite",
    guideLabel: "Acreage",
    guideValue: "on request",
    blurb: "Highland acreage and homesteads.",
  },
];

export const AREAS_HERO = {
  eyebrow: "Where we work",
  /** `{count}` is replaced with the real number of areas below. */
  headlineTemplate: "{count} areas, and what they cost.",
  lead: "We manage and sell in these neighbourhoods, which means the price guidance below comes from properties we actually let, not from asking prices we saw elsewhere.",
} as const;

export const AREAS_CTA = {
  title: "Somewhere we have not listed?",
  body: "We take on properties outside these areas where we can service them properly. If we cannot, we will say so rather than take the mandate and leave it sitting.",
  ctas: [
    { label: "Ask about your area", href: "/landlords#valuation", variant: "primary" as const },
    { label: "Contact us", href: "/contact", variant: "outline" as const },
  ],
} as const;

export function findArea(slug: string): WebArea | undefined {
  return WEB_AREAS.find((area) => area.slug === slug);
}

// ── Per-area editorial ───────────────────────────────────────────────────────

/**
 * Long-form area content, from the Claude Design area detail template.
 *
 * The design writes one area in full, Kilimani, as the pattern. The other
 * nineteen are deliberately absent rather than filled with invented prose:
 * this template's whole value is that it says true, specific things about a
 * neighbourhood ("mains supply is unreliable, so a block without a borehole
 * will end up buying water"), and generated filler would destroy exactly the
 * credibility it exists to build.
 *
 * The detail page renders each block only where content exists. An area
 * without editorial still gets a complete page: hero, live price table
 * computed from inventory, available listings, nearby areas and the valuation
 * ask. It simply does not pretend to have an opinion it has not formed.
 *
 * TODO(W5-9): commission the remaining nineteen from the consultants who
 * cover them. `livingHere` and `worthKnowing` are the two that matter; the
 * cost table already computes itself.
 */

export type AreaEditorial = {
  /** Three paragraphs on what living there is actually like. */
  livingHere: string[];
  /** Basis line above the guide cost table. */
  costsNote: string;
  /** Guide ranges. Distinct from the computed table: these are wider bands. */
  costRows: { type: string; toLet: string; forSale: string; emphasis?: boolean }[];
  distances: { place: string; value: string }[];
  worthKnowing: string[];
  /** Headline figures for the hero strip. */
  stats: { value: string; label: string }[];
};

export const AREA_EDITORIAL: Record<string, AreaEditorial> = {
  kilimani: {
    livingHere: [
      "Kilimani changed from a suburb of bungalows into a district of apartment blocks in about fifteen years, and the results are uneven. The best buildings have a borehole, a generator, a lift that works and parking that is not a daily argument. The worst have none of those and cost almost the same, which is why viewing matters more here than anywhere else in the city.",
      "Traffic on Argwings Kodhek and Ngong Road is the honest downside. Water is the other: mains supply is unreliable, so a block without a borehole and adequate storage will end up buying water, and that cost lands on the service charge.",
      "It suits young professionals, couples, and small families who want Yaya, Adams and the CBD within a short drive. It suits investors too: two bedroom units let quickly and the tenant pool is deep.",
    ],
    costsNote:
      "Ranges from properties we let or sold in Kilimani over the last twelve months. Service charge is on top of rent and typically runs KES 5,000 to 12,000 a month.",
    costRows: [
      { type: "Studio", toLet: "45–60k", forSale: "6.5–8.5M" },
      { type: "1 bedroom", toLet: "60–80k", forSale: "8.5–12M" },
      { type: "2 bedroom", toLet: "85–130k", forSale: "13–19M", emphasis: true },
      { type: "3 bedroom", toLet: "120–180k", forSale: "19–28M" },
      { type: "3 bed, furnished", toLet: "180–250k", forSale: "—" },
    ],
    distances: [
      { place: "Yaya Centre", value: "1.5 km" },
      { place: "Nairobi CBD", value: "5.0 km" },
      { place: "Nairobi Hospital", value: "3.2 km" },
      { place: "JKIA", value: "19 km" },
    ],
    worthKnowing: [
      "Ask whether the block has a borehole",
      "Check the generator covers the lifts",
      "Confirm parking bays per unit, not per block",
      "Service charge should be itemised in the lease",
    ],
    stats: [
      { value: "9", label: "On our books" },
      { value: "105k", label: "Median 2 bed rent" },
      { value: "18 d", label: "Average time to let" },
    ],
  },
};

export function findAreaEditorial(slug: string): AreaEditorial | undefined {
  return AREA_EDITORIAL[slug];
}
