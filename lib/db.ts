import fs from "node:fs";
import path from "node:path";
import type { StudentState } from "@/lib/types";
import { NEIL_SEED } from "@/lib/fixtures/neil";
import { getCareer } from "@/lib/fixtures/catalog";
import { resumeRunStore } from "@/lib/db/resume-run-store";
import { PostgresStudentStore } from "@/lib/db/postgres-store";
import { supabaseEnv } from "@/lib/supabase/server";

/**
 * Student store seam (ADR 0003).
 *  - PostgresStudentStore: the real backend (Supabase Postgres), active when
 *    the .env.local Supabase env is present.
 *  - JsonStore: dev/test fallback (offline-safe, deterministic) — same
 *    interface, so engines and routes never know the difference.
 * Canon: Neil falls back to the code seed (lib/fixtures/neil.ts) whenever no
 * state row exists — every consumer (pages, e2e) relies on that guarantee.
 */

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
    return all[id] ?? structuredClone(NEIL_SEED);
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
  /** Missing rows resolve to the canon Neil seed — the store's oldest guarantee. */
  async getStudentState(id: string): Promise<StudentState> {
    const s = await this.inner.getStudentState(id);
    if (s) return s;
    const seed = structuredClone(NEIL_SEED);
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

/** Convenience view: state + career + score in one read. The AR feed reads
 *  the resume-run store (best run counts — ADR 0002 amendment; unmeasured
 *  until a successful diagnostic run exists, never a stale zero). */
export async function getStudentView(id: string) {
  const s = await db.getStudentState(id);
  const career = getCareer(s.careerId);
  if (!career) return { state: s, career: null, score: null, ar: null as ArInput | null };
  const latest = await resumeRunStore.latest(id);
  const ar: ArInput | null = latest ? { measured: true, bestAir: latest.bestAir } : null;
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
