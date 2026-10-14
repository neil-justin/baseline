import fs from "node:fs";
import path from "node:path";
import type { StudentState } from "@/lib/types";
import { NEIL_SEED } from "@/lib/fixtures/neil";
import { getCareer } from "@/lib/fixtures/catalog";

/**
 * JSON-file store — the confirmed fallback (Docker/WSL unavailable).
 * Offline-safe and deterministic; the Postgres/Supabase backend later swaps in
 * behind the identical function signature. Demo-local: one mutable state file.
 */

const STORE_PATH = path.join(process.cwd(), "data", "state.json");

export interface DemoStudentStore {
  /** Neil's live mutable state (falls back to the canon seed). */
  getStudentState(id: string): Promise<StudentState>;
  saveStudentState(id: string, state: StudentState): Promise<void>;
}

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

class JsonStore implements DemoStudentStore {
  async getStudentState(id: string): Promise<StudentState> {
    const all = await readAll();
    return all[id] ?? structuredClone(NEIL_SEED);
  }
  async saveStudentState(id: string, state: StudentState): Promise<void> {
    const all = await readAll();
    all[id] = state;
    await writeAll(all);
  }
}

export const db: DemoStudentStore = new JsonStore();

/** Convenience view: state + career + score in one read. */
export async function getStudentView(id: string) {
  const s = await db.getStudentState(id);
  const career = getCareer(s.careerId);
  if (!career) return { state: s, career: null, score: null };
  const { computeScore } = await import("@/lib/engines/score");
  const score = computeScore({
    bars: s.bars,
    careerId: s.careerId,
    careerSkillCount: career.skills.length,
    goals: s.goals,
    stageOneDone: s.stageOneDone,
  });
  return { state: s, career, score };
}
