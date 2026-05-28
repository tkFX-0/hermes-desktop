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

  return {
    activated: trackDActive,
    executionEnabled: trackDActive,
    productionReady: trackDActive,
    rawValuesReported: false,
    sidebotHoldReleased: local.sidebotHoldReleased === true,
    hermesDaemonPilotEnabled: local.hermesDaemonPilotEnabled === true,
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
    return {
      activated: true,
      executionEnabled: true,
      productionReady: true,
      rawValuesReported: false,
      sidebotHoldReleased: process.env.SIDEBOT_HOLD === "0",
      hermesDaemonPilotEnabled: process.env.SHIKISHIMA_HERMES_DAEMON_PILOT === "1",
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
