# Sunland Web Platform: ADR Drafts

Status: proposed, 2026-08-18. These are drafted in the house style of `docs/ARCHITECTURE_DECISIONS.md` and are intended to be appended there, renumbered to follow ADR 015, once accepted. They are kept separate until then so the canonical decision record is not polluted with unratified proposals.

Numbering here is provisional (W1 to W6). On merge they become ADR 016 onward.

---

## ADR W1: Public Website in the ERP Repository, Not a Separate CMS

**Context:** `sunland.co.ke` runs WordPress with Elementor, a directory plugin, and a stray WooCommerce install. It lists 39 properties that also exist, separately and by hand, in the ERP's `properties` table. The two drift immediately: the live site currently renders price placeholders on indexable pages, shows "0.0 (0)" review widgets, and links its Terms and Privacy pages at `#`. Meanwhile every enquiry arrives in a shared inbox with no owner and no route into `leads`.

**Decision:** the public website is built as a route group inside the existing Next.js application, sharing the database, the service layer, and the Terrain Identity design system. It is not a separate deployment, and there is no headless CMS. Content is edited from a Content Studio module inside the CEO dashboard.

**Why:** the entire value of the rebuild is that listings and leads become shared state rather than duplicated state. Every alternative reintroduces the duplication:

- **Headless CMS (Sanity, Payload, Strapi):** excellent editing, and then listings live in two systems again, with a sync job to write and a second admin for the client to learn.
- **Separate Next.js app against the same database:** either two database clients to keep in step, or an internal API between them, in exchange for a separation nothing here needs.
- **Keep WordPress, integrate by API:** the plugin surface is the problem, and an integration layer over it inherits every constraint while adding a failure mode.

**Trade-off accepted:** one deployment serves both the marketing site and the portals, so a bad deploy affects both. Mitigated by preview deployments, by the marketing routes being statically generated and continuing to serve from cache, and by host separation that keeps a website rollback (a DNS change) entirely clear of the portals.

**Rationale & build detail:** `docs/web/07_WEB_BACKEND_ARCHITECTURE.md` §2.

---

## ADR W2: `listing_publications` as the Public Projection of a Property

**Context:** the website needs to show properties, but `properties` rows carry landlord terms, mandate fee rates, internal valuations, and reserve prices. Most properties under management are also not publicly marketed at any given time.

**Decision:** publication is modelled as a separate 1:1 table, `listing_publications`, keyed on `propertyId`, holding the public projection: slug, public title and description, display price, denormalised specs, gallery, publication status, and SEO overrides. Public services read only this table. Publishing is a permissioned, audited action (`content.listing.publish`).

**Why:** three reasons, in order of weight.

1. **Leak prevention by construction rather than by discipline.** If the public renderer can only see the publication record, no future refactor can accidentally expose a landlord's reserve price. Filtering internal fields at the serialization layer relies on every developer remembering; a separate table does not.
2. **Public and internal truth legitimately differ.** The asking price shown publicly, the price a landlord will accept, and the rent eventually achieved are three different numbers. One column cannot hold all three honestly.
3. **Publication is an event with its own lifecycle.** `publishedAt`, `unpublishedAt`, `noindex`, and SEO overrides belong to the act of publishing, not to the property.

**Rejected:** boolean and slug columns on `properties`. Simpler, and it fails on all three points above, most seriously the first.

**Trade-off accepted:** denormalised specs can drift from the source property. Handled by a `needsResync` flag set on property update plus a nightly resync job, specified in `07_WEB_BACKEND_ARCHITECTURE.md` §5.3. Reading specs live from `properties` was rejected because it couples public rendering to the operational table and removes the ability to present a different public figure, which is the point of the split.

---

## ADR W3: Reserved Segments Under `/properties`

**Context:** the desired URL shapes are `/properties/{slug}` for a listing and `/properties/{category}` for a facet. These collide: a listing slugged `apartments` would shadow the apartments facet.

**Decision:** a frozen `RESERVED_LISTING_SEGMENTS` constant holds every status, category, and location segment. The catch-all resolver checks it before falling through to a listing lookup, and the slug generator rejects and suffixes any colliding slug at creation time.

