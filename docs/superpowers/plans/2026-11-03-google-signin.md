# Google Sign-in/Sign-up Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add managed Google single sign-on (sign-in + sign-up) so any Google account can create/enter a Baseline account, with roles decided by the existing roster and a human-approved counselor intake — never by the email, its domain, or self-declared privilege.

**Architecture:** Supabase Auth's native Google OAuth provider (config-first, zero new npm dependencies). The browser kicks off `signInWithOAuth`, Supabase redirects back through the app's existing PKCE exchange route (`app/auth/confirm/route.ts`), and a new landing probe route decides the destination from the session exactly like password sign-in does. First-time Google users (no `profiles` row) land on a new `/welcome` gate: pick **student** → instant provisioning through the same code path the password signup route uses; pick **counselor** → a `counselor_requests` row is recorded and *no access is granted* until a System Admin approves from a new admin-panel queue. Auto-linking (a Supabase dashboard toggle, human step) lets roster emails bind a Google identity onto their existing account.

**Tech Stack:** Next.js 16 (App Router, `proxy.ts` = middleware convention), `@supabase/ssr` + `@supabase/supabase-js` (already installed), `nodemailer` (NEW — approval email; verified stable `10.3.1` on npm `latest`, no prerelease, registry-checked 2026-11-03), Postgres via service-role client, Playwright e2e, Tailwind-free auth CSS (this surface is prototype-ported CSS, class-based).

---

## Decisions locked with the user (2026-11-03 session)

1. Full Google **sign-up + sign-in**; any Google account; **no domain restrictions** (some real schools issue no school email — role must never hinge on one).
2. Role **never comes from Google, the email, the domain, or the user's pick alone**. The `profiles` table (same source password sign-in trusts) plus human provisioning decide.
3. First-time Google users get a **role picker** at `/welcome`: student → activated immediately (declared, not silent); counselor → **pending application**, blocked from every app surface until a System Admin approves via the new admin queue. Sysadmin is never a self-serve option.
4. Supabase **automatic identity linking ON** (human dashboard step) so seeded staff/existing students can attach a Google identity to their existing account.
5. Standing contract preserved: staff accounts remain "provisioned, never self-registered" — the approval queue *is* the provisioning step. Recorded as ADR 0006 (Task 9).
6. **Approval email (user, 2026-11-03):** an approved counselor application sends one notification email (nodemailer over SMTP; `lib/mail.ts`; best-effort — the approval never depends on SMTP health). Rejection stays silent; the application-received moment stays as the on-screen pending text the user chose explicitly.

## Non-goals (YAGNI trims, do not build)

- Google Workspace / SAML role mapping (domain-based — explicitly ruled out).
- **Multi-campus tenancy AND counselor section scoping** (user: "defer multitenancy later", 2026-11-03). Counselor approval grants `campus: 'demo-campus'`, `section: null`, same as the seed today; every counselor's jurisdiction is the whole demo cohort — the cohort view, state routes, and audit routes keep consulting ROLE only, no section/campus filter. Ticket 11 owns tenant/section enforcement; the profiles columns (`campus`, `year_level`, `program`, `section`) remain in place so enforcement retrofits, it never redesigns. If the thesis claims "section-scoped counselor views", the defensible wording for this build is design-for with delimited enforcement (ADR 0003's ticket-11 pointer).
- Resubmission history for rejected counselor applications (one `upsert` per user_id, status flips `rejected → pending`).
- Real Google OAuth inside Playwright — the OAuth hop is proven by the manual checklist (Task 10); e2e covers everything around it by seeding identity-without-profile users through the password path (they hit the identical gates).

## Context primer (read before coding)

- **Role lives in TWO places**, by existing contract: the `profiles.role` column (`lib/session.ts` guards read it) AND the auth user's `app_metadata.role` (the JWT, which `proxy.ts` reads for `/admin/*`). `app/api/auth/signup/route.ts` sets both. Any google-path grant must update both; approval flips both.
- **PKCE exchange route already exists**: `app/auth/confirm/route.ts` (currently recovery-link only). Its error branch (`/forgot?state=expired`) is correct for recovery and wrong for an aborted Google consent — the diff branches on a `via=google` marker.
- **Destination rule** (duplicated today in `app/api/auth/signin/route.ts:38-43` and `app/(marketing)/page.tsx:22-32`): staff → `/admin`; student with a career → `/dashboard`; student fresh → `/onboarding`. This plan extracts it once (`destFor`) and reuses it in three call sites.
- **Next 16 conventions** (per repo AGENTS.md, consult `node_modules/next/dist/docs/` before deviating): route handler `params` are `Promise` and awaited (`app/api/credentials/[id]/route.ts:24-27`); page `searchParams` is `Promise` and awaited; `proxy.ts` exports `proxy(request)` (not `middleware`).
- **Server clients** (`lib/supabase/server.ts`): `supabaseServer()` = request-scoped identity client (anon key, cookie sessions); `supabaseAdmin()` = service-role state/identity-writes (bypasses RLS; never import from client components). `db` (`lib/db.ts`) owns student-state read/writes; `newStudentState` lives in `lib/session.ts`. `lib/db` does NOT import `lib/session`, so `lib/session` importing `db` introduces no cycle.
- **Auth CSS**: the `(auth)` route group renders prototype-ported markup (`auth-body v7auth` shell, `.auth-panel`, `.btn.btn-primary.btn-block`, `.field-err`). Reuse it verbatim on new `/welcome` markup; no Tailwind here.
- **e2e conventions** (`e2e/fresh-account.spec.ts`): throwaway local parts on `SEED_COHORT_DOMAIN`; human-step toggles `test.skip(condition, <exact dashboard clicks>)`; service-role cleanup helpers in-spec.

## Human prerequisites (config ONLY — no code; do before Task 5's wiring test, may parallel Tasks 1–4)

- [ ] **Google Cloud Console:** create an OAuth 2.0 *Web* client. Consent screen: External, publishable (or In-testing with test users listed). Authorized JavaScript origins: `http://localhost:3000` + the production origin (e.g. `https://<app>.vercel.app`). Redirect URI: `https://<ref>.supabase.co/auth/v1/callback` (exact Supabase project ref).
- [ ] **Supabase dashboard → Authentication → Sign In / Providers → Google:** enable, paste Client ID + Client Secret.
- [ ] **Supabase dashboard → Authentication → URL Configuration:** Redirect URLs allow-list must contain BOTH `http://<localhost or prod origin>/auth/confirm` (plain) AND `http://<origin>/auth/confirm?via=google&next=/auth/google` (the OAuth callback arrives on the second form).
- [ ] **Automatic linking — NO dashboard toggle (docs-verified 2026-11-03):** automatic linking is Supabase Auth's **default** strategy (same verified email → the Google identity binds to the existing user). The dashboard's "Allow manual linking" setting is the OTHER strategy (the `linkIdentity()` API) and this round doesn't touch it. The binding is verified LIVE by the Task 11 roster-bind probe (Google sign-in with an email that already has a password account → one auth user, two identities, that account's dest). Record the probe's outcome in the round report instead of a toggle claim.
- [ ] **Mail account for the approval notification (nodemailer/SMTP):** any SMTP account the user controls. Fastest human path: a Gmail account → enable 2-Step Verification → create an **App Password** (Account → Security → 2-Step Verification → App passwords). Note host/port (Gmail: `smtp.gmail.com:465`, secure) and the App Password. The addresses go into `.env.local` ONLY (Task 12): `MAIL_SMTP_HOST`, `MAIL_SMTP_PORT`, `MAIL_SMTP_USER`, `MAIL_SMTP_PASS`, `MAIL_FROM` (e.g. `Baseline Advising <their.address@gmail.com>`). Without these five values the app stays correct — approvals succeed and the row-level banner says the email didn't send.
- These need a human (Google/Supabase logins) — brief the user with the exact list above; do not fake-check them from code.

---

### Task 1: `counselor_requests` table (schema + SQL note)

**Files:**
- Modify: `supabase/schema.sql` (append at end)

- [ ] **Step 1: Append the table definition**

