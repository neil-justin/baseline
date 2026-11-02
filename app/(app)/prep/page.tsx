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
