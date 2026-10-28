import { test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { signIn, cohortEmail, DEMO_PASSWORD, neilCreds } from "./helpers";

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
  // ADR 0003: student pages are session-honest — sign in as Neil first.
  const neil = neilCreds();
  test.skip(!neil.email || !neil.password, "E2E_NEIL_EMAIL / E2E_NEIL_PASSWORD unset — add them to .env.local to run the capture.");
  await signIn(page, neil.email, neil.password);
  await page.emulateMedia({ reducedMotion: "reduce" });
  // student pages (Neil's canon seed loads for his account)
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

  // admin is session-guarded — sign in as the counselor persona, role
  // redirect lands on /admin
  await signIn(page, cohortEmail("adviser"), DEMO_PASSWORD);
  await stabilize(page);
  fs.mkdirSync(DIR, { recursive: true });
  await page.screenshot({ path: path.join(DIR, "page-admin.png"), fullPage: true });

  await page.goto("/admin/student?student=neil");
  await stabilize(page);
  await page.screenshot({ path: path.join(DIR, "page-admin-student.png"), fullPage: true });
});
