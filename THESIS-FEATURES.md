# Thesis Feature List — College Scope (finalized; updated 2026-10-29)

**For:** groupmates, ahead of the final defense (**2026-11-07**).
**Status:** decided and locked after the 2026-10-26 mock-defense panel, the essentiality review, and the 2026-10-28 interview descope. This document supersedes every earlier list (the original 15-item list and the intermediate 12-/8-item revisions).

---

## What changed, in one paragraph

The mock-defense panel critiqued the SHS scope, and the thesis pivoted to **"Development and Evaluation of an AI-Assisted Career Readiness System for Graduating College Students Seeking Entry-Level Corporate Roles."** The feature list was re-derived against the essentiality literature (Brown et al. critical-ingredients meta-analysis) and trimmed again after an honest scope review: **15 features → 7 features + 2 embedded capabilities.** The AI Mock Interview was descoped to the post-defense roadmap (2026-10-28) and the readiness rubric re-derived accordingly — every remaining feature passes the essentiality filter, and none was cut without a recorded reason.

## Scope

- **Who:** graduating college students seeking entry-level corporate roles (white-collar: administrative, business, technology). Blue-collar excluded.
- **Intake:** discipline track → major (two levels). Tracks: Computer & IT · Business & Management · Accounting & Finance · Office & Administration — majors from the CHED CMO registry (cite-able).
- **Post-graduation use-case (panel question):** answered by delimitation — a *pre-graduation diagnostic* run per cohort by counselors/advisers (the Admin view). Institutional persistence is the framing; no placement guarantees, no new features.
- **AI posture:** *"AI assists interpretation and explanation; scoring is deterministic and auditable."* Every AI surface is template-first; the demo never depends on the LLM.

## The 7 features

1. **Career Readiness Competency Assessment** — NACE-aligned across **7 of 8** NACE competencies (E&I excluded, stated choice), with verification mini-quizzes. Feeds the ES channel (30%).
2. **Skills Gap Analysis** — per-target-role gap analysis: the role's required skills vs the student's verified ones. The core engine; its total *is* the readiness score.
3. **Career Readiness Index & Competency Profile** — one formative number + a competency snapshot. Five channels (below), content-validated via Lawshe CVR/CVI.
4. **AI-Assisted Career Path Exploration** — ranked role matches with explained rationale over the target-role list; advisory phrasing only, never deterministic. Match factors: degree mapping + verified-skill overlap (technnical **and** cross-cutting).
5. **Course, Certification & Learning Pathway Recommendation** — typed resources attached to the plan's ranked steps.
6. **Personalized Career Development Plan** — the committed forward plan (fully absorbed Goal Setting; the plan's next step IS the goal).
7. **Application Materials Diagnostic** — Resume & Application **Materials** (plural): resume diagnostic (parseability, format conformance, keyword alignment) + cover-letter check, feedback-only with demonstrated suggestions. **No auto-writing, no "ATS pass" claims.**

## The 2 embedded capabilities (not separate features)

- **Major-to-Career Mapping** — an *intake step* (track → major → role), not a screen.
- **Labor Market Insights** — embedded role context (PSOC definitions, DOLE-BLE demand, salary context) inside role detail, not a dashboard.

## Readiness Index — five channels (weights re-derived 2026-10-28/29)

**ES 30 · SP 25 · TP 20 · AR 15 · CC 10** — Employability Skills, Skill Progress, Training & Experience Progress, Application Readiness, Career Clarity. When the interview was descoped, the channel re-derived by the same evidenced method (multi-factor AR anchors: Fuller et al. 2021; Wingate et al. 2025 *IJSA* field study; NACE Professionalism verbatim; CareerBuilder 2017 — full map in the research records). TP rose to 20 on outcome-level internship evidence. Reliability claims fenced: α ≥ .70 within self-report scales only; no predictive-validity claims; never "measures hiring success."

## Old → new traceability (original 15)

| Old thesis feature | Where it went |
|---|---|
| #1 Career Readiness Assessment | → Feature 1 (NACE-aligned Competency Assessment) |
| #2 AI-Based Career Path Recommendation | → Feature 4 (AI-Assisted Exploration) |
| #3 SHS Strand-to-Career Mapping | → replaced by track→major intake (embedded) |
| #4 Skills Gap Analysis | → Feature 2 (unchanged, core engine) |
| #5 Personalized Training Recommendation | → Feature 5 (merged) |
| #6 Course and Certification Recommendation | → Feature 5 (merged) |
| #7 Career Goal Setting | → Feature 6 (absorbed into the Plan) |
| #8 AI-Powered Training Priority Ranking | → Feature 5 (merged into the ranked flow) |
| #9 Employability Skills Assessment | → Feature 1 (absorbed) |
| #10 Career Readiness Score | → Feature 3 (Index) |
| #11 Recommended Learning Pathway | → Feature 5 (merged) |
| #12 Skills-to-Career Matching | → Feature 4 (merged) |
| #13 Training Progress Monitoring | → surface cut; completion mechanism kept (feeds TP) |
| #14 Career Competency Profile | → Feature 3 (merged with the Index) |
| #15 Personalized Career Development Plan | → Feature 6 (kept) |
| *Resume Builder / Analysis* (cut 2026-10-12) | → revived as **Feature 7** (feedback-only diagnostic) |
| *Voice interview* (cut 2026-10-12) | → **stage 2, post-defense roadmap** (2026-10-28 descoping; cite Sackett 2022) |
| *University Finder, LinkedIn feedback* | → stay cut |

## Why the record holds (defense-ready)

- **Essentiality filter:** assessment, gap analysis, an index, exploration, recommendations, a committed plan, and an application-materials diagnostic all pass the Brown et al. critical-ingredients test; every cut was absorbed, demoted, rescheduled, or justified (interview → post-defense roadmap with the citable evidence).
- **Panel-fatal features, none of which were cut:** assessment, gap analysis, index, exploration, resume/application-materials diagnostic.
- **PH anchoring (ADR 0001):** PSOC → PSF → TESDA office quals + O*NET/ESCO declared gap-fillers → PSF Enabling + NACE → CHED CMOs → DOLE-BLE. O*NET-as-primary rejected.
- **Real infrastructure (ADR 0003):** Supabase Auth + Postgres store (not fixtures), session-honest rendering; the fixtures-first preference is narrowed to engine inputs.

## What's deliberately still open

Navigation visual design (mockups pending) and two recorded descope ambitions for after the defense (interview stage 2). Feedback on the *list* is welcome; the UI round comes after.
