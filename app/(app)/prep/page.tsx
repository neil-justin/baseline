import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getStudentView } from "@/lib/db";
import { requireStudent } from "@/lib/session";
import { resumeRunStore, resumePersistenceNotice, type ResumeRunSummary } from "@/lib/db/resume-run-store";
import { letterRunStore, letterPersistenceNotice, type LetterRunSummary } from "@/lib/db/letter-run-store";
import { AR_FACTORS, WEIGHTS } from "@/lib/engines/score";
import { RESUME_AIR_WEIGHTS, LETTER_AIR_WEIGHTS } from "@/lib/engines/air";
import type { ResumeFinding } from "@/lib/engines/resume/analyze";
import ResumeUpload from "./ResumeUpload";
import LetterUpload from "./LetterUpload";
import PrepTabs from "./PrepTabs";
import "./prep.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Prep — Application Materials · Baseline",
  description:
    "A format & evidence screen for your application materials: the resume checker (7 of the 15-point AR channel) and the cover-letter checker (5 of 15) each surface the format checks and the role's evidence names; the presence declaration lives in Profile → Credentials (3 of 15). Feedback-only — it never claims an ATS pass.",
};

/**
 * Prep — "Application materials" (presentation rebuild, user ruling
 * 2026-11-03: "use Dashboard as a reference — not a copy — for how the data
 * is laid out"). The results card reads, top to bottom:
 *
 *   1. VERDICT STRIP — the run label + file line and the big score
 *      right-aligned (the Dashboard .score-big register: 46px numeral +
 *      /100), then the three factors as a KPI-cell GRID in the Dashboard
 *      band register (plain label · the % at the KPI-score scale · the 4px
 *      honest bar — blue at the factor's share, green at 100% — and a ≤2
 *      line 11px ink2 sub-line). The weighted shares ride the receipts
 *      line ("parse 20% + format 40% + evidence 40%") — never a × product.
 *   2. FACTOR GROUPS — Dashboard-parity grouped sections directly under the
 *      verdict strip (the Q15 live-expansion rule, now structural): each
 *      factor gets a mini-head row (label + share — meaning on the right)
 *      then its checks as a REAL table (Check | Result | Note); the Note
 *      column exists only when a row carries one. Result cells are wash
 *      chips — green "Pass" / grey "Missing"/"Not found"; amber only for
 *      the parse watch-class risk — never red.
 *   3. FINDINGS fold — on demand, example bullets kept.
 *   4. SLIM FOOTER — the bordered one-row "Check another version"
 *      affordance (drag preserved) with the quiet links line beside it.
 *      A NEVER-RUN tab keeps the upload-first hero dropzone.
 *
 * The tabs-row kicker is retired — the verdict strip alone owns the score.
 * Q19a: a stored run whose target ≠ the CURRENT career is honest history —
 * the card stays with the "Ran against {old role} — re-run to score"
 * banner; the AR band cells read it unmeasured (lib/db.ts feed).
 * The cover-letter tab mirrors the anatomy; its checks table stays behind
 * the e2e-guarded "The checks" fold (demo-arc contract) with its factor
 * groups re-housed inside it.
 * HONESTY CONTRACT: unchanged — nothing measured paints nothing; LATEST
 * counts; nothing claims an "ATS pass"; the checkers read format and named
 * evidence, nothing deeper.
 */

