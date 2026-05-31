#!/usr/bin/env node
/**
 * オーケストレータ停止要因の洗い出し（CLI）
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { auditOrchestratorGates, formatOrchestratorGatesReport } from "./lib/orchestrator-gates.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = join(root, ".env.local");

function readEnvLocal() {
  const out = { ...process.env };
  if (!existsSync(envPath)) return out;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#") || !t.includes("=")) continue;
    const i = t.indexOf("=");
    out[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return out;
}

const audit = auditOrchestratorGates(root, (k) => readEnvLocal()[k]);
if (process.argv.includes("--json")) {
  console.log(JSON.stringify(audit, null, 2));
} else {
  console.log(formatOrchestratorGatesReport(audit));
}
