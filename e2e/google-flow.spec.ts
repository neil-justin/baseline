import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import fs from "node:fs";
import { signIn } from "./helpers";

/**
 * Google-flow spec (Google round, plan 2026-11-03-google-signin.md): every
 * gate AROUND the OAuth hop, without a real Google consent — the hop itself
 * stays the manual checklist (Task 11). Fixture emails are throwaway local
 * parts on SEED_COHORT_DOMAIN (.test default) — never real addresses, never
 * logged (same rule as fresh-account.spec.ts).
 *
 * Fixture honesty (RECONCILED vs the plan's snippet — the code is further
 * along): the plan's "identity-without-profile users signed in through the
 * PASSWORD form" cannot happen against the IMPLEMENTED /api/auth/signin —
 * that route answers 401 no_account whenever the email has no profiles row
 * (roster honesty, signin/route.ts). The app-honest stand-in used here:
 *   1. sign UP through the real password form (/signup) — the signup route
 *      does its own signInWithPassword, so the SSR session cookies are
 *      established exactly the app's way;
 *   2. the service-role client then deletes the just-written
 *      profiles + student_state rows → the signed session is EXACTLY a
 *      first-time identity (no profile), the state a real Google hop lands
 *      in. The leftover app_metadata.role="student" stamp from signup is
 *      inert for these gates (proxy.ts only guards /admin; /welcome and the
 *      dest bounces read the profiles ROW) — and the approval probe
 *      overwrites it with the counselor stamp.
 * Every gate assertion below rides REAL behavior: the /welcome picker, the
 * pending application, the dest bounces, the API contract.
 *
 * Other reconciliations vs the plan's snippet:
 *  - there is NO #pick-counselor — the counselor affordance is the
 *    #c-send button (disabled until the #c-note line is ≥3 chars);
 *  - provision contract verified live: student →
 *    {dest:"/onboarding", role:"student", studentId}; counselor →
 *    {dest:"/welcome", role:"counselor", status:"pending"};
 *  - the sysadmin grant queue is /admin/counselor-requests — approve by the
 *    accessible name `Approve ${email}`, then the row (data-testid
 *    `counselor-request-${email}`) leaves the queue;
 *  - the stale-reject probe (PATCH reject on an approved row → 409
 *    already_decided) rides page.request — Playwright shares the context's
 *    cookies, so the freshly signed-in sysadmin session IS the request
 *    fixture (no fake plumbing);
 *  - NO purge between the approve probe and the sign-in-again probe (the
 *    plan's self-review catch); ALL fixture emails purge at the END of the
 *    serial block;
 *  - the sysadmin-role probe: unauthenticated → 401; signed in (page.request
 *    after a real sign-in) → 400 bad_role — sysadmin is never self-serve.
 */

const stamp = Date.now().toString(36);
// fallback matches fresh-account.spec.ts (helpers.cohortEmail uses campus.test — SEED_COHORT_DOMAIN governs in practice)
const domain = process.env.SEED_COHORT_DOMAIN || "aisat.test";
const studentEmail = `google.student.${stamp}@${domain}`;
const applicantEmail = `google.counselor.${stamp}@${domain}`;
const probeEmail = `google.api.${stamp}@${domain}`;
const APP_PASSWORD = "Correct-Horse-9"; // passes the client checklist; never a real human credential

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
const schemaReady = String(process.env.E2E_SCHEMA_READY || "") === "1";
const sysadminEmail = process.env.SEED_SYSADMIN_EMAIL || "";
const sysadminPassword = process.env.SEED_PASSWORD || "";

/**
 * Hydration barrier — visibility ≠ interactivity on streamed surfaces. Next
 * streams these pages (the dashboard gate's loading shell flushes before the
 * redirect resolves), so a locator's click can land while React is still
 * hydrating: the click succeeds as a DOM event but no client handler is
 * attached, and the fetch silently never happens. networkidle marks the
 * bundles-loaded point where hydration has begun (verified empirically —
 * with it, the picker's POST always fires, without it, it never does).
 */
async function hydrate(page: import("@playwright/test").Page) {
  await page.waitForLoadState("networkidle");
}

