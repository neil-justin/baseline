/**
 * Link-health gate (user ruling 2026-11-02, grilling Q6): every fixture
 * resource URL's last audited status must be clean. This test READS the
 * report from `npm run audit:links` — it never fetches, so CI stays
 * network-free. A dead entry fails the test and forces a data fix (the
 * link may be repaired, or its host added to EXPECTED_BLOCKED in the audit
 * script when the block is a verified bot-wall, never silent).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { it } from "vitest";

const here = dirname(fileURLToPath(import.meta.url));
const reportPath = join(here, "link-audit-report.json");

it("resource fixture URLs are audit-clean (run `npm run audit:links` to refresh)", () => {
  let report;
  try {
    report = JSON.parse(readFileSync(reportPath, "utf8"));
  } catch {
    throw new Error("scripts/link-audit-report.json missing — run `npm run audit:links` first");
  }
  if (report.dead.length > 0) {
    const lines = report.dead.map(
      (d: { status?: number | null; url: string; finalUrl?: string | null }) =>
        `  ${d.status ?? 0} ${d.url}${d.finalUrl ? ` → ${d.finalUrl}` : ""}`
    );
    throw new Error(`${report.dead.length} dead fixture URL(s) (report ${report.generatedAt}):\n${lines.join("\n")}`);
  }
});
