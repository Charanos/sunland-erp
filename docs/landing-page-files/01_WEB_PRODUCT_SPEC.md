# Sunland Web Platform: Product Specification

Status: proposed, 2026-08-18. Supersedes nothing; this is the first product document for the public site.

## 1. Problem statement

Sunland's public website and Sunland's operating system describe the same portfolio and share nothing. Listings are typed into WordPress by hand after they already exist in the ERP, so the public catalogue drifts out of date within days: rented units stay live, prices go stale, and several listings currently render a price placeholder instead of a figure. Meanwhile every enquiry arrives as an email to a shared inbox or a WhatsApp message to a personal phone, with no owner, no timestamp, and no route into the pipeline the business actually runs on.

The cost is threefold. Prospective tenants and buyers lose trust in a catalogue that misrepresents availability. Landlords, who are the higher-value audience, are given no reason to choose Sunland over any other agency, because the site says nothing about how properties are managed. And the business cannot measure any of it, because the funnel ends at an inbox.

## 2. Goals

| # | Goal | Measure of success |
|---|---|---|
| G1 | Every public listing reflects live ERP state | Zero manual listing entry; published listings derive from `properties` |
| G2 | Convert landlord interest into pipeline | Valuation and mandate enquiries open real `valuations` rows, attributed to source |
| G3 | Convert tenant and buyer interest into owned leads | Every enquiry creates a `leads` row assigned to a Property Manager |
| G4 | Give the client editorial control without a developer | Content Studio in the CEO dashboard covers pages, posts, media, testimonials |
| G5 | Be found, by search engines and by AI assistants | Indexable location and category pages, complete structured data, AI crawler access |
| G6 | Look and feel like one product with the ERP | Terrain Identity tokens shared, not re-implemented |

## 3. Non-goals

Explicitly out of scope for this build, with reasons:

1. **Online rent payment on the public site.** Payments belong inside the authenticated tenant portal, where the payer is known and the ledger entry can be attributed. The public site links to sign-in and stops there.
2. **A property marketplace with third-party agents.** Sunland lists what Sunland manages or sells. Multi-agency inventory is a different business model.
3. **User accounts for anonymous browsers.** Saved searches and favourites are tempting and cheap to fake with local storage; a real account system for the public duplicates the portal identity model for little gain. Revisit after launch.
4. **A separate mobile application.** The site is responsive and installable as a progressive web app at most. Native is not warranted by the traffic.
5. **Migrating historical WordPress blog posts wholesale.** Posts with traffic or links are migrated; the rest are redirected to their category. The existing archive is thin and largely uncategorised.
6. **Multi-language.** English only. Swahili is a post-launch consideration once traffic justifies the translation workflow.

## 4. Audiences and jobs to be done

Research note: no formal interviews were run. Personas below are derived from the existing site's own content and enquiry patterns, the ERP's role model (ADR 013), and the lifecycle in `PROPERTY_LIFECYCLE_ARCHITECTURE.md`. Doc 01 §11 proposes the validation study to run against the first build.

### 4.1 Landlord or property owner (highest business value)

**Job:** "I own a building and I am tired of chasing rent and repairs. I want to hand it to someone competent and see what is happening without calling anyone."

- Arrives from a referral, a signboard, or a search like "property management companies in Nairobi".
- Wants evidence of process, not adjectives. How is rent collected? When am I paid? Who handles a broken geyser at 9pm?
- Decisive moment: seeing that Sunland runs an actual system, with a landlord portal showing statements, rather than a promise of good service.
- Primary conversion: request a valuation, or request a management proposal.

### 4.2 Prospective tenant

**Job:** "I need a 2-bedroom in Kilimani under 120k that is actually available, this month."

- Arrives from search or social, usually on a phone, usually impatient.
- Wants price, location, bedrooms, photos, and availability, in that order, without a signup wall.
- Decisive moment: a listing that answers everything without a phone call, then a fast way to book a viewing.
- Primary conversion: enquiry or viewing request on a listing.

### 4.3 Buyer or investor

**Job:** "I have capital and I want land or a villa that will hold value. Show me what is real."

