import { getStudentView } from "@/lib/db";
import { requireStudent } from "@/lib/session";
import { scoreView } from "@/lib/engines/rubric";
import { getResourcesForCareer } from "@/lib/fixtures/resources";
import CountUp from "@/components/CountUp";
import Disclosure from "@/components/Disclosure";
import ScoreSequence from "./ScoreSequence";
import "./dashboard.css";

export const dynamic = "force-dynamic";

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

function UndecidedDefault() {
  return (
    <>
      <section className="app-section">
        <div className="shell">
          <div className="screen-head">
            <h1>Dashboard</h1>
          </div>
        </div>
      </section>
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

/** M1 Dashboard — the score home. Markup ported from prototype/dashboard.html. */
export default async function DashboardPage() {
  const profile = await requireStudent();
  const { state, career, score } = await getStudentView(profile.studentId);
  if (!career || !score) return <UndecidedDefault />;

  const v = scoreView(career, state);
  const topResource = getResourcesForCareer(career.id)[0];
  const activeGoal = v.goalActive;
  const completedGoal = v.goalCompleted;
  const bodyCareer = activeGoal ?? completedGoal;

  return (
    <>
      <section className="app-section">
        <div className="shell">
          <div className="screen-head">
            <h1>Dashboard</h1>
          </div>
        </div>
      </section>

      <section className="scoreband" aria-label="Your readiness score">
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
            right={
              <div className="sub-rows">
                <div className="sub-row">
                  <span className="s-name">Skill progress</span>
                  <p className="s-note">
                    You hold <b className="num">{score.sp} of 40</b>; bars close from your claims and your checks,
                    and each bar shows which.
                  </p>
                </div>
                <div className="sub-row">
                  <span className="s-name">People skills</span>
                  <p className="s-note">
                    You hold <b className="num">0 of 25</b>; the full situations battery comes after setup.
                  </p>
                </div>
                <div className="sub-row">
                  <span className="s-name">Training progress</span>
                  <p className="s-note">
                    You hold <b className="num">{score.tp} of 20</b>;{" "}
                    {v.stageOne.done === 0 ? "your pathway just started." : `First 30 days: ${v.stageOne.done} of 3 done.`}
                  </p>
                </div>
                <div className="sub-row">
                  <span className="s-name">Career clarity</span>
                  <p className="s-note">
                    You hold <b className="num">{score.cc} of 15</b> — Career picked{" "}
                    <span className="vbadge ok">{v.cc >= 5 ? "✓" : "—"}</span> · Goal set{" "}
                    <span className="vbadge ok">{bodyCareer ? "✓" : "—"}</span> · First goal finished:{" "}
                    {completedGoal ? "yes" : "not yet"}.
                  </p>
                </div>
              </div>
            }
          />
          <div className="journey-row num">
            Where you are: <b>First 30 days</b>, {v.stageOne.done} of 3 done.
          </div>
        </div>
      </section>

      <section className="section wrap" style={{ paddingBottom: 72 }}>
        <div className="dash-grid">
          <div className="nextcard">
            <h2 className="n-head">Your next step</h2>
            {topResource && (
              <>
                <p className="n-why">
                  {topResource.skillsAddressed[0]} is the top skill for {career.name}, and this course feeds your
                  first goal. Free to start.
                </p>
                <p className="n-target num">
                  free course · ~{topResource.durationHours} hours · {topResource.provider} — {topResource.title}
                </p>
              </>
            )}
            <div className="n-cta">
              <a className="btn btn-primary" href="/pathway">
                Start this step <SourceArrow />
              </a>
            </div>
          </div>

                    <aside className="rail">
            <div className="panel tickers">
              <a className="tickline num" href="/progress">
                <b>
                  {v.closed} of {v.mapSize}
                </b>{" "}
                {career.name} skills on your baseline — <b>2</b> confirmed <span className="vbadge ok">·✓</span> ·
                First 30 days: <b>{v.stageOne.done} of 3</b> done
              </a>
              <a className="tickline num" href="/progress">
                Goal: <b>{activeGoal ? activeGoal.title : "none yet"}</b> — {activeGoal ? "in progress." : "Careers suggests one."}
              </a>
            </div>
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
          </aside>
        </div>
      </section>
    </>
  );
}
