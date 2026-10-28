import { redirect } from "next/navigation";
import { supabaseAdmin, supabaseServer } from "@/lib/supabase/server";

/**
 * Identity layer (ADR 0003) — who is signed in, per request.
 * The signed-in user (verified, signed JWT via Supabase Auth) joins to their
 * profiles row for role/name. The session decides — pages never hardcode a
 * student.
 *
 * Roles (CONTEXT.md): student · counselor (the Admin surface person) ·
 * sysadmin (study team ops).
 */

export type Role = "student" | "counselor" | "sysadmin";

export interface Profile {
  userId: string;
  email: string;
  fullName: string;
  role: Role;
  /** Business id across fixtures/engines (neil, marco, …); null for staff. */
  studentId: string | null;
  campus: string;
  yearLevel: string | null;
  program: string | null;
  section: string | null;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabaseAdmin()
    .from("profiles")
    .select("email, full_name, role, student_id, campus, year_level, program, section")
    .eq("id", user.id)
    .maybeSingle();
  if (error || !data) return null;
  return {
    userId: user.id,
    email: data.email,
    fullName: data.full_name,
    role: data.role as Role,
    studentId: data.student_id,
    campus: data.campus,
    yearLevel: data.year_level,
    program: data.program,
    section: data.section,
  };
}

/** Server-page gate: a signed-in student, else the sign-in page. */
export async function requireStudent(): Promise<Profile & { studentId: string }> {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "student" || !profile.studentId) redirect("/signin");
  // the guard above proved studentId is set (redirect() never returns)
  return profile as Profile & { studentId: string };
}

/** Server-page gate: the Admin surface is for Counselors + System Admins. */
export async function requireStaff(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile || (profile.role !== "counselor" && profile.role !== "sysadmin")) redirect("/signin");
  return profile;
}

/**
 * The acting student for a state read/write route: the signed-in student by
 * default; a client-supplied `student` param is honored only for staff
 * (counselor/sysadmin cohort reads). Students can never address another
 * student's state. Returns null when the caller isn't signed in.
 */
export async function actingStudentId(param: unknown): Promise<string | null> {
  const profile = await getCurrentProfile();
  if (!profile) return null;
  if (profile.role === "student" && profile.studentId) return profile.studentId;
  if (profile.role === "counselor" || profile.role === "sysadmin") {
    return typeof param === "string" && param.length > 0 ? param : profile.studentId;
  }
  return null;
}

/** Fresh-student default state — unchanged shape (engines own it). */
export function newStudentState(id: string, fullName: string) {
  return {
    id,
    name: fullName,
    grade: "G11",
    strand: "",
    careerId: null,
    bars: {},
    goals: [],
    stageOneDone: 0,
    stageOneQueue: [],
    softSkills: {},
    decisions: { verifiedTransferred: [] },
    events: [],
  };
}
