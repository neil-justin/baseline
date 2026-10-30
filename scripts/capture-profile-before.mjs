/* BEFORE-pair capture for the v7.2 Profile sweep — the pre-sweep (Index-era)
   Profile at canon state. Old page: Plan tab default + the legacy Profile tab.
   Runs against the PRODUCTION server on :3000 (npm run start). */
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const OUT = path.join(process.cwd(), ".impeccable", "review");
const email = process.env.E2E_NEIL_EMAIL;
const password = process.env.E2E_NEIL_PASSWORD;
if (!email || !password) {
  console.error("E2E_NEIL_EMAIL / E2E_NEIL_PASSWORD unset — refusing to run");
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.emulateMedia({ reducedMotion: "reduce" });

async function pair(route, name, openProfileTab = false) {
  await page.goto(`${BASE}${route}`);
  await page.waitForLoadState("networkidle").catch(() => {});
  if (openProfileTab) {
    await page.waitForSelector("#tab-profile");
    await page.locator("#tab-profile").click();
    await page.waitForSelector("#panel-profile", { state: "visible" });
    await page.waitForTimeout(700);
  }
  await page.waitForTimeout(2600); // count-up settle
  fs.mkdirSync(OUT, { recursive: true });
  await page.screenshot({ path: path.join(OUT, `${name}-1440.png`), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, `${name}-390.png`), fullPage: true });
  await page.setViewportSize({ width: 1440, height: 900 });
}

await page.goto(`${BASE}/signin`);
await page.waitForSelector("#f-email");
await page.locator("#f-email").fill(email);
await page.locator("#f-pass").fill(password);
await page.getByRole("button", { name: "Sign in" }).click();
await page.waitForURL((u) => !u.pathname.startsWith("/signin"));

await pair("/profile", "before-profile-v71");
// the legacy Profile tab as the second pre-sweep state (content evidence)
await pair("/profile", "before-profile-v71-tab", true);

await browser.close();
console.log("before captures written");
