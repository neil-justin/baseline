/**
 * Engine re-lock helper (2026-10-29): delete ONLY the demo student's stored
 * state row so the lazy reseed produces the new five-channel canon seed
 * (lib/fixtures/neil.ts). 2026-10-29 evening ruling: ALSO clear the demo
 * student's resume_runs row; 2026-10-30 (Prep pass): ALSO the letter_runs
 * row — a leftover run carries that AR factor (resume 7/7 or letter 5/5 of
 * 15) and made reseed yield 47 instead of the canon 40. Never touches other
 * rows; never prints creds. Dev-only JSON fallbacks (data/resume-runs.json,
 * data/letter-runs.json) are cleared too — they exist when the respective
 * table isn't applied yet (degraded store), and would otherwise resurrect
 * measured AR factors after reseed.
 *   node --env-file=.env.local scripts/delete-neil-state.mjs
 */
import { existsSync, rmSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !service) {
  console.error("missing Supabase env — refusing to run");
  process.exit(1);
}
const admin = createClient(url, service, { auth: { autoRefreshToken: false, persistSession: false } });
const { data, error } = await admin.from("student_state").delete().eq("student_id", "neil").select();
if (error) {
  console.error("delete failed:", error.message);
  process.exit(1);
}
console.log(`deleted ${data?.length ?? 0} row(s) — student_id='neil' only`);
for (const table of ["resume_runs", "letter_runs", "credentials"]) {
  const { data: rows, error: runErr } = await admin
    .from(table)
    .delete()
    .eq("student_id", "neil")
    .select();
  if (runErr && /does not exist|not find the table|schema cache/i.test(runErr.message)) {
    console.log(`${table} isn't applied yet — nothing to delete there`);
    continue;
  }
  if (runErr) {
    console.error(`${table} delete failed:`, runErr.message);
    process.exit(1);
  }
  console.log(
    `deleted ${rows?.length ?? 0} ${table} row(s) — student_id='neil' only (AR factor back to unmeasured; reseed yields canon 40)`
  );
}
// dev fallback stores (degraded schema or offline mode): clear Neil's rows so
// a reseed can never read them back
for (const file of ["data/resume-runs.json", "data/letter-runs.json", "data/credentials.json"]) {
  if (existsSync(file)) {
    rmSync(file);
    console.log(`cleared dev fallback ${file}`);
  }
}
const { count, error: cErr } = await admin
  .from("student_state")
  .select("*", { count: "exact", head: true });
if (cErr) {
  console.error("count failed:", cErr.message);
  process.exit(1);
}
console.log(`student_state rows remaining (all students): ${count}`);
