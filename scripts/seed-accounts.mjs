#!/usr/bin/env node
/**
 * Seed the demo cohort + staff accounts into Supabase Auth + Postgres
 * (ADR 0003). Run from the repo root:
 *
 *   node --env-file=.env.local scripts/seed-accounts.mjs
 *
 * Email scheme (privacy rule: real addresses NEVER enter the repo — env only):
 *   - Neil (demo student, canon seed)  = SEED_NEIL_EMAIL   (required — the
 *     user's real account, e.g. a plus-addressed Gmail)
 *   - System Admin                     = SEED_SYSADMIN_EMAIL (required — same
 *     human, plus-addressed; a distinct auth identity, same inbox)
 *   - Demo cohort (marco, jomar, …)    = <first>.<last>@SEED_COHORT_DOMAIN
 *     (default campus.test) — full-name addresses on a neutral reserved
 *     domain, e.g. marco.santiago@…
 *   - Adviser Admin (counselor)        = ana.villanueva@SEED_COHORT_DOMAIN
 * All seeded accounts share the demo password (SEED_PASSWORD, default
 * "readiness").
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

// Real-human addresses must come from the environment — never guessed,
// never hardcoded (they must not enter the repo).
const NEIL_EMAIL = process.env.SEED_NEIL_EMAIL;
const SYSADMIN_EMAIL = process.env.SEED_SYSADMIN_EMAIL;
if (!NEIL_EMAIL) {
  console.error(
    "SEED_NEIL_EMAIL is not set — add it to .env.local (Neil's real account email) and re-run.\n" +
      "Real addresses never enter the repo; the seed reads them from the environment only."
  );
  process.exit(1);
}
if (!SYSADMIN_EMAIL) {
  console.error(
    "SEED_SYSADMIN_EMAIL is not set — add it to .env.local (the System Admin identity, e.g.\n" +
      "the same Gmail plus-addressed: you+sys-admin@gmail.com) and re-run."
  );
  process.exit(1);
}

// Org-like demo addresses on a neutral reserved domain — safe to commit/print.
const COHORT_DOMAIN = process.env.SEED_COHORT_DOMAIN || "campus.test";
const cohortEmail = (local) => `${local}@${COHORT_DOMAIN}`;

const PASSWORD = process.env.SEED_PASSWORD || "readiness";

const STUDENTS = [
  { id: "neil", email: NEIL_EMAIL, fullName: "Neil R." },
  { id: "marco", email: cohortEmail("marco.santiago"), fullName: "Marco Santiago" },
  { id: "jomar", email: cohortEmail("jomar.deleon"), fullName: "Jomar de Leon" },
  { id: "rafael", email: cohortEmail("rafael.mendoza"), fullName: "Rafael Mendoza" },
  { id: "liza", email: cohortEmail("liza.navarro"), fullName: "Liza Navarro" },
  // display name Paolo; the id stays 'pao' (student_id + student_state key)
  { id: "pao", email: cohortEmail("paolo.reyes"), fullName: "Paolo Reyes" },
  { id: "kaye", email: cohortEmail("kaye.bautista"), fullName: "Kaye Bautista" },
];

const STAFF = [
  { email: cohortEmail("ana.villanueva"), role: "counselor", fullName: "Ana Villanueva" },
  { email: SYSADMIN_EMAIL, role: "sysadmin", fullName: "Site Operations" },
];

const admin = createClient(url, service, {
  auth: { autoRefreshToken: false, persistSession: false },
});

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

for (const { id, email, fullName } of STUDENTS) {
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

console.log("\nSeed complete. Accounts (password for all: the demo password):");
console.log(`  students : ${STUDENTS.map((s) => `${s.id} → ${s.email}`).join(", ")}`);
console.log(`  staff    : ${STAFF.map((s) => `${s.role} → ${s.email}`).join(", ")}`);
console.log(`  neil's real address is read from SEED_NEIL_EMAIL (redacted in logs: ${NEIL_EMAIL.split("@")[0].split("+")[0]}…@${NEIL_EMAIL.split("@")[1]})`);
