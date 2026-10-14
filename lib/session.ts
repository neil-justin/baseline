import type { StudentState } from "@/lib/types";
import { NEIL_SEED } from "@/lib/fixtures/neil";

/**
 * Demo session layer — seeded accounts for the local, offline mock defense.
 * No real auth backend; the post-defense swap to hosted Supabase auth replaces
 * ONLY this module (route handlers + surfaces are session-agnostic).
 *
 * Seeded accounts: the demo student (neil) + the 7-cohort fixture students +
 * one admin. Signup writes a student-format account opted out of the demo.
 */

export interface DemoAccount {
  email: string;
  password: string;
  role: "student" | "admin";
  studentId: string;
  fullName: string;
}

/** Cohort ids referenced by fixtures (admin surface) + the demo student. */
const STUDENT_IDS = ["neil", "marco", "jomar", "rafael", "liza", "pao", "kaye"] as const;

export const SEED_PASSWORD = "readiness";

export const ACCOUNTS: DemoAccount[] = [
  ...STUDENT_IDS.map((id) => ({
    email: `${id}@demo.ph`,
    password: SEED_PASSWORD,
    role: "student" as const,
    studentId: id,
    fullName: id === "neil" ? "Neil" : id[0].toUpperCase() + id.slice(1),
  })),
  {
    email: "admin@demo.ph",
    password: SEED_PASSWORD,
    role: "admin",
    studentId: "",
    fullName: "Adviser Admin",
  },
];

export function findAccount(email: string): DemoAccount | undefined {
  return ACCOUNTS.find((a) => a.email.toLowerCase() === email.toLowerCase());
}

export function newStudentState(id: string, fullName: string): StudentState {
  if (id === "neil") return structuredClone(NEIL_SEED);
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

/** Cookie name for the demo session (set by the auth routes). */
export const SESSION_COOKIE = "cr_session";

export function sessionCookieValue(a: DemoAccount): string {
  // no signing — local demo only; hosted-Supabase swap replaces this
  return Buffer.from(JSON.stringify({ id: a.studentId, role: a.role, name: a.fullName })).toString("base64url");
}

export function readSession(cookie: string | undefined): { id: string; role: string; name: string } | null {
  if (!cookie) return null;
  try {
    return JSON.parse(Buffer.from(cookie, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}
