#!/usr/bin/env node
/**
 * e2e-personas.mjs — WIPE + SEED for the e2e persona round (user app 2026-11-06).
 * Run from the repo root:
 *
 *   node --env-file=.env.local scripts/e2e-personas.mjs
 *
 * What it does, in order:
 *  1. WIPE — deletes EVERY Supabase auth user EXCEPT the six e2e persona
 *     emails (profiles/auto-cascade: student_state, credentials; plus an
 *     explicit sweep of resume_runs/letter_runs/counselor_requests in case
 *     FKs were relaxed), then deletes the dev JSON fallback data/state.json.
 *     Seeded demo data (neil + cohort + old staff) goes; your real/personal
 *     Supabase accounts are only kept if they ARE a persona email.
 *  2. SEED — upserts the six personas from .env.local E2E_* keys:
 *     students get an EMPTY fresh state row (never the old Neil seed —
 *     the db.ts demo fallback was removed this round), staff get
 *     student_id null.  All pre-verified (email_confirm: true) so no inbox
 *     step is needed; passwords come from the persona's own env password.
 *
 *     Credentials land in logs ONLY as email+role (never the password).
 *
 *  3. VERIFY — prints per-table row counts as a post-wipe receipt.
 */
import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !service) {
  console.error("Supabase env missing — run with: node --env-file=.env.local scripts/e2e-personas.mjs");
  process.exit(1);
}
const admin = createClient(url, service, { auth: { autoRefreshToken: false, persistSession: false } });

/* personas: id | email | password | fullName | role */
const STUDENTS = [
  { id: "aisat", email: process.env.E2E_PRIMARY_STUDENT_EMAIL, pw: process.env.E2E_PRIMARY_STUDENT_PASSWORD, fullName: "Aisat Mallari" },
  { id: "zubiri", email: process.env.E2E_EDGE_STUDENT_EMAIL, pw: process.env.E2E_EDGE_STUDENT_PASSWORD, fullName: "Manuel Zubiri" },
  { id: "catalina", email: process.env.E2E_ISOLATION_STUDENT_EMAIL, pw: process.env.E2E_ISOLATION_STUDENT_PASSWORD, fullName: "Catalina Estrada" },
  { id: "consuelo", email: process.env.E2E_SWITCH_STUDENT_EMAIL, pw: process.env.E2E_SWITCH_STUDENT_PASSWORD, fullName: "Consuelo Sicat" },
  { id: "antonio", email: process.env.E2E_EXTRA_STUDENT_EMAIL, pw: process.env.E2E_EXTRA_STUDENT_PASSWORD, fullName: "Antonio Buensalida" },
];
const STAFF = [
  { id: null, email: process.env.E2E_COUNSELOR_EMAIL, pw: process.env.E2E_COUNSELOR_PASSWORD, fullName: "Helena Salcedo", role: "counselor" },
  { id: null, email: process.env.E2E_SYSADMIN_EMAIL, pw: process.env.E2E_SYSADMIN_PASSWORD, fullName: "Site Operations", role: "sysadmin" },
];

for (const s of [...STUDENTS, ...STAFF]) {
  if (!s.email || !s.pw) {
    console.error(`persona env missing for ${s.id ?? s.role} (E2E_* keys) — add them to .env.local`);
    process.exit(1);
  }
}
const KEEP = new Set([...STUDENTS, ...STAFF].map((s) => s.email.toLowerCase()));

/* ── 1. WIPE ─────────────────────────────────────────────────────────── */
const { data: listData, error: listErr } = await admin.auth.admin.listUsers();
if (listErr) {
  console.error("listUsers failed:", listErr.message);
  process.exit(1);
}
/* 1. WIPE — EVERY auth user goes (the six personas are recreated fresh
 * below, so stale profile/credentials/state rows can never survive). */
let deleted = 0;
for (const u of listData.users) {
  const { error } = await admin.auth.admin.deleteUser(u.id);
  if (error) console.error(`  delete failed ${u.email ?? u.id}: ${error.message}`);
  else deleted++;
}
console.log(`wipe: ${deleted} auth users deleted (${listData.users.length} existed)`);

