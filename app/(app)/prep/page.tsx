import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getStudentView } from "@/lib/db";
import { requireStudent } from "@/lib/session";
import { resumeRunStore, resumePersistenceNotice, type ResumeRunSummary } from "@/lib/db/resume-run-store";
import { letterRunStore, letterPersistenceNotice, type LetterRunSummary } from "@/lib/db/letter-run-store";
import { AR_FACTORS, WEIGHTS } from "@/lib/engines/score";
import {
  RESUME_AIR_WEIGHTS,
  LETTER_AIR_WEIGHTS,
} from "@/lib/engines/air";
import type { ResumeFinding } from "@/lib/engines/resume/analyze";
import ResumeUpload from "./ResumeUpload";
import LetterUpload from "./LetterUpload";
import PrepTabs from "./PrepTabs";
import "./prep.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Prep — Application Materials · Career Readiness",
  description:
    "A format & evidence screen for your application materials: the resume checker (7 of the 15-point AR channel) and the cover-letter checker (5 of 15) each surface the format checks and the role's evidence names; the presence declaration lives in Profile → Credentials (3 of 15). Feedback-only — it never claims an ATS pass.",
};

/**
 * Prep — "Application materials" (§6.4/Q15 recut, user-locked 2026-11-03).
 * ONE surface carrying TWO sibling tool cards, RESULTS-FIRST for a returning
 * user and upload-first for a first run (Q15):
 *
 *  - Resume checker (7 of 15 AR): the diagnostic is a format & evidence
 *    screen — readout FIRST for returning users (big run score, the three
 *    factors as chips/bars — the "×" product line is gone, the honest
 *    weighted shares ride the receipts line), the factor checks LIVE-EXPANDED,
 *    findings with example bullets beneath, and the dropzone demoted to a
 *    slim "Check another version" footer affordance. First-run users keep
 *    the big upload-first dropzone.
 *  - Q19a: a stored run whose target ≠ the CURRENT career is honest history —
 *    the card stays, with the "Ran against {old role} — re-run to score"
 *    banner; the AR band cells read the run unmeasured (lib/db.ts feed).
 *  - Cover-letter checker (5 of 15): mirrors the anatomy; its checks table
 *    (e2e hook) stays a collapsed disclosure. The optional employer anchor
 *    field appears only after a letter has run.
 *
 * Presence is NOT a tab: it lives where it is declared (Profile →
 * Credentials); the band's computed counter cell is its state here.
 * Band KPI cells ride the Dashboard KPI register (Q14 addendum, signed
 * 2026-11-03): plain-name labels, ONE fraction value per cell, a 4px honest
 * bar (fill = the earned share), and the ✓ chip ONLY on a fully-earned
 * factor — the old label·7 + /7 + ✓-on-partials triple presentation and its
 * dishonest green are gone. The AR /15 cell is unchanged.
 * HONESTY CONTRACT: a factor without its own run reads "— / not yet" in
 * computed band furniture only (never painted); re-runs unlimited, the
 * LATEST run counts; nothing claims an "ATS pass" — the checkers read
 * format and named evidence, nothing deeper.
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

/* ── factor chips — the Q15 honest breakdown (bars, never a × product) ──── */

