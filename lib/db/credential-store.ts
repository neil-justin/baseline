import { supabaseAdmin, supabaseEnv } from "@/lib/supabase/server";
import fs from "node:fs";
import path from "node:path";

/**
 * Declared-credential store (Round 7 re-cut, 2026-10-30 profile sweep) —
 * the three counselor-audited credential kinds (certification · internship/
 * job · personal project/org role) the student DECLARES in Profile →
 * Credentials. Lifecycle (locked, profile-college-scope.md):
 *   declared (evidence attached, pending audit) → verified | rejected
 *   by a Counselor / System Admin via the Admin surface (their round).
 *   Student-side rules the routes enforce: edit/delete freely while
 *   `declared`, READ-ONLY once `verified` (the audit is a shared record),
 *   `rejected` entries revise + resubmit (status returns to declared —
 *   the audit note rides along so the revision is honest about its past).
 *
 * The FOURTH kind (`presence`) never rides this store — its carrier is
 * the state blob (state.presence) written by /api/credentials/presence
 * (machine-verified at declaration, never counselor-audited). The table's
 * kind check already lists 'presence' for the recorded future seam; this
 * store's list() EXCLUDES presence-kind rows so the stamped record renders
 * from state alone (never double).
 *
 * Seam style mirrors lib/db/resume-run-store.ts (ADR 0003):
 *  - PostgresCredentialStore: Supabase Postgres via the service-role
 *    client (`credentials` table — supabase/schema.sql).
 *  - JsonCredentialStore: dev/test fallback (data/credentials.json) when
 *    the Supabase env is absent — same interface, offline-deterministic.
 * Schema-not-applied degradation (42P01/PGRST205): reads read honestly
 * empty, writes fall through to the JSON fallback and the surface shows
 * the honest notice — dev + e2e stay green before and after the SQL.
 */

export type CredentialKind = "certification" | "internship" | "project";

export interface CredentialRow {
  id: string;
  kind: CredentialKind;
  title: string;
  organization: string | null;
  startedOn: string | null; // "2026-10-17"
  endedOn: string | null;
  evidenceUrl: string | null;
  evidenceNote: string | null;
  /** declared from the framework vocabulary (the picker inputs them) */
  declaredSkills: string[];
  status: CredentialStatus;
  verifiedBy: string | null; // the counselor's name (the Admin audit)
  verifiedAt: string | null;
  /** the audit's note — the REJECT-with-reason line (counselor-written) */
  auditNote: string | null;
  createdAt: string; // ISO
  /** honest note when the row was stored locally (table not applied) */
  degraded?: boolean;
}

export type CredentialStatus = "declared" | "verified" | "rejected";

export interface CredentialInput {
  kind: CredentialKind;
  title: string;
  organization?: string | null;
  startedOn?: string | null;
  endedOn?: string | null;
  evidenceUrl?: string | null;
  evidenceNote?: string | null;
  declaredSkills?: string[];
}

/**
 * The Admin round's audit ruling (Round 8 lock, 2026-10-29 admin-college-
 * scope.md Q3a): a Counselor rules a `declared` entry → verified, or
 * rejected with a reason. `ruledBy`/`ruledAt` ARE the audit-trail spine the
 * locked plan names ("verified_by, verified_at, reason"): the schema's
 * columns carry the ruling WHO + WHEN for EITHER status (a `rejected` row
 * keeps its counselor + stamp beside the note — the row's record names who
 * ruled, never just "someone turned it down"). The student's REJECT reason
 * rides `auditNote` (the profile sweep's carrier — read verbatim in
 * Profile → Credentials; null when the counselor ruled without one).
 */
export interface CredentialAuditRuling {
  status: "verified" | "rejected";
  /** the counselor's profile full_name (the shared record names who) */
  ruledBy: string;
  /** ruling stamp (ISO) — declared_at + ruledAt = the timestamped audit */
  ruledAt: string;
  /** the REJECT-with-reason line (verified rulings always clear it) */
  auditNote?: string | null;
}

/** A row together with its owning student — the cohort audit read. */
export interface CohortCredentialRow extends CredentialRow {
  studentId: string;
}

