"use client";

import { useState } from "react";
import {
  type CanonProps,
  type CanonSection,
  type PathNode,
} from "./canon";
import "./variant-d1.css";

/**
 * Variant D1 — "two-lane single spine" (post-defense content-structure
 * mockup; user-ruled 2026-11-03: "My Plan shows the fixed canonical
 * path and the student's evidence overlays it — the path never re-sorts").
 * ONE continuous spine walks the CANONICAL curriculum in D1's flatten
 * order (different from canon.ts's section order — see WALK_ORDER):
 * regulated floor skills → recommended → optional → the certification
 * gate and entry milestones TERMINATE the walk. Rulings carried here:
 * 1. Personal status is OVERLAY only — it colors chips/register and the
 *    Start-here pointer; it never re-sorts nodes, never drops sections
 *    (empty sections render their honest one-line state), and the SP
 *    projection register rides detached (12px ink2) so the spine never
 *    reads gap-ranked.
 * 2. Engine state is READ-ONLY (canon.ts); color canon: blue = action
 *    (Start here, focus), green = verified/earned (chips, done-node
 *    borders), amber = the local working-on marker, grey = unmeasured /
 *    self-report hatch. Never red; no washes as region fills; no
 *    animations/transitions/keyframes (DNA lock).
 * 3. The ONLY local write is the working-on marker (user ruling
 *    2026-11-03, hybrid): the open row's hollow ring is a real button
 *    (aria-pressed) that turns amber (border + dot) with a `Working`
 *    chip after the name. Never a checkmark; touches no chips, counters
 *    or SP. Closed rows are NOT buttons — their chip is the state.
 * 4. The two lanes: required skill rows render solid; non-required rows
 *    (recommended + optional SECTION ids) render the quiet lane — one
 *    consistent 1.5px dashed card outline + a grey `Optional` tag, name
 *    kept full ink (never faded below AA). Lane membership keys off the
 *    section id, NOT PathNode.required (canon hard-sets it true — see
 *    report).
 * 5. Node borders carry the NODE's own state honestly (verified/checked
 *    → green; claimed/open/milestone → spine grey; the hatch chip rides
 *    in the row). Skills number continuously 1..N; milestones keep the
 *    uniform circle and announce their kind in-row (PROOF / ENTRY).
 * 6. Milestones never render a progress bar, percentage or aggregate
 *    claim; their covered skills wear REAL state chips ONLY where
 *    genuinely closed — open ones stay plain names.
 */

/* D1's flatten order: the gate + entry milestones terminate the walk */
const WALK_ORDER = ["floor", "recommended", "optional", "gate", "entry"] as const;

