import { test, expect } from "@playwright/test";
import { resetStore, settled, shot, signIn, cohortEmail, DEMO_PASSWORD, neilCreds } from "./helpers";

/**
 * Demo-arc E2E — one walk, beats 1–10 (plan Task 15).
 * Canon: ADR 0002 (amended 2026-10-29) five-channel re-lock.
 *   setup 40 → switch dip 21 → post-re-assessment 35 → money shot 52
 *   (SP 18/25 · ES 17/30 · TP 7/20 · CC 10/10; AR sits out unmeasured);
 *   beat-8 "5 of 7 · First 30 days: 1 of 3 done"; trajectory 40 → 52; admin
 *   reads the same live numbers. Numbers owned by
 *   `scripts/verify-fixtures.test.ts` + `lib/fixtures/neil.ts`.
 *
 * Demo inputs (round 9 college catalog): Computer & IT track · "No — help
 * me figure it out" · interest quiz Kind of / Yes / Yes / Not really /
 * Not really / Kind of · cards: Choose Associate Software Developer →
 * Continue · self-report: confident for Applications Development/
 * Applications Support/Agile/Data Design SQL/Business Needs/Enabling
 * bundle, "Not yet" for Secure-coding/Linux-deployment · framing Okay/Room
 * to grow/Strong · verification quiz: SQL-design + Business Needs CORRECT
 * (bank index 0), other three deliberately WRONG (second option) → "2 of 5".
 *
 * Canon checks from the recovery step onward use `expect.soft` (recorded,
 * non-aborting) so a canon mismatch never hides the numbers on later beats.
 */

