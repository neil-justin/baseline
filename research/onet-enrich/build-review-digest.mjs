/**
 * build-review-digest.mjs — resolves the Stage A diff for user ruling.
 * OURS strings ← lib/fixtures corpus; SERVED strings ← pulls/*tasks*.json.
 * Evidence helper only (research/onet-enrich/).
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const here = path.join(ROOT, "research/onet-enrich");
const read = (p) => fs.readFileSync(p, "utf8");
const unquote = (s) => String(s).replace(/^[“"'`]+/, "").replace(/[”"'`]+$/, "").trim();
const norm = (s) => String(s).replace(/[“”]/g, '"').replace(/[’]/g, "'").replace(/\\+'/g, "'").replace(/\s+/g, " ").trim();

// ---------- OURS corpus ----------
const fixturePaths = [];
const rowspecDir = path.join(ROOT, "lib/fixtures/rowspec");
if (fs.existsSync(rowspecDir)) for (const f of fs.readdirSync(rowspecDir)) if (f.endsWith(".ts")) fixturePaths.push(path.join(rowspecDir, f));
for (const f of ["rowspec.ts", "catalog.ts"]) { const p = path.join(ROOT, "lib/fixtures", f); if (fs.existsSync(p)) fixturePaths.push(p); }
let corpus = "";
for (const f of fixturePaths) corpus += read(f) + "\n";
console.log("corpus files:", fixturePaths.length, "bytes:", corpus.length);

function resolveOurs(cellText) {
  const probe = unquote(cellText).split("…")[0].slice(0, 28);
  if (probe.length < 15) return null;
  const i = corpus.indexOf(probe);
  if (i < 0) return null;
  const seg = corpus.slice(i);
  let end = seg.length;
  for (const ch of ["”", '\\"', '"', "\n"]) {
    const k = seg.indexOf(ch);
    if (k >= 0 && k < end) end = k;
  }
  return norm(seg.slice(0, end));
}

// ---------- SERVED caches ----------
const pullsDir = path.join(here, "pulls");
const servedByCode = {};
for (const f of fs.readdirSync(pullsDir)) {
  if (!f.endsWith(".json") || !/tasks/.test(f)) continue;
  const code = (f.match(/(\d{2}-\d{4}\.00)/) || [])[1];
  if (!code) continue;
  const urlFile = path.join(pullsDir, f.replace(/\.json$/, ".url.txt"));
  if (fs.existsSync(urlFile) && !read(urlFile).includes("details/tasks")) continue;
  let j; try { j = JSON.parse(read(path.join(pullsDir, f))); } catch { continue; }
  const strings = [];
  (function walk(x) { if (typeof x === "string") strings.push(x); else if (Array.isArray(x)) x.forEach(walk); else if (x && typeof x === "object") Object.values(x).forEach(walk); })(j);
  for (const s of strings) {
    const t = norm(s);
    if (t.length >= 25 && /^[A-Z]/.test(t)) (servedByCode[code] ||= []).push(t);
  }
}
console.log("served caches:", JSON.stringify(Object.fromEntries(Object.entries(servedByCode).map(([c, a]) => [c, a.length]))));

function resolveServed(code, excerpt) {
  const probe = unquote(excerpt).split("…")[0].slice(0, 30);
  if (probe.length < 15) return null;
  const list = servedByCode[code] || [];
  return list.find((t) => t.startsWith(probe)) || list.find((t) => t.includes(probe)) || null;
}

// ---------- walk the log ----------
const log = read(path.join(here, "diff-log.md")).split("\n");
let track = null, anchor = null;
const differs = [], titles = [];
for (const line of log) {
  const tr = line.match(/^Track ([a-z]{1,15}) · /); if (tr) { track = tr[1]; continue; }
  const ah = line.match(/^### anchor ([\d.]+-[\d.]+) /); if (ah) { anchor = ah[1]; continue; }
  const tl = line.match(/^- Title: catalog “(.+?)” vs O\*NET “(.+?)” — \*\*(MATCH|DIFFERS)\*\*/);
  if (tl) { titles.push({ track, ours: tl[1], served: tl[2], status: tl[3] }); continue; }
  if (!line.startsWith("|") || !/\| DIFFERS \|/.test(line)) continue;
  const cells = line.split("|").slice(1, -1).map((c) => c.trim());
  if (cells.length < 4) continue;
  const nearExcerpt = (cells[3].match(/nearest “(.+)”/) || [])[1] || "";
  differs.push({
    track, anchor,
    rowName: cells[0], oursSpan: cells[1],
    nearest: nearExcerpt,
    overlap: Number((cells[3].match(/overlap (\d+)%/) || [])[1]) || null,
    printed: /declares “task as printed”/.test(cells[1]),
  });
}

// ---------- resolve + neutral defaults ----------
const PH = /PSF|PSOC|TESDA|NACE/;
for (const d of differs) {
  const printed = d.printed ? d.rowName.replace(/\((core|secondary)\/[^)]+\)$/, "") : d.oursSpan;
  const full = resolveOurs(printed);
  const tag = (d.rowName.match(/\((core|secondary)\/([^)]+)\)$/) || [])[2] || "O*NET";
  d.tag = tag;
  d.oursFull = full || "(log cell, not fixture-resolved) " + unquote(printed);
  d.resolved = Boolean(full);
  d.servedFull = resolveServed(d.anchor, d.nearest) || "(served excerpt as logged) " + unquote(d.nearest);
  d.servedResolved = Boolean(d.servedFull && !d.servedFull.startsWith("(served"));
  d.default = PH.test(tag)
    ? `KEEP our printed span (row source is ${tag} — outside the O*NET pin)`
    : "ADOPT the served O*NET 31.0 wording verbatim (provenance follows the pin)";
}

