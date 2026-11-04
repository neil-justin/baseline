import { chromium } from "@playwright/test";
// Round-5 review: the drill-in — counselor context, named student + a
// zero-state student at the review widths; skeleton via route abort race.
const base = "http://localhost:3111";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const page = await ctx.newPage();
await page.goto(`${base}/signin`, { waitUntil: "networkidle" });
await page.fill("#f-email", `ana.villanueva@${process.env.SEED_COHORT_DOMAIN || "campus.test"}`);
await page.fill("#f-pass", process.env.SEED_PASSWORD ?? "");
await page.click("#signin-form button[type=submit]");
await page.waitForURL((u) => !u.pathname.includes("signin"), { timeout: 20000 });

await page.goto(`${base}/admin/student?student=neil`, { waitUntil: "networkidle" });
await page.waitForTimeout(1400);
await page.screenshot({ path: ".impeccable/review/admin-r5-student-neil-1440.png" });
console.log("✓ neil 1440");
for (const w of [720, 390]) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.waitForTimeout(600);
  await page.screenshot({ path: `.impeccable/review/admin-r5-student-neil-${w}.png` });
  console.log(`✓ neil ${w}`);
}

await page.setViewportSize({ width: 1440, height: 900 });
const zero = await page.goto(`${base}/admin/student?student=marco`, { waitUntil: "networkidle" });
await page.waitForTimeout(1400);
await page.screenshot({ path: ".impeccable/review/admin-r5-student-marco-1440.png" });
console.log("✓ marco (zero state) 1440");

// skeleton capture: throttle the API by racing a slow route on student page
await page.route("**/admin/student?student=neil*", async (route) => {
  await new Promise((r) => setTimeout(r, 2500));
  await route.continue();
});
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(`${base}/admin/student?student=neil`, { waitUntil: "networkidle" });
await page.waitForTimeout(900);
await page.unrouteAll({ behavior: "ignoreErrors" });
await page.route("**/admin/student?student=*", async (route) => {
  await new Promise((r) => setTimeout(r, 2500));
  await route.continue();
});
await page.getByText("Next student").click(); // client nav → frozen route skeleton
await page.waitForTimeout(1600);
await page.screenshot({ path: ".impeccable/review/admin-r8-loading-detail.png" });
console.log("✓ drill-in skeleton via row click (mirrors the back row)");

// 2026-11-04 UX round: pn-row always painted (390 bottom proof), console
// /admin loading skeletons for both roles (route-delay race freezes them)
await page.setViewportSize({ width: 390, height: 900 });
await page.goto(`${base}/admin/student?student=neil`, { waitUntil: "networkidle" });
await page.waitForTimeout(1400);
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(400);
await page.screenshot({ path: ".impeccable/review/admin-r5-student-neil-390-bottom.png" });
console.log("✓ neil 390 bottom (pn-row proof)");

const sysctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const sys = await sysctx.newPage();
await sys.goto(`${base}/signin`, { waitUntil: "networkidle" });
await sys.fill("#f-email", process.env.SEED_SYSADMIN_EMAIL ?? "");
await sys.fill("#f-pass", process.env.SEED_PASSWORD ?? "");
await sys.click("#signin-form button[type=submit]");
await sys.waitForURL((u) => !u.pathname.includes("signin"), { timeout: 20000 });

// console loading fallback, both roles: freeze it with a route delay
await page.route(`${base}/admin`, async (route) => { await new Promise((r) => setTimeout(r, 2500)); await route.continue(); });
await page.goto(`${base}/admin/student`, { waitUntil: "networkidle" });
await page.click(".dt-back");
await page.waitForTimeout(600);
await page.screenshot({ path: ".impeccable/review/admin-r8-loading-counselor.png" });
console.log("✓ console loading skeleton (counselor, via Back click)");

await sysctx.close();
await sys.close();

const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const sys2 = await ctx2.newPage();
await sys2.goto(`${base}/signin`, { waitUntil: "networkidle" });
await sys2.fill("#f-email", process.env.SEED_SYSADMIN_EMAIL ?? "");
await sys2.fill("#f-pass", process.env.SEED_PASSWORD ?? "");
await sys2.click("#signin-form button[type=submit]");
await sys2.waitForURL((u) => !u.pathname.includes("signin"), { timeout: 20000 });
await sys2.route(/\/admin$/, async (route) => { await new Promise((r) => setTimeout(r, 2500)); await route.continue(); });
// the drill-in redirects the sysadmin back to /admin — that redirect IS a
// client-side navigation into /admin, so the loading boundary freezes
await sys2.goto(`${base}/admin/student`, { waitUntil: "networkidle" }).catch(() => {});
await sys2.waitForTimeout(700);
await sys2.screenshot({ path: ".impeccable/review/admin-r8-loading-sysadmin.png" });
console.log("✓ console loading skeleton (sysadmin, via gated redirect)");
await ctx2.close();
await browser.close();
