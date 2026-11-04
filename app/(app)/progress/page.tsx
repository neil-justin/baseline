import type { Metadata } from "next";
import { getStudentView } from "@/lib/db";
import { ArrowRight } from "lucide-react";
import { requireStudent } from "@/lib/session";
import { scoreView } from "@/lib/engines/rubric";
import { WEIGHTS } from "@/lib/engines/score";
import { rankOpenSkills, openSkills as openSkillNames, stageOne } from "@/lib/engines/gaps";
import { getResourcesForCareer, RESOURCES } from "@/lib/fixtures/resources";
import { CHECKS } from "@/lib/fixtures/checks";
import { trackLabelOf } from "@/lib/fixtures/catalog";
import type { BarSource, Resource } from "@/lib/types";
import "./progress.css";
import ProgressView from "./ProgressView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Progress — Baseline",
};

const TYPE_WORDS: Record<Resource["type"], string> = {
  course: "course",
  cert: "certificate",
  NC: "NC II",
  doc: "guide",
};

function costLabel(r: Resource) {
  return r.cost === "free" ? "free" : `₱${r.cost.peso}`;
}

/** "2026-10-17 09:05" → "Oct 17 · 09:05" · "2026-10-17" → "Oct 17". */
function fmtDate(raw: string) {
  const [d, t] = raw.split(" ");
  const dt = new Date(`${d}T00:00:00`);
  const base = `${dt.toLocaleString("en-US", { month: "short" })} ${dt.getDate()}`;
  return t ? `${base}, ${t}` : base;
}

function resourceMeta(r: Resource) {
  return `${TYPE_WORDS[r.type]}, ${r.provider}, ${costLabel(r)}`;
}

/** Short spoken form of a skill for the check copy ("Dashboards (Power BI)" → "dashboards"). */
function skillShort(skill: string) {
  return skill.split("(")[0].trim().toLowerCase();
}

function UndecidedDefault({ name }: { name: string }) {
  return (
    <div className="v7prog">
      <section className="proband" aria-label="Progress">
        <div className="band">
          <div className="bandrow">
            <div className="who">
              <h1 className="t">Progress</h1>
              <p className="band-id">{name}, no career picked yet</p>
            </div>
          </div>
        </div>
      </section>
      <section className="card defaultcard">
        <p className="prog-sub pad">
          No career picked yet —{" "}
          <a className="link-sub" href="/career">
            Browse the career index <ArrowRight size={14} aria-hidden="true" />{" "}
          </a>
        </p>
      </section>
    </div>
  );
}

/** M9+M6 Progress — the live record. v7 register: the named band carries the
 *  two-column head (left prose action, right the computed readout); feed,
 *  bar ledger and goals run as flush-head cards; numbers are the real store/
 *  engine views (scoreView + computed counters), never a painted one. */
