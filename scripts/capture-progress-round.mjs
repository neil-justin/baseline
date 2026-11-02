#!/usr/bin/env node
/* Capture round — the v7.2 Progress sweep (2026-11-02).
 * Canonical surface pairs (1440×900 + 390×844, reduced-motion for
 * deterministic renders) plus diagnostic states (new-goal form open, and
 * money-record variant when the walked state is present). Requires the
 * PRODUCTION server on :3000 and .env.local (Supabase + E2E_NEIL_*).
 * Reseeding is up to the caller (the sweep reseeds before the canon pass).
 *   node --env-file=.env.local scripts/capture-progress-round.mjs [prefix] [suffix]
 */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const OUT = path.join(process.cwd(), ".impeccable", "review");
const PREFIX = process.argv[2] || "after-v72";
const SUFFIX = process.argv[3] ? `-${process.argv[3]}` : "";

const email = process.env.E2E_NEIL_EMAIL;
const password = process.env.E2E_NEIL_PASSWORD;
if (!email || !password) {
  console.error("E2E_NEIL_EMAIL / E2E_NEIL_PASSWORD unset — refusing to run");
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.emulateMedia({ reducedMotion: "reduce" });

const overflows = [];

async function pair(route, name, then) {
  await page.goto(`${BASE}${route}`);
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(2600); // count-up settle
  fs.mkdirSync(OUT, { recursive: true });
  await page.screenshot({ path: path.join(OUT, `${name}-1440.png`), fullPage: true });
  const w1 = await page.evaluate(() => document.documentElement.scrollWidth);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, `${name}-390.png`), fullPage: true });
  const w2 = await page.evaluate(() => document.documentElement.scrollWidth);
  overflows.push({ name, w1440: w1, w390: w2 });
  await page.setViewportSize({ width: 1440, height: 900 });
  if (then) await then();
}

await page.goto(`${BASE}/signin`);
await page.waitForSelector("#f-email");
await page.locator("#f-email").fill(email);
await page.locator("#f-pass").fill(password);
await page.getByRole("button", { name: "Sign in" }).click();
await page.waitForURL((u) => !u.pathname.startsWith("/signin"));
await page.waitForTimeout(1200);

/* 1 · canon surface pair (the record as the store leaves it) */
await pair("/progress", `${PREFIX}-progress${SUFFIX}`);

/* 2 · diagnostics: the new-goal form open (1440 + 390) */
await page.locator('button:has-text("Set a new goal")').click();
await page.waitForSelector(".ng-form", { state: "visible" });
await page.waitForTimeout(400);
await page.screenshot({ path: path.join(OUT, `${PREFIX}-progress-goal-editor-1440${SUFFIX}.png`), fullPage: true });
const w3 = await page.evaluate(() => document.documentElement.scrollWidth);
overflows.push({ name: `${PREFIX}-progress-goal-editor-1440${SUFFIX}`, w1440: w3 });
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(400);
await page.screenshot({ path: path.join(OUT, `${PREFIX}-progress-goal-editor-390${SUFFIX}.png`), fullPage: true });
const w4 = await page.evaluate(() => document.documentElement.scrollWidth);
overflows.push({ name: `${PREFIX}-progress-goal-editor-390${SUFFIX}`, w390: w4 });
await page.setViewportSize({ width: 1440, height: 900 });

/* 3 · diagnostics: the check overlay (intro state) when the active goal carries one */
await page.goto(`${BASE}/progress`);
await page.waitForLoadState("networkidle").catch(() => {});
await page.waitForTimeout(2600);
const launcher = page.locator('button:has-text("Start the check")').first();
if ((await launcher.count()) > 0) {
  await launcher.click();
  await page.waitForSelector(".check-overlay", { state: "visible" });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT, `${PREFIX}-progress-check-overlay-1440${SUFFIX}.png`), fullPage: false });
  const w5 = await page.evaluate(() => document.documentElement.scrollWidth);
  overflows.push({ name: `${PREFIX}-progress-check-overlay-1440${SUFFIX}`, w1440: w5 });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
} else {
  console.log("no check launcher present — overlay diagnostic skipped");
}

await browser.close();
const bad = overflows.filter((o) => (o.w390 ?? o.w1440) > (o.w390 != null ? 390 : 1440));
console.log("capture widths (scrollWidth):", JSON.stringify(overflows));
console.log(bad.length ? `VIEWPORT OVERFLOW: ${JSON.stringify(bad)}` : "no viewport overflow at any captured state");
console.log("captures written to .impeccable/review/");
