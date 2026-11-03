# Google OAuth with the roster-decided role picker + human counselor grant

Google single sign-on (sign-up + sign-in) ships on Supabase Auth's native Google provider — zero new dependencies for the OAuth hop itself (the approval email adds nodemailer, best-effort, below), the same signed-cookie session machinery, and the PKCE callback route the recovery flow already owns. Standing decisions brought into this round: self-registration is students-only, staff are provisioned, never self-registered; the profiles table is the role source; some real schools issue no school email, so role must derive from humans, never from an address or its domain. First-time Google users choose between two declinations at /welcome: student (activated immediately — declared, not silently defaulted) or counselor (a counselor_requests application — no access until a sysadmin approves, which commits the profiles row + the approval stamp in one transaction and then stamps the app_metadata role). Automatic identity linking is enabled so roster accounts bind their Google identity by verified-email match.

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
- Multi-campus and admin self-promotion remain out of scope (ticket 11; sysadmin stays provision-only). **Counselor section scoping is likewise deferred (user ruling 2026-11-03)**: a counselor's jurisdiction is the whole demo cohort; the approval queue grants campus `demo-campus`/section null and carries NO section assignment field — ticket 11 adds that when it builds tenant enforcement.
