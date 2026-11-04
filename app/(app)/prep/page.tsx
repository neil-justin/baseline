import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getStudentView } from "@/lib/db";
import { requireStudent } from "@/lib/session";
import { resumeRunStore, type ResumeRunSummary } from "@/lib/db/resume-run-store";
import { letterRunStore, type LetterRunSummary } from "@/lib/db/letter-run-store";
import { AR_FACTORS, WEIGHTS } from "@/lib/engines/score";
import { RESUME_AIR_WEIGHTS, LETTER_AIR_WEIGHTS } from "@/lib/engines/air";
import type { ResumeFinding } from "@/lib/engines/resume/analyze";
import ResumeUpload from "./ResumeUpload";
import LetterUpload from "./LetterUpload";
import PrepTabs from "./PrepTabs";
import "./prep.css";

export const dynamic = "force-dynamic";

import { ArrowRight, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Prep — Application Materials Baseline",
  description:
    "A format & evidence screen for your application materials: the resume checker (7 of the 15-point AR channel) and the cover-letter checker (5 of 15) each surface the format checks and the role's evidence names; the presence declaration lives in the profile's Credentials tab (3 of 15). Feedback-only — it never claims an ATS pass.",
};

/**
 * Prep — "Application materials" (presentation rebuild, user ruling
 * 2026-11-03: "use Dashboard as a reference — not a copy — for how the data
 * is laid out"; second recut the same day: every section its OWN card).
 * The page reads, top to bottom:
 *
 *   1. NAMED BAND — Prep + target on the left, the readiness ring /15 on
 *      the right (the slot Dashboard gives 36/100; ring register, F1
 *      2026-11-04 — the My Plan plan-ring geometry).
 *   2. CHANNEL CARDS — Resume · Letter · Presence as one KPI card each
 *      (Dashboard `.kpis` geometry): name → fraction → 4px honest bar →
 *      wash chip → one-line receipt → the reference door at the card foot
 *      (user ruling 2026-11-04: the format guide moves OFF the buried
 *      RE-RUN links line onto its channel card; the Letter card's peer
 *      door waits for a letter guide — never a dead link).
 *   3. TOOLBAR — `.prep-lens` segmented tabs (Resume checker /
 *      Cover-letter checker), outside any card.
 *   4. READOUT CARD — run label + file line, the big /100 score, the
 *      weighted receipts line.
 *   5. FACTOR CARDS — one card per factor: label + share, the honest bar,
 *      the meaning line, then its checks as a REAL table (Check | Result |
 *      Note). The Note column exists only when a row carries one. Result
 *      cells are wash chips — green "Pass" / grey "Missing"/"Not found";
 *      amber only for the parse watch-class risk — never red.
 *   6. FINDINGS CARD — a fold, on demand, example bullets kept.
 *   7. RE-RUN CARD — the full-width "Check another version" zone; the
 *      letter's optional employer anchor rides ABOVE it (R9); the quiet
 *      "First resume?" links line is centred beneath (R8).
 *
 * A NEVER-RUN tab keeps the upload-first hero card. No card nests inside
 * another card anywhere on the page.
 * Q19a: a stored run whose target ≠ the CURRENT career is honest history —
 * the card stays with the "Ran against {old role} — re-run to score"
 * banner; the channel cards read it unmeasured (lib/db.ts feed).
 * HONESTY CONTRACT: unchanged — nothing measured paints nothing; LATEST
 * counts; nothing claims an "ATS pass"; the checkers read format and named
 * evidence, nothing deeper.
 */

