import { test } from "@playwright/test";
import fs from "node:fs";

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
  fs.rmSync("data/state.json", { force: true });
  await page.goto("/");
  await page.waitForTimeout(6000); // landing motion: count-ups, scanline
  await page.goto("/signup");
  await page.waitForTimeout(1500);
  await page.goto("/onboarding");
  await page.waitForTimeout(1000);
  await page.click('button:has-text("STEM")');
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
  await page.click('button:has-text("Choose Software Developer")');
  await page.waitForTimeout(500);
  await page.click('button:has-text("Continue with Software Developer")');
  await page.waitForTimeout(600);
  for (const row of await page.locator(".skill-row").all()) {
    const name = (await row.textContent()) || "";
    const chip = /Programming logic|Git|Debugging|SQL|Agile teamwork|Technical documentation/.test(name) ? "I can do this" : "Not yet";
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
  await page.click('button:has-text("Start the check")');
  await page.waitForTimeout(800);
  const pass = ["SQL", "Git"];
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
  await page.click('.index-row:has-text("Data Analyst")');
  await page.waitForSelector('button:has-text("Switch to Data Analyst")', { timeout: 12000 });
  await page.click(':is(a, button):has-text("Switch to Data Analyst")');
  await page.waitForTimeout(2400);
  await page.evaluate(() => {
    const sec = document.querySelector("#sw-reset");
    if (!sec) return;
    const walk = (el: Element) => {
      for (const child of el.children) {
        const btns = Array.from(child.querySelectorAll(":scope > button"));
        if (btns.length === 3) {
          const label = child.textContent || "";
          const want = /Spreadsheets|Data cleaning|Basic statistics/i.test(label) ? "Can do" : "Not yet";
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
  await page.screenshot({ path: "/tmp/opencode/screenshots/record-51.png" });
  // beat 8-10
  await page.goto("/pathway");
  await page.waitForTimeout(2600);
  await page.goto("/profile");
  await page.waitForTimeout(2600);
  // /admin is session-guarded (proxy.ts): sign in as admin through the form
  await page.goto("/signin");
  await page.locator("#f-email").fill("admin@demo.ph");
  await page.locator("#f-pass").fill("readiness");
  await page.click('button:has-text("Sign in")');
  await page.waitForURL("**/admin");
  await page.goto("/admin");
  await page.waitForTimeout(2400);
  await page.goto("/dashboard");
  await page.waitForTimeout(3200);
  fs.rmSync("data/state.json", { force: true }); // leave the store canon-seeded
});
