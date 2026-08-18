# Sunland Web Platform: Backend Architecture and Data Model

Status: proposed, 2026-08-18. Supersedes the earlier draft. Consumes docs 01, 02 and 10. Feeds docs 08 and 09.

This is the systems document. It defines every table, relationship, pipeline and contract for the public platform. It assumes greenfield: nothing is inherited from the current WordPress installation except content.

---

## 1. Requirements

**Functional**
- Serve a public marketing and property site from the same codebase and database as the ERP.
- Publish individual listings and multi-unit developments from the ERP without re-keying.
- Run a full editorial CMS: pages, sections, navigation, blog, media, testimonials, team, FAQs, legal.
- Capture every public interaction as a durable record, and route it into the ERP as an owned, audited entity.
- Support search, filtering, geographic queries, alerts and viewing requests.
- Give the client complete control of content, navigation, SEO and redirects from the CEO dashboard.

**Non-functional**
- Public pages served statically or from cache. A marketing visitor never waits on the database for unchanged content.
- Public traffic cannot degrade the portals. A crawler on listings must not slow a Finance query.
- No public route can leak internal data. Enforced by table separation, not by field filtering.
- Every mutation carries `authorize` and `writeAudit`, including those originating from anonymous visitors.
- Zero new framework-level dependencies.

**Constraints:** Next.js App Router, Postgres on Neon, Drizzle, Tailwind v4, TanStack Query, Zustand, Framer Motion, Tabler, Pusher, Upstash Redis, React Hook Form with Zod.

---

## 2. Topology

One repository, one Next.js application, one database, two hostnames.

```
                    ┌──────────────────────────────┐
   sunland.co.ke ──►│  middleware.ts (host router) │
app.sunland.co.ke ─►└──────────────┬───────────────┘
                                   │
              ┌────────────────────┴────────────────────┐
              ▼                                         ▼
      src/app/(web)/                    src/app/(exec|fin|hr|bd|front|ops|landlord|tenant)/
      public, no session                authenticated portals
              │                                         │
              ▼                                         ▼
   src/lib/services/web/*  ── read-only projections     src/lib/services/*
              │             ── writes via system:web    │
              └──────────────┬──────────────────────────┘
                             ▼
              Postgres (Neon) · Upstash Redis · Object storage
```

**Routing rules in `middleware.ts`:**
1. Public host, rewrite into `(web)`. Portal paths on the public host redirect to the app host.
2. App host, existing portal behaviour, unchanged.
3. `www` 301s to apex.
4. `web_redirects` lookup runs on the 404 path only, not on every request.

**Service-layer separation is the security boundary.** `src/lib/services/web/*` may only query publication tables and has no import path to internal services. Enforced by an ESLint `no-restricted-imports` rule so it fails at build rather than at review.

---

## 3. Data model overview

Twenty-six new tables in five groups. Nothing in the existing ERP schema is restructured.

```
CONTENT                    CATALOGUE                  ENGAGEMENT
web_site_settings          web_property_types         web_form_submissions
web_pages                  web_locations              web_enquiries
web_sections               listing_publications       viewing_requests
web_navigations            listing_media              web_subscribers
web_nav_items              listing_documents          property_alerts
web_media                  web_amenities              web_reviews
web_media_folders          listing_amenities          web_search_log
web_posts                  developments
web_post_categories        development_phases         OPERATIONS
web_post_tags              development_unit_types     web_redirects
web_post_tag_map                                      web_publish_queue
web_testimonials
web_team_members
web_faqs
```

### 3.1 Relationships

```
properties (ERP) ──1:1──► listing_publications ──*──► listing_media ──► web_media
                                │                 └─*─► listing_documents ──► web_media
                                ├──*──► listing_amenities ──► web_amenities
                                ├──► web_locations       (hierarchical, self-ref)
                                ├──► web_property_types  (hierarchical, self-ref)
                                └──► development_unit_types ──► development_phases ──► developments

contacts (ERP) ◄── upsert ── web_form_submissions ──► web_enquiries ──► leads (ERP)
                                    │                          └──► viewing_requests ──► appointments (ERP)
                                    └──► valuations (ERP)

users (ERP) ◄──► web_team_members ,  web_posts.authorUserId ,  listing.assignedAgentId

web_pages ──*──► web_sections   (jsonb content, schema-validated per key)
web_navigations ──*──► web_nav_items  (self-ref for nesting)
```

