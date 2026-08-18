# Sunland Web Platform: Implementation Plan

Status: proposed, 2026-08-18. Execution document for Claude Code. Every ticket carries acceptance criteria that a reviewer can check without asking the author what they meant.

## 1. Ground rules

1. **Nothing merges without its acceptance criteria met.** Not "mostly", not "will fix in polish".
2. **Every component passes doc 03 §9** before review.
3. **Every user-facing string comes from doc 05.** No inventing copy at the keyboard.
4. **Public services are separate from internal services.** `src/lib/services/web/*` may only return published projections.
5. **Feature flag until W5.** The `(web)` group is behind `WEB_PUBLIC_ENABLED` so it can be deployed continuously without exposing an unfinished site on the live domain.
6. **No em dashes** in any string, comment, or document produced by this work.

## 2. Waves

| Wave | Theme | Depends on | Exit condition |
|---|---|---|---|
| W0 | Foundation | Nothing | Route group renders a themed shell behind the flag |
| W1 | Catalogue and listings | W0 | Real listings from real ERP data, published from the dashboard |
| W2 | Marketing pages | W0, W1 | The whole site exists with real copy |
| W3 | Content Studio | W1 | The client can edit everything without a developer |
| W4 | Engagement and routing | W1, W3 | Enquiries, valuations, viewings and alerts create owned ERP records |
| W5 | Catalogue depth | W1 to W4 | Developments, locations, insights, reviews |
| W6 | Launch | W1 to W5 | SEO, schema, redirects, performance, cutover |

### Scope added by docs 07 and 10

Beyond the original plan, these are now in scope and have tickets below: the developments model (three current featured listings are multi-unit schemes with no model), a real media pipeline with alt-text enforcement, navigation and site settings as data, viewing requests feeding the ERP scheduling module, property alerts with double opt-in, moderated reviews replacing the empty rating widget, search logging, and a durable form-submission log so no enquiry is ever lost to a transient failure.

---

## 3. Tickets

### W0: Foundation

**W0-1 Marketing route group and host routing**
Create `src/app/(web)/` with its own layout. Extend `middleware.ts` with host-based routing per doc 07 §2. Portal behaviour must be byte-for-byte unchanged.
*Acceptance:* a request to the web host renders the public layout with no session; a request to a portal path on the web host redirects to the app host; every existing portal route still resolves; the portal middleware test suite passes untouched.

**W0-2 Terrain Web tokens**
Add the token layer from doc 03 §2 to the shared Tailwind v4 theme. No new colour values beyond those listed.
*Acceptance:* tokens resolve in both `(web)` and portal components; a grep for `#f3df27` and `#151936` outside the theme file returns nothing in new code.

**W0-3 Web shell: header, footer, consent band**
Per doc 03 §3.10 and doc 04 §11.
*Acceptance:* header transitions on scroll using opacity only; mobile drawer traps focus and closes on Escape; skip-to-content is the first focusable element; footer links match doc 02 §4.2; consent band blocks analytics until accepted.

**W0-4 Base primitives**
Button, SectionBand, Eyebrow, StatBlock, Container, Prose. Doc 03 §3.
*Acceptance:* every variant and state from doc 03 exists and is exercised in a local preview route; all pass the §9 checklist.

**W0-5 Error and loading templates**
404, 500, loading skeletons, per doc 04 §3.9 and doc 05 §11.
*Acceptance:* 404 and 500 render with real copy and working links; skeletons match the dimensions of the components they stand in for, verified by a CLS measurement under 0.05.

---

### W1: Listings

**W1-1 Schema: publications, locations, media**
Migrations for `listing_publications`, `web_locations`, `web_media` per doc 07 §4, with indexes.
*Acceptance:* migration applies and rolls back cleanly; indexes present; `propertyId` unique constraint enforced.

