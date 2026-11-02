/**
 * Build diff-log.md (v2) — mechanical, factual comparison of pulled O*NET 31.0
 * against catalog/rowspec claims. NO fixes, NO recommendations.
 */
import fs from "node:fs";

const OUT = "research/onet-enrich";
const PULLS = `${OUT}/pulls`;
const MANI = JSON.parse(fs.readFileSync(`${OUT}/manifest.json`, "utf8"));
const CODES = MANI.fixture_derivation.codes;

/* ── normalizer ──────────────────────────────────────────────────────── */
const norm = (s) =>
  String(s)
    .replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, "-").replace(/[…]/g, " ")
    .replace(/\((\d+)\)\s*$/g, "")
    .replace(/\s+/g, " ")
    .replace(/[.,;:"'’]/g, "")
    .toLowerCase()
    .trim();
const wordOverlap = (a, b) => {
  const A = new Set(norm(a).split(/[^a-z0-9]+/).filter(Boolean)), B = new Set(norm(b).split(/[^a-z0-9]+/).filter(Boolean));
  if (!A.size || !B.size) return 0;
  let n = 0; for (const w of A) if (B.has(w)) n++;
  return n / Math.min(A.size, B.size);
};
const unesc = (s) => s.replace(/\\(["'])/g, "$1").replace(/\\n/g, " ").replace(/\\u2026/g, "…");

/* ── aggregate pulled data per code ──────────────────────────────────── */
function readPages(stem) {
  const files = fs.readdirSync(PULLS).filter((f) => f.startsWith(stem) && f.endsWith(".json")).sort();
  let payload = null;
  const chunks = [];
  for (const f of files) {
    try {
      const j = JSON.parse(fs.readFileSync(`${PULLS}/${f}`, "utf8"));
      if (!payload) payload = j;
      if (Array.isArray(j.task)) chunks.push(...j.task);
      else if (Array.isArray(j.element)) chunks.push(...j.element);
      else if (Array.isArray(j.category)) chunks.push(...j.category);
    } catch { /* non-json error bodies skipped */ }
  }
  return { payload, chunks };
}
const dedupeBy = (arr, keyFn) => { const s = new Set(), o = []; for (const x of arr) { const k = keyFn(x); if (!s.has(k)) { s.add(k); o.push(x); } } return o; };

const OCC = {};
for (const code of CODES) {
  const main = JSON.parse(fs.readFileSync(`${PULLS}/${code}.json`, "utf8"));
  const t = readPages(`${code}.tasks`), s = readPages(`${code}.skills`), w = readPages(`${code}.work-activities`), k = readPages(`${code}.tech-skills`);
  OCC[code] = {
    title: main.title ?? null, description: main.description ?? null,
    sampleTitles: main.sample_of_reported_titles ?? [],
    updatedYear: main.updated?.year ?? null,
    updatedSoftwareSkills: (main.updated?.contents ?? []).find((c) => /Software Skills/i.test(c.title ?? "")) ?? null,
    tasks: dedupeBy(t.chunks.filter((x) => x && x.title), (x) => x.id ?? x.title),
    skills: dedupeBy(s.chunks.filter((x) => x && x.name), (x) => x.id ?? x.name),
    wa: dedupeBy(w.chunks.filter((x) => x && x.name), (x) => x.id ?? x.name),
    techCategories: dedupeBy(k.chunks.filter((x) => x && x.title), (x) => x.code ?? x.title),
    totals: { tasks: t.payload?.total ?? null, skills: s.payload?.total ?? null, wa: w.payload?.total ?? null, tech: k.payload?.total ?? null },
  };
}

/* ── parse catalog.ts ────────────────────────────────────────────────── */
const catText = fs.readFileSync("lib/fixtures/catalog.ts", "utf8");
const careers = [];
{
  const body = catText.slice(catText.indexOf("export const CAREERS"), catText.indexOf("export function getCareer"));
  for (const ch of body.split(/\n  \{\n/).slice(1)) {
    const id = (ch.match(/^    id: "([a-z]+)"/m) ?? ch.match(/id: "([a-z]+)"/))?.[1];
    if (!id) continue;
    careers.push({
      id,
      name: ch.match(/\n    name: "((?:\\.|[^"\\])+)",/)?.[1] ? unesc(ch.match(/\n    name: "((?:\\.|[^"\\])+)",/)[1]) : null,
      psocTitle: ch.match(/psocTitle: "((?:\\.|[^"\\])+)",/)?.[1] ? unesc(ch.match(/psocTitle: "((?:\\.|[^"\\])+)",/)[1]) : null,
      psoc: ch.match(/psocCode: "([0-9]+)"/)?.[1],
      track: ch.match(/track: "(it|business|accounting|office)"/)?.[1],
      note: ch.match(/note: "((?:\\.|[^"\\])*)"/)?.[1] ? unesc(ch.match(/note: "((?:\\.|[^"\\])*)"/)[1]) : "",
      skills: (() => { const a = [], re = /\{ name: "((?:\\.|[^"\\])+)", tier: "(core|secondary)", sourceTag: "([A-Z*]+)", what: "((?:\\.|[^"\\])*)"\s*\},?/g; let m; while ((m = re.exec(ch))) a.push({ name: unesc(m[1]), tier: m[2], sourceTag: m[3], what: unesc(m[4] ?? "") }); return a; })(),
    });
  }
}

/* ── parse rowspec blocks ────────────────────────────────────────────── */
const specRows = {};
for (const f of ["it", "business", "accounting", "office"]) {
  const text = fs.readFileSync(`lib/fixtures/rowspec/${f}.ts`, "utf8");
  const hits = [...text.matchAll(/"([a-z0-9]+)::((?:\\.|[^"\\])+)"(:?): \{/g)];
  for (let i = 0; i < hits.length; i++) {
    const start = hits[i].index + hits[i][0].length;
    const end = i + 1 < hits.length ? hits[i + 1].index : text.indexOf("};", start);
    const body = text.slice(start, end);
    specRows[`${hits[i][1]}::${unesc(hits[i][2])}`] = {
      file: `rowspec/${f}.ts`,
      descriptor: (body.match(/descriptor:\s*"([\s\S]*?)"?,\s*\n\s*anchors:/) ?? body.match(/descriptor:\s*"?([\s\S]*?)"?,?\s*\n?\s*anchors:/))?.[1] ?? "",
      anchorsRaw: (body.match(/anchors: \[([\s\S]*?)\]\s*,?\s*\n\s*specRef:/)?.[1]) ?? "",
    };
  }
}

/* ── claims extraction ───────────────────────────────────────────────── */
function extractClaims(text) {
  const claims = [];
  for (const line0 of text.split("\n")) {
    let line = unesc(line0.trim());
    if (!line || (!/O\*NET/.test(line) && !/\bSource-verbatim\b/.test(line))) continue;
    const codeM = line.match(/\(attributed,\s*(\d\d-\d{4}\.00)\)|O\*NET\s+(\d\d-\d{4}\.00)/);
    const code = codeM ? (codeM[1] ?? codeM[2]) : null;
    const zv = /work activities/i.test(line) ? "wa" : /Software Skills/i.test(line) ? "software" : /O\*NET overview/i.test(line) ? "description" : "task";
    const isClaim = code != null || /O\*NET Work Activities/.test(line) || /\bSource-verbatim\b/.test(line) || /task as printed/i.test(line);
    if (!isClaim) continue;
    const kind = zv;
    if (/task as printed/.test(line)) { claims.push({ kind: "catalog-name", code, span: null, importance: null }); continue; }
    // strip outer TS-string opener and trailing comma — KEEP span delimiters
    let payload = line;
    if (payload.startsWith('"')) payload = payload.slice(1);
    payload = payload.replace(/,\s*$/, "");
    payload = payload.replace(/^O\*NET(?:\s+\d\d-\d{4}\.00)?(?:[^:]*?:)?/, (m) => (m.includes('"') ? m.slice(0, m.indexOf('"')) : ""));
    payload = payload.replace(/^O\*NET[^:]*?:\s*/, "");
    const chunks = payload.split("·");
    for (const part of chunks) {
      const essentialBlock = /essential[- ]skills/i.test(part);
      const q = part.match(/"([^"]{10,400})"/);
      if (!q) continue;
      if (essentialBlock && /^[A-Z][A-Za-z./ ]+ — /.test(q[1])) {
        claims.push({ kind: "essential-pair", code, span: q[1].trim(), importance: null });
        continue;
      }
      claims.push({ kind, code, span: q[1].trim(), importance: part.match(/\((\d{1,3})\)\s*$/)?.[1] ? Number(part.match(/\((\d{1,3})\)\s*$/)[1]) : null });
    }
  }
  const seen = new Set();
  return claims.filter((c) => { const k = c.kind + "|" + (c.span ?? c.code) + "|" + (c.importance ?? ""); if (seen.has(k)) return false; seen.add(k); return true; });
}

/* ── anchoring map ───────────────────────────────────────────────────── */
const ROLE_CODE = {};
for (const [code, v] of Object.entries(MANI.fixture_derivation.code_to_roles)) for (const r of v.roles) (ROLE_CODE[r] ??= []).push(code);
const ROLE_ENTRY = Object.fromEntries(careers.map((c) => [c.id, c]));

/* ── matchers ────────────────────────────────────────────────────────── */
function findTaskBest(code, span) {
  const n = norm(span);
  for (const t of OCC[code].tasks) if (norm(t.title) === n) return { hit: t, mode: "exact" };
  for (const t of OCC[code].tasks) { const nt = norm(t.title); if (nt.includes(n) || n.includes(nt)) return { hit: t, mode: "containment" }; }
  let best = null, bs = 0;
  for (const t of OCC[code].tasks) { const sc = wordOverlap(span, t.title); if (sc > bs) { bs = sc; best = t; } }
  return { hit: null, nearest: best, nearestScore: bs };
}
function findWaBest(code, span) {
  let name = span, desc = null;
  const i = span.indexOf(" — ");
  if (i > 0) { name = span.slice(0, i); desc = span.slice(i + 3); }
  const n = norm(name);
  for (const w of OCC[code].wa) {
    if (norm(w.name) === n) {
      const dOk = !desc ? true : norm(desc || "") && (norm(w.description ?? "").includes(norm(desc)) || norm(desc).includes(norm(w.description ?? "")));
      return { hit: w, descOk: dOk };
    }
  }
  return null;
}
const findSkillByName = (code, name) => OCC[code].skills.find((s) => norm(s.name) === norm(name)) ?? null;

/* ── emit ────────────────────────────────────────────────────────────── */
const counts = { MATCH: 0, DIFFERS: 0, "PRESENT-ONLY-IN-OURS": 0, "PRESENT-ONLY-IN-ONET": 0, "NO-OUR-ROW": 0 };
const claimCounts = { MATCH: 0, DIFFERS: 0 };
const B = [];
const trackParts = { it: "Computer & IT (roster 2.1–2.9 + E1/E4)", business: "Business & Management (roster 3.1–3.9)", accounting: "Accounting & Finance (roster 4.1–4.10)", office: "Office & Administration (5.1–5.5 + E2/E3)" };
let lastTrack = null;

B.push("# O*NET 31.0 snapshot · diff against catalog/rowspec — 36 tracks (USER REVIEW ONLY)");
B.push("");
B.push("_Mechanical, read-only comparison of lib/fixtures claims against the pinned O*NET Web Services v2 snapshot (research/onet-enrich/pulls/). Every line is an extraction fact. **No fixes applied, no recommendations beyond the factual diff** — rulings stay with the user (ADR 0004 §refresh ritual, ADR 0005 §1)._");
B.push("");
B.push(`Version pin captured from the API's own \`/about/\` response: **${JSON.parse(fs.readFileSync(`${PULLS}/about.json`, "utf8")).database.name}** · api_version ${JSON.parse(fs.readFileSync(`${PULLS}/about.json`, "utf8")).api_version} · taxonomy ${JSON.parse(fs.readFileSync(`${PULLS}/about.json`, "utf8")).taxonomy.name}. Pull receipts: manifest.json; raw payloads (unedited) in pulls/*.json with .url.txt siblings.`);
B.push("");
B.push("## 0 · Extraction facts");
B.push("");
B.push("- Tracks extracted from `lib/fixtures/catalog.ts`: **36** (11 IT + 9 Business + 10 Accounting + 6 Office).");
B.push("- Distinct provenance-keyed O*NET-SOC anchors: **18** (15-1253.00, 15-1254.00, 15-1212.00, 13-1111.00, 13-1023.00, 13-1121.00, 43-3031.00, 43-3051.00, 13-2051.00, 43-3071.00, 43-3011.00, 13-2072.00, 13-2011.00, 43-6014.00, 43-9061.00, 43-9021.00, 43-6011.00, 43-4171.00) covering **21 of the 36 tracks**.");
B.push("- **15 tracks carry no provenance-keyed O*NET anchor** in the fixtures (rows are [PSF]/[TESDA]/[PSOC]/[NACE]): swd, ba, its, sysadmin, dba, cybersec, digart, da, hra, training, mkt, sales, csr, ccqa, desk → their sections record NO-OUR-ROW; no code was guessed.");
B.push("- Per code pulled: informational payload + details/technology_skills + details/tasks + details/skills + details/work_activities — every documented `next` pagination page followed to the served total.");
B.push("- **Coverage gap:** 13-2051.00 (fin · Financial and Investment Analysts) serves `total: 0` (empty list) for details/skills and details/work_activities — API-side absence at this pin, recorded not substituted; its tasks (26) and technology categories (27) served normally.");
B.push("- Claim-shape legend: rowspec rows quote O*NET text inside `anchors`/`descriptor` (\"...\" spans), or declare `task as printed` (the catalog row NAME is then the claimed verbatim text).");
B.push("");

let idx = 0;
for (const c of careers) {
  idx++;
  if (c.track !== lastTrack) {
    lastTrack = c.track;
    B.push(`---`);
    B.push(`# Track · ${trackParts[c.track]}`);
    B.push("");
  }
  const codes = ROLE_CODE[c.id] ?? [];
  B.push(`## ${idx} · ${c.id} — ${c.name}`);
  B.push("");
  B.push(`Track ${c.track} · PSOC ${c.psoc} (${c.psocTitle}) · O*NET anchor(s): ${codes.length ? codes.join(", ") : "none recorded in fixtures"}`);
  B.push("");

  if (!codes.length) {
    counts["NO-OUR-ROW"] += 1;
    B.push(`**NO-OUR-ROW** — no O*NET-keyed row exists on this track to compare (skill-row source tags: ${[...new Set(c.skills.map((s) => s.sourceTag))].join(", ")}). No O*NET code derivable from the fixtures; nothing improvised.`);
    B.push("");
    continue;
  }

  for (const code of codes) {
    const o = OCC[code];
    B.push(`### anchor ${code} — O*NET serves “${o.title}” (updated ${o.updatedYear})`);
    B.push("");
    const tMatch = norm(c.name) === norm(o.title) || norm(c.name).replace(/s$/, "") === norm(o.title).replace(/s$/, "") ||
      norm(c.name).replace(/&/g, "and") === norm(o.title).replace(/&/g, "and") ||
      norm(o.title).startsWith(norm(c.name));
    B.push(`- Title: catalog “${c.name}” vs O*NET “${o.title}” — **${tMatch ? "MATCH" : "DIFFERS"}**${tMatch ? "" : " (catalog display names are the blessed display-label layer; recorded, not judged)."}`);
    if (!tMatch) counts.DIFFERS += 1; else counts.MATCH += 1;
    B.push(`  - O*NET sample of reported titles (${o.sampleTitles.length}): ${o.sampleTitles.join(" · ")}`);
    B.push(`  - Served counts: tasks ${o.totals.tasks} · skills ${o.totals.skills} · work activities ${o.totals.wa} · technology categories ${o.totals.tech} · Software-Skills source row: ${o.updatedSoftwareSkills ? `${o.updatedSoftwareSkills.source} (${o.updatedSoftwareSkills.year})` : "n/a"}`);
    if (o.totals.skills === 0 || o.totals.wa === 0) B.push(`  - **API-side gap:** skills and/or work-activities lists serve total 0 for this code at this pin.`);
    B.push("");

    const rowStats = new Map();
    const rowMeta = new Map();
    for (const sk of c.skills) {
      rowMeta.set(sk.name, `${sk.name} (${sk.tier}/${sk.sourceTag})`);
      const key = `${c.id}::${sk.name}`;
      const spec = specRows[key];
      if (!spec) continue;
      const claims = extractClaims(`${spec.descriptor}\n${spec.anchorsRaw}`);
      // plain "Source-verbatim:" descriptors on [O*NET]-tagged rows of a
      // single-anchor role are O*NET claims keyed by that role's anchor
      // (the fixture records the O*NET source at the row/catalog layer).
      let onetClaims = claims.filter((cl) => (cl.code ? cl.code === code : sk.sourceTag === "O*NET"));
      let crossCodeClaims = [];
      if (!onetClaims.length) {
        crossCodeClaims = claims.filter((cl) => cl.code && cl.code !== code);
      }
      const flaggedParaphrase = /flagged paraphrase/i.test(unesc(`${spec.descriptor}\n${spec.anchorsRaw}`)) ? " · fixture: flagged paraphrase" : "";
      if (!onetClaims.length && !crossCodeClaims.length) { if (sk.sourceTag === "O*NET") { counts["PRESENT-ONLY-IN-OURS"] += 1; rowStats.set(sk.name, "PRESENT-ONLY-IN-OURS"); } continue; }
      for (const cl of onetClaims) {
        if (cl.kind === "catalog-name") {
          const f = findTaskBest(code, sk.name);
          if (f.hit) {
            claimCounts.MATCH++; rowStats.set(sk.name, rowStats.get(sk.name) === "DIFFERS" ? "DIFFERS" : "MATCH");
            B.push(`| ${sk.name.slice(0, 88)} (${sk.tier}/${sk.sourceTag}) | anchor declares “task as printed” → row name is the claim${flaggedParaphrase} | MATCH (${f.mode}) | task ${f.hit.id} (importance ${f.hit.importance}) |`);
          } else {
            claimCounts.DIFFERS++; rowStats.set(sk.name, "DIFFERS");
            B.push(`| ${sk.name.slice(0, 88)} (${sk.tier}/${sk.sourceTag}) | anchor declares “task as printed” → row name is the claim${flaggedParaphrase} | DIFFERS | not among the ${o.tasks.length} served tasks; nearest “${(f.nearest?.title ?? "").slice(0, 84)}” (overlap ${(f.nearestScore * 100).toFixed(0)}%) |`);
          }
          continue;
        }
        if (cl.kind === "description") {
          const d = o.description ?? "", ds = norm(cl.span);
          const ok = norm(d).includes(ds) || ds.includes(norm(d));
          if (ok) { claimCounts.MATCH++; rowStats.set(sk.name, rowStats.get(sk.name) === "DIFFERS" ? "DIFFERS" : "MATCH"); B.push(`| ${sk.name.slice(0, 72)} (${sk.tier}/${sk.sourceTag}) | descriptor quote “${cl.span.slice(0, 80)}…” (O*NET overview)${flaggedParaphrase} | MATCH (containment) | occupation description field |`); }
          else { claimCounts.DIFFERS++; rowStats.set(sk.name, "DIFFERS"); B.push(`| ${sk.name.slice(0, 72)} (${sk.tier}/${sk.sourceTag}) | descriptor quote “${cl.span.slice(0, 80)}…” (O*NET overview)${flaggedParaphrase} | DIFFERS | served description: “${d.slice(0, 100)}…” |`); }
          continue;
        }
        if (cl.kind === "task") {
          const f = findTaskBest(code, cl.span);
          if (f.hit) {
            claimCounts.MATCH++; rowStats.set(sk.name, rowStats.get(sk.name) === "DIFFERS" ? "DIFFERS" : "MATCH");
            B.push(`| ${sk.name.slice(0, 72)} (${sk.tier}/${sk.sourceTag}) | “${cl.span.slice(0, 84)}${cl.span.length > 84 ? "…" : ""}”${flaggedParaphrase} | MATCH (${f.mode}) | task ${f.hit.id} (importance ${f.hit.importance}) |`);
          } else {
            claimCounts.DIFFERS++; rowStats.set(sk.name, "DIFFERS");
            B.push(`| ${sk.name.slice(0, 72)} (${sk.tier}/${sk.sourceTag}) | “${cl.span.slice(0, 84)}${cl.span.length > 84 ? "…" : ""}”${flaggedParaphrase} | DIFFERS | not among the ${o.tasks.length} served tasks; nearest “${(f.nearest?.title ?? "").slice(0, 84)}” (overlap ${(f.nearestScore * 100).toFixed(0)}%) |`);
          }
          continue;
        }
        if (cl.kind === "wa") {
          const g = findWaBest(code, cl.span);
          if (g) {
            const impCl = cl.importance, impOnet = g.hit.importance;
            if (g.descOk && (impCl == null || impCl === impOnet)) {
              claimCounts.MATCH++; rowStats.set(sk.name, rowStats.get(sk.name) === "DIFFERS" ? "DIFFERS" : "MATCH");
              B.push(`| ${sk.name.slice(0, 72)} (${sk.tier}/${sk.sourceTag}) | WA quote “${cl.span.slice(0, 84)}” | MATCH | “${g.hit.name}” (importance ${impOnet}) |`);
            } else if (!g.descOk) {
              claimCounts.DIFFERS++; rowStats.set(sk.name, "DIFFERS");
              B.push(`| ${sk.name.slice(0, 72)} (${sk.tier}/${sk.sourceTag}) | WA quote “${cl.span.slice(0, 84)}” | DIFFERS (description) | “${g.hit.name}” (importance ${impOnet}); served desc “${(g.hit.description ?? "").slice(0, 90)}…” |`);
            } else {
              claimCounts.DIFFERS++; rowStats.set(sk.name, "DIFFERS");
              B.push(`| ${sk.name.slice(0, 72)} (${sk.tier}/${sk.sourceTag}) | WA quote “${cl.span.slice(0, 84)}” | DIFFERS (importance: fixture ${impCl} vs served ${impOnet}) | “${g.hit.name}” |`);
            }
          } else {
            claimCounts.DIFFERS++; rowStats.set(sk.name, "DIFFERS");
            B.push(`| ${sk.name.slice(0, 72)} (${sk.tier}/${sk.sourceTag}) | WA quote “${cl.span.slice(0, 84)}” | DIFFERS | no served work-activity name matches |`);
          }
          continue;
        }
        // kind === 'software' → pinned block below
      }
      // cross-code claims: the fixture cites an O*NET code other than this
      // role's anchor — compare against the CITED code (all 18 are pulled)
      for (const cl of crossCodeClaims) {
        if (!CODES.includes(cl.code)) {
          claimCounts.DIFFERS++; rowStats.set(sk.name, "DIFFERS");
          B.push(`| ${sk.name.slice(0, 84)} (${sk.tier}/${sk.sourceTag}) | fixture cites O*NET ${cl.code} — not an anchored/pulled code at this pin${flaggedParaphrase} | DIFFERS | citation: “${(cl.span ?? sk.name).slice(0, 84)}” |`);
          continue;
        }
        const xc = cl.code, oc = OCC[xc];
        const sector = `(fixture cites O*NET ${xc})`;
        if (cl.kind === "catalog-name") {
          const f = findTaskBest(xc, sk.name);
          if (f.hit) { claimCounts.MATCH++; rowStats.set(sk.name, rowStats.get(sk.name) === "DIFFERS" ? "DIFFERS" : "MATCH"); B.push(`| ${sk.name.slice(0, 84)} (${sk.tier}/${sk.sourceTag}) | ${sector} row name is the claim${flaggedParaphrase} | MATCH (${f.mode}) | task ${f.hit.id} (importance ${f.hit.importance}) |`); }
          else { claimCounts.DIFFERS++; rowStats.set(sk.name, "DIFFERS"); B.push(`| ${sk.name.slice(0, 84)} (${sk.tier}/${sk.sourceTag}) | ${sector} row name is the claim${flaggedParaphrase} | DIFFERS | not among ${oc.tasks.length} served tasks of ${xc}; nearest “${(f.nearest?.title ?? "").slice(0, 80)}” (overlap ${(f.nearestScore * 100).toFixed(0)}%) |`); }
          continue;
        }
        if (cl.kind === "task" || cl.kind === "description" || cl.kind === "wa") {
          if (cl.kind === "description") {
            const d = oc.description ?? "";
            const ok = norm(d).includes(norm(cl.span)) || norm(cl.span).includes(norm(d));
            if (ok) { claimCounts.MATCH++; rowStats.set(sk.name, rowStats.get(sk.name) === "DIFFERS" ? "DIFFERS" : "MATCH"); B.push(`| ${sk.name.slice(0, 72)} (${sk.tier}/${sk.sourceTag}) | ${sector} descriptor quote ${flaggedParaphrase} | MATCH (containment) | description of ${xc} |`); }
            else { claimCounts.DIFFERS++; rowStats.set(sk.name, "DIFFERS"); B.push(`| ${sk.name.slice(0, 72)} (${sk.tier}/${sk.sourceTag}) | ${sector} descriptor quote ${flaggedParaphrase} | DIFFERS | served: “${d.slice(0, 90)}…” |`); }
            continue;
          }
          if (cl.kind === "task") {
            const f = findTaskBest(xc, cl.span);
            if (f.hit) { claimCounts.MATCH++; rowStats.set(sk.name, rowStats.get(sk.name) === "DIFFERS" ? "DIFFERS" : "MATCH"); B.push(`| ${sk.name.slice(0, 72)} (${sk.tier}/${sk.sourceTag}) | ${sector} “${cl.span.slice(0, 80)}…”${flaggedParaphrase} | MATCH (${f.mode}) | task ${f.hit.id} (importance ${f.hit.importance}) |`); }
            else { claimCounts.DIFFERS++; rowStats.set(sk.name, "DIFFERS"); B.push(`| ${sk.name.slice(0, 72)} (${sk.tier}/${sk.sourceTag}) | ${sector} “${cl.span.slice(0, 80)}…”${flaggedParaphrase} | DIFFERS | not among ${oc.tasks.length} served tasks of ${xc}; nearest “${(f.nearest?.title ?? "").slice(0, 80)}” |`); }
            continue;
          }
          const g = findWaBest(xc, cl.span);
          if (g && g.descOk && (cl.importance == null || cl.importance === g.hit.importance)) { claimCounts.MATCH++; rowStats.set(sk.name, rowStats.get(sk.name) === "DIFFERS" ? "DIFFERS" : "MATCH"); B.push(`| ${sk.name.slice(0, 72)} (${sk.tier}/${sk.sourceTag}) | ${sector} WA quote ${flaggedParaphrase} | MATCH | “${g.hit.name}” (importance ${g.hit.importance}) |`); }
          else { claimCounts.DIFFERS++; rowStats.set(sk.name, "DIFFERS"); B.push(`| ${sk.name.slice(0, 72)} (${sk.tier}/${sk.sourceTag}) | ${sector} WA quote | DIFFERS | served counterpart in ${xc}: “${g ? g.hit.name : "none"}” |`); }
        }
      }
      // essential-skill pair claims inside task rows
      const text = unesc(`${spec.descriptor}\n${spec.anchorsRaw}`);
      if (/essential[- ]skills/i.test(text)) {
        for (const p of text.matchAll(/"([A-Z][A-Za-z./ ]+) — ([^"]{8,240})"/g)) {
          const el = findSkillByName(code, p[1]);
          if (el) {
            const dOk = norm(el.description ?? "") && (norm(el.description).includes(norm(p[2]).replace(/…/g, "")) || norm(p[2]).replace(/…/g, "").includes(norm(el.description)));
            if (dOk) { claimCounts.MATCH++; rowStats.set(sk.name, rowStats.get(sk.name) === "DIFFERS" ? "DIFFERS" : "MATCH"); B.push(`| ${sk.name.slice(0, 60)} · essential-skill claim | “${p[1]} — ${p[2].slice(0, 60)}…” | MATCH | skill element ${el.id ?? ""} “${el.name}” importance ${el.importance ?? "?"} |`); }
            else { claimCounts.DIFFERS++; rowStats.set(sk.name, "DIFFERS"); B.push(`| ${sk.name.slice(0, 60)} · essential-skill claim | “${p[1]} — ${p[2].slice(0, 60)}…” | DIFFERS (description) | element “${el.name}” importance ${el.importance ?? "?"}; served desc “${(el.description ?? "").slice(0, 90)}…” |`); }
          } else { claimCounts.DIFFERS++; rowStats.set(sk.name, "DIFFERS"); B.push(`| ${sk.name.slice(0, 60)} · essential-skill claim | “${p[1]} — ${p[2].slice(0, 60)}…” | DIFFERS | “${p[1]}” not in the served skill list for ${code} |`); }
        }
      }
    }
    if (rowStats.size) B.push("");

    // technology-skills presence (every anchored code)
    const techRows = c.skills.filter((sk) => {
      const spec = specRows[`${c.id}::${sk.name}`];
      return spec && /Software Skills/i.test(unesc(`${spec.descriptor}\n${spec.anchorsRaw}`));
    });
    counts["PRESENT-ONLY-IN-ONET"] += 1;
    B.push(`- **Technology-skills presence** — O*NET serves ${o.techCategories.length} tech categories for ${code} (${o.techCategories.map((t) => t.title).join("; ")}).`);
    if (techRows.length) {
      for (const sk of techRows) {
        B.push(`  - Fixture row “${sk.name}” [${sk.tier}/${sk.sourceTag}] waits on this pin (“...”) — pin content:`);
        B.push("");
        B.push("  | O*NET 31.0 tech category | served examples (verbatim, incl. standard list beyond first page) |");
        B.push("  |---|---|");
        for (const tcat of o.techCategories) {
          const ex = [...(tcat.example ?? []), ...(tcat.example_more ?? [])].map((e) => e.title);
          B.push(`  | ${tcat.title} | ${ex.slice(0, 10).join(", ")}${ex.length > 10 ? `, +${ex.length - 10} more` : ""} |`);
        }
        B.push("");
      }
    }
    // classic tally line
    const vals = [...rowStats.values()];
    B.push(`Row roll-up for ${c.id} vs ${code}: spans matched ${vals.filter((x) => x === "MATCH").length} · rows carrying DIFFERS ${vals.filter((x) => x === "DIFFERS").length} · rows tagged [O*NET] with no O*NET-keyed claim (PRESENT-ONLY-IN-OURS) ${vals.filter((x) => x === "PRESENT-ONLY-IN-OURS").length}`);
    B.push("");
  }
}

