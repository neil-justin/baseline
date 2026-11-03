"use client";

/**
 * Variant B — "Central spine, alternating cards" — post-defense mockup,
 * user-ruled 2026-11-03 (MockupMount contract: default export named
 * MockupAlternate). The roadmap.sh-graph reading: ONE continuous 2px
 * hairline spine down the CENTER of the content column, stage cards
 * alternating left/right of it with connector ticks into a numbered node
 * per stage. Presentation-only over the engine-fed Stage[]
 * (mockup/stages.ts) — the same honesty canon as the defended Plan
 * table: canonical provenance chips (Q6) verbatim, counters computed
 * from stage.closed/total (never painted), SP registers echo the
 * engine's row effect with digits in plain ink, blue ONLY on the
 * explicit "Start here" affordance, amber ONLY on the working-on
 * marker, grey hatch = self-report. No red, no motion, no region
 * washes, no persisted state.
 *
 * The one interaction is the user-locked working-on marker: clicking an
 * open row's hollow ring toggles LOCAL amber intent state (useState
 * only) — a marker, never an engine write, never a checkmark.
 */
import { useState } from "react";
import type { StageItem, StageMaterial, MockupProps } from "./stages";
import "./variant-b.css";

export default function MockupAlternate({ careerName, stages }: MockupProps) {
  /* the working-on marker lives HERE alone — read-only intent, keyed by
     skill name (unique across the career map the stages slice) */
  const [working, setWorking] = useState<Set<string>>(() => new Set());
  const toggleWorking = (skill: string) =>
    setWorking((prev) => {
      const next = new Set(prev);
      if (next.has(skill)) next.delete(skill);
      else next.add(skill);
      return next;
    });

  if (stages.length === 0) return null;

  /* the surface counter — the SKILL stages' computed sums (③④ carry
     total 0), the same arithmetic PathwayTabs' guarded lead-mono rides */
  let done = 0;
  let all = 0;
  for (const s of stages) {
    if (s.total > 0) {
      done += s.closed;
      all += s.total;
    }
  }

  /* the canonical provenance chips (Q6), repainted variant-side — green
     wash rides platform-verified/checked closes ONLY; self-report keeps
     the grey hatch and never gains color */
  const closedChip = (kind: StageItem["state"]) =>
    kind === "claimed" ? (
      <span className="vb-chip vb-chip-hatch">Self-reported</span>
    ) : (
      <span className="vb-chip vb-chip-green">
        {kind === "verified" ? "Verified ·✓" : "Checked ·✓✓"}
      </span>
    );

  const itemRow = (it: StageItem) => {
    if (it.state !== "open") {
      /* closed rows: the state chip rides the register column; the row is
         NOT toggleable — a tick never lives here */
      return (
        <div className="vb-item vb-item-closed" key={it.skill}>
          <div className="vb-item-main">
            <span className="vb-skill">{it.skill}</span>
          </div>
          <div className="vb-reg">{closedChip(it.state)}</div>
        </div>
      );
    }
    const on = working.has(it.skill);
    const eff = it.effect;
    return (
      <div className="vb-item vb-item-open" key={it.skill}>
        <div className="vb-item-main">
          <div className="vb-skillrow">
            {/* the working-on marker: hollow ring → amber ring + amber dot
                + the amber-bordered "Working" chip — NOT a checkmark */}
            <button
              type="button"
              className="vb-ring"
              aria-pressed={on}
              aria-label={`Mark ${it.skill} as working-on`}
              onClick={() => toggleWorking(it.skill)}
            />
            <span className="vb-skill">{it.skill}</span>
            {on ? <span className="vb-working">Working</span> : null}
            {it.startHere ? <span className="vb-start">Start here</span> : null}
          </div>
          <p className="vb-what">{it.what}</p>
          {it.suggestion ? (
            <p className="vb-res">
              <span className="vb-restitle">
                {it.suggestion.title}
                <span className="vb-ext" aria-hidden="true">
                  ↗
                </span>
              </span>
              {/* hrs already carries its ~ from timeText (page.tsx):
                  plain text, no URL, no affordance paint */}
              <span className="vb-resmeta">
                {" "}
                · {it.suggestion.cost} · {it.suggestion.hrs}
              </span>
            </p>
          ) : (
            <p className="vb-nores">No resource for this skill yet — ask your adviser.</p>
          )}
          {it.noCheck && it.suggestion ? <p className="vb-nocheck">No platform check yet</p> : null}
        </div>
        {/* the SP register: engine numbers in plain ink — blue never paints them */}
        <div className="vb-reg num">
          {eff ? (
            <span>
              SP {eff.from} → {eff.to} · +{eff.to - eff.from}
            </span>
          ) : (
            <span className="vb-dash">—</span>
          )}
        </div>
      </div>
    );
  };

  const matRow = (m: StageMaterial) => (
    <div className="vb-mat" key={m.title}>
      <span className="vb-mat-title">
        {m.url ? (
          <a href={m.url} target="_blank" rel="noopener noreferrer">
            {m.title}
            <span className="vb-ext" aria-hidden="true">
              ↗
            </span>
          </a>
        ) : (
          <span className="vb-mat-name">{m.title}</span>
        )}
        {m.startHere ? <span className="vb-start">Start here</span> : null}
      </span>
      {/* time already carries its ~ from timeText (page.tsx) */}
      <span className="vb-mat-meta num">
        {m.provider} · {m.type} · {m.cost} · {m.time}
      </span>
      {m.covers.length > 0 ? <span className="vb-mat-covers">Covers {m.covers.join(", ")}</span> : null}
      {m.route ? <span className="vb-mat-route">{m.route}</span> : null}
    </div>
  );

  return (
    <div className="v7mock-b">
      {/* surface head — centered: this layout is symmetric by construction */}
      <header className="vb-head">
        <h2>Your path to {careerName}</h2>
        <p className="vb-lead num">
          <b>{done}</b> of {all} skills checked
        </p>
      </header>

      <div className="vb-map">
        {/* THE SPINE: one continuous 2px hairline through the column
            center, running flush between the first/last node centers */}
        <div className="vb-spine" aria-hidden="true" />
        {stages.map((stage, i) => {
          /* honest node border: a fully closed skill stage or a material
             stage with ≥1 material → verified green; otherwise the plain
             hairline grey */
          const closed =
            stage.total > 0 ? stage.closed === stage.total : stage.materials.length > 0;
          return (
            <section
              key={stage.id}
              className={`vb-row ${i % 2 === 0 ? "vb-side-l" : "vb-side-r"}`}
              aria-label={stage.title}
            >
              <div className={`vb-node num${closed ? " vb-node-done" : ""}`}>{i + 1}</div>
              <article className="vb-card">
                <div className="vb-cardhead">
                  <h3>{stage.title}</h3>
                  <span className="vb-count num">
                    {stage.items.length > 0
                      ? `${stage.closed} of ${stage.total} closed`
                      : `${stage.materials.length} materials`}
                  </span>
                </div>
                <p className="vb-blurb">{stage.blurb}</p>
                {stage.items.length > 0 ? (
                  <div className="vb-items">{stage.items.map(itemRow)}</div>
                ) : null}
                {/* materials ride EVERY stage (courses fold into ①②), and
                    they make no progress claims of any kind */}
                {stage.materials.length > 0 ? (
                  <div className="vb-mats">
                    <span className="vb-mats-label">Materials</span>
                    {stage.materials.map(matRow)}
                  </div>
                ) : null}
              </article>
            </section>
          );
        })}
      </div>
    </div>
  );
}
