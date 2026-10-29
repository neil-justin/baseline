import type { BarSource, Career, Resource } from "@/lib/types";
import { getStudentView } from "@/lib/db";
import { requireStudent } from "@/lib/session";
import { scoreView } from "@/lib/engines/rubric";
import { skillsFor } from "@/lib/engines/gaps";
import { RESOURCES } from "@/lib/fixtures/resources";
import Reveal from "@/components/Reveal";
import ProfileTabs from "./ProfileTabs";
import ProfileReadout from "./ProfileReadout";
import { scoreTrajectory, fmtEventDate, type TrajPoint, type Trajectory } from "./trajectory";
import "./profile.css";

export const dynamic = "force-dynamic";

/* ── derived display helpers (+ can) ────────────────────────────────────── */

function gradeLabel(grade: string): string {
  const m = grade.match(/^G(\d+.*)$/);
  return m ? `Grade ${m[1]}` : grade;
}

const plural = (n: number, word: string, pluralWord?: string) =>
  `${n} ${n === 1 ? word : (pluralWord ?? word + "s")}`;

/* People strengths: starting levels rated honestly from state.softSkills —
   the probe answered 3 competencies; words map to levels; the other NACE
   competencies have no setup answer yet and render unrated (empty dots). */
const COMPETENCIES: { name: string; probe?: string }[] = [
  { name: "Communicating", probe: "Communication" },
  { name: "Teamwork", probe: "Teamwork" },
  { name: "Professionalism" },
  { name: "Problem-solving", probe: "Problem-solving" },
  { name: "Critical thinking" },
  { name: "Leadership" },
  { name: "Respecting differences" },
  { name: "Growing your career" },
];
const WORD_LEVELS: Record<string, number> = { "Room to grow": 1, Okay: 2, Strong: 3 };

/* badge voices — the honest source marks, mono */
function skillBadge(source: BarSource) {
  if (source === "verified")
    return <span className="p-badge vbadge ok">·✓ VERIFIED QUIZ</span>;
  if (source === "checked")
    return <span className="p-badge vbadge ok">·✓✓ CHECKED</span>;
  return <span className="p-badge badge">SELF-REPORTED</span>;
}

/* ── trajectory graphic (Plan §5) ───────────────────────────────────────── */

function TrajGraphic({ traj }: { traj: Trajectory }) {
  const a = traj.points[0];
  const b = traj.points[1];
  const two = Boolean(b);
  const labelOf = (p: TrajPoint) => `${p.label} · ${p.date}`;
  return (
    <>
      {two ? (
        <div
          className="traj"
          role="img"
          aria-label={`Score over time: ${a.label.toLowerCase()}, ${a.date}, ${a.value} of 100. ${b!.label.toLowerCase()}, ${b!.date}, ${b!.value} of 100. Change: plus ${traj.delta}.`}
        >
          <span className="baseline" aria-hidden="true" />
          <span className="rise" aria-hidden="true" />
          <span className="node a" aria-hidden="true" />
          <span className="node b" aria-hidden="true" />
          <span className="tl a" aria-hidden="true">{labelOf(a)}</span>
          <span className="tl b" aria-hidden="true">{labelOf(b!)}</span>
          {traj.delta !== null && <span className="td num" aria-hidden="true">{`+${traj.delta}`}</span>}
          <span className="tv a num" aria-hidden="true">{a.value}</span>
          <span className="tv b num" aria-hidden="true">{b!.value}</span>
        </div>
      ) : (
        <div
          className="traj"
          role="img"
          aria-label={`Score over time: ${a.label.toLowerCase()}, ${a.date}, ${a.value} of 100.`}
        >
          <span className="baseline" aria-hidden="true" />
          <span className="node a" aria-hidden="true" />
          <span className="tl a" aria-hidden="true">{labelOf(a)}</span>
          <span className="tv a num" aria-hidden="true">{a.value}</span>
        </div>
      )}
      <div className="traj-rows num">
        {traj.points.map((p, i) => (
          <p className="trow" key={i}>
            <span>{`${p.label} · ${p.date}`}</span>
            <span className={`tv2${p.ok ? " ok" : ""}`}>{p.value}</span>
          </p>
        ))}
      </div>
      {(traj.delta !== null || traj.prov.barCloses + traj.prov.checks + traj.prov.goalsCompleted > 0) && (
        <div className="prov num">
          {traj.delta !== null && <span className="d-ok">{`+${traj.delta} since setup`}</span>}
          {traj.prov.barCloses > 0 && <span>{plural(traj.prov.barCloses, "gap bar", "gap bars")} closed</span>}
          {traj.prov.checks > 0 && <span>{plural(traj.prov.checks, "comprehension check", "comprehension checks")} passed</span>}
          {traj.prov.goalsCompleted > 0 && <span>{plural(traj.prov.goalsCompleted, "training goal")} completed</span>}
        </div>
      )}
    </>
  );
}

