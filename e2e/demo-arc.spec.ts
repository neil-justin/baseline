import { test, expect } from "@playwright/test";
import * as path from "node:path";
import { resetStore, settled, shot, signIn, cohortEmail, DEMO_PASSWORD, neilCreds } from "./helpers";

/**
 * Demo-arc E2E — one walk, beats 1–10 (plan Task 15).
 * Canon: ADR 0002 (amendment 2, ticket 12) five-channel re-lock with the AR
 * split (resume 7 / letter 5 / presence 3):
 *   setup 40 → switch dip 21 → post-re-assessment 35 → check pass 52 → the
 *   Application Materials pass → money beat 67: resume 7 of 7 (resume-qa.pdf,
 *   AIR 100) → letter 5 of 5 (the canon letter, employer OMITTED — the honest
 *   skip line) → presence 3 of 3 (the machine-verified offline stamp) — the
 *   full pass rides docs/demo-beats-recut-2026-10-29.md's §"Where letter +
 *   presence land in the money beat" (SHIPPED 2026-10-30: the arc asserts the
 *   letter-state 64 mid-pass, then 67 at the money state). Money state reads
 *   SP 18/25 · ES 17/30 · TP 7/20 · AR 15/15 · CC 10/10; beat-8 "5 of 7 ·
 *   First 30 days: 1 of 3 done"; admin reads the same
 *   live numbers. (The beat-9 trajectory/provenance selectors were deleted
 *   with the retired Plan cards — see the Tier 2 port list at beat 9.) Numbers owned by `scripts/verify-fixtures.test.ts` +
 *   `lib/fixtures/neil.ts`.
 *
 * Demo inputs (round 9 college catalog): Computer & IT track · "No — help
 * me figure it out" · interest quiz Kind of / Yes / Yes / Not really /
 * Not really / Kind of · cards: Choose Associate Software Developer →
 * Continue · self-report: confident for Applications Development/
 * Applications Support/Agile/Data Design SQL/Business Needs/Enabling
 * bundle, "Not yet" for Secure-coding/Linux-deployment · framing Okay/Room
 * to grow/Strong · COMPETENCY INSTRUMENT (lib/fixtures/instrument.ts):
 * 28 self-ratings (5/4/4/5 verified four, 3/2/3/4 claimed three) + 14
 * checks — both correct on Communication/Critical Thinking/Teamwork/
 * Technology, the misses on the doc's best-distractor traps → "4 of 7
 * competencies verified." (server-graded, latest full attempt) ·
 * verification quiz: SQL-design + Business Needs CORRECT
 * (bank index 0), other three deliberately WRONG (second option) → "2 of 5".
 * Money-beat uploads: e2e/fixtures/resume-qa.pdf (the QA-targeted canon
 * resume — all checks green → AIR 100) · e2e/fixtures/cover-letter-qa.txt
 * (the canon letter — all evaluable checks green → letter 100, employer
 * field omitted) · presence declared with the LinkedIn URL + professional
 * email (stamped offline at declaration).
 *
 * Canon checks from the recovery step onward use `expect.soft` (recorded,
 * non-aborting) so a canon mismatch never hides the numbers on later beats.
 */

