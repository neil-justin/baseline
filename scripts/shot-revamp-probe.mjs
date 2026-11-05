import { chromium } from "@playwright/test";

// Reassess-round (2026-11-05): probe the LIVE revamped admin tabs so the
// staff Account mockup can be compared against the console's current DNA.
// One 1440 pass per tab, seeded sign-ins, no faking.
const base = "http://localhost:3111";
const browser = await chromium.launch();

async function signIn(email) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${base}/signin`, { waitUntil: "networkidle" });
  await page.fill("#f-email", email);
  await page.fill("#f-pass", process.env.SEED_PASSWORD ?? "");
  await page.click("#signin-form button[type=submit]");
  await page.waitForURL((u) => !u.pathname.includes("signin"), { timeout: 60000 });
  await page.goto(`${base}/admin`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  return { ctx, page };
}

const click = async (page, label) => {
  const btn = page.locator(`.atabs-sidenav button:has-text("${label}")`).first();
  if ((await btn.count()) > 0) {
    await btn.click();
    await page.waitForTimeout(900);
    return true;
  }
  return false;
};

// sysadmin: approvals (landing) + accounts
const sys = await signIn(process.env.SEED_SYSADMIN_EMAIL ?? "");
await sys.page.screenshot({ path: ".impeccable/review/revamp-probe-approvals-1440.png" });
console.log("✓ approvals");
if (await click(sys.page, "Accounts")) {
  await sys.page.screenshot({ path: ".impeccable/review/revamp-probe-accounts-1440.png" });
  console.log("✓ accounts");
}
await sys.ctx.close();

// counselor: cohort + audit
const cou = await signIn(`ana.villanueva@${process.env.SEED_COHORT_DOMAIN || "campus.test"}`);
await cou.page.screenshot({ path: ".impeccable/review/revamp-probe-cohort-1440.png" });
console.log("✓ cohort");
if (await click(cou.page, "Audit queue")) {
  await cou.page.screenshot({ path: ".impeccable/review/revamp-probe-audit-1440.png" });
  console.log("✓ audit");
}
await cou.ctx.close();

await browser.close();