---

## 4. Schema: content and CMS

### 4.1 `web_site_settings`

Singleton. Everything appearing on every page that the client should change without a developer.

```ts
export const webSiteSettings = pgTable("web_site_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  singleton: boolean("singleton").notNull().default(true).unique(),  // enforces one row

  siteName: varchar("site_name", { length: 120 }).notNull(),
  tagline: varchar("tagline", { length: 200 }),
  logoLightId: uuid("logo_light_id").references(() => webMedia.id),
  logoDarkId: uuid("logo_dark_id").references(() => webMedia.id),
  faviconId: uuid("favicon_id").references(() => webMedia.id),
  defaultOgImageId: uuid("default_og_image_id").references(() => webMedia.id),

  primaryPhone: varchar("primary_phone", { length: 32 }),
  whatsappNumber: varchar("whatsapp_number", { length: 32 }),
  email: varchar("email", { length: 160 }),
  addressLine: varchar("address_line", { length: 240 }),
  postalAddress: varchar("postal_address", { length: 80 }),
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),
  mapsUrl: text("maps_url"),
  officeHours: jsonb("office_hours").$type<{ day: string; opens: string; closes: string }[]>(),

  socials: jsonb("socials").$type<Record<string, string>>().default({}),

  defaultSeoTitle: varchar("default_seo_title", { length: 200 }),
  defaultSeoDescription: varchar("default_seo_description", { length: 320 }),

  maintenanceMode: boolean("maintenance_mode").default(false).notNull(),
  announcementBar: jsonb("announcement_bar").$type<{ text: string; href?: string; active: boolean }>(),

  ...timestamps,
});
```

`socials` is a sparse map on purpose. The current site renders a Twitter icon linking to `#`; a sparse map means a link that does not exist is not rendered.

### 4.2 `web_pages` and `web_sections`

Structured content, never a rich-text blob, so an editor cannot break the design system.

```ts
export const webPages = pgTable("web_pages", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: varchar("key", { length: 80 }).notNull().unique(),       // "home" | "landlords"
  path: varchar("path", { length: 200 }).notNull().unique(),
  title: varchar("title", { length: 200 }).notNull(),
  seoTitle: varchar("seo_title", { length: 200 }),
  seoDescription: varchar("seo_description", { length: 320 }),
  ogMediaId: uuid("og_media_id").references(() => webMedia.id),
  noindex: boolean("noindex").default(false).notNull(),
  status: contentStatus("status").notNull().default("draft"),   // draft|in_review|published
  publishedAt: timestamp("published_at"),
  publishedById: uuid("published_by_id").references(() => users.id),
  ...timestamps,
});

export const webSections = pgTable("web_sections", {
  id: uuid("id").primaryKey().defaultRandom(),
  pageId: uuid("page_id").notNull().references(() => webPages.id, { onDelete: "cascade" }),
  key: varchar("key", { length: 80 }).notNull(),                // "home.hero", doc 04 IDs
  variant: varchar("variant", { length: 40 }),
  displayOrder: integer("display_order").notNull().default(0),
  isVisible: boolean("is_visible").notNull().default(true),
  content: jsonb("content").$type<Record<string, unknown>>().notNull().default({}),
  ...timestamps,
});
```

**The section contract.** Each `key` maps to a component, a Zod schema and defaults in one registry:

```ts
export const SECTION_REGISTRY = {
  "home.hero": { component: HomeHero, schema: homeHeroSchema, defaults: homeHeroDefaults },
} as const satisfies Record<string, SectionDefinition>;
```

Three consequences, each load-bearing:
1. The Content Studio renders its editor form from `schema`, so invalid content cannot be saved.
2. A component renders `defaults` when its row is missing, so the site is fully functional before any content is entered.
3. An unknown key renders nothing rather than throwing, so a bad edit cannot take the home page down.

### 4.3 Navigation

Menus are data. The current site's nav is baked into a theme, which is why the footer "Gallery" link points at `/properties`.

