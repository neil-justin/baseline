// [DEBUG-blink] injection bisect: try killing each suspect style knob and see
// when the 20Hz position oscillation stops.
import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8").split("\n").filter((l) => l.startsWith("E2E_NEIL_"))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")]; })
);
const BASE = `http://localhost:3111`;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`${BASE}/signin`, { waitUntil: "domcontentloaded" });
await page.locator("#f-email").fill(env.E2E_NEIL_EMAIL);
await page.locator("#f-pass").fill(env.E2E_NEIL_PASSWORD);
await page.getByRole("button", { name: "Sign in" }).click();
await page.waitForURL((u) => !u.pathname.startsWith("/signin"));
await page.goto(`${BASE}/profile`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1200);
await page.locator("[role=tab]", { hasText: /credential/i }).first().click({ timeout: 5000 });
await page.waitForTimeout(600);
await page.getByRole("button", { name: "Declare a credential" }).click();
await page.waitForSelector(".dec-dialog", { timeout: 5000 });
// re-trigger: hover right edge like the user
await page.mouse.move(1400, 40, { steps: 4 });
await page.waitForTimeout(400);

async function probe(label, css) {
  if (css) await page.evaluate((c) => c, css).then(() => {});
  // inject a style tag
  await page.evaluate((labelCss) => {
    const el = document.getElementById("blinkctl") ?? document.createElement("style");
    el.id = "blinkctl";
    if (labelCss === null) el.textContent = "";
    else el.textContent = labelCss;
    document.head.append(el);
  }, css);
  await page.waitForTimeout(200);
  const counts = await page.evaluate(async () => {
    const d = document.querySelector(".dec-dialog");
    let a = 0, b = 0, other = 0;
    const t0 = performance.now();
    while (performance.now() - t0 < 1500) {
      await new Promise((r) => requestAnimationFrame(r));
      const r = d.getBoundingClientRect();
      if (r.x < 355) b++;
      else if (Math.abs(r.x - 358) < 3) a++;
      else other++;
    }
    return { a, b, other };
  });
  console.log(`${label}: A=${counts.a} B=${counts.b} other=${counts.other}  ${counts.b > 0 ? "STILL BLINKING" : "STOPPED"}`);
}

await probe("base (no injection)", null);
await probe("kill dialog animation", ".v7profile .dec-dialog { animation: none !important; }");
await probe("kill dialog animation + scrim animation", ".v7profile .dec-dialog, .v7profile .dec-scrim { animation: none !important; }");
await probe("overflow-anchor none", "html, body { overflow-anchor: none !important; }");
await probe("dialog max-height none", ".v7profile .dec-dialog { max-height: none !important; }");
await probe("dialog overflow visible", ".v7profile .dec-dialog { overflow-y: visible !important; }");
await probe("no html scrollbar", "html { scrollbar-width: none !important; }");
await probe("scrim display none", ".v7profile .dec-scrim { display: none !important; }");
await probe("date inputs removed", null);
await page.evaluate(() => document.querySelectorAll('.dec-dialog input[type="date"]').forEach((el) => el.remove()));
await new Promise((r) => setTimeout(r, 0));
await page.waitForTimeout(200);
{
  const counts = await page.evaluate(async () => {
    const d = document.querySelector(".dec-dialog");
    let a = 0, b = 0;
    const t0 = performance.now();
    while (performance.now() - t0 < 1500) {
      await new Promise((r) => requestAnimationFrame(r));
      const r = d ? d.getBoundingClientRect() : { x: NaN };
      if (r.x < 355) b++;
      else if (Math.abs(r.x - 358) < 3) a++;
    }
    return { a, b };
  });
  console.log(`without date inputs: A=${counts.a} B=${counts.b}  ${counts.b > 0 ? "STILL BLINKING" : "STOPPED"}`);
}
await browser.close();
