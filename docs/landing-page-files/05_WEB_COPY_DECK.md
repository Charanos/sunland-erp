# Sunland Web Platform: Copy Deck

Status: proposed, 2026-08-18. Production-ready copy for every template in doc 04. Slot IDs match the section IDs there.

## 1. Voice

Sunland sells trust in a market where trust is scarce, brokers vanish with deposits, and "prime plot, quick sale" means nothing. So the voice is plain, specific, and slightly understated. It sounds like a competent person telling you what will actually happen.

**Do:**
- Lead with the concrete thing. "Rent lands in your account by the 5th" beats "seamless rent collection".
- Use numbers. Real ones, in mono, sourced from the system.
- Write short sentences next to longer ones. Uniform rhythm reads like a machine.
- Address the reader as "you". Refer to the company as "we".
- Say "Kenyan shillings" once, then use KES.

**Do not:**
- Say "seamless", "robust", "cutting-edge", "unlock", "elevate", "empower", "journey", "solutions", "leverage", "dynamic", "vibrant", "state-of-the-art", "one-stop shop".
- Use "X is not merely Y. It is Z." or "It is not X. It is Y."
- Use em dashes. Use commas, colons, or a full stop.
- Stack three adjectives. "Modern, spacious and elegant" is filler.
- Write headings in Title Case. Sentence case throughout.
- Promise what the system cannot do. Every claim here maps to something the ERP actually performs.
- Use exclamation marks. One per site, maximum, and probably zero.

**Reference language:** "to let" and "for sale" as Kenyans say them. Areas by their common names: Kilimani, Lavington, Runda, Westlands, Kileleshwa, Garden Estate, Ruiru, Tatu City, Rongai, Parklands, Kasarani, Spring Valley, Riverside, Thome, Baba Dogo, Nairobi West.

---

## 2. Home

### `home.hero`

**Eyebrow:** Property management and sales in Nairobi

**Headline:** Property, managed properly.

**Lead:** We let, sell and manage homes, land and commercial space across Nairobi. Owners get their rent on time and can see exactly where it came from. Tenants get a landlord who answers.

**Search panel labels:** To let / For sale · Where are you looking? · Property type · Search

**Quick links:** Apartments to let · Land for sale · Commercial space

**Trust strip:**
| Figure | Label |
|---|---|
| {liveListingCount} | Properties available now |
| {managedUnitCount} | Units under management |
| {locationCount} | Areas across Nairobi |
| {yearsTrading} | Years in the market |

*Note: all four are live values. If a figure cannot be sourced honestly, the tile is removed rather than invented.*

### `home.categories`

**Eyebrow:** Browse by type
**Title:** What are you looking for?
**Cards:** Apartments · Villas and houses · Commercial and industrial · Land and plots
**Card meta:** `{n} available`

### `home.featured`

**Eyebrow:** Available now
**Title:** Properties on the market
**Filter pills:** All · To let · For sale
**Button:** View all properties

### `home.landlords`

**Eyebrow:** For property owners

**Title:** You own it. We run it.

**Lead:** Most owners come to us tired of the same three things: chasing rent, coordinating repairs from a WhatsApp group, and never quite knowing what was collected. We handle all of it, and you can see the numbers yourself whenever you want.

**Steps:**

1. **We value it.** A consultant visits, assesses the property, and tells you what it should realistically fetch. No inflated figure to win the mandate.
2. **We agree terms.** One mandate letter, a clear fee, and a named manager assigned to your property.
3. **We manage it.** Marketing, viewings, tenant vetting, rent collection, repairs, and a statement showing what came in and what went out.

**Primary button:** Request a valuation
**Secondary button:** See how management works

**Portal caption:** Your statements, your documents, your manager's direct line, in one place.

### `home.locations`

**Eyebrow:** Where we work
**Title:** Areas we cover
**Tile meta:** `{n} properties`
**Button:** View all areas

### `home.services`

**Eyebrow:** What we do
**Title:** Four things, done properly

| Service | Body |
|---|---|
| Property management | Rent collection, repairs, tenant relations, and a monthly statement you can actually read. |
| Sales and letting | We market the property, vet who walks through it, and negotiate on your side of the table. |
| Valuation | An honest figure for sale, letting, or your own records, from a consultant who has seen the area. |
| Commercial and industrial | Offices, retail, warehousing and godowns, including Tatu City and the industrial belt. |

