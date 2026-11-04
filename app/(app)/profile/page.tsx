import type { Metadata } from "next";
import type { BarSource } from "@/lib/types";
import { getStudentView } from "@/lib/db";
import { requireStudent } from "@/lib/session";
import { scoreView } from "@/lib/engines/rubric";
import { WEIGHTS } from "@/lib/engines/score";
import { skillsFor } from "@/lib/engines/gaps";
import { presenceMeasured } from "@/lib/engines/air";
import { RESOURCES } from "@/lib/fixtures/resources";
import { INSTRUMENT } from "@/lib/fixtures/instrument";
import { CAREERS } from "@/lib/fixtures/catalog";
import { credentialStore, credentialsPersistenceNotice } from "@/lib/db/credential-store";
import ProfileTabs from "./ProfileTabs";
import ScoreSequence from "@/components/ScoreSequence";
import PresenceCard from "./PresenceCard";
import DeclaredCredentials from "./DeclaredCredentials";
import { AccountIdentity, AccountPassword } from "./AccountForms";
import DpaArtifacts from "./DpaArtifacts";
import { fmtEventDate } from "@/lib/fmt";
import { ArrowRight, Check, CheckCheck } from "lucide-react";
import "./profile.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Profile — Baseline",
};

/* badge voices — the family compact forms (`Verified ·✓` / `Checked ·✓✓` /
   `Self-reported`); open rows carry the OPEN chip */
function skillBadge(source: BarSource) {
  if (source === "verified") return <span className="chip c-green">Verified <Check size={11} aria-hidden="true" /></span>;
  if (source === "checked") return <span className="chip c-green">Checked <CheckCheck size={11} aria-hidden="true" /></span>;
  return <span className="chip c-grey hatch-chip">Self-reported</span>;
}

/* the Program dropdown's vocabulary — the SAME tokens /career's degree gate
   matches against (the raw degreeMap codes, annotations stripped). Tier
   lines ("any CHED canon program") are not programs and drop out. */
const canonPrograms = (() => {
  const set = new Set<string>();
  for (const c of CAREERS) {
    for (const d of c.degreeMap ?? []) {
      if (/canon|open-door/i.test(d) || /^any /.test(d.trim())) continue;
      const name = d.replace(/\(.*?\)/g, "").trim();
      if (name) set.add(name);
    }
  }
  return [...set].sort();
})();

/* ── page ───────────────────────────────────────────────────────────────── */

/**
 * /profile — the 2026-11-03 revamp, folded in from the validated mockup:
 * the band rides Dashboard's recipe (name · year / Target line / the shared
 * ScoreSequence with the SP/ES/TP/AR/CC acronym labels, no CTA);
 * Competencies is TWO cards (skills table with the badge in the Source
 * column · the NACE assessment); Credentials is TWO cards (the unified
 * ledger — platform rows, the machine-verified presence stamp, the declared
 * entries and the "Declare a credential" centered modal — and the
 * Professional presence declaration card); Account is Identity plus a
 * Security/Data-rights two-column row. `#tab-profile` → `#panel-profile`
 * carries Credentials (the legacy hook id — the e2e contract; the visible
 * label reads "Credentials").
 */