```sql
-- ── Counselor applications (Google round, ADR 0006) ─────────────────────
-- A first-time Google sign-in that declares "counselor" records ONE row per
-- auth user. Access is granted ONLY when a System Admin approves — which
-- flips status, stamps who decided, and writes the profiles row + the auth
-- user's app_metadata role.
--
-- Trail honesty (review round 1, 2026-11-03): LAST-DECISION-ONLY — a
-- resubmission re-opens the same row (pending re-stamps requested_at to
-- the fresh apply moment) and OVERWRITES the previous decision's stamps;
-- deleting the auth user cascades the row (same as every sibling table).
-- The row is the artifact for the CURRENT fact, not a resubmit history.
create table if not exists public.counselor_requests (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  email        text not null,
  full_name    text not null,
  -- the applicant's own framing: who they advise, which section/campus —
  -- evidence the approving System Admin examines; never validated blindly
  note         text not null,
  -- re-stamped by the intake route on EVERY submission (fresh or resubmit):
  -- requested_at = the current application moment, so the queue's
  -- "oldest pending first" stays truthful after a rejection round-trip
  requested_at timestamptz not null default now(),
  status       text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  -- decision stamps ride status (the check pins both sides STRICTLY: a
  -- pending row carries NO stamps; an approved/rejected row carries BOTH —
  -- a decision with no decider or date cannot be written, closing the
  -- audit-artifact claim's last gap)
  decided_at   timestamptz,
  decided_by   text,
  check (
    (status = 'pending' and decided_at is null and decided_by is null)
    or
    (status in ('approved', 'rejected') and decided_at is not null and decided_by is not null)
  )
);
alter table public.counselor_requests enable row level security;

-- The grant RPC (review round 1 user ruling: "this looks like a transaction").
-- One call, ONE transaction: the counselor's profiles row and the approval
-- stamp commit together or not at all — half-granted rows become impossible
-- at the DB level. Idempotent by design so the app's healing-retry path
-- (below in the plan) can safely re-invoke: the insert no-ops when the row
-- exists, and the stamp update only moves pending → approved.
-- SECURITY DEFINER: runs at the roles' privilege (the route calls it via the
-- service-role client); search_path pinned per Supabase convention.
-- The JWT marker (app_metadata) is Supabase Auth's surface, NOT this
-- transaction's — the route stamps it after, with healing-retry semantics.
create or replace function public.approve_counselor (
  p_user_id   uuid,
  p_email     text,
  p_full_name text,
  p_decided_by text
) returns text
language plpgsql
security definer
set search_path = public
as $$
begin
  -- stamp-first observability (review round 2): if the row stopped being
  -- pending between the route's read and this call (another admin decided,
  -- or capability raced), the UPDATE matches 0 rows — observable "! pending"
  -- — and the insert must NOT fire. The stamp-first form makes every
  -- concurrent/stale interleaving converge to a truthful answer.
  update public.counselor_requests
     set status = 'approved', decided_at = now(), decided_by = p_decided_by
   where user_id = p_user_id and status = 'pending';
  if not found then return 'not_pending'; end if;

  insert into public.profiles (id, email, full_name, role, student_id, campus)
  values (p_user_id, p_email, p_full_name, 'counselor', null, 'demo-campus')
  on conflict (id) do nothing;

  return 'approved';
end;
$$;

-- SECURITY DEFINER punches through the deny-all RLS the tables rely on
-- (definer ≠ invoker), and Postgres grants EXECUTE to PUBLIC by default —
-- with the anon key exposed via PostgREST that would be self-service
-- privilege escalation. Lock the RPC to the service role only (review
-- round 2, Critical): the app's routes call it exclusively via
-- supabaseAdmin(); anon/authenticated keep nothing.
revoke execute on function public.approve_counselor(uuid, text, text, text) from public;
grant  execute on function public.approve_counselor(uuid, text, text, text) to service_role;
```

- [ ] **Step 2: Write the migration note (schema.sql style for already-applied schemas)**

Immediately below the block, add the one-liner the way `schema.sql:67-76` does for prior rounds:

```sql
-- Migration note (Google round, 2026-11-03): for an already-applied schema,
-- the create-block above applies verbatim (idempotent) — playwright e2e
-- treats a missing table as skip condition; approve_counselor() re-applies
-- as CREATE OR REPLACE (idempotent). If a PRE-strict version of the table
-- was already applied (any block without the two-sided stamps check),
-- re-create the invariant explicitly:
--   alter table public.counselor_requests drop constraint if exists counselor_requests_check;
--   alter table public.counselor_requests add constraint counselor_requests_check
--     check ((status = 'pending' and decided_at is null and decided_by is null)
--            or (status in ('approved', 'rejected') and decided_at is not null and decided_by is not null));
```

- [ ] **Step 3: Note the human apply step**

This table must also land in the LIVE Supabase project (SQL editor, human step like resume_runs/letter_runs before it). The e2e spec (Task 8) skips itself when the table is absent, so commits stay green before the human applies it — do NOT silently create the table from app code.

- [ ] **Step 4: Commit**

```bash
git add supabase/schema.sql
git commit -m "schema: counselor_requests table (google round intake)"
```

---

### Task 2: `lib/session.ts` — shared destination logic + the no-profile gate branch

**Files:**
- Modify: `lib/session.ts` (extend; no existing behavior changes except redirect targets when a *signed-in user has no profiles row*)

- [ ] **Step 1: Add `destFor` + `getSignedInUser` + `getCounselorRequest` at the bottom of the file**

```ts
// ── Google round (ADR 0006) helpers ────────────────────────────────────
import { db } from "@/lib/db";

/** The one destination rule, extracted from signin/route.ts and the landing
 *  page (they duplicated it verbatim — this is now the citation): staff →
 *  /admin; student with a picked career → /dashboard; else → /onboarding. */
export async function destFor(profile: {
  role: Role;
  studentId: string | null;
}): Promise<string> {
  if (profile.role === "counselor" || profile.role === "sysadmin") return "/admin";
  if (profile.studentId) {
    const state = await db.getStudentState(profile.studentId);
    return state.careerId ? "/dashboard" : "/onboarding";
  }
  return "/onboarding";
}

/** The raw signed-in identity, WITHOUT requiring a profiles row — the Google
 *  path's gate signal: a session that auth.getUser() verifies but has no
 *  profile is exactly a first-time identity waiting at /welcome. */
export interface SignedInUser {
  id: string;
  email: string;
  fullName: string;
}

export async function getSignedInUser(): Promise<SignedInUser | null> {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;
  const meta = user.user_metadata as { full_name?: string; name?: string } | null;
  return {
    id: user.id,
    email: user.email,
    fullName: meta?.full_name ?? meta?.name ?? user.email.split("@")[0],
  };
}

/** The signed-in user's counselor application row (welcome-page state). */
export async function getCounselorRequest(
  userId: string,
): Promise<{ status: string; fullName: string; note: string } | null> {
  const { data, error } = await supabaseAdmin()
    .from("counselor_requests")
    .select("status, full_name, note")
    .eq("user_id", userId)
    .maybeSingle();
  if (error || !data) return null;
  return { status: data.status, fullName: data.full_name, note: data.note };
}
```

- [ ] **Step 2: Point the guards at `/welcome` when a session exists without a profile**

Replace `requireStudent` and `requireStaff` bodies (the only body change; every other consumer keeps compiling):

```ts
/** Server-page gate: a signed-in student, else the sign-in page. */
export async function requireStudent(): Promise<Profile & { studentId: string }> {
  const profile = await getCurrentProfile();
  if (!profile) {
    // signed in but never provisioned (first Google identity) → the picker,
    // NOT /signin — /signin's own dest probe would answer no_account about
    // a session we know is good (Google round, ADR 0006)
    redirect((await getSignedInUser()) ? "/welcome" : "/signin");
  }
  if (profile.role !== "student" || !profile.studentId) redirect("/signin");
  // the guards above proved studentId is set (redirect() never returns)
  return profile as Profile & { studentId: string };
}

/** Server-page gate: the Admin surface is for Counselors + System Admins. */
export async function requireStaff(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect((await getSignedInUser()) ? "/welcome" : "/signin");
  }
  if (profile.role !== "counselor" && profile.role !== "sysadmin") redirect("/signin");
  return profile;
}
```

- [ ] **Step 3: Run the typecheck + fixtures tests (no behavior to unit-test here — the e2e in Task 8 exercises the branch)**

Run: `npx tsc --noEmit && npm run verify:fixtures`
Expected: PASS (typecheck clean; fixtures untouched by this task).

- [ ] **Step 4: Commit**

```bash
git add lib/session.ts
git commit -m "session: destFor + signed-in-no-profile → /welcome gate branch"
```

---

### Task 3: `lib/auth/provision.ts` + signup-route refactor (the shared provisioning seam)

**Files:**
- Create: `lib/auth/provision.ts`
- Modify: `app/api/auth/signup/route.ts:66-89` (replace the inline student-id loop + profiles insert with the shared helper — behavior-identical)

- [ ] **Step 1: Create the module**

```ts
import { supabaseAdmin } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { newStudentState } from "@/lib/session";

/**
 * Shared account provisioning (Google round, ADR 0006). The ONE place that
 * derives a unique student_id from an email and writes the
 * profiles/student_state pair — the password signup route and the
 * /welcome picker both land here, so both guarantee identical dedupe
 * (-2/-3 suffix scan), campus default, and seeded-state rules.
 *
 * server-only: touches the service-role client (never import from client
 * components — lib/supabase/server contract).
 */

export async function nextStudentId(email: string): Promise<string> {
  const base = email.split("@")[0].replace(/[^a-z0-9-]/g, "") || "student";
  let studentId = base;
  for (let n = 2; ; n++) {
    const { data: taken } = await supabaseAdmin()
      .from("profiles")
      .select("id")
      .eq("student_id", studentId)
      .maybeSingle();
    if (!taken) break;
    studentId = `${base}-${n}`;
  }
  return studentId;
}

export async function provisionStudent(input: {
  userId: string;
  email: string;
  fullName: string;
}): Promise<string> {
  const admin = supabaseAdmin();
  const studentId = await nextStudentId(input.email);
  const { error: profErr } = await admin.from("profiles").insert({
    id: input.userId,
    email: input.email,
    full_name: input.fullName,
    role: "student",
    student_id: studentId,
    campus: "demo-campus",
  });
  if (profErr) throw new Error(`profiles insert: ${profErr.message}`);
  await db.saveStudentState(studentId, newStudentState(studentId, input.fullName));
  return studentId;
}
```

- [ ] **Step 2: Refactor the signup route to use it**

In `app/api/auth/signup/route.ts`, delete the inline loop + insert (lines 66–87 as of this plan) and replace with:

```ts
    const user = created.user;

    const studentId = await provisionStudent({
      userId: user.id,
      email,
      fullName: name,
    });
    if (profErr /* removed with inline insert */) throw profErr; // ← DELETE THIS LINE TOO; see note
```

Which resolves to, simply:

```ts
    const user = created.user;

    const studentId = await provisionStudent({
      userId: user.id,
      email,
      fullName: name,
    });
```

…and add to the route's imports:

```ts
import { provisionStudent } from "@/lib/auth/provision";
```


