/**
 * Evidence fetch 1 — public reference material only (NO key used here).
 * Saves the O*NET Web Services v2 OpenAPI spec verbatim so the exact
 * occupations / technology-skills routes are pinned from the API's own
 * documentation, not memory. Writes stay inside research/onet-enrich/.
 */
import fs from "node:fs";
const OUT = "research/onet-enrich";

const OPENAPI_URL = "https://services.onetcenter.org/reference/openapi.json";
const urlTxt = `${OUT}/evidence/openapi.json.url.txt`;
fs.mkdirSync(`${OUT}/evidence`, { recursive: true });
fs.writeFileSync(urlTxt, OPENAPI_URL + "\n", "utf8");

const t0 = Date.now();
const res = await fetch(OPENAPI_URL, { headers: { Accept: "application/json" } });
const bytes = Buffer.from(await res.arrayBuffer());
fs.writeFileSync(`${OUT}/evidence/openapi.json`, bytes);

const report = {
  url: OPENAPI_URL,
  status: res.status,
  bytes: bytes.length,
  ms: Date.now() - t0,
  contentType: res.headers.get("content-type") ?? null,
};
console.log(JSON.stringify(report));

const spec = JSON.parse(bytes.toString("utf8"));
const paths = Object.keys(spec.paths ?? {});
console.log("--- path count:", paths.length);
console.log("--- occupation-ish paths:");
for (const p of paths) {
  if (/occupation/i.test(p)) console.log("   ", p, "->", Object.keys(spec.paths[p]).join(","));
}
console.log("--- tech/technology paths:");
for (const p of paths) {
  if (/technolog/i.test(p)) console.log("   ", p, "->", Object.keys(spec.paths[p]).join(","));
}
