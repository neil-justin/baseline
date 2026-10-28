import fs from "node:fs";
import path from "node:path";
import { exec } from "node:child_process";
import type { Page } from "@playwright/test";

/**
 * demo-arc helpers (plan Task 15).
 *  - resetStore(): start each run from a clean store. ADR 0003: with the
 *    Supabase env present this clears the real tables (student_state +
 *    credentials) via a service-role client — plain supabase-js, because
 *    helpers run in node, not through next/headers. Canon Neil reseeds from
 *    code (lib/fixtures/neil.ts) on the next read. Without the env, the
 *    JSON-file delete keeps the offline fallback working.
 *  - kickPort(): free port 3000 of a stale server (dev or an older prod build)
 *    BEFORE playwright boots, so webServer `npm run start` serves the current
 *    production build. Called from the spec's global setup hook only — never
 *    mid-run (it would kill the server the webServer gave us).
 *  - settled(): count-up readouts (~0.9s + 160ms arm) — poll until the text
 *    stops changing, then read the on-screen value (verification honesty:
 *    assert DOM text, not network payloads).
 */

export async function resetStore() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && service) {
    const { createClient } = await import("@supabase/supabase-js");
    const admin = createClient(url, service, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    // neq-sentinel = delete every row (postgrest-js has no delete-all)
    for (const [table, col] of [
      ["student_state", "student_id"],
      ["credentials", "id"],
    ] as const) {
      const { error } = await admin
        .from(table)
        .delete()
        .neq(col, table === "credentials" ? "00000000-0000-0000-0000-000000000000" : "__none__");
      if (error) throw new Error(`resetStore: ${table} delete failed: ${error.message}`);
    }
    return;
  }
  fs.rmSync(path.join(process.cwd(), "data", "state.json"), { force: true });
}

/** Kill whatever holds :3000 and give the OS a second to release it. */
export function kickPort(): Promise<void> {
  return new Promise((resolve) => {
    exec("fuser -k 3000/tcp", () => setTimeout(resolve, 1000)); // `|| true` semantics: fail = port was free
  });
}

/**
 * Auth (ADR 0003): the pages are session-honest — unauthenticated visits
 * redirect to /signin, so every canon walk signs in first. One credential
 * form for every account; the account's role in the session decides the
 * destination (counselor/sysadmin → /admin, student → /dashboard|/onboarding).
 */
export async function signIn(page: Page, email: string, password: string) {
  await page.goto("/signin");
  await page.locator("#f-email").fill(email);
  await page.locator("#f-pass").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL((u) => !u.pathname.startsWith("/signin"));
}

/** Org-like demo cohort addresses (marco@campus.test …) — matches seed-accounts.mjs. */
export function cohortEmail(id: string): string {
  return `${id}@${process.env.SEED_COHORT_DOMAIN || "campus.test"}`;
}

/** The demo staff password (seed-accounts.mjs SEED_PASSWORD default). */
export const DEMO_PASSWORD = process.env.SEED_PASSWORD || "readiness";

/** Neil's E2E credentials from the env — skip with a clear message if unset. */
export function neilCreds(): { email: string; password: string } {
  const email = process.env.E2E_NEIL_EMAIL;
  const password = process.env.E2E_NEIL_PASSWORD;
  if (!email || !password) {
    console.error(
      "E2E_NEIL_EMAIL / E2E_NEIL_PASSWORD are not set in .env.local — the canon walk signs in as Neil (ADR 0003). " +
        "Set them to the seeded Neil account and re-run."
    );
  }
  return { email: email ?? "", password: password ?? "" };
}

/** Poll an element's text every 200ms until it stops changing, then return it. */
export async function settled(page: Page, selector: string, timeout = 8000): Promise<string> {
  const deadline = Date.now() + timeout;
  let last = "";
  await page.waitForSelector(selector, { timeout });
  let stable = 0;
  // loop until two consecutive 200ms samples agree (count-up ~0.9s settles)
  while (Date.now() < deadline) {
    const now = ((await page.textContent(selector)) ?? "").trim();
    if (now === last && now !== "") stable++;
    else stable = 0;
    last = now;
    if (stable >= 2) return last;
    await page.waitForTimeout(200);
  }
  return last;
}

/** Canon money-state screenshots (workspace temp root; viewport 1440×900 per config). */
export async function shot(page: Page, name: string) {
  const dir = "/tmp/opencode/screenshots";
  fs.mkdirSync(dir, { recursive: true });
  await page.screenshot({ path: path.join(dir, name), fullPage: true });
}
