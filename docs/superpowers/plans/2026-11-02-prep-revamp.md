# Prep-page Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the approved `docs/superpowers/specs/2026-11-02-prep-revamp-design.md` — band sweep to Dashboard's white register, dropzone-first Resume checker / Cover-letter checker, Presence tab removal, must-contain table deletion, Harvard template external link, naming standardization.

**Architecture:** No engine/API/store changes. Pure surface work: CSS band recasts across five page stylesheets, a rewritten two-tab `PrepTabs`, a rewritten `prep/page.tsx` (dropzone-children renderer + condensed run meta), two rewritten upload components (`ResumeUpload`, `LetterUpload` → auto-run dropzones), a guide-page external-link swap, and e2e spec updates for the changed interactions.

**Tech Stack:** Next.js (App Router), React 19, scoped-vanilla CSS via `--v-*` tokens (v7.css), Playwright e2e, vitest for fixture tests.

**Repo preconditions (READ FIRST):**
- The working tree has large **uncommitted user WIP** (29 files + untracked `PrepTabs.tsx`). The plan is written against the **working tree state**, not HEAD.
- NEVER `git add -A` / `git add .`. Stage only exact file paths listed per task. Do not revert, reformat, or "clean up" any WIP file not in your task.
- Every Page/Next API you touch: before writing code skim the matching guide in `node_modules/next/dist/docs/` — this project runs a Next version whose conventions may differ from usual training data.
- Commands: typecheck `npx tsc -p tsconfig.json --noEmit`; fixtures `npm run verify:fixtures`; e2e `npx playwright test <file>` (starts/reuses server on :3000 — one worker, serialized).
- Commits: Conventional Commits (`feat(...)`/`test(...)`/`refactor(...)`), ≤50-char subject.

**Design decisions in force (from the spec — do not relitigate):**
- D1 band sweep: white `var(--v-surface)`, `padding: 16px 20px`, title `15px/500` — on **all five** page bands. Keep each page's own band content/layout.
- D3 naming: **"Resume checker" / "Cover-letter checker"** everywhere user-visible.
- D5/D7 intake: pure dropzone, AUTO-RUN on file drop, no run button, no default prose. Rejection copy unchanged and still named. Letter keeps its optional employer field below the zone.
- D6: must-contain table + `app/(app)/prep/must-contain.ts` deleted.
- D4/D10: Harvard template = external link to `https://careerservices.fas.harvard.edu/resources/bullet-point-resume-template/` (verified live 2026-11-02; offers `.docx` + Google Docs downloads). Local `resume-reference.*` stop being linked from UI (files stay; engine tests still read them).
- D8: run meta compresses to one quiet line (`parse X × format Y × keywords Z · your latest run counts`), persistence notice kept inline when present. Findings, checks table, EXAMPLE suggestions unchanged.
- D9: all "not yet measured"/"not run" status paragraphs deleted (kicker + band cell carry the state).

---

### Task 1: Band sweep — Careers, My Plan, Profile, Progress (`prep` band recast happens in Task 6)

**Files:**
- Modify: `app/(app)/career/career.css` (band block ~lines 27–52)
- Modify: `app/(app)/pathway/pathway.css` (`.v7plan .planband .band` block ~lines 31–53)
- Modify: `app/(app)/profile/profile.css` (`.v7profile .proband .band` block ~lines 39–62)
- Modify: `app/(app)/progress/progress.css` (`.v7prog .proband .band` block ~lines 38–74)

- [ ] **Step 1: Careers band**

In `career.css`, replace the `.v7career .band` block:

```css
.v7career .band {
  background: var(--v-surface);
  border: 1px solid var(--v-border);
  border-radius: 8px;
  box-shadow: var(--v-shadow);
  padding: 16px 20px;
  margin-bottom: 14px;
}
```

and the title rule to Dashboard's register (Dashboard reference: `.v7dash .band .who .t { font: 500 15px/1.35 Roboto, system-ui, sans-serif; … }`):

```css
.v7career .band .who .t {
  font: 500 15px/1.35 Roboto, system-ui, sans-serif;
  margin: 0;
  color: var(--v-ink);
}
```

Leave `.v7career .bandrow`, `.who .m` (subtitle prose), `.bandcells`, and everything else unchanged. Check the two responsive rules later in the file (`@media` blocks around lines 671–673) only override padding/`min-width` — leave them as-is unless they still target removed properties.

- [ ] **Step 2: My Plan (pathway) band**

In `pathway.css`, replace the `.v7plan .planband .band` block:

```css
.v7plan .planband .band {
  background: var(--v-surface);
  border: 1px solid var(--v-border);
  border-radius: 8px;
  box-shadow: var(--v-shadow);
  padding: 16px 20px 0;
  margin-bottom: 14px;
}
```

(Keep the existing `0` bottom padding — it's there because the band's content bleeds into the tabs tray below; the sweep changes surface + horizontal padding, not that mechanism.) Change the title rule:

```css
.v7plan .planband .who .t {
  font: 500 15px/1.35 Roboto, system-ui, sans-serif;
  margin: 0;
  color: var(--v-ink);
}
```

Then **verify visually** (dev server or trace) that the tabs tray still seats flush under the band; the only fixable value is padding, not layout.

- [ ] **Step 3: Profile band**

In `profile.css`, replace:

```css
.v7profile .proband .band {
  background: var(--v-surface);
  border: 1px solid var(--v-border);
  border-radius: 8px;
  box-shadow: var(--v-shadow);
  padding: 16px 20px;
  margin-bottom: 14px;
}
```

and:

```css
.v7profile .proband h1 {
  font: 500 15px/1.35 Roboto, system-ui, sans-serif;
  margin: 0;
  color: var(--v-ink);
}
```

- [ ] **Step 4: Progress (My Plan nav sibling) band**

In `progress.css`, replace:

```css
.v7prog .proband .band {
  background: var(--v-surface);
  border: 1px solid var(--v-border);
  border-radius: 8px;
  box-shadow: var(--v-shadow);
  padding: 16px 20px;
  margin-bottom: 12px;
}
```

and:

```css
.v7prog .proband h1 {
  font: 500 15px/1.35 Roboto, system-ui, sans-serif;
  margin: 0;
  color: var(--v-ink);
}
```

- [ ] **Step 5: Comment headers**

In each of the four css files, update the band block's section comment (e.g. `/* ---------- named band — the grey tray (v7.2 Composition A) ---------- */` → `/* ---------- header band — the white dashboard register (v7.4 sweep) ---------- */`) and any header comment that claims "grey tray".

- [ ] **Step 6: Verify + commit**

