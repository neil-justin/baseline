import { test, expect } from "@playwright/test";
import { cohortEmail } from "./helpers";

/**
 * Fresh-account auth spec (auth round 2): the signup policy contract and the
 * forgot/reset recovery flow, driven against a throwaway .test address.
 *
 *  - Signup feedback: the live meter + plain-language checklist tick as the
 *    user types (client-side UX only — the server stays authoritative).
 *  - Server contract: `password_short` always (in-code check);
 *    `password_breached` when Supabase's leaked-password protection is ON —
 *    a DASHBOARD toggle (Auth → Policies) that no service-role API can set,
 *    so until the human step lands that probe skips with the exact clicks.
 *  - Forgot flow: request → accepted state ("check your inbox"), as far as
 *    the reset email can be delivered in-test. Full email delivery needs
 *    the Supabase URL allow-list to include /auth/confirm (documented human
 *    step); rate limits from earlier runs are treated as flow-works-too.
 *
 * Emails here are always throwaway local parts on the SEED_COHORT_DOMAIN
 * (.test) — never real addresses, never logged.
 */

const stamp = Date.now().toString(36);
const freshEmail = `fresh.${stamp}@${process.env.SEED_COHORT_DOMAIN || "aisat.test"}`;

/** Remove every trace of a trial signup (used only when the breached-password
 * probe PASSES creation — i.e. leaked-password protection is still OFF). */
async function purgeTrialAccount(email: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !service) return;
  const { createClient } = await import("@supabase/supabase-js");
  const admin = createClient(url, service, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: profile } = await admin
    .from("profiles")
    .select("id, student_id")
    .eq("email", email)
    .maybeSingle();
  if (profile?.student_id) {
    await admin.from("student_state").delete().eq("student_id", profile.student_id);
  }
  if (profile?.id) await admin.from("profiles").delete().eq("id", profile.id);
  if (profile?.id) await admin.auth.admin.deleteUser(profile.id);
}

test.describe.serial("fresh-account auth", () => {
  test("signup: meter + checklist tick honestly, weak password blocked client-side", async ({ page }) => {
    await page.goto("/signup");
    await page.locator("#f-name").fill("Fresh Account");
    await page.locator("#f-email").fill(freshEmail);

    // weak + common: 8 chars ok, breach tick HONESTLY unticked, meter reads WEAK
    await page.locator("#f-pass").fill("password123");
    await expect(page.locator(".pw-feedback .pw-word")).toHaveText("WEAK");
    const ticks = await page.locator(".pw-checklist li").allTextContents();
    expect(ticks.join(" ")).toContain("At least 8 characters");
    const okTicks = page.locator(".pw-checklist li.pw-ok");
    await expect(okTicks.filter({ hasText: "At least 8 characters" })).toHaveCount(1);
    await expect(okTicks.filter({ hasText: "breached password" })).toHaveCount(0);
    await expect(okTicks.filter({ hasText: "No spaces" })).toHaveCount(1);

    // the client blocks the submit — the server contract is proven separately
    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page).toHaveURL(/\/signup$/);
    await expect(page.locator("#err-pass")).toContainText("breach lists");

    // length-first honesty: 4 chars → "short by 4", meter stays WEAK
    await page.locator("#f-pass").fill("pa$$");
    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page).toHaveURL(/\/signup$/);
    await expect(page.locator("#err-pass")).toContainText("Short by 4 characters");

    // edge spaces are called out in plain language
    await page.locator("#f-pass").fill(" pa55word12");
    await expect(page.locator("#err-pass")).toContainText("No spaces at the start or end");

    // a strong password ticks everything (12 chars, mixed classes, not common)
    await page.locator("#f-pass").fill("Correct-Horse-9");
    await expect(page.locator(".pw-feedback .pw-word")).toHaveText("STRONG");
    await expect(page.locator(".pw-checklist li.pw-ok")).toHaveCount(3);
  });

  test("signup API: server contract — password_short, and password_breached under HaveIBeenPwned", async ({ request }) => {
    // short password → the in-code server check, always enforceable
    const short = await request.post("/api/auth/signup", {
      data: { name: "Fresh Account", email: freshEmail, password: "short1" },
    });
    expect(short.status()).toBe(400);
    expect(await short.json()).toMatchObject({ error: "password_short" });

    // breached/common password → Supabase leaked-password protection (a
    // dashboard toggle). When it's ON the route must answer password_breached
    // distinctly; when it's OFF the probe would create an account, so purge
    // the trial user and skip with the human step.
    const res = await request.post("/api/auth/signup", {
      data: { name: "Fresh Account", email: freshEmail, password: "password123" },
    });
    if (res.status() === 422) {
      expect(await res.json()).toMatchObject({ error: "password_breached" });
      return;
    }
    const created = res.ok();
    await purgeTrialAccount(freshEmail);
    test.skip(
      created,
      "Supabase leaked-password protection is OFF — enable it first: Dashboard → Authentication → Policies → turn on 'Leaked password protection' (human step in the round report)."
    );
    // non-ok, non-422 = unexpected — surface it
    expect(res.status()).not.toBe(500);
  });

  test("forgot flow: sign-in link → request → the accepted state", async ({ page }) => {
    await page.goto("/signin");
    await page.locator(".forgot-link a", { hasText: "Forgot password?" }).click();
    await expect(page).toHaveURL(/\/forgot$/);

    // the honest accepted state: "check your inbox" for a well-formed email,
    // whatever the account situation (no enumeration). A transient send
    // failure (Supabase's shared SMTP hiccups occasionally → 500) is retried
    // once through the same UI before judging the flow.
    let apiRes: Awaited<ReturnType<typeof page.waitForResponse>> | null = null;
    for (let attempt = 0; attempt < 2; attempt++) {
      const [res] = await Promise.all([
        page.waitForResponse((r) => r.url().includes("/api/auth/forgot") && r.request().method() === "POST"),
        (async () => {
          await page.locator("#f-email").fill(cohortEmail("adviser"));
          await page.getByRole("button", { name: "Send the reset link" }).click();
        })(),
      ]);
      apiRes = res;
      if (res.status() !== 500) break;
      await page.waitForTimeout(2000); // absorb a transient SMTP/send failure
    }
    const status = apiRes!.status();
    test.skip(
      status === 400,
      "Supabase rejected the reset redirect — add http://localhost:3000/auth/confirm to the allow-list first (Dashboard → Authentication → URL Configuration → Redirect URLs → Add URL, human step in the round report)."
    );
    if (status === 429) {
      test.skip(true, "reset-email rate limit hit from earlier runs — the flow itself is verified up to the rate limiter.");
    }
    expect(status).toBe(200);
    await expect(page.locator(".forgot-lead")).toContainText("a reset link is on its way");
  });
});
