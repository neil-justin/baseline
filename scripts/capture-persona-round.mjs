#!/usr/bin/env node
/**
 * Capture round — the persona-alignment round (2026-10-30 SHS-residue sweep).
 * Fresh `after-persona-*` captures proving every identity line reads the new
 * state vocabulary ("4th Year" / track names) per the canon demo persona
 * (Neil, 4th Year — .impeccable/surfaces/dashboard.md):
 *
 *   after-persona-dashboard-{1440,390}.png   — h1 "Neil · 4th Year" (canon 40)
 *   after-persona-profile-{1440,390}.png     — band-id "Neil · 4th Year, Computer & IT …"
 *   after-persona-careers-{1440,390}.png     — current-career card "Computer & IT" badge
 *   after-persona-onboarding-{1440,390}.png  — OB-5 reveal "NEIL · 4th Year · Computer & IT"
 *   after-persona-onboarding-ob1-{1440,390}.png — OB-1 "What track are you in?" cards
 *
 * Requires the production server on :3000 (npm run start) and the .env.local
 * values (Supabase + E2E_NEIL_*); the demo walk reaches the reveal with the
 * canon inputs (same script the e2e demo-arc replays); reseeds the canon
 * store at both ends via the same admin cleanup the e2e helpers use. Never
 * prints env values.
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
  // resurrect measured AR factors into the captures
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

async function capture(route, name) {
  await page.goto(`${BASE}${route}`);
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(500);
  fs.mkdirSync(OUT, { recursive: true });
  await page.screenshot({ path: path.join(OUT, `${name}-1440.png`), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, `${name}-390.png`), fullPage: true });
  await page.setViewportSize({ width: 1440, height: 900 });
}

await signin();
await page.waitForTimeout(1400); // lazy NEIL_SEED → dashboard 40, count-up settles

/* ══ canon-40 surfaces: the identity lines read the new vocabulary ══ */
await capture("/dashboard", "after-persona-dashboard");
console.log("dashboard h1:", (await page.locator(".scoreband .t").first().textContent()).trim());

await capture("/career", "after-persona-careers");
console.log("careers badge:", (await page.locator(".cc-badge").first().textContent()).trim());

await capture("/profile", "after-persona-profile");
console.log("profile identity:", (await page.locator(".band-id").first().textContent()).trim());

/* ══ OB-1 track screen (the intake prints TRACK_LABELS cards) ══ */
await capture("/onboarding", "after-persona-onboarding-ob1");
console.log("ob1 head:", (await page.locator(".screen-head h1").first().textContent()).trim());

/* ══ the canonical walk to OB-5 — the reveal's who-line ══
   (beat inputs verbatim from e2e/demo-arc.spec.ts, beats 1–5) */
await page.locator(".strand-card", { hasText: "Computer & IT" }).click();
await page.getByRole("button", { name: "Continue", exact: true }).click();
await page.getByRole("heading", { name: "Do you have a career in mind?" }).waitFor();
await page.locator("button", { hasText: "No — help me figure it out" }).click();
const interestPicks = ["Kind of", "Yes, that's me", "Yes, that's me", "Not really", "Not really", "Kind of"];
for (const pick of interestPicks) {
  await page.locator(".q-stem").waitFor();
  await page.locator(".q-opts .opt", { hasText: pick }).click();
}
await page.waitForSelector("text=Careers that fit how you answered", { timeout: 10_000 });
await page.locator("button", { hasText: "Choose Associate Software Developer" }).click();
await page.locator(".btn-hero", { hasText: "Continue with Associate Software Developer" }).click();
await page.getByRole("heading", { name: "Now — where are you today?" }).waitFor();
for (const n of ["Applications Development", "Applications Support", "Agile Software", "Data Design / SQL", "Business Needs", "Collaboration · Communication"]) {
  await page.locator(".skill-row", { hasText: n }).locator("button", { hasText: "I can do this" }).click();
}
for (const n of ["Secure-coding", "Linux + web deployment"]) {
  await page.locator(".skill-row", { hasText: n }).locator("button", { hasText: "Not yet" }).click();
}
await page.locator(".num", { hasText: "8 of 8 answered" }).waitFor();
await page.getByRole("button", { name: "Continue", exact: true }).click();
await page.waitForTimeout(400); // let the batch POST /api/claim land

