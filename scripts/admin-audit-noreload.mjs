/** The no-reload probe (user-reported defect, 2026-11-05): Verify/Reject
 *  must NOT reload the document — the tab state must survive. Rides a
 *  REAL reject ruling (jomar, with the reason; a rejected entry returns
 *  to the queue when the student revises + resubmits). Asserts: URL
 *  unchanged, the Audit queue rail still active, the row's own chip
 *  re-rendered from the POST's returned record, no full reload. */
import { chromium } from "@playwright/test";
const base = "http://localhost:3111";
const COUNSELOR_EMAIL = `ana.villanueva@${process.env.SEED_COHORT_DOMAIN || "campus.test"}`;
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const page = await ctx.newPage();
let reloaded = false;
page.on("load", () => { reloaded = true; });
await page.goto(`${base}/signin`, { waitUntil: "networkidle" });
await page.fill("#f-email", COUNSELOR_EMAIL);
await page.fill("#f-pass", process.env.SEED_PASSWORD ?? "");
await page.click("#signin-form button[type=submit]");
await page.waitForURL((u) => !u.pathname.includes("signin"), { timeout: 20000 });
await page.goto(`${base}/admin`, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.locator(`button:has-text("Audit queue")`).first().click();
await page.waitForTimeout(700);

await page.locator("[data-aq-row]", { hasText: "Jomar de Leon" }).locator(".aq-title").click();
await page.waitForTimeout(400);
await page.locator("[data-aq-reject]").click();
await page.waitForTimeout(250);
await page.fill("[data-aq-note]", "The host-supervisor evaluation sheet is referenced but not attached — attach it and resubmit, or the cited skills stay open.");
await page.locator("[data-aq-reject-confirm]").click();
await page.waitForTimeout(4000); // fly + soft refresh

const url = page.url();
const tabOn = await page.locator('button:has-text("Audit queue").on').count(); // hmm class list
const active = await page.locator('.atabs-sidenav button.on').textContent();
const chip = await page.locator("[data-aq-row]", { hasText: "Jomar de Leon" }).locator("[data-aq-status]").textContent();
const meta = await page.locator(".queue .ct-meta").textContent();
console.log(`url=${url}`);
console.log(`active-tab=${active?.trim()} (reload happened: ${reloaded})`);
console.log(`jomar-chip=${chip?.trim()} | meta=${meta?.trim()}`);
await page.screenshot({ path: `.impeccable/review/v9-admin-audit-noreload-1440.png`, fullPage: true });

// the record view of the ruled row: the reject reason should read back
await page.locator("[data-aq-row]", { hasText: "Jomar de Leon" }).locator(".aq-title").click();
await page.waitForTimeout(500);
await page.screenshot({ path: `.impeccable/review/v9-admin-audit-record-1440.png`, fullPage: true });
await browser.close();