**W1-2 Location taxonomy seed**
Seed `web_locations` from the areas the business actually covers: Kilimani, Lavington, Kileleshwa, Westlands, Runda, Spring Valley, Riverside, Parklands, Garden Estate, Thome, Kasarani, Nairobi West, Baba Dogo, Ruiru, Rongai, Tatu City, plus Mombasa coverage where stock exists.
*Acceptance:* each has a slug, a name, and coordinates; no free-text location strings remain in the publication path.

**W1-3 Public listing service**
`src/lib/services/web/listings.ts` with an explicit select list. Filtering, sorting, pagination, facet counts.
*Acceptance:* a unit test asserts the returned object contains no internal field (mandate terms, fee rate, landlord contact, internal valuation); filters are allowlisted; SQL is parameterised.

**W1-4 Listing card component**
Doc 03 §3.2, including both fallbacks.
*Acceptance:* renders correctly with a null price ("Price on request"), with no image (branded placeholder), and with a 60-character title (clamped to two lines); the whole card is one link whose accessible name is the title; no currency placeholder can render.

**W1-5 Listing index and facet pages**
`/properties` plus the resolver in doc 07 §3.1, with the reserved segment list.
*Acceptance:* a listing slugged `apartments` cannot be created; facet pages under three listings 301 to the parent; pagination uses real links; filter state round-trips through the URL; empty state offers three alternatives.

**W1-6 Filter bar**
Doc 03 §3.3, with the mobile sheet.
*Acceptance:* keyboard operable end to end; result count announced via `aria-live`; applied filters render as removable chips; "Clear all" resets to the facet baseline, not to the site root.

**W1-7 Listing detail page**
All sections in doc 04 §3.
*Acceptance:* every numeric renders in JetBrains Mono; gallery lightbox traps focus and restores it on close; the consultant block shows the real assigned Property Manager; sticky rail on desktop and fixed bar on mobile; similar listings never include the current one.

**W1-8 Publish action in the property dashboard**
`publishListing` per doc 07 §5.1, with the `content.listing.publish` permission and a dashboard action.
*Acceptance:* publishing makes the listing live within 60 seconds; unpublishing removes it; both write audit entries; a user without the permission sees no action and receives a 403 from the API.

**W1-9 Migrate the 39 existing listings**
Script mapping current live listings onto properties and publications, with a manual review pass.
*Acceptance:* every migrated listing has a price or an explicit "price on request", a location from the taxonomy, at least one image, and a slug recorded against its legacy URL for the redirect map.

---

### W2: Marketing pages

**W2-1 Home page**
All nine sections in doc 04 §1, with defaults from doc 05.
*Acceptance:* renders fully with an empty `web_sections` table; exactly one yellow element per viewport; the LCP element is the hero headline; sections hide rather than render empty per their individual rules.

**W2-2 Landlord hub and how-it-works**
Doc 04 §4.
*Acceptance:* the valuation call to action appears three times; the FAQ is an accessible accordion with `FAQPage` markup; the portal screenshots are real, not mockups of features that do not exist.

**W2-3 Services hub and four detail pages**
Doc 04 §6.
*Acceptance:* each detail page carries an FAQ and links to at least two relevant facets or locations.

**W2-4 About, Team, Contact**
Doc 04 §8 and §10.
*Acceptance:* team cards link to the listings each consultant manages; the contact page shows the real HQ address and working phone, WhatsApp and email links; the general form is wired in W4.

**W2-5 Legal pages**
Privacy and Terms as real pages. Launch blocker per doc 06.
*Acceptance:* both resolve, both are linked from the footer, and the privacy page describes what the enquiry forms actually collect.

---

### W3: Content Studio

**W3-1 `content` permission catalog**
Doc 07 §7, seeded per role.
*Acceptance:* `seedPermissionCatalog()` includes the new keys; every grant matches the table; a `property_manager` cannot publish; system roles remain immutable via API per ADR 012.

