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
await page.goto(`${base}/admin/student?student=neil`, { waitUntil: "commit" });
await page.waitForTimeout(700);
await page.screenshot({ path: ".impeccable/review/admin-r5-student-skeleton.png" });
console.log("✓ skeleton");
await browser.close();