await page.getByRole("heading", { name: "One more thing — the people side." }).waitFor();
await page.locator(".skill-row", { hasText: "Teamwork" }).locator("button", { hasText: "Okay" }).click();
await page.locator(".skill-row", { hasText: "Communication" }).locator("button", { hasText: "Room to grow" }).click();
await page.locator(".skill-row", { hasText: "Problem-solving" }).locator("button", { hasText: "Strong" }).click();
await page.getByRole("button", { name: "Continue", exact: true }).click();

await page.getByRole("heading", { name: "The competency check — the real one." }).waitFor();
await page.getByRole("button", { name: "Start the assessment" }).click();
const compGroups = await page.locator("[data-comp]").all();
for (let g = 0; g < compGroups.length; g++) {
  for (let s = 0; s < 4; s++) {
    const word = ["Never", "Rarely", "Sometimes", "Often", "Consistently"][(g < 4 ? [5, 4, 4, 5] : [3, 2, 3, 4])[s] - 1];
    await compGroups[g].locator(`[data-item$=".${s + 1}"] button`, { hasText: word }).click();
  }
}
await page.locator(".num", { hasText: "28 of 28 answered" }).waitFor();
await page.getByRole("button", { name: "Continue", exact: true }).click();

await page.getByRole("heading", { name: "Part B — the checks." }).waitFor();
await page.locator("button", { hasText: "Start the checks" }).click();
const MCQ_KEYS = {
  "COM-1": [0, 2], "COM-2": [2, 2], "COM-3": [2, 2],
  "COM-4": [2, 0], "COM-5": [2, 3], "COM-6": [2, 2], "COM-7": [1, 1],
};
for (let i = 0; i < 14; i++) {
  const pick = MCQ_KEYS[`COM-${Math.floor(i / 2) + 1}`][i % 2];
  await page.locator(".ob-mcqcard .q-opts .opt").nth(pick).click();
  await page.waitForTimeout(150);
  await page.locator(".ob-mcqcard button.btn-ghost").click(); // Next … See the result
  await page.waitForTimeout(200);
}
await page.locator(".screen-head h1", { hasText: "4 of 7 competencies verified." }).waitFor({ timeout: 10_000 });
await page.getByRole("button", { name: "Continue", exact: true }).click();

await page.getByRole("heading", { name: "Make it official — quick skill check" }).waitFor();
await page.getByRole("button", { name: "Start the check" }).click();
for (let i = 0; i < 5; i++) {
  const skill = (await page.locator('.q-skill-tag:has-text("About:")').textContent()).replace("About: ", "").trim();
  const pick = skill === "SQL" || skill === "Business Needs Analysis" ? 0 : 1;
  await page.locator(".q-opts .opt").nth(pick).click();
  await page.getByRole("button", { name: "Next", exact: true }).click();
}
await page.locator(".screen-head h1", { hasText: "2 of 5 confirmed." }).waitFor({ timeout: 10_000 });
await page.waitForTimeout(800); // verify writes settle before the goal-set save
await page.getByRole("button", { name: "Continue", exact: true }).click();

await page.getByRole("heading", { name: "Set your first goal" }).waitFor();
await page.getByRole("button", { name: "Set this goal" }).click();
await page.waitForSelector("text=Your starting point", { timeout: 8000 });
await page.waitForTimeout(1400);

fs.mkdirSync(OUT, { recursive: true });
console.log("reveal who-line:", (await page.locator(".ob-who").textContent()).trim());
await page.screenshot({ path: path.join(OUT, "after-persona-onboarding-1440.png"), fullPage: true });
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(500);
console.log("reveal who-line (390):", (await page.locator(".ob-who").textContent()).trim());
await page.screenshot({ path: path.join(OUT, "after-persona-onboarding-390.png"), fullPage: true });
await page.setViewportSize({ width: 1440, height: 900 });

await browser.close();

/* the walk mutated the store (beat-5 state again) — leave the canon 40 seed */
await reseed(admin);

/* fresh-state shape echo (gate 4 evidence): neil's row must carry the NEW
   vocabulary after the lazy reseed read above */
if (admin) {
  const { data } = await admin.from("student_state").select("student_id, state").eq("student_id", "neil").maybeSingle();
  const s = data?.state ?? {};
  console.log("neil row shape:", JSON.stringify({ yearLevel: s.yearLevel, track: s.track, name: s.name, careerId: s.careerId }));
}
console.log("captures written to .impeccable/review/");
