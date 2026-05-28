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
    source: "default",
    activatedAtIso: null,
    humanGoNote: null
  };
}

function readLocalRelease(): Partial<{
  trackDGoAcknowledged: boolean;
  executionEnabled: boolean;
  productionReady: boolean;
  activatedAtIso: string;
  humanGoNote: string;
}> | null {
  const path = join(process.cwd(), LOCAL_REL);
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8")) as ReturnType<typeof readLocalRelease>;
  } catch {
    return null;
  }
}

export function resolveOperationalRelease(_cwd = process.cwd()): OperationalReleaseState {
  if (process.env.VITEST === "true") {
    return defaultOperationalRelease();
  }

  const local = readLocalRelease();
  if (
    local?.trackDGoAcknowledged === true &&
    local?.executionEnabled === true &&
    local?.productionReady === true
  ) {
    return {
      activated: true,
      executionEnabled: true,
      productionReady: true,
      rawValuesReported: false,
      source: "local_file",
      activatedAtIso: local.activatedAtIso ?? null,
      humanGoNote: local.humanGoNote ?? null
    };
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
      source: "env",
      activatedAtIso: new Date().toISOString(),
      humanGoNote: "env_track_d"
    };
  }

  return defaultOperationalRelease();
}
