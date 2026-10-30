import { getStudentView } from "@/lib/db";
import { requireStudent } from "@/lib/session";
import { scoreView } from "@/lib/engines/rubric";
import { planHead, planFor } from "@/lib/engines/plan";
import {
  WEIGHTS,
  CC_TICKS,
  ASSESSED_COMPETENCIES,
  roundHalfDown,
} from "@/lib/engines/score";
import ScoreSequence from "./ScoreSequence";
import "./dashboard.css";

export const dynamic = "force-dynamic";

function UndecidedDefault() {
  return (
    <div className="v7dash">
      <section className="scoreband" aria-label="Your readiness score">
        <div className="band-in">
          <div className="score-left">
            <span className="label">Readiness</span>
            <div className="score-readout num">
              <span className="score-big">0</span>
              <small>of 100</small>
            </div>
            <p className="score-line">
              No career picked yet — the skill and training parts of your score hold at zero until it can measure
              toward something.
            </p>
          </div>
          <div className="score-right">
            <div className="seg-head">
              <span className="label">Breakdown</span>
              <span className="label num">{Object.values(WEIGHTS).join(" / ")}</span>
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
    </div>
  );
}

/** M1 Dashboard — the score home. DNA v7 (LOCKED 2026-10-29): header band
 *  (who · composite 40/100 · segmented five-channel bar · the one CTA), the
 *  five channel cells, the dense ranked plan table + the projection queue,
 *  then the competency ledger. Every number is computed (scoreView + the
 *  locked engine constants); no painted readiness anywhere. */
