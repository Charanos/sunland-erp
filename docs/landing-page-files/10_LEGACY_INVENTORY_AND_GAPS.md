# Sunland Web Platform: Legacy Inventory, Parity and Gap Analysis

Status: proposed, 2026-08-18. Read before doc 07. This document exists so that nothing the current site does is lost by accident, and so that the things it fails to do are recorded as requirements rather than discovered in month three.

## 0. Framing

The rebuild is greenfield. Nothing from WordPress survives: not the theme, not the plugins, not the database, not the templates. What survives is the **content** (listings, images, team, testimonials, a handful of posts) and the **behaviour worth keeping**.

That framing matters for how this document is used. This is not a migration plan for a WordPress site. It is a requirements capture exercise that happens to use the current site as its primary source, because the current site is the most complete existing statement of what this business needs a website to do.

## 1. What the current stack actually is

Fingerprinted from the live rendering on 2026-08-18:

| Layer | Current | Replaced by |
|---|---|---|
| CMS | WordPress | `web_pages` + `web_sections`, Content Studio in the CEO dashboard |
| Page builder | Elementor 3.31.2 | React section components, schema-driven |
| Theme | `homirx` + `homirx-themer` | Sunland Web design language, doc 03 |
| Directory | Directory plugin (`directory_type` taxonomy, `/directory/{type}/{slug}` URLs) | `listing_publications` + `web_property_types`, doc 07 |
| Events | The Events Calendar (`tec-api` meta present) | `web_events`, open houses and site visits |
| Commerce | WooCommerce (cart, checkout, account routes) | Removed entirely, no replacement needed |
| Forms | Plugin forms to email | `web_form_submissions` writing into `leads` and `valuations` |
| Reviews | Plugin rating widget, rendering 0.0 (0) | `web_reviews`, moderated, only shown when real |
| Search | Plugin search with radius, tags, price, beds, baths, rating | Postgres full text plus geo, doc 07 §7 |

The commercially important observation: roughly six plugins, each with its own data model, none of which talk to the ERP. Every one of them is replaced by a table in the same database the business already runs on.

## 2. Feature parity matrix

Every capability observable on the live site. "Keep" means it must exist at launch. "Improve" means it exists but is broken or weak. "Drop" means deliberately not rebuilt.

### 2.1 Property catalogue

| # | Current capability | Verdict | Notes |
|---|---|---|---|
| 1 | Listings across 5 types: General, Apartment, Villa, Commercial, Land for sale | Improve | "General" is a junk bucket. New taxonomy in `web_property_types` with a real hierarchy |
| 2 | Listing detail pages with gallery | Keep | Rebuilt, doc 04 §3 |
| 3 | Featured flag | Keep | `listing_publications.isFeatured` with an explicit rank |
| 4 | Popular flag | Improve | Currently manual. Derive from real view counts, or drop the badge |
| 5 | Premium badge (on the "Perfect Property Match" carousel) | Drop | A third badge vocabulary with no defined meaning |
| 6 | Price display with KSh formatting | Improve | Currently renders `KShKShKShKSh` when null, and one listing shows `$456.00`. Null-safe, single currency path |
| 7 | Bed and bath counts | Keep | Typed columns, mono rendering |
| 8 | Area in sqft | Improve | Store in sqm canonically, display in either, never mix as the current site does (`666sqft - 2332 sqft` as free text) |
| 9 | Price per sqft for commercial | Keep | `priceQualifier` field handles `per month`, `per sqft`, `per acre` |
| 10 | Location taxonomy with images | Keep | `web_locations`, hierarchical, with real copy per area |
| 11 | Tag taxonomy | Improve | Currently a mix of concepts: "2 bedroom apartment", "Lavington", "LAND FOR SALE", "Luxury Living". Split into real dimensions: type, location, amenity, campaign |
| 12 | Listing reviews and ratings | Improve | Rebuilt as moderated `web_reviews`. Never render an empty rating |

### 2.2 Search and filtering