export default async function ProgressPage() {
  const profile = await requireStudent();
  const { state, career, score, ar } = await getStudentView(profile.studentId);
  if (!career || !score) return <UndecidedDefault name={state.name} />;

  const v = scoreView(career, state, ar);
  const eventsRev = [...state.events].reverse();
  const byKind = (kind: string) => state.events.filter((e) => e.kind === kind);
  const openSkillsArr = openSkillNames(career, state.bars);

  // ---- feed rows: one per passed check, newest first -----------------------
  const closedGapEvent = (skill: string) =>
    byKind("bar-closed").some((ev) => ev.detail.startsWith(`${skill} closed`));
  const feedRows = [] as {
    key: string;
    title: string;
    meta: string;
    date: string;
    correct: number;
    total: number;
    skill: string | null;
    closed: boolean;
  }[];
  for (const e of eventsRev) {
    if (e.kind !== "check-passed") continue;
    const m = e.detail.match(/^Check passed \((\d+) of (\d+)\) — (.+)$/);
    if (!m) continue;
    const [, correct, total, title] = m;
    const resource = RESOURCES.find((r) => r.title === title) ?? null;
    const skill = resource?.skillsAddressed[0] ?? null;
    feedRows.push({
      key: `${e.date}-${title}`,
      title: resource?.title ?? title,
      meta: resource ? resourceMeta(resource) : "",
      date: fmtDate(e.date),
      correct: Number(correct),
      total: Number(total),
      skill,
      // the row only cites a closed bar when that pass actually closed one
      closed: skill !== null && closedGapEvent(skill),
    });
  }

  // ---- gap-closure history: one row per closed bar, in map order ----------
  const closedRows = [] as {
    name: string;
    source: BarSource;
    note: string;
    checked: boolean;
  }[];
  const openSkills: string[] = [];
  for (const spec of career.skills) {
    const bar = state.bars[spec.name];
    if (!bar) {
      openSkills.push(spec.name);
      continue;
    }
    const bc = [...byKind("bar-closed")].reverse().find((ev) => ev.detail.startsWith(`${spec.name} closed`));
    let note: string;
    if (bar.source === "checked") {
      const resource =
        RESOURCES.find(
          (r) => r.skillsAddressed.includes(spec.name) && r.careerId === career.id
        ) ?? null;
      note = bc
        ? `closed ${fmtDate(bc.date)}, via “${resource?.title ?? spec.name}” from ${resource?.provider ?? ""}${resource ? (resource.cost === "free" ? ", free" : "") : ""}`
        : "closed via passed comprehension check";
    } else if (bar.source === "verified") {
      note = state.decisions.verifiedTransferred.includes(spec.name)
        ? "confirmed, transferred from your previous career match"
        : "confirmed by the check-in quiz at set-up";
    } else {
      note = "on your baseline, marked as self-reported";
    }
    closedRows.push({ name: spec.name, source: bar.source, note, checked: bar.source !== "claimed" });
  }

  // ---- goals section -------------------------------------------------------
  type GoalViewT = {
    id: string;
    title: string;
    type: "training" | "milestone";
    status: "active" | "completed";
    meta: string | null;
    doneLine: string | null;
    autoLine: string | null;
    statusLine: string;
    check: { resourceId: string; skillShort: string } | null;
  };
  const goalViews: GoalViewT[] = state.goals.map((g) => {
    const resource = (g.resourceId ? RESOURCES.find((r) => r.id === g.resourceId) : undefined) ?? null;
    const checkEv = resource
      ? [...byKind("check-passed")].reverse().find((ev) => ev.detail.endsWith(`— ${resource.title}`))
      : undefined;
    if (g.status === "completed") {
      const date = fmtDate(g.completedAt ?? checkEv?.date ?? "2026-10-17");
      // Pr3 (Wave-3): ONE receipt line — the auto-completed training goal
      // reads "Auto-completed Oct 17 · 4 of 5 passed" (+ its gap-close
      // receipt when the check closed one); no doneLine/autoLine double
      let doneLine = `Done ${date}`;
      if (checkEv) {
        const m = checkEv.detail.match(/^Check passed \((\d+) of (\d+)\)/);
        const n = m ? m[1] : "4";
        const skill = resource?.skillsAddressed[0];
        const closedGap = skill ? closedGapEvent(skill) : false;
        doneLine = `Auto-completed ${fmtDate(checkEv.date)}, ${n} of 5 passed${
          closedGap ? `, closed your ${skillShort(skill ?? "skill")} gap` : ""
        }`;
      }
      return {
        id: g.id,
        title: g.title,
        type: g.type,
        status: g.status,
        meta: null,
        doneLine: g.type === "milestone" ? `Done ${date}, marked by you` : doneLine,
        autoLine: null,
        statusLine: "",
        check: null,
      };
    }
    // active
    let statusLine: string;
    let check: { resourceId: string; skillShort: string } | null = null;
    if (g.type === "training") {
      statusLine = resource
        ? `In progress — ${resource.title}, finishes when you pass its 5-question check.`
        : "In progress — finishes when you pass its 5-question check.";
      if (resource && CHECKS[resource.id]) {
        check = { resourceId: resource.id, skillShort: skillShort(resource.skillsAddressed[0] ?? "skill") };
      }
    } else {
      statusLine = "Marked done by you, when it happens.";
    }
    return {
      id: g.id,
      title: g.title,
      type: g.type,
      status: g.status,
      meta: null,
      doneLine: null,
      autoLine: null,
      statusLine,
      check,
    };
  });

  // ---- suggestion: only fires with zero goals (the ④ default) --------------
  let suggestion: { title: string; resourceId: string; skill: string; target: string; hours: number; provider: string } | null = null;
  if (state.goals.length === 0) {
    const ranked = rankOpenSkills(career, openSkillsArr);
    const top = ranked.find((r) => r.hasFreeResource);
    const res = top ? getResourcesForCareer(career.id).find((r) => r.skillsAddressed.includes(top.skill)) : null;
    if (res) {
      suggestion = {
        title: `Finish the ${res.title}`,
        resourceId: res.id,
        skill: res.skillsAddressed[0],
        target: resourceMeta(res),
        hours: res.durationHours,
        provider: res.provider,
      };
    }
  }

  // ---- readout provenance --------------------------------------------------
  const checkEvents = byKind("check-passed");
  const lastEvent = state.events[state.events.length - 1];
  const count = (n: number, noun: string) => `${n} ${noun}${n === 1 ? "" : "s"}`;
  const goalsDone = state.goals.filter((g) => g.status === "completed").length;
  const fitLine = `${lastEvent ? fmtDate(lastEvent.date) : "set-up"}, ${count(checkEvents.length, "check")} passed, ${count(byKind("bar-closed").length, "bar")} closed, ${count(goalsDone, "goal")} done.`;

  const nextSkill =
    // the ranked-first-30-days head — the same engine view the pathway shows:
    // the persisted stage-① snapshot filtered to still-open skills, else the
    // live rankOpenSkills computation (a closed bar never reads as "next")
    ((state.stageOneQueue ?? []).filter((s) => openSkillsArr.includes(s))[0] ??
      stageOne(career, openSkillsArr).queue[0]) ??
    rankOpenSkills(career, openSkillsArr)[0]?.skill ??
    null;
  const nextRanked = rankOpenSkills(career, openSkillsArr).find((r) => r.skill === nextSkill);
  const nextFree = nextRanked ? nextRanked.hasFreeResource : false;

  const parts = v.parts;
  const rubricAria = `Readiness ${score.total} of 100 — skills ${score.sp} of ${WEIGHTS.sp}, employability ${score.es} of ${WEIGHTS.es}, training ${score.tp} of ${WEIGHTS.tp}, application readiness ${score.ar === null ? "not yet measured" : `${score.ar} of ${WEIGHTS.ar}`}, career direction ${score.cc} of ${WEIGHTS.cc}`;

  // checks available on this page (career's resources + goal-linked ones),
  // with the resource meta the overlay needs
  const ids = new Set<string>([
    ...getResourcesForCareer(career.id).map((r) => r.id),
    ...state.goals.map((g) => g.resourceId ?? ""),
  ]);
  const checks: Record<string, { stem: string; options: string[]; answer: number }[]> = {};
  const checkResources: Record<
    string,
    { id: string; title: string; target: string; skill: string; skillShort: string }
  > = {};
  for (const id of ids) {
    if (!id || !CHECKS[id]) continue;
    const r = RESOURCES.find((x) => x.id === id);
    checks[id] = CHECKS[id];
    if (r) {
      checkResources[id] = {
        id,
        title: r.title,
        target: resourceMeta(r),
        skill: r.skillsAddressed[0] ?? "",
        skillShort: skillShort(r.skillsAddressed[0] ?? "skill"),
      };
    }
  }

  const persona = [state.name, [state.yearLevel, trackLabelOf(state.track)].filter(Boolean).join(", ")].join(", ");

  return (
    <ProgressView
      careerName={career.name}
      persona={persona}
      score={score}
      parts={parts}
      arFactors={v.arFactors}
      rubricAria={rubricAria}
      esVerified={v.esVerified}
      updated={lastEvent ? fmtDate(lastEvent.date) : null}
      nextSkill={nextSkill}
      nextFree={nextFree}
      stageOneDone={v.stageOne.done}
      fitLine={fitLine}
      openSkillCount={openSkillsArr.length}
      mapSize={career.skills.length}
      feedRows={feedRows}
      closedRows={closedRows}
      closedCount={closedRows.length}
      openSkills={openSkillsArr}
      goals={goalViews}
      suggestion={suggestion}
      checkResources={checkResources}
      checks={checks}
    />
  );
}
