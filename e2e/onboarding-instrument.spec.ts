import { test, expect } from "@playwright/test";
import { resetStore, neilCreds, signIn } from "./helpers";

/**
 * Onboarding instrument E2E (additive, onboarding instrument round) — the
 * 42-item competency assessment (lib/fixtures/instrument.ts, user-approved
 * bank) wired at onboarding step ③.
 *
 * Gates here, over the canon walk's own drive in demo-arc.spec.ts:
 *   1. Evidence states: the 28 Likert self-ratings alone NEVER verify — the
 *      competency's verification state is decided server-side by BOTH-checks
 *      correct in THIS attempt (POST /api/assessment → state.competencies).
 *   2. The result screen reads the SERVER's grade ("4 of 7 competencies
 *      verified." for the canon pattern — Communication · Critical Thinking ·
 *      Teamwork · Technology).
 *   3. RETAKE = LATEST COUNTS (Round 7 lock): a second, weaker full sitting
 *      recomputes state.competencies wholesale — a failed re-sit DROPS a
 *      verified mark (no partial credit carried across attempts, no
 *      best-strike). Asserted on the drop path: Communication fails one of
 *      its two checks on the re-sit → 3 of 7 verified — ES recomputes
 *      30×3/7 → 13 of 30 (round-half-down) and the dashboard receipts carry
 *      the drop.
 *   4. Honesty rails: claimed competencies never paint points; the reveal's
 *      ES tickline carries the claimed count as unearned self-report.
 *
 *workers:1 — every reset here clears the shared demo store; the final
 * afterAll restores the canon seed (40) for the next spec file.
 */

const STYLE_WORDS = ["Never", "Rarely", "Sometimes", "Often", "Consistently"];
/** rating per competency group (0..6): the canon-feel profile */
const RATINGS = (g: number) => (g < 4 ? [5, 4, 4, 5] : [3, 2, 3, 4]);
/** correct option indexes per COM-x.M1/M2 (lib/fixtures/instrument.ts keys) */
const KEYS: Record<string, [number, number]> = {
  "COM-1": [0, 2], // M1 sits on A deliberately (the miss) — canon
  "COM-2": [2, 2],
  "COM-3": [2, 2],
  "COM-4": [2, 0], // M2 sits on A ("it will be fine") — canon miss
  "COM-5": [2, 3], // M2 sits on D (silent rewrite) — canon miss
  "COM-6": [2, 2],
  "COM-7": [1, 1],
};

/** multiplier overrides per check id — "M1"/"M2" per competency: index 0..13 */
const PICKS = (overrides: Record<number, number> = {}) => {
  const out: number[] = [];
  for (let i = 0; i < 14; i++) {
    if (i in overrides) out[i] = overrides[i];
    else out[i] = KEYS[`COM-${Math.floor(i / 2) + 1}`][i % 2];
  }
  return out;
};

async function walkToStrand(page: import("@playwright/test").Page, email: string, password: string) {
  await signIn(page, email, password);
  await page.goto("/onboarding");
  await page.locator(".strand-card", { hasText: "Computer & IT" }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.locator("button", { hasText: "No — help me figure it out" }).click();
  const picks = ["Kind of", "Yes, that's me", "Yes, that's me", "Not really", "Not really", "Kind of"];
  for (const p of picks) {
    await page.locator(".q-stem").waitFor();
    await page.locator(".q-opts .opt", { hasText: p }).click();
    await page.waitForTimeout(250);
  }
  await page.waitForSelector("text=Careers that fit how you answered", { timeout: 10_000 });
  await page.locator("button", { hasText: "Choose Associate Software Developer" }).click();
  await page.locator(".btn-hero", { hasText: "Continue with Associate Software Developer" }).click();
  await expect(page.getByRole("heading", { name: "Now — where are you today?" })).toBeVisible();
  for (const n of ["Applications Development", "Applications Support", "Agile Software", "Data Design / SQL", "Business Needs", "Collaboration · Communication"]) {
    await page.locator(".skill-row", { hasText: n }).locator("button", { hasText: "I can do this" }).click();
  }
  for (const n of ["Secure-coding", "Linux + web deployment"]) {
    await page.locator(".skill-row", { hasText: n }).locator("button", { hasText: "Not yet" }).click();
  }
  await expect(page.locator(".num", { hasText: "8 of 8 answered" })).toBeVisible();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByRole("heading", { name: "One more thing — the people side." })).toBeVisible();
  await page.locator(".skill-row", { hasText: "Teamwork" }).locator("button", { hasText: "Okay" }).click();
  await page.locator(".skill-row", { hasText: "Communication" }).locator("button", { hasText: "Room to grow" }).click();
  await page.locator(".skill-row", { hasText: "Problem-solving" }).locator("button", { hasText: "Strong" }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByRole("heading", { name: "The competency check — the real one." })).toBeVisible();
}

