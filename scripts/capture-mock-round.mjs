/**
 * scripts/capture-mock-round.mjs — round-N evidence capture for the mockup
 * realms / v9 surfaces. Fresh anonymous context (no sign-in), full-page
 * bird's-eye captures at 1440×900 then 390×844 (the user's loop: one
 * finished screen per round, screenshots delivered — bird's eye catches
 * odd sizing/placement that a viewport slice hides).
 *
 * Usage: node scripts/capture-mock-round.mjs <display-name> [port] [dir]
 *   display-name  file prefix, e.g. "v9-landing-mock"
 *   port          dev server port (default 3111 — the user's running server)
 *   dir           output dir (default .impeccable/review)
 * Reduced motion is emulated (DESIGN.md: no entrance machinery).
 */
import { chromium } from "@playwright/test";

const name = process.argv[2] ?? "capture";
const port = process.argv[3] ?? "3111";
const dir = process.argv[4] ?? ".impeccable/review";
const base = `http://localhost:${port}`;
const route = process.env.CAPTURE_ROUTE ?? "/";
const hash = process.env.CAPTURE_HASH ?? "";
const url = `${base}${route}${hash}`;

const browser = await chromium.launch();

for (const [w, h, tag] of [
  [1440, 900, "1440"],
  [390, 844, "390"],
]) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  if (hash) {
    // the realm mounts on hashchange too; force-parse for deep links
    await page.evaluate(() => window.dispatchEvent(new Event("hashchange")));
    // capture mode: the realm is a fixed, inner-scrolling overlay — a
    // fullPage stitch would show the real page bleeding through. Flatten
    // the realm into the document and hide everything else underneath.
    await page.addStyleTag({
      content: `
        body > .v9mock { position: absolute; inset: auto; height: auto; min-height: 100vh; }
        body > *:not(.v9mock) { display: none !important; }
      `,
    });
  }
  await page.waitForTimeout(1200); // settle: fonts + images
  const path = `${dir}/${name}-${tag}.png`;
  await page.screenshot({ path, fullPage: true });
  console.log(`✓ ${path}`);
  await ctx.close();
}

await browser.close();
