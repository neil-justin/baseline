import { test } from "@playwright/test";
import fs from "node:fs";
import { signIn, cohortEmail, DEMO_PASSWORD, neilCreds } from "./helpers";

/**
 * Backup-artifact recorder — walks the full demo arc (canon inputs) with
 * Playwright video on. Produces the defense's screen-recording fallback.
 * NOT part of the acceptance suite; run explicitly: npx playwright test e2e/record.spec.ts
 */
test("record demo arc", async ({ page }) => {
  test.setTimeout(480_000); // the walk breathes with the app's measured motion
  // recorder is opt-in: run explicitly with `npx playwright test e2e/record.spec.ts`
  // (`PLAYWRIGHT_RECORD=1 npx playwright test` also activates it inside full runs)
  test.skip(!process.env.PLAYWRIGHT_RECORD && process.env.RECORD !== "1", "recorder is opt-in");
  // ADR 0003: the walk runs as Neil (session-honest pages) — /onboarding and
  // the state APIs are student-gated.
  const neil = neilCreds();
  test.skip(!neil.email || !neil.password, "E2E_NEIL_EMAIL / E2E_NEIL_PASSWORD unset — add them to .env.local to record.");
  fs.rmSync("data/state.json", { force: true });
  await signIn(page, neil.email, neil.password);
  await page.goto("/");
  await page.waitForTimeout(6000); // landing motion: count-ups, scanline
  await page.goto("/signup");
  await page.waitForTimeout(1500);
  await page.goto("/onboarding");
  await page.waitForTimeout(1000);
  await page.click('button:has-text("Computer & IT")');
  await page.click('button:has-text("Continue")');
  await page.waitForTimeout(600);
  await page.click('button:has-text("No — help me figure it out")');
  await page.waitForTimeout(500);
  const answers = ["Kind of", "Yes", "Yes", "Not really", "Not really", "Kind of"];
  for (const a of answers) {
    await page.waitForSelector(".q-opts .opt", { timeout: 10000 });
    await page.click(`.opt:has-text("${a}")`);
    await page.waitForTimeout(400);
  }
  await page.waitForTimeout(2600);
  await page.click('button:has-text("Choose Associate Software Developer")');
  await page.waitForTimeout(500);
  await page.click('button:has-text("Continue with Associate Software Developer")');
  await page.waitForTimeout(600);
  for (const row of await page.locator(".skill-row").all()) {
    const name = (await row.textContent()) || "";
    const chip = /Applications Development|Applications Support|Agile|Data Design|Business Needs|Collaboration/.test(name) ? "I can do this" : "Not yet";
    await row.locator(`button:has-text("${chip}")`).click();
  }
  await page.click('button:has-text("Continue")');
  await page.waitForTimeout(700);
  const soft = ["Okay", "Room to grow", "Strong"];
  for (let i = 0; i < 3; i++) {
    await page.locator(".skill-row, .panel .row").nth(i).locator(`button:has-text("${soft[i]}")`).first().click();
  }
  await page.click('button:has-text("Continue")');
  await page.waitForTimeout(800);
  // step ③ · the competency instrument (42 items, server-graded at the end —
  // canon pattern: verified Communication/Critical Thinking/Teamwork/Technology;
  // misses on the doc's best-distractor traps) — keep in lockstep with the
  // demo-arc walk
  await page.waitForSelector('.screen-head h1:has-text("The competency check")');
  await page.click('button:has-text("Start the assessment")');
  await page.waitForTimeout(600);
  {
    const words = ["Never", "Rarely", "Sometimes", "Often", "Consistently"];
    const groups = await page.locator("[data-comp]").all();
    for (let g = 0; g < groups.length; g++) {
      for (let s = 0; s < 4; s++) {
        const pick = (g < 4 ? [5, 4, 4, 5] : [3, 2, 3, 4])[s] - 1;
        await groups[g].locator(`[data-item$=".${s + 1}"] button:has-text("${words[pick]}")`).click();
        await page.waitForTimeout(120);
      }
    }
  }
  await page.click('button:has-text("Continue")');
  await page.waitForTimeout(500);
  await page.click('button:has-text("Start the checks")');
  const keys = {
    1: [0, 2], 2: [2, 2], 3: [2, 2], 4: [2, 0], 5: [2, 3], 6: [2, 2], 7: [1, 1],
  };
  for (let i = 0; i < 14; i++) {
    await page.waitForSelector(".ob-mcqcard", { timeout: 10000 });
    const pick = keys[Math.floor(i / 2) + 1][i % 2];
    await page.locator(".ob-mcqcard .q-opts .opt").nth(pick).click();
    await page.waitForTimeout(200);
    await page.locator(".ob-mcqcard button:has-text(\"Next\"), .ob-mcqcard button:has-text(\"See the result\")").first().click();
    await page.waitForTimeout(300);
  }
  await page.waitForSelector('.screen-head h1:has-text("competencies verified")', { timeout: 10000 });
  await page.waitForTimeout(400);
  await page.click('button:has-text("Continue")');
  await page.waitForTimeout(600);
  await page.click('button:has-text("Start the check")');
  await page.waitForTimeout(800);
  const pass = ["SQL", "Business Needs"];
  for (let i = 0; i < 5; i++) {
    await page.waitForSelector(".q-opts .opt", { timeout: 10000 });
    const about = (await page.evaluate(() => Array.from(document.querySelectorAll(".q-skill-tag")).map((t) => t.textContent).join(" "))) || "";
    const shouldPass = pass.some((p) => about.includes(p));
    const opts = await page.locator(".q-opts .opt").all();
    await opts[shouldPass ? 0 : 1].click();
    await page.waitForTimeout(500);
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(900);
  }
  await page.waitForTimeout(1200);
  await page.click('button:has-text("Continue")');
  await page.waitForTimeout(700);
  await page.click(':is(a, button):has-text("Set this goal")');
  await page.waitForTimeout(2400); // OB-5 reveal
  await page.screenshot({ path: "/tmp/opencode/screenshots/record-40.png" });
  await page.click(':is(a, button):has-text("Take me to my Dashboard")');
  await page.waitForTimeout(3200);
  // beat 6: switch
  await page.goto("/career");
  await page.waitForTimeout(1800);
  await page.click('button.quiet-toggle:has-text("Switch career")');
  await page.waitForTimeout(600);
  await page.click(".quiet-toggle.disc-go");
  await page.waitForTimeout(800);
  await page.click('.index-row:has-text("Software QA Analyst")');
  await page.waitForSelector('button:has-text("Switch to Software QA Analyst")', { timeout: 12000 });
  await page.click(':is(a, button):has-text("Switch to Software QA Analyst")');
  await page.waitForTimeout(2400);
  await page.evaluate(() => {
    const sec = document.querySelector("#sw-reset");
    if (!sec) return;
    const walk = (el: Element) => {
      for (const child of el.children) {
        const btns = Array.from(child.querySelectorAll(":scope > button"));
        if (btns.length === 3) {
          const label = child.textContent || "";
          const want = /Test Planning|Defect management|Applications Support/i.test(label) ? "Can do" : "Not yet";
          for (const b of btns) if (b.textContent.trim() === want) b.click();
        }
        walk(child);
      }
    };
    walk(sec);
  });
  await page.click(':is(a, button):has-text("See my baseline")');
  await page.waitForTimeout(2400); // recovered 33
  await page.click(':is(a, button):has-text("Set this goal")');
  await page.waitForTimeout(900);
  // beat 7 money shot
  await page.goto("/progress");
  await page.waitForTimeout(2400);
  const launchers = await page.locator('button:has-text("Start the check")').all();
  await launchers[launchers.length - 1].click();
  await page.waitForTimeout(1500);
  // the overlay opens on an intro card; its own "Start the check" enters the run
  await page.click('.check-panel button:has-text("Start the check")');
  await page.waitForTimeout(1200);
  for (let i = 0; i < 5; i++) {
    await page.waitForSelector("button.opt:visible", { timeout: 10000 });
    await page.locator("button.opt:visible").first().click();
    await page.waitForTimeout(400);
    await page.click('button:has-text("Next"), button:has-text("See results")');
    await page.waitForTimeout(700);
  }
  await page.waitForTimeout(2200);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(900);
  // ticket-12 recut, SHIPPED 2026-10-30: the money beat's Application
  // Materials pass — the resume (52 → 59), the letter check with the employer
  // field omitted (59 → 64 — the honest "not evaluated — no employer declared"
  // row), then the presence declaration in Profile → Credentials (64 → 67).
  await page.goto("/prep");
  await page.waitForSelector(".rs-upload");
  await page.setInputFiles('.rs-upload input[type="file"]', "e2e/fixtures/resume-qa.pdf");
  await page.click('button:has-text("Run the diagnostic")');
  await page.waitForSelector(".rs-readout", { timeout: 45_000 });
  await page.waitForTimeout(1200);
  await page.setInputFiles('.cl-upload input[type="file"]', "e2e/fixtures/cover-letter-qa.txt");
  await page.click('button:has-text("Run the letter check")');
  await page.waitForSelector(".cl-readout", { timeout: 45_000 });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: "/tmp/opencode/screenshots/record-64-letter.png" });
  await page.goto("/profile");
  await page.waitForTimeout(1500);
  await page.click("#tab-profile");
  await page.fill("#p-url", "https://www.linkedin.com/in/neil-demo");
  await page.fill("#p-email", "neil.demo@campus.test");
  await page.click('button:has-text("Declare and stamp")');
  await page.waitForLoadState("load");
  await page.click("#tab-profile");
  await page.waitForTimeout(900);
  await page.screenshot({ path: "/tmp/opencode/screenshots/record-presence.png" });
  await page.goto("/dashboard");
  await page.waitForTimeout(3200);
  await page.screenshot({ path: "/tmp/opencode/screenshots/record-67.png" });
  // beat 8-10
  await page.goto("/pathway");
  await page.waitForTimeout(2600);
  await page.goto("/profile");
  await page.waitForTimeout(2600);
  // /admin is session-guarded (proxy.ts): sign in as the counselor persona
  await signIn(page, cohortEmail("adviser"), DEMO_PASSWORD);
  await page.waitForURL("**/admin");
  await page.goto("/admin");
  await page.waitForTimeout(2400);
  await page.goto("/dashboard");
  await page.waitForTimeout(3200);
  fs.rmSync("data/state.json", { force: true }); // leave the store canon-seeded
});
