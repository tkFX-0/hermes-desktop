import { randomUUID } from "node:crypto";
import path from "node:path";
import { rmSync } from "node:fs";

import { afterEach, describe, expect, it } from "vitest";

import { evaluateReviewMode } from "../../../src/main/ichikishima/review/review-mode";
import {
  HERMES_BRIDGE_PILOT_NEXT_DRY_RUN_SCENARIOS_LABEL,
  runHermesBridgePilotDryRunScenario,
  runHermesBridgePilotDryRunSuite,
  summarizeHermesBridgePilotDryRunForControlCenterSnapshot,
} from "../../../src/main/ichikishima/hermes/hermes-bridge-pilot-dry-run";
describe("Hermes Bridge Pilot Dry-run next stage", () => {
  const projectRoot = path.resolve(__dirname, "../../..");
  const zoneRoot = path.join(projectRoot, "sandbox", "hermes-autonomy-zone");
  const suffix = randomUUID();

  const approvalSd = `.vitest-hbpd-${suffix}-ap`;
  const auditSd = `.vitest-hbpd-${suffix}-au`;
  const dateUtc = "2099-05-20";
  const ctx = {
    projectRoot,
    zoneRoot,
    dateUtc,
    approvalSubdirectory: approvalSd,
    auditSubdirectory: auditSd,
    taskIdSuffix: suffix.slice(0, 12),
  };

  afterEach(() => {
    rmSync(path.join(zoneRoot, approvalSd), { recursive: true, force: true });
    rmSync(path.join(zoneRoot, auditSd), { recursive: true, force: true });
  });

  it("runs Scenario A — safe read/write, audit, approval chain", () => {
    const row = runHermesBridgePilotDryRunScenario(
      "scenario_a_safe_file_task",
      ctx,
    );
    expect(row.status).toBe("passed");
    expect(row.requiresUserApproval).toBe(true);
    expect(row.autoExecutable).toBe(false);
    expect(row.shouldSpeak).toBe(false);
    expect(row.pilotStatus).toBe("completed");
    expect(row.reportsCreated).toBe(1);
    expect(row.reviewModeDecision).not.toBeNull();
  });

  it("runs Scenario B — blocked operations land in approval stubs / queue", () => {
    const row = runHermesBridgePilotDryRunScenario(
      "scenario_b_blocked_operations",
      ctx,
    );
    expect(row.status).toBe("passed");
    expect(row.blockedResults.length).toBeGreaterThanOrEqual(4);
    expect(row.approvalsCreated).toBeGreaterThan(3);
  });

  it("runs Scenario C — dependency / external escalation enqueue only", () => {
    const row = runHermesBridgePilotDryRunScenario(
      "scenario_c_bridge_requires_approval",
      ctx,
    );
    expect(row.status).toBe("passed");
    expect(row.bridgeRequiresApprovalResults.length).toBeGreaterThanOrEqual(2);
  });

  it("runs Scenario D — forbidden operations short-circuit pilot", () => {
    const row = runHermesBridgePilotDryRunScenario(
      "scenario_d_forbidden_classification",
      ctx,
    );
    expect(row.status).toBe("passed");
    expect(row.pilotStatus).toBe("failed");
    expect(row.forbiddenResults).toHaveLength(0);
    expect(row.reportsCreated).toBe(0);
  });

  it("runs Scenario E — mixed classification still summaries safely", () => {
    const row = runHermesBridgePilotDryRunScenario(
      "scenario_e_mixed_classification",
      ctx,
    );
    expect(row.status).toBe("passed");
    expect(row.pilotStatus).toBe("partial");
    expect(row.forbiddenResults.length).toBeGreaterThan(0);
    expect(row.blockedResults.length).toBeGreaterThan(0);
    expect(row.bridgeRequiresApprovalResults.length).toBeGreaterThan(1);

    const wired = JSON.stringify(row);
    expect(wired).not.toMatch(/dry-run-e extra write/);
  });

  it("runs full A–E suite with control-center snapshot stub", () => {
    const suite = runHermesBridgePilotDryRunSuite(ctx);

    expect(suite.requiresUserApproval).toBe(true);
    expect(suite.autoExecutable).toBe(false);
    expect(suite.shouldSpeak).toBe(false);

    if (suite.readinessReady && suite.readinessLabel !== "NOT_READY") {
      expect(suite.status).toBe("passed");
      expect(suite.summary).toContain(
        HERMES_BRIDGE_PILOT_NEXT_DRY_RUN_SCENARIOS_LABEL,
      );
    } else {
      expect(suite.status).toBe("failed");
    }

    const snapshot =
      summarizeHermesBridgePilotDryRunForControlCenterSnapshot(suite);
    expect(snapshot.length).toBeGreaterThan(40);
    expect(snapshot).not.toMatch(/content/i);
  });

  it("pipes dry-run summaries into Review Mode without crashing", () => {
    const suite = runHermesBridgePilotDryRunSuite(ctx);
    const review = evaluateReviewMode({
      reportText: suite.summary,
      changedFiles: [],
      executedTests: [
        "tests/ichikishima/hermes/hermes-bridge-pilot-dry-run.test.ts",
      ],
      unexecutedTests: ["Electron_UI"],
      untouchedImportantAreas: ["EA", "MT5", "Hermes runtime"],
      rollbackPlan: "drop vitest approval/audit dirs",
      codeChanged: true,
      docsOnly: false,
    });
    expect(review.decision).toBeTruthy();
  });
});