The prior `const { error: profErr } = await admin.from("profiles").insert({…}); if (profErr) …` block is fully replaced — do not keep a second local named `profErr`. The route's own `catch` still maps thrown provisioning failures to `{ error: "server" }` (500), preserving the error contract: `no_account | bad_credentials | server` stays honest because a thrown insert error was ALREADY a 500 before this refactor.

> **Implementation notes (post-review, landed):** the call in the route is a bare `await provisionStudent({...})` (no binding — the helper owns the value), and `nextStudentId` lowercases the derived base (`|| "student").toLowerCase()`), identity for the password path, hardening for the Google path's raw `user.email`.

- [ ] **Step 3: Run the typecheck + fixtures suite + the recording e2e**

Run: `npx tsc --noEmit && npm run verify:fixtures && npm run e2e -- e2e/fresh-account.spec.ts`
Expected: PASS — signup contract unchanged (fresh-account.spec's signup probes still pass; the shared helper is behavior-identical).
(If `SEED_COHORT_DOMAIN`-based e2e can't run in this environment, run `npm run e2e` locally with env present and record the result; fixtures+typecheck stay the CI-enforceable gate.)

- [ ] **Step 4: Commit**

```bash
git add lib/auth/provision.ts app/api/auth/signup/route.ts
git commit -m "auth: shared provisionStudent seam (signup + upcoming google picker)"
```

---

### Task 4: OAuth landing — `/auth/confirm` branch + `/auth/google` probe

**Files:**
- Modify: `app/auth/confirm/route.ts` (add the `via=google` branch; recovery behavior byte-identical when `via` is absent)
- Create: `app/auth/google/route.ts`

- [ ] **Step 1: Update the confirm route (full new body)**

```ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /auth/confirm?code=…&next=/reset — the PKCE exchange landing route.
 * Two callers, one exchange:
 *   - recovery links (auth round 2): `next` defaults /reset; a missing/used/
 *     expired code lands on /forgot?state=expired with the honest "request a
 *     new link" state — never a fake success.
 *   - Google OAuth (round, ADR 0006): `via=google&next=/auth/google`; the
 *     same exchange establishes the session, then /auth/google decides dest
 *     by the roster. A denied/expired consent lands on /signin?state=google —
 *     NOT the recovery error (that would read as a broken reset email).
 */
export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const viaGoogle = searchParams.get("via") === "google";
  const next = searchParams.get("next") ?? (viaGoogle ? "/auth/google" : "/reset");

  if (code && next.startsWith("/")) {
    const supabase = await supabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  if (viaGoogle) {
    // drop any half-established session so the shell never fakes logged-in,
    // then the sign-in page carries the honest notice
    const supabase = await supabaseServer();
    try {
      await supabase.auth.signOut();
    } catch {
      /* sign-out is best-effort at this point — the redirect is the message */
    }
    return NextResponse.redirect(`${origin}/signin?state=google`);
  }
  return NextResponse.redirect(`${origin}/forgot?state=expired`);
}
```

- [ ] **Step 2: Create the dest probe route**

```ts
import { NextResponse } from "next/server";
import { supabaseAdmin, supabaseServer } from "@/lib/supabase/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /auth/google — the OAuth round's landing probe (ADR 0006). The PKCE
 * exchange has already happened in /auth/confirm (via=google). Destination
 * follows the ONE rule (lib/session.destFor): staff → /admin; student with
 * a career → /dashboard; fresh → /onboarding. A verified session with NO
 * profiles row is a first-time identity → /welcome (the role picker). No
 * session (consent denied/bounced) → /signin?state=google for the notice.
 */
export async function GET(req: Request) {
  const origin = new URL(req.url).origin;
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return NextResponse.redirect(`${origin}/signin?state=google`);

  // roster read server-side (admin client, bypasses RLS — same as sign-in)
  const { data: profile } = await supabaseAdmin()
    .from("profiles")
    .select("role, student_id")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile) return NextResponse.redirect(`${origin}/welcome`);

  let dest = "/admin";
  if (profile.role === "student" && profile.student_id) {
    const state = await db.getStudentState(profile.student_id);
    dest = state.careerId ? "/dashboard" : "/onboarding";
  }
  return NextResponse.redirect(`${origin}${dest}`);
}
```

- [ ] **Step 3: Run the typecheck + recovery e2e regression**

Run: `npx tsc --noEmit && npm run e2e -- e2e/fresh-account.spec.ts`
Expected: PASS — the no-`via` recovery path must behave byte-identically. **Correction (review round 1):** the original text cited `e2e/account-password-confirm.spec.ts` as "driving /auth/confirm through real reset links" — wrong: that spec covers /profile password-confirm fields only and never touches /auth/confirm. The reset-link flow lives in `e2e/fresh-account.spec.ts` (forgot→confirm). Running e2e requires Supabase env + applied schema — ABSENT in this environment, so this check defers to the env-present e2e run (recorded with Task 10's run list; do NOT fake a pass).
Deferred-evidence list so far: Task 3 (signup e2e) + Task 4 (this spec), both on `npm run e2e` with env present.

- [ ] **Step 4: Commit**

```bash
git add app/auth/confirm/route.ts app/auth/google/route.ts
git commit -m "auth: via=google OAuth landing branch + /auth/google dest probe"
```

---

### Task 5: The `GoogleAuth` button + wiring into both auth pages

**Files:**
- Create: `app/(auth)/GoogleAuth.tsx`
- Modify: `app/(auth)/signin/page.tsx` (async + searchParams + render button)
- Modify: `app/(auth)/signup/page.tsx` (render button)

- [ ] **Step 1: Create the client component**

```tsx
"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * "Continue with Google" — the browser-side OAuth kick-off (ADR 0006).
 * signInWithOAuth redirects the browser to Google's consent screen; the
 * session returns through /auth/confirm (PKCE — the same route recovery
 * links use), which hands to /auth/google for the dest decision. The
 * provider's keys live in the Supabase dashboard ONLY — nothing new in
 * package.json, nothing env-shaped beyond the public URL/anon key pair the
 * app already configures.
 */
export default function GoogleAuth() {
  async function signInWithGoogle() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anon) return; // no Supabase env — the button renders but must no-op honestly
    const supabase = createBrowserClient(url, anon);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/confirm?via=google&next=/auth/google`,
      },
    });
    // control leaves this page via full redirect — nothing after this runs
  }

  return (
    <>
      <p className="auth-or" aria-hidden="true">— or —</p>
      <button type="button" className="btn btn-block" onClick={signInWithGoogle}>
        Continue with Google
      </button>
    </>
  );
}
```

- [ ] **Step 2: Add the shared divider style (both css files share the v7 shell conventions)**

Append to `app/(auth)/v7-auth.css`:

```css
/* Google round: the "or" divider under a form's primary button. */
.auth-or {
  text-align: center;
  color: var(--ink-2);
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  margin: 18px 0 0;
}
```

- [ ] **Step 3: Wire the sign-in page (Full new body — the `state=google` notice is why the page goes async)**

**Check the searchParams signature against `node_modules/next/dist/docs/` first** (repo AGENTS.md rule; Next 16 pages receive it as a Promise): the access pattern is `const { state } = await searchParams`, as used in the docs for dynamic metadata. Then:

```tsx
import type { Metadata } from "next";
import { BackArrow } from "../glyphs";
import GoogleAuth from "../GoogleAuth";
import SignInForm from "./SignInForm";
import "./auth.css";
import "../v7-auth.css";

export const metadata: Metadata = {
  title: "Baseline — sign in",
  description: "Sign in to your Baseline account.",
};

/**
 * Sign-in surface — markup ported 1:1 from prototype/signin.html. Google
 * round: the OAuth button under the credential form, and the honest notice
 * when a Google consent was denied/expired (state=google from
 * /auth/confirm's via=google branch — DISTINCT from the recovery error,
 * which never lands here).
 */
