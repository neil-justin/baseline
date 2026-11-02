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
import ScoreSequence from "@/components/ScoreSequence";
import PresenceCard from "./PresenceCard";
import DeclaredCredentials from "./DeclaredCredentials";
import { AccountIdentity, AccountPassword } from "./AccountForms";
import DpaArtifacts from "./DpaArtifacts";
import { fmtEventDate } from "./trajectory";
import "./profile.css";

export const dynamic = "force-dynamic";

/* ── derived display helpers (+ can) ────────────────────────────────────── */

/* persona year+track line ("4th Year, Computer & IT") — the state's new
   vocabulary; the SHS-era gradeLabel()/`grade` is gone (2026-10-30 sweep) */
const yearTrack = (s: { yearLevel: string; track: string }) =>
  [s.yearLevel, trackLabelOf(s.track)].filter(Boolean).join(", ");

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

/* badge voices — the Q6 canon compact forms (Wave 3: the family wording
   `Verified ·✓` / `Checked ·✓✓` / `Self-reported` now that the explanatory
   detail rides the .lcap legend below — the old glyph-first "·✓ VERIFIED
   QUIZ" forms duplicated it); open rows carry the OPEN chip */
function skillBadge(source: BarSource) {
  if (source === "verified") return <span className="chip c-green">Verified ·✓</span>;
  if (source === "checked") return <span className="chip c-green">Checked ·✓✓</span>;
  return <span className="chip c-grey hatch-chip">Self-reported</span>;
}

/* ── trajectory graphic (Plan §5) — RETIRED 2026-11-03 (user call):
   the "Score trajectory" card is deleted ENTIRELY — the band's five-channel
   segbar is the live state; the old §Tier-2 whitespace ruling is moot with
   it (grep receipts recorded in the .lcap/pruning notes) ───────────────── */

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
 *
 * 2026-11-03 user calls: the Plan tab's "Pathway stages" and "Score
 * trajectory" cards, the page footer (.pro-foot), and the tab-strip
 * kickers are deleted — zero replacement (the band's five-channel segbar
 * is the live state); demo-arc.spec.ts carries the e2e port list.
 */
export default async function ProfilePage() {
  const profile = await requireStudent();
  const { state, career, score, ar } = await getStudentView(profile.studentId);
  if (!career || !score) return <UndecidedProfile name={state.name} />;

  const v = scoreView(career, state, ar);
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

  /* Plan tab RETIRED (2026-11-03 user ruling, Tier 2 close-out): the Goals
     card (the tab's sole remaining card) is deleted; the record's goals live
     on Progress, the ranked plan lives on Pathway/Plan, and the band's
     filled CTA is the route out. The goal counters + acceptedOn live only
     here no longer. */

  /* Plan §3/§5 — the "Pathway stages" and "Score trajectory" cards are
     RETIRED (2026-11-03 user calls — zero replacement, nothing folded back);
     the routeLine/milestone counter logic and the closeLine/switched foot
     went with them. The band's "Open your plan →" CTA is the route out. */

  /* header band instrument: the five channel mini-bar (at rest - honest
     fractions) is REMOVED (2026-11-03 Q25=a): the local `.band-scale`/
     `.bandbar` mini-bar retires - the band now carries the SHARED
     ScoreSequence (the Dashboard register), full channel words under the
     bar per the Q23 unit-honesty ruling. */

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
                    <td>{bar ? skillBadge(bar.source) : <span className="chip c-grey">OPEN</span>}</td>
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
                    <span className="chip c-green">Verified ·✓</span>
                  ) : c.status === "claimed" ? (
                    <span className="chip c-grey hatch-chip">Self-reported</span>
                  ) : (
                    <span className="chip c-grey">NOT ASSESSED YET</span>
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
              <span className="chip c-green">Checked ·✓✓ · {c.date.toUpperCase()}</span>
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
          {/* Copy pruning (Tier 2 item 4, 2026-11-03): two one-sentence lines
              only — the third ("declared skills … the audit rules it") was the
              duplicated audit-rules instance; ONE instance survives on the
              declaration form's skill note. */}
          <p>A platform credential appears here only when its check passes.</p>
          <p>Machine-verified presence — no counselor audit; the stamp feeds the Application-Readiness factor.</p>
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

      {/* Data rights — the DPA's two rights as working tools; the deep
          explanations (payload inventory · erase-order chain) are gated
          behind <details> in DpaArtifacts.tsx (2026-11-03 ruling), so the
          card head-sub carries only the law name — "erase removes the whole
          record" duplicated the erase warning in the body and died (the
          erase ×2 → 1 dedupe). */}
      <div className="card">
        <div className="head">
          <b>Data rights</b>
          <span className="num">RA 10173 data-subject rights</span>
        </div>
        <DpaArtifacts />
      </div>
    </div>
  );

  return (
    <div className="v7profile">
      <section className="proband" aria-label="Profile">
        <div className="band">
          <div className="bandrow">
            <div className="who">
              <h1 className="t">Profile</h1>
              {identity}
              <p className="band-meta num">As of {asOf}</p>
            </div>
            {/* the SHARED band instrument (Q25=a): Dashboard parity — the score
                counts up, the five-channel bar arms after it settles, and the
                labels carry FULL channel words with slash values (Q23
                unit-honesty ruling — never the SP/ES/TP acronyms). AR reads
                honest when unmeasured. */}
            <ScoreSequence
              score={score.total}
              parts={v.parts}
              labels={[
                `Skill progress ${v.sp}/${WEIGHTS.sp}`,
                `Employability ${v.es}/${WEIGHTS.es}`,
                `Training ${v.tp}/${WEIGHTS.tp}`,
                v.arMeasured ? `App readiness ${score.ar}/${WEIGHTS.ar}` : "App readiness —",
                `Career direction ${v.cc}/${WEIGHTS.cc}`,
              ]}
              suffix={
                v.ccFirstDone || v.arMeasured || v.stageOne.done > 0
                  ? ""
                  : " · your starting line"
              }
              ratemsg="Computed from your own records · NACE-aligned"
              fine={
                <>
                  You&apos;re <b className="num">{score.total}%</b> ready for{" "}
                  {career.name}; {v.closed} bars already counted.
                </>
              }
            />
            {/* the one filled CTA on the page — the band's do-location, the
                Dashboard register; the Plan tab's old closing CTA retires */}
            <a className="cta" href="/pathway">
              Open your plan →
            </a>
          </div>
        </div>
      </section>

      <ProfileTabs
        panels={{
          competencies: competenciesPanel,
          profile: credentialsPanel,
          account: accountPanel,
        }}
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
              <h1 className="t">Profile</h1>
              <p className="band-id num">{name} · no career picked yet</p>
            </div>
          </div>
        </div>
      </section>
      <ProfileTabs
        panels={{
          competencies: undecidedPanel,
          profile: undecidedPanel,
          account: undecidedPanel,
        }}
      />
    </div>
  );
}
