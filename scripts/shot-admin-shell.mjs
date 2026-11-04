import { chromium } from "@playwright/test";
// Two-role /admin captures (role-tab law, 2026-11-04):
//  - sysadmin: landing (Approvals, honest empty) + Accounts, 1440
//  - counselor (ana.villanueva@SEED_COHORT_DOMAIN): Cohort roster at the
//    five sweep widths + Audit queue at 1440
// Viewport shots (NOT fullPage — fixed-rail stitch artifact). All state is
// computed from real data; the scripts only drive, never fake.
const base = "http://localhost:3111";
const browser = await chromium.launch();

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

const click = async (page, label) => {
  const btn = page.locator(`button:has-text("${label}")`).first();
  if ((await btn.count()) > 0) {
    await btn.click();
    await page.waitForTimeout(900);
    return true;
  }
  return false;
};

// --- sysadmin: approvals landing + accounts ---
const sys = await signIn(process.env.SEED_SYSADMIN_EMAIL ?? "");
const sysTabs = await sys.page
  .locator(".atabs-sidenav button")
  .allTextContents();
console.log("sysadmin tabs:", sysTabs.map((t) => t.trim()).join(" · "));
await sys.page.screenshot({ path: ".impeccable/review/admin-r3-sysadmin-1440.png" });
if (await click(sys.page, "Accounts")) {
  await sys.page.screenshot({ path: ".impeccable/review/admin-r3-accounts-1440.png" });
  console.log("✓ sysadmin accounts");
}
await sys.ctx.close();

// --- counselor: cohort at five widths + audit ---
const counselorEmail = `ana.villanueva@${
  process.env.SEED_COHORT_DOMAIN || "campus.test"
}`;
const cou = await signIn(counselorEmail);
const couTabs = await cou.page
  .locator(".atabs-sidenav button")
  .allTextContents();
console.log("counselor tabs:", couTabs.map((t) => t.trim()).join(" · "));
for (const w of [1440, 1200, 1024, 720, 390]) {
  await cou.page.setViewportSize({ width: w, height: 900 });
  await cou.page.waitForTimeout(700);
  await cou.page.screenshot({
    path: `.impeccable/review/admin-r4-cohort-${w}.png`,
  });
  console.log(`✓ cohort ${w}`);
}
if (await click(cou.page, "Audit queue")) {
  await cou.page.screenshot({ path: ".impeccable/review/admin-r3-audit-1440.png" });
  console.log("✓ counselor audit");
}
await cou.ctx.close();
await browser.close();
