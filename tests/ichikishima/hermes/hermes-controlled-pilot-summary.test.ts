import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import type { HermesControlledPilotConfig } from "../../../src/main/ichikishima/hermes/hermes-controlled-pilot-config";
import { evaluateHermesControlledPilotPreflight } from "../../../src/main/ichikishima/hermes/hermes-controlled-pilot-preflight";
import { buildHermesControlledPilotDashboardSummary } from "../../../src/main/ichikishima/hermes/hermes-controlled-pilot-summary";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "../../../");
const ZONE = join(REPO_ROOT, "sandbox/hermes-autonomy-zone");

function sampleConfig(): HermesControlledPilotConfig {
  return {
    executablePath: join(ZONE, "tmp/summary-no-leak-exe"),
    allowedExecutableId: "sum-id",
    argv: ["--mode", "bridge-payload-once"],
    cwd: ZONE,
    zoneRoot: ZONE,
    projectRoot: REPO_ROOT,
    timeoutMs: 5000,
    maxStdoutBytes: 4096,
    maxStderrBytes: 2048,
    humanSignoffConfirmed: true,
    enableRealProcessExecution: true,
    signoffAtUnixMs: 1_700_000_000_000,
    signoffSource: "HERMES_BRIDGE_FINAL_REVIEW_SIGNOFF.md §12",
    operatorLabel: "user",
  };
}

const goContext = {
  humanSignoffRecordedForSingleControlledRun: true,
  hermesArgvAndStdoutContractAcknowledged: true,
  bridgePayloadSchemaV1PolicyAcknowledged: true,
  receiverQueueContractsAcknowledged: true,
  controlledPilotAdapterCodeDeployed: true,
  ipcHermesIngressDisconnected: true,
} as const;

describe("hermes-controlled-pilot-summary", () => {
  it("does not leak absolute executable path in summary JSON", () => {
    const cfg = sampleConfig();
    const pf = evaluateHermesControlledPilotPreflight(cfg, goContext);
    const s = buildHermesControlledPilotDashboardSummary(cfg, pf);
    const wire = JSON.stringify(s);
    expect(wire).not.toContain(cfg.executablePath);
    expect(wire).not.toContain("tmp/summary-no-leak-exe");
    expect(s.productionReady).toBe(false);
    expect(s.ipcConnected).toBe(false);
    expect(s.preparedSafetyOutline.autoExecutionAllowed).toBe(false);
    expect(s.preparedSafetyOutline.productionReady).toBe(false);
  });

  it("redacts fields when config invalid", () => {
    const bad = { ...sampleConfig(), signoffSource: "SECRET_VALUE=1" };
    const s = buildHermesControlledPilotDashboardSummary(bad, null);
    expect(s.signoffSource).toBe("(redacted_until_valid_config)");
    expect(s.allowedExecutableId).toBe("(redacted_until_valid_config)");
  });
});
