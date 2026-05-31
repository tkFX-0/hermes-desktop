#!/usr/bin/env node
/**
 * Dev pipeline 1-shot probe (subscription chain · no Discord).
 *   node scripts/shikishima-dev-pipeline-probe.mjs
 */

import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { runDevPipeline } from "./lib/wsl-dev-runner.mjs";
import { formatDevPipelineStatus, resolveDevPipelineConfig, loadWslPreflight } from "./lib/dev-pipeline-router.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnvLocal() {
  const e = { ...process.env };
  const p = join(root, ".env.local");
  if (!existsSync(p)) return e;
  for (const line of readFileSync(p, "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#") || !t.includes("=")) continue;
    const eq = t.indexOf("=");
    e[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
  }
  return e;
}

const env = loadEnvLocal();
const cfg = resolveDevPipelineConfig((k) => env[k]);
const preflight = loadWslPreflight();
console.log(formatDevPipelineStatus(cfg, preflight));
console.log("\n--- probe run ---\n");

const prompt =
  "Dev pipeline probe: reply with exactly one English line starting with BACKEND= and name claude or codex or composer. No file writes.";

const result = await runDevPipeline({ prompt, agentId: "tsumugi" }, env);
console.log(JSON.stringify({
  ok: result.ok,
  backend: result.backend,
  model: result.model,
  reason: result.reason,
  attempts: (result.attempts ?? []).map((a) => ({ backend: a.backend, ok: a.ok, via: a.via }))
}, null, 2));
if (result.text) console.log("\n--- text (first 500) ---\n", result.text.slice(0, 500));
process.exit(result.ok ? 0 : 1);