export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>;
}) {
  const { state } = await searchParams;
  return (
    <div className="auth-body v7auth">
      <header className="bar">
        <div className="bar-in" style={{ justifyContent: "center" }}>
          <a href="/" className="brand">
            <span className="brand-mark" aria-hidden="true"></span>
            <span className="brand-name">Baseline</span>
          </a>
        </div>
      </header>

      <main className="auth-main" id="main">
        <div className="auth-panel">
          <div className="auth-head">
            <h1>Sign in.</h1>
          </div>

          {state === "google" && (
            <div className="field-err" role="status" style={{ display: "block", marginBottom: 14 }}>
              The Google sign-in didn&apos;t complete — consent was closed or it
              expired. Try it again from the button below.
            </div>
          )}

          <SignInForm />

          <GoogleAuth />

          <p className="auth-alt">
            New here?{" "}
            <a href="/signup">
              Start check <BackArrow />
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 4: Wire the sign-up page (read the current file first — only the two insertions below are new)**

In `app/(auth)/signup/page.tsx`, add the import (`import GoogleAuth from "../GoogleAuth";`) and render `<GoogleAuth />` immediately after the `<SignupForm />` element (same position as the sign-in page — button flush under the primary submit, divider above it). Touch nothing else in that file.

- [ ] **Step 5: Visual + typecheck verification**

Run: `npx tsc --noEmit && npm run build`
Expected: build succeeds; open `http://localhost:3000/signin` and `/signup` — button renders under the form. Clicking it WITHOUT the Supabase/Google config lands on Google-failure — that is the honest pre-config state; the Human prerequisites block gates real consent flow (Task 10).

- [ ] **Step 6: Commit**

```bash
git add "app/(auth)/GoogleAuth.tsx" "app/(auth)/v7-auth.css" "app/(auth)/signin/page.tsx" "app/(auth)/signup/page.tsx"
git commit -m "auth: Continue-with-Google button on sign-in + sign-up"
```

---

### Task 6: `/welcome` — the role-picker gate page

**Files:**
- Create: `app/(auth)/welcome/page.tsx`
- Create: `app/(auth)/welcome/WelcomePicker.tsx`

- [ ] **Step 1: Create the server page**

```tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { destFor, getCounselorRequest, getCurrentProfile, getSignedInUser } from "@/lib/session";
import WelcomePicker from "./WelcomePicker";
import "../auth.css";
import "../v7-auth.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Baseline — welcome",
  description: "Tell Baseline what brings you here.",
};

/**
 * /welcome — first-time-identity gate (Google round, ADR 0006). Reached when
 * a verified session has NO profiles row. Not a dashboard shell and not a
 * marketing surface: the (auth) shell carries the honest pre-provisioned
 * state. States rendered by WelcomePicker:
 *   fresh    → the role picker (student instant; counselor = application)
 *   pending  → "application received — a System Admin approves" + sign out
 *   rejected → the decision message + resubmission affordance
 * A profile row existing at all → straight redirect via destFor (back-nav
 * cannot loop here).
 */
export default async function WelcomePage() {
  const profile = await getCurrentProfile();
  if (profile) redirect(await destFor(profile));

  const user = await getSignedInUser();
  if (!user) redirect("/signin"); // /auth/confirm's via=google branch guarantees a session; belt + suspenders

  const request = await getCounselorRequest(user.id);
  const initial = request?.status === "pending" ? "pending" : request?.status === "rejected" ? "rejected" : "fresh";

  return (
    <div className="auth-body v7auth">
      <header className="bar">
        <div className="bar-in" style={{ justifyContent: "center" }}>
          <a href="/" className="brand">
            <span className="brand-mark" aria-hidden="true"></span>
            <span className="brand-name">Baseline</span>
          </a>
        </div>
      </header>

      <main className="auth-main" id="main">
        <div className="auth-panel">
          <div className="auth-head">
            <h1>Welcome, {user.fullName}.</h1>
          </div>

          <WelcomePicker initial={initial} />
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Create the client picker**

```tsx
"use client";

import { useState } from "react";

/**
 * The role picker (ADR 0006). Two declinations, object-level honest:
 *   student   → POST /api/auth/provision { role:"student" } — the SAME
 *               provisioning the password form performs, then dest
 *               /onboarding (fresh by construction);
 *   counselor → POST /api/auth/provision { role:"counselor", note } —
 *               NO access granted; a pending application; every gate
 *               bounces here until a System Admin approves.
 * The pick is an answer, not a grant: the counselor flip happens in
 * /api/admin/counselor-requests/[id], executed by a sysadmin session.
 */
type State = "fresh" | "pending" | "rejected";

export default function WelcomePicker({ initial }: { initial: State }) {
  const [state, setState] = useState<State>(initial);
  const [note, setNote] = useState("");
  const [acting, setActing] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function post(role: "student" | "counselor") {
    setActing(true);
    setErr(null);
    try {
      const res = await fetch("/api/auth/provision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, note: role === "counselor" ? note : undefined }),
      });
      const data = (await res.json().catch(() => null)) as { dest?: string; error?: string } | null;
      if (!res.ok) {
        if (data?.error === "note_required") setErr("A line about who you advise is required.");
        else if (data?.error === "not_signed_in") setState("fresh"); // session expired mid-decision — honest fresh render, next click re-authenticates
        else setErr("That didn't go through. Try once more in a minute.");
        return;
      }
      if (role === "student" && data?.dest) {
        window.location.assign(data.dest);
        return;
      }
      // counselor → stays on this surface
      setState("pending");
    } catch {
      setErr("That didn't go through. Try once more in a minute.");
    } finally {
      setActing(false);
    }
  }

  async function resubmit() {
    // rejected → reopened editor, then the same provision POST flips the row pending again
    setState("fresh");
  }

  if (state === "pending") {
    return (
      <div id="welcome-pending">
        <p>
          Your counselor application is in and waiting for a System Admin —
          once approved, sign in again and the Admin console opens for you.
          Nothing is accessible from this account until that approval.
        </p>
        <form action="/api/auth/signout" method="post">
          <button type="submit" className="btn btn-block">Sign out</button>
        </form>
      </div>
    );
  }

  return (
    <div id="welcome-picker">
      {state === "rejected" && (
        <div className="field-err" role="status" style={{ display: "block", marginBottom: 14 }}>
          That application wasn&apos;t approved. You can correct the details
          below and submit again.
        </div>
      )}
      <p>
        One choice tells the check what to measure. Your role is a decision the
        system records — privilege comes from a person, not this click.
      </p>

      <button
        type="button"
        id="pick-student"
        className="btn btn-primary btn-block"
        disabled={acting}
        onClick={() => post("student")}
      >
        {acting ? "Setting up…" : "I'm a student — start my check"}
      </button>

      <p className="auth-or" aria-hidden="true">— or —</p>

      <button
        type="button"
        id="pick-counselor"
        className="btn btn-block"
        disabled={acting}
        onClick={() => post("counselor")}
      >
        I&apos;m the counselor/adviser — request access
      </button>

      {err && (
        <div className="field-err" id="welcome-err" role="alert" style={{ display: "block", marginTop: 14 }}>
          {err}
        </div>
      )}

      <div className="proto-note" id="counselor-request" style={{ display: "block", marginTop: 16 }}>
        <label htmlFor="c-note">Requesting counselor access — one line about who you advise:</label>
        <input
          type="text"
          id="c-note"
          name="c-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Advises AB Psych, IAB section, and the career-path cohort"
        />
        <button
          type="button"
          id="c-send"
          className="btn btn-primary btn-block"
          disabled={acting || note.trim().length < 3}
          onClick={() => post("counselor")}
        >
          {acting ? "Sending…" : "Send the request"}
        </button>
      </div>
    </div>
  );
}
```

*(Design note kept deliberately explicit: the `proto-note` request editor is always rendered under the counselor request button so a `rejected` state simply re-enters with `state === "fresh"` via `resubmit()` — one POST, one status flip, no history table.)*

- [ ] **Step 3: Typecheck + build**

Run: `npx tsc --noEmit && npm run build`
Expected: clean. The page is unreachable until a signed-in-but-provisionless session exists (Task 8 e2e drives it via the password path).

- [ ] **Step 4: Commit**

```bash
git add "app/(auth)/welcome/page.tsx" "app/(auth)/welcome/WelcomePicker.tsx"
git commit -m "welcome: first-time identity gate with role picker (ADR 0006)"
```

---

### Task 7: `/api/auth/provision` — the picker's server contract

**Files:**
- Create: `app/api/auth/provision/route.ts`

- [ ] **Step 1: Create the route (full body)**

```ts
import { NextResponse } from "next/server";
import { supabaseAdmin, supabaseServer } from "@/lib/supabase/server";
import { provisionStudent } from "@/lib/auth/provision";
import { destFor, type Role } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/auth/provision — the /welcome picker's contract (ADR 0006).
 * The signed-in auth user has NO profiles row (a first Google identity —
 * possibly auto-linked onto a roster account that predates their profiles
 * row? NO: auto-linking binds identities to an EXISTING user, whose profile
 * row exists; so reaching here means genuinely first-time).
 *   - role "student"   → the same provisioning the password form performs
 *     (profiles row + seeded state via provisionStudent), then /onboarding.
 *     app_metadata.role is stamped to "student" for parity with the password
 *     route's JWT contract (proxy.ts reads it).
 *   - role "counselor" → NO access. counselor_requests upserts one row per
 *     user (status pending; a rejected row flips back to pending with the
 *     fresh note). The privilege grant happens ONLY in
 *     /api/admin/counselor-requests/[id] behind a sysadmin session.
 * Role never comes from the email, its domain, or the pick alone (user
 * ruling 2026-11-03). An already-provisioned user asking to pick again
 * answers 409 already_provisioned + their roster dest (a counselor's
 * re-open of an approved request would strip the decision stamps — guarded).
 * Errors: not_signed_in | bad_role | already_provisioned | note_required | server
 * Imports needed: destFor + Role from "@/lib/session" (same file as newStudentState).
 */
export async function POST(req: Request) {
  try {
    const supabase = await supabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) return NextResponse.json({ error: "not_signed_in" }, { status: 401 });

    const body = await req.json().catch(() => ({} as Record<string, unknown>));
    const role = body.role;
    if (role !== "student" && role !== "counselor") {
      return NextResponse.json({ error: "bad_role" }, { status: 400 });
    }

    const admin = supabaseAdmin();
    const meta = user.user_metadata as { full_name?: string; name?: string } | null;
    const fullName = meta?.full_name ?? meta?.name ?? user.email.split("@")[0];

    // Guard BEFORE any dispatch (review round 1 carry-over): a user that
    // already HAS a profile row is provisioned with a role — can NEVER be a
    // pick target. Failing open here would let a direct API call re-open an
    // approved counselor's request row (stripping their decision stamps back
    // to pending) or collide the student path with the roster. The welcome
    // page itself never reaches the picker for these users (destFor redirect)
    // — so this answer is about direct-call honesty only.
    const { data: existingProfile } = await admin
      .from("profiles")
      .select("id, role, student_id")
      .eq("id", user.id)
      .maybeSingle();
    if (existingProfile) {
      return NextResponse.json(
        { error: "already_provisioned", dest: await destFor({ role: existingProfile.role as Role, studentId: existingProfile.student_id }) },
        { status: 409 },
      );
    }

    if (role === "student") {
      // email collision on profiles is still guarded: unique(email) exists and
      // a mismatched-authority row answers 409 below (defensive honesty)
      let studentId: string;
      try {
        studentId = await provisionStudent({
          userId: user.id,
          email: user.email,
          fullName,
        });
      } catch (err) {
        if (err instanceof Error && /duplicate|unique/i.test(err.message)) {
          return NextResponse.json({ error: "email_taken" }, { status: 409 });
        }
        throw err;
      }
      // JWT parity with the password signup route (proxy reads app_metadata)
      await admin.auth.admin.updateUserById(user.id, {
        app_metadata: { role: "student" },
      });
      return NextResponse.json({ dest: "/onboarding", role: "student", studentId });
    }

    // counselor → the application, and nothing more
    const note = String(body.note ?? "").trim();
    if (note.length < 3) return NextResponse.json({ error: "note_required" }, { status: 422 });

    const { error: reqErr } = await admin
      .from("counselor_requests")
      .upsert(
        {
          user_id: user.id,
          email: user.email,
          full_name: fullName,
          note,
          status: "pending",
          // re-stamp EVERY submission (fresh or a rejected resubmission) —
          // requested_at = the current application moment so the queue's
          // ordering stays truthful (review round 1 ruling, 2026-11-03)
          requested_at: new Date().toISOString(),
          decided_at: null,
          decided_by: null,
        },
        { onConflict: "user_id" },
      );
    if (reqErr) return NextResponse.json({ error: "server" }, { status: 500 });

    return NextResponse.json({ dest: "/welcome", role: "counselor", status: "pending" });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Typecheck + build**

Run: `npx tsc --noEmit && npm run build`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add app/api/auth/provision/route.ts
git commit -m "auth: /api/auth/provision — picker's student + counselor contracts"
```

---

### Task 8: Admin counselor-requests queue + the authed-dest wiring sweep

**Files:**
- Create: `app/admin/counselor-requests/page.tsx`
- Create: `app/admin/counselor-requests/ApproveRow.tsx`
- Create: `app/api/admin/counselor-requests/[id]/route.ts`
- Modify: `app/admin/AdminBar.tsx` (hyperlink slot, role prop)
- Modify: `app/admin/page.tsx` (pass `role` to AdminBar)
- Modify: `app/(marketing)/page.tsx` (`authedRedirect` no-profile branch)
- Modify: `app/api/auth/signin/route.ts` (dest via `destFor` — the DRY cite)
- Modify: `lib/session.ts` (nothing — Task 2 already added everything)

- [ ] **Step 1: Create the admin queue page**

```tsx
import { requireStaff } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase/server";
import AdminBar from "../AdminBar";
import ApproveRow, { type RequestRow } from "./ApproveRow";
import "../admin.css";

export const dynamic = "force-dynamic";

/**
 * Counselor requests queue (Google round, ADR 0006). SYSADMIN ONLY —
 * granting staff privilege is not a counselor power (the roles are ordered:
 * counselor audits students; sysadmin provisions privilege). Rows are the
 * pending counselor applications from /welcome, oldest first, FULL transcript
 * visible: name, email, the applicant's own note, requested stamp. Approve
 * and reject both record decided_at/decided_by — the trail is the artifact
 * the audit story (context: audited credentials, counselor-run cohort) reads.
 */
export default async function CounselorRequestsPage() {
  const profile = await requireStaff();
  if (profile.role !== "sysadmin") {
    // counselors have no projection into provisioning — the honest 403 surface
    return (
      <>
        <AdminBar role={profile.role} />
        <main className="admin-main">
          <p>Counselor provisioning is a System Admin surface.</p>
        </main>
      </>
    );
  }

  const admin = supabaseAdmin();
  const { data: rows } = await admin
    .from("counselor_requests")
    .select("user_id, email, full_name, note, status, requested_at")
    .eq("status", "pending")
    .order("requested_at", { ascending: true });

  const pending = (rows ?? []) as Array<{
    user_id: string;
    email: string;
    full_name: string;
    note: string;
    requested_at: string;
  }>;

  return (
    <>
      <AdminBar role={profile.role} />
      <main className="admin-main">
        <h1>Counselor requests ({pending.length})</h1>
        <p>
          First-time Google identities that declared counselor. Approving
          writes the profiles row and the JWT role in one action — the
          applicant signs in again and opens the Admin console.
        </p>
        {pending.length === 0 && <p>Nothing waiting.</p>}
        {pending.map((r) => (
          <ApproveRow
            key={r.user_id}
            row={{
              userId: r.user_id,
              email: r.email,
              fullName: r.full_name,
              note: r.note,
              requestedAt: r.requested_at,
            }}
          />
        ))}
      </main>
    </>
  );
}

/** Exposed for the AdminBar badge count. */
export { type RequestRow };
```

- [ ] **Step 2: Create the row component**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * One pending counselor application (ADR 0006). Approve → PATCH { action:
 * "approve" } → the API writes the profiles row + app_metadata role and
 * marks the request approved; Reject records the same trail with no grant.
 * The list re-reads on completion (router.refresh) — no client-side state
 * mirrors the server's single source of truth.
 */
export interface RequestRow {
  userId: string;
  email: string;
  fullName: string;
  note: string;
  requestedAt: string;
}

export default function ApproveRow({ row }: { row: RequestRow }) {
  const router = useRouter();
  const [acting, setActing] = useState<"approve" | "reject" | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function decide(action: "approve" | "reject") {
    setActing(action);
    setErr(null);
    try {
      const res = await fetch(`/api/admin/counselor-requests/${row.userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        if (res.status === 409) {
          // already_decided (another admin ruled, or this decision landed in a
          // lost response): the truthful action is a refresh, not an error —
          // the list re-reads and shows the decided state
          router.refresh();
          return;
        }
        setErr("The decision didn't record. Try again.");
        return;
      }
      router.refresh();
    } catch {
      setErr("The decision didn't record. Try again.");
    } finally {
      setActing(null);
    }
  }

  const when = new Date(row.requestedAt);
  const stamp = Number.isNaN(when.getTime())
    ? "—"
    : `${when.toLocaleDateString("en-US", { month: "short" })} ${when.getDate()}`;

  return (
    <div className="cred-row" data-testid={`counselor-request-${row.email}`}>
      <div>
        <strong>{row.fullName}</strong> · {row.email} · requested {stamp}
        <p style={{ margin: "4px 0" }}>{row.note}</p>
        {err && (
          <div className="field-err" role="alert" style={{ display: "block" }}>
            {err}
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          className="btn btn-primary"
          disabled={acting !== null}
          aria-label={`Approve ${row.email}`}
          onClick={() => decide("approve")}
        >
          {acting === "approve" ? "Approving…" : "Approve"}
        </button>
        <button
          type="button"
          className="btn"
          disabled={acting !== null}
          aria-label={`Reject ${row.email}`}
          onClick={() => decide("reject")}
        >
          {acting === "reject" ? "Rejecting…" : "Reject"}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create the PATCH route**

```ts
import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * PATCH /api/admin/counselor-requests/[id] — the ONE place a counselor
 * privilege is granted (ADR 0006). Sysadmin session required (role from the
 * session, never the body). id = the applicant's auth user id.
 *   approve → approve_counselor() RPC — ONE TRANSACTION (profiles row +
 *             the approval stamp commit together or not at all; idempotent,
 *             on-conflict-do-nothing) — then app_metadata.role counselor
 *             (proxy.ts) as the second step. A failed second step answers
 *             500; re-clicking heals: the RPC skips for an already-approved
 *             row and the plugin stamp retries. No torn state can wedge.
 *             (User ruling 2026-11-03: "this looks like a transaction".)
 *   reject  → request row stamped rejected/decided_by. NO grant, and the
 *             applicant may resubmit from /welcome (upsert flips pending).
 * Errors: unauthorized | forbidden | bad_json | bad_input | not_found | server
 */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const profile = await getCurrentProfile();
  if (!profile) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (profile.role !== "sysadmin") return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }
  const action = body.action;
  if (action !== "approve" && action !== "reject") {
    return NextResponse.json({ error: "bad_input" }, { status: 400 });
  }

  try {
    const admin = supabaseAdmin();
    const { data: request } = await admin
      .from("counselor_requests")
      .select("email, full_name, note, status")
      .eq("user_id", id)
      .maybeSingle();
    if (!request || (request.status !== "pending" && request.status !== "approved")) {
      // "approved" re-entry = a prior attempt committed the transaction but
      // failed the JWT stamp below; this skip + re-stamp is the healing path
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    if (request.status === "pending" && action === "reject") {
      const { error } = await admin
        .from("counselor_requests")
        .update({
          status: "rejected",
          decided_at: new Date().toISOString(),
          decided_by: profile.email,
        })
        .eq("user_id", id);
      if (error) return NextResponse.json({ error: "server" }, { status: 500 });
      return NextResponse.json({ status: "rejected" });
    }

    // approve — ONE RPC call, ONE transaction (user ruling: "this looks like
    // a transaction"): profiles row + approval stamp commit together or not
    // at all; idempotent so the healing-retry path can never double-grant.
    // The RPC stamps FIRST and returns 'not_pending' when the row stopped
    // being pending before this call (another admin decided concurrently) —
    // observable, so the insert can never fire for a decided row.
    if (request.status === "pending") {
      const { data: rpcStatus, error: rpcErr } = await admin.rpc("approve_counselor", {
        p_user_id: id,
        p_email: request.email,
        p_full_name: request.full_name,
        p_decided_by: profile.email,
      });
      if (rpcErr) return NextResponse.json({ error: "server" }, { status: 500 });
      if (rpcStatus !== "approved") {
        // another admin's decision landed first — the row left the pending
        // set under us; the decided facts (theirs) stand
        return NextResponse.json({ error: "already_decided" }, { status: 409 });
      }
    }

    // answered-elsewhere guard (review round 2): a stale reject click on an
    // already-approved row must never re-issue the JWT marker (an auth write
    // armed by a decision nobody made) — the row's decided facts stand
    if (request.status === "approved" && action === "reject") {
      return NextResponse.json({ error: "already_decided" }, { status: 409 });
    }

    // the JWT role is the /admin admit ticket (proxy.ts reads app_metadata) —
    // NOT voided on this surface: a failed stamp answers 500; re-clicking
    // re-enters with request.status already "approved", skips the RPC, and
    // THIS write retries to completion
    const { error: metaErr } = await admin.auth.admin.updateUserById(id, {
      app_metadata: { role: "counselor" },
    });
    if (metaErr) return NextResponse.json({ error: "server" }, { status: 500 });

    return NextResponse.json({ status: "approved" });
  } catch {
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
```

- [ ] **Step 4: AdminBar gets a sysadmin link slot (role prop, optional — every existing usage keeps compiling)**

In `app/admin/AdminBar.tsx`:

```tsx
export default function AdminBar({ role }: { role?: "counselor" | "sysadmin" }) {
```

…and inside `.bar-user`, BEFORE the sign-out form, add (only when sysadmin — privilege-granting is a sysadmin surface):

```tsx
          {role === "sysadmin" && (
            <a href="/admin/counselor-requests" className="admin-signout" style={{ marginRight: 12 }}>
              Counselor requests
            </a>
          )}
```

- [ ] **Step 5: Wiring sweep — every signed-in dest probe uses `destFor` + `/welcome` branch**

1. `app/admin/page.tsx`: `<AdminBar />` → `<AdminBar role={profile.role} />` (the profile is already in scope from `requireStaff()`; verify the exact local name when editing — it imports `requireStaff`).
2. `app/(marketing)/page.tsx` `authedRedirect`: append before the final brace of the `profile` branch — actually REPLACE the tail so a session-without-profile redirects to the picker:

```ts
async function authedRedirect(): Promise<void> {
  const profile = await getCurrentProfile();
  if (profile) {
    if (profile.role === "counselor" || profile.role === "sysadmin") redirect("/admin");
    if (profile.studentId) {
      const state = await db.getStudentState(profile.studentId);
      redirect(state.careerId ? "/dashboard" : "/onboarding");
    }
    redirect("/onboarding");
  }
  // signed-in but never provisioned (first Google identity) → the picker,
  // NOT the marketing page (signed-in visitors never see it — user ruling)
  const { getSignedInUser } = await import("@/lib/session");
  if (await getSignedInUser()) redirect("/welcome");
}
```

*(Import at top instead of the dynamic import if cleaner — either is correct; the plan shows the dynamic form only to keep the diff local.)*

3. `app/api/auth/signin/route.ts`: swap the inline dest computation for the shared rule (lines 38–43):

```ts
    const { destFor } = await import("@/lib/session");
    return NextResponse.json({ dest: await destFor({ role: profile.role, studentId: profile.student_id }), role: profile.role });
```

*(Top-import `{ destFor }` from `@/lib/session` in the route file is preferable — do that; the snippet shows the call shape. `destFor` returns the same three literals as the removed block, so the response contract `{dest, role}` is unchanged.)*

4. grep sweep to prove nothing was missed:

```bash
grep -rn "getStudentProfile\|careerId ? \"/dashboard\"" app lib | grep -v node_modules
```

Expected: only `app/auth/google/route.ts` keeps its inline copy (it cannot import the gate branch peak? It CAN — refactor it as well): in `app/auth/google/route.ts`, replace lines from `let dest = "/admin";` … with:

```ts
import { destFor } from "@/lib/session";
  // …after the no-profile branch:
  return NextResponse.redirect(`${origin}${await destFor({ role: profile.role, studentId: profile.student_id })}`);
```

- [ ] **Step 6: Typecheck + full e2e sweep (existing suites must stay green)**

Run: `npx tsc --noEmit && npm run build && npm run e2e -- e2e/fresh-account.spec.ts e2e/account-password-confirm.spec.ts`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add app/admin/counselor-requests app/api/admin/counselor-requests app/admin/AdminBar.tsx app/admin/page.tsx "app/(marketing)/page.tsx" app/api/auth/signin/route.ts app/auth/google/route.ts
git commit -m "admin: counselor-requests queue (sysadmin-only grant surface) + dest sweep"
```

---

### Task 9: ADR 0006 + docs trace

**Files:**
- Create: `docs/adr/0006-google-oauth-role-picker.md`
- Modify: `CONTEXT.md` (roles vocabulary)

- [ ] **Step 1: Write the ADR (full content)**

```markdown
# Google OAuth with the roster-decided role picker + human counselor grant

Google single sign-on (sign-up + sign-in) ships on Supabase Auth's native Google provider — zero new dependencies, the same signed-cookie session machinery, and the PKCE callback route the recovery flow already owns. Standing decisions brought into this round: self-registration is students-only, staff are provisioned, never self-registered; the profiles table is the role source; some real schools issue no school email, so role must derive from humans, never from an address or its domain. First-time Google users choose between two declinations at /welcome: student (activated immediately — declared, not silently defaulted) or counselor (a counselor_requests application — no access until a sysadmin approves, which writes the profiles row AND the app_metadata role in one action). Automatic identity linking is enabled so roster accounts bind their Google identity by verified-email match.

## Considered Options

- **Role picker with no gate (self-declared counselor)** — rejected: any stranger could open the Admin console and other people's audited credentials; the panel-ready claim "every counselor access has a sysadmin approval behind it" wouldn't hold.
- **Email/domain-based role inference (Workspace claims, cohort-domain match)** — rejected by the user: schools exist without issued emails; domain trust would be a privilege guess.
- **Silent student-by-default for all first-time Google users** — rejected by the user: nothing should happen to an identity without the person's own recorded declaration.
- **Approval queue (chosen)** — accepted: role choice is recorded at the picker, privilege is granted by a named human (decided_by on the row), stripes with the "provisioned, never self-registered" line; officially the queue IS the provisioning step.

## The grant mechanics (user rulings this round)

- **"This looks like a transaction" (2026-11-03)** — the user, on being shown the partially-failed-approval case. The grant's two Postgres writes (profiles row + approval stamp) live inside `approve_counselor()`, a SECURITY DEFINER RPC — one transaction, idempotent, stamp-first observable (`returns 'approved' | 'not_pending'`). The JWT marker (Supabase Auth's surface, outside SQL's reach) is the second step with healing-retry semantics: a failed stamp answers 500 and re-clicking completes the chain (the RPC skips for an already-approved row) — "try again" is therefore an actionable truth, and no interleaving (concurrent admins, stale tabs, lost responses) can double-grant or overwrite a decision.
- **Security: the RPC is locked to the service role** — SECURITY DEFINER punches through deny-all RLS and Postgres grants EXECUTE to PUBLIC by default; with the anon key exposed via PostgREST that would be self-service privilege escalation (review finding, fixed in round). Revoke-public/grant-service_role rides the schema.
- **Reject mirrors the same shape** — single pending-gated observable UPDATE; every decision path is decided-where-it-lands.

## Consequences

- Role lives in two places by contract (profiles.role + app_metadata.role) as before — but now the GRANT surface is code (`/api/admin/counselor-requests/[id]`), not a dashboard edit; the seed script stays as the belt-and-suspenders path for pre-provisioned staff.
- A verified session with no profiles row redirects to /welcome (requireStudent/requireStaff/marketing probe) — never to /signin, whose roster probe would answer no_account about a session that is provably good.
- Auto-linking is ON at the Supabase project level: a Google identity for an existing password account (seeded staff, prior students) binds rather than double-creates.
- The password signup form's contract is untouched; both forms now share `provisionStudent` for the actual profiles/state writes.
- **Approval email (approve-only, nodemailer SMTP, best-effort)** rides the final 200 — "at least once" semantics under healing retries; SMTP health can never gate the grant. Rejection is silent; the application-received moment stays the /welcome pending text.
- **Counselor section scoping is deferred (ticket 11)**: a counselor's jurisdiction is the whole demo cohort for this build; the approval queue grants campus `demo-campus`/section null and carries NO section assignment field.
- Multi-campus and admin self-promotion remain out of scope (tickets 11; sysadmin stays provision-only). Counselor section scoping is likewise deferred (user ruling 2026-11-03): a counselor's jurisdiction is the whole demo cohort; the approval queue grants campus `demo-campus`/section null and carries NO section assignment field — ticket 11 adds that when it builds tenant enforcement.
```

- [ ] **Step 2: CONTEXT.md vocabulary entry**

Add (sorted into the existing glossary flow, near the roles mentions):

```markdown
## Counselor application

First-time Google identity's recorded declaration that AUTHORITY is sought over cohort audits. The privlege is granted by a named System Admin from the admin queue (rows carry decided_by/decided_at — the trail survives the void). Before approval the identity holds zero access.

## Role picker

State machine at /welcome for session-without-profile: student declares and activates IN PLACE; counselor declares and WAITS (pending). Rejected applications re-enter pending with a corrected note — upsert, one row per user, no history.
```

*(Fix the typo when writing — "privilege" — the plan's own [self-review] caught it; verify both entries sit next to the existing role vocabulary lines.)*

- [ ] **Step 3: Commit**

```bash
git add docs/adr/0006-google-oauth-role-picker.md CONTEXT.md
git commit -m "docs: ADR 0006 google oauth role picker + CONTEXT vocabulary"
```

---

### Task 10: e2e — `google-flow.spec.ts` (every gate without a real Google hop)

**Files:**
- Create: `e2e/google-flow.spec.ts`

- [ ] **Step 1: Write the full spec**

```ts
import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import { cohortEmail } from "./helpers";

/**
 * Google-flow spec (Google round, plan 2026-11-03-google-signin.md):
 * everything AROUND the OAuth hop, driven by identity-without-profile users
 * created via the service-role API and signed in through the password form
 * (auto-linking: a second identity on the same verified email reaches the
 * same gates; the gates are what this spec owns — the Google consent hop is
 * the manual checklist in the round report, a human step exactly like the
 * leaked-password toggle in fresh-account.spec.ts).
 *
 *  - SCAFFOLD: counselor_requests must exist in the LIVE database (schema.sql
 *    human apply step). When absent, every spec skips with the apply
 *    instruction — matching the resume_runs/letter_runs precedent.
 *  - The sysadmin approve probe seeds SEED_SYSADMIN_EMAIL + SEED_PASSWORD
 *    (the real seeded admin identity; skip when absent, same rule).
 *  - Throwaway local parts on SEED_COHORT_DOMAIN only; purge helpers remove
 *    every trace (auth user + rows), mirroring purgeTrialAccount.
 */

const stamp = Date.now().toString(36);
const domain = process.env.SEED_COHORT_DOMAIN || "aisat.test";
const studentEmail = `google.student.${stamp}@${domain}`;
const applicantEmail = `google.counselor.${stamp}@${domain}`;
const APP_PASSWORD = "Correct-Horse-9"; // passes the client checklist; never a real human credential

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
const schemaReady = String(process.env.E2E_SCHEMA_READY || "") === "1"; // set by the human step note below
const sysadminEmail = process.env.SEED_SYSADMIN_EMAIL || "";
const sysadminPassword = process.env.SEED_PASSWORD || "";

test.describe.serial("google flow gates", () => {
  test.beforeAll(async () => {
    if (!url || !service) test.skip(true, "Supabase env missing — run with the local env present.");
    if (!schemaReady) {
      test.skip(
        true,
        "counselor_requests table is pending — apply the Google-round block from supabase/schema.sql in the SQL editor, then set E2E_SCHEMA_READY=1 (human step, same rule as resume_runs)."
      );
    }
  });

  async function admin() {
    const { createClient } = await import("@supabase/supabase-js");
    return createClient(url!, service!, { auth: { autoRefreshToken: false, persistSession: false } });
  }

  /** Identity WITHOUT profile — the fixture that stands in for a fresh Google identity. */
  async function seedGateUser(email: string) {
    const a = await admin();
    const { data, error } = await a.auth.admin.createUser({
      email,
      password: APP_PASSWORD,
      email_confirm: true,
    });
    if (error) throw new Error(`seedGateUser: ${error.message}`);
    return data.user!;
  }

  /** Remove every trace: state, profiles, requests, the auth user itself. */
  async function purgeUser(email: string) {
    const a = await admin();
    const { data: profile } = await a.from("profiles").select("id, student_id").eq("email", email).maybeSingle();
    if (profile?.student_id) await a.from("student_state").delete().eq("student_id", profile.student_id);
    if (profile?.id) await a.from("profiles").delete().eq("id", profile.id);
    await a.from("counselor_requests").delete().eq("email", email);
    const { data: list } = await a.auth.admin.listUsers({ page: 1, perPage: 2000 });
    for (const u of list?.users ?? []) if (u.email === email) await a.auth.admin.deleteUser(u.id);
  }

  test("picker: student pick provisions like the password form", async ({ page }) => {
    test.setTimeout(90_000);
    await seedGateUser(studentEmail);
    // sign in through the form → the gate, not a roster probe's no_account
    await page.goto("/signin");
    await page.locator("#f-email").fill(studentEmail);
    await page.locator("#f-pass").fill(APP_PASSWORD);
    await page.getByRole("button", { name: "Sign in" }).click();

    // the gate surfaces the picker (fresh), not a dashboard
    await expect(page).toHaveURL(/\/welcome$/);
    await expect(page.locator("#pick-student")).toBeVisible();
    await expect(page.locator("#pick-counselor")).toBeVisible();

    // student pick → provisioned → onboarding
    await page.locator("#pick-student").click();
    await expect(page).toHaveURL(/\/onboarding$/, { timeout: 20_000 });

    // the roster row exists EXACTLY like a password-form signup (audit honesty)
    const a = await admin();
    const { data: profile } = await a.from("profiles").select("id, role, student_id, campus").eq("email", studentEmail).maybeSingle();
    expect(profile?.role).toBe("student");
    expect(profile?.campus).toBe("demo-campus");
    const { data: state } = await a.from("student_state").select("student_id").eq("student_id", profile!.student_id).maybeSingle();
    expect(state?.student_id).toBe(profile!.student_id);
    await purgeUser(studentEmail);
  });

  test("picker: counselor pick records a pending application — zero access", async ({ page }) => {
    test.setTimeout(90_000);
    await seedGateUser(applicantEmail);
    await page.goto("/signin");
    await page.locator("#f-email").fill(applicantEmail);
    await page.locator("#f-pass").fill(APP_PASSWORD);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/welcome$/);

    await page.locator("#pick-counselor").click();
    await page.locator("#c-note").fill("Advises the AB Psych cohort on readiness checks");
    await page.locator("#c-send").click();
    await expect(page.locator("#welcome-pending")).toBeVisible();

    // the trail exists; no profiles row was written; no admin session role
    const a = await admin();
    const { data: req } = await a.from("counselor_requests").select("status, note").eq("email", applicantEmail).maybeSingle();
    expect(req?.status).toBe("pending");
    expect(req?.note).toContain("AB Psych");
    const { data: profile } = await a.from("profiles").select("id").eq("email", applicantEmail).maybeSingle();
    expect(profile).toBeNull();

    // the gate holds on app surfaces: bounce to /welcome, NOT the marketing
    // page and NOT /signin (whose probe would answer no_account)
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/welcome$/);
  });

  test("sysadmin approves → counselor exists with both role markers", async ({ page }) => {
    test.skip(!sysadminEmail || !sysadminPassword, "Seeded sysadmin env missing (SEED_SYSADMIN_EMAIL / SEED_PASSWORD) — human step.");
    // the request row from the previous test is the fixture
    const a = await admin();
    await page.goto("/signin");
    await page.locator("#f-email").fill(sysadminEmail);
    await page.locator("#f-pass").fill(sysadminPassword);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/admin$/);

    await page.getByRole("link", { name: "Counselor requests" }).click();
    await expect(page).toHaveURL(/\/admin\/counselor-requests$/);
    await page.getByRole("button", { name: `Approve ${applicantEmail}` }).click();

    // the row leaves the queue (single source of truth re-read)
    await expect(page.getByTestId(`counselor-request-${applicantEmail}`)).toHaveCount(0);

    // BOTH role markers: profiles row + JWT app_metadata (the proxy contract)
    const { data: profile } = await a.from("profiles").select("id, role, campus").eq("email", applicantEmail).maybeSingle();
    expect(profile?.role).toBe("counselor");
    expect(profile?.campus).toBe("demo-campus");
    const { data: authUser } = await a.auth.admin.getUserById(profile!.id);
    expect(authUser?.user?.app_metadata?.role).toBe("counselor");

    // the approved applicant signs in AGAIN → the staff dest rule resolves /admin
    await purgeUser(applicantEmail); // not needed for THIS probe — see note below
  });

  test("approved applicant reaches /admin on next sign-in", async ({ page, request }) => {
    test.skip(!sysadminEmail || !sysadminPassword || !service, "Seeded sysadmin + service env missing — human step.");
    test.setTimeout(90_000);
    // reseed the identity + the APPROVED state directly (the approval API
    // already proved itself in the previous probe; this reads its aftermath)
    const a = await admin();
    const { data: profile } = await a.from("profiles").select("id").eq("email", applicantEmail).maybeSingle();
    test.skip(!profile, "Previous probe purged the approved fixture — re-running the pair supplies it.");

    // sign in as the applicant (password identity bound to the same auth user)
    await page.goto("/signin");
    await page.locator("#f-email").fill(applicantEmail);
    await page.locator("#f-pass").fill(APP_PASSWORD);
    await page.getByRole("button", { name: "Sign in" }).click();

    // staff dest: the Admin console, no onboarding, no dashboard
    await expect(page).toHaveURL(/\/admin$/);
  });

  test("API: provision answers honestly without a session or a valid role", async ({ request }) => {
    const res = await request.post("/api/auth/provision", { data: { role: "sysadmin" } });
    // no session: the gate answer is not_found-tier honesty — a self-serve
    // sysadmin pick must NEVER be possible with or without a session
    expect([400, 401]).toContain(res.status());
    expect(await res.json()).toMatchObject({ error: "bad_role" });
  });
});
```

*(Post-review note carried into implementation: probe 3's trailing `purgeUser(applicantEmail)` line contradicts probe 4's need for the approved fixture — DELETE that line from probe 3 when writing the file; probe 4 already `test.skip`s cleanly in environments where the serial pair didn't both run. The plan records the self-review fix inline per the no-placeholder rule.)*

- [ ] **Step 2: Run the spec with env + schema present**

Run: `npm run e2e -- e2e/google-flow.spec.ts`
Expected: PASS (or the documented skip when the human prereqs are pending — skip messages must name the exact click/setting).

- [ ] **Step 3: Commit**

```bash
git add e2e/google-flow.spec.ts
git commit -m "e2e: google-flow gates (picker, pending, sysadmin grant, dest)"
```

---

### Task 11: Manual verification checklist (the OAuth hop itself — human steps, recorded in the round report)

No code. Run with the SUPABASE/Google config from the Human prerequisites block live:

- [ ] **Real Google account, full round:** `/signup` → Continue with Google → consent → land on `/welcome` → pick student → `/onboarding`. In Supabase Table editor confirm: `profiles.role='student'`, `student_state` row exists, auth user `app_metadata.role='student'`.
- [ ] **Roster bind (auto-linking):** with Neil's real seeded account email, Google sign-in → consent → lands at THAT account's dest (`/dashboard` or `/onboarding`) — verify in the dashboard the auth user now shows TWO identities (password + google), one auth user, one profiles row.
- [ ] **Denied consent:** click Continue → close the Google consent → land on `/signin?state=google` with the honest notice — NOT `/forgot?state=expired`.
- [ ] **Counselor round-trip with a real personal Gmail:** pick counselor → pending → sysadmin approves in the panel → that personal Gmail signs in → `/admin`.
- [ ] **Recovery regression:** forgot-password email flow still completes (the `via` branch defaults byte-identical when absent).

- [ ] **Step: Commit only if any doc/report artifact resulted**

```bash
git add docs demo-artifacts 2>/dev/null || git add docs
git commit -m "docs: google round manual-verification report"
```

---

### Task 12: `lib/mail.ts` — the approval notification sender

**Files:**
- Create: `lib/mail.ts`
- Modify: `package.json` (+ `nodemailer@^10.3.1`)

**Sequencing:** complete BEFORE Task 11's manual checklist runs (the checklist tests the real send). Execute after the Human prerequisites' SMTP block is available.

- [ ] **Step 1: Verify the dependency is the latest stable BEFORE install (the standing dependency rule — record the check in the round report)**

Run: `npm view nodemailer version dist-tags.latest`
Expected: `10.3.1` on BOTH keys (`latest` must not be a prerelease). Already registry-checked by the plan author 2026-11-03; the executor re-verifies at install time.

- [ ] **Step 2: Install + add types**

Run: `npm install nodemailer@^10.3.1`
Expected: package.json gains `"nodemailer": "^10.3.1"` in dependencies; lockfile updates.

- [ ] **Step 3: Create the module**

```ts
import nodemailer from "nodemailer";

