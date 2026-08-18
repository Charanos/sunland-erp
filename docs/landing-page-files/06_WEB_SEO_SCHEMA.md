# Sunland Web Platform: SEO, Structured Data and AI Search

Status: proposed, 2026-08-18. Consumes doc 02. Feeds doc 08.

## 1. Audit of the current site

Assessed from the live rendering of `sunland.co.ke` on 2026-08-18. No Search Console access, so this covers what is observable from the page itself. Ranked by impact.

### Critical

| # | Finding | Why it matters | Fix |
|---|---|---|---|
| C1 | Category content sits at query parameters (`/?directory_type=apartment`) | These cannot accumulate authority and are usually excluded from indexing. The site has no rankable category pages at all. | Real static facet pages, doc 02 §5 |
| C2 | Site title is a brand slogan on every page | "Sunland real estates – Where Life Meets Style" tells a searcher nothing and matches no query intent. | Per-page titles, doc 05 §12 |
| C3 | No structured data for listings | Property results are exactly the content type that earns rich treatment. Nothing is marked up today. | §4 below |
| C4 | Rendered price placeholders (`KShKShKShKSh`) | Broken output on indexable pages harms both ranking and conversion. | Null-safe price rendering, doc 03 §3.2 |
| C5 | WooCommerce cart on a property site | Adds crawlable cart, checkout and account URLs with zero value, and loads unnecessary script. | Remove; redirect per doc 02 §7 |
| C6 | No landlord or management landing page | The highest-commercial-intent queries ("property management companies in Nairobi") have no target page. | `/landlords` and `/services/property-management` |

### High

| # | Finding | Fix |
|---|---|---|
| H1 | Duplicated navigation blocks in markup | Single nav in the new build |
| H2 | Blog taxonomy is noise ("Fitness Zone", "Restaurant", "Uncategorized") | New taxonomy, doc 06 §7 |
| H3 | Dead Terms and Privacy links pointing at `#` | Real legal pages, launch blocker |
| H4 | Empty review widgets rendering "0.0 (0)" | Remove until real ratings exist |
| H5 | Date-based archive URLs (`/2025/08/`) | Redirect to `/insights` |
| H6 | Elementor and plugin CSS or JS weight | Rebuilt in Next.js, budget in doc 03 §7 |
| H7 | No internal linking between listings, areas and services | Linking rules, doc 02 §6 |
| H8 | Location tiles link to `#` | Real location hubs |

### Medium

| # | Finding | Fix |
|---|---|---|
| M1 | Typo in a location name ("Spring Vallley") | Content pass at migration |
| M2 | Placeholder Twitter link pointing at `#` | Remove or correct; affects `sameAs` accuracy |
| M3 | Listing images not in modern formats | `next/image` with AVIF and WebP |
| M4 | No breadcrumbs anywhere | Breadcrumbs plus `BreadcrumbList` |
| M5 | Thin listing descriptions | Editorial minimum, §3.3 |

## 2. Keyword and intent map

Kenyan property search splits cleanly into three intents. The architecture in doc 02 gives each its own page type.

| Intent | Query shape | Target page | Priority |
|---|---|---|---|
| Transactional, tenant | "2 bedroom apartment to let kilimani", "houses for rent lavington" | `/properties/{category}/{location}` | Critical |
| Transactional, buyer | "land for sale ruiru", "villa for sale runda" | `/properties/for-sale`, facets | High |
| Commercial, landlord | "property management companies in nairobi", "property managers nairobi", "letting agents nairobi" | `/landlords`, `/services/property-management` | Critical, highest value |
| Informational | "how much is rent in kilimani", "what does a property manager charge in kenya", "service charge kenya explained" | `/locations/{slug}`, `/insights/{slug}` | High, feeds AI citation |
| Navigational | "sunland real estates", "sunland nairobi" | `/`, `/contact` | Already won, protect it |

The strategic gap is the landlord commercial intent. It is the highest-value traffic on this list and the current site has no page that could rank for it.

## 3. On-page standards

### 3.1 Titles and descriptions

Pattern `{specific} | Sunland`, under 60 characters. Descriptions under 155, written to earn a click rather than to repeat the title. Templated pages interpolate live values (count, minimum price, location). Full set in doc 05 §12.