- Longer consideration window, more research, more comparison across agencies.
- Wants title clarity, plot size, location context, and a named human to talk to.
- Decisive moment: specificity. Acreage, title status, and a location page that explains the area.
- Primary conversion: enquiry, or a call with a named consultant.

### 4.4 Existing tenant or landlord (returning)

**Job:** "I just need to log in, pay rent, or raise a complaint."

- Arrives directly, knows what they want, is annoyed by marketing.
- Decisive moment: finding sign-in in under two seconds.
- Primary conversion: sign-in to the tenant or landlord portal.

### 4.5 Internal: the content editor (CEO, CEO's Assistant, Head of Strategy)

**Job:** "Put this new listing up, fix that typo, publish this month's market note, without asking a developer."

- Works inside the ERP already, so a second admin tool is a tax.
- Decisive moment: editing the home page from the same sidebar they approve mandates in.

## 5. User stories

Ordered by priority within each group.

**Landlord**
- As a landlord, I want to request a valuation from the website so that Sunland contacts me with a figure and a proposal.
- As a landlord, I want to see how rent collection and remittance actually work so that I can judge whether Sunland is organised.
- As a landlord, I want to sign in to see my statements so that I do not have to phone for numbers.

**Tenant**
- As a tenant, I want to filter listings by location, price, and bedrooms so that I only see places I can afford.
- As a tenant, I want to see whether a listing is still available so that I do not waste a trip.
- As a tenant, I want to request a viewing in under a minute on my phone so that I can move on with my day.
- As a returning tenant, I want to find sign-in immediately so that I can pay rent or report a fault.

**Buyer**
- As a buyer, I want plot size, title status, and location context so that I can assess the asset.
- As a buyer, I want to reach a named consultant so that I am not talking to a form.

**Editor**
- As the CEO's Assistant, I want to publish a property to the website with one action so that the catalogue stays current.
- As the CEO, I want to reorder home page sections without a deploy so that we can respond to what is selling.
- As the Head of Strategy, I want to see which listings generate enquiries so that marketing spend follows demand.

**Property Manager**
- As a Property Manager, I want website enquiries for my properties to arrive in my queue so that nothing sits unanswered in a shared inbox.

## 6. Requirements

### 6.1 Must have (P0)

| ID | Requirement | Acceptance criteria |
|---|---|---|
| P0-1 | Marketing site runs in the ERP repo as its own route group | Public routes render without an authenticated session; portal routes remain guarded |
| P0-2 | Listings render from ERP data via a publication record | Publishing in the dashboard makes a listing public within one revalidation cycle; unpublishing removes it |
| P0-3 | Listing index with server-side filtering | Filter by listing type, category, location, bed count, and price band; results paginate; state is shareable by URL |
| P0-4 | Listing detail template | Gallery, price in JetBrains Mono, specification table, location context, assigned consultant, enquiry form, structured data |
| P0-5 | Home page per doc 04 | All sections render from CMS-managed content with sensible fallbacks |
| P0-6 | Enquiry capture writes to `leads` | A submitted enquiry creates a `leads` row at `inquiry` stage, assigned to the property's Property Manager, with an audit entry |
| P0-7 | Valuation request writes to `valuations` | Creates a row at stage `requested` with contact details captured as a `contacts` row |
| P0-8 | Content Studio in the CEO dashboard | Pages, sections, posts, testimonials, team, locations, media, and listing publication, all permission-gated |
| P0-9 | Terrain Web design system | Tokens shared with the app; no hardcoded hex in components |
| P0-10 | Legacy URL redirect map | Every legacy path in doc 02 §7 returns 301 to its new location |
| P0-11 | Structured data on every template | Validates clean in Rich Results Test; no markup for content absent from the page |
| P0-12 | Accessibility baseline | WCAG 2.1 AA: contrast, focus rings, keyboard paths, labelled fields, sequential headings |
| P0-13 | Sign-in entry point for portals | Persistent, findable in one click from any page |

### 6.2 Should have (P1)

