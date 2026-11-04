// [DEBUG-blink] throwaway probe: reproduce "screen blinks repeatedly when
// hovering outside the Declare-a-credential modal" on /profile.
// Red-capable assertion: while the mouse sweep runs, ANY sample where the
// dialog's bounding rect moves (x/y delta > 1px), the viewport/scroll
// metrics change, the mount animation restarts, or console/page errors
// fire == the reported symptom. Diffs and screenshots land in /tmp/opencode/blink.
import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "node:fs";

mkdirSync("/tmp/opencode/blink", { recursive: true });

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
const consoleMsgs = [];
page.on("console", (m) => consoleMsgs.push(`${m.type()}: ${m.text()}`.slice(0, 200)));
page.on("pageerror", (e) => consoleMsgs.push(`PAGEERROR: ${String(e).slice(0, 300)}`));

// sign in
await page.goto(`${BASE}/signin`, { waitUntil: "domcontentloaded" });
await page.locator("#f-email").fill(env.E2E_NEIL_EMAIL);
await page.locator("#f-pass").fill(env.E2E_NEIL_PASSWORD);
await page.getByRole("button", { name: "Sign in" }).click();
await page.waitForURL((u) => !u.pathname.startsWith("/signin"));

// open the declare modal
await page.goto(`${BASE}/profile`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1200);
const credTab = page.locator("[role=tab]", { hasText: /credential/i }).first();
await credTab.click({ timeout: 5000 });
await page.waitForTimeout(600);
await page.getByRole("button", { name: "Declare a credential" }).click();
await page.waitForSelector(".dec-dialog", { timeout: 5000 });
await page.waitForTimeout(400); // let the mount animation finish

// sampling helper: everything that could "re-place" the dialog
async function sample(i) {
  return page.evaluate((i) => {
    const d = document.querySelector(".dec-dialog");
    if (!d) return { gone: i };
    const r = d.getBoundingClientRect();
    const anims = d.getAnimations().map((a) => {
      const cs = getComputedStyle(d);
      return { name: a.animationName ?? "anim", startTime: a.startTime, opacity: cs.opacity, transform: cs.transform };
    });
    return {
      i,
      x: Math.round(r.x * 10) / 10,
      y: Math.round(r.y * 10) / 10,
      w: Math.round(r.width * 10) / 10,
      docScrollY: Math.round(window.scrollY * 10) / 10,
      docScrollX: Math.round(window.scrollX * 10) / 10,
      innerW: window.innerWidth,
      innerH: window.innerHeight,
      bodyOverflow: getComputedStyle(document.body).overflow,
      anims,
    };
  }, i);
}

// the sweep: hover OUTSIDE the modal — over the scrim — moving around,
// then hover inside, then outside again (mirrors a user's casual mouse path)
const outside = [
  { x: 40, y: 40 },
  { x: 720, y: 30 },
  { x: 1400, y: 40 },
  { x: 1400, y: 860 },
  { x: 720, y: 880 },
  { x: 40, y: 860 },
  { x: 300, y: 450 },
];
const samples = [];
let prev = null;
let red = false;
const reasons = [];
for (let i = 0; i < 42; i++) {
  const p = outside[i % outside.length];
  const jitter = (i > 6 ? 1 : 0); // second pass moves slightly differently
  await page.mouse.move(p.x + jitter, p.y + jitter, { steps: 3 });
  await page.waitForTimeout(90);
  const s = await sample(i);
  if (s.gone) { reasons.push(`dialog GONE at sample ${i}`); red = true; break; }
  if (prev) {
    if (Math.abs(s.x - prev.x) > 1 || Math.abs(s.y - prev.y) > 1) {
      reasons.push(`sample ${i}: dialog moved x ${prev.x}→${s.x}, y ${prev.y}→${s.y} (hover at ${p.x + jitter},${p.y + jitter})`);
      red = true;
    }
    if (s.docScrollY !== prev.docScrollY || s.docScrollX !== prev.docScrollX) {
      reasons.push(`sample ${i}: document scrolled y ${prev.docScrollY}→${s.docScrollY}, x ${prev.docScrollX}→${s.docScrollX}`);
      red = true;
    }
    if (s.innerW !== prev.innerW || s.innerH !== prev.innerH) {
      reasons.push(`sample ${i}: viewport resized ${prev.innerW}x${prev.innerH} → ${s.innerW}x${s.innerH}`);
      red = true;
    }
    if (JSON.stringify(s.anims) !== JSON.stringify(prev.anims)) {
      reasons.push(`sample ${i}: dialog animation state changed: ${JSON.stringify(prev.anims)} → ${JSON.stringify(s.anims)}`);
      red = true;
    }
  }
  if (i < 8) await page.screenshot({ path: `/tmp/opencode/blink/s${String(i).padStart(2, "0")}.png` });
  samples.push(s);
  prev = s;
}

console.log("=== [DEBUG-blink] sweep done ===");
console.log(red ? "RED — symptom observed:" : "GREEN — no movement/animation/error detected");
for (const r of reasons) console.log("  " + r);
console.log("samples:", JSON.stringify(samples, null, 1));
if (consoleMsgs.length) console.log("console/page messages:", JSON.stringify(consoleMsgs, null, 1));
else console.log("console/page messages: none");
await browser.close();
