/**
 * O*NET Web Services v2 — all-anchor offline snapshot pull (ADR 0004/0005
 * Model C extraction-time evidence; no app code touched).
 *
 * Discipline:
 *  - ONET_API_KEY loaded from .env.local via fs; sent ONLY as the X-API-Key
 *    header; never printed, logged, or written anywhere.
 *  - Raw response bytes stored UNEDITED in pulls/<file>.
 *  - Every request's exact URL burned into a sibling .url.txt (URL only).
 *  - Polite throttle 500 ms between requests; ONE retry with backoff on
 *    429/5xx only; 4xx (404 etc.) recorded as-is (gap evidence).
 *  - Receipts: URL, status, byte count, elapsed ms, attempts.
 */
import fs from "node:fs";
import path from "node:path";

const OUT = "research/onet-enrich";
const PULLS = `${OUT}/pulls`;
const API_BASE = "https://api-v2.onetcenter.org/";
const THROTTLE_MS = 500;
const RETRY_BACKOFF_MS = 1500;

/* ── key load (fs parse; value never echoed) ─────────────────────────── */
function loadKey() {
  for (const p of [".env.local", ".env"]) {
    if (!fs.existsSync(p)) continue;
    const line = fs
      .readFileSync(p, "utf8")
      .split(/\r?\n/)
      .find((l) => /^\s*ONET_API_KEY\s*=/.test(l));
    if (line) {
      const k = line.replace(/^\s*ONET_API_KEY\s*=/, "").trim().replace(/^["']|["']$/g, "");
      if (k) return { key: k, from: p };
    }
  }
  console.error("FATAL: ONET_API_KEY not found in .env.local / .env");
  process.exit(1);
}
const KEY = loadKey(); // value held in memory only

/* ── throttle + fetch with one retry on 429/5xx ──────────────────────── */
let lastStart = 0;
async function politeSleep() {
  const wait = THROTTLE_MS - (Date.now() - lastStart);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastStart = Date.now();
}
async function fetchReceipt(url, authed, sinkPath) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    await politeSleep();
    const t0 = Date.now();
    let res, bytes;
    try {
      res = await fetch(url, authed ? { headers: { "X-API-Key": KEY.key } } : {});
      bytes = Buffer.from(await res.arrayBuffer());
    } catch (err) {
      // network fault: treat like 5xx → apply the single retry
      if (attempt === 1) {
        await new Promise((r) => setTimeout(r, RETRY_BACKOFF_MS));
        continue;
      }
      console.log(`  ERR (network): ${url}`);
      return { url, status: "network-error", bytes: 0, ms: Date.now() - t0, attempts: attempt, file: path.basename(sinkPath), error: String(err) };
    }
    if (res.status === 429 || res.status >= 500) {
      if (attempt === 1) {
        await new Promise((r) => setTimeout(r, RETRY_BACKOFF_MS));
        continue;
      }
    }
    return { url, status: res.status, bytes: bytes.length, ms: Date.now() - t0, attempts: attempt, contentType: res.headers.get("content-type") ?? null, bytesBuf: bytes };
  }
}

function save(url, receipt, file) {
  fs.mkdirSync(path.dirname(sinkFileName(file)), { recursive: true });
  fs.writeFileSync(`${PULLS}/${file}.url.txt`, url + "\n", "utf8");
  if (receipt.bytesBuf && receipt.status >= 200 && receipt.status < 300) {
    fs.writeFileSync(`${PULLS}/${file}.json`, receipt.bytesBuf); // UNEDITED
  } else if (receipt.bytesBuf && receipt.bytesBuf.length > 0) {
    fs.writeFileSync(`${PULLS}/${file}.http${receipt.status}.txt`, receipt.bytesBuf); // raw error body evidence
  }
  return { url: receipt.url, status: receipt.status, bytes: receipt.bytes, ms: receipt.ms, attempts: receipt.attempts, file: `${file}.json` };
}
function sinkFileName(file) {
  return `${PULLS}/${file}.json`;
}

