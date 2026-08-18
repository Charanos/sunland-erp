# Sunland Web Platform: Terrain Web Design System

Status: proposed, 2026-08-18. Extends the Terrain Identity design system defined in `SUNLAND_ERP_IMPLEMENTATION_SPEC.md` §2.1. Where the two disagree, the ERP spec wins and this file is corrected.

## 1. Position

Sunland Web is a design language built for a public marketing and property site, from first principles. It shares its brand DNA with the Terrain Identity system that runs the ERP (the same navy, the same yellow, the same three typefaces, the same weight discipline) because they are one company and one product. Everything else is designed for this surface and this audience.

That distinction matters, so it is worth being blunt about it. Terrain was designed for operators: people who are signed in, task-focused, and looking at dense tabular data all day. This is designed for strangers: people arriving on a phone from a search result, deciding in eight seconds whether this company is competent enough to hand a building to. Those are different design problems and they get different answers.

What is shared, and non-negotiable:

- The palette. Brand Dark `#151936`, Sunland Yellow `#f3df27`, and the semantic emerald, rose and amber states.
- The typefaces. Cormorant Garamond, Nunito, JetBrains Mono, in their existing roles.
- The weight cap at 500. Nothing bolder, anywhere, ever.
- Tabler Icons, and the rule that every price and reference is monospaced.

What is designed fresh for this surface:

| Dimension | Terrain (ERP) | Sunland Web |
|---|---|---|
| Type scale | Compact, 14 to 24px, functional | Editorial, 16 to 76px, fluid, expressive |
| Layout | Uniform card grid, dense | Alternating full-bleed bands, generous |
| Composition | Predictable, learnable, repetitive by design | Varied rhythm, each section shaped by its content |
| Colour behaviour | Light surfaces, dark chrome | Dark hero, light body, dark closing band |
| Imagery | Incidental | Structural, and defensive about quality |
| Motion | Functional feedback | Entrance and depth, restrained |
| Density | High information per screen | One idea per screen |
| Success measure | Task completed quickly | Trust established, then action taken |

The test: someone browsing the site and then signing into the portal should recognise the same company immediately, while never feeling the marketing site was a dashboard with the tables removed.

## 2. Design tokens

Defined once as CSS custom properties in the shared Tailwind v4 theme layer, consumed by both the app and the site. No component may hardcode a hex value.

### 2.1 Colour

```css
@theme {
  /* Brand */
  --color-brand-dark:      #151936;  /* primary surface, chrome, headings on light */
  --color-brand-yellow:    #f3df27;  /* primary actions only */
  --color-brand-yellow-h:  #e6d220;  /* hover */

  /* Ink on light */
  --color-ink-900: #151936;
  --color-ink-700: #23273a;
  --color-ink-500: #4a4f63;
  --color-ink-400: #6b7080;   /* muted body, minimum for AA on white at 16px */

  /* Surfaces */
  --color-surface-0:  #ffffff;
  --color-surface-1:  #f7f7fa;
  --color-surface-2:  #f0f0f5;
  --color-line:       #e3e3e8;

  /* On dark */
  --color-on-dark-hi:  #ffffff;
  --color-on-dark:     #d9dae4;
  --color-on-dark-lo:  #9a9db0;
  --color-dark-line:   rgba(255,255,255,0.12);
  --color-dark-raise:  rgba(255,255,255,0.06);  /* glass fill on dark */

  /* Semantic, inherited from Terrain, unchanged */
  --color-positive-bg: rgb(16 185 129 / 0.20);
  --color-positive-fg: #6ee7b7;
  --color-critical-bg: rgb(244 63 94 / 0.20);
  --color-critical-fg: #fda4af;
  --color-pending-bg:  rgb(245 158 11 / 0.20);
  --color-pending-fg:  #fcd34d;
}
```

Public-site semantic mapping, so states read consistently with the dashboard:

| State | Token | Web usage |
|---|---|---|
| Available, on track | positive | "Available now" badge |
| Let, sold, unavailable | critical | "Let" and "Sold" badges |
| Coming soon, under offer | pending | "Under offer" badge |

### 2.2 Yellow discipline

Sunland Yellow is a signal, not a decoration. On any given viewport there is **one** yellow element competing for attention. Permitted uses:

- Primary button fill, with `--color-brand-dark` text.
- The active state of a filter pill.
- A 2px accent rule under a section eyebrow.
- The logo mark itself.

Prohibited: yellow body text, yellow on white without a dark carrier, yellow large fills, yellow as a section background. Yellow on white fails contrast at any text size, so it never carries text.

### 2.3 Typography

Same three families as the dashboard.

