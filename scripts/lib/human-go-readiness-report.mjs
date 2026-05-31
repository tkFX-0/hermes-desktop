/**
 * Human GO readiness — plain Node (no nested .ts imports).
 * Used by: node scripts/shikishima-human-go-readiness.mjs
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { checkObsidianVaultReady } from "./obsidian-vault-path.mjs";

function readJson(path) {
  try {
    if (!existsSync(path)) return null;
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return null;
  }
}

/**
 * @param {string} root — project root
 */
export function buildHumanGoReadinessReport(root) {
  const memory = join(root, ".shikishima-memory");
  const ops = readJson(join(memory, "operational-release.local.json"));
  const constitutional = readJson(join(memory, "constitutional-go.local.json"));
  const burnStore = readJson(join(memory, "burn-in-wall-clock.json")) ?? {
    tickCount: 0,
    humanGoAcknowledged: false
  };
  const preflight = readJson(join(memory, "wsl-dev-preflight.json"));
  const zenbuGo = readJson(join(memory, "zenbu-go.local.json"));
  const scopeGo = readJson(join(memory, "execution-scope-go.local.json"));
  const orchestratorRelaxed =
    scopeGo?.scopes?.orchestratorRelaxed?.enabled === true ||
    String(process.env.SHIKISHIMA_ORCHESTRATOR_RELAXED ?? "").trim() === "1";

  const trackDActive =
    ops?.trackDGoAcknowledged === true &&
    ops?.executionEnabled === true &&
    ops?.productionReady === true;

  const constitutionalActive = constitutional?.allGoAcknowledged === true;
  const scopes = constitutional?.scopes ?? [];
  const tickCount = burnStore.tickCount ?? 0;
  const humanAck = burnStore.humanGoAcknowledged === true;
  const burnPartial = tickCount >= 3;
  const burnReady = burnPartial && humanAck;

  const obsidianCheck = checkObsidianVaultReady(root);
  const obsidianScope = scopes.includes("obsidian_write");
  const obsidianStatus = !obsidianScope
    ? "HOLD"
    : obsidianCheck.ready
      ? "READY"
      : "PARTIAL";
  const obsidianNote = !obsidianScope
    ? "scope not in constitutional GO"
    : obsidianCheck.ready
      ? "vault path OK (filesystem)"
      : `set OBSIDIAN_VAULT_PATH in .env.local (${obsidianCheck.vaultExists ? "category dir" : "vault root"} missing)`;

  let devPipelineEnabled = false;
  try {
    const env = readFileSync(join(root, ".env.local"), "utf8");
    devPipelineEnabled = /^SHIKISHIMA_DEV_PIPELINE_ENABLED=1/m.test(env);
  } catch {
    /* ignore */
  }

  const wslCodexPresent =
    preflight?.tools?.codex?.present === true ||
    preflight?.subscriptionLane?.codex?.wslCodexCli === true;
  const claudeLoggedIn = preflight?.login?.claude?.loggedIn === true;
  const codexLoggedIn = preflight?.login?.codex?.loggedIn === true;
  const winAgentPresent = preflight?.windows?.agent?.present === true;
  const winAgentLoggedIn = preflight?.windows?.agentLogin?.loggedIn === true;

  const items = [
    {
      id: "track_d",
      label: "Track D operational release",
      status: trackDActive ? "READY" : "HOLD",
      humanGoRequired: true,
      note: trackDActive ? "local_file active" : "operational-release.local.json"
    },
    {
      id: "constitutional",
      label: "Constitutional GO scopes",
      status: constitutionalActive
        ? scopes.length >= 8
          ? "READY"
          : "PARTIAL"
        : "HOLD",
      humanGoRequired: true,
      note: constitutionalActive
        ? `scopes=${scopes.length}${scopes.length >= 8 ? " (GO-E planned set)" : ""}`
        : "constitutional-go.local.json"
    },
    {
      id: "obsidian_write",
      label: "Obsidian actual write (E3b)",
      status: obsidianStatus,
      humanGoRequired: true,
      note: obsidianNote,
    },
    {
      id: "burn_in_wall",
      label: "Burn-in wall-clock",
      status: burnReady ? "READY" : burnPartial ? "PARTIAL" : "HOLD",
      humanGoRequired: true,
      note: `ticks=${tickCount} humanAck=${humanAck}`
    },
    {
      id: "agent_team_tick",
      label: "Agent team scheduled tick",
      status:
        zenbuGo || (trackDActive && ops?.agentTeamTickEnabled === true)
          ? "READY"
          : "HOLD",
      humanGoRequired: !zenbuGo,
      note: zenbuGo
        ? "全てGO"
        : ops?.agentTeamTickEnabled
          ? `every ${ops.agentTeamTickIntervalMinutes ?? 360}m`
          : "agentTeamTickEnabled in ops file"
    },
    {
      id: "autonomous_orchestrator",
      label: "Autonomous orchestrator (capped, no Discord send)",
      status:
        zenbuGo || (trackDActive && ops?.autonomousOrchestratorEnabled === true && orchestratorRelaxed)
          ? "READY"
          : trackDActive && ops?.autonomousOrchestratorEnabled === true
            ? "PARTIAL"
            : "HOLD",
      humanGoRequired: !zenbuGo,
      note: zenbuGo
        ? "全てGO · capped"
        : ops?.autonomousOrchestratorEnabled
          ? `every ${ops.autonomousOrchestratorIntervalMinutes ?? 30}m via SideBot`
          : "node scripts/shikishima-phase-go.mjs ack autonomous_orchestrator"
    },
    {
      id: "dev_pipeline",
      label: "Dev pipeline (subscription)",
      status:
        devPipelineEnabled && claudeLoggedIn
          ? "READY"
          : devPipelineEnabled
            ? "PARTIAL"
            : "HOLD",
      humanGoRequired: false,
      note: devPipelineEnabled
        ? claudeLoggedIn
          ? `ON · claude OK${winAgentPresent ? (winAgentLoggedIn ? " · win agent login OK" : " · win agent login optional") : ""}`
          : "ON — WSL claude login required"
        : "SHIKISHIMA_DEV_PIPELINE_ENABLED=1"
    },
    {
      id: "codex_leg",
      label: "Codex WSL worker leg",
      status: wslCodexPresent ? (codexLoggedIn ? "READY" : "PARTIAL") : "HOLD",
      humanGoRequired: !codexLoggedIn,
      note: wslCodexPresent
        ? codexLoggedIn
          ? "wsl-codex-cli login OK (bounded worker only)"
          : "installed — run in WSL: codex login"
        : "codex CLI not in preflight"
    },
    {
      id: "unbounded_discord",
      label: "24/7 unbounded Discord send",
      status: "BLOCKED",
      humanGoRequired: false,
      note: "capped scheduler only"
    }
  ];

  const openGaps = items.filter(
    (i) =>
      i.status === "HOLD" &&
      i.id !== "codex_leg" &&
      i.id !== "obsidian_write" &&
      i.id !== "unbounded_discord"
  ).length;

  let decisionForAutomation = "HOLD";
  const constitutionalReady = constitutionalActive && scopes.length >= 8;
  if (zenbuGo && constitutionalReady && burnReady && openGaps === 0) {
    decisionForAutomation = "GO";
  } else if (trackDActive && constitutionalReady && burnReady && openGaps === 0) {
    decisionForAutomation = "GO_PREPARED";
  } else if (trackDActive || constitutionalActive || zenbuGo) {
    decisionForAutomation = "PARTIAL";
  }

  return {
    generatedAtIso: new Date().toISOString(),
    items,
    decisionForAutomation,
    openGaps,
    constitutionalActive,
    operationalActivated: trackDActive,
    source: "scripts/lib/human-go-readiness-report.mjs"
  };
}