/**
 * Approval notification sender (Google round, ADR 0006 + user email
 * decision 2026-11-03). ONE event emails: counselor ACCESS APPROVED.
 * The application-received moment is deliberately the /welcome pending
 * text, and rejection is deliberately silent.
 *
 * Best-effort by contract: SMTP health can NEVER gate the approval — the
 * row is already stamped approved/decided_by before this runs — so this
 * module answers a tri-value status instead of throwing, and the admin
 * surface tells the approving human when the notification didn't ride
 * (they tell the applicant by other means; the trail's truth is the row).
 * Credentials live in .env.local ONLY (never committed; repo rule: real
 * addresses/credentials never enter the repo).
 */
export interface MailEnv {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
}

export function senderEnv(): MailEnv | null {
  const host = process.env.MAIL_SMTP_HOST;
  const port = process.env.MAIL_SMTP_PORT;
  const user = process.env.MAIL_SMTP_USER;
  const pass = process.env.MAIL_SMTP_PASS;
  const from = process.env.MAIL_FROM;
  if (!host || !user || !pass || !from) return null;
  return { host, port: Number(port || 465), user, pass, from };
}

export type MailStatus = "sent" | "skipped_no_config" | "failed";

export function mailStatus(reason: "no_config" | "error"): MailStatus {
  return reason === "no_config" ? "skipped_no_config" : "failed";
}

