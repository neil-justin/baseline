# Rubric re-lock: five-channel readiness index

The original four-channel rubric (SP 40 / ES 25 / TP 20 / CC 15) was calibrated for the SHS scope with TVET wage evidence (EDCOM NC-level data), left the two population-critical features (resume diagnostic, mock interview) unmeasured by any subscore, and weighted Training Progress at 20% despite the feature's demotion in the essentiality research. We re-locked to five channels — **ES 30 / SP 25 / AIR 20 / TP 15 / CC 10** — ordered by cited evidence: NACE Job Outlook 2026 employer attribute data (competencies outrank technical skills for new grads), Sackett et al. 2022 selection-validity estimates (structured interview ρ = .42), and NACE experience-influence data (internships 4.3–4.5/5 vs GPA 2.9). Application & Interview Readiness (AIR) was added to close the validity hole; TP was re-anchored to verified internships plus course/cert completions. The index is framed as a **formative composite** (Bollen & Lennox 1991): its weights undergo Lawshe CVR / CVI content validation by the study's expert respondents (IT evaluators, advisers, guidance counselors), and the exact percentages are presented as the closest defensible realization of the ordinal ranking ES ≥ SP > AIR > TP > CC — not as measured quantities.

## Considered Options

- **Keep SP at 40 as top weight** — rejected: NACE employer data ranks cross-cutting competencies above technical skills for new-grad hiring; SP's TVET wage anchor does not transfer to the corporate scope.
- **Four channels, AIR folded into ES** — rejected: application/interview performance is performance evidence, not competency self-report; merging muddies both measurement stories.

## Consequences

- ES at 30 is conditional on the NACE-aligned assessment shipping with verification checks; bare self-report reverts ES to 25 (flagged LOW-CONFIDENCE in the research).
- The demo persona now requires an internship-status data point (TP reads it).
- Completion recording remains an engine mechanism (the score must be able to move) even though the standalone Progress surface is cut.
- Every channel has a measuring feature; reliability claims are fenced (α ≥ .70 within self-report scales only; no predictive-validity claims for the index).
- Evidence: `.scratch/career-readiness-platform/research/rubric-reweight-evidence.md` + `application-readiness-factors.md` + `resume-diagnostic-criteria-sources.md`.

## Amendment (2026-10-29): interview descoped; the channel re-derived — not bent

The user descoped **AI Mock Interview** (2026-10-28: "too complicated, may not be worth it") to the **post-defense roadmap** — stage 2; Sackett 2022's ρ = .42 now cites the roadmap, not the current design. Rather than keep the old weights under a bent definition, the channel re-derived by the same evidenced method:

- **Renamed Application Readiness (AR)**: *"can the student's application materials get past the automated screen into human hands?"* — the screening-gate question. The interview's question (performance evidence) moves to the roadmap.
- **Multi-factor, all deterministic-checkable, all primary-anchored** (`research/application-readiness-factors.md`): resume diagnostic (Fuller et al. 2021; NACE JO 2025; SHRM) · **cover-letter check** on the same diagnostic surface, same feedback-only fences (Wingate, Robie, Powell & Bourdage 2025, *IJSA* — peer-reviewed field study, 183 tracked applications: resume+cover-letter quality predicted more interviews and faster hires) · **professional presence as a declared, link-verified entry** (NACE Professionalism competency, verbatim: "Maintain a positive personal brand…"; Roulin & Levashina 2018; CareerBuilder 2017: 57% of employers less likely to interview candidates they can't find online).
- **Re-derivation result — new weights: ES 30 / SP 25 / TP 20 / AR 15 / CC 10.** TP rises to 20: its internship/experience evidence is *outcome-level* (4.3–4.5/5 influence), while AR's is *ensemble-of-surroundings* — the honest ordinal is TP ≥ AR. AR did not lose its channel status; it lost its weight inflation.
- **Honest limits:** every empirical anchor is US-centric; factor-count contradictions in vendor surveys were quarantined (Jobvite vs ResumeLab). Factor-design session registered as ticket 12.
- Coverage check: every channel still has a measuring feature — ES (Competency Assessment) · SP (Plan steps) · TP (Progress: internships + completions + verified credentials) · AR (Application Materials Diagnostic) · CC (target role + plan started + first item done).

## Amendment 2 — AR factor split (2026-10-29, ticket-12 rulings)

- **AR 15 splits: resume 7 / cover letter 5 / professional presence 3.** Unmeasured factors render grey and contribute nothing; never painted.
- **Letter checks:** parse-pass × keyword-role alignment vs the declared Target Role's skill map, plus structural determinism: salutation present · employer named (student-typed employer field anchors who the letter is for) · closing ask present · 250–500-word band. Feedback = tiered rule + example bullets; feedback-only, no auto-writing, no "ATS pass" claims.
- **Presence:** declared entry (LinkedIn URL + professional contact email) in **Profile → Credentials as the fourth kind**, stamp **link-verified (automatic, timestamped)** — distinct from counselor-audited certifications. Private account = honest "resolves, content not machine-verifiable" sub-result. Check runs when networked; the offline venue presents the timestamped stamp.
- **Flow (amended per user 2026-10-29):** one Application Materials Diagnostic surface in Prep; **resume and cover letter upload and check independently** (per-file runs, latest counts per file; a combined same-pass upload stays available). **Employer field is optional**: when declared, the letter check verifies the letter mentions it; when omitted, the employer check renders honestly as "not evaluated — no employer declared". Plan queue stays one checklisted task: "Get your application materials ready" (head-of-plan semantics unchanged while AR unmeasured).
- Engine follow-up (split + beat recomputation) is scheduled with the demo re-cut — outside the reskin sweep.

## Amendment 3 — resume factor selection: latest full attempt (2026-10-29, user-ruled)

Amendment 3 (2026-10-29, user-ruled): the resume factor's **selection = latest full attempt per file**, superseding the recorded best-run selection of the engine re-lock **for the resume factor only** — formula/calibration unchanged (the 7/5/3 split of amendment 2 and the half-down rounding all stay locked). Rationale: ticket-12's later/more-specific latest-counts philosophy for application materials (the same retake philosophy the assessment instrument already carries: a re-take = latest counts). Demo numbers are unchanged (single-run canon — the arc runs one `resume-qa.pdf` at AIR 100, so latest and best read the same 59); only the selection semantics in code (the feed is built in `lib/db.ts` `getStudentView` from the stored latest run's own `airResume`), the verify assertions' input name (`latestAir`), and the recut-doc wording move. The run store's `best_air`/`runs_count` remain best-ever history/display; the persistence model (one row per student, replaced on every successful run) IS the deterministic latest order — no new timestamp or schema.