```ts
webNavigations: id, key(unique: header|footer_discover|footer_owners|mobile), label, timestamps
webNavItems:    id, navigationId, parentId(self-ref, nullable), label, href, target,
                badge, icon, displayOrder, isVisible, requiresAuth, timestamps
```

`parentId` supports the mega panel and nested footer groups.

### 4.4 `web_media` and `web_media_folders`

```ts
export const webMedia = pgTable("web_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  folderId: uuid("folder_id").references(() => webMediaFolders.id),
  kind: mediaKind("kind").notNull().default("image"),          // image|document|video_embed
  storageKey: text("storage_key").notNull(),
  url: text("url").notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  sizeBytes: integer("size_bytes"),
  width: integer("width"),
  height: integer("height"),
  blurDataUrl: text("blur_data_url"),
  dominantColor: varchar("dominant_color", { length: 9 }),
  alt: varchar("alt", { length: 300 }),
  caption: varchar("caption", { length: 300 }),
  credit: varchar("credit", { length: 160 }),
  externalUrl: text("external_url"),                            // youtube/vimeo when kind=video_embed
  checksum: varchar("checksum", { length: 64 }),                // dedupe on re-upload
  uploadedById: uuid("uploaded_by_id").references(() => users.id),
  ...timestamps,
});
```

`checksum` matters at migration: importing roughly 200 images from WordPress will contain duplicates, and deduplicating at ingest is far cheaper than curating later.

### 4.5 Blog

```ts
export const webPosts = pgTable("web_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  title: varchar("title", { length: 250 }).notNull(),
  excerpt: varchar("excerpt", { length: 400 }),
  answerBlock: text("answer_block"),           // the 40-60 word extractable answer, doc 06 §5.1
  body: text("body").notNull(),                // markdown
  categoryId: uuid("category_id").references(() => webPostCategories.id),
  heroMediaId: uuid("hero_media_id").references(() => webMedia.id),
  authorUserId: uuid("author_user_id").references(() => users.id),
  authorNameOverride: varchar("author_name_override", { length: 120 }),
  status: contentStatus("status").notNull().default("draft"),
  publishedAt: timestamp("published_at"),
  updatedContentAt: timestamp("updated_content_at"),   // real dateModified, not a row touch
  readingMinutes: integer("reading_minutes"),
  viewCount: integer("view_count").default(0).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  relatedLocationIds: jsonb("related_location_ids").$type<string[]>().default([]),
  relatedServiceKeys: jsonb("related_service_keys").$type<string[]>().default([]),
  seoTitle: varchar("seo_title", { length: 200 }),
  seoDescription: varchar("seo_description", { length: 320 }),
  noindex: boolean("noindex").default(false).notNull(),
  searchVector: tsvector("search_vector"),
  ...timestamps,
});

webPostCategories: id, slug(unique), name, description, displayOrder, seoTitle, seoDescription, timestamps
webPostTags:       id, slug(unique), name, timestamps
webPostTagMap:     postId, tagId  (composite pk)
```

`answerBlock` is required before publish. It is the paragraph AI assistants extract, and making it a column rather than a convention guarantees every post has one.

`relatedLocationIds` and `relatedServiceKeys` enforce doc 02 §6's rule that no post is an orphan.

### 4.6 Testimonials, team, FAQs

```ts
webTestimonials: id, quote, authorName, authorRole, authorLocation, mediaId,
                 relatedPropertyId(nullable), rating(nullable), source,
                 isPublished, displayOrder, capturedAt, timestamps

webTeamMembers:  id, userId(nullable → users), name, role, department, bio,
                 phone, email, mediaId, socials(jsonb), displayOrder,
                 isPublished, showOnListings, timestamps

webFaqs:         id, groupKey, question, answer, displayOrder, isPublished, timestamps
```

`webFaqs.groupKey` lets one FAQ bank serve the landlord hub, every service page and relevant posts, all emitting `FAQPage` markup from a single source.

`webTeamMembers.userId` is the join that puts the real assigned Property Manager, with their real phone, on a listing page.

---

## 5. Schema: property catalogue

### 5.1 Taxonomies

Both hierarchical, both replacing free-text plugin taxonomies.