**Link label:** Learn more

### `home.proof`

**Eyebrow:** From our clients
**Title:** What people say

**Trust points:**
- **A named manager.** Every property has one person responsible, not a shared inbox.
- **Rent you can trace.** Every shilling collected shows up on your statement against the unit it came from.
- **We turn up.** Viewings, inspections, repairs. The unglamorous part is the job.

### `home.insights`

**Eyebrow:** Insights
**Title:** Worth reading before you sign anything
**Button:** All insights

### `home.cta`

**Title:** Ready when you are.
**Lead:** Whether you are letting out a property or looking for one, start here.
**Primary:** List your property
**Secondary:** Browse properties
**Quiet line:** Or call {phone}. We answer between 8am and 6pm, Monday to Saturday.

---

## 3. Listing index

**H1 patterns:**
- `/properties` → Properties in Nairobi
- `/properties/for-rent` → Properties to let in Nairobi
- `/properties/apartments` → Apartments in Nairobi
- `/properties/apartments/kilimani` → Apartments in Kilimani

**Description pattern:** `{n} {category} {status} across {location}. Prices from {minPrice}. Updated {relativeDate}.`

**Filter labels:** Status · Type · Area · Bedrooms · Price · Sort
**Sort options:** Newest first · Price, low to high · Price, high to low
**Applied chip:** `{label} ×` · **Clear all**
**Result count:** `{n} properties`

**Empty state:**
> **Nothing matches that combination yet.**
> We do not have a {beds}-bedroom {category} in {location} under {price} on the books right now. Try one of these, or tell us what you need and we will call you when something lands.

**Buttons:** Clear filters · Tell us what you need

**SEO block heading pattern:** Renting in {location} · Buying in {location}

**Index CTA:**
**Title:** Not seeing it?
**Body:** Tell us the area, the budget, and when you need to move. We will call you when something fits.
**Button:** Send us your requirements

---

## 4. Listing detail

**Badges:** Available now · Under offer · Let · Sold · Featured

**Price suffix:** `/ month` for rentals. Sale prices carry no suffix.
**Null price:** Price on request
**Reference line:** Ref {reference}

**Spec labels:** Bedrooms · Bathrooms · Area · Parking

**Section titles:** About this property · Property details · Amenities · The area · Your consultant · Similar properties

**Detail table labels:** Type · Furnishing · Service charge · Available from · Title status · Plot size

**Consultant block:**
**Label:** Your consultant
**Body:** {name} manages this property and will handle your viewing.
**Buttons:** Call {phone} · WhatsApp

**Enquiry rail:**
**Title:** Book a viewing
**Body:** Send your details and {firstName} will call you back, usually the same day.
**Field labels:** Your name · Phone number · Email (optional) · Anything we should know?
**Placeholder for message:** When would you like to view it?
**Button:** Request a viewing
**Consent line:** We use your details to respond to this enquiry. Nothing else. See our privacy notice.

**Success state:**
> **Got it. We will call you.**
> {firstName} has your enquiry for {listingTitle} and will be in touch, usually within a few hours during working hours. Your reference is {reference}.
**Secondary action:** Message us on WhatsApp instead

**Mobile bar:** `{price}` · Enquire

---

## 5. Landlord hub

### `landlords.hero`

**Eyebrow:** For property owners

**Headline:** Hand it over. Stop chasing it.

**Lead:** We manage residential and commercial property across Nairobi for owners who would rather not spend their weekends on repairs and rent reminders. You keep the asset and the income. We do the work.

**Primary:** Request a valuation
**Secondary:** Talk to us first

### `landlords.problem`

**Title:** Sound familiar?

| Card | Body |
|---|---|
| The rent is always late | Not every month, and not every tenant, but enough that you are the one following up. |
| Repairs run through you | A tap goes at 9pm and your phone rings, because there is no one between you and the tenant. |
| The numbers are fuzzy | You know roughly what came in. Roughly is fine until you need the real figure for a bank or the taxman. |

### `landlords.how`

**Eyebrow:** How it works
**Title:** Four steps, then it runs itself

