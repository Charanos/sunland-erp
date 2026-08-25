# Hero art: resolution pass

## What was wrong

The heroes were soft because the source files were smaller than the boxes they
fill. `object-cover` was enlarging them by up to 2.8x on a retina laptop, which
is the common case, not the exotic one.

The *pictures* were never the problem. They are purpose-made Nairobi frames,
chosen for how each sits against its headline — the copy is placed
asymmetrically left or right against the weight of the image, and that balance
is deliberate. An earlier pass proposed swapping them for Unsplash stock; that
was withdrawn once the files were actually examined. See "Why not stock".

## What was done

Every hero was resampled to **2880px wide** with Lanczos3 and a measured
unsharp mask, preserving each frame's exact aspect ratio and composition. The
script is reproducible; the sharpening is scaled to the upscale factor, since
the mask that rescues a 2.8x enlargement puts visible halos on a 1.3x one.

| File | Before | After | Factor |
|---|---|---|---|
| `areas-hero.jpg` | 1024x1024 | 2880x2880 | 2.81x |
| `properties-hero.jpg` | 1376x768 | 2880x1607 | 2.09x |
| `landlords-hero.jpg` | 1376x768 | 2880x1607 | 2.09x |
| `services-hero.jpg` | 1376x768 | 2880x1607 | 2.09x |
| `insights-hero-right.jpg` | 1376x768 | 2880x1607 | 2.09x |
| `hero-home.jpg` | 2236x1248 | 2880x1607 | 1.29x |

Re-encoded with mozjpeg at q88 and 4:4:4 chroma, so four of the six got
*smaller* on disk despite carrying four times the pixels. Every hero now
downscales at 1440, at 1920 and at 1440@2x — no upscaling anywhere.

`areas-hero.jpg` stays square. Only about 45% of its height is ever visible in
a 2.2:1 band, but the crop is what the composition was judged on, so the frame
was not re-aspected. It is the one file that grew (1.2MB to 1.9MB); the wasted
height is the price of keeping the picture the client chose.

## Resampling is not new detail

Lanczos plus unsharp does not invent information. It counteracts the mush of
enlargement and holds edges — roof tiles, window mullions, court lines — which
is a real and visible improvement over letting the browser stretch a small
file. It is not equivalent to a genuinely larger original.

These frames appear to be generated rather than photographed. If the generator
that produced them can re-run at 2880x1620, that will beat this pass, because
it produces real detail rather than a better guess at it. This is the upgrade
path, and it is cheap.

## Why not stock

A survey of Unsplash for equivalents returned Toronto (CN Tower, with Trump and
Deloitte signage), Manhattan (Allianz signage), Chicago under snow with US
transit livery, a Nordic cottage and Spanish villas. Substituting any of those
would trade a correct, local, on-message picture for a generic and visibly
foreign one — on a Nairobi property site. The resolution problem was real;
stock was not the fix.

## Known content defect

`services-hero.jpg` carries a wall logo reading **"NYUMBANI REALTY"** — not
Sunland. Whatever produced it invented an agency name, and it is now rendered
at higher resolution, so it reads more clearly than before. It should be
regenerated with Sunland's mark or with no legible branding. Several frames
also carry slightly garbled generated text on signage and screens; higher
resolution makes those *more* legible, not less. Worth reviewing each at full
size.

## Caching note

Filenames did not change, so browsers and any CDN will keep serving the old
low-resolution derivatives until they expire — `minimumCacheTTL` in
`next.config.ts` is 24h. A hard refresh shows the new files immediately. In
dev, the Next image cache at `.next/cache/images` must be cleared and the
server restarted, or it serves the stale optimization indefinitely.

## Unused assets — removed

`insights-hero.jpg`, `insights-hero-connect.jpg`, `insights-hero-kenya.jpg`,
`insights-hero-premium.jpg` and `hero-bg.jpg` had zero references and totalled
~3.0MB. They were deleted. Only `insights-hero-right.jpg` is actually used, and
it stays.

Check exact paths, not substrings, if you repeat this: `insights-hero` matches
`insights-hero-right`, and `hero-bg` matches the `.hero-bg` motion class, so a
loose grep reports both as still-referenced.

---

# Area images (`WEB_AREAS[].imageUrl`)

Separate from the heroes above. Each of the 20 entries in
`src/components/web/constants/locations.content.ts` carries a remote Unsplash
URL, used in two places: the tiles on `/locations`, and — importantly — as the
**full-bleed `100vw` hero of that area's detail page** (`/locations/[slug]`,
via `const bgImage = area.imageUrl`).

## Fixed

They were all requesting `w=1000`. As a 100vw hero that is a **2.88x upscale**
at 1440@2x — worse than any of the six heroes above. All 20 now request:

```
?fm=jpg&fit=crop&crop=entropy&ar=16:9&w=2880&q=85
```

- `w=2880` removes the upscale. Measured after the change: 1.03x, effectively
  crisp.
- `ar=16:9` is not cosmetic. Four sources were **portrait** — Kilimani 2880x3840,
  Upper Hill 2880x4320, Ongata Rongai 2880x3600, Nyali 2880x3727 — being
  cover-cropped into a wide band, so most of each file was downloaded and then
  thrown away. Nyali alone dropped 3.8MB to 1.7MB.
- `fm=jpg` instead of `auto=format`: Next re-encodes to AVIF anyway, and taking
  a WebP from Unsplash to re-encode as AVIF is a needless second lossy pass.

## Not fixed: several images do not match their area

Each was downloaded and looked at. These are wrong on content, not resolution:

| Area | Tagline | Current image | Verdict |
|---|---|---|---|
| `nyeri` | Highland homesteads & acreage | Yosemite Valley, El Capitan | Wrong continent, iconic US landmark |
| `iten` | Highland rift valley plots | Snow-capped alpine, conifers (Yukon) | Kenyan highlands are not alpine |
| `ongata-rongai` | Suburban homes near the park | Red timber cottage, Nordic moorland | Wrong entirely |
| `tatu-city` | Master-planned SEZ metropolis | Office corridor interior | Wrong scale — needs an aerial |
| `riverside-drive` | Prime riverine residences | Wheat field at sunset | Not residential |
| `ruiru` | Bypass parcels & gated estates | **Same wheat field** as riverside-drive | Duplicate |
| `kileleshwa` | Newer towers & expat residences | Low villa with palms | Says villa, copy says towers |

Reasonable as-is: `upper-hill` (glass towers), `baba-dogo` (warehouse racking),
`westlands` (high-rise), `kilimani` (apartment block).

## Recommendation

Do not spend more time on Unsplash for these. A survey for Kenya-appropriate
property imagery returned Toronto, Manhattan, Chicago in snow, Yosemite, Yukon,
Nordic cottages, Spanish villas and a Tanzanian safari vehicle. The library is
heavily Western and the hit rate for "Nairobi residential submarket" is close
to zero. Unsplash's search API needs a key; the public endpoint returns 307.

The six site heroes were clearly generated rather than sourced, and they are
*good* — an aerial submarket with KICC on the horizon, a hillside villa at dusk,
a tower over an arterial with matatus. Whatever produced those can produce 20
area frames that are actually Nairobi, for the same effort as hunting stock and
a far better result. That is the recommended path.
