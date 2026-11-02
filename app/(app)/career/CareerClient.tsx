"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TablePager from "@/components/TablePager";
import { SegRubricBar, VBadge } from "@/components/instrument";
import { rubricParts } from "@/lib/engines/rubric";
import { roundHalfDown, WEIGHTS, type Score } from "@/lib/engines/score";
import { reassessDisplay, reassessWhat } from "./career-copy";
import type { CareerProps, RoleRowData, VerifiedBarData } from "./types";
import { degreeGateAllows } from "@/lib/degree-gate";

/**
 * v7.2 Careers surface interactivity — one role list, zero sub-tabs (ruled
 * page architecture 2026-10-28): the AI-ranked "Best matches for you" lens is
 * the DEFAULT reader of the single role card, with the track-filtered "All
 * roles" fallback; role rows expand into the ruled role-detail blocks
 * (catalog truth only), and the beat-6 SWITCH chain stays byte-honest:
 * confirm → POST /api/switch → honest dip → quick re-assessment →
 * POST /api/claim → recovered baseline.
 *
 * Dip basis: canon `_fixture-math.md` beat 6 reads SP 0 at the switch — a
 * ·✓ skill's transfer re-registers on the new career map at the re-assessment.
 * The readout therefore counts bars closed on the new map EXCLUDING the
 * carried set (computed from the real state transition, never painted).
 */

type Lens = "ranked" | (typeof TRACK_CHIPS)[number];
type Flow = "tabs" | "locked" | "confirm" | "reset" | "recovered";
type Rating = "yes" | "some" | "no";

const TRACK_CHIPS = [
  "All",
  "Computer & IT",
  "Business & Management",
  "Accounting & Finance",
  "Office & Administration",
] as const;
const LENS_CHIPS = ["Best matches for you", ...TRACK_CHIPS] as const;

/* the ranked lens's user-facing label must map BACK to "ranked" — casting the
   label as Lens left the list matching no lens value: the chip sat unpressed
   on load and clicking it produced zero rows (the unreachable "no careers
   indexed" message) */
const lensForChip = (s: (typeof LENS_CHIPS)[number]): Lens =>
  s === "Best matches for you" ? "ranked" : (s as Lens);

const CANON_TARGET: { id: string; name: string } = {
  id: "qa",
  name: "Software QA Analyst",
};

/* degree-gate matching/ranking share lib/degree-gate.ts (the same rule the
   /api/switch route enforces server-side) — the ranked lens lists only the
   roles that map to the student's program */

const LEVEL_BY_RATING: Record<Rating, "confident" | "kindof" | "notyet"> = {
  yes: "confident",
  some: "kindof",
  no: "notyet",
};
const DEFAULT_RATINGS: Record<string, Rating> = {
  "Test Planning": "yes",
  "Defect management": "yes",
  "Applications Support and Enhancement": "yes",
};
/* the pager's page size — 10 rows a page is a REAL data need: the one-list
   shows the whole 36-career catalog on both lenses */
const PAGE_SIZE = 10;

interface DipView {
  score: Score;
  parts: ReturnType<typeof rubricParts>;
}

interface ResetData {
  dip: DipView;
  bars: Record<string, { source: string }>;
  closedNow: number;
  /** persisted ·✓ hand-off from the switch (decisions.verifiedTransferred) */
  carried: string[];
}

interface RecoveredData {
  from: number;
  score: Score;
  closed: number;
  transferred: string[];
  selfReported: string[];
}

/** degree-gate lockout — the target's majors don't include the student's program */
interface LockData {
  name: string;
  majors: string;
  program: string;
  fromName: string;
}

function Arrow() {
  return (
    <span className="arrow">
      <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        width="0.8em"
        height="0.8em"
      >
        <path d="M4 10h11" />
        <path d="M11 5l5 5-5 5" />
      </svg>
    </span>
  );
}

function Chev() {
  /* drawn chevron — borders, no glyph font (family spec) */
  return <span className="chev" aria-hidden="true" />;
}

