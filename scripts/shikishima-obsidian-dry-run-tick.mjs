#!/usr/bin/env node
/**
 * Phase E3 — Obsidian write dry-run only (no file write unless constitutional obsidian_write GO).
 */

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync, mkdirSync, appendFileSync } from "node:fs";

import { hasConstitutionalScope } from "./lib/constitutional-go-read.mjs";
import { checkObsidianVaultReady } from "./lib/obsidian-vault-path.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const vaultCheck = checkObsidianVaultReady(root);
const vaultOk = vaultCheck.vaultExists;
const goWrite = hasConstitutionalScope(root, "obsidian_write");

const report = {
  at: new Date().toISOString(),
  routeId: "obsidian.write",
  dryRunOnly: !goWrite,
  wouldWrite: goWrite && vaultOk,
  vaultConfigured: vaultOk,
  constitutionalObsidianWrite: goWrite,
  decision: !vaultOk ? "BLOCKED" : goWrite ? "ALLOW_LIVE" : "ALLOW_DRAFT",
  reasons: [],
};

if (!vaultOk) report.reasons.push("vault_path_missing");
if (!goWrite) report.reasons.push("dry_run_only");

const auditDir = join(root, ".shikishima-memory", "audit");
mkdirSync(auditDir, { recursive: true });
appendFileSync(join(auditDir, "obsidian-dry-run.jsonl"), `${JSON.stringify(report)}\n`, "utf-8");

console.log(JSON.stringify(report, null, 2));
process.exit(vaultOk ? 0 : 2);
