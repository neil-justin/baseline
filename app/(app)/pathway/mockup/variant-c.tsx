"use client";

/**
 * Mockup C — LMS rail (post-defense revamp mockup, user-ruled
 * 2026-11-03). The most literally course-like variant: a sticky left
 * contents rail listing the journey stages as numbered course units,
 * and a main column showing the SELECTED stage in full. Presentation
 * only — engine state is read-only; the working-on marker is local
 * React state (aria-pressed ring toggle), never a check or persistence.
 * Honesty canon verbatim from PathwayTabs (Verified ·✓ / Checked ·✓✓ /
 * Self-reported hatch / No resource… / No platform check yet).
 */
import { useState } from "react";
import type { MockupProps, Stage, StageItem, StageMaterial } from "./stages";
import "./variant-c.css";

/** canonical closing-provenance chips, verbatim from PathwayTabs (Q6);
    open rows keep the ring, never a chip */
const chipLabel = (kind: StageItem["state"]): string | null =>
  kind === "verified" ? "Verified ·✓" : kind === "checked" ? "Checked ·✓✓" : kind === "claimed" ? "Self-reported" : null;

export default function MockupRail({ careerName, stages }: MockupProps) {
  /* selection + working-on marks: local state, defaults empty (the
     working-on ruling is explicit: nothing is marked until clicked) */
  const [selId, setSelId] = useState<string | null>(null);
  const [working, setWorking] = useState<ReadonlySet<string>>(() => new Set());

  if (stages.length === 0) return null; // after the hooks — stage shape never re-mounts on switch

  /* default unit = the first skill stage holding a startHere item, else ① */
  const fallbackId =
    stages.find((s) => s.items.some((i) => i.startHere))?.id ?? stages[0].id;
  const stage: Stage = stages.find((s) => s.id === selId) ?? stages.find((s) => s.id === fallbackId) ?? stages[0];

  /* computed counters, never invented: closed/total ride the stage
     model (materials never count); ③④ carry closed 0 so the plain
     sums land on the skill stages ①② alone */
  const checked = stages.reduce((n, s) => n + s.closed, 0);
  const skillTotal = stages.reduce((n, s) => n + s.total, 0);

  /* the working-on toggle — open items only; closed items are not
     buttons. Key is stage-scoped so a skill name can't leak across units. */
  const toggle = (key: string) =>
    setWorking((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  /* numeral paint rule (user-locked): a unit's count receipt may take
     green ONLY when the unit is fully closed (skill stages) or holds
     ≥1 material (credential/entry stages) — otherwise all grey */
  const receipt = (s: Stage) => {
    if (s.total > 0) {
      const done = s.closed === s.total;
      return (
        <span className="v7mock-c-unit-receipt num">
          <b className={done ? "done" : undefined}>{s.closed}</b>/{s.total}
        </span>
      );
    }
    const done = s.materials.length >= 1;
    return (
      <span className="v7mock-c-unit-receipt num">
        <b className={done ? "done" : undefined}>{s.materials.length}</b> materials
      </span>
    );
  };

  /* skill checkpoints — stages ①②'s course-sheet rows; the right
     register is the SP projection receipt (effect null → —) */
  const itemRow = (it: StageItem, stageKey: string) => {
    const chip = chipLabel(it.state);
    const isWorking = working.has(stageKey);
    const effect = it.effect;
    return (
      <li className="v7mock-c-item" key={it.skill}>
        {chip ? (
          <span
            className={`v7mock-c-chip ${it.state}`}
          >
            {chip}
          </span>
        ) : (
          <button
            type="button"
            className={`v7mock-c-ring${isWorking ? " working" : ""}`}
            aria-pressed={isWorking}
            aria-label={`${isWorking ? "Stop working on" : "Mark as working on"} ${it.skill}`}
            onClick={() => toggle(stageKey)}
          />
        )}
        <span className="v7mock-c-item-main">
          <span className="v7mock-c-item-name-line">
            <span className="v7mock-c-item-name num">{it.skill}</span>
            {it.startHere ? <span className="v7mock-c-start">Start here</span> : null}
            {isWorking ? <span className="v7mock-c-working">Working</span> : null}
          </span>
          {it.what ? <span className="v7mock-c-item-what">{it.what}</span> : null}
          {it.state === "open" ? (
            it.suggestion ? (
              <span className="v7mock-c-suggestion">
                {it.suggestion.url ? (
                  <a href={it.suggestion.url} target="_blank" rel="noopener noreferrer">
                    {it.suggestion.title}
                    <span className="v7mock-c-ext" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                ) : (
                  it.suggestion.title
                )}
                <span>
                  {" "}
                  · {it.suggestion.cost} · {it.suggestion.hrs}
                </span>
              </span>
            ) : (
              <span className="v7mock-c-nores">No resource for this skill yet — ask your adviser.</span>
            )
          ) : null}
          {it.state === "open" && it.noCheck ? <span className="v7mock-c-nocheck">No platform check yet</span> : null}
        </span>
        {effect ? (
          <span className="v7mock-c-eff num">
            SP <b>{effect.from}</b> → <b>{effect.to}</b> · +<b>{effect.to - effect.from}</b>
          </span>
        ) : (
          <span className="v7mock-c-eff num">—</span>
        )}
      </li>
    );
  };

  /* the MATERIALS submenu — typed receipts only, NO progress claims */
  const matRow = (m: StageMaterial) => (
    <li className="v7mock-c-mat" key={m.title}>
      <span className="v7mock-c-mat-title-line">
        <span className="v7mock-c-mat-title">
          {m.url ? (
            <a href={m.url} target="_blank" rel="noopener noreferrer">
              {m.title}
              <span className="v7mock-c-ext" aria-hidden="true">
                ↗
              </span>
            </a>
          ) : (
            m.title
          )}
        </span>
        {m.startHere ? <span className="v7mock-c-start">Start here</span> : null}
      </span>
      <span className="v7mock-c-mat-meta num">
        {m.provider} · {m.type} · {m.cost} · {m.time}
      </span>
      {m.covers.length > 0 ? <span className="v7mock-c-mat-covers">covers {m.covers.join(", ")}</span> : null}
      {m.route ? <span className="v7mock-c-mat-route">{m.route}</span> : null}
    </li>
  );

  const stageIdx = stages.findIndex((s) => s.id === stage.id);
  const next = stageIdx >= 0 ? stages[stageIdx + 1] : undefined;

  return (
    <div className="v7mock-c">
      {/* surface head rides OVER the rail+content grid */}
      <header className="v7mock-c-head">
        <h2>Your path to {careerName}</h2>
        <span className="v7mock-c-counter num">
          <b>{checked}</b> of {skillTotal} skills checked
        </span>
      </header>

      <div className="v7mock-c-grid">
        {/* the contents rail — a white sticky card INSIDE the content
            column (the shell's own left sidebar keeps its 240px) */}
        <nav className="v7mock-c-rail num" aria-label="Course contents">
          <span className="v7mock-c-rail-label">Contents</span>
          {stages.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={`v7mock-c-entry${s.id === stage.id ? " on" : ""}`}
              aria-current={s.id === stage.id ? "true" : undefined}
              onClick={() => setSelId(s.id)}
            >
              <span className="v7mock-c-no">{i + 1}</span>
              <span className="v7mock-c-unit">
                <span className="v7mock-c-unit-title">{s.title}</span>
                {receipt(s)}
              </span>
            </button>
          ))}
          {/* full-path momentum receipt — green ONLY when everything is closed */}
          <footer className="v7mock-c-rail-foot">
            <b className={checked === skillTotal && skillTotal > 0 ? "all" : undefined}>{checked}</b> of {skillTotal} skills
            checked
          </footer>
        </nav>

        {/* the selected stage, in full — plain swap, no transition */}
        <section className="v7mock-c-card" aria-label={stage.title}>
          <div className="v7mock-c-cardhead">
            <h3>{stage.title}</h3>
            <span className="v7mock-c-cardcount num">
              {stage.total > 0
                ? `${stage.closed} of ${stage.total} closed`
                : `${stage.materials.length} materials`}
            </span>
          </div>
          <p className="v7mock-c-blurb">{stage.blurb}</p>

          {stage.items.length > 0 ? (
            <ul className="v7mock-c-items">
              {stage.items.map((it) => itemRow(it, `${stage.id}:${it.skill}`))}
            </ul>
          ) : null}

          {stage.materials.length > 0 ? (
            <div className="v7mock-c-matslop num">
              <span className="v7mock-c-mats-label num">Materials</span>
              <ul className="v7mock-c-mats">{stage.materials.map(matRow)}</ul>
            </div>
          ) : null}

          {/* the quiet continue affordance — next unit, text-only; it
              disappears on the last stage and claims nothing */}
          {next ? (
            <div className="v7mock-c-next">
              <button type="button" onClick={() => setSelId(next.id)}>
                Next: {stageIdx + 2} · {next.title} →
              </button>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
