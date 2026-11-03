"use client";

import { useState } from "react";
import type { CanonProps, CanonSection, CanonUnit, PathNode } from "./canon";
import "./variant-d3.css";

/**
 * Variant D3 — "Units of competence" (My Plan pathway mockup; the
 * post-defense content-structure rethink, user-ruled 2026-11-03: the
 * minimum required to enter the role is the REGULATED layer — skills
 * whose sourceTag is PSF/TESDA — and D3 reads it as a TESDA/PSF-style
 * syllabus of UNITS OF COMPETENCE, the most faithful-to-the-source-
 * documents reading).
 *
 * Walk law (fixed per career, never re-sorts): canon.units in order
 * (the floor regrouped) → gate → recommended → optional → entry
 * (sections by id). Unit cards are syllabus chapters on ONE continuous
 * 2px #DADCE0 spine; every competence/milestone row pulls a numbered
 * white circle out onto the spine — 1..N across the whole walk (the
 * wave-A convention: units divide the walk, numbering continues).
 * Rulings carried here:
 * 1. Engine state is a READ-ONLY overlay over the fixed path; the
 *    closed provenance chips are the PathwayTabs wordings verbatim
 *    (`Verified ·✓` / `Checked ·✓✓` / `Self-reported` hatched).
 * 2. Node borders are honest: green #188038 ONLY when that node's
 *    state is verified/checked; grey otherwise (claimed stays grey
 *    with its hatch chip; never a green border). Milestones → grey.
 * 3. The ONLY local write is the working-on marker (user ruling,
 *    hybrid): an open skill row's hollow ring is a real button
 *    (aria-pressed) that turns amber with a small amber dot and a
 *    tiny `Working` chip after the name. Never a checkmark, never
 *    persisted. Closed rows are NOT toggleable.
 * 4. Milestones carry NO progress bar/percentage/aggregate claim —
 *    covered floor skills chip ONLY where genuinely closed, plain
 *    names otherwise.
 * 5. Empty regions render an honest quiet line — never gone silently.
 * 6. Color canon: blue = action (Start here, focus) only; green =
 *    verified/earned only; amber = working only; grey = unmeasured;
 *    never red; no washes as region fills; no animations/transitions
 *    (DNA lock); every numeral tabular. Canon copy is verbatim,
 *    draft register (non-authoritative until the user signs off).
 */

/* the canonical provenance chips (PathwayTabs wording, verbatim) */
const CHIP_CLASS = {
  verified: "vd3-chip vd3-chip-green",
  checked: "vd3-chip vd3-chip-green",
  claimed: "vd3-chip vd3-chip-grey",
} as const;
const CHIP_TEXT = {
  verified: "Verified ·✓",
  checked: "Checked ·✓✓",
  claimed: "Self-reported",
} as const;

const closedChip = (state: PathNode["state"]) => {
  if (state === "verified" || state === "checked" || state === "claimed") {
    return <span className={CHIP_CLASS[state]}>{CHIP_TEXT[state]}</span>;
  }
  return null;
};

/** one card on the spine — a syllabus unit or a post-unit region */
type Card =
  | { kind: "unit"; u: CanonUnit; i: number }
  | { kind: "region"; s: CanonSection };

