"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import CountUp from "@/components/CountUp";
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

export interface ArFactorLite {
  measured: boolean;
  earned: number;
  max: number;
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
  /** persona line ("Neil · 4th Year, Computer & IT") — state vocabulary */
  persona: string;
  score: { total: number; sp: number; es: number; tp: number; ar: number | null; cc: number };
  parts: { pct: number; earnedFrac: number; unmeasured?: boolean }[];
  /** AR split receipts (ticket 12) — computed per-factor views, not painted */
  arFactors: { resume: ArFactorLite; letter: ArFactorLite; presence: ArFactorLite };
  rubricAria: string;
  esVerified: number;
  updated: string | null;
  nextSkill: string | null;
  nextFree: boolean;
  stageOneDone: number;
  fitLine: string;
  openSkillCount: number;
  mapSize: number;
  feedRows: FeedRow[];
  closedRows: ClosedRow[];
  closedCount: number;
  openSkills: string[];
  goals: GoalView[];
  suggestion: Suggestion | null;
  checkResources: Record<string, CheckResourceLite>;
  checks: Record<string, { stem: string; options: string[]; answer: number }[]>;
}

const BADGES: Record<ClosedRow["source"], { text: string; cls: string }> = {
  verified: { text: "·✓ verified quiz", cls: "chip c-green" },
  checked: { text: "✓✓ checked resource", cls: "chip c-green" },
  claimed: { text: "self-reported", cls: "chip c-grey hatch-chip" },
};

function skillShortLabel(skill: string) {
  return skill.split("(")[0].trim().toLowerCase();
}

