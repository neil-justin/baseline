/**
 * Evidence fetch 2 — completion pass:
 *  1) /details/work_activities for every anchored code (the rowspec baselines
 *     quote O*NET Work Activities).
 *  2) Follow EVERY documented `next` pagination URL for technology_skills,
 *     tasks, and skills until total is covered (raw pages verbatim).
 * Receipts merge into manifest.json. Same discipline as pull.mjs.
 */
import fs from "node:fs";

const OUT = "research/onet-enrich";
const PULLS = `${OUT}/pulls`;
const API_BASE = "https://api-v2.onetcenter.org/";
const THROTTLE_MS = 500;
const RETRY_BACKOFF_MS = 1500;

function loadKey() {
  for (const p of [".env.local", ".env"]) {
    if (!fs.existsSync(p)) continue;
    const line = fs.readFileSync(p, "utf8").split(/\r?\n/).find((l) => /^\s*ONET_API_KEY\s*=/.test(l));
    if (line) {
      const k = line.replace(/^\s*ONET_API_KEY\s*=/, "").trim().replace(/^["']|["']$/g, "");
      if (k) return k;
    }
  }
  console.error("FATAL: ONET_API_KEY not found");
  process.exit(1);
}
const KEY = loadKey();

let lastStart = 0;
async function politeSleep() {
  const wait = THROTTLE_MS - (Date.now() - lastStart);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastStart = Date.now();
}
async function fetchReceipt(url) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    await politeSleep();
    const t0 = Date.now();
    let res, bytes;
    try {
      res = await fetch(url, { headers: { "X-API-Key": KEY } });
      bytes = Buffer.from(await res.arrayBuffer());
    } catch (err) {
      if (attempt === 1) {
        await new Promise((r) => setTimeout(r, RETRY_BACKOFF_MS));
        continue;
      }
      return { url, status: "network-error", bytes: 0, ms: Date.now() - t0, attempts: attempt, error: String(err) };
    }
    if ((res.status === 429 || res.status >= 500) && attempt === 1) {
      await new Promise((r) => setTimeout(r, RETRY_BACKOFF_MS));
      continue;
    }
    return { url, status: res.status, bytes: bytes.length, ms: Date.now() - t0, attempts: attempt, bytesBuf: bytes };
  }
}

function saveR(url, receipt, file) {
  fs.writeFileSync(`${PULLS}/${file}.url.txt`, url + "\n", "utf8");
  if (receipt.bytesBuf) {
    if (receipt.status >= 200 && receipt.status < 300) fs.writeFileSync(`${PULLS}/${file}.json`, receipt.bytesBuf);
    else fs.writeFileSync(`${PULLS}/${file}.http${receipt.status}.txt`, receipt.bytesBuf);
  }
  return { url: receipt.url, status: receipt.status, bytes: receipt.bytes, ms: receipt.ms, attempts: receipt.attempts, file: `${file}.json` };
}

const CODES = JSON.parse(fs.readFileSync(`${OUT}/manifest.json`, "utf8")).fixture_derivation.codes;

const receipts = { work_activities: [], pagination: [] };
const pageIdx = {}; // fam:code → next page index

for (const code of CODES) {
  console.log(`== ${code}`);

  // 1) work_activities (first page)
  let fam = "work-activities";
  let url = `${API_BASE}online/occupations/${code}/details/work_activities`;
  let r = await fetchReceipt(url);
  if (!(r.status >= 200 && r.status < 300)) {
    // 4xx: still record attempt + URL (gap evidence), no retry invented
    receipts.pagination.push(saveR(url, r, `${code}.${fam}`));
    console.log("   work_activities", r.status);
    continue;
  }
  receipts.work_activities.push(saveR(url, r, `${code}.${fam}`));
  let page = JSON.parse(r.bytesBuf.toString("utf8"));
  console.log("   work_activities", r.status);

  let idx = 2;
  while (page && page.next) {
    const nx = await fetchReceipt(page.next);
    if (!(nx.status >= 200 && nx.status < 300)) {
      receipts.pagination.push(saveR(page.next, nx, `${code}.${fam}.p${idx}`));
      console.log("  !! page fetch failed", nx.status, fam, code);
      break;
    }
    receipts.pagination.push(saveR(page.next, nx, `${code}.${fam}.p${idx}`));
    idx++;
    try {
      page = JSON.parse(nx.bytesBuf.toString("utf8"));
    } catch {
      console.error("  !! non-JSON continuation; stopping pagination for", fam, code);
      break;
    }
  }
  // 2) pagination for already-pulled families
  for (const f of ["tech-skills", "tasks", "skills"]) {
    let cur;
    try {
      cur = JSON.parse(fs.readFileSync(`${PULLS}/${code}.${f}.json`, "utf8"));
    } catch {
      receipts.pagination.push({ file: `${code}.${f}.json`, missing_primary: true, note: "first-page file unreadable; pagination not attempted" });
      continue;
    }
    let j = 2;
    while (cur && cur.next) {
      const nx = await fetchReceipt(cur.next);
      if (!(nx.status >= 200 && nx.status < 300)) {
        receipts.pagination.push(saveR(cur.next, nx, `${code}.${f}.p${j}`));
        console.log("  !! page fetch failed", nx.status, f, code);
        break;
      }
      receipts.pagination.push(saveR(cur.next, nx, `${code}.${f}.p${j}`));
      j++;
      try {
        cur = JSON.parse(nx.bytesBuf.toString("utf8"));
      } catch {
        console.error("  !! non-JSON continuation; stopping pagination for", f, code);
        break;
      }
    }
  }
  const fams = ["tech-skills", "tasks", "skills", "work-activities"]
    .map((f) => {
      const pages = fs.readdirSync(PULLS).filter((p) => p.startsWith(`${code}.${f}.p`) && p.endsWith(".json")).length + 1;
      let total = null;
      try {
        total = JSON.parse(fs.readFileSync(`${PULLS}/${code}.${f}.json`, "utf8")).total ?? null;
      } catch {/* error body case */}
      return `${f}:${pages}/${total ?? "?"}`;
    })
    .join(" ");
  console.log("   pages-total:", fams);
}

/* rewrite manifest with pagination receipts merged */
const mpath = `${OUT}/manifest.json`;
const m = JSON.parse(fs.readFileSync(mpath, "utf8"));
m.endpoints.work_activities = receipts.work_activities;
m.endpoints.pagination = receipts.pagination;
const all = [].concat(...Object.values(m.endpoints));
m.completion_pass = {
  script: "research/onet-enrich/paginate.mjs",
  timestamps_utc: new Date().toISOString(),
  work_activities_requests: receipts.work_activities.length,
  pagination_continuations: receipts.pagination.length,
  totals: {
    requests_all_phases: all.length,
    status_200: all.filter((x) => x.status === 200).length,
    status_other: all.filter((x) => x.status !== 200).map((x) => `${x.status}:${x.file}`),
    bytes_total: all.reduce((n, x) => n + x.bytes, 0),
  },
};
fs.writeFileSync(mpath, JSON.stringify(m, null, 2) + "\n", "utf8");
console.log("\nmanifest updated;", m.completion_pass.totals.status_200, "OK /", m.completion_pass.totals.requests_all_phases, "requests;", JSON.stringify(m.completion_pass.totals.status_other));
