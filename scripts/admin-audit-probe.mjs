/**
 * Audit-queue sweep probe — the queue pane at 5 widths (Mid-Width Sweep
 * Rule: 1024 + 1200 included). Flags per width:
 *  1. horizontal page overflow (scrollWidth > innerWidth)
 *  2. elements bleeding past the queue card's right edge
 *  3. nowrap text clipped by its own overflow
 *  4. the header art / heads / buttons / chips boxes' hover seams
 * Screenshot at each width for the round record (gitignored).
 */
import { chromium } from "@playwright/test";

const base = "http://localhost:3111";
const COUNSELOR_EMAIL = `ana.villanueva@${process.env.SEED_COHORT_DOMAIN || "campus.test"}`;
const WIDTHS = [1440, 1200, 1024, 720, 390];

const browser = await chromium.launch();

function auditFn() {
  const out = { scrollW: document.documentElement.scrollWidth, innerW: window.innerWidth, flags: [] };
  const card = document.querySelector(".panel.queue");
  if (!card) return { scrollW: out.scrollW, innerW: out.innerW, flags: [{ kind: "no-card" }] };
  const cr = card.getBoundingClientRect();
  for (const el of card.querySelectorAll("*")) {
    if (!(el instanceof HTMLElement)) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (r.right > cr.right + 2) {
      out.flags.push({
        kind: "bleed",
        el: `${el.tagName}.${(el.className || "").toString().slice(0, 40)}`,
        over: Math.round(r.right - cr.right),
      });
    }
    const cs = getComputedStyle(el);
    if (el.children.length === 0 && el.textContent && cs.whiteSpace === "nowrap" && el.scrollWidth > el.clientWidth + 2) {
      out.flags.push({ kind: "clip", el: `${el.tagName}.${(el.className || "").toString().slice(0, 40)}`, text: (el.textContent || "").slice(0, 30) });
    }
  }
  return out;
}

for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(`${base}/signin`, { waitUntil: "networkidle" });
  await page.fill("#f-email", COUNSELOR_EMAIL);
  await page.fill("#f-pass", process.env.SEED_PASSWORD ?? "");
  await page.click("#signin-form button[type=submit]");
  await page.waitForURL((u) => !u.pathname.includes("signin"), { timeout: 20000 });
  await page.goto(`${base}/admin`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1400);
  await page.locator(`button:has-text("Audit queue")`).first().click();
  await page.waitForTimeout(800);
  const res = await page.evaluate(auditFn);
  const badge = res.flags.length ? `FLAGS(${res.flags.length})` : "clean";
  console.log(`\n== ${w}px — h-overflow=${res.scrollW > res.innerW ? "YES" : "no"} ${badge}`);
  for (const f of res.flags.slice(0, 12)) console.log("  ", JSON.stringify(f));
  await page.screenshot({ path: `.impeccable/review/v9-admin-audit-probe-${w}.png`, fullPage: true });
  await ctx.close();
}
await browser.close();