/**
 * Progress page body — the record surface, DNA v7 (the v7.2 sweep round).
 * The band names the surface and carries the two-column head (left prose +
 * the family's one primary CTA; right the computed readout instrument);
 * sections run as flush-head white cards (feed → closed bars → goals), and
 * the check overlay rides the same ground. The small M6 goal slice (inline
 * edit · quiet new-goal entry · suggested goal) keeps its prototype
 * semantics; the only motion is the count-up measurement (no entrance).
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

  /* the AR tickline's receipts — per-factor honest views (never "15" alone) */
  const arReceipts = props.score.ar === null ? null : (
    <>
      {" · resume "}
      {props.arFactors.resume.earned}/{props.arFactors.resume.max} · letter{" "}
      {props.arFactors.letter.measured
        ? `${props.arFactors.letter.earned}/${props.arFactors.letter.max}`
        : "not run"}{" "}
      · presence{" "}
      {props.arFactors.presence.measured
        ? `${props.arFactors.presence.earned}/${props.arFactors.presence.max}`
        : "not declared"}
    </>
  );

  return (
    <div className="v7prog">
      {/* ── the named-surface band: left prose + action / right the readout ── */}
      <section className="proband" aria-label="Progress">
        <div className="band">
          <div className="bandrow">
            <div className="who">
              <h1>Progress</h1>
              <p className="band-id">
                {props.persona} · Target: <b>{props.careerName}</b>
              </p>
              <p className="prog-ctx num">
                You&apos;re <b>{props.score.total}%</b> ready for {props.careerName}
                {props.nextSkill !== null && props.openSkillCount > 0 ? (
                  <>
                    ; next: <b>{props.nextSkill}</b>.
                    {props.nextFree ? " Free to start." : ""}
                  </>
                ) : null}
              </p>
              <div className="prog-ctas">
                <a className="btn btn-primary" href="/pathway">
                  Open Pathway <span className="arrow num">→</span>
                </a>
                <a className="link-quiet" href="#goals">
                  Jump to your goals
                </a>
              </div>
            </div>

            <div className="prog-scale">
              <div className="readout-head">
                <div>
                  <span className="label num">Readiness · {props.careerName}</span>
                  <div className="readout-sub num">{props.updated ? `updated ${props.updated}` : "recorded at set-up"}</div>
                </div>
                <div className="readout-score num">
                  <CountUp
                    to={props.score.total}
                    dec={0}
                    dur={900}
                    onDone={() => setArmed(true)}
                    ariaLabel={`Readiness ${props.score.total} of 100`}
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
                  <b>Employability</b> — {props.score.es} of {WEIGHTS.es} ·{" "}
                  <span className="tick-note">{props.esVerified} of 7 NACE competencies verified ·✓</span>
                </div>
                <div className="tickline">
                  <b>Training</b> — {props.score.tp} of {WEIGHTS.tp} · {props.stageOneDone} of 3 first steps done
                </div>
                <div className="tickline">
                  <b>Application readiness</b> —{" "}
                  {props.score.ar === null ? (
                    <span className="tick-note">not yet measured — the resume diagnostic in Prep opens this channel (resume 7 · letter 5 · presence 3)</span>
                  ) : (
                    <>
                      {props.score.ar} of {WEIGHTS.ar}
                      <span className="tick-note">{arReceipts}</span>
                    </>
                  )}
                </div>
                <div className="tickline">
                  <b>Career direction</b> — {props.score.cc} of {WEIGHTS.cc}
                </div>
              </div>
              <div className="readout-fit num">{props.fitLine}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── completed and checked — the dated feed ── */}
      <section className="card feed">
        <div className="head">
          <h2 className="h-title">Completed and checked</h2>
          <span>Counts when the check passes — not when it&apos;s clicked.</span>
          {props.feedRows.length > 0 && (
            <span className="label num">
              {props.feedRows.length} PASSED
            </span>
          )}
        </div>
        {props.feedRows.length > 0 && (
          <div className="feed-cols" aria-hidden="true">
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
              <span className="f-pass">
                Check passed · {row.correct} of {row.total}
              </span>
              <span className="chip c-green">✓✓ checked resource</span>
              <span className="f-lock">pass at 4 of 5</span>
            </div>
            <span className="f-when">{row.date}</span>
          </div>
        ))}
        {props.feedRows.length === 0 ? (
          <p className="feed-tail">Nothing yet — your first passed check lands here.</p>
        ) : (
          <p className="feed-tail">
            Next step waits in <a href="/pathway">Pathway</a>.
          </p>
        )}
      </section>

      {/* ── skills you've closed — the bar ledger with its evidence paths ── */}
      <section className="card">
        <div className="head">
          <h2 className="h-title">Skills you&apos;ve closed</h2>
          <span className="num">
            <b>
              {props.closedCount} of {props.mapSize}
            </b>{" "}
            {props.careerName} skills closed
          </span>
        </div>
        <div className="closed-list">
          {props.closedRows.map((row) => (
            <div className="c-gap" key={row.name}>
              <div className="c-gap-top">
                <span className="g-name">{row.name}</span>
                <span className={BADGES[row.source].cls}>{BADGES[row.source].text}</span>
              </div>
              <div className="g-bar">
                <i
                  className={row.source === "claimed" ? "claim" : ""}
                  style={{ ["--earn" as string]: "1" } as CSSProperties}
                />
              </div>
              <div className="c-gap-note num">{row.note}</div>
            </div>
          ))}
          {props.closedRows.length === 0 && (
            <p className="feed-tail">No bars closed yet — a passed check closes one.</p>
          )}
        </div>
        {props.openSkills.length > 0 && (
          <p className="open-foot num">
            {props.openSkillCount} of {props.mapSize} still open: {props.openSkills.join(" · ")}. Next steps ranked in{" "}
            <a href="/pathway">Pathway</a>.
          </p>
        )}
      </section>

      {/* ── your goals — the recorded commitments ── */}
      <section className="card goals" id="goals">
        <div className="head">
          <h2 className="h-title">Your goals</h2>
          {props.goals.length > 0 ? (
            <span className="label num">
              {props.goals.filter((g) => g.status === "completed").length} OF {props.goals.length} DONE
            </span>
          ) : (
            <span>No goals yet — set one below.</span>
          )}
        </div>
        <div className="goals-list">
          {props.suggestion && !sugDismissed && (
            <div className="goal-suggest">
              <h3>Suggested from your biggest gap</h3>
              <p className="n-why">{props.suggestion.title}</p>
              <p className="n-target">{props.suggestion.target}</p>
              <div className="sug-cta">
                <button className="btn btn-ghost btn-sm" type="button" onClick={acceptSuggestion} disabled={busy}>
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
                    {g.type === "training" && <span className="chip c-green">✓✓ checked resource</span>}
                  </div>
                  <div className="g-status num">{g.doneLine}</div>
                  {g.autoLine && <div className="g-event okband num">{g.autoLine}</div>}
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

          {/* zero-goals state lives in the card head — the entry below finishes it */}

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
              <div className="choice" role="group" aria-label="Goal type">
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
            {newNote && !newOpen && <div className="g-event okband num">{newNote}</div>}
          </div>
        </div>
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