test.describe.serial("demo-arc", () => {
  // the walk is long (10 beats + the 42-item instrument) — never let the
  // runner's 60s default cut the money beat; hook set unchanged
  test.setTimeout(240_000);

  // clean store before the walk. (Port hygiene is handled OUTSIDE playwright:
  // a stale server on :3000 must be `fuser -k`-ed before `npx playwright test`
  // so webServer boots the current production build instead of reusing it.)
  test.beforeAll(async () => {
    await resetStore();
  });

  test.beforeEach(async () => {
    await resetStore(); // each restart of this walk reseeds canon Neil
  });

  test("beats 1–10: canon walk with the exact demo inputs", async ({ page }) => {
    const notes: string[] = [];
    const soft = expect.soft;

    // ADR 0003: every surface is session-honest — the walk runs as Neil (the
    // demo student whose canon seed lives in lib/fixtures/neil.ts). Credentials
    // come from the env; the whole walk is skipped (with a clear message)
    // when they are absent.
    const neil = neilCreds();
    test.skip(!neil.email || !neil.password, "E2E_NEIL_EMAIL / E2E_NEIL_PASSWORD unset — add them to .env.local to run the canon walk.");
    await signIn(page, neil.email, neil.password);

    // Seed fidelity: Neil's fresh canon state (NEIL_SEED, beat-5 total 40)
    // must be what the store lazily loaded for his account — before the walk
    // plays onboarding over it.
    await page.waitForURL("**/dashboard");
    const seedScore = await settled(page, ".score-big");
    expect(seedScore).toBe("40"); // NEIL_SEED → SP 19/25 · ES 17/30 · TP 0 · CC 4 = 40
    notes.push("seed fidelity: Neil's canon seed loads → dashboard reads 40 pre-walk ✓");

    /* ══════════ BEATS 1–4 · onboarding ①–④ ══════════ */

    await page.goto("/onboarding");
    // OB-1 · strand
    await page.locator(".strand-card", { hasText: "Computer & IT" }).click();
    await page.getByRole("button", { name: "Continue", exact: true }).click();

    // OB-2 · branch
    await expect(page.getByRole("heading", { name: "Do you have a career in mind?" })).toBeVisible();
    await page.locator("button", { hasText: "No — help me figure it out" }).click();

    // OB-3a · interest quiz — 6 taps (kind/strong/strong/low/low/mid)
    const interestPicks = ["Kind of", "Yes, that's me", "Yes, that's me", "Not really", "Not really", "Kind of"];
    for (const pick of interestPicks) {
      await expect(page.locator(".q-stem")).toBeVisible();
      await page.locator(".q-opts .opt", { hasText: pick }).click();
    }
    // loading micro-state (~2s) → suggestion cards
    await page.waitForSelector("text=Careers that fit how you answered", { timeout: 10_000 });
    await page.locator("button", { hasText: "Choose Associate Software Developer" }).click();
    await page.locator(".btn-hero", { hasText: "Continue with Associate Software Developer" }).click();

    // OB-3b-1 · 8-row self-report
    await expect(page.getByRole("heading", { name: "Now — where are you today?" })).toBeVisible();
    for (const n of ["Applications Development", "Applications Support", "Agile Software", "Data Design / SQL", "Business Needs", "Collaboration · Communication"]) {
      await page.locator(".skill-row", { hasText: n }).locator("button", { hasText: "I can do this" }).click();
    }
    for (const n of ["Secure-coding", "Linux + web deployment"]) {
      await page.locator(".skill-row", { hasText: n }).locator("button", { hasText: "Not yet" }).click();
    }
    await expect(page.locator(".num", { hasText: "8 of 8 answered" })).toBeVisible();
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await page.waitForTimeout(400); // let the batch POST /api/claim land

    // OB-3b-2 · framing prompt (unscored, but driven per script)
    await expect(page.getByRole("heading", { name: "One more thing — the people side." })).toBeVisible();
    await page.locator(".skill-row", { hasText: "Teamwork" }).locator("button", { hasText: "Okay" }).click();
    await page.locator(".skill-row", { hasText: "Communication" }).locator("button", { hasText: "Room to grow" }).click();
    await page.locator(".skill-row", { hasText: "Problem-solving" }).locator("button", { hasText: "Strong" }).click();
    await page.getByRole("button", { name: "Continue", exact: true }).click();

    /* ══ step ③ · THE COMPETENCY INSTRUMENT (user-approved 42-item bank) ══
       Part A: 28 Likert self-ratings → claimed-only (no verified from ratings).
       Part B: 14 one-answer situations, graded server-side — verified ⇔ BOTH
       checks correct in THIS attempt. Canon inputs: Communication (COM-2),
       Critical Thinking (COM-3), Teamwork (COM-6), Technology (COM-7) both
       correct; the three misses ride the doc's recorded best-distractor traps
       (COM-1.M1 → A the aware-yet-inactive, COM-4.M2 → A "it will be fine",
       COM-5.M2 → D the silent rewrite). Everything else correct — including
       the second check of each claimed competency — so "no partial credit"
       is honestly demonstrated: still "4 of 7 competencies verified." */
    await expect(page.getByRole("heading", { name: "The competency check — the real one." })).toBeVisible();
    await page.getByRole("button", { name: "Start the assessment" }).click();

    // Part A — 7 competency groups × 4 statements; pattern 5/4/4/5 on the
    // verified four, 3/2/3/4 on the claimed three
    const compGroups = await page.locator("[data-comp]").all();
    expect(compGroups).toHaveLength(7);
    for (let g = 0; g < compGroups.length; g++) {
      for (let s = 0; s < 4; s++) {
        const word = ["Never", "Rarely", "Sometimes", "Often", "Consistently"][(g < 4 ? [5, 4, 4, 5] : [3, 2, 3, 4])[s] - 1];
        await compGroups[g].locator(`[data-item$=".${s + 1}"] button`, { hasText: word }).click();
      }
    }
    await expect(page.locator(".num", { hasText: "28 of 28 answered" })).toBeVisible();
    await page.getByRole("button", { name: "Continue", exact: true }).click();

    // Part B — one situation at a time; the attempt POSTs once at the end
    await expect(page.getByRole("heading", { name: "Part B — the checks." })).toBeVisible();
    await page.locator("button", { hasText: "Start the checks" }).click();
    // key = correct option index per COM-x.Mn (lib/fixtures/instrument.ts);
    // the wrong ones are the recorded distractors above
    const MCQ_KEYS: Record<string, [number, number]> = {
      "COM-1": [0, 2],
      "COM-2": [2, 2],
      "COM-3": [2, 2],
      "COM-4": [2, 0],
      "COM-5": [2, 3],
      "COM-6": [2, 2],
      "COM-7": [1, 1],
    };
    for (let i = 0; i < 14; i++) {
      const pick = MCQ_KEYS[`COM-${Math.floor(i / 2) + 1}`][i % 2];
      await page.locator(".ob-mcqcard .q-opts .opt").nth(pick).click();
      await page.waitForTimeout(150);
      await page.locator(".ob-mcqcard button.btn-ghost").click(); // Next … See the result
      await page.waitForTimeout(200);
    }
    await expect(page.locator(".screen-head h1")).toContainText("4 of 7 competencies verified.");
    await expect(page.locator(".okband")).toContainText("Communication · Critical Thinking · Teamwork · Technology");
    notes.push("step 3 degree: instrument sat — '4 of 7 competencies verified.' · verified band Communication · Critical Thinking · Teamwork · Technology ✓");
    await page.getByRole("button", { name: "Continue", exact: true }).click();

    // OB-3b-3 · verification mini-quiz — "2 of 5" canon (SQL-design + Business Needs pass)
    await expect(page.getByRole("heading", { name: "Make it official — quick skill check" })).toBeVisible();
    await expect(page.locator("text=6 skills")).toBeVisible(); // 6 of 8 claimed
    await expect(page.locator("text=5 short questions")).toBeVisible();
    await page.getByRole("button", { name: "Start the check" }).click();

    for (let i = 0; i < 5; i++) {
      const skill = (await page.locator('.q-skill-tag:has-text("About:")').textContent())!.replace("About: ", "").trim();
      // bank answer index 0 is correct (app/(app)/onboarding/banks.ts); the
      // demo deliberately answers WRONG (second option) except SQL-design and Business Needs
      const pick = skill === "SQL" || skill === "Business Needs Analysis" ? 0 : 1;
      await page.locator(".q-opts .opt").nth(pick).click();
      // exact: the bank's option text may itself contain "next" ("what's
      // next, and …") — case-insensitive hasText would be a strict violation
      await page.getByRole("button", { name: "Next", exact: true }).click();
    }
    await expect(page.locator(".screen-head h1")).toContainText("2 of 5 confirmed.");
    await expect(page.locator(".okband")).toContainText("SQL");
    await expect(page.locator(".okband")).toContainText("Business Needs");
    notes.push("beat 3b result: '2 of 5 confirmed.' · confirmed band lists SQL-design · Business Needs ✓");
    // wait for BOTH per-question POST /api/verify writes to land before the
    // Continue click — the goal-set state save must not race the last verify
    await page.waitForTimeout(800);
    await page.getByRole("button", { name: "Continue", exact: true }).click();

    // OB-4 · goal — suggested card, pre-filled title
    await expect(page.getByRole("heading", { name: "Set your first goal" })).toBeVisible();
    await expect(page.locator('input[aria-label="Goal title"]')).toHaveValue("Finish the Python basics course");
    await page.getByRole("button", { name: "Set this goal" }).click();

    /* ══════════ BEAT 5 · OB-5 reveal + dashboard 40 ══════════ */

    await page.waitForSelector("text=Your starting point", { timeout: 8000 });
    await expect(page.locator(".readout-score")).toContainText("40");
    const revealTicks = (await page.locator(".tickline").allTextContents()).join(" | ");
    expect(revealTicks).toContain("19 of 25");
    expect(revealTicks).toContain("6 of 8");
    expect(revealTicks).toContain("(2 confirmed");
    expect(revealTicks).toContain("17 of 30"); // ES — the step-③ assessment receipt
    expect(revealTicks).toContain("4 of 7 NACE competencies verified");
    expect(revealTicks).toContain("Not yet measured"); // AR honest grey
    expect(revealTicks).toContain("0 of 20");
    expect(revealTicks).toContain("4 of 10");
    notes.push("beat 5 reveal: 40 · Skills 19 of 25 (6 of 8, 2 confirmed ·✓) · ES 17 of 30 · AR not yet measured · CC 4 of 10 ✓");
    await page.locator("a", { hasText: "Take me to my Dashboard" }).click();
    await page.waitForURL("**/dashboard");

    // count-up readout: poll until the on-screen number settles
    expect(await settled(page, ".score-big")).toBe("40");
    notes.push("beat 5 dashboard: .score-big reads 40 (count-up settled) ✓");

    // sub-score rows — canon beats: SP 19 · ES 17-of-30 assessment receipt · TP 0 · AR grey · CC 4
    const rows5 = (await page.locator(".sub-row").allTextContents()).map((t) => t.trim());
    expect(rows5).toHaveLength(5);
    expect(rows5[0]).toContain("19 of 25");
    expect(rows5[1]).toContain("17 of 30");
    expect(rows5[1]).toContain("4 of 7 NACE competencies verified"); // ES receipt (the assessment carries the channel)
    expect(rows5[2]).toContain("0 of 20");
    expect(rows5[3]).toContain("Not yet measured"); // AR grey
    expect(rows5[4]).toContain("4 of 10");
    await expect(page.locator(".journey-row")).toContainText("First 30 days, 0 of 3 done");
    await shot(page, "arc-40.png");
    notes.push("beat 5 dashboard sub-rows: 19 of 25 / 17 of 30 (4 of 7 verified ·✓) / 0 of 20 / AR not yet measured / 4 of 10 · journey 0 of 3 · arc-40.png ✓");

    /* ══════════ BEAT 6 · honest dip 40 → 21 → 35 ══════════ */

    await page.locator('aside a[href="/career"]').click();
    await expect(page.getByRole("heading", { name: "Your career" })).toBeVisible();
    await page.locator(".cc-switch .quiet-toggle", { hasText: "Switch career" }).click();
    await page.locator(".disclosure.show .disc-go").click();
    await expect(page.locator(".sw-banner")).toBeVisible(); // browsing banner, nothing changed yet
    // the QA row expands like every row now (user ruling 2026-11-02 — the
    // row-live special case is dead); the switch enters via the detail CTA
    await page.locator(".index-row", { hasText: "Software QA Analyst" }).first().locator(".row-name").click();
    await page.locator(".d-cta button", { hasText: "Change target role" }).click();

    // cost-first confirm — the copy lives in CareerClient.tsx (9ecb02f recut)
    await expect(page.locator("#sw-confirm h1")).toHaveText("Switch to Software QA Analyst?");
    await expect(page.locator(".sw-cost")).toContainText("Gap bars and training progress reset for the new role");
    await page.locator(".sw-actions .btn-primary").click(); // Switch to Software QA Analyst

    // honest dip — the readout says exactly what the switch costs (canon 21)
    await page.waitForSelector("#sw-reset .readout", { timeout: 8000 });
    await expect(page.locator("#sw-reset .readout-score")).toHaveText(/21\/100/);
    const dipLegend = (await page.locator("#sw-reset .readout-legend").textContent()) ?? "";
    expect(dipLegend).toContain("Skill progress 0/25"); // Wave-3 C5: full channel words, codes banned
    expect(dipLegend).toContain("Employability 17/30");
    expect(dipLegend).toContain("Training 0/20");
    expect(dipLegend).toContain("Application readiness —"); // unmeasured channel — no stale zero
    expect(dipLegend).toContain("Career direction 4/10");
    // copy lives in CareerClient.tsx (9ecb02f recut)
    await expect(page.locator("#sw-reset .readout-fit")).toContainText(
      "verified skills ·✓ and an active goal survive career-specific resets"
    );
    await shot(page, "arc-21.png");
    notes.push("beat 6 dip: reset readout 21/100 · SP 0/25 ES 17/30 TP 0/20 AR — CC 4/10 · arc-21.png ✓");

    // quick re-assessment — BUG-1 fix verified: the carried ·✓ set is persisted
    // at switch time (decisions.verifiedTransferred), so canon says Business
    // Needs Analysis shows as THE one locked row ("Confirmed ·✓ transferred"
    // — the SQL-design row is not on the QA map), the others rateable
    await expect(page.locator("#sw-reset .reassess")).toBeVisible();
    const carriedLocked = page.locator("#sw-reset .skill-row.skill-locked", { hasText: "Business Needs Analysis" });
    await expect(page.locator("#sw-reset .skill-row")).toHaveCount(7); // the QA map
    await expect(page.locator("#sw-reset .skill-row.skill-locked")).toHaveCount(1); // exactly one locked
    await expect(carriedLocked).toBeVisible();
    await expect(carriedLocked.locator(".vbadge")).toContainText("Confirmed ·✓ transferred");
    await expect(carriedLocked.locator(".choice")).toHaveCount(0); // locked out of the rating set
    notes.push("beat 6 re-assessment: Business Needs row locked 'Confirmed ·✓ transferred' (1 of 7 locked, no rating buttons) ✓");
    for (const n of ["Test Planning", "Defect management", "Applications Support and Enhancement"]) {
      await page.locator("#sw-reset .skill-row", { hasText: n }).locator("button", { hasText: "Can do" }).click();
    }
    await page.locator("button", { hasText: "See my baseline" }).click();

    await page.waitForSelector("#sw-recovered .readout", { timeout: 8000 });
    await expect(page.locator("#sw-recovered .score-from")).toHaveText("21");
    const recTo = ((await page.locator("#sw-recovered .score-to").textContent()) ?? "").trim();
    soft(recTo).toBe("35"); // canon: 21 → 35
    const recLegend = (await page.locator("#sw-recovered .readout-legend").textContent()) ?? "";
    soft(recLegend).toContain("Skill progress 14/25"); // 25 × 4/7 → 14 — Business Needs ·✓ + 3 self-claims
    expect(recLegend).toContain("Career direction 4/10"); // the plan commitment rides the switch + career picked
    const recLine = ((await page.locator("#sw-recovered .rec-line").textContent()) ?? "").replace(/\s+/g, " ");
    soft(recLine).toContain("4 of 7");
    expect(recLine).toContain("Business Needs");
    expect(recLine).toContain("transferred"); // the carried ·✓ is still in the verifiedTransferred set
    await shot(page, "arc-35.png");
    notes.push(
      `beat 6 recovered: 21 → ${recTo} (canon 35) · legend "${recLegend.replace(/\s+/g, " ")}" · line "${recLine}" · arc-35.png`
    );

    /* ══════════ BEAT 7 · the money beat — check pass 52, then the AM pass ══════════ */
    // BUG-2 fix verified: the recovered screen suggests the canon QA Training
    // goal ("Build my first test plan" — free · ~4 hours · Test Automation
    // University) via "Set this goal" (frozen POST /api/goal, idempotent); the
    // goal then appears under Progress with its check launcher, and the whole
    // check pass is driven through the real UI: recovered screen → Progress
    // goal row → CheckOverlay → 5 correct answers → 52 (SP 18/25 · TP 7/20 ·
    // CC 10/10) — then the ticket-12 AM pass takes the headline to 59.
    // Check bank (lib/fixtures/checks.ts): TESTING_CHECK answers are all
    // index 0 — the spec answers by driving the options, not the endpoint.

    // the recovered screen suggests the canon QA goal: card = "Set your next
    // goal" · "free · ~4 hours · Test Automation University" · closes the
    // Software Testing gap · "Set this goal" (the title shows on Progress)
    await expect(page.locator("#sw-recovered .nextcard h3")).toContainText("Set your next goal");
    await expect(page.locator("#sw-recovered .nextcard .n-target")).toContainText(
      "free · ~4 hours · Test Automation University"
    );
    await expect(page.locator("#sw-recovered .nextcard")).toContainText("Software Testing");
    await page.locator("#sw-recovered .nextcard button", { hasText: "Set this goal" }).click();
    await expect(page.locator("#sw-recovered .nextcard button")).toContainText("Goal set");
    notes.push("beat 7 set-goal: 'Set this goal' on the recovered screen → 'Goal set — it's on your Progress page.' ✓");

    await page.goto("/progress");
    await expect(page.getByRole("heading", { name: "Progress" })).toBeVisible();

    // the goal is on Progress, active, with its "Start the check" launcher
    const qaGoalRow = page.locator(".goal-row.active", { hasText: "Build my first test plan" });
    await expect(qaGoalRow).toBeVisible();
    await expect(page.locator(".goal-row.active", { hasText: "Finish the Python basics course" })).toBeVisible();
    await qaGoalRow.locator("button", { hasText: "Start the check" }).click();

    // CheckOverlay: intro → 5 questions, all correct → aggregate pass result
    const overlay = page.locator(".check-overlay");
    await expect(overlay).toBeVisible();
    await overlay.locator("button", { hasText: "Start the check" }).click();
    for (let i = 0; i < 5; i++) {
      await expect(overlay.locator(".q-stem")).toBeVisible();
      await overlay.locator(".q-opts .opt").nth(0).click(); // bank answer index 0 — all correct
      await overlay.locator(".check-next button").click(); // "Next" ×4, then "See results"
    }
    await expect(overlay.locator(".r-head")).toContainText("You passed — 5 of 5");
    const passBand = ((await overlay.locator(".r-band").textContent()) ?? "").replace(/\s+/g, " ");
    expect(passBand).toContain("software testing gap is closed ·✓✓");
    expect(passBand).toContain("The goal you set is done");
    await shot(page, "arc-check-pass.png");
    notes.push(`beat 7 check: overlay pass band "${passBand}" · arc-check-pass.png ✓`);
    await overlay.locator(".check-ctas button", { hasText: "Back to Progress" }).click();

    // the live record: feed row + closed gap bar + the goal auto-completed
    await page.reload();
    await expect(page.locator(".feed-row", { hasText: "Setting a foundation for successful test automation" })).toBeVisible();
    await expect(page.locator(".f-pass")).toContainText("Check passed · 5 of 5");
    await expect(page.locator(".c-gap", { hasText: "Software Testing" })).toBeVisible();
    await expect(page.locator(".prog-ctx")).toContainText("ready for Software QA Analyst");
    const doneGoal = page.locator(".goal-row.done", { hasText: "Build my first test plan" });
    await expect(doneGoal).toBeVisible();
    /* Wave-3 Pr3: the completed-goal receipt is ONE line (.g-status reads
       it — the .g-event slot retired with the doneLine/autoLine double) */
    const autoLine = ((await doneGoal.locator(".g-status").textContent()) ?? "").replace(/\s+/g, " ");
    soft(autoLine).toContain("Auto-completed");
    soft(autoLine).toContain("5 of 5 passed");
    soft(autoLine).toContain("software testing gap");
    notes.push(`beat 7 auto-complete line: "${autoLine}"`);

    /* ── BEAT 7 · Application Materials pass (ticket 12 recut — SHIPPED):
    // the plan's AR head completes its THREE per-file factors in order
    // (docs/demo-beats-recut-2026-10-29.md §"Where letter + presence land"):
    //   resume run (+7 → 59) · letter check (+5 → 64) · presence declaration
    //   (+3 → 67, Profile → Credentials) — ONLY those numbers move with them.
    // The split's live per-file proof: the row climbs 7 → 12 → 15 of 15. */

    await page.goto("/prep");
    await page.waitForSelector(".rs-upload");
    await page.locator('.rs-upload input[type="file"]').setInputFiles([path.join(process.cwd(), "e2e", "fixtures", "resume-qa.pdf")]);
    await page.waitForLoadState("load");
    await expect(page.locator(".rs-readout")).toBeVisible({ timeout: 45_000 });
    soft((await page.locator(".rs-readout-score").first().textContent()) ?? "").toContain("100");
    expect(page.locator(".rs-air-note")).toContainText("your latest run counts");
    notes.push("beat 7 AM pass ①: resume-qa.pdf ran vs Software QA Analyst → AIR 100 · resume factor 7 of 7 → 59 ✓");

    // ② · the cover-letter checker — independent upload, employer field OMITTED
    // (the demo's honest-skip live proof: the row prints the exact line and
    // the denominator drops it; role alignment runs vs Software QA Analyst)
    await page.goto("/prep#letter");
    await page.waitForSelector(".cl-upload");
    await page.locator('.cl-upload input[type="file"]').setInputFiles([path.join(process.cwd(), "e2e", "fixtures", "cover-letter-qa.txt")]);
    await page.waitForLoadState("load");
    await expect(page.locator(".cl-readout")).toBeVisible({ timeout: 45_000 });
    // the RELOADED document (readout names the new letter) before opening
    // the collapsed checks — clicks can land on the stale doc
    await expect(page.locator(".cl-readout-sub")).toContainText("cover-letter-qa.txt", { timeout: 45_000 });
    soft((await page.locator(".cl-readout .cl-readout-score").first().textContent()) ?? "").toContain("100");
    // the employer honesty row is surfaced in the Structure card (R11,
    // 2026-11-03: the "The checks" fold is gone) — read the exact skip line
    const employerRow = (await page.locator(".rs-check", { hasText: "Employer named" }).first().textContent())?.replace(/\s+/g, " ");
    expect(employerRow).toContain("not evaluated — no employer declared");
    notes.push(
      `beat 7 AM pass ②: canon letter ran (employer omitted) → letter 100 → +5 · row "${employerRow}" ✓`
    );

    /* ══════════ dashboard after the letter factor (canon 64) ══════════ */

    await page.goto("/dashboard");
    const mid = await settled(page, ".score-big");
    const midRows = (await page.locator(".sub-row").allTextContents()).map((t) => t.trim());
    expect(midRows[3]).toContain("12 of 15"); // AR — resume 7 + letter 5; presence not declared yet
    expect(midRows[3]).toContain("letter 5/5"); // the letter factor's own receipt
    expect(midRows[3]).toContain("presence not declared"); // the third factor still grey
    const midPlan = (await page.locator(".plan-table").innerText()).replace(/\s+/g, " ");
    expect(midPlan).toContain("Get your application materials ready"); // 2 of 3 measured — still queued
    expect(midPlan).toContain("presence open");
    soft(mid).toBe("64"); // canon: check pass 52 + resume 7 + letter 5
    await shot(page, mid === "64" ? "arc-64.png" : "arc-bug-letter-state.png");
    notes.push(
      `beat 7 dashboard after the letter: ${mid} (canon 64 · 52 + 7 + 5) · AR row "${midRows[3].match(/You hold (.+?);/)?.[1] ?? midRows[3]}" · plan task still queued with presence open · ${mid === "64" ? "arc-64.png" : "arc-bug-letter-state.png"}`
    );

    // ③ · presence declaration — Profile → Credentials, the fourth kind
    await page.goto("/profile");
    await page.waitForSelector("#tab-profile");
    await page.locator("#tab-profile").click();
    await expect(page.locator("#panel-profile")).toBeVisible(); // tab chrome unhidden (hydration-safe)
    await page.locator("#p-url").fill("https://www.linkedin.com/in/neil-demo");
    await page.locator("#p-email").fill("neil.demo@campus.test");
    await page.getByRole("button", { name: "Declare and stamp" }).click();
    await page.waitForLoadState("load");
    // reload re-renders server truth (the Plan tab is the default again — the
    // stamped row lives in the Profile tab: re-open and assert the record)
    await page.locator("#tab-profile").click();
    await expect(page.locator("#panel-profile")).toBeVisible();
    const presenceRow = (await page.locator("[data-presence-stamp]").textContent()) ?? "";
    expect(presenceRow).toContain("MACHINE-VERIFIED");
    const presenceSub = ((await page.locator("[data-presence-sub]").textContent()) ?? "").replace(/\s+/g, " ");
    expect(presenceSub).toContain("stamped offline");
    await shot(page, "arc-presence-stamped.png");
    notes.push(`beat 7 AM pass ③: presence declared → machine-verified offline stamp "${presenceRow}" · "${presenceSub}" · +3 · arc-presence-stamped.png ✓`);

    /* ══════════ dashboard at the money state (canon 67 — the AM pass complete) ══════════ */

    await page.goto("/dashboard");
    const money = await settled(page, ".score-big");
    const moneyRows = (await page.locator(".sub-row").allTextContents()).map((t) => t.trim());
    soft(moneyRows[0]).toContain("18 of 25"); // SP — canon (25×5/7)
    expect(moneyRows[1]).toContain("17 of 30"); // ES — the assessment state carries through
    expect(moneyRows[1]).toContain("4 of 7 NACE competencies verified");
    soft(moneyRows[2]).toContain("7 of 20"); // TP 20×1/3 → 7 — canon
    soft(moneyRows[2]).toContain("First 30 days: 1 of 3 done");
    expect(moneyRows[3]).toContain("15 of 15"); // AR — ALL THREE factors measured (the LOCKED 15 riding)
    expect(moneyRows[3]).toContain("presence 3/3"); // the stamped declaration's receipt
    expect(moneyRows[3]).not.toContain("not run"); // nothing left grey in the channel
    soft(moneyRows[4]).toContain("10 of 10"); // canon CC — first item done tick
    const moneyPlan = (await page.locator(".plan-table").innerText()).replace(/\s+/g, " ");
    expect(moneyPlan).not.toContain("Get your application materials ready"); // completed OUT of the queue
    soft(money).toBe("67"); // canon headline: check pass 52 + AR 15 (7 + 5 + 3)
    await shot(page, money === "67" ? "arc-67.png" : "arc-bug-money-state.png");
    notes.push(
      `beat 7 dashboard money state: score reads ${money} (canon 67 · 52 + AR 15) · sub-rows "${moneyRows.map((r) => r.match(/You hold (.+?);/)?.[1] ?? r).join(" / ")}" · ` +
        `plan task completed out of the queue · ${money === "67" ? "arc-67.png" : "arc-bug-money-state.png"}`
    );

    /* ══════════ BEAT 8 · pathway glance ══════════ */
    /* Tier 2d selector ports (2026-11-02 merge: Plan | Resources — one
       table over the whole skill universe). Port list, old → new:
       - `#panel-steps .lead-mono`               → `#panel-plan .lead-mono`
         (counter text is `{closed} of {mapSize} skills checked`; the
         "First 30 days: X of Y done" furniture died with the stage
         queue — the assertion that read it is DELETED, not replaced)
       - `.stagepanel .qrow .q-skill`            → `#panel-plan .plan-row:not(.closed-row) .q-skill`
         (stage panel + qrow died; `.plan-row` is the stable row class,
         `.q-skill` name kept; the closed rows ride `.closed-row` dimmed)
       - `#panel-gaps` refs                      → n/a (no refs existed in specs;
         closed/verified facts read via the Plan panel instead)
       - dead-furniture assertions (accordion counts, stage endnotes) were
         deleted rather than re-invented. No new assertions. */
    /* Tier 2b selector ports (2026-11-02 band register unification + signed
       content). Sweep result, old → new:
       - "See your gaps →" (careers band .cta)   → "Open your plan →" (label
         only; the a.cta selector itself was NOT asserted in any spec)
       - "Continue your plan →" (profile band .cta) → "Open your plan →"
         (no spec asserted it)
       - "Open Pathway →" (progress band .btn-primary) → "Open your plan →"
         on a.cta (no spec asserted it)
       - `.band .who .m` (dashboard, credential-audit) — content unchanged
         ({career} name), no port
       - `.band-id` (profile, beat 9), `.cc-switch .quiet-toggle`/"Switch
         career", heading "Your career"/"Progress", `.scoreband`, `.planband`
         wrappers — all unchanged; no port. No dead-furniture assertions
         found to delete. */
    await page.goto("/pathway");
    const lead = ((await page.locator("#panel-plan .lead-mono").textContent()) ?? "").replace(/\s+/g, " ");
    soft(lead).toContain("5 of 7"); // canon: 5 of 7 skills checked
    const queue = (await page.locator("#panel-plan .plan-row:not(.closed-row) .q-skill").allTextContents()).map((s) => s.trim());
    soft(queue).toEqual([
      "Quality Assurance / Quality Standards",
      "Customer Orientation · Digital Fluency · Learning Agility · Sense Making · Problem Solving (Enabling)",
    ]); // open rows first (steps-engine ranked order) — canon
    expect(lead).not.toContain("Software Testing"); // closed ·✓✓, off the context line
    notes.push(`beat 8 pathway: lead "${lead}" · open rows (ranked) ${JSON.stringify(queue)}`);

    /* ══════════ BEAT 9 · profile ══════════ */

    /* Plan-tab retirement ports (2026-11-03 user ruling: the Goals card +
       the Plan pill deleted — tabs collapse to Competencies | Credentials |
       Account, default = Competencies). Sweep result, old → new:
       - `#panel-plan` visible-at-arrival → `#panel-competencies` (the new
         default tab; the Plan panel is GONE, not hidden)
       - planText not-contains "Test Planning" (the retired Goals table was
         the summary-only surface) → DELETED — no replacement (the band's
         Target line + the Pathway Plan panel carry that truth now)
       - `.band-id` "Target: …" → `.band .who .m` "Target: …" (2026-11-03
         revamp: the band rides Dashboard's recipe — the persona line died,
         the Target line is the .who .m row; ported in the same change)
       - `#tab-profile` → `#panel-profile` (Credentials) and `#tab-account`
         hooks — unchanged (the legacy-id contract survives). */
    await page.goto("/profile");
    await expect(page.locator("#panel-competencies")).toBeVisible(); // Competencies is the default tab
    const bandId = ((await page.locator(".band .who .m").textContent()) ?? "").replace(/\s+/g, " ");
    expect(bandId).toContain("Target: Software QA Analyst");
    /* Tier 2 build selector ports (2026-11-03 user calls: the Plan tab's
       "Pathway stages" + "Score trajectory" cards, the page footer, and the
       tab kickers deleted — the band's five-channel segbar is the live
       state). Sweep result, old → new:
       - `.traj-rows .trow` (setup/40 → 67 trajectory points) → DELETED —
         no replacement (the card retired ENTIRELY; trajectory.ts survives
         unused — the live numbers own the band now)
       - `.prov` (the provenance trio) → DELETED — no replacement
       - "0 OF 8 CLOSED"/"N COUNTED" kickers, `.pro-foot`/`Profile report`,
         the stage rows/"First 30 days" card — not asserted in any spec; no
         port, no new assertions. The beat-7 dashboard sub-rows (`First 30
         days: 1 of 3 done`) are the DASHBOARD's surface — untouched. */

    /* ══════════ BEAT 10 · admin close ══════════ */

    // the admin surface is session-guarded (proxy.ts) — sign in through the
    // (single, role-less) form; the account's own role redirects to /admin.
    // The counselor persona is Ana Villanueva (ana.villanueva@<cohort-domain>).
    await signIn(page, cohortEmail("adviser"), DEMO_PASSWORD);
    await page.waitForURL("**/admin");

    await page.goto("/admin");
    const demoRow = page.locator(".s-row.row-demo");
    await expect(demoRow.locator(".s-career")).toHaveText("Software QA Analyst"); // career survives the switch ✓
    const cohortScore = ((await demoRow.locator(".s-score").textContent()) ?? "").trim();
    soft(cohortScore).toBe("67"); // canon: the live cohort row reads 67 (check pass + the full AR pass)
    await page.goto("/admin/student?student=neil");
    const adminScore = await settled(page, ".dt-score [data-count]");
    soft(adminScore).toBe("67");
    const ss = (await page.locator(".ss-row").allTextContents()).map((t) => t.replace(/\s+/g, " ").trim());
    soft(ss[0]).toContain("18 of 25"); // SP — canon
    expect(ss[1]).toContain("17 of 30"); // ES — assessment receipt
    expect(ss[1]).toContain("4 of 7 competencies verified");
    expect(ss[2]).toContain("7 of 20"); // TP 1 of 3 — canon holds
    expect(ss[3]).toContain("15 of 15"); // AR — all three factors measured (resume ✓ letter ✓ presence ✓)
    expect(ss[3]).toContain("letter 5/5");
    expect(ss[3]).toContain("presence 3/3");
    soft(ss[4]).toContain("10 of 10"); // CC — canon
    await shot(page, "arc-admin.png");
    notes.push(`beat 10 admin: cohort row ${cohortScore} · student readout ${adminScore} · rubric ["${ss[0]}", "${ss[1]}", "${ss[2]}", "${ss[3]}", "${ss[4]}"] · arc-admin.png`);

    // eslint-disable-next-line no-console
    console.log("\n=== demo-arc walk notes ===\n" + notes.map((n) => `• ${n}`).join("\n"));
  });
});