**W3-2 Studio shell at `/admin/website`**
Navigation, list and edit patterns reusing the existing board and drawer components.
*Acceptance:* uses the existing board skeleton, modal, drawer, confirm dialog and toast; pagination at 5 to 8 rows; no new UI primitives invented.

**W3-3 Pages and sections editor**
Schema-driven fields per doc 07 §4.3, with reorder and visibility toggles.
*Acceptance:* saving invalid content is impossible because fields derive from the Zod schema; reordering updates the live page after revalidation; an unknown section key renders nothing rather than throwing.

**W3-4 Media library**
Upload, alt text, folders, blur placeholder generation.
*Acceptance:* validated by magic bytes; alt text required before an image can be attached to a listing hero; blur placeholders generated at upload.

**W3-5 Posts, testimonials, team, locations editors**
*Acceptance:* posts support draft and publish with author attribution; testimonials cannot be published without an attributed name; locations require an intro block before publishing, since that block is the AI-extractable answer in doc 06 §5.1.

**W3-6 Redirects manager**
`web_redirects` CRUD with hit counts.
*Acceptance:* adding a redirect takes effect without a deploy; a loop is rejected at save time; hit counts increment.

---

### W4: Lead capture

**W4-1 Enquiry endpoint and forms**
Doc 07 §6.1, with the form component from doc 03 §3.5.
*Acceptance:* creates `contacts` and `leads` rows; assignment follows doc 07 §6.3 with the Head of Strategy fallback; a client-supplied `propertyId` is ignored; honeypot and rate limits verified; success state matches doc 05.

**W4-2 Valuation endpoint and form**
Doc 07 §6.2, page per doc 04 §5.
*Acceptance:* creates a `valuations` row at stage `requested` visible in the acquisition pipeline; notifies the Head of Strategy and the CEO's Assistant; the success state returns a reference.

**W4-3 Enquiry inbox in the Studio**
List of website enquiries with their resulting lead, status and assignee.
*Acceptance:* every website enquiry appears with a link to its lead; `content.enquiry.read` gates access.

**W4-4 Notifications and real-time**
Pusher events to the assigned manager plus notification rows.
*Acceptance:* an open Property Manager dashboard shows a new enquiry without a refresh; the notification links to the lead.

**W4-5 UTM capture and attribution**
*Acceptance:* UTM parameters persist through the session and land on the lead record; `leads.source` distinguishes website from other origins.

---

### W5: Launch readiness

**W5-1 Redirect map**
Crawl the live site, pair every listing URL with its new slug, load into `web_redirects`, plus the static rules from doc 02 §7 in `next.config.ts`.
*Acceptance:* an automated check asserts every crawled legacy URL returns 301 to a 200 destination. Zero exceptions. This is the launch gate.

**W5-2 Sitemap and robots**
Doc 02 §8 and doc 06 §6, plus `llms.txt`.
*Acceptance:* sitemap index splits by type; `lastmod` comes from record timestamps; facet eligibility respected; robots matches doc 06 §6 exactly.

**W5-3 Structured data**
Doc 06 §4 across every template.
*Acceptance:* Rich Results Test passes on home, listing, index, location, service, post and contact; a CI check asserts required properties are non-null; no markup exists for absent content.

**W5-4 Metadata**
Per-page titles and descriptions from doc 05 §12, plus OG images.
*Acceptance:* no page carries the old slogan as its title; every template interpolates live values correctly; OG images render for listings.

**W5-5 Performance pass**
Budget in doc 03 §7.
*Acceptance:* Lighthouse mobile: performance 90+, accessibility 95+, best practices 95+, SEO 100 on home and listing detail; JS under 180KB gzipped on home; fonts preloaded and subset.

**W5-6 Accessibility audit**
Doc 03 §6.
*Acceptance:* axe reports zero critical or serious issues on every template; a full keyboard pass through search, filter, gallery, and enquiry succeeds; verified at 200% zoom.

**W5-7 Analytics**
Event map in doc 06 §9, consent-gated.
*Acceptance:* every event fires with its documented properties; nothing loads before consent.

