import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pickMaterial } from "@/lib/engines/suggestions";
import { CAREERS } from "@/lib/fixtures/catalog";
import { RESOURCES } from "@/lib/fixtures/resources";
import type { AccessState } from "@/lib/types";

/**
 * Wave B acceptance gate (user bar, 2026-11-03: "all roles should have a
 * suggested resource for their skills; suggestions must be taught pages; must
 * actually satisfy the skill") — every career × skill cell resolves to a
 * VETTED taught suggestion with a self-serve access fact and an authored
 * learn line.
 *
 * Wave E close-out (user-ruled 2026-11-03/04): the gate now carries an
 * explicit ADJUDICATED registry. Semantics — a cell passes when it is
 * VETTED, and it passes with a printed note when it is ADJUDICATED (the
 * Wave E re-hunt landed nothing teachable; the carrier/gap rows stand with
 * the user ruling recorded in the fixture comments; data is the source of
 * truth). A cell is RED only when it is neither, so any FUTURE unvetted
 * cell still trips this suite without a new registry entry — the registry
 * literal is the ledger, never a blanket pass.
 *
 * Reason taxonomy (printed prefix):
 *   no-claim       — no catalog row claims the skill (thin cell)
 *   unvetted       — claims exist but none passes the audit gates
 *   not-taught     — the vetted-slot contract broke (picker gates form)
 *   not-self-serve — the vetted-slot contract broke (picker gates access)
 *   no-learn-line  — the winning row lacks learnNotes[skill]
 * Honesty valve (plan Wave B): a skill with genuinely NO taught self-serve
 * resource on the open web stays red on purpose — the fixture comment marks
 * the adjudication and the user rules each such case (content owner).
 */

const SELF_SERVE = new Set<AccessState>(["direct", "account", "exam-paid"]);

interface Failure {
  career: string;
  skill: string;
  reason: string;
}

function auditOne(careerId: string, skill: string): string | null {
  // reason pass 1 — no claim at all
  const pool = RESOURCES.filter(
    (r) => r.careerId === careerId && r.skillsAddressed.includes(skill)
  );
  if (pool.length === 0) return "no-claim";

  const pick = pickMaterial(CAREERS.find((c) => c.id === careerId)!, skill);
  if (!pick.resource) return "unvetted";
  if (pick.resource.form !== "taught") return "not-taught";
  if (!pick.resource.access || !SELF_SERVE.has(pick.resource.access))
    return "not-self-serve";
  if (!pick.resource.learnNotes?.[skill]?.trim()) return "no-learn-line";
  return null;
}

/** One ADJUDICATED Wave E cell — `kernel` is the in-fixture phrase the
 *  data-truth check greps inside the career's comment block; `reason` is
 *  the one-line reason printed by the passing cells. */
interface Adjudicated {
  career: string;
  skill: string;
  reason: string;
  kernel: string;
}

/**
 * THE ADJUDICATED REGISTRY — exactly the Wave E cells the fixture comments
 * fence off as `adjudicated Wave E` (27 cells hunt-exhausted by the audits
 * of 2026-11-03/04). Reasons are condensed verbatim from those comments;
 * `kernel` is the quoted substring that keeps the fixture comment the
 * source of truth for each row of this literal.
 */
