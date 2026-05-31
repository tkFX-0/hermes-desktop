#!/usr/bin/env node
/**
 * 直近の自律オーケストレータ tick を表示（Discord 送信なし）
 *
 *   node scripts/shikishima-orchestrator-status.mjs
 *   node scripts/shikishima-orchestrator-status.mjs --json
 */

import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readOperationalRelease } from "./lib/operational-release-read.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const asJson = process.argv.includes("--json");
const auditPath = join(root, ".shikishima-memory", "audit", "orchestrator-tick.jsonl");

function readLastAuditLine() {
  if (!existsSync(auditPath)) return null;
  const lines = readFileSync(auditPath, "utf-8")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (!lines.length) return null;
  try {
    return JSON.parse(lines[lines.length - 1]);
  } catch {
    return null;
  }
}

const release = readOperationalRelease(root);
const last = readLastAuditLine();

const report = {
  autonomousOrchestratorEnabled: release.autonomousOrchestratorEnabled,
  intervalMinutes: release.autonomousOrchestratorIntervalMinutes,
  agentTeamTickEnabled: release.agentTeamTickEnabled,
  lastTick: last,
  auditPath: ".shikishima-memory/audit/orchestrator-tick.jsonl",
};

if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log("[Orchestrator] status");
  console.log(`  enabled: ${report.autonomousOrchestratorEnabled}`);
  console.log(`  interval: ${report.intervalMinutes}m`);
  console.log(`  agent team tick: ${report.agentTeamTickEnabled}`);
  if (last) {
    console.log(`  last tick: ${last.at}`);
    console.log(
      `    exit/maintenance=${last.maintenanceExitCode} decision=${last.decisionForAutomation} openGaps=${last.openGaps}`,
    );
    console.log(
      `    agentTeam skipped=${last.agentTeamSkipped} reasons=${(last.agentTeamReasons ?? []).join(",") || "—"}`,
    );
  } else {
    console.log("  last tick: (none — SideBot 起動後 30s または手動 orchestrator を待つ)");
  }
}

process.exit(0);