**W5-8 Cutover**
See §6.

---

### W6: Growth surfaces

**W6-1 Location hubs** with live price context per doc 04 §7.
*Acceptance:* price tables compute from live listings and state their basis and date; no hardcoded figures.

**W6-2 Category and location facet pages** subject to the three-listing rule.

**W6-3 Insights** index and post template, doc 04 §9, with the new taxonomy from doc 06 §8.

**W6-4 Launch content:** ten posts from doc 06 §8, and hand-written intro copy for every active location.
*Acceptance:* no templated area copy with a swapped name; each post links to at least one location or service page.

**W6-5 AI SEO surfaces:** answer-first blocks, FAQ markup, comparison tables per doc 06 §5.

---

### W1 extensions: catalogue depth

**W1-10 Taxonomies**
`web_property_types` and `web_locations`, both hierarchical, seeded from real coverage. Replaces the plugin's free-text location strings and the "General" junk type.
*Acceptance:* a parent location aggregates child inventory without duplicating listings; no free-text location reaches a publication row.

**W1-11 Media pipeline**
`web_media`, folders, magic-byte validation, checksum dedupe, blur placeholders, dominant colour.
*Acceptance:* a duplicate upload is detected by checksum; alt text is required before an asset can be set as a listing or post hero; a 4MB phone photo is served under 200KB at card size.

**W1-12 Amenities and documents**
`web_amenities` controlled vocabulary, `listing_amenities`, `listing_documents` with gating.
*Acceptance:* amenities render from the vocabulary only; a gated brochure requires a lead before returning a signed, expiring URL.

**W1-13 Search**
Weighted tsvector on listings, GIN index, trigger-maintained, plus allowlisted filters and `web_search_log`.
*Acceptance:* a client-supplied sort or filter key that is not allowlisted is rejected before query construction; every search writes a log row; zero-result queries are reportable.

**W1-14 Publish gate and queue**
`publishListing` validation per doc 07 §8.2, plus `web_publish_queue` with retry and scheduled publishing.
*Acceptance:* a listing with no image, no price and no `hidePrice`, or a description under 120 characters, cannot publish; a failed revalidation is retried, not lost.

---

### W4 extensions: engagement

**W4-6 Durable submission log**
`web_form_submissions` written before any downstream processing, with retry for failures.
*Acceptance:* forcing a lead-creation failure leaves a `failed` submission that the retry job later processes; no submission is ever lost.

**W4-7 Viewing requests**
`viewing_requests` with up to three proposed slots, confirmation into the ERP scheduling module.
*Acceptance:* a confirmed viewing creates a real appointment against the assigned manager; the prospect receives confirmation; no-show and completed states feed the lead.

**W4-8 Property alerts**
`web_subscribers`, `property_alerts`, double opt-in, one-click unsubscribe, matching on publish plus cron.
*Acceptance:* an unconfirmed subscriber receives nothing; publishing a matching listing notifies instant subscribers; unsubscribe works in one click without a login.

**W4-9 Zero-result capture**
Empty search states offer an alert subscription.
*Acceptance:* a zero-result search offers to notify, and accepting creates an alert with the exact criteria searched.

---

### W5: Catalogue depth

**W5-9 Developments model and template**
`developments`, `development_phases`, `development_unit_types`, plus the development landing template.
*Acceptance:* a scheme renders its unit types with price ranges, deposit percentage and payment plan; the three current affordable-housing listings migrate into real developments; a listing can link to its parent unit type.

**W5-10 Location hubs** with live price context computed from listings, per doc 04 §7.
*Acceptance:* price tables state their basis and date; no hardcoded figures.

**W5-11 Insights** index and post template, new taxonomy, `answerBlock` required before publish.
*Acceptance:* a post cannot publish without an answer block and at least one related location or service.

