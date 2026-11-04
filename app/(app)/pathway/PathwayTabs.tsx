"use client";

import { useState } from "react";
import type { WalkNode, WalkView } from "@/lib/engines/walk";
import "./walk.css";

/**
 * Pathway — MY PLAN (Tier 2d → the 2026-11-03 cutover, user-ruled):
 * the D2 canonical walk IS the surface — the Plan/Resources tabs retire.
 * One fixed path per career (the whole role skill map, O*NET-as-law,
 * core-tier first then catalog order — lib/engines/walk.ts builds it;
 * the path never re-sorts), the student's evidence state overlaying it.
 *
 * The executed presentation is variant-d2 graduated:
 * - Head band card: "Your path to {careerName}", the fact counter
 *   ({closed} of {total} required skills checked — the walk carries the
 *   shared `.band` My-Plan h1 above), and the standing reading line.
 * - One continuous 2px spine down the left, every skill numbered 1..N
 *   continuously, one container card; each row draws its own line
 *   segment (spine geometry in walk.css).
 * - Evidence chips verbatim (`Verified ·✓` / `Checked ·✓✓` / hatched
 *   `Self-reported`); the walk's node circles turn green border only on
 *   a genuine verified/checked close (claimed stays grey — the hatch
 *   chip carries self-report honestly); never red; no animations
 *   (DESIGN.md DNA lock). Blue = action (Start here), amber = the
 *   working-on marker, grey = unmeasured.
 * - The only local write is the working-on marker (hybrid ruling):
 *   open nodes' hollow rings are real buttons (aria-pressed) that turn
 *   amber with a `Working` chip — never a checkmark, never touching
 *   bars/score (persistence decision stays deferred, spec §6).
 * - THE one suggested material per node (engine picker, spec §4): the
 *   authored learn line rides it; the access state folds into the meta
 *   register as one word; the audit lane does NOT render (user ruling).
 * - Honest wait-states distinguish WHICH emptiness: claims exist but
 *   unvetted (audit pending) ≠ no claim at all (adviser line, spec §5).
 * - offPathNote is gone (O*NET law: none exists — the whole map
 *   resolves); the career-preview select was mock chrome (never
 *   shipped); the hash-mockup effect, MockupMount, variant switching,
 *   the tablist toolbar and the old Plan-table/Resources-cards markup
 *   die with the tabs. No `panel-*` ids remain.
 *
 * Smoke hooks: `.q-skill` on the skill names, `.lead-mono` rides the
 * walk head counter, root `.v7plan` retained with the shared `.band`
 * header (h1 "My Plan" + career line — the page band, untouched copy).
 */

/** closed provenance chip wording — verbatim (PathwayTabs register) */
type ClosedState = Exclude<WalkNode["state"], "open">;

const closedChip = (state: ClosedState) => {
  if (state === "claimed") {
    return <span className="vd2-chip vd2-chip-hatch">Self-reported</span>;
  }
  return (
    <span className="vd2-chip vd2-chip-green">
      {state === "verified" ? "Verified ·✓" : "Checked ·✓✓"}
    </span>
  );
};

/* the access-audit chip labels removed (user ruling: the audit lane
   doesn't render) — access folds into the meta line as one word */
const ACCESS_WORD: Record<string, string> = {
  direct: "self-serve",
  account: "free (signup)",
  "exam-paid": "credential paid",
  /* AccessState graduated to lib/types (mockup/access.ts's `paid` and
     `unclassified` are gone): the suggested slot only ever holds the
     self-serve tier, so paidUni never reaches the register in practice */
  paidUni: "paid",
};

/** the undecided cold start — the standing card the tabs already showed */
function defaultElement() {
  return (
    <div className="defaultband">
      <p>Pick a career first — your pathway builds the moment you do.</p>
      <div className="n-cta">
        <a className="btn btn-primary" href="/career">
          Pick a career
        </a>
      </div>
    </div>
  );
}