async function sitInstrument(page: import("@playwright/test").Page, mcqPicks: number[]) {
  await page.getByRole("button", { name: "Start the assessment" }).click();
  const groups = await page.locator("[data-comp]").all();
  expect(groups).toHaveLength(7);
  for (let g = 0; g < groups.length; g++) {
    for (let s = 0; s < 4; s++) {
      await groups[g]
        .locator(`[data-item$=".${s + 1}"] button`, { hasText: STYLE_WORDS[RATINGS(g)[s] - 1] })
        .click();
    }
  }
  await expect(page.locator(".num", { hasText: "28 of 28 answered" })).toBeVisible();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Part B — the checks." })).toBeVisible();
  await page.locator("button", { hasText: "Start the checks" }).click();
  for (let i = 0; i < 14; i++) {
    await page.locator(".ob-mcqcard").waitFor();
    await page.locator(".ob-mcqcard .q-opts .opt").nth(mcqPicks[i]).click();
    await page.waitForTimeout(120);
    await page.locator(".ob-mcqcard button.btn-ghost").click();
    await page.waitForTimeout(180);
  }
  await expect(page.locator(".screen-head h1")).toContainText("competencies verified");
}

test.describe.serial("onboarding-instrument", () => {
  const neil = neilCreds();
  test.skip(!neil.email || !neil.password, "E2E_NEIL_EMAIL / E2E_NEIL_PASSWORD unset — add them to .env.local to run the instrument checks.");
  test.setTimeout(240_000);

  test.beforeAll(async () => {
    await resetStore();
  });
  test.afterAll(async () => {
    await resetStore(); // restore the canon seed for the next spec's beat-5 reads
  });

  test("canon sitting: 4 of 7 verified — both-checks rule, server grade wins", async ({ page }) => {
    await walkToStrand(page, neil.email, neil.password);
    await sitInstrument(page, PICKS());

    // the SERVER's grade — verified ⇔ both checks correct, claimed otherwise
    await expect(page.locator(".screen-head h1")).toContainText("4 of 7 competencies verified.");
    await expect(page.locator(".okband")).toContainText("Communication · Critical Thinking · Teamwork · Technology");
    // the claimed listing is honest: the three misses DID answer one check
    // right each — no partial credit still keeps them claimed
    await expect(page.locator(".ob-note", { hasText: "Claimed (self-report only)" })).toContainText(
      "Career & Self-Development · Leadership · Professionalism"
    );

    // the store now carries the attempt; ES recomputes on the engine (fixture-free)
    const state = await (await page.request.get("/api/state")).json();
    expect(state.score.es).toBe(17); // 30 × 4/7 → 17 (half-down)
    expect(state.score.total).toBe(40); // canon beat-5 composite, walked live
    expect(state.state.competencies).toMatchObject({
      Communication: "verified",
      "Critical Thinking": "verified",
      Teamwork: "verified",
      Technology: "verified",
      "Career & Self-Development": "claimed",
      Leadership: "claimed",
      Professionalism: "claimed",
    });
    expect(state.state.assessment.likert["COM-2.1"]).toBe(5); // the attempt record rides along
    expect(state.state.assessment.mcq["COM-2.M1"]).toBe(2);
  });

  test("retake drops verified — latest full attempt counts, no partial credit", async ({ page }) => {
    await walkToStrand(page, neil.email, neil.password);
    // the re-sit: Communication's M1 now sits on a wrong option (A of COM-2.M1)
    // → one right + one wrong = still claimed; the other six keep the canon
    // pattern → the grade DROPS to 3 of 7
    await sitInstrument(page, PICKS({ 2: 0 }));

    await expect(page.locator(".screen-head h1")).toContainText("3 of 7 competencies verified.");
    await expect(page.locator(".okband")).toContainText("Critical Thinking · Teamwork · Technology");
    await expect(page.locator(".okband")).not.toContainText(" · Communication ·");
    // claimed now includes Communication — the failed re-sit honestly dropped it
    await expect(page.locator(".ob-note", { hasText: "Claimed (self-report only)" })).toContainText(
      "Communication"
    );

    const state = await (await page.request.get("/api/state")).json();
    expect(state.score.es).toBe(13); // 30 × 3/7 = 12.857 → 13 (half-down)
    expect(state.state.competencies.Communication).toBe("claimed");

    // the dashboard receipts carry the recomputed channel (no stale 17)
    await page.goto("/dashboard");
    const rows = (await page.locator(".sub-row").allTextContents()).map((t) => t.trim());
    expect(rows[1]).toContain("13 of 30");
    expect(rows[1]).toContain("3 of 7 NACE competencies verified");
  });
});
