#!/usr/bin/env node
/**
 * Capture round — the Prep/credentials surfaces (2026-10-30 Prep pass).
 * Produces the before/after capture pairs per the .impeccable/review
 * conventions (1440 + 390 per state, reduced-motion for deterministic
 * renders):
 *
 *   before-prep-lettercheck-{1440,390}.png   — seed state: resume on-ramp +
 *                                              the letter check's empty state
 *   after-prep-lettercheck-{1440,390}.png    — both runs landed (AIR 100 +
 *                                              letter 100, employer omitted)
 *   before-profile-presence-{1440,390}.png   — Profile tab pre-declaration
 *   after-profile-presence-{1440,390}.png    — the machine-verified stamp row
 *
 * Requires the production server on :3000 (npm run start) and the

 * .env.local values (Supabase + E2E_NEIL_*); reseeds the canon store at the
 * end via the same admin cleanup the e2e helpers use. Never prints env.
 */
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const OUT = ".impeccable/review";
const FIX = (n) => path.join(import.meta.dirname, "..", "e2e", "fixtures", n);

const email = process.env.E2E_NEIL_EMAIL;
const password = process.env.E2E_NEIL_PASSWORD;
if (!email || !password) {
  console.error("E2E_NEIL_EMAIL / E2E_NEIL_PASSWORD unset — refusing to run");
  process.exit(1);
}

async function reseed(admin) {
  // the degraded-mode JSON fallbacks always die too — a stale row would
  // resurrect measured AR factors into the "after" captures
  fs.rmSync(path.join(process.cwd(), "data", "state.json"), { force: true });
  fs.rmSync(path.join(process.cwd(), "data", "resume-runs.json"), { force: true });
  fs.rmSync(path.join(process.cwd(), "data", "letter-runs.json"), { force: true });
  if (!admin) return;
  for (const [table, col] of [
    ["student_state", "student_id"],
    ["credentials", "id"],
    ["resume_runs", "student_id"],
    ["letter_runs", "student_id"],
  ]) {
    await admin.from(table).delete().neq(col, table === "credentials" ? "00000000-0000-0000-0000-000000000000" : "__none__");
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
const admin = url && service ? createClient(url, service, { auth: { autoRefreshToken: false, persistSession: false } }) : null;

await reseed(admin);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.emulateMedia({ reducedMotion: "reduce" });

async function signin() {
  await page.goto(`${BASE}/signin`);
  await page.waitForSelector("#f-email");
  await page.locator("#f-email").fill(email);
  await page.locator("#f-pass").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL((u) => !u.pathname.startsWith("/signin"));
}

async function capture(route, name, tabProfile = false) {
  await page.goto(`${BASE}${route}`);
  await page.waitForLoadState("networkidle").catch(() => {});
  if (tabProfile) {
    await page.waitForSelector("#tab-profile");
    await page.locator("#tab-profile").click();
    await page.waitForSelector("#panel-profile", { state: "visible" });
  }
  await page.waitForTimeout(500);
  fs.mkdirSync(OUT, { recursive: true });
  await page.screenshot({ path: path.join(OUT, `${name}-1440.png`), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, `${name}-390.png`), fullPage: true });
  await page.setViewportSize({ width: 1440, height: 900 });
}

await signin();

/* 1 · prep seed state (no runs) */
await page.waitForTimeout(1200);
await capture("/prep", "before-prep-lettercheck");

/* 2 · replay the arc's beats 6–7 (canon rehearsal): switch → re-assessment →
   goal → check pass → 52, so the two uploads measure against the canon
   Software QA Analyst target (docs/demo-beats-recut-2026-10-29.md) */
await page.goto(`${BASE}/career`);
await page.waitForSelector(".cc-switch");
await page.locator(".cc-switch .quiet-toggle", { hasText: "Switch career" }).click();
await page.locator(".quiet-toggle.disc-go").click();
await page.locator(".row-live").first().click();
await page.locator(".sw-actions .btn-primary").click();
await page.waitForSelector("#sw-reset .readout", { timeout: 12_000 });
for (const n of ["Test Planning", "Defect management", "Applications Support and Enhancement"]) {
  await page.locator("#sw-reset .skill-row", { hasText: n }).locator("button", { hasText: "Can do" }).click();
}
await page.locator("#sw-reset button", { hasText: "See my baseline" }).click();
await page.waitForSelector("#sw-recovered .nextcard", { timeout: 12_000 });
await page.locator("#sw-recovered .nextcard button", { hasText: "Set this goal" }).click();
await page.goto(`${BASE}/progress`);
const qaGoalRow = page.locator(".goal-row.active", { hasText: "Build my first test plan" });
await qaGoalRow.waitFor({ state: "visible", timeout: 15_000 });
await qaGoalRow.locator("button", { hasText: "Start the check" }).click();
const overlay = page.locator(".check-overlay");
await overlay.waitFor({ state: "visible", timeout: 15_000 });
await overlay.locator("button", { hasText: "Start the check" }).click();
for (let i = 0; i < 5; i++) {
  await overlay.locator(".q-stem").waitFor({ state: "visible", timeout: 10_000 });
  await overlay.locator(".q-opts .opt").first().click();
  await overlay.locator(".check-next button").click();
}
await overlay.locator(".r-head", { hasText: "You passed — 5 of 5" }).waitFor({ state: "visible", timeout: 15_000 });
await overlay.locator(".check-ctas button", { hasText: "Back to Progress" }).click();
await page.waitForTimeout(600);

/* land the resume run + the letter check (employer omitted) — the canon
   money-beat inputs, now measuring vs Software QA Analyst */
await page.goto(`${BASE}/prep`);
await page.waitForSelector(".rs-upload");
await page.locator('.rs-upload input[type="file"]').setInputFiles([FIX("resume-qa.pdf")]);
await page.getByRole("button", { name: "Run the diagnostic" }).click();
await page.waitForLoadState("load");
await page.waitForSelector(".cl-upload", { timeout: 45_000 });
await page.locator('.cl-upload input[type="file"]').setInputFiles([FIX("cover-letter-qa.txt")]);
await page.getByRole("button", { name: "Run the letter check" }).click();
await page.waitForLoadState("load");
await page.waitForSelector(".cl-readout", { timeout: 45_000 });
await page.waitForTimeout(800);
await capture("/prep", "after-prep-lettercheck");

/* the Profile tab before the declaration */
await capture("/profile", "before-profile-presence", true);

/* declare presence → the stamped record */
await page.locator("#p-url").fill("https://www.linkedin.com/in/neil-demo");
await page.locator("#p-email").fill("neil.demo@campus.test");
await page.getByRole("button", { name: "Declare and stamp" }).click();
await page.waitForLoadState("load");
await page.waitForTimeout(1200);
await capture("/profile", "after-profile-presence", true);

/* reseeds the canon store (background beat-5 state again) */await reseed(admin);

await browser.close();
console.log("captures written to .impeccable/review/");