```ts
webPropertyTypes: id, slug(unique), name, pluralName, parentId(self-ref), icon,
                  description, heroMediaId, displayOrder, isActive,
                  seoTitle, seoDescription, introCopy, timestamps

webLocations:     id, slug(unique), name, parentId(self-ref), county,
                  intro(required before publish), body, heroMediaId,
                  latitude, longitude, boundsGeoJson, displayOrder,
                  isActive, isFeatured, seoTitle, seoDescription, timestamps
```

Hierarchy example: `nairobi` → `westlands` → `parklands`. A parent location page aggregates its children's inventory, so "property in Westlands" returns Parklands stock without duplicating listings.

### 5.2 `listing_publications`

```ts
export const listingPublications = pgTable("listing_publications", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id").references(() => properties.id, { onDelete: "cascade" }).unique(),
  entityId: uuid("entity_id").references(() => entities.id),

  slug: varchar("slug", { length: 200 }).notNull().unique(),
  reference: varchar("reference", { length: 32 }).notNull().unique(),   // SL-A-01423, shown publicly
  title: varchar("title", { length: 250 }).notNull(),
  summary: varchar("summary", { length: 400 }),
  description: text("description"),

  listingIntent: listingIntent("listing_intent").notNull(),             // let | sale
  displayPrice: numeric("display_price", { precision: 14, scale: 2 }),
  priceQualifier: priceQualifier("price_qualifier"),                    // per_month|per_sqft|per_acre|total
  currency: varchar("currency", { length: 3 }).notNull().default("KES"),
  hidePrice: boolean("hide_price").default(false).notNull(),
  serviceCharge: numeric("service_charge", { precision: 12, scale: 2 }),
  depositTerms: varchar("deposit_terms", { length: 160 }),

  propertyTypeId: uuid("property_type_id").references(() => webPropertyTypes.id),
  locationId: uuid("location_id").references(() => webLocations.id),
  developmentUnitTypeId: uuid("development_unit_type_id").references(() => developmentUnitTypes.id),

  beds: integer("beds"),
  baths: integer("baths"),
  areaSqm: numeric("area_sqm", { precision: 12, scale: 2 }),
  plotSizeAcres: numeric("plot_size_acres", { precision: 10, scale: 4 }),
  parking: integer("parking"),
  floorNumber: integer("floor_number"),
  furnishing: furnishingLevel("furnishing"),
  titleStatus: varchar("title_status", { length: 80 }),
  yearBuilt: integer("year_built"),
  availableFrom: date("available_from"),

  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),
  hideExactLocation: boolean("hide_exact_location").default(false).notNull(),

  heroMediaId: uuid("hero_media_id").references(() => webMedia.id),
  isFeatured: boolean("is_featured").default(false).notNull(),
  featuredRank: integer("featured_rank"),
  assignedAgentId: uuid("assigned_agent_id").references(() => users.id),

  status: webListingStatus("status").notNull().default("draft"),         // draft|in_review|published|unlisted|archived
  publicStatus: publicAvailability("public_status").notNull().default("available"), // available|under_offer|let|sold
  publishedAt: timestamp("published_at"),
  unpublishedAt: timestamp("unpublished_at"),
  needsResync: boolean("needs_resync").default(false).notNull(),

  seoTitle: varchar("seo_title", { length: 200 }),
  seoDescription: varchar("seo_description", { length: 320 }),
  noindex: boolean("noindex").default(false).notNull(),
  viewCount: integer("view_count").default(0).notNull(),
  enquiryCount: integer("enquiry_count").default(0).notNull(),
  searchVector: tsvector("search_vector"),

  ...timestamps,
});
```

Indexes: `(status, publicStatus)`, `(propertyTypeId, locationId)`, `(listingIntent, displayPrice)`, `(publishedAt desc)`, `(isFeatured, featuredRank)`, GIN on `searchVector`, geo index on `(latitude, longitude)`.

**Why a separate table rather than columns on `properties`:**

1. **Leak prevention by construction.** If the public renderer can only reach this table, no future refactor exposes a landlord's reserve price, mandate fee rate or internal valuation. Filtering fields at serialization relies on every developer remembering.
2. **Public and internal truth legitimately differ.** Asking price, the landlord's acceptable floor, and the rent eventually achieved are three different numbers.
3. **Publication is an event** with its own lifecycle, permissions and audit trail.
4. **Most managed stock is not publicly marketed** at any given moment.

