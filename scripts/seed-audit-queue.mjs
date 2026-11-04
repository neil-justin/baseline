#!/usr/bin/env node
/**
 * Seed the demo Audit queue (the counselor's function) with REAL declared-
 * credential rows — written through the `credentials` table the store reads
 * (ADR 0003), status 'declared', skills drawn verbatim from the framework
 * vocabulary (lib/fixtures/catalog.ts career maps). Nothing is painted: the
 * console computes what it renders from these rows, exactly as if the
 * students had declared them in Profile → Credentials.
 *
 *   node --env-file=.env.local scripts/seed-audit-queue.mjs
 *
 * Idempotent: a (student_id, title) row that already exists is skipped.
 * Rows ride the demo cohort ids (marco · jomar · liza — one certification,
 * one internship, one project; each a different evidence shape so the
 * queue renders its full register: link / note / both).
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !service) {
  console.error("Supabase env missing — run with: node --env-file=.env.local scripts/seed-audit-queue.mjs");
  process.exit(1);
}

const admin = createClient(url, service, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/** Declared stamps: recent days so the queue's oldest-first order reads. */
function iso(daysAgo, hour, minute) {
  const d = new Date(Date.now() - daysAgo * 24 * 3600 * 1000);
  d.setUTCHours(hour, minute, 0, 0);
  return d.toISOString();
}

const ROWS = [
  {
    student_id: "neil",
    kind: "certification",
    title: "Full-stack foundations — capstone build",
    organization: "Campus capstone certification board",
    started_on: "2026-08-11",
    ended_on: "2026-10-28",
    evidence_url: "https://github.com/neil-r/capstone-capstone-records",
    evidence_note: null,
    declared_skills: [
      "Applications Development",
      "Agile Software Development",
      "Defect management",
    ],
    created_at: iso(4, 3, 5),
  },
  {
    student_id: "marco",
    kind: "certification",
    title: "AWS Cloud Practitioner Essentials",
    organization: "Amazon Web Services Skill Builder",
    started_on: "2026-09-14",
    ended_on: "2026-10-30",
    evidence_url: "https://aws.amazon.com/verification/marco-santiago-cp-2026",
    evidence_note: null,
    declared_skills: [
      "Linux + web deployment basics",
      "Applications Support and Enhancement",
    ],
    created_at: iso(3, 2, 41),
  },
  {
    student_id: "jomar",
    kind: "internship",
    title: "QA Intern — Test lab attaché",
    organization: "Kada Labs (internship hosting)",
    started_on: "2026-08-03",
    ended_on: "2026-10-24",
    evidence_url: null,
    evidence_note:
      "Internship completion note from the host supervisor — scanned copy held with the program's OJT coordinator; the acceptance letter and the final evaluation form are both on file.",
    declared_skills: [
      "Software Testing",
      "Defect management",
      "Quality Assurance / Quality Standards",
    ],
    created_at: iso(2, 6, 12),
  },
  {
    student_id: "liza",
    kind: "project",
    title: "Barangay records digitization lead",
    organization: "Barangay San Isidro volunteer program",
    started_on: "2026-07-18",
    ended_on: null,
    evidence_url: "https://github.com/liza-navarro/barangay-records",
    evidence_note:
      "Repo contains the intake workbook + the migration runbook the barangay footprint uses; scope covers the data-entry flow she designed.",
    declared_skills: [
      "Data Design / SQL + data modeling",
      "Requirements Analysis",
      "Business Needs Analysis",
    ],
    created_at: iso(1, 4, 8),
  },
];

// Idempotency comes from the table itself: skip a row whose (student, title)
// already exists in any status — re-running never doubles the queue.
const { data: existing, error: readErr } = await admin
  .from("credentials")
  .select("student_id, title, status");
if (readErr) {
  console.error("credentials read failed:", readErr.message);
  process.exit(1);
}
const seen = new Set(
  (existing ?? []).map((r) => `${r.student_id}::${r.title}`)
);

let added = 0;
for (const row of ROWS) {
  const key = `${row.student_id}::${row.title}`;
  if (seen.has(key)) {
    console.log(`= already declared: ${row.student_id} — ${row.title}`);
    continue;
  }
  // The store's own insert shape (PostgresCredentialStore.declare) — status
  // 'declared', no ruling fields; created_at carries the declared stamp.
  const { error: insErr } = await admin
    .from("credentials")
    .insert({ ...row, status: "declared" });
  if (insErr) {
    console.error(`insert failed for ${row.student_id} — ${row.title}:`, insErr.message);
    process.exit(1);
  }
  console.log(`+ declared: ${row.student_id} — ${row.title}`);
  added += 1;
}

console.log(`\nSeed complete — ${added} new declared ${added === 1 ? "entry" : "entries"} in the audit queue.`);
