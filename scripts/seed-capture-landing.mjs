// Seed + capture — marketing-page shots (2026-11-06 refresh).
//
// Walks the CANON onboarding arc as the primary E2E student (Aisat) with her
// own app data (reset → RIASEC quiz → verify ladders → NACE instrument →
// goal), uploads the resume + cover-letter artifacts on Prep, then captures
// the four feature views into public/shots/.
//
// The verify + NACE check answers come from the demo banks on disk (banks.ts
// VMCQ + skill-banks/it.ts ladders + fixtures/instrument.ts mcq keys), parsed
// stem → key with regex — the same items the cards render.
//
//   node --env-file=.env.local scripts/seed-capture-landing.mjs [baseURL]
import { readFileSync } from "node:fs";
import { chromium } from "@playwright/test";
import path from "node:path";

const base = process.argv[2] ?? "http://localhost:3111";
const email = process.env.E2E_PRIMARY_STUDENT_EMAIL;
const password = process.env.E2E_PRIMARY_STUDENT_PASSWORD;
if (!email || !password) {
  console.error("E2E_PRIMARY_STUDENT_* unset");
  process.exit(1);
}

/** stem → answer index, parsed from the TS fixture banks. */
function parseAnswerBank(file, answerField = "answer") {
  const src = readFileSync(path.resolve(import.meta.dirname, "..", file), "utf8");
  const map = new Map();
  const re = new RegExp(`stem:\\s*\\n?\\s*"((?:[^"\\\\]|\\\\.)*)"[^}]*?${answerField}:\\s*(\\d+)`, "gs");
  for (const [, stem, answer] of src.matchAll(re)) {
    map.set(stem, Number(answer));
  }
  if (map.size === 0) throw new Error(`no stems parsed from ${file}`);
  return map;
}
const VERIFY_KEYS = parseAnswerBank("lib/fixtures/skill-banks/it.ts");
for (const [stem, answer] of parseAnswerBank("app/(onboarding)/onboarding/banks.ts")) {
  VERIFY_KEYS.set(stem, answer);
}
/** mcq id → key, parsed from the instrument fixture (the cards carry data-mcq). */
function parseInstrumentKeys() {
  const src = readFileSync(path.resolve(import.meta.dirname, "..", "lib/fixtures/instrument.ts"), "utf8");
  const map = new Map();
  const ids = [...src.matchAll(/id:\s*"(COM-[^"]+)"/g)];
  for (let i = 0; i < ids.length; i++) {
    const slice = src.slice(ids[i].index, ids[i + 1]?.index ?? src.length);
    const key = slice.match(/key:\s*(\d+)/);
    if (key) map.set(ids[i][1], Number(key[1]));
  }
  if (map.size === 0) throw new Error("no instrument keys parsed");
  return map;
}
const NACE_KEYS = parseInstrumentKeys();
console.log("answer bank:", VERIFY_KEYS.size, "verify +", NACE_KEYS.size, "nace keys");

const browser = await chromium.launch({ timeout: 120_000 });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
const page = await ctx.newPage();

/* ── sign in ── */
await page.goto(`${base}/signin`, { waitUntil: "networkidle" });
await page.fill("#f-email", email);
await page.fill("#f-pass", password);
await page.click("#signin-form button[type=submit]");
await page.waitForURL(/dashboard|onboarding|admin/, { timeout: 20000 });
console.log("signed in");

/* ── fresh onboarding state (app's own reset route) ── */
const reset = await page.evaluate(async () => {
  const r = await fetch("/api/onboarding/reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ confirm: "RESET" }),
  });
  return r.status;
});
console.log("onboarding reset:", reset);
await page.goto(`${base}/onboarding`, { waitUntil: "networkidle" });

/* ── ①a strand → ①b program → ② branch ── */
await page.locator(".strand-card", { hasText: "Computer & IT" }).click();
await page.getByRole("button", { name: "Continue", exact: true }).click();
await page.getByRole("heading", { name: "Do you have a career in mind?" }).waitFor();
await page.locator("button", { hasText: "No — help me figure it out" }).click();

/* ── ② RIASEC quiz — swd (Software Developers) fits an R-I-C mix ── */
const interestPicks = [
  "Strongly like", "Like", "Like", // R
  "Strongly like", "Strongly like", "Strongly like", // I
  "Dislike", "Dislike", "Dislike", // A
  "Dislike", "Dislike", "Dislike", // S
  "Dislike", "Dislike", "Dislike", // E
  "Like", "Like", "Unsure", // C
];
for (const pick of interestPicks) {
  await page.locator(".q-stem").waitFor();
  await page.getByRole("button", { name: pick, exact: true }).click();
}
await page.locator("button", { hasText: "Choose Associate Software Developer" }).click();