### 3.2 Heading structure

One `h1` per page, matching the primary intent. `h2` for each section. No skipped levels. Headings phrased as the questions people ask, particularly on location and insight pages, because heading text is what AI extraction latches onto.

### 3.3 Content minimums

| Template | Minimum |
|---|---|
| Listing detail | 120 words of genuine description, plus a complete attribute table |
| Category facet | 150 words in the SEO block |
| Category + location facet | 200 words, area-specific, not templated boilerplate with the name swapped |
| Location hub | 300 words plus a live price table |
| Service page | 400 words plus an FAQ |
| Insight post | 800 words |

A templated paragraph with the location name substituted is detectable and worthless. Location copy is written once per area, by hand, and stored in the location record.

### 3.4 Images

Descriptive `alt` on every meaningful image: "Three bedroom duplex living room, Lavington" rather than "IMG-20250714-WA0036". Filenames slugified on upload. Decorative images carry empty alt.

### 3.5 Canonicals

Every page self-canonicalises. Filtered views canonicalise to their parent facet. Paginated pages self-canonicalise (not to page one) and carry `rel="prev"` and `rel="next"` semantics through internal linking.

### 3.6 Indexing rules

| Page type | Directive |
|---|---|
| Home, facets, listings, locations, services, insights, legal | `index, follow` |
| Filtered views with more than one active filter | `noindex, follow` |
| Facets under three listings | Not generated; 301 to parent |
| Let or sold listings | `index, follow` for 90 days with a clear status badge, then 301 to the category facet |
| Search results, thank-you pages, portal routes | `noindex, nofollow` |

The let-and-sold rule is deliberate. Those pages hold accumulated authority and answer "what does this actually rent for", which is useful, so long as the status is unmistakable on the page.

## 4. Structured data

JSON-LD only, injected server side. Never mark up content that is not on the page.

### 4.1 Global, every page

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "RealEstateAgent",
      "@id": "https://sunland.co.ke/#organization",
      "name": "Sunland Real Estates Limited",
      "url": "https://sunland.co.ke",
      "logo": "https://sunland.co.ke/brand/sunland-logo.png",
      "image": "https://sunland.co.ke/brand/sunland-office.jpg",
      "telephone": "+254703100875",
      "email": "info@sunland.co.ke",
      "priceRange": "KES",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "International House, 8th Floor, Mama Ngina Street",
        "addressLocality": "Nairobi",
        "addressRegion": "Nairobi County",
        "postalCode": "00100",
        "postOfficeBoxNumber": "37987-00100",
        "addressCountry": "KE"
      },
      "geo": { "@type": "GeoCoordinates", "latitude": null, "longitude": null },
      "openingHoursSpecification": [{
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
        "opens": "08:00", "closes": "18:00"
      }],
      "areaServed": [
        { "@type": "City", "name": "Nairobi" },
        { "@type": "AdministrativeArea", "name": "Kiambu County" }
      ],
      "sameAs": [
        "https://www.facebook.com/sunlandrealestates",
        "https://www.instagram.com/sunlandrealestates/",
        "https://www.linkedin.com/company/sunland-real-estates-limited/"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://sunland.co.ke/#website",
      "url": "https://sunland.co.ke",
      "name": "Sunland Real Estates",
      "publisher": { "@id": "https://sunland.co.ke/#organization" },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://sunland.co.ke/properties?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    }
  ]
}
```

Note: `sameAs` omits Twitter until a real profile exists. The current site links to a placeholder, and a broken `sameAs` entry weakens entity confidence rather than strengthening it. `geo` is populated at implementation from the real office coordinates; nulls ship as omitted keys, never as zeros.

### 4.2 Listing detail

Two objects. `RealEstateListing` describes the listing; `Residence` or `Accommodation` describes the thing itself.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "RealEstateListing",
      "@id": "https://sunland.co.ke/properties/{slug}#listing",
      "url": "https://sunland.co.ke/properties/{slug}",
      "name": "{title}",
      "description": "{description}",
      "datePosted": "{publishedAt}",
      "image": ["{img1}", "{img2}", "{img3}"],
      "provider": { "@id": "https://sunland.co.ke/#organization" },
      "about": { "@id": "https://sunland.co.ke/properties/{slug}#property" },
      "offers": {
        "@type": "Offer",
        "price": "{price}",
        "priceCurrency": "KES",
        "availability": "https://schema.org/InStock",
        "businessFunction": "http://purl.org/goodrelations/v1#LeaseOut",
        "seller": { "@id": "https://sunland.co.ke/#organization" }
      }
    },
    {
      "@type": "Residence",
      "@id": "https://sunland.co.ke/properties/{slug}#property",
      "name": "{title}",
      "numberOfRooms": "{beds}",
      "numberOfBathroomsTotal": "{baths}",
      "floorSize": { "@type": "QuantitativeValue", "value": "{area}", "unitCode": "MTK" },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "{location}",
        "addressRegion": "Nairobi County",
        "addressCountry": "KE"
      },
      "amenityFeature": [
        { "@type": "LocationFeatureSpecification", "name": "Parking", "value": true }
      ]
    }
  ]
}
```