### 5.3 Media, documents, amenities

```ts
listingMedia:     id, listingId, mediaId, role(hero|gallery|floorplan|video),
                  displayOrder   unique(listingId, mediaId, role)

listingDocuments: id, listingId, mediaId, kind(brochure|floorplan|title|other),
                  label, isGated, requiresLead, downloadCount, timestamps

webAmenities:     id, slug(unique), name, icon,
                  category(indoor|outdoor|security|utility), displayOrder, isFilterable

listingAmenities: listingId, amenityId  (composite pk)
```

A controlled amenity vocabulary is what makes amenities filterable later. Free-text amenities, which is effectively what the current tag system is, can never be filtered reliably.

`isGated` supports the brochure-for-contact-details exchange from doc 10 §3.7.

### 5.4 Developments: the model the current site lacks

Three current featured listings are multi-unit affordable housing schemes crammed into a single-property template: Iten Phase 1, Shauri Moyo Estate A, and a 5% deposit scheme. None of them can express unit types, phases or payment plans today.

```ts
export const developments = pgTable("developments", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  name: varchar("name", { length: 250 }).notNull(),
  tagline: varchar("tagline", { length: 250 }),
  summary: varchar("summary", { length: 500 }),
  description: text("description"),
  developerName: varchar("developer_name", { length: 200 }),
  locationId: uuid("location_id").references(() => webLocations.id),
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),

  category: developmentCategory("category"),      // affordable_housing|gated_community|apartments|commercial|plots
  status: developmentStatus("status"),            // planned|selling|under_construction|completed|sold_out
  totalUnits: integer("total_units"),
  availableUnits: integer("available_units"),
  completionDate: date("completion_date"),

  priceFrom: numeric("price_from", { precision: 14, scale: 2 }),
  priceTo: numeric("price_to", { precision: 14, scale: 2 }),
  depositPercent: numeric("deposit_percent", { precision: 5, scale: 2 }),
  paymentPlan: jsonb("payment_plan").$type<{ label: string; detail: string }[]>(),
  mortgageAvailable: boolean("mortgage_available").default(false),

  heroMediaId: uuid("hero_media_id").references(() => webMedia.id),
  brochureMediaId: uuid("brochure_media_id").references(() => webMedia.id),
  amenities: jsonb("amenities").$type<string[]>().default([]),
  assignedAgentId: uuid("assigned_agent_id").references(() => users.id),

  publicationStatus: webListingStatus("publication_status").notNull().default("draft"),
  publishedAt: timestamp("published_at"),
  isFeatured: boolean("is_featured").default(false).notNull(),
  seoTitle: varchar("seo_title", { length: 200 }),
  seoDescription: varchar("seo_description", { length: 320 }),
  searchVector: tsvector("search_vector"),
  ...timestamps,
});

developmentPhases:    id, developmentId, name("Phase 1"), status, totalUnits,
                      availableUnits, launchDate, completionDate, displayOrder

developmentUnitTypes: id, developmentId, phaseId(nullable), name("2 Bedroom Type B"),
                      beds, baths, areaSqm, priceFrom, priceTo, totalUnits,
                      availableUnits, floorplanMediaId, displayOrder
```

A listing may reference a `developmentUnitTypeId`, linking a specific available unit back to its parent scheme. This unlocks the template that answers what the current site cannot: which unit types exist, what each costs, what deposit is required, and when it completes.

---

## 6. Schema: engagement

### 6.1 `web_form_submissions`

Every submission is recorded **before** downstream processing. This is the durability guarantee: if lead creation fails, the customer is not lost.

```ts
webFormSubmissions: id, formKey(listing_enquiry|general|valuation|viewing|brochure|alert|newsletter),
                    payload(jsonb, raw validated input),
                    sourcePath, referrer, utmSource, utmMedium, utmCampaign, utmTerm, utmContent,
                    ipHash, userAgent, sessionId,
                    status(received|processed|failed|spam),
                    processedAt, failureReason, retryCount,
                    contactId(nullable), createdEntityType, createdEntityId, timestamps
```

