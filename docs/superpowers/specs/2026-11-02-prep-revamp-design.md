# Prep-page revamp — design

Date: 2026-11-02 · Status: approved by user (grilling session, same date)
Base note: this spec is written against the **working tree** (large uncommitted
WIP already touches careers/pathway/prep/profile/progress; `PrepTabs.tsx` is a
new untracked file). Implementation applies on top of that state.

## Problem (user feedback, 2026-11-02)

1. Careers, My Plan, Prep carry a "Prep card"/band whose design and color
   differs from Dashboard's.
2. Prep's Presence tab is redundant — it only redirects to Profile.
3. "Resume checker" vs "Cover-letter check" naming is inconsistent.
4. Resume checker / Cover-letter checker show too much text. The workflow is
   just: drop file → diagnostic runs → result.
5. The resume reference template is bare unformatted text; the consensus
   template (Harvard) should be used instead.

## Decisions (user-ruled)

| # | Decision | Ruling |
|---|----------|--------|
| D1 | Band recast scope | Full sweep — all five app pages (Dashboard, Careers, My Plan, Prep, Progress, Profile) adopt Dashboard's exact band geometry: white `--v-surface` card, 16px 20px padding, 15px/500 title. |
| D2 | Presence | Remove the Presence tab, its panel, its kicker and the letter-result `NEXT` pointer. The band keeps its computed `Presence x/3` counter cell. Declaring/stamping lives only in Profile → Credentials; Dashboard/My Plan keep any cross-pointers they already have. |
| D3 | Naming | "Resume checker" / "Cover-letter checker" everywhere (tabs, buttons, kickers, metadata, guide back-link, aria labels). Run buttons read "Run the check" — superseded by D5: the dropzone auto-runs. |
| D4 | Template | Do NOT rebuild generated artifacts. Link out to the official Harvard (Extension School) resume template page; implementer verifies the live URL at implementation time and cites it in the guide's sources line. Local `resume-reference.docx/pdf` stop being linked from any UI; engine test fixtures remain intact. |
| D5 | Resume checker intake | Pure dropzone: large centered dashed drop zone (drop + click-to-browse), auto-runs the diagnostic when a file lands. Zero default prose — no "read once for feedback — never stored" line, no "not yet measured" paragraph, no must-contain table. Named rejection copy appears only on failure. Busy state renders inside the drop zone. |
| D6 | Must-contain table | Deleted entirely (redundant with the Harvard template's format content + the run results' keyword-alignment rows). `must-contain.ts` and its API-side personalization leave the page; removal scope = UI only unless the store read becomes dead code. |
| D7 | Cover-letter checker intake | Same pure dropzone. The optional employer field renders as one small input below the drop zone (letter check's run is independent; honest-skip honesty contract unchanged). |
| D8 | Result views | Structure unchanged (readout, three-factor/structural checks table, findings with "The move" and EXAMPLE blocks kept). Meta prose compresses to one quiet line: `Run <date> · parse X × format/keywords Y × Z · your latest run counts`. Persistence notices stay attached to that line when present. |
| D9 | On-ramp status | "not yet measured" paragraphs deleted — the lens kicker (`NOT YET RUN` / `NOT YET CHECKED`) and band counter cells already carry that state. |
| D10 | Guide page | "Download the reference template" section becomes "Reference template — Harvard" external link (opens in new tab, labeled as external). Sources line gains the Harvard citation. |

## Component plan

- `app/(app)/prep/prep.css`, `career/career.css`, `pathway/pathway.css`,
  `progress/progress.css`, `profile/profile.css`: band blocks → dashboard
  register (surface bg, 16px 20px padding, 15px/500 `.t` title).
- `app/(app)/prep/page.tsx`: two-tool page. Remove OnRamp/must-contain import,
  presence panel, kickers.presence, nextPresenceStep, BandCell presence cell
  wording kept; metadata description updated; RunResult/LetterResult meta lines
  compressed; blueprint comments rewritten.
- `app/(app)/prep/ResumeUpload.tsx` → dropzone component (drag & drop +
  browse, auto-run on drop, named rejections, in-zone busy state).
- `app/(app)/prep/LetterUpload.tsx` → dropzone + optional-employer field.
- `app/(app)/prep/PrepTabs.tsx`: TABS → resume/letter; deep-link hashes
  `#resume`/`#letter` only.
- `app/(app)/prep/guide/page.tsx`: Harvard external-link section, sources line.
- e2e specs (`e2e/*.spec.ts`): update removed tab/dead-hash locators and
  renamed labels; add drop path coverage inside existing flows without new files
  where possible.
- No engine/diagnostic/score changes; no store changes; `/api` routes unchanged.

## Honesty contract (unchanged)

- A factor without its own run renders "not yet measured" in **computed
  furniture only** (band cell, kicker) — never a painted number.
- Rejections are always named; re-runs unlimited; latest run counts.
- Letter's missing-employer check still skips honestly with the exact line.

## Out of scope

Engines/rubric, Profile presence flow, data stores, onboarding copy,
design system tokens. (If the band sweep reveals a fifth band style in
service chrome, it's a follow-up.)
