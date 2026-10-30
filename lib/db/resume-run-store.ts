import type { ResumeDiagnosticRun } from "@/lib/engines/resume/analyze";
import { supabaseAdmin, supabaseEnv } from "@/lib/supabase/server";
import fs from "node:fs";
import path from "node:path";

/**
 * Resume-run store (round 6a) — persistence keeps ONLY:
 *   - the LATEST run per student (full result blob — by construction the most
 *     recent full attempt; the score's resume factor reads THIS run's own
 *     airResume per ADR 0002 amendment 3, 2026-10-29 "latest counts"), and
 *   - run-history counts: runs_count (every successful run increments) +
 *     best_air (the best-EVER run's AIR — history/display only; the score
 *     factor does NOT use it since amendment 3).
 * Parse-failed uploads persist nothing — a failed run is feedback, not a run
 * (scope decision: one SUCCESSFUL diagnostic run = "resume diagnostic done").
 *
 * Seam style mirrors lib/db.ts (ADR 0003):
 *  - PostgresResumeRunStore: Supabase Postgres via the service-role client
 *    (new `resume_runs` table — the SQL ships in the round's report; schema
 *    changes are applied by the user, never by the app).
 *  - JsonResumeRunStore: dev/test fallback (data/resume-runs.json) when the
 *    Supabase env is absent — same interface, offline-safe, deterministic.
 *
 * Schema-not-yet-applied degradation (42P01 / "does not exist"): reads read
 * honestly empty, writes fall through to the JSON fallback and the surface
 * shows the honest notice (resumePersistenceNotice) — dev + e2e stay green
 * before and after the user pastes the SQL.
 */

export interface ResumeRunSummary {
  run: ResumeDiagnosticRun;
  bestAir: number;
  runsCount: number;
  /** honest UI note when the run was stored locally (schema pending) */
  degraded?: boolean;
}

export interface ResumeRunStore {
  latest(studentId: string): Promise<ResumeRunSummary | null>;
  saveRun(studentId: string, run: ResumeDiagnosticRun): Promise<ResumeRunSummary>;
  /** DPA erasure (ticket 7): remove the student's resume artifact deliberately. */
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
export function resumePersistenceNotice(): string | null {
  return degradedFlag ? "stored locally — the resume-runs table isn't applied yet (paste the round's SQL)" : null;
}

class PostgresResumeRunStore implements ResumeRunStore {
  async latest(studentId: string): Promise<ResumeRunSummary | null> {
    if (degradedFlag) return jsonStore.latest(studentId);
    const { data, error } = await supabaseAdmin()
      .from("resume_runs")
      .select("run, best_air, runs_count")
      .eq("student_id", studentId)
      .maybeSingle();
    if (error) {
      if (isMissingTable(error)) {
        degradedFlag = true;
        return jsonStore.latest(studentId);
      }
      throw new Error(`resume_runs read failed: ${error.message}`);
    }
    if (!data) return null;
    return {
      run: data.run as ResumeDiagnosticRun,
      bestAir: (data.best_air as number) ?? 0,
      runsCount: (data.runs_count as number) ?? 0,
    };
  }

  async saveRun(studentId: string, run: ResumeDiagnosticRun): Promise<ResumeRunSummary> {
    if (degradedFlag) return jsonStore.saveRun(studentId, run);
    const prev = await this.latest(studentId);
    const { error } = await supabaseAdmin()
      .from("resume_runs")
      .upsert({
        student_id: studentId,
        run,
        // best-EVER air kept for history/display only — the selection reads
        // the latest run's own airResume (amendment 3, 2026-10-29: latest counts)
        best_air: Math.max(prev?.bestAir ?? 0, run.air.airResume),
        runs_count: (prev?.runsCount ?? 0) + 1,
        updated_at: new Date().toISOString(),
      });
    if (error) {
      if (!isMissingTable(error)) throw new Error(`resume_runs write failed: ${error.message}`);
      degradedFlag = true; // schema pending → JSON fallback keeps counts honest
      const re = await this.latest(studentId);
      return re ?? { run, bestAir: run.air.airResume, runsCount: 1 };
    }
    const re = await this.latest(studentId);
    return re ?? { run, bestAir: run.air.airResume, runsCount: 1 };
  }

  async erase(studentId: string): Promise<void> {
    if (degradedFlag) return jsonStore.erase(studentId);
    const { error } = await supabaseAdmin().from("resume_runs").delete().eq("student_id", studentId);
    if (error) {
      if (isMissingTable(error)) return jsonStore.erase(studentId);
      throw new Error(`resume_runs erase failed: ${error.message}`);
    }
  }
}

/* ── JSON fallback (offline/dev; also the not-yet-applied-schema path) ──── */

const JSON_PATH = path.join(process.cwd(), "data", "resume-runs.json");

interface JsonRow {
  run: ResumeDiagnosticRun;
  best_air: number;
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
  async latest(studentId: string): Promise<ResumeRunSummary | null> {
    const row = (await readAll())[studentId];
    if (!row) return null;
    return { run: row.run, bestAir: row.best_air, runsCount: row.runs_count };
  },
  async saveRun(studentId: string, run: ResumeDiagnosticRun): Promise<ResumeRunSummary> {
    const all = await readAll();
    const prev = all[studentId];
    all[studentId] = {
      run,
      // best-EVER air kept for history/display only — the selection reads
      // the latest run's own airResume (amendment 3, 2026-10-29: latest counts)
      best_air: Math.max(prev?.best_air ?? 0, run.air.airResume),
      runs_count: (prev?.runs_count ?? 0) + 1,
    };
    await writeAll(all);
    return { run, bestAir: all[studentId].best_air, runsCount: all[studentId].runs_count };
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

export const resumeRunStore: ResumeRunStore = configured
  ? new PostgresResumeRunStore()
  : {
      latest: jsonStore.latest,
      saveRun: async (id, run) => {
        const s = await jsonStore.saveRun(id, run);
        return degradedFlag ? { ...s, degraded: true } : s;
      },
      erase: jsonStore.erase,
    };
