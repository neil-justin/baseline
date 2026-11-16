import fs from "node:fs";
import path from "node:path";
import type { StudentState } from "@/lib/types";
import { getCareer } from "@/lib/fixtures/catalog";
import { resumeRunStore } from "@/lib/db/resume-run-store";
import { letterRunStore } from "@/lib/db/letter-run-store";
import { PostgresStudentStore } from "@/lib/db/postgres-store";
import { supabaseEnv } from "@/lib/supabase/server";

/**
 * Student store seam (ADR 0003).
 *  - PostgresStudentStore: the real backend (Supabase Postgres), active when
 *    the .env.local Supabase env is present.
 *  - JsonStore: dev/test fallback (offline-safe, deterministic) — same
 *    interface, so engines and routes never know the difference.
 *  * canon was REMOVED (2026-11-06 user-ruled wipe round): a missing state row
 * resolves to a FRESH EMPTY state (same shape as lib/session.ts
 * newStudentState; inlined here to keep the db/seam import cycle-free). A
 * new student starts empty, never painted with demo data.
 */

/** Fresh empty state — mirrored from lib/session.ts newStudentState. */
function freshState(id: string): StudentState {
  return {
    id,
    name: id,
    yearLevel: "4th Year",
    track: "",
    careerId: null,
    bars: {},
    softSkills: {},
    goals: [],
    stageOneDone: 0,
    stageOneQueue: [],
    decisions: { verifiedTransferred: [] },
    events: [],
  } as StudentState;
}

export interface StudentStore {
  /** The student's live mutable state (falls back to the canon seed). */
  getStudentState(id: string): Promise<StudentState>;
  saveStudentState(id: string, state: StudentState): Promise<void>;
  /** Cohort read — every student with a stored state (Admin surface). */
  listStudentStates(): Promise<Record<string, StudentState>>;
}

/** Raw backend read: a missing row is null — the SeededStore fills it. */
interface RawStudentStore {
  getStudentState(id: string): Promise<StudentState | null>;
  saveStudentState(id: string, state: StudentState): Promise<void>;
  listStudentStates(): Promise<Record<string, StudentState>>;
}

const STORE_PATH = path.join(process.cwd(), "data", "state.json");

async function readAll(): Promise<Record<string, StudentState>> {
  try {
    return JSON.parse(await fs.promises.readFile(STORE_PATH, "utf8"));
  } catch {
    return {};
  }
}

async function writeAll(all: Record<string, StudentState>): Promise<void> {
  await fs.promises.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.promises.writeFile(STORE_PATH, JSON.stringify(all, null, 2), "utf8");
}

class JsonStore implements StudentStore {
  async getStudentState(id: string): Promise<StudentState> {
    const all = await readAll();
    return all[id] ?? freshState(id);
  }
  async saveStudentState(id: string, state: StudentState): Promise<void> {
    const all = await readAll();
    all[id] = state;
    await writeAll(all);
  }
  async listStudentStates(): Promise<Record<string, StudentState>> {
    return readAll();
  }
}

class SeededStore implements StudentStore {
  constructor(private inner: RawStudentStore) {}
  /** Missing rows resolve to a FRESH EMPTY state (no demo fallback). */
  async getStudentState(id: string): Promise<StudentState> {
    const s = await this.inner.getStudentState(id);
    if (s) return s;
    const seed = freshState(id);
    await this.inner.saveStudentState(id, seed);
    return seed;
  }
  saveStudentState(id: string, state: StudentState) {
    return this.inner.saveStudentState(id, state);
  }
  listStudentStates() {
    return this.inner.listStudentStates();
  }
}

const { configured } = supabaseEnv();

export const db: StudentStore = configured
  ? new SeededStore(new PostgresStudentStore())
  : new JsonStore();

import { computeScore, type ArInput, type Score } from "@/lib/engines/score";
import { presenceMeasured } from "@/lib/engines/air";

/** Convenience view: state + career + score in one read. The AR feed is the
 *  THREE per-file factors (ADR 0002 amendment 2; selection per amendment 3 —
 *  LATEST COUNTS, 2026-10-29 user ruling): the latest full resume attempt's
 *  own AIR from `resume-run-store` (the store keeps ONE run per student — the
 *  stored run IS the most recent full attempt, no best-strike), the latest
 *  letter check from `letter-run-store` (shipped 2026-10-30 with the Prep
 *  surface — per-file AM semantics: the letter keeps its own latest attempt),
 *  and the presence stamp from state. A factor without its source stays
 *  unmeasured; the channel reads null while nothing measured, never a stale
 *  zero. */
export async function getStudentView(id: string) {
  const s = await db.getStudentState(id);
  const career = getCareer(s.careerId);
  if (!career) return { state: s, career: null, score: null, ar: null as ArInput | null };
  const latest = await resumeRunStore.latest(id);
  // Amendment 3 (2026-10-29, user-ruled): the factor reads the LATEST full
  // attempt's own AIR — the stored run — never the best-struck `bestAir`
  // history: re-running a worse file drops points (latest counts).
  // Q19a (2026-11-03, user-locked): a run whose target ≠ the student's
  // CURRENT career is history — it stays displayed on Prep as history, but
  // the AR feed measures only runs against the current target. The store
  // keeps ONE run per student, so there is no older current-career run to
  // fall back to; absent one, the resume part reads unmeasured (never a
  // stale painted number from the wrong role).
  const resumeStale = latest !== null && latest.run.careerId !== s.careerId;
  const resume = latest && !resumeStale ? { measured: true, latestAir: latest.run.air.airResume } : null;
  // the letter factor joins with the Prep check surface (ticket 12; shipped
  // 2026-10-30): the store keeps ONE check per student — its own airLetter IS
  // the checkScore; re-running the letter replaces it (latest counts). Q19a:
  // same stale-target rule — a letter checked against an old target is
  // history, not part of the current role's AR.
  const latestLetter = await letterRunStore.latest(id);
  const letterStale = latestLetter !== null && latestLetter.run.careerId !== s.careerId;
  const letter: ArInput["letter"] =
    latestLetter && !letterStale
      ? { measured: true, checkScore: latestLetter.run.air.airLetter }
      : null;
  const presence = presenceMeasured(s.presence) ? { measured: true } : null;
  const ar: ArInput | null =
    resume || letter || presence
      ? { resume, letter, presence }
      : null;
  const score: Score = computeScore({
    bars: s.bars,
    careerId: s.careerId,
    careerSkillCount: career.skills.length,
    goals: s.goals,
    stageOneDone: s.stageOneDone,
    competencies: s.competencies ?? {},
    ar,
  });
  return { state: s, career, score, ar };
}
