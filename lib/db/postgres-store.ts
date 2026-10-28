import type { StudentState } from "@/lib/types";
import { supabaseAdmin } from "@/lib/supabase/server";

/**
 * Postgres-backed StudentStore (ADR 0003) — the real backend.
 * State is one JSON blob per student (the swap seam's original shape), so
 * the table is deliberately naive; engines never touch this layer.
 * Service-role client: server-only, bypasses RLS (all writers are server
 * routes — schema.sql documents the access model).
 */
export class PostgresStudentStore {
  async getStudentState(id: string): Promise<StudentState | null> {
    const { data, error } = await supabaseAdmin()
      .from("student_state")
      .select("state")
      .eq("student_id", id)
      .maybeSingle();
    if (error) throw new Error(`student_state read failed: ${error.message}`);
    return (data?.state as StudentState) ?? null;
  }

  async saveStudentState(id: string, state: StudentState): Promise<void> {
    const { error } = await supabaseAdmin()
      .from("student_state")
      .upsert({ student_id: id, state, updated_at: new Date().toISOString() });
    if (error) throw new Error(`student_state write failed: ${error.message}`);
  }

  /** Cohort read — Admin surface aggregates real students (ADR 0003). */
  async listStudentStates(): Promise<Record<string, StudentState>> {
    const { data, error } = await supabaseAdmin()
      .from("student_state")
      .select("student_id, state");
    if (error) throw new Error(`student_state list failed: ${error.message}`);
    const out: Record<string, StudentState> = {};
    for (const row of data ?? []) out[row.student_id] = row.state as StudentState;
    return out;
  }
}