function BarLabel(score: Score, sub: string): string {
  return (
    `Score ${score.total} of 100 ${sub} — skill progress ${score.sp} of ${WEIGHTS.sp}, employability skills ${score.es} of ${WEIGHTS.es}, ` +
    `training progress ${score.tp} of ${WEIGHTS.tp}, application readiness ${score.ar === null ? "not yet measured" : score.ar + " of " + WEIGHTS.ar}, career direction ${score.cc} of ${WEIGHTS.cc}`
  );
}

export default function CareerClient({
  card,
  verifiedBars,
  activeGoal,
  barsSources,
  roles,

  zeroConfirmed,
  reassess: reassessCanon,
  program,
}: CareerProps) {
  const router = useRouter();
  const [lens, setLens] = useState<Lens>("ranked");
  const [openId, setOpenId] = useState<string | null>(null);
  const [flow, setFlow] = useState<Flow>("tabs");
  const [lock, setLock] = useState<LockData | null>(null);
  const [discOpen, setDiscOpen] = useState(false);
  const [banner, setBanner] = useState(false);
  const [busy, setBusy] = useState(false);
  const [armed, setArmed] = useState(false);
  const [flowTarget, setFlowTarget] = useState<{ id: string; name: string }>(CANON_TARGET);
  const [preSwitch, setPreSwitch] = useState<{
    fromName: string;
    verified: VerifiedBarData[];
    goal: string | null;
    bars: Record<string, string>;
  } | null>(null);
  const [reset, setReset] = useState<ResetData | null>(null);
  const [recovered, setRecovered] = useState<RecoveredData | null>(null);
  const [qaGoalPosted, setQaGoalPosted] = useState(false);
  const [reassess, setReassess] = useState(reassessCanon);

  /* pager — rows keep their ABSOLUTE indices (page 2 opens at rank 11, never
     a re-numbered list). The auto-position guard covers the case where the
     current row sits past page 1: the pager opens ON that row's page so the
     row lands on the initially-open page. Dormant when it's on page 1. */
  const [page, setPage] = useState(() => {
    const initial = [...roles].sort((a, b) => b.x - a.x);
    const pageOf = (pred: (r: RoleRowData) => boolean) => {
      const i = initial.findIndex(pred);
      return i < 0 ? 0 : Math.floor(i / PAGE_SIZE) + 1;
    };
    return pageOf((r) => r.current) || 1;
  });

  /* lens/filter changes land on page 1 IN THE SAME EVENT: resetting the page
     from an effect fires after the browser paints, so the old page's slice
     flashes through the new lens (short or empty body) before regrowing —
     a cumulative layout shift on every tab click */
  const switchLens = (next: Lens) => {
    setLens(next);
    setPage(1);
  };

  const [ratings, setRatings] = useState<Record<string, Rating>>(() =>
    Object.fromEntries(reassessCanon.map((r) => [r.name, DEFAULT_RATINGS[r.name] ?? "no"]))
  );

  /* arm the reset/recovered rubric bars ~250ms after the section shows */
  useEffect(() => {
    if (flow === "reset" || flow === "recovered") {
      const t = setTimeout(() => setArmed(true), 250);
      return () => clearTimeout(t);
    }
    setArmed(false);
  }, [flow]);

  /* the switch modal takes focus when it opens (Esc + Tab behave) */
  useEffect(() => {
    if (flow !== "confirm" && flow !== "locked") return;
    document.querySelector<HTMLElement>(".sw-dialog")?.focus();
  }, [flow]);

  const scrollTop = () => window.scrollTo(0, 0);

  // ---------- lens + the one list ----------
  /* ranked ordering reads the engine's fit numbers (server-computed
     skillsMatch), deepest overlap first, catalog order breaking ties —
     never a painted rank. The lens lists ONLY degree-mappable roles
     (user ruling 2026-11-02): sorting runs after the degree filter. */
  const ranked = [...roles]
    .filter((r) => r.degreeAllowed)
    .sort((a, b) => b.x - a.x);
  const rows: RoleRowData[] =
    lens === "ranked"
      ? ranked
      : lens === "All"
        ? roles
        : roles.filter((r) => r.trackLabel === lens);
  /* tabs only filter rows — the table always keeps the ranked layout
     (RANK / CAREER / SKILLS IN COMMON / ENTRY PATH) */
  const colsClass = "cols-ranked";

  /* page slice — the lens-row kicker and the pager bar both print the
     page-true range computed from the same rows that render */
  const sliceStart = (page - 1) * PAGE_SIZE;
  const pageRows = rows.slice(sliceStart, sliceStart + PAGE_SIZE);
  const pageCount = Math.ceil(rows.length / PAGE_SIZE);
  const showingTo = Math.min(sliceStart + PAGE_SIZE, rows.length);

  // ---------- switch flow ----------
  const openConfirm = async (id: string) => {
    // every target resolves its own catalog row (the canon one too — the
    // degree gate and the carry filter read the full skill map + degreeMap);
    // catalog import is code-split
    try {
      const { getCareer } = await import("@/lib/fixtures/catalog");
      const t = getCareer(id);
      if (!t) return; // unknown id — honest failure, nothing changes
      setFlowTarget({ id: t.id, name: t.name });
      const next = t.skills.map((s) => ({
        name: s.name,
        display: reassessDisplay(s.name),
        what: reassessWhat(s.name, s.what),
      }));
      setReassess(next);
      setRatings((prev) => {
        const merged: Record<string, Rating> = {};
        for (const r of next) merged[r.name] = prev[r.name] ?? DEFAULT_RATINGS[r.name] ?? "no";
        return merged;
      });
      // degree gate (user ruling 2026-11-02): the program not being in the
      // target's major map locks the switch; an empty program feeds no gate
      if (!degreeGateAllows(program, t.degreeMap)) {
        setLock({
          name: t.name,
          majors: t.degreeMap.join(" · "),
          // degreeGateAllows is false here ⇒ a program string exists
          program: program ?? "",
          fromName: card?.name ?? "your current role",
        });
        setDiscOpen(false);
        setFlow("locked");
        scrollTop();
        return;
      }
      setPreSwitch({
        fromName: card?.name ?? "",
        // carry-only truth (WHAT STAYS fix): list just the proven bars that
        // actually transfer — verified AND on the target's skill map
        verified: verifiedBars.filter((b) => t.skills.some((s) => s.name === b.name)),
        // goal-stays truth: a training goal carries only if its linked skill
        // sits on the target's map (milestones are career-agnostic and carry);
        // an irrelevant goal drops out of the modal entirely
        goal:
          activeGoal &&
          (!activeGoal.skill || t.skills.some((s) => s.name === activeGoal.skill))
            ? activeGoal.title
            : null,
        bars: barsSources,
      });
    } catch {
      return; // honest failure — nothing changes
    }
    setDiscOpen(false);
    setFlow("confirm");
    scrollTop();
  };

  const enterSwitch = () => {
    setDiscOpen(false);
    setBanner(true);
    switchLens("All");
    scrollTop();
  };

  const cancelSwitch = () => {
    setBanner(false);
    setFlow("tabs");
    scrollTop();
  };

  async function doSwitch() {
    if (!preSwitch || busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/switch", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ to: flowTarget.id, student: "neil" }),
      });
      if (!res.ok) throw new Error("switch failed");
      router.refresh();
      const v = await (await fetch("/api/state", { cache: "no-store" })).json();
      const carried = new Set(
        Object.entries(preSwitch.bars)
          .filter(([, src]) => src === "verified")
          .map(([name]) => name)
      );
      const fresh = Object.keys(v.state.bars).filter(
        (n: string) => !carried.has(n)
      ).length;
      const sp = roundHalfDown((WEIGHTS.sp * fresh) / v.career.skills.length);
      const dipScore: Score = {
        sp,
        es: v.score.es,
        tp: v.score.tp,
        ar: v.score.ar ?? null,
        arParts: v.score.arParts,
        cc: v.score.cc,
        total: sp + v.score.es + v.score.tp + (v.score.ar ?? 0) + v.score.cc,
      };
      setReset({
        dip: { score: dipScore, parts: rubricParts(dipScore) },
        bars: v.state.bars,
        closedNow: Object.keys(v.state.bars).length,
        carried: v.state.decisions?.verifiedTransferred ?? [],
      });
      setFlow("reset");
      scrollTop();
    } catch {
      setFlow("tabs");
    } finally {
      setBusy(false);
    }
  }

  const isLockedSkill = (name: string): "verified" | "checked" | null => {
    // the carried ·✓ set is persisted at switch time (decisions) — reading bars
    // here would always see {} (canon dip: SP 0 until re-assessment)
    if ((reset?.carried ?? []).includes(name)) return "verified";
    const b = reset?.bars[name];
    if (!b) return null;
    if (b.source === "verified") return "verified";
    if (b.source === "checked") return "checked";
    return null;
  };

  async function submitReassessment() {
    if (busy || !reset) return;
    setBusy(true);
    try {
      const claims = reassess
        .filter((r) => !isLockedSkill(r.name))
        .map((r) => ({ skill: r.name, level: LEVEL_BY_RATING[ratings[r.name] ?? "no"] }));
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ claims, student: "neil" }),
      });
      if (!res.ok) throw new Error("claim failed");
      router.refresh();
      const v = await (await fetch("/api/state", { cache: "no-store" })).json();
      setRecovered({
        from: reset.dip.score.total,
        score: v.score as Score,
        closed: Object.keys(v.state.bars).length,
        transferred: v.state.decisions?.verifiedTransferred ?? [],
        selfReported: Object.entries(v.state.bars as Record<string, { source: string }>)
          .filter(([, b]) => b.source === "claimed")
          .map(([name]) => name),
      });
      setFlow("recovered");
      scrollTop();
    } catch {
      setFlow("reset");
    } finally {
      setBusy(false);
    }
  }

  const backToCareer = () => {
    setRecovered(null);
    setFlow("tabs");
    setBanner(false);
    switchLens("ranked");
    scrollTop();
  };

  async function postQaGoal() {
    setBusy(true);
    try {
      const res = await fetch("/api/goal", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          student: "neil",
          title: "Build my first test plan",
          type: "training",
          resourceId: "res-qa-testing",
          skill: "Software Testing",
        }),
      });
      if (!res.ok) throw new Error("goal failed");
      setQaGoalPosted(true);
      router.refresh();
    } catch {
      /* honest failure: button stays enabled; the demo retries */
    } finally {
      setBusy(false);
    }
  }

  // ---------- markup ----------
  const bandcell = (label: string, value: string, num?: boolean) => (
    <div className="bcell" key={label}>
      <span className="label">{label}</span>
      <span className={`bval${num ? " num" : ""}`}>{value}</span>
    </div>
  );

  return (
    <div className="v7career">
      {/* ============================================================
          VIEW · Careers — default state (one list, zero sub-tabs)
          ============================================================ */}
      <section id="career-view">
        {/* named band — the tray carries the role identity (the standalone
            current-career card is dead: user ruling 2026-11-02 — its facts
            were half-duplicates of these band cells) + the ONE steer: the
            gaps CTA, with the switch disclosure riding under it */}
        <header className="band">
          <div className="bandrow">
            <div className="who">
              <h1 className="t">Your career</h1>
              {card ? (
                <p className="m">
                  <b>{card.name}</b> · {card.what}
                </p>
              ) : (
                <p className="m">No career picked yet.</p>
              )}
            </div>
            <div className="bandside">
              {card ? (
                <>
                  <a className="cta" href="/pathway">
                    See your gaps →
                  </a>
                  <div className="cc-switch">
                    <button
                      className="quiet-toggle"
                      type="button"
                      aria-expanded={discOpen}
                      aria-controls="switch-disclosure"
                      onClick={() => setDiscOpen((o) => !o)}
                    >
                      Switch career
                    </button>
                    <div className={`disclosure ${discOpen ? "show" : ""}`} id="switch-disclosure">
                      <p>
                        Score and gap bars reset toward the new career — proven skills (
                        {verifiedBars.map((b, i) => (
                          <span key={b.name}>
                            {i > 0 && " "}
                            <VBadge ok>
                              {b.name} ·{b.src === "verified" ? "✓" : "✓✓"}
                            </VBadge>
                          </span>
                        ))}
                        ) and goals stay.{" "}
                        <button className="quiet-toggle disc-go" type="button" onClick={enterSwitch}>
                          Browse careers to switch →
                        </button>
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => {
                    switchLens("All");
                    scrollTop();
                  }}
                >
                  Explore by track
                </button>
              )}
            </div>
          </div>
          {card && (
            <div className="bandcells">
              {bandcell("Track", card.trackLabel)}
              {bandcell("Skill map", `${card.closed} of ${card.mapSize} on your baseline`, true)}
              {bandcell("First 30 days", `${card.stageOneDone} of 3 done`, true)}
            </div>
          )}
        </header>

        {/* lens rail — OUTSIDE the card (user ruling 2026-11-02): the chips
            are a toolbar over the list, the SHOWING kicker rides with them */}
        <div className="lens-row">
          <div className="ptabs" role="group" aria-label="Filter by track" id="strand-chips">
            {LENS_CHIPS.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={lens === lensForChip(s)}
                onClick={() => {
                  switchLens(lensForChip(s));
                  setOpenId(null);
                }}
              >
                {s}
              </button>
            ))}
          </div>
          {/* the ONE tracked SHOWING line — page-true range on the paged list
              (rows keep absolute positions); the zero-branches keep bytes */}
          {rows.length === 0 || (zeroConfirmed && lens === "ranked") ? (
            <span className="kicker num" id="explore-count">
              SHOWING {rows.length} OF {rows.length} CAREERS
            </span>
          ) : (
            <span className="kicker num" id="explore-count">
              SHOWING {sliceStart + 1}–{showingTo} OF {rows.length} CAREERS
            </span>
          )}
        </div>

        {/* ---------- the one role list (Best matches / All roles) ---------- */}
        <div className="card rolecard">
          {banner && (
            <div className="sw-banner">
              Browsing to switch — nothing changes until you confirm a different career.
            </div>
          )}

          {zeroConfirmed && lens === "ranked" ? (
            /* zero-demonstrated default (edge-case audit §2): the compressed row */
            <div className="match-table">
              <div className="match-head label" aria-hidden="true">
                <span>CAREER</span>
                <span>SKILLS IN COMMON</span>
              </div>
              <div className="match-row">
                <div className="m-main">
                  <span className="m-name">Nothing confirmed yet</span>
                </div>
                <span className="m-fit num m-zero">—</span>
                <p className="m-sub num">
                  Matching starts once a skill is confirmed — pass a check on one and this list builds
                  from it. Skills you rate yourself feed your baseline, but they never count toward
                  matching.
                </p>
              </div>
            </div>
          ) : (
            <>
            <div className={`index-table ${colsClass}`}>
              <div className="index-colheads" aria-hidden="true">
                <span className="ch-rank">RANK</span>
                <span className="ch-career">CAREER</span>
                <span className="ch-fit">SKILLS IN COMMON</span>
                <span className="ch-entry">ENTRY PATH</span>
                <span className="ch-exp" aria-hidden="true" />
              </div>

              {/* the page slice — `i` is the ABSOLUTE sheet index (rank prints
                  sliceStart + i + 1, so page 2 opens at rank 11); the pagers
                  above keep both lenses' indices engine-true */}
              {pageRows.map((r, i) => {
                const abs = sliceStart + i;
                return (
                  <div className="role-block" key={r.id}>
                    <div
                      className={`index-row ${colsClass}${openId === r.id ? " row-open" : ""}`}
                      onClick={() => setOpenId((cur) => (cur === r.id ? null : r.id))}
                    >
                      <span className="rank num">{abs + 1}</span>
                      <span className="cell-career">
                        <button
                          type="button"
                          className="row-name"
                          aria-expanded={openId === r.id}
                          aria-controls={`detail-${r.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenId((cur) => (cur === r.id ? null : r.id));
                          }}
                        >
                          {r.name}
                        </button>
                        {r.current && <span className="chip c-blue">CURRENT</span>}
                        <span className="c-sub">
                          {r.current ? r.why : r.what}
                        </span>
                      </span>
                      <span className="cell-fit" aria-label={`${r.x} of ${r.y} skills in common`}>
                        <span className={`fit-line num ${r.x === 0 ? "fit-zero" : ""}`}>
                          {r.x} of {r.y}
                        </span>
                        <span className="mbar" aria-hidden="true">
                          <i style={{ width: `${(r.x / r.y) * 100}%` }} />
                        </span>
                      </span>
                      <span className="cell-entry num">{r.entry}</span>
                      <span className="cell-exp" aria-hidden="true">
                        <Chev />
                      </span>
                    </div>

                    {/* role detail — the registry-fact strip (v7.3 ruling):
                        what lives in the row, skill map counts live in the
                        fit column — the drawer keeps the three catalog
                        receipts only */}
                    {openId === r.id && (
                      <div className="index-detail" id={`detail-${r.id}`}>
                        <div className="d-grid">
                          <div className="d-block">
                            <span className="label">REGISTERED OCCUPATION</span>
                            <p className="num">{r.psoc}</p>
                          </div>
                          <div className="d-block">
                            <span className="label">MAJORS THAT MAP HERE</span>
                            <p>{r.majors}</p>
                          </div>
                          <div className="d-block">
                            <span className="label">JOB MARKET</span>
                            <p>{r.demand}</p>
                          </div>
                        </div>
                        {!r.current && (
                          <div className="d-cta">
                            <button
                              className="btn btn-ghost"
                              type="button"
                              onClick={() => openConfirm(r.id)}
                            >
                              Change target role
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* the pager closes the paged list — nav-only, because the
                lens-row kicker carries the one tracked SHOWING line (the
                Sparing Label Rule); a single-page list stays pager-free
                (element budget) */}
            {pageCount > 1 ? (
              <TablePager
                showRange={false}
                showingFrom={sliceStart + 1}
                showingTo={showingTo}
                total={rows.length}
                page={page}
                pageCount={pageCount}
                onPage={setPage}
              />
            ) : null}
            </>
          )}

        </div>
      </section>

      {/* ============================================================
          SWITCH FLOW — a MODAL over the careers page (user ruling
          2026-11-02: "Change target role must not steer the user to a
          different page with no way back"). confirm → dip → recovered
          run inside one dialog; "Keep {preSwitch.fromName}" / Esc /
          scrim close it back (confirm state only — after the commit
          the modal follows the flow's state, never exits early).
          The beat-6 walk (Software Developer → Software QA Analyst)
          is unchanged otherwise.
          ============================================================ */}
      {flow !== "tabs" && (
        <div className="sw-modal" role="dialog" aria-modal="true" aria-label="Switch career">
          <div
            className="sw-scrim"
            onClick={flow === "confirm" || flow === "locked" ? cancelSwitch : undefined}
          />
          <div
            className="sw-dialog"
            data-flow={flow}
            tabIndex={-1}
            onKeyDown={(e) => {
              if (e.key === "Escape" && (flow === "confirm" || flow === "locked")) cancelSwitch();
            }}
          >
            {/* state 0 · degree gate: the target isn't mapped from the
                student's program — no switch offered */}
            <section id="sw-locked" hidden={flow !== "locked"}>
              {flow === "locked" && lock && (
                <>
                  <header className="sw-head">
                    <h1 className="t">Can&apos;t switch to {lock.name}</h1>
                  </header>
                  <div className="sw-panel">
                    <p className="sw-cost">
                      Degree gate — <b>{lock.program}</b> isn&apos;t in the majors that map to this
                      role, so the switch isn&apos;t offered.
                    </p>
                    <div className="sw-stays">
                      <span className="label">MAJORS THAT MAP HERE</span>
                      <p>{lock.majors}</p>
                    </div>
                    <div className="sw-actions">
                      <button className="btn btn-primary" type="button" onClick={cancelSwitch}>
                        Keep {lock.fromName}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </section>

            {/* state 1 · confirm, cost first */}
            <section id="sw-confirm" hidden={flow !== "confirm"}>
        {flow === "confirm" && preSwitch && (
          <>
            <header className="sw-head">
              <h1 className="t">Switch to {flowTarget.name}?</h1>
            </header>
            <div className="sw-panel">
              <p className="sw-cost">Gap bars and training progress reset for the new role.</p>
              {(preSwitch.verified.length > 0 || preSwitch.goal) && (
                <div className="sw-stays">
                  <span className="label">WHAT STAYS</span>
                  {preSwitch.verified.length > 0 && (
                    <p>
                      Skills already proven:{" "}
                      {preSwitch.verified.map((b, i) => (
                        <span key={b.name}>
                          {i > 0 && " "}
                          <VBadge ok>
                            {b.name} ·{b.src === "verified" ? "✓" : "✓✓"}
                          </VBadge>
                        </span>
                      ))}
                    </p>
                  )}
                  {preSwitch.goal && (
                    <span className="sw-goal">
                      Your goal &ldquo;{preSwitch.goal}&rdquo; stays active.
                    </span>
                  )}
                </div>
              )}
              <p className="sw-backnote">Switching saves immediately — you can switch back any time.</p>
              <div className="sw-actions">
                <button
                  className="btn btn-primary"
                  type="button"
                  disabled={busy}
                  onClick={doSwitch}
                >
                  {busy ? "Switching…" : `Switch to ${flowTarget.name}`}
                </button>
                <button className="btn btn-ghost" type="button" onClick={cancelSwitch}>
                  Keep {preSwitch.fromName}
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {/* state 2 · honest drop + quick re-assessment */}
      <section id="sw-reset" hidden={flow !== "reset"}>
        {flow === "reset" && reset && preSwitch && (
          <>
            <header className="sw-head">
              <h1 className="t">Score reset for your new career</h1>
              <p className="m">
                Gap bars and training progress were built around {preSwitch.fromName} — the switch
                resets them toward {flowTarget.name}.
              </p>
            </header>

            <div className="card readout">
              <div className="readout-head">
                <div>
                  <span className="label">
                    READINESS · <b className="sample-tag">{flowTarget.name.toUpperCase()}</b>
                  </span>
                  <div className="readout-sub">out of 100 · right after the switch</div>
                </div>
                <div className="readout-score num">
                  {reset.dip.score.total}
                  <small>/100</small>
                </div>
              </div>
              <div className="rubric-mini">
                <SegRubricBar
                  parts={reset.dip.parts}
                  armed={armed}
                  height={10}
                  ariaLabel={BarLabel(reset.dip.score, "after the switch")}
                />
              </div>
              <div className="readout-legend">
                <span><b>SP</b> {reset.dip.score.sp}/{WEIGHTS.sp}</span>
                <span><b>ES</b> {reset.dip.score.es}/{WEIGHTS.es}</span>
                <span><b>TP</b> {reset.dip.score.tp}/{WEIGHTS.tp}</span>
                <span><b>AR</b> {reset.dip.score.ar === null ? "—" : `${reset.dip.score.ar}/${WEIGHTS.ar}`}</span>
                <span><b>CC</b> {reset.dip.score.cc}/{WEIGHTS.cc}</span>
              </div>
              <div className="readout-fit">
                The {reset.dip.score.total} that stays is competencies and career direction: verified skills ·✓
                and an active goal survive career-specific resets.
              </div>
            </div>

            <div className="reassess">
              <h2>Where you stand on {flowTarget.name}</h2>
              <p>
                Rate each skill: claims feed your baseline, but only skills you pass a check on count as
                confirmed.
              </p>
              <div className="card skill-list">
                {reassess.map((r) => {
                  const locked = isLockedSkill(r.name);
                  return (
                    <div className={`skill-row ${locked ? "skill-locked" : ""}`} key={r.name}>
                      <span className="s-name">{r.display}</span>
                      <span className="s-what">
                        {locked ? (
                          <VBadge ok>
                            Confirmed ·{locked === "verified" ? "✓ transferred" : "✓✓"}
                          </VBadge>
                        ) : (
                          r.what
                        )}
                      </span>
                      {!locked && (
                        <div className="choice choice-sm" role="group" aria-label={`Rate: ${r.display}`}>
                          {(["yes", "some", "no"] as const).map((v) => (
                            <button
                              key={v}
                              type="button"
                              aria-pressed={ratings[r.name] === v}
                              onClick={() => setRatings((rs) => ({ ...rs, [r.name]: v }))}
                            >
                              {v === "yes" ? "Can do" : v === "some" ? "Some" : "Not yet"}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="reassess-note">
                Self-reported skills never count toward Skills-match; a check you pass later confirms
                them.
              </p>
              <button
                className="btn btn-primary"
                type="button"
                disabled={busy}
                onClick={submitReassessment}
              >
                {busy ? "Reading…" : "See my baseline"}
              </button>
            </div>
          </>
        )}
      </section>

      {/* state 3 · recovered */}
      <section id="sw-recovered" hidden={flow !== "recovered"}>
        {flow === "recovered" && recovered && (
          <>
            <header className="sw-head">
              <h1 className="t">Your baseline on {flowTarget.name}</h1>
            </header>

            <div className="card readout">
              <div className="readout-head">
                <div>
                  <span className="label">
                    READINESS · <b className="sample-tag">{flowTarget.name.toUpperCase()}</b>
                  </span>
                  <div className="readout-sub">out of 100 · reset, then rebuilt from your re-assessment</div>
                </div>
                <div className="readout-score num">
                  <span className="score-from">{recovered.from}</span>
                  <span className="score-arrow" aria-hidden="true">→</span>
                  <span className="score-to">{recovered.score.total}</span>
                  <small>/100</small>
                </div>
              </div>
              <div className="rubric-mini">
                <SegRubricBar
                  parts={rubricParts(recovered.score)}
                  armed={armed}
                  height={10}
                  ariaLabel={BarLabel(recovered.score, "after re-assessment")}
                />
              </div>
              <div className="readout-legend">
                <span><b>SP</b> {recovered.score.sp}/{WEIGHTS.sp}</span>
                <span><b>ES</b> {recovered.score.es}/{WEIGHTS.es}</span>
                <span><b>TP</b> {recovered.score.tp}/{WEIGHTS.tp}</span>
                <span><b>AR</b> {recovered.score.ar === null ? "—" : `${recovered.score.ar}/${WEIGHTS.ar}`}</span>
                <span><b>CC</b> {recovered.score.cc}/{WEIGHTS.cc}</span>
              </div>
              <div className="readout-fit">
                <b className="num">
                  {recovered.from} → {recovered.score.total}
                </b>{" "}
                · the reset measured the right things, then rebuilt on what you reported.
              </div>
            </div>

            <div className="card recover-panel">
              <span className="label">YOUR BASELINE</span>
              <p className="rec-line num">
                {recovered.closed} of {reassess.length} skills on your baseline
                {recovered.transferred.length > 0 && (
                  <>
                    {" — "}
                    {recovered.transferred.map((t, i) => (
                      <span key={t}>
                        {i > 0 && " "}
                        <VBadge ok>
                          {t} ·✓
                        </VBadge>
                      </span>
                    ))}
                    {" "}transferred
                  </>
                )}
                {recovered.selfReported.length > 0 && (
                  <>
                    {recovered.transferred.length > 0 ? "; " : " — "}
                    {recovered.selfReported.map((n) => n.toLowerCase()).join(", ")} self-reported.
                  </>
                )}
                {recovered.transferred.length === 0 && recovered.selfReported.length === 0 && "."}
              </p>
              <p className="rec-note">
                Self-reported skills feed the baseline but never count toward Skills-match — only checks
                you pass do.
              </p>
              {/* canon Q13: a new Training goal is suggested in the new career's terms —
                  the canon suggestion is wired to the QA walk (beat 7) */}
              {flowTarget.id === CANON_TARGET.id && (
                <div className="card nextcard">
                  <h3>Set your next goal</h3>
                  <p className="n-target num">
                    free · ~4 hours · Test Automation University
                  </p>
                  <p className="n-why">
                    Closes your first open gap in Software Testing — one of the skills QA analysts use every day.
                  </p>
                  <p className="n-why n-why-quiet">
                    When you finish the resource and pass its 5-question check, this goal marks itself done —
                    automatically, under Progress. You&apos;ll see it happen.
                  </p>
                  <div className="n-cta">
                    <button
                      className="btn btn-primary"
                      type="button"
                      disabled={qaGoalPosted || busy}
                      onClick={postQaGoal}
                    >
                      {qaGoalPosted ? "Goal set — it's on your Progress page." : "Set this goal"}
                    </button>
                  </div>
                </div>
              )}
              <div className="sw-actions rec-actions">
                {/* the view's one primary is the suggested goal; the gaps stay a ghost */}
                <a className="btn btn-ghost" href="/pathway">
                  See your gaps <Arrow />
                </a>
                <button className="btn btn-ghost" type="button" onClick={() => backToCareer()}>
                  Back to Career
                </button>
              </div>
            </div>
          </>
        )}
      </section>
          </div>
        </div>
      )}
    </div>
  );
}
