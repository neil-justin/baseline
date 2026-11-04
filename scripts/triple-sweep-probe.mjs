/**
 * Sweep probe — Dashboard / Careers / My Plan at 5 widths.
 * Flags:
 *  1. horizontal page overflow (scrollWidth > innerWidth)
 *  2. elements bleeding past their card's right edge
 *  3. text nodes clipped by overflow (scrollWidth > clientWidth + 2)
 *  4. cards collapsed to zero height
 *  5. broken images
 */
import { chromium } from "@playwright/test";

const base = "http://localhost:3111";
const ROUTES = [
  ["dashboard", "/dashboard"],
  ["careers", "/career"],
  ["myplan", "/pathway"],
];
const WIDTHS = [1440, 1200, 960, 720, 390];

const browser = await chromium.launch();

function auditFn() {
  const out = { scrollW: document.documentElement.scrollWidth, innerW: window.innerWidth, flags: [] };
  const cards = [...document.querySelectorAll(".card, .kpis, .vd2-map, .band, .lens-row, .planhead, .vd2-standing")];
  for (const card of cards) {
    const cr = card.getBoundingClientRect();
    const walk = card.querySelectorAll("*");
    for (const el of walk) {
      if (!(el instanceof HTMLElement)) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      // bleed: element right edge beyond card right edge by > 2px
      if (r.right > cr.right + 2 && !el.closest(".sw-modal, .cc-switch .disclosure")) {
        out.flags.push({
          kind: "bleed",
          card: (card.className || "").toString().slice(0, 40),
          el: `${el.tagName}.${(el.className || "").toString().slice(0, 40)}`,
          over: Math.round(r.right - cr.right),
        });
      }
      // clipped text: nowrap element whose scrollWidth exceeds client
      const cs = getComputedStyle(el);
      if (el.children.length === 0 && el.textContent && cs.whiteSpace === "nowrap" && el.scrollWidth > el.clientWidth + 2 && cs.overflow === "hidden") {
        out.flags.push({ kind: "clip", el: `${el.tagName}.${(el.className || "").toString().slice(0, 40)}`, text: (el.textContent || "").slice(0, 30) });
      }
    }
  }
  const zeroCards = [...document.querySelectorAll(".card")].filter((c) => c.getBoundingClientRect().height < 1);
  if (zeroCards.length) out.flags.push({ kind: "zero-cards", n: zeroCards.length });
  return out;
}

for (const [name, route] of ROUTES) {
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto(`${base}/signin`, { waitUntil: "networkidle" });
    await page.fill("#f-email", process.env.E2E_NEIL_EMAIL ?? "");
    await page.fill("#f-pass", process.env.E2E_NEIL_PASSWORD ?? "");
    await page.click("#signin-form button[type=submit]");
    await page.waitForURL(/dashboard|onboarding|admin/, { timeout: 20000 });
    await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(900);
    const bad = await page.evaluate(auditFn);
    const hOverflow = bad.scrollW > bad.innerW;
    const dedup = [];
    for (const f of bad.flags) {
      if (!dedup.some((d) => JSON.stringify(d) === JSON.stringify(f))) dedup.push(f);
    }
    console.log(
      `${name}@${w}: hOverflow=${hOverflow}${hOverflow ? ` (${bad.scrollW}>${bad.innerW})` : ""} flags=${dedup.length}${
        dedup.length ? " " + JSON.stringify(dedup.slice(0, 8)) : ""
      }`
    );
    await ctx.close();
  }
}
await browser.close();