// ---------- emit ----------
const L = [];
L.push("# Stage A review digest — O*NET 31.0 enrich · USER RULING FORM (2026-11-02)");
L.push("");
L.push("_Companion to diff-log.md; not a recommendation sheet. Both sides VERBATIM, resolved from lib/fixtures and research/onet-enrich/pulls (never the ellipsized log cells). Defaults are neutral starting points; override any row._");
L.push("");
L.push("Pin: **O*NET DB 31.0 · api_version 2.0.0 · O*NET-SOC 2019** (captured from the API's /about/; ruled by user 2026-11-02).");
L.push("");
L.push("## 1 · No ruling needed (state closed)");
L.push("- **231 claim-spans MATCH** the served snapshot exactly — provenance healthy.");
L.push("- **15 PH-anchored tracks** (PSF/TESDA/PSOC/NACE rows): NO-OUR-ROW by design (ADR 0005 layering).");
L.push("- **fin (13-2051.00):** skills + work-activities serve `total: 0` API-side — recorded honourfully empty, nothing substituted (26 tasks / 27 tech categories did serve).");
L.push("- Served `importance undefined` on some 31.0-era task rows — printed as served.");
L.push("");
L.push("## 2 · The 14 DIFFERS claim-spans — RULE ROW BY ROW");
L.push("");
L.push("| ID | track | fixture row (tag) | OURS (fixture print) | SERVED 31.0 (nearest match) | overlap | default |");
L.push("|---|---|---|---|---|---|---|");
differs.forEach((d, i) => {
  const row = unquote(d.rowName.replace(/\((core|secondary)\/[^)]+\)$/, ""));
  const esc = (s) => s.replace(/\|/g, "¦");
  L.push(`| D${i + 1} | ${d.track} | ${esc(row)} (${d.tag}) | ${esc(d.oursFull)} | ${esc(d.servedFull)} | ${d.overlap ?? "—"}% | ${d.default} |`);
});
L.push("");
L.push("Reply pattern: `D3: adopt · D7: keep ours` — or `defaults + exceptions`.");
L.push("");
L.push("## 3 · Track titles — DIFFERS by blessed design");
L.push(`**${titles.filter((t) => t.status === "MATCH").length} MATCH / ${titles.filter((t) => t.status === "DIFFERS").length} DIFFERS.** The DIFFERS set is the display-label layer (display-pairing ruling: the catalog prints the PH-familiar label; O*NET's formal title stays the citation anchor). Default: **NO ACTION**.`);
L.push("");
const titleDiffers = titles.filter((t) => t.status === "DIFFERS");
L.push("| # | track | catalog display | O*NET 31.0 formal |");
L.push("|---|---|---|---|");
titleDiffers.forEach((t, i) => L.push(`| ${i + 1} | ${t.track} | ${t.ours} | ${t.served} |`));
L.push("");
L.push("## 4 · audit Row-11 tech-names row — the headline bless");
L.push("The awaited pin is resolved as evidence: **O*NET 31.0 serves 37 technology categories for 13-2011.00 (Accountants and Auditors)** with served example tools per category — full verbatim served table recorded in diff-log.md §30. Shape options:");
L.push("");
L.push("- **4A** — Row-11 carries the served categories + served example tools, cited `O*NET 31.0 · Technology Skills · 13-2011.00` (the API's Software-Skills source row there: Employer Job Postings, 2026).");
L.push("- **4B** — curated subset (you pick categories) for a lighter row.");
L.push("- **4C** — defer Row-11 to post-defense.");
L.push("");
L.push("## 5 · The other 20 PRESENT-ONLY-IN-ONET tech blocks");
L.push("Every anchor-bearing track's served category list is recorded in its diff-log section (qa 68 · webdev 52 · soc 59 · opsanalyst 59 · purch 20 · events 21 · book 28 · acctclerk 28 · fas 28 · pay 15 · fin 27 · treasury 10 · coll 18 · credit 18 · teller 10 · audit 37 · adminassoc 48 · clerk 24 · encode 13 · execsec 32 · records 18). Default: **audit Row-11 only now (§4); the other 20 post-defense** unless you bless a subset today.");
L.push("");
L.push("## 6 · After your rulings");
L.push("Stage B = a code agent applies ONLY blessed deltas, then regenerates + gates (tsc / build / verify:fixtures / e2e), then ONE commit. Un-blessed things stay printed as-is; nothing moves silently.");
L.push("");
fs.writeFileSync(path.join(here, "review-digest-2026-11-02.md"), L.join("\n"));
console.log("digest written · differs:", differs.length, "(expect 14) · ours resolved:", differs.filter((d) => d.resolved).length + "/14", "· served resolved:", differs.filter((d) => d.servedResolved).length + "/14", "· titles:", titles.length, `(${titleDiffers.length} DIFFERS)`);
