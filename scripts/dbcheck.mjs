import { createClient } from "@supabase/supabase-js";
const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const { data, error } = await admin.from("credentials").select("student_id,title,status,audit_note").order("created_at");
if (error) { console.error(error.message); process.exit(1); }
for (const r of data ?? []) console.log(r.student_id, "|", r.status, "|", r.title, "|", (r.audit_note ?? "").slice(0, 60));