export default async function DashboardPage() {
  const profile = await requireStudent();
  const { state, career, score, ar } = await getStudentView(profile.studentId);
  if (!career || !score) return <UndecidedDefault />;

  const v = scoreView(career, state, ar);
  // My Plan round Q4b: the plan's head item IS the commitment; while AR is
  // unmeasured the head is the diagnostic that opens the channel.
  const head = planHead(career, state, ar);
  const plan = planFor(career, state, ar);

  // bar provenance (real data): verified ·✓ vs claimed vs open on the map
  const barValues = Object.values(state.bars);
  const verifiedBars = barValues.filter((b) => b.source === "verified").length;
  const claimedBars = barValues.length - verifiedBars;
  const mapSize = v.mapSize;

  // SP projection when one more bar closes (locked half-down convention)
  const spAfterNext = roundHalfDown((WEIGHTS.sp * (v.closed + 1)) / mapSize);
  const spDelta = Math.max(0, spAfterNext - score.sp);

  const claimedCompetencies = Object.values(state.competencies ?? {}).filter(
    (s) => s !== "verified"
  ).length;

  /* ---------- five channel cells (SP · ES · TP · AR · CC) ---------- */
  const pct = (n: number, d: number) => `${((n / d) * 100).toFixed(3)}%`;

  return (
    <div className="v7dash">
      {/* ── header band: who · composite · five-channel bar · the one CTA ── */}
      <section className="scoreband" aria-label="Your readiness score">
        <div className="band">
          <div className="who">
            <h1 className="t">
              {/* persona line: "Neil · 4th Year" — the state's yearLevel IS the
                  print (the G-regex gradeLabel helper died with the SHS scope) */}
              {state.name} · {state.yearLevel}
            </h1>
            <div className="m">{career.name}</div>
          </div>
          <ScoreSequence
            score={score.total}
            parts={v.parts}
            labels={[
              /* v7.1 key-prop fix: string labels — keyless fragment ARRAYS crossing
                 the server→client boundary are the "unique key prop" warning source */
              `SP ${score.sp}/${WEIGHTS.sp}`,
              `ES ${score.es}/${WEIGHTS.es}`,
              `TP ${score.tp}/${WEIGHTS.tp}`,
              v.arMeasured ? `AR ${score.ar}/${WEIGHTS.ar}` : "AR —",
              `CC ${score.cc}/${WEIGHTS.cc}`,
            ]}
            suffix={
              v.ccFirstDone || v.arMeasured || v.stageOne.done > 0
                ? ""
                : " · your starting line"
            }
            ratemsg="Computed from your own records · NACE-aligned"
            fine={
              <>
                You&apos;re <b className="num">{score.total}%</b> ready for {career.name}; {v.closed} bars already
                counted.
              </>
            }
          />
          {head && (
            <a
              className="cta"
              href={head.kind === "ar" ? head.href : "/pathway"}
            >
              Your next step →
            </a>
          )}
        </div>
      </section>

      {/* ── five channel KPI cells (the Classroom grid) ── */}
      <section className="kpis" aria-label="The five channels">
        <div className="kpi">
          <div className="sub-row">
            <span className="s-name">Skill progress</span>
            <p className="s-note">
              You hold <b className="num">{score.sp} of {WEIGHTS.sp}</b>; bars close from your claims and your checks,
              and each bar shows which. {v.closed} of {mapSize} bars closed · {verifiedBars} verified{" "}
              <span className="vbadge ok">
                ·✓
              </span>
              .
            </p>
          </div>
          <div className="score num">
            {score.sp} <small>/{WEIGHTS.sp}</small>
          </div>
          <div
            className="kbar"
            role="img"
            aria-label={`Skill progress ${score.sp} of ${WEIGHTS.sp} — ${verifiedBars} verified, ${claimedBars} self-report`}
          >
            <i className="solid" style={{ width: pct(verifiedBars, mapSize) }} />
            <i
              className="hatch"
              style={{ left: pct(verifiedBars, mapSize), width: pct(claimedBars, mapSize) }}
            />
          </div>
          <span className={`chip ${score.sp >= WEIGHTS.sp ? "c-green" : "c-blue"}`}>
            {score.sp >= WEIGHTS.sp ? "Complete" : "In progress"}
          </span>
        </div>

        <div className="kpi">
          <div className="sub-row">
            <span className="s-name">Employability skills</span>
            <p className="s-note">
              You hold <b className="num">{score.es} of {WEIGHTS.es}</b> —{" "}
              {v.esVerified} of 7 NACE competencies verified{" "}
              <span className="vbadge ok">·✓</span>.
            </p>
          </div>
          <div className="score num">
            {score.es} <small>/{WEIGHTS.es}</small>
          </div>
          <div
            className="kbar"
            role="img"
            aria-label={`Employability skills ${score.es} of ${WEIGHTS.es} — ${v.esVerified} of 7 verified`}
          >
            <i className="solid green" style={{ width: pct(score.es, WEIGHTS.es) }} />
          </div>
          <span className="chip c-green">{v.esVerified} verified</span>
        </div>

        <div className="kpi">
          <div className="sub-row">
            <span className="s-name">Training progress</span>
            <p className="s-note">
              You hold <b className="num">{score.tp} of {WEIGHTS.tp}</b>;{" "}
              {v.stageOne.done === 0
                ? "your pathway just started."
                : `First 30 days: ${v.stageOne.done} of 3 done.`}
            </p>
          </div>
          <div className="score num">
            {score.tp} <small>/{WEIGHTS.tp}</small>
          </div>
          <div
            className="kbar"
            role="img"
            aria-label={`Training progress ${score.tp} of ${WEIGHTS.tp}`}
          >
            <i className="solid" style={{ width: pct(score.tp, WEIGHTS.tp) }} />
          </div>
          <span
            className={`chip ${
              score.tp >= WEIGHTS.tp ? "c-green" : v.stageOne.done > 0 ? "c-blue" : "c-amber"
            }`}
          >
            {score.tp >= WEIGHTS.tp ? "Complete" : v.stageOne.done > 0 ? "In progress" : "Pending evidence"}
          </span>
        </div>

        <div className="kpi kpi-ar">
          <div className="sub-row">
            <span className="s-name">Application readiness</span>
            {v.arMeasured ? (
              <p className="s-note">
                You hold <b className="num">{score.ar} of {WEIGHTS.ar}</b>; the three factors score on their
                own runs — resume{" "}
                {v.arFactors.resume.earned}/{v.arFactors.resume.max} · letter{" "}
                {v.arFactors.letter.measured ? `${v.arFactors.letter.earned}/${v.arFactors.letter.max}` : "not run"} · presence{" "}
                {v.arFactors.presence.measured ? `${v.arFactors.presence.earned}/${v.arFactors.presence.max}` : "not declared"}.
              </p>
            ) : (
              <p className="s-note not-yet">
                Not yet measured — the resume diagnostic in Prep opens this channel (resume 7 · letter 5 ·
                presence 3).
              </p>
            )}
          </div>
          <div className="score num">
            {v.arMeasured ? score.ar : "—"} <small>/{WEIGHTS.ar}</small>
          </div>
          <div
            className="kbar"
            role="img"
            aria-label={
              v.arMeasured
                ? `Application readiness ${score.ar} of ${WEIGHTS.ar}`
                : "Application readiness — not yet measured"
            }
          >
            <i
              className="solid"
              style={{ width: v.arMeasured && score.ar !== null ? pct(score.ar, WEIGHTS.ar) : "0" }}
            />
          </div>
          <span
            className={`chip ${
              !v.arMeasured ? "c-grey" : score.ar === WEIGHTS.ar ? "c-green" : "c-blue"
            }`}
          >
            {!v.arMeasured ? "Not yet measured" : score.ar === WEIGHTS.ar ? "Complete" : "In progress"}
          </span>
        </div>

        <div className="kpi">
          <div className="sub-row">
            <span className="s-name">Career clarity</span>
            <p className="s-note">
              You hold <b className="num">{score.cc} of {WEIGHTS.cc}</b> — Career picked{" "}
              <span className="vbadge ok">{v.ccPicked ? "✓" : "—"}</span> · Plan started{" "}
              <span className="vbadge ok">{v.ccStarted ? "✓" : "—"}</span> · First item done:{" "}
              {v.ccFirstDone ? "yes" : "not yet"}.
            </p>
          </div>
          <div className="score num">
            {score.cc} <small>/{WEIGHTS.cc}</small>
          </div>
          <div
            className="kbar"
            role="img"
            aria-label={`Career clarity ${score.cc} of ${WEIGHTS.cc}`}
          >
            <i className="solid" style={{ width: pct(score.cc, WEIGHTS.cc) }} />
          </div>
          <span className={`chip ${score.cc >= WEIGHTS.cc ? "c-green" : "c-blue"}`}>
            {score.cc >= WEIGHTS.cc ? "Complete" : "In progress"}
          </span>
        </div>
      </section>

      {/* ── dense lower deck: ranked plan table + what moves the number ── */}
      <section className="low">
        <div className="card">
          <div className="head">
            <b>My Plan — next items</b>
            <span>ranked · first item is your next step</span>
          </div>
          <table className="plan-table">
            <thead>
              <tr>
                <th className="col-item">Item</th>
                <th>Channel</th>
                <th>State</th>
                <th>Effect</th>
              </tr>
            </thead>
            <tbody>
              {plan.map((item, i) => {
                if (item.kind === "ar") {
                  const measured = [item.checklist.resume, item.checklist.letter, item.checklist.presence].filter(Boolean).length;
                  const tick = (b: boolean) => (b ? "·✓" : "open");
                  const arOutstanding = WEIGHTS.ar - (score.ar ?? 0);
                  return (
                    <tr key="ar">
                      <td>
                        <div className="item">{item.title}</div>
                        <div className="sub">
                          {item.reason} — resume {tick(item.checklist.resume)} · letter {tick(item.checklist.letter)} · presence {tick(item.checklist.presence)}
                        </div>
                      </td>
                      <td>
                        <span className="chip c-grey">Application</span>
                      </td>
                      <td>
                        <span className={`chip ${measured > 0 ? "c-blue" : "c-grey"}`}>
                          {measured > 0 ? `${measured} of 3 measured` : "Not started"}
                        </span>
                      </td>
                      <td className="eff num">opens AR · up to +{arOutstanding}</td>
                    </tr>
                  );
                }
                // skill step — projected SP re-fraction if this bar closes
                // (each queued row assumes the ones above it closed first)
                const priorSkillCount = plan
                  .slice(0, i)
                  .filter((p) => p.kind === "skill").length;
                return (
                  <tr key={item.skill}>
                    <td>
                      <div className="item">Close {item.skill}</div>
                      <div className="sub">
                        {item.reason}
                        {item.hasFreeResource ? " · comprehension check on its guide" : ""}
                      </div>
                    </td>
                    <td>
                      <span className="chip c-blue">Skill progress</span>
                    </td>
                    <td>
                      <span className={`chip ${item.hasFreeResource ? "c-green" : "c-blue"}`}>
                        {item.hasFreeResource ? "Ready" : "Next"}
                      </span>
                    </td>
                    <td className="eff num">
                      SP{" "}
                      {roundHalfDown((WEIGHTS.sp * (v.closed + priorSkillCount)) / mapSize)} →{" "}
                      {roundHalfDown((WEIGHTS.sp * (v.closed + priorSkillCount + 1)) / mapSize)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="foot">
            Every fill is an earned fraction of its channel — no painted readiness.{" "}
            {plan.length > 3 && (
              <>
                The full ranked list lives in{" "}
                <a className="foot-link" href="/pathway">
                  My Plan
                </a>
                .{" "}
              </>
            )}
            Effects are computed projections for this state (lib/engines/score.ts).
          </div>
        </div>

        <div className="card actions">
          <div className="head">
            <b>What moves the number</b>
          </div>
          {!v.arMeasured && (
            <div className="row">
              <div>
                <b>Run the resume diagnostic</b>
                <div className="sub">first AR factor · opens the channel</div>
              </div>
              <span className="badge num">up to +{WEIGHTS.ar}</span>
            </div>
          )}
          {v.arMeasured && !v.arComplete && (
            <div className="row">
              <div>
                <b>Finish your application materials</b>
                <div className="sub">
                  {[!v.arFactors.letter.measured && "cover-letter check", !v.arFactors.presence.measured && "presence declaration"]
                    .filter(Boolean)
                    .join(" · ")}{" "}
                  still open
                </div>
              </div>
              <span className="badge num">up to +{WEIGHTS.ar - (score.ar ?? 0)}</span>
            </div>
          )}
          {plan.some((p) => p.kind === "skill") && (
            <div className="row">
              <div>
                <b>Close a First-30-days bar</b>
                <div className="sub">check pass closes the bar · SP re-fractions</div>
              </div>
              <span className="badge num">+{spDelta}</span>
            </div>
          )}
          {!v.ccFirstDone && (
            <div className="row">
              <div>
                <b>Finish the first plan item</b>
                <div className="sub">the CC first-item tick</div>
              </div>
              <span className="badge num">+{CC_TICKS.firstDone}</span>
            </div>
          )}
          <div className="journey-row num">
            Where you are: <b>First 30 days</b>, {v.stageOne.done} of 3 done.
          </div>
          <div className="foot">
            For the counselor, this same screen reads as cohort readiness — same numbers, more sections.
          </div>
        </div>
      </section>

      {/* ── competency ledger (the ES channel's receipts) ── */}
      <section className="card ledger" aria-label="Competency ledger — Employability Skills">
        <div className="head">
          <b>Competency ledger — Employability Skills</b>
          <span className="num">
            {v.esVerified} of {ASSESSED_COMPETENCIES} verified · {claimedCompetencies} self-report
          </span>
        </div>
        <div className="lgrid">
          {Object.entries(state.competencies ?? {}).map(([name, st]) => (
            <div className="lrow" key={name}>
              <span
                className={`ms ${st === "verified" ? "fill done" : ""}`}
                aria-hidden="true"
              >
                {st === "verified" ? "verified" : "task_alt"}
              </span>
              <b>{name}</b>
              <span className={`chip ${st === "verified" ? "c-green" : "c-grey hatch-chip"}`}>
                {st === "verified" ? "Verified" : "Self-report"}
              </span>
            </div>
          ))}
        </div>
        <div className="lcap">
          Verified by the step-③ assessment&apos;s verification battery; self-report never closes bars — it carries a
          hatch until evidence lands. {ASSESSED_COMPETENCIES} of 8 NACE competencies carried — Equity &amp; Inclusion
          excluded by recorded choice.
        </div>
      </section>
    </div>
  );
}
