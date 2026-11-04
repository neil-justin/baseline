/**
 * Prep feedback round 3 probe (2026-11-04) — two user-feedback fixes.
 * Adapts prep-feedback-probe-3.mjs's auth/upload mechanics; verifies live on :3111:
 *
 *   FIX 1 — ring label under the ring:
 *     a. 1440 step: the band right slot is a .readring-slot column — figures
 *        centred in the 130px ring, the caption `.ratemsg` BELOW it,
 *        right-aligned under the ring's right edge, nothing touching the
 *        ring's inner edge (screenshot prep4-ring-band-1440.png).
 *     b. 390px emulated fold: the ≤720px rule pushes the SLOT right and the
 *        caption CENTRES under the ring (screenshot prep4-ring-band-390.png).
 *     c. AT contract: role="img" + aria-label on the slot, both ring and svg
 *        presentation (aria-hidden), no caption inside the ring.
 *
 *   FIX 2 — the dropzone hero grows instead of jumping:
 *     a. growth frames: an in-page rAF observer (no round-trip latency)
 *        samples the zone's computed min-height / opacity while
 *        prep-analyzing lands — early frames min-height < 320 and opacity
 *        0.4 → 1, settling at 320px.
 *     b. the whole upload landing: all cards return, the cascade replays,
 *        the verdict card sits at the viewport top
 *        (prep4-resume-waiting.png / prep4-resume-after.png).
 */
import { chromium } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";

// self-sufficient credentials (same mechanics as probe-3)
for (const line of fs.readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
}
if (!process.env.E2E_NEIL_EMAIL || !process.env.E2E_NEIL_PASSWORD) {
  console.error("missing E2E_NEIL_* env (also parsed .env.local)");
  process.exit(1);
}

const base = "http://localhost:3111";
const out = "/tmp/opencode";
const result = { ring1440: null, ring390: null, hero: null, landing: null };

const INIT = () => {
  window.__probe4 = { growth: [] };
  // zero-latency growth observer: the instant prep-analyzing lands, a rAF
  // burst samples the active panel's zone for ~700ms of real frames
  new MutationObserver(() => {
    const p = document.querySelector(".tabpanel.prep-analyzing");
    if (!p || window.__probe4.growth.length) return;
    const z = p.querySelector(".dz-zone");
    if (!z) return;
    const t0 = performance.now();
    const tick = () => {
      const cs = getComputedStyle(z);
      window.__probe4.growth.push({
        t: Math.round(performance.now() - t0),
        minH: cs.minHeight,
        opacity: +(+cs.opacity).toFixed(3),
        anim: cs.animationName,
      });
      if (performance.now() - t0 < 700) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }).observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ["class"] });
};

const RING_PROBE = () => {
  const slot = document.querySelector(".v7prep .readring-slot");
  const ring = slot?.querySelector(".readring");
  const svg = ring?.querySelector("svg");
  const mid = ring?.querySelector(".readring-mid");
  const msg = slot?.querySelector(".ratemsg");
  const cs = (el) => (el ? getComputedStyle(el) : null);
  const rect = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { l: Math.round(r.left), r: Math.round(r.right), t: Math.round(r.top), b: Math.round(r.bottom), w: Math.round(r.width), h: Math.round(r.height) };
  };
  return {
    slot: rect(slot),
    slotDisplay: cs(slot)?.display ?? null,
    slotAlign: cs(slot)?.alignItems ?? null,
    ring: rect(ring),
    svgHidden: svg?.getAttribute("aria-hidden") ?? null,
    ringHidden: ring?.getAttribute("aria-hidden") ?? null,
    slotRole: slot?.getAttribute("role") ?? null,
    slotLabel: slot?.getAttribute("aria-label") ?? null,
    innerLabel: mid?.textContent?.trim() ?? null,
    innerHasSmall: !!mid?.querySelector("small"),
    msg: {
      text: msg?.textContent?.trim() ?? null,
      rect: rect(msg),
      font: cs(msg)?.fontSize ?? null,
      color: cs(msg)?.color ?? null,
      hiddenInnerEdge:
        msg && ring ? Math.round(ring.getBoundingClientRect().bottom + -msg.getBoundingClientRect().top + -1) >= 0 : null,
    },
    // the caption's right edge vs the ring's right edge (flex-end ⇒ flush)
    rightFlush: msg && ring ? Math.abs(ring.getBoundingClientRect().right - msg.getBoundingClientRect().right) : null,
  };
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await ctx.addInitScript(INIT);

