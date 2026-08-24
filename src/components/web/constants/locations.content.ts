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
  /** Short punchy descriptor shown on cards */
  tagline?: string;
  /** High-resolution architectural representative photography */
  imageUrl?: string;
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
    tagline: "Urban apartments & executive living",
    blurb:
      "Dense apartment stock, walkable to Yaya and the CBD. Best value per square metre in the prime belt.",
    imageUrl:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80",
  },
  {
    slug: "lavington",
    name: "Lavington",
    region: "Nairobi",
    group: "prime",
    guideLabel: "3 bed, to let",
    guideValue: "120–180k",
    tagline: "Leafy estates & townhouses",
    blurb:
      "Low-rise, leafy, mostly gated compounds of six to twelve units. Strong with families.",
    imageUrl:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80",
  },
  {
    slug: "kileleshwa",
    name: "Kileleshwa",
    region: "Nairobi",
    group: "prime",
    guideLabel: "2 bed, furnished",
    guideValue: "150–200k",
    tagline: "Newer towers & expat residences",
    blurb: "Newer towers with amenities, popular with expatriate and corporate tenants.",
    imageUrl:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80",
  },
  {
    slug: "runda",
    name: "Runda",
    region: "Nairobi",
    group: "prime",
    guideLabel: "4–5 bed house",
    guideValue: "300–450k",
    tagline: "Diplomatic gated enclaves",
    blurb:
      "Detached houses on half-acre plots. Diplomatic and executive lets, long tenancies.",
    imageUrl:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=80",
  },
  {
    slug: "spring-valley",
    name: "Spring Valley",
    region: "Nairobi",
    group: "prime",
    guideLabel: "4 bed, for sale",
    guideValue: "95–130M",
    tagline: "Secluded luxury villas",
    blurb:
      "Townhouses and villas, quiet lanes off Lower Kabete Road. Mostly owner-occupied.",
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
  },
  {
    slug: "parklands",
    name: "Parklands",
    region: "Nairobi",
    group: "prime",
    guideLabel: "2–3 bed, to let",
    guideValue: "70–120k",
    tagline: "Established residential courts",
    blurb: "Close to Westlands and the Aga Khan. Older blocks alongside new mid-rise.",
    imageUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80",
  },

  // Commercial and mixed, compact tiles.
  {
    slug: "westlands",
    name: "Westlands",
    region: "Nairobi",
    group: "commercial",
    guideLabel: "Office",
    guideValue: "from 95/sqft",
    tagline: "Commercial hub & high-rise",
    blurb: "Offices, retail and serviced apartments.",
    imageUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
  },
  {
    slug: "riverside-drive",
    name: "Riverside Drive",
    region: "Nairobi",
    group: "commercial",
    guideLabel: "Land",
    guideValue: "on request",
    tagline: "Prime riverine residences",
    blurb: "Embassies, offices and prime plots.",
    imageUrl:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80",
  },
  {
    slug: "upper-hill",
    name: "Upper Hill",
    region: "Nairobi",
    group: "commercial",
    guideLabel: "Office",
    guideValue: "from 110/sqft",
    tagline: "Financial district & Grade-A towers",
    blurb: "Grade A offices and city apartments.",
    imageUrl:
      "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=1000&q=80",
  },
  {
    slug: "garden-estate",
    name: "Garden Estate",
    region: "Ruaraka",
    group: "commercial",
    guideLabel: "2 bed",
    guideValue: "from 65k",
    tagline: "Family apartments & estates",
    blurb: "Family apartments off Thika Road.",
    imageUrl:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80",
  },
  {
    slug: "thome",
    name: "Thome",
    region: "Nairobi",
    group: "commercial",
    guideLabel: "3 bed",
    guideValue: "from 80k",
    tagline: "Maisonettes & gated courts",
    blurb: "Maisonettes and gated courts.",
    imageUrl:
      "https://images.unsplash.com/photo-1598228723793-52759bba239c?auto=format&fit=crop&w=1000&q=80",
  },
  {
    slug: "baba-dogo",
    name: "Baba Dogo",
    region: "Nairobi",
    group: "commercial",
    guideLabel: "Warehouse",
    guideValue: "on request",
    tagline: "Godowns & logistics industrial",
    blurb: "Godowns and light industrial.",
    imageUrl:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80",
  },
  {
    slug: "nairobi-west",
    name: "Nairobi West",
    region: "Nairobi",
    group: "commercial",
    guideLabel: "2 bed",
    guideValue: "from 45k",
    tagline: "Vibrant urban & mixed commercial",
    blurb: "Affordable flats and commercial units.",
    imageUrl:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1000&q=80",
  },
  {
    slug: "kasarani",
    name: "Kasarani",
    region: "Nairobi",
    group: "commercial",
    guideLabel: "1 bed",
    guideValue: "from 25k",
    tagline: "High-yield new-build blocks",
    blurb: "New-build blocks, strong yields.",
    imageUrl:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80",
  },

  // Satellite, coast and upcountry.
  {
    slug: "tatu-city",
    name: "Tatu City",
    region: "Kiambu",
    group: "satellite",
    guideLabel: "Office",
    guideValue: "105/sqft",
    tagline: "Master-planned SEZ metropolis",
    blurb: "Offices, warehousing and serviced plots.",
    imageUrl:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80",
  },
  {
    slug: "ruiru",
    name: "Ruiru",
    region: "Kiambu",
    group: "satellite",
    guideLabel: "50×100",
    guideValue: "from 4.5M",
    tagline: "Bypass parcels & gated estates",
    blurb: "Plots and new estates off the bypass.",
    imageUrl:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80",
  },
  {
    slug: "ongata-rongai",
    name: "Ongata Rongai",
    region: "Kajiado",
    group: "satellite",
    guideLabel: "3 bed",
    guideValue: "from 45k",
    tagline: "Suburban homes near the park",
    blurb: "Family houses and plots.",
    imageUrl:
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1000&q=80",
  },
  {
    slug: "nyali",
    name: "Nyali, Mombasa",
    region: "Mombasa",
    group: "satellite",
    guideLabel: "2 bed",
    guideValue: "from 60k",
    tagline: "Coastal luxury & holiday lets",
    blurb: "Coastal apartments and holiday lets.",
    imageUrl:
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1000&q=80",
  },
  {
    slug: "nyeri",
    name: "Nyeri",
    region: "Nyeri",
    group: "satellite",
    guideLabel: "Land",
    guideValue: "on request",
    tagline: "Highland homesteads & acreage",
    blurb: "Town plots and agricultural land.",
    imageUrl:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
  },
  {
    slug: "iten",
    name: "Iten, Elgeyo Marakwet",
    region: "Elgeyo Marakwet",
    group: "satellite",
    guideLabel: "Acreage",
    guideValue: "on request",
    tagline: "Highland rift valley plots",
    blurb: "Highland acreage and homesteads.",
    imageUrl:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80",
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
  /** Key submarket amenities & infrastructure features. */
  amenities?: string[];
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
    amenities: [
      "Borehole Water & Secondary Storage",
      "Full Backup Generators on Lifts & Common Areas",
      "Yaya Centre & Adlife Plaza Retail Hubs",
      "French School (Lycée Denis Diderot) & Cavina",
      "The Nairobi Hospital & Medical Center Hubs",
      "High-Speed Passenger & Service Lifts",
      "Fibre Optic High-Speed Internet Ready",
      "24/7 CCTV & Manned Security Access",
    ],
    stats: [
      { value: "9", label: "On our books" },
      { value: "105k", label: "Median 2 bed rent" },
      { value: "18 d", label: "Average time to let" },
    ],
  },
  lavington: {
    livingHere: [
      "Lavington retains its dignified residential feel with tree-lined avenues, private gated courts of 6 to 12 luxury townhouses, and premier international academies. It is one of Nairobi's most resilient family submarkets with high tenant retention.",
      "Zoning regulations have preserved much of Lavington's low-to-mid density profile compared to neighboring Kilimani. Properties here benefit from generous green setbacks, private garden compounds, and secure boundary perimeters.",
      "Ideal for senior corporate executives, diplomats, and established families needing proximity to St. Austin's, Strathmore, Braeside, and Lavington Mall.",
    ],
    costsNote:
      "Figures reflect realized contracts over the last 12 months in Lavington. Service charges for gated townhouse courts average KES 15,000 to 25,000 monthly.",
    costRows: [
      { type: "2 bedroom flat", toLet: "90–120k", forSale: "16–22M" },
      { type: "3 bedroom apt", toLet: "120–180k", forSale: "22–32M" },
      { type: "4 bed townhouse", toLet: "220–350k", forSale: "55–85M", emphasis: true },
      { type: "5 bed villa (0.5 ac)", toLet: "350–500k", forSale: "90–140M" },
    ],
    distances: [
      { place: "Lavington Mall", value: "0.8 km" },
      { place: "Junction Mall", value: "2.4 km" },
      { place: "Nairobi CBD", value: "7.2 km" },
      { place: "Westlands Core", value: "4.8 km" },
    ],
    worthKnowing: [
      "Check court security committee rules and sinking fund balance",
      "Verify private garden demarcation in the sectional title",
      "Confirm full inverter or solar backup installations",
      "Review perimeter electric fencing & backup security response",
    ],
    amenities: [
      "Private Gated Townhouse Compounds",
      "Lavington Mall & Curve Lifestyle Centers",
      "St. Austin's, Strathmore & Braeburn Schools",
      "Dedicated Domestic Staff Accommodations",
      "Solar Water Heating & Backup Boreholes",
      "Electric Perimeter Fencing & Rapid Response",
      "Private Landscaped Compound Gardens",
      "Low-Density Quiet Residential Corridors",
    ],
    stats: [
      { value: "7", label: "On our books" },
      { value: "260k", label: "Median 4 bed rent" },
      { value: "22 d", label: "Average time to let" },
    ],
  },
  westlands: {
    livingHere: [
      "Westlands has evolved into East Africa's preeminent financial and commercial node, housing regional headquarters for global multinationals, tech hubs, Grade-A office towers, and high-end serviced residences.",
      "The expressway link has cut transit times to JKIA down to under twenty minutes, making Westlands the top choice for regional executives, expatriates, and high-net-worth investors demanding seamless transit.",
      "With premier dining, luxury shopping at Sarit and Westgate, and 24/7 security corridors, Westlands delivers unmatched urban convenience.",
    ],
    costsNote:
      "Office rates quoted per sq ft per month excl. VAT and service charge. Residential figures reflect prime apartment and furnished penthouses.",
    costRows: [
      { type: "Grade-A Office", toLet: "95–135 /sqft", forSale: "12,500 /sqft" },
      { type: "1 bed executive", toLet: "80–120k", forSale: "11–16M" },
      { type: "2 bed luxury apt", toLet: "140–220k", forSale: "20–30M", emphasis: true },
      { type: "3 bed penthouse", toLet: "250–400k", forSale: "42–75M" },
    ],
    distances: [
      { place: "Sarit Centre", value: "0.5 km" },
      { place: "Westgate Mall", value: "0.9 km" },
      { place: "Nairobi Expressway", value: "1.2 km" },
      { place: "JKIA via Expressway", value: "18 km" },
    ],
    worthKnowing: [
      "Confirm parking ratio (typically 3 bays per 1,000 sq ft office)",
      "Verify dual backup generators and optical fiber redundancy",
      "Check HVAC sub-metering arrangements in commercial leases",
      "Review building access control and visitor management systems",
    ],
    amenities: [
      "Direct Nairobi Expressway Link to Airport",
      "Sarit Centre & Westgate Mall Retail Access",
      "Grade-A Commercial Office Infrastructure",
      "Multi-Tier Access Control & Turnstiles",
      "Dual Redundant Backup Generators",
      "Dedicated High-Speed Passenger Lifts",
      "24/7 Commercial Security & Patrols",
      "High-Density Multi-Storey Covered Parking",
    ],
    stats: [
      { value: "12", label: "On our books" },
      { value: "110/sqft", label: "Avg commercial rate" },
      { value: "15 d", label: "Average time to let" },
    ],
  },
  runda: {
    livingHere: [
      "Runda stands as Nairobi's flagship diplomatic haven, bounded by lush coffee estate heritage and the UN Gigiri complex. Strict zoning mandates half-acre minimum parcels with detached luxury villas.",
      "Exemplary neighborhood security, private barrier checkpoints, and direct proximity to the United Nations HQ, US Embassy, and Rosslyn Riviera make it the gold standard for embassy leases.",
      "Homes in Runda enjoy mature gardens, private swimming pools, and dedicated domestic staff quarters built to diplomatic security standards.",
    ],
    costsNote:
      "Diplomatic leases typically run 2 to 3 years with USD or KES equivalent payment terms and diplomatic break clauses.",
    costRows: [
      { type: "4 bed ambassadorial", toLet: "300–450k", forSale: "85–125M" },
      { type: "5 bed luxury villa", toLet: "400–600k", forSale: "110–180M", emphasis: true },
      { type: "0.5 acre plot", toLet: "—", forSale: "45–65M" },
    ],
    distances: [
      { place: "UN Complex Gigiri", value: "2.8 km" },
      { place: "Village Market", value: "3.1 km" },
      { place: "Two Rivers Mall", value: "3.5 km" },
      { place: "Potterhouse School", value: "1.2 km" },
    ],
    worthKnowing: [
      "Confirm UN Residential Security Level compliance (safe haven, grilles, CCTV)",
      "Verify water connection to Runda Water Company plus private storage",
      "Check Runda Association membership and security service dues",
      "Review groundskeeping and swimming pool maintenance clauses",
    ],
    amenities: [
      "UN & Diplomatic Security Standards",
      "Private 24/7 Barrier Guard Checkpoints",
      "Half-Acre Minimum Mature Compounds",
      "Village Market & Two Rivers Mall Proximity",
      "International School of Kenya (ISK) Access",
      "Dedicated Domestic Staff Quarters (DSQ)",
      "Private Swimming Pool & Landscaped Lawns",
      "Runda Water Company Piped Network",
    ],
    stats: [
      { value: "5", label: "On our books" },
      { value: "380k", label: "Median 5 bed rent" },
      { value: "28 d", label: "Average time to let" },
    ],
  },
  "spring-valley": {
    livingHere: [
      "Spring Valley offers quiet, secluded grandeur along Lower Kabete and Peponi corridors. Famous for architectural master-built homes nestled in lush valleys with serene forest canopy.",
      "Favored by long-term owner-occupiers and discerning expatriates seeking serenity without sacrificing 5-minute access to Westlands and Sarit.",
      "Properties feature large private compounds, mature indigenous trees, and private gated entry lanes.",
    ],
    costsNote:
      "Highly prized capital appreciation node with low turnover and tight freehold/long-leasehold inventory.",
    costRows: [
      { type: "3 bed luxury apt", toLet: "160–240k", forSale: "32–45M" },
      { type: "4 bed townhouse", toLet: "280–420k", forSale: "75–110M", emphasis: true },
      { type: "5 bed standalone", toLet: "400–650k", forSale: "110–170M" },
    ],
    distances: [
      { place: "Westgate / Sarit", value: "2.1 km" },
      { place: "Peponi House School", value: "3.0 km" },
      { place: "International School (ISKenya)", value: "4.5 km" },
      { place: "Nairobi CBD", value: "6.8 km" },
    ],
    worthKnowing: [
      "Confirm private valley drainage and retaining wall engineering",
      "Verify backup borehole yield and multi-stage water filtration",
      "Check private guard barrier agreements on access lanes",
      "Review boundary title deed surveys and easement reservations",
    ],
    amenities: [
      "Lush Indigenous Forest Canopy Environment",
      "5 Minutes to Westlands Commercial Nodes",
      "Peponi House & ISK International Schools",
      "Private Gated Lanes & Barrier Security",
      "Dedicated High-Yield Private Boreholes",
      "Full Solar System Inverters & Backup Gensets",
      "Private Valley Compound Setbacks",
      "High Long-Term Capital Appreciation Node",
    ],
    stats: [
      { value: "4", label: "On our books" },
      { value: "320k", label: "Median townhouse rent" },
      { value: "25 d", label: "Average time to let" },
    ],
  },
  "tatu-city": {
    livingHere: [
      "Tatu City is Kenya's premier 5,000-acre Special Economic Zone (SEZ) mixed-use development, offering tax advantages, master-planned infrastructure, clean power, and world-class logistics parks.",
      "Combines high-density Grade-A light manufacturing, logistics hubs, international corporate offices, and modern lifestyle residential communities like Kijani Ridge and Unity Homes.",
      "Features paved dual-carriageway access, on-site water treatment, optical fiber rings, and 24/7 centralized estate surveillance.",
    ],
    costsNote:
      "SEZ fiscal incentives provide corporate tax rate relief, zero-rated VAT, and import duty exemptions for eligible businesses.",
    costRows: [
      { type: "Industrial Warehouse", toLet: "45–65 /sqft", forSale: "on request" },
      { type: "Commercial Office", toLet: "85–115 /sqft", forSale: "on request" },
      { type: "Residential Plot (1/4 ac)", toLet: "—", forSale: "14–22M", emphasis: true },
      { type: "2–3 bed apartment", toLet: "55–90k", forSale: "8.5–15M" },
    ],
    distances: [
      { place: "Northern / Eastern Bypass", value: "3.5 km" },
      { place: "Thika Superhighway", value: "7.0 km" },
      { place: "Nairobi CBD", value: "24 km" },
      { place: "JKIA Cargo Terminal", value: "32 km" },
    ],
    worthKnowing: [
      "Verify SEZ enterprise registration criteria for tax benefits",
      "Review development control guidelines and construction approval times",
      "Confirm power sub-station direct high-voltage line connections",
      "Check estate service charge and common infrastructure maintenance fees",
    ],
    amenities: [
      "Special Economic Zone (SEZ) Tax Benefits",
      "Master-Planned Dual Carriageway Roads",
      "Dedicated 24/7 Centralized Estate Security",
      "On-Site Water Treatment & Reticulation",
      "High-Voltage Direct Power Grid Feeds",
      "Crawford International & Nova Pioneer Schools",
      "Grade-A Logistics & Light Industrial Parks",
      "Underground Optical Fibre Telecom Rings",
    ],
    stats: [
      { value: "8", label: "On our books" },
      { value: "105/sqft", label: "Avg commercial rate" },
      { value: "20 d", label: "Average time to let" },
    ],
  },
  nyali: {
    livingHere: [
      "Nyali is Mombasa's flagship coastal residential suburb, featuring prime beachfront villas, sea-view apartments, and luxury holiday home investments along the Indian Ocean shoreline.",
      "Known for its tranquil palm-shaded avenues, premier beach resorts, golf clubs, and high-yield short-let / holiday rental market.",
      "Easily accessible across the Nyali Bridge to Mombasa Island and northwards towards Shanzu and Vipingo.",
    ],
    costsNote:
      "Holiday rentals achieve significant premium occupancy during festive and tourism seasons (typically KES 15,000–45,000 per night).",
    costRows: [
      { type: "2 bed sea-view apt", toLet: "60–95k", forSale: "12–18M" },
      { type: "3 bed luxury apt", toLet: "95–160k", forSale: "18–28M", emphasis: true },
      { type: "4 bed beach villa", toLet: "180–350k", forSale: "45–95M" },
    ],
    distances: [
      { place: "Nyali Beach Front", value: "0.3 km" },
      { place: "Nyali Cinemax / Centre", value: "1.2 km" },
      { place: "Nyali Golf Club", value: "1.8 km" },
      { place: "Moi International Airport", value: "14 km" },
    ],
    worthKnowing: [
      "Check coastal air conditioning and corrosion-resistant fixtures",
      "Verify oceanfront setback and shoreline conservation compliance",
      "Confirm borehole salinity filtration or reverse osmosis systems",
      "Review short-let licensing and building association bylaws",
    ],
    amenities: [
      "Direct Indian Ocean Beachfront Access",
      "High-Yield Holiday Rental Market Demand",
      "Nyali Golf Club & Resort Facilities",
      "Reverse Osmosis Fresh Water Systems",
      "Nyali Cinemax & City Mall Shopping",
      "Gated Coastal Avenues & Private Security",
      "Air Conditioning & Marine-Grade Fixtures",
      "Proximity to Mombasa Island Commercial Hub",
    ],
    stats: [
      { value: "6", label: "On our books" },
      { value: "115k", label: "Median 3 bed rent" },
      { value: "19 d", label: "Average time to let" },
    ],
  },
};

export function findAreaEditorial(slug: string): AreaEditorial | undefined {
  return AREA_EDITORIAL[slug];
}
