// Capture the two remaining surfaces (assessments, profile) for the landing.
//   node --env-file=.env.local scripts/shot-landing-extra.mjs [baseURL]
import { chromium } from "@playwright/test";
const base = process.argv[2] ?? "http://localhost:3111";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const page = await ctx.newPage();
await page.goto(`${base}/signin`, { waitUntil: "networkidle" });
await page.fill("#f-email", process.env.E2E_PRIMARY_STUDENT_EMAIL);
await page.fill("#f-pass", process.env.E2E_PRIMARY_STUDENT_PASSWORD);
await page.click("#signin-form button[type=submit]");
await page.waitForURL(/dashboard|onboarding|admin/, { timeout: 20000 });
for (const [name, route] of [["assessments", "/assessments"], ["profile", "/profile"]]) {
  await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `public/shots/${name}.png`, fullPage: false });
  console.log(`✓ public/shots/${name}.png`);
}
await browser.close();