export default async function ProfilePage() {
  const profile = await requireStudent();
  const { state, career, score, ar } = await getStudentView(profile.studentId);
  if (!career || !score) return <UndecidedProfile name={state.name} yearLevel={state.yearLevel} />;

  const v = scoreView(career, state, ar);

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

  /* the instrument's 7 competency titles (verbatim from the approved bank) —
     verified ·✓ vs claimed per competency */
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
     verified, never counselor-audited. */
  const presence = state.presence ?? null;
  const presenceMeasuredNow = presenceMeasured(presence);

  /* the head count names every kind it merges — no ambiguous "earned" */
  const declaredPending = declaredRows.filter((r) => r.status === "declared").length;
  const declaredVerified = declaredRows.filter((r) => r.status === "verified").length;
  const platformCount = credentialRows.length;

  const competenciesPanel = (
    <div className="plancards">
      <div className="card">
        <div className="head">
          <b>Skills for this career</b>
          <span className="num">
            {skVerified} verified, {skChecked} checked, {skClaimed} self-reported
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
                <th scope="col" className="col-src">Source</th>
              </tr>
            </thead>
            <tbody>
              {skillRows.map((skill) => {
                const bar = state.bars[skill];
                return (
                  <tr key={skill}>
                    <td>
                      <div className="item">{skill}</div>
                    </td>
                    <td className="col-src">{bar ? skillBadge(bar.source) : <span className="chip c-grey">OPEN</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <div className="head">
          <b>NACE assessment</b>
          <span className="num">
            {state.assessment ? `Latest attempt, ${fmtEventDate(state.assessment.takenAt)}` : "Not assessed yet"}
          </span>
        </div>
        <div className="lcap num">
          <p>Employability, {v.es} of {WEIGHTS.es}</p>
          <p>{v.esVerified} of 7 NACE competencies verified <Check size={11} aria-hidden="true" /></p>
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
                    <span className="chip c-green">Verified <Check size={11} aria-hidden="true" /></span>
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
            Re-take the assessment <ArrowRight size={14} aria-hidden="true" />{" "}
          </a>
        </div>
      </div>
    </div>
  );

  const credentialsPanel = (
    <div className="plancards">
      {/* CARD 1 — the ledger: every credential source, one register */}
      <div className="card">
        <div className="head">
          <b>Credentials</b>
          <span className="num">
            {platformCount} platform, {declaredVerified} verified, {declaredPending} awaiting audit, presence{" "}
            {presenceMeasuredNow ? <Check size={11} aria-hidden="true" /> : "—"}
          </span>
        </div>
        {platformCount === 0 && !presence && declaredRows.length === 0 && (
          <p className="lcap num">
            None yet — your route&apos;s first credential appears the moment its check passes.
          </p>
        )}
        <div className="ledger">
          {/* the presence stamp row — the FOURTH kind (ticket 12); the chip
              carries NO date — the stamp date rides the provenance line */}
          {presence && presence.stamp && (
            <div className="lrow" data-presence-row>
              <span className={`ms${presenceMeasuredNow ? " done" : ""}`} aria-hidden="true">
                {presenceMeasuredNow ? "verified" : "block"}
              </span>
              <b>Professional presence — LinkedIn</b>
              {presenceMeasuredNow ? (
                <span className="chip c-green" data-presence-stamp="MACHINE-VERIFIED">
                  MACHINE-VERIFIED
                </span>
              ) : (
                <span className="chip c-grey">DECLARED — NOT YET MEASURED</span>
              )}
              <span className="lsub num" data-presence-sub>
                {presence.linkedinUrl}, {presence.email}, stamped{" "}
                {fmtEventDate(presence.stamp.verifiedAt)}
                {presence.stamp.offline ? ", stamped offline — no network look-up ran" : ""}
                {presence.stamp.checks.linkedinUrlFormat === "fail" ? ", URL format failed" : ""}
                {presence.stamp.checks.professionalEmailFormat === "fail" ? ", email format failed" : ""}
                {presence.stamp.contentNote ? `, ${presence.stamp.contentNote}` : ""}
              </span>
            </div>
          )}
          {/* platform check-passed rows (the M9 gate — a row only when its
              comprehension check passed); the chip carries NO date — the
              date rides the provenance line */}
          {credentialRows.map((c, i) => (
            <div className="lrow" key={i}>
              <span className="ms done" aria-hidden="true">
                task_alt
              </span>
              <b>{c.title}</b>
              <span className="chip c-green">Checked <CheckCheck size={11} aria-hidden="true" /></span>
              <span className="lsub num">
                {c.provider ? `${c.provider}, ${c.free ? "free" : "paid"}, ` : ""}
                check passed {c.date}, counted when its comprehension check passed
              </span>
            </div>
          ))}
          {/* declared entries — the counselor-audited kinds render through
              the same .lrow register (client ledger source + entry modal) */}
          <DeclaredCredentials
            rows={declaredRows}
            skillVocabulary={allSkills}
            persistence={persistence}
          />
        </div>
        <div className="lcap num">
          <p>A platform credential appears here only when its check passes.</p>
          <p>Machine-verified presence — no counselor audit; the stamp feeds the Application-Readiness factor.</p>
        </div>
      </div>

      {/* CARD 2 — presence: its own card, no longer an inset of the ledger */}
      <div className="card">
        <div className="head">
          <b>Professional presence</b>
          <span className="num">machine-verified at declaration — offline format checks only</span>
        </div>
        <PresenceCard
          declared={
            presence?.stamp
              ? { linkedinUrl: presence.linkedinUrl, email: presence.email }
              : null
          }
        />
      </div>
    </div>
  );

  const accountPanel = (
    <div className="plancards">
      <div className="card">
        <div className="head">
          <b>Identity</b>
          <span className="num">self-service, campus fixed: {profile.campus}</span>
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
          programs={canonPrograms}
        />
      </div>

      {/* Security + Data rights share one row; the grid collapses to one
          column on narrow screens */}
      <div className="acct-duo">
        <div className="card">
          <div className="head">
            <b>Security</b>
            <span className="num">current password required, same policy sign-up enforced</span>
          </div>
          <AccountPassword />
        </div>

        <div className="card">
          <div className="head">
            <b>Data rights</b>
            <span className="num">RA 10173 data-subject rights</span>
          </div>
          <DpaArtifacts />
        </div>
      </div>
    </div>
  );

  return (
    <div className="v7profile">
      {/* the band, Dashboard's recipe: name · year / Target / score */}
      <section className="scoreband" aria-label="Profile">
        <div className="band">
          <div className="bandrow">
            <div className="who">
              {/* D2 parity figure — the drawn INITIALS SEAL (user ruling
                  2026-11-04): the profile band's imagery is identity, not a
                  gauge; it leads the band's left cluster and reads the
                  student's own initials off state. */}
              <BandSeal name={state.name} />
              <div>
                <h1 className="t">
                  {state.name}, {state.yearLevel}
                </h1>
                <div className="m">Target: {career.name}</div>
              </div>
            </div>
            {/* the SHARED band instrument (Dashboard parity): the score
                counts up, the five-channel bar arms after it settles, and
                the labels carry the channel acronyms with slash values. AR
                reads honest when unmeasured. No CTA — the score readout is
                the band's whole do-area. */}
            <ScoreSequence
              score={score.total}
              channels={[
                { name: "Skill progress", value: `${score.sp}/${WEIGHTS.sp}`, fill: score.sp / WEIGHTS.sp },
                { name: "Employability skills", value: `${score.es}/${WEIGHTS.es}`, fill: v.es / WEIGHTS.es },
                { name: "Training progress", value: `${score.tp}/${WEIGHTS.tp}`, fill: score.tp / WEIGHTS.tp },
                {
                  name: "Application readiness",
                  value: v.arMeasured ? `${score.ar}/${WEIGHTS.ar}` : "—",
                  fill: v.arMeasured && score.ar !== null ? score.ar / WEIGHTS.ar : null,
                },
                { name: "Career clarity", value: `${score.cc}/${WEIGHTS.cc}`, fill: score.cc / WEIGHTS.cc },
              ]}
              suffix={
                v.ccFirstDone || v.arMeasured || v.stageOne.done > 0
                  ? ""
                  : " — your starting line"
              }
              ratemsg="Computed from your own records, NACE-aligned"
              fine={
                <>
                  You&apos;re <b className="num">{score.total}%</b> ready for{" "}
                  {career.name}; {v.closed} bars already counted.
                </>
              }
            />
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

/**
 * The band's drawn imagery (user ruling 2026-11-04): a circular INITIALS
 * SEAL — the profile-tab identity figure, the same structural slot the
 * Dashboard band gives its readiness gauge. Drawn, not photographed: a
 * hatch-etched outer ring, a solid inner disc, and the student's initials
 * in the family's Google Sans register. aria-hidden — the name already
 * reads aloud in the band's h1.
 */
function BandSeal({ name }: { name: string }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "?";
  const cx = 50;
  const cy = 50;
  // hatch marks ride the ring band between the two circles (the family
  // repeating-linear-gradient etch, drawn as SVG so it scales as ink)
  const hatchMarks = Array.from({ length: 28 }, (_, i) => {
    const a = (i / 28) * Math.PI * 2;
    return (
      <line
        key={i}
        x1={cx + 40 * Math.cos(a)}
        y1={cy + 40 * Math.sin(a)}
        x2={cx + 44 * Math.cos(a)}
        y2={cy + 44 * Math.sin(a)}
        stroke="var(--v-rows)"
        strokeWidth="2"
      />
    );
  });
  return (
    <svg className="bandseal" viewBox="0 0 100 100" role="img" aria-hidden="true">
      <circle cx={cx} cy={cy} r={46} fill="var(--v-surface)" stroke="var(--v-border)" strokeWidth="1.5" />
      {hatchMarks}
      <circle cx={cx} cy={cy} r={34} fill="var(--v-blue-wash)" stroke="var(--v-border)" strokeWidth="1.5" />
      <text
        x={cx}
        y={cy + 1}
        textAnchor="middle"
        dominantBaseline="central"
        className="bandseal-ink"
        fill="var(--v-blue-deep)"
      >
        {initials}
      </text>
    </svg>
  );
}

/** Earlier-than-fixtures student: no career yet — honest. No tab strip
 *  (tabs were decorative on this state): one band + one card, the one
 *  filled CTA the /career picker. */
function UndecidedProfile({ name, yearLevel }: { name: string; yearLevel: string }) {
  return (
    <div className="v7profile">
      <section className="scoreband" aria-label="Profile">
        <div className="band">
          <div className="bandrow">
            <div className="who">
              <BandSeal name={name} />
              <div>
                <h1 className="t">
                  {name}, {yearLevel}
                </h1>
                <div className="m">no career picked yet</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="plancards">
        <div className="card">
          <div className="head">
            <b>Your report opens with your career</b>
            <span>Pick a career first — every number here measures toward it.</span>
          </div>
          <div className="u-cta">
            <a className="cta" href="/career">
              Browse the career index <ArrowRight size={14} aria-hidden="true" />{" "}
            </a>
          </div>
          <div className="foot num">Explore the index — the score, skills, and plan follow your pick.</div>
        </div>
      </div>
    </div>
  );
}