Rules: `businessFunction` is `LeaseOut` for rentals and `Sell` for sales. `availability` becomes `SoldOut` for let and sold listings, which keeps the markup honest during the 90-day retention window. Price is omitted entirely when null rather than sent as zero.

### 4.3 Other templates

| Template | Types |
|---|---|
| All pages below L1 | `BreadcrumbList` |
| Listing index and facets | `ItemList` of listing URLs, in display order |
| Location hub | `Place` plus `ItemList` |
| Service page | `Service` with `provider` and `areaServed`, plus `FAQPage` |
| Landlord hub | `FAQPage` |
| Insight post | `BlogPosting` with `author` as `Person`, `datePublished`, `dateModified`, `publisher` |
| Team page | `Person` entries with `worksFor` |
| Contact | `ContactPage`, reusing the organization node |

### 4.4 Validation gate

No structured data ships without passing Google's Rich Results Test and the Schema.org validator. Add a CI check that fetches each template's rendered JSON-LD and asserts required properties are present and non-null. Markup that references absent content is a defect, not a shortcut.

## 5. AI search optimisation

Kenyan property questions increasingly get answered by an assistant rather than a results page. Getting cited requires different work from getting ranked.

### 5.1 Answer-first structure

Every location page, service page and insight post opens with a self-contained answer of 40 to 60 words directly under the `h1`, before any narrative. It must make sense lifted out of the page with no surrounding context, because that is exactly how it will be used.

Example for `/locations/kilimani`:

> Kilimani is a high-density residential area in Nairobi, popular with professionals for its proximity to Upper Hill and Westlands. Two-bedroom apartments typically let for KES 90,000 to 130,000 per month. Sunland currently has {n} properties available in Kilimani.

That paragraph contains an entity, a location, a price range, and a source. It is extractable as a unit.

### 5.2 Structures that get extracted

- **Question headings.** "What does a property manager charge in Kenya?" as an `h2`, answered immediately beneath in one paragraph.
- **Comparison tables.** Rent by bed count and area. Tables are parsed reliably and cited often.
- **FAQ blocks** with `FAQPage` markup on the landlord hub, every service page, and posts where it fits naturally.
- **Real figures with a stated basis.** "Based on 14 properties we currently list in Kilimani, updated 12 August 2026" is citable. "Affordable rates" is not.
- **Named authorship.** Posts carry a real author, role, and date. Anonymous content is discounted.

### 5.3 Freshness

Location price tables and listing counts regenerate on every publish event, and the page states its update date. Freshness is a live property of the data, not a maintenance chore, because the numbers come from the ERP.

### 5.4 Off-site presence

Brands are cited through third-party sources far more often than through their own domain. Worth pursuing separately from this build: an accurate Google Business Profile, correct and consistent name, address and phone across Kenyan directories, and a Wikipedia-grade consistency of company naming. Flagged here because it affects entity confidence and is cheap relative to its effect.

