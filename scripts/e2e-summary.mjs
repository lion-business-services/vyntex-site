// Prints the failed Playwright tests as one GitHub annotation (CI only), so the whole list is readable from the
// pull request without downloading logs. Usage: node scripts/e2e-summary.mjs test-results/results.json
import { readFileSync } from "node:fs";

const report = JSON.parse(readFileSync(process.argv[2], "utf8"));
const failed = [];
const walk = (suite, trail) => {
  for (const s of suite.suites ?? []) walk(s, [...trail, s.title]);
  for (const spec of suite.specs ?? []) {
    for (const t of spec.tests ?? []) {
      if (t.status === "expected" || t.status === "skipped" || t.status === "flaky") continue;
      const last = t.results?.at(-1);
      const why = (last?.error?.message ?? "").replace(/\u001b\[[0-9;]*m/g, "").split("\n").filter(Boolean).slice(0, 3).join(" | ");
      failed.push(`[${t.projectName}] ${[...trail, spec.title].filter(Boolean).join(" > ")} (${spec.file}:${spec.line}) :: ${why}`);
    }
  }
};
walk(report, []);
const text = failed.length ? `${failed.length} failed:%0A` + failed.map((f) => f.replace(/%/g, "%25").replace(/\r?\n/g, " ")).join("%0A") : "no failures";
console.log(`::error title=Browser tests::${text}`);
