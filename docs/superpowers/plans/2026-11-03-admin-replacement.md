# admin-replacement plan — the mockup realm becomes the real Admin surface

**For:** the cutover round that replaces the single-page `/admin` console with the
multi-tab roles console approved through the 2026-11-03 feedback rounds.
**Status:** designed, user-cleared (2026-11-03, this session); **gated on the
`round/google-signin` merge** (its session is active in its worktree — hands off
until it lands on main). Demo timing is explicitly NOT a concern (user-ruled).

## Source of truth

The mockup realm (`app/admin/mockups/` — main tree, and a ported copy in the
google-signin worktree) IS the final design: v7 shell, sidebar pages,
structured tables with defined column heads, pagination, the audit detail
dialog (no machine-checks field), no filters/bands/explanatory copy, accounts
kebab affordance. Its honesty law converts on cutover: painted fixtures die,
store rows render through the same components, nothing stays painted.

## Merge order (user-ruled 2026-11-03)

1. Wait for `round/google-signin` → main. While it holds, NO edits in that
   worktree and NO merges from here.
2. On merge, first choreography step: **dedupe `app/admin/page.tsx`** — both
   sides carry `import AdminMockupGate from "./mockups/AdminMockupGate";` +
   `<AdminMockupGate />`; collapse to one, drop the worktree's realm copy in
   favor of main's, keep the worktree's `AdminBar role` slot + counselor-
   requests queue + welcome gate.
3. Then dispatch the waves below.

## Wave 1 — the tabbed console (counselor + shared pages)

`app/admin/page.tsx` restructures into the realm shell at full-data truth:

- **COHORT tab** — `StudentRow` roster (UNCHANGED query path:
  `db.listStudentStates()` + `getStudentView()`, `COHORT_ORDER`, `personaMeta`);
  columns per mockup: NAME · TARGET ROLE (state `careerId` → catalog) · SCORE ·
  AUDITS (counts from `credentialStore`) · LAST ACTIVE · VIEW. No CHANNELS bar
  (user-ruled), no filters.
- **AUDIT tab** — existing `AuditQueue` re-homed into a table pane with defined
  heads (STATUS · STUDENT · CREDENTIAL · DECLARED · EVIDENCE · →);
  row click opens the detail dialog: student, evidence link + declared stamp,
  ruling form (armed APROVE / armed REJECT — the live component's armed-reject
  pattern is the law) with note mandatory on reject; ruled rows show the
  trail (ruled by/at + note). The machine-checks concept stays gone
  (user-ruled).
- **AdminBar** — keeps the worktree's role slot ("Counselor requests" sysadmin
  link retires into the sidebar APPROVALS tab; the link may die with the bar
  once tabs own navigation).
- The old single-page markup is decommissioned with the wave (its sections are
  the two tabs above).

## Wave 2 — APPROVALS tab (sysadmin-only)

- Bind the real `counselor_requests` table (worktree code), sysadmin-gated.
- One defined table: APPLICANT · REQUEST · DECLARED · TRAIL · STATUS · ACTION.
- **Option A law (user-selected 2026-11-03):** inline arm → confirm on the
  row; confirm hits the existing `POST/PATCH /api/admin/counselor-requests/[id]`
  — never a one-click irreversible grant. DENY keeps note-required semantics if
  the schema carries one.
- Decision trail renders real `decided_by`/`decided_at`; mock's
  "by you · just now" disappears with the fixtures.

## Wave 3 — ACCOUNTS tab (sysadmin-only; the one new backend)

- Read: sysadmin-only store helper — service-role join of Supabase Auth users
  ↔ `profiles` (name, email, role, campus/section, `last_sign_in_at`).
- Write: soft-deactivate ONLY (a `profiles` flag or Supabase ban + metadata
  mark) + reactivate. The DPA hard-delete route stays untouched and
  students-only. No self-deactivation; the sysadmin row shows "—" (mockup law).
- Table: ACCOUNT · ROLE · STATUS · LAST SIGN-IN · `⋯` kebab (menu holds
  Profile / Deactivate / Reactivate — keeping the action out of the inline
  run, user-ruled).
- Honest vacancy: deactivated identities thin out of the roster while the
  trail rows remain.
- This tab can land after Waves 1–2 without blocking them.

## Carried decisions (from the planning + feedback record)

- Roles: counselor READS + AUDITS the cohort; sysadmin PROVISIONS + manages
  accounts. Shared: cohort + audit queue, one dataset, both roles.
- counselors never render the sysadmin tabs; sysadmin rows carry the system
  pages. No counselor sees account management or approvals.
- Section/tenant scoping stays parked (ticket 11 ruling, 2026-11-03).
- e2e hook classes (.s-row, .aq-*, .dt-score, …) remain the defended surface's
  and must not leak into any new realm CSS.
- Demo scripts: user explicitly waived demo risk for this cutover.
