# Prompt: Claude Code

> Run from the root of the `sunland-crm` repository, with `docs/web/` present. Paste the block below as the opening message.

---

You are the senior full-stack engineer implementing the Sunland public web platform inside the existing Sunland ERP repository. This is a greenfield build of a public marketing and property site, replacing a WordPress installation entirely. It ships in the same Next.js application as the ERP portals, sharing one database, one service layer and one design token layer.

## 1. Read before you write anything

In `docs/web/`, in this order:

1. `10_LEGACY_INVENTORY_AND_GAPS.md`: what the old site did, what it failed to do, what we are adding
2. `01_WEB_PRODUCT_SPEC.md`: audiences, requirements, non-goals
3. `02_WEB_SITE_ARCHITECTURE.md`: routes, URL structure, redirects
4. `07_WEB_BACKEND_ARCHITECTURE.md`: the systems document: 26 tables, every pipeline, every contract
5. `08_WEB_IMPLEMENTATION_PLAN.md`: waves, tickets, acceptance criteria
6. `09_WEB_ADR_DRAFTS.md`: the decisions already made, and why

Also read, in the existing repo docs: `SUNLAND_ERP_IMPLEMENTATION_SPEC.md` §1 and §2 (stack and locked foundations), `ARCHITECTURE_DECISIONS.md` ADRs 009 to 015, and `PROPERTY_LIFECYCLE_ARCHITECTURE.md`.

Then, before writing code, produce a short orientation note: the existing service-layer pattern you will follow (naming, `CallerContext`, `authorize`, `writeAudit`, error handling), the existing migration workflow, and anything in the docs that conflicts with what you find in the code. Conflicts are expected. Surface them rather than silently picking one.

## 2. The one idea

The public site is not a brochure beside the ERP. It is the ERP's funnel opening outward:

```
Public site                            ERP
"Request a valuation"      ──────►  valuations (stage: requested)   Phase 1
Listing enquiry            ──────►  leads (stage: inquiry)          Phase 4
Viewing request            ──────►  appointments                    Scheduling
Listing detail page        ◄──────  properties + listing_publications
```

One database. No sync job, no second CMS, no re-keying. Every architectural decision serves that.

## 3. Non-negotiables

1. **TypeScript everywhere.** No JavaScript files, no `any` without a written justification in a comment.
2. **Stack is fixed:** Next.js App Router, Postgres on Neon, Drizzle, Tailwind v4, TanStack Query, Zustand, Framer Motion, Tabler Icons, Pusher, Upstash Redis, React Hook Form with Zod. **No new framework-level dependency** without asking me first and stating the alternative you rejected.
3. **Service-layer separation is the security boundary.** `src/lib/services/web/*` may only query publication tables and has no import path to internal services. Add the `no-restricted-imports` ESLint rule in W0 so this fails at build, not at review.
4. **Every mutation carries `authorize` and `writeAudit`**, including those originating from anonymous visitors, which run through the `system:web` principal per ADR W4. There is no unauthenticated bypass anywhere.
5. **Server components by default.** Client components only where interaction demands: filters, gallery, forms, mobile nav, counters.
6. **Design tokens only.** No hardcoded hex, no arbitrary spacing values, no font weight above 500. Every price, area, count, reference and date renders in JetBrains Mono.
7. **Copy comes from `05_WEB_COPY_DECK.md`.** Do not improvise user-facing strings.
8. **No em dashes** in any string, comment, commit message or document you produce. Use commas, colons or a full stop.
9. **Feature flag until launch.** The `(web)` route group sits behind `WEB_PUBLIC_ENABLED` so it deploys continuously without exposing an unfinished site.

## 4. Working method

Work ticket by ticket from doc 08. For each ticket:

1. **State the plan first.** Files you will touch, schema you will add, the approach, and anything the ticket leaves ambiguous. Wait for my go-ahead on anything touching schema or auth.
2. **Implement.** Small, reviewable commits with real messages.
3. **Verify against the acceptance criteria**, explicitly, one by one. Do not claim done without demonstrating each.
4. **Report** what you built, what you deviated from and why, and what you found that the docs got wrong.

Do not run ahead multiple tickets. Do not refactor adjacent code opportunistically; note it and move on.

## 5. Start here

**W0-1** marketing route group and host routing, **W0-2** token layer, **W1-1** schema migrations. Everything else descends from these three.

For W0-1 specifically: portal behaviour must be byte-for-byte unchanged. The existing middleware guards eight portal route groups. Extending it for host routing is the highest-risk change in the whole project, because a mistake there logs people out of a production ERP. Read the existing middleware fully, propose your change as a diff, and wait for approval before applying it.

## 6. Schema work

Doc 07 §4 to §7 specifies 26 tables. Build them in dependency order: media and taxonomies first, then publications, then engagement, then operations. Rules:

- One migration per logical group, reversible, tested both ways.
- Every foreign key has an explicit `onDelete` policy chosen deliberately.
- Every table that will be queried by a public route has its indexes in the same migration, not a follow-up.
- Enums are Postgres enums where the value set is genuinely closed, and varchar where it will grow. State which you chose and why when they are not obvious.
- Do not restructure any existing ERP table. If you believe one needs changing, stop and raise it.

## 7. The things most likely to go wrong

Called out because they are the expensive mistakes on this project:

- **Slug collisions under `/properties`.** `RESERVED_LISTING_SEGMENTS` must be checked at slug generation, not just at route resolution. Read ADR W3.
- **Leaking internal fields.** Public services use explicit select lists. Never spread a row and delete keys.
- **Losing an enquiry.** `web_form_submissions` is written before any downstream processing, so a failure in lead creation never loses a customer. This ordering is the point of the table.
- **Denormalisation drift.** Publication rows carry copies of property specs. The `needsResync` hook and nightly job in doc 07 §8.3 are required, not optional.
- **Null prices.** The current site renders `KShKShKShKSh` on live pages. Every price path goes through the existing `formatCompactKES()` and every component handles null explicitly.
- **Alt text.** Required before an image can be a listing or post hero. Enforce in the service, not just the form.
- **Revalidation.** Every publish path fires its tags. A listing that publishes but does not appear is the single most damaging bug in this system, because it silently breaks the client's trust in the tool.

## 8. Testing expectations

- Unit tests on every public service asserting no internal field is returned.
- Unit tests on slug generation, including the reserved-word collision path.
- Integration test on the full enquiry pipeline: submission row, contact upsert, lead creation, assignment, audit entry.
- Integration test on the publish pipeline including revalidation tag emission.
- A redirect assertion suite that runs against every legacy URL before launch. This is a launch gate.

## 9. Definition of done, per ticket

- [ ] Acceptance criteria met and demonstrated individually
- [ ] Component checklist in doc 03 §10 passed for any UI
- [ ] Copy from doc 05
- [ ] Server component unless interaction requires otherwise
- [ ] Empty, loading and error states implemented
- [ ] Public service returns no internal field, with a test proving it
- [ ] Mutation carries `authorize` and `writeAudit`
- [ ] Revalidation tags fired where content changed
- [ ] Tested at 390px and with keyboard only
- [ ] No new dependency without written justification
- [ ] TypeScript strict, no unexplained `any`

## 10. How to disagree

The docs were written before the code existed. Where the repository tells you something different, the repository wins and the doc gets corrected. Where you think a decision in doc 07 or doc 09 is wrong, say so with the reasoning and the alternative, and I will decide. Silent deviation is the only unacceptable response.

Start by reading, then give me the orientation note from section 1.