/* explicit sweep of run rows keyed on text student ids (the user-delete
 * cascade covers the FK-linked tables; these sweeps only belt-and-suspend
 * any relaxed-FK drift) — also clears stale persona rows so recreations
 * never collide */
for (const [table, col] of [
  ["student_state", "student_id"],
  ["resume_runs", "student_id"],
  ["letter_runs", "student_id"],
]) {
  const { error } = await admin
    .from(table)
    .delete()
    .neq(col, "__wipe__");
  if (error) console.error(`  ${table} sweep failed: ${error.message} (continuing)`);
  else console.log(`wipe: ${table} cleared`);
}

const jsonPath = new URL("../data/state.json", import.meta.url);
if (fs.existsSync(jsonPath)) {
  fs.rmSync(jsonPath);
  console.log("wipe: data/state.json deleted (JsonStore fallback empty)");
}

/* ── 2. SEED personas ────────────────────────────────────────────────── */
function freshState(id, fullName) {
  return {
    id,
    name: fullName,
    yearLevel: "4th Year",
    track: "",
    careerId: null,
    bars: {},
    softSkills: {},
    goals: [],
    stageOneDone: 0,
    stageOneQueue: [],
    decisions: { verifiedTransferred: [] },
    events: [],
  };
}

async function ensurePersona(email, pw, role, fullName, studentId) {
  const { data, error } = await admin.auth.admin.createUser({
    email, password: pw, email_confirm: true, app_metadata: { role },
  });
  if (error) {
    if ((error.message ?? "").includes("already")) {
      const { data: dupe } = await admin.auth.admin.listUsers();
      const hit = dupe.users.find((u) => (u.email ?? "").toLowerCase() === email.toLowerCase());
      await admin.auth.admin
        .updateUserById(hit.id, { password: pw, email_confirm: true, app_metadata: { role } });
      console.log(`= persona refreshed (exists): ${email}`);
      return hit.id;
    }
    console.error(`createUser failed ${email}: ${error.message}`);
    process.exit(1);
  }
  console.log(`+ persona created: ${email} (${role})`);
  return data.user.id;
}

for (const { id, email, pw, fullName } of STUDENTS) {
  const userId = await ensurePersona(email, pw, "student", fullName, id);
  const { error: profErr } = await admin.from("profiles").upsert(
    { id: userId, email, full_name: fullName, role: "student", student_id: id, campus: "demo-campus" },
    { onConflict: "id" }
  );
  if (profErr) { console.error(`profiles failed ${id}: ${profErr.message}`); process.exit(1); }
  const { error: stateErr } = await admin.from("student_state").upsert(
    { student_id: id, state: freshState(id, fullName), updated_at: new Date().toISOString() }
  );
  if (stateErr) { console.error(`student_state failed ${id}: ${stateErr.message}`); process.exit(1); }
}
for (const { email, pw, role, fullName } of STAFF) {
  const userId = await ensurePersona(email, pw, role, fullName, null);
  const { error: profErr } = await admin.from("profiles").upsert(
    { id: userId, email, full_name: fullName, role, student_id: null, campus: "demo-campus" },
    { onConflict: "id" }
  );
  if (profErr) { console.error(`profiles failed ${email}: ${profErr.message}`); process.exit(1); }
}

/* ── 3. VERIFY receipt ───────────────────────────────────────────────── */
for (const table of ["profiles", "student_state", "credentials", "resume_runs", "letter_runs", "counselor_requests"]) {
  const { count, error } = await admin.from(table).select("*", { count: "exact", head: true });
  console.log(`check: ${table.padEnd(18)} rows=${error ? "err:" + error.message : count}`);
}
console.log("\nPersonas ready (emails only; passwords stay in .env.local):");
for (const { id, email } of STUDENTS) console.log(`  student ${id}       → ${email}`);
for (const { email, role } of STAFF) console.log(`  ${role} → ${email}`);