```bash
npx tsc -p tsconfig.json --noEmit
git add app/\(app\)/career/career.css app/\(app\)/pathway/pathway.css app/\(app\)/profile/profile.css app/\(app\)/progress/progress.css
git commit -m "feat(chrome): band sweep — five page headers adopt the dashboard register"
```

Expected: typecheck passes (CSS-only task should not affect it); commit contains exactly 4 files.

---

### Task 2: PrepTabs → two tabs

**Files:**
- Modify: `app/(app)/prep/PrepTabs.tsx` (untracked new file in the WIP — it is the current state; edit it in place)

- [ ] **Step 1: TABS + types**

Replace the `TABS` const and surrounding comment:

```tsx
/**
 * Prep — the two application-materials tools as a SUITE (v7.4 recut, user
 * ruling 2026-11-02): the `.prep-lens` segmented toolbar OUTSIDE the card
 * switches the active tool — Resume checker / Cover-letter checker — and each
 * tab is its own v7 card carrying one full tool flow (dropzone intake →
 * result dashboard). Presence is NOT a tab: the declaring/stamping factor
 * lives in Profile → Credentials; the named band's computed counter cell
 * carries its state. Sequence is DECLARED via in-content handoff links
 * (#letter hashchange; the factors measure on their own files, no wizard).
 *
 * Deep-links #resume/#letter + a hashchange listener; the roving tablist
 * keyboard pattern is the family's (Careers/My Plan register). The
 * hidden-guard (.tabpanel[hidden] display:none !important) is the
 * profile/v7.2 pattern. No entrance motion (DNA lock).
 */
const TABS = [
  { id: "resume", label: "Resume checker" },
  { id: "letter", label: "Cover-letter checker" },
] as const;
```

- [ ] **Step 2: Props**

Change the props type:

```tsx
export default function PrepTabs({
  panels,
  kickers,
}: {
  panels: { resume: ReactNode; letter: ReactNode };
  kickers: { resume: string | null; letter: string | null };
}) {
```

Everything else (hash listener, roving keys, `tab()`, the three map renders) is already generic over `TABS` — verify `onTablistKey`, the `aria-label="Application materials tools"`, and the `#panel-${id}` rendering need no further edits.

- [ ] **Step 3: Verify + commit**

```bash
npx tsc -p tsconfig.json --noEmit
git add app/\(app\)/prep/PrepTabs.tsx
git commit -m "feat(prep): two-tool suite — Presence tab retires"
```

(The page still passes three panels and fails typecheck until Task 3 — that's expected; if typecheck fails only on `prep/page.tsx` props mismatch, that is Task 3's job. Confirm no OTHER errors.)

---

### Task 3: prep/page.tsx rewrite + must-contain deletion

**Files:**
- Create (overwrite): `app/(app)/prep/page.tsx` — full content below
- Create (overwrite): `app/(app)/prep/must-contain.ts` — **DELETE the file** (`git rm app/\(app\)/prep/must-contain.ts` — it is tracked)

- [ ] **Step 1: Overwrite `page.tsx` with exactly this content**

Blueprint of the changes vs the current file: OnRamp + must-contain import deleted; presence panel/kicker/pointer/sublabels deleted; no-run letter status paragraph deleted; resume gets a one-line quiet links row (format guide + Harvard template) that rides under the upload in BOTH states; run meta condensed to one line; "Resume diagnostic"/letter-check labels renamed; Blue-Command primaries gone (dropzones carry no buttons); `fmtDay`, `presenceMeasured`, `EMPLOYER_SKIP_NOTE`, `letterPrimary`, `runsCount` all removed.

```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getStudentView } from "@/lib/db";
import { requireStudent } from "@/lib/session";
import { resumeRunStore, resumePersistenceNotice, type ResumeRunSummary } from "@/lib/db/resume-run-store";
import { letterRunStore, letterPersistenceNotice, type LetterRunSummary } from "@/lib/db/letter-run-store";
import { AR_FACTORS } from "@/lib/engines/score";
import type { ResumeFinding } from "@/lib/engines/resume/analyze";
import ResumeUpload from "./ResumeUpload";
import LetterUpload from "./LetterUpload";
import PrepTabs from "./PrepTabs";
import "./prep.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Prep — Application Materials · Career Readiness",
  description:
    "Feedback-only application-materials checkers: the resume checker (7 of the 15-point AR channel) and the cover-letter checker (5 of 15) each measure their own file; the presence declaration lives in Profile → Credentials (3 of 15).",
};

/**
 * Prep — "Application materials" (v7.4 minimal-tool recut, user ruling
 * 2026-11-02 against the resume-checker UX survey). ONE surface carrying
 * TWO sibling tool cards — each its own dropzone-first tool:
 *
 *  - Resume checker (7 of 15 AR): the intake is ONE dropzone — drop or
 *    browse, the diagnostic runs on the drop, no default prose (the format
 *    guide + the Harvard template are one quiet links line beneath the
 *    zone). With a run: the stored LATEST result (readout → three-factor
 *    checks → findings → re-run zone → NEXT handoff to the letter tab).
 *  - Cover-letter checker (5 of 15): same dropzone pattern + ONE optional
 *    employer field beneath; structural checks + role alignment vs the
 *    declared Target Role; employer-omitted still prints the exact honesty
 *    line in its row — the denominator drops the check.
 *
 * Presence is NOT a tab: it lives where it is declared (Profile →
 * Credentials); the band's computed counter cell is its state here.
 * HONESTY CONTRACT: a factor without its own run reads "not yet measured /
 * —" in computed band furniture only (never painted); re-runs unlimited,
 * the LATEST run counts; nothing claims an "ATS pass".
 */

const fmtDT = (iso: string) => {
  const d = new Date(iso);
  return `${d.toLocaleString("en-US", { month: "short" })} ${d.getDate()} · ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

/* ── the band's AR channel cells — computed, never painted ──────────────── */

type PartView = { measured: boolean; earned: number; max: number };

function BandCell({ name, part, notRun }: { name: string; part: PartView; notRun: string }) {
  return (
    <div className="bcell">
      <span className="label">
        {name} · {part.max}
      </span>
      <span className="bval-row">
        <span className={`bval num${part.measured ? "" : " bquiet"}`}>
          {part.measured ? `${part.earned}/${part.max}` : "—"}
        </span>
        {part.measured ? (
          <span className="chip c-green">·✓</span>
        ) : (
          <span className="chip c-grey">{notRun}</span>
        )}
      </span>
    </div>
  );
}

