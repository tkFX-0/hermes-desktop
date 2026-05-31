#!/usr/bin/env node
/**
 * 憲法GO obsidian_write — shikishima-library/30_Evidence へ1件だけ書く（Discord/外部送信なし）
 *
 *   node scripts/shikishima-obsidian-write-go.mjs
 *   node scripts/shikishima-obsidian-write-go.mjs --json
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname, normalize, sep } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const asJson = process.argv.includes("--json");
const MEMORY = join(root, ".shikishima-memory");
const CONSTITUTIONAL = join(MEMORY, "constitutional-go.local.json");

const VAULT_ROOT = join(homedir(), "Desktop", "プロジェクトファイル", "shikishima-library");
const ALLOWED_SUBFOLDER = "30_Evidence";
const ALLOWED_ROOT = normalize(join(VAULT_ROOT, ALLOWED_SUBFOLDER));

function readScopes() {
  try {
    const j = JSON.parse(readFileSync(CONSTITUTIONAL, "utf-8"));
    if (j.allGoAcknowledged !== true) return [];
    return Array.isArray(j.scopes) ? j.scopes : [];
  } catch {
    return [];
  }
}

const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
const filename = `${stamp}_next-go-verify.md`;
const scopes = readScopes();
const goActive = scopes.includes("obsidian_write");

const report = {
  at: new Date().toISOString(),
  constitutionalActive: goActive,
  scope: "obsidian_write",
  dryRun: !goActive,
  success: false,
  redactedPath: join(ALLOWED_SUBFOLDER, filename),
  error: null,
};

if (!goActive) {
  report.error = "constitutional_go_obsidian_write_required";
} else if (/[/\\]/.test(filename)) {
  report.error = "invalid_filename";
} else {
  const targetPath = normalize(join(ALLOWED_ROOT, filename));
  if (!targetPath.startsWith(ALLOWED_ROOT + sep)) {
    report.error = "path_outside_allowed_root";
  } else {
    try {
      if (!existsSync(ALLOWED_ROOT)) mkdirSync(ALLOWED_ROOT, { recursive: true });
      const body = [
        "# Next GO verify (obsidian_write)",
        "",
        `- at: ${new Date().toISOString()}`,
        `- note: shikishima-obsidian-write-go.mjs`,
        `- scopes: ${scopes.length}`,
        "",
        "filesystem live write under constitutional GO.",
        "",
      ].join("\n");
      writeFileSync(targetPath, body, "utf-8");
      report.success = true;
      report.dryRun = false;
      try {
        const auditDir = join(MEMORY, "audit");
        mkdirSync(auditDir, { recursive: true });
        writeFileSync(
          join(auditDir, "obsidian-write-go.jsonl"),
          `${JSON.stringify({ at: report.at, success: true, redactedPath: report.redactedPath })}\n`,
          { flag: "a", encoding: "utf-8" },
        );
      } catch {
        /* non-fatal */
      }
    } catch (e) {
      report.error = e instanceof Error ? e.message : String(e);
    }
  }
}

if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log("[Obsidian GO] obsidian_write live verify");
  console.log(`  constitutional scope: ${goActive ? "ON" : "OFF"}`);
  console.log(`  dryRun: ${report.dryRun}`);
  console.log(`  success: ${report.success}`);
  console.log(`  path: ${report.redactedPath}`);
  if (report.error) console.log(`  error: ${report.error}`);
}

process.exit(report.success ? 0 : 1);
