import { chromium } from "@playwright/test";
const base = "http://localhost:3111";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
const page = await ctx.newPage();
await page.goto(`${base}/signin`, { waitUntil: "networkidle" });
await page.fill("#f-email", process.env.E2E_NEIL_EMAIL ?? "");
await page.fill("#f-pass", process.env.E2E_NEIL_PASSWORD ?? "");
await page.click("#signin-form button[type=submit]");
await page.waitForURL(/dashboard|onboarding|admin/, { timeout: 20000 });
await page.goto(`${base}/pathway`, { waitUntil: "networkidle" });
await page.waitForTimeout(1000);

const out = await page.evaluate(() => {
  const el = document.querySelector(".vd2-map");
  const chain = [];
  let cur = el;
  while (cur && cur !== document.body) {
    const cs = getComputedStyle(cur);
    const r = cur.getBoundingClientRect();
    chain.push({
      tag: cur.tagName.toLowerCase(),
      cls: (cur.className || "").toString().slice(0, 60),
      w: Math.round(r.width),
      display: cs.display,
      cols: cs.gridTemplateColumns !== "none" ? cs.gridTemplateColumns : undefined,
      maxW: cs.maxWidth !== "none" ? cs.maxWidth : undefined,
      pad: cs.padding,
      overflow: cs.overflowX !== "visible" ? cs.overflowX : undefined,
    });
    cur = cur.parentElement;
  }
  return chain;
});
console.log(JSON.stringify(out, null, 1));
await browser.close();