export interface CredentialStore {
  /** All of the signed-in student's declared-kind rows, oldest → newest. */
  list(studentId: string): Promise<CredentialRow[]>;
  /**
   * Admin round: every counselor-audited row ACROSS the cohort, oldest →
   * newest (presence-kind rows excluded here, same as list — they stamp,
   * they never audit). The queue's student names resolve from the state
   * store (the state seam the roster already reads).
   */
  listAll(): Promise<CohortCredentialRow[]>;
  /**
   * The admin ruling on one row: only a row still `declared` accepts it
   * (re-ruling a recorded verdict would undercut the auditor — same guard
   * that makes verified rows read-only on the student side). Returns the
   * updated row, or null when the row doesn't exist / was already ruled.
   */
  audit(rowId: string, ruling: CredentialAuditRuling): Promise<CredentialRow | null>;
  /** Declare: a new `declared` row (the audit clock starts here). */
  declare(studentId: string, input: CredentialInput): Promise<CredentialRow>;
  /**
   * Edit-while-declared (full patch) or revise-and-resubmit a `rejected`
   * row (patch + status → declared; verified rows are read-only — the
   * route, not the store, owns that guard). Returns the updated row.
   */
  edit(studentId: string, id: string, patch: CredentialInput): Promise<CredentialRow | null>;
  /** Delete a `declared` or `rejected` row (never `verified`). */
  remove(studentId: string, id: string): Promise<boolean>;
}

/** Postgres' not-applied-table markers (resume-run-store's exact predicate). */
const isMissingTable = (e: { code?: string; message?: string }): boolean =>
  e?.code === "42P01" ||
  e?.code === "PGRST205" ||
  /does not exist|not find the table|schema cache/i.test(e?.message ?? "");

/** The schema's audit_note block is one of the recorded user-pending SQL
 * blocks (supabase/schema.sql — the two credentials blocks + the applied-
 * schema alter note). Until it applies PostgREST answers PGRST204/42703
 * "could not find the 'audit_note' column" — the NOTE carrier degrades;
 * the ruling itself stays writable. */
const isMissingColumn = (e: { code?: string; message?: string }): boolean =>
  e?.code === "PGRST204" ||
  e?.code === "42703" ||
  /could not find the '.*' column|column .* does not exist/i.test(e?.message ?? "");

let degradedFlag = false;

/** Honest persistence note for the Credentials panel (or null). */
export function credentialsPersistenceNotice(): string | null {
  return degradedFlag
    ? "stored locally — the credentials table isn't applied yet (paste the schema's SQL)"
    : null;
}

/* ── row mapping (snake_case ↔ interface) ─────────────────────────────── */

interface DbCredRow {
  id: string;
  kind: string;
  title: string;
  organization: string | null;
  started_on: string | null;
  ended_on: string | null;
  evidence_url: string | null;
  evidence_note: string | null;
  declared_skills: string[] | null;
  status: string;
  verified_by: string | null;
  verified_at: string | null;
  audit_note: string | null;
  created_at: string;
}

function toRow(d: DbCredRow): CredentialRow {
  return {
    id: d.id,
    kind: d.kind as CredentialKind,
    title: d.title,
    organization: d.organization,
    startedOn: d.started_on,
    endedOn: d.ended_on,
    evidenceUrl: d.evidence_url,
    evidenceNote: d.evidence_note,
    declaredSkills: d.declared_skills ?? [],
    status: d.status as CredentialStatus,
    verifiedBy: d.verified_by,
    verifiedAt: d.verified_at,
    auditNote: d.audit_note,
    createdAt: d.created_at,
  };
}

function toInput(p: CredentialInput): Partial<DbCredRow> {
  return {
    kind: p.kind,
    title: p.title,
    organization: p.organization ?? null,
    started_on: p.startedOn ?? null,
    ended_on: p.endedOn ?? null,
    evidence_url: p.evidenceUrl ?? null,
    evidence_note: p.evidenceNote ?? null,
    declared_skills: p.declaredSkills ?? [],
  };
}

class PostgresCredentialStore implements CredentialStore {
  private async guard(): Promise<boolean> {
    return !degradedFlag;
  }

  async list(studentId: string): Promise<CredentialRow[]> {
    if (degradedFlag) return jsonStore.list(studentId);
    const { data, error } = await supabaseAdmin()
      .from("credentials")
      .select("*")
      .eq("student_id", studentId)
      .neq("kind", "presence") // presence renders from state.presence — never twice
      .order("created_at");
    if (error) {
      if (isMissingTable(error)) {
        degradedFlag = true;
        return jsonStore.list(studentId);
      }
      throw new Error(`credentials read failed: ${error.message}`);
    }
    return (data as DbCredRow[]).map(toRow);
  }

  async listAll(): Promise<CohortCredentialRow[]> {
    if (degradedFlag) return jsonStore.listAll();
    const { data, error } = await supabaseAdmin()
      .from("credentials")
      .select("*")
      .neq("kind", "presence") // never counselor-audited — see list()
      .order("created_at");
    if (error) {
      if (isMissingTable(error)) {
        degradedFlag = true;
        return jsonStore.listAll();
      }
      throw new Error(`credentials read failed: ${error.message}`);
    }
    return (data as (DbCredRow & { student_id: string })[]).map((d) => ({
      studentId: d.student_id,
      ...toRow(d),
    }));
  }

