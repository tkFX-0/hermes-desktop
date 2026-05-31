/**
 * Track D — operational release (local file or env). Human GO required to activate.
 * StackChan voice pilot paths may still pass productionReady:false at device layer.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export interface OperationalReleaseState {
  activated: boolean;
  executionEnabled: boolean;
  productionReady: boolean;
  rawValuesReported: false;
  sidebotHoldReleased: boolean;
  hermesDaemonPilotEnabled: boolean;
  /** Prepared schedule — runs only when Track D active and enabled in ops file. */
  agentTeamTickEnabled: boolean;
  agentTeamTickIntervalMinutes: number;
  /** SideBot spawns capped orchestrator on interval (no Discord send). */
  autonomousOrchestratorEnabled: boolean;
  autonomousOrchestratorIntervalMinutes: number;
  source: "default" | "env" | "local_file";
  activatedAtIso: string | null;
  humanGoNote: string | null;
}

const LOCAL_REL = join(".shikishima-memory", "operational-release.local.json");

function defaultOperationalRelease(): OperationalReleaseState {
  return {
    activated: false,
    executionEnabled: false,
    productionReady: false,
    rawValuesReported: false,
    sidebotHoldReleased: false,
    hermesDaemonPilotEnabled: false,
    agentTeamTickEnabled: false,
    agentTeamTickIntervalMinutes: 360,
    autonomousOrchestratorEnabled: false,
    autonomousOrchestratorIntervalMinutes: 30,
    source: "default",
    activatedAtIso: null,
    humanGoNote: null
  };
}

function readLocalRelease(projectRoot: string): Partial<{
  trackDGoAcknowledged: boolean;
  executionEnabled: boolean;
  productionReady: boolean;
  sidebotHoldReleased: boolean;
  hermesDaemonPilotEnabled: boolean;
  agentTeamTickEnabled: boolean;
  agentTeamTickIntervalMinutes: number;
  autonomousOrchestratorEnabled: boolean;
  autonomousOrchestratorIntervalMinutes: number;
  activatedAtIso: string;
  humanGoNote: string;
}> | null {
  const path = join(projectRoot, LOCAL_REL);
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8")) as ReturnType<typeof readLocalRelease>;
  } catch {
    return null;
  }
}

function buildFromLocal(
  local: NonNullable<ReturnType<typeof readLocalRelease>>
): OperationalReleaseState {
  const trackDActive =
    local.trackDGoAcknowledged === true &&
    local.executionEnabled === true &&
    local.productionReady === true;

  const interval =
    typeof local.agentTeamTickIntervalMinutes === "number" &&
    local.agentTeamTickIntervalMinutes >= 15
      ? local.agentTeamTickIntervalMinutes
      : 360;

  const orchInterval =
    typeof local.autonomousOrchestratorIntervalMinutes === "number" &&
    local.autonomousOrchestratorIntervalMinutes >= 5
      ? local.autonomousOrchestratorIntervalMinutes
      : 30;

  return {
    activated: trackDActive,
    executionEnabled: trackDActive,
    productionReady: trackDActive,
    rawValuesReported: false,
    sidebotHoldReleased: local.sidebotHoldReleased === true,
    hermesDaemonPilotEnabled: local.hermesDaemonPilotEnabled === true,
    agentTeamTickEnabled: trackDActive && local.agentTeamTickEnabled === true,
    agentTeamTickIntervalMinutes: interval,
    autonomousOrchestratorEnabled:
      trackDActive && local.autonomousOrchestratorEnabled === true,
    autonomousOrchestratorIntervalMinutes: orchInterval,
    source: "local_file",
    activatedAtIso: local.activatedAtIso ?? null,
    humanGoNote: local.humanGoNote ?? null
  };
}

export function resolveOperationalRelease(projectRoot = process.cwd()): OperationalReleaseState {
  if (process.env.VITEST === "true") {
    return defaultOperationalRelease();
  }

  const local = readLocalRelease(projectRoot);
  if (local?.trackDGoAcknowledged === true) {
    return buildFromLocal(local);
  }

  const envGo =
    process.env.SHIKISHIMA_TRACK_D_GO === "1" &&
    process.env.SHIKISHIMA_EXECUTION_ENABLED === "1" &&
    process.env.SHIKISHIMA_PRODUCTION_READY === "1";

  if (envGo) {
    const envInterval = Number(process.env.SHIKISHIMA_AGENT_TEAM_TICK_INTERVAL_MIN ?? "360");
    return {
      activated: true,
      executionEnabled: true,
      productionReady: true,
      rawValuesReported: false,
      sidebotHoldReleased: process.env.SIDEBOT_HOLD === "0",
      hermesDaemonPilotEnabled: process.env.SHIKISHIMA_HERMES_DAEMON_PILOT === "1",
      agentTeamTickEnabled: process.env.SHIKISHIMA_AGENT_TEAM_TICK_ENABLED === "1",
      agentTeamTickIntervalMinutes:
        Number.isFinite(envInterval) && envInterval >= 15 ? envInterval : 360,
      source: "env",
      activatedAtIso: new Date().toISOString(),
      humanGoNote: "env_track_d"
    };
  }

  return defaultOperationalRelease();
}

export function isSidebotHoldActive(projectRoot = process.cwd()): boolean {
  if (process.env.SIDEBOT_HOLD === "0") return false;
  const release = resolveOperationalRelease(projectRoot);
  return !release.sidebotHoldReleased;
}
