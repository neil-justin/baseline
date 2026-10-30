import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getStudentView } from "@/lib/db";
import { requireStudent } from "@/lib/session";
import { resumeRunStore, resumePersistenceNotice, type ResumeRunSummary } from "@/lib/db/resume-run-store";
import { letterRunStore, letterPersistenceNotice, type LetterRunSummary } from "@/lib/db/letter-run-store";
import { EMPLOYER_SKIP_NOTE } from "@/lib/engines/air";
import type { ResumeFinding } from "@/lib/engines/resume/analyze";
import { mustContainList, type MustContainItem } from "./must-contain";
import ResumeUpload from "./ResumeUpload";
import LetterUpload from "./LetterUpload";
import "./prep.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Prep — Application Materials · Career Readiness",
  description:
    "Feedback-only application materials diagnostics: the resume (7 of 15), the cover letter (5 of 15), and the presence declaration in Profile → Credentials (3 of 15) — each measuring on its own file.",
};

/**
 * Prep — "Application materials" (feature #7, round 6a + ticket 12 split).
 * The system ADVISES the student's own files; it never authors, hosts, or
 * edits one. ONE diagnostic surface carrying TWO independent per-file flows:
 *
 *  - Resume diagnostic (7 of 15 AR): no run → the on-ramp (format guide +
 *    must-contain list + upload); a run → the stored LATEST result (latest
 *    counts, amendment 3) + findings + re-run.
 *  - Cover-letter check (5 of 15 AR): independent upload (TXT/PDF/DOCX) +
 *    OPTIONAL employer field → the deterministic structural set (salutation ·
 *    employer named-or-honestly-skipped · closing ask · 250–500 words) + role
 *    alignment vs the declared Target Role, findings-only. The employer-
 *    omitted case prints the exact honesty line — "not evaluated — no
 *    employer declared" — and the denominator drops the check; never a
 *    silent fail, never a silent score.
 *
 * The third factor (presence, 3 of 15) declares in Profile → Credentials —
 * this surface carries the pointer, not the input (ticket 12 flow).
 * HONESTY CONTRACT: a factor without its own run renders "not yet measured"
 * (never painted); re-runs are unlimited and the LATEST run is the one that
 * counts; nothing here claims an "ATS pass".
 */

