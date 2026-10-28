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
create table if not exists public.credentials (
  id              uuid primary key default gen_random_uuid(),
  student_id      text not null references public.profiles(student_id) on delete cascade,
  kind            text not null check (kind in ('certification', 'internship', 'project')),
  title           text not null,
  organization    text,
  started_on      date,
  ended_on        date,
  evidence_url    text,
  evidence_note   text,
  -- Skills declared from the framework vocabulary (closes gaps when verified).
  declared_skills text[] not null default '{}',
  -- declared (evidence attached, pending audit) → verified / rejected by a Counselor.
  status          text not null default 'declared' check (status in ('declared', 'verified', 'rejected')),
  verified_by     text,
  verified_at     timestamptz,
  created_at      timestamptz not null default now()
);

create index if not exists credentials_student_idx on public.credentials (student_id);

-- ── RLS: deny-all for client roles; service role bypasses ───────────────
alter table public.profiles      enable row level security;
alter table public.student_state enable row level security;
alter table public.credentials   enable row level security;