function ArCell({ value }: { value: number | null }) {
  return (
    <div className="bcell b-ar">
      <span className="label">Application readiness</span>
      <span className={`ar-val num${value === null ? " bquiet" : ""}`}>
        {value === null ? (
          "—"
        ) : (
          <>
            {value}
            <small>/15</small>
          </>
        )}
      </span>
    </div>
  );
}

function FindingCard({ f }: { f: ResumeFinding }) {
  return (
    <div className="rs-finding">
      <p className="rs-f-title">
        <span className={`rs-level rs-${f.level}`}>{f.level === "fix" ? "fix" : f.level === "watch" ? "watch" : "pass"}</span>
        {f.skill ? <span className="rs-f-skill num">{f.skill}</span> : null}
      </p>
      <p className="rs-f-head">{f.title}</p>
      <p className="rs-f-detail">{f.detail}</p>
      {f.suggestion && (
        <div className="rs-suggest">
          <p className="rs-move">
            <b>The move</b> · {f.suggestion.move}
          </p>
          {f.suggestion.example && (
            <p className="rs-example">
              <span className="rs-ex-label num">EXAMPLE — yours to write, keep it true to what you actually did</span>
              <span>
                “{f.suggestion.example.text}”{" "}
                <span className="rs-ex-src num">(anchored in your own line: “{f.suggestion.example.fromLine}”)</span>
              </span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ── the resume checker's quiet links line — rides under the upload ─────── */

function ResumeLinks() {
  return (
    <p className="rs-links num">
      First resume? <a href="/prep/guide">Format guide</a> ·{" "}
      <a href="https://careerservices.fas.harvard.edu/resources/bullet-point-resume-template/" target="_blank" rel="noreferrer">
        Harvard template ↗
      </a>
    </p>
  );
}

/* ── resume run result — readout → checks → findings → re-run → next ────── */

function RunResult({
  run,
  next,
  children,
}: {
  run: NonNullable<ResumeRunSummary["run"]>;
  /** the declared next step (the letter tab handoff; null when nothing remains) */
  next?: ReactNode;
  children: ReactNode;
}) {
  const factorChecks: { name: string; score: number; note: string; checks: { label: string; ok: boolean; note?: string }[] }[] = [
    {
      name: "Parseability",
      score: run.parseability.score,
      note: "text present and extractable, per-page sanity",
      checks: run.parseability.checks,
    },
    {
      name: "Format conformance",
      score: run.format.score,
      note: `vs the guide${run.flags.onepageEstimated ? " (layout-independent estimate)" : ""}`,
      checks: run.format.checks,
    },
    {
      name: "Keyword alignment",
      score: run.keywords.score,
      note: `core-tier skills of ${run.careerName} found in the text`,
      checks: run.keywords.checks,
    },
  ];
  return (
    <>
      <section className="panel-sec rs-readout">
        <div className="rs-readout-top">
          <div>
            <span className="label num">Resume checker · {fmtDT(run.at)}</span>
            <div className="rs-readout-sub">
              {run.fileName} · {run.kind === "pdf" ? "PDF" : "Word"} · target <b>{run.careerName}</b>
            </div>
          </div>
          <div className="rs-readout-score num">
            {run.air.airResume}
            <small>/100</small>
          </div>
        </div>
        <p className="rs-air-note num">
          <b className="num">
            parse {run.air.parsePass} × format {run.air.formatScore} × keywords {run.air.keywordScore}
          </b>{" "}
          · your latest run counts{resumePersistenceNotice() ? (
            <span className="rs-notyet"> {resumePersistenceNotice()}</span>
          ) : null}
        </p>
      </section>

      <section className="panel-sec">
        <div className="b-head">
          <h2>The three factors</h2>
        </div>
        <table className="checks-table num">
          <thead>
            <tr>
              <th className="ct-check">Check</th>
              <th className="ct-result">Result</th>
              <th>Note</th>
            </tr>
          </thead>
          {factorChecks.map((f) => (
            <tbody key={f.name}>
              <tr className="rs-factor-head num">
                <th colSpan={3} scope="colgroup">
                  {f.name} — <b>{Math.round(f.score * 100)}%</b> <span className="rs-fn">{f.note}</span>
                </th>
              </tr>
              {f.checks.map((c, i) => (
                <tr className="rs-check num" key={i}>
                  <td>{c.label}</td>
                  <td>
                    <span className={`mark ${c.ok ? "ok" : "no"}`}>{c.ok ? "✓" : "✕"}</span>
                  </td>
                  <td>
                    {c.note ? <span className="rs-check-note">{c.note}</span> : <span className="bquiet">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </section>

      <section className="panel-sec">
        <div className="b-head">
          <h2>Findings and suggestions</h2>
          {run.findings.length === 0 && <p className="helper">No fixes found in this run</p>}
        </div>
        <div className="rs-findings">
          {run.findings.map((f) => (
            <FindingCard key={f.id} f={f} />
          ))}
        </div>
      </section>

      {/* the re-run zone rides AT THE END of the results (the dropzone reappears) */}
      {children}

      {next}
    </>
  );
}

/* ── the cover-letter checker — same shape, own file ────────────────────── */

const LETTER_KINDS: Record<string, string> = { txt: "TXT", pdf: "PDF", docx: "Word" };

function LetterResult({ run, next, children }: {
  run: NonNullable<LetterRunSummary["run"]>;
  /** the declared next step (null — presence is not a Prep tab anymore) */
  next?: ReactNode;
  children: ReactNode;
}) {
  const rowMark = (ok: boolean | null) =>
    ok === true ? "✓" : ok === false ? "✕" : "—";
  return (
    <>
      <section className="panel-sec cl-readout">
        <div className="cl-readout-top">
          <div>
            <span className="label num">Cover-letter checker · {fmtDT(run.at)}</span>
            <div className="cl-readout-sub">
              {run.fileName} · {LETTER_KINDS[run.kind] ?? run.kind.toUpperCase()} ·{run.employerDeclared ? ` employer anchor ${run.employerName}` : " no employer declared"} · target <b>{run.careerName}</b>
            </div>
          </div>
          <div className="cl-readout-score num">
            {run.air.airLetter}
            <small>/100</small>
          </div>
        </div>
        <p className="cl-air-note num">
          <b className="num">
            parse {run.air.parsePass} × keywords {run.air.keywordScore} × structural {run.air.structuralScore}
          </b>{" "}
          · your latest check counts{letterPersistenceNotice() ? (
            <span className="cl-notyet"> {letterPersistenceNotice()}</span>
          ) : null}
        </p>
      </section>

      <section className="panel-sec">
        <div className="b-head">
          <h2>The checks</h2>
        </div>
        <table className="checks-table num">
          <thead>
            <tr>
              <th className="ct-check">Check</th>
              <th className="ct-result">Result</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            <tr className="cl-role-line num">
              <th colSpan={3} scope="colgroup">
                <span className="cl-role-label num">ROLE ALIGNMENT</span> — {run.keywords.filter((k) => k.ok).length} of {run.keywords.length} core skills of <b>{run.careerName}</b> found in the text · the Role anchor is always the declared Target Role
              </th>
            </tr>
            {run.keywords.map((c, i) => (
              <tr className="rs-check num" key={`kw-${i}`}>
                <td>{c.label}</td>
                <td>
                  <span className={`mark ${c.ok ? "ok" : "no"}`}>{c.ok ? "✓" : "✕"}</span>
                </td>
                <td>
                  <span className="bquiet">—</span>
                </td>
              </tr>
            ))}
            {run.checks.map((c, i) => (
              <tr className="rs-check num" key={`st-${i}`}>
                <td>{c.label}</td>
                <td>
                  <span className={`mark ${c.ok === null ? "skip" : c.ok ? "ok" : "no"}`}>{rowMark(c.ok)}</span>
                </td>
                <td>
                  {c.note ? (
                    c.ok === null && c.label === "Employer named" ? (
                      <span className="cl-notyet">{c.note}</span>
                    ) : (
                      <span className="rs-check-note">{c.note}</span>
                    )
                  ) : (
                    <span className="bquiet">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel-sec">
        <div className="b-head">
          <h2>Findings and suggestions</h2>
          {run.findings.length === 0 && <p className="helper">No fixes found in this check</p>}
        </div>
        <div className="rs-findings">
          {run.findings.map((f) => (
            <div className="rs-finding" key={f.id}>
              <p className="rs-f-title">
                <span className={`rs-level rs-${f.level}`}>{f.level === "fix" ? "fix" : f.level === "watch" ? "watch" : "pass"}</span>
              </p>
              <p className="rs-f-head">{f.title}</p>
              <p className="rs-f-detail">{f.detail}</p>
              {f.suggestion && (
                <div className="rs-suggest">
                  <p className="rs-move">
                    <b>The move</b> · {f.suggestion.move}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* the re-check zone rides AT THE END of the results */}
      {children}

      {next}
    </>
  );
}

/* ── page ───────────────────────────────────────────────────────────────── */

export default async function PrepPage() {
  const profile = await requireStudent();
  const { career, score } = await getStudentView(profile.studentId);
  const latestResume: ResumeRunSummary | null = career
    ? await resumeRunStore.latest(profile.studentId)
    : null;
  const latestLetter: LetterRunSummary | null = career
    ? await letterRunStore.latest(profile.studentId)
    : null;

  const resumeHasRun = Boolean(latestResume);
  const letterHasRun = Boolean(latestLetter);

  /* the letter surface's declared NEXT — forces-on-own-files honesty: the
     results end with the sibling-tool handoff (no wizard gate). Presence is
     NOT a step here; its state is the band cell alone. */
  const nextLetterStep = !letterHasRun ? (
    <a className="nextstep" href="#letter">
      <span className="label num">NEXT</span>
      <p>
        <b>The cover-letter checker</b> · earns 5 of the 15-point AR channel — bring the letter you wrote yourself.
      </p>
    </a>
  ) : null;

  /* the two tool children — the intake surface (dropzone) is the hero, with
     the one quiet links line under the resume's zone */
  const resumeChildren = (
    <>
      <ResumeUpload />
      <ResumeLinks />
    </>
  );

  const letterChildren = <LetterUpload />;

  /* the band's AR receipts — the same engine receipts the page already
     reads (score.arParts from getStudentView); a null score (no target
     role) renders the honest "—" in every cell, never a painted zero */
  const unmeasured = (max: number): PartView => ({ measured: false, earned: 0, max });
  const parts = score?.arParts ?? {
    resume: unmeasured(AR_FACTORS.resume),
    letter: unmeasured(AR_FACTORS.letter),
    presence: unmeasured(AR_FACTORS.presence),
  };

  const resumePanel = latestResume ? (
    <RunResult run={latestResume.run} next={nextLetterStep}>
      {resumeChildren}
    </RunResult>
  ) : (
    resumeChildren
  );

  const letterPanel = latestLetter ? (
    <LetterResult run={latestLetter.run}>
      {letterChildren}
    </LetterResult>
  ) : (
    letterChildren
  );

  return (
    <div className="v7prep">
      {/* named band — the white dashboard register; the instrument counters
          are band furniture; presence's cell is computed state only */}
      <header className="band">
        <div className="bandrow">
          <div className="who">
            <h1 className="t">Prep</h1>
            {career ? (
              <p className="m">For {career.name} — the Resume checker and the Cover-letter checker.</p>
            ) : (
              <p className="m">The Resume checker and the Cover-letter checker.</p>
            )}
          </div>
          <div className="bandcells">
            <BandCell name="Resume" part={parts.resume} notRun="NOT YET RUN" />
            <BandCell name="Letter" part={parts.letter} notRun="NOT YET CHECKED" />
            <BandCell name="Presence" part={parts.presence} notRun="NOT DECLARED" />
            <ArCell value={score?.ar ?? null} />
          </div>
        </div>
      </header>

      {!career ? (
        <section className="card nc-card">
          <div className="b-head">
            <h2>Pick your target role first</h2>
            <p className="helper">Every checker measures against one target role at a time.</p>
          </div>
          <p className="nc-cta">
            <a className="btn btn-primary" href="/career">
              Browse the career index <span className="arrow num">↵</span>
            </a>
          </p>
        </section>
      ) : (
        <PrepTabs
          panels={{ resume: resumePanel, letter: letterPanel }}
          kickers={{
            resume: latestResume ? `LATEST RUN · ${latestResume.run.air.airResume}/100` : "NOT YET RUN",
            letter: latestLetter ? `LATEST CHECK · ${latestLetter.run.air.airLetter}/100` : "NOT YET CHECKED",
          }}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Delete must-contain module**

```bash
git rm app/\(app\)/prep/must-contain.ts
```

Confirm nothing else imports it (`grep -rn "must-contain" app lib scripts e2e --include='*.ts*'` → no hits outside plan docs).

- [ ] **Step 3: Verify + commit**

`npx tsc -p tsconfig.json --noEmit` still fails only on `ResumeUpload`/`LetterUpload` props (Tasks 4–5 remove the removed-prop signatures). All other errors are failures. Commit:

```bash
git add app/\(app\)/prep/page.tsx
git commit -m "feat(prep): two-tool page — dropzone intake, one-line run meta, no presence tab"
```

---

### Task 4: ResumeUpload → auto-run dropzone

**Files:**
- Create (overwrite): `app/(app)/prep/ResumeUpload.tsx` with exactly this content

```tsx
"use client";

import { useRef, useState } from "react";

/**
 * The resume checker's intake (v7.4 minimal-tool recut, user ruling
 * 2026-11-02): ONE large dropzone. A file landing here — dragged or
 * browsed — POSTs immediately to /api/resume/diagnose; on a successful run
 * the page re-renders the stored result (full reload: the result is
 * server-rendered from the store, force-dynamic; a document load re-renders
 * honestly every time). NO default prose, no run button. Rejections show
 * the locked reason inline (aria-live, .rs-err — e2e contract) and persist
 * nothing; the busy state renders inside the zone. NO editing surface
 * exists — no paste box, nothing authored INSIDE the system (hard fence).
 */

const REJECT_COPY: Record<string, string> = {
  bad_form: "The upload didn't arrive complete — pick the file again.",
  unauthorized: "Your session ended — sign in again and re-upload.",
  no_file: "Choose a resume file first.",
  no_career: "Pick your target role first — the check measures against it.",
  multi_file: "One file at a time — drop the resume as a single PDF or DOCX.",
  oversize: "Over the 5 MB limit — exports with embedded photos or graphics easily grow past it. Remove images and export the resume again.",
  empty: "The file carries no readable content — almost nothing on its pages.",
  encrypted: "This file is password-protected or encrypted — save an unlocked copy as a PDF or DOCX and upload that.",
  scanned: "This PDF carries essentially no readable text — it reads as a scan or an image-only export. Re-export a text-based PDF from Word or Google Docs (File → Export → PDF); the text has to be real text, not a picture of it.",
  not_resume: "This doesn't read as a resume.",
  wrong_type: "This file's content is neither a PDF nor a Word document — the extension alone isn't trusted.",
  parse_error: "This file's structure couldn't be read — try exporting the resume again.",
};

export default function ResumeUpload() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);

  async function run(files: FileList | null) {
    if (!files || files.length === 0) return;
    const form = new FormData();
    for (const f of files) form.append("resume", f); // one is the locked case; two exercises multi_file server-side
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/resume/diagnose", { method: "POST", body: form });
      if (res.ok) {
        window.location.reload(); // the server page re-renders the stored run
      } else {
        const json = (await res.json().catch(() => null)) as { error?: string; detail?: string; missing?: string[] } | null;
        const code = json?.error ?? "parse_error";
        const tail = json?.missing?.length ? ` It's missing ${json.missing.join(" and ")}.` : "";
        setErr((json?.detail ?? REJECT_COPY[code] ?? "The file was rejected — try exporting it as a PDF or DOCX.") + tail);
      }
    } catch {
      setErr("The upload failed — check the connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rs-upload dropzone" aria-label="Run the resume checker">
      <div
        role="button"
        tabIndex={busy ? -1 : 0}
        className={`dz-zone${drag ? " dz-over" : ""}`}
        onClick={() => !busy && fileInput.current?.click()}
        onKeyDown={(e) => {
          if (!busy && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            fileInput.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          if (!busy) void run(e.dataTransfer.files);
        }}
        disabled={busy}
        aria-label="Drop your resume here (PDF or DOCX) or click to browse — the checker runs on drop"
      >
        {busy ? (
          <span className="dz-busy">Reading the file…</span>
        ) : err ? (
          <span className="rs-err dz-err" role="status" aria-live="polite">
            {err}
          </span>
        ) : (
          <>
            <span className="ms dz-icon" aria-hidden="true">
              upload_file
            </span>
            <span className="dz-head">Drop your resume here</span>
            <span className="dz-sub">PDF or DOCX · it runs the moment the file lands</span>
          </>
        )}
      </div>
      <input
        ref={fileInput}
        type="file"
        className="rs-file dz-input"
        multiple
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={(e) => {
          void run(e.target.files);
          e.target.value = "";
        }}
      />
    </section>
  );
}
```

Notes for the engineer:
- `role="button"` + keyboard Enter/Space preserves keyboard a11y for the file dialog; the hidden `dz-input` stays in the DOM so `page.setInputFiles()` keeps working (playwright does not require visibility for file inputs).
- The `.rs-err` class name on the rejection span is LOAD-BEARING (e2e asserts `.rs-err`); do not rename.
- `.dz-input` must remain clickable-through: style it `opacity:0; position:absolute; inset:0; cursor:pointer;` in Task 6 so native drag onto it also works.

- [ ] **Step 1: Overwrite the file** (content above)
- [ ] **Step 2: Syntax sanity:** `npx tsc -p tsconfig.json --noEmit` — only `prep/page.tsx` (LetterUpload props, fixed in Task 5) and pre-existing WIP errors may fail. No new errors from this file.
- [ ] **Step 3: Commit**

```bash
git add app/\(app\)/prep/ResumeUpload.tsx
git commit -m "feat(prep): resume checker dropzone — drop-to-run intake"
```

---

### Task 5: LetterUpload → auto-run dropzone + optional employer field

**Files:**
- Create (overwrite): `app/(app)/prep/LetterUpload.tsx` with exactly this content

```tsx
"use client";

import { useRef, useState } from "react";

/**
 * The cover-letter checker's intake (v7.4 minimal-tool recut): the SAME
 * dropzone pattern as the resume — one file (TXT/PDF/DOCX) lands and the
 * check runs immediately. The OPTIONAL employer anchor sits as one small
 * field BENEATH the zone (fill it before dropping, or leave it empty — the
 * omitted case skips its check honestly and prints the exact line in the
 * results). POST to /api/cover-letter/check; on success the page reloads
 * (the server page re-renders the stored run). Rejections show the locked
 * reason inline (aria-live, .cl-err — e2e contract) and persist nothing.
 * NO authoring surface exists — no paste box, no generated letter, nothing
 * edited inside the system (the same hard fence as the resume round).
 */

const REJECT_COPY: Record<string, string> = {
  bad_form: "The upload didn't arrive complete — pick the file again.",
  unauthorized: "Your session ended — sign in again and re-upload.",
  no_career: "Pick your target role first — the check measures against it.",
  no_file: "Choose a cover letter file first (TXT, PDF, or DOCX).",
  multi_file: "One file at a time — drop the cover letter as a single PDF, DOCX, or TXT.",
  oversize: "Over the 5 MB limit — a plain, text-only letter export stays well under it. Remove images and export the letter again.",
  empty: "The file carries almost no text — a letter needs its body.",
  encrypted: "This file is password-protected or encrypted — save an unlocked copy as a PDF, DOCX, or TXT and upload that.",
  scanned: "This PDF carries essentially no readable text — it reads as a scan or an image-only export. The letter has to be real text, not a picture of it. Re-export a text-based PDF (or a .txt/.docx).",
  wrong_type: "This file's content is not readable text (or a PDF/Word carrier of one) — the extension alone isn't trusted.",
  parse_error: "This file's structure couldn't be read — try exporting the letter again.",
  format_check_failed: "The format checks didn't pass. Nothing was saved or scored.",
};

export default function LetterUpload() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [employer, setEmployer] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);

  async function check(files: FileList | null) {
    if (!files || files.length === 0) return;
    const form = new FormData();
    form.append("letter", files[0]);
    const anchor = employer.trim();
    if (anchor.length > 0) form.append("employer", anchor); // absent = the optional check skips honestly — nothing invented
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/cover-letter/check", { method: "POST", body: form });
      if (res.ok) {
        window.location.reload(); // the server page re-renders the stored run
      } else {
        const json = (await res.json().catch(() => null)) as { error?: string; detail?: string } | null;
        const code = json?.error ?? "parse_error";
        setErr(json?.detail ?? REJECT_COPY[code] ?? "The file was rejected — try exporting the letter as a PDF, DOCX, or TXT.");
      }
    } catch {
      setErr("The upload failed — check the connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="cl-upload dropzone" aria-label="Run the cover-letter checker">
      <div
        role="button"
        tabIndex={busy ? -1 : 0}
        className={`dz-zone${drag ? " dz-over" : ""}`}
        onClick={() => !busy && fileInput.current?.click()}
        onKeyDown={(e) => {
          if (!busy && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            fileInput.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          if (!busy) void check(e.dataTransfer.files);
        }}
        disabled={busy}
        aria-label="Drop your cover letter here (TXT, PDF, or DOCX) or click to browse — the checker runs on drop"
      >
        {busy ? (
          <span className="dz-busy">Reading the letter…</span>
        ) : err ? (
          <span className="cl-err dz-err" role="status" aria-live="polite">
            {err}
          </span>
        ) : (
          <>
            <span className="ms dz-icon" aria-hidden="true">
              mail
            </span>
            <span className="dz-head">Drop your cover letter here</span>
            <span className="dz-sub">TXT, PDF, or DOCX · it runs the moment the file lands</span>
          </>
        )}
      </div>
      <input
        ref={fileInput}
        type="file"
        className="rs-file dz-input"
        accept=".txt,.pdf,.docx,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={(e) => {
          void check(e.target.files);
          e.target.value = "";
        }}
      />
      <div className="cl-field cl-below">
        <label className="rs-links num" htmlFor="cl-employer">
          Employer{" "}
          <input
            type="text"
            id="cl-employer"
            className="cl-input"
            value={employer}
            maxLength={120}
            aria-label="Employer (optional)"
            placeholder="Optional — a company name runs its own check. Leave empty if you're applying generally."
            onChange={(e) => setEmployer(e.target.value)}
          />
        </label>
      </div>
    </section>
  );
}
```

Note: `.cl-err` class on the rejection span is the e2e-visible hook — keep it.

- [ ] **Step 1: Overwrite the file** (content above)
- [ ] **Step 2: Typecheck now passes for the prep page components.**

```bash
npx tsc -p tsconfig.json --noEmit
```

Expected: no errors from `app/(app)/prep/**`. (Unrelated WIP files' pre-existing errors, if any, are not yours to fix.)

- [ ] **Step 3: Commit**

```bash
git add app/\(app\)/prep/LetterUpload.tsx
git commit -m "feat(prep): cover-letter checker dropzone with optional employer field"
```

---

### Task 6: prep.css — band recast + dropzone styles + dead-style sweep

**Files:**
- Modify: `app/(app)/prep/prep.css`

- [ ] **Step 1: Band → white dashboard register**

Replace the band block:

```css
.v7prep .band {
  background: var(--v-surface);
  border: 1px solid var(--v-border);
  border-radius: 8px;
  box-shadow: var(--v-shadow);
  padding: 14px 18px;
  margin-bottom: 12px;
}
```

with:

```css
.v7prep .band {
  background: var(--v-surface);
  border: 1px solid var(--v-border);
  border-radius: 8px;
  box-shadow: var(--v-shadow);
  padding: 16px 20px;
  margin-bottom: 12px;
}
```

and the title rule (currently 18px) to:

```css
.v7prep .who .t {
  font: 500 15px/1.35 Roboto, system-ui, sans-serif;
  margin: 0;
  color: var(--v-ink);
}
```

Update the section comment to `/* ---------- named band — the white dashboard register (v7.4 sweep) ---------- */`, and fix the file-header comment'd claim of grey trays if present.

- [ ] **Step 2: Dropzone styles**

Replace the `.rs-upload` / `.cl-upload` surface scaffolding (the border-top rules at ~lines 228–239 and the `.rs-file-row`, `.rs-note/.cl-note`, `.rs-file::file-selector-button` blocks at ~lines 584–620) with:

```css
/* ---------- the dropzone intake (v7.4 recut) ---------- */

.v7prep .card > .rs-upload,
.v7prep .card > .cl-upload,
.v7prep .card > .rs-upload + .rs-links,
.v7prep .card > .panel-sec + .rs-upload,
.v7prep .card > .panel-sec + .cl-upload { border-top: 1px solid var(--v-rows); padding-top: 14px; }

.v7prep .rs-upload,
.v7prep .cl-upload {
  margin: 14px 16px;
}

.v7prep .dz-zone {
  width: 100%;
  border: 1.5px dashed var(--v-border);
  border-radius: 8px;
  background: var(--v-surface);
  padding: 44px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  text-align: center;
  user-select: none;
}
.v7prep .dz-zone:hover,
.v7prep .dz-zone:focus-visible,
.v7prep .dz-zone.dz-over {
  border-color: var(--v-blue);
  background: var(--v-blue-wash);
}
.v7prep .dz-zone:focus-visible { outline: 2px solid var(--v-blue); outline-offset: 2px; }
.v7prep .dz-icon { font-size: 30px; color: var(--v-blue); }
.v7prep .dz-head { font: 500 15px/1.35 Roboto, system-ui, sans-serif; color: var(--v-ink); }
.v7prep .dz-sub { font: 400 12.5px/1.45 Roboto, system-ui, sans-serif; color: var(--v-ink2); }
.v7prep .dz-busy { font: 400 13.5px/1.5 Roboto, system-ui, sans-serif; color: var(--v-ink2); }
.v7prep .dz-err { font: 400 12.5px/1.5 Roboto, system-ui, sans-serif; max-width: 64ch; }

.v7prep .rs-upload .dz-err, .v7prep .cl-upload .dz-err { color: var(--v-amber-text); font-weight: 500; }

/* the hidden-but-real file input (setInputFiles-driven e2e + native browse) */
.v7prep .dz-input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  overflow: hidden;
}

/* the optional employer row lives quietly under the letter's zone */
.v7prep .cl-below { margin-top: 10px; max-width: 420px; }
.v7prep .cl-below .cl-input { width: 100%; }

/* the resume checker's one quiet links line */
.v7prep .rs-links {
  margin: 10px 0 0;
  font: 400 12.5px/1.5 Roboto, system-ui, sans-serif;
  color: var(--v-ink2);
}
.v7prep .rs-links a { color: var(--v-blue-deep); text-decoration: underline; text-underline-offset: 2px; }
```

Verify the old classes are gone everywhere they were dead: search the file for `rs-file-row`, `.rs-note`, `.cl-note`, `must-disc`, `rs-list`, `rs-ctas`, `prep-sublabel`, `cl-sublabel`, `cl-row` selector blocks and DELETE each block that no longer has a producer in TSX (grep the app first: `.rs-ctas` is still used by the guide page — KEEP `.rs-ctas`; `.cl-input` still used by the employer field — KEEP its original block if not redefined above; `nextstep` still used by the resume→letter handoff — KEEP). The mobile `@media` rules referencing deleted selectors (`rs-file-row`, `cl-row`) are deleted too.

- [ ] **Step 3: Visual check**

```bash
npm run build && npx playwright test e2e/resume-diagnostic.spec.ts
```

(This first e2e run will FAIL on some copy/flow assertions until Task 8 updates them — that's expected and is the reason Task 8 exists. What you're checking here is **no CSS/markup runtime breakage**: the dev build compiles, the page renders, the dropzone appears. Use `npx playwright test --trace on ...` screenshots or `npm run dev` + a manual look.)

- [ ] **Step 4: Commit**

```bash
git add app/\(app\)/prep/prep.css
git commit -m "feat(prep): white band register + dropzone intake styles"
```

---

### Task 7: Guide page — Harvard template link + rename back-link

**Files:**
- Modify: `app/(app)/prep/guide/page.tsx`

- [ ] **Step 1: Replace the template section** (~lines 146–161, "Download the reference template")

```tsx
        <section className="panel-sec">
          <div className="b-head">
            <h2>Reference template — Harvard</h2>
            <p className="helper">
              The one-page bullet-point resume template from Harvard&apos;s Mignone Center for Career
              Success — the reference frame for the format rules above. Links open Harvard&apos;s
              career-services site (external).
            </p>
          </div>
          <div className="rs-ctas">
            <a
              className="btn btn-primary"
              href="https://careerservices.fas.harvard.edu/resources/bullet-point-resume-template/"
              target="_blank"
              rel="noreferrer"
            >
              Harvard bullet-point resume template <span className="arrow num">↗</span>
            </a>
            <a
              className="link-quiet"
              href="https://docs.google.com/document/d/1nlD4BGOyKF2vnC1Zhcbd8_jvkRRmIw-OAa-tT0MSCj0/copy"
              target="_blank"
              rel="noreferrer"
            >
              Google Docs copy ↗
            </a>
          </div>
        </section>
```

- [ ] **Step 2: Sources line** — append `· Harvard MCS bullet-point resume template` to the existing `src-line` paragraph (after `parsing literature (Yu et al. 2005; RecSys in HR'23).`), keeping the sentence structure readable.

- [ ] **Step 3: Rename the back pointer** — the closing `<Link className="btn btn-ghost" href="/prep">` child text `Back to the Resume Diagnostic →` → `Back to the Resume checker →`; update the page's `metadata.description` to mention `the Harvard bullet-point template` instead of `the downloadable reference template`, and the blueprint comment's "One blue primary: the .docx reference download" → "One blue primary: the Harvard template link (external)".

- [ ] **Step 4: Verify + commit**

```bash
npx tsc -p tsconfig.json --noEmit
git add app/\(app\)/prep/guide/page.tsx
git commit -m "feat(prep): Harvard template link replaces local reference downloads"
```

---

### Task 8: Naming sweep + full typecheck + fixtures test

**Files:**
- Modify: any files from Tasks 1–7 that still contain the old terms (grep-driven; likely `prep/page.tsx` review only)

- [ ] **Step 1: grep for leftover inconsistent terms**

```bash
grep -rn "Resume Diagnostic\|Cover-letter check\b\|Run the diagnostic\|Run the letter check\|letter check\b" app --include='*.tsx' --include='*.ts' | grep -v node_modules
```

Fix each remaining USER-VISIBLE occurrence to the D3 naming ("Resume checker", "Cover-letter checker", "the check"/"the checker"). Comments mentioning the factor's history may keep the word "check" where it is prose describing behavior, but prefer the new names everywhere user-visible.

- [ ] **Step 2: Full typecheck + fixtures suite**

```bash
npx tsc -p tsconfig.json --noEmit
npm run verify:fixtures
```

Expected: both clean. (verify:fixtures only touches scripts/verify-fixtures.test.ts + lib fixtures — none of which this plan modifies.)

- [ ] **Step 3: Commit (if anything changed)**

```bash
git add <touched files>
git commit -m "refactor(prep): naming sweep to Resume checker / Cover-letter checker"
```

---

### Task 9: e2e spec updates + full e2e verification

**Files:**
- Modify: `e2e/resume-diagnostic.spec.ts`
- Modify: `e2e/demo-arc.spec.ts` (only the beat-7 AM pass section, ~lines 360–410)
- Modify: `e2e/record.spec.ts` (only the ticket-12 recut section, ~lines 167–180)

The e2e suite is ONE worker against the demo Supabase store; run the three specs in the order `resume-diagnostic → demo-arc → record` (matching the canon arc's reset/walk order) with the store reset between full walks (helpers.ts `resetStore` already runs in each suite's beforeAll).

- [ ] **Step 1: resume-diagnostic.spec.ts — upload helper (no button click)**

```ts
async function upload(page: Page, fixture: string, multi = false) {
  const input = page.locator('.rs-upload input[type="file"]');
  const files = multi ? [FIX(fixture), FIX("resume-good.pdf")] : FIX(fixture);
  await input.setInputFiles(files);
  await page.waitForLoadState("load");
}
```

- [ ] **Step 2: on-ramp section replace** (the "empty state: the on-ramp (Q7a)" block): assert the dropzone + quiet links line, then follow the format-guide link and the guide-page's external Harvard link. Drop all `.rs-notyet`, `.rs-list-src`, `.rs-listrow`, `a[download][href="/resume-reference.*"]` assertions (those surfaces no longer exist).

```ts
    /* ── empty state: the dropzone intake (v7.4) ─────────────────────────── */
    await page.goto("/prep");
    await page.waitForSelector(".rs-upload");
    await expect(page.locator(".dz-zone")).toBeVisible();
    await expect(page.locator(".dz-zone")).toContainText("Drop your resume here");
    // the one quiet links line: format guide + the external Harvard template
    const links = page.locator(".rs-links");
    await expect(links.getByRole("link", { name: "Format guide" })).toBeVisible();
    await expect(links.locator('a[href*="careerservices.fas.harvard.edu"]')).toBeAttached();

    // the guide stays reachable; the Harvard template link replaced local downloads
    await page.getByRole("link", { name: "Format guide" }).click();
    await expect(page.getByRole("heading", { name: "Resume format guide" })).toBeVisible();
    await expect(page.locator('a[href*="careerservices.fas.harvard.edu"]').first()).toBeAttached();
    // the guide keeps the ATS-friendly fence: formatting property, no outcomes
    const guideText = (await page.locator("main").innerText()).replace(/\s+/g, " ");
    expect(guideText.toLowerCase()).toContain("formatting property");
    expect(guideText.toLowerCase()).not.toContain("ats-pass");
    expect(guideText.toLowerCase()).not.toContain("ats pass");
    expect(guideText.toLowerCase()).not.toContain("ats-proof");
```

- [ ] **Step 3: run-meta assertions** — every `.rs-air-note` run-count/index expectations become the new one-line form:

- `toContainText("parse gate 1 × format 1 × keywords 1")` → `toContainText("parse 1 × format 1 × keywords 1")`
- `toContainText("1 run")` / `"2 runs"` / `"3 runs"` → `toContainText("your latest run counts")`

- [ ] **Step 4: rejection matrix** — unchanged copy + still `.rs-err`; assertions stay as-is (`One file at a time`, `doesn't read as a resume`, `missing`, `image-only export`, `Over the 5 MB limit`). If any exact-copy mismatch appears because the API's `detail` field text differs slightly from the assertion, fix the ASSERTION to the rendering text (copy-paste it from the trace), never invent new copy.

- [ ] **Step 5: demo-arc.spec.ts beat 7** (~370–400)

```ts
    await page.goto("/prep");
    await page.waitForSelector(".rs-upload");
    await page.locator('.rs-upload input[type="file"]').setInputFiles([path.join(process.cwd(), "e2e", "fixtures", "resume-qa.pdf")]);
    await page.waitForLoadState("load");
    await expect(page.locator(".rs-readout")).toBeVisible({ timeout: 45_000 });
    soft((await page.locator(".rs-readout-score").first().textContent()) ?? "").toContain("100");
    expect(page.locator(".rs-air-note")).toContainText("your latest run counts");
```

and the letter block:

```ts
    await page.goto("/prep#letter");
    await page.waitForSelector(".cl-upload");
    await page.locator('.cl-upload input[type="file"]').setInputFiles([path.join(process.cwd(), "e2e", "fixtures", "cover-letter-qa.txt")]);
    await page.waitForLoadState("load");
    await expect(page.locator(".cl-readout")).toBeVisible({ timeout: 45_000 });
    soft((await page.locator(".cl-readout .cl-readout-score").first().textContent()) ?? "").toContain("100");
    const employerRow = (await page.locator(".rs-check", { hasText: "Employer named" }).first().textContent())?.replace(/\s+/g, " ");
    expect(employerRow).toContain("not evaluated — no employer declared");
```

(dropping the `.cl-air-note` "3 of 4" expectation and the `"1 run"` expectation; keep `notes.push` lines but update quoted copy strings where they name removed text).

- [ ] **Step 6: record.spec.ts** (~168–180)

```ts
  await page.goto("/prep");
  await page.waitForSelector(".rs-upload");
  await page.setInputFiles('.rs-upload input[type="file"]', "e2e/fixtures/resume-qa.pdf");
  await page.waitForSelector(".rs-readout", { timeout: 45_000 });
  await page.waitForTimeout(1200);
  await page.click('.prep-lens button:has-text("Cover-letter checker")'); // switch to the letter tool
  await page.waitForTimeout(400);
  await page.setInputFiles('.cl-upload input[type="file"]', "e2e/fixtures/cover-letter-qa.txt");
  await page.waitForSelector(".cl-readout", { timeout: 45_000 });
```

- [ ] **Step 7: Run the three specs in order**

```bash
npx playwright test e2e/resume-diagnostic.spec.ts e2e/demo-arc.spec.ts e2e/record.spec.ts
```

Expected: PASS (retries are on; one flake retry is acceptable, three is a bug — investigate before declaring done). Server config: `reuseExistingServer` means an already-running dev/prod server on :3000 is reused; otherwise `npm run start` needs a prior `npm run build` — run `npm run build` first if no server is up.

- [ ] **Step 8: Commit**

```bash
git add e2e/resume-diagnostic.spec.ts e2e/demo-arc.spec.ts e2e/record.spec.ts
git commit -m "test(e2e): resume/letter dropzone flows + condensed run meta"
```

---

## Final verification gate (all tasks done)

- [ ] `npx tsc -p tsconfig.json --noEmit` clean
- [ ] `npm run build` clean
- [ ] Full e2e suite `npx playwright test` green (`resume-diagnostic`, `demo-arc`, `record` are the affected specs; the full suite re-runs canon walk in worker-1 order)
- [ ] Manual pass over http://localhost:3000/prep and /prep/guide at 1440px: two tabs, dropzone-first checkers, white bands on all five pages, no presence tab, no must-contain table, Harvard link opens externally
- [ ] `git status` shows no files staged beyond each task's commit footprint; WIP files untouched are still untouched

## Out of scope (do not touch)

- Engines (`lib/engines/**`), rubric/score, `/api/**` routes, stores (`lib/db/**`)
- `public/resume-reference.*` files (they stay; only UI links to them are removed)
- Profile presence flow (`profile/PresenceCard.tsx`, `DpaArtifacts.tsx`)
- Onboarding copy; design tokens (`v7.css`); nav (`AppBar.tsx`)
