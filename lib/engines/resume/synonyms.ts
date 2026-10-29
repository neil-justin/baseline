/**
 * Keyword-alignment synonym seed — round 6a, template-authored (NO LLM calls
 * in this build). The diagnostic matches a role's core-tier skills against the
 * resume text; skills have many real phrasings, so each entry lists harmless
 * synonyms/aliases that count as evidence.
 *
 * TODO(catalog-round): regenerated 2026-10-29 for catalog round 9's college
 * roster (the sweep landed during the resume round). Seeded for the demo trio
 * (DEMO_SUGGESTION_ORDER: swd · da · its) against the verbatim PSF-SDS skill
 * rows ONLY. When the catalog round revises a role's skill rows, these seeds
 * follow them — the engine never changes. Every other role falls back to
 * matching the bare skill name (word-boundary, lowercase).
 */

export interface SynonymSeed {
  /** extra phrases (lowercased) that count as evidence of the skill */
  like: string[];
}

export const SKILL_SYNONYMS: Record<string, SynonymSeed> = {
  // ── Associate Software Developer (swd) — core tier ──────────────────────
  "Applications Development": {
    like: [
      "application development", "app development", "programming", "python", "java",
      "javascript", "typescript", "coding", "php", "c#", "software development",
    ],
  },
  "Applications Support and Enhancement": {
    like: ["support and enhancement", "application support", "maintenance", "extending applications", "troubleshooting", "bug fixes", "fixing bugs", "enhancement requests"],
  },
  "Agile Software Development": {
    like: ["agile", "scrum", "sprint", "standup", "iterative development"],
  },
  "Data Design / SQL + data modeling": {
    like: ["sql", "data modeling", "database design", "mysql", "postgresql", "schema", "database queries", "queries"],
  },
  "Secure-coding practices": {
    like: ["secure coding", "secure-coding", "input validation", "authentication", "access control", "owasp", "security practices"],
  },

  // ── Data Analyst (da) — core tier per current roster ────────────────────
  "Data Analytics": {
    like: ["data analysis", "analytics", "spreadsheets", "excel", "google sheets", "pivot tables", "cleaned data", "data cleaning"],
  },
  "Data Visualization and Storytelling": {
    like: ["data visualization", "dashboards", "power bi", "charts", "dashboard", "tableau", "storytelling"],
  },
  "ETL (extract-transform-load workflows)": {
    like: ["etl", "extract-transform-load", "data pipeline", "data transformation"],
  },

  // ── IT Support Technician (its) — core tier per current roster ─────────
  "Infrastructure Support": {
    like: ["infrastructure", "desktop support", "hardware repair", "hardware troubleshooting", "printer", "pc repair", "computer repair"],
  },
  "Infrastructure Deployment": {
    like: ["deployment", "os installation", "operating system installation", "system setup", "image deployment", "provisioning"],
  },
  "Network Administration and Maintenance": {
    like: ["network administration", "network maintenance", "lan", "directory", "user accounts"],
  },
  "Network Configuration": {
    like: ["network configuration", "network setup", "router", "switch", "cabling", "wifi setup", "network cables", "ip"],
  },
};

/**
 * The per-role synonym lookup: seeded entries for the demo trio, and for any
 * other career the bare skill name itself (the caller lowercases and
 * word-boundary-matches). Never invents — this only widens recognition of
 * what the role's own catalog rows name.
 */
export function synonymsForSkill(skillName: string): SynonymSeed {
  return SKILL_SYNONYMS[skillName] ?? { like: [skillName.toLowerCase()] };
}
