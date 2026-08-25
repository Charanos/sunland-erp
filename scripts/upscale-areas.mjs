import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const sharp = require(path.resolve("node_modules/.pnpm/sharp@0.34.5/node_modules/sharp"));

const TARGET_WIDTH = 2880;

function sharpenFor(f) {
  if (f <= 1.4) return { sigma: 0.7, m1: 0.5, m2: 1.4 };
  if (f <= 2.2) return { sigma: 1.0, m1: 0.6, m2: 2.0 };
  return { sigma: 1.2, m1: 0.6, m2: 2.5 };
}

const dir = "public/images/areas";
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));

for (const file of files) {
  const src = path.join(dir, file);
  const m = await sharp(src).metadata();
  const factor = TARGET_WIDTH / m.width;

  if (factor <= 1.01) {
    console.log(`${file.padEnd(26)} ${m.width}x${m.height}  already ${TARGET_WIDTH} wide, skipped`);
    continue;
  }

  const outW = Math.round(m.width * factor);
  const outH = Math.round(m.height * factor);
  const tmp = path.join(dir, `.tmp-${file}`);

  await sharp(src)
    .resize(outW, outH, { kernel: "lanczos3" })
    .sharpen(sharpenFor(factor))
    .jpeg({ quality: 85, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(tmp);

  const before = fs.statSync(src).size, after = fs.statSync(tmp).size;
  // If it was a PNG, save as JPG and remove original
  const newSrc = src.replace(/\.png$/, '.jpg');
  fs.renameSync(tmp, newSrc);
  if (src.endsWith('.png')) {
    fs.unlinkSync(src);
  }
  
  console.log(
    `${file.padEnd(26)} ${m.width}x${m.height} -> ${outW}x${outH}  (${factor.toFixed(2)}x)` +
    `  ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`
  );
}
