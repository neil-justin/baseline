# Real Supabase Auth + full Postgres migration before the defense

The platform's standing preference since 2026-10-12 was fixtures-first: demo-grade auth (unsigned base64 cookie, shared password `readiness`, plaintext compare), a JSON-file store (`data/state.json`), and app pages rendering a hardcoded demo student (`getStudentView("neil")`). That posture is indefensible against the locked thesis claims — counselor-run per cohort, section-scoped counselor views, audited credentials, and intended multi-campus tenancy — none of which are real if sessions are forgeable, data is one hardcoded student, and the "database" is a JSON file. We re-locked on 2026-10-28: **Supabase Auth** (the swap target already documented in code comments) with **full migration of student state to Postgres before the 2026-11-07 defense**. Feasibility was verified against the code first: `lib/db.ts` is the single storage seam (all 15 call sites are routes/pages; zero engine imports), the state is one JSON blob per student, and the `DemoStudentStore` interface was explicitly designed for this swap — so the migration is a one-file backend implementation plus a `listStudentStates()` addition for real cohort aggregation.

## Considered Options

- **Keep demo-grade auth, state it as a delimitation** — rejected: it contradicts the counselor/tenancy/audit claims the panel will probe, and "production would use real auth" invites "so the evaluated system isn't the real one?"
- **Minimal hardening only (signed cookie, per-account passwords)** — rejected: still fixture-based data, still no real accounts for the cohort story; half the work for none of the claim.
- **Supabase Auth + Auth.js + custom bcrypt/HMAC** — Supabase chosen: the documented destination, managed sessions and hashing, provides the database in the same move (one provider, free tier), least new code under deadline.

## Consequences

- The store interface is renamed **`StudentStore`** (the "Demo" prefix would lie once the backend is real); the JSON store survives only as a dev/test fallback behind the same interface.
- Engines remain untouched and deterministic — the migration swaps the backing store, not the scoring logic; the 3-tier live/fixture demo line survives.
- e2e helpers that reset state by deleting `data/state.json` need a DB-aware reset; the store gains `listStudentStates()` so the Admin cohort view reads real students instead of static ghost fixtures.
- Deployment ships hosted (Vercel + Supabase), but the defense demo runs locally — rehearsed fallback, no network dependency on defense day.
- The fixtures-first preference is narrowed, not abandoned: fixtures remain the canon for engine inputs (catalog, personas); what changed is that *storage and identity* are now real. This ADR is the citation for that boundary.
- Multi-campus tenancy is NOT built — the schema only avoids precluding it (ticket 11 session decides the tenant-key design).