| # | Current capability | Verdict | Notes |
|---|---|---|---|
| 13 | Keyword search | Keep | Postgres full text with a weighted tsvector |
| 14 | Category filter | Keep | Becomes an indexable facet page |
| 15 | Location select | Keep | Controlled taxonomy, not free text |
| 16 | Price min and max | Keep | Plus preset bands for mobile |
| 17 | Bed and bath filters | Keep | |
| 18 | Radius search in miles | Improve | Kilometres, and only once listings are reliably geocoded. P1, not launch |
| 19 | Review rating filter | Drop | Filtering by a rating nobody has submitted is theatre |
| 20 | Tag filter | Improve | Only after the tag taxonomy is split per row 11 |
| 21 | Saved searches | Missing | Added as property alerts, §3 |

### 2.3 Content and marketing

| # | Current capability | Verdict | Notes |
|---|---|---|---|
| 22 | Blog with categories and monthly archives | Improve | New taxonomy. Archives dropped, they are a WordPress convention with no user value |
| 23 | Team page with photos and roles | Keep | Linked to real ERP users where the person is staff |
| 24 | Testimonials | Keep | Attributed, moderated |
| 25 | Video embed on home | Keep | `web_media` supports an external video reference |
| 26 | Footer photo gallery | Improve | Becomes a curated gallery block rather than six random uploads |
| 27 | Location tiles on home | Keep | Currently link to `#`. Will link to real location hubs |
| 28 | About and Services pages | Keep | Rebuilt with real structure |
| 29 | Google reviews claim ("450+ reviews") | Improve | Either wire the real Google Business Profile rating or remove the claim. An unsourced number on a page that also shows 0.0 ratings undermines both |

### 2.4 Conversion and contact

| # | Current capability | Verdict | Notes |
|---|---|---|---|
| 30 | Contact form | Keep | Writes to `leads`, not to an inbox |
| 31 | Appointment booking form (property status + type) | Improve | Becomes a real viewing request tied to the ERP scheduling module |
| 32 | WhatsApp link | Keep | Prefilled with the listing reference |
| 33 | Phone and email in header and footer | Keep | From `web_site_settings`, editable |
| 34 | Office address with map directions | Keep | Plus `LocalBusiness` schema |
| 35 | Social links | Improve | The Twitter link points at `#`. Only render links that exist |

### 2.5 Removed

| # | Current | Why |
|---|---|---|
| 36 | WooCommerce cart, checkout, account | No transaction happens on this site. Dead weight and crawlable junk URLs |
| 37 | Monthly date archives | No value, and they create thin indexable pages |
| 38 | "Uncategorized", "Fitness Zone", "Restaurant" post categories | Noise from a theme demo import |
| 39 | Elementor and plugin CSS and JS payload | Replaced by the performance budget in doc 03 |

## 3. What is missing, and matters

This is the more valuable half of the document. Ordered by business impact.

### 3.1 Developments and projects (highest impact, currently invisible)

The site is already selling project-based inventory and has no model for it. Three of the featured listings are affordable housing schemes: "Iten Phase 1 Affordable Housing", "Shauri Moyo Estate A Affordable Housing Unit", and "Own an Affordable Home with Just 5% Deposit". These are not single properties. They are developments with phases, multiple unit types, payment plans, deposit structures, and construction timelines, all forced into a single-property template that cannot express any of it.

**Required:** a `developments` model with phases, unit types, price ranges, payment plans, completion dates, and a development landing template. A buyer asking "what does a 2-bedroom in Shauri Moyo cost and what deposit do I need" cannot get an answer from the current site. That is a direct, measurable loss of sales.

### 3.2 The landlord funnel

No valuation request, no management proposition, no mandate pathway. Covered at length in docs 01, 02 and 04. Restated here because it is the single largest commercial gap.

### 3.3 Portal entry

Nothing links to the ERP. Existing tenants and landlords have no door. Once the tenant and landlord portals ship, the website is the only place most of them will look for it.

### 3.4 Viewing requests as real appointments