test.describe.serial("demo-arc", () => {
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

    await page.locator('header a[href="/career"]').click();
    await expect(page.getByRole("heading", { name: "Your career" })).toBeVisible();
    await page.locator(".cc-switch .quiet-toggle", { hasText: "Switch career" }).click();
    await page.locator(".disclosure.show .disc-go").click();
    await expect(page.locator(".sw-banner")).toBeVisible(); // browsing banner, nothing changed yet
    await page.locator(".row-live").first().click(); // the live switch target: Software QA Analyst

    // cost-first confirm
    await expect(page.locator("#sw-confirm h1")).toHaveText("Switch to Software QA Analyst?");
    await expect(page.locator(".sw-cost")).toContainText("resets skill progress and training progress");
    await page.locator(".sw-actions .btn-primary").click(); // Switch to Software QA Analyst

    // honest dip — the readout says exactly what the switch costs (canon 21)
    await page.waitForSelector("#sw-reset .readout", { timeout: 8000 });
    await expect(page.locator("#sw-reset .readout-score")).toHaveText(/21\/100/);
    const dipLegend = (await page.locator("#sw-reset .readout-legend").textContent()) ?? "";
    expect(dipLegend).toContain("SP 0/25");
    expect(dipLegend).toContain("ES 17/30");
    expect(dipLegend).toContain("TP 0/20");
    expect(dipLegend).toContain("AR —"); // unmeasured channel — no stale zero
    expect(dipLegend).toContain("CC 4/10");
    await expect(page.locator("#sw-reset .readout-fit")).toContainText("The 21 that stays is competencies and career direction");
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
    soft(recLegend).toContain("SP 14/25"); // 25 × 4/7 → 14 — Business Needs ·✓ + 3 self-claims
    expect(recLegend).toContain("CC 4/10"); // the plan commitment rides the switch + career picked
    const recLine = ((await page.locator("#sw-recovered .rec-line").textContent()) ?? "").replace(/\s+/g, " ");
    soft(recLine).toContain("4 of 7");
    expect(recLine).toContain("Business Needs");
    expect(recLine).toContain("transferred"); // the carried ·✓ is still in the verifiedTransferred set
    await shot(page, "arc-35.png");
    notes.push(
      `beat 6 recovered: 21 → ${recTo} (canon 35) · legend "${recLegend.replace(/\s+/g, " ")}" · line "${recLine}" · arc-35.png`
    );

    /* ══════════ BEAT 7 · the money shot — set the goal, pass the check, 51 ══════════ */
    // BUG-2 fix verified: the recovered screen suggests the canon QA Training
    // goal ("Build my first test plan" — free · ~4 hours · Test Automation
    // University) via "Set this goal" (frozen POST /api/goal, idempotent); the
    // goal then appears under Progress with its check launcher, and the whole
    // money shot is driven through the real UI: recovered screen → Progress
    // goal row → CheckOverlay → 5 correct answers → 52 (SP 18/25 · TP 7/20 ·
    // CC 10/10; the plan's first item done ticks CC — My Plan Q4b).
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
    expect(passBand).toContain("software testing gap is closed ✓✓");
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
    const autoLine = ((await doneGoal.locator(".g-event").textContent()) ?? "").replace(/\s+/g, " ");
    soft(autoLine).toContain("Auto-completed");
    soft(autoLine).toContain("(5 of 5)");
    soft(autoLine).toContain("software testing gap");
    notes.push(`beat 7 auto-complete line: "${autoLine}"`);

    /* ══════════ dashboard at the money state (canon 52) ══════════ */

    await page.goto("/dashboard");
    const money = await settled(page, ".score-big");
    const moneyRows = (await page.locator(".sub-row").allTextContents()).map((t) => t.trim());
    soft(moneyRows[0]).toContain("18 of 25"); // SP — canon (25×5/7)
    expect(moneyRows[1]).toContain("17 of 30"); // ES — the assessment state carries through
    expect(moneyRows[1]).toContain("4 of 7 NACE competencies verified");
    soft(moneyRows[2]).toContain("7 of 20"); // TP 20×1/3 → 7 — canon
    soft(moneyRows[2]).toContain("First 30 days: 1 of 3 done");
    expect(moneyRows[3]).toContain("Not yet measured"); // AR — the walk never visits Prep
    soft(moneyRows[4]).toContain("10 of 10"); // canon CC — first item done tick
    soft(money).toBe("52"); // canon headline, crosses 50 live
    await shot(page, money === "52" ? "arc-52.png" : "arc-bug-money-state.png");
    notes.push(
      `beat 7 dashboard: score reads ${money} (canon 52) · sub-rows "${moneyRows.map((r) => r.match(/You hold (.+?);/)?.[1] ?? r).join(" / ")}" · ` +
        `${money === "52" ? "arc-52.png" : "arc-bug-money-state.png"}`
    );

    /* ══════════ BEAT 8 · pathway glance ══════════ */

    await page.goto("/pathway");
    const lead = ((await page.locator("#panel-steps .lead-mono").textContent()) ?? "").replace(/\s+/g, " ");
    soft(lead).toContain("5 of 7"); // canon: 5 of 7 skills checked
    expect(lead).toContain("First 30 days: 1 of 3 done"); // 1 of 3 — canon holds
    const queue = (await page.locator(".stagepanel .qrow .q-skill").allTextContents()).map((s) => s.trim());
    soft(queue).toEqual([
      "Quality Assurance / Quality Standards",
      "Customer Orientation · Digital Fluency · Learning Agility · Sense Making · Problem Solving (Enabling)",
    ]); // remaining stage-① queue — canon
    expect(lead).not.toContain("Software Testing"); // closed ·✓✓, off the context line
    notes.push(`beat 8 pathway: lead "${lead}" · stage-① queue ${JSON.stringify(queue)}`);

    /* ══════════ BEAT 9 · profile Plan tab ══════════ */

    await page.goto("/profile");
    await expect(page.locator("#panel-plan")).toBeVisible(); // Plan is the default tab
    const planText = ((await page.locator("#panel-plan").innerText()) ?? "").replace(/\s+/g, " ");
    expect(planText).toContain("Software QA Analyst");
    expect(planText).not.toContain("Test Planning"); // summary only — NEVER the ranked list
    const trajRows = (await page.locator(".traj-rows .trow").allTextContents()).map((t) => t.replace(/\s+/g, " ").trim());
    expect(trajRows.join(" ")).toContain("40"); // setup point — canon holds
    soft(trajRows.join(" ")).toContain("52"); // canon end point
    const prov = ((await page.locator(".prov").textContent()) ?? "").replace(/\s+/g, " ");
    expect(prov).toContain("1 gap bar closed");
    expect(prov).toContain("1 comprehension check passed");
    soft(prov).toContain("1 training goal completed"); // canon provenance trio
    notes.push(`beat 9 plan: trajectory [${trajRows.join(" | ")}] · provenance "${prov}" · Plan shows no ranked list ✓`);

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
    soft(cohortScore).toBe("52"); // canon: the live cohort row reads 52
    await page.goto("/admin/student?student=neil");
    const adminScore = await settled(page, ".dt-score [data-count]");
    soft(adminScore).toBe("52");
    const ss = (await page.locator(".ss-row").allTextContents()).map((t) => t.replace(/\s+/g, " ").trim());
    soft(ss[0]).toContain("18 of 25"); // SP — canon
    expect(ss[1]).toContain("17 of 30"); // ES — assessment receipt
    expect(ss[1]).toContain("4 of 7 competencies verified");
    expect(ss[2]).toContain("7 of 20"); // TP 1 of 3 — canon holds
    expect(ss[3]).toContain("not yet measured"); // AR — honest grey
    soft(ss[4]).toContain("10 of 10"); // CC — canon
    await shot(page, "arc-admin.png");
    notes.push(`beat 10 admin: cohort row ${cohortScore} · student readout ${adminScore} · rubric ["${ss[0]}", "${ss[1]}", "${ss[2]}", "${ss[3]}", "${ss[4]}"] · arc-admin.png`);

    // eslint-disable-next-line no-console
    console.log("\n=== demo-arc walk notes ===\n" + notes.map((n) => `• ${n}`).join("\n"));
  });
});
