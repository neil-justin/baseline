import { chromium } from "@playwright/test";
// Round-3 (role-matrix law, ruled 2026-11-04) review captures at 1440.
//   sysadmin   → /admin lands on APPROVALS (+ Accounts tab), NO Cohort/Audit
//   counselor  → /admin lands on COHORT (+ Audit queue tab), NO Approvals/Accounts
// Viewport shots (NOT fullPage — the fixed-rail stitch artifact rides fullPage).
const base = "http://localhost:3111";
const domain = process.env.SEED_COHORT_DOMAIN ?? "campus.test";

const browser = await chromium.launch();

/** Sign in on its own context; returns { ctx, page } with the console loaded. */
async function signIn(email) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto(`${base}/signin`, { waitUntil: "networkidle" });
  await page.fill("#f-email", email);
  await page.fill("#f-pass", process.env.SEED_PASSWORD ?? "");
  await page.click("#signin-form button[type=submit]");
  await page.waitForURL((u) => !u.pathname.includes("signin"), { timeout: 20000 });
  await page.goto(`${base}/admin`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  return { ctx, page };
}

function navLabels(page) {
  return page.locator(".atabs-sidenav button span:last-child");
}

// (a) sysadmin — lands on Approvals, sees ONLY Approvals + Accounts
{
  const { ctx, page } = await signIn(process.env.SEED_SYSADMIN_EMAIL ?? "");
  const labels = await navLabels(page).allTextContents();
  console.log(`sysadmin tabs: ${labels.join(" · ")}`);
  await page.screenshot({ path: ".impeccable/review/admin-r3-sysadmin-1440.png" });
  console.log("✓ sysadmin landing 1440");

  const acctBtn = page.locator('button:has-text("Accounts")').first();
  if ((await acctBtn.count()) === 0) throw new Error("sysadmin has no Accounts tab");
  await acctBtn.click();
  await page.waitForTimeout(900);
  await page.screenshot({ path: ".impeccable/review/admin-r3-accounts-1440.png" });
  console.log("✓ accounts 1440");
  await ctx.close();
}

// (b) counselor — lands on Cohort, sees ONLY Cohort + Audit queue
{
  const { ctx, page } = await signIn(`ana.villanueva@${domain}`);
  const labels = await navLabels(page).allTextContents();
  console.log(`counselor tabs: ${labels.join(" · ")}`);
  await page.screenshot({ path: ".impeccable/review/admin-r3-cohort-1440.png" });
  console.log("✓ counselor landing 1440");

  const auditBtn = page.locator('button:has-text("Audit queue")').first();
  if ((await auditBtn.count()) === 0) throw new Error("counselor has no Audit queue tab");
  await auditBtn.click();
  await page.waitForTimeout(900);
  await page.screenshot({ path: ".impeccable/review/admin-r3-audit-1440.png" });
  console.log("✓ audit 1440");
  await ctx.close();
}

await browser.close();