`ipHash` rather than raw IP: sufficient for rate limiting and abuse analysis without storing personal data unnecessarily.

### 6.2 Enquiries and viewings

```ts
webEnquiries:    id, submissionId, listingId(nullable), developmentId(nullable),
                 contactId, leadId(nullable), enquiryType, message,
                 preferredContact(phone|whatsapp|email), assignedToId,
                 status(new|contacted|qualified|closed), firstResponseAt, timestamps

viewingRequests: id, enquiryId, listingId, contactId, requestedSlots(jsonb, up to 3),
                 confirmedSlot, appointmentId(nullable), assignedToId,
                 status(requested|confirmed|rescheduled|completed|no_show|cancelled),
                 notes, timestamps
```

`firstResponseAt` is the metric doc 01 §7 flagged as unmeasurable today because the data does not exist. Now it does.

### 6.3 Subscribers and alerts

```ts
webSubscribers: id, email, phone, contactId(nullable), name, consentSource, consentAt,
                confirmToken, confirmedAt, unsubscribeToken, unsubscribedAt, isActive, timestamps

propertyAlerts: id, subscriberId, label, criteria(jsonb: intent, typeIds, locationIds,
                minPrice, maxPrice, minBeds), frequency(instant|daily|weekly),
                lastRunAt, lastMatchCount, isActive, timestamps
```

Double opt-in via `confirmToken`, one-click `unsubscribeToken`. Legal hygiene and deliverability hygiene.

The business value: an alert is a demand signal. A hundred alerts for 2-bed Kilimani under 100k is a stock acquisition brief for the Head of Strategy.

### 6.4 `web_reviews`

Replaces the plugin widget currently rendering "0.0 (0)" on every card.

```ts
webReviews: id, authorName, authorEmail, rating(1-5), title, body,
            listingId(nullable), relatedService(nullable),
            source(website|google|manual), externalId,
            status(pending|approved|rejected), moderatedById, moderatedAt,
            isFeatured, timestamps
```

Enforced in the service layer, not just the UI: aggregate ratings are computed and marked up in schema only when at least three approved reviews exist. Below that, no rating renders anywhere.

### 6.5 `web_search_log`

```ts
webSearchLog: id, queryText, filters(jsonb), resultCount, locationId(nullable),
              sessionId, hadInteraction, timestamps
```

Indexed on `(resultCount, createdAt)` so the zero-result report is cheap. This is the table that turns the website into an input for stock acquisition.

---

## 7. Schema: operations

```ts
webRedirects:    id, fromPath(unique, indexed), toPath, statusCode(301|302|410),
                 isActive, hitCount, lastHitAt, note, createdById, timestamps

webPublishQueue: id, entityType, entityId, action(publish|unpublish|resync),
                 tags(jsonb), status, attempts, lastError,
                 scheduledFor, processedAt, timestamps
```

`webPublishQueue` gives scheduled publishing (a listing going live Monday morning) and a retry path when revalidation fails, rather than losing the event.

---

## 8. Pipelines

### 8.1 Property publication

```
Property Manager or Head of Strategy opens a property in the dashboard
  → "Publish to website"
  → publishListing(ctx, propertyId, payload):
      1. authorize(ctx, "content.listing.publish")
      2. load properties row; validate publishable (§8.2)
      3. upsert listing_publications, denormalising specs
      4. generate reference SL-{typeCode}-{seq} if absent
      5. slug = {title}-{location}, checked against RESERVED_LISTING_SEGMENTS
         and existing slugs, suffixed on collision
      6. attach listing_media in order; require a hero with alt text
      7. rebuild searchVector (title A, location and type B, description C, amenities D)
      8. status = published, publishedAt = now()
      9. writeAudit("listing.published", propertyId, actor)
     10. enqueue revalidation: listings, listing:{slug}, location:{slug},
         type:{slug}, sitemap, home (if featured)
     11. Pusher event on the content channel
     12. match against property_alerts; enqueue notifications
```

Step 12 compounds: publishing notifies everyone who asked for exactly that property, with no marketing effort.

### 8.2 Publishable validation

A listing cannot publish without a title, a taxonomy location, a property type, at least one image with alt text, either a price or an explicit `hidePrice`, and a description of at least 120 characters. These are exactly the failures visible on the current site, encoded as a gate rather than left to discipline.

