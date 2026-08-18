# Sunland Web Platform: Page Specifications

Status: proposed, 2026-08-18. Consumes docs 02 and 03. Pairs with the copy in doc 05.

Each section below gives purpose, layout, data source, states, and the acceptance test. Section IDs (`home.hero`) are the keys used by the Content Studio in doc 07, so a section can be reordered or hidden without a deploy.

---

## 1. Home (`/`)

Ordered for a first-time visitor who does not yet know whether this is a listings site or an agency. The answer must arrive in the first screen: both, and the agency part is the differentiator.

### 1.1 `home.hero`: dark band

**Purpose:** state what Sunland does, and put search in the visitor's hands immediately.

**Layout:** full-bleed dark band, 88vh desktop with a minimum of 640px, 100dvh mobile. Background is a single high-quality property photograph at 30% opacity over `brand-dark`, with a bottom gradient scrim. Content is left-aligned at 7 of 12 columns on desktop, full width on mobile.

- Eyebrow: yellow rule plus label.
- Headline: Cormorant 300, `--text-display`, two lines maximum.
- Lead paragraph: `--text-lead`, `on-dark`, capped at 60 characters measure.
- Search panel: a raised glass card (`dark-raise`, 1px `dark-line`, `--radius-xl`) containing status toggle (Rent / Buy), a location combobox, a property type select, and a yellow submit. Mobile collapses to location plus a single "Search" button that opens the full filter sheet.
- Below the panel: three quick links to the highest-intent facets, styled as ghost pills.
- Trust strip at the base: four stat blocks per doc 03 §3.7.

**Data:** location options from distinct published listing locations; stats from live aggregates (doc 07 §4.4).

**States:** if the stats query fails, the strip hides entirely rather than rendering zeros.

**Acceptance:** LCP element is the headline, not the background image. Search submits to `/properties` with query parameters. Works with keyboard only.

### 1.2 `home.categories`: light band

**Purpose:** route by property type, the second most common entry intent.

**Layout:** section title plus a 4-column grid (2 on tablet, 1.5 scroll-snap on mobile) of category cards: Apartments, Villas, Commercial, Land. Each card is an image with a dark scrim, category name in Cormorant, and a live count in JetBrains Mono.

**Data:** live counts of published listings per category. A category with zero live listings is hidden, not shown as "0 Properties".

**Acceptance:** counts match the listing index when filtered to the same category.

### 1.3 `home.featured`: tint band

**Purpose:** show real inventory quality fast.

**Layout:** section title with a "View all" outline button on the right. Below, a filter row of status pills (All, For rent, For sale), then a 3-column grid of six listing cards. Mobile is a single-column stack of four with a "View all" button beneath.

**Data:** published listings flagged `isFeatured`, ordered by `featuredRank` then `publishedAt` descending, limited to six. If fewer than six are featured, fill with the newest published listings.

**States:** never render fewer than three cards; if inventory is that thin, hide the section.

**Acceptance:** every card links to a live listing. No card shows a currency placeholder.

### 1.4 `home.landlords`: dark band

**Purpose:** the highest-value section on the site, and the one the current site lacks entirely.

**Layout:** two columns. Left is editorial: eyebrow, Cormorant headline, lead, then three numbered process steps (Valuation, Mandate, Management) each with a Tabler icon, a title, and one line of body. Primary yellow button "Request a valuation", secondary ghost "How management works". Right is a device-framed screenshot of the landlord portal statement view, tilted 4 degrees, with a soft glow.

**Why the screenshot:** the argument that Sunland is systematic is made by showing the system. It is also the only place on the public site where the ERP is visible, which is the point of difference no competing agency site can copy.

**Data:** static content, editable in the Content Studio. The screenshot is a media asset, replaced when the portal UI changes.

**Acceptance:** the valuation call to action is reachable within one scroll on mobile from the section start.

### 1.5 `home.locations`: light band

**Purpose:** feed the location hubs, which are the organic traffic engine.

**Layout:** section title, then a masonry-ish grid of eight location tiles: one large, three medium, four small. Each tile is an image with a scrim, location name in Cormorant, and a listing count in mono. "View all locations" outline button beneath.

**Data:** locations ordered by live listing count, taken from the location taxonomy in doc 07 §4.3.

**Acceptance:** each tile links to `/locations/{slug}`, not to a filtered query URL.

### 1.6 `home.services`: tint band

**Purpose:** state the full service range for visitors who arrived for one thing and need another.

**Layout:** 4-column card grid: Property management, Sales and letting, Valuation, Commercial and industrial. Each card carries a Tabler icon in a yellow-tinted circle, a Cormorant title, two lines of body, and a text link.

**Acceptance:** each card links to its service detail page.

### 1.7 `home.proof`: light band

**Purpose:** social proof, honestly presented.

**Layout:** two columns. Left is a testimonial carousel using doc 03 §3.8, with dot navigation. Right is a stacked set of three trust points, each an icon, a short title, and one line.

**Data:** testimonials from the Content Studio. Only real, attributed quotes. No star ratings unless real ratings exist.