| ID | Requirement |
|---|---|
| P1-1 | Location landing pages for the top areas, indexable and internally linked |
| P1-2 | Category landing pages (apartments, villas, commercial, land) |
| P1-3 | Blog and market insights with author attribution |
| P1-4 | Saved-search-free comparison: recently viewed listings via local storage |
| P1-5 | WhatsApp handoff on listing pages, prefilled with the listing reference |
| P1-6 | Analytics and event tracking per doc 06 §9 |
| P1-7 | `llms.txt` and AI crawler policy |

### 6.3 Future (P2)

| ID | Requirement | Why deferred |
|---|---|---|
| P2-1 | Public account with saved searches and alerts | Duplicates portal identity; wait for demand |
| P2-2 | Map-based search | Expensive to do well; needs geocoded inventory first |
| P2-3 | Virtual tours and floor plans | Depends on a photography and media workflow that does not exist yet |
| P2-4 | Swahili localisation | Translation workflow cost exceeds current benefit |
| P2-5 | Mortgage or affordability calculator | Useful, but needs lender data to avoid publishing misleading numbers |

## 7. Success metrics

**Leading (weeks)**
- Listing publish latency: dashboard action to live page, target under 60 seconds.
- Enquiry-to-lead conversion: 100% of submitted enquiries produce a `leads` row, zero orphaned submissions.
- Enquiry first-response time, measured from `leads.createdAt` to first stage transition. Baseline unknown today because the data does not exist; establish in month one.
- Mobile Core Web Vitals passing on the listing detail template.

**Lagging (quarters)**
- Organic sessions to listing and location pages.
- Valuation requests originating from the website, as a share of all new `valuations` rows.
- Share of leads with a website source that reach `viewing` or beyond.
- Citations in AI assistant answers for "property management Nairobi" style queries.

## 8. Constraints

- **Stack is fixed:** Next.js App Router, Postgres on Neon, Drizzle, Tailwind v4, TanStack Query, Framer Motion, Tabler, Pusher, Upstash Redis, React Hook Form with Zod.
- **Team:** the same delivery track as the ERP dashboards, so the website competes for the same hours. Doc 08 sequences accordingly.
- **Media:** existing photography is WhatsApp-sourced and inconsistent in aspect ratio. The design must survive imperfect images, which is a real design constraint and is handled in doc 03 §9.
- **Domain:** `sunland.co.ke` currently serves WordPress. Cutover is a launch event with DNS implications, covered in doc 08 §6.

## 9. Open questions

| # | Question | Owner | Blocks |
|---|---|---|---|
| Q1 | Does Sunland want the ERP on `app.sunland.co.ke` or to keep a separate domain? | Client | Doc 07 §2 routing |
| Q2 | Which legacy blog posts have traffic worth preserving? Needs Search Console or analytics access. | Client | Redirect map |
| Q3 | Are the 39 existing listings accurate enough to migrate, or is a data cleanup pass needed first? | Client, Head of Strategy | W1 |
| Q4 | Should sold and let listings stay public as evidence of track record, or disappear? | Client | Listing state machine |
| Q5 | Who signs off published content: CEO only, or Head of Strategy too? | Client | Permission grants |
| Q6 | Is there a brand photography budget, or do we design around existing images permanently? | Client | Doc 03 §9 |

## 10. Timeline considerations

The website depends on the ERP's `properties`, `leads`, `valuations`, and `contacts` tables, all of which are real today. It does not depend on the remaining role dashboards. This means the web platform can run partly in parallel with dashboard work rather than strictly after it, with one caveat: the Content Studio lives inside the CEO dashboard, so it should land after the CEO dashboard's own shell is stable.

## 11. Proposed validation study

Cheap, fast, worth doing before W2 locks the home page.

- **Method:** five usability sessions, three landlords and two tenants, 30 minutes each, on a clickable prototype.
- **Tasks:** find a 2-bedroom in a named area under a budget; find out how Sunland handles a repair; request a valuation.
- **What we are testing:** whether landlords find the management proposition at all, since it is the highest-value path and the current site buries it entirely.
- **Success signal:** four of five landlords locate and understand the management offer without prompting.
