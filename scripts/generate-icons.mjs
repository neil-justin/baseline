/**
 * Renders app/icon.svg into app/apple-icon.png (180×180, iOS home screen)
 * and app/favicon.ico (32×32, legacy browser/crawler fallback).
 * Re-run after editing the source SVG: node scripts/generate-icons.mjs
 *
 * sharp is already in node_modules as a Next.js transitive dependency — do
 * NOT add it to package.json without user sign-off (spec 2026-11-04).
 * ICO output is a minimal container embedding a PNG (Vista+ format):
 * 6-byte header + one 16-byte directory entry + the PNG blob.
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

function icoFromPng(png) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon file
  header.writeUInt16LE(1, 4); // image count
  const entry = Buffer.alloc(16);
  entry.writeUInt8(32, 0); // width in px (32; 0 would mean 256)
  entry.writeUInt8(32, 1); // height in px
  entry.writeUInt8(0, 2); // no local palette
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // color planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8); // data size
  entry.writeUInt32LE(22, 12); // data offset = 6 + 16
  return Buffer.concat([header, entry, png]);
}

const svg = await readFile(fileURLToPath(new URL("../app/icon.svg", import.meta.url)));

// density up-scales rasterization of the 64px viewBox so 180px stays crisp
await sharp(svg, { density: 300 })
  .resize(180, 180)
  .png()
  .toFile(fileURLToPath(new URL("../app/apple-icon.png", import.meta.url)));

const png32 = await sharp(svg, { density: 300 }).resize(32, 32).png().toBuffer();
await writeFile(fileURLToPath(new URL("../app/favicon.ico", import.meta.url)), icoFromPng(png32));

console.log("wrote app/apple-icon.png and app/favicon.ico");
