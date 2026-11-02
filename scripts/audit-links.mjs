#!/usr/bin/env node
/**
 * audit:links — the resource-fixture URL health check (user ruling
 * 2026-11-02, grilling Q6). Hits every `url:` in lib/fixtures/resources.ts,
 * follows redirects, and records the final URL + status per link into
 * scripts/link-audit-report.json. The vitest gate
 * (scripts/link-audit.test.ts) reads the REPORT — it never fetches — so a
 * dead/moved link forces a data fix, not a flaky network test.
 *
 * Run: `npm run audit:links` (needs network; ~2-5 min for 413 links).
 * Known script-impermeable hosts live in EXPECTED_BLOCKED (bot-walls that
 * the spec sessions verified by hand — 403 to scripted fetch is NOT death).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const fixturePath = join(here, "..", "lib", "fixtures", "resources.ts");
const reportPath = join(here, "link-audit-report.json");

const EXPECTED_BLOCKED = [
  // site-wide bot-wall ruling 2026-10-29 (cf-mitigated 403; URL alive)
  "open.edu",
  // prior-round note: CDN blocks CLI re-checks
  "khanacademy.org",
  // audit 2026-11-02: 403 to scripted fetch (curl + browser UA, root and
  // links alike) — bot-wall by all signs, but browser-verify these three
  // once before the defense (flagged, never silently replaced)
  "linuxjourney.com",
  "canva.com",
  "privacy.gov.ph",
];

const src = readFileSync(fixturePath, "utf8");
const urls = [...new Set([...src.matchAll(/url:\s*"(https?:\/\/[^"]+)"/g)].map((m) => m[1]))];

const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";

async function check(url) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": UA, accept: "text/html,*/*" },
    });
    return {
      url,
      status: res.status,
      finalUrl: res.url === url ? null : res.url,
    };
  } catch (e) {
    const msg = String(e?.message ?? e);
    const timeout = /aborted|timeout/i.test(msg);
    return { url, status: 0, error: timeout ? "timeout (20s)" : msg.slice(0, 160) };
  } finally {
    clearTimeout(t);
  }
}

console.log(`audit:links — ${urls.length} unique fixture URLs…`);
const results = [];
const BATCH = 8;
for (let i = 0; i < urls.length; i += BATCH) {
  const batch = await Promise.allSettled(urls.slice(i, i + BATCH).map(check));
  results.push(...batch.map((r) => r.value ?? { url: "?", status: 0, error: String(r.reason) }));
  process.stdout.write(`  ${Math.min(i + BATCH, urls.length)}/${urls.length}\n`);
}

const blocked = (u) => EXPECTED_BLOCKED.some((h) => u.includes(h));
const dead = results.filter(
  (r) => !blocked(r.url) && (r.status === 0 || r.status >= 400)
);
const moved = results.filter((r) => r.finalUrl);

const report = {
  generatedAt: new Date().toISOString(),
  total: results.length,
  dead: dead.map((r) => ({
    url: r.url,
    status: r.status,
    error: r.error ?? null,
    finalUrl: r.finalUrl ?? null,
  })),
  moved: moved.map((r) => ({ url: r.url, finalUrl: r.finalUrl })),
  statuses: Object.fromEntries(results.map((r) => [r.url, r.status])),
};
writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n");

console.log(`  dead: ${dead.length}  moved: ${moved.length}  blocked-by-design: ${results.length - dead.length - moved.length}`);
if (dead.length) {
  for (const d of dead) console.log(`  DEAD ${d.status ?? 0} ${d.url}`);
  process.exitCode = 1;
}
