import type { Resource } from "@/lib/types";

/**
 * Resource catalog — single typed catalog (schema: features.md §6.8).
 * Demo-slice subset; expands per the m5 content plan (price tier free|₱,
 * typed course/cert/NC/doc) — the money-shot resource is canon-locked:
 * "Build your first dashboard" — Microsoft Learn, Power BI, free.
 */
export const RESOURCES: Resource[] = [
  // --- Software Developer ---
  {
    id: "res-python-basics",
    title: "Python basics course",
    provider: "Coursera",
    type: "course",
    cost: "free",
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
    durationHours: 6,
    skillsAddressed: ["SQL"],
    careerId: "da",
  },
  {
    id: "res-da-sheets-doc",
    title: "Cleaning up messy sheets",
    provider: "Google — Applied Digital Skills",
    type: "doc",
    cost: "free",
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
    durationHours: 8,
    skillsAddressed: ["Chart interpretation"],
    creditingBody: "Google",
    careerId: "da",
  },
  {
    id: "res-da-report-doc",
    title: "Data storytelling quick guide",
    provider: "Google — Teaching materials",
    type: "doc",
    cost: "free",
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
