// Resolution pass for the site's hero art.
// See docs/landing-page-files/HERO_ASSET_SPEC.md. Idempotent — re-running is a
// no-op once every file already covers its box.
//
// Sized against the CSS box each image must fill at a 1440px desktop, at 2x
// device pixel ratio, which is the common retina-laptop case. Box-based rather
// than "make everything 2880 wide" on purpose: object-cover scales by whichever
// axis needs more, so a tall band binds on height and a wide one on width, and
// judging by width alone understates the shortfall.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const sharp = require(path.resolve("node_modules/.pnpm/sharp@0.34.5/node_modules/sharp"));

const DPR = 2;

const HEROES = {
  // The home hero is full-viewport (100svh capped at 1020px), so its box is
  // 1.6:1 at 1440x900 — taller in proportion than the ~2:1 L2 bands, which is
  // why it needs more height than a plain 16:9 at 2880 provides.
  "hero-home.jpg": [1440, 900],
  "areas-hero.jpg": [1440, 648],
  "properties-hero.jpg": [1440, 648],
  "services-hero.jpg": [1440, 738],
  "landlords-hero.jpg": [1440, 702],
  "insights-hero-right.jpg": [1440, 684],
  "about-hero.jpg": [1440, 684],
};

// The unsharp mask that rescues a 2.8x enlargement puts visible halos on a
// 1.3x one, so it scales with the factor.
function sharpenFor(f) {
  if (f <= 1.4) return { sigma: 0.7, m1: 0.5, m2: 1.4 };
  if (f <= 2.2) return { sigma: 1.0, m1: 0.6, m2: 2.0 };
  return { sigma: 1.2, m1: 0.6, m2: 2.5 };
}

for (const [file, [cssW, cssH]] of Object.entries(HEROES)) {
  const src = path.join("public/images", file);
  const m = await sharp(src).metadata();
  const factor = Math.max((cssW * DPR) / m.width, (cssH * DPR) / m.height);

  if (factor <= 1.01) {
    console.log(`${file.padEnd(26)} ${m.width}x${m.height}  covers ${cssW * DPR}x${cssH * DPR}, skipped`);
    continue;
  }

  // Aspect ratio is preserved exactly: these frames were chosen for how they
  // sit against their headlines, so composition must not move.
  const outW = Math.round(m.width * factor);
  const outH = Math.round(m.height * factor);
  const tmp = path.join("public/images", `.tmp-${file}`);

  await sharp(src)
    .resize(outW, outH, { kernel: "lanczos3" })
    .sharpen(sharpenFor(factor))
    .jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(tmp);

  const before = fs.statSync(src).size, after = fs.statSync(tmp).size;
  fs.renameSync(tmp, src);
  console.log(
    `${file.padEnd(26)} ${m.width}x${m.height} -> ${outW}x${outH}  (${factor.toFixed(2)}x)` +
    `  ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`
  );
}
