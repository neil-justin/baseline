# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

**UPDATED 2026-10-12 (user, ticket 07 reassessment — judged against demo physics: offline local demo, deprecated heavy features, ~Oct 17 deadline):** Next.js **16** App Router + TypeScript, pin `16.3.x` (bumped from 15 — architecture unchanged: App Router + route handlers) · all backend logic in route handlers · Supabase **local** for the prototype (CLI-backed Postgres + local auth; demo sign-in against seeded local accounts; hosted free tier is the post-defense swap — config change, no code change; one-time prerequisite: enable Docker Desktop WSL integration) · Tailwind v4 + shadcn/ui (unchanged; offline-safe: build-time compile, repo-copied components) · `@react-pdf/renderer` **cut from prototype scope** (serves only post-defense M11/M12 export; prototype Plan renders as a document with no export button) · single repo · no additional tooling/ORM/query libs. Demo runs locally on a laptop with fixtures; one Vercel preview for development.

## Users

- **Primary:** Philippine Senior High School students (Grade 11–12, STEM/ABM/HUMSS/GAS/TVL strands), many undecided about careers, mostly first-generation-to-career-guidance users, on mid-range phones/laptops, defense venue wifi unreliable.
- **Secondary (demo/eval):** thesis panel + adviser — watch a scripted student journey; admin surface is read-only seeded views.

## Product Purpose

An AI-powered career-readiness platform: guides an SHS student from undecided → chosen PH-relevant career → skills-gap picture → a ranked, staged learning pathway → progress that demonstrably moves a 0–100 Career Readiness Score → portable artifacts (competency profile, career development plan). Success = a defensible mock-defense demo this week, then the thesis defense with a complete, coherent feature story.

## Positioning

Strand-aware, Philippines-specific career readiness: 32 PH careers with curated skill maps + TESDA/entry-path awareness + deterministic, evidence-cited scoring — a mechanism generic US/EU tools (O*NET/ESCO-shaped) cannot truthfully copy.

## Operating Context

- **TIME-CRITICAL: mock defense THIS WEEK (~Oct 17)** — scope is demo-arc-first (`features/features.md` §8): undecided student → RIASEC → verification → first score → switch BEATS → gap→resource→score money shot → plan close. Everything non-demo-critical is post-defense.
- Demo: local laptop + fixtures; screen-recording backup; no venue-wifi dependency; no voice/interview equipment (deprecated).
- Thesis evidence culture: every claim cited (PSA 2026 stats on landing; NACE/WEF/EDCOM2 for the rubric) — no fabricated numbers, ever (see Evidence).
- All computation fixtures-first (seeded fake data, real logic), engineered for later swap to dynamic content.

## Capabilities and Constraints

- 15 thesis "Unique System Features" implemented as 12 modules (M1–M12) behind a **5-item nav**: Dashboard, Career, Pathway, Progress, Profile (+Admin). **UPDATED 2026-10-12 (user): thesis feature names are not rendered as UI labels** — natural-language labels only; the M1–M12 ↔ thesis-name map stays in features.md §1 (development-facing).
- Score rubric LOCKED: Skill Progress 40 / Employability Skills 25 / Training Progress 20 / Career Clarity 15 — computed, never hardcoded; career switch resets downstream sub-scores.
- Core engines locked in `features/features.md` (v1.3): RIASEC→top-3 suggestion; skills-match = unweighted "X of Y skills" of demonstrated skills (comprehension-checked completions + verified MCQs only); gap bars close on check-pass (✓✓) or login-verified MCQ (✓); M7 priority = tier (core ×3/secondary ×1), ties → free-PH-resource-first; 5-question checks (pass ≥4/5); single typed resource catalog (course/cert/NC/doc, free|₱); 2 goal types (Training auto-completes from M9; Milestone manual).
- Onboarding: strand → "career in mind?" → RIASEC (if no) → skills self-report → verification quiz (≤5) → goal suggestion → first score.
- Deprecated (must NOT appear): AI interview, resume builder, resume analysis, university finder.
- Terminology: module names M1–M12 per features.md §1 map to thesis feature names.
- Undecided: product name (design will propose candidates); M11/M12 PDF export post-defense.

## Brand Commitments

- No name/logo exists yet — the product may be referenced by working title (e.g., "Career Path Readiness" from the thesis context) until design names it; name-choosing is part of design, not a constraint.
- Voice: English-only UI (confirmed; old interview feature's English-only rule carried in spirit), encouragement-copy tone is acceptable but not yet binding.

## Evidence on Hand

- Landing stats with sources (ticket 04): 6.0% unemployment (PSA LFS Jul 2026), 12.9% underemployment, 38.2% of unemployed are college grads — cite exactly, with year.
- 29-career PH catalog with per-career skill maps, RIASEC codes, entry paths (ticket 04 markdown — needs fixture extraction; no data files exist yet).
- Score evidence: `research/score-weights-evidence.md` (NACE 2026, WEF 2025, EDCOM2 2026 wage lines PHP 69→74→96/hr).
- NO testimonials, NO photos of students, NO school partnerships — nothing fabricated; design must work without fake social proof.

## Product Principles

1. **The score is earned, never painted** — every number on screen must trace to seeded/computed state; the demo's score movement is real.
2. **Coherent journey over feature grid** — one flow (discover → gap → pathway → do → score → artifacts), five questions, one nav; nothing floats unlabeled.
3. **Philippines-forward, thesis-honest** — strand/TESDA/PSA reality everywhere; every visible claim carries its source.
4. **Encouragement without inflation** — honest "you're 40% ready, here's exactly what to do" (never motivational noise, never fake readiness).

## Accessibility & Inclusion

No formal target established yet; assume sensible baseline (contrast, keyboard-navigable, readable at phone sizes). **Adaptiveness is a stated requirement (user, 2026-10-12):** surfaces must hold from phone (390) through tablet (~768) to laptop (1440) and projector (1920) — the defense runs from a laptop, possibly projected. Minors/consent rules are data-privacy territory (ticket 06), not UI-blocking for the defense demo.
