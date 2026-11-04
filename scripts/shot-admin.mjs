import { chromium } from "@playwright/test";
const base = "http://localhost:3111";
const TABS = ["cohort", "audit", "approvals", "accounts"];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const page = await ctx.newPage();
await page.goto(`${base}/signin`, { waitUntil: "networkidle" });
await page.fill("#f-email", process.env.SEED_SYSADMIN_EMAIL ?? "");
await page.fill("#f-pass", process.env.SEED_PASSWORD ?? "");
await page.click("#signin-form button[type=submit]");
await page.waitForURL((u) => !u.pathname.includes("signin"), { timeout: 20000 });
await page.goto(`${base}/admin`, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
for (const t of TABS) {
  const btn = page.locator(`button:has-text("${t}")`).first();
  if ((await btn.count()) === 0) { console.log(`skip ${t}`); continue; }
  await btn.click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `.impeccable/review/sweep-admin-${t}-1440.png`, fullPage: true });
  console.log(`✓ admin-${t}`);
}
await browser.close();