The current appointment form emails someone. It should create a scheduling record against the assigned Property Manager's calendar, with confirmation and reminders. The ERP already has a scheduling module; the website should feed it.

### 3.5 Property alerts

A prospect who does not find what they want today is currently lost. An alert subscription against saved criteria turns a zero-result search into a future lead, and gives the Head of Strategy a live demand signal for stock acquisition.

### 3.6 Search intelligence

No record exists of what people search for and fail to find. Logging queries and zero-result searches converts the website from a cost centre into an acquisition input: it tells the business exactly which areas and price bands to chase stock in.

### 3.7 Brochures, floor plans and documents

Property marketing runs on PDFs. There is no document model, so brochures are not offered at all. A gated brochure download is also one of the highest-intent lead captures available in this sector.

### 3.8 Open houses and site visits

The Events Calendar plugin is installed, which suggests intent, but nothing surfaces. Site visits for land and development launches are a normal part of this market and deserve a real model.

### 3.9 Structured enquiry auditing

Every form submission should be recorded before any downstream processing, so that a failure in lead creation never silently loses a customer. The current setup has no record at all beyond an email that may or may not arrive.

### 3.10 Editorial and SEO control

No per-page titles, no meta descriptions, no structured data, no redirect management, no sitemap control. Covered in doc 06.

## 4. Optimizations available on the new stack

Things that become possible only because the site and the ERP share a database.

| # | Optimization | Mechanism |
|---|---|---|
| O1 | Listings that are never stale | Published from `properties`; a let unit changes status in the ERP and the site follows |
| O2 | Real, live statistics | "Units under management" computed, not claimed |
| O3 | Location price context from live inventory | "2-bed in Kilimani typically 90k to 130k, based on 14 current listings" |
| O4 | The actual assigned manager on every listing | Name, photo and phone from the ERP user record |
| O5 | Enquiry to owned lead in under a second | No inbox, no triage meeting |
| O6 | Attribution through to mandate | `leads.source` and UTM persist, so the business can see which channel produces mandates, not clicks |
| O7 | Demand signal for acquisition | Zero-result searches and alert subscriptions become a stock shopping list |
| O8 | One publish action, many surfaces | Listing, facet, location page, sitemap and structured data all update from one event |
| O9 | Editorial control without a developer | Content Studio, with permissions matching the existing role model |
| O10 | Performance as a default | Static generation plus tag revalidation, against a page currently carrying six plugins of overhead |

## 5. Content migration inventory

What actually moves across, and what it costs.

| Asset | Volume | Method | Effort |
|---|---|---|---|
| Listings | 39 across 4 types | Scripted extract, manual review against `properties` | High, needs judgement on each |
| Listing images | ~150 to 200 | Bulk download, upload to `web_media`, alt text written by hand | High, alt text is manual |
| Locations | ~15 named areas | Manual, with new hand-written copy per area | Medium |
| Team | 3 published members | Manual | Low |
| Testimonials | 2 | Manual | Low |
| Blog posts | Unclear, thin, mostly uncategorised | Triage: migrate anything with traffic, redirect the rest | Low |
| Developments | 3 identified | Manual, into the new development model | Medium, new structure |
| Legal pages | None exist | Written from scratch | Medium, needs client input |

Alt text is called out deliberately. Around 200 images each need a written description, and there is no way to automate it honestly. It is the largest hidden cost in the migration and it should be scheduled, not discovered.

## 6. Decisions this document forces

| # | Question | Needed by |
|---|---|---|
| 1 | Are developments a launch requirement, or a fast follow? They are three of the current featured listings, which argues for launch | Schema freeze |
| 2 | Do we publish real ratings, or drop ratings entirely until there is a review pipeline? | Listing template |
| 3 | Is the Google "450+ reviews" figure real and sourceable? | Home page proof section |
| 4 | Should brochures be gated behind a form, or open? Gated converts better, open ranks better | Document model |
| 5 | Who writes the location copy and the 200 alt texts, us or the client? | Migration schedule |
| 6 | Does radius search matter enough to geocode the whole portfolio? | Search scope |
