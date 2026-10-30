import type { BarSource, Career, Resource } from "@/lib/types";
import { getStudentView } from "@/lib/db";
import { requireStudent } from "@/lib/session";
import { scoreView } from "@/lib/engines/rubric";
import { WEIGHTS } from "@/lib/engines/score";
import { skillsFor } from "@/lib/engines/gaps";
import { presenceMeasured } from "@/lib/engines/air";
import { RESOURCES } from "@/lib/fixtures/resources";
import { INSTRUMENT } from "@/lib/fixtures/instrument";
import { trackLabelOf } from "@/lib/fixtures/catalog";
import { credentialStore, credentialsPersistenceNotice } from "@/lib/db/credential-store";
import ProfileTabs from "./ProfileTabs";
import ProfileReadout from "./ProfileReadout";
import PresenceCard from "./PresenceCard";
import DeclaredCredentials from "./DeclaredCredentials";
import { AccountIdentity, AccountPassword } from "./AccountForms";
import DpaArtifacts from "./DpaArtifacts";
import { scoreTrajectory, fmtEventDate, type TrajPoint, type Trajectory } from "./trajectory";
import "./profile.css";

export const dynamic = "force-dynamic";

/* ── derived display helpers (+ can) ────────────────────────────────────── */

/* persona year+track line ("4th Year, Computer & IT") — the state's new
   vocabulary; the SHS-era gradeLabel()/`grade` is gone (2026-10-30 sweep) */
const yearTrack = (s: { yearLevel: string; track: string }) =>
  [s.yearLevel, trackLabelOf(s.track)].filter(Boolean).join(", ");

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