await page.goto(`${base}/signin`, { waitUntil: "networkidle" });
await page.fill("#f-email", process.env.E2E_NEIL_EMAIL);
await page.fill("#f-pass", process.env.E2E_NEIL_PASSWORD ?? "");
await page.click("#signin-form button[type=submit]");
await page.waitForURL(/dashboard|onboarding|admin/, { timeout: 20000 });
await page.goto(`${base}/prep`, { waitUntil: "networkidle" });

// ── FIX 1a: the ring at 1440 ─────────────────────────────────────────────
result.ring1440 = await page.evaluate(RING_PROBE);
await page.locator(".band").screenshot({ path: `${out}/prep4-ring-band-1440.png` });
console.log("RING 1440:", JSON.stringify(result.ring1440, null, 2));

// ── FIX 2: the hero growth + the upload landing ──────────────────────────
await page.waitForSelector(".rs-readout");
await page.locator(".tabpanel:not([hidden]) .prep-rerun input[type=file]").last().setInputFiles([path.resolve("scripts/fixtures/resume-qa.pdf")]);
// fire the growth burst immediately — one round-trip, then in-page rAF
// frames (the budget is the 240ms animation, so no waitForSelector hop)
const growth = await page.evaluate(
  () =>
    new Promise((res) => {
      const frames = [];
      const t0 = performance.now();
      const tick = () => {
        const p = document.querySelector(".tabpanel.prep-analyzing");
        const z = p?.querySelector(".dz-zone");
        if (z) {
          const cs = getComputedStyle(z);
          frames.push({
            t: Math.round(performance.now() - t0),
            minH: cs.minHeight,
            opacity: +(+cs.opacity).toFixed(3),
            anim: cs.animationName,
            panelCls: p.className.slice(0, 40),
          });
        } else {
          frames.push({ t: Math.round(performance.now() - t0), zone: null });
        }
        if (performance.now() - t0 < 900) requestAnimationFrame(tick);
        else res(frames.filter((f) => f.minH !== undefined));
      };
      requestAnimationFrame(tick);
    })
);
await page.waitForTimeout(400);
result.hero = await page.evaluate(() => ({
  growth: window.__probe4.growth,
  zIndex: Math.round(document.querySelector(".tabpanel:not([hidden]) .dz-zone").getBoundingClientRect().height),
  busyText: document.querySelector(".dz-busy")?.textContent?.trim() ?? null,
}));
result.hero.growth = growth;
await page.screenshot({ path: `${out}/prep4-resume-waiting.png`, fullPage: true });
console.log("HERO growth frames:", JSON.stringify(result.hero.growth, null, 2));
console.log("HERO settled height:", result.hero.zIndex);

// wait for the landing
await page.waitForFunction(() => !document.querySelector(".tabpanel:not([hidden])")?.classList.contains("prep-analyzing"), { timeout: 30000 });
await page.waitForTimeout(1600); // cascade + smooth scroll settle
result.landing = await page.evaluate(() => ({
  panelCls: document.querySelector(".tabpanel:not([hidden])")?.className ?? null,
  busy: !!document.querySelector(".dz-busy"),
  cards: [...(document.querySelector(".tabpanel:not([hidden])")?.children ?? [])].map((c) => ({
    cls: c.className.split(" ").slice(0, 3).join(" "),
    h: c.clientHeight,
  })),
  verdictTop: Math.round(document.querySelector(".rs-readout")?.getBoundingClientRect().top ?? -1),
}));
await page.screenshot({ path: `${out}/prep4-resume-after.png`, fullPage: true });
console.log("LANDING:", JSON.stringify(result.landing, null, 2));

await browser.close();

// ── FIX 1b: the fold at 390px emulated ───────────────────────────────────
const bctx = await chromium.launch();
const fctx = await bctx.newContext({ viewport: { width: 390, height: 844 } });
const fpage = await fctx.newPage();
await fctx.addInitScript(INIT);
await fpage.goto(`${base}/signin`, { waitUntil: "networkidle" });
await fpage.fill("#f-email", process.env.E2E_NEIL_EMAIL);
await fpage.fill("#f-pass", process.env.E2E_NEIL_PASSWORD ?? "");
await fpage.click("#signin-form button[type=submit]");
await fpage.waitForURL(/dashboard|onboarding|admin/, { timeout: 20000 });
await fpage.goto(`${base}/prep`, { waitUntil: "networkidle" });
result.ring390 = await fpage.evaluate(RING_PROBE);
await fpage.locator(".band").screenshot({ path: `${out}/prep4-ring-band-390.png` });
console.log("RING 390:", JSON.stringify(result.ring390, null, 2));
await bctx.close();

fs.writeFileSync(`${out}/prep4-result.json`, JSON.stringify(result, null, 2));
console.log("WROTE", `${out}/prep4-result.json`);
