import { chromium } from "@playwright/test";
/** The v9 fix-round table (7 columns + pager law) at the review widths. */
const base = "http://localhost:3111";
const COUNSELOR_EMAIL = `ana.villanueva@${process.env.SEED_COHORT_DOMAIN || "campus.test"}`;
const browser = await chromium.launch();
for (const [w, h, tag] of [[1440, 900, "1440"], [720, 900, "720"], [390, 844, "390"]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(`${base}/signin`, { waitUntil: "networkidle" });
  await page.fill("#f-email", COUNSELOR_EMAIL);
  await page.fill("#f-pass", process.env.SEED_PASSWORD ?? "");
  await page.click("#signin-form button[type=submit]");
  await page.waitForURL((u) => !u.pathname.includes("signin"), { timeout: 20000 });
  await page.goto(`${base}/admin`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.locator(`button:has-text("Audit queue")`).first().click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `.impeccable/review/v9-admin-audit7-${tag}.png`, fullPage: true });
  console.log(`✓ ${tag}`);
  await ctx.close();
}
await browser.close();
