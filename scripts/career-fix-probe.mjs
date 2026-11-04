/**
 * Probe: no .chip in a .skill-chips strip may exceed the rolecard's right
 * edge. Runs at 1440 / 960 / 390 with the current row expanded.
 */
import { chromium } from "@playwright/test";

const base = "http://localhost:3111";
const browser = await chromium.launch();

for (const [w, h] of [[1440, 900], [960, 900], [390, 844]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(`${base}/signin`, { waitUntil: "networkidle" });
  await page.fill("#f-email", process.env.E2E_NEIL_EMAIL ?? "");
  await page.fill("#f-pass", process.env.E2E_NEIL_PASSWORD ?? "");
  await page.click("#signin-form button[type=submit]");
  await page.waitForURL(/dashboard|onboarding|admin/, { timeout: 20000 });
  await page.goto(`${base}/career`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const currentRow = page.locator(".index-row", { has: page.locator(".chip.c-blue") }).first();
  await currentRow.locator(".row-name").click();
  await page.waitForTimeout(400);
  const result = await page.evaluate(() => {
    const card = document.querySelector(".rolecard").getBoundingClientRect();
    const chips = [...document.querySelectorAll(".skill-chips .chip")];
    const band = document.querySelector(".band-ledger").getBoundingClientRect();
    const chipOverflows = chips.filter((c) => {
      const r = c.getBoundingClientRect();
      return r.right > card.right + 0.5 || r.left < card.left - 0.5;
    });
    const bandOverflows = [...document.querySelectorAll(".bandcells .chip")].filter((c) => {
      const r = c.getBoundingClientRect();
      return r.right > band.right + 0.5;
    });
    return {
      chipCount: chips.length,
      chipOverflows: chipOverflows.length,
      bandChipOverflows: bandOverflows.length,
      cardRight: Math.round(card.right),
      worstRight: Math.round(Math.max(...chips.map((c) => c.getBoundingClientRect().right))),
    };
  });
  console.log(`${w}:`, JSON.stringify(result));
  await ctx.close();
}

await browser.close();