1. **Valuation.** A consultant visits and gives you a realistic figure, for letting or for sale. We would rather tell you a lower number that lets in three weeks than a flattering one that sits empty for four months.
2. **Mandate.** We agree terms in writing: what we manage, what we charge, and what you can expect. One document, no surprises later.
3. **Marketing and letting.** Photographs, listing, viewings, and tenant vetting. We check who we are putting in your property.
4. **Management and payment.** We collect rent, handle repairs, and send you a statement showing what was collected, what was spent, and what is on its way to you.

### `landlords.portal`

**Eyebrow:** Your account
**Title:** See it without asking anyone

**Body:** Every owner we manage for gets access to their own portal. Your statements, your lease documents, your arrears position, and the direct line to the manager assigned to your property. If you want to know what the property earned in March, you look it up.

**Points:**
- Monthly statements you can download
- Every document filed against the right property
- Your manager's name and number, not a switchboard

### `landlords.fees`

**Title:** What it costs

**Body:** Management is charged as a percentage of rent collected, agreed before we start and written into the mandate. Letting and sales are charged on completion. Valuation is a fixed fee, quoted upfront. If a rate ever changes, you hear it from us before it applies, not after.

### `landlords.faq`

1. **How quickly can you let my property?**
   It depends on the area, the price, and the condition. A well-priced two-bedroom in Kilimani usually lets within three to six weeks. We will tell you honestly at valuation, and if the price needs to move, we will say so.

2. **When do I get paid?**
   Rent collected in a month is remitted to you after deductions, with a statement showing each unit, what was collected, and what was spent. The schedule is set in your mandate so you know the date.

3. **Who handles repairs?**
   Your assigned manager. Tenants report faults through their portal or to the manager directly, not to you. Anything above an agreed limit comes to you for approval first.

4. **What happens if a tenant does not pay?**
   We follow it up from day one, in writing, and you can see the arrears position in your portal at any time. If it escalates, we handle the process and keep you informed at each stage.

5. **Do you vet tenants?**
   Yes. Identification, employment or business verification, and references. We are the ones who have to manage the relationship afterwards, so it is in our interest to get it right.

6. **Can I still sell the property while you manage it?**
   Yes. We can market it for sale while it is tenanted or on the tenant's exit, and we will advise which gets you a better outcome.

7. **What do you need to get started?**
   Your identification, proof of ownership, and the property details. We arrange the valuation visit from there.

8. **Do you manage commercial property?**
   Yes, including offices, retail, warehousing and godowns.

### `landlords.cta`

**Title:** Start with a valuation.
**Lead:** No cost to find out what your property should be earning.
**Button:** Request a valuation

---

## 6. Valuation form

**H1:** Request a valuation
**Lead:** Tell us about the property. A consultant will call to arrange a visit, usually within one working day.

**Labels:** Your name · Phone number · Email (optional) · Property type · Where is it? · How many units? · Tell us about the property · What do you need?

**Radio options:** Valuation for letting · Valuation for sale · A management proposal · Not sure yet

**Helper under phone:** We call before we email. Please use a number you answer.

**Button:** Send request

**Success:**
> **Request received.**
> Your reference is {reference}. A consultant will call {phone} to arrange a visit. If you need us sooner, call {officePhone}.

---

## 7. Services

| Page | H1 | Lead |
|---|---|---|
| Hub | What we do | Four services, built around one thing: property that performs without you having to manage it yourself. |
| Property management | Property management | We take the day to day off your hands: rent, repairs, tenants, and the paperwork that goes with all three. |
| Sales and letting | Sales and letting | We price it properly, market it to people who are actually looking, and negotiate on your side. |
| Valuation | Valuation | An honest figure for sale, for letting, or for your own records, from someone who knows the area. |
| Commercial and industrial | Commercial and industrial | Offices, retail, warehousing and godowns, let and managed for owners and occupiers. |

---

## 8. Location page

**H1:** Property in {location}
**Lead pattern:** `{n} properties available in {location} right now, from {minPrice}.`

**Section titles:** About {location} · What it costs · Available in {location} · Nearby areas

**Price context table labels:** 1 bedroom · 2 bedrooms · 3 bedrooms · 4 bedrooms and above
**Column headers:** Typical rent · Available now
**Caveat line:** Based on {n} properties we currently have listed in {location}. Updated {date}.

---

## 9. About and team

**About H1:** Where life meets style, and the paperwork is done right
**Lead:** Sunland Real Estates has been letting, selling and managing property in Nairobi since {year}. We work with private owners, developers and commercial landlords, from a single apartment to a portfolio.

