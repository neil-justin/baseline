# Google sign-in round — go-live report (2026-11-03)

Feature: managed Google single sign-on (sign-up + sign-in) on Supabase Auth — role picker gate at `/welcome`, sysadmin-approved counselor intake, roster-decided privileges. **Merged to main as `f98da69`** (branch `round/google-signin`, 34 commits, plan: `docs/superpowers/plans/2026-11-03-google-signin.md`, decision record: `docs/adr/0006-google-oauth-role-picker.md`).

## Shipped surface

- "Continue with Google" (branded four-color G, inline SVG) on both auth surfaces; OAuth returns through the shared PKCE route (`via=google` branch) and a dest probe (`/auth/google` → roster rule: staff → `/admin`, student with career → `/dashboard`, fresh identity → `/welcome`)
- `/welcome` first-time-identity gate: **student** → instant provisioning (shared `provisionStudent` seam with the password form); **counselor** → pending application, zero access until a sysadmin approves; sysadmin never self-serve (`bad_role` even by direct API call)
- Admin grant surface: sysadmin-only queue; approve = `approve_counselor()` **SECURITY DEFINER RPC** (one transaction: profiles row + approval trail stamp; idempotent; locked to the service role via revoke/grant) + JWT `app_metadata` stamp with **healing-retry** semantics (re-click completes a partially-failed chain; no interleaving can double-grant or overwrite a decision — rejected/decided rows answer `409 already_decided`)
- Approval email: nodemailer 10.3.1 (registry-verified latest stable) over the user's SMTP; **best-effort, at-least-once** (any approved-status re-entry re-sends); SMTP deadlines + failure log; tri-value `mailStatus` rides the final 200 with an honest admin banner when the courtesy mail didn't ride. Rejection is deliberately silent; the application-received moment stays the `/welcome` pending text.
- One destination rule extracted once (`lib/session.ts destFor`) and swept through sign-in, the landing page, and the OAuth probe; provision-less signed sessions bounce to `/welcome`, never `/signin`

## Verification

- **Automated:** typecheck clean; fixtures 62/62; six-probe gates spec (`e2e/google-flow.spec.ts`, branch `round/google-signin`) fully green — student pick end-to-end, counselor application + zero-access gates, sysadmin approve (both role markers: `profiles.role` + JWT `app_metadata`), stale-reject 409, API honesty (401/`bad_role`), fixture purge. Regressions: fresh-account + password-confirm suites green (one documented rate-limit flake passed on retry).
- **Manual (user-driven, on the running app):** the four checklist stops were confirmed working by the user ("It works") — full round with Google consent, counselor application → sysadmin approval round-trip incl. the approval email arriving, roster email login. Per-step detail was not recorded in this session; the user elects to file specifics when needed.
- **Note on scope change mid-round:** the project later ruled the UI-e2e harness away (cutover `51ba298`), so the gates spec lives on the round branch as the record; the merged main carries no playwright harness. The manual checklist above is the standing UI-flow proof.

## Ops notes (live project)

- Schema applied live: `counselor_requests` + `approve_counselor()` RPC + the revoke-public/grant-service_role lock (SQL editor; `E2E_SCHEMA_READY` honored)
- **Sysadmin password reset:** the live sysadmin identity's password had drifted from the documented seed value; it was reset to seed parity (`readiness`) via the service-role key and verified (`200 → /admin`) at the user's approval.
- Provider enablement: verified live (`/auth/v1/settings` reads google enabled only after the dashboard save; a mid-round "still off" reading was the report's own shape-misreading bug, corrected to the user).
- **Approval-email incident, resolved:** an early broken-run fixture (`google.counselor.…@aisat.test`) survived into the queue and was hand-approved during the manual walk — Gmail bounced the feedback to a `.test` domain, which incidentally proved the SMTP send path end-to-end. Fixture residue was swept from `counselor_requests`/profiles; **and the sweep over-deleted four canon cohort auth users (`rafael/liza/paolo/kaye`)** — repaired by re-running `scripts/seed-accounts.mjs` (idempotent), verified: 7 roster rows restored, cohort login green, demo states intact (11 rows). Lesson recorded: residue sweeps must key off the seed roster, not name prefixes.
- Deployment parity: production sign-in will additionally need this project's origin(s) in the Google OAuth client's Authorized JavaScript origins + the same two `/auth/confirm` redirect URLs in Supabase (the local values are in place and verified).

## Post-merge follow-ups surfaced (not acted on unilaterally)

- `@playwright/test` devDep orphaned by the cutover commit — removal approved post-merge (see the same-day commit; kept out of this merge commit intentionally).
- The e2e-vs-harness decrepancy above is closed by the manual checklist; if the harness ever returns (including this round's spec), reseat `e2e/google-flow.spec.ts` from branch `round/google-signin`.
