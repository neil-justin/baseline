// [DEBUG-blink] differential probe: state A (hover left edge) vs state B (hover right edge)
import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l.startsWith("E2E_NEIL_"))
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

async function metrics(label) {
  const m = await page.evaluate(() => {
    const d = document.querySelector(".dec-dialog");
    const r = d.getBoundingClientRect();
    const cs = getComputedStyle(d);
    const scan = [];
    const start = d;
    for (let el = start; el; el = el.parentElement) {
      const s = getComputedStyle(el);
      scan.push({
        tag: el.tagName, cls: (el.className || "").toString().slice(0, 60),
        scrollH: el.scrollHeight, clientH: el.clientHeight, scrollW: el.scrollWidth, clientW: el.clientWidth,
        h: el.getBoundingClientRect().height,
        pos: s.position, transform: s.transform, filter: s.filter, backdropFilter: s.backdropFilter,
        zoom: s.zoom, contain: s.contain,
      });
    }
    return {
      rect: { x: r.x, y: r.y, w: r.width, h: r.height },
      offsetW: d.offsetWidth, offsetH: d.offsetHeight, clientW: d.clientWidth, clientH: d.clientHeight,
      scrollH: d.scrollHeight, scrollW: d.scrollWidth,
      maxH: cs.maxHeight, h: cs.height, minH: cs.minHeight, padding: cs.padding,
      gap: cs.display,
      htmlH: document.documentElement.offsetHeight, htmlScrollW: document.documentElement.scrollWidth,
      bodyH: document.body.offsetHeight,
      chain: scan,
    };
  });
  console.log(label, JSON.stringify(m, null, 1));
}

await page.mouse.move(40, 40); await page.waitForTimeout(250);
await metrics("STATE-A (hover left edge)");
await page.mouse.move(1400, 40); await page.waitForTimeout(250);
await metrics("STATE-B (hover right edge)");
await page.mouse.move(40, 40); await page.waitForTimeout(250);
await metrics("STATE-A2 (back left edge)");
await browser.close();