  async audit(rowId: string, ruling: CredentialAuditRuling): Promise<CredentialRow | null> {
    if (degradedFlag) return jsonStore.audit(rowId, ruling);
    const patch = {
      status: ruling.status,
      verified_by: ruling.ruledBy,
      verified_at: ruling.ruledAt,
      // verify clears a prior reject's note (the record reads as it rules —
      // no stale reason may sit beside a VERIFIED stamp); reject writes it
      audit_note: ruling.status === "rejected" ? ruling.auditNote ?? null : null,
    };
    const { data, error } = await supabaseAdmin()
      .from("credentials")
      .update(patch)
      .eq("id", rowId)
      // the ruling guard: only a row the audit hasn't ruled on yet
      .eq("status", "declared")
      .neq("kind", "presence")
      .select("*")
      .maybeSingle();
    console.error(`[audit-pg] row=${rowId} patchKeys=${Object.keys(patch).join(",")} err=${error?.code ?? "none"} matched=${data ? 1 : 0}`);
    if (error) {
      // the column predicate must eat the message BEFORE the table one —
      // the pending-column error says "... in the schema cache", which the
      // table predicate would otherwise matchingly swallow (found live:
      // the ruling degraded to the row-less JSON store and answered 409)
      if (isMissingColumn(error)) {
        console.error(`[audit-no-col] falling back to the plain ruling for ${rowId} (${error.code ?? ""})`);
        // the note carrier is a pending SQL block — the ruling still lands:
        // rewrite it without the note field. The caller surfaces the degraded
        // ruling honestly (a reject's reason cannot ride a missing column —
        // never a silent lie; supabase/schema.sql carries the alter note).
        const { audit_note: _omitted, ...plain } = patch;
        const second = await supabaseAdmin()
          .from("credentials")
          .update(plain)
          .eq("id", rowId)
          .eq("status", "declared")
          .neq("kind", "presence")
          .select("*")
          .maybeSingle();
        console.error(`[audit-no-col] second write: ${second.error ? second.error.code : "ok rows=" + (second.data ? 1 : 0)}`);
        if (second.error) throw new Error(`credentials write failed: ${second.error.message}`);
        return second.data ? toRow(second.data as DbCredRow) : null;
      }
      if (isMissingTable(error)) {
        degradedFlag = true;
        return jsonStore.audit(rowId, ruling);
      }
      throw new Error(`credentials write failed: ${error.message}`);
    }
    return data ? toRow(data as DbCredRow) : null;
  }

  async declare(studentId: string, input: CredentialInput): Promise<CredentialRow> {
    if (!this.guard()) return jsonStore.declare(studentId, input);
    const { data, error } = await supabaseAdmin()
      .from("credentials")
      .insert({
        student_id: studentId,
        ...toInput(input),
        status: "declared",
      })
      .select("*")
      .single();
    if (error) {
      if (!isMissingTable(error)) throw new Error(`credentials write failed: ${error.message}`);
      degradedFlag = true;
      return jsonStore.declare(studentId, input);
    }
    return { ...toRow(data as DbCredRow), status: "declared", createdAt: new Date().toISOString() };
  }

  async edit(studentId: string, id: string, patch: CredentialInput): Promise<CredentialRow | null> {
    if (degradedFlag) return jsonStore.edit(studentId, id, patch);
    const { data, error } = await supabaseAdmin()
      .from("credentials")
      .update({ ...toInput(patch), status: "declared" })
      .eq("id", id)
      .eq("student_id", studentId)
      .neq("status", "verified") // the store's own guard: verified is read-only
      .select("*")
      .maybeSingle();
    if (error) {
      if (!isMissingTable(error)) throw new Error(`credentials write failed: ${error.message}`);
      degradedFlag = true;
      return jsonStore.edit(studentId, id, patch);
    }
    return data ? toRow(data as DbCredRow) : null;
  }

  async remove(studentId: string, id: string): Promise<boolean> {
    if (degradedFlag) return jsonStore.remove(studentId, id);
    const { data, error } = await supabaseAdmin()
      .from("credentials")
      .delete()
      .eq("id", id)
      .eq("student_id", studentId)
      .neq("status", "verified") // never erase a shared audited record here
      .select("id");
    if (error) {
      if (!isMissingTable(error)) throw new Error(`credentials erase failed: ${error.message}`);
      degradedFlag = true;
      return jsonStore.remove(studentId, id);
    }
    return (data?.length ?? 0) > 0;
  }
}

