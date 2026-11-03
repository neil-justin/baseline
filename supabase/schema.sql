-- Career readiness platform — Supabase schema (ADR 0003).
-- Apply via the Supabase dashboard SQL editor (or a pg connection).
--
-- Access model: ALL app access flows through server routes using the
-- service-role key (bypasses RLS). RLS is therefore enabled with no
-- policies — anon/authenticated clients are denied at the table level;
-- the service role is the only writer. Identity comes from Supabase Auth
-- (hashed passwords, signed JWT sessions).

-- ── Identity/profile (one row per auth user) ────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null unique,
  full_name   text not null,
  -- Locked roles (CONTEXT.md): Student · Counselor (the Admin surface
  -- person) · System Admin (study team ops). Role also lives in the auth
  -- user's app_metadata so the proxy guard never needs a DB round-trip.
  role        text not null check (role in ('student', 'counselor', 'sysadmin')),
  -- Business id used across fixtures/engines (neil, marco, …); null for staff.
  student_id  text unique,
  -- Tenant key — single campus for the defense; ticket 11 owns the
  -- multi-tenant design. Carried from day one so retrofit never happens.
  campus      text not null default 'demo-campus',
  year_level  text,
  program     text,
  section     text,
  created_at  timestamptz not null default now()
);

-- ── Engine state (one JSON blob per student — the swap seam's shape) ────
create table if not exists public.student_state (
  student_id text primary key,
  state      jsonb not null,
  updated_at timestamptz not null default now()
);

-- ── Credentials (Profile → Credentials; ticket-recorded 2026-10-28) ─────
-- Ticket 12 (2026-10-29): 'presence' is the FOURTH kind — the declared
-- LinkedIn + professional contact email, machine-verified by a timestamped
-- stamp (verified_at set at declaration, never counselor-audited). An offline
-- deployment presents the stamp; the app never network-fetches the link
-- (lib/engines/air.ts grades the deterministic offline checks).
create table if not exists public.credentials (
  id              uuid primary key default gen_random_uuid(),
  student_id      text not null references public.profiles(student_id) on delete cascade,
  kind            text not null check (kind in ('certification', 'internship', 'project', 'presence')),
  title           text not null,
  organization    text,
  started_on      date,
  ended_on        date,
  evidence_url    text,   -- presence rows: the LinkedIn URL
  evidence_note   text,   -- presence rows: the professional contact email
  -- Skills declared from the framework vocabulary (closes gaps when verified).
  declared_skills text[] not null default '{}',
  -- declared (evidence attached, pending audit) → verified / rejected by a Counselor.
  -- presence rows are stamped instead: status 'verified' + verified_at AT DECLARATION.
  status          text not null default 'declared' check (status in ('declared', 'verified', 'rejected')),
  verified_by     text,
  verified_at     timestamptz,
  -- the audit's note — the REJECT-with-reason line (Round 7 re-cut, 2026-10-30
  -- profile sweep): the Counselor writes it on a 'rejected' ruling; the student
  -- side renders it verbatim and the revision loop carries it.
  audit_note      text,
  created_at      timestamptz not null default now()
);

-- Migration note (round-7 re-cut, 2026-10-30): for an already-applied schema
-- the audit-note column adds as:
--   alter table public.credentials add column audit_note text;

-- Migration note (ticket 12, 2026-10-29): for an already-applied schema the
-- kind constraint re-creates as:
--   alter table public.credentials drop constraint credentials_kind_check;
--   alter table public.credentials
--     add constraint credentials_kind_check
--     check (kind in ('certification', 'internship', 'project', 'presence'));

create index if not exists credentials_student_idx on public.credentials (student_id);

-- ── RLS: deny-all for client roles; service role bypasses ───────────────
alter table public.profiles      enable row level security;
alter table public.student_state enable row level security;
alter table public.credentials   enable row level security;

-- ── Resume diagnostic runs (round 6a — reconstructed from lib/db/resume-run-store.ts
--    contract: the round's own report never landed) ───────────────────────────
-- Latest run per student + history counters (unlimited re-runs, best AIR counts).
create table if not exists public.resume_runs (
  student_id text primary key,
  run        jsonb not null,
  best_air   numeric not null default 0,
  runs_count integer not null default 0,
  updated_at timestamptz not null default now()
);
alter table public.resume_runs enable row level security;

-- ── Cover-letter check runs (ticket-12 Prep pass, 2026-10-30 — mirrors
--    resume_runs; lib/db/letter-run-store.ts is the seam) ───────────────────
-- LATEST COUNTS (per-file AM semantics): ONE row per student — the stored run
-- IS the most recent check (no best column; runs_count is history only).
create table if not exists public.letter_runs (
  student_id text primary key,
  run        jsonb not null,
  runs_count integer not null default 0,
  updated_at timestamptz not null default now()
);
alter table public.letter_runs enable row level security;

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

-- Migration note (Google round, 2026-11-03): for an already-applied schema
-- the create-block above applies verbatim (idempotent) — playwright e2e
-- treats a missing table as skip condition.
