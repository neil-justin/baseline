import { test, expect } from "@playwright/test";
import { signIn, cohortEmail, DEMO_PASSWORD } from "./helpers";

/**
 * The Account tab's password CONFIRM gate (the Phase-4 field): a client-only
 * consistency check — the submit stays blocked while the confirm entry
 * differs from the new password (the plain-language mismatch note showing),
 * and arms only when the two entries match. This spec fills the form and
 * asserts the gate but NEVER submits — a real change would rotate a seeded
 * demo password out from under the later walks (one worker: the specs share
 * the demo store, and the request path itself is covered by the meter's
 * error map, not here).
 */
test.describe.serial("account password confirm gate", () => {
  test("mismatch blocks the submit · equal entries arm it", async ({ page }) => {
    await signIn(page, cohortEmail("kaye"), DEMO_PASSWORD); // a fixture student, not canon Neil
    await page.goto("/profile");
    await page.click("#tab-account"); // the hook contract: #tab-account → #panel-account
    const card = page.locator("#panel-account .acct-pw");
    const submit = card.getByRole("button", { name: "Change password" });
    const pw = page.locator("#a-pw");
    const confirm = page.locator("#a-pw-confirm");

    await pw.fill("playwright-gate-check-1");
    await confirm.fill("not-the-same-entry");
    const note = card.locator(".presence-err");
    await expect(note).toContainText("Passwords don't match"); // the plain-language note
    await expect(submit).toBeDisabled(); // the gate holds the submit

    await confirm.fill("playwright-gate-check-1");
    await expect(note).toHaveCount(0); // the note leaves when the entries agree
    await expect(submit).toBeEnabled(); // armed — and deliberately left there
  });
});
