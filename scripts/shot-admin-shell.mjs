import { chromium } from "@playwright/test";
// Round-1 (shell chrome) review captures: sysadmin /admin at the three
// review widths. Cohort tab at every width; Approvals + the Audit toggle
// at 1440 to show both role landing states. Viewport shots (NOT fullPage —
// the fixed-rail stitch artifact rides fullPage).
const base = "http://localhost:3111";
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
const page = await ctx.newPage();
await page.goto(`${base}/signin`, { waitUntil: "networkidle" });
await page.fill("#f-email", process.env.SEED_SYSADMIN_EMAIL ?? "");
await page.fill("#f-pass", process.env.SEED_PASSWORD ?? "");
await page.click("#signin-form button[type=submit]");
await page.waitForURL((u) => !u.pathname.includes("signin"), { timeout: 20000 });

await page.goto(`${base}/admin`, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);

// 1440: cohort (computational tab) + approvals (sysadmin landing)
const cohortBtn = page.locator('button:has-text("Cohort")').first();
if ((await cohortBtn.count()) > 0) {
  await cohortBtn.click();
  await page.waitForTimeout(900);
  await page.screenshot({ path: ".impeccable/review/admin-shell-cohort-1440.png" });
  console.log("✓ cohort 1440");
}
const apprBtn = page.locator('button:has-text("Approvals")').first();
if ((await apprBtn.count()) > 0) {
  await apprBtn.click();
  await page.waitForTimeout(900);
  await page.screenshot({ path: ".impeccable/review/admin-shell-approvals-1440.png" });
  console.log("✓ approvals 1440");
}

for (const w of [720, 390]) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.waitForTimeout(700);
  // land on cohort for the mobile shots
  const c = page.locator('button:has-text("Cohort")').first();
  if ((await c.count()) > 0) {
    await c.click();
    await page.waitForTimeout(900);
  }
  await page.screenshot({ path: `.impeccable/review/admin-shell-cohort-${w}.png` });
  console.log(`✓ cohort ${w}`);
}

await browser.close();
