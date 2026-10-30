#!/usr/bin/env node
/* Capture round — the v7.2 Profile sweep (Round-7 re-cut, 2026-10-30).
 * Produces the after-pair / sub-tab / presence-declared / DPA / declared-entry
 * captures under .impeccable/review/ (1440×900 + 390×844, reduced-motion for
 * deterministic renders). BEFORE pairs are captured separately
 * (scripts/capture-profile-before.mjs) against the pre-sweep build.
 * Requires the production server on :3000 and .env.local (Supabase +
 * E2E_NEIL_*); reseeds the canon store at the end. Never prints env.
 *   node --env-file=.env.local scripts/capture-profile-round.mjs
 */
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const OUT = ".impeccable/review";

const email = process.env.E2E_NEIL_EMAIL;
const password = process.env.E2E_NEIL_PASSWORD;
if (!email || !password) {
  console.error("E2E_NEIL_EMAIL / E2E_NEIL_PASSWORD unset — refusing to run");
  process.exit(1);
}

async function reseed(admin) {
  // the degraded-mode JSON fallbacks always die too — a stale row would
  // resurrect a declared credential or measured AR factor into captures
  fs.rmSync(path.join(process.cwd(), "data", "state.json"), { force: true });
  fs.rmSync(path.join(process.cwd(), "data", "resume-runs.json"), { force: true });
  fs.rmSync(path.join(process.cwd(), "data", "letter-runs.json"), { force: true });
  fs.rmSync(path.join(process.cwd(), "data", "credentials.json"), { force: true });
  if (!admin) return;
  for (const [table, col] of [
    ["student_state", "student_id"],
    ["credentials", "id"],
    ["resume_runs", "student_id"],
    ["letter_runs", "student_id"],
  ]) {
    await admin
      .from(table)
      .delete()
      .neq(col, table === "credentials" ? "00000000-0000-0000-0000-000000000000" : "__none__");
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
const admin = url && service ? createClient(url, service, { auth: { autoRefreshToken: false, persistSession: false } }) : null;

await reseed(admin);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.emulateMedia({ reducedMotion: "reduce" });

const overflows = [];

async function pair(route, name, openTab = "") {
  await page.goto(`${BASE}${route}`);
  await page.waitForLoadState("networkidle").catch(() => {});
  if (openTab) {
    await page.waitForSelector(`#tab-${openTab}`);
    await page.locator(`#tab-${openTab}`).click();
    await page.waitForSelector(`#panel-${openTab}`, { state: "visible" });
  }
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
}

async function tabOnce(tab, name) {
  await page.waitForSelector(`#tab-${tab}`);
  await page.locator(`#tab-${tab}`).click();
  await page.waitForSelector(`#panel-${tab}`, { state: "visible" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true });
  const w = await page.evaluate(() => document.documentElement.scrollWidth);
  overflows.push({ name, w1440: w });
}

await page.goto(`${BASE}/signin`);
await page.waitForSelector("#f-email");
await page.locator("#f-email").fill(email);
await page.locator("#f-pass").fill(password);
await page.getByRole("button", { name: "Sign in" }).click();
await page.waitForURL((u) => !u.pathname.startsWith("/signin"));
await page.waitForTimeout(1200);

/* 1 · canon surface (Plan tab default — beat 9's location) */
await pair("/profile", "after-v72-profile");

/* 2 · the re-cut sub-tab states (diagnostic, 1440) */
await tabOnce("competencies", "after-v72-profile-competencies-1440");
await tabOnce("profile", "after-v72-profile-credentials-1440");
// the OPEN declared-entry form — the picker + kind segmented control, diagnostic
await page.getByRole("button", { name: "Declare a credential" }).click();
await page.waitForSelector("[data-cred-form]", { state: "visible" });
await page.waitForTimeout(400);
await page.screenshot({ path: path.join(OUT, "after-v72-profile-declared-form-1440.png"), fullPage: true });
await tabOnce("account", "after-v72-profile-account-1440");

/* 3 · the DPA artifacts state (Account tab carries it) */
await pair("/profile?dpa", "after-v72-profile-dpa", "account");

/* 4 · the declared-entry flow: OPEN the form (diagnostic), then declare one
 *    certification through the REAL API → the "Needs check" row sits on
 *    the panel with its honest marks */
async function declareCertViaApi() {
  const res = await page.request.post(`${BASE}/api/credentials`, {
    data: {
      kind: "certification",
      title: "Google Data Analytics",
      organization: "Google via Coursera",
      evidenceUrl: "https://www.coursera.org/verify/neil-demo",
      evidenceNote: "certificate of completion, PDF on file",
      declaredSkills: ["Applications Development", "Business Needs Analysis"],
    },
  });
  if (!res.ok()) throw new Error(`declare failed: ${res.status()}`);
  return res.json();
}
await declareCertViaApi();
await page.goto(`${BASE}/profile`);
await page.waitForLoadState("load");
await page.waitForTimeout(1200);
await tabOnce("profile", "after-v72-profile-declared-entry-1440");

/* 5 · presence declared → the machine-verified stamp row (the money-beat
 *    fields, e2e-verbatim hooks) */
await page.locator("#p-url").fill("https://www.linkedin.com/in/neil-demo");
await page.locator("#p-email").fill("neil.demo@campus.test");
await page.getByRole("button", { name: "Declare and stamp" }).click();
await page.waitForLoadState("load");
await page.waitForTimeout(1400);
await pair("/profile", "after-v72-profile-presence-declared", "profile");

/* reseed the canon store (background beat-5 state again, neil clean) */
await reseed(admin);
await browser.close();

const bad = overflows.filter((o) => (o.w390 ?? o.w1440) > (o.w390 != null ? 390 : 1440));
console.log("capture widths (scrollWidth):", JSON.stringify(overflows));
console.log(bad.length ? `VIEWPORT OVERFLOW: ${JSON.stringify(bad)}` : "no viewport overflow at any captured state");
console.log("captures written to .impeccable/review/");
