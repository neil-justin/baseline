import { test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const DIR = "/tmp/opencode/screenshots/thesis";

/**
 * Under reduced motion everything renders final values instantly; this only
 * waits out hydration and any async data fetches.
 */
async function stabilize(page: import("@playwright/test").Page) {
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(400);
}

/**
 * Throwaway: capture a full-page screenshot of every route into
 * /tmp/opencode/screenshots/thesis. Not part of the canon suite.
 *
 * Full-page shots never scroll, and Playwright's capture re-observes the
 * whole page at once — the reveal machinery (LandingFx/observeReveal) then
 * unreveals everything out of view and CountUp restarts mid-capture, so
 * plain waits always lose the race. The app's own motion contract
 * (lib/motion.ts) renders every final value instantly under
 * prefers-reduced-motion, so emulate that for deterministic captures.
 */
test("capture every page", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  // public + student pages (store auto-seeds canon Neil)
  for (const [route, name] of [
    ["/", "home"],
    ["/profile", "profile"],
    ["/progress", "progress"],
  ] as const) {
    await page.goto(route);
    await stabilize(page);
    fs.mkdirSync(DIR, { recursive: true });
    await page.screenshot({ path: path.join(DIR, `page-${name}.png`), fullPage: true });
  }

  // admin is session-guarded — sign in, role redirect lands on /admin
  await page.goto("/signin");
  await page.locator("#f-email").fill("admin@demo.ph");
  await page.locator("#f-pass").fill("readiness");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL("**/admin");
  await stabilize(page);
  fs.mkdirSync(DIR, { recursive: true });
  await page.screenshot({ path: path.join(DIR, "page-admin.png"), fullPage: true });

  await page.goto("/admin/student?student=neil");
  await stabilize(page);
  await page.screenshot({ path: path.join(DIR, "page-admin-student.png"), fullPage: true });
});
