#!/usr/bin/env node
/**
 * Obsidian vault パス確認（ファイルシステムのみ・書き込みはしない）
 *
 *   node scripts/shikishima-obsidian-vault-check.mjs
 *   node scripts/shikishima-obsidian-vault-check.mjs --json
 */

import { mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { checkObsidianVaultReady } from "./lib/obsidian-vault-path.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const asJson = process.argv.includes("--json");

let c = checkObsidianVaultReady(root);
if (c.vaultExists && !c.categoryExists) {
  try {
    mkdirSync(c.categoryDir, { recursive: true });
    c = checkObsidianVaultReady(root);
  } catch {
    /* ignore */
  }
}

const report = {
  ready: c.ready,
  vaultPath: c.vaultPath,
  categoryDir: c.categoryDir,
  vaultExists: c.vaultExists,
  categoryExists: c.categoryExists,
  configuredViaEnv: c.configuredViaEnv,
  hint: c.ready
    ? "obsidian_write はパス準備済み（憲法GOスコープは別途）"
    : "`.env.local` に OBSIDIAN_VAULT_PATH=あなたのVaultルート を設定",
};

if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log("[Obsidian] vault check");
  console.log(`  ready: ${report.ready}`);
  console.log(`  vault: ${report.vaultPath} (exists=${report.vaultExists})`);
  console.log(`  category: ${report.categoryDir} (exists=${report.categoryExists})`);
  console.log(`  env override: ${report.configuredViaEnv}`);
  if (!report.ready) console.log(`  hint: ${report.hint}`);
}

process.exit(report.ready ? 0 : 1);
