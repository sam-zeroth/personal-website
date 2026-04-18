#!/usr/bin/env node
/**
 * Downsample sam-logo-black.svg to an N×N bitmap, threshold it,
 * and write a pixel-art SVG (and a PNG) that can be used as favicon
 * and as the menu bar logo.
 *
 * Output:
 *   public/sam-logo-pixel.svg          — pixel-art SVG, monochrome currentColor
 *   public/sam-logo-pixel-black.png    — pixel-art PNG, black on transparent
 *   src/app/icon.png                   — 8-bit favicon (black)
 */

import sharp from "sharp";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const SIZE = 24; // pixel grid
const THRESHOLD = 110;

async function main() {
  const srcSvg = await readFile(resolve(root, "public/sam-logo-black.svg"));

  // Render the SVG to a raw RGBA buffer at SIZE × SIZE
  const { data, info } = await sharp(srcSvg, { density: 300 })
    .resize(SIZE, SIZE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .raw()
    .ensureAlpha()
    .toBuffer({ resolveWithObject: true });

  if (info.width !== SIZE || info.height !== SIZE) {
    throw new Error(`Unexpected image size ${info.width}×${info.height}`);
  }

  // Build the bitmap grid (1 = filled)
  const grid = Array.from({ length: SIZE }, () => new Array(SIZE).fill(0));
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const i = (y * SIZE + x) * 4;
      const a = data[i + 3];
      grid[y][x] = a >= THRESHOLD ? 1 : 0;
    }
  }

  // Emit pixel-art SVG
  const rects = [];
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (grid[y][x]) {
        rects.push(`<rect x="${x}" y="${y}" width="1" height="1"/>`);
      }
    }
  }
  const pixelSvg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" shape-rendering="crispEdges" fill="currentColor">`,
    ...rects,
    `</svg>`,
  ].join("");

  await writeFile(resolve(root, "public/sam-logo-pixel.svg"), pixelSvg);

  // Also emit a PNG for contexts that need raster (favicon).
  // Render the pixel-art SVG (which has integer coords) up to 256×256 via
  // nearest-neighbor — sharp respects this when no smoothing kernel is set.
  const pngBuf = await sharp(Buffer.from(pixelSvg))
    .resize(256, 256, { kernel: "nearest" })
    .png()
    .toBuffer();

  await mkdir(resolve(root, "src/app"), { recursive: true });
  await writeFile(resolve(root, "public/sam-logo-pixel-black.png"), pngBuf);
  await writeFile(resolve(root, "src/app/icon.png"), pngBuf);

  // Print a compact grid so we can visually verify
  console.log(`Bitmap (${SIZE}×${SIZE}):`);
  for (let y = 0; y < SIZE; y++) {
    console.log(grid[y].map((v) => (v ? "█" : "·")).join(""));
  }
  console.log(`\nWrote public/sam-logo-pixel.svg (${rects.length} rects)`);
  console.log(`Wrote public/sam-logo-pixel-black.png (256×256)`);
  console.log(`Wrote src/app/icon.png`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
