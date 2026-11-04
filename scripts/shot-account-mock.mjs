import { chromium } from "@playwright/test";

// The staff ACCOUNT mockup round (2026-11-04): capture the /admin#mockups
// realms' new Account tail page — counselor + sysadmin, 1440 + 720 + 390.
// The realm is client-only on top of the real /admin page, so each pass
// signs in with the seeded staff accounts. Drives, never fakes.
const base = "http://localhost:3111";
const browser = await chromium.launch();

async function signIn(email) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${base}/signin`, { waitUntil: "networkidle" });
  await page.fill("#f-email", email);
  await page.fill("#f-pass", process.env.SEED_PASSWORD ?? "");
  await page.click("#signin-form button[type=submit]");
  // the shared dev server compiles routes on demand and the parallel build
  // stream keeps it busy — 20s was too tight for a cold /admin compile
  await page.waitForURL((u) => !u.pathname.includes("signin"), { timeout: 60000 });
  return ctx;
}

const passes = [
  { hash: "#mockups", email: `ana.villanueva@${process.env.SEED_COHORT_DOMAIN || "campus.test"}`, name: "counselor" },
  { hash: "#mockups-sys", email: process.env.SEED_SYSADMIN_EMAIL ?? "", name: "sysadmin" },
];

for (const pass of passes) {
  const ctx = await signIn(pass.email);
  const page = await ctx.newPage();
  await page.goto(`${base}/admin${pass.hash}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  // the Account page rides the tail — one click in, then the width sweep
  const tail = page.locator(".mk-tail button:has-text('Account')").first();
  if ((await tail.count()) === 0) {
    console.log(`skip account — tail item missing (${pass.name})`);
    await ctx.close();
    continue;
  }
  await tail.click();
  await page.waitForTimeout(700);
  for (const w of [1440, 720, 390]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.waitForTimeout(600);
    // the realm capture law: viewport shots, never fullPage — the sticky
    // rail strips stitch as artifacts on tall pages
    await page.screenshot({ path: `.impeccable/review/account-mock-${pass.name}-${w}.png` });
    console.log(`✓ account ${pass.name} ${w} top`);
    if (w < 1440) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(500);
      await page.screenshot({ path: `.impeccable/review/account-mock-${pass.name}-${w}-b.png` });
      console.log(`✓ account ${pass.name} ${w} bottom`);
    }
  }
  // widen back and show the painted confirm state once (1440 only)
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(400);
  await page.fill("#mk-pw", "q Albert! 9 elbow");
  await page.fill("#mk-pw-confirm", "q Albert! 9 elbow");
  await page.fill("#mk-pw-current", "not-a-real-password-01");
  await page.click(".mk-accbtn");
  await page.waitForTimeout(900);
  await page.screenshot({ path: `.impeccable/review/account-mock-${pass.name}-changed.png` });
  console.log(`✓ account ${pass.name} painted confirm`);
  await ctx.close();
}

await browser.close();
