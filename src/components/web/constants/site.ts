/**
 * Site-wide constants: contact details, navigation, footer.
 *
 * These become rows in `web_site_settings`, `web_navigations` and
 * `web_nav_items` at W5-13, at which point the client edits the phone number
 * and adds a nav item without a deploy. Until then they live here as typed
 * defaults, which is also what the section registry contract in web doc 07
 * §4.2 expects: a component renders its defaults when its row is missing, so
 * the site is fully functional before any content is entered.
 *
 * Contact details are carried verbatim from the live site.
 */

export const SITE = {
  name: "Sunland Real Estates",
  shortName: "Sunland",
  tagline: "Where life meets style.",

  phone: "0703 100 875",
  phoneHref: "tel:+254703100875",
  whatsapp: "+254 737 100 875",
  whatsappHref: "https://wa.me/254737100875",
  email: "info@sunland.co.ke",
  emailHref: "mailto:info@sunland.co.ke",

  addressLine: "International House, 8th Floor, Mama Ngina Street, Nairobi.",
  postalAddress: "P.O. Box 37987-00100.",

  officeHours: "We answer 8am to 6pm, Monday to Saturday.",
} as const;

/**
 * Primary header navigation.
 *
 * Six items plus the portal door. This follows the built design rather than
 * web doc 02 §4.1, which lists Contact in place of Areas and a yellow "List
 * your property" action in the header. The design drops both: Areas earns
 * more organic traffic than Contact, which lives in the footer and the
 * floating control, and a yellow header CTA would compete with the hero
 * search button for the page's single yellow element. Doc 02 is corrected to
 * match.
 */
export const HEADER_NAV = [
  { label: "Properties", href: "/properties" },
  { label: "Landlords", href: "/landlords" },
  { label: "Services", href: "/services" },
  { label: "Areas", href: "/locations" },
  { label: "Insights", href: "/insights" },
  { label: "About", href: "/about" },
] as const;

/**
 * Footer columns. Every link resolves to a real page or is not listed: the
 * current site's footer points "Gallery" at /properties and both legal links
 * at "#", which is the failure this structure exists to prevent.
 */
export const FOOTER_NAV = [
  {
    title: "Properties",
    links: [
      { label: "To let", href: "/properties/for-rent" },
      { label: "For sale", href: "/properties/for-sale" },
      { label: "Apartments", href: "/properties/apartments" },
      { label: "Commercial", href: "/properties/commercial" },
      { label: "Land and plots", href: "/properties/land" },
    ],
  },
  {
    title: "Owners",
    links: [
      { label: "Property management", href: "/services#management" },
      { label: "Request a valuation", href: "/landlords#valuation" },
      { label: "Sales and letting", href: "/services#letting" },
      { label: "How management works", href: "/landlords#how" },
      { label: "Commercial and industrial", href: "/services#commercial" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "The team", href: "/about#team" },
      { label: "Insights", href: "/insights" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Sign in",
    links: [
      { label: "Tenant portal", href: "/login" },
      { label: "Landlord portal", href: "/login" },
    ],
  },
] as const;

/** Base bar. Privacy and Terms are launch blockers and must resolve, not "#". */
export const LEGAL_NAV = [
  { label: "Privacy notice", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Cookies", href: "/privacy#cookies" },
] as const;
