"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import CountUp from "@/components/CountUp";
import Reveal from "@/components/Reveal";
import CheckOverlay from "./CheckOverlay";
import type { CheckResourceLite } from "./types";
import { WEIGHTS } from "@/lib/engines/score";

export interface FeedRow {
  key: string;
  title: string;
  meta: string;
  date: string;
  correct: number;
  total: number;
  skill: string | null;
  closed: boolean;
}

export interface ClosedRow {
  name: string;
  source: "verified" | "checked" | "claimed";
  note: string;
}

export interface Suggestion {
  title: string;
  resourceId: string;
  skill: string;
  target: string;
}

export interface GoalView {
  id: string;
  title: string;
  type: "training" | "milestone";
  status: "active" | "completed";
  doneLine: string | null;
  autoLine: string | null;
  statusLine: string;
  check: { resourceId: string } | null;
}

interface Props {
  careerName: string;
  score: { total: number; sp: number; es: number; tp: number; ar: number | null; cc: number };
  parts: { pct: number; earnedFrac: number; unmeasured?: boolean }[];
  rubricAria: string;
  esVerified: number;
  updated: string | null;
  nextSkill: string | null;
  stageOneDone: number;
  fitLine: string;
  mapSize: number;
  openSkillCount: number;
  feedRows: FeedRow[];
  closedRows: ClosedRow[];
  closedCount: number;
  openSkills: string[];
  goals: GoalView[];
  suggestion: Suggestion | null;
  checkResources: Record<string, CheckResourceLite>;
  checks: Record<string, { stem: string; options: string[]; answer: number }[]>;
}

const BADGES: Record<ClosedRow["source"], { text: string; ok: boolean }> = {
  verified: { text: "·✓ verified quiz", ok: true },
  checked: { text: "✓✓ checked resource", ok: true },
  claimed: { text: "self-reported", ok: false },
};

function skillShortLabel(skill: string) {
  return skill.split("(")[0].trim().toLowerCase();
}

/**
 * Progress page body — the record surface. Markup ported from
 * prototype/progress.html; the only interactive machinery on top of it is the
 * small M6 goal slice (inline edit · quiet new-goal entry · suggested goal)
 * and the comprehension-check overlay launched from check-gated goals.
 */
