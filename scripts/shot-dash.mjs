import { chromium } from "@playwright/test";
const base = "http://localhost:3111";
const browser = await chromium.launch();
for (const [w, h, tag] of [[1440, 900, "1440"], [390, 844, "390"]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(`${base}/signin`, { waitUntil: "networkidle" });
  await page.fill("#f-email", process.env.E2E_NEIL_EMAIL ?? "");
  await page.fill("#f-pass", process.env.E2E_NEIL_PASSWORD ?? "");
  await page.click("#signin-form button[type=submit]");
  await page.waitForURL(/dashboard|onboarding|admin/, { timeout: 20000 });
  await page.goto(`${base}/dashboard`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const path = `.impeccable/review/v9-dash-rhythm-${tag}.png`;
  await page.screenshot({ path, fullPage: true });
  console.log(`✓ ${path}`);
  await ctx.close();
}
await browser.close();