/* ── ③ Skills — verification ladders (all core skills of swd) ── */
await page.waitForSelector(".vq-stem", { timeout: 30000 }); // commit POST completes → first card
const seenStems = new Set();
while (await page.locator(".vq-stem").count()) {
  await page.locator(".vq-stem").first().waitFor({ timeout: 10_000 });
  const stem = (await page.locator(".vq-stem").innerText()).trim();
  if (seenStems.has(stem)) {
    await page.waitForTimeout(600); // just answered the rung — wait for the swap
    if ((await page.locator(".vq-stem").count()) === 0) break;
  }
  seenStems.add(stem);
  const key = VERIFY_KEYS.get(stem);
  if (key === undefined) throw new Error(`unknown verify stem: ${stem}`);
  await page.getByRole("button", { name: (await page.locator(".vq-opt").nth(key).innerText()).trim(), exact: true }).click();
  // the band confirms the pick; Next then advances or flips to the result
  await page.locator(".vq-next").click();
  await page.waitForTimeout(500);
  for (let w = 0; w < 10 && (await page.locator(".vq-stem").innerText().then((t) => t.trim() === stem).catch(() => false)); w++) {
    await page.waitForTimeout(400);
  }
}
console.log("verify cards answered:", seenStems.size);
const resultText = await page.locator(".ob-screen").innerText();
console.log("verify result:", resultText.slice(0, 120));
await page.locator(".ob-ctas button", { hasText: "Continue" }).click();
await page.waitForTimeout(500);

/* ── ④ Assess — the 42-card NACE cadence, every MCQ answered true ── */
await page.getByRole("heading", { name: "The competency check — the real one." }).waitFor();
await page.getByRole("button", { name: "Start the assessment" }).click();
const NACE_CARDS = 42;
for (let k = 0; k < NACE_CARDS; k++) {
  await page.waitForTimeout(150);
  const mcqs = await page.locator(".ob-mcqcard .q-opt, .ob-mcqcard .q-opts .opt").count();
  if (mcqs > 0) {
    const id = await page.locator(".ob-mcqcard").getAttribute("data-mcq");
    const key = NACE_KEYS.get(id);
    if (key === undefined) throw new Error(`unknown nace mcq id: ${id}`);
    await page.locator(".ob-mcqcard .q-opts .opt").nth(key).click();
  } else {
    // statement card — the honest-high Likert row
    await page.getByRole("button", { name: /^5 — /, exact: true }).click();
  }
  const last = k === NACE_CARDS - 1;
  await page.locator(".ob-ctas button", { hasText: last ? "Finish" : "Next" }).click();
  if (!last) {
    // the band shows before Next re-arms; wait for the next card's counter
    await page.locator(`text=QUESTION ${k + 2} OF ${NACE_CARDS}`).waitFor({ timeout: 10_000 });
  }
}
console.log("nace 42/42 done");

/* ── ④ result → ⑤ goal → reveal → dashboard ── */
await page.locator(".ob-ctas button", { hasText: "Continue" }).click();
await page.getByRole("heading", { name: "Set your first goal" }).waitFor();
console.log("goal heading:", (await page.locator(".ob-screen p").first().innerText()).slice(0, 90));
await page.getByRole("button", { name: "Set this goal" }).click();
await page.getByRole("heading", { name: "Your starting line" }).waitFor({ timeout: 20_000 }).catch(() => {});
if (!(await page.getByRole("heading", { name: "Your starting line" }).isVisible().catch(() => false))) {
  console.log("reveal not shown — re-clicking Set this goal");
  await page.getByRole("button", { name: "Set this goal" }).click();
  await page.getByRole("heading", { name: "Your starting line" }).waitFor({ timeout: 20_000 });
}
console.log("reveal score:", (await page.locator(".readout-score span").innerText()));
await page.locator("a", { hasText: "Take me to my Dashboard" }).click();
await page.waitForURL(/dashboard/, { timeout: 15_000 });
await page.waitForLoadState("networkidle");
console.log("onboarding walk done → dashboard");

/* ── Prep: measured AR factors (resume + letter artifacts) ── */
await page.goto(`${base}/prep`, { waitUntil: "networkidle" });
const fileInputs = page.locator("input.rs-file");
await fileInputs.first().waitFor({ timeout: 15_000 });
await fileInputs.nth(0).setInputFiles("scripts/fixtures/resume-good.pdf");
await page.waitForTimeout(4000); // resume parse + run persist
await fileInputs.nth(1).setInputFiles("scripts/fixtures/cover-letter-qa.txt");
await page.waitForTimeout(4000); // letter check persist
console.log("prep checks run");

/* ── capture the four feature views ── */
const pages = [
  ["dashboard", "/dashboard"],
  ["career", "/career"],
  ["pathway", "/pathway"],
  ["prep", "/prep"],
];
for (const [name, route] of pages) {
  await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `public/shots/${name}.png`, fullPage: false });
  console.log(`✓ public/shots/${name}.png`);
}
await browser.close();
