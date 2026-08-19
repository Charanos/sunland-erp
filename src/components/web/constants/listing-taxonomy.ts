/**
 * The public listing taxonomy, and the rule that stops it colliding with
 * listing slugs.
 *
 * ── ADR W3, the slug collision problem ──
 *
 * `/properties/{slug}` and `/properties/{category}` occupy the same URL
 * segment. A listing slugged `apartments` would shadow the category page and
 * quietly delete a ranking page from the site.
 *
 * The alternative was `/properties/listing/{slug}`, which adds a dead segment
 * to the single most important URL on the site, forever, to solve a problem
 * that a word list solves. So:
 *
 *   1. Category, status and location segments are a reserved word list held
 *      here, in code.
 *   2. Slug generation rejects and suffixes any slug colliding with a
 *      reserved word. Checked at generation, not only at route resolution:
 *      catching it at resolution means the bad slug already exists, is
 *      already indexed, and already broke something.
 *   3. The route resolver checks this list first, then falls through to a
 *      listing lookup.
 *
 * Adding a facet segment means adding it here first. That is the whole
 * safety mechanism, so it is one list and not three.
 */

export type ListingFacetKind = "status" | "category";

export type ListingFacet = {
  segment: string;
  label: string;
  /** Shown as the page h1 and in the breadcrumb. */
  title: string;
  lead: string;
  kind: ListingFacetKind;
};

export const STATUS_FACETS: ListingFacet[] = [
  {
    segment: "for-rent",
    label: "To let",
    title: "Property to let in Nairobi",
    lead: "Apartments, houses and commercial space available now, with the rent we will actually quote you.",
    kind: "status",
  },
  {
    segment: "for-sale",
    label: "For sale",
    title: "Property for sale in Nairobi",
    lead: "Homes, land and commercial buildings currently on the market through Sunland.",
    kind: "status",
  },
];

export const CATEGORY_FACETS: ListingFacet[] = [
  {
    segment: "apartments",
    label: "Apartments",
    title: "Apartments in Nairobi",
    lead: "One to four bedroom apartments across Kilimani, Lavington, Kileleshwa, Westlands and the wider city.",
    kind: "category",
  },
  {
    segment: "villas",
    label: "Villas and houses",
    title: "Villas and houses",
    lead: "Detached houses, townhouses and maisonettes in Runda, Spring Valley, Lavington and the leafy suburbs.",
    kind: "category",
  },
  {
    segment: "commercial",
    label: "Commercial",
    title: "Commercial and industrial space",
    lead: "Offices, retail units, warehousing and godowns, including Tatu City and the industrial belt.",
    kind: "category",
  },
  {
    segment: "land",
    label: "Land and plots",
    title: "Land and plots for sale",
    lead: "Serviced plots and development land with title verified before we list it.",
    kind: "category",
  },
];

export const ALL_FACETS: ListingFacet[] = [...STATUS_FACETS, ...CATEGORY_FACETS];

/**
 * Category colour, carried over from the ERP's own portfolio donut.
 *
 * `unified-market-board.tsx` colours a property-type pie: Apartment #0ea5e9,
 * House #0f766e, Villa #d97706, Commercial #4f46e5, Land #8b5cf6. A landlord
 * who signs in after visiting the public site sees the same hue mean the same
 * thing in the dashboard, which is the actual point of matching it: colour
 * becomes a second, wordless label that travels between the two surfaces.
 *
 * The web taxonomy has four categories against the ERP's five, because
 * "Villas and houses" (web) covers what the ERP splits into Villa and House.
 * It takes the ERP House teal rather than Villa amber: the web bucket is the
 * broader, plainer "family home" grouping (townhouse, maisonette, bungalow
 * included), which is what House means in the ERP, and the teal also sits
 * better as a midpoint between Apartment's cool blue and Land's violet.
 */
export const CATEGORY_COLOR: Record<string, string> = {
  apartments: "#0ea5e9",
  villas: "#0f766e",
  commercial: "#4f46e5",
  land: "#8b5cf6",
};


/**
 * Every segment that may never be a listing slug.
 *
 * Includes the facet segments above plus the words a future facet is likely
 * to claim. Reserving a word costs nothing; un-reserving one after a listing
 * has taken it costs a redirect and a ranking.
 */
export const RESERVED_LISTING_SEGMENTS: ReadonlySet<string> = new Set([
  ...ALL_FACETS.map((facet) => facet.segment),
  // Reserved ahead of use.
  "for-lease",
  "houses",
  "offices",
  "retail",
  "warehouses",
  "plots",
  "developments",
  "new-builds",
  "furnished",
  "search",
  "map",
  "page",
  "all",
]);

export function findFacet(segment: string): ListingFacet | undefined {
  return ALL_FACETS.find((facet) => facet.segment === segment);
}

export function isReservedSegment(segment: string): boolean {
  return RESERVED_LISTING_SEGMENTS.has(segment.toLowerCase());
}

/**
 * Slug generation, with the reserved-word collision path.
 *
 * The reference is appended rather than used only on collision, because it is
 * what makes the slug unique across listings: two "Two bedroom apartment,
 * Kilimani" units are the normal case, not the exception. The reserved check
 * then guards the remaining hole, which is a reference that on its own reads
 * as a facet segment.
 *
 * Checked here at generation, not only at route resolution. Catching a
 * collision at resolution means the bad slug already exists, is already
 * indexed, and has already shadowed a category page.
 */
export function generateListingSlug(title: string, reference: string): string {
  const slugify = (value: string) =>
    value
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const base = slugify(title).slice(0, 60).replace(/-+$/g, "") || "listing";
  const suffix = slugify(reference) || "ref";
  const slug = `${base}-${suffix}`;

  // Belt and braces: a slug that still reads as a facet segment gets pushed
  // out of that namespace rather than silently shadowing a real page.
  return isReservedSegment(slug) ? `${slug}-listing` : slug;
}

// ── Sorting, allowlisted ─────────────────────────────────────────────────────

/**
 * A client-supplied sort key that is not on this list is rejected before query
 * construction, not sanitised afterwards. Interpolating an arbitrary column
 * name into an ORDER BY is how a filter parameter becomes a database problem.
 */
export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
  { value: "bedrooms", label: "Bedrooms" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export function parseSort(value: string | undefined): SortValue {
  const match = SORT_OPTIONS.find((option) => option.value === value);
  return match ? match.value : "newest";
}

export const BEDROOM_OPTIONS = ["1", "2", "3", "4+"] as const;

export const FEATURE_OPTIONS = [
  { value: "furnished", label: "Furnished" },
  { value: "water", label: "Borehole or water tank" },
  { value: "generator", label: "Backup generator" },
  { value: "pets", label: "Pet friendly" },
] as const;
