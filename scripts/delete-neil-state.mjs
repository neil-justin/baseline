/**
 * Engine re-lock helper (2026-10-29): delete ONLY the demo student's stored
 * state row so the lazy reseed produces the new five-channel canon seed
 * (lib/fixtures/neil.ts). Never touches other rows; never prints creds.
 *   node --env-file=.env.local scripts/delete-neil-state.mjs
 */
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
const { count, error: cErr } = await admin
  .from("student_state")
  .select("*", { count: "exact", head: true });
if (cErr) {
  console.error("count failed:", cErr.message);
  process.exit(1);
}
console.log(`student_state rows remaining (all students): ${count}`);
