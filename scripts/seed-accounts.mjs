#!/usr/bin/env node
/**
 * Seed the demo cohort + staff accounts into Supabase Auth + Postgres
 * (ADR 0003). Run from the repo root:
 *
 *   node --env-file=.env.local scripts/seed-accounts.mjs
 *
 * Idempotent: auth users that already exist are listed and skipped, profiles
 * and student_state rows are upserted. Students get an empty fresh state
 * (same shape as lib/session.ts newStudentState) — except neil, whose state
 * seeds lazily from the canon NEIL_SEED on first read, so no row is written
 * for him here (an explicit empty row would shadow the canon seed).
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !service) {
  console.error("Supabase env missing — run with: node --env-file=.env.local scripts/seed-accounts.mjs");
  process.exit(1);
}
const admin = createClient(url, service, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const PASSWORD = "readiness";

const STUDENTS = [
  { id: "neil", fullName: "Neil R." },
  { id: "marco", fullName: "Marco D." },
  { id: "jomar", fullName: "Jomar P." },
  { id: "rafael", fullName: "Rafael G." },
  { id: "liza", fullName: "Liza C." },
  { id: "pao", fullName: "Pao M." },
  { id: "kaye", fullName: "Kaye T." },
];

const STAFF = [
  { email: "admin@demo.ph", role: "counselor", fullName: "Adviser Admin" },
  { email: "sysadmin@demo.ph", role: "sysadmin", fullName: "Site Operations" },
];

function freshState(id, fullName) {
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

const { data: listData, error: listErr } = await admin.auth.admin.listUsers();
if (listErr) {
  console.error("listUsers failed:", listErr.message);
  process.exit(1);
}
const byEmail = new Map(listData.users.map((u) => [u.email.toLowerCase(), u]));

async function ensureUser(email, role) {
  const existing = byEmail.get(email.toLowerCase());
  if (existing) {
    console.log(`= auth user exists: ${email}`);
    return existing.id;
  }
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
    app_metadata: { role },
  });
  if (error || !data?.user) {
    console.error(`auth.createUser failed for ${email}:`, error?.message ?? "no user");
    process.exit(1);
  }
  console.log(`+ auth user created: ${email} (${role})`);
  return data.user.id;
}

for (const { id, fullName } of STUDENTS) {
  const email = `${id}@demo.ph`;
  const userId = await ensureUser(email, "student");

  const { error: profErr } = await admin
    .from("profiles")
    .upsert(
      { id: userId, email, full_name: fullName, role: "student", student_id: id, campus: "demo-campus" },
      { onConflict: "id" }
    );
  if (profErr) {
    console.error(`profiles upsert failed for ${id}:`, profErr.message);
    process.exit(1);
  }

  // neil seeds lazily from NEIL_SEED — writing an empty row would shadow it
  if (id !== "neil") {
    const { error: stateErr } = await admin
      .from("student_state")
      .upsert({ student_id: id, state: freshState(id, fullName), updated_at: new Date().toISOString() });
    if (stateErr) {
      console.error(`student_state upsert failed for ${id}:`, stateErr.message);
      process.exit(1);
    }
  }
}

for (const { email, role, fullName } of STAFF) {
  const userId = await ensureUser(email, role);
  const { error: profErr } = await admin
    .from("profiles")
    .upsert(
      { id: userId, email, full_name: fullName, role, student_id: null, campus: "demo-campus" },
      { onConflict: "id" }
    );
  if (profErr) {
    console.error(`profiles upsert failed for ${email}:`, profErr.message);
    process.exit(1);
  }
}

console.log("\nSeed complete. Accounts (password for all: the demo password from the ADR):");
console.log(`  students : ${STUDENTS.map((s) => s.id + "@demo.ph").join(", ")}`);
console.log(`  staff    : ${STAFF.map((s) => s.email).join(", ")}`);
