# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

**UPDATED 2026-10-28 (ADR 0003 — real auth + Postgres):** Next.js **16** App Router + TypeScript, pin `16.3.x` · route handlers for all server logic · **Supabase (hosted project, live)**: Auth (real sign-up/sign-in/forgot-reset, signed sessions) + Postgres `student_state`/`profiles`/`credentials` via the `StudentStore` seam (JSON file store demoted to dev/test fallback) · Tailwind v4 (+ repo CSS conventions) · playwright e2e (auth-aware) · vitest fixture checks. Deployment: hosted (Vercel + Supabase) but the **defense demo runs locally** (`npm run dev`, port 3000; one dev server per repo dir).

## Users

- **Primary:** Philippine **graduating college students** (1st–4th year, four discipline tracks: Computer & IT · Business & Management · Accounting & Finance · Office & Administration) seeking entry-level corporate (white-collar, office-based) roles; institution-run cohort use — often mandated, counselor-supervised.
- **Operational:** **Counselors** (academic advisers or guidance-counseling/career-services staff — title-agnostic, assignment-based; the person is jurisdiction-scoped to Sections) monitoring cohorts, auditing declared credentials.
- **Evaluator:** thesis panel + expert respondents (IT evaluators, advisers, guidance counselors) — watch the scripted journey and probe validity.

## Product Purpose

A pre-graduation **career-readiness diagnostic**: a student picks a discipline track → major → target role (declared, then audited), completes a full NACE-aligned competency assessment, sees their five-channel Career Readiness Index (0–100) as the honest baseline, and works a committed, fully-ranked plan (gaps → resources → completions, Plus externally earned credentials) that demonstrably moves the score. The counselor runs the same product per cohort. Success = the **2026-11-07 final defense** with a working system whose every number and claim traces to a recorded, sourced decision.

## Positioning

**PH-grounded, counselor-run, deterministic-at-the-core (source model C — re-locked 2026-10-29, ADR 0005).** Skill/task **content** runs on the O*NET Web Services API — pulled at extraction time under a pinned O*NET version, cross-verified across all 36 roles with logged diffs (never silent), never called at runtime (offline demo; fairness/determinism). The **PH layer** is deliberately thin and document-snapshotted, covering exactly what O*NET cannot provide: labor demand (DOLE-BLE JobsFit), degree→role mapping (CHED CMO lists), and the official occupation taxonomy (PSOC 2012, carried by the locally parsed `phscs` dataset). PSF/TESDA framework extracts remain as cited secondary evidence where already recorded. Provenance tags ride every skill row. AI assists *interpretation and explanation*; **scoring is deterministic and auditable**; every AI surface is template-first, and the demo never depends on the LLM.

## Operating Context

- **TIME-CRITICAL: final defense 2026-11-07** — demo arc is a 7-feature scripted walk (new graduating-BS persona carrying an internship-status data point; before→after arc needs a visible baseline). Local-laptop demo; recorded backup.
- Evidence culture: **every claim cited** (PSA LFS, DOLE-BLE JobsFit/NJLMF, CHED CMOs, NACE, Fuller et al. 2021, Wingate et al. 2025 *IJSA*) — no fabricated numbers, ever.
- Decision culture: the user rules every planning decision; proposals are non-authoritative until signed off (AGENTS.md standing rule).
- Multi-tenant ambition (campus isolation, ticket 11) is **recorded but not built**; the schema carries a campus key; tenancy must not be precluded.

## Capabilities and Constraints

- **7 features** (post-interview-descope): Competency Assessment (NACE 7/8, E&I excluded, with verification) · Skills Gap Analysis · Career Readiness Index & Competency Profile · AI-Assisted Career Path Exploration (advisory, never deterministic) · Course/Cert/Pathway Recommendation · Personalized Career Development Plan (goals fully absorbed — the plan's next step IS the goal; no goal object) · Application Materials Diagnostic (resume now; cover-letter check + professional-presence entry per ticket 12 — feedback-only, no auto-writing, never "ATS pass").
- **Rubric (ADR 0002, amended): ES 30 / SP 25 / TP 20 / AR 15 / CC 10** — five channels, each with a measuring feature; computed, never painted; formative composite (Lawshe CVR/CVI validation planned); no predictive-validity claims.
- **Evidence/cognition rules:** verified (·✓ skills transfer across career switches) / checked (✓✓ role-specific, don't transfer) / claimed (never closes bars); verified credentials close gaps; assessment re-take = **latest counts**; reject-with-reason + revision loop for credentials.
- **Locked surfaces:** Dashboard · Careers (one list, AI-ranked default lens) · My Plan (Steps · Progress, full ranked list) · Prep (single diagnostic surface) · Profile (Competencies · Credentials · Account incl. DPA export/erase) · Admin (plain roster + row marks, composite read-only per-student, timestamped credential audit).
- **DPA posture:** consent + data-subject rights as working artifacts (export my data; delete my account = real cascade incl. uploaded evidence).
- **Deprecated (must NOT appear):** interview (post-defense stage 2), resume builder/gen-text beyond the tiered-suggestion fence, university finder, LinkedIn-feedback-as-feature, SHS anything (strands, grade levels, RIASEC).

## Brand Commitments

- **Working title "Career Readiness"** — no final name/logo yet; naming belongs to design when asked.
- Voice: English-only UI; honest, non-patronizing copy — the score *advises*, never predicts hiring.
- **Design direction (user-locked): "professional/enterprise-like"** — the prior SHS look ("unorthodox, hairline tables, instrument labels") is the flagged **anti-reference**. New work must read as credible enterprise product software; the panel judges the Dashboard first.

## Evidence on Hand

- Landing-cited stats: 6.0% unemployment (PSA LFS Jul 2026), 12.9% underemployment, 38.2% of unemployed are college grads — cite exactly, with year.
- Roster: `.scratch/career-path-readiness-research/catalog-roster-dole-ble.md` (demand citations per role); CHED CMO lists; framework sources per skill tag; rubric evidence (ar 0002 + application-readiness-factors + resume-diagnostic-criteria-sources).
- Instrument evidence: NACE published definitions as content anchor; authorship method locked (draft → user review → expert CVR/CVI).
- NO fabricated social proof; NOTHING uncited.

## Product Principles

1. **The score is earned, never painted** — every number traces to computed state; honest zeros ("not yet measured") are a feature.
2. **Advisory, never deterministic** — AI explains; engines compute; the student authors their own materials.
3. **Counselor-run, student-owned** — the same product renders both views; audits and flags are advisory, never gates.
4. **Receipts on the surface** — provenance tags, source citations, verified/claimed distinctions are visible where they answer a question.
5. **Coherence over feature grid** — five questions, one journey; features surface through their question, never as a directory.