const ADJUDICATED: Adjudicated[] = [
  // sysadmin — SYS-V1 declared thin stands (Wave E block in the sysadmin section)
  { career: "sysadmin", skill: "IT Asset Management", reason: "re-hunted (edX/ServiceNow/MS Learn/classcentral/Coursera): every hit is a vendor product/marketing page, a certificate-syllabus blurb or a ruled-drop row — no taught self-serve page exists; SYS-V1 declared thin stands", kernel: "certificate-syllabus blurb" },
  { career: "sysadmin", skill: "System Integration", reason: "re-hunted (edX integration subject search): taught matches are energy/robotics scale, not IT-systems craft — no taught self-serve page exists; the gap rows stand", kernel: "IT-systems craft" },
  { career: "sysadmin", skill: "Configuration Tracking · Cyber-and-Data-Breach Incident Management · Business Needs Analysis", reason: "constructed 3-family bundle: no single taught page satisfies all three families; the gap rows stand", kernel: "satisfies all three families" },
  // webdev
  { career: "webdev", skill: "↳ task-cluster sub-row: site life-operations", reason: "edX/Alison/GCF sweep: every maintenance-course hit is a service brochure or a senior/career-marketing snippet; no taught self-serve page covers the six O*NET verbs", kernel: "covers the six O*NET verbs" },
  // hra · training — Skills Framework Adoption
  { career: "hra", skill: "Skills Framework Adoption", reason: "re-hunted: no taught self-serve page exists for promoting + logging framework adoption (Wave E)", kernel: "promoting + logging framework adoption" },
  { career: "training", skill: "Skills Framework Adoption", reason: "re-hunted: no taught self-serve page exists for Skills-Framework Adoption (Wave E)", kernel: "Skills-Framework Adoption re-hunted" },
  // mkt
  { career: "mkt", skill: "International Trade Legislation for Business · Retailing and the Economy · Website Design", reason: "the bundle prints trade legislation + retailing economics + website design as ONE cell; re-hunted (Coursera, Alison, Microsoft Learn, TESDA TOP, OCW) — pages teach at most one leg; the adviser-owned context row stays the honest carrier", kernel: "bundle prints trade legislation" },
  // sales
  { career: "sales", skill: "Product Advisory + Product Demonstration", reason: "the open self-serve field teaches selling/presentations, never the paired demonstrate-the-product craft as one taught claim (vendor demo-webinars exist, none is a course page); adviser-owned", kernel: "demonstrate-the-product" },
  { career: "sales", skill: "Design Concepts Generation · Idea Generation and Selection · Narrative Design · Shopper Marketing Campaign Management", reason: "ideation courses teach the idea-generation legs but no single free taught page also claims narrative design + shopper-marketing campaigns; adviser-owned", kernel: "narrative design + shopper-marketing" },
  // csr
  { career: "csr", skill: "Consumer Intelligence Analysis · Sentiment Analysis · Problem Identification · Continuous Improvement Management · Customer Acquisition Management · Brand Campaign Management (printed FSC list block)", reason: "six printed FSCs carried as ONE row; no single free taught page claims all six (analytics courses hit two or three legs at most); adviser-owned — the agent's growth edge gets program advice", kernel: "analytics courses hit two or three legs" },
  // opsanalyst
  { career: "opsanalyst", skill: "PSOC 2421 corroboration block (lettered task a)", reason: "statute-anchored corroboration block — one honest attempt; no taught self-serve page exists (Wave E 2026-11-03)", kernel: "PSOC 2421" },
  // ccqa — three Wave E honest reds
  { career: "ccqa", skill: "Analytical Method Validation", reason: "the literal FSC is a laboratory-metrology concept; every taught page found is a paid course (NMI/ANAB/LGC) or the cohort-windowed U-Tartu LC-MS MOOC — not the QA scoring-method craft; adviser-owned", kernel: "U-Tartu LC-MS" },
  { career: "ccqa", skill: "Change Management · Concept Creation · Coaching and Mentoring · Conflict Resolution · Risk Management and Administration", reason: "five printed FSCs carried as ONE row; no single taught page claims all five legs (change/conflict legs only; coaching lives on its own course; Concept Creation has no free taught page); adviser-owned", kernel: "Concept Creation has no free taught page" },
  { career: "ccqa", skill: "Collaboration · Communication · Creative Thinking · Critical Thinking · Customer Orientation · Digital Fluency · Problem Solving · Project Management · Research · Stakeholder Management (Enabling, I/B)", reason: "the printed coaching-conversation/analysis stage layer; no single taught page teaches the printed set, and comms-class bundle lifts are the recorded lie class (§6.1); adviser-owned", kernel: "recorded lie class" },
  // coll
  { career: "coll", skill: "Recommend legal action or disconnection when payment cannot be obtained / negotiate credit extensions", reason: "no taught page teaches the recommendation itself — the taught ecosystem drills compliant settlement and litigation AVOIDANCE (PDCflow boot-camp prints settlement criteria and attorney-review guardrails, not escalation craft); the RA 10173 reference anchor + the declared-thin gap carry the cell", kernel: "litigation AVOIDANCE" },
  // credit — three Wave E honest reds
  { career: "credit", skill: "Interviewing applicants for personal, mortgage, student and business loans", reason: "no taught self-serve page teaches the applicant conversation craft", kernel: "applicant conversation craft" },
  { career: "credit", skill: "Confer with underwriters to resolve mortgage application problems / submit applications to credit analysts", reason: "best candidates are member-gated or process-overview pages that don't teach the liaison conversation", kernel: "liaison conversation" },
  { career: "credit", skill: "Sizing the credit portfolio (delinquent-account reports)", reason: "delinquency-report craft; template vendors and paid LMS only (the §6.1-class thin line rides the gap row as history)", kernel: "delinquency-report craft" },
  // teller — three Wave E honest reds
  { career: "teller", skill: "Resolve problems or discrepancies concerning customers' accounts", reason: "no taught self-serve page teaches the discrepancy loop; bank-LMS platforms are member-gated or paid", kernel: "discrepancy loop" },
  { career: "teller", skill: "Receive mortgage, loan, or public utility bill payments, verifying payment dates and amounts due / process term deposits and other savings-plan transactions", reason: "statute-anchored counter paperwork; the SSS placeholder keeps the start-here flag (bank-LMS candidates member-gated or paid)", kernel: "statutory counter paperwork" },
  { career: "teller", skill: "Explain, promote, or sell products or services, such as travelers' checks, savings bonds, money orders, and cashier's checks, using computerized information about customers to tailor recommendations", reason: "the cross-sell cell — product-referral craft; paid bank-LMS modules only (study.com stays ruled-strip)", kernel: "product-referral craft" },
  // audit — two Wave E honest reds
  { career: "audit", skill: "Inspect cash on hand, notes receivable and payable, negotiable securities, and canceled checks to confirm records are accurate", reason: "no taught self-serve page teaches the physical-inspection craft (cash/negotiables/canceled-check inspection); the UIUC modules print no counting/inspection lesson", kernel: "canceled-check inspection" },
  { career: "audit", skill: "Compliance / tax analog & frameworks", reason: "statute-anchored; PTA serves BIR personnel/bespoke cohorts, not a free self-serve taught page; the DOLE handbook keeps the readable statutory-benefit baseline", kernel: "BIR personnel/bespoke cohorts" },
  // clerk
  { career: "clerk", skill: "Recording issue of equipment to staff", reason: "search landed template vendors and checklist downloads only — no taught self-serve page teaches the recording act; the declared resourceless-thin row stands", kernel: "template vendors and checklist" },
  // desk
  { career: "desk", skill: "Issuing forms, information kits and brochures", reason: "Alison's Office Procedures prints no form/brochure distribution lesson; nothing else free-and-self-serve teaches the counter's document-service act; adviser-only", kernel: "distribution lesson" },
  // execsec — two Wave E honest reds
  { career: "execsec", skill: "Administrative policy setup & interpretation", reason: "the open field prints office-procedures-manual templates and guide PDFs (firm-form templates, not taught pages) — no course teaching the explain/write-the-rules craft; adviser-owned", kernel: "firm-form templates" },
  { career: "execsec", skill: "Representing executives / meeting on their behalf", reason: "the closest taught pages (EA-skills, minute-taking) cover scheduling/minutes, never the attend-for-the-executive-and-report-back duty; adviser-owned", kernel: "attend-for-the-executive" },
];

