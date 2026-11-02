import { test, expect, type Page } from "@playwright/test";
import * as path from "node:path";
import { signIn, neilCreds, resetStore } from "./helpers";

/**
 * Resume checker E2E (round 6a) — Prep → Resume as the single Prep surface.
 * Sign in → empty-state dropzone intake → guide + Harvard template → upload
 * the generated synthetic fixtures (e2e/fixtures/, real files —
 * scripts/make-resume-artifacts.mjs) → three-factor feedback renders →
 * re-run → locked rejection matrix.
 * Cleanup: the suite is serialized on ONE worker (playwright.config.ts — the
 * specs share one Supabase-backed demo store), so this beforeAll is a legal
 * FULL reset: canon Neil reseeds (career swd, catalog round 9: verified
 * "Data Design / SQL + data modeling" + "Business Needs Analysis") and the
 * resume-run persistence (resume_runs / offline JSON) clears.
 */

const FIX = (n: string) => path.join(process.cwd(), "e2e", "fixtures", n);

/**
 * Upload flow for the harness: land the file on the dropzone's real input
 * (the checker AUTO-RUNS on drop — no button), then WAIT FOR THE DOCUMENT to
 * be live again. A successful run re-loads the full document (server-rendered
 * from the store — see ResumeUpload), so pre-reload clicks can hit the stale
 * document while the navigation is settling; rejections stay in-place and the
 * load-state wait is a no-op for them.
 */
async function upload(page: Page, fixture: string, multi = false) {
  const input = page.locator('.rs-upload input[type="file"]');
  const files = multi ? [FIX(fixture), FIX("resume-good.pdf")] : FIX(fixture);
  await input.setInputFiles(files);
  await page.waitForLoadState("load");
}

