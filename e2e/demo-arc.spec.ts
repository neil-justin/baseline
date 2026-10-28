import { test, expect } from "@playwright/test";
import { resetStore, settled, shot, signIn, cohortEmail, DEMO_PASSWORD, neilCreds } from "./helpers";

/**
 * Demo-arc E2E — one walk, beats 1–10 (plan Task 15).
 * Canon: `.scratch/career-readiness-platform/features/content/_fixture-math.md`.
 *   setup 40 → switch dip 10 → post-re-assessment 33 → money shot 51
 *   (SP 29 / TP 7 / CC 15); beat-8 "5 of 7 · First 30 days: 1 of 3 done";
 *   trajectory 40 → 51; admin reads the same live numbers.
 *
 * Demo inputs (onboarding.md demo fixture): STEM · "No — help me figure it
 * out" · interest quiz Kind of / Yes / Yes / Not really / Not really / Kind
 * of · cards: Choose Software Developer → Continue · self-report: confident
 * for Programming logic/SQL/Git/Debugging/Agile teamwork/Technical
 * documentation, "Not yet" for API basics/Unit testing · framing Okay/Room
 * to grow/Strong · verification quiz: SQL + Git CORRECT (bank index 0),
 * other three deliberately WRONG (second option) → aggregate "2 of 5".
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
    expect(seedScore).toBe("40"); // NEIL_SEED → SP 30/40 · ES 0 · TP 0 · CC 10 = 40
    notes.push("seed fidelity: Neil's canon seed loads → dashboard reads 40 pre-walk ✓");

    /* ══════════ BEATS 1–4 · onboarding ①–④ ══════════ */

    await page.goto("/onboarding");
    // OB-1 · strand
    await page.locator(".strand-card", { hasText: "STEM" }).click();
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
    await page.locator("button", { hasText: "Choose Software Developer" }).click();
    await page.locator(".btn-hero", { hasText: "Continue with Software Developer" }).click();

    // OB-3b-1 · 8-row self-report
    await expect(page.getByRole("heading", { name: "Now — where are you today?" })).toBeVisible();
    for (const n of ["Programming logic", "SQL", "Git", "Debugging", "Agile teamwork", "Technical documentation"]) {
      await page.locator(".skill-row", { hasText: n }).locator("button", { hasText: "I can do this" }).click();
    }
    for (const n of ["API basics", "Unit testing"]) {
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

    // OB-3b-3 · verification mini-quiz — "2 of 5" canon (SQL + Git pass)
    await expect(page.getByRole("heading", { name: "Make it official — quick skill check" })).toBeVisible();
    await expect(page.locator("text=6 skills")).toBeVisible(); // 6 of 8 claimed
    await expect(page.locator("text=5 short questions")).toBeVisible();
    await page.getByRole("button", { name: "Start the check" }).click();

    for (let i = 0; i < 5; i++) {
      const skill = (await page.locator('.q-skill-tag:has-text("About:")').textContent())!.replace("About: ", "").trim();
      // bank answer index 0 is correct (app/(app)/onboarding/banks.ts); the
      // demo deliberately answers WRONG (second option) except SQL and Git
      const pick = skill === "SQL" || skill === "Git" ? 0 : 1;
      await page.locator(".q-opts .opt").nth(pick).click();
      await page.locator("button", { hasText: "Next" }).click();
    }
    await expect(page.locator(".screen-head h1")).toContainText("2 of 5 confirmed.");
    await expect(page.locator(".okband")).toContainText("SQL");
    await expect(page.locator(".okband")).toContainText("Git");
    notes.push("beat 3b result: '2 of 5 confirmed.' · confirmed band lists SQL · Git ✓");
    await page.waitForTimeout(300); // let the per-question POST /api/verify land
    await page.getByRole("button", { name: "Continue", exact: true }).click();

    // OB-4 · goal — suggested card, pre-filled title
    await expect(page.getByRole("heading", { name: "Set your first goal" })).toBeVisible();
    await expect(page.locator('input[aria-label="Goal title"]')).toHaveValue("Finish the Python basics course");
    await page.getByRole("button", { name: "Set this goal" }).click();

    /* ══════════ BEAT 5 · OB-5 reveal + dashboard 40 ══════════ */

    await page.waitForSelector("text=Your starting point", { timeout: 8000 });
    await expect(page.locator(".readout-score")).toContainText("40");
    const revealTicks = (await page.locator(".tickline").allTextContents()).join(" | ");
    expect(revealTicks).toContain("30 of 40");
    expect(revealTicks).toContain("6 of 8");
    expect(revealTicks).toContain("(2 confirmed");
    expect(revealTicks).toContain("0 of 20");
    expect(revealTicks).toContain("10 of 15");
    notes.push("beat 5 reveal: 40 · Skills 30 of 40 (6 of 8, 2 confirmed ·✓) · CC 10 of 15 ✓");
    await page.locator("a", { hasText: "Take me to my Dashboard" }).click();
    await page.waitForURL("**/dashboard");

    // count-up readout: poll until the on-screen number settles
    expect(await settled(page, ".score-big")).toBe("40");
    notes.push("beat 5 dashboard: .score-big reads 40 (count-up settled) ✓");

    // sub-score rows — canon beats: SP 30 · ES 0-of-25 honest line · TP 0 · CC 10
    const rows5 = (await page.locator(".sub-row").allTextContents()).map((t) => t.trim());
    expect(rows5).toHaveLength(4);
    expect(rows5[0]).toContain("30 of 40");
    expect(rows5[1]).toContain("0 of 25");
    expect(rows5[1]).toContain("full situations battery"); // ES honest line after setup
    expect(rows5[2]).toContain("0 of 20");
    expect(rows5[3]).toContain("10 of 15");
    await expect(page.locator(".journey-row")).toContainText("First 30 days, 0 of 3 done");
    await shot(page, "arc-40.png");
    notes.push("beat 5 dashboard sub-rows: 30 of 40 / 0 of 25 (full battery after setup) / 0 of 20 / 10 of 15 · journey 0 of 3 · arc-40.png ✓");

    /* ══════════ BEAT 6 · honest dip 40 → 10 → 33 ══════════ */

    await page.locator('header a[href="/career"]').click();
    await expect(page.getByRole("heading", { name: "Your career" })).toBeVisible();
    await page.locator(".cc-switch .quiet-toggle", { hasText: "Switch career" }).click();
    await page.locator(".disclosure.show .disc-go").click();
    await expect(page.locator(".sw-banner")).toBeVisible(); // browsing banner, nothing changed yet
    await page.locator(".row-live").first().click(); // the live switch target: Data Analyst

    // cost-first confirm
    await expect(page.locator("#sw-confirm h1")).toHaveText("Switch to Data Analyst?");
    await expect(page.locator(".sw-cost")).toContainText("resets skill progress and training progress");
    await page.locator(".sw-actions .btn-primary").click(); // Switch to Data Analyst

    // honest dip — the readout says exactly what the switch costs (canon 10)
    await page.waitForSelector("#sw-reset .readout", { timeout: 8000 });
    await expect(page.locator("#sw-reset .readout-score")).toHaveText(/10\/100/);
    const dipLegend = (await page.locator("#sw-reset .readout-legend").textContent()) ?? "";
    expect(dipLegend).toContain("SP 0/40");
    expect(dipLegend).toContain("ES 0/25");
    expect(dipLegend).toContain("TP 0/20");
    expect(dipLegend).toContain("CC 10/15");
    await expect(page.locator("#sw-reset .readout-fit")).toContainText("The 10 that stays is career direction");
    await shot(page, "arc-10.png");
    notes.push("beat 6 dip: reset readout 10/100 · SP 0/40 ES 0/25 TP 0/20 CC 10/15 · arc-10.png ✓");

    // quick re-assessment — BUG-1 fix verified: the carried ·✓ set is persisted
    // at switch time (decisions.verifiedTransferred), so canon says SQL shows
    // as THE one locked row here ("Confirmed ·✓ transferred"), the other 6
    // rows are rateable
    await expect(page.locator("#sw-reset .reassess")).toBeVisible();
    const sqlLocked = page.locator("#sw-reset .skill-row.skill-locked", { hasText: "SQL" });
    await expect(page.locator("#sw-reset .skill-row")).toHaveCount(7); // the DA map
    await expect(page.locator("#sw-reset .skill-row.skill-locked")).toHaveCount(1); // exactly one locked
    await expect(sqlLocked).toBeVisible();
    await expect(sqlLocked.locator(".vbadge")).toContainText("Confirmed ·✓ transferred");
    await expect(sqlLocked.locator(".choice")).toHaveCount(0); // locked out of the rating set
    notes.push("beat 6 re-assessment: SQL row locked 'Confirmed ·✓ transferred' (1 of 7 locked, no rating buttons) ✓");
    for (const n of ["Spreadsheets", "Data cleaning", "Basic statistics"]) {
      await page.locator("#sw-reset .skill-row", { hasText: n }).locator("button", { hasText: "Can do" }).click();
    }
    await page.locator("button", { hasText: "See my baseline" }).click();

    await page.waitForSelector("#sw-recovered .readout", { timeout: 8000 });
    await expect(page.locator("#sw-recovered .score-from")).toHaveText("10");
    const recTo = ((await page.locator("#sw-recovered .score-to").textContent()) ?? "").trim();
    soft(recTo).toBe("33"); // canon: 10 → 33
    const recLegend = (await page.locator("#sw-recovered .readout-legend").textContent()) ?? "";
    soft(recLegend).toContain("SP 23/40"); // 40 × 4/7 → 23 (half-down) — SQL ·✓ + 3 self-claims
    expect(recLegend).toContain("CC 10/15"); // Python goal rides the switch + decided
    const recLine = ((await page.locator("#sw-recovered .rec-line").textContent()) ?? "").replace(/\s+/g, " ");
    soft(recLine).toContain("4 of 7");
    expect(recLine).toContain("SQL");
    expect(recLine).toContain("transferred"); // SQL is still in the verifiedTransferred set
    await shot(page, "arc-33.png");
    notes.push(
      `beat 6 recovered: 10 → ${recTo} (canon 33) · legend "${recLegend.replace(/\s+/g, " ")}" · line "${recLine}" · arc-33.png`
    );

    /* ══════════ BEAT 7 · the money shot — set the goal, pass the check, 51 ══════════ */
    // BUG-2 fix verified: the recovered screen suggests the canon DA Training
    // goal ("Build my first dashboard" — free · ~4 hours · Microsoft Learn —
    // Power BI) via "Set this goal" (frozen POST /api/goal, idempotent); the
    // goal then appears under Progress with its check launcher, and the whole
    // money shot is driven through the real UI: recovered screen → Progress
    // goal row → CheckOverlay → 5 correct answers → 51 (SP 29 / TP 7 / CC 15).
    // Check bank (lib/fixtures/checks.ts): DASHBOARDS_CHECK answers are all
    // index 0 — the spec answers by driving the options, not the endpoint.

    // the recovered screen suggests the canon DA goal: card = "Set your next
    // goal" · "free · ~4 hours · Microsoft Learn — Power BI" · closes the
    // Dashboards gap · "Set this goal" (the title shows on Progress when set)
    await expect(page.locator("#sw-recovered .nextcard h3")).toContainText("Set your next goal");
    await expect(page.locator("#sw-recovered .nextcard .n-target")).toContainText(
      "free · ~4 hours · Microsoft Learn — Power BI"
    );
    await expect(page.locator("#sw-recovered .nextcard")).toContainText("Dashboards");
    await page.locator("#sw-recovered .nextcard button", { hasText: "Set this goal" }).click();
    await expect(page.locator("#sw-recovered .nextcard button")).toContainText("Goal set");
    notes.push("beat 7 set-goal: 'Set this goal' on the recovered screen → 'Goal set — it's on your Progress page.' ✓");

    await page.goto("/progress");
    await expect(page.getByRole("heading", { name: "Progress" })).toBeVisible();

    // the goal is on Progress, active, with its "Start the check" launcher
    const daGoalRow = page.locator(".goal-row.active", { hasText: "Build my first dashboard" });
    await expect(daGoalRow).toBeVisible();
    await expect(page.locator(".goal-row.active", { hasText: "Finish the Python basics course" })).toBeVisible();
    await daGoalRow.locator("button", { hasText: "Start the check" }).click();

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
    expect(passBand).toContain("dashboards gap is closed ✓✓");
    expect(passBand).toContain("The goal you set is done");
    await shot(page, "arc-check-pass.png");
    notes.push(`beat 7 check: overlay pass band "${passBand}" · arc-check-pass.png ✓`);
    await overlay.locator(".check-ctas button", { hasText: "Back to Progress" }).click();

    // the live record: feed row + closed gap bar + the goal auto-completed
    await page.reload();
    await expect(page.locator(".feed-row", { hasText: "Build your first dashboard" })).toBeVisible();
    await expect(page.locator(".f-pass")).toContainText("Check passed · 5 of 5");
    await expect(page.locator(".c-gap", { hasText: "Dashboards (Power BI)" })).toBeVisible();
    await expect(page.locator(".prog-ctx")).toContainText("ready for Data Analyst");
    const doneGoal = page.locator(".goal-row.done", { hasText: "Build my first dashboard" });
    await expect(doneGoal).toBeVisible();
    const autoLine = ((await doneGoal.locator(".g-event").textContent()) ?? "").replace(/\s+/g, " ");
    soft(autoLine).toContain("Auto-completed");
    soft(autoLine).toContain("(5 of 5)");
    soft(autoLine).toContain("dashboards gap");
    notes.push(`beat 7 auto-complete line: "${autoLine}"`);

    /* ══════════ dashboard at the money state (canon 51) ══════════ */

    await page.goto("/dashboard");
    const money = await settled(page, ".score-big");
    const moneyRows = (await page.locator(".sub-row").allTextContents()).map((t) => t.trim());
    soft(moneyRows[0]).toContain("29 of 40"); // SP — canon
    expect(moneyRows[1]).toContain("0 of 25");
    expect(moneyRows[1]).toContain("full situations battery");
    soft(moneyRows[2]).toContain("7 of 20"); // TP 20×1/3 → 7 — canon
    soft(moneyRows[2]).toContain("First 30 days: 1 of 3 done");
    soft(moneyRows[3]).toContain("15 of 15"); // canon CC — needs the completed Training goal
    soft(money).toBe("51"); // canon headline, crosses 50 live
    await shot(page, money === "51" ? "arc-51.png" : "arc-bug-money-state.png");
    notes.push(
      `beat 7 dashboard: score reads ${money} (canon 51) · sub-rows "${moneyRows.map((r) => r.match(/You hold (.+?);/)?.[1] ?? r).join(" / ")}" · ` +
        `${money === "51" ? "arc-51.png" : "arc-bug-money-state.png"}`
    );

    /* ══════════ BEAT 8 · pathway glance ══════════ */

    await page.goto("/pathway");
    const lead = ((await page.locator("#panel-steps .lead-mono").textContent()) ?? "").replace(/\s+/g, " ");
    soft(lead).toContain("5 of 7"); // canon: 5 of 7 skills checked
    expect(lead).toContain("First 30 days: 1 of 3 done"); // 1 of 3 — canon holds
    const queue = (await page.locator(".stagepanel .qrow .q-skill").allTextContents()).map((s) => s.trim());
    soft(queue).toEqual(["Chart interpretation", "Report writing"]); // remaining stage-① queue — canon
    expect(lead).not.toContain("Dashboards"); // closed ·✓✓, off the context line
    notes.push(`beat 8 pathway: lead "${lead}" · stage-① queue ${JSON.stringify(queue)}`);

    /* ══════════ BEAT 9 · profile Plan tab ══════════ */

    await page.goto("/profile");
    await expect(page.locator("#panel-plan")).toBeVisible(); // Plan is the default tab
    const planText = ((await page.locator("#panel-plan").innerText()) ?? "").replace(/\s+/g, " ");
    expect(planText).toContain("Data Analyst");
    expect(planText).not.toContain("Chart interpretation"); // summary only — NEVER the ranked list
    const trajRows = (await page.locator(".traj-rows .trow").allTextContents()).map((t) => t.replace(/\s+/g, " ").trim());
    expect(trajRows.join(" ")).toContain("40"); // setup point — canon holds
    soft(trajRows.join(" ")).toContain("51"); // canon end point
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
    await expect(demoRow.locator(".s-career")).toHaveText("Data Analyst"); // career survives the switch ✓
    const cohortScore = ((await demoRow.locator(".s-score").textContent()) ?? "").trim();
    soft(cohortScore).toBe("51"); // canon: the live cohort row reads 51
    await page.goto("/admin/student?student=neil");
    const adminScore = await settled(page, ".dt-score [data-count]");
    soft(adminScore).toBe("51");
    const ss = (await page.locator(".ss-row").allTextContents()).map((t) => t.replace(/\s+/g, " ").trim());
    soft(ss[0]).toContain("29 of 40"); // SP — canon
    expect(ss[1]).toContain("0 of 25"); // ES
    expect(ss[1]).toContain("full situations battery");
    expect(ss[2]).toContain("7 of 20"); // TP 1 of 3 — canon holds
    soft(ss[3]).toContain("15 of 15"); // CC — canon
    await shot(page, "arc-admin.png");
    notes.push(`beat 10 admin: cohort row ${cohortScore} · student readout ${adminScore} · rubric ["${ss[0]}", "${ss[1]}", "${ss[2]}", "${ss[3]}"] · arc-admin.png`);

    // eslint-disable-next-line no-console
    console.log("\n=== demo-arc walk notes ===\n" + notes.map((n) => `• ${n}`).join("\n"));
  });
});
