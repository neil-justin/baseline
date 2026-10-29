import type { CSSProperties, ReactNode } from "react";
import { getStudentView } from "@/lib/db";
import { requireStudent } from "@/lib/session";
import { scoreView } from "@/lib/engines/rubric";
import { getResourcesForCareer } from "@/lib/fixtures/resources";
import { resumeRunStore } from "@/lib/db/resume-run-store";
import { scoreTrajectory } from "../profile/trajectory";
import Disclosure from "@/components/Disclosure";
import ScoreSequence from "./ScoreSequence";
import "./dashboard.css";

export const dynamic = "force-dynamic";

/* ── drawn glyphs (authored SVG only — no unicode-glyph icons) ──────────── */

function SourceArrow() {
  return (
    <span className="arrow">
      <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        width="0.8em"
        height="0.8em"
      >
        <path d="M16 5v5a3 3 0 0 1-3 3H5" />
        <path d="M9 9l-4 4 4 4" />
      </svg>
    </span>
  );
}

/** Verified movement chip — green only (green speaks "verified/done" here). */
function DeltaChip({ delta }: { delta: number }) {
  return (
    <span className="delta-chip num">
      <svg
        viewBox="0 0 12 12"
        width={11}
        height={11}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 10.2V1.8M2.4 5.4 6 1.8l3.6 3.6" />
      </svg>
      +{delta} since setup
    </span>
  );
}

function OkCheck() {
  return (
    <svg
      className="g-ok"
      viewBox="0 0 14 14"
      width={13}
      height={13}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 7.4l2.8 2.8L11 4.6" />
    </svg>
  );
}

function OpenRing() {
  return (
    <svg
      className="g-ring"
      viewBox="0 0 14 14"
      width={13}
      height={13}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      aria-hidden="true"
    >
      <circle cx="7" cy="7" r="5.4" strokeDasharray="2.3 2.5" />
    </svg>
  );
}

/* ── channel track — data drawn as data: earned fraction at the locked      */
/* weight, blue where measured-partial, green only at verified-complete.     */

function Track({
  frac,
  done,
  label,
  tick,
}: {
  frac: number;
  done?: boolean;
  label: string;
  tick?: number;
}) {
  return (
    <span className={`chan-track${done ? " is-done" : ""}`} role="img" aria-label={label}>
      <i
        className="chan-fill"
        style={{ "--earn": String(Math.max(0, Math.min(1, frac))) } as CSSProperties}
      />
      {typeof tick === "number" && tick > 0 && tick < 1 && (
        <i
          className="chan-tick"
          aria-hidden="true"
          style={{ "--tickp": String(Math.max(0, Math.min(1, tick))) } as CSSProperties}
        />
      )}
    </span>
  );
}

function sourceBadge(source: string): { text: string; ok: boolean } {
  if (source === "verified") return { text: "verified quiz", ok: true };
  if (source === "checked") return { text: "checked resource", ok: true };
  return { text: "self-report", ok: false };
}

/* ── zero-state (no career yet) — copy preserved verbatim ───────────────── */