**States:** if fewer than two testimonials exist, render a single static quote without carousel controls.

### 1.8 `home.insights`: tint band

**Purpose:** demonstrate expertise, feed the blog, and support AI citation.

**Layout:** section title, "View all" link, three post cards with image, category pill, Cormorant title, date in mono, and reading time.

**States:** hidden entirely until at least three posts exist. An empty blog section is worse than no blog section.

### 1.9 `home.cta`: dark closing band

**Purpose:** one decision, split by audience.

**Layout:** centred Cormorant headline, one lead line, then two buttons side by side: "List your property" (primary yellow) and "Browse properties" (ghost on dark). Beneath, a quiet line with the phone number in mono and a WhatsApp link.

**Acceptance:** exactly one yellow element in this viewport.

---

## 2. Listing index (`/properties` and facets)

### 2.1 `index.header`: dark compact band

Breadcrumb, `h1` reflecting the active facet ("Apartments for rent in Kilimani" rather than a generic "Properties"), a one-line description, and the live result count in mono.

### 2.2 `index.filters`

Sticky filter bar per doc 03 §3.3. On facet pages the corresponding filter renders pre-applied and locked as a chip that, when removed, navigates up to the parent facet rather than silently changing the URL semantics.

### 2.3 `index.results`

3-column grid desktop, 2 tablet, 1 mobile, 12 per page. Pagination is real links (`?page=2`) for crawlability, not infinite scroll. Sort options: newest, price ascending, price descending.

**States:** loading renders skeleton cards matching the real card dimensions so nothing shifts. Empty renders doc 03 §3.9 with three nearest alternatives, computed by relaxing the most restrictive filter.

### 2.4 `index.seoBlock`

On facet pages only, below results: 150 to 300 words of genuinely useful copy about that category and location, plus internal links to sibling facets and the location hub. This is what makes a facet page worth indexing rather than a thin filter result.

### 2.5 `index.cta`

Dark band: "Cannot find what you are looking for? Tell us what you need." Opens the requirements enquiry form, which also writes a `leads` row.

---

## 3. Listing detail (`/properties/{slug}`)

The highest-value template on the site. Everything a prospect needs to decide, without a call.

### 3.1 `listing.gallery`

Doc 03 §3.4. Above it, breadcrumb and a back link to the parent facet.

### 3.2 `listing.summary`

Two columns from here down: 8 columns of content, 4 columns of a sticky enquiry rail.

Content column top block:
- Status badge and, if applicable, "Featured".
- `h1`: listing title, Cormorant 300.
- Location line with map pin icon.
- Price, JetBrains Mono, `--text-h1`, with `/ month` suffix for rentals in `--text-sm`.
- Reference code in mono, `ink-400`, small. This matters: it gives the caller and the Property Manager a shared handle.
- Specification strip: beds, baths, area, parking, each icon plus mono figure.

### 3.3 `listing.description`

Prose description, Nunito, measure capped. Then a two-column definition table of attributes: type, furnishing, service charge, availability date, title status for land and sale properties. Every value in mono where numeric.

### 3.4 `listing.features`

Amenity chips in a wrapped grid, each a Tabler icon plus label. Sourced from a controlled amenity list, not free text, so they stay consistent and filterable later.

### 3.5 `listing.location`

Static map image with a marker, the neighbourhood name, and two or three lines about the area pulled from the location record. Links to the location hub. A static map keeps the page fast and avoids a third-party script on the critical path; an interactive map is a P2.

### 3.6 `listing.consultant`

The assigned Property Manager or consultant: photo, name, title, phone in mono, WhatsApp button. This is the ERP connection made visible; the person shown is the person who will actually own the resulting lead.

### 3.7 `listing.enquiryRail`: sticky, desktop only

Card containing: price, a "Book a viewing" primary button, the enquiry form per doc 03 §3.5, and the phone number. On mobile this becomes a fixed bottom bar with price on the left and a "Enquire" button on the right that opens the form in a sheet.

**Acceptance:** submitting creates a `leads` row with `propertyId`, source `website`, stage `inquiry`, assigned to the property's Property Manager, and fires the confirmation state without a full page reload.

### 3.8 `listing.similar`

Three listing cards: same category, same or nearest location, similar price band. Never shows the current listing.

---

## 4. Landlord hub (`/landlords`)

The conversion page for the highest-value audience. Sections:

1. `landlords.hero`: dark. Headline addressed to owners, lead, primary "Request a valuation", secondary "Talk to us". Trust strip of managed-portfolio stats.
2. `landlords.problem`: light. Three pain points as cards: chasing rent, coordinating repairs, no visibility. Written plainly, in the owner's words.
3. `landlords.how`: tint. The four-step process, numbered, each with an icon and a short paragraph: valuation, mandate, marketing and letting, management and remittance. This mirrors the real lifecycle, so what is promised is what the ERP actually does.
4. `landlords.portal`: dark. The landlord portal shown properly: two screenshots, three bullet points about statements, documents, and a named manager.
5. `landlords.fees`: light. Honest structure of what is charged and when. If the client will not publish rates, this becomes "how our fees work" without figures, which is still better than silence.
6. `landlords.faq`: tint. Eight questions, accordion, marked up as `FAQPage`. This is the highest-value AI SEO surface on the site.
7. `landlords.cta`: dark. Valuation form, inline, not a link to another page. Every extra click here costs conversions.