function FactorChip({ name, score, note }: { name: string; score: number; note: string }) {
  const pct = Math.round(score * 100);
  return (
    <div className="rs-kpi">
      <p className="rs-kpi-head">
        <span className="label">{name}</span>
        <b className="num">{pct}%</b>
      </p>
      <div className="kbar" role="img" aria-label={`${name} check: ${pct}% — ${note}`}>
        <i className={pct === 100 ? "solid green" : "solid"} style={{ width: `${pct}%` }} />
      </div>
      <p className="rs-kpi-note num">{note}</p>
    </div>
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

/* ── resume run result — Q15 verdict-first anatomy ───────────────────────── */

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
  const factorChecks: {
    name: string;
    score: number;
    note: string;
    checks: { label: string; ok: boolean; note?: string }[];
  }[] = [
    { name: "Parse", score: run.parseability.score, note: "text readable as-is", checks: run.parseability.checks },
    {
      name: "Format",
      score: run.format.score,
      note: `sections a screen reader expects${run.flags.onepageEstimated ? " (one-page estimate)" : ""}`,
      checks: run.format.checks,
    },
    {
      name: "Evidence",
      score: run.keywords.score,
      note: `the role's core skills named in the file — vs ${run.careerName}`,
      checks: run.keywords.checks,
    },
  ];
  const allGreen = factorChecks.every((f) => f.score === 1);
  const factorPct = Math.round(
    (factorChecks.reduce((sum, f) => sum + f.score, 0) / factorChecks.length) * 100
  );
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
        {staleFor ? <StaleBanner oldCareer={staleFor} kind="run" /> : null}
        <div className="rs-kpis">
          {factorChecks.map((f) => (
            <FactorChip key={f.name} name={f.name} score={f.score} note={f.note} />
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

      {/* Q15: the factor checks expand LIVE — the verdict card opens on the
          rows themselves; examples live in the findings fold below */}
      <details className="rs-disc" open>
        <summary className="num">
          The three factors — {allGreen ? "all green" : `${factorPct}% overall`}
        </summary>
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
      </details>

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

      {/* Q15: the dropzone DEMOTES to a slim footer affordance — drop or
          browse, same engine, one line under the verdict card */}
      <div className="rs-footer">
        {children}
        {links}
      </div>
    </>
  );
}

/* ── the cover-letter checker — mirrors the anatomy; its checks table
   (e2e hook .rs-disc summary "The checks") stays a collapsed fold ───────── */

const LETTER_KINDS: Record<string, string> = { txt: "TXT", pdf: "PDF", docx: "Word" };

function LetterResult({ run, staleFor, children }: {
  run: NonNullable<LetterRunSummary["run"]>;
  staleFor: string | null;
  children: ReactNode;
}) {
  const rowMark = (ok: boolean | null) =>
    ok === true ? "✓" : ok === false ? "✕" : "—";
  const allRan = run.checks.every((c) => c.ok !== null);
  const checkCount = run.checks.filter((c) => c.ok !== null).length;
  const factorChips = [
    { name: "Parse", score: run.air.parsePass, note: "text readable as-is" },
    { name: "Evidence", score: run.air.keywordScore, note: `the role's core skills named — vs ${run.careerName}` },
    { name: "Structure", score: run.air.structuralScore, note: "salutation · ask · word band · employer" },
  ];
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
        {staleFor ? <StaleBanner oldCareer={staleFor} kind="check" /> : null}
        <div className="rs-kpis">
          {factorChips.map((f) => (
            <FactorChip key={f.name} name={f.name} score={f.score} note={f.note} />
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
     results-first with the dropzone as the slim footer affordance. */
  const resumeChildren = (
    <>
      <ResumeUpload />
      <ResumeLinks />
    </>
  );

  const letterChildren = <LetterUpload showEmployer={Boolean(latestLetter)} />;

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
    resumeChildren
  );

  const letterPanel = latestLetter ? (
    <LetterResult run={latestLetter.run} staleFor={letterStaleFor}>
      <LetterUpload showEmployer slim />
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
              Browse the career index <span className="arrow num">↵</span>
            </a>
          </p>
        </section>
      ) : (
        <PrepTabs
          panels={{ resume: resumePanel, letter: letterPanel }}
          kickers={{
            resume: latestResume
              ? resumeStaleFor
                ? "PREVIOUS TARGET RUN"
                : `LATEST RUN · ${latestResume.run.air.airResume}/100`
              : "NOT YET RUN",
            letter: latestLetter
              ? letterStaleFor
                ? "PREVIOUS TARGET CHECK"
                : `LATEST CHECK · ${latestLetter.run.air.airLetter}/100`
              : "NOT YET CHECKED",
          }}
        />
      )}
    </div>
  );
}