### 8.3 Drift control

`updateProperty()` gains a post-commit hook: if a publication exists and a denormalised field changed, set `needsResync = true` and notify. A nightly job resyncs flagged rows, revalidates affected tags, and logs what changed.

Rejected: reading specs live from `properties` on render. That couples public rendering to the operational table and removes the ability to present a public figure that differs from the internal one, which §5.2 argues is the point.

### 8.4 Enquiry to lead

```
POST /api/web/enquiries
  1. Zod validate; honeypot + timing check; rate limit (5/10min per IP, 3/hour per phone)
  2. INSERT web_form_submissions (received)              ← durability point
  3. resolve listingSlug → propertyId server side; client-supplied ids ignored
  4. upsert contacts, matched on normalised phone (E.164)
  5. create leads: stage=inquiry, source=website, propertyId, contactId,
     assignedToId per §8.5, UTM carried through
  6. create web_enquiries linking submission → lead
  7. writeAudit("lead.created", leadId, actor: system:web)
  8. increment listing_publications.enquiryCount
  9. Pusher to the assigned manager + notification row
 10. mark submission processed; respond with reference only
```

If any step after 2 fails, the submission persists as `failed` and a retry job picks it up. A customer is never lost to a transient error.

### 8.5 Assignment

| Enquiry type | Assigned to |
|---|---|
| Listing with an assigned Property Manager | That manager, per ADR 013 §13.2 |
| Listing without one | Round-robin among active Property Managers covering that location |
| Development enquiry | The development's `assignedAgentId`, else Head of Strategy |
| General or requirements | Head of Strategy queue |
| Valuation request | Head of Strategy, copied to the CEO's Assistant |

Unassigned leads are impossible by construction. Reaching the final fallback is logged as an anomaly.

### 8.6 Valuation to acquisition pipeline

Creates a `contacts` row and a `valuations` row at stage `requested`, with source attribution. The highest-value integration on the platform: a stranger completing a web form opens phase 1 of the property lifecycle, fully audited, with no re-keying.

### 8.7 Viewing request to appointment

```
Viewing request → web_enquiries + viewing_requests (requested)
  → assigned manager sees it with up to three proposed slots
  → manager confirms → creates an appointment in the ERP scheduling module
  → confirmation to the prospect (WhatsApp or email) + reminder
  → post-visit, marked completed or no_show, feeding the lead's stage
```

### 8.8 Editorial publish

Draft → in review → published, with `publishedById` recorded. Publishing revalidates the post, the insights index, the sitemap, and home if featured. `updatedContentAt` is set only on a real content edit, so `dateModified` in schema stays truthful.

### 8.9 Media ingest

Upload → magic-byte validation → checksum dedupe → dimension extraction → blur placeholder → dominant colour → object storage → `web_media` row. Alt text required before an asset can be a listing hero or post hero.

### 8.10 Alert matching

A scheduled job evaluates active alerts against listings published since `lastRunAt`, batching by subscriber and frequency. Instant alerts queue on publish; daily and weekly run on cron.

---

## 9. Caching and revalidation

| Surface | Strategy | Invalidated by |
|---|---|---|
| Home | Static, tag `home` | Section edit, featured change |
| Listing index and facets | Static per facet, tag `listings` | Any publish or unpublish |
| Listing detail | Static, tag `listing:{slug}` | That listing's change |
| Development detail | Static, tag `development:{slug}` | Development or unit type change |
| Location hub | Static, tag `location:{slug}` | Listing change in that location |
| Insights | Static, tags `posts`, `post:{slug}` | Post publish |
| Filtered results | Dynamic, Redis 60s | TTL |
| Site stats | Redis, 15 min | TTL |
| Settings and navigation | Redis, 1 hour, tag `settings` | Settings save |
| Sitemap | Static, tag `sitemap` | Any publish |

---

## 10. Search

Postgres, no external engine at this volume.

- Weighted `tsvector` on listings and posts, maintained by trigger, GIN indexed.
- Filter and sort keys allowlisted and mapped to columns before touching Drizzle. No client-supplied column name reaches SQL.
- Geographic queries by bounding box first, haversine ordering second. Adequate well beyond current inventory.
- Every query writes to `web_search_log`.

