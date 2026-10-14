import type { Career, Resource, CheckQuestion } from "@/lib/types";

/**
 * Fixture catalog — tracer slice: the two demo careers + IT Support (RIASEC
 * card 3). Full 32-career catalog (from `features/content/_catalog-extract.md`)
 * expands behind the same signature before the career/pathway agents land.
 */

export const SOFTWARE_DEVELOPER: Career = {
  id: "swd",
  name: "Software Developer",
  strands: ["STEM"],
  raCode: "IAC",
  roleSummary: "Writes and improves the programs behind apps, websites, and systems.",
  entryPath: "BS Computer Science / IT / IS — or TVL-ICT NC II + a bootcamp.",
  route: "degree",
  watch: true,
  skills: [
    { name: "Programming logic (Python/Java)", tier: "core", what: "writing steps a computer follows" },
    { name: "SQL", tier: "core", what: "asking questions of a database" },
    { name: "Git (version control)", tier: "secondary", what: "tracking changes to your code so you can undo mistakes" },
    { name: "Debugging", tier: "secondary", what: "finding and fixing what's broken" },
    { name: "API basics", tier: "secondary", what: "how apps talk to each other" },
    { name: "Unit testing", tier: "secondary", what: "small automated checks that catch bugs early" },
    { name: "Agile teamwork", tier: "secondary", what: "building in small pieces with a team" },
    { name: "Technical documentation", tier: "secondary", what: "writing down how your code works" },
  ],
};

export const DATA_ANALYST: Career = {
  id: "da",
  name: "Data Analyst",
  strands: ["STEM", "ABM"],
  raCode: "ICE",
  roleSummary: "Turns raw data into charts and findings people can act on.",
  entryPath: "BS Statistics, Math, or CS — or an analytics bootcamps route.",
  route: "degree",
  watch: true,
  skills: [
    { name: "Spreadsheets", tier: "core", what: "organizing and computing in sheets" },
    { name: "SQL", tier: "core", what: "asking questions of a database" },
    { name: "Data cleaning", tier: "core", what: "fixing messy columns so numbers can be trusted" },
    { name: "Dashboards (Power BI)", tier: "secondary", what: "turning finished analysis into one readable screen" },
    { name: "Basic statistics", tier: "secondary", what: "reading averages, spread, and what they mean" },
    { name: "Chart interpretation", tier: "secondary", what: "reading what a chart actually says" },
    { name: "Report writing", tier: "secondary", what: "writing findings people can act on" },
  ],
};

export const IT_SUPPORT_TECHNICIAN: Career = {
  id: "its",
  name: "IT Support Technician",
  strands: ["TVL"],
  raCode: "RCI",
  roleSummary: "Installs and fixes computers and networks.",
  entryPath: "TESDA Computer Systems Servicing NC II.",
  route: "tvl",
  skills: [
    { name: "Computer hardware", tier: "core", what: "parts inside a computer and what they do" },
    { name: "OS installation", tier: "core", what: "setting up Windows or Linux on a machine" },
    { name: "Networking basics", tier: "secondary", what: "how devices connect and share data" },
    { name: "Troubleshooting", tier: "secondary", what: "finding why something stopped working" },
    { name: "Customer handling", tier: "secondary", what: "explaining fixes in plain words" },
    { name: "Safety & anti-static handling", tier: "secondary", what: "working on machines without damaging them" },
    { name: "Documentation", tier: "secondary", what: "logging what was fixed and how" },
  ],
};

/** RIASEC demo top-3 (features.md §8 fixture req ①; onboarding cards 1–3) */
export const DEMO_SUGGESTION_ORDER = ["swd", "da", "its"];

export const CAREERS: Career[] = [SOFTWARE_DEVELOPER, DATA_ANALYST, IT_SUPPORT_TECHNICIAN];

export function getCareer(id: string | null): Career | null {
  return CAREERS.find((c) => c.id === id) ?? null;
}

/** Resources — demo-slice subset. Catalog total 32 careers expands later. */
export const RESOURCES: Resource[] = [
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
];

export function getResourcesForCareer(careerId: string): Resource[] {
  return RESOURCES.filter((r) => r.careerId === careerId);
}

/** The money-shot comprehension check: 5 Qs, pass ≥ 4/5 (locked). */
export const DASHBOARDS_CHECK: CheckQuestion[] = [
  {
    stem: "In Power BI, what is a dashboard mainly for?",
    options: [
      "Showing key numbers and charts on one readable screen",
      "Storing raw spreadsheet files",
      "Writing the code that runs the reports",
      "Deleting old data automatically",
    ],
    answer: 0,
  },
  {
    stem: "Which Power BI element is a live visual you place on a page?",
    options: ["A tile", "A cell", "A macro", "A formula bar"],
    answer: 0,
  },
  {
    stem: "Where does Power BI Desktop get its data for a model?",
    options: [
      "From sources you connect (files, databases) into its data model",
      "Only from the internet",
      "From your screen recorder",
      "It types the numbers itself",
    ],
    answer: 0,
  },
  {
    stem: "What does refreshing a dashboard do?",
    options: [
      "Pulls the latest data into the visuals",
      "Deletes all visuals",
      "Changes the fonts",
      "Publishes a new report file",
    ],
    answer: 0,
  },
  {
    stem: "A good dashboard tile is",
    options: [
      "One clear number or chart a manager can read at a glance",
      "Every dataset you own, dumped on one page",
      "A paragraph of small print",
      "A password-protected folder",
    ],
    answer: 0,
  },
];