/* ── the derived anchor inventory (extracted from lib/fixtures) ──────── */
// code → { roleIds, fixtureSources } — provenance-keyed anchors from
// lib/fixtures/catalog.ts + lib/fixtures/rowspec/*.ts (see diff-log.md §0
// for the exact per-row provenance).
const ANCHORS = [
  // Computer & IT
  { code: "15-1253.00", roles: ["qa"], sources: ["rowspec/it.ts (qa corroboration rows)"] },
  { code: "15-1254.00", roles: ["webdev"], sources: ["catalog.ts webdev demandBlock note", "rowspec/it.ts webdev rows"] },
  { code: "15-1212.00", roles: ["soc"], sources: ["rowspec/it.ts soc rows (attributed O*NET anchors)", "catalog.ts soc demandBlock note"] },
  // Business & Management
  { code: "13-1111.00", roles: ["opsanalyst"], sources: ["catalog.ts opsanalyst demandBlock note", "rowspec/business.ts opsanalyst rows"] },
  { code: "13-1023.00", roles: ["purch"], sources: ["rowspec/business.ts purch rows"] },
  { code: "13-1121.00", roles: ["events"], sources: ["catalog.ts events demandBlock note", "rowspec/business.ts events rows"] },
  // Accounting & Finance
  { code: "43-3031.00", roles: ["book", "acctclerk", "fas"], sources: ["rowspec/accounting.ts (book corroboration; acctclerk primary; fas corroboration block)"] },
  { code: "43-3051.00", roles: ["pay"], sources: ["catalog.ts pay demandBlock note", "rowspec/accounting.ts pay rows"] },
  { code: "13-2051.00", roles: ["fin"], sources: ["catalog.ts fin demandBlock note", "rowspec/accounting.ts fin rows"] },
  { code: "43-3071.00", roles: ["teller", "treasury"], sources: ["rowspec/accounting.ts (teller primary; treasury hybrid)"] },
  { code: "43-3011.00", roles: ["coll"], sources: ["catalog.ts coll demandBlock note", "rowspec/accounting.ts coll rows"] },
  { code: "13-2072.00", roles: ["credit"], sources: ["rowspec/accounting.ts credit rows"] },
  { code: "13-2011.00", roles: ["audit"], sources: ["catalog.ts audit demandBlock note", "rowspec/accounting.ts audit rows"] },
  // Office & Administration
  { code: "43-6014.00", roles: ["adminassoc"], sources: ["rowspec/office.ts adminassoc rows", "catalog.ts adminassoc demandBlock note"] },
  { code: "43-9061.00", roles: ["clerk"], sources: ["rowspec/office.ts clerk rows"] },
  { code: "43-9021.00", roles: ["encode"], sources: ["catalog.ts encode demandBlock note", "rowspec/office.ts encode rows"] },
  { code: "43-6011.00", roles: ["execsec"], sources: ["catalog.ts execsec demandBlock note", "rowspec/office.ts execsec rows"] },
  { code: "43-4171.00", roles: ["records"], sources: ["catalog.ts records demandBlock note", "rowspec/office.ts records rows"] },
];
const NO_CODE_ROLES = ["swd", "ba", "its", "sysadmin", "dba", "cybersec", "digart", "da", "hra", "training", "mkt", "sales", "csr", "ccqa", "desk"];

/* ═══════════════════════ run ═══════════════════════ */
fs.mkdirSync(PULLS, { recursive: true });
fs.mkdirSync(`${OUT}/evidence`, { recursive: true });
const receipts = [];
const byEndpoint = { about: [], main: [], tech: [], tasks: [], skills: [] };

// 0) /about/ — the info resource (version capture point)
console.log("== /about/ (info resource)");
let r = await fetchReceipt(API_BASE + "about/", true);
byEndpoint.about.push(save(API_BASE + "about/", r, "about"));
console.log("   /about/", r.status, r.bytes + "B");

// 1) per-code pulls
for (const a of ANCHORS) {
  console.log(`== ${a.code} (${a.roles.join(" + ")})`);
  const main = await fetchReceipt(`${API_BASE}online/occupations/${a.code}`, true);
  byEndpoint.main.push(save(`${API_BASE}online/occupations/${a.code}`, main, a.code));
  console.log("   main", main.status, main.bytes + "B");

  const tech = await fetchReceipt(`${API_BASE}online/occupations/${a.code}/details/technology_skills`, true);
  byEndpoint.tech.push(save(`${API_BASE}online/occupations/${a.code}/details/technology_skills`, tech, `${a.code}.tech-skills`));
  console.log("   tech", tech.status, tech.bytes + "B");

  const tasks = await fetchReceipt(`${API_BASE}online/occupations/${a.code}/details/tasks`, true);
  byEndpoint.tasks.push(save(`${API_BASE}online/occupations/${a.code}/details/tasks`, tasks, `${a.code}.tasks`));
  console.log("   tasks", tasks.status, tasks.bytes + "B");

  const skills = await fetchReceipt(`${API_BASE}online/occupations/${a.code}/details/skills`, true);
  byEndpoint.skills.push(save(`${API_BASE}online/occupations/${a.code}/details/skills`, skills, `${a.code}.skills`));
  console.log("   skills", skills.status, skills.bytes + "B");
}

