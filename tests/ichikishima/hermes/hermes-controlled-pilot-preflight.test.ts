import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import type { HermesControlledPilotConfig } from "../../../src/main/ichikishima/hermes/hermes-controlled-pilot-config";
import { evaluateHermesControlledPilotPreflight } from "../../../src/main/ichikishima/hermes/hermes-controlled-pilot-preflight";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "../../../");
const ZONE = join(REPO_ROOT, "sandbox/hermes-autonomy-zone");

function fullConfig(): HermesControlledPilotConfig {
  return {
    executablePath: join(ZONE, "tmp/hermes-preflight-exe"),
    allowedExecutableId: "pf-id",
    argv: ["--mode", "bridge-payload-once"],
    cwd: ZONE,
    zoneRoot: ZONE,
    projectRoot: REPO_ROOT,
    timeoutMs: 8000,
    maxStdoutBytes: 4096,
    maxStderrBytes: 2048,
    humanSignoffConfirmed: true,
    enableRealProcessExecution: true,
    signoffAtUnixMs: 1_700_000_000_000,
    signoffSource: "HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md §12",
    operatorLabel: "user",
  };
}

const allTrueContext = {
  humanSignoffRecordedForSingleControlledRun: true,
  hermesArgvAndStdoutContractAcknowledged: true,
  bridgePayloadSchemaV1PolicyAcknowledged: true,
  receiverQueueContractsAcknowledged: true,
  controlledPilotAdapterCodeDeployed: true,
  ipcHermesIngressDisconnected: true,
} as const;

describe("hermes-controlled-pilot-preflight", () => {
  it("NO_GO when config invalid", () => {
    const r = evaluateHermesControlledPilotPreflight(
      { ...fullConfig(), executablePath: "" },
      allTrueContext,
    );
    expect(r.status).toBe("NO_GO");
    expect(r.canRunOnce).toBe(false);
  });

  it("NO_GO when context incomplete", () => {
    const r = evaluateHermesControlledPilotPreflight(fullConfig(), {
      ...allTrueContext,
      ipcHermesIngressDisconnected: false,
    });
    expect(r.status).toBe("NO_GO");
    expect(r.canRunOnce).toBe(false);
  });

  it("GO_READY when all satisfied (still no exec in this module)", () => {
    const r = evaluateHermesControlledPilotPreflight(
      fullConfig(),
      allTrueContext,
    );
    expect(r.status).toBe("GO_READY");
    expect(r.canRunOnce).toBe(true);
    expect(r.warnings.some((w) => w.includes("does_not_invoke"))).toBe(true);
  });
});
