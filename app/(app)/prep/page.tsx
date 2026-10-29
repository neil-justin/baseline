import type { Metadata } from "next";
import { getStudentView } from "@/lib/db";
import { requireStudent } from "@/lib/session";
import { resumeRunStore, resumePersistenceNotice } from "@/lib/db/resume-run-store";
import type { ResumeFinding } from "@/lib/engines/resume/analyze";
import { mustContainList, type MustContainItem } from "./must-contain";
import ResumeUpload from "./ResumeUpload";
import "./prep.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Resume Diagnostic — Career Readiness",
  description: "Feedback-only resume diagnostic: parseability, format conformance, and keyword alignment against your target role.",
};

/**
 * Prep → Resume — "Resume Diagnostic" (feature #7, round 6a brief).
 * The system ADVISES the resume; it never authors, hosts, or edits it.
 *  - no run → the on-ramp: format guide + template + personalized
 *    "what your resume must contain to score" (from the student's state);
 *  - a run → the stored result: three deterministic factors + findings +
 *    suggestions (tiered rule, templates only), plus re-run.
 * AIR honesty: with no run, the resume component reads "not yet measured" —
 * never painted, never pretend-scored.
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

async function makeRunView(studentId: string) {
  const latest = await resumeRunStore.latest(studentId);
  return latest;
}

/* ── no-resume on-ramp (Q7a) ─────────────────────────────────────────────── */

function OnRamp({
  name,
  careerName,
  items,
}: {
  name: string;
  careerName: string;
  items: MustContainItem[];
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
          Resume component · <b>not yet measured</b> — the honest read until your first successful run
          (best run counts; parse-failed uploads aren&apos;t runs)
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

      <ResumeUpload careerName={careerName} />
    </div>
  );
}

/* ── run result ──────────────────────────────────────────────────────────── */

function RunResult({
  run,
  runsCount,
  bestAir,
  studentName,
}: {
  run: NonNullable<Awaited<ReturnType<typeof makeRunView>>>["run"];
  runsCount: number;
  bestAir: number;
  studentName: string;
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
          <b className="num">parse gate {run.air.parsePass} × format {run.air.formatScore} × keywords {run.air.keywordScore}</b>. Best run counts
          across unlimited re-runs — this student&apos;s best is <b className="num">{bestAir}</b> over{" "}
          <b className="num">{runsCount}</b> run{runsCount === 1 ? "" : "s"}.
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

      <ResumeUpload careerName={run.careerName} />
      <p className="rs-foot num">{studentName.toUpperCase()} · RUN {runsCount} · BEST {bestAir} · PARSE GATE {run.air.parsePass}</p>
    </div>
  );
}

/* ── page ────────────────────────────────────────────────────────────────── */

export default async function PrepPage() {
  const profile = await requireStudent();
  const { state, career } = await getStudentView(profile.studentId);
  const latest = career ? await makeRunView(profile.studentId) : null;
  const items = career ? await mustContainList(career, state) : [];

  return (
    <div className="shell prep-shell">
      <div className="screen-head">
        <h1>Resume Diagnostic</h1>
        <p className="page-id num">
          {state.name} · target: <b>{career?.name ?? "no role picked yet"}</b>
        </p>
      </div>
      <p className="prep-sublabel num">
        Feedback only · the system advises the resume — it never authors, hosts, or edits it
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
      ) : latest ? (
        <RunResult run={latest.run} runsCount={latest.runsCount} bestAir={latest.bestAir} studentName={state.name} />
      ) : (
        <OnRamp name={state.name} careerName={career.name} items={items} />
      )}
    </div>
  );
}
