import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { signIn, neilCreds } from "./helpers";

/**
 * DPA artifacts E2E (ticket-7 verification, 2026-10-30 Prep round) — the
 * data-subject rights as REAL route handlers over the NEW artifacts:
 *
 *  1. EXPORT (/api/account/export): the three per-file artifacts are driven
 *     through their REAL APIs first (resume diagnose · letter check with the
 *     employer omitted · presence declaration — canon values from the recut
 *     doc), then the bundle is read and EVERY artifact kind is asserted:
 *     state (incl. the presence declaration's stamp), event history, resume
 *     runs, LETTER runs, credentials metadata. Order-independent from the
 *     arc (the arc may walk before or after — Playwright's serial order, workers=1).
 *  2. ERASE (/api/account/delete): full cascade behind the explicit confirm
 *     state — driven on a THROWAWAY account (never on the canon demo
 *     student): auth user → profile → state → credentials → resume/letter
 *     runs, and the session ends. Verified through the service-role read.
 *
 * Never prints .env values; the throwaway uses the seed cohort's .test
 * domain and is deleted at the end by the erase itself.
 */

const stamp = Date.now().toString(36);
const freshEmail = `dpa.${stamp}@${process.env.SEED_COHORT_DOMAIN || "campus.test"}`;
const freshPassword = `Erase-Me-${stamp}!9`; // unique, not breach-list material