export default function PathwayTabs({
  careerName,
  undecided,
  walk,
}: {
  careerName: string | null;
  undecided: boolean;
  walk: WalkView | null;
}) {
  /* the working-on marker — component-local only, defaults empty */
  const [working, setWorking] = useState<ReadonlySet<string>>(new Set());
  const toggle = (id: string) =>
    setWorking((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  const showWalk = !undecided && walk;
  const nodes: WalkNode[] = showWalk ? walk.nodes : [];

  /* the up-next steer — the first OPEN node in walk order (header
     option 1: a bare line, no box) */
  const upNext = showWalk
    ? (walk!.nodes.map((n, i) => ({ n, i })).find(({ n }) => n.state === "open") ?? null)
    : null;

  /* the plan-ring's arc: a 0-closed walk renders NO arc at all — a
     zero-length dash reads as a round-cap dot with the register's linecap;
     never a painted zero (2026-11-04 review finding, shared with the
     Prep readiness ring) */
  const closedFr = showWalk && walk!.closed > 0 ? walk!.closed / walk!.total : 0;

  return (
    <div className="v7plan">
      {/* Take 3 header (user ruling 2026-11-04): ONE white card — the
          progress RING is the progress visual (the linear bar retired;
          no illustration), and the up-next steer rides as a bare line
          (option 1 — label + link, nothing boxed). The `.lead-mono` e2e
          guard counter rides the ring mid ("keep a .lead-mono counter
          on the head" — cutover plan §338). The .vd2-standing paragraph
          folded into the meta line. */}
      {showWalk ? (
        <section className="planhead" aria-label="My Plan">
          <div
            className="plan-ring"
            role="img"
            aria-label={`${walk!.closed} of ${walk!.total} required skills checked`}
          >
            <svg viewBox="0 0 130 130" aria-hidden="true">
              <circle className="plan-ring-track" cx="65" cy="65" r="56" strokeWidth="9" />
              {closedFr > 0 && (
                <circle
                  className="plan-ring-arc"
                  cx="65"
                  cy="65"
                  r="56"
                  strokeWidth="9"
                  strokeDasharray={`${Math.round(closedFr * 3519) / 10} 351.9`}
                />
              )}
            </svg>
            <span className="plan-ring-mid num lead-mono">
              <b>
                {walk!.closed}/{walk!.total}
              </b>
              <small>checked</small>
            </span>
          </div>
          <div className="plan-head">
            <h1 className="t">My Plan</h1>
            <p className="m">
              Your path to <b>{careerName}</b> — the walk never re-sorts; your
              state is the overlay.
            </p>
            {upNext && (
              <p className="plan-upnext">
                <span className="plan-uplab">
                  Up next · skill {upNext.i + 1} of {walk!.total}
                </span>
                {upNext.n.material?.url ? (
                  <a href={upNext.n.material.url} target="_blank" rel="noopener noreferrer">
                    {upNext.n.skill} — {upNext.n.material.title}{" "}
                    <span aria-hidden="true">→</span>
                  </a>
                ) : (
                  <span className="plan-upskill">{upNext.n.skill}</span>
                )}
              </p>
            )}
          </div>
        </section>
      ) : (
        <section className="planband" aria-label="My Plan">
          <div className="band">
            <div className="bandrow">
              <div className="who">
                <h1 className="t">My Plan</h1>
                {careerName ? <p className="m">Your path to {careerName}.</p> : null}
              </div>
            </div>
          </div>
        </section>
      )}

      {showWalk ? (
        <>
          {/* THE SPINE — one continuous 2px line down the left; one container
              card holds every node row (the region cards were demolished);
              each row draws its own line segment; the last row ends its
              segment at the node's center. Relation: the walk rows render
              RE-ENFORCED from the engine overlay. */}
          <ol className="vd2-map">
            <li className="vd2-caprow" aria-hidden="true">
              <span className="vd2-cap">Required skills</span>
            </li>
            {nodes.map((node, ni) => {
              const earned =
                node.state === "verified" || node.state === "checked";
              const lastNode = ni === nodes.length - 1;
              return (
                <li
                  key={node.skill}
                  className={`vd2-row${lastNode ? " vd2-end" : ""}`}
                >
                  <span
                    className={`vd2-cir num${earned ? " vd2-cir-earned" : ""}`}
                  >
                    {ni + 1}
                  </span>
                  <div className="vd2-ncard">
                    <div className="vd2-item">
                      <span className="vd2-glyph">
                        {/* closed rows ride their provenance chip; only OPEN
                            rows get the working-on toggle */}
                        {node.state === "open" ? (
                          <button
                            type="button"
                            className="vd2-ring"
                            aria-pressed={working.has(node.skill)}
                            aria-label={`Mark ${node.skill} as working-on`}
                            onClick={() => toggle(node.skill)}
                          />
                        ) : (
                          closedChip(node.state as ClosedState)
                        )}
                      </span>
                      <div className="vd2-main">
                        <span className="vd2-skillrow">
                          <span className="vd2-skill q-skill">{node.skill}</span>
                          {node.core ? <span className="vd2-core">Core</span> : null}
                          {node.state === "open" && working.has(node.skill) ? (
                            <span className="vd2-working">Working</span>
                          ) : null}
                          {node.startHere ? (
                            <span className="vd2-start">Start here</span>
                          ) : null}
                        </span>
                        {node.what ? <span className="vd2-what">{node.what}</span> : null}
                        {node.material ? (
                          <span className="vd2-res num">
                            {node.material.url ? (
                              <a
                                className="vd2-reslink"
                                href={node.material.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {node.material.title}
                                <span className="vd2-ext" aria-hidden="true">
                                  ↗
                                </span>
                              </a>
                            ) : (
                              <span className="vd2-restitle">
                                {node.material.title}
                              </span>
                            )}
                            <span className="vd2-resmeta">
                              {" "}
                              · {node.material.cost} · {node.material.hrs}
                              {node.material.access
                                ? ` · ${ACCESS_WORD[node.material.access]}`
                                : ""}
                            </span>
                          </span>
                        ) : null}
                        {/* the student-facing lane ONLY (user ruling: the audit
                            lane doesn't render): the authored per-claim learn
                            line — why this resource teaches this skill */}
                        {node.material?.learn ? (
                          <span className="vd2-learn">{node.material.learn}</span>
                        ) : null}
                        {/* the teachable wait-state: no taught, self-serve
                            material exists yet (audit pending line) */}
                        {!node.material && node.unvetted > 0 ? (
                          <span className="vd2-nores">
                            Resources exist for this skill but aren&apos;t vetted
                            yet (audit pending).
                          </span>
                        ) : null}
                        {!node.material && node.unvetted === 0 ? (
                          <span className="vd2-nores">
                            No learnable resource vetted for this skill yet — ask
                            your adviser.
                          </span>
                        ) : null}
                        {node.state === "open" && node.noCheck && node.material ? (
                          <span className="vd2-nocheck">No platform check yet</span>
                        ) : null}
                      </div>
                      {/* the personal overlay register — digits stay plain
                          (blue never paints them) */}
                      <span className="vd2-eff num">
                        {node.effect
                          ? `SP ${node.effect.from} → ${node.effect.to} · +${node.effect.to - node.effect.from}`
                          : "—"}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </>
      ) : (
        /* undecided — the standing card (no tabpanel ids: those died with
            the tabs) */
        <section className="card tabpanel">{defaultElement()}</section>
      )}
    </div>
  );
}