test.describe.serial("resume-diagnostic", () => {
  test.beforeAll(async () => {
    await resetStore();
  });

  test("on-ramp → guide → upload → feedback → re-run → rejections", async ({ page }) => {
    const neil = neilCreds();
    test.skip(!neil.email || !neil.password, "E2E_NEIL_EMAIL / E2E_NEIL_PASSWORD unset — the walk runs as Neil (ADR 0003).");
    await signIn(page, neil.email, neil.password);

    /* ── empty state: the dropzone intake (v7.4) ────────────────────────── */
    await page.goto("/prep");
    await page.waitForSelector(".rs-upload");
    await expect(page.locator(".rs-upload .dz-zone")).toBeVisible();
    await expect(page.locator(".rs-upload .dz-zone")).toContainText("Drop your resume here");
    // the one quiet links line: format guide + the external Harvard template
    const links = page.locator(".rs-links");
    await expect(links.getByRole("link", { name: "Format guide" })).toBeVisible();
    await expect(links.locator('a[href*="careerservices.fas.harvard.edu"]')).toBeAttached();

    // the guide stays reachable; the Harvard template link replaced local downloads
    await page.getByRole("link", { name: "Format guide" }).click();
    await expect(page.getByRole("heading", { name: "Resume format guide" })).toBeVisible();
    await expect(page.locator('a[href*="careerservices.fas.harvard.edu"]').first()).toBeAttached();
    // the guide keeps the ATS-friendly fence: formatting property, no outcomes
    const guideText = (await page.locator("main").innerText()).replace(/\s+/g, " ");
    expect(guideText.toLowerCase()).toContain("formatting property");
    expect(guideText.toLowerCase()).not.toContain("ats-pass");
    expect(guideText.toLowerCase()).not.toContain("ats pass");
    expect(guideText.toLowerCase()).not.toContain("ats-proof");

    /* ── upload · the good PDF → full feedback (100) ─────────────────────── */
    await page.goto("/prep");
    await page.waitForSelector(".rs-upload");
    await upload(page, "resume-good.pdf");

    await expect(page.locator(".rs-readout")).toBeVisible({ timeout: 45_000 });
    await expect(page.locator(".rs-readout-score")).toContainText("100");

    // the re-run dropzone (Q15: demoted to the slim "Check another version"
    // footer affordance on the results-first card) — still visible
    await expect(page.locator(".rs-upload .dz-zone").first()).toBeVisible();
    await expect(page.locator(".rs-upload .dz-zone").first()).toContainText("Check another version");

    // three deterministic factors, all checks green — LIVE-EXPANDED on the
    // results-first card (Q15): the rows read straight off, no fold to open
    await expect(page.locator(".rs-factor-head").first()).toContainText("Parse — 100%");
    await expect(page.locator(".rs-factor-head", { hasText: "Format" })).toContainText("100%");
    await expect(page.locator(".rs-factor-head", { hasText: "Evidence" })).toContainText("100%");
    await expect(page.locator(".rs-check", { hasText: "One page" })).toBeVisible();
    // keyword ledger names the role's core-tier skills
    await expect(page.locator(".rs-check", { hasText: "SQL" })).toBeVisible();

    // AIR provenance line (Q17 weighted sum): the honest shares, never a × product
    await expect(page.locator(".rs-air-note")).toContainText("parse 20% + format 40% + evidence 40%", { timeout: 45_000 });
    await expect(page.locator(".rs-air-note")).toContainText("your latest run counts");
    // feedback honesty: no fixes needed → the collapsed findings summary says so
    await expect(page.locator(".rs-disc summary", { hasText: "Findings" })).toContainText("no fixes found");

    /* ── locked rejection matrix (persist nothing) ───────────────────────── */
    const err = page.locator(".rs-err");

    // multi-file
    await upload(page, "resume-good.pdf", true);
    await expect(err).toContainText("One file at a time");

    // irrelevant file: "doesn't read as a resume" + what's missing
    await upload(page, "resume-irrelevant.pdf");
    await expect(err).toContainText("doesn't read as a resume");
    await expect(err).toContainText("missing");
    await expect(err).toContainText("contact detail");

    // empty
    await upload(page, "resume-empty.pdf");
    await expect(err).toContainText("Almost no text came out");

    // scanned / image-only → NO OCR — re-export guidance
    await upload(page, "resume-scanned.pdf");
    await expect(err).toContainText("image-only export");
    await expect(err).toContainText("Re-export a text-based PDF");

    // oversize
    await upload(page, "resume-oversize.pdf");
    await expect(err).toContainText("Over the 5 MB limit");

    // still run #1, best 100 — rejections never created rows
    await page.reload();
    await page.waitForSelector(".rs-readout");
    await expect(page.locator(".rs-air-note")).toContainText("your latest run counts");

    /* ── re-run flow: the DOCX (content rules, not extensions) ───────────── */
    await upload(page, "resume-good.docx");
    await expect(page.locator(".rs-readout-score")).toContainText("100", { timeout: 45_000 });
    await expect(page.locator(".rs-air-note")).toContainText("your latest run counts", { timeout: 45_000 });
    // content ruled, right-named file → still no fixes needed
    await expect(page.locator(".rs-disc summary", { hasText: "Findings" })).toContainText("no fixes found");

    // extension lying: .pdf name with DOCX content — sniffed by content, flagged
    await upload(page, "resume-mismatch.pdf");
    // wait for the RELOADED document (readout names the new file) before
    // toggling the collapsed findings — clicks can land on the stale doc
    await expect(page.locator(".rs-readout-sub")).toContainText("resume-mismatch.pdf", { timeout: 45_000 });
    await page.locator(".rs-disc summary", { hasText: "Findings" }).click();
    await expect(page.locator(".rs-finding", { hasText: "File extension doesn't match what's inside" })).toBeVisible();
    await expect(page.locator(".rs-air-note")).toContainText("your latest run counts", { timeout: 45_000 });
    // the finding ledger renders — every fix row carries "the move"
    await expect(page.locator(".rs-finding").first()).toBeVisible();
  });
});