export default function MockupLane({
  careerName,
  closedCount,
  totalSkills,
  offPathNote,
  sections,
}: { careerName: string } & CanonProps) {
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

  if (sections.length === 0) return null;

  /* flatten: canon's section order → D1's walk order (deterministic;
     canon always builds all five sections, filtered for safety) */
  const byId = new Map(sections.map((s) => [s.id, s] as const));
  const walk = WALK_ORDER.map((id) => byId.get(id)).filter(
    (s): s is CanonSection => s !== undefined
  );

  /* skill-state lookup — the milestones' covered-skills receipts read
     the floor's REAL state (floor always precedes gate/entry in D1) */
  const stateByLabel = new Map<string, PathNode["state"]>();
  for (const s of walk) {
    for (const n of s.nodes) {
      if (n.kind === "skill") stateByLabel.set(n.label, n.state);
    }
  }

  /* the regulated tags actually resolved on this map — the honest
     empty-state line is derived from data, never invented per career
     (demo account: 13 PSF skills → "None — every skill on this map
     comes from a regulated source (PSF).") */
  const tags = [
    ...new Set(
      walk
        .flatMap((s) => s.nodes)
        .filter((n) => n.kind === "skill" && n.sourceTag)
        .map((n) => n.sourceTag as string)
    ),
  ].sort();
  const emptySkillLine =
    tags.length > 0
      ? `None — every skill on this map comes from a regulated source (${tags.join("/")}).`
      : "None on this map yet.";

  /* the per-section receipt — skill sections carry canon's node-derived
     closed/total (skill checkpoints only); milestones count their own
     kind and never claim checkpoint progress (gate/entry closed/total
     are 0 by canon contract) */
  const receipt = (s: CanonSection) => {
    if (s.id === "gate") {
      const n = s.nodes.length;
      return `${n} PROOF ${n === 1 ? "MILESTONE" : "MILESTONES"}`;
    }
    if (s.id === "entry") {
      const n = s.nodes.length;
      return `${n} ENTRY ${n === 1 ? "MILESTONE" : "MILESTONES"}`;
    }
    return `${s.closed} OF ${s.total} CLOSED`;
  };

  /* the canonical provenance chips (PathwayTabs wording, verbatim) */
  const chip = (state: PathNode["state"]) => {
    if (state === "verified") {
      return <span className="vdl-chip vdl-chip-green">Verified ·✓</span>;
    }
    if (state === "checked") {
      return <span className="vdl-chip vdl-chip-green">Checked ·✓✓</span>;
    }
    return <span className="vdl-chip vdl-chip-grey">Self-reported</span>;
  };

  /* the flat walk: caption rows + node rows; skills number
     continuously 1..N across the whole walk; the LAST row carries the
     spine's terminus stop */
  const rows: Array<
    | { key: string; kind: "cap"; section: CanonSection }
    | { key: string; kind: "skill"; node: PathNode; num: number; quiet: boolean }
    | { key: string; kind: "milestone"; node: PathNode }
  > = [];
  let num = 0;
  for (const section of walk) {
    rows.push({ key: `cap:${section.id}`, kind: "cap", section });
    for (const node of section.nodes) {
      if (node.kind === "skill") {
        num += 1;
        /* quiet lane = non-required SECTION (canon's per-node
           `required` flag is hard-true — keyed off the section id) */
        const quiet = section.id === "recommended" || section.id === "optional";
        rows.push({ key: node.id, kind: "skill", node, num, quiet });
      } else {
        rows.push({ key: node.id, kind: "milestone", node });
      }
    }
  }

  return (
    <div className="v7mock-d1">
      {/* surface head — band-card register: named h2, the standing
          fixed-walk message, the lead counter (draft copy tone) */}
      <section className="vdl-band">
        <div>
          <h2>Your path to {careerName}</h2>
          <p className="vdl-note">
            One walk, fixed for the role — your state is the overlay, the
            path never re-sorts.
          </p>
          {offPathNote ? <p className="vdl-note">{offPathNote}</p> : null}
        </div>
        <span className="vdl-lead num">
          <b>{closedCount}</b> of {totalSkills} skills checked
        </span>
      </section>

      {/* THE SPINE — caption rows ride the line as bare tracked labels
          with receipts; node rows ride it as white cards; together the
          segments read as ONE continuous walk to the terminus */}
      <ol className="vdl-list">
        {rows.map((row, i) => {
          const terminus = i === rows.length - 1;

          if (row.kind === "cap") {
            const section = row.section;
            return (
              <li
                key={row.key}
                className={`vdl-row vdl-caprow${terminus ? " vdl-terminus" : ""}`}
              >
                <div className="vdl-caphead">
                  <span className="vdl-cap">{section.title}</span>
                  <span className="vdl-receipt num">{receipt(section)}</span>
                </div>
                <p className="vdl-blurb">{section.blurb}</p>
                {section.nodes.length === 0 ? (
                  <p className="vdl-empty">
                    {section.id === "gate" || section.id === "entry"
                      ? "None on this map yet."
                      : emptySkillLine}
                  </p>
                ) : null}
              </li>
            );
          }

          const node = row.node;
          const open = node.state === "open";
          const isWorking = open && working.has(node.id);

          if (row.kind === "skill") {
            return (
              <li
                key={row.key}
                className={`vdl-row vdl-noderow${terminus ? " vdl-terminus" : ""}`}
              >
                <span
                  className={`vdl-node num${
                    node.state === "verified" || node.state === "checked"
                      ? " vdl-node-done"
                      : ""
                  }`}
                >
                  <span className="vdl-vh">Checkpoint&nbsp;</span>
                  {row.num}
                </span>
                <section
                  className={`vdl-card vdl-grid${row.quiet ? " vdl-quiet" : ""}`}
                >
                  <span className="vdl-glyph">
                    {/* closed rows ride their provenance chip; only OPEN
                        rows get the working-on toggle */}
                    {!open ? (
                      chip(node.state)
                    ) : (
                      <button
                        type="button"
                        className="vdl-ring"
                        aria-pressed={isWorking}
                        aria-label={`Mark ${node.label} as working`}
                        onClick={() => toggle(node.id)}
                      />
                    )}
                  </span>
                  <div className="vdl-main">
                    <span className="vdl-namerow">
                      <span className="vdl-skill">{node.label}</span>
                      {row.quiet ? (
                        <span className="vdl-opt">Optional</span>
                      ) : null}
                      {isWorking ? (
                        <span className="vdl-working">Working</span>
                      ) : null}
                      {node.startHere ? (
                        <span className="vdl-start">Start here</span>
                      ) : null}
                    </span>
                    {node.what ? (
                      <span className="vdl-what">{node.what}</span>
                    ) : null}
                    {open ? (
                      node.suggestion ? (
                        <span className="vdl-res">
                          {node.suggestion.url ? (
                            <a
                              className="vdl-reslink"
                              href={node.suggestion.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {node.suggestion.title}
                              <span className="vdl-ext" aria-hidden="true">
                                ↗
                              </span>
                            </a>
                          ) : (
                            <span className="vdl-restitle">
                              {node.suggestion.title}
                            </span>
                          )}
                          <span className="vdl-resmeta num">
                            {" "}
                            · {node.suggestion.cost} · {node.suggestion.hrs}
                          </span>
                        </span>
                      ) : (
                        <span className="vdl-nores">
                          No resource for this skill yet — ask your adviser.
                        </span>
                      )
                    ) : null}
                    {/* honest micro-line: open row whose platform has
                        no check — shown with the resource, per ruling */}
                    {open && node.suggestion && node.noCheck ? (
                      <span className="vdl-nocheck">
                        No platform check yet
                      </span>
                    ) : null}
                  </div>
                  {/* the SP projection — the detached PERSONAL overlay
                      register (12px ink2); null → the honest dash */}
                  {open ? (
                    <span className="vdl-eff num">
                      {node.effect
                        ? `SP ${node.effect.from} → ${node.effect.to} · +${node.effect.to - node.effect.from}`
                        : "—"}
                    </span>
                  ) : null}
                </section>
              </li>
            );
          }

          /* milestone rows (gate + entry) — no progress claims; the
              covered floor skills wear REAL state chips ONLY where
              genuinely closed */
          return (
            <li
              key={row.key}
              className={`vdl-row vdl-noderow${terminus ? " vdl-terminus" : ""}`}
            >
              <span className="vdl-node">
                <span className="vdl-vh">
                  {node.kind === "gate"
                    ? "Certification&nbsp;milestone"
                    : "Entry&nbsp;milestone"}
                </span>
                <span className="vdl-dot" aria-hidden="true" />
              </span>
              <section className="vdl-card vdl-mcard">
                <span className="vdl-mkind">
                  {node.kind === "gate" ? "Proof" : "Entry"}
                </span>
                <span className="vdl-mrow">
                  {node.url ? (
                    <a
                      className="vdl-mlink"
                      href={node.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {node.label}
                      <span className="vdl-ext" aria-hidden="true">
                        ↗
                      </span>
                    </a>
                  ) : (
                    <span className="vdl-mtitle">{node.label}</span>
                  )}
                </span>
                {node.meta ? (
                  <span className="vdl-meta num">{node.meta}</span>
                ) : null}
                {node.covers.length > 0 ? (
                  <div className="vdl-covers">
                    <span className="vdl-covlabel">Covers</span>
                    <ul className="vdl-covlist">
                      {node.covers.map((cover) => {
                        const st = stateByLabel.get(cover);
                        const closed =
                          st === "verified" ||
                          st === "checked" ||
                          st === "claimed";
                        return (
                          <li key={cover} className="vdl-covrow">
                            <span className="vdl-covname">{cover}</span>
                            {st && closed ? chip(st) : null}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : null}
              </section>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