const fmtDT = (iso: string) => {
  const d = new Date(iso);
  return `${d.toLocaleString("en-US", { month: "short" })} ${d.getDate()} · ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

/* ── the band's AR channel cells — the Dashboard KPI register ───────────── */

type PartView = { measured: boolean; earned: number; max: number };

function BandCell({ name, part, notRun }: { name: string; part: PartView; notRun: string }) {
  const full = part.measured && part.earned === part.max;
  const pct = (n: number) => `${Math.round((n / part.max) * 100)}%`;
  return (
    <div className="bcell">
      <span className="label">{name}</span>
      <span className={`bval num${part.measured ? "" : " bquiet"}`}>
        {part.measured ? `${part.earned}/${part.max}` : "—"}
      </span>
      <div
        className="kbar"
        role="img"
        aria-label={
          part.measured ? `${name}: ${part.earned} of ${part.max} earned` : `${name}: ${notRun.toLowerCase()}`
        }
      >
        <i
          className={full ? "solid green" : "solid"}
          style={{ width: part.measured ? pct(part.earned) : "0" }}
        />
      </div>
      {part.measured ? (
        full ? (
          <span className="chip c-green">·✓</span>
        ) : null /* a partial factor carries nothing but its honest fraction+bar */
      ) : (
        <span className="chip c-grey">{notRun}</span>
      )}
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
            <small>/{WEIGHTS.ar}</small>
          </>
        )}
      </span>
    </div>
  );
}

/* ── verdict strip factor cells (Dashboard .kpi register) ───────────────── */

interface FactorView {
  name: string;
  score: number;
  meaning: string;
}

function FactorCell({ f }: { f: FactorView }) {
  const pct = Math.round(f.score * 100);
  return (
    <div className="rs-kpi">
      <p className="rs-kpi-head">
        <span className="label">{f.name}</span>
        <b className="num">{pct}%</b>
      </p>
      <div className="kbar" role="img" aria-label={`${f.name} factor: ${pct}% — ${f.meaning}`}>
        <i className={pct === 100 ? "solid green" : "solid"} style={{ width: `${pct}%` }} />
      </div>
      <p className="rs-kpi-note">{f.meaning}</p>
    </div>
  );
}

/* ── factor groups — Dashboard-parity sections: mini-head row (label +
   share — meaning on the right) then the checks as a REAL ledger table
   (Check | Result | Note). The Note column exists ONLY when a row of the
   group actually carries a note. Result cells are wash chips: green
   "Pass" / grey miss ("Missing" | "Not found"); amber is reserved for the
   Parse group's watch-class risk — never red. ──────────────────────────── */

interface GroupCheck {
  label: string;
  ok: boolean;
  /** the honestly-skipped row (the letter's omitted employer field) — a
   *  grey "Skipped" chip, never a miss */
  skipped?: boolean;
  note?: string;
}

function FactorGroup({
  name,
  meaning,
  checks,
  missLabel,
  watchClass,
  shareOverride,
}: {
  name: string;
  meaning: string;
  checks: GroupCheck[];
  missLabel: string;
  /** amber miss chips for this group's watch-class rows (Parse only) */
  watchClass?: boolean;
  /**
   * The factor's ENGINE share when the row-count share would lie about it.
   * Parse is the gate (lib/engines/resume/analyze.ts parseabilityFactor:
   * score=1 whenever a run exists, failed runs never store); its watch-class
   * row (a near-empty page) sits OUTSIDE the factor share — the same
   * exclusion semantics the letter's honestly-skipped structural rows have.
   * Without the override a blank page 2 prints "Parse — 50%" here under a
   * verdict-strip Parse bar that paints 100%.
   */
  shareOverride?: number;
}) {
  const evaluated = checks.filter((c) => !c.skipped);
  const share =
    shareOverride !== undefined
      ? Math.round(shareOverride * 100)
      : Math.round(
          (evaluated.filter((c) => c.ok).length / Math.max(1, evaluated.length)) * 100
        );
  const hasNotes = checks.some((c) => c.note);
  return (
    <section className="rs-fgroup">
      <div className="rs-fg-head rs-factor-head num">
        <span className="label">
          {name} — <b>{share}%</b>
        </span>
        <span className="rs-fn">{meaning}</span>
      </div>
      <table className="checks-table num">
        <thead>
          <tr>
            <th className="ct-check">Check</th>
            <th className="ct-result">Result</th>
            {hasNotes ? <th className="ct-note">Note</th> : null}
          </tr>
        </thead>
        <tbody>
          {checks.map((c, i) => (
            <tr className="rs-check num" key={i}>
              <td>{c.label}</td>
              <td>
                {c.skipped ? (
                  <span className="chip c-grey">Skipped</span>
                ) : (
                  <span className={`chip ${c.ok ? "c-green" : watchClass ? "c-amber" : "c-grey"}`}>
                    {c.ok ? "Pass" : watchClass ? "Watch" : missLabel}
                  </span>
                )}
              </td>
              {hasNotes ? (
                <td>
                  {c.note ? <span className="rs-check-note">{c.note}</span> : <span className="bquiet">—</span>}
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function StaleBanner({ oldCareer, kind }: { oldCareer: string; kind: string }) {
  return (
    <p className="rs-stale num" role="status">
      Ran against {oldCareer} — re-run to score. This {kind} is history for your current
      target role; the score above shows what the check found then.
    </p>
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

/* ── the resume checker's quiet links line — plain text beside the footer ── */

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

/* ── resume run result — verdict strip → factor groups → findings → footer ─ */

function RunResult({
  run,
  staleFor,
  children,
  links,
}: {
  run: NonNullable<ResumeRunSummary["run"]>;
  staleFor: string | null;
  children: ReactNode;
  links: ReactNode;
}) {
  const factorViews: FactorView[] = [
    { name: "Parse", score: run.parseability.score, meaning: "text readable as-is, every page carries content" },
    {
      name: "Format",
      score: run.format.score,
      meaning: `the sections screeners expect${run.flags.onepageEstimated ? " (one-page estimate)" : ""}`,
    },
    {
      name: "Evidence",
      score: run.keywords.score,
      meaning: `the role's core skills named in the file — vs ${run.careerName}`,
    },
  ];
  const groups: { name: string; meaning: string; checks: GroupCheck[]; missLabel: string; watchClass?: boolean }[] = [
    {
      name: "Parse",
      meaning: "what the file gives the reader",
      checks: run.parseability.checks,
      missLabel: "Not readable",
      watchClass: true,
    },
    {
      name: "Format",
      meaning: `section conformance${run.flags.onepageEstimated ? " — one page estimated from length" : ""}`,
      checks: run.format.checks,
      missLabel: "Missing",
    },
    {
      name: "Evidence",
      meaning: `core skills of ${run.careerName} found in the file`,
      checks: run.keywords.checks,
      missLabel: "Not found",
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
          {/* rs-readout-score stays as the e2e byte-contract hook (demo-arc +
              resume-diagnostic assert it contains the score); the .score-big
              carry is the Dashboard verdict register — additive, no drift */}
          <div className="rs-verdict rs-readout-score num">
            <span className="score-big">{run.air.airResume}</span>
            <span className="c-of">/100</span>
          </div>
        </div>
        {staleFor ? <StaleBanner oldCareer={staleFor} kind="run" /> : null}
        <div className="rs-kpis">
          {factorViews.map((f) => (
            <FactorCell key={f.name} f={f} />
          ))}
        </div>
        <p className="rs-air-note num">
          <b className="num">
            parse {Math.round(RESUME_AIR_WEIGHTS.parse * 100)}% + format {Math.round(RESUME_AIR_WEIGHTS.format * 100)}% + evidence {Math.round(RESUME_AIR_WEIGHTS.keywords * 100)}%
          </b>{" "}
          · your latest run counts{resumePersistenceNotice() ? (
            <span className="rs-notyet"> {resumePersistenceNotice()}</span>
          ) : null}
        </p>
      </section>

      {groups.map((g) => (
        <FactorGroup
          key={g.name}
          name={g.name}
          meaning={g.meaning}
          checks={g.checks}
          missLabel={g.missLabel}
          watchClass={g.watchClass}
          shareOverride={g.name === "Parse" ? factorViews[0].score : undefined}
        />
      ))}

      <details className="rs-disc">
        <summary className="num">
          Findings — {run.findings.length === 0 ? "no fixes found" : `${run.findings.length} to review`}
        </summary>
        <div className="rs-findings">
          {run.findings.map((f) => (
            <FindingCard key={f.id} f={f} />
          ))}
        </div>
      </details>

      {/* Q15: the slim one-row footer affordance (drag preserved); the quiet
          links line rides beside it */}
      <div className="rs-footer">
        {children}
        {links}
      </div>
    </>
  );
}