export default function MockupUnits({
  careerName,
  closedCount,
  totalSkills,
  offPathNote,
  sections,
  units,
}: { careerName: string } & CanonProps) {
  /* the working-on marker — component-local only, defaults empty */
  const [working, setWorking] = useState<ReadonlySet<string>>(new Set());
  const toggle = (skill: string) =>
    setWorking((prev) => {
      const next = new Set(prev);
      if (next.has(skill)) {
        next.delete(skill);
      } else {
        next.add(skill);
      }
      return next;
    });

  if (sections.length === 0 && units.length === 0) return null;

  /* the walk, by section id (units already stand in for the floor) */
  const byId = new Map(sections.map((s) => [s.id, s] as const));
  const gate = byId.get("gate");
  const recommended = byId.get("recommended");
  const optional = byId.get("optional");
  const entry = byId.get("entry");

  const cards: Card[] = units.map((u, i) => ({ kind: "unit", u, i }));
  for (const s of [gate, recommended, optional, entry]) {
    if (s) cards.push({ kind: "region", s });
  }
  const cardNodes = (c: Card) => (c.kind === "unit" ? c.u.nodes : c.s.nodes);
  /* the walk-terminal row (the last row with nodes) — its spine tie is
     omitted so the line ends exactly at the final node's circle */
  const terminator = [...cards].reverse().find((c) => cardNodes(c).length > 0);

  /* every skill checkpoint on the walk — the honest overlay source for
     milestone `covers` chips and the single-source-tag empty line */
  const stateBySkill = new Map<string, PathNode["state"]>();
  const tags = new Set<string>();
  for (const n of [...units.flatMap((u) => u.nodes), ...sections.flatMap((s) => s.nodes)]) {
    if (n.kind !== "skill") continue;
    stateBySkill.set(n.label, n.state);
    if (n.sourceTag) tags.add(n.sourceTag);
  }

  /* the quiet empty-region line — never a silent disappearance. When
     every skill on the map comes from ONE regulated source, that fact
     is the honest reason the region is empty. */
  const emptyLine = (s: CanonSection) => {
    if (s.id === "recommended" || s.id === "optional") {
      const first = Array.from(tags)[0];
      if (tags.size === 1 && first) {
        return `None — every skill on this map comes from a regulated source (${first}).`;
      }
    }
    return "None for this role yet.";
  };

  const counter = (s: CanonSection) => {
    if (s.id === "gate") return `${s.nodes.length} PROOF MILESTONES`;
    if (s.id === "entry") return `${s.nodes.length} ENTRY MILESTONES`;
    return `${s.closed} OF ${s.total} CLOSED`;
  };

  /* ---- node renderers (numbered across the whole walk) ---- */

  const renderSkill = (n: PathNode, num: number, walkLast: boolean) => {
    const open = n.state === "open";
    const isWorking = open && working.has(n.id);
    const nodeOn = n.state === "verified" || n.state === "checked";
    return (
      <li key={n.id} className="vd3-srow">
        {!walkLast ? <span className="vd3-tie" aria-hidden="true" /> : null}
        <span className={`vd3-nd num${nodeOn ? " vd3-nd-on" : ""}`}>
          <span className="vd3-vh">Node&nbsp;</span>
          {num}
        </span>
        <span className="vd3-glyph">
          {/* closed rows ride their provenance chip; only OPEN rows get
              the working-on toggle */}
          {!open ? (
            closedChip(n.state)
          ) : (
            <button
              type="button"
              className="vd3-ring"
              aria-pressed={isWorking}
              aria-label={`Mark ${n.label} as working`}
              onClick={() => toggle(n.id)}
            />
          )}
        </span>
        <div className="vd3-main">
          <span className="vd3-name-row">
            <span className="vd3-name">{n.label}</span>
            {n.tier === "core" ? <span className="vd3-core">Core</span> : null}
            {isWorking ? <span className="vd3-working">Working</span> : null}
            {n.startHere ? <span className="vd3-start">Start here</span> : null}
          </span>
          {n.what ? <span className="vd3-what">{n.what}</span> : null}
          {open ? (
            n.suggestion ? (
              <span className="vd3-res num">
                {n.suggestion.url ? (
                  <a
                    className="vd3-reslink"
                    href={n.suggestion.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {n.suggestion.title}
                    <span className="vd3-ext" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                ) : (
                  <span className="vd3-restitle">{n.suggestion.title}</span>
                )}
                <span className="vd3-resmeta">
                  {" "}
                  · {n.suggestion.cost} · {n.suggestion.hrs}
                </span>
              </span>
            ) : (
              <span className="vd3-nores">
                No resource for this skill yet — ask your adviser.
              </span>
            )
          ) : null}
          {/* open row whose suggestion's platform has no check for THIS
              skill — the honest micro-line (§6.2) */}
          {open && n.noCheck && n.suggestion ? (
            <span className="vd3-nocheck num">No platform check yet</span>
          ) : null}
        </div>
        {open ? (
          <span className="vd3-eff num">
            {/* the SP projection — the personal overlay, detached in ink */}
            {n.effect
              ? `SP ${n.effect.from} → ${n.effect.to} · +${n.effect.to - n.effect.from}`
              : "—"}
          </span>
        ) : null}
      </li>
    );
  };

  const renderMilestone = (n: PathNode, num: number, walkLast: boolean) => (
    <li key={n.id} className="vd3-srow">
      {!walkLast ? <span className="vd3-tie" aria-hidden="true" /> : null}
      <span className="vd3-nd num">
        <span className="vd3-vh">Node&nbsp;</span>
        {num}
      </span>
      <span className="vd3-glyph" />
      <div className="vd3-main">
        <span className="vd3-name-row">
          {n.url ? (
            <a
              className="vd3-mlink"
              href={n.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {n.label}
              <span className="vd3-ext" aria-hidden="true">
                ↗
              </span>
            </a>
          ) : (
            <span className="vd3-name">{n.label}</span>
          )}
        </span>
        {n.meta ? <span className="vd3-mmeta num">{n.meta}</span> : null}
        {/* covered floor skills — REAL chips only where genuinely closed;
            open names stay plain. NO progress bar, percentage or any
            aggregate claim rides the milestone. */}
        {n.covers.length > 0 ? (
          <span className="vd3-covers">
            <span className="vd3-covlabel">covers</span>
            {n.covers.map((c) => {
              const st = stateBySkill.get(c);
              return st && st !== "open" ? (
                <span key={c} className={CHIP_CLASS[st]}>
                  {CHIP_TEXT[st]}
                </span>
              ) : (
                <span key={c} className="vd3-cov">
                  {c}
                </span>
              );
            })}
          </span>
        ) : null}
      </div>
    </li>
  );

  const renderRow = (n: PathNode, num: number, walkLast: boolean) =>
    n.kind === "skill" ? renderSkill(n, num, walkLast) : renderMilestone(n, num, walkLast);

  /* ---- the cards on the spine; the walk counter 1..N continues ---- */

  let walkNo = 0;

  const renderCard = (c: Card) => {
    const nodes = cardNodes(c);
    const isTerminator = terminator !== undefined && c === terminator;
    const rows = nodes.length > 0
      ? nodes.map((n, j) => {
          walkNo += 1;
          return renderRow(n, walkNo, isTerminator && j === nodes.length - 1);
        })
      : null;

    if (c.kind === "unit") {
      return (
        <section key={`unit:${c.i}`} className="vd3-card vd3-unit">
          <header className="vd3-head">
            <div className="vd3-headstack">
              <span className="vd3-ucap num">
                UNIT {c.i + 1} OF {units.length}
              </span>
              <h3>{c.u.title}</h3>
            </div>
            <span className="vd3-count num">
              {c.u.closed} OF {c.u.total} CLOSED
            </span>
          </header>
          <p className="vd3-blurb">{c.u.blurb}</p>
          {rows ? (
            <ul className="vd3-nodes">{rows}</ul>
          ) : (
            <p className="vd3-empty">No resolved competencies for this unit.</p>
          )}
        </section>
      );
    }

    const s = c.s;
    return (
      <section key={s.id} className="vd3-card vd3-region">
        <header className="vd3-head">
          <h3>{s.title}</h3>
          <span className="vd3-count num">{counter(s)}</span>
        </header>
        <p className="vd3-blurb">{s.blurb}</p>
        {rows ? (
          <ul className="vd3-nodes">{rows}</ul>
        ) : (
          <p className="vd3-empty">{emptyLine(s)}</p>
        )}
      </section>
    );
  };

  return (
    <div className="v7mock-d3">
      {/* surface head — the band-card register (+ the draft note ONCE
          and the optional honest accounting line) */}
      <section className="vd3-band">
        <h2>Your path to {careerName}</h2>
        <span className="vd3-lead num">
          <b>{closedCount}</b> of {totalSkills} skills checked
        </span>
        {units.length > 0 ? (
          <span className="vd3-noteline">
            Unit clusters are a drafted reading of the framework document
          </span>
        ) : null}
        {offPathNote ? (
          <span className="vd3-noteline num">{offPathNote}</span>
        ) : null}
      </section>

      {/* THE SPINE — units of competence, then gate → recommended →
          optional → entry; one continuous 2px line down the left, each
          node pulling its numbered circle out onto the line */}
      <div className="vd3-walk">
        {units.length > 0 ? <p className="vd3-chap">UNITS-OF-COMPETENCE</p> : null}
        {cards.map((c) => renderCard(c))}
      </div>
    </div>
  );
}