**W5-12 Reviews**
`web_reviews` with moderation queue.
*Acceptance:* no aggregate rating renders or is marked up below three approved reviews; nothing ever renders "0.0 (0)".

**W5-13 Navigation and settings as data**
`web_navigations`, `web_nav_items`, `web_site_settings`.
*Acceptance:* the client can add a nav item, change the phone number and swap the logo without a deploy; a social link with no URL does not render.

---

## 4. Sequencing and parallelism

```
W0 ──► W1 ──► W2 ──────► W5 ──► W6
        │      │          ▲
        └─► W3 ┴─► W4 ────┘
```

W2 and W3 can run in parallel once W1 lands, because section components ship with defaults and do not block on the editor existing. W4 depends on W1 for listing resolution and on W3 only for the enquiry inbox, so the endpoints can land before the Studio screen.

## 5. Definition of done, per ticket

- [ ] Acceptance criteria met, demonstrably
- [ ] Doc 03 §9 component checklist passed
- [ ] Copy taken from doc 05, not improvised
- [ ] Server component unless interaction requires a client component
- [ ] Empty, loading and error states implemented
- [ ] Public service returns no internal field
- [ ] Mutation carries `authorize` and `writeAudit`
- [ ] Revalidation tags fired where content changed
- [ ] Tested on a 390px viewport and with keyboard only
- [ ] No new dependency without a written justification

## 6. Cutover runbook

Executed in this order, on a low-traffic morning.

**T minus 7 days**
1. Full crawl of the live WordPress site; export every URL.
2. Build and verify the per-listing redirect map (W5-1).
3. Export any blog posts worth keeping; import to `web_posts`.
4. Export the media library; upload to `web_media` with real alt text.
5. Stand the new site up on a staging hostname; client review with Roxy.

**T minus 1 day**
6. Reduce the DNS TTL on `sunland.co.ke` to 300 seconds.
7. Final content freeze on WordPress.
8. Re-run the crawl to catch anything added since; update the redirect map.

**T zero**
9. Deploy with `WEB_PUBLIC_ENABLED` on.
10. Point DNS at the new deployment. Keep the WordPress instance running, not deleted.
11. Verify: home, a listing, a facet, the landlord hub, a legal page, an enquiry submission end to end into a real lead.
12. Run the redirect assertion suite against the live domain.
13. Submit the new sitemap in Search Console; request indexing of the top 20 pages.
14. Update the Google Business Profile link.

**T plus 1 to 30 days**
15. Watch Search Console for crawl errors and 404s daily for the first week; add redirects from the Studio as needed.
16. Monitor enquiry volume against the pre-launch baseline. A drop means a broken form, so it is an alert, not a metric.
17. Keep WordPress running for 30 days as a rollback path, then archive it.
18. Restore the DNS TTL.

**Rollback:** DNS back to WordPress. Because the ERP is on a separate hostname, a website rollback does not touch the portals at all, which is a direct benefit of the topology in doc 07 §2.

## 7. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Legacy URLs missed, rankings lost | Medium | High | W5-1 as a hard gate; keep WordPress live 30 days; Studio-editable redirects |
| Photo library too weak to carry the design | High | Medium | Design defensively per doc 03 §5; scrims, placeholders, enforced ratios; raise the photography question early (doc 01 Q6) |
| Listing data quality below what a public site can show | Medium | High | W1-9 review pass; "price on request" rather than a broken figure |
| Content Studio scope grows into a general CMS | Medium | Medium | Schema-driven sections only; anything beyond doc 07 §4.3 is a new decision |
| Website work competes with dashboard delivery | High | Medium | Waves are independently shippable behind a flag; W1 alone already beats the current site |
| Client expects rent payment on the public site | Medium | Medium | Stated as a non-goal in doc 01 §3; payment lives in the tenant portal |

## 8. First three tickets to start

For whoever picks this up cold: **W0-1**, **W0-2**, **W1-1**. Route group, tokens, schema. Everything else has one of these three as an ancestor.
