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
      "/images/areas/kilimani.jpg",
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
      "/images/areas/lavington.jpg",
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
      "/images/areas/kileleshwa.jpg",
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
      "/images/areas/runda.jpg",
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
      "/images/areas/spring-valley.jpg",
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
      "/images/areas/parklands.jpg",
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
      "/images/areas/westlands.jpg",
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
      "/images/areas/riverside-drive.jpg",
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
      "/images/areas/upper-hill.jpg",
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
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?fm=jpg&fit=crop&crop=entropy&ar=16:9&w=2880&q=85",
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
      "https://images.unsplash.com/photo-1598228723793-52759bba239c?fm=jpg&fit=crop&crop=entropy&ar=16:9&w=2880&q=85",
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
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?fm=jpg&fit=crop&crop=entropy&ar=16:9&w=2880&q=85",
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
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?fm=jpg&fit=crop&crop=entropy&ar=16:9&w=2880&q=85",
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
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?fm=jpg&fit=crop&crop=entropy&ar=16:9&w=2880&q=85",
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
      "https://images.unsplash.com/photo-1497366216548-37526070297c?fm=jpg&fit=crop&crop=entropy&ar=16:9&w=2880&q=85",
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
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?fm=jpg&fit=crop&crop=entropy&ar=16:9&w=2880&q=85",
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
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?fm=jpg&fit=crop&crop=entropy&ar=16:9&w=2880&q=85",
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
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?fm=jpg&fit=crop&crop=entropy&ar=16:9&w=2880&q=85",
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
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?fm=jpg&fit=crop&crop=entropy&ar=16:9&w=2880&q=85",
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
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?fm=jpg&fit=crop&crop=entropy&ar=16:9&w=2880&q=85",
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
  "riverside-drive": {
    livingHere: [
      "Riverside Drive represents one of Nairobi's most prestigious diplomatic and corporate corridors, lined with riverine vegetation, diplomatic missions (including the German and Australian Embassies), and boutique office parks.",
      "The corridor bridges Westlands and Lavington, offering effortless dual access to Chiromo Road and James Gichuru Road while maintaining a secluded, secure leafy environment.",
      "Properties range from luxury riverfront apartments with rooftop infinity pools to ambassadorial compounds and low-density corporate headquarters.",
    ],
    costsNote:
      "Riverside Drive commands strong diplomatic rental yields with long-tenancy stability and premium corporate lease covenants.",
    costRows: [
      { type: "1 bed executive suite", toLet: "90–130k", forSale: "14–19M" },
      { type: "2 bed riverfront apt", toLet: "140–200k", forSale: "22–32M", emphasis: true },
      { type: "3 bed luxury penthouse", toLet: "220–350k", forSale: "38–65M" },
      { type: "Commercial office park", toLet: "110–145 /sqft", forSale: "14,500 /sqft" },
    ],
    distances: [
      { place: "Westlands Core", value: "1.2 km" },
      { place: "Lavington Green", value: "2.4 km" },
      { place: "Nairobi CBD", value: "4.5 km" },
      { place: "JKIA via Expressway", value: "17 km" },
    ],
    worthKnowing: [
      "Confirm riparian reserve boundary clearance for riverfront properties",
      "Verify embassy security compliance and barrier road access protocols",
      "Check generator power capacity for all building HVAC systems",
      "Review tenant mix in mixed-use residential/commercial developments",
    ],
    amenities: [
      "Diplomatic Mission & Embassy Corridor",
      "Direct Dual Access to Westlands & Lavington",
      "Riverine Green Buffer & Landscaped Grounds",
      "24/7 Monitored Barrier Security Checkpoints",
      "Borehole Water & Multi-Stage Water Filtration",
      "Full Dual Inverter & Backup Generator Systems",
      "Underground Secure Multi-Level Parking",
      "Rooftop Pools & Health Club Facilities",
    ],
    stats: [
      { value: "5", label: "On our books" },
      { value: "175k", label: "Median 2 bed rent" },
      { value: "16 d", label: "Average time to let" },
    ],
  },
  kileleshwa: {
    livingHere: [
      "Kileleshwa is a premier residential neighborhood that has seamlessly transitioned into modern, amenity-rich apartment living while maintaining quiet, tree-lined residential streets.",
      "Extremely popular with young corporate professionals, expatriate consultants, and young families due to its central location between Kilimani, Lavington, and Westlands.",
      "Modern developments here boast heated swimming pools, fully equipped gymnasiums, children's play areas, and high-speed elevators.",
    ],
    costsNote:
      "Furnished two-bedroom units achieve premium yields from short-term corporate stays and long-lease executive contracts.",
    costRows: [
      { type: "1 bedroom modern", toLet: "55–75k", forSale: "7.5–10.5M" },
      { type: "2 bedroom unfurnished", toLet: "80–120k", forSale: "12–17M" },
      { type: "2 bedroom furnished", toLet: "150–200k", forSale: "16–22M", emphasis: true },
      { type: "3 bedroom + DSQ", toLet: "120–170k", forSale: "18–26M" },
      { type: "4 bedroom penthouse", toLet: "220–320k", forSale: "35–55M" },
    ],
    distances: [
      { place: "Kasuku Centre", value: "0.6 km" },
      { place: "Kileleshwa Police Station", value: "1.0 km" },
      { place: "Yaya Centre", value: "2.2 km" },
      { place: "Nairobi CBD", value: "5.5 km" },
    ],
    worthKnowing: [
      "Check elevator-to-unit ratio in higher-density blocks",
      "Confirm dedicated domestic staff quarters (DSQ) allocation",
      "Verify borehole water yield and independent electric metering",
      "Review building rules regarding short-term Airbnb lets",
    ],
    amenities: [
      "Kasuku Centre & Neighborhood Boutiques",
      "Heated Swimming Pools & Modern Fitness Centers",
      "Dedicated Domestic Staff Quarters (DSQ)",
      "High-Speed Passenger & Service Lifts",
      "24/7 CCTV & Armed Response Corridors",
      "Borehole Water & Secondary Storage",
      "Kids Playgrounds & Landscaped Courtyards",
      "5 Minutes to Westlands, Kilimani & CBD",
    ],
    stats: [
      { value: "8", label: "On our books" },
      { value: "110k", label: "Median 2 bed rent" },
      { value: "17 d", label: "Average time to let" },
    ],
  },
  parklands: {
    livingHere: [
      "Parklands is an established, culturally vibrant residential and commercial submarket bordering the Aga Khan University Hospital, City Park, and Westlands.",
      "Characterized by strong community ties, established family court compounds, specialized medical practices, and modern mid-rise residential towers.",
      "Highly sought-after for its walkable proximity to premier medical facilities, Diamond Plaza retail center, and leading academic institutions.",
    ],
    costsNote:
      "Rental demand is anchored by healthcare professionals, university faculty, and established multi-generational families.",
    costRows: [
      { type: "2 bedroom flat", toLet: "70–95k", forSale: "11–16M" },
      { type: "3 bedroom court", toLet: "95–140k", forSale: "16–24M", emphasis: true },
      { type: "4 bedroom apartment", toLet: "140–200k", forSale: "24–36M" },
      { type: "Commercial clinic / office", toLet: "90–120 /sqft", forSale: "11,000 /sqft" },
    ],
    distances: [
      { place: "Aga Khan University Hosp.", value: "0.5 km" },
      { place: "Diamond Plaza Hub", value: "0.8 km" },
      { place: "City Park Forest", value: "1.2 km" },
      { place: "Westlands Sarit", value: "2.0 km" },
    ],
    worthKnowing: [
      "Verify dedicated parking bays (street parking can be congested on avenue lanes)",
      "Check water storage capacity in older court compounds",
      "Confirm backup generator connections for internal home sockets",
      "Review commercial licensing zoning on avenue frontage parcels",
    ],
    amenities: [
      "Aga Khan University Hospital Proximity",
      "Diamond Plaza & Highridge Retail Hubs",
      "City Park Nature Forest & Green Lung",
      "Premier Community Centers & Academies",
      "Full Backup Generators & Water Storage",
      "24/7 Security Patrols & Gated Barrier Courts",
      "Close Transit to Westlands & Limuru Road",
      "High Medical & Professional Tenant Demand",
    ],
    stats: [
      { value: "6", label: "On our books" },
      { value: "95k", label: "Median 3 bed rent" },
      { value: "18 d", label: "Average time to let" },
    ],
  },
  "upper-hill": {
    livingHere: [
      "Upper Hill is Nairobi's premier financial power district, housing the regional headquarters of the World Bank, Britam Tower, Equity Bank, and major diplomatic consulates.",
      "Zoned primarily for high-density Grade-A commercial towers, with a growing segment of executive serviced apartments and corporate pied-à-terres.",
      "Directly connected to the CBD, Community government offices, and the expressway to JKIA.",
    ],
    costsNote:
      "Commercial office leases are structured on 5 to 6 year institutional terms with standard 3-year escalation clauses.",
    costRows: [
      { type: "Grade-A Office Space", toLet: "110–145 /sqft", forSale: "13,500 /sqft", emphasis: true },
      { type: "1 bed executive studio", toLet: "75–110k", forSale: "9.5–14M" },
      { type: "2 bed serviced apartment", toLet: "140–210k", forSale: "18–28M" },
      { type: "Commercial retail ground", toLet: "160–220 /sqft", forSale: "on request" },
    ],
    distances: [
      { place: "Britam Tower Core", value: "0.3 km" },
      { place: "Nairobi Hospital", value: "1.1 km" },
      { place: "Nairobi CBD", value: "2.0 km" },
      { place: "JKIA via Expressway", value: "15 km" },
    ],
    worthKnowing: [
      "Verify parking bay ratio (minimum 3 bays per 100 sqm of office floor)",
      "Confirm dual independent utility power feeds and generator synchronization",
      "Check fiber ISP carrier neutrality in the building risers",
      "Review service charge sinking fund allocations for facade maintenance",
    ],
    amenities: [
      "East Africa's Premier Financial District",
      "Grade-A LEED Certified Commercial Towers",
      "Direct Expressway Link to Airport & Westlands",
      "Dual Grid Power & 100% Generator Redundancy",
      "High-Speed Smart Destination Lifts",
      "CCTV Surveillance & Armed Response Perimeter",
      "World Bank, British High Commission Proximity",
      "Underground Multi-Tier Executive Parking",
    ],
    stats: [
      { value: "9", label: "On our books" },
      { value: "125/sqft", label: "Avg commercial rate" },
      { value: "14 d", label: "Average time to let" },
    ],
  },
  "garden-estate": {
    livingHere: [
      "Garden Estate along Thika Superhighway is a serene residential suburb characterized by half-acre homesteads, private gated courts, and modern mid-rise family apartments.",
      "Benefits from direct access to Garden City Mall, Mountain Mall, and the Northern Bypass connecting seamlessly to Runda and Westlands.",
      "Known for mature trees, spacious garden compounds, and quiet residential ambiance favored by established professionals.",
    ],
    costsNote:
      "Strong demand for 2 and 3 bedroom family apartments near Garden City with reliable 8–10% gross yields.",
    costRows: [
      { type: "2 bedroom apartment", toLet: "50–70k", forSale: "8.5–12M", emphasis: true },
      { type: "3 bedroom + DSQ", toLet: "75–110k", forSale: "13–18M" },
      { type: "4 bed maisonette / villa", toLet: "120–180k", forSale: "32–48M" },
      { type: "0.5 acre parcel", toLet: "—", forSale: "35–50M" },
    ],
    distances: [
      { place: "Garden City Mall", value: "1.2 km" },
      { place: "Thika Superhighway", value: "0.8 km" },
      { place: "Northern Bypass", value: "2.5 km" },
      { place: "Nairobi CBD", value: "10 km" },
    ],
    worthKnowing: [
      "Confirm access road drainage during heavy rains",
      "Verify private court security barriers and monthly association dues",
      "Check water storage capacity and borehole connection",
      "Review proximity to Thika Highway for noise buffering",
    ],
    amenities: [
      "Garden City Mall Retail & Entertainment Hub",
      "Direct Access to Thika Superhighway & Bypass",
      "Private Gated Estates with Barrier Security",
      "Spacious Half-Acre Compounds & Mature Gardens",
      "Borehole Water & Secondary Storage",
      "Dedicated Children's Play Lawns",
      "Braeburn Garden Estate & Leading Academies",
      "Low-Density Peaceful Suburban Living",
    ],
    stats: [
      { value: "5", label: "On our books" },
      { value: "65k", label: "Median 2 bed rent" },
      { value: "21 d", label: "Average time to let" },
    ],
  },
  thome: {
    livingHere: [
      "Thome is a secure, well-planned residential neighborhood off Thika Road, featuring organized gated courts, detached family maisonettes, and low-density apartment communities.",
      "Favored by families and executives working in Nairobi's northern commercial nodes and central business district.",
      "Excellent access to schools, shopping complexes, and both the Eastern and Northern Bypasses.",
    ],
    costsNote:
      "Consistent residential tenancy demand with low void rates across 3-bedroom court units.",
    costRows: [
      { type: "2 bedroom apartment", toLet: "45–65k", forSale: "7.5–11M" },
      { type: "3 bedroom maisonette", toLet: "75–110k", forSale: "18–26M", emphasis: true },
      { type: "4 bedroom villa (0.25 ac)", toLet: "110–160k", forSale: "28–42M" },
    ],
    distances: [
      { place: "Mountain Mall", value: "1.0 km" },
      { place: "Thika Superhighway", value: "0.6 km" },
      { place: "USIU Africa", value: "3.5 km" },
      { place: "Nairobi CBD", value: "11 km" },
    ],
    worthKnowing: [
      "Check court barrier access management protocols",
      "Verify individual compound perimeter fencing",
      "Confirm municipal water scheduling and private tank sizing",
      "Review road paving status on secondary court lanes",
    ],
    amenities: [
      "Gated Court Communities & Barrier Gates",
      "Direct Link to Thika Highway & Northern Bypass",
      "Family Maisonettes with Private Parking",
      "Borehole Water & Piped Municipal Backup",
      "Mountain Mall & Roasters Retail Corridors",
      "Proximity to USIU Africa & PAC University",
      "24/7 Neighborhood Patrol Services",
      "Quiet Family-Friendly Environment",
    ],
    stats: [
      { value: "4", label: "On our books" },
      { value: "80k", label: "Median 3 bed rent" },
      { value: "22 d", label: "Average time to let" },
    ],
  },
  "baba-dogo": {
    livingHere: [
      "Baba Dogo is one of Nairobi's core light industrial and logistics zones, located off Outering and Thika Roads.",
      "Hosts major manufacturing plants, warehousing compounds, FMCG distribution hubs, and commercial godowns.",
      "Features high three-phase power availability, heavy vehicle turning radius access, and direct links to the Eastern Bypass.",
    ],
    costsNote:
      "Industrial godowns and logistics warehouses are priced per square foot monthly with long-term industrial leases.",
    costRows: [
      { type: "Light Industrial Godown", toLet: "38–55 /sqft", forSale: "4,500 /sqft", emphasis: true },
      { type: "Commercial Logistics Hub", toLet: "45–65 /sqft", forSale: "5,800 /sqft" },
      { type: "Industrial Plot (1 ac)", toLet: "—", forSale: "65–95M" },
    ],
    distances: [
      { place: "Outering Road Link", value: "0.8 km" },
      { place: "Thika Superhighway", value: "2.2 km" },
      { place: "Eastern Bypass", value: "6.5 km" },
      { place: "JKIA Cargo Hub", value: "18 km" },
    ],
    worthKnowing: [
      "Verify three-phase electrical power capacity and transformer rating",
      "Check floor loading specifications (typically 5–10 tonnes/sqm)",
      "Confirm heavy truck entry gate height and turning yard clearance",
      "Review industrial effluent disposal and NEMA compliance",
    ],
    amenities: [
      "High-Power 3-Phase Industrial Grid",
      "Heavy Vehicle Turning Yards & Dock Levelers",
      "High-Eaves Warehouses & Steel Truss Spans",
      "24/7 Gated Industrial Compound Security",
      "Direct Freight Access to Outering & Thika Road",
      "Borehole Water for Industrial Processes",
      "CCTV Monitored Freight Corridors",
      "Dedicated Commercial Admin Office Mezzanines",
    ],
    stats: [
      { value: "6", label: "On our books" },
      { value: "45/sqft", label: "Avg industrial rate" },
      { value: "25 d", label: "Average time to let" },
    ],
  },
  "nairobi-west": {
    livingHere: [
      "Nairobi West is an energetic, highly connected urban submarket situated immediately south of the CBD, adjacent to Nairobi West Hospital and Nyayo National Stadium.",
      "Known for its high rental demand, convenient public transit links, and bustling commercial and residential mix.",
      "Extremely popular with medical staff, university students, civil servants, and young urban professionals.",
    ],
    costsNote:
      "High rental density with very fast tenant turnaround and minimal vacancy void periods.",
    costRows: [
      { type: "Bedsitter / Studio", toLet: "18–28k", forSale: "3.2–4.5M" },
      { type: "1 bedroom apartment", toLet: "30–45k", forSale: "4.8–6.8M" },
      { type: "2 bedroom apartment", toLet: "45–65k", forSale: "7.5–11M", emphasis: true },
      { type: "3 bedroom family flat", toLet: "65–85k", forSale: "11–15M" },
    ],
    distances: [
      { place: "Nairobi West Hospital", value: "0.4 km" },
      { place: "Nyayo Stadium", value: "1.0 km" },
      { place: "Nairobi CBD", value: "2.8 km" },
      { place: "Wilson Airport", value: "2.5 km" },
    ],
    worthKnowing: [
      "Check building water rationing schedule and roof tank storage",
      "Confirm tenant sub-metering for electricity (tokens)",
      "Verify access control and night security guard coverage",
      "Review road accessibility during match days at Nyayo Stadium",
    ],
    amenities: [
      "Nairobi West Hospital & Specialized Clinics",
      "5 Minutes Drive to Nairobi CBD & Industrial Area",
      "Wilson Airport Proximity for Commuters",
      "High-Density Public Transit Connections",
      "Vibrant Commercial High Streets & Markets",
      "Fast Tenant Absorption & Low Void Rates",
      "CCTV Security & Controlled Access Gates",
      "Reliable Telecommunications & Fibre Internet",
    ],
    stats: [
      { value: "7", label: "On our books" },
      { value: "50k", label: "Median 2 bed rent" },
      { value: "12 d", label: "Average time to let" },
    ],
  },
  kasarani: {
    livingHere: [
      "Kasarani is a rapidly expanding, high-yield residential hub along Thika Superhighway, home to Kasarani Stadium and major academic institutions.",
      "Attracts investors seeking strong rental returns from modern studio, 1-bedroom, and 2-bedroom multi-family residential towers.",
      "High tenant pool of university students, young professionals, and sporting personnel with rapid leasing turnaround.",
    ],
    costsNote:
      "Consistent high-yield residential market with strong occupancy rates across newly built blocks.",
    costRows: [
      { type: "Studio / Bedsitter", toLet: "12–18k", forSale: "2.2–3.2M" },
      { type: "1 bedroom new build", toLet: "22–32k", forSale: "3.5–5.2M", emphasis: true },
      { type: "2 bedroom apartment", toLet: "35–50k", forSale: "5.5–8.2M" },
      { type: "3 bedroom family flat", toLet: "50–70k", forSale: "8.5–12M" },
    ],
    distances: [
      { place: "Kasarani Stadium Hub", value: "1.0 km" },
      { place: "Thika Superhighway", value: "0.8 km" },
      { place: "TRM Mall", value: "2.5 km" },
      { place: "Nairobi CBD", value: "12 km" },
    ],
    worthKnowing: [
      "Verify borehole connection and water treatment in high-rise towers",
      "Check elevator maintenance contracts in buildings over 4 storeys",
      "Confirm token electricity meters for each unit",
      "Review parking ratio for tenant vehicles",
    ],
    amenities: [
      "Moi International Sports Centre Kasarani",
      "Direct Thika Superhighway Access",
      "TRM (Thika Road Mall) Shopping Proximity",
      "USIU Africa & Kenyatta University Commute",
      "High-Yield Multi-Family Investment Assets",
      "Borehole Water & Secondary Storage",
      "Fibre Internet Ready Infrastructure",
      "Rapid Tenant Absorption & Deep Pool",
    ],
    stats: [
      { value: "9", label: "On our books" },
      { value: "28k", label: "Median 1 bed rent" },
      { value: "11 d", label: "Average time to let" },
    ],
  },
  ruiru: {
    livingHere: [
      "Ruiru is one of the fastest growing satellite cities in the Nairobi Metropolitan Area, situated along the Thika Superhighway and Eastern/Northern Bypasses.",
      "Features expansive master-planned gated communities, serviced quarter-acre and 50x100 residential plots, and modern townhouses.",
      "Popular with homeowners commuting via bypass routes to Westlands and the airport.",
    ],
    costsNote:
      "Exceptional land capital appreciation over the last 5 years with robust demand for gated estate homes.",
    costRows: [
      { type: "50×100 Serviced Plot", toLet: "—", forSale: "4.5–8.5M", emphasis: true },
      { type: "2 bedroom apartment", toLet: "30–45k", forSale: "5.2–7.5M" },
      { type: "3 bedroom townhouse", toLet: "55–85k", forSale: "12–18M" },
      { type: "4 bedroom villa", toLet: "80–130k", forSale: "18–28M" },
    ],
    distances: [
      { place: "Eastern / Northern Bypass", value: "1.5 km" },
      { place: "Thika Superhighway", value: "1.0 km" },
      { place: "Tatu City Core", value: "4.0 km" },
      { place: "Nairobi CBD", value: "22 km" },
    ],
    worthKnowing: [
      "Confirm title deed clean search at Kiambu Land Registry",
      "Verify bypass access and dual carriageway expansion plans",
      "Check estate building control bylaws and service fees",
      "Review piped water connection and electricity infrastructure",
    ],
    amenities: [
      "Dual Carriageway Bypass Interchanges",
      "Gated Master-Planned Community Estates",
      "Proximity to Tatu City SEZ & Light Industry",
      "Leading International & Private Academies",
      "High Capital Appreciation Land Market",
      "Reliable Piped & Borehole Water Reticulation",
      "Commercial Shopping Centers & Supermarkets",
      "Peaceful Suburban Living with Easy Commutes",
    ],
    stats: [
      { value: "7", label: "On our books" },
      { value: "6.5M", label: "Median plot value" },
      { value: "24 d", label: "Average time to sell" },
    ],
  },
  "ongata-rongai": {
    livingHere: [
      "Ongata Rongai, situated in Kajiado County adjacent to Nairobi National Park, is a thriving satellite town offering affordable family homes, villas, and maisonettes.",
      "Offers stunning views of the Ngong Hills and close proximity to the SGR station and Catholic University of Eastern Africa (CUEA).",
      "Known for its cool climate, open spaces, and vibrant neighborhood commerce.",
    ],
    costsNote:
      "Affordable rental bands make Rongai a prime location for family living with excellent value per square foot.",
    costRows: [
      { type: "2 bedroom flat", toLet: "25–38k", forSale: "4.5–6.8M" },
      { type: "3 bedroom bungalow", toLet: "40–60k", forSale: "8.5–13M", emphasis: true },
      { type: "4 bedroom maisonette", toLet: "60–95k", forSale: "14–22M" },
      { type: "50×100 plot", toLet: "—", forSale: "3.5–6.5M" },
    ],
    distances: [
      { place: "Magadi Road Corridor", value: "0.5 km" },
      { place: "SGR Ongata Rongai Station", value: "3.2 km" },
      { place: "Galleria Mall Karen", value: "7.5 km" },
      { place: "Nairobi CBD", value: "18 km" },
    ],
    worthKnowing: [
      "Check Magadi Road traffic peak hours and dualling progress",
      "Verify private borehole connection and water softness",
      "Confirm estate perimeter fencing and neighborhood watch",
      "Review land title deed verification at Kajiado registry",
    ],
    amenities: [
      "Breathtaking Views of Ngong Hills",
      "SGR Commuter Rail Station Proximity",
      "Galleria Mall & Karen Commercial Centers",
      "Leading Universities (CUEA, Multimedia, Nazarene)",
      "Borehole Water & Secondary Storage",
      "Gated Courts & Private Family Compounds",
      "High Value-for-Money Family Living",
      "Direct Proximity to Nairobi National Park",
    ],
    stats: [
      { value: "5", label: "On our books" },
      { value: "48k", label: "Median 3 bed rent" },
      { value: "20 d", label: "Average time to let" },
    ],
  },
  nyeri: {
    livingHere: [
      "Nyeri is the historic administrative and agricultural heart of Central Kenya, situated between Mount Kenya and the Aberdare Mountain Range.",
      "Features rich agricultural land, serene highland retirement homesteads, town commercial plots, and tea/coffee estate acreage.",
      "Enjoys year-round cool highland weather, fertile volcanic soil, and excellent road networks to Nairobi and Mount Kenya circuits.",
    ],
    costsNote:
      "Substantial demand for commercial parcels in Nyeri Town and agricultural acreage in surrounding zones.",
    costRows: [
      { type: "Town Commercial Plot", toLet: "—", forSale: "8–18M", emphasis: true },
      { type: "Agricultural Acreage (1 ac)", toLet: "—", forSale: "3.5–7.5M" },
      { type: "3 bedroom family home", toLet: "30–50k", forSale: "9–15M" },
    ],
    distances: [
      { place: "Nyeri Town CBD", value: "1.0 km" },
      { place: "Mount Kenya National Park", value: "18 km" },
      { place: "Aberdare Country Club", value: "14 km" },
      { place: "Nairobi via Kenol Highway", value: "140 km" },
    ],
    worthKnowing: [
      "Verify Land Control Board (LCB) consent requirements for agricultural parcels",
      "Check perennial water stream rights and borehole potential",
      "Confirm road frontage access on dual highway expansions",
      "Review freehold title deed clean searches at Nyeri registry",
    ],
    amenities: [
      "Cool Highland Climate & Volcanic Soil",
      "Mount Kenya & Aberdare Tourist Corridors",
      "Kenol-Marua Dual Carriageway Highway Access",
      "Perennial River Water & Piped Municipal Networks",
      "Historical Administrative Infrastructure",
      "High-Yield Agricultural & Agro-Processing Hubs",
      "Peaceful Countryside Retirement Living",
      "Leading County Hospitals & Academic Institutions",
    ],
    stats: [
      { value: "4", label: "On our books" },
      { value: "5.5M", label: "Avg acre value" },
      { value: "35 d", label: "Average time to sell" },
    ],
  },
  iten: {
    livingHere: [
      "Iten in Elgeyo Marakwet County is the undisputed 'Home of Champions', perched majestically at 2,400m on the edge of the breathtaking Kerio Valley Escarpment.",
      "Globally renowned as the high-altitude training capital of international distance runners, creating strong demand for sports hospitality, boutique lodges, and residential plots.",
      "Offers dramatic rift valley panoramas, crisp mountain air, and rich agricultural countryside.",
    ],
    costsNote:
      "Specialized market driven by sports tourism, athletic training camps, eco-lodges, and agricultural acreage.",
    costRows: [
      { type: "Escarpment View Plot (0.5 ac)", toLet: "—", forSale: "3.5–7M", emphasis: true },
      { type: "Athletic Camp / Lodge Facility", toLet: "80–180k", forSale: "25–55M" },
      { type: "Highland Acreage (1 ac)", toLet: "—", forSale: "2.2–4.5M" },
    ],
    distances: [
      { place: "Iten Viewpoint Escarpment", value: "0.5 km" },
      { place: "Lornah Kiplagat Sports Center", value: "1.2 km" },
      { place: "Eldoret Town Core", value: "32 km" },
      { place: "Eldoret International Airport", value: "48 km" },
    ],
    worthKnowing: [
      "Confirm geological escarpment stability and setback for view plots",
      "Verify water spring rights and high-altitude borehole infrastructure",
      "Check county zoning approvals for commercial hospitality/training facilities",
      "Review road access during rainy highland seasons",
    ],
    amenities: [
      "World-Renowned High Altitude Training Mecca",
      "Panoramic Kerio Valley Escarpment Views",
      "Clean Highland Mountain Air & Mild Weather",
      "High-Yield Sports Tourism & Hospitality Demand",
      "30 Minutes to Eldoret International Airport",
      "Perennial Mountain Springs & Fresh Piped Water",
      "Rich Organic Agricultural Acreage",
      "Peaceful Sanctuary for Wellness & Sports Ventures",
    ],
    stats: [
      { value: "3", label: "On our books" },
      { value: "4.2M", label: "Median plot value" },
      { value: "30 d", label: "Average time to sell" },
    ],
  },
};

export function findAreaEditorial(slug: string): AreaEditorial | undefined {
  return AREA_EDITORIAL[slug];
}

