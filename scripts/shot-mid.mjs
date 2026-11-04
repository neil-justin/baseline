import { chromium } from "@playwright/test";
const base = "http://localhost:3111";
const browser = await chromium.launch();
for (const [route, w, tag] of [["/dashboard", 1024, "dash-1024"], ["/career", 1200, "career-1200"]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(`${base}/signin`, { waitUntil: "networkidle" });
  await page.fill("#f-email", process.env.E2E_NEIL_EMAIL ?? "");
  await page.fill("#f-pass", process.env.E2E_NEIL_PASSWORD ?? "");
  await page.click("#signin-form button[type=submit]");
  await page.waitForURL(/dashboard|onboarding|admin/, { timeout: 20000 });
  await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `.impeccable/review/sweep-${tag}.png`, fullPage: true });
  console.log(`✓ sweep-${tag}.png`);
  await ctx.close();
}
await browser.close();