/* ── data truth — the fixture comments are the source of the registry ── */

const fixtureSrc = readFileSync(
  join(process.cwd(), "lib", "fixtures", "resources.ts"),
  "utf8"
);

/** career section spans, by the fixture's `── <id> (` / `… id <id>)` header lines */
const headerRe = /── *(?:.*? id ([a-z]+)\)|([a-z]+) \()/;
function sectionText(careerId: string): string {
  const lines = fixtureSrc.split("\n");
  const headers: { career: string; idx: number }[] = [];
  lines.forEach((l, i) => {
    const m = l.match(headerRe);
    if (m && l.includes("──")) headers.push({ career: m[1] ?? m[2], idx: i });
  });
  const start = headers.find((h) => h.career === careerId)?.idx;
  if (start === undefined) return "";
  const next = headers.find((h) => h.idx > start)!.idx;
  // strip the `//` comment prefixes so line-wrapped phrases read contiguously
  return lines
    .slice(start, next)
    .map((l) => l.replace(/^\s*\/\/ ?/, ""))
    .join(" ");
}

describe("coverage gate — every career × skill has a vetted taught suggestion", () => {
  for (const career of CAREERS) {
    it(`${career.id} (${career.name}) — work queue empty`, () => {
      const failures: Failure[] = [];
      const adjudicated: string[] = [];
      for (const s of career.skills) {
        const reason = auditOne(career.id, s.name);
        if (!reason) continue; // vetted — passes
        const entry = ADJUDICATED.find(
          (e) => e.career === career.id && e.skill === s.name
        );
        if (entry) {
          adjudicated.push(
            `[coverage] ${career.id}: ${s.name} — adjudicated: ${entry.reason}`
          );
        } else {
          failures.push({ career: career.id, skill: s.name, reason });
        }
      }
      const counts = career.skills.length - failures.length - adjudicated.length;
      console.log(
        `[coverage] ${career.id}: ${counts}/${career.skills.length} vetted · ${adjudicated.length} adjudicated` +
          (failures.length ? "\n  " + failures.map((f) => `${f.reason}: ${f.skill}`).join("\n  ") : "")
      );
      for (const note of adjudicated) console.log(note);
      if (failures.length > 0) console.table(failures);
      expect(failures).toEqual([]);
    });
  }
});

