import { expect, test } from "@playwright/test";
import { DEMO_PASSWORD, cohortEmail, resetStore, settled, signIn } from "./helpers";

/**
 * The Round-8 audit loop end to end (admin round 2026-10-30):
 *  a student DECLARES a credential with evidence + framework-vocabulary
 *  skills → the counselor's Admin audit queue lists it (NEEDS CHECK) →
 *  the counselor's verify ruling stamps VERIFIED (ruled_by + ruled_at)
 *  AND the Round-4 join rides the same write: the cited skill that sits
 *  on the student's target career map CLOSES its gap bar like a platform
 *  completion (feeding SP + TP, ADR 0002 amendment 2; Round-4 lock).
 *
 * Store discipline: resetStore() at the open (student_state + credentials
 * both cleared; cohort personas regenerate code-side on first read).
 *
 * Deterministic math (ADR 0002 five-channel, half-down rounding) — measured
 * against the store's own documented lazy-seed guarantee (lib/db.ts
 * SeededStore: a missing student row resolves to NEIL_SEED — the canon
 * clone, careerId "swd" · SP 19/25 · ES 17/30 · CC 4/10):
 *  Marco, reset-seeded clone → /api/switch {to:"da"} (the transition route)
 *  → the switch dip on the converted 13-row da map: SP 19 → 0, ES 17 and
 *  CC 4 survive per the locked switch semantics (·✓ + goals persist) →
 *  readout 21.
 *  Declares "Data camp certificate" citing "Data Engineering" (a da core row)
 *  → counselor VERIFIES → the join closes 1 bar (SP = roundHalfDown(25×1/13)
 *  = 2; Data Engineering is NOT in da's stage-① queue top-3 — the probe read the
 *  queue — so no TP tick) → readout 2 + 17 + 4 = 23 — the same number on the
 *  dashboard, the cohort roster, and the student detail.
 */

const ROW = "Data camp certificate";

test.describe("credential audit — declare, verify, gap close", () => {
  test.beforeEach(async () => {
    await resetStore();
  });

  test("student declares → counselor verifies → the cited skill closes its gap bar", async ({ page }) => {
    // ═══ the student's side: the store's lazy canon seed → the switch trip ═══
    await signIn(page, cohortEmail("marco"), DEMO_PASSWORD);
    const sw = await page.request.post("/api/switch", { data: { to: "da" } });
    expect(sw.status()).toBe(200);
    await page.goto("/dashboard");
    await expect(page.locator(".band .who .m")).toContainText("Data Analyst");
    await expect.soft(await settled(page, ".score-big")).toBe("21"); // the da dip: SP 19→0, ES 17 + CC 4 survive
    await expect.soft((await page.locator(".sub-row").allTextContents()).at(1) ?? "").toContain("17 of 30"); // the clone's ES receipt — the lazy-seed guarantee made visible

    // ═══ declare the credential: kind, title, evidence, cited skill ═══
    await page.goto("/profile");
    await page.locator("#tab-profile").click(); // the Credentials tab — hook is `#panel-profile`, label content-true
    await page.getByRole("button", { name: "Declare a credential" }).click();
    await page.locator("#c-title").fill(ROW);
    await page.locator("#c-org").fill("Data Camp");
    await page.locator("#c-ev").fill("https://datacamp.example/certificates/marco-santiago.pdf");
    await page.locator(".dec-skill", { hasText: "Data Engineering" }).click();
    await page.getByRole("button", { name: "Declare it" }).click();
    const decRow = page.locator("[data-cred-row]", { hasText: ROW });
    await expect(decRow).toBeVisible();
    await expect(decRow.locator(".chip")).toContainText("NEEDS CHECK"); // honest waiting — the audit rules next

    // ═══ the counselor's console: pending counter, the queue row, the ruling ═══
    await signIn(page, cohortEmail("adviser"), DEMO_PASSWORD); // role redirects to /admin
    await expect(
      page.locator(".band-counts .count", { hasText: "PENDING CREDENTIAL AUDITS" }).locator(".c-val")
    ).toHaveText("1");
    const qrow = page.locator("[data-aq-row]", { hasText: ROW });
    await expect(qrow.locator("[data-aq-status]")).toContainText("NEEDS CHECK");
    await expect(qrow).toContainText("Data Engineering"); // the audit rules what it can see
    await qrow.locator("[data-aq-verify]").click(); // stamps the row + the store reload re-renders the console
    const ruledRow = page.locator("[data-aq-row]", { hasText: ROW });
    await expect(ruledRow.locator("[data-aq-status]")).toContainText("VERIFIED");
    await expect(
      page.locator(".band-counts .count", { hasText: "PENDING CREDENTIAL AUDITS" }).locator(".c-val")
    ).toContainText("0");

    // ═══ the student reads the shared record AND the closing receipts ═══
    await signIn(page, cohortEmail("marco"), DEMO_PASSWORD);
    await page.goto("/profile");
    const his = page.locator("[data-cred-row]", { hasText: ROW });
    await expect(his.locator(".chip")).toContainText("VERIFIED"); // the shared record (read-only now)
    // the join: SP = roundHalfDown(25×1/13) = 2 (no stage-① tick — Data Engineering
    // sits outside the queue top-3), ES 17 + CC 4 carried → 23
    await page.goto("/dashboard");
    await expect(page.locator(".band .who .m")).toContainText("Data Analyst");
    await expect.soft(await settled(page, ".score-big")).toBe("23");
    await expect.soft((await page.locator(".sub-row").allTextContents()).at(0) ?? "").toContain("2 of 25"); // the SP channel receipt

    // ═══ the counselor reads the same number off the roster (beat-10 register) ═══
    // NOTE: the store's lazy-seed guarantee writes the canon clone's NAME for
    // every reset student — the roster row for Marco literally reads "Neil".
    // The honest locator is his career cell: "Data Analyst" is his alone.
    await signIn(page, cohortEmail("adviser"), DEMO_PASSWORD);
    const marcoRow = page.locator(".s-row", { hasText: "Data Analyst" });
    await expect(marcoRow).toHaveCount(1);
    // Marco's own row is NOT .row-demo (it is not the demo row); poll its score cell
    await expect
      .poll(async () => ((await marcoRow.locator(".s-score").textContent()) ?? "").trim(), {
        timeout: 10_000,
      })
      .toBe("23");
  });
});