function UndecidedDefault() {
  return (
    <>
      <section className="app-section">
        <div className="field-in">
          <div className="screen-head">
            <h1>Dashboard</h1>
          </div>
        </div>
      </section>
      <section className="scoreband navy-band navy-band-undecided" aria-label="Your readiness score">
        <div className="band-in-undecided">
          <div className="score-left">
            <span className="label">Readiness</span>
            <div className="score-readout num">
              <span className="score-big-num">
                <span className="score-big">0</span>
                <span className="score-of">of 100</span>
              </span>
              <span className="start-line">Your starting line.</span>
            </div>
            <p className="score-line">
              No career picked yet — the skill and training parts of your score hold at zero until it can measure
              toward something.
            </p>
          </div>
          <div className="score-right">
            <div className="seg-head">
              <span className="label">Breakdown</span>
              <span className="label num">40 / 25 / 20 / 15</span>
            </div>
            <p className="score-line">
              Pick a career to open your pathway:{" "}
              <a className="link-sub" href="/career">
                browse the career index →
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

/** M1 Dashboard — the college score home, user-pinned Navy Shell splice
 * (navy mass × data-ink merit tracks). Every number is computed from the
 * store; the walk's e2e hooks (.score-big, .sub-row ×4, .journey-row,
 * `.segbar .seg i`) and every asserted line survive verbatim. */
export default async function DashboardPage() {
  const profile = await requireStudent();
  const { state, career, score } = await getStudentView(profile.studentId);
  if (!career || !score) return <UndecidedDefault />;

  const v = scoreView(career, state);
  const topResource = getResourcesForCareer(career.id)[0];
  /* verified-only count — the footer's "confirmed" and the SP track's target tick */
  const verifiedCount = Object.values(state.bars).filter((b) => b.source === "verified").length;
  const activeGoal = v.goalActive;
  const completedGoal = v.goalCompleted;
  const bodyCareer = activeGoal ?? completedGoal;

  // Delta chip — same lineage rules the Plan timeline uses: it appears only
  // when two real readings exist. Never painted from nothing.
  let traj: ReturnType<typeof scoreTrajectory> | null = null;
  try {
    traj = scoreTrajectory(state);
  } catch {
    traj = null; // honest absence: no chip
  }

  // AIR — Application readiness. Deliberately outside today's score
  // (lib/engines/score.ts carries the integration point); the row reads the
  // store's best-run semantics and renders honest absence with no run.
  let bestAir: number | null = null;
  try {
    const airRun = await resumeRunStore.latest(profile.studentId);
    bestAir = airRun ? airRun.bestAir : null;
  } catch {
    bestAir = null; // store unreachable → unmeasured, never an error page
  }

  // Receipts: a closed bar's source is its receipt — verified/checked bars
  // carry them, claimed bars do not. Receipts first, self-reports last.
  const barEntries = Object.entries(state.bars);
  const sourceRank = { verified: 0, checked: 1, claimed: 2 } as const;
  const closedSorted = [...barEntries].sort((a, b) => sourceRank[a[1].source] - sourceRank[b[1].source]);
  const receipts = closedSorted.filter(([, b]) => b.source !== "claimed");
  const selfCount = closedSorted.length - receipts.length;

  // Setup self-ratings (the framing prompt is unscored — grey data; green
  // stays verified-only on this page).
  const softRatings = Object.entries(state.softSkills);

  const ccTicks =
    (v.cc >= 5 ? 1 : 0) + (bodyCareer ? 1 : 0) + (completedGoal ? 1 : 0);

  return (
    <div className="dash">
      {/* first-paint fonts for this surface's display voice (no FOUT on the readout) */}
      <link rel="preload" href="/fonts/inter-var-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      <link
        rel="preload"
        href="/fonts/ibm-plex-mono-latin-500.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />

      {/* ── the navy mass: headline 40 of 100 + delta chip + one CTA ── */}
      <section className="scoreband navy-band" aria-label="Your readiness score">
        <div className="band-in" data-sequence>
          <ScoreSequence
            score={score.total}
            parts={v.parts}
            line={
              <>
                You&apos;re <b className="num">{score.total}%</b> ready for {career.name}; {v.closed} bars already
                counted.
              </>
            }
            actions={
              <>
                {traj?.delta != null && traj.delta > 0 && <DeltaChip delta={traj.delta} />}
                <h2 className="next-head">Your next step</h2>
                {topResource && (
                  <p className="n-why">
                    {topResource.skillsAddressed[0]} is the top skill for {career.name}, and this course feeds your
                    first goal. Free to start.
                  </p>
                )}
                <div className="n-cta">
                  <a className="btn dash-cta" href="/pathway">
                    Start this step <SourceArrow />
                  </a>
                  {topResource && (
                    <p className="n-target num">
                      free course · ~{topResource.durationHours} hours · {topResource.provider} — {topResource.title}
                    </p>
                  )}
                </div>
              </>
            }
          />
          <div className="journey-row num">
            Where you are: <b>First 30 days</b>, {v.stageOne.done} of 3 done.
          </div>
        </div>
      </section>

      {/* ── the five answers as full-width merit rows (data, not tiles) ── */}
      <section className="answers" aria-labelledby="five-answers-h">
        <div className="field-in">
          <h2 id="five-answers-h">The five answers</h2>
          <p className="answers-lead">
            Computed from your own records — four channels measured today, the fifth starts after your first resume
            diagnostic.
          </p>
        </div>
        <div className="sheet">
          <div className="field-in">
            {/* Skill — 40 */}
            <div className="sub-row chan">
              <div className="chan-line">
                <span className="chan-name">Skill progress</span>
                <span className="chan-state">
                  {receipts.length > 0 ? (
                    <>
                      <OkCheck /> {v.closed} of {v.mapSize} bars closed
                    </>
                  ) : closedSorted.length > 0 ? (
                    <>
                      <OpenRing /> {closedSorted.length} of {v.mapSize} bars self-reported
                    </>
                  ) : (
                    <>
                      <OpenRing /> {v.closed} of {v.mapSize} bars closed
                    </>
                  )}
                </span>
                <Track
                  frac={score.sp / 40}
                  done={v.closed >= career.skills.length}
                  tick={
                    career.skills.length > 0
                      ? Object.values(state.bars).filter((b) => b.source === "verified").length /
                        career.skills.length
                      : 0
                  }
                  label={`Skill progress: ${score.sp} of 40`}
                />
                <span className="chan-frac num">
                  <b>{score.sp}</b> <span className="den">of 40</span>
                </span>
              </div>
              <p className="chan-note">
                You hold <b className="num">{score.sp} of 40</b>; bars close from your claims and your checks, and each
                bar shows which.
              </p>
              {closedSorted.length > 0 && (
                <div className="chan-receipts">
                  <p className="r-head num">
                    <b>{receipts.length}</b> of <b>{v.closed}</b> closed bars carry receipts · {selfCount}{" "}
                    self-reported
                  </p>
                  <ul className="r-list">
                    {closedSorted.map(([name, b]) => {
                      const badge = sourceBadge(b.source);
                      return (
                        <li key={name}>
                          <span className={`r-glyph${badge.ok ? " ok" : ""}`}>
                            {badge.ok ? <OkCheck /> : <OpenRing />}
                          </span>
                          <span className="r-name">{name}</span>
                          <span className="r-src num">{badge.text}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            {/* People skills — 25 · the situations battery is post-setup: grey, never error */}
            <div className="sub-row chan">
              <div className="chan-line">
                <span className="chan-name">People skills</span>
                <span className="chan-state">
                  <OpenRing /> not yet measured
                </span>
                <Track frac={score.es / 25} label={`People skills: ${score.es} of 25 — the situations battery comes after setup`} />
                <span className="chan-frac num">
                  <b>{score.es}</b> <span className="den">of 25</span>
                </span>
              </div>
              <p className="chan-note">
                You hold <b className="num">{score.es} of 25</b>; the full situations battery comes after setup.
              </p>
              {softRatings.length > 0 && (
                <div className="chan-receipts">
                  <p className="r-head">
                    Setup self-ratings —{" "}
                    {softRatings.map(([k, val], i) => (
                      <span key={k} className="r-rated">
                        {i > 0 && ", "}
                        {k} {val}
                      </span>
                    ))}
                    . The battery sets the rest of the channel.
                  </p>
                </div>
              )}
            </div>

            {/* Training — 20 · the locked First-30-days basis */}
            <div className="sub-row chan">
              <div className="chan-line">
                <span className="chan-name">Training progress</span>
                <span className="chan-state">
                  {v.stageOne.done >= 3 ? (
                    <>
                      <OkCheck /> First 30 days complete
                    </>
                  ) : (
                    <>
                      <OpenRing /> First 30 days: {v.stageOne.done} of 3 done
                    </>
                  )}
                </span>
                <Track frac={score.tp / 20} done={v.stageOne.done >= 3} label={`Training progress: ${score.tp} of 20`} />
                <span className="chan-frac num">
                  <b>{score.tp}</b> <span className="den">of 20</span>
                </span>
              </div>
              <p className="chan-note">
                You hold <b className="num">{score.tp} of 20</b>;{" "}
                {v.stageOne.done === 0 ? "your pathway just started." : `First 30 days: ${v.stageOne.done} of 3 done.`}
              </p>
            </div>

            {/* Career clarity — 15 */}
            <div className="sub-row chan">
              <div className="chan-line">
                <span className="chan-name">Career clarity</span>
                <span className="chan-state">
                  {ccTicks >= 3 ? (
                    <>
                      <OkCheck /> all three ticks done
                    </>
                  ) : (v.cc >= 5 || bodyCareer) ? (
                    <>
                      <OkCheck /> {ccTicks} of 3 ticks done
                    </>
                  ) : (
                    <>
                      <OpenRing /> {ccTicks} of 3 ticks done
                    </>
                  )}
                </span>
                <Track frac={score.cc / 15} done={score.cc >= 15} label={`Career clarity: ${score.cc} of 15`} />
                <span className="chan-frac num">
                  <b>{score.cc}</b> <span className="den">of 15</span>
                </span>
              </div>
              <p className="chan-note">
                You hold <b className="num">{score.cc} of 15</b> — Career picked{" "}
                <span className={`ok-mark${v.cc >= 5 ? " is-ok" : ""}`}>{v.cc >= 5 ? <OkCheck /> : <OpenRing />}</span> ·
                Goal set{" "}
                <span className={`ok-mark${bodyCareer ? " is-ok" : ""}`}>{bodyCareer ? <OkCheck /> : <OpenRing />}</span> ·
                First goal finished: {completedGoal ? "yes" : "not yet"}.
              </p>
            </div>

            {/* The fifth answer — Application readiness. Outside today's 100
                (lib/engines/score.ts carries the AIR integration point): grey
                absence with no run, the best-run read once one lands. NOT a
                .sub-row: it does not hold score points yet. */}
            <div className="chan chan-ar">
              <div className="chan-line">
                <span className="chan-name">Application readiness</span>
                <span className="chan-state">
                  <OpenRing /> {bestAir === null ? "not yet measured" : "measured · best run counts"}
                </span>
                {bestAir === null ? (
                  <span
                    className="chan-track chan-track-open"
                    role="img"
                    aria-label="Application readiness: not yet measured"
                  />
                ) : (
                  <Track frac={bestAir / 100} label={`Application readiness: best run AIR ${bestAir} of 100`} />
                )}
                <span className="chan-frac num">
                  {bestAir === null ? (
                    <span className="den">—</span>
                  ) : (
                    <>
                      <b>{bestAir}</b> <span className="den">of 100</span>
                    </>
                  )}
                </span>
              </div>
              <p className="chan-note">
                {bestAir === null
                  ? "Run your first resume diagnostic in Prep — nothing is broken and nothing is logged yet; honest grey until one run lands (best run counts)."
                  : `Best run so far: AIR ${bestAir} of 100. Re-run any time from Prep — the best run counts.`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── footer furniture: the honest links (spacing + rules, no cards) ── */}
      <footer className="dash-foot">
        <div className="field-in">
          <div className="rail">
            <a className="tickline num" href="/progress">
              <b>
                {v.closed} of {v.mapSize}
              </b>{" "}
              {career.name} skills on your baseline — <b>{verifiedCount}</b> confirmed{" "}
              <span className="ok-mark is-ok ok-mark-flow">
                <OkCheck />
              </span>{" "}
              · First 30 days: <b>{v.stageOne.done} of 3</b> done
            </a>
            <a className="tickline num" href="/progress">
              Goal: <b>{activeGoal ? activeGoal.title : "none yet"}</b> —{" "}
              {activeGoal ? "in progress." : "Careers suggests one."}
            </a>
            <Disclosure toggle={`Not sure ${career.name} is it? You can switch anytime.`}>
              <p>
                Switching resets the parts of your score that measure progress toward a specific career; skill
                progress and training progress start over. Skills you&apos;ve already proven stay on your profile.
              </p>
              <p className="switch-go">
                <a className="link-sub" href="/career">
                  Browse the career index →
                </a>
              </p>
            </Disclosure>
          </div>
        </div>
      </footer>
    </div>
  );
}
