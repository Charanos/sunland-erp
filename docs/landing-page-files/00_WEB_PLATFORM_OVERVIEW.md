# Sunland Web Platform: Documentation Index

Status: proposed, 2026-08-18. Owner: engineering. Companion set to the ERP docs already in `docs/`.

This directory specifies the public-facing Sunland website (`sunland.co.ke`) as a first-class part of the existing ERP codebase rather than a separate marketing site bolted on beside it. The website is the front end of the same system: listings originate in the ERP's `properties` table, enquiries land in the ERP's `leads` table, valuation requests open the ERP's acquisition pipeline, and every word and image on the site is edited from the CEO dashboard.

## 0. Read this first: the one idea

The current site and the ERP are two disconnected products describing the same portfolio. A property is listed by hand in WordPress, then managed separately in the ERP, and the two drift within a week. The website is also where Sunland's own lifecycle actually begins:

```
  Public website                      ERP (already built)
  ─────────────                       ───────────────────
  "Request a valuation"      ──────►  Phase 1  valuations (stage: requested)
  "List your property"       ──────►  Phase 1  → mandate (Phase 2/3)
  Listing enquiry            ──────►  Phase 4  leads (pipeline_stage: inquiry)
  Listing detail page        ◄──────  Phase 3/4 properties + listing publication
  Tenant / landlord sign-in  ──────►  Phase 5/6 leases, rent, remittances
```

Read left to right, the website is lead generation. Read right to left, it is publication. Both directions run on one database with no export step, no re-keying, and no second CMS. That is the whole thesis of this doc set.

## 1. The documents

| # | Document | Answers | Primary consumer |
|---|---|---|---|
| 00 | `00_WEB_PLATFORM_OVERVIEW.md` (this file) | What are we building, and in what order? | Everyone |
| 01 | `01_WEB_PRODUCT_SPEC.md` | Who is it for, what must it do, what is explicitly out? | Product, client sign-off |
| 02 | `02_WEB_SITE_ARCHITECTURE.md` | What pages exist, at what URLs, linked how? | Claude Code, SEO |
| 03 | `03_WEB_DESIGN_SYSTEM.md` | What does it look like, down to the token? | Claude Design, Claude Code |
| 04 | `04_WEB_PAGE_SPECS.md` | What is on each page, section by section? | Claude Design, Claude Code |
| 05 | `05_WEB_COPY_DECK.md` | What does it actually say? | Claude Code, client review |
| 06 | `06_WEB_SEO_SCHEMA.md` | How is it found, by search and by AI? | Claude Code, marketing |
| 07 | `07_WEB_BACKEND_ARCHITECTURE.md` | Schema, APIs, CMS, caching, publication | Claude Code |
| 08 | `08_WEB_IMPLEMENTATION_PLAN.md` | Build order, tickets, acceptance criteria | Claude Code |
| 09 | `09_WEB_ADR_DRAFTS.md` | Decisions to merge into `ARCHITECTURE_DECISIONS.md` | Engineering |
| 10 | `10_LEGACY_INVENTORY_AND_GAPS.md` | What the old site did, what it failed to do, what to add | Product, engineering |
| 11 | `11_WEB_BUILD_STATUS.md` | What is actually built, and where it deviates from 01 to 10 | Everyone |

Read 10 → 01 → 02 → 07 before writing any code. Read 03 → 04 → 05 before designing any screen.

**Read 11 first if you are picking the build up.** Docs 01 to 10 were written before the code and the Claude Design templates existed. Where doc 11 and an earlier doc disagree, doc 11 describes the repository and the earlier doc is the one that needs correcting.

**This is a greenfield build.** Nothing from the WordPress installation survives: not the theme, not the plugins, not the database, not the templates. Only content migrates. Doc 10 records what the old site did so that no capability is lost by accident, and doc 07 specifies the twenty-six tables that replace six plugins.

## 2. Relationship to the existing ERP docs

| Existing doc | How the web platform relates |
|---|---|
| `SUNLAND_ERP_IMPLEMENTATION_SPEC.md` | Tech stack and Terrain Identity are inherited wholesale. The website introduces no new framework-level dependency. |
| `PROPERTY_LIFECYCLE_ARCHITECTURE.md` | The website is the public face of phases 1 and 4, and the sign-in door for phases 5 and 6. |
| `ARCHITECTURE_DECISIONS.md` | ADR 013 (role roster) governs who may edit content. New ADRs are drafted in doc 09. |
| `SUNLAND_TENANT_LANDLORD_PORTALS_SPEC.md` | The website hosts the entry point; the portals themselves stay in the app. |

## 3. Non-negotiable constraints

These are inherited, not up for renegotiation inside this doc set:

1. **One repo, one Next.js app.** The marketing site is a route group beside the portals, not a second deployment with a second database.
2. **Terrain Identity holds.** Sunland Yellow `#f3df27` on Brand Dark `#151936`, Cormorant Garamond titles, Nunito body, JetBrains Mono for every price and reference, Tabler icons, font weight capped at 500.
3. **The ERP is the source of truth.** No listing is typed twice. A public listing is a publication record pointing at a real `properties` row.
4. **Content is edited in the CEO dashboard.** No WordPress, no Sanity, no second admin surface for the client to learn.
5. **Every public write lands in a real ERP table** with the same `authorize` + `writeAudit` treatment as any internal mutation.
6. **Copy rules:** no em dashes, no "X is not merely Y" constructions, sentence case in headings, weights capped at 500.

## 4. Build order at a glance

| Wave | Scope | Ships | Status |
|---|---|---|---|
| W0 | Marketing route group, host routing, Terrain Web tokens, layout shell | Skeleton behind a flag | Done |
| W1 | Catalogue schema, `/properties` index, listing detail, media pipeline | Real listings, real data | Index and detail done against existing `properties`; schema and media pending |
| W2 | Home, Landlords, Services, About, Team, Contact | The site as a whole | Done, plus Areas, Insights and legal |
| W3 | Content Studio: pages, sections, navigation, media, blog, settings | Client editability | Next |
| W4 | Enquiries, valuations, viewings, alerts, assignment and routing | Fullstack loop closed | Forms built, pipelines pending |
| W5 | Developments, locations, insights, reviews | Full catalogue depth | Templates built, content pending |
| W6 | SEO, schema, redirects, sitemap, analytics, cutover | Launch | Pending |

Doc 08 expands each wave into tickets with acceptance criteria.

## 5. Definition of done for the platform

- A property published from the CEO dashboard appears on `sunland.co.ke` without a developer touching anything.
- An enquiry on a listing page appears in the assigned Property Manager's queue within seconds.
- A valuation request from the website opens a row in the acquisition pipeline at stage `requested`.
- Lighthouse: performance 90+, accessibility 95+, SEO 100 on the home and listing templates.
- Every legacy WordPress URL with traffic or a backlink resolves through a 301 to its new home.
- No page renders a price, date, or reference in anything other than JetBrains Mono.
