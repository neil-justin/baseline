/**
 * Prep feedback round 2b probe — the busy state REPLACES the tab content (Task 8).
 * Verifies, live against the dev server on :3111:
 *   1. DURING the wait: the active panel carries `prep-analyzing`; every
 *      non-uploader card has zero client height; exactly ONE card is visible
 *      (the uploader's); the running zone reads as a tall (~320px) centred
 *      hero — spinner 28px, "Analyzing…" head + the honest sub line
 *   2. the refresh commit does NOT strip the client-added class from the
 *      panel node (MutationObserver on the panel's class attribute + a
 *      dataset identity tag the commit cannot know about)
 *   3. AFTER the swap: class removed (stack restored, cascade replay
 *      animationstart records post-commit), verdict card aligned to viewport
 *      top, NO new document (framenavigated count unchanged)
 *   4. reduced motion: hero visible but static (no dz-pulse / dz-rot), instant
 *      verdict landing
 *   5. the never-run intake hero is verified SYNTHETICALLY (a test section
 *      carrying the intake marker classes is measured against the analyzing
 *      rules, then removed) — the real never-run path needs clearing the
 *      stored run, a data risk the probe does not take
 */
import { chromium } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";

// self-sufficient credentials (probe-2 assumed exported env)
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
const result = { resume: null, letter: null, reduced: null, intake: null };

const INIT = () => {
  window.__probe3 = { classMutations: [], anims: [] };
  // strip detector: any class/hidden mutation on a tabpanel element is logged
  new MutationObserver((muts) => {
    for (const m of muts) {
      const el = m.target;
      if (el?.classList?.contains("tabpanel")) {
        window.__probe3.classMutations.push({
          t: Math.round(performance.now()),
          attr: m.attributeName,
          oldClass: (m.oldValue ?? "").slice(0, 90),
          cls: el.className.slice(0, 90),
        });
      }
    }
  }).observe(document, { subtree: true, attributes: true, attributeOldValue: true, attributeFilter: ["class", "hidden"] });
  document.addEventListener("animationstart", (e) => {
    const c = e.target?.className?.toString?.() ?? "";
    if (c.includes("card") || c.includes("prep")) {
      window.__probe3.anims.push({ name: e.animationName, cls: c.split(" ").slice(0, 3).join(" "), at: Math.round(performance.now()) });
    }
  });
};

// a wait-loop sample: busy/hero/class state of the ACTIVE panel
const SAMPLE = () => ({
  busy: !!document.querySelector(".dz-busy"),
  busyText: document.querySelector(".dz-busy")?.textContent?.trim() ?? null,
  panelCls: document.querySelector(".tabpanel:not([hidden])")?.className ?? null,
  tagKept: !!document.querySelector(".tabpanel:not([hidden])")?.dataset.__probeTag,
  // the hidden-card contract: every card that does NOT carry the analyzing
  // zone reads zero-height; exactly ONE visible card, holding the zone
  cards: [...(document.querySelector(".tabpanel:not([hidden])")?.children ?? [])].map((c) => ({
    cls: c.className.split(" ").slice(0, 3).join(" "),
    h: c.clientHeight,
  })),
  zone: (() => {
    const z = document.querySelector(".tabpanel:not([hidden]) .dz-zone");
    if (!z) return null;
    const zr = z.getBoundingClientRect();
    const b = z.querySelector(".dz-busy")?.getBoundingClientRect();
    const sub = z.querySelector(".dz-an-sub");
    const spin = z.querySelector(".dz-spin");
    const busyEl = z.querySelector(".dz-busy");
    const headCs = busyEl ? (() => { const c = getComputedStyle(busyEl); return { size: c.fontSize, weight: c.fontWeight, color: c.color }; })() : null;
    return {
      h: Math.round(zr.height),
      centered: b ? Math.round((b.top + b.height / 2) - (zr.top + zr.height / 2)) : null,
      // computed style: layout size, unaffected by the dz-rot rotation
      // transform (bounding rect reads mid-rotation boxes; svg has no offsetWidth)
      spin: spin ? [parseFloat(getComputedStyle(spin).width), parseFloat(getComputedStyle(spin).height)] : null,
      subText: sub?.textContent?.trim() ?? null,
      zoneAnim: getComputedStyle(z).animationName,
      headCs,
    };
  })(),
  scrollY: Math.round(window.scrollY),
  navEntries: performance.getEntriesByType("navigation").length,
});

