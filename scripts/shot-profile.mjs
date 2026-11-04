// Read-only Profile capture — sign in as Neil, screenshot each Profile sub-tab.
// No writes: browse every pill panel, never submit a form (screenshots only).
import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l.startsWith("E2E_NEIL_") || l.startsWith("NEXT_PUBLIC"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
    })
);
const PORT = process.env.SHOT_PORT || 3000;
const BASE = `http://localhost:${PORT}`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("dialog", (d) => d.dismiss());
await page.goto(`${BASE}/signin`, { waitUntil: "domcontentloaded" });
await page.locator("#f-email").fill(env.E2E_NEIL_EMAIL);
await page.locator("#f-pass").fill(env.E2E_NEIL_PASSWORD);
await page.getByRole("button", { name: "Sign in" }).click();
await page.waitForURL((u) => !u.pathname.startsWith("/signin"));

await page.goto(`${BASE}/profile`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1200);
await page.screenshot({ path: ".shots/profile-top.png", fullPage: false });

// enumerate pill/tab controls on the Profile pillbar
const pills = await page.evaluate(() =>
  Array.from(
    document.querySelectorAll("[role=tab], .pillbar button, .pillbar a, .tabs button")
  ).map((el) => ({ text: (el.textContent || "").trim(), tag: el.tagName }))
);
console.log("PILLS:", JSON.stringify(pills));

const seen = new Set();
for (const p of pills) {
  const slug = p.text.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 24) || "tab";
  if (seen.has(slug)) continue;
  seen.add(slug);
  const handle = page.locator(`[role=tab]`, { hasText: p.text }).first();
  try {
    await handle.click({ timeout: 3000 });
  } catch {
    try {
      await page.getByText(p.text, { exact: true }).first().click({ timeout: 3000 });
    } catch (e) {
      console.log("skip", slug, String(e).slice(0, 80));
      continue;
    }
  }
  await page.waitForTimeout(900);
  await page.screenshot({ path: `.shots/profile-${slug}.png`, fullPage: true });
  console.log("shot", slug);
}
await browser.close();
console.log("done");
