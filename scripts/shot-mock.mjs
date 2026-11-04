import { chromium } from "@playwright/test";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
await page.goto("file:///home/neil/projects/thesis-career-path-readiness/.impeccable/mocks/decision/header-imagery-rec.html", { waitUntil: "networkidle" });
await page.waitForTimeout(600);
await page.screenshot({ path: ".impeccable/review/mock-header-imagery-rec-1440.png", fullPage: true });
console.log("✓ .impeccable/review/mock-header-imagery-rec-1440.png");
await browser.close();