const fmtDT = (iso: string) => {
  const d = new Date(iso);
  return `${d.toLocaleString("en-US", { month: "short" })} ${d.getDate()}, ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

/* ── the channel cards — the Dashboard KPI register, one card per channel
   (R3/R4, user ruling 2026-11-03: each channel reads as its own card, never
   a cell packed into the band) ─────────────────────────────────────────── */

type PartView = { measured: boolean; earned: number; max: number };

function ChannelCard({
  name,
  part,
  notRun,
  note,
  tone,
  icon,
  door,
}: {
  name: string;
  part: PartView;
  notRun: string;
  note: string;
  /** the wash family — Dashboard's three-tone kicon register (2026-11-04) */
  tone: "blue" | "green" | "amber";
  icon: ReactNode;
  /** the card-foot reference door (Resume: the format guide). Pinned to
   *  the card's foot so the three cards' feet stay aligned; a sibling
   *  without a door just ends at its note. */
  door?: { label: string; href: string };
}) {
  const full = part.measured && part.earned === part.max;
  const pct = (n: number) => `${Math.round((n / part.max) * 100)}%`;
  return (
    <div className={`prep-kpi k-${tone}`}>
      {/* F4 (2026-11-04): the kicon wash disc — Dashboard's imagery register */}
      <span className="kicon" aria-hidden="true">
        {icon}
      </span>
      <span className="k-name">{name}</span>
      <span className={`k-score num${part.measured ? "" : " bquiet"}`}>
        {part.measured ? (
          <>
            {part.earned}
            <small>/{part.max}</small>
          </>
        ) : (
          "—"
        )}
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
          <span className="chip c-green">Complete</span>
        ) : (
          <span className="chip c-blue">{part.max - part.earned} to close</span>
        )
      ) : (
        <span className="chip c-grey">{notRun}</span>
      )}
      <p className="k-note">{note}</p>
      {door ? (
        <a className="k-door num" href={door.href}>
          {door.label} <ArrowRight size={12} aria-hidden="true" />
        </a>
      ) : null}
    </div>
  );
}

/* ── factor card head (R5) ──────────────────────────────────────────────── */
/* ── the factor card head (R5): label + share, the 4px honest bar, then the
   one-line meaning. The old readout-wide KPI strip died with R5 — a factor
   card owns its own number and bar. ─────────────────────────────────────── */

function FactorHead({ name, share, meaning }: { name: string; share: number; meaning: string }) {
  return (
    <>
      <div className="rs-fg-head rs-factor-head num">
        <span className="label">{name}</span>
        <b className="rs-fg-score num">{share}%</b>
      </div>
      <div className="kbar" role="img" aria-label={`${name} factor: ${share}% — ${meaning}`}>
        <i className={share === 100 ? "solid green" : "solid"} style={{ width: `${share}%` }} />
      </div>
      <p className="rs-fn">{meaning}</p>
    </>
  );
}

/* ── factor groups — one CARD per factor (R5): head row (label + share), the
   honest bar, the meaning line, then the checks as a REAL ledger table
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
    <section className="card rs-fgroup">
      <FactorHead name={name} share={share} meaning={meaning} />
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
            <b>The move</b> — {f.suggestion.move}
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
      First resume? <a href="/prep/guide">Format guide</a>,{" "}
      <a href="https://careerservices.fas.harvard.edu/resources/bullet-point-resume-template/" target="_blank" rel="noreferrer">
        Harvard template <ArrowUpRight size={12} aria-hidden="true" />
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
      <section className="panel-sec rs-readout card">
        <div className="rs-readout-top">
          <div>
            <span className="label num">Resume checker, {fmtDT(run.at)}</span>
            <div className="rs-readout-sub">
              {run.fileName}, {run.kind === "pdf" ? "PDF" : "Word"}, target <b>{run.careerName}</b>
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
        <p className="rs-air-note num">
          <b className="num">
            parse {Math.round(RESUME_AIR_WEIGHTS.parse * 100)}% + format {Math.round(RESUME_AIR_WEIGHTS.format * 100)}% + evidence {Math.round(RESUME_AIR_WEIGHTS.keywords * 100)}%
          </b>{" "}
          , your latest run counts
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
          shareOverride={g.name === "Parse" ? run.parseability.score : undefined}
        />
      ))}

      <section className="card">
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
      </section>

      {/* R7/R8: the re-run affordance gets its own full-width card; the quiet
          links line is centred beneath the zone */}
      <section className="card prep-rerun">
        {children}
        {links}
      </section>
    </>
  );
}

/* ── the cover-letter checker — same card anatomy (R11: the letter's
   Evidence + Structure checks are surfaced as their own cards; the old
   e2e-guarded "The checks" fold is gone) ────────────────────────────────── */

const LETTER_KINDS: Record<string, string> = { txt: "TXT", pdf: "PDF", docx: "Word" };

function LetterResult({ run, staleFor, children }: {
  run: NonNullable<LetterRunSummary["run"]>;
  staleFor: string | null;
  children: ReactNode;
}) {
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
      <section className="panel-sec cl-readout card">
        <div className="cl-readout-top">
          <div>
            <span className="label num">Cover-letter checker, {fmtDT(run.at)}</span>
            <div className="cl-readout-sub">
              {run.fileName}, {LETTER_KINDS[run.kind] ?? run.kind.toUpperCase()},{run.employerDeclared ? ` employer anchor ${run.employerName}` : " no employer declared"}, target <b>{run.careerName}</b>
            </div>
          </div>
          {/* cl-readout-score: the letter side of the same e2e contract */}
          <div className="rs-verdict cl-readout-score num">
            <span className="score-big">{run.air.airLetter}</span>
            <span className="c-of">/100</span>
          </div>
        </div>
        {staleFor ? <StaleBanner oldCareer={staleFor} kind="check" /> : null}
        <p className="cl-air-note num">
          <b className="num">
            parse {Math.round(LETTER_AIR_WEIGHTS.parse * 100)}% + evidence {Math.round(LETTER_AIR_WEIGHTS.keywords * 100)}% + structure {Math.round(LETTER_AIR_WEIGHTS.structural * 100)}%
          </b>{" "}
          , your latest check counts
        </p>
      </section>

      {/* the letter's Parse gate has no check table of its own — a small card
          carries its score, bar and meaning so every factor reads the same */}
      <section className="card rs-fgroup rs-fgroup-plain">
        <FactorHead
          name="Parse"
          share={Math.round(run.air.parsePass * 100)}
          meaning="text readable as-is"
        />
      </section>

      <FactorGroup
        name="Evidence"
        meaning={`core skills of ${run.careerName} found in the letter, and the role anchor is always the declared Target Role`}
        checks={evidence}
        missLabel="Not found"
      />
      <FactorGroup name="Structure" meaning="the four structural checks" checks={structure} missLabel="Missing" />

      <section className="card">
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
                      <b>The move</b> — {f.suggestion.move}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </details>
      </section>

      {/* R7/R9: the employer anchor rides ABOVE the zone in the re-run card
          (supersedes the 2026-11-02 "below the zone" ruling) */}
      <section className="card prep-rerun">{children}</section>
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
     results-first with the re-run card at the bottom. */
  const resumeFirstRun = (
    <section className="card prep-intake">
      <ResumeUpload />
      <ResumeLinks />
    </section>
  );

  const letterFirstRun = (
    <section className="card prep-intake">
      <LetterUpload showEmployer={Boolean(latestLetter)} />
    </section>
  );

  /* the band's AR receipts — the same engine receipts the page already
     reads (score.arParts from getStudentView); a null score (no target
     role) renders the honest "—" in the band, never a painted zero */
  const unmeasured = (max: number): PartView => ({ measured: false, earned: 0, max });
  const parts = score?.arParts ?? {
    resume: unmeasured(AR_FACTORS.resume),
    letter: unmeasured(AR_FACTORS.letter),
    presence: unmeasured(AR_FACTORS.presence),
  };

  /* channel-card notes (R4) — receipts, not verdicts. A channel that does
     not COUNT for the current target never borrows its old run's receipts:
     it says so, and points at the re-run. */
  const tally = (checks: { ok: boolean }[]) =>
    `${checks.filter((c) => c.ok).length}/${checks.length}`;
  const resumeNote = parts.resume.measured && latestResume
    ? `parse ${tally(latestResume.run.parseability.checks)}, format ${tally(latestResume.run.format.checks)}, evidence ${tally(latestResume.run.keywords.checks)}`
    : latestResume
      ? "re-run for this target to count"
      : "resume checker still open";
  const letterEvaluated = latestLetter?.run.checks.filter((c) => c.ok !== null) ?? [];
  const letterNote = parts.letter.measured && latestLetter
    ? `evidence ${latestLetter.run.keywords.filter((k) => k.ok).length}/${latestLetter.run.keywords.length}, structure ${letterEvaluated.filter((c) => c.ok).length}/${letterEvaluated.length}`
    : latestLetter
      ? "re-check for this target to count"
      : "cover-letter checker still open";
  const presenceNote = !parts.presence.measured
    ? "declare credentials in Profile"
    : parts.presence.earned === parts.presence.max
      ? "all three presence checks passed"
      : `${parts.presence.earned} of ${parts.presence.max} declared`;

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

  /* the band ring figure — earned AR points (null when nothing measured;
     "—" is the honest unmeasured figure) */
  const readinessAr = score?.ar ?? null;
  /* the ring's arc: null/0 readiness renders NO arc at all — a zero-length
     dash reads as a round-cap dot with the register's linecap; never a
     painted zero (2026-11-04 review finding) */
  const readinessFr = readinessAr && readinessAr > 0 ? readinessAr / WEIGHTS.ar : 0;

  return (
    <div className="v7prep prep-surface">
      {/* named band — the white dashboard register. The readiness ring that
          My Plan rides carries application readiness here. */}
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
          {/* F1 (2026-11-04): the band's visual — the readiness ring, My
              Plan's plan-ring register. Same figure the composite read:
              ar / WEIGHTS.ar; no career or nothing measured (ar null) still
              paints "—" and NO arc — never a faked fraction. The label lives
              BELOW the ring in the .ratemsg register (user feedback
              2026-11-04: the inner small hugged the ring's edges); the whole
              slot is one AT unit (role="img" here, inner ring presentation). */}
          <div
            className="readring-slot"
            role="img"
            aria-label={
              readinessAr !== null
                ? `${readinessAr} of ${WEIGHTS.ar} application-readiness points`
                : "Application readiness — not yet measured"
            }
          >
            <div className="readring" aria-hidden="true">
              <svg viewBox="0 0 130 130" aria-hidden="true">
                <circle className="readring-track" cx="65" cy="65" r="56" strokeWidth="9" />
                {readinessFr > 0 && (
                  <circle
                    className="readring-arc"
                    cx="65"
                    cy="65"
                    r="56"
                    strokeWidth="9"
                    strokeDasharray={`${Math.round(readinessFr * 3519) / 10} 351.9`}
                  />
                )}
              </svg>
              <span className="readring-mid">
                <b className="num">{readinessAr !== null ? `${readinessAr}/${WEIGHTS.ar}` : "—"}</b>
              </span>
            </div>
            <div className="ratemsg">application readiness</div>
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
              Browse the career index{" "}
            <span className="arrow num">
              <ArrowRight size={14} aria-hidden="true" />
            </span>
            </a>
          </p>
        </section>
      ) : (
        <>
          {/* one card per channel (R3) — the Dashboard KPI grid */}
          <section className="prep-kpis" aria-label="Prep channels">
            <ChannelCard
              name="Resume"
              part={parts.resume}
              notRun="NOT YET RUN"
              note={resumeNote}
              tone="blue"
              door={{ label: "Format guide", href: "/prep/guide" }}
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                  <path d="M9 13h6M9 17h4" />
                </svg>
              }
            />
            <ChannelCard
              name="Letter"
              part={parts.letter}
              notRun="NOT YET CHECKED"
              note={letterNote}
              tone="green"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
              }
            />
            <ChannelCard
              name="Presence"
              part={parts.presence}
              notRun="NOT DECLARED"
              note={presenceNote}
              tone="amber"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4.2 3.6-6.5 8-6.5s8 2.3 8 6.5" />
                </svg>
              }
            />
          </section>

          <PrepTabs panels={{ resume: resumePanel, letter: letterPanel }} />
        </>
      )}
    </div>
  );
}
