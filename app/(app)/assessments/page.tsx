import type { Metadata } from "next";
import { getStudentView } from "@/lib/db";
import { requireStudent } from "@/lib/session";
import { scoreView } from "@/lib/engines/rubric";
import { ASSESSED_COMPETENCIES, WEIGHTS, roundHalfDown } from "@/lib/engines/score";
import { SKILL_BANKS, getSkillLadder } from "@/lib/fixtures/skill-banks";
import { fmtEventDate } from "@/lib/fmt";
import { skillDisplay } from "@/lib/skill-display";
import type { DemoEventKind } from "@/lib/types";
import { ArrowRight, Check, CheckCheck } from "lucide-react";
import AssBandArt from "./BandArt";
import AssessSittingGate from "./mockups/SittingGate";
import "./assessments.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Assessments — Baseline",
  description:
    "Two instruments, one place: the career-agnostic NACE competency check and the role-based skill verification. Latest attempt counts — a re-take replaces it, never best-ever.",
};

/* The events that mean "new evidence landed" — the NACE card's caption
   counts them against the latest attempt stamp. `goal-set` and
   `career-switched` are plan moves, not evidence; `check-failed` and
   `scored` add no item. `credential-added` in the brief is the credential
   store's write path; the state event that records it is `presence-stamped`
   (ticket 12) plus the `check-passed` that unlocks a platform credential. */
const NEW_EVIDENCE: ReadonlySet<DemoEventKind> = new Set([
  "bar-closed",
  "check-passed",
  "presence-stamped",
]);

/**
 * The band's drawn imagery — moved to `./BandArt` (the source of truth the
 * page skeleton and the mockup realm mirror).
 */

/**
 * /assessments — the hub + context round (user ruling 2026-11-04).
 *
 * The tab holds EXACTLY TWO instrument cards:
 *   1. NACE competency instrument — career-agnostic, always live: the
 *      latest attempt stamp, the Employability read, "n of 7 verified",
 *      the new-evidence caption, and the primary re-take.
 *   2. Role-based skill verification — coverage-gated: the whole-battery
 *      primary first (one sitting drawing banked questions across the
 *      student's self-reported skills, mirroring OB-3b's draw ≤5), then
 *      the per-skill rows as the targeted re-check.
 *
 * The band is a NAMED band only (h1 + the m-line) — no ScoreSequence, no
 * composite: the hub carries no score of its own (ruling 6).
 *
 * CTA POSTURE (this build round only): every instrument control is
 * register-styled but INERT — `aria-disabled` + the title "wires up in the
 * build round" — until the deep-link/overlay work lands. No cooldowns, no
 * fake verdicts: the chips read engine truth.
 *
 * Comprehension checks are OUT of this tab (ruling 7) — they live on
 * My Plan · Record. A per-skill row therefore offers exactly one of four
 * honest states on the post-claim vocabulary (2026-11-06: the "claimed"
 * concept is deleted — a confident skill is simply UNVERIFIED):
 *   verified / checked (silent) · unverified with a banked ladder
 *   (Verify link) · not-offered, i.e. unverified with no instrument
 *   (dashed idle + No check yet — legacy only; all live roles have
 *   ladders) · a bare-open career skill without a bar is also unverified.
 */
