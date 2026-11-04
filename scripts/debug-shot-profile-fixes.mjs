// [DEBUG-blink] visual verification for the profile fix round: band+seal,
// skills table (no Evidence), the restyled declare modal (desktop+mobile).
import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "node:fs";

mkdirSync("/tmp/opencode/pf-fix", { recursive: true });
const env = Object.fromEntries(
  readFileSync(".env.local", "utf8").split("\n").filter((l) => l.startsWith("E2E_NEIL_"))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")]; })
);
const BASE = "http://localhost:3111";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`${BASE}/signin`, { waitUntil: "domcontentloaded" });
await page.locator("#f-email").fill(env.E2E_NEIL_EMAIL);
await page.locator("#f-pass").fill(env.E2E_NEIL_PASSWORD);
await page.getByRole("button", { name: "Sign in" }).click();
await page.waitForURL((u) => !u.pathname.startsWith("/signin"));
await page.goto(`${BASE}/profile`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1600);
await page.screenshot({ path: "/tmp/opencode/pf-fix/band.png" });

// Modal restyle
await page.locator("[role=tab]", { hasText: /credential/i }).first().click({ timeout: 5000 });
await page.waitForTimeout(500);
await page.getByRole("button", { name: "Declare a credential" }).click();
await page.waitForSelector(".dec-dialog");
await page.waitForTimeout(300);
await page.screenshot({ path: "/tmp/opencode/pf-fix/modal-open.png" });
await browser.close();

// mobile quick pass
const b2 = await chromium.launch();
const m = await b2.newPage({ viewport: { width: 390, height: 844 } });
await m.goto(`${BASE}/signin`, { waitUntil: "domcontentloaded" });
await m.locator("#f-email").fill(env.E2E_NEIL_EMAIL);
await m.locator("#f-pass").fill(env.E2E_NEIL_PASSWORD);
await m.getByRole("button", { name: "Sign in" }).click();
await m.waitForURL((u) => !u.pathname.startsWith("/signin"));
await m.goto(`${BASE}/profile`, { waitUntil: "domcontentloaded" });
await m.waitForTimeout(1600);
await m.screenshot({ path: "/tmp/opencode/pf-fix/mobile-band.png" });
await b2.close();
console.log("shots saved");