| Role | Family | Weight | Usage |
|---|---|---|---|
| Display and section titles | Cormorant Garamond | 300 | Hero headline, section headings, listing title |
| Body and UI | Nunito | 400, 500 | Everything else |
| Numerics and references | JetBrains Mono | 400 | Prices, areas, bed and bath counts, reference codes, dates |

**Font weight is capped at 500 across the entire product.** No `font-semibold`, no `font-bold`, anywhere, including hero headlines. Emphasis is achieved by size, colour, and space. This rule is inherited and is the single easiest way to tell a Terrain surface from a generic template.

Fluid scale, clamped:

```css
--text-display:  clamp(2.75rem, 1.6rem + 5.2vw, 4.75rem);  /* 44 → 76 */
--text-h1:       clamp(2.25rem, 1.5rem + 3.4vw, 3.5rem);   /* 36 → 56 */
--text-h2:       clamp(1.75rem, 1.3rem + 2.1vw, 2.5rem);   /* 28 → 40 */
--text-h3:       clamp(1.375rem, 1.2rem + 0.8vw, 1.75rem); /* 22 → 28 */
--text-lead:     clamp(1.0625rem, 1rem + 0.4vw, 1.25rem);  /* 17 → 20 */
--text-body:     1rem;      /* 16, never below */
--text-sm:       0.9375rem; /* 15 */
--text-xs:       0.8125rem; /* 13, labels and eyebrows only, never body */
```

Line height: 1.15 for display and h1, 1.25 for h2 and h3, 1.6 for body, 1.5 for lead. Measure capped at 68 characters for body prose.

Eyebrow label pattern, used above most section titles: Nunito 500, 13px, uppercase, letter-spacing 0.12em, colour `--color-ink-400` on light or `--color-on-dark-lo` on dark, with a 2px yellow rule beneath at 24px width.

### 2.4 Numerics rule

Every price, area, bed count, bath count, reference, and date renders in JetBrains Mono, formatted through the existing `formatCompactKES()` for currency. No component computes its own currency string. A listing card showing `KES 120,000` in Nunito is a defect, not a preference.

### 2.5 Spacing, radius, shadow

```css
--space-1: 4px;   --space-2: 8px;   --space-3: 12px;  --space-4: 16px;
--space-5: 24px;  --space-6: 32px;  --space-7: 48px;  --space-8: 64px;
--space-9: 96px;  --space-10: 128px;

--radius-sm: 6px;    /* pills, badges */
--radius-md: 12px;   /* buttons, inputs */
--radius-lg: 20px;   /* cards, media */
--radius-xl: 28px;   /* hero panels, feature blocks */

--shadow-sm: 0 1px 2px rgb(21 25 54 / 0.06);
--shadow-md: 0 8px 24px rgb(21 25 54 / 0.08);
--shadow-lg: 0 24px 60px rgb(21 25 54 / 0.12);
```

Section vertical rhythm: `--space-9` (96px) on mobile, `--space-10` (128px) on desktop, between bands. Consistency here does more for perceived quality than any single component.

### 2.6 Layout

- Max content width 1280px, gutters 20px mobile, 40px tablet, 64px desktop.
- 12-column grid on desktop, 6 on tablet, 4 on mobile, 24px gap.
- Full-bleed bands break the container; their inner content does not.
- Breakpoints: 640, 768, 1024, 1280, 1536. Mobile first, no fixed pixel container widths.

### 2.7 Motion

Framer Motion, already a dependency.

| Motion | Duration | Easing | Usage |
|---|---|---|---|
| Entrance fade and rise | 500ms | `[0.16, 1, 0.3, 1]` | Section reveal on scroll, 16px travel |
| Hover lift | 200ms | ease-out | Cards, 2px rise plus shadow step |
| Image scale on hover | 400ms | ease-out | Card media, 1.0 to 1.04, overflow hidden |
| Panel and drawer | 260ms | ease-out | Mobile nav, filter sheet |
| Micro feedback | 150ms | ease-out | Buttons, pills, inputs |

Rules: entrance animations fire once, never on every scroll pass. Stagger children at 60ms, capped at six items so a grid does not crawl. Every animation respects `prefers-reduced-motion`, which disables transforms and keeps opacity only. Never animate `width` or `height`; use transform and opacity.

## 3. Components

Each entry gives variants, states, and the accessibility contract. Claude Code implements these into `src/components/web/`.

### 3.1 Button

| Variant | Fill | Text | Usage |
|---|---|---|---|
| Primary | `brand-yellow`, hover `brand-yellow-h` | `brand-dark` | One per viewport: the main action |
| Secondary | `brand-dark`, hover lighten 6% | `on-dark-hi` | Supporting action on light surfaces |
| Outline | transparent, 1px `line` | `ink-900` | Tertiary, filter reset, "view all" |
| Ghost on dark | transparent, 1px `dark-line` | `on-dark-hi` | Actions inside dark bands |
| Link | none | `ink-900`, underline on hover | Inline text actions |