/* technology-skills PRESENT-ONLY-IN-ONET only counts once per track section (block), align counting */
/* roll-up */
B.push("---");
B.push("## 37 · Marker roll-up across all 36 tracks");
B.push("");
B.push("| Marker | Count |");
B.push("|---|---|");
for (const k of ["MATCH", "DIFFERS", "PRESENT-ONLY-IN-OURS", "PRESENT-ONLY-IN-ONET", "NO-OUR-ROW"]) B.push(`| ${k} | ${counts[k]} |`);
B.push("");
B.push(`Claim-span roll-up (task/WA/description/essential-skill spans): **${claimCounts.MATCH} MATCH · ${claimCounts.DIFFERS} DIFFERS**.`);
B.push("");
B.push("_MATCH = fixture claim found in the pinned O*NET 31.0 served lists (exact or containment after normalization). DIFFERS = the claim text has no exact/containment counterpart in the served list at this pin — the served counterpart (or nearest task) is printed for review. PRESENT-ONLY-IN-OURS = fixture rows tagged [O*NET] whose rowspec carries no O*NET-keyed quote span. PRESENT-ONLY-IN-ONET = served content (counted once per anchor block: technology categories; audit row-11 examples listed in full) with no counterpart printed in the fixtures. NO-OUR-ROW = track with no O*NET anchor recorded in the fixtures._");
B.push("");