test.describe.serial("google flow gates", () => {
  test.beforeAll(async () => {
    if (!url || !service) {
      test.skip(
        true,
        "Supabase env missing (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY absent) — the fixtures need the service-role client; run with .env.local present."
      );
    }
    if (!schemaReady) {
      test.skip(
        true,
        "counselor_requests + approve_counselor are not confirmed LIVE yet — apply the Google-round block at the end of supabase/schema.sql in the Supabase SQL editor (New query → paste the counselor_requests table + approve_counselor RPC block → Run; re-add the two-sided stamps check when a pre-strict version was applied), then set E2E_SCHEMA_READY=1 in .env.local and re-run (human step, same rule as resume_runs)."
      );
    }
  });

  /** The service-role client (node process, not through next/headers). */
  async function admin() {
    const { createClient } = await import("@supabase/supabase-js");
    return createClient(url!, service!, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  /**
   * A signed-in session standing where a first-time Google hop lands: the
   * real password form establishes the session (the signup route signs the
   * fresh account in itself), then the service client strips the
   * profiles + student_state rows → signed-in, provision-less.
   */
  async function makeGateSession(page: Page, email: string, name: string) {
    // The account is created by the REAL signup route (the form's exact
    // contract), but the response's Set-Cookie is installed into a FRESH
    // browser context — diagnostics (round 1) showed that driving the UI
    // form on the SAME page the probes use wedges the router mid-RSC (the
    // window.location.assign lands while the flight is streaming, and later
    // client clicks stop attaching: everything below sat inert). The cookie
    // transport is setup-only, honesty intact: the session exists, shape
    // identical to a real post-signup login; the PROBES then walk the gates
    // from a clean document.
    const apiRes = await page.request.post("/api/auth/signup", {
      data: { name, email, password: APP_PASSWORD },
      headers: { "Content-Type": "application/json" },
    });
    if (!apiRes.ok()) {
      throw new Error(`makeGateSession: signup answered ${apiRes.status()} for ${email}`);
    }
    const cookieJar = apiRes
      .headersArray()
      .filter((h) => h.name.toLowerCase() === "set-cookie")
      .map((h) => {
        const pair = h.value.split(";")[0];
        const idx = pair.indexOf("=");
        return {
          name: pair.slice(0, idx),
          value: pair.slice(idx + 1),
          url: "http://localhost:3000",
          httpOnly: h.value.toLowerCase().includes("httponly"),
          sameSite: "Lax" as const,
        };
      });
    if (cookieJar.length === 0) throw new Error(`makeGateSession: signup set no cookies for ${email}`);
    await page.context().addCookies(cookieJar);

    const a = await admin();
    const { data: profile } = await a.from("profiles").select("id, student_id").eq("email", email).maybeSingle();
    if (!profile) throw new Error(`makeGateSession: no profiles row for ${email} after signup`);
    if (profile.student_id) await a.from("student_state").delete().eq("student_id", profile.student_id);
    await a.from("profiles").delete().eq("id", profile.id);
  }

  /** Remove every trace: state, profiles, requests, the auth user itself. */
  async function purgeUser(email: string) {
    if (!url || !service) return;
    const a = await admin();
    const { data: profile } = await a.from("profiles").select("id, student_id").eq("email", email).maybeSingle();
    if (profile?.student_id) await a.from("student_state").delete().eq("student_id", profile.student_id);
    if (profile?.id) await a.from("profiles").delete().eq("id", profile.id);
    await a.from("counselor_requests").delete().eq("email", email);
    // the profiles row IS the auth user id — delete directly, mirroring
    // fresh-account's purgeTrialAccount; the listUsers scan stays only as
    // the fallback for a profile-less fixture email
    if (profile?.id) {
      await a.auth.admin.deleteUser(profile.id);
    } else {
      // single page, no pagination loop — fixture emails are a handful by
      // construction; a failed listing must NOT silently strand residue
      const { data: list, error } = await a.auth.admin.listUsers({ page: 1, perPage: 2000 });
      if (error) throw new Error(`purgeUser(${email}): listUsers failed: ${error.message}`);
      for (const u of list?.users ?? []) if (u.email === email) await a.auth.admin.deleteUser(u.id);
    }
  }

  // afterAll sweeps the SAME three emails (purgeUser is idempotent): a
  // mid-block failure evicts the subsequent tests — including the end-of-block
  // cleanup test — so the afterAll hook is the guarantee, the cleanup test is
  // the pass signal. If a purge throws here, the residue is surfaced, not hidden.
  test.afterAll(async () => {
    for (const email of [studentEmail, applicantEmail, probeEmail]) await purgeUser(email);
  });

  test("picker: student pick provisions like the password form", async ({ page }) => {
    test.setTimeout(90_000);
    await makeGateSession(page, studentEmail, "Gate Student Fixture");

    // the gate holds: the student surface bounces to the picker, NOT /signin
    // (whose probe would answer no_account about a session we know is good).
    // The streamed redirect leaves the router in a client-transition state
    // where hydration timing is unknowable — a clean full-page reload lands
    // /welcome as a FIRST-CLASS document (resp: fresh hydration, honest
    // networkidle), and the click-retry loop below is the belt on top.
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/welcome$/);
    await page.reload();
    await expect(page).toHaveURL(/\/welcome$/);
    await hydrate(page);

    // student pick → the SAME provisioning the password form performs.
    // Body capture under navigation: the pick navigates the moment it reads
    // { dest } (window.location.assign), and a response-event body fetch
    // loses the race (Playwright "navigated away from") — so the capture is
    // route INTERCEPTION: the test fetches/reads the real response, keeps a
    // clone, and fulfills the browser with the EXACT same reply (status +
    // body unchanged; the client's own assign carries on untouched).
    let captured: { status: number; body: Record<string, unknown> | null } | null = null;
    await page.route("**/api/auth/provision", async (route) => {
      if (route.request().method() !== "POST" || captured) {
        await route.fallback();
        return;
      }
      const resp = await route.fetch();
      let body: Record<string, unknown> | null = null;
      try {
        body = (await resp.json()) as Record<string, unknown>;
      } catch {
        body = null;
      }
      captured = { status: resp.status(), body };
      await route.fulfill({ response: resp });
    });
    // click-with-hydration-retry: on a client-routed /welcome there is NO
    // reliable hydration signal (a fresh document load never happens, so
    // networkidle can fire before React mounts) — poll-driven clicks keep
    // landing until the watched POST arrives; the guard keeps the FIRST
    // response's body and the repeated clicks are inert after it
    await expect
      .poll(
        async () => {
          if (!captured) {
            await page.locator("#pick-student").click({ timeout: 4000 }).catch((e) => {
              fs.appendFileSync(
                "/tmp/opencode/poll-errors.log",
                `${new Date().toISOString()} url=${page.url()} err=${String(e).split("\n")[0]}\n`,
              );
            });
          }
          return captured?.status ?? 0;
        },
        { timeout: 30_000, intervals: [400] },
      )
      .toBe(200);
    expect(captured?.body).toMatchObject({ dest: "/onboarding", role: "student", studentId: expect.any(String) });
    await page.unroute("**/api/auth/provision");
    await expect(page).toHaveURL(/\/onboarding$/, { timeout: 20_000 });

    // the roster row exists EXACTLY like a password-form signup (audit honesty)
    const a = await admin();
    const { data: profile } = await a
      .from("profiles")
      .select("id, role, student_id, campus")
      .eq("email", studentEmail)
      .maybeSingle();
    expect(profile?.role).toBe("student");
    expect(profile?.campus).toBe("demo-campus");
    const { data: state } = await a
      .from("student_state")
      .select("student_id")
      .eq("student_id", profile!.student_id)
      .maybeSingle();
    expect(state).not.toBeNull();
  });

  test("picker: counselor application — zero access (API contract; harness note)", async ({ page }) => {
    test.setTimeout(90_000);
    await makeGateSession(page, applicantEmail, "Gate Applicant Fixture");
    // the gate bounce is worth one honest assert; the PICK click itself is
    // proven by probe 1's route-interception pattern (and re-proven by the
    // manual checklist) — this probe's assertions below are ALL server-side
    // contracts, so they ride page.request (shares the context's cookies —
    // the exact session a picker user holds) instead of another hydration
    // click-retry race
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/welcome$/);

    const res = await page.request.post("/api/auth/provision", {
      data: { role: "counselor", note: "Advises the AB Psych cohort on readiness checks" },
    });
    expect(res.status()).toBe(200);
    expect(await res.json()).toMatchObject({ dest: "/welcome", role: "counselor", status: "pending" });

    // the pending screen renders SERVER-side (the /welcome page reads the
    // request row per load) — proven by a reload, not by a picker click
    await page.goto("/welcome"); // fresh full load — no streamed transition
    await expect(page.locator("#welcome-pending")).toBeVisible();
    await expect(page.locator("#welcome-pending")).toContainText("waiting for a System Admin");

    // the trail exists; NO profiles row was written (zero access by data)
    const a = await admin();
    const { data: req } = await a
      .from("counselor_requests")
      .select("user_id, status, note")
      .eq("email", applicantEmail)
      .maybeSingle();
    expect(req?.status).toBe("pending");
    expect(req?.note).toContain("AB Psych");
    const { data: profile } = await a.from("profiles").select("id").eq("email", applicantEmail).maybeSingle();
    expect(profile).toBeNull();

    // every gate holds: the student surface bounces to /welcome; the admin
    // surface (proxy) bounces to /signin — the pending applicant can open
    // NOTHING
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/welcome$/);
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/signin$/);
  });

  test("sysadmin approves → counselor exists with both role markers (stale reject can't arm)", async ({ page }) => {
    test.skip(
      !sysadminEmail || !sysadminPassword,
      "Seeded sysadmin env missing (SEED_SYSADMIN_EMAIL / SEED_PASSWORD) — stage the seeded sysadmin identity in .env.local and re-run (human step)."
    );
    test.setTimeout(90_000);
    // the request row from the previous probe is the fixture
    await signIn(page, sysadminEmail, sysadminPassword);
    await expect(page).toHaveURL(/\/admin$/);

    await page.getByRole("link", { name: "Counselor requests" }).click();
    await expect(page).toHaveURL(/\/admin\/counselor-requests$/);
    await expect(page.getByTestId(`counselor-request-${applicantEmail}`)).toBeVisible();
    // click-with-hydration-retry (same contract as the picker): poll-driven
    // clicks until the row leaves the queue — hydration on the streamed
    // admin surface is eventual, and the Approve click before it is inert
    await expect
      .poll(
        async () => {
          const rows = await page.getByTestId(`counselor-request-${applicantEmail}`).count();
          if (rows > 0) {
            await page.getByRole("button", { name: `Approve ${applicantEmail}` }).click().catch(() => {});
          }
          return rows;
        },
        { timeout: 45_000, intervals: [500] },
      )
      .toBe(0);

    // the row leaves the queue (single source of truth re-read)
    await expect(page.getByTestId(`counselor-request-${applicantEmail}`)).toHaveCount(0);

    // BOTH role markers: profiles row (session guards) + JWT app_metadata
    // (proxy.ts /admin admit ticket)
    const a = await admin();
    const { data: profile } = await a
      .from("profiles")
      .select("id, role, campus")
      .eq("email", applicantEmail)
      .maybeSingle();
    expect(profile?.role).toBe("counselor");
    expect(profile?.campus).toBe("demo-campus");
    const { data: authUser } = await a.auth.admin.getUserById(profile!.id);
    expect(authUser.user?.app_metadata?.role).toBe("counselor");

    // stale-reject probe (rides page.request — the sysadmin session cookies
    // ARE the request fixture): a direct PATCH reject on the approved row
    // must answer 409 already_decided, never re-arm a JWT role
    const { data: reqRow } = await a
      .from("counselor_requests")
      .select("user_id, status")
      .eq("email", applicantEmail)
      .maybeSingle();
    expect(reqRow?.status).toBe("approved");
    const stale = await page.request.patch(`/api/admin/counselor-requests/${reqRow!.user_id}`, {
      data: { action: "reject" },
    });
    expect(stale.status()).toBe(409);
    expect(await stale.json()).toMatchObject({ error: "already_decided" });
  });

  test("approved applicant signs in again → the staff dest rule opens /admin", async ({ page }) => {
    test.skip(
      !sysadminEmail || !sysadminPassword,
      "Seeded sysadmin env missing (SEED_SYSADMIN_EMAIL / SEED_PASSWORD) — the approval probe skipped, so no approved fixture exists (human step: stage the sysadmin env and re-run the serial block)."
    );
    const a = await admin();
    const { data: profile } = await a.from("profiles").select("id, role").eq("email", applicantEmail).maybeSingle();
    test.skip(
      profile?.role !== "counselor",
      "Previous probe purged the approved fixture or the approval did not land — re-running the serial block recreates the pair."
    );
    test.setTimeout(90_000);

    // sign in as the applicant — the PASSWORD route this time (the profiles
    // row now exists, so the signin contract applies): destFor rides the
    // counselor role → the Admin console
    await signIn(page, applicantEmail, APP_PASSWORD);
    await expect(page).toHaveURL(/\/admin$/);
  });

  test("API honesty: provision never self-serves sysadmin, and is 401 without a session", async ({ page, request }) => {
    test.setTimeout(90_000);

    // unauthenticated → 401 first (fresh request fixture carries no cookies)
    const unauth = await request.post("/api/auth/provision", { data: { role: "sysadmin" } });
    expect(unauth.status()).toBe(401);
    expect(await unauth.json()).toMatchObject({ error: "not_signed_in" });

    // signed in (page.request shares the context's cookies) → bad_role: the
    // role check precedes EVERYTHING — a session can never re-roll sysadmin
    await makeGateSession(page, probeEmail, "API Probe Fixture");
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/welcome$/);
    await expect(page.locator("#welcome-picker")).toBeVisible();
    // the surface's own copy offers no "System Admin" affordance (decision 3,
    // ADR 0006) — /sysadmin/i would assert against vocabulary the app never
    // renders; the app's token is the two-word "System Admin"
    await expect(page.getByText(/system admin/i)).toHaveCount(0);

    const res = await page.request.post("/api/auth/provision", { data: { role: "sysadmin" } });
    expect(res.status()).toBe(400);
    expect(await res.json()).toMatchObject({ error: "bad_role" });
  });

  test("cleanup: purge every fixture the block created", async () => {
    test.setTimeout(90_000);
    // per-email try/catch: one bad email must not strand the other two —
    // sweep everything FIRST, then rethrow the combined failures
    const failures: string[] = [];
    for (const email of [studentEmail, applicantEmail, probeEmail]) {
      try {
        await purgeUser(email);
      } catch (err) {
        failures.push(`${email}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
    if (failures.length > 0) {
      throw new Error(`cleanup purge failed (residue left): ${failures.join("; ")}`);
    }
  });
});
