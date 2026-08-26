// Weight pass for the site's image library.
//
// Companion to upscale-heroes.mjs, which fixes *resolution*. This one fixes
// *bytes*: sources that carry far more data than their pixels justify. Both are
// idempotent — a file already at or below its target is left alone.
//
// Two problems it exists to solve, both found by audit rather than guessed:
//
//   1. Photographs stored as PNG. Lossless compression on a photograph is the
//      classic own-goal: judy-wacera.png was 2.19 bytes per pixel, roughly ten
//      times the library median, for an image with no transparency in it. The
//      alpha channel is checked before converting, so a genuine cut-out is
//      never flattened onto a black rectangle.
//
//   2. JPEGs saved at a quality nobody chose. Several team portraits sat above
//      0.6 b/px, which for a 400px headshot is data no screen can show.
//
// Next's optimizer re-encodes to AVIF/WebP on delivery, so these bytes are not
// what a visitor downloads. They are what the repository, the build cache and
// every clone carry forever, and what the optimizer has to chew through on a
// cold request.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require(path.resolve("node_modules/.pnpm/sharp@0.34.5/node_modules/sharp"));

const DIR = "public/images";

// Above this, a source is carrying more data than its pixels justify. The
// library median sits around 0.22; heroes at 0.25-0.30 are legitimately
// detailed, so the threshold is set clear of them.
const HEAVY_BPP = 0.35;

// 4:4:4 rather than the default 4:2:0. These are faces and architectural
// edges, both of which show chroma subsampling as colour fringing.
const JPEG = { quality: 86, mozjpeg: true, chromaSubsampling: "4:4:4" };

const walk = (dir, out = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(jpe?g|png)$/i.test(entry.name)) out.push(full);
  }
  return out;
};

const kb = (bytes) => Math.round(bytes / 1024);

let savedBytes = 0;
let touched = 0;
const renames = [];

for (const src of walk(DIR)) {
  const before = fs.statSync(src).size;
  const meta = await sharp(src).metadata();
  const bpp = before / (meta.width * meta.height);
  const isPng = meta.format === "png";

  // A PNG only stays a PNG if its alpha channel is actually doing something.
  let opaque = true;
  if (isPng && meta.hasAlpha) {
    const stats = await sharp(src).stats();
    opaque = stats.channels[3]?.min === 255;
  }

  const convert = isPng && opaque;
  if (!convert && bpp <= HEAVY_BPP) continue;

  if (isPng && !opaque) {
    console.log(`${path.relative(DIR, src).padEnd(30)} PNG with real transparency — left alone`);
    continue;
  }

  const target = convert ? src.replace(/\.png$/i, ".jpg") : src;
  const tmp = path.join(path.dirname(src), `.tmp-${path.basename(target)}`);

  // No resize: this pass never changes a pixel's position. Resolution is
  // upscale-heroes.mjs's job, and these frames were chosen for composition.
  await sharp(src).jpeg(JPEG).toFile(tmp);

  const after = fs.statSync(tmp).size;

  // Never make a file bigger. An already-tight JPEG re-encoded can grow, and
  // shipping a worse file for the sake of running the script is not a pass.
  if (after >= before && !convert) {
    fs.unlinkSync(tmp);
    console.log(`${path.relative(DIR, src).padEnd(30)} already tight (${kb(before)}KB), skipped`);
    continue;
  }

  fs.renameSync(tmp, target);
  if (convert) {
    fs.unlinkSync(src);
    renames.push([path.basename(src), path.basename(target)]);
  }

  savedBytes += before - after;
  touched++;
  const note = convert ? "  PNG -> JPEG" : "";
  console.log(
    `${path.relative(DIR, src).padEnd(30)} ${kb(before)}KB -> ${kb(after)}KB  ` +
      `(${Math.round((1 - after / before) * 100)}% smaller, ${bpp.toFixed(2)} b/px)${note}`
  );
}

console.log(`\n  ${touched} files rewritten, ${(savedBytes / 1024 / 1024).toFixed(2)}MB saved`);
if (renames.length) {
  console.log("\n  Renamed — these references must be updated in code:");
  for (const [from, to] of renames) console.log(`    ${from}  ->  ${to}`);
}