describe("adjudication registry — data truth (fixture comments are the source)", () => {
  it("every registry entry is a currently-red cell marked `adjudicated Wave E` in its career section (never a stale pass)", () => {
    const sourceCells = new Set<string>();
    for (const career of CAREERS) {
      for (const s of career.skills) {
        if (auditOne(career.id, s.name))
          sourceCells.add(`${career.id}::${s.name}`);
      }
    }
    const registryIds = new Set(ADJUDICATED.map((e) => `${e.career}::${e.skill}`));
    // a registry entry that has BECOME vetted is stale — drop it from the literal
    const stale = [...registryIds].filter((id) => !sourceCells.has(id));
    expect(stale, "stale registry entries (cell now vetted — remove from the literal)").toEqual([]);
  });

  it("the fixture comment for each registry row exists: `adjudicated Wave E` + the kernel line ride the career's section", () => {
    for (const e of ADJUDICATED) {
      const section = sectionText(e.career);
      expect(section, `${e.career}: section header not found in the fixture`).not.toBe("");
      expect(section, `${e.career}::${e.skill}: section lacks the Wave E adjudication marker`).toContain("adjudicated Wave E");
      expect(section, `${e.career}::${e.skill}: section lacks the kernel carrying the recorded reason`).toContain(e.kernel);
    }
  });

  it("registry size rides the data (printed for the audit trail)", () => {
    console.log(`[coverage] registry ${ADJUDICATED.length} adjudicated cells (Wave E 2026-11-04 close-out)`);
    expect(ADJUDICATED.length).toBeGreaterThan(0);
  });
});
