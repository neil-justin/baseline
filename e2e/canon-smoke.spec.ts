import { test, expect } from "@playwright/test";
import { signIn, neilCreds, resetStore } from "./helpers";

/**
 * Smoke slice of the canon asserts — full demo-arc walk (beats 1–10) lands
 * with the remaining surfaces (plan Task 15). Canon: ADR 0002 five-channel
 * re-lock (ES 30 / SP 25 / TP 20 / AR 15 / CC 10) with the ticket-12 split —
 * the seed keeps the AR channel fully unmeasured (grey across 7/5/3); the
 * money beat records 59 once the resume factor lands. Numbers owned by
 * `scripts/verify-fixtures.test.ts` and `lib/fixtures/neil.ts`.
 *
 * ADR 0003: every surface is session-honest — each check signs in as Neil
 * (the demo student whose canon seed lives in lib/fixtures/neil.ts). When
 * E2E_NEIL_EMAIL / E2E_NEIL_PASSWORD are unset the slice skips with a clear
 * message instead of failing on the /signin redirect.
 */

test.describe.serial("canon-smoke", () => {
  const neil = neilCreds();
  test.skip(!neil.email || !neil.password, "E2E_NEIL_EMAIL / E2E_NEIL_PASSWORD unset — add them to .env.local to run the canon smoke.");

  // the tests below read the canon SEED (40) — the store persists across runs
  // (Supabase), so the baseline is established here (workers:1 makes this
  // legal: no other spec's walk is mid-flight at reset, see playwright.config)
  test.beforeAll(async () => {
    await resetStore();
  });

  test("beat-5 canon: dashboard headline is 40, computed not painted", async ({ page }) => {
    await signIn(page, neil.email, neil.password);
    await page.goto("/dashboard");
    // wait for the count-up to settle at its final value
    await page.waitForFunction(() => {
      const el = document.querySelector(".score-big");
      return el && el.textContent && parseInt(el.textContent, 10) > 0;
    });
    await page.waitForTimeout(1200); // count-up 900ms + arm delay 160ms + settle
    expect((await page.textContent(".score-big"))?.trim()).toBe("40");
  });

  test("beat-5 sub-scores: 19/17/0/—/4, the five channels with AR's honest grey", async ({ page }) => {
    await signIn(page, neil.email, neil.password);
    await page.goto("/dashboard");
    const rows = await page.locator(".sub-row").allTextContents();
    expect(rows.length).toBe(5);
    expect(rows[0]).toContain("19 of 25"); // SP: 25×6/8 → 18.75 → 19
    expect(rows[1]).toContain("17 of 30"); // ES: 30×4/7 → 17
    expect(rows[1]).toContain("4 of 7 NACE competencies verified"); // ES receipt
    expect(rows[2]).toContain("0 of 20"); // TP: internship pending evidence
    expect(rows[3]).toContain("Not yet measured"); // AR: no diagnostic run — no stale zero
    expect(rows[4]).toContain("4 of 10"); // CC: picked 1 + plan started 3
    expect((await page.textContent(".journey-row"))?.trim()).toContain("0 of 3 done");
  });

  test("rubric bar arms to honest fractions: SP 0.76, ES 0.567, AR 0, CC 0.4", async ({ page }) => {
    await signIn(page, neil.email, neil.password);
    await page.goto("/dashboard");
    // Poll until every segment has settled at its earned fraction: segments
    // stagger (0/0.08/0.16s delays) over a 1.1s decelerating transition after
    // the ~1.06s count+arm moment — full settle ≈ 2.4s.
    await page
      .waitForFunction(() => {
        const els = document.querySelectorAll(".segbar .seg i");
        const vals = Array.from(els).map((el) => {
          const t = getComputedStyle(el).transform;
          return t === "none" ? 0 : parseFloat(t.replace("matrix(", ""));
        });
        const target = [19 / 25, 17 / 30, 0, 0, 4 / 10];
        return vals.every((v, i) => Math.abs(v - target[i]) < 0.006);
      })
      .catch(() => {});
    const fracs = await page.$$eval(".segbar .seg i", (els) =>
      els.map((el) => getComputedStyle(el).transform)
    );
    const m = fracs.map((t) => (t === "none" ? 0 : parseFloat(t.replace("matrix(", ""))));
    expect(m[0]).toBeCloseTo(0.76, 1); // SP 19 of 25
    expect(m[1]).toBeCloseTo(17 / 30, 1); // ES 17 of 30
    expect(m[2]).toBeLessThan(0.01); // TP 0 of 20
    expect(m[3]).toBeLessThan(0.01); // AR unmeasured
    expect(m[4]).toBeCloseTo(0.4, 1); // CC 4 of 10
  });

  test("state API returns the computed canon view", async ({ page }) => {
    await signIn(page, neil.email, neil.password);
    // page.request shares the session cookies — the API is session-honest
    // (401 unauthenticated); the student param is ignored for students.
    const res = await page.request.get("/api/state?student=neil");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.score.total).toBe(40);
    expect(body.score).toMatchObject({ sp: 19, es: 17, tp: 0, cc: 4 });
    expect(body.score.ar).toBeNull(); // AR unmeasured — honest grey, never a stale zero
    expect(body.career.name).toBe("Associate Software Developer");
  });
});