**Team H1:** The people you will actually deal with
**Lead:** Property is a relationship business. These are the people who will answer when you call.

---

## 10. Contact

**H1:** Talk to us
**Lead:** Call, message, or come to the office. Someone answers between 8am and 6pm, Monday to Saturday.

**Labels:** Call us · WhatsApp · Email · Office · Hours
**Office value:** International House, 8th Floor, Mama Ngina Street, Nairobi. P.O. Box 37987-00100.
**Form title:** Send us a message
**Button:** Send message

---

## 11. UX microcopy

### Buttons

| Context | Label |
|---|---|
| Primary site action | List your property |
| Listing enquiry | Request a viewing |
| Valuation | Request a valuation |
| Index | View all properties |
| Card | (whole card is the link; accessible name is the listing title) |
| Filters | Show {n} properties |
| Reset | Clear filters |
| Portal | Sign in |

Never use: Submit, Click here, Learn More as the only label, Details.

### Form errors

Structure: what happened, then how to fix it.

| Field | Message |
|---|---|
| Name empty | Please enter your name so we know who is calling. |
| Phone empty | We need a phone number to call you back. |
| Phone invalid | That does not look like a valid number. Try 07XX XXX XXX or +254 7XX XXX XXX. |
| Email invalid | Check the email address, it seems to be missing something. |
| Message too long | That is longer than we can send. Keep it under 1000 characters and tell us the rest on the call. |
| Submit failed | We could not send that. Try again, or call {phone} and we will take the details. |

### Loading

- Listings: Finding properties
- Form submit: Sending
- Gallery: (skeleton only, no text)

### Empty states

| Context | Copy |
|---|---|
| No search results | Nothing matches that combination yet. Try widening the area or the budget. |
| Location with no stock | We do not have anything in {location} at the moment. Tell us what you need and we will call when something comes up. |
| No insights yet | (section hidden entirely) |

### 404

**Title:** That page has moved on.
**Body:** The link may be old, or the property may already be let. Here is where most people go next.
**Links:** Browse properties · List your property · Contact us

### 500

**Title:** Something broke on our side.
**Body:** Not your fault. Try again in a moment, or call {phone} and we will help you directly.

### Cookie band

**Body:** We use cookies to see which properties people look at, so we can show better ones. Read the privacy notice.
**Buttons:** Accept · Only essentials

---

## 12. Metadata

| Page | Title (under 60) | Description (under 155) |
|---|---|---|
| Home | Property management, sales and letting in Nairobi \| Sunland | We let, sell and manage homes, land and commercial property across Nairobi. Rent collected on time, statements you can read, a named manager on every property. |
| Properties | Properties to let and for sale in Nairobi \| Sunland | Browse apartments, villas, commercial space and land across Nairobi. Live availability, real prices, updated daily. |
| Apartments | Apartments to let in Nairobi \| Sunland | {n} apartments available across Kilimani, Lavington, Westlands and more. From {minPrice} per month. |
| Landlords | Property management for Nairobi landlords \| Sunland | Rent collection, repairs, tenant vetting and monthly statements. Request a free valuation of your property. |
| Valuation | Request a property valuation in Nairobi \| Sunland | Free, no obligation valuation for letting or sale. A consultant will call within one working day. |
| Location | Property in {location} \| Sunland | {n} properties available in {location}, from {minPrice}. Typical rents, current listings and local guidance. |
| Contact | Contact Sunland Real Estates, Nairobi | Call {phone}, message us on WhatsApp, or visit International House on Mama Ngina Street. |

Title pattern: `{Specific thing} | Sunland`. Never `Home | Sunland` or `Sunland Real Estates - Where Life Meets Style` as a title on every page, which is what the current site does.

---

## 13. Copy review checklist

- [ ] No em dashes
- [ ] No "not merely / it is" constructions
- [ ] Sentence case headings
- [ ] No banned adjective list words
- [ ] No three-item adjective stacks written for rhythm alone
- [ ] Every number is real and sourced, or it is not shown
- [ ] Every claim maps to something the business actually does
- [ ] Sentence lengths vary within each paragraph
- [ ] Reads as a person talking, not a brochure
- [ ] CTAs start with a verb and name the outcome