fs.writeFileSync(`${OUT}/diff-log.md`, B.join("\n") + "\n", "utf8");
console.log("diff-log.md written; block markers:", JSON.stringify(counts), "claim spans:", JSON.stringify(claimCounts));
const onlyOursReport = [];
for (const c of careers) for (const sk of c.skills) {
  if (sk.sourceTag !== "O*NET") continue;
  const spec = specRows[`${c.id}::${sk.name}`];
  if (!spec) { onlyOursReport.push(`${c.id}::${sk.name}` + " (NO ROWSPEC ROW)"); continue; }
  const cl = extractClaims(`${spec.descriptor}\n${spec.anchorsRaw}`);
  if (!cl.length) onlyOursReport.push(`${c.id}::${sk.name}` + " :: spec.desc/anchors → " + JSON.stringify((spec.descriptor || "").slice(0, 80)) + " | " + JSON.stringify((spec.anchorsRaw || "").slice(0, 80)));
}
for (const line of onlyOursReport) console.log("  ①", line);
console.log("only-ours rows:", onlyOursReport.length);

/* sanity */
const missingRows = Object.keys(specRows).filter((k) => {
  const [r, s] = k.split("::");
  return !ROLE_ENTRY[r]?.skills?.some((x) => x.name === s);
});
console.log("rowspec keys without catalog row:", JSON.stringify(missingRows));
if (missingRows.length) {
  for (const k of missingRows) {
    const [r, s] = k.split("::");
    const cat = ROLE_ENTRY[r]?.skills?.map((x) => x.name) ?? [];
    const jit = cat.find((n) => norm(n).slice(0, 40) === norm(s).slice(0, 40));
    console.log(`  mismatch ${r}:: “${s}” vs catalog ${jit ? "≈" + jit : JSON.stringify(cat).slice(0, 400)}`);
  }
}
console.log("no-code roles:", careers.filter((c) => !(ROLE_CODE[c.id] ?? []).length).map((c) => c.id).join(","));
