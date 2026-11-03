import { supabaseAdmin } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { newStudentState } from "@/lib/session";

/**
 * Shared account provisioning (Google round, ADR 0006). The ONE place that
 * derives a unique student_id from an email and writes the
 * profiles/student_state pair — the password signup route and the
 * /welcome picker both land here, so both guarantee identical dedupe
 * (-2/-3 suffix scan), campus default, and seeded-state rules.
 *
 * server-only: touches the service-role client (never import from client
 * components — lib/supabase/server contract).
 */

export async function nextStudentId(email: string): Promise<string> {
  const base = email.split("@")[0].replace(/[^a-z0-9-]/g, "") || "student";
  let studentId = base;
  for (let n = 2; ; n++) {
    const { data: taken } = await supabaseAdmin()
      .from("profiles")
      .select("id")
      .eq("student_id", studentId)
      .maybeSingle();
    if (!taken) break;
    studentId = `${base}-${n}`;
  }
  return studentId;
}

export async function provisionStudent(input: {
  userId: string;
  email: string;
  fullName: string;
}): Promise<string> {
  const admin = supabaseAdmin();
  const studentId = await nextStudentId(input.email);
  const { error: profErr } = await admin.from("profiles").insert({
    id: input.userId,
    email: input.email,
    full_name: input.fullName,
    role: "student",
    student_id: studentId,
    campus: "demo-campus",
  });
  if (profErr) throw new Error(`profiles insert: ${profErr.message}`);
  await db.saveStudentState(studentId, newStudentState(studentId, input.fullName));
  return studentId;
}