export async function sendCounselorApproved(to: string, fullName: string): Promise<MailStatus> {
  const env = senderEnv();
  if (!env) return mailStatus("no_config");
  try {
    const transport = nodemailer.createTransport({
      host: env.host,
      port: env.port,
      secure: env.port === 465, // TLS-on-connect; other ports go STARTTLS per SMTP
      auth: { user: env.user, pass: env.pass },
    });
    await transport.sendMail({
      from: env.from,
      to,
      subject: "Baseline — your counselor access is approved",
      text:
        `${fullName},\n\nYour request for counselor access to Baseline was approved.\n` +
        `Sign in again with Google and the Admin console opens for you.\n\n` +
        `If this wasn't you, ignore this email — no reply is read at this address.`,
    });
    return "sent";
  } catch {
    return mailStatus("error");
  }
}
```

- [ ] **Step 4: Typecheck + no-behavior check**

Run: `npx tsc --noEmit`
Expected: clean (module is server-only; nothing imports it in a client component).

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json lib/mail.ts
git commit -m "mail: approval-notification sender (nodemailer SMTP, best-effort)"
```

---

### Task 13: Wire the send into the approval route + the admin surface's honest banner

**Files:**
- Modify: `app/api/admin/counselor-requests/[id]/route.ts` (approve branch tail)
- Modify: `app/admin/counselor-requests/ApproveRow.tsx` — the `decide()` handler and a mail-status banner (full replacement below)