/* ── the cover-letter checker — same anatomy; its factor groups live
   behind the e2e-guarded "The checks" fold (demo-arc contract) ──────────── */

const LETTER_KINDS: Record<string, string> = { txt: "TXT", pdf: "PDF", docx: "Word" };

function LetterResult({ run, staleFor, children }: {
  run: NonNullable<LetterRunSummary["run"]>;
  staleFor: string | null;
  children: ReactNode;
}) {
  const allRan = run.checks.every((c) => c.ok !== null);
  const checkCount = run.checks.filter((c) => c.ok !== null).length;
  const factorViews: FactorView[] = [
    { name: "Parse", score: run.air.parsePass, meaning: "text readable as-is" },
    { name: "Evidence", score: run.air.keywordScore, meaning: `the role's core skills named — vs ${run.careerName}` },
    { name: "Structure", score: run.air.structuralScore, meaning: "salutation · ask · word band · employer" },
  ];

  const evidence: GroupCheck[] = run.keywords.map((k) => ({ label: k.label, ok: k.ok === true }));
  const structure: GroupCheck[] = run.checks.map((c) => ({
    label: c.label,
    ok: c.ok === true,
    // the honestly-skipped row (employer omitted) is NEVER a miss — it
    // prints the exact honesty line as its note (EMPLOYER_SKIP_NOTE contract)
    ...(c.ok === null ? { skipped: true } : {}),
    ...(c.note ? { note: c.note } : {}),
  }));

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
          {/* cl-readout-score: the letter side of the same e2e contract */}
          <div className="rs-verdict cl-readout-score num">
            <span className="score-big">{run.air.airLetter}</span>
            <span className="c-of">/100</span>
          </div>
        </div>
        {staleFor ? <StaleBanner oldCareer={staleFor} kind="check" /> : null}
        <div className="rs-kpis">
          {factorViews.map((f) => (
            <FactorCell key={f.name} f={f} />
          ))}
        </div>
        <p className="cl-air-note num">
          <b className="num">
            parse {Math.round(LETTER_AIR_WEIGHTS.parse * 100)}% + evidence {Math.round(LETTER_AIR_WEIGHTS.keywords * 100)}% + structure {Math.round(LETTER_AIR_WEIGHTS.structural * 100)}%
          </b>{" "}
          · your latest check counts{letterPersistenceNotice() ? (
            <span className="cl-notyet"> {letterPersistenceNotice()}</span>
          ) : null}
        </p>
      </section>

      {/* the re-check zone rides directly under the readout; the optional
          employer field lives here (only visible once a letter has run) */}
      {children}

      <details className="rs-disc">
        <summary className="num">
          The checks — {allRan ? "all ran" : `${checkCount} of ${run.checks.length} ran`}
        </summary>
        <FactorGroup
          name="Evidence"
          meaning={`core skills of ${run.careerName} found in the letter · the role anchor is always the declared Target Role`}
          checks={evidence}
          missLabel="Not found"
        />
        <FactorGroup name="Structure" meaning="the four structural checks" checks={structure} missLabel="Missing" />
      </details>

      <details className="rs-disc">
        <summary className="num">
          Findings — {run.findings.length === 0 ? "no fixes found" : `${run.findings.length} to review`}
        </summary>
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
      </details>
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

  // Q19a honesty at the SURFACE: a stored run against an old target stays
  // displayed as history (no content destruction) and carries the honest
  // re-run banner; the AR band cells already read it unmeasured (lib/db.ts)
  const resumeStaleFor =
    latestResume && career && latestResume.run.careerId !== career.id
      ? latestResume.run.careerName
      : null;
  const letterStaleFor =
    latestLetter && career && latestLetter.run.careerId !== career.id
      ? latestLetter.run.careerName
      : null;

  /* first-run tab panels keep the upload-first flow (Q15): the dropzone is
     the hero, the quiet links line beneath. A returning user's panel renders
     results-first with the slim footer affordance. */
  const resumeFirstRun = (
    <>
      <ResumeUpload />
      <ResumeLinks />
    </>
  );

  const letterFirstRun = <LetterUpload showEmployer={Boolean(latestLetter)} />;

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
    <RunResult run={latestResume.run} staleFor={resumeStaleFor} links={<ResumeLinks />}>
      <ResumeUpload slim />
    </RunResult>
  ) : (
    resumeFirstRun
  );

  const letterPanel = latestLetter ? (
    <LetterResult run={latestLetter.run} staleFor={letterStaleFor}>
      <LetterUpload showEmployer slim />
    </LetterResult>
  ) : (
    letterFirstRun
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
              <p className="m">For {career.name} — a format &amp; evidence screen for your resume and cover letter.</p>
            ) : (
              <p className="m">A format &amp; evidence screen for your resume and cover letter.</p>
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
            <p className="helper">Every checker measures its format checks and evidence names against one target role.</p>
          </div>
          <p className="nc-cta">
            <a className="btn btn-primary" href="/career">
              Browse the career index <span className="arrow num">→</span>
            </a>
          </p>
        </section>
      ) : (
        <PrepTabs panels={{ resume: resumePanel, letter: letterPanel }} />
      )}
    </div>
  );
}