**Why:** the alternative, `/properties/listing/{slug}`, inserts a meaningless segment into the most linked and most shared URL on the site. A reserved word list costs one constant and one check at slug generation, and the collision then becomes impossible rather than merely unlikely.

**Rationale & build detail:** `docs/web/02_WEB_SITE_ARCHITECTURE.md` §5.1, `07_WEB_BACKEND_ARCHITECTURE.md` §3.1.

---

## ADR W4: Web Enquiries Run Through a `system:web` Principal

**Context:** public forms must write to `leads`, `contacts`, and `valuations`, which are governed by `authorize(ctx, key)` and `writeAudit`. There is no authenticated user on a public form.

**Decision:** public write paths call the same services through the same `CallerContext` template, using a dedicated `system:web` principal that holds exactly `crm.lead.write`, `crm.contact.write`, and `properties.valuation.write`, and nothing else. Audit entries record the actor as `system:web` with the originating IP and page.

**Why:** the tempting shortcut is an unauthenticated service path that skips `authorize`. That creates a second, weaker way into the write layer, and second ways in are how authorization models rot. Modelling the website as a narrowly-scoped principal keeps exactly one enforcement path and gives the audit log an honest actor.

**Consequences:** the permission catalog gains a non-human principal, which is new for this system. It must be excluded from `identity.user` listings and from `isLastSuperAdmin()` accounting, and it cannot be granted additional keys through the API.

---

## ADR W5: `content` Permission Module and the Draft/Publish Split

**Context:** ADR 013 §13.5 left the `admin_assistant` permission design explicitly open, pending client confirmation. The Content Studio is the first module where that role has real, daily work.

**Decision:** a new `content` module in the permission catalog per ADR 011's `<module>.<resource>.<action>` structure. Grants:

- `ceo`: all keys, per ADR 012's explicit super-admin holding.
- `head_of_strategy`: all content keys including publish, since ADR 013 §13.1 puts marketing under this role.
- `admin_assistant`: all content keys **except** `*.publish` and `content.redirect.write`.
- `property_manager`: `content.listing.read`, `content.listing.write`, `content.enquiry.read`.
- `front_office_head`: `content.enquiry.read`.

**Why the assistant split:** ADR 013 §13.5 framed the role as amplifying the CEO's reach without inheriting the CEO's sign-off power, and excluded financial approval on exactly that reasoning. Publishing to the public website is the marketing equivalent of a sign-off: it is the irreversible, externally visible act. Drafting without publishing preserves the role's usefulness and the precedent simultaneously.

**Flagged for client confirmation**, consistent with how ADR 013 §13.5 flagged rather than assumed.

---

## ADR W6: AI Crawlers Allowed, Bulk Training Crawlers Declined

**Context:** `robots.txt` must decide policy for GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot, anthropic-ai, Google-Extended, and CCBot.

**Decision:** allow every search-and-cite crawler. Disallow `CCBot`.

**Why:** the distinction is whether the crawl produces a referral path. An assistant that reads a location page and cites Sunland when someone asks what rent costs in Kilimani is delivering qualified traffic, and blocking it forfeits that for nothing. `CCBot` feeds bulk training corpora with no citation mechanism, so it takes content and returns no referral.

**Consequences:** content must be written to be extractable, which is why `web_locations.intro` is a required field before a location can be published, and why the landlord hub and service pages carry `FAQPage` markup. Reversible in one line if the client's view differs.

**Rationale & build detail:** `docs/web/06_WEB_SEO_SCHEMA.md` §5 and §6.

---

## Open items to resolve before ratification

| # | Question | Blocks |
|---|---|---|
| 1 | Does the ERP move to `app.sunland.co.ke`, or keep its current hostname? | ADR W1 routing detail |
| 2 | Does the client accept the `admin_assistant` draft-not-publish split? | ADR W5 |
| 3 | Does the client want AI crawlers allowed? | ADR W6 |
| 4 | Do let and sold listings stay public for the 90-day window? | Listing state machine, doc 06 §3.6 |
| 5 | Must a property have an active mandate before it can be published? | `publishListing` guard, doc 07 §5.1 |
