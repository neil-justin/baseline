# Thesis Feature List — College Scope (finalized 2026-10-26)

**For:** groupmates, ahead of the final defense (**2026-11-07**).
**Status:** decided and locked after the 2026-10-26 mock-defense panel and an essentiality review. This replaces every earlier feature list (the original 15-item list and the intermediate 12-item revision).

---

## What changed, in one paragraph

The mock-defense panel critiqued the SHS scope: the UI was too unorthodox, the thesis needed retitling to a graduating-college corporate scope, and the "what is this for after graduation?" question needed an answer. We pivoted the thesis to **"Development and Evaluation of an AI-Assisted Career Readiness System for Graduating College Students Seeking Entry-Level Corporate Roles"** and re-derived the feature list against the essentiality literature (Brown et al. critical-ingredients meta-analysis as the yardstick). The result: **15 features → 8 features + 2 embedded capabilities.** Nothing was cut that the panel or the literature treats as essential; everything cut was either absorbed into a stronger feature or demoted from "feature" to "step/context."

## Scope

- **Who:** graduating college students seeking entry-level corporate roles (white-collar: administrative, business, technology). Blue-collar excluded.
- **Intake:** discipline track → major (two levels). Tracks: Computer & IT · Business & Management · Accounting & Finance · Office & Administration.
- **Post-graduation use-case (panel question):** answered by delimitation — this is a *pre-graduation diagnostic* run per cohort by counselors/advisers (the admin view is the adviser/counselor view). Institutional persistence is the thesis framing; no placement guarantees, no new features.
- **AI posture:** *"AI assists interpretation and explanation; scoring is deterministic and auditable."* Every AI-generated string has a template fallback; the demo never depends on the LLM.

## The 8 features

1. **Career Readiness Competency Assessment** — NACE-aligned self-report across **7 of 8** NACE competencies (Career & Self-Development / E&I excluded — a stated choice, permitted by NACE's own subsetting). Feeds the ES channel of the index.
2. **Skills Gap Analysis** — per-target-role gap bars: what the role needs vs what the student has verified. The core engine; its total *is* the readiness score.
3. **Career Readiness Index & Competency Profile** — one number + a competency snapshot. Formative composite, five channels (below), content-validated via Lawshe CVR/CVI by the expert respondents.
4. **AI-Assisted Career Path Exploration** — ranked role matches with explained rationale. Advisory phrasing only, never deterministic ("here's why this fits", never "you should be").
5. **Course, Certification & Learning Pathway Recommendation** — typed resources (courses, certs, learning pathways) in one recommendation flow. Absorbs the old AI-ranked Upskilling feature.
6. **Personalized Career Development Plan** — the forward plan: goals, steps, trajectory. Absorbs the old standalone Career Goal Setting.
7. **Resume & Application Materials Diagnostic** — feedback-only (parseability, keyword alignment vs target role). **No auto-writing, no "ATS pass" claims.**
8. **AI Mock Interview (Stage 1)** — role-specific interview practice; the centerpiece AI feature. Restored after initially being omitted — reversed same day.

## The 2 embedded capabilities (not separate features)

- **Major-to-Career Mapping** — an *intake step* (track → major → suggested roles), not a standalone screen.
- **Labor Market Insights** — embedded role context (PSOC definitions, DOLE-BLE demand forecast, salary context) inside role pages, not a standalone dashboard.

## Why these cuts hold (the defense-worthy rationale)

- **Essentiality filter:** the Brown et al. critical-ingredients meta-analysis asks "does the ingredient cause the outcome?" Assessment, gap analysis, an index, exploration, a resume diagnostic, and interview practice pass; standalone goal-setting UI and a standalone progress-monitoring screen do not.
- **Absorption, not deletion:** Goal Setting lives inside the Development Plan; Training Progress's *completion mechanism* is kept as an engine (the score must be able to move) even though its dedicated screen is cut.
- **Panel-fatal — never cut:** assessment, gap analysis, index, exploration, resume diagnostic, interview.

## Old → new traceability (original 15)

| Old thesis feature | Where it went |
|---|---|
| #1 Career Readiness Assessment | → Feature 1 (Competency Assessment; NACE-aligned) |
| #2 AI-Based Career Path Recommendation | → Feature 4 (AI-Assisted Exploration) |
| #3 SHS Strand-to-Career Mapping | → replaced by track→major intake (embedded capability) |
| #4 Skills Gap Analysis | → Feature 2 (unchanged, core engine) |
| #5 Personalized Training Recommendation | → Feature 5 (Course/Cert/Pathway Recommendation) |
| #6 Course and Certification Recommendation | → Feature 5 (merged) |
| #7 Career Goal Setting | → Feature 6 (absorbed into the Development Plan) |
| #8 AI-Powered Training Priority Ranking | → Feature 5 (absorbed into the ranked recommendation flow) |
| #9 Employability Skills Assessment | → Feature 1 (absorbed into the NACE-aligned assessment) |
| #10 Career Readiness Score | → Feature 3 (Career Readiness Index) |
| #11 Recommended Learning Pathway | → Feature 5 (merged) |
| #12 Skills-to-Career Matching | → Feature 4 (merged into Exploration) |
| #13 Training Progress Monitoring | → surface cut; **completion mechanism kept** (feeds the index + demo arc) |
| #14 Career Competency Profile | → Feature 3 (merged with the Index) |
| #15 Personalized Career Development Plan | → Feature 6 (kept) |
| *Resume Builder / Analysis* (deprecated 10-12) | → partially revived as Feature 7 (feedback-only diagnostic) |
| *Voice interview* (deprecated 10-12) | → restored as Feature 8 (AI Mock Interview Stage 1) |
| *University Finder, LinkedIn feedback* | → stay cut |

## Supporting decisions (one line each)

- **Competency framework (ADR 0001):** six-layer, PH-anchored — PSOC occupational anchor → PSF primary skills source → TESDA office quals + O*NET/ESCO as *declared* gap-fillers → PSF Enabling + NACE cross-cutting → CHED CMOs academic anchor → DOLE-BLE demand justification. O*NET-as-primary rejected.
- **Rubric (ADR 0002):** **ES 30 / SP 25 / AIR 20 / TP 15 / CC 10**, realizing the evidence-backed ordinal ranking ES ≥ SP > AIR > TP > CC (NACE Job Outlook 2026; Sackett 2022 structured-interview validity; internship-experience data). AIR added so resume + interview are finally measured. Reliability claims fenced: α ≥ .70 within self-report scales only; no predictive-validity claims; never "measures hiring success."

## What's deliberately still open

Navigation naming and per-feature screen placement are **not locked yet** (page-architecture round pending). Feedback on the *list above* is welcome now — the UI round comes after the architecture locks.
