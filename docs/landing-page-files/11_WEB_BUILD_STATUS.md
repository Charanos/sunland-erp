# Sunland Web Platform: Build Status

Status: W0 to W2 landed, 2026-08-19. Owner: engineering.

This document records what is actually built, what deviates from the specs in
docs 01 to 10, and what the next wave has to pick up. It is the counterpart to
doc 08: doc 08 says what should be built, this says what is.

Where this document and an earlier doc disagree, this one describes the
repository and the earlier doc is the one that needs correcting.

---

## 1. What is live

All routes sit inside the `(web)` route group behind the `WEB_PUBLIC_ENABLED`
flag, in the same Next.js application as the ERP portals.

| Route | Template | Data |
|---|---|---|
| `/` | Home, 11 sections | Live aggregates, falls back to defaults |
| `/properties` | Listing index | Live, filtered from `properties` |
| `/properties/{facet}` | Listing index, filter pinned | Live |
| `/properties/{slug}` | Listing detail | Live |
| `/landlords` | Landlord hub, 7 sections, inline valuation form | Static content |
| `/landlords/valuation` | 308 to `/landlords#valuation` | n/a |
| `/services` | One page, 4 anchored sections | Static content |
| `/locations` | Areas hub, 3 groups, 20 areas | Live counts |
| `/locations/{slug}` | Area hub | Live price context, editorial where written |
| `/about` | About, team at `#team` | Static content |
| `/contact` | Contact, 4 channels, routing table | Static content |
| `/insights` | Index, category filter, newsletter | 1 published article |
| `/insights/{slug}` | Article | Published articles only |
| `/privacy`, `/terms` | Legal | Static, pending counsel review |
| `/sitemap` | Human sitemap | Derived from the same constants |

Portal behaviour is unchanged. Every portal prefix still redirects to
`/login?from=…` exactly as before.

---

## 2. Deviations from the specs, and why

The docs were written before the Claude Design templates existed. Where the
built design and a doc disagree, the design won and the doc needs correcting.

| Doc | Said | Built | Why |
|---|---|---|---|
| 04 §5 | Standalone `/landlords/valuation` page | Inline form at `/landlords#valuation`, old URL 308s | The design puts the form at the point of highest intent. Two forms writing the same `valuations` row would split the conversion signal and double the maintenance. |
| 04 §6 | `/services` hub plus `/services/{slug}` details | One page, four anchored sections | The four services are read comparatively. Four thin detail pages also compete with the landlord hub for the same queries. |
| 04 §8 | `/about` plus `/about/team` | Team as `#team` on `/about` | Three people and a hiring card is a section, not a page. |
| 02 §4.1 | Header carries Contact and a yellow "List your property" | Header carries Areas; Contact in footer | Areas earns more organic traffic; a yellow header CTA would compete with the hero search for the page's single yellow element. |
| 05 §5 | Landlord fees described in prose, figures optional | Real percentages published: 1 month, 8%, 2.5% | The design publishes them. Every owner asks on the first call. |
| 05 §5 | Four abstract process steps | Six-step timeline keyed to elapsed time | The question an owner is asking is "when do I get paid". |
| Areas design | h1 reads "Fifteen areas" over 20 tiles | Count derived from the taxonomy | The headline cannot drift from what is on the page. |

---

## 3. Deliberate omissions

These are not oversights. Each is a place where shipping something would have
been worse than shipping nothing, and each has a ticket.

**Forms do not submit.** The enquiry, valuation, contact and newsletter forms
are complete, validated and accessible, and they refuse honestly with the
phone number rather than showing a success panel. The pipelines in doc 07 §6
do not exist yet (W4-1, W4-2, W4-8). A visitor who believes a message reached
us and then waits is worse off than one told to call.

**No photography.** Listing cards, service sections, area cards, team cards
and article artwork all render the branded panel. Stock imagery of buildings
we do not manage, on a site whose argument is that these figures come from
properties we actually let, would undercut the claim. Each panel carries its
intended subject as its accessible name, so the labels double as the shoot
brief. (W2-3, W2-4, W5-9, W5-11.)

**Nineteen of twenty areas have no editorial.** Kilimani is written in full as
the pattern. The others render a complete page from live data: hero, computed
price table, listings, nearby areas and the valuation ask. Generated
neighbourhood prose would destroy the specificity that makes the template
worth citing. (W5-9.)

**Six of seven articles are unwritten.** They are held in
`insights.content.ts` with real titles, summaries, categories and dates, and
appear on the site only once each has a body. The index never links to an
empty page. (W5-11.)

**Privacy and Terms need counsel.** The processing described is accurate to
the build. Retention periods and lawful-basis wording need sign-off under the
Kenyan Data Protection Act 2019 before launch.

---

## 4. Two production bugs found and fixed during the build

Recorded because both are easy to reintroduce.

**Soft 404s.** A `loading.tsx` at a route group or shared segment wraps every
page beneath it in a Suspense boundary, which flushes the shell with a 200
before the page resolves. Every `notFound()` below it then becomes a soft 404:
the visitor sees the right page and a crawler sees a 200 and indexes a listing
that does not exist. The boundary is now placed explicitly with `<Suspense>`
inside `/properties/page.tsx`, and there is no group-level `loading.tsx`.

**Unknown URLs went to the login screen.** Any path that matched no public
prefix fell through to the auth guard, so a dead backlink from the old
WordPress site bounced a stranger to a staff login. `proxy.ts` now guards an
explicit `PORTAL_PREFIXES` list and lets everything else reach the marketing
404. The portal guard itself is unchanged.

---

## 5. Known state of the hero and header

The home hero and the primary navigation were refined in a separate front-end
pass and use GSAP for the hero entrance. They are **not yet the standard**.
The next session hardens both to production quality and optimises them, and
the result becomes the reference the rest of the marketing pages are revamped
against. Until then, treat the hero and header as ahead of the other pages in
polish and behind them in settledness.

Open questions for that pass: the GSAP dependency and its cost on a 3G
Android, the `prefers-reduced-motion` path through the entrance timeline, and
whether the full-bleed 4K hero image needs an AVIF or a smaller art-directed
crop below 640px.

---

## 6. What W3 and W4 pick up

1. **W4-1, W4-2, W4-8**: the three form pipelines. `web_form_submissions`
   written first in every case, per doc 07 §6.
2. **W1-1**: the schema migrations, in particular `listing_publications` with
   a real indexed slug column. Slugs are currently derived and matched in
   memory, which is fine at 39 listings and is not fine at 3,900.
3. **W1-2**: `web_locations`, so the areas hub and the area pages compute
   their guide figures from one aggregate and cannot disagree.
4. **W3**: the Content Studio. Every content constant under
   `src/components/web/constants/` is shaped as a section default already, so
   the migration is a read path change, not a rewrite.
5. **W5-2, W5-3**: `sitemap.xml`, and structured data for BreadcrumbList,
   FAQPage, Article and the listing templates. The data is already assembled
   in the components that would emit it; each carries a TODO naming the
   ticket.
