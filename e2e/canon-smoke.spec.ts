import { test, expect } from "@playwright/test";
import { signIn, neilCreds } from "./helpers";

/**
 * Smoke slice of the canon asserts — full demo-arc walk (beats 1–10) lands
 * with the remaining surfaces (plan Task 15). Canon: `_fixture-math.md`.
 *
 * ADR 0003: every surface is session-honest — each check signs in as Neil
 * (the demo student whose canon seed lives in lib/fixtures/neil.ts). When
 * E2E_NEIL_EMAIL / E2E_NEIL_PASSWORD are unset the slice skips with a clear
 * message instead of failing on the /signin redirect.
 */

test.describe.serial("canon-smoke", () => {
  const neil = neilCreds();
  test.skip(!neil.email || !neil.password, "E2E_NEIL_EMAIL / E2E_NEIL_PASSWORD unset — add them to .env.local to run the canon smoke.");

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

  test("beat-5 sub-scores: 30/0/0/10 with honest ES line", async ({ page }) => {
    await signIn(page, neil.email, neil.password);
    await page.goto("/dashboard");
    const rows = await page.locator(".sub-row").allTextContents();
    expect(rows.length).toBe(4);
    expect(rows[0]).toContain("30 of 40");
    expect(rows[1]).toContain("0 of 25");
    expect(rows[1]).toContain("full situations battery");
    expect(rows[2]).toContain("0 of 20");
    expect(rows[3]).toContain("10 of 15");
    expect((await page.textContent(".journey-row"))?.trim()).toContain("0 of 3 done");
  });

  test("rubric bar arms to honest fractions: SP 0.75, CC 0.667", async ({ page }) => {
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
        const target = [0.75, 0, 0, 10 / 15];
        return vals.every((v, i) => Math.abs(v - target[i]) < 0.006);
      })
      .catch(() => {});
    const fracs = await page.$$eval(".segbar .seg i", (els) =>
      els.map((el) => getComputedStyle(el).transform)
    );
    const m = fracs.map((t) => (t === "none" ? 0 : parseFloat(t.replace("matrix(", ""))));
    expect(m[0]).toBeCloseTo(0.75, 1); // SP 30 of 40
    expect(m[1]).toBeLessThan(0.01); // ES 0 of 25
    expect(m[2]).toBeLessThan(0.01); // TP 0 of 20
    expect(m[3]).toBeCloseTo(0.667, 1); // CC 10 of 15
  });

  test("state API returns the computed canon view", async ({ page }) => {
    await signIn(page, neil.email, neil.password);
    // page.request shares the session cookies — the API is session-honest
    // (401 unauthenticated); the student param is ignored for students.
    const res = await page.request.get("/api/state?student=neil");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.score.total).toBe(40);
    expect(body.score).toMatchObject({ sp: 30, es: 0, tp: 0, cc: 10 });
    expect(body.career.name).toBe("Software Developer");
  });
});
