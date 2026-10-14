# Design — Next.js Build Phase (fixture-backed demo app)

Date: 2026-10-14 · Status: approved in chat, pre-plan
Specs this builds from (do NOT reopen): `features/features.md` v1.3 · `features/app-flow.md` · `features/content/*.md` (12 files) · `features/content/_fixture-math.md` (data canon; contradictions lose to it) · DESIGN.md / "The Index" · surface briefs in `.impeccable/surfaces/` · edge-case audit handoff 2026-10-14.

## Goal

Port the verified static `prototype/` into a Next.js application: same world, same computed numbers, demo-arc beats 1–10 wired end-to-end. Mock defense ~Oct 17.

## Decisions (user-confirmed)

- **Target:** Next.js build phase only. The four pending sweep decisions (stage-① queue re-cut, "People skills" vocabulary, onboarding counter copy, fixtures ship-as-is) are applied inline during porting — the static audit is superseded as a gate.
- **Port strategy:** direct port. Recreate markup from the prototype, port its hand-written CSS into Tailwind v4 `@theme` tokens from DESIGN.md, port interactions as small client components. shadcn/ui minimal or unused — The Index's component vocabulary is bespoke. Lowest visual drift; surfaces already verified at 390/768/1440/1920.
- **Deployment:** local-only demo. No Vercel dependency for the defense; production-build `next start` on the laptop. Vercel preview optional post-defense.
- **Testing:** demo-arc E2E only (Playwright, beats 1–10, assertions per `_fixture-math.md`: 40 → switch dip 10 → re-assess 33 → money-shot 51). Engine logic asserted against fixture-math during P0, not a separate unit-suite.

## Stack (locked, 2026-10-12 reassessment)

Next.js **16** App Router (pin `16.3.x`) + TypeScript · Tailwind v4 · local Supabase (CLI Postgres + local auth, seeded accounts). **Task #1 of Phase 0 verifies Docker WSL; if unavailable, fall back to SQLite/JSON data layer behind identical function signatures** (`db.ts` interface unchanged; hosted-Supabase swap story preserved). No `@react-pdf/renderer` (post-defense). Fonts self-hosted woff2 (`font-display: block`), copied from `prototype/fonts/`.

## Architecture

- `app/(marketing)/page.tsx` — landing (index.html port)
- `app/(auth)/signin|signup` — seeded local accounts
- `app/(app)/onboarding/` — stepper (5 stages) as one composed client flow; `M1 dashboard`, `M2–M3 career`, `M4–M7 pathway`, `M6, M9 progress`, `M11–M12 profile` under `app/(app)/`
- `app/admin/` — read-only cohort + per-student (`admin-student.html` port)
- `lib/engines/` — pure TS: rubric scoring (SP40/ES25/TP20/CC15), skills-match (unweighted X-of-Y, verified/check-only), gap ranking (tier ×3/×1, free-PH-first ties), goal types. Route handlers (`app/api/*`) call engines + data layer only; engines import no framework code (this is the fixtures→dynamic seam).
- `lib/fixtures/` — 32-career catalog from `_catalog-extract.md`, Neil's state machine per `_fixture-math.md` beat states, Marco/Jomar TESDA-anchored fixtures per edge-case-audit §3.
- **Data model mirrors the prototype's JS state** (student, career, skills, claims, checks, goals, events) — schema lives where Supabase local lands or SQLite fallback; seeds generate exactly the canon states.

## Execution model — file-ownership contract (user requirement: parallel agents + atomic commits)

- **I am the single committer.** Agents build, never commit. One atomic commit per landed unit (`feat: port dashboard surface`, `feat: fixture layer + seed`, `test: demo-arc e2e beat 7`).
- **Phase-serial shared foundation.** Shared files (tokens, layout, components, engines, data layer, schema/seed) are built by me before any page agent spawns, then frozen.
- **Per-surface agents own one directory each** — `app/(app)/dashboard/`, `career/`, `pathway/`, `progress/`, `profile/`, `app/admin/`, `app/(marketing)/`, `app/(auth)/`, `onboarding` — fully disjoint paths, zero merge surface. Briefs route shared-file needs back to me instead of edits.
- **Testing agent** owns `e2e/` only; runs after integration, routes bugs to me or owning agent.
- Rationale: disjoint dirs make "conflicts" structurally impossible; single-committer + frozen shared files make history atomic. Worktrees rejected as overkill — same guarantee, worse integration visibility.

## Phases (~3 days)

- **P0 — skeleton (me, serial, ~½ day):** scaffold; Docker/WSL check; `@theme` tokens from DESIGN.md; fonts; root layout + 5-item nav; shared components (`Readout`, `RubricBar`, `MonoTable`, `HairlinePanel`, gauge pattern per DESIGN.md §Signature); fixture data layer + seeds; engines + route-handler skeletons; engine-vs-fixture-math assertion checks. Frozen after this phase.
- **P1 — 8 parallel surface agents:** port markup/CSS/interactions per brief + that surface's ⏳ undecided-student defaults from the edge-case audit as explicit brief items. Each agent self-verifies (renders at demo widths, no overflow, no CLS suspects: transform/opacity-only animation, tabular-nums, font-display block) before reporting.
- **P2 — integration + testing agent:** standalone Playwright E2E walking beats 1–10 incl. money shot; fix round routed to owners; I commit fixes atomically.
- **P3 — defense dry-run (me):** full scripted walkthrough on production build, laptop-local; screen recording captured as backup.

## Error handling

Missing/unknown `?student=` → demo student default (decided). All ⏳ defaults (undecided student, zero-progress, zero-result filters, empty feeds) are one conditional per list container, seeded not blank. Route-handler failures degrade to fixture-canonical values with an honest mono source line, consistent with "computed, never painted."

## Non-goals

`@react-pdf/renderer`/export buttons · AI interview, resume builder/analysis, university finder (deprecated, must not appear) · adaptive/level-based learning · hosted Supabase swap · full 8-competency ES battery.
