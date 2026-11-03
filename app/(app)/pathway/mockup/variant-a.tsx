"use client";

import { useState } from "react";
import { type Stage, type StageItem, type MockupProps } from "./stages";
import "./variant-a.css";

/**
 * Variant A — "vertical spine timeline" (post-defense My Plan pathway
 * mockup; layout ruled 2026-11-03): numbered journey stages cascade
 * top-to-bottom on ONE continuous 2px spine, each stage a card of skill
 * checkpoints + learning materials (the old Resources tab folded into
 * the path). Rulings carried here:
 * 1. Engine state is READ-ONLY (stages.ts) — the color canon is blue =
 *    action only, green = verified/earned only, amber = working only,
 *    grey = unmeasured/self-reported; never red, no washes as fills.
 * 2. The ONLY local write is the working-on marker (user ruling
 *    2026-11-03, hybrid): the open row's hollow ring is a real button
 *    (aria-pressed) that turns amber (border + dot) with a `Working`
 *    chip after the skill name. It is never a checkmark (·✓ / ·✓✓ are
 *    the engine's glyphs), never writes chips/bars/counters/SP, and is
 *    not persisted (the switcher's "not persisted" note covers demo
 *     nature). Closed rows are NOT toggleable — their glyph is already
 *    a state chip.
 * 3. Node borders carry stage progress honestly: fully-closed stage or
 *    a stage holding materials → green border, else grey; circles never
 *    fill/wash, ③④ titles read as context ink only, never "done".
 * 4. No entrance motion, no transitions (DNA lock). No red.
 */

/** the canonical provenance chips (PathwayTabs wording, verbatim) */
const closedChip = (kind: StageItem["state"]) => {
  if (kind === "verified") {
    return <span className="vsp-chip vsp-chip-green">Verified ·✓</span>;
  }
  if (kind === "checked") {
    return <span className="vsp-chip vsp-chip-green">Checked ·✓✓</span>;
  }
  return <span className="vsp-chip vsp-chip-grey">Self-reported</span>;
};

export default function MockupSpine({ careerName, stages }: MockupProps) {
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

  if (stages.length === 0) return null;

  /* the head counter is computed, never invented (stages ①② are the
     skill stages; ③④ ride total 0 so the whole-list sums agree) */
  const done = stages.reduce((n, s) => n + s.closed, 0);
  const total = stages.reduce((n, s) => n + s.total, 0);

  return (
    <div className="v7mock-a">
      {/* surface head — the band-card register (one white card naming
          the surface + the lead-mono fact counter) */}
      <section className="vsp-band">
        <h2>Your path to {careerName}</h2>
        <span className="vsp-lead">
          <b>{done}</b> of {total} skills checked
        </span>
      </section>

      {/* THE SPINE — one continuous 2px line (each row draws its
          segment; the last ends at its node's center) */}
      <ol className="vsp-list">
        {stages.map((stage, i) => {
          /* material-only stages ③④ (a skill stage holds checkpoints) */
          const materialStage = stage.items.length === 0;
          const nodeGreen =
            stage.total > 0
              ? stage.closed === stage.total
              : stage.materials.length > 0;
          return (
            <li
              key={stage.id}
              className={`vsp-row${nodeGreen ? " vsp-done" : ""}`}
            >
              <span className="vsp-node num">
                <span className="vsp-vh">Stage&nbsp;</span>
                {i + 1}
              </span>
              <section className="vsp-card">
                <header className="vsp-head">
                  <h3>{stage.title}</h3>
                  <span className="vsp-count num">
                    {materialStage
                      ? `${stage.materials.length} MATERIALS`
                      : `${stage.closed} OF ${stage.total} CLOSED`}
                  </span>
                </header>
                <p className="vsp-blurb">{stage.blurb}</p>

                {!materialStage ? (
                  <ul className="vsp-items">
                    {stage.items.map((item) => {
                      const open = item.state === "open";
                      const isWorking = open && working.has(item.skill);
                      return (
                        <li key={item.skill} className="vsp-item">
                          <span className="vsp-glyph">
                            {/* closed rows ride their provenance chip;
                                only OPEN rows get the working-on toggle */}
                            {!open ? (
                              closedChip(item.state)
                            ) : (
                              <button
                                type="button"
                                className="vsp-ring"
                                aria-pressed={isWorking}
                                aria-label={`Mark ${item.skill} as working`}
                                onClick={() => toggle(item.skill)}
                              />
                            )}
                          </span>
                          <div className="vsp-main">
                            <span className="vsp-skillrow">
                              <span className="vsp-skill">{item.skill}</span>
                              {isWorking ? (
                                <span className="vsp-working">Working</span>
                              ) : null}
                              {item.startHere ? (
                                <span className="vsp-start">Start here</span>
                              ) : null}
                            </span>
                            {item.what ? (
                              <span className="vsp-what">{item.what}</span>
                            ) : null}
                            {open ? (
                              item.suggestion ? (
                                <span className="vsp-res num">
                                  {item.suggestion.url ? (
                                    <a
                                      className="vsp-reslink"
                                      href={item.suggestion.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {item.suggestion.title}
                                      <span className="vsp-ext" aria-hidden="true">
                                        ↗
                                      </span>
                                    </a>
                                  ) : (
                                    <span className="vsp-restitle">
                                      {item.suggestion.title}
                                    </span>
                                  )}
                                  <span className="vsp-resmeta">
                                    {" "}
                                    · {item.suggestion.cost} ·{" "}
                                    {item.suggestion.hrs}
                                  </span>
                                </span>
                              ) : (
                                <span className="vsp-nores">
                                  No resource for this skill yet — ask your
                                  adviser.
                                </span>
                              )
                            ) : null}
                            {/* §6.2 honest line: open row with no platform check */}
                            {open && item.noCheck ? (
                              <span className="vsp-nocheck num">
                                No platform check yet
                              </span>
                            ) : null}
                          </div>
                          {open ? (
                            <span className="vsp-eff num">
                              {item.effect
                                ? `SP ${item.effect.from} → ${item.effect.to} · +${item.effect.to - item.effect.from}`
                                : "—"}
                            </span>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                ) : null}

                {/* stage materials (the old Resources tab, folded in) —
                    links in the honest register, no progress claims */}
                {stage.materials.length > 0 ? (
                  <div className="vsp-mats">
                    <span className="vsp-matlabel">Materials</span>
                    <ul>
                      {stage.materials.map((m) => (
                        <li key={m.title} className="vsp-mat">
                          <span className="vsp-matrow">
                            {m.url ? (
                              <a
                                className="vsp-matlink"
                                href={m.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {m.title}
                                <span className="vsp-ext" aria-hidden="true">
                                  ↗
                                </span>
                              </a>
                            ) : (
                              <span className="vsp-mattitle">{m.title}</span>
                            )}
                            {m.startHere ? (
                              <span className="vsp-start">Start here</span>
                            ) : null}
                          </span>
                          <span className="vsp-matmeta num">
                            {m.provider} · {m.type} · {m.cost} · {m.time}
                          </span>
                          {m.covers.length > 0 ? (
                            <span className="vsp-covers">
                              covers {m.covers.join(", ")}
                            </span>
                          ) : null}
                          {m.route ? (
                            <span className="vsp-route num">{m.route}</span>
                          ) : null}
                        </li>
                      ))}
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