## 6. robots.txt

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin
Disallow: /exec
Disallow: /fin
Disallow: /hr
Disallow: /bd
Disallow: /front
Disallow: /ops
Disallow: /landlord
Disallow: /tenant
Disallow: /*?*beds=
Disallow: /*?*min=
Disallow: /*?*max=
Disallow: /*?*sort=

# AI assistants: allowed, deliberately
User-agent: GPTBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: anthropic-ai
Allow: /
User-agent: Google-Extended
Allow: /

# Bulk training scrape without citation: declined
User-agent: CCBot
Disallow: /

Sitemap: https://sunland.co.ke/sitemap.xml
```

The reasoning on the split: search-and-cite bots are allowed because a citation in an AI answer is a referral. `CCBot` feeds bulk training corpora with no citation path, so it gets nothing. This is a business decision worth confirming with the client, and it is reversible in one line.

## 7. `llms.txt`

Served at `/llms.txt`, a plain-language map of the site for assistants:

```
# Sunland Real Estates

> Property management, sales and letting agency in Nairobi, Kenya. Manages
> residential and commercial property for private owners, and lists property
> to let and for sale across Nairobi and Kiambu.

## Key pages
- [Properties to let and for sale](https://sunland.co.ke/properties)
- [Property management for landlords](https://sunland.co.ke/landlords)
- [Request a valuation](https://sunland.co.ke/landlords/valuation)
- [Areas we cover](https://sunland.co.ke/locations)
- [Contact](https://sunland.co.ke/contact)

## Facts
- Founded: {year}. Office: International House, 8th Floor, Mama Ngina Street, Nairobi.
- Phone: +254 703 100 875. Email: info@sunland.co.ke
- Services: property management, sales, letting, valuation, commercial agency.
- Coverage: Nairobi County and Kiambu County.
- Listing prices and availability are updated from Sunland's own management system.
```

## 8. Blog taxonomy

The existing categories are discarded. New set, each tied to a real audience and a real page it can link to:

| Category | Audience | Links into |
|---|---|---|
| For landlords | Owners | `/landlords`, `/services/property-management` |
| For tenants | Renters | `/properties/for-rent` |
| Buying and investing | Buyers | `/properties/for-sale`, `/locations/*` |
| Area guides | All | `/locations/*` |
| Market notes | All | Home, insights index |

Ten launch posts, chosen for search volume against a realistic chance of ranking, and for AI citability:

1. What property managers charge in Kenya, and what you get for it
2. How much is rent in Kilimani in 2026?
3. Service charge in Kenya, explained plainly
4. What to check before signing a lease in Nairobi
5. Buying land in Kiambu: title checks that actually matter
6. Landlord's guide to the 10% withholding tax on rental income
7. Kilimani vs Lavington vs Kileleshwa: which suits you
8. What a tenant vetting process should include
9. When to sell a tenanted property, and when to wait
10. Commercial space in Tatu City: what it costs and who it suits

## 9. Measurement

| Event | Fires when | Properties |
|---|---|---|
| `listing_view` | Listing detail rendered | listingId, category, location, price band, status |
| `listing_enquiry_start` | Enquiry form focused | listingId |
| `listing_enquiry_submit` | Lead created | listingId, leadId, assigned manager |
| `valuation_request` | Valuation created | valuationId, property type, location |
| `filter_apply` | Filter changed | filter set, result count |
| `zero_results` | Empty state shown | filter set |
| `whatsapp_click` | WhatsApp opened | page, listingId |
| `call_click` | Phone tapped | page, listingId |
| `portal_signin_click` | Sign in clicked | page |

`zero_results` is the sleeper. A month of that data tells the Head of Strategy exactly what stock to chase, which is a business input the current site cannot produce.

Attribution: UTM parameters persist to the lead record, so `leads.source` carries the real channel and the ERP can report on which channel produces mandates rather than clicks.

## 10. Launch SEO checklist

- [ ] Per-listing 301 map generated from a crawl of the live site, verified, deployed
- [ ] All redirect rules in doc 02 §7 return 301, tested
- [ ] Privacy and Terms are real pages
- [ ] `sitemap.xml` index live with accurate `lastmod`
- [ ] `robots.txt` deployed with AI crawler policy
- [ ] Structured data validates on every template
- [ ] Search Console and Bing Webmaster verified, sitemap submitted
- [ ] Google Business Profile updated to match the site's name, address and phone
- [ ] Analytics live with the event map in §9
- [ ] Core Web Vitals passing on the home and listing templates
- [ ] No page carries the old slogan as its title
- [ ] WooCommerce URLs redirected, no cart reachable