export default async function AssessmentsPage() {
  const profile = await requireStudent();
  const { state, career, ar } = await getStudentView(profile.studentId);

  /* The NACE read is career-agnostic, so it survives a cold start (no
     career picked). With a career the engine's own view is authoritative;
     without one the ES channel is still the same recorded formula —
     30 × verified ÷ 7 — never an invented number. */
  const v = career ? scoreView(career, state, ar) : null;
  const esVerified = v
    ? v.esVerified
    : Object.values(state.competencies ?? {}).filter((c) => c === "verified").length;
  const es = v ? v.es : roundHalfDown((WEIGHTS.es * esVerified) / ASSESSED_COMPETENCIES);

  const takenAt = state.assessment?.takenAt;
  const newSince = takenAt
    ? state.events.filter((e) => NEW_EVIDENCE.has(e.kind) && e.date > takenAt).length
    : 0;

  /* Role card — the bank keys on the canonical `catalogSkill` name, so one
     banked skill serves every role that maps to it (backlog §3). The rows
     sort closed-first, then actionable unverified rows (an instrument
     exists — ladder first, legacy quiz), then the not-offered remainder;
     catalog order holds inside each group. */
  const banked = new Map(SKILL_BANKS.map((q) => [q.catalogSkill, q]));
  const rows = (career?.skills ?? []).map((spec) => {
    const source = state.bars[spec.name]?.source ?? null;
    return {
      spec,
      /* a historical `claimed` bar (pre-2026-11-06 data) reads as simply
         unverified — the state vocabulary on this surface is verified |
         checked | unverified | not-offered */
      unverified: source !== "verified" && source !== "checked",
      instrument: getSkillLadder(spec.name) ? "ladder" : banked.get(spec.name) ? "quiz" : null,
      source,
    };
  });
  const rank = (r: (typeof rows)[number]) =>
    r.unverified
      ? r.instrument
        ? 2
        : 3
      : r.source === "verified"
        ? 0
        : 1;
  const sorted = [...rows].sort((a, b) => rank(a) - rank(b));

  const toVerify = rows.filter((r) => r.unverified && r.instrument);
  const notOffered = rows.filter((r) => r.unverified && !r.instrument);
  const proven = rows.filter((r) => r.source === "verified" || r.source === "checked").length;

  return (
    <div className="v7ass">
      {/* the named band — copy is the locked user-facing contract; the
          drawn checksheet leads the identity cluster, Dashboard's gauge /
          Profile's seal / Prep's ring slot on this surface. */}
      <header className="band">
        <div className="bandrow">
          <div className="who">
            <AssBandArt />
            <div>
              <h1 className="t">Assessments</h1>
              <p className="m">
                Prove something again — latest attempt counts, a re-take replaces it, never
                best-ever.
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="asscards">
        {/* CARD 1 — the NACE competency instrument (career-agnostic) */}
        <section className="card" aria-labelledby="ass-nace-head">
          <div className="head">
            <b id="ass-nace-head">NACE competency instrument</b>
          </div>

          <div className="nace-facts num">
            <div className="nfact">
              <span className="nlabel">Employability</span>
              <span className="nval">
                {es} <small>of {WEIGHTS.es}</small>
              </span>
            </div>
            <div className="nfact">
              <span className="nlabel">Verified</span>
              <span className="nval">
                {esVerified} <small>of {ASSESSED_COMPETENCIES}</small>
              </span>
            </div>
          </div>

          <div className="lcap num">
            <p>
              {takenAt
                ? `Latest attempt, ${fmtEventDate(takenAt)}.`
                : "Not assessed yet — the instrument is always open."}
            </p>
            {takenAt && newSince > 0 && (
              <p>
                {newSince} new {newSince === 1 ? "item" : "items"} since {fmtEventDate(takenAt)}.
              </p>
            )}
          </div>

          <div className="cta-row">
            <a className="cta" href="/assessment">
              {takenAt ? "Re-take the assessment" : "Take the assessment"}{" "}
              <ArrowRight size={15} aria-hidden="true" />
            </a>
          </div>
        </section>

        {/* CARD 2 — role-based skill verification (coverage-gated) */}
        <section className="card" aria-labelledby="ass-role-head">
          <div className="head">
            <b id="ass-role-head">Role-based skill verification</b>
            <span className="num">
              {career
                ? `${career.name}, ${proven} of ${career.skills.length} skills proven`
                : "no career picked yet"}
            </span>
          </div>

          {/* the whole-battery primary — one sitting draws instruments
              across the student's unverified skills, the OB-3b draw ≤5
              pattern */}
          {!career ? (
            <div className="battery gated">
              <div className="battery-copy">
                <div className="battery-t">Whole-battery check</div>
                <div className="battery-sub num">
                  Pick a career first — the check runs against your target.
                </div>
              </div>
              <a className="cta" href="/career">
                Browse the career index <ArrowRight size={15} aria-hidden="true" />
              </a>
            </div>
          ) : toVerify.length === 0 ? (
            <div className="battery gated">
              <div className="battery-copy">
                <div className="battery-t">Whole-battery check</div>
                <div className="battery-sub num">
                  {proven === career.skills.length
                    ? "All skills verified or checked — nothing to re-take."
                    : notOffered.length > 0
                      ? "The rest of your skills have no check yet — they stay as your own rating."
                      : "Nothing unverified on this role right now."}
                </div>
              </div>
            </div>
          ) : (
            <div className="battery">
              <div className="battery-copy">
                <div className="battery-t">Whole-battery check</div>
                <div className="battery-sub num">
                  {proven} of {career.skills.length} skills proven — one sitting covers the rest,
                  up to five skills per round.
                </div>
              </div>
              <a className="cta" href="/verify">
                Take the role-based assessment <ArrowRight size={15} aria-hidden="true" />
              </a>
            </div>
          )}

          {career && (
            <>
              <div className="rows-label">Per-skill checks</div>
              <div className="skillrows">
                {sorted.map(({ spec, unverified, instrument, source }) => {
                  if (!unverified) {
                    return (
                      <div className="skillrow closed" key={spec.name}>
                        <div className="s-main">
                          <span className="s-name">{skillDisplay(spec.name)}</span>
                        </div>
                        <div className="s-side">
                          <span className="chip c-green">
                            {source === "verified" ? (
                              <>
                                Verified <Check size={11} aria-hidden="true" />
                              </>
                            ) : (
                              <>
                                Checked <CheckCheck size={11} aria-hidden="true" />
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  }

                  if (instrument) {
                    return (
                      <div className="skillrow" key={spec.name}>
                        <div className="s-main">
                          <span className="s-name">{skillDisplay(spec.name)}</span>
                        </div>
                        <div className="s-side">
                          <a className="ass-quiz" href={`/verify?skill=${encodeURIComponent(spec.name)}`}>
                            Verify
                          </a>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className="skillrow idle" key={spec.name}>
                      <div className="s-main">
                        <span className="s-name">{skillDisplay(spec.name)}</span>
                      </div>
                      <div className="s-side">
                        <span className="chip c-grey">No check yet</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {career && (
            <div className="foot num">
              Verified ✓ / Checked ✓✓ = passed a check · Unverified = not checked yet.
            </div>
          )}
        </section>
      </div>

      {/* the mockup realm — hash-gated (#mockups), client-only; the shipped
          page renders byte-unchanged without the hash. The lite facts ride
          in engine-true — the realm never repaints a computed value. */}
      <AssessSittingGate
        lite={{
          es,
          esVerified,
          takenAt: takenAt ? fmtEventDate(takenAt) : null,
          careerName: career?.name ?? null,
          proven,
          total: career?.skills.length ?? 0,
          claimed: rows.length - proven,
          bankedClaimed: toVerify.length,
          rows: sorted.map((r) => ({
            name: r.spec.name,
            /* the mockup realm keeps its own richer vocabulary; the live
               page maps everything unverified (open or historical
               `claimed`) onto "open" there */
            state: (r.unverified ? "open" : r.source) as
              | "verified"
              | "checked"
              | "claimed"
              | "open",
            banked: !!r.instrument,
          })),
        }}
      />
    </div>
  );
}
