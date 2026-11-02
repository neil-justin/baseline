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
          className="traj single"
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
 * Phase-1 revamp (2026-11-02): the surface opens with the v7 Named-Surface
 * band (white band register + the five-channel mini-bar + the ONE filled
 * CTA → /pathway) and rides FOUR family tabs — Plan (Dashboard-register
 * cards; the former §-document's masthead + counters retired), Competencies
 * (Phase-2 re-cut, same day: three Dashboard-register cards — skills with
 * provenance chips · the NACE assessment with its retake text link · the
 * demoted starting-levels strip; ProfileReadout retired from rendering —
 * the band + kickers cover its role) · Credentials (Phase-3 re-cut, same
 * day: ONE unified ledger card — platform check-passed rows, the
 * machine-verified presence stamp, and the declared entries all ride the
 * same Dashboard-register `.lrow` unit; the TESDA future row and the old
 * three-stitched-card formats retire) · Account (the Round-7 sub-tab
 * edition, reworked in Phase 4). `#tab-profile` →
 * `#panel-profile` carries Credentials (the legacy hook id — the e2e
 * money beat's selector is the contract; the visible label reads
 * "Credentials").
 */
export default async function ProfilePage() {
  const profile = await requireStudent();
  const { state, career, score, ar } = await getStudentView(profile.studentId);
  if (!career || !score) return <UndecidedProfile name={state.name} />;

  const v = scoreView(career, state, ar);
  const traj = scoreTrajectory(state, ar);
  const asOf = fmtEventDate(state.events[state.events.length - 1]?.date);

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
  /* the head-span provenance counts — computed off the exact rows the table
     renders (this career's map), not the whole bar store */
  const skVerified = skillRows.filter((n) => state.bars[n]?.source === "verified").length;
  const skChecked = skillRows.filter((n) => state.bars[n]?.source === "checked").length;
  const skClaimed = skillRows.filter((n) => state.bars[n]?.source === "claimed").length;

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

  /* people-strengths starting levels: how many of the 8 carry a setup answer */
  const ratedStart = COMPETENCIES.reduce((n, { probe }) => n + (probe && state.softSkills[probe] ? 1 : 0), 0);

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
  /* the unified card's head-span counts: earned (the COUNTED truth above),
     the entries still waiting on the counselor audit, and the audit-ruled
     verified entries */
  const declaredPending = declaredRows.filter((r) => r.status === "declared").length;
  const declaredVerified = declaredRows.filter((r) => r.status === "verified").length;

  const identity = (
    <p className="band-id num">
      {/* persona line: "Neil · 4th Year, Computer & IT · Target: …" — the state's
          yearLevel + the track's TRACK_LABELS label, the Account tab consistent */}
      {state.name} · {yearTrack(state)} · Target: <b>{career.name}</b>
    </p>
  );

  const competenciesPanel = (
    <div className="plancards">
      {/* Phase-2 re-cut (2026-11-02): three Dashboard-register cards on the
          shell ground; the ProfileReadout retires — the header band's seg
          bar + the tab kicker cover its role (per-channel receipts live in
          the kickers). Data mapping unchanged, presentation only. */}
      <div className="card">
        <div className="head">
          <b>Skills for this career</b>
          <span className="num">
            {skVerified} verified · {skChecked} checked · {skClaimed} self-reported
          </span>
        </div>
        {v.closed === 0 ? (
          <div className="foot num">
            Nothing closed yet — your baseline bars are waiting on your first check.
          </div>
        ) : (
          <table className="plan-table skills-table">
            <thead>
              <tr>
                <th scope="col" className="col-item">Skill</th>
                <th scope="col">Evidence</th>
                <th scope="col">Source</th>
              </tr>
            </thead>
            <tbody>
              {skillRows.map((skill) => {
                const bar = state.bars[skill];
                const sub = skillSub(career, skill);
                return (
                  <tr key={skill}>
                    <td>
                      <div className="item">{skill}</div>
                    </td>
                    <td>{bar ? skillBadge(bar.source) : <span className="p-badge chip c-grey">OPEN</span>}</td>
                    <td>
                      <div className="sub num">{sub ?? <span className="p-dash">—</span>}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        <p className="lcap num">
          ·✓ passed a verification quiz · ·✓✓ passed a comprehension check · self-reported = your claim, until its check passes
        </p>
      </div>

      <div className="card">
        <div className="head">
          <b>NACE assessment</b>
          <span className="num">
            {state.assessment ? `Latest attempt · ${fmtEventDate(state.assessment.takenAt)}` : "Not assessed yet"}
          </span>
        </div>
        <div className="lcap num">
          <p>Employability · {v.es} of {WEIGHTS.es}</p>
          <p>{v.esVerified} of 7 NACE competencies verified ·✓</p>
        </div>
        <table className="plan-table assess-table">
          <thead>
            <tr>
              <th scope="col" className="col-item">Competency</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {assessed.map((c) => (
              <tr key={c.title}>
                <td>
                  <div className="item">{c.title}</div>
                </td>
                <td>
                  {c.status === "verified" ? (
                    <span className="p-badge chip c-green">·✓ VERIFIED</span>
                  ) : c.status === "claimed" ? (
                    <span className="p-badge chip c-grey hatch-chip">CLAIMED</span>
                  ) : (
                    <span className="p-badge chip c-grey">NOT ASSESSED YET</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="foot num">
          Latest attempt counts — a re-take replaces it, never best-ever.{" "}
          <a className="foot-link" href="/onboarding">
            Re-take the assessment →
          </a>
        </div>
      </div>

      {/* starting levels, demoted: one card, the 8 dotted levels as one
          wrapped strip of name + dots units — caption-weight names, the
          full-table form retired; the dots' aria-labels stay byte-verbatim */}
      <div className="card">
        <div className="head">
          <b>Starting levels with people</b>
          <span className="num">{ratedStart} of {COMPETENCIES.length} rated at setup</span>
        </div>
        <div className="lvl-strip">
          {COMPETENCIES.map(({ name, probe }) => {
            const word = probe ? state.softSkills[probe] : undefined;
            const level = word ? (WORD_LEVELS[word] ?? 0) : 0;
            return (
              <span className="lvl" key={name}>
                <span className="lvl-name">{name}</span>
                <span
                  className="dots num"
                  role="img"
                  aria-label={
                    level > 0 ? `${name}: level ${level} of 5` : `${name}: not rated yet — the full battery will measure it`
                  }
                >
                  {[1, 2, 3, 4, 5].map((d) => (
                    <i key={d} className={d <= level ? "on" : ""} />
                  ))}
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );

  /* Credentials tab (Phase-3 re-cut, 2026-11-02): ONE unified ledger card on
     the shell ground — platform check-passed rows, the machine-verified
     presence stamp row, and the declared entries all render the same
     Dashboard-register .lrow unit (icon slot · plain name · chip pushed
     right · an 11px provenance line where the data provides it). The TESDA
     NC II future row retires (a placeholder for an unearned credential —
     the ledger counts what IS counted), the old p-table/psblock trio is
     gone, and the presence status sub with its data-presence-* hooks rides
     the row bytes-verbatim (the e2e money beat reads the stamp + sub). */
  const credentialsPanel = (
    <div className="plancards">
      <div className="card">
        <div className="head">
          <b>Credentials</b>
          <span className="num">
            {credentialsEarned} earned · {declaredPending} declared · {declaredVerified} verified
          </span>
        </div>
        {credentialRows.length === 0 && !presence && (
          <p className="lcap num">
            None yet — your route&apos;s first credential appears the moment its check passes.
          </p>
        )}
        <div className="ledger">
          {/* the presence stamp row — the FOURTH kind (ticket 12); its
              declaration form rides the inset slot below the ledger */}
          {presence && presence.stamp && (
            <div className="lrow" data-presence-row>
              <span className={`ms${presenceMeasuredNow ? " done" : ""}`} aria-hidden="true">
                {presenceMeasuredNow ? "verified" : "block"}
              </span>
              <b>Professional presence — LinkedIn</b>
              {presenceMeasuredNow ? (
                <span
                  className="chip c-green"
                  data-presence-stamp={`MACHINE-VERIFIED ${fmtEventDate(presence.stamp.verifiedAt).toUpperCase()}`}
                >
                  MACHINE-VERIFIED · {fmtEventDate(presence.stamp.verifiedAt).toUpperCase()}
                </span>
              ) : (
                <span className="chip c-grey">DECLARED — FORMAT CHECK FAILED, NOT YET MEASURED</span>
              )}
              <span className="lsub num" data-presence-sub>
                {presence.linkedinUrl} · {presence.email} ·{" "}
                {presence.stamp.offline ? "stamped offline — no network look-up ran" : ""}
                {presence.stamp.checks.linkedinUrlFormat === "fail" ? " · URL format failed" : ""}
                {presence.stamp.checks.professionalEmailFormat === "fail" ? " · email format failed" : ""}
                {presence.stamp.contentNote ? ` · ${presence.stamp.contentNote}` : ""}
              </span>
            </div>
          )}
          {/* platform check-passed rows (the M9 gate — a row only when its
              comprehension check passed) */}
          {credentialRows.map((c, i) => (
            <div className="lrow" key={i}>
              <span className="ms done" aria-hidden="true">
                task_alt
              </span>
              <b>{c.title}</b>
              <span className="chip c-green">✓✓ CHECKED · {c.date.toUpperCase()}</span>
              <span className="lsub num">
                {c.provider ? `${c.provider} · ${c.free ? "free" : "paid"} · ` : ""}
                counted when its comprehension check passed
              </span>
            </div>
          ))}
          {/* declared entries — the counselor-audited kinds render through
              the same .lrow register (client ledger source + entry form) */}
          <DeclaredCredentials
            rows={declaredRows}
            skillVocabulary={allSkills}
            persistence={persistence}
          />
        </div>
        {/* the presence declaration — machine-verified AT declaration, an
            inset hairline slot of the same card (re-declare replaces the
            latest stamp). Phase 4: verifiedAt/privateNote dropped from
            PresenceCard's props — the ledger row renders the stamp's
            truth; only linkedinUrl/email feed the re-declare copy. */}
        <div className="formslot">
          <PresenceCard
            declared={
              presence?.stamp
                ? { linkedinUrl: presence.linkedinUrl, email: presence.email }
                : null
            }
          />
        </div>
        <div className="lcap num">
          <p>A platform credential appears here only when its check passes.</p>
          <p>Machine-verified presence — no counselor audit; the stamp feeds the Application-Readiness factor.</p>
          <p>Declared skills come from the framework vocabulary — the audit rules the skills when it rules the evidence.</p>
        </div>
      </div>
    </div>
  );

  /* Account tab (Phase-4 re-cut, 2026-11-02): three separated Dashboard-
     register cards — Identity · Security · Data rights — the same floating
     .plancards .card units the other tabs ride. Presentation only: the same
     forms, fields, and machinery (PATCH /api/profile · POST /api/auth/
     password · the two DPA routes — no route or API change), the page's
     last .stack and the psblock married-surface bridge retire with it.
     The password card adds a client-only confirm field (submit blocked
     until the entries match) — the session stays the authorization. */
  const accountPanel = (
    <div className="plancards">
      <div className="card">
        <div className="head">
          <b>Identity</b>
          <span className="num">
            campus-managed fields · {profile.yearLevel || "—"} ({profile.program || "—"} · {profile.section || "—"})
          </span>
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

      <div className="card">
        <div className="head">
          <b>Security</b>
          <span className="num">same policy sign-up enforced — length first, no breach-list reuse</span>
        </div>
        <AccountPassword />
      </div>

      {/* Data rights — the DPA's two rights as working tools; the export/
          erase cascade receipt rides the card's provenance caption */}
      <div className="card">
        <div className="head">
          <b>Data rights</b>
          <span className="num">RA 10173 data-subject rights · erase removes the whole record</span>
        </div>
        <DpaArtifacts studentId={state.id} />
        <div className="lcap num">
          <p>Export serves: profile · state · event history · credentials · resume runs · letter runs · presence</p>
          <p>Erase order: auth user → profile → state → credentials → run stores</p>
        </div>
      </div>
    </div>
  );

  const planPanel = (
    <div className="plancards">
      {/* Phase-1 revamp (2026-11-02): the masthead (identity + five ticklines)
          and the §4 counters retire — the header band is the sole identity/
          state surface and the tab kickers carry the counts. What's left of
          the §1-§5 document renders as Dashboard-register cards, one
          compartment each. Summary only — NEVER the ranked plan list. */}
      <div className="card">
        <div className="head">
          <b>Goals</b>
          <span className="num">
            {completedGoals.length} done · {activeGoals.length} in progress
          </span>
        </div>
        {state.goals.length === 0 ? (
          <div className="foot num">No goals yet. Your first suggested goal accepts in Pathway.</div>
        ) : (
          <table className="plan-table">
            <thead>
              <tr>
                <th scope="col" className="col-item">Goal</th>
                <th scope="col">State</th>
                <th scope="col">Since</th>
              </tr>
            </thead>
            <tbody>
              {[...completedGoals, ...activeGoals.filter((g) => g.type === "training"), ...activeGoals.filter((g) => g.type !== "training")].map(
                (g, i) => (
                  <tr key={g.id ?? i}>
                    <td>
                      <div className="item">{g.title}</div>
                    </td>
                    <td>
                      {g.status === "completed" ? (
                        g.type === "training" ? (
                          <span className="p-badge chip c-green">DONE · ✓✓</span>
                        ) : (
                          <span className="p-badge chip c-green">DONE</span>
                        )
                      ) : (
                        <span className="p-badge chip c-grey">{g.type === "milestone" ? "NOT YET DONE" : "IN PROGRESS"}</span>
                      )}
                    </td>
                    <td>
                      <div className="sub num">
                        {g.status === "completed"
                          ? g.type === "training"
                            ? `check passed ${fmtEventDate(g.completedAt)}`
                            : `marked done ${fmtEventDate(g.completedAt)}`
                          : g.type === "milestone"
                            ? "outside the app — tick it off when you pass"
                            : `accepted ${acceptedOn(g.title)}`}
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* the route as ledger rows; §1's prose retires and its one fact (the
          entry route) rides the caption next to the route line */}
      <div className="card">
        <div className="head">
          <b>Pathway stages</b>
          <span className="num">First 30 days · {v.stageOne.done} of 3 done</span>
        </div>
        <div className="strow">
          <span className={`dot${v.stageOne.done > 0 ? " on" : ""}`} aria-hidden="true" />
          <b>First 30 days</b>
          <span className="s-count num">{v.stageOne.done} of 3 done</span>
        </div>
        <div className="strow">
          <span className="dot" aria-hidden="true" />
          <b>Next steps</b>
          <span className="s-count num">opens next</span>
        </div>
        <div className="strow">
          <span className="dot" aria-hidden="true" />
          <b>Entry-ready</b>
          <span className="s-count num">the last stage</span>
        </div>
        <div className="lcap num">
          <p>Entry route · {career.entryRoute}</p>
          <p>{routeLine}</p>
        </div>
      </div>

      {/* the trajectory card keeps the graphic + delta + the .prov caption
          (the e2e beat-9 selectors read .prov/.traj-rows) and closes the tab
          with the .foot link-out; the filled CTA lives in the band */}
      <div className="card">
        <div className="head">
          <b>Score trajectory</b>
          <span className="num">{traj.points.length > 1 ? `+${traj.delta} since setup` : "one reading so far"}</span>
        </div>
        <TrajGraphic traj={traj} />
        {traj.points.length === 1 && (
          <p className="doc-note">Your next score line arrives with your first completion.</p>
        )}
        {switched && (
          <p className="doc-note">You switched careers on the way: verified skills and goals carried over, gap bars reset.</p>
        )}
        <div className="foot num">
          {closeLine}{" "}
          <a className="foot-link" href="/pathway">
            Open your pathway →
          </a>
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
              <p className="band-meta num">As of {asOf}</p>
            </div>
            <div className="band-scale">
              <div className="bandbar num" aria-hidden="true">
                {/* the five channel mini-bar — at rest, honest fractions;
                    the Competencies cards + kickers carry their own receipts */}
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
            {/* the one filled CTA on the page — the band's do-location, the
                Dashboard register; the Plan tab's old closing CTA retires */}
            <a className="cta" href="/pathway">
              Continue your plan →
            </a>
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
              {[state.yearLevel, trackLabelOf(state.track)].filter(Boolean).join(" · ")}
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

/** Earlier-than-fixtures student: no career yet — honest, still dated.
 *  Every tab answers the same truth: the report opens with the career. The
 *  panel rides the Phase-1 card register; the one filled CTA on this state
 *  is the /career picker (the a.cta family button, not the band). */
function UndecidedProfile({ name }: { name: string }) {
  const undecidedPanel = (
    <div className="plancards">
      <div className="card">
        <div className="head">
          <b>Your report opens with your career</b>
          <span>Pick a career first — every number here measures toward it.</span>
        </div>
        <div className="u-cta">
          <a className="cta" href="/career">
            Browse the career index →
          </a>
        </div>
        <div className="foot num">Explore the index — the score, skills, and plan follow your pick.</div>
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
            <span className="label num">Profile report · no career picked yet</span>
            <a className="link-quiet" href="/dashboard">
              Back to dashboard
            </a>
          </footer>
        }
      />
    </div>
  );
}
