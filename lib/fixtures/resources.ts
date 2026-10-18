import type { Resource } from "@/lib/types";

/**
 * Resource catalog — single typed catalog (schema: features.md §6.8).
 * Demo-slice subset; expands per the m5 content plan (price tier free|₱,
 * typed course/cert/NC/doc) — the money-shot resource is canon-locked:
 * "Build your first dashboard" — Microsoft Learn, Power BI, free.
 * Every row's `url` was checked live (Oct 2026) and points at the real,
 * still-existing page; TESDA's TOP moved off elearn.tesda.gov.ph (dead) to
 * e-tesda.gov.ph, and Google's Applied Digital Skills lesson pages are gone.
 */
export const RESOURCES: Resource[] = [
  // --- Software Developer ---
  {
    id: "res-python-basics",
    title: "Python basics course",
    provider: "Coursera",
    type: "course",
    cost: "free",
    // "Programming for Everybody (Getting Started with Python)" — UMich, free to audit
    url: "https://www.coursera.org/learn/python",
    durationHours: 25,
    skillsAddressed: ["Programming logic (Python/Java)"],
    careerId: "swd",
  },
  {
    id: "res-swd-git-doc",
    title: "Git handbook",
    provider: "Atlassian",
    type: "doc",
    cost: "free",
    url: "https://www.atlassian.com/git/tutorials/what-is-version-control",
    durationHours: 2,
    skillsAddressed: ["Git (version control)"],
    careerId: "swd",
  },
  // --- Data Analyst ---
  {
    id: "res-powerbi-dashboards",
    title: "Build your first dashboard",
    provider: "Microsoft Learn — Power BI",
    type: "doc",
    cost: "free",
    // Learn's beginner tutorial: connect to data, create a report + dashboard
    url: "https://learn.microsoft.com/en-us/power-bi/fundamentals/service-get-started",
    durationHours: 4,
    skillsAddressed: ["Dashboards (Power BI)"],
    careerId: "da",
  },
  {
    id: "res-da-course-sql",
    title: "Intro to SQL for data analysis",
    provider: "Khan Academy",
    type: "course",
    cost: "free",
    url: "https://www.khanacademy.org/computing/computer-programming/sql",
    durationHours: 6,
    skillsAddressed: ["SQL"],
    careerId: "da",
  },
  {
    id: "res-da-sheets-doc",
    title: "Cleaning up messy sheets",
    provider: "Google Workspace Learning Center",
    type: "doc",
    cost: "free",
    // Google's own "format & clean up data" docs (the old Applied Digital
    // Skills lesson pages are gone — ADFS curriculum moved into Skillshop)
    url: "https://support.google.com/a/users/topic/9976025?hl=en",
    durationHours: 2,
    skillsAddressed: ["Data cleaning"],
    careerId: "da",
  },
  {
    id: "res-da-stats-course",
    title: "Khan Academy — Statistics basics",
    provider: "Khan Academy",
    type: "course",
    cost: "free",
    url: "https://www.khanacademy.org/math/statistics-probability",
    durationHours: 5,
    skillsAddressed: ["Basic statistics"],
    careerId: "da",
  },
  {
    id: "res-da-ga4-cert",
    title: "Google Analytics 4 certification",
    provider: "Google Skillshop",
    type: "cert",
    cost: "free",
    // Google Analytics Certification course (official Skillshop link, per
    // support.google.com/analytics/answer/15068052)
    url: "https://skillshop.docebosaas.com/learn/courses/14810/google-analytics-certification",
    durationHours: 8,
    skillsAddressed: ["Chart interpretation"],
    creditingBody: "Google",
    careerId: "da",
  },
  {
    id: "res-da-report-doc",
    title: "Data storytelling quick guide",
    provider: "Coursera",
    type: "doc",
    cost: "free",
    // prototype canon: "Data Storytelling — Coursera · free to audit" (course
    // listing lives behind Coursera's catalog search; no stable course slug)
    url: "https://www.coursera.org/search?query=data%20storytelling",
    durationHours: 2,
    skillsAddressed: ["Report writing"],
    careerId: "da",
  },
  // --- IT Support Technician (card 3 slice) ---
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
    skillsAddressed: ["OS install/config", "Hardware troubleshooting"],
    creditingBody: "TESDA",
    countsTowardEntryPath: true,
    careerId: "its",
  },
];

export function getResourcesForCareer(careerId: string): Resource[] {
  return RESOURCES.filter((r) => r.careerId === careerId);
}