/* ── JSON fallback (offline/dev; also the not-yet-applied-schema path) ──── */

const JSON_PATH = path.join(process.cwd(), "data", "credentials.json");

async function readAll(): Promise<Record<string, CredentialRow[]>> {
  try {
    return JSON.parse(await fs.promises.readFile(JSON_PATH, "utf8"));
  } catch {
    return {};
  }
}

async function writeAll(all: Record<string, CredentialRow[]>): Promise<void> {
  await fs.promises.mkdir(path.dirname(JSON_PATH), { recursive: true });
  await fs.promises.writeFile(JSON_PATH, JSON.stringify(all, null, 2), "utf8");
}

const uid = () =>
  "j-" +
  Math.random().toString(36).slice(2, 10) +
  Date.now().toString(36).slice(-6);

const jsonStore = {
  async list(studentId: string): Promise<CredentialRow[]> {
    return (await readAll())[studentId] ?? [];
  },
  async listAll(): Promise<CohortCredentialRow[]> {
    const all = await readAll();
    return Object.entries(all).flatMap(([studentId, rows]) =>
      rows.map((row) => ({ studentId, ...row }))
    );
  },
  async audit(rowId: string, ruling: CredentialAuditRuling): Promise<CredentialRow | null> {
    const all = await readAll();
    for (const rows of Object.values(all)) {
      const i = rows.findIndex((r) => r.id === rowId && r.status === "declared" && String(r.kind) !== "presence");
      if (i < 0) continue;
      const next: CredentialRow = {
        ...rows[i],
        status: ruling.status,
        verifiedBy: ruling.ruledBy,
        verifiedAt: ruling.ruledAt,
        auditNote: ruling.status === "rejected" ? ruling.auditNote ?? null : null,
        degraded: true,
      };
      rows[i] = next;
      await writeAll(all);
      return next;
    }
    return null;
  },
  async declare(studentId: string, input: CredentialInput): Promise<CredentialRow> {
    const all = await readAll();
    const row: CredentialRow = {
      id: uid(),
      kind: input.kind,
      title: input.title,
      organization: input.organization ?? null,
      startedOn: input.startedOn ?? null,
      endedOn: input.endedOn ?? null,
      evidenceUrl: input.evidenceUrl ?? null,
      evidenceNote: input.evidenceNote ?? null,
      declaredSkills: input.declaredSkills ?? [],
      status: "declared",
      verifiedBy: null,
      verifiedAt: null,
      auditNote: null,
      createdAt: new Date().toISOString(),
    };
    all[studentId] = [...(all[studentId] ?? []), row];
    await writeAll(all);
    return { ...row, degraded: true };
  },
  async edit(studentId: string, id: string, patch: CredentialInput): Promise<CredentialRow | null> {
    const all = await readAll();
    const rows = all[studentId] ?? [];
    const i = rows.findIndex((r) => r.id === id && r.status !== "verified");
    if (i < 0) return null;
    const next: CredentialRow = {
      ...rows[i],
      kind: patch.kind,
      title: patch.title,
      organization: patch.organization ?? null,
      startedOn: patch.startedOn ?? null,
      endedOn: patch.endedOn ?? null,
      evidenceUrl: patch.evidenceUrl ?? null,
      evidenceNote: patch.evidenceNote ?? null,
      declaredSkills: patch.declaredSkills ?? [],
      // a rejected row resubmitted through edit re-enters the audit queue
      status: "declared",
      verifiedBy: null,
      verifiedAt: null,
      degraded: true,
    };
    rows[i] = next;
    all[studentId] = rows;
    await writeAll(all);
    return next;
  },
  async remove(studentId: string, id: string): Promise<boolean> {
    const all = await readAll();
    const rows = all[studentId] ?? [];
    const i = rows.findIndex((r) => r.id === id && r.status !== "verified");
    if (i < 0) return false;
    rows.splice(i, 1);
    all[studentId] = rows;
    await writeAll(all);
    return true;
  },
};

const { configured } = supabaseEnv();

export const credentialStore: CredentialStore = configured
  ? new PostgresCredentialStore()
  : {
      list: jsonStore.list,
      listAll: jsonStore.listAll,
      audit: jsonStore.audit,
      declare: async (id, input) => {
        const r = await jsonStore.declare(id, input);
        return degradedFlag ? { ...r, degraded: true } : r;
      },
      edit: jsonStore.edit,
      remove: jsonStore.remove,
    };
