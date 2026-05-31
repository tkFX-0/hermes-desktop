#!/usr/bin/env node
/**
 * フェーズ別 GO 記録（ローカル JSON のみ・git に含めない）
 *
 * 例:
 *   node scripts/shikishima-phase-go.mjs list
 *   node scripts/shikishima-phase-go.mjs ack burn_in_human
 *   node scripts/shikishima-phase-go.mjs ack agent_team_tick
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { homedir } from "os";

const BASE = join(homedir(), "Desktop", "プロジェクトファイル", "hermes-desktop");
const MEMORY = join(BASE, ".shikishima-memory");
const PHASE_FILE = join(MEMORY, "phase-go-ack.json");
const BURN_FILE = join(MEMORY, "burn-in-wall-clock.json");
const OPS_FILE = join(MEMORY, "operational-release.local.json");

const PHASES = {
  burn_in_human: {
    label: "Burn-in 人間ACK (humanGoAcknowledged)",
    apply() {
      const burn = readJson(BURN_FILE) ?? { tickCount: 0, humanGoAcknowledged: false };
      burn.humanGoAcknowledged = true;
      burn.humanGoAcknowledgedAt = new Date().toISOString();
      writeJson(BURN_FILE, burn);
    },
  },
  agent_team_tick: {
    label: "Agent team 定期 tick (agentTeamTickEnabled)",
    apply() {
      const ops = readJson(OPS_FILE) ?? {};
      ops.agentTeamTickEnabled = true;
      ops.agentTeamTickIntervalMinutes = ops.agentTeamTickIntervalMinutes ?? 30;
      ops.agentTeamTickEnabledAt = new Date().toISOString();
      writeJson(OPS_FILE, ops);
    },
  },
  discord_dedupe: {
    label: "Discord 二重送信対策（記録のみ）",
    apply() {
      /* ack record only */
    },
  },
  autonomous_orchestrator: {
    label: "自律オーケストレータ定期 tick（SideBot spawn）",
    apply() {
      const ops = readJson(OPS_FILE) ?? {};
      ops.autonomousOrchestratorEnabled = true;
      ops.autonomousOrchestratorIntervalMinutes = ops.autonomousOrchestratorIntervalMinutes ?? 30;
      ops.autonomousOrchestratorEnabledAt = new Date().toISOString();
      writeJson(OPS_FILE, ops);
    },
  },
};

function readJson(path) {
  try {
    if (!existsSync(path)) return null;
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    return null;
  }
}

function writeJson(path, data) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(data, null, 2), "utf-8");
}

function loadPhaseStore() {
  return readJson(PHASE_FILE) ?? { phases: {}, updatedAt: null };
}

function savePhaseAck(phaseId, note) {
  const store = loadPhaseStore();
  store.phases[phaseId] = {
    acknowledged: true,
    at: new Date().toISOString(),
    note: note ?? "",
    pid: process.pid,
  };
  store.updatedAt = new Date().toISOString();
  writeJson(PHASE_FILE, store);
}

function main() {
  const [, , cmd, phaseId, ...rest] = process.argv;
  const note = rest.join(" ").trim();

  if (cmd === "list" || !cmd) {
    console.log("利用可能フェーズ:");
    for (const [id, p] of Object.entries(PHASES)) {
      console.log(`  - ${id}: ${p.label}`);
    }
    const store = loadPhaseStore();
    console.log("\n記録済み:", JSON.stringify(store.phases, null, 2));
    return;
  }

  if (cmd !== "ack") {
    console.error("Usage: node scripts/shikishima-phase-go.mjs ack <phase_id> [note]");
    process.exit(1);
  }

  const phase = PHASES[phaseId];
  if (!phase) {
    console.error(`Unknown phase: ${phaseId}`);
    process.exit(1);
  }

  phase.apply();
  savePhaseAck(phaseId, note);
  console.log(`OK: phase GO recorded — ${phaseId}`);
  console.log(`  ${phase.label}`);
}

main();
