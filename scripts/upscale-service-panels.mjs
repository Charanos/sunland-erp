// Resolution pass for the four service-section media panels.
// See docs/landing-page-files/HERO_ASSET_SPEC.md. Idempotent.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const sharp = require(path.resolve("node_modules/.pnpm/sharp@0.34.5/node_modules/sharp"));

// The panel is ~605 CSS wide (42vw at 1440) and min-h-[780px] tall. At 2x DPR
// that is the box the image has to cover. Height is what actually binds here:
// a landscape source in a tall panel is scaled by height, so judging these on
// width alone understates the upscale badly.
const BOX = { w: 605 * 2, h: 780 * 2 };

const FILES = [
  "services/property-management.jpg",
  "services/sales-letting.jpg",
  "services/valuation.jpg",
  "services/commercial.jpg",
];

function sharpenFor(f) {
  if (f <= 1.4) return { sigma: 0.7, m1: 0.5, m2: 1.4 };
  if (f <= 2.2) return { sigma: 1.0, m1: 0.6, m2: 2.0 };
  return { sigma: 1.2, m1: 0.6, m2: 2.5 };
}

for (const file of FILES) {
  const src = path.join("public/images", file);
  const m = await sharp(src).metadata();
  const factor = Math.max(BOX.w / m.width, BOX.h / m.height);

  if (factor <= 1.01) {
    console.log(`${file.padEnd(34)} ${m.width}x${m.height}  already covers ${BOX.w}x${BOX.h}, skipped`);
    continue;
  }

  const outW = Math.round(m.width * factor);
  const outH = Math.round(m.height * factor);
  const tmp = path.join("public/images", `.tmp-${path.basename(file)}`);

  await sharp(src)
    .resize(outW, outH, { kernel: "lanczos3" })
    .sharpen(sharpenFor(factor))
    .jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(tmp);

  const before = fs.statSync(src).size, after = fs.statSync(tmp).size;
  fs.renameSync(tmp, src);
  console.log(
    `${file.padEnd(34)} ${m.width}x${m.height} -> ${outW}x${outH}  (${factor.toFixed(2)}x)` +
    `  ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`
  );
}
