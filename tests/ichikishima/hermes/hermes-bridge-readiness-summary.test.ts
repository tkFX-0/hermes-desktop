import { randomUUID } from "node:crypto";
import path from "node:path";
import { rmSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1 } from "../../../src/main/ichikishima/hermes/hermes-bridge-payload";
import {
  createHermesBridgeReadinessSummaryForControlCenter,
  createHermesBridgeScenarioSuiteSummaryForControlCenter,
  createHermesConnectionAdapterSummaryForControlCenter,
} from "../../../src/main/ichikishima/hermes/hermes-bridge-readiness-summary";
import { runHermesBridgePilotDryRunSuite } from "../../../src/main/ichikishima/hermes/hermes-bridge-pilot-dry-run";
import { validateHermesConnectionAdapterInput } from "../../../src/main/ichikishima/hermes/hermes-connection-adapter";

describe("hermes-bridge-readiness-summary (safe Control Center aggregates)", () => {
  const projectRoot = path.resolve(__dirname, "../../..");

  it("readiness summary JSON never exposes allowed/forbidden arrays", () => {
    const s = createHermesBridgeReadinessSummaryForControlCenter({
      projectRoot,
    });

    expect(s.productionMode).toBe("fail_closed");
    const j = JSON.stringify(s);

    expect(j).not.toMatch(/"allowedApis"/);
    expect(j).not.toMatch(/"forbiddenApis"/);
    expect(s.adapterStage).toBe("stage_0_in_memory");
    expect(["dry_run_only", "disabled"]).toContain(s.partialMode);
    expect(Number.isFinite(s.blockerCount)).toBe(true);
  });

  it("scenario suite summary uses label string only", () => {
    expect(
      JSON.stringify(
        createHermesBridgeScenarioSuiteSummaryForControlCenter(null),
      ),
    ).not.toContain("scenarioResults");

    const suffix = randomUUID();
    const zoneRoot = path.join(projectRoot, "sandbox", "hermes-autonomy-zone");
    const approvalSd = `.vitest-sum-${suffix}`;
    const auditSd = `.vitest-suma-${suffix}`;

    try {
      const suite = runHermesBridgePilotDryRunSuite({
        projectRoot,
        zoneRoot,
        dateUtc: "2099-01-01",
        approvalSubdirectory: approvalSd,
        auditSubdirectory: auditSd,
        taskIdSuffix: suffix.slice(0, 12),
      });
      const agg = createHermesBridgeScenarioSuiteSummaryForControlCenter(suite);

      expect(["passed", "failed"]).toContain(agg.lastDryRunStatus);
      const j = JSON.stringify(agg);
      expect(j).not.toMatch(/operation/i);
      expect(j.length).toBeLessThan(400);
    } finally {
      rmSync(path.join(zoneRoot, approvalSd), { recursive: true, force: true });
      rmSync(path.join(zoneRoot, auditSd), { recursive: true, force: true });
    }
  });

  it("adapter Control Center summary omits enqueue payload structure", () => {
    const pl = JSON.stringify({
      payloadSchemaVersion: HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1,
      taskId: `ad-${randomUUID().slice(0, 8)}`,
      title: "t",
      description: "d",
      actor: "hermes",
      requestedOperations: [
        { kind: "zone_read", requestedPath: "sample/input.txt" },
      ],
    });

    const ar = validateHermesConnectionAdapterInput({
      kind: "in_memory",
      payloadWire: pl,
    });

    const wire = createHermesConnectionAdapterSummaryForControlCenter(ar);
    expect(wire).not.toBe(null);
    const j = JSON.stringify(wire);
    expect(j).not.toContain("requestedOperations");
    expect(j).not.toContain(HERMES_BRIDGE_PAYLOAD_SCHEMA_VERSION_V1);
    expect(j).not.toContain("sample/input.txt");
    expect(Number.isFinite(wire!.operationCount)).toBe(true);
  });
});
