import type { Resource } from "@/lib/types";

/**
 * Resource catalog — single typed catalog (schema: features.md §6.8).
 * Catalog round 10 (pool-per-skill convention): COMPLETE free pools are
 * authored for the demo trio's swd map only (roster 2.1, Neil's role); the QA
 * money-shot resource exists because the canon walk needs it; everything else
 * is scaffolded for a later dispatch (~35 more roles pending; see report).
 * Every row was re-checked live (2026-10-29) and points at the real,
 * still-existing page. Khan Academy pages block this environment's bot checks;
 * the row was verified live in the previous round and is marked below.
 */
export const RESOURCES: Resource[] = [
  // --- Associate Software Developer (roster 2.1 · id swd) — COMPLETE pool ---
  {
    id: "res-python-basics",
    title: "Python basics course",
    provider: "Coursera",
    type: "course",
    cost: "free",
    // "Programming for Everybody (Getting Started with Python)" — UMich,
    // free to audit (re-verified live 2026-10-29)
    url: "https://www.coursera.org/learn/python",
    durationHours: 25,
    skillsAddressed: ["Applications Development"],
    careerId: "swd",
  },
  {
    id: "res-swd-sql",
    title: "Intro to SQL for data analysis",
    provider: "Khan Academy",
    type: "course",
    cost: "free",
    // verified live in the prior round; Khan's CDN blocks this session's
    // re-check (anti-bot notice) — flagged for the next URL pass
    url: "https://www.khanacademy.org/computing/computer-programming/sql",
    durationHours: 6,
    skillsAddressed: ["Data Design / SQL + data modeling"],
    careerId: "swd",
  },
  {
    id: "res-swd-support-doc",
    title: "Git handbook",
    provider: "Atlassian",
    type: "doc",
    cost: "free",
    // tracking changes to live applications = the support/enhancement working
    // method (verified live 2026-10-29)
    url: "https://www.atlassian.com/git/tutorials/what-is-version-control",
    durationHours: 2,
    skillsAddressed: ["Applications Support and Enhancement"],
    careerId: "swd",
  },
  {
    id: "res-swd-agile-doc",
    title: "What is Agile? — Agile methodology basics",
    provider: "Atlassian",
    type: "doc",
    cost: "free",
    url: "https://www.atlassian.com/agile",
    durationHours: 2,
    skillsAddressed: ["Agile Software Development"],
    careerId: "swd",
  },
  {
    id: "res-swd-secure-doc",
    title: "OWASP Top 10 — most critical web application security risks",
    provider: "OWASP Foundation",
    type: "doc",
    cost: "free",
    url: "https://owasp.org/www-project-top-ten/",
    durationHours: 4,
    skillsAddressed: ["Secure-coding practices"],
    careerId: "swd",
  },
  {
    id: "res-swd-linux-doc",
    title: "The Linux command line for beginners",
    provider: "Ubuntu tutorials",
    type: "doc",
    cost: "free",
    // canonical multi-step command-line tutorial (~1h); kept at the
    // canonical URL (re-verified live 2026-10-29)
    url: "https://ubuntu.com/tutorials/command-line-for-beginners",
    durationHours: 2,
    skillsAddressed: ["Linux + web deployment basics"],
    careerId: "swd",
  },
  {
    id: "res-swd-bna-course",
    title: "Business analysis fundamentals",
    provider: "Coursera",
    type: "course",
    cost: "free",
    // free-to-audit listing; the catalog surface shows the "Business Analysis
    // & Process Management guided project — free" route from this listing
    // (verified live 2026-10-29; no stable free-course slug)
    url: "https://www.coursera.org/search?query=business%20analysis",
    durationHours: 3,
    skillsAddressed: ["Business Needs Analysis"],
    careerId: "swd",
  },
  {
    id: "res-swd-enable-doc",
    title: "Team Playbook — free teamwork Plays",
    provider: "Atlassian",
    type: "doc",
    cost: "free",
    // "Are Plays free? Yes" (verified live 2026-10-29) — the enabling-skills
    // bundle's PH-relevant practice layer
    url: "https://www.atlassian.com/team-playbook",
    durationHours: 2,
    skillsAddressed: [
      "Collaboration · Communication · Digital Fluency · Learning Agility · Problem Solving · Self Management (Enabling Skills, Basic/Intermediate)",
    ],
    careerId: "swd",
  },
  // --- Software QA Analyst (roster 2.2 · id qa) — canon money-shot row only ---
  {
    id: "res-qa-testing",
    title: "Setting a foundation for successful test automation",
    provider: "Test Automation University",
    type: "course",
    cost: "free",
    // TAU is Applitools' free test-automation academy, certificates included
    // (verified live 2026-10-29)
    url: "https://testautomationu.applitools.com/",
    durationHours: 4,
    skillsAddressed: ["Software Testing"],
    creditingBody: "Test Automation University (Applitools)",
    careerId: "qa",
  },
  {
    id: "res-qa-testing-basics-doc",
    title: "Test Planning basics — writing test scenarios from requirements",
    provider: "Test Automation University",
    type: "doc",
    cost: "free",
    // learning-path listing page (verified live 2026-10-29); scaffolded row
    // for the Test Planning skill
    url: "https://testautomationu.applitools.com/learningpaths.html",
    durationHours: 3,
    skillsAddressed: ["Test Planning"],
    careerId: "qa",
  },
  // --- IT Support Engineer (roster 2.4 · id its) — scaffolded row ---
  {
    id: "res-its-css-nc",
    title: "Computer Systems Servicing NC II — self-paced",
    provider: "TESDA Online Program (TOP)",
    type: "NC",
    cost: "free",
    // TOP moved off elearn.tesda.gov.ph — now Moodle at e-tesda.gov.ph;
    // "Electrical and Electronics / Computer System Servicing NC II" category
    url: "https://e-tesda.gov.ph/course/index.php?categoryid=16",
    durationHours: 12,
    skillsAddressed: ["Infrastructure Deployment"],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "its",
  },
];

export function getResourcesForCareer(careerId: string): Resource[] {
  return RESOURCES.filter((r) => r.careerId === careerId);
}
