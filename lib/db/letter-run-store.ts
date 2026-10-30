import type { LetterCheckRun } from "@/lib/engines/letter";
import { supabaseAdmin, supabaseEnv } from "@/lib/supabase/server";
import fs from "node:fs";
import path from "node:path";

/**
 * Letter-run store (ticket 12 — the Prep surface's persist half, 2026-10-30).
 * Seam style mirrors lib/db/resume-run-store.ts exactly:
 *   - ONE row per student: the LATEST successful letter check (full result
 *     blob). The score's letter factor reads THIS run's own `airLetter`
 *     (per-file AM semantics: letter runs are independent of resume runs, and
 *     each store keeps its own latest attempt — "latest counts", ADR 0002
 *     amendment 3; there is no best-strike anywhere in this store).
 *   - runs_count (every successful run increments). Parse-failed uploads
 *     persist nothing — a failed run is feedback, not a run.
 *
 * Backends:
 *  - PostgresLetterRunStore: Supabase Postgres via the service-role client
 *    (the `letter_runs` table — SQL ships in supabase/schema.sql; schema
 *    changes are applied by the USER, never by the app).
 *  - JsonLetterRunStore: dev/test fallback (data/letter-runs.json) when the
 *    Supabase env is absent — same interface, offline-safe, deterministic.
 *
 * Schema-not-yet-applied degradation (42P01 / "does not exist"): reads read
 * honestly empty, writes fall through to the JSON fallback and the surface
 * shows the honest notice (letterPersistenceNotice) — dev + e2e stay green
 * before and after the user pastes the SQL.
 */

export interface LetterRunSummary {
  run: LetterCheckRun;
  runsCount: number;
  /** honest UI note when the run was stored locally (schema pending) */
  degraded?: boolean;
}

export interface LetterRunStore {
  latest(studentId: string): Promise<LetterRunSummary | null>;
  saveRun(studentId: string, run: LetterCheckRun): Promise<LetterRunSummary>;
  /** DPA erasure (ticket 7): remove the student's letter artifact deliberately. */
  erase(studentId: string): Promise<void>;
}

/**
 * Postgres' undefined / unlisted table — the SQL hasn't been applied yet.
 * PostgREST ships this as 42P01 ("does not exist") or PGRST205 ("could not
 * find the table in the schema cache").
 */
const isMissingTable = (e: { code?: string; message?: string }): boolean =>
  e?.code === "42P01" ||
  e?.code === "PGRST205" ||
  /does not exist|not find the table|schema cache/i.test(e?.message ?? "");

let degradedFlag = false;

/** Honest persistence note for the readout ("stored locally …") or null. */
export function letterPersistenceNotice(): string | null {
  return degradedFlag ? "stored locally — the letter-runs table isn't applied yet (paste the round's SQL)" : null;
}

class PostgresLetterRunStore implements LetterRunStore {
  async latest(studentId: string): Promise<LetterRunSummary | null> {
    if (degradedFlag) return jsonStore.latest(studentId);
    const { data, error } = await supabaseAdmin()
      .from("letter_runs")
      .select("run, runs_count")
      .eq("student_id", studentId)
      .maybeSingle();
    if (error) {
      if (isMissingTable(error)) {
        degradedFlag = true;
        return jsonStore.latest(studentId);
      }
      throw new Error(`letter_runs read failed: ${error.message}`);
    }
    if (!data) return null;
    return { run: data.run as LetterCheckRun, runsCount: (data.runs_count as number) ?? 0 };
  }

  async saveRun(studentId: string, run: LetterCheckRun): Promise<LetterRunSummary> {
    if (degradedFlag) return jsonStore.saveRun(studentId, run);
    const prev = await this.latest(studentId);
    const { error } = await supabaseAdmin()
      .from("letter_runs")
      .upsert({
        student_id: studentId,
        run,
        // LATEST COUNTS: the store keeps one run per student — the stored run
        // IS the most recent attempt; runs_count is history, never selection
        runs_count: (prev?.runsCount ?? 0) + 1,
        updated_at: new Date().toISOString(),
      });
    if (error) {
      if (!isMissingTable(error)) throw new Error(`letter_runs write failed: ${error.message}`);
      degradedFlag = true; // schema pending → JSON fallback keeps counts honest
      const re = await this.latest(studentId);
      return re ?? { run, runsCount: 1 };
    }
    const re = await this.latest(studentId);
    return re ?? { run, runsCount: 1 };
  }

  async erase(studentId: string): Promise<void> {
    if (degradedFlag) return jsonStore.erase(studentId);
    const { error } = await supabaseAdmin().from("letter_runs").delete().eq("student_id", studentId);
    if (error) {
      if (isMissingTable(error)) return jsonStore.erase(studentId);
      throw new Error(`letter_runs erase failed: ${error.message}`);
    }
  }
}

/* ── JSON fallback (offline/dev; also the not-yet-applied-schema path) ──── */

const JSON_PATH = path.join(process.cwd(), "data", "letter-runs.json");

interface JsonRow {
  run: LetterCheckRun;
  runs_count: number;
}

async function readAll(): Promise<Record<string, JsonRow>> {
  try {
    return JSON.parse(await fs.promises.readFile(JSON_PATH, "utf8"));
  } catch {
    return {};
  }
}

async function writeAll(all: Record<string, JsonRow>): Promise<void> {
  await fs.promises.mkdir(path.dirname(JSON_PATH), { recursive: true });
  await fs.promises.writeFile(JSON_PATH, JSON.stringify(all, null, 2), "utf8");
}

const jsonStore = {
  async latest(studentId: string): Promise<LetterRunSummary | null> {
    const row = (await readAll())[studentId];
    if (!row) return null;
    return { run: row.run, runsCount: row.runs_count };
  },
  async saveRun(studentId: string, run: LetterCheckRun): Promise<LetterRunSummary> {
    const all = await readAll();
    const prev = all[studentId];
    all[studentId] = { run, runs_count: (prev?.runs_count ?? 0) + 1 };
    await writeAll(all);
    return { run, runsCount: all[studentId].runs_count };
  },
  async erase(studentId: string): Promise<void> {
    const all = await readAll();
    if (studentId in all) {
      delete all[studentId];
      await writeAll(all);
    }
  },
};

const { configured } = supabaseEnv();

export const letterRunStore: LetterRunStore = configured
  ? new PostgresLetterRunStore()
  : {
      latest: jsonStore.latest,
      saveRun: async (id, run) => {
        const s = await jsonStore.saveRun(id, run);
        return degradedFlag ? { ...s, degraded: true } : s;
      },
      erase: jsonStore.erase,
    };
