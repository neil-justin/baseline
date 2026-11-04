import { chromium } from "@playwright/test";
/** One-off interaction probe for the v9 fix round: the row-click detail
 *  dialog (pending + armed-reject states) and the ruled record view.
 *  Client-state only for the dialog/armed captures; the ruled capture
 *  rides a REAL verify ruling done through the dialog (store write via
 *  the app's own POST — no fixture). */
const base = "http://localhost:3111";
const COUNSELOR_EMAIL = `ana.villanueva@${process.env.SEED_COHORT_DOMAIN || "campus.test"}`;
const WIDTHS = [
  [1440, 900, "1440"],
  [390, 844, "390"],
];
const browser = await chromium.launch();
for (const [w, h, tag] of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  const done = [];
  await page.goto(`${base}/signin`, { waitUntil: "networkidle" });
  await page.fill("#f-email", COUNSELOR_EMAIL);
  await page.fill("#f-pass", process.env.SEED_PASSWORD ?? "");
  await page.click("#signin-form button[type=submit]");
  await page.waitForURL((u) => !u.pathname.includes("signin"), { timeout: 20000 });
  await page.goto(`${base}/admin`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.locator(`button:has-text("Audit queue")`).first().click();
  await page.waitForTimeout(700);

  // review dialog (pending)
  await page.locator("[data-aq-row] .aq-title").first().click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `.impeccable/review/v9-admin-audit-dlg-${tag}.png`, fullPage: true });
  done.push("dlg");

  // armed reject inside the dialog
  await page.locator("[data-aq-reject]").click();
  await page.waitForTimeout(250);
  await page.fill("[data-aq-note]", "The service log isn't attached — attach it and resubmit, or the cited skills stay open.");
  await page.screenshot({ path: `.impeccable/review/v9-admin-audit-armed-${tag}.png`, fullPage: true });
  done.push("armed");

  // a REAL verify ruling through the dialog (marco — no target career,
  // the verified-join closes nothing: the demo state stays untouched)
  if (tag === "1440") {
    await page.locator(".aq-dclose").click(); // back to the table
    await page.waitForTimeout(300);
    await page.locator("[data-aq-row]", { hasText: "Marco Santiago" }).locator(".aq-title").click();
    await page.waitForTimeout(400);
    await page.locator("[data-aq-verify]").click();
    await page.waitForTimeout(2500);
    await page.screenshot({ path: `.impeccable/review/v9-admin-audit-ruled-1440.png`, fullPage: true });
    done.push("ruled(real verify: Marco)");
  }
  console.log(`✓ ${tag}: ${done.join(", ")}`);
  await ctx.close();
}
await browser.close();
