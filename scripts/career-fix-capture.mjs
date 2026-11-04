/**
 * One-off: v9.1 career fix-round evidence. Auth via the real signin form,
 * then full-page captures at 1440 / 960 / 390 with the current role's row
 * EXPANDED (the detail block is where the chip-overflow bug lived).
 * 960 is the shrunk-desktop width the user reported the bleed at.
 */
import { chromium } from "@playwright/test";

const base = "http://localhost:3111";
const outDir = ".impeccable/review";

const browser = await chromium.launch();

for (const [w, h, tag] of [
  [1440, 900, "1440"],
  [960, 900, "960"],
  [390, 844, "390"],
]) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto(`${base}/signin`, { waitUntil: "networkidle" });
  await page.fill("#f-email", process.env.E2E_NEIL_EMAIL ?? "");
  await page.fill("#f-pass", process.env.E2E_NEIL_PASSWORD ?? "");
  await page.click("#signin-form button[type=submit]");
  await page.waitForURL(/dashboard|onboarding|admin/, { timeout: 20000 });
  await page.goto(`${base}/career`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200); // fonts settle
  // expand the CURRENT row (the one the user screenshotted)
  const currentRow = page.locator(".index-row", { has: page.locator(".chip.c-blue") }).first();
  await currentRow.locator(".row-name").click();
  await page.waitForTimeout(600); // expansion + paint
  const path = `${outDir}/v9-career-fix-${tag}.png`;
  await page.screenshot({ path, fullPage: true });
  console.log(`✓ ${path}`);
  await ctx.close();
}

await browser.close();