---

## 5. Valuation request (`/landlords/valuation`)

Single-purpose form page, minimal chrome, no nav distractions beyond the logo and phone number.

Fields: name, phone, email (optional), property type, location, number of units, brief description, and a "what do you need" radio (valuation for sale, valuation for letting, management proposal).

**Behaviour:** two steps on mobile, one column on desktop. Progress is explicit. Success state states what happens next and when someone will call, and shows the reference in mono.

**Acceptance:** creates a `contacts` row (or matches an existing one by phone) and a `valuations` row at stage `requested`, with source attribution. Notifies the Head of Strategy and the CEO's Assistant via the existing notification channel.

---

## 6. Services (`/services` and `/services/{slug}`)

Hub: four service cards plus a short intro band and a closing call to action.

Detail template: dark hero with the service name and a one-line promise; a "what is included" list; a three or four step process block; a proof band with a relevant statistic or testimonial; an FAQ accordion; a closing call to action. Each service detail links to the listing facets and location hubs relevant to it.

---

## 7. Locations (`/locations` and `/locations/{slug}`)

Hub: a grid of all location tiles with live counts, plus a short intro on Sunland's coverage.

Detail template: hero with the location name and a live count; 200 to 400 words on the area, written to be genuinely informative (character, who lives there, typical rents, commute); a price context block with typical rent by bed count in mono, computed from live listings; the current listings grid for that location; nearby locations; and a closing enquiry call to action.

**Why this template earns traffic:** it answers "what does a 2-bedroom in Kilimani cost" with real numbers derived from real inventory, which is the query type both search engines and AI assistants reward, and which no competitor with a static WordPress site can keep current.

---

## 8. About (`/about`) and Team (`/about/team`)

About: dark hero, the founding story in real prose, a stat band, values as three cards, a leadership strip linking to the team page, and a closing call to action. No stock imagery of handshakes.

Team: grid of member cards with photo, name, role, and, where relevant, a phone and email. Cards for consultants link to the listings they manage, which turns the team page into an internal linking hub rather than a dead end.

---

## 9. Insights (`/insights` and `/insights/{slug}`)

Index: featured post as a wide card, then a grid, with category filter pills. Categories are rebuilt from scratch per doc 06; the current taxonomy of "Fitness Zone" and "Restaurant" is discarded.

Post: `h1`, author with photo and role, publish and updated dates in mono, reading time, then prose at a 68-character measure with room for pull quotes, images, and tables. Every post ends with a related-links block and a contextual call to action matching its subject, so a landlord-oriented post ends with the valuation call and a tenant-oriented post ends with a listings link.

---

## 10. Contact (`/contact`)

Two columns. Left: contact methods in a stack, each with an icon and a mono value where numeric: phone, WhatsApp, email, HQ address with the postcode, office hours. Right: a general enquiry form writing to `leads` with type `general`.

Below: a full-width static map band with a "Get directions" link to the existing Google Maps pin.

---

## 11. Global elements

### 11.1 Header

Doc 03 §3.10. `Properties` opens a mega panel on desktop hover and focus, and expands inline in the mobile drawer.

### 11.2 Sign-in entry

A quiet "Sign in" link in the header, always visible, routing to the portal. In the footer it splits into "Tenant portal" and "Landlord portal" for clarity.

### 11.3 Floating WhatsApp

Bottom right, above the mobile enquiry bar, `aria-label`led, hidden when a sheet or modal is open. It carries a prefilled message including the current page reference.

### 11.4 Cookie and consent

A single, dismissible band, not a modal, with a real link to the privacy page. Analytics does not load before consent.

---

## 12. Responsive rules

| Breakpoint | Grid | Notable changes |
|---|---|---|
| Under 640 | 1 column | Sticky bottom enquiry bar on listings, filters in a sheet, drawer nav |
| 640 to 1023 | 2 columns | Enquiry rail moves below content, gallery becomes a carousel |
| 1024 to 1279 | 3 columns | Sticky rail appears, mega menu enabled |
| 1280 and up | 3 columns, wider gutters | Full layout at 1280 max width |

No horizontal scroll at any width. Zoom is never disabled. Text remains legible at 200% zoom without clipping.

---

## 13. Per-template acceptance summary

| Template | Must prove |
|---|---|
| Home | All sections render from CMS content with fallbacks; one yellow element per viewport |
| Listing index | Filters change URL and results; empty state offers alternatives; pagination is crawlable |
| Listing detail | Enquiry creates an assigned lead; every numeric is mono; structured data validates |
| Landlord hub | Valuation call to action appears three times; FAQ marked up |
| Valuation | Creates a real `valuations` row at `requested`; success states the next step |
| Location | Price context computed from live listings, never hardcoded |
| Insights post | Author, dates, related links, and a subject-matched call to action |
| All | AA contrast, keyboard path, reduced motion, no font weight above 500 |