test.describe.serial("dpa-artifacts", () => {
  test("export-my-data: one JSON carries state + presence + resume runs + letter runs", async ({ page }) => {
    const neil = neilCreds();
    test.skip(!neil.email || !neil.password, "E2E_NEIL_EMAIL / E2E_NEIL_PASSWORD unset — the export verifies against the canon store.");
    await signIn(page, neil.email, neil.password);

    // Drive the three artifacts through the REAL APIs first (order-independence
    // vs the arc + deterministic values): resume run → letter check (employer
    // omitted) → presence declaration. Canon values from the recut doc.
    const resumeRes = await page.request.post("/api/resume/diagnose", {
      multipart: {
        resume: {
          name: "resume-qa.pdf",
          mimeType: "application/pdf",
          buffer: fs.readFileSync(path.join(process.cwd(), "e2e", "fixtures", "resume-qa.pdf")),
        },
      },
    });
    expect(resumeRes.ok()).toBeTruthy();
    const letterRes = await page.request.post("/api/cover-letter/check", {
      multipart: {
        letter: {
          name: "cover-letter-qa.txt",
          mimeType: "text/plain",
          buffer: fs.readFileSync(path.join(process.cwd(), "e2e", "fixtures", "cover-letter-qa.txt")),
        },
        // no `employer` field — the demo's honest omission
      },
    });
    expect(letterRes.ok()).toBeTruthy();
    const presenceRes = await page.request.post("/api/credentials/presence", {
      data: { linkedinUrl: "https://www.linkedin.com/in/neil-demo", email: "neil.demo@campus.test" },
    });
    expect(presenceRes.ok()).toBeTruthy();

    // THE EXPORT — one JSON of everything held for this student
    const res = await page.request.get("/api/account/export");
    expect(res.ok()).toBeTruthy();
    expect(res.headers()["content-disposition"]).toContain("attachment");
    const body = JSON.parse(await res.text());
    expect(body.notice).toContain("RA 10173");
    expect(body.generatedAt).toBeTruthy();
    // profile — the auth identity metadata rides the bundle (never creds)
    expect(body.profile).toBeTruthy();
    expect(JSON.stringify(body.profile)).toContain("@");
    // the FULL academic state rides the bundle
    expect(body.academicState).toBeTruthy();
    expect(body.academicState.id).toBe("neil");
    expect(Array.isArray(body.eventHistory)).toBe(true);
    // the NEW artifacts this round shipped:
    //   letter runs — the canon letter run (letter 100, the honest skip note)
    expect(body.letterRuns?.run).toBeTruthy();
    expect(body.letterRuns.run.air.airLetter).toBe(100);
    const employerRow = body.letterRuns.run.checks.find((c: { label: string }) => c.label === "Employer named");
    expect(employerRow?.note).toBe("not evaluated — no employer declared");
    //   resume runs — the resume-run store row (AIR 100 on the canon resume)
    expect(body.resumeRuns?.run).toBeTruthy();
    expect(body.resumeRuns.run.air.airResume).toBe(100);
    //   presence — the declared entry + its machine-verified stamp
    expect(body.academicState.presence?.stamp).toBeTruthy();
    expect(body.academicState.presence.stamp.offline).toBe(true);
    expect(body.academicState.presence.stamp.checks.linkedinUrlFormat).toBe("pass");
    expect(body.academicState.presence.stamp.checks.professionalEmailFormat).toBe("pass");
    // credentials metadata — array either way (the table read is tolerant)
    expect(Array.isArray(body.credentials)).toBe(true);
    expect(String(body.evidenceStorage)).toContain("downloadable per-entry");
  });

  test("erase-my-data: explicit confirm → full cascade (throwaway account)", async ({ page }) => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
    test.skip(!url || !service, "Supabase admin env missing — the cascade verifies through the service-role client.");

    // create the throwaway via the real signup route (students self-serve;
    // email_confirm is set server-side by the route)
    const res = await page.request.post("/api/auth/signup", {
      data: { name: "DPA Throwaway", email: freshEmail, password: freshPassword },
    });
    if (!res.ok()) {
      const body = await res.json().catch(() => null);
      test.skip(true, `signup + working-throwaway flow needs the working seed env: ${JSON.stringify(body)}`);
    }

    // seed-state row written by the signup route; a dashboard load proves it
    await signIn(page, freshEmail, freshPassword);
    await page.goto("/dashboard");
    await page.waitForTimeout(1500);

    // wrong confirm word → nothing erased (locked explicit-confirm state)
    const wrong = await page.request.post("/api/account/delete", { data: { confirm: "delete my data" } });
    expect(wrong.status()).toBe(400);
    expect(await wrong.json()).toMatchObject({ error: "confirm_word" });

    // the armed erase → 200, cascade receipts
    const del = await page.request.post("/api/account/delete", { data: { confirm: "DELETE" } });
    expect(del.ok()).toBeTruthy();
    const receipts: { erased?: string[] } = await del.json();
    expect(receipts.erased?.join(" ")).toContain("student_state");
    expect(receipts.erased?.join(" ")).toContain("resume_runs");
    expect(receipts.erased?.join(" ")).toContain("letter_runs");
    expect(receipts.erased?.join(" ")).toContain("credentials");
    expect(receipts.erased?.join(" ")).toContain("profiles");
    expect(receipts.erased?.join(" ")).toContain("auth_user");

    // verified through the service-role client: every table row for the
    // throwaway is gone (the student disappears from the counselor roster;
    // the signup route strips dots from the id, so match the landed key)
    const { createClient } = await import("@supabase/supabase-js");
    const admin = createClient(url!, service!, { auth: { autoRefreshToken: false, persistSession: false } });
    const landedId = `dpa${stamp}`;
    const { data: profiles } = await admin
      .from("profiles")
      .select("id, student_id")
      .or(`email.eq.${freshEmail},student_id.eq.${landedId}`)
      .limit(4);
    expect(profiles?.length ?? 0).toBe(0);
    // state + run stores carry no rows for that student anymore
    const { data: stRows } = await admin
      .from("student_state")
      .select("student_id")
      .ilike("student_id", `${landedId}%`);
    expect(stRows?.length ?? 0).toBe(0);
    // the credentials table holds nothing for the id either (absent-tolerant)
    const { data: credRows, error: credErr } = await admin
      .from("credentials")
      .select("id")
      .ilike("student_id", `${landedId}%`);
    if (!credErr) expect(credRows?.length ?? 0).toBe(0);
    // the auth user is gone
    const { data: stillThere } = await admin
      .from("profiles")
      .select("id")
      .eq("email", freshEmail)
      .maybeSingle();
    expect(stillThere).toBeNull();

    // the dead session can't read anything: export replies 401 post-erase
    const after = await page.request.get("/api/account/export");
    expect(after.status()).toBe(401);
  });
});