async function runUpload(page, tab, file, tagOut) {
  const panelSel = tab === "resume" ? ".tabpanel:not([hidden]) .prep-rerun input[type=file]" : ".tabpanel:not([hidden]) .cl-upload input[type=file]";
  await page.waitForSelector(tab === "resume" ? ".rs-readout" : ".cl-readout");
  await page.locator(panelSel).last().setInputFiles([file]);
  await page.waitForSelector(".tabpanel:not([hidden]) .dz-busy");
  // tag the panel node (dataset identity) — a replaced/stripped node loses it
  await page.evaluate(() => {
    const p = document.querySelector(".tabpanel:not([hidden])");
    if (p) p.dataset.__probeTag = "p3";
  });
  await page.screenshot({ path: `${out}/prep3-${tagOut}-waiting.png` });
  const samples = [];
  let landedAt = null;
  const t0 = Date.now();
  while (Date.now() - t0 < 30000) {
    const s = await page.evaluate(SAMPLE);
    samples.push({ t: Date.now() - t0, ...s });
    if (!s.busy && !s.panelCls?.includes("prep-analyzing")) { landedAt = Date.now() - t0; break; }
    await page.waitForTimeout(80);
  }
  await page.waitForTimeout(250); // post-landing beat
  const scrollProbe = await page.evaluate(() => ({
    scrollY: Math.round(window.scrollY),
    verdictTop: Math.round(document.querySelector(".rs-readout, .cl-readout")?.getBoundingClientRect().top ?? -1),
  }));
  await page.waitForTimeout(1600); // cascade + smooth scroll settle
  const after = await page.evaluate(() => ({
    panelCls: document.querySelector(".tabpanel:not([hidden])")?.className ?? null,
    busy: !!document.querySelector(".dz-busy"),
    cards: [...(document.querySelector(".tabpanel:not([hidden])")?.children ?? [])].map((c) => c.clientHeight),
    verdictTop: Math.round(document.querySelector(".rs-readout, .cl-readout")?.getBoundingClientRect().top ?? -1),
    scrollY: Math.round(window.scrollY),
    navEntries: performance.getEntriesByType("navigation").length,
    log: window.__probe3,
  }));
  await page.screenshot({ path: `${out}/prep3-${tagOut}-after.png` });
  return { samples, landedAt, scrollProbe, after };
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const navEvents = [];
page.on("framenavigated", (f) => { if (f === page.mainFrame()) navEvents.push(f.url().slice(0, 90)); });
await ctx.addInitScript(INIT);

await page.goto(`${base}/signin`, { waitUntil: "networkidle" });
await page.fill("#f-email", process.env.E2E_NEIL_EMAIL);
await page.fill("#f-pass", process.env.E2E_NEIL_PASSWORD ?? "");
await page.click("#signin-form button[type=submit]");
await page.waitForURL(/dashboard|onboarding|admin/, { timeout: 20000 });
await page.goto(`${base}/prep`, { waitUntil: "networkidle" });

// ── 1. resume re-run ─────────────────────────────────────────────────────
result.resume = await runUpload(page, "resume", path.resolve("scripts/fixtures/resume-qa.pdf"), "resume");
console.log("RESUME landedAt:", result.resume.landedAt);
console.log("RESUME after:", JSON.stringify(result.resume.after, null, 2));
console.log("RESUME classMutations:", JSON.stringify(result.resume.after.log.classMutations.filter((m) => m.cls.includes("prep-analyzing") || m.oldClass.includes("prep-analyzing"))));

// ── 2. letter re-run (switch tabs first) ─────────────────────────────────
await page.click("#tab-letter");
await page.waitForTimeout(300);
result.letter = await runUpload(page, "letter", path.resolve("scripts/fixtures/cover-letter-qa.txt"), "letter");
console.log("LETTER landedAt:", result.letter.landedAt);
console.log("LETTER after:", JSON.stringify(result.letter.after, null, 2));

// ── 3. never-run intake hero — SYNTHETIC (no data risk) ──────────────────
result.intake = await page.evaluate(() => {
  const panel = document.querySelector(".tabpanel:not([hidden])");
  panel.classList.add("prep-analyzing"); // client-imperative, removed below
  const hide = document.createElement("section");
  const keep = document.createElement("section");
  const ikeep = document.createElement("section");
  hide.className = "card"; keep.className = "card prep-rerun"; ikeep.className = "card prep-intake";
  panel.append(ikeep, keep, hide);
  const zone = document.querySelector(".tabpanel:not([hidden]) .dz-zone") ?.cloneNode(true);
  zone && ikeep.appendChild(zone);
  ikeep.querySelector(".dz-busy")?.remove(); // clone is idle; force-busy via swap
  if (zone) {
    zone.innerHTML = "";
    zone.insertAdjacentHTML("afterbegin", '<span class="dz-busy dz-analyzing" role="status"><span class="dz-an-sub">x</span></span>');
  }
  const read = (el) => ({ display: getComputedStyle(el).display, zoneH: el.querySelector?.(".dz-zone") ? Math.round(el.querySelector(".dz-zone").getBoundingClientRect().height) : null });
  const r = { anonymousCard: read(hide), rerunCard: read(keep), intakeCard: read(ikeep) };
  for (const el of [ikeep, keep, hide]) el.remove();
  panel.classList.remove("prep-analyzing");
  return r;
});
console.log("INTAKE synthetic:", JSON.stringify(result.intake, null, 2));

await browser.close();

// ── 4. reduced motion (fresh context) ────────────────────────────────────
const bctx = await chromium.launch();
const rctx = await bctx.newContext({ viewport: { width: 1440, height: 900 } });
const rpage = await rctx.newPage();
await rctx.addInitScript(INIT);
const navEvents2 = [];
rpage.on("framenavigated", (f) => { if (f === rpage.mainFrame()) navEvents2.push(f.url().slice(0, 90)); });
await rpage.goto(`${base}/signin`, { waitUntil: "networkidle" });
await rpage.emulateMedia({ reducedMotion: "reduce" });
await rpage.fill("#f-email", process.env.E2E_NEIL_EMAIL);
await rpage.fill("#f-pass", process.env.E2E_NEIL_PASSWORD ?? "");
await rpage.click("#signin-form button[type=submit]");
await rpage.waitForURL(/dashboard|onboarding|admin/, { timeout: 20000 });
await rpage.goto(`${base}/prep`, { waitUntil: "networkidle" });
result.reduced = await runUpload(rpage, "resume", path.resolve("scripts/fixtures/resume-qa.pdf"), "reduced");
const reducedFirstIdle = result.reduced.samples.findLast((s) => !s.busy && !s.panelCls?.includes("prep-analyzing"));
console.log("REDUCED landedAt:", result.reduced.landedAt);
console.log("REDUCED first idle sample:", JSON.stringify(reducedFirstIdle, null, 2));
await rpage.waitForTimeout(300);
const reducedAfter = await rpage.evaluate(() => ({
  verdictTop: Math.round(document.querySelector(".rs-readout, .cl-readout")?.getBoundingClientRect().top ?? -1),
  classRemoved: !document.querySelector(".tabpanel:not([hidden])")?.classList.contains("prep-analyzing"),
  busy: !!document.querySelector(".dz-busy"),
  anims: (window.__probe3?.anims ?? []).length,
  log: window.__probe3,
}));
result.reduced.after = reducedAfter;
console.log("REDUCED after:", JSON.stringify(reducedAfter, null, 2));
await bctx.close();

fs.writeFileSync(`${out}/prep3-result.json`, JSON.stringify({ ...result, navEvents, navEvents2 }, null, 2));
console.log("NAV events (ctx A):", JSON.stringify(navEvents), "(ctx B):", JSON.stringify(navEvents2));
console.log("WROTE", `${out}/prep3-result.json`);