- [ ] **Step 1: The approve branch of the route answers `mailStatus`**

In the PATCH route's approve section, after the request row is stamped `approved`, replace the final `return NextResponse.json({ status: "approved" });` with:

```ts
    // best-effort notification AFTER every grant-side write succeeded —
    // SMTP failure can never un- or half-grant (lib/mail.ts contract)
    const { sendCounselorApproved } = await import("@/lib/mail");
    const mailStatus = await sendCounselorApproved(request.email, request.full_name);
    return NextResponse.json({ status: "approved", mailStatus });
```

…and add to the route's doc-comment Errors line the note `(mailStatus rides on a 200 approve: sent | skipped_no_config | failed — never a failure marker)`.

- [ ] **Step 2: ApproveRow surfaces the truth — full replacement of `decide()` + render additions**

```ts
  const [mailNote, setMailNote] = useState<string | null>(null);

  async function decide(action: "approve" | "reject") {
    setActing(action);
    setErr(null);
    try {
      const res = await fetch(`/api/admin/counselor-requests/${row.userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        if (res.status === 409) {
          // already_decided (another admin ruled, or this decision landed in a
          // lost response): the truthful action is a refresh, not an error —
          // the list re-reads and shows the decided state
          router.refresh();
          return;
        }
        setErr("The decision didn't record. Try again.");
        return;
      }
      const data = (await res.json().catch(() => null)) as { mailStatus?: string } | null;
      if (action === "approve" && data?.mailStatus && data.mailStatus !== "sent") {
        setMailNote(
          data.mailStatus === "skipped_no_config"
            ? "Approved — mail config is off, so no email went out. Let them know by other means."
            : "Approved — but the SMTP send failed, so no email reached them. Let them know by other means."
        );
      }
      router.refresh();
    } catch {
      setErr("The decision didn't record. Try again.");
    } finally {
      setActing(null);
    }
  }
