import { test, expect, type Page } from "@playwright/test";
import * as path from "node:path";
import { signIn, neilCreds, resetStore } from "./helpers";

/**
 * Resume Diagnostic E2E (round 6a) — Prep → Resume as the single Prep surface.
 * Sign in → prep empty-state on-ramp → guide + template → upload the generated
 * synthetic fixtures (e2e/fixtures/, real files — scripts/make-resume-artifacts.mjs)
 * → three-factor feedback renders → re-run → locked rejection matrix.
 * Cleanup: the suite is serialized on ONE worker (playwright.config.ts — the
 * specs share one Supabase-backed demo store), so this beforeAll is a legal
 * FULL reset: canon Neil reseeds (career swd, catalog round 9: verified
 * "Data Design / SQL + data modeling" + "Business Needs Analysis") and the
 * resume-run persistence (resume_runs / offline JSON) clears.
 */

const FIX = (n: string) => path.join(process.cwd(), "e2e", "fixtures", n);

/**
 * Upload flow for the harness: select the file, click Run, then WAIT FOR THE
 * DOCUMENT to be live again. A successful run re-loads the full document
 * (server-rendered from the store — see ResumeUpload), so pre-reload clicks
 * can hit the stale document while the navigation is settling; rejections
 * stay in-place and the load-state wait is a no-op for them.
 */
async function upload(page: Page, fixture: string, multi = false) {
  const input = page.locator('.rs-upload input[type="file"]');
  const files = multi ? [FIX(fixture), FIX("resume-good.pdf")] : FIX(fixture);
  await input.setInputFiles(files);
  await page.getByRole("button", { name: "Run the diagnostic" }).click();
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

    /* ── empty state: the on-ramp (Q7a) ──────────────────────────────────── */
    await page.goto("/prep");
    await page.waitForSelector(".rs-upload");
    await expect(page.getByRole("heading", { name: "Resume Diagnostic" })).toBeVisible();
    await expect(page.locator(".prep-sublabel", { hasText: "the system advises the resume" })).toBeVisible();

    // honest AIR read: not yet measured (never painted)
    await expect(page.locator(".rs-notyet")).toContainText("not yet measured");

    // the on-ramp routes to guide + template, personalized from Neil's state;
    // named skills are asserted in the unit suite (NEIL_SEED) — here we assert
    // the personalized rows exist and trace to their sources
    await expect(page.locator(".rs-list-src", { hasText: "verified skills · your state" })).toBeVisible();
    // deterministic with workers:1: canon Neil's verified set (catalog round 9)
    // (scoped to the verified-skills row — the keyword-floor row repeats the row
    // names, so the bare text matches two elements)
    await expect(
      page
        .locator(".rs-listrow").filter({ has: page.locator(".rs-list-src", { hasText: "verified skills · your state" }) })
        .locator("b", { hasText: "Data Design / SQL + data modeling" })
    ).toBeVisible();
    await expect(page.locator(".rs-list-src", { hasText: "target role · " })).toBeVisible();
    await expect(page.locator(".rs-list-src").first()).toBeVisible();

    // guide + template links are reachable
    await page.getByRole("link", { name: /Start here — the format guide/ }).click();
    await expect(page.getByRole("heading", { name: "Resume format guide" })).toBeVisible();
    await expect(page.locator('a[download][href="/resume-reference.docx"]')).toBeAttached();
    await expect(page.locator('a[download][href="/resume-reference.pdf"]')).toBeAttached();
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

    // three deterministic factors, all checks green on the generated resume
    await expect(page.locator(".rs-factor-head").first()).toContainText("Parseability — 100%");
    await expect(page.locator(".rs-factor-head", { hasText: "Format conformance" })).toContainText("100%");
    await expect(page.locator(".rs-factor-head", { hasText: "Keyword alignment" })).toContainText("100%");
    await expect(page.locator(".rs-check", { hasText: "One page" })).toBeVisible();
    // keyword ledger names the role's core-tier skills
    await expect(page.locator(".rs-check", { hasText: "SQL" })).toBeVisible();

    // AIR provenance line: gate × format × keywords (1 × 1 × 1)
    await expect(page.locator(".rs-air-note")).toContainText("parse gate 1 × format 1 × keywords 1", { timeout: 45_000 });
    await expect(page.locator(".rs-air-note")).toContainText("1 run");
    // feedback honesty: no fixes needed → the null-findings line, no pasted text
    await expect(page.locator(".b-head .helper", { hasText: "No fixes found in this run" })).toBeVisible();

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
    await expect(page.locator(".rs-air-note")).toContainText("1 run");

    /* ── re-run flow: the DOCX (content rules, not extensions) ───────────── */
    await upload(page, "resume-good.docx");
    await expect(page.locator(".rs-readout-score")).toContainText("100", { timeout: 45_000 });
    await expect(page.locator(".rs-air-note")).toContainText("2 runs", { timeout: 45_000 });
    // content ruled, right-named file → still no fixes needed
    await expect(page.locator(".b-head .helper", { hasText: "No fixes found in this run" })).toBeVisible();

    // extension lying: .pdf name with DOCX content — sniffed by content, flagged
    await upload(page, "resume-mismatch.pdf");
    await expect(page.locator(".rs-finding", { hasText: "File extension doesn't match what's inside" })).toBeVisible({ timeout: 45_000 });
    await expect(page.locator(".rs-air-note")).toContainText("3 runs", { timeout: 45_000 });
    // the finding ledger renders — every fix row carries "the move"
    await expect(page.locator(".rs-finding").first()).toBeVisible();
  });
});