/* ── page ───────────────────────────────────────────────────────────────── */

/** M11 Competency snapshot + M12 Career plan — markup ported from prototype/profile.html. */
export default async function ProfilePage() {
  const profile = await requireStudent();
  const { state, career, score } = await getStudentView(profile.studentId);
  if (!career || !score) return <UndecidedProfile name={state.name} />;

  const v = scoreView(career, state);
  const traj = scoreTrajectory(state);
  const asOf = fmtEventDate(state.events[state.events.length - 1]?.date);
  const byCheck = Object.values(state.bars).filter((b) => b.source === "verified" || b.source === "checked").length;
  const bySelf = Object.values(state.bars).filter((b) => b.source === "claimed").length;

  /* Profile tab — skills rows: closed bars first (verified → checked → claimed),
     then the open remainder, so every badge traces to its source mark. */
  const rank: Record<BarSource, number> = { verified: 0, checked: 1, claimed: 2 };
  const allSkills = skillsFor(career);
  const skillRows = [
    ...allSkills
      .filter((n) => n in state.bars)
      .sort((a, b) => rank[state.bars[a].source] - rank[state.bars[b].source]),
    ...allSkills.filter((n) => !(n in state.bars)),
  ];
  function skillSub(c: Career, skill: string): string | null {
    const bar = state.bars[skill];
    if (!bar) return null;
    if (bar.source === "claimed") return "Your own claim; the check hasn't been passed yet";
    if (bar.source === "verified")
      return state.decisions.verifiedTransferred.includes(skill)
        ? "Passed during setup; carried over when you switched careers"
        : "Passed a verification quiz during setup";
    const ev = state.events.find((e) => e.kind === "bar-closed" && e.detail.startsWith(`${skill} closed`));
    const res: Resource | undefined = RESOURCES.find(
      (r) => r.careerId === c.id && r.skillsAddressed.includes(skill)
    );
    return res
      ? `${res.provider} · ${res.title}${ev?.date ? ` · check passed ${fmtEventDate(ev.date)}` : ""}`
      : ev?.date
        ? `Comprehension check passed ${fmtEventDate(ev.date)}`
        : null;
  }

  /* Credentials — a resource becomes a row only when its check passed (M9 gate). */
  const checkEvents = state.events.filter((e) => e.kind === "check-passed");
  const credentialRows = checkEvents.map((e) => {
    const segs = e.detail.split(" — ");
    const title = segs.length > 1 ? segs.slice(1).join(" — ") : e.detail;
    const res = RESOURCES.find((r) => r.title === title);
    return {
      title: res?.title ?? title,
      provider: res?.provider,
      free: res?.cost === "free",
      date: fmtEventDate(e.date),
    };
  });

  /* Goals, in plain words */
  const completedGoals = state.goals.filter((g) => g.status === "completed");
  const activeGoals = state.goals.filter((g) => g.status === "active");
  const acceptedOn = (title: string) => {
    const ev = state.events.find((e) => e.kind === "goal-set" && e.detail.includes(title));
    return fmtEventDate(ev?.date ?? state.events[0]?.date);
  };
  const goalSentence = [
    ...completedGoals.map((g) => `${g.title} finished itself today: its comprehension check ticked it done.`),
    ...activeGoals.map((g) => `${g.title} is still open from your first pick.`),
  ].join(" ");

  /* Plan §3 — pathway SUMMARY. Stage counts come from v.stageOne (the ranked
     queue snapshot); the next milestone from the locked stage-③ rule (college
     routes are degree routes → portfolio milestones; round 9). Never a ranked
     item. */
  const milestoneText = "portfolio milestones";
  const routeLine =
    v.stageOne.done === 0
      ? `Route · first 30 days: 0 of 3 done · your next step is already picked in your pathway`
      : `Route · first 30 days: ${v.stageOne.done} of 3 done · next milestone: ${milestoneText}`;

  /* Plan §5 closing — hands back to the working loop; low scores never stall. */
  const closeLine =
    v.total >= 40
      ? `You're at ${v.total}. Your pathway has already picked the next step; clear it and the score moves again.`
      : `You're at ${v.total}. Every item below is something you can start this week — your pathway already picked the first one.`;
  const switched = state.events.some((e) => e.kind === "career-switched");

  const identity = (
    <p className="page-id num">
      {state.name} · {gradeLabel(state.grade)}, {state.strand} · Target: <b>{career.name}</b>
    </p>
  );

  const profilePanel = (
    <section className="tabpanel" id="panel-profile" role="tabpanel" aria-labelledby="tab-profile" tabIndex={0} hidden>
      <p className="tab-note num">Snapshot · what you have to show · every mark traces to a check, a claim, or a choice</p>
      <div className="stack">
        <ProfileReadout
          score={v.total}
          parts={v.parts}
          closed={v.closed}
          mapSize={v.mapSize}
          byCheck={byCheck}
          bySelf={bySelf}
          asOf={asOf}
          careerName={career.name}
          strandLabel={gradeLabel(state.grade) + ", " + state.strand}
          labels={["Skills", "People", "Training", "Direction"]}
        />

        <Reveal className="panel block">
          <div className="b-head">
            <h2>Skills for this career</h2>
            <p className="lead-count num">{v.closed} of {v.mapSize} skills closed</p>
            <p className="helper">
              A bar closes when you pass a check or claim a skill you already have. <b>Demonstrated means you
              passed a check</b>; self-rating doesn&apos;t count for an employer.
            </p>
          </div>
          {v.closed === 0 ? (
            <p className="doc-p" style={{ marginTop: 12 }}>
              Nothing closed yet — your baseline bars are waiting on your first check.
            </p>
          ) : (
            <div className="prow-list">
              {skillRows.map((skill) => {
                const bar = state.bars[skill];
                const sub = skillSub(career, skill);
                return (
                  <div className="prow" key={skill}>
                    <span className="p-name">{skill}</span>
                    {bar ? (
                      <>{skillBadge(bar.source)}</>
                    ) : (
                      <span className="p-badge st-open">OPEN</span>
                    )}
                    {sub && <span className="p-sub">{sub}</span>}
                  </div>
                );
              })}
            </div>
          )}
          <p className="src-line num">
            Badges · ·✓ passed a verification quiz · ✓✓ passed a comprehension check · self-reported = your own
            claim, until its check is passed
          </p>
        </Reveal>

        <Reveal className="panel block">
          <div className="b-head">
            <h2>Strengths with people</h2>
            <p className="helper">Starting levels, rated from your setup answers. They grow as the work does.</p>
          </div>
          <div className="zero-strip num">
            <span>People skills · <b>0 of 25</b></span>
            <span>the full situations battery comes after setup</span>
          </div>
          <div className="comp-grid">
            {COMPETENCIES.map(({ name, probe }) => {
              const word = probe ? state.softSkills[probe] : undefined;
              const level = word ? (WORD_LEVELS[word] ?? 0) : 0;
              return (
                <div className="comp" key={name}>
                  <span className="c-name">{name}</span>
                  <span
                    className="dots"
                    role="img"
                    aria-label={
                      level > 0 ? `${name}: level ${level} of 5` : `${name}: not rated yet — the full battery will measure it`
                    }
                  >
                    {[1, 2, 3, 4, 5].map((d) => (
                      <i key={d} className={d <= level ? "on" : ""} />
                    ))}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="src-line num">Rated from your situation answers during setup · unscored until the full battery runs</p>
        </Reveal>

        <Reveal className="panel block">
          <div className="b-head">
            <h2>Credentials you&apos;ve earned</h2>
          </div>
          {credentialRows.length === 0 && (
            <p className="doc-p" style={{ marginTop: 12 }}>
              None yet — your route&apos;s first credential appears the moment its check passes.
            </p>
          )}
          <div className="prow-list">
            {credentialRows.map((c, i) => (
              <div className="prow" key={i}>
                <span className="p-name">{c.title}</span>
                <span className="p-badge vbadge ok">✓✓ CHECKED · {c.date.toUpperCase()}</span>
                <span className="p-sub">
                  {c.provider ? `${c.provider} · ${c.free ? "free" : "paid"} · ` : ""}
                  counted when its comprehension check passed
                </span>
              </div>
            ))}
            <div className="prow">
              <span className="p-name" style={{ color: "var(--ink-3)", fontWeight: 500 }}>
                TESDA NC II
              </span>
              <span className="p-badge st-open">WHEN YOU PASS THE ASSESSMENT</span>
              <span className="p-sub">Your route&apos;s next credential, not earned yet</span>
            </div>
          </div>
          <p className="src-line num">A credential appears here only when its check passes</p>
        </Reveal>

        <Reveal className="panel block">
          <div className="b-head">
            <h2>Your goals, in plain words</h2>
          </div>
          {state.goals.length === 0 ? (
            <p className="doc-p" style={{ marginTop: 12 }}>
              No goals yet. Your first suggested goal accepts in Pathway.
            </p>
          ) : (
            <p className="doc-p" style={{ marginTop: 12 }}>
              {goalSentence}
            </p>
          )}
          <p className="doc-note">Career, route, and score history are on the other tab.</p>
          <p style={{ marginTop: 10 }}>
            <button className="quiet-toggle" type="button" data-goto="plan">
              See the full plan
            </button>
          </p>
        </Reveal>
      </div>
    </section>
  );

  const planPanel = (
    <section className="tabpanel" id="panel-plan" role="tabpanel" aria-labelledby="tab-plan" tabIndex={0}>
      <p className="tab-note num">Plan · where you&apos;re headed · summary only: the ranked steps live in your pathway</p>
      <div className="stack">
        <Reveal className="panel masthead">
          <div className="m-left">
            <span className="label">Career plan · as of {asOf}</span>
            <h2 className="m-title">Career plan — {state.name}</h2>
            <p className="m-meta">
              Target career: <b>{career.name}</b>
            </p>
            <p className="m-note">
              The summary a panel or adviser reads: your route in dated sections, with the source under every
              number.
            </p>
          </div>
          <div className="m-right">
            <span className="label num">Readiness · {v.total} of 100</span>
            <div className="m-score num">
              {v.total}
              <small>/100</small>
            </div>
            <div className="m-ticks">
              <p className="tickline num">
                Skills — <b>{v.sp} of 40</b>
              </p>
              <p className="tickline num">
                People skills — <b>0 of 25</b> <span className="tick-note">· the full battery comes after setup</span>
              </p>
              <p className="tickline num">
                Training — <b>{v.tp} of 20</b>
                {v.stageOne.done > 0 && (
                  <span className="tick-note"> · {v.stageOne.done} of 3 first steps done</span>
                )}
              </p>
              <p className="tickline num">
                Career direction — <b className={v.cc === 15 ? "full" : undefined}>{v.cc} of 15</b>
              </p>
            </div>
          </div>
        </Reveal>

        <div className="panel doc">
          <Reveal className="doc-sec">
            <h3>
              <span className="sec-no num">1</span>The career
            </h3>
            <p className="doc-p">
              You picked <b>{career.name}</b> after exploring the index: the work fits what you enjoy and where
              your strand points.
            </p>
            <p className="mono-line num">Entry route · {career.entryRoute}</p>
          </Reveal>

          <Reveal className="doc-sec">
            <h3>
              <span className="sec-no num">2</span>What you&apos;re aiming at
            </h3>
            {state.goals.length === 0 ? (
              <p className="doc-p">No goals yet. Your first suggested goal accepts in Pathway.</p>
            ) : (
              <div className="prow-list">
                {[...completedGoals, ...activeGoals.filter((g) => g.type === "training"), ...activeGoals.filter((g) => g.type !== "training")].map(
                  (g, i) => (
                    <div className="prow" key={g.id ?? i}>
                      <span className="p-name">{g.title}</span>
                      {g.status === "completed" ? (
                        g.type === "training" ? (
                          <span className="p-badge vbadge ok">DONE · ✓✓</span>
                        ) : (
                          <span className="p-badge vbadge ok">DONE</span>
                        )
                      ) : (
                        <span className="p-badge st-open">{g.type === "milestone" ? "NOT YET DONE" : "IN PROGRESS"}</span>
                      )}
                      <span className="p-sub">
                        {g.status === "completed"
                          ? g.type === "training"
                            ? `Completed itself when its comprehension check passed · ${fmtEventDate(g.completedAt)}`
                            : `Marked done · ${fmtEventDate(g.completedAt)}`
                          : g.type === "milestone"
                            ? "Happens outside the app — you tick it off when you pass"
                            : `Stays active from your first pick · accepted ${acceptedOn(g.title)}`}
                      </span>
                    </div>
                  )
                )}
              </div>
            )}
            <p className="doc-note">Done arrives by itself when a check passes; you never tick goals off by hand.</p>
          </Reveal>

          <Reveal className="doc-sec">
            <h3>
              <span className="sec-no num">3</span>Where you are on the route
            </h3>
            <div className="stages">
              <div className="stage">
                <span className="st-top">
                  <span className="dot on" aria-hidden="true" />
                  <span className="st-name">First 30 days</span>
                </span>
                <span className="st-count num">{v.stageOne.done} of 3 done</span>
              </div>
              <div className="stage">
                <span className="st-top">
                  <span className="dot" aria-hidden="true" />
                  <span className="st-name">Next steps</span>
                </span>
                <span className="st-count">opens next</span>
              </div>
              <div className="stage">
                <span className="st-top">
                  <span className="dot" aria-hidden="true" />
                  <span className="st-name">Entry-ready</span>
                </span>
                <span className="st-count">the last stage</span>
              </div>
            </div>
            <p className="mono-line num">{routeLine}</p>
          </Reveal>

          <Reveal className="doc-sec">
            <h3>
              <span className="sec-no num">4</span>What you&apos;ve already shown
            </h3>
            <div className="counts">
              <div className="count">
                <span className="label">Skills closed</span>
                <span className="c-val num">{v.closed} of {v.mapSize}</span>
              </div>
              <div className="count">
                <span className="label">Credentials earned</span>
                <span className="c-val num">{checkEvents.length}</span>
              </div>
              <div className="count">
                <span className="label">First steps done</span>
                <span className="c-val num">{v.stageOne.done} of 3</span>
              </div>
            </div>
            <p className="doc-note">Same numbers as your Profile tab: one record, two views.</p>
          </Reveal>

          <Reveal className="doc-sec">
            <h3>
              <span className="sec-no num">5</span>Your score, over time
            </h3>
            <TrajGraphic traj={traj} />
            {traj.points.length === 1 && (
              <p className="doc-note">Your next score line arrives with your first completion.</p>
            )}
            {switched && (
              <p className="doc-note">You switched careers on the way: verified skills and goals carried over, gap bars reset.</p>
            )}
          </Reveal>

          <Reveal className="doc-sec">
            <p className="close-p">{closeLine}</p>
            <div className="close-cta">
              <a className="btn btn-primary" href="/pathway">
                Open your pathway <span className="arrow num">↵</span>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );

  return (
    <div className="shell">
      <div className="pro-head">
        <div className="screen-head" style={{ marginBottom: 0 }}>
          <h1>Profile</h1>
          {identity}
        </div>
        <p className="pro-meta label num">Readiness report · as of {asOf} · every number carries its source</p>
      </div>

      <ProfileTabs
        profile={profilePanel}
        plan={planPanel}
        foot={
          <footer className="pro-foot">
            <span className="label num">
              Profile report · {state.name.toUpperCase()} · {state.grade} {state.strand} · every number dated and
              sourced
            </span>
            <a className="link-quiet" href="/dashboard">
              Back to dashboard
            </a>
          </footer>
        }
      />
    </div>
  );
}

/** Earlier-than-fixtures student: no career yet — honest, still dated. */
function UndecidedProfile({ name }: { name: string }) {
  return (
    <div className="shell">
      <div className="pro-head">
        <div className="screen-head" style={{ marginBottom: 0 }}>
          <h1>Profile</h1>
          <p className="page-id num">{name} · no career picked yet</p>
        </div>
        <p className="pro-meta label num">Readiness report · every number carries its source</p>
      </div>
      <div className="stack" style={{ paddingTop: 16 }}>
        <div className="panel block">
          <div className="b-head">
            <h2>Your report opens with your career</h2>
            <p className="helper">
              Pick a career first — then every number here measures toward it.
            </p>
          </div>
          <p className="doc-p" style={{ marginTop: 12 }}>
            Explore the index and the score, skills, and plan all find their place.
          </p>
          <p style={{ marginTop: 10 }}>
            <a className="btn btn-primary" href="/career">
              Browse the career index <span className="arrow num">↵</span>
            </a>
          </p>
        </div>
      </div>
      <footer className="pro-foot">
        <span className="label num">Profile report · every number dated and sourced</span>
        <a className="link-quiet" href="/dashboard">
          Back to dashboard
        </a>
      </footer>
    </div>
  );
}
