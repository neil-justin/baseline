import { chromium } from "@playwright/test";
const base = "http://localhost:3111";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const page = await ctx.newPage();
await page.goto(`${base}/signin`, { waitUntil: "networkidle" });
await page.fill("#f-email", process.env.E2E_NEIL_EMAIL ?? "");
await page.fill("#f-pass", process.env.E2E_NEIL_PASSWORD ?? "");
await page.click("#signin-form button[type=submit]");
await page.waitForURL(/dashboard|onboarding|admin/, { timeout: 20000 });
for (let attempt = 1; attempt <= 15; attempt++) {
  await page.goto(`${base}/pathway`, { waitUntil: "commit" });
  try {
    await page.waitForSelector(".v7plan[role=status]", { timeout: 1500 });
    await page.waitForTimeout(120);
    await page.screenshot({ path: ".impeccable/review/v9-pathway-skeleton.png" });
    console.log(`✓ skeleton captured on attempt ${attempt}`);
    await browser.close();
    process.exit(0);
  } catch { /* real page beat us — retry */ }
}
console.log("✗ skeleton never caught");
await browser.close();
process.exit(1);