const fmtDT = (iso: string) => {
  const d = new Date(iso);
  return `${d.toLocaleString("en-US", { month: "short" })} ${d.getDate()} · ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

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

/* ── no-resume on-ramp (Q7a) ─────────────────────────────────────────────── */

function OnRamp({
  items,
  children,
}: {
  items: MustContainItem[];
  children: ReactNode;
}) {
  return (
    <div className="stack rs-ramp">
      <section className="panel block">
        <div className="b-head">
          <h2>No resume on file yet — that&apos;s the normal start</h2>
          <p className="helper">
            The diagnostic reads a resume <b>you</b> wrote yourself: in Docs or Word, outside this
            system. It never drafts, hosts, or edits one — your typing is the only typing that counts.
          </p>
        </div>
        <div className="rs-ctas">
          <a className="btn btn-primary" href="/prep/guide">
            Start here — the format guide <span className="arrow num">↵</span>
          </a>
          <a className="link-quiet" href="/resume-reference.docx" download>
            Reference template (.docx)
          </a>
          <a className="link-quiet" href="/resume-reference.pdf" download>
            Reference template (.pdf)
          </a>
        </div>
        <p className="rs-notyet num" role="status">
          Resume component · <b>not yet measured</b> — the honest read until your first successful run (your
          latest run is the one that counts; parse-failed uploads aren&apos;t runs). It earns 7 of the
          15-point Application-Readiness channel — the letter check and the presence stamp add their own.
        </p>
      </section>

      <section className="panel block">
        <div className="b-head">
          <h2>What your resume must contain to score</h2>
          <p className="helper">
            Every row comes from your own recorded progress — not a generic recipe. When these appear
            on your resume, the first diagnostic run has something real to measure.
          </p>
        </div>
        <div className="rs-list">
          {items.map((it, i) => (
            <div className="rs-listrow" key={i}>
              <span className="rs-list-n num">{String(i + 1).padStart(2, "0")}</span>
              <b>{it.label}</b>
              <span className="rs-list-note">{it.note}</span>
              <span className="rs-list-src num">{it.src}</span>
            </div>
          ))}
        </div>
      </section>

      {children}
    </div>
  );
}

/* ── resume run result ──────────────────────────────────────────────────── */

function RunResult({
  run,
  runsCount,
  studentName,
  children,
}: {
  run: NonNullable<ResumeRunSummary["run"]>;
  runsCount: number;
  studentName: string;
  children: ReactNode;
}) {
  const factorHead = (name: string, score: number, note: string) => (
    <p className="rs-factor-head num">
      {name} — <b>{Math.round(score * 100)}%</b> <span className="rs-fn">{note}</span>
    </p>
  );
  return (
    <div className="stack">
      <section className="panel rs-readout" data-sequence>
        <div className="rs-readout-top">
          <div>
            <span className="label num">Resume diagnostic · {fmtDT(run.at)}</span>
            <div className="rs-readout-sub">
              {run.fileName} · {run.kind === "pdf" ? "PDF" : "Word"} · target <b>{run.careerName}</b>
            </div>
          </div>
          <div className="rs-readout-score num">
            {run.air.airResume}
            <small>/100</small>
          </div>
        </div>
        <p className="rs-air-note">
          Deterministic resume component:{" "}
          <b className="num">parse gate {run.air.parsePass} × format {run.air.formatScore} × keywords {run.air.keywordScore}</b>. Latest
          counts — this stored run is your most recent full attempt ({runsCount} run{runsCount === 1 ? "" : "s"} recorded);
          re-running a file replaces it, and the fresh run is the one that scores.
          {resumePersistenceNotice() && (
            <>
              {" "}
              <span className="rs-notyet">{resumePersistenceNotice()}</span>
            </>
          )}
        </p>
      </section>

      <section className="panel block">
        <div className="b-head">
          <h2>The three factors</h2>
        </div>
        {factorHead("Parseability", run.parseability.score, "text present and extractable, per-page sanity")}
        <div className="rs-checks">
          {run.parseability.checks.map((c, i) => (
            <p className="rs-check num" key={i}>
              <span className={`mark ${c.ok ? "ok" : "no"}`}>{c.ok ? "✓" : "✕"}</span> {c.label}
              {c.note ? <span className="rs-check-note"> · {c.note}</span> : null}
            </p>
          ))}
        </div>
        {factorHead("Format conformance", run.format.score, `vs the guide${run.flags.onepageEstimated ? " (layout-independent estimate)" : ""}`)}
        <div className="rs-checks">
          {run.format.checks.map((c, i) => (
            <p className="rs-check num" key={i}>
              <span className={`mark ${c.ok ? "ok" : "no"}`}>{c.ok ? "✓" : "✕"}</span> {c.label}
              {c.note ? <span className="rs-check-note"> · {c.note}</span> : null}
            </p>
          ))}
        </div>
        {factorHead("Keyword alignment", run.keywords.score, `core-tier skills of ${run.careerName} found in the text`)}
        <div className="rs-checks">
          {run.keywords.checks.map((c, i) => (
            <p className="rs-check num" key={i}>
              <span className={`mark ${c.ok ? "ok" : "no"}`}>{c.ok ? "✓" : "✕"}</span> {c.label}
            </p>
          ))}
        </div>
        <p className="src-line num">
          Deterministic templates only — no LLM calls in this layer. `ATS-friendly` is a formatting
          property, a claim about none: no outcome promise is made here.
        </p>
      </section>

      <section className="panel block">
        <div className="b-head">
          <h2>Findings and suggestions</h2>
          <p className="helper">
            {run.findings.length === 0
              ? "No fixes found in this run — the reload-and-recheck line stays: re-runs are free, and the next draft can still aim higher."
              : "Each row traces to something in your file. Suggestions are content moves — an example bullet is a shape to follow, never text to paste, and nothing here edits or re-creates the document."}
          </p>
        </div>
        <div className="rs-findings">
          {run.findings.map((f) => (
            <FindingCard key={f.id} f={f} />
          ))}
        </div>
      </section>

      {children}
      <p className="rs-foot num">{studentName.toUpperCase()} · RUN {runsCount} · LATEST {run.air.airResume} · PARSE GATE {run.air.parsePass}</p>
    </div>
  );
}

/* ── the cover-letter check (ticket 12) ─────────────────────────────────── */

const LETTER_KINDS: Record<string, string> = { txt: "TXT", pdf: "PDF", docx: "Word" };

function LetterResult({ run, runsCount, studentName, children }: {
  run: NonNullable<LetterRunSummary["run"]>;
  runsCount: number;
  studentName: string;
  children: ReactNode;
}) {
  const rowMark = (ok: boolean | null) =>
    ok === true ? "✓" : ok === false ? "✕" : "—";
  return (
    <div className="stack">
      <section className="panel cl-readout" data-sequence>
        <div className="cl-readout-top">
          <div>
            <span className="label num">Cover-letter check · {fmtDT(run.at)}</span>
            <div className="cl-readout-sub">
              {run.fileName} · {LETTER_KINDS[run.kind] ?? run.kind.toUpperCase()} ·{run.employerDeclared ? ` employer anchor ${run.employerName}` : " no employer declared"} · target <b>{run.careerName}</b>
            </div>
          </div>
          <div className="cl-readout-score num">
            {run.air.airLetter}
            <small>/100</small>
          </div>
        </div>
        <p className="cl-air-note">
          Deterministic letter component,{" "}
          <b className="num">parse gate {run.air.parsePass} × role keywords {run.air.keywordScore} × structural {run.air.structuralScore}</b> — the
          structural denominator holds only the checks that ran ({run.checks.filter((c) => c.ok !== null).length} of 4; the
          optional employer check is {run.employerDeclared ? "anchored and counted" : "skipped honestly, not scored"}). Your latest letter check counts — this is run {runsCount} (letter runs are independent of the resume&apos;s).
          {letterPersistenceNotice() && (
            <>
              {" "}
              <span className="cl-notyet">{letterPersistenceNotice()}</span>
            </>
          )}
        </p>
      </section>

      <section className="panel block">
        <div className="b-head">
          <h2>The checks</h2>
          <p className="helper">
            The locked deterministic set, in the order the reader hits them. A skipped check prints its
            honest line and drops from the math — it is never failed into silence.
          </p>
        </div>
        <div className="rs-checks">
          <p className="cl-role-line num">
            <span className="cl-role-label num">ROLE ALIGNMENT</span> — {run.keywords.filter((k) => k.ok).length} of {run.keywords.length} core skills of <b>{run.careerName}</b> found in the text · the Role anchor is always the declared Target Role
          </p>
          {run.keywords.map((c, i) => (
            <p className="rs-check num" key={`kw-${i}`}>
              <span className={`mark ${c.ok ? "ok" : "no"}`}>{c.ok ? "✓" : "✕"}</span> {c.label}
            </p>
          ))}
          {run.checks.map((c, i) => (
            <p className="rs-check num" key={`st-${i}`}>
              <span className={`mark ${c.ok === null ? "skip" : c.ok ? "ok" : "no"}`}>{rowMark(c.ok)}</span> {c.label}
              {c.note ? (
                c.ok === null && c.label === "Employer named" ? (
                  <span className="cl-notyet"> · {c.note}</span>
                ) : (
                  <span className="rs-check-note"> · {c.note}</span>
                )
              ) : null}
            </p>
          ))}
        </div>
        <p className="src-line num">
          Feedback only — the system advises the letter you brought, never writes one; no LLM here, and
          no “ATS pass” is claimed: the editor&apos;s promise to you is the next draft, not an outcome.
        </p>
      </section>

      <section className="panel block">
        <div className="b-head">
          <h2>Findings and suggestions</h2>
          <p className="helper">
            {run.findings.length === 0
              ? "No fixes found in this check — the employer field you left empty was skipped honestly, and everything else ran and passed."
              : "Each row traces to a specific check into your own text. Suggestions are content moves — a shape to follow in YOUR words, never text to paste."}
          </p>
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

      {children}
      <p className="rs-foot num">
        {studentName.toUpperCase()} · LETTER RUN {runsCount} · LATEST {run.air.airLetter} · PARSE GATE {run.air.parsePass}
      </p>
    </div>
  );
}

/* ── page ───────────────────────────────────────────────────────────────── */

export default async function PrepPage() {
  const profile = await requireStudent();
  const { state, career, score } = await getStudentView(profile.studentId);
  const latestResume: ResumeRunSummary | null = career
    ? await resumeRunStore.latest(profile.studentId)
    : null;
  const latestLetter: LetterRunSummary | null = career
    ? await letterRunStore.latest(profile.studentId)
    : null;
  const items = career ? await mustContainList(career, state) : [];

  const resumeChildren = (
    <ResumeUpload careerName={career?.name ?? ""} />
  );

  const letterChildren = (
    <LetterUpload careerName={career?.name ?? ""} employerRow={EMPLOYER_SKIP_NOTE} />
  );

  return (
    <div className="shell prep-shell">
      <div className="screen-head">
        <h1>Prep</h1>
        <p className="page-id num">
          {state.name} · target: <b>{career?.name ?? "no role picked yet"}</b>
        </p>
      </div>
      <p className="prep-instrument num" role="status">
        Application readiness · <b>{score && score.ar !== null ? `${score.ar}` : "—"}</b> of 15{" "}
        {score && score.ar !== null
          ? `— resume ${score.arParts.resume.earned}/${score.arParts.resume.max} · letter ${score.arParts.letter.earned}/${score.arParts.letter.max} · presence ${score.arParts.presence.measured ? `${score.arParts.presence.earned}/${score.arParts.presence.max}` : "not declared"}`
          : "— resume 7 · letter 5 · presence 3, each measuring on its own file (presence declares in Profile → Credentials)"}
      </p>

      {!career ? (
        <div className="panel block" style={{ marginTop: 14 }}>
          <div className="b-head">
            <h2>Pick your target role first</h2>
            <p className="helper">Every diagnostic measures against one target role at a time.</p>
          </div>
          <p style={{ marginTop: 10 }}>
            <a className="btn btn-primary" href="/career">
              Browse the career index <span className="arrow num">↵</span>
            </a>
          </p>
        </div>
      ) : (
        <div className="stack prep-flow">
          {/* ── resume diagnostic (7 of 15) ── */}
          <section className="prep-factor">
            <h2 className="prep-factor-head">Resume Diagnostic</h2>
            <p className="prep-sublabel num">
              Feedback only · the system advises the resume — it never authors, hosts, or edits it
            </p>
            {latestResume ? (
              <RunResult run={latestResume.run} runsCount={latestResume.runsCount} studentName={state.name}>
                {resumeChildren}
              </RunResult>
            ) : (
              <OnRamp items={items}>
                {resumeChildren}
              </OnRamp>
            )}
          </section>

          {/* ── cover-letter check (5 of 15) — independent per-file flow ── */}
          <section className="prep-factor">
            <h2 className="prep-factor-head">Cover-letter check</h2>
            <p className="cl-sublabel num">
              Independent upload · the letter runs on its own file, separate from the resume — your latest letter check counts
            </p>
            {!latestLetter ? (
              <div className="stack rs-ramp">
                <section className="panel block">
                  <div className="b-head">
                    <h2>No letter checked yet</h2>
                    <p className="helper">
                      Bring the cover letter you wrote yourself (TXT, PDF, or DOCX — written outside this system, same fence as the
                      resume). The check grades structure against your target role: <b>salutation · employer-name (optional field) ·
                      closing ask · 250–500 words</b>.
                    </p>
                  </div>
                  <p className="cl-notyet num" role="status">
                    Letter component · <b>not yet measured</b> — the honest read until your first successful check (your latest
                    letter check is the one that counts; unreadable uploads aren&apos;t checks). It earns 5 of the 15-point
                    Application-Readiness channel — the resume diagnosis and the presence stamp earn their own.
                  </p>
                </section>
                {letterChildren}
              </div>
            ) : (
              <LetterResult run={latestLetter.run} runsCount={latestLetter.runsCount} studentName={state.name}>
                {letterChildren}
              </LetterResult>
            )}
          </section>

          {/* ── the third factor lives in Profile → Credentials (ticket 12 flow) ── */}
          <p className="prep-src num">
            THIRD FACTOR · presence (3 of 15) is a declared entry, not an upload —{" "}
            <a href="/profile">Profile → Credentials</a> stamps it, machine-verified and timestamped, offline.
          </p>
        </div>
      )}
    </div>
  );
}
