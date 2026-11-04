// [DEBUG-blink] rAF observer: watch dialog rect continuously inside the page;
// correlate rect changes with scrollY, html height, DOM mutations.
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
await page.waitForTimeout(400);

// install rAF watcher BEFORE moving the mouse
await page.evaluate(() => {
  window.__blinkLog = [];
  const html = document.documentElement;
  let last = "";
  const rec = (t, extra) => {
    const d = document.querySelector(".dec-dialog");
    if (!d) { if (last !== "gone") { window.__blinkLog.push([t, "GONE"]); last = "gone"; } return; }
    const r = d.getBoundingClientRect();
    const key = `${r.x.toFixed(2)}|${r.y.toFixed(2)}|${r.width.toFixed(2)}|${html.scrollHeight}|${window.scrollY}|${getComputedStyle(d).position}|${getComputedStyle(document.body).overflow}`;
    if (key !== last) {
      last = key;
      window.__blinkLog.push({ t, ...Object.fromEntries(key.split("|").map((v, i) => [["x", "y", "w", "htmlSH", "scrollY", "dialogPos", "bodyOverflow"][i], v])) , ...extra });
    }
  };
  const mo = new MutationObserver(() => rec(performance.now().toFixed(0), { mut: 1 }));
  mo.observe(document.body, { childList: true, subtree: true, attributes: true });
  const tick = () => { rec(performance.now().toFixed(0), {}); requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
});

// hold the mouse at the right edge where B was first seen, then torque it around
await page.mouse.move(1400, 40, { steps: 5 });
await page.waitForTimeout(1500);
await page.mouse.move(400, 850, { steps: 5 });
await page.waitForTimeout(1500);
await page.mouse.move(40, 40, { steps: 5 });
await page.waitForTimeout(1000);

const log = await page.evaluate(() => window.__blinkLog);
console.log("=== [DEBUG-blink] rAF log ===");
for (const e of log) console.log(JSON.stringify(e));
console.log("entries:", log.length);
await browser.close();