Sizes: sm 36px, md 44px, lg 52px. **Minimum touch target is 44 by 44px** including any icon-only button, which extends its hit area beyond its visual bounds if smaller.

States: default, hover, active (translateY 1px), focus-visible (2px `brand-dark` ring, 2px offset; on dark surfaces a white ring), disabled (60% opacity, no pointer events), loading (spinner replaces the label, width locked to prevent layout shift, button disabled).

Accessibility: icon-only buttons carry `aria-label`. Never remove the focus ring. Buttons that navigate are links styled as buttons, not `onClick` handlers on a div.

### 3.2 Listing card

The most-used component on the site. Anatomy, top to bottom:

1. Media, 4:3, `--radius-lg`, `object-cover`, lazy except the first row, with an explicit width and height to reserve space.
2. Status badge, top left, semantic token per §2.1.
3. Optional "Featured" pill, top right, dark glass fill on the image.
4. Title, Cormorant 300, `--text-h3`, clamped to two lines.
5. Location line, Nunito 400, `--text-sm`, `ink-400`, with a Tabler `map-pin` icon at 16px.
6. Specification row: beds, baths, area, each a Tabler icon plus a JetBrains Mono figure.
7. Price row, JetBrains Mono, `--text-h3`, `ink-900`, with a `/ month` suffix in `--text-sm` `ink-400` for rentals.

Behaviour: the entire card is one link whose accessible name is the listing title. Hover lifts 2px, shadow steps from `sm` to `md`, media scales to 1.04. No nested interactive elements inside the card link except the optional save control, which stops propagation.

Fallbacks that matter given the current photo library: when no image exists, render a `surface-2` panel with the Sunland mark at 20% opacity, never a broken image icon. When price is null, render "Price on request" in Nunito, never an empty currency string. The current site's `KShKShKSh` output is exactly the failure this rule exists to prevent.

### 3.3 Filter bar

Sticky below the header on the listing index. Desktop: a single row of segmented pills (status, category) plus dropdowns (location, beds, price band) and a sort control. Mobile: a "Filters" button opening a bottom sheet with the same controls and a sticky "Show N results" footer button.

States: active filters render as removable chips beneath the bar with a "Clear all" action. Result count updates live. Zero results renders the empty state in §3.9 rather than a blank grid.

Accessibility: it is a `<form>` with real labels, submitting updates the URL, and the result region carries `aria-live="polite"` announcing the count.

### 3.4 Gallery

Listing detail hero. Desktop: a 2:1 primary image with a 2x2 thumbnail grid beside it and a "View all N photos" button opening a lightbox. Mobile: a swipeable carousel with dot indicators and a counter.

Lightbox: focus trapped, Escape closes, arrow keys navigate, focus returns to the trigger on close, `role="dialog"` with `aria-modal`. Images carry descriptive alt text sourced from the media record, defaulting to "{listing title}, photo {n} of {total}".

### 3.5 Enquiry form

Fields: name, phone, email, message, plus a hidden listing reference. Phone is the required contact channel and email is optional, because the Kenyan market converts on a call.

Rules: visible labels above inputs, never placeholder-only. Errors render inline beneath the field with a Tabler `alert-circle` icon and are announced via `aria-describedby`. Submit disables and shows a spinner. Success replaces the form with a confirmation panel stating what happens next and by when, plus a WhatsApp shortcut prefilled with the listing reference.

Anti-spam: honeypot field plus a timing check, no CAPTCHA. A CAPTCHA on a property enquiry costs more conversions than the spam it stops.

### 3.6 Section band

The structural primitive that gives the site its rhythm. Props: `tone` (light, tint, dark), `spacing` (default, tight, loose), `bleed` (boolean).

- `light`: `surface-0`, ink text.
- `tint`: `surface-1`, ink text, used to separate adjacent light sections.
- `dark`: `brand-dark`, `on-dark` text, glass raised panels via `dark-raise`.

Never place two `dark` bands adjacent. Never exceed three `dark` bands per page. The home page pattern is dark hero, light, tint, light, dark closing band.

### 3.7 Stat block

Four figures in a row, JetBrains Mono at `--text-h2` with a Nunito `--text-xs` uppercase label beneath. Counts animate from zero on first view over 900ms, disabled under reduced motion. Figures come from live ERP aggregates, not hardcoded marketing numbers, which is covered in doc 07 §4.4.

### 3.8 Testimonial

Cormorant 300 at `--text-h3` for the quote, attribution in Nunito 500 `--text-sm`, role or location in `ink-400`. No star ratings unless a real rating exists; the current site's "0.0 (0)" is worse than showing nothing.

