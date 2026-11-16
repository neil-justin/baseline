// Recapture public/shots for the marketing page (landing refresh, 2026-11-06).
// Signs in as the primary E2E student (canon demo seed) and captures the four
// feature views at the 1440×900 viewport the landing frame expects.
//   node --env-file=.env.local scripts/shot-landing-shots.mjs [baseURL]
import { chromium } from "@playwright/test";
const base = process.argv[2] ?? "http://localhost:3111";
const pages = [
  ["dashboard", "/dashboard"],
  ["career", "/career"],
  ["pathway", "/pathway"], // the D2 walk — My Plan's successor
  ["prep", "/prep"],
];
const browser = await chromium.launch();
for (const [name, route] of pages) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto(`${base}/signin`, { waitUntil: "networkidle" });
  await page.fill("#f-email", process.env.E2E_PRIMARY_STUDENT_EMAIL ?? "");
  await page.fill("#f-pass", process.env.E2E_PRIMARY_STUDENT_PASSWORD ?? "");
  await page.click("#signin-form button[type=submit]");
  await page.waitForURL(/dashboard|onboarding|admin/, { timeout: 20000 });
  await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const path = `public/shots/${name}.png`;
  // pathway is a long scroll — viewport crop keeps the shot frame-consistent
  await page.screenshot({ path, fullPage: name !== "pathway" });
  console.log(`✓ ${path}`);
  await ctx.close();
}
await browser.close();
