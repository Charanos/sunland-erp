# Public site: inline CRUD inventory and architecture

What has to exist before an authenticated admin can edit the public site in
place, and what a signed-in visitor can already be allowed to do. Written from a
survey of the current `(web)` tree rather than from the design docs, so it
reflects what is actually built.

## The three facts that shape every decision below

1. **There are no server actions anywhere in the repository.** `grep -rl '"use
   server"' src/` returns nothing. Every mutation described here is new
   surface, not a rewiring of something existing.
2. **The public layout deliberately has no providers.**
   `src/app/(web)/layout.tsx` does not wrap children in `AppProviders`, and its
   own comment explains why: doc 03 §7 budgets 180KB of JavaScript on the home
   page, and the ERP provider tree would spend it before a component rendered.
   `ToastProvider` therefore does **not** exist on public routes.
3. **Almost all public content is TypeScript constants, not rows.** Editing it
   currently means a deploy. This is the actual blocker — inline CRUD is
   mostly meaningless until the content has a database to live in.

## What is already DB-backed (read side done, write side absent)

| Surface | Reads via | Writes |
|---|---|---|
| Listings, facets, detail | `getListings`, `getListingBySlug`, `getFacetCounts` | ERP only |
| Category / area counts | `getCategoryCounts`, `getAreasWithStock` | derived |
| Portfolio aggregates | `getHomeAggregates` | derived |
| Location stats | `getLocationStats`, `getLocationCounts` | derived |

These need no new tables. They need an **authoring path** — which already
exists inside the ERP — plus revalidation so a publish shows on the public site
without waiting out `revalidate = 3600`.

## What is constants today and needs tables to be editable

Each of these is a file an admin cannot touch without a pull request.

| Content | File | Suggested table | Priority |
|---|---|---|---|
| Team roster, roles, bios, photos | `constants/people.ts` | `web_team_members` (already the W5-13 TODO) | **High** — changes with every hire |
| Areas: 20 entries, guide prices, editorial | `constants/locations.content.ts` | `web_locations` | **High** — guide prices go stale |
| Articles: 7 posts with body blocks | `constants/insights.content.ts` | `web_posts` (the W5-11 TODO) | **High** — this is a CMS |
| Testimonials | `constants/about.content.ts` | `web_testimonials` | Medium |
| Services: 4 sections, router cards | `constants/services.content.ts` | `web_sections` | Medium |
| Home band copy and defaults | `home/home.defaults.ts` | `web_sections` | Medium |
| Commitments, story copy | `constants/about.content.ts` | `web_sections` | Low |
| Contact details, hours, socials | `constants/site.ts` | `web_settings` (single row) | Low, but trivial |

`web_sections` is already named in doc 07 §4.2 with a `key` contract the band
components were built against, so the section keys do not need inventing.

## What a *visitor* can do (no admin rights)

These are write paths that already have a form rendered and no destination.
They are the highest-value work here, because each one is a lead the business
is currently losing.

| Form | Where | Currently | Needs |
|---|---|---|---|
| Enquiry / viewing request | `properties/listing-enquiry-rail` | Builds a WhatsApp link; the form itself `setSubmitted(true)` and stops | `leads` row + notification |
| Valuation request | `landlords/inline-valuation-form` | No destination | `leads` row, source tagged |
| Contact | `forms/contact-form` | No destination | `leads` row |
| Newsletter | `layout/newsletter-form` | No destination | `web_subscribers` + double opt-in |
| Saved properties | `primitives/listing-card` save control | Renders, stores nothing | `user_saved_listings`, requires session |

Note the enquiry rail already collects name, phone, date and time slot and then
discards them in favour of a `wa.me` link. The data is being gathered; it just
is not being kept.

## Architecture decisions required before building

### 1. How does an admin edit in place?

Three options, in ascending cost:

- **A. Link out.** An "Edit in dashboard" affordance visible only to admins,
  deep-linking to the existing ERP screen. Cheapest, reuses every existing
  form and permission check, and ships in a day. The public page stays a pure
  server component with no provider tree.
- **B. Inline drawer.** Admin-only edit control opens a drawer over the public
  page, posting to a server action. Needs providers, a toast surface, and
  optimistic state on public routes.
- **C. Full inline editing.** Contenteditable blocks with autosave. Highest
  cost, highest risk, and the one most likely to leak editing JavaScript into
  the visitor bundle.

**Recommendation: A first, B for the two or three surfaces that genuinely
warrant it** — most plausibly listing status and the featured flag, where the
edit is a single field and the context is the public card itself. C is not
justified for a site this size.

### 2. Where do toasts live on public routes?

`ToastProvider` and `useToast` already exist in `components/ui/toast-provider`,
with `success | warning | error | info` tones. They cannot simply be mounted in
the `(web)` layout, because that provider is client-side and would apply to
every visitor including the ones who will never see a toast.

**Recommendation:** a thin `WebToastProvider` mounted *inside* the authed-admin
boundary only, or lazily via `next/dynamic` with `ssr: false` behind a session
check — so an anonymous visitor downloads none of it. Visitor-facing form
feedback should be inline (beside the field that failed), not a toast: a toast
that reports a validation error the user cannot see the source of is worse than
no toast.

### 3. Revalidation

Every public route is `revalidate = 3600`. A mutation must call
`revalidatePath` / `revalidateTag` or an edit will appear to do nothing for up
to an hour. Tag reads by entity — `listings`, `locations`, `posts`, `team` — so
one publish does not blow the whole cache.

### 4. Authorisation

`getCurrentUser()` and `canAccess(role, pathname)` already exist and are used by
`proxy.ts`. Every server action must re-check server-side; a hidden button is
not an authorisation model. `src/lib/services/web/*` is the public read
boundary and has an ESLint rule forbidding it from importing the internal
service layer — **mutations must not be added there.** They belong in a
sibling module that the public read boundary does not import.

## Loading, skeleton and error states

Current coverage across `(web)`:

| Route | `loading.tsx` | Notes |
|---|---|---|
| `/about` | **added** | Hero, story and footprint skeletons at real box model |
| `/` | missing | Six awaited queries; the slowest route on the site |
| `/properties` | partial | `listing-index-skeleton` exists and is used inside a Suspense boundary |
| `/locations`, `/locations/[slug]` | missing | `[slug]` awaits two queries |
| `/services`, `/insights`, `/insights/[slug]` | missing | Mostly static; low priority |
| Group-level `error.tsx` | present | `(web)/error.tsx` |

Skeletons should keep using `.web-skeleton`, which already carries the pulse and
already flattens under `prefers-reduced-motion: reduce`. Match the box model of
what replaces them — that is where the CLS budget is won.

## Suggested order

1. **Visitor write paths.** Enquiry, valuation, contact, newsletter → `leads`
   and `web_subscribers`. Business value now, no admin UI required, and the
   forms already exist.
2. **`loading.tsx` for `/` and `/locations/[slug]`.** Cheap, visible, no schema.
3. **`web_posts` and `web_team_members`.** The two constants that change most
   often, with option A editing.
4. **Revalidation tags** alongside the first mutation, not after.
5. **`web_sections` and `web_locations`.** The larger content migration.
6. **Inline drawer (option B)** for listing status and featured only, if it is
   still wanted once 1–5 are in.