### 3.9 Empty and error states

| Context | Copy pattern | Action |
|---|---|---|
| No listings match filters | What happened, why, how to fix | "Clear filters" plus three nearest alternatives |
| Location has no stock | Honest statement | Link to the parent category and a "notify me" enquiry |
| 404 | Plain, not cute | Search, plus links to Properties, Landlords, Contact |
| 500 | Plain, with a phone number | The business does not stop because the site did |
| Form failure | What failed and what to do | Retry, plus the phone number and WhatsApp link |

### 3.10 Header and footer

Header: transparent over the hero on the home page, solid `brand-dark` with a bottom hairline once scrolled past 80px, transitioning opacity only. On all other pages it starts solid. Height 72px desktop, 60px mobile. The logo is a link to home with an accessible name of "Sunland Real Estates, home".

Footer: dark band, four link columns per doc 02 §4.2, contact block with the real HQ address, and a base bar with copyright and legal links.

## 4. Iconography

Tabler Icons exclusively, matching the dashboard. 1.5px stroke, 20px default, 16px inline with text, 24px feature. Never emoji as icons. Every decorative icon carries `aria-hidden="true"`; every meaningful icon has a text label beside it or an `aria-label`.

## 5. Imagery

Given the existing library is phone-sourced and inconsistent:

- All listing media is served through `next/image` with explicit dimensions and a blur placeholder to hold layout.
- Aspect ratios are enforced by the container with `object-cover`, never by trusting the source.
- A subtle dark gradient scrim sits at the bottom of hero images so overlaid text keeps contrast regardless of what the photo contains. This is the single most important defensive choice given the photo library.
- Formats: AVIF then WebP with a JPEG fallback, quality 78.
- The first hero image is `priority`; everything else is lazy.

## 6. Accessibility contract

Non-negotiable, checked at review:

- Contrast 4.5:1 for body text, 3:1 for text above 24px and for interface boundaries. `ink-400` on `surface-0` passes; `ink-400` on `surface-2` does not and must step to `ink-500`.
- Visible focus rings on every interactive element, 2px, never removed.
- Keyboard path through every flow, including gallery, filters, and mobile nav. Tab order matches visual order.
- Sequential headings, one `h1` per page, no skipped levels.
- All form fields have associated labels; errors are announced.
- Colour never carries meaning alone; every status badge pairs colour with a word.
- `prefers-reduced-motion` honoured everywhere.
- Skip-to-content link as the first focusable element.
- Target size 44px minimum with 8px spacing between adjacent targets.

## 7. Performance budget

| Metric | Target |
|---|---|
| LCP | Under 2.0s on 4G mobile |
| CLS | Under 0.05 |
| INP | Under 200ms |
| JS shipped, home page | Under 180KB gzipped |
| Fonts | 3 families, `font-display: swap`, subset to Latin, preloaded for the two used above the fold |
| Images | AVIF or WebP, correctly sized, lazy below the fold |

Server components by default. Client components only where interaction demands: filters, gallery, forms, mobile nav, counters.

## 8. Extending this system

This document is a starting point with a spine, not a finished catalogue. New components are expected. The rules for adding one:

1. **It must be expressible in existing tokens.** A new component that needs a new colour is usually a new component that needs a rethink.
2. **It must specify every state** before it ships: default, hover, active, focus-visible, disabled, loading, empty, error.
3. **It must survive bad data**: missing image, null price, overflowing text, absent count.
4. **It goes in the registry.** An undocumented component is a component the next person will rebuild slightly differently.

Extensions to the token layer itself (a new spacing step, a new radius, a new semantic state) are permitted and sometimes correct. They require a written argument, and they apply to both surfaces, because there is one token layer.

## 9. What Claude Design should produce

For each template in doc 04, in this order:

1. Desktop 1440px and mobile 390px frames.
2. Real content, never lorem ipsum. Use the copy deck in doc 05 and real listings from the current site.
3. Every state a component can be in, including empty, loading, and error.
4. Annotation of tokens used, by name, not by hex.

## 10. Component review checklist

Applied before any web component merges:

- [ ] No hardcoded hex; all colour via tokens
- [ ] No font weight above 500
- [ ] Every price, area, and reference in JetBrains Mono
- [ ] Tabler icons only, decorative ones `aria-hidden`
- [ ] Focus-visible ring present and unremoved
- [ ] Touch targets 44px or larger
- [ ] Contrast checked against the actual background token
- [ ] Reduced motion path tested
- [ ] Empty, loading, and error states implemented, not just the happy path
- [ ] Images have dimensions and alt text
- [ ] Server component unless interaction requires otherwise
- [ ] No em dashes in any user-facing string
