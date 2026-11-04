/**
 * Prep feedback round 2 probe — the in-place result swap (Task 7).
 * Verifies, live against the dev server on :3111:
 *   1. NO document navigation on the post-upload swap (framenavigated count,
 *      URL, performance navigation entries unchanged)
 *   2. the old content stays visible while the zone reads Analyzing…, scroll
 *      position preserved through the whole wait
 *   3. `useTransition().isPending` tracks the refresh (pending-flip log)
 *   4. after the swap: prep-card-in cascade animationstart records on the
 *      ACTIVE panel's cards; verdict card aligned to viewport top
 *   5. band AR figures updated live (no reload); zone back to idle
 */
import { chromium } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";

const base = "http://localhost:3111";
const out = "/tmp/opencode";
const navEvents = [];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });
const page = await ctx.newPage();

await page.goto(`${base}/signin`, { waitUntil: "networkidle" });
await page.fill("#f-email", process.env.E2E_NEIL_EMAIL ?? "");
await page.fill("#f-pass", process.env.E2E_NEIL_PASSWORD ?? "");
await page.click("#signin-form button[type=submit]");
await page.waitForURL(/dashboard|onboarding|admin/, { timeout: 20000 });

// instrumentation installed before /prep loads; no new document is expected
// through the flow, so it survives the whole probe
await ctx.addInitScript(() => {
  window.__prepLog = { anims: [], navEntriesAtStart: performance.getEntriesByType("navigation").length, readyAt: Math.round(performance.now()) };
  window.__prepPending = []; // the component's isPending samples land here
  document.addEventListener("animationstart", (e) => {
    const c = e.target?.className?.toString?.() ?? "";
    if (c.includes("card") || c.includes("prep-kpi") || c.includes("kpi")) {
      window.__prepLog.anims.push({ name: e.animationName, cls: c.split(" ").slice(0, 3).join(" "), at: Math.round(performance.now()), top: Math.round(e.target.getBoundingClientRect().top) });
    }
  });
});

// the main-frame listener goes on BEFORE the /prep visit so the initial
// navigation is event #1 — anything after it is attributable to the flow
// (expected: exactly one more, the same-document history entry the refresh's
// RSC merge writes — navEntries staying 1 proves no new document)
page.on("framenavigated", (f) => {
  if (f === page.mainFrame()) navEvents.push({ t: Date.now(), url: f.url().slice(0, 120) });
});

await page.goto(`${base}/prep`, { waitUntil: "networkidle" });
await page.waitForSelector(".rs-readout");

const t0 = Date.now();
const tag = (ms) => Math.round(ms - t0);

const before = await page.evaluate(() => ({
  url: location.pathname + location.hash,
  navEntries: performance.getEntriesByType("navigation").length,
  navType: performance.getEntriesByType("navigation")[0]?.type,
  scrollY: Math.round(window.scrollY),
  ring: document.querySelector(".readring-mid b")?.textContent?.trim(),
  readoutScore: document.querySelector(".rs-readout-score .score-big")?.textContent?.trim(),
  readoutStamp: document.querySelector(".rs-readout-top .label")?.textContent?.trim()?.slice(0, 60),
  kpis: [...document.querySelectorAll(".prep-kpi")].map((k) => ({
    name: k.querySelector(".k-name")?.textContent,
    score: k.querySelector(".k-score")?.textContent?.trim(),
    chip: k.querySelector(".chip")?.textContent?.trim(),
  })),
}));
console.log("BEFORE:", JSON.stringify(before, null, 2));

// drop the canon resume into the ACTIVE panel's re-run zone
const reRun = page.locator(".tabpanel:not([hidden]) .prep-rerun").last();
await reRun.scrollIntoViewIfNeeded();
await page.waitForTimeout(200);
const preScrollY = before.scrollY;
const dropScrollY = Math.round(await page.evaluate(() => window.scrollY));
await page.screenshot({ path: `${out}/prep2-before.png` }).catch(() => {});

await page.locator(".tabpanel:not([hidden]) .prep-rerun input[type=file]").last().setInputFiles([path.resolve("scripts/fixtures/resume-qa.pdf")]);
console.log("DROPPED at", tag(Date.now()));
await page.screenshot({ path: `${out}/prep2-waiting.png` }).catch(() => {});

// sample the wait: busy state + scroll every 100ms until idle, cap 30 s
const samples = [];
let idleAt = null;
while (Date.now() - t0 < 30000) {
  const s = await page.evaluate(() => ({
    busy: !!document.querySelector(".dz-busy"),
    busyText: document.querySelector(".dz-busy")?.textContent?.trim()?.slice(0, 12) ?? null,
    readoutVisible: !!document.querySelector(".rs-readout")?.offsetParent, // old content still painted?
    scrollY: Math.round(window.scrollY),
    url: location.pathname + location.hash,
    docH: document.documentElement.scrollHeight,
  }));
  samples.push({ t: tag(Date.now()), ...s });
  if (!s.busy && samples.length > 2) {
    const [a, b] = samples.slice(-2);
    if (!a.busy && !b.busy) {
      idleAt = a.t;
      break; // two consecutive idle reads
    }
  }
  await page.waitForTimeout(100);
}
if (idleAt === null) idleAt = tag(Date.now());
const waitSamples = samples;
await page.screenshot({ path: "/tmp/opencode/prep2-landing.png" }).catch(() => {});
// give the cascade + smooth scroll a beat, then the final reading
await page.waitForTimeout(1600);

const after = await page.evaluate(() => ({
  scrollY: Math.round(window.scrollY),
  verdictTop: Math.round((document.querySelector(".rs-readout, .cl-readout")?.getBoundingClientRect().top ?? -1)),
  verdictVisible: !!document.querySelector(".rs-readout, .cl-readout")?.textContent,
  busy: !!document.querySelector(".dz-busy"),
  err: document.querySelector(".dz-err")?.textContent?.trim()?.slice(0, 80) ?? null,
  readoutScore: document.querySelector(".rs-readout-score .score-big")?.textContent?.trim(),
  readoutStamp: document.querySelector(".rs-readout-top .label")?.textContent?.trim()?.slice(0, 60),
  ring: document.querySelector(".readring-mid b")?.textContent?.trim(),
  navEntries: performance.getEntriesByType("navigation").length,
  navType: performance.getEntriesByType("navigation")[0]?.type,
  url: location.pathname + location.hash,
  kpis: [...document.querySelectorAll(".prep-kpi")].map((k) => ({
    name: k.querySelector(".k-name")?.textContent,
    score: k.querySelector(".k-score")?.textContent?.trim(),
    chip: k.querySelector(".chip")?.textContent?.trim(),
  })),
  pending: window.__prepPending ?? null,
  log: window.__prepLog,
}));
console.log("AFTER:", JSON.stringify(after, null, 2));
console.log("FRAMENAVIGATED:", JSON.stringify(navEvents));
console.log("IDLE_AT:", idleAt, "PRE_SCROLL:", preScrollY, "DROP_SCROLL:", dropScrollY);
console.log("SAMPLES:", JSON.stringify(waitSamples));

fs.writeFileSync(`${out}/prep2-result.json`, JSON.stringify({ before, after, navEvents, idleAt, preScrollY, dropScrollY, samples: waitSamples }, null, 2));
await page.screenshot({ path: "/tmp/opencode/prep2-after.png" }).catch(() => {});
await browser.close();