/* ── version strings captured from API responses ────────────────────── */
let captured = { api_version: null, database: null, database_name_raw: null, taxonomy_name_raw: null };
try {
  const about = JSON.parse(fs.readFileSync(`${PULLS}/about.json`, "utf8"));
  captured.api_version = about.api_version ?? null;
  captured.database = about.database ?? null;
  captured.database_name_raw = about.database?.name ?? null;
  captured.taxonomy_name_raw = about.taxonomy?.name ?? null;
} catch {
  console.error("note: /about/ payload not readable JSON; version capture failed");
}

/* ── per-code title/updated extraction (direct from saved payloads) ──── */
const perCode = {};
for (const a of ANCHORS) {
  perCode[a.code] = { roles: a.roles, sources: a.sources, pulls: {} };
  try {
    const j = JSON.parse(fs.readFileSync(`${PULLS}/${a.code}.json`, "utf8"));
    perCode[a.code].title = j.title ?? null;
    perCode[a.code].description_len = typeof j.description === "string" ? j.description.length : null;
    perCode[a.code].sample_of_reported_titles = j.sample_of_reported_titles ?? null;
    perCode[a.code].updated = j.updated ?? null;
  } catch {
    perCode[a.code].title = null;
  }
}

/* ── manifest ────────────────────────────────────────────────────────── */
const manifest = {
  generated_utc: new Date().toISOString(),
  pull_id: "onet-enrich-extraction-2026-11-02",
  api_base: API_BASE,
  api_version_field: captured.api_version,
  onet_database_name: captured.database_name_raw,
  onet_database_object: captured.database,
  taxonomy_name: captured.taxonomy_name_raw,
  version_capture_source: "GET /about/ (v2 info resource) — verbatim response fields",
  fixture_derivation: {
    tracks_total: 36,
    source_files: [
      "lib/fixtures/catalog.ts",
      "lib/fixtures/rowspec.ts",
      "lib/fixtures/rowspec/it.ts",
      "lib/fixtures/rowspec/business.ts",
      "lib/fixtures/rowspec/accounting.ts",
      "lib/fixtures/rowspec/office.ts",
    ],
    distinct_onet_codes: ANCHORS.length,
    codes: ANCHORS.map((a) => a.code),
    code_to_roles: perCode,
    roles_with_no_onet_code_recorded: NO_CODE_ROLES,
    no_code_note:
      "Extraction fact: 15 of the 36 tracks carry NO provenance-keyed O*NET-SOC anchor in lib/fixtures (their skill rows are [PSF]/[TESDA]/[PSOC]/[NACE]-sourced). No code was guessed or substituted for them; no O*NET pull exists for them.",
  },
  endpoints: Object.fromEntries(Object.entries(byEndpoint).map(([k, arr]) => [k, arr])),
  totals: (() => {
    const all = [].concat(...Object.values(byEndpoint));
    return {
      requests: all.length,
      status_200: all.filter((x) => x.status === 200).length,
      status_other: all.filter((x) => x.status !== 200).map((x) => `${x.status}:${x.file}`),
      bytes_total: all.reduce((n, x) => n + x.bytes, 0),
    };
  })(),
  discipline: {
    key_handling: "ONET_API_KEY read from .env.local by fs inside pull.mjs; sent only as X-API-Key header; never printed or written",
    raw_files_unedited: true,
    url_files: "every request URL burned into sibling .url.txt (URL only)",
    throttle_ms: THROTTLE_MS,
    retry_policy: "one retry with 1500ms backoff, 429/5xx only",
  },
};
fs.writeFileSync(`${OUT}/manifest.json`, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log("\nwrote manifest.json —", manifest.totals.requests, "requests,", manifest.totals.status_200, "OK,", JSON.stringify(manifest.totals.status_other));
console.log("captured api_version:", captured.api_version);
console.log("captured O*NET database name:", captured.database_name_raw);