Revisit when volume passes a few thousand listings or relevance visibly disappoints. The move then is a dedicated index, not a bigger query.

---

## 11. Permissions

New `content` module, per ADR 011's `<module>.<resource>.<action>`:

```
content.page.read/write/publish        content.post.read/write/publish
content.listing.read/write/publish     content.development.read/write/publish
content.media.read/write/delete        content.location.write
content.testimonial.write              content.team.write
content.faq.write                      content.navigation.write
content.settings.write                 content.redirect.write
content.review.moderate                content.enquiry.read
content.subscriber.read                content.analytics.read
```

| Role | Grant |
|---|---|
| `ceo` | All, per ADR 012 super admin |
| `head_of_strategy` | All content keys including publish; owns marketing per ADR 013 §13.1 |
| `admin_assistant` | All except `*.publish`, `content.settings.write`, `content.redirect.write` |
| `property_manager` | `content.listing.read/write`, `content.enquiry.read`, `content.media.write` |
| `front_office_head` | `content.enquiry.read`, `content.review.moderate` |
| Everyone else | None |

The assistant drafts, the owner publishes, following the precedent in ADR 013 §13.5 which excluded approval authority on the same reasoning. Flagged for client confirmation.

---

## 12. Public API contracts

All routes Zod validated, IP rate limited, accepting and returning no internal identifiers.

| Route | Method | Purpose |
|---|---|---|
| `/api/web/listings` | GET | Filtered listing projection |
| `/api/web/listings/[slug]` | GET | Single listing projection |
| `/api/web/developments` | GET | Development index |
| `/api/web/enquiries` | POST | Listing, general and requirements enquiries |
| `/api/web/valuations` | POST | Valuation requests |
| `/api/web/viewings` | POST | Viewing requests |
| `/api/web/alerts` | POST | Alert subscription, double opt-in |
| `/api/web/alerts/confirm` | GET | Token confirmation |
| `/api/web/alerts/unsubscribe` | GET | One-click unsubscribe |
| `/api/web/documents/[id]` | POST | Gated brochure, returns a signed URL |
| `/api/web/reviews` | POST | Review submission into moderation |
| `/api/web/search/log` | POST | Search telemetry, fire and forget |

Writes execute through a `system:web` principal holding exactly `crm.lead.write`, `crm.contact.write`, `properties.valuation.write` and `scheduling.appointment.request`. No unauthenticated bypass of `authorize` exists anywhere.

---

## 13. Security

- Service-layer separation enforced by lint rule, not convention.
- Filter and sort keys allowlisted before query construction.
- Media validated by magic bytes, stored outside the app origin, served through the image pipeline.
- Rate limits per IP and per phone on every public POST.
- Strict CSP; analytics loads only after consent.
- `hideExactLocation` degrades coordinates to the location centroid.
- Portal hostname excluded from sitemap, disallowed in robots.
- Signed, expiring URLs for gated documents.

---

## 14. Observability

- Structured logs on publish, unpublish, enquiry, valuation, viewing and alert match.
- Alerts when: submissions hit zero for six business hours, zero-result rate exceeds 40% of index views in a day, the publish queue backs up, revalidation fails repeatedly, or public p95 exceeds 800ms.
- Weekly digest to the Head of Strategy: enquiries by listing, zero-result searches, alert demand by area and price band, and listings with views but no enquiries.

That last one is quietly the most useful metric here. A listing with high views and no enquiries is mispriced or badly photographed, and the business currently has no way to know.

---

## 15. What I would revisit as this grows

- **Beyond a few thousand listings:** static generation of every facet stops being sensible; move to on-demand ISR with a short TTL and a dedicated search index.
- **Media at scale:** if video and virtual tours arrive, transcoding becomes a project, not a column.
- **Location price analytics:** computed from asking prices today. Once transaction history allows, compute from closed lets and sales, which is materially better and materially harder.
- **Public accounts:** deferred. If it returns, reuse the portal identity model (`users.contactId`, `isExternal`), never a parallel one.
- **`web_sections` as a general page builder:** resist. The moment editors compose arbitrary layouts, the design system stops being a guarantee.