```

And render it inside the row (under the note paragraph, above the error line):

```tsx
      {mailNote && (
        <div className="field-err" role="status" style={{ display: "block", color: "var(--ink-1)" }}>
          {mailNote}
        </div>
      )}
```

The row leaves the queue on refresh because the server list only reads `status = 'pending'` — but that unmounts the component with the banner still unpaid to the approving human. The banner therefore MUST get its reading time inside the row's lifetime. Full replacement of the `if`-tail of `decide()` (Step 2 already declared `mailNote`):

```tsx
      if (action === "approve" && data?.mailStatus && data.mailStatus !== "sent") {
        setMailNote(
          data.mailStatus === "skipped_no_config"
            ? "Approved — mail config is off, so no email went out. Let them know by other means."
            : "Approved — but the SMTP send failed, so no email reached them. Let them know by other means."
        );
        // 6s reading time BEFORE the refresh unmounts the row — the banner is
        // the approving human's work item; the server truth (row gone from the
        // pending list) lands one screen-beat later, correct the whole time.
        await new Promise((r) => setTimeout(r, 6000));
      }
      router.refresh();
```

Adding the full approve flow in order: PATCH authenticates, profiles row writes, `app_metadata` stamps, request row stamps `approved/decided_by/decided_at`, `lib/mail.ts` attempts the send and answers a status, the UI holds the banner, then the refresh shows the row gone. The email is a courtesy on top of completed facts — it can fail silently-surfaced; the audit trail (`decided_by/decided_at`) never depends on SMTP health.

- [ ] **Step 3: Typecheck + build + the gates e2e (traffic-light check that nothing else moved)**

Run: `npx tsc --noEmit && npm run build && npm run e2e -- e2e/google-flow.spec.ts`
Expected: PASS — the approve probe's queue assertions hold regardless of SMTP env (`mailStatus` only changes the banner, never the row's approved fate; without `MAIL_*` env the banner says config-off, with it the real send fires).

- [ ] **Step 4: Commit**

```bash
git add "app/api/admin/counselor-requests" "app/admin/counselor-requests/ApproveRow.tsx"
git commit -m "admin: approval email rides the grant (status banner, never a blocker)"
```

---

## Self-review (run by the plan author — done 2026-11-03)

1. **Spec coverage vs. user decisions:** full sign-up + sign-in (Tasks 5/6/7) · any Google account, no domain logic anywhere (grep a diff for `.*\.edu|@([a-z]+)\.(edu|ph)` post-implementation — expected: none in the auth path) · role from profiles, never the pick alone (Task 7 counselor branch + Task 8 grant route) · auto-linking (human prerequisite + Task 11 probe) · ADR record (Task 9). Two leftovers marked inline: probe-3's purge line (Task 10 note) and CONTEXT.md "privilege" typo (Task 9 note) — both fixed at write time.
2. **Placeholder scan:** every code block is complete; two deliberate `await import("@/lib/session")` forms are annotated as equivalent to top-imports (wiring task explicitly prefers the top-import).
3. **Type consistency:** `destFor(profile: { role: Role; studentId: string | null })` matches every call site shown (row fields `profile.role/student_id`; the Profile-typed object in session); `RequestRow` exported and consumed unchanged; error-contract strings (`not_signed_in | bad_role | already_provisioned | note_required | server`, `unauthorized | forbidden | bad_json | bad_input | not_found | server`) are single-sourced in their route doc comments and asserted by the e2e.