export default function ProgressView(props: Props) {
  const router = useRouter();
  const [armed, setArmed] = useState(false);

  // --- goal affordances (prototype semantics: rename is client-local) ------
  const [edited, setEdited] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editVal, setEditVal] = useState("");

  // --- new-goal entry -------------------------------------------------------
  const [newOpen, setNewOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<"training" | "milestone">("training");
  const [busy, setBusy] = useState(false);
  const [newNote, setNewNote] = useState<string | null>(null);
  const ngInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (newOpen) ngInput.current?.focus();
  }, [newOpen]);

  // --- suggested goal -------------------------------------------------------
  const [sugDismissed, setSugDismissed] = useState(false);

  // --- check overlay --------------------------------------------------------
  const [openCheck, setOpenCheck] = useState<string | null>(null);

  function openEdit(id: string, title: string) {
    setEditingId(id);
    setEditVal(edited[id] ?? title);
  }
  function commitEdit(id: string) {
    const v = editVal.trim();
    if (v) setEdited((e) => ({ ...e, [id]: v }));
    setEditingId(null);
  }
  async function submitNew() {
    const v = newTitle.trim();
    if (!v || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: v, type: newType, student: "neil" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNewNote("That didn't go through — try once more.");
      } else {
        setNewNote("Goal set. It's now on your Progress page.");
        setNewTitle("");
        setNewOpen(false);
        router.refresh();
      }
    } catch {
      setNewNote("That didn't go through — try once more.");
    }
    setBusy(false);
  }
  async function acceptSuggestion() {
    if (!props.suggestion || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/goal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: props.suggestion.title,
          type: "training",
          resourceId: props.suggestion.resourceId,
          skill: props.suggestion.skill,
          student: "neil",
        }),
      });
      if (res.ok) {
        setNewNote("Goal set. It's now on your Progress page.");
        router.refresh();
      }
    } catch {
      /* stays dismissed */
    }
    setBusy(false);
  }

  const checkResource = openCheck ? props.checkResources[openCheck] ?? null : null;
  const goalLinked = openCheck
    ? props.goals.some((g) => g.status === "active" && g.type === "training" && g.check?.resourceId === openCheck)
    : false;

  return (
    <div className="shell prog-shell">
      {/* 1 · page head + readiness readout */}
      <section className="app-section prog-head">
        <div className="prog-grid">
          <Reveal className="prog-intro">
            <h1>Progress</h1>
            <p className="prog-sub">What you&apos;ve finished and what it proves.</p>
            <p className="prog-ctx num">
              You&apos;re <b>{props.score.total}%</b> ready for {props.careerName}
              {props.nextSkill !== null && props.openSkillCount > 0 ? (
                <>
                  ; next: <b>{props.nextSkill}</b>.
                </>
              ) : null}{" "}
              Free to start.
            </p>
            <div className="prog-ctas">
              <a className="btn btn-primary" href="/pathway">
                Open Pathway{" "}
                <span className="arrow">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="0.8em" height="0.8em">
                    <path d="M4 10h11" />
                    <path d="M11 5l5 5-5 5" />
                  </svg>
                </span>
              </a>
              <a className="link-sub" href="#goals">
                Jump to your goals
              </a>
            </div>
            <p className="prog-foot">Every number here is computed from your record.</p>
          </Reveal>

          <Reveal className="panel readout prog-readout">
            <div className="readout-head">
              <div>
                <span className="label">READINESS · {props.careerName}</span>
                <div className="readout-sub num">of 100 · updated {props.updated ?? "at set-up"}</div>
              </div>
              <div className="readout-score num">
                <CountUp
                  to={props.score.total}
                  dec={0}
                  dur={900}
                  onDone={() => setArmed(true)}
                  ariaLabel={`Readiness ${props.score.total} of 100`}
                  className="prog-score"
                />
                <small>/100</small>
              </div>
            </div>
            <div className={armed ? "rubric-mini armed" : "rubric-mini"} role="img" aria-label={props.rubricAria}>
              {props.parts.map((p, i) => (
                <div className="seg" style={{ flex: p.pct, ["--earn" as string]: String(p.earnedFrac) } as CSSProperties} key={i}>
                  <i />
                </div>
              ))}
            </div>
            <div className="prog-subrows">
              <div className="tickline">
                <b>Skills</b> — {props.score.sp} of {WEIGHTS.sp}
              </div>
              <div className="tickline">
                <b>Employability</b> — {props.score.es} of {WEIGHTS.es} · <span className="tick-note">{props.esVerified} of 7 NACE competencies verified ·✓</span>
              </div>
              <div className="tickline">
                <b>Training</b> — {props.score.tp} of {WEIGHTS.tp} · {props.stageOneDone} of 3 first steps done
              </div>
              <div className="tickline">
                <b>Application readiness</b> —{" "}
                {props.score.ar === null ? (
                  <span className="tick-note">not yet measured — the resume diagnostic in Prep opens this channel</span>
                ) : (
                  `${props.score.ar} of ${WEIGHTS.ar}`
                )}
              </div>
              <div className="tickline">
                <b>Career direction</b> — {props.score.cc} of {WEIGHTS.cc}
              </div>
            </div>
            <div className="readout-fit num">{props.fitLine}</div>
          </Reveal>
        </div>
      </section>

      {/* 2 · completed and checked */}
      <section className="app-section">
        <Reveal as="div" className="sec-head">
          <h2>Completed and checked</h2>
          <p>A resource counts when its check passes, not when it&apos;s clicked. Each row is a dated event with its source.</p>
        </Reveal>
        <Reveal className="panel feed">
          {props.feedRows.length > 0 && (
            <div className="feed-cols label" aria-hidden="true">
              <span>Resource</span>
              <span>Result</span>
              <span>When</span>
            </div>
          )}
          {props.feedRows.map((row) => (
            <div className="feed-row" key={row.key}>
              <div className="f-main">
                <span className="f-title">{row.title}</span>
                {row.meta !== "" && <span className="f-meta">{row.meta}</span>}
                {row.skill !== null && row.closed && (
                  <span className="f-closed">
                    Closed your <b>{skillShortLabel(row.skill)}</b> gap
                  </span>
                )}
              </div>
              <div className="f-result">
                <span className="f-pass num">
                  Check passed · {row.correct} of {row.total}
                </span>
                <span className="vbadge ok">✓✓ checked resource</span>
                <span className="f-lock">pass at 4 of 5</span>
              </div>
              <span className="f-when num">{row.date}</span>
            </div>
          ))}
          {props.feedRows.length === 0 ? (
            <p className="feed-tail">Nothing yet — your first completion lands here the moment a check passes.</p>
          ) : (
            <p className="feed-tail">
              Nothing else is marked done yet; your next step is waiting in <a href="/pathway">Pathway</a>.
            </p>
          )}
        </Reveal>
      </section>

      {/* 3 · gap-closure history */}
      <section className="app-section">
        <Reveal as="div" className="sec-head">
          <h2>Skills you&apos;ve closed</h2>
          <p className="num-lede num">
            <b>
              {props.closedCount} of {props.mapSize}
            </b>{" "}
            {props.careerName} skills closed. Each row says which path closed it.
          </p>
        </Reveal>
        <Reveal className="panel closed-list">
          {props.closedRows.map((row) => (
            <div className="c-gap" key={row.name}>
              <div className="c-gap-top">
                <span className="g-name">{row.name}</span>
                <span className={`vbadge ${BADGES[row.source].ok ? "ok" : ""}`}>{BADGES[row.source].text}</span>
              </div>
              <div className="g-bar">
                <i style={{ ["--earn" as string]: "1" } as CSSProperties} />
              </div>
              <div className="c-gap-note num">{row.note}</div>
            </div>
          ))}
          {props.closedRows.length === 0 && (
            <p className="feed-tail">No bars closed yet — a passed check closes one live.</p>
          )}
        </Reveal>
        {props.openSkills.length > 0 && (
          <p className="open-foot">
            {props.openSkillCount} of {props.mapSize} still open: {props.openSkills.join(" · ")}. The next step for each is
            ranked in <a href="/pathway">Pathway</a>.
          </p>
        )}
      </section>

      {/* 4 · goals */}
      <section className="app-section" id="goals">
        <Reveal as="div" className="sec-head">
          <h2>Your goals</h2>
          {props.goals.length > 0 ? (
            <p className="num-lede num">
              <b>
                {props.goals.filter((g) => g.status === "completed").length} of {props.goals.length}
              </b>{" "}
              done
            </p>
          ) : (
            <p className="num-lede">No goals yet — accept your suggested goal (training auto-completes) or set your own.</p>
          )}
        </Reveal>
        <Reveal className="panel goals">
          {props.suggestion && !sugDismissed && (
            <div className="card goal-suggest">
              <h3>Suggested from your biggest gap</h3>
              <p className="n-why">{props.suggestion.title} — it&apos;s your top-ranked next step.</p>
              <p className="n-target num">{props.suggestion.target}</p>
              <div className="sug-cta">
                <button className="btn btn-primary" type="button" onClick={acceptSuggestion} disabled={busy}>
                  Set this goal
                </button>
                <button className="quiet-toggle" type="button" onClick={() => setSugDismissed(true)}>
                  No thanks
                </button>
              </div>
            </div>
          )}

          {props.goals.map((g) => {
            const title = edited[g.id] ?? g.title;
            if (g.status === "completed") {
              return (
                <div className="goal-row done" key={g.id}>
                  <div className="g-top">
                    <span className="g-title">{title}</span>
                    {g.type === "training" && <span className="vbadge ok">✓✓ checked resource</span>}
                  </div>
                  <div className="g-status num">{g.doneLine}</div>
                  {g.autoLine && <div className="okband g-event num">{g.autoLine}</div>}
                </div>
              );
            }
            return (
              <div className="goal-row active" key={g.id}>
                <div className="g-top">
                  <span className="g-title">{title}</span>
                  <div className="g-actions">
                    <button
                      className="quiet-toggle g-edit"
                      type="button"
                      aria-expanded={editingId === g.id}
                      onClick={() => (editingId === g.id ? setEditingId(null) : openEdit(g.id, title))}
                    >
                      Edit
                    </button>
                  </div>
                </div>
                <div className="g-status">{g.statusLine}</div>
                {g.check && props.checkResources[g.check.resourceId] && (
                  <div className="g-cta">
                    <button className="btn btn-ghost btn-sm" type="button" onClick={() => setOpenCheck(g.check!.resourceId)}>
                      Start the check
                    </button>
                  </div>
                )}
                {editingId === g.id && (
                  <div className="g-editrow">
                    <input
                      type="text"
                      className="g-input"
                      value={editVal}
                      maxLength={80}
                      aria-label="Edit goal title"
                      onChange={(e) => setEditVal(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          commitEdit(g.id);
                        }
                        if (e.key === "Escape") setEditingId(null);
                      }}
                    />
                    <button className="btn btn-ghost btn-sm g-save" type="button" onClick={() => commitEdit(g.id)}>
                      Save
                    </button>
                    <button className="quiet-toggle g-cancel" type="button" onClick={() => setEditingId(null)}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* zero-goals fallback never dead-ends: the suggestion card + this entry fill it */}
          {props.goals.length === 0 && !props.suggestion && (
            <p className="feed-tail">No goals on your record yet — set one below.</p>
          )}

          <div className="goal-new">
            <button
              className="quiet-toggle"
              type="button"
              aria-expanded={newOpen}
              onClick={() => setNewOpen(!newOpen)}
            >
              {newOpen ? "Close" : "Set a new goal"}
            </button>
            <form
              className="ng-form"
              hidden={!newOpen}
              onSubmit={(e) => {
                e.preventDefault();
                submitNew();
              }}
            >
              <input
                type="text"
                placeholder="e.g. Learn SQL basics"
                maxLength={80}
                aria-label="New goal"
                value={newTitle}
                ref={ngInput}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <div className="choice choice-sm" role="group" aria-label="Goal type">
                <button type="button" aria-pressed={newType === "training"} onClick={() => setNewType("training")}>
                  Training goal
                </button>
                <button type="button" aria-pressed={newType === "milestone"} onClick={() => setNewType("milestone")}>
                  Milestone
                </button>
              </div>
              <button type="submit" className="btn btn-ghost btn-sm" disabled={busy}>
                {busy ? "Setting…" : "Set goal"}
              </button>
            </form>
            {newNote && !newOpen && <div className="okband g-event num">{newNote}</div>}
          </div>
        </Reveal>
      </section>

      {checkResource && openCheck && (
        <CheckOverlay
          resource={checkResource}
          questions={props.checks[openCheck]}
          goalLinked={goalLinked}
          onClose={() => setOpenCheck(null)}
        />
      )}
    </div>
  );
}