/* badge voices — the honest source marks */
function skillBadge(source: BarSource) {
  if (source === "verified") return <span className="p-badge chip c-green">·✓ VERIFIED QUIZ</span>;
  if (source === "checked") return <span className="p-badge chip c-green">·✓✓ CHECKED</span>;
  return <span className="p-badge chip c-grey hatch-chip">SELF-REPORTED</span>;
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

/**
 * M11 Competency snapshot + Round-7 re-cut (2026-10-30 v7.2 profile sweep):
 * the surface opens with the v7 Named-Surface band (white band register) and
 * re-cuts to FOUR family tabs — Plan (the demo walk's beat-9 document,
 * default) · Competencies · Credentials · Account (the Round-7 sub-tab
 * edition). `#tab-profile` → `#panel-profile` carries Credentials (the
 * legacy hook id — the e2e money beat's selector is the contract; the
 * visible label reads "Credentials").
 */
export default async function ProfilePage() {
  const profile = await requireStudent();
  const { state, career, score, ar } = await getStudentView(profile.studentId);
  if (!career || !score) return <UndecidedProfile name={state.name} />;

  const v = scoreView(career, state, ar);
  const traj = scoreTrajectory(state, ar);
  const asOf = fmtEventDate(state.events[state.events.length - 1]?.date);
  const byCheck = Object.values(state.bars).filter((b) => b.source === "verified" || b.source === "checked").length;
  const bySelf = Object.values(state.bars).filter((b) => b.source === "claimed").length;

  /* Competencies tab — skills rows: closed bars first (verified → checked →
     claimed), then the open remainder, so every badge traces to its source. */
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

  /* the instrument's 7 competency titles (verbatim from the approved bank) —
     the Round-7 detail view: verified ·✓ vs claimed per competency */
  const assessed = INSTRUMENT.map((c) => ({
    ...c,
    status: state.competencies?.[c.title],
  }));

  /* Credentials — a platform resource becomes a row only when its check
     passed (M9 gate); the three declared kinds ride the credential store. */
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
  const declaredRows = await credentialStore.list(profile.studentId);
  const persistence = credentialsPersistenceNotice();

  /* Presence — the FOURTH credential kind (ticket 12): declared + machine-
     verified, never counselor-audited. The stamp is what the offline demo
     presents; the private account's honest sub-result is recorded here. */
  const presence = state.presence ?? null;
  const presenceMeasuredNow = presenceMeasured(presence);

  /* Goals, in plain words (they live on Plan §2 in the re-cut — its rows are
     the same record; the old duplicate panel reads no more) */
  const completedGoals = state.goals.filter((g) => g.status === "completed");
  const activeGoals = state.goals.filter((g) => g.status === "active");
  const acceptedOn = (title: string) => {
    const ev = state.events.find((e) => e.kind === "goal-set" && e.detail.includes(title));
    return fmtEventDate(ev?.date ?? state.events[0]?.date);
  };

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

  /* AR presence ticker (ticket 12): the declared entry's machine-verified stamp. */
  const presenceTicker = (() => {
    const p = state.presence;
    if (!p?.stamp) return "not declared";
    if (v.arFactors.presence.measured)
      return `${v.arFactors.presence.earned} of ${v.arFactors.presence.max} · stamped ${fmtEventDate(p.stamp.verifiedAt)}`;
    return "declared — format check failed, not yet measured";
  })();

  /* header band instrument: the five channel mini-bar (at rest — honest
     fractions render at rest per the v7 lock) reads the SAME computed sub-
     values the KPI cells carry, AR empty (never painted) while unmeasured. */
  const bandVals: (number | null)[] = [v.sp, v.es, v.tp, v.ar, v.cc];
  const bandMaxes = [WEIGHTS.sp, WEIGHTS.es, WEIGHTS.tp, WEIGHTS.ar, WEIGHTS.cc];

  /* Credentials earned (Plan §4 counter): platform check-passed rows +
     verified declared credentials + the presence stamp when measured —
     the same "counted" truth the Credentials tab renders per row. */
  const credentialsEarned =
    credentialRows.length + declaredRows.filter((r) => r.status === "verified").length + (presenceMeasuredNow ? 1 : 0);

  const identity = (
    <p className="band-id num">
      {/* persona line: "Neil · 4th Year, Computer & IT · Target: …" — the state's
          yearLevel + the track's TRACK_LABELS label, the Account tab consistent */}
      {state.name} · {yearTrack(state)} · Target: <b>{career.name}</b>
    </p>
  );

  const competenciesPanel = (
    <div className="stack">
      <p className="lead-mono num">
        Snapshot · what you have to show · every mark traces to a check, a claim, or a choice
      </p>
      <ProfileReadout
        score={v.total}
        values={score}
        closed={v.closed}
        mapSize={v.mapSize}
        byCheck={byCheck}
        bySelf={bySelf}
        asOf={asOf}
        careerName={career.name}
        identityLabel={yearTrack(state)}
        labels={["Skills", "Employability", "Training", "Application", "Direction"]}
      />

      <div className="psblock">
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
                  {bar ? <>{skillBadge(bar.source)}</> : <span className="p-badge chip c-grey">OPEN</span>}
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
      </div>

      <div className="psblock">
        <div className="b-head">
          <h2>Competency assessment</h2>
          <p className="lead-count num">
            {state.assessment ? `Latest attempt · ${fmtEventDate(state.assessment.takenAt)}` : "Not assessed yet"}
          </p>
          <p className="helper">
            The 7-competency battery (Equity &amp; Inclusion excluded, by recorded choice) grades two ways:
            <b> ·✓ verified</b> = your self-ratings stood up to both verification checks of that competency;
            <b> claimed</b> = your self-ratings stand alone. The composite reads the CURRENT attempt — a
            re-take replaces it, latest attempt counts, never best-ever.
          </p>
        </div>
        <div className="assess-strip num">
          <span>Employability · <b>{v.es} of {WEIGHTS.es}</b></span>
          <span>{v.esVerified} of 7 NACE competencies verified ·✓ (the assessment carries this channel)</span>
        </div>
        <div className="prow-list">
          {assessed.map((c) => (
            <div className="prow" key={c.title}>
              <span className="p-name">{c.title}</span>
              {c.status === "verified" ? (
                <span className="p-badge chip c-green">·✓ VERIFIED</span>
              ) : c.status === "claimed" ? (
                <span className="p-badge chip c-grey hatch-chip">CLAIMED</span>
              ) : (
                <span className="p-badge chip c-grey">NOT ASSESSED YET</span>
              )}
              <span className="p-sub">
                {c.status === "verified"
                  ? "Both verification checks of this competency passed — the ·✓ carries the channel"
                  : c.status === "claimed"
                    ? "Self-rated only — the competency struggled a check in this attempt (or isn't re-verified)"
                    : "The battery didn't measure this competency yet"}
              </span>
            </div>
          ))}
        </div>
        <p className="src-line num">
          A re-take runs the full battery again (the intake&apos;s step ③) — your latest attempt replaces this one,
          history stays readable in My Plan → Progress
        </p>
        <p className="retake-row">
          <a className="g-link num" href="/onboarding">
            Re-take the assessment →
          </a>
        </p>
      </div>

      <div className="psblock">
        <div className="b-head">
          <h2>Starting levels with people</h2>
          <p className="helper">Rated from your setup answers before the battery ran. They grow as the work does.</p>
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
      </div>
    </div>
  );

  const credentialsPanel = (
    <div className="stack">
      <p className="lead-mono num">
        Credentials · four kinds on one panel: the platform&apos;s checked trainings, your declared entries,
        the machine-verified presence stamp
      </p>
      <div className="psblock">
        <div className="b-head">
          <h2>Credentials you&apos;ve earned</h2>
          <p className="helper">
            Four kinds land here: the platform&apos;s checked trainings, your declared credentials, and —
            since the ticket-12 round — <b>professional presence</b>, declared below and verified by its
            machine stamp.
          </p>
        </div>
        {presence && presence.stamp && (
          <div className="prow presence-row" data-presence-row>
            <span className="p-name">Professional presence — LinkedIn</span>
            {presenceMeasuredNow ? (
              <span className="p-badge chip c-green " data-presence-stamp={`MACHINE-VERIFIED ${fmtEventDate(presence.stamp.verifiedAt).toUpperCase()}`}>
                MACHINE-VERIFIED · {fmtEventDate(presence.stamp.verifiedAt).toUpperCase()}
              </span>
            ) : (
              <span className="p-badge chip c-grey">DECLARED — FORMAT CHECK FAILED, NOT YET MEASURED</span>
            )}
            <span className="p-sub" data-presence-sub>
              {presence.linkedinUrl} · {presence.email} ·{" "}
              {presence.stamp.offline ? "stamped offline — no network look-up ran" : ""}
              {presence.stamp.checks.linkedinUrlFormat === "fail" ? " · URL format failed" : ""}
              {presence.stamp.checks.professionalEmailFormat === "fail" ? " · email format failed" : ""}
              {presence.stamp.contentNote ? ` · ${presence.stamp.contentNote}` : ""}
            </span>
          </div>
        )}
        {credentialRows.length === 0 && !presence && (
          <p className="doc-p" style={{ marginTop: 12 }}>
            None yet — your route&apos;s first credential appears the moment its check passes.
          </p>
        )}
        <div className="prow-list">
          {credentialRows.map((c, i) => (
            <div className="prow" key={i}>
              <span className="p-name">{c.title}</span>
              <span className="p-badge chip c-green">✓✓ CHECKED · {c.date.toUpperCase()}</span>
              <span className="p-sub">
                {c.provider ? `${c.provider} · ${c.free ? "free" : "paid"} · ` : ""}
                counted when its comprehension check passed
              </span>
            </div>
          ))}
          <div className="prow">
            <span className="p-name" style={{ color: "var(--v-ink2)", fontWeight: 500 }}>
              TESDA NC II
            </span>
            <span className="p-badge chip c-grey">WHEN YOU PASS THE ASSESSMENT</span>
            <span className="p-sub">Your route&apos;s next credential, not earned yet</span>
          </div>
        </div>
        <p className="src-line num">
          A platform credential appears here only when its check passes · counselor-audited kinds carry
          their stamp on the entry itself
        </p>
      </div>

      <div className="psblock">
        <div className="b-head">
          <h2>Your declared credentials</h2>
          <p className="helper">
            Certifications · internships and jobs · personal projects and organization roles — entries you
            declare with evidence. The counselor audit rules each one: <b>Verified</b> is the shared record
            (read-only after), <b>Needs check</b> is honest waiting, and a <b>not-accepted</b> entry shows the
            audit&apos;s note and revises. Verified credentials close gaps like platform completions; declared
            ones wait — nothing scores on a say-so.
          </p>
        </div>
        <DeclaredCredentials
          rows={declaredRows}
          skillVocabulary={allSkills}
          persistence={persistence}
        />
        <p className="src-line num">
          Declared skills come from the framework vocabulary — cross-track picks stay honest; the audit rules
          the skills when it rules the evidence
        </p>
      </div>

      <div className="psblock">
        <div className="b-head">
          <h2>Professional presence</h2>
        </div>
        <div className="presence-wrap">
          <PresenceCard
            declared={
              presence?.stamp
                ? {
                    linkedinUrl: presence.linkedinUrl,
                    email: presence.email,
                    verifiedAt: presence.stamp.verifiedAt,
                    privateNote: Boolean(presence.stamp.contentNote),
                  }
                : null
            }
          />
        </div>
        <p className="src-line num">
          Presence (ticket 12) is machine-verified at declaration — the timestamped stamp, never a
          counselor audit. It is the fourth kind and feeds Application-Readiness&apos; 3-point factor.
        </p>
      </div>
    </div>
  );

  const accountPanel = (
    <div className="stack">
      <p className="lead-mono num">
        Account · your identity, your password, and the DPA&apos;s two data-subject rights as working tools
      </p>
      <div className="psblock">
        <div className="b-head">
          <h2>Your identity</h2>
          <p className="helper">
            Email is the sign-in identity — it only changes with the account itself. The rest mirrors your
            intake; the campus is the tenant key and stays fixed.
          </p>
        </div>
        <AccountIdentity
          initial={{
            email: profile.email,
            fullName: profile.fullName,
            yearLevel: profile.yearLevel,
            program: profile.program,
            section: profile.section,
            campus: profile.campus,
          }}
        />
      </div>

      <div className="psblock">
        <div className="b-head">
          <h2>Password</h2>
          <p className="helper">Change it here — the same policy the sign-up enforced (length first, no breach-list reuse).</p>
        </div>
        <AccountPassword />
      </div>

      <div className="psblock">
        <div className="b-head">
          <h2>Your data — the DPA&apos;s two rights, working here</h2>
          <p className="helper">
            RA 10173 data-subject rights as artifacts (ticket 7 lock): one honest export of everything the
            system holds on you, and a real erase behind an explicit confirm. Erasure removes the whole
            record — the counselor roster loses your row; that is what erasure means.
          </p>
        </div>
        <DpaArtifacts studentId={state.id} />
        <p className="src-line num">
          Export: profile · state · event history · credentials · resume runs · letter runs · presence ·
          Erase: auth user → profile → state → credentials → run stores (evidence objects follow the
          storage bucket when the credential writer ships)
        </p>
      </div>
    </div>
  );

  const planPanel = (
    <div className="stack">
      <p className="lead-mono num">
        Plan · where you&apos;re headed · summary only: the ranked steps live in your pathway
      </p>
      <div className="psblock masthead">
        <div className="m-left">
          <span className="cl-label num">Career plan · as of {asOf}</span>
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
          <span className="cl-label num">Readiness · {v.total} of 100</span>
          <div className="m-score num">
            {v.total}
            <small>/100</small>
          </div>
          <div className="m-ticks">
            <p className="tickline num">
              Skills — <b>{v.sp} of {WEIGHTS.sp}</b>
            </p>
            <p className="tickline num">
              Employability — <b>{v.es} of {WEIGHTS.es}</b>{" "}
              <span className="tick-note">· {v.esVerified} of 7 NACE competencies verified ·✓</span>
            </p>
            <p className="tickline num">
              Training — <b>{v.tp} of {WEIGHTS.tp}</b>
              {v.stageOne.done > 0 && (
                <span className="tick-note"> · {v.stageOne.done} of 3 first steps done</span>
              )}
            </p>
            <p className="tickline num">
              Application readiness —{" "}
              <b>{v.ar === null ? "not yet measured" : `${v.ar} of ${WEIGHTS.ar}`}</b>{" "}
              <span className="tick-note">
                · resume {v.arFactors.resume.measured ? `${v.arFactors.resume.earned} of ${v.arFactors.resume.max}` : "not run"} ·
                letter {v.arFactors.letter.measured ? `${v.arFactors.letter.earned} of ${v.arFactors.letter.max}` : "not run"} ·
                presence {presenceTicker}{" "}
                — each factor measures on its own run/file
              </span>
            </p>
            <p className="tickline num">
              Career direction — <b className={v.cc === WEIGHTS.cc ? "full" : undefined}>{v.cc} of {WEIGHTS.cc}</b>
            </p>
          </div>
        </div>
      </div>

      <div className="psblock doc">
        <div className="doc-sec">
          <h3>
            <span className="sec-no num">1</span>The career
          </h3>
          <p className="doc-p">
            You picked <b>{career.name}</b> after exploring the index: the work fits what you enjoy and where
            your track points.
          </p>
          <p className="mono-line num">Entry route · {career.entryRoute}</p>
        </div>

        <div className="doc-sec">
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
                        <span className="p-badge chip c-green">DONE · ✓✓</span>
                      ) : (
                        <span className="p-badge chip c-green">DONE</span>
                      )
                    ) : (
                      <span className="p-badge chip c-grey">{g.type === "milestone" ? "NOT YET DONE" : "IN PROGRESS"}</span>
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
        </div>

        <div className="doc-sec">
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
        </div>

        <div className="doc-sec">
          <h3>
            <span className="sec-no num">4</span>What you&apos;ve already shown
          </h3>
          <div className="counts">
            <div className="count">
              <span className="label num">Skills closed</span>
              <span className="c-val num">{v.closed} of {v.mapSize}</span>
            </div>
            <div className="count">
              <span className="label num">Credentials earned</span>
              <span className="c-val num">{credentialsEarned}</span>
            </div>
            <div className="count">
              <span className="label num">First steps done</span>
              <span className="c-val num">{v.stageOne.done} of 3</span>
            </div>
          </div>
          <p className="doc-note">Same numbers as your Competencies tab: one record, two views.</p>
        </div>

        <div className="doc-sec">
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
        </div>

        <div className="doc-sec">
          <p className="close-p">{closeLine}</p>
          <div className="close-cta">
            <a className="btn btn-primary" href="/pathway">
              Open your pathway <span className="arrow num">↵</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="v7profile">
      <section className="proband" aria-label="Profile">
        <div className="band">
          <div className="bandrow">
            <div className="who">
              <h1>Profile</h1>
              {identity}
              <p className="band-meta num">Readiness report · as of {asOf} · every number carries its source</p>
            </div>
            <div className="band-scale">
              <div className="bandbar num" aria-hidden="true">
                {/* the five channel mini-bar — at rest, honest fractions;
                    the Competencies readout repeats the same computed
                    fractions with its own aria-label */}
                <div className="segbar">
                  {bandVals.map((val, i) => (
                    <div
                      key={i}
                      className={`seg${i === 1 ? " seg-green" : ""}`}
                      style={{ flex: bandMaxes[i] }}
                    >
                      <i style={{ width: `${(val ?? 0) * 100}%` }} />
                    </div>
                  ))}
                </div>
                <div className="seglabels num">
                  {["Skills", "Employability", "Training", "Application", "Direction"].map((l, i) => (
                    <span key={l}>
                      {l} {bandVals[i] === null ? "—" : `${bandVals[i]}/${bandMaxes[i]}`}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProfileTabs
        panels={{
          plan: planPanel,
          competencies: competenciesPanel,
          profile: credentialsPanel,
          account: accountPanel,
        }}
        kickers={{
          competencies: `${v.closed} OF ${v.mapSize} CLOSED`,
          profile: `${credentialsEarned} COUNTED`,
        }}
        foot={
          <footer className="pro-foot">
            <span className="label num">
              Profile report · {state.name.toUpperCase()} ·{" "}
              {[state.yearLevel, trackLabelOf(state.track)].filter(Boolean).join(" · ")} · every number dated
              and sourced
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

/** Credentials-earned counter (Plan §4): platform-checked rows + verified
 *  declared credentials + the machine-verified presence stamp (when
 *  measured) — the same "counted" truth the Credentials tab renders per row. */

/** Earlier-than-fixtures student: no career yet — honest, still dated.
 *  Every tab answers the same truth: the report opens with the career. */
function UndecidedProfile({ name }: { name: string }) {
  const undecidedPanel = (
    <div className="stack">
      <div className="psblock">
        <div className="b-head">
          <h2>Your report opens with your career</h2>
          <p className="helper">Pick a career first — then every number here measures toward it.</p>
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
  );
  return (
    <div className="v7profile">
      <section className="proband" aria-label="Profile">
        <div className="band">
          <div className="bandrow">
            <div className="who">
              <h1>Profile</h1>
              <p className="band-id num">{name} · no career picked yet</p>
              <p className="band-meta num">Readiness report · every number carries its source</p>
            </div>
          </div>
        </div>
      </section>
      <ProfileTabs
        panels={{
          plan: undecidedPanel,
          competencies: undecidedPanel,
          profile: undecidedPanel,
          account: undecidedPanel,
        }}
        foot={
          <footer className="pro-foot">
            <span className="label num">Profile report · every number dated and sourced</span>
            <a className="link-quiet" href="/dashboard">
              Back to dashboard
            </a>
          </footer>
        }
      />
    </div>
  );
}
