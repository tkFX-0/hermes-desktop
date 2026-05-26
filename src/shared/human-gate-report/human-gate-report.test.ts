import { describe, expect, it } from "vitest";
import {
  discordSendRejectedContract,
  docsOnlySafeContract,
  executionEnabledRejectedContract,
  externalWriteRejectedContract,
  missingStopConditionsHoldContract,
  missingVerificationHoldContract,
  obsidianWriteRejectedContract,
  productionReadyRejectedContract,
  pushAttemptRejectedContract,
  runtimeStartRejectedContract,
  sourceAndTestsSafeContract,
  sourceWithPackageChangeHoldContract,
  stackchanConnectionRejectedContract,
  workerTaskContractFixtures
} from "../worker-task-contract/worker-task-contract-fixtures";
import type { WorkerTaskContract } from "../worker-task-contract/worker-task-contract-types";
import { dryRunGoalContract } from "../goal-runner-dry-run/goal-runner-dry-run";
import type { GoalRunnerDryRunInput } from "../goal-runner-dry-run/goal-runner-dry-run-types";
import {
  createGoalRunnerDryRunReport,
  createGoalRunnerDryRunReportFromContract
} from "../goal-runner-dry-run/goal-runner-dry-run-report";
import {
  createHumanGateReportFromContract,
  createHumanGateReportFromDryRunReport
} from "./human-gate-report";

function makeDryRunInput(
  contract: WorkerTaskContract,
  overrides: Partial<GoalRunnerDryRunInput> = {}
): GoalRunnerDryRunInput {
  return {
    goalId: contract.goalId,
    taskId: contract.taskId,
    title: contract.summary,
    contract,
    requestedBy: "composer",
    ...overrides
  };
}

function expectHumanGateReportCreated(contract: WorkerTaskContract): void {
  const report = createHumanGateReportFromContract(makeDryRunInput(contract));

  expect(report.gateId).toContain(contract.goalId);
  expect(report.goalId).toBe(contract.goalId);
  expect(report.taskId).toBe(contract.taskId);
  expect(report.summary.length).toBeGreaterThan(0);
}

function expectHumanGateHoldOrRejected(contract: WorkerTaskContract): void {
  const report = createHumanGateReportFromContract(makeDryRunInput(contract));

  expect(["HOLD", "REJECTED"]).toContain(report.status);
  expect(report.canHumanApproveProceed).toBe(false);
  expect(report.reasons.length).toBeGreaterThan(0);
}

function expectHumanGateInvariants(
  report: ReturnType<typeof createHumanGateReportFromDryRunReport>
): void {
  expect(report.canHumanApprovePush).toBe(false);
  expect(report.canHumanApproveRuntime).toBe(false);
  expect(report.canHumanApproveExternalWrite).toBe(false);
  expect(report.safety.productionReady).toBe(false);
  expect(report.safety.execution).toBe("disabled");
  expect(report.safety.rawValuesReported).toBe(false);
  expect(report.safety.runtimeStarted).toBe(false);
  expect(report.safety.externalWrite).toBe(false);
  expect(report.safety.uiConnected).toBe(false);
  expect(report.safety.ipcConnected).toBe(false);
  expect(report.redacted).toBe(true);
}

describe("human gate report", () => {
  it("creates human gate report for docsOnlySafeContract", () => {
    expectHumanGateReportCreated(docsOnlySafeContract);
    const report = createHumanGateReportFromContract(makeDryRunInput(docsOnlySafeContract));
    expect(["PASS_PREVIEW_ONLY", "READY_FOR_HUMAN_REVIEW"]).toContain(report.status);
  });

  it("creates human gate report for sourceAndTestsSafeContract", () => {
    expectHumanGateReportCreated(sourceAndTestsSafeContract);
  });

  it("creates HOLD human gate report for sourceWithPackageChangeHoldContract", () => {
    expectHumanGateHoldOrRejected(sourceWithPackageChangeHoldContract);
  });

  it("creates HOLD or REJECTED human gate report for pushAttemptRejectedContract", () => {
    expectHumanGateHoldOrRejected(pushAttemptRejectedContract);
  });

  it("creates HOLD or REJECTED human gate report for runtimeStartRejectedContract", () => {
    expectHumanGateHoldOrRejected(runtimeStartRejectedContract);
  });

  it("creates HOLD or REJECTED human gate report for externalWriteRejectedContract", () => {
    expectHumanGateHoldOrRejected(externalWriteRejectedContract);
  });

  it("creates HOLD or REJECTED human gate report for discordSendRejectedContract", () => {
    expectHumanGateHoldOrRejected(discordSendRejectedContract);
  });

  it("creates HOLD or REJECTED human gate report for obsidianWriteRejectedContract", () => {
    expectHumanGateHoldOrRejected(obsidianWriteRejectedContract);
  });

  it("creates HOLD or REJECTED human gate report for stackchanConnectionRejectedContract", () => {
    expectHumanGateHoldOrRejected(stackchanConnectionRejectedContract);
  });

  it("creates HOLD or REJECTED human gate report for productionReadyRejectedContract", () => {
    expectHumanGateHoldOrRejected(productionReadyRejectedContract);
  });

  it("creates HOLD or REJECTED human gate report for executionEnabledRejectedContract", () => {
    expectHumanGateHoldOrRejected(executionEnabledRejectedContract);
  });

  it("creates HOLD human gate report for missingVerificationHoldContract", () => {
    expect(
      createHumanGateReportFromContract(makeDryRunInput(missingVerificationHoldContract)).status
    ).toBe("HOLD");
  });

  it("creates HOLD human gate report for missingStopConditionsHoldContract", () => {
    expect(
      createHumanGateReportFromContract(makeDryRunInput(missingStopConditionsHoldContract)).status
    ).toBe("HOLD");
  });

  it("returns canHumanApproveProceed true only for safe fixture reports with PASS preview", () => {
    for (const contract of [docsOnlySafeContract, sourceAndTestsSafeContract]) {
      const report = createHumanGateReportFromContract(makeDryRunInput(contract));
      if (report.status === "PASS_PREVIEW_ONLY") {
        expect(report.canHumanApproveProceed).toBe(true);
      }
    }
    for (const contract of [
      pushAttemptRejectedContract,
      missingVerificationHoldContract
    ]) {
      expect(
        createHumanGateReportFromContract(makeDryRunInput(contract)).canHumanApproveProceed
      ).toBe(false);
    }
  });

  it("always records safety invariants on every fixture human gate report", () => {
    for (const contract of Object.values(workerTaskContractFixtures)) {
      expectHumanGateInvariants(
        createHumanGateReportFromContract(makeDryRunInput(contract))
      );
    }
  });

  it("preserves gate identity, reasons, and human gate references", () => {
    const dryRunReport = createGoalRunnerDryRunReportFromContract(
      makeDryRunInput(discordSendRejectedContract, {
        goalId: "shikishima.test-goal",
        taskId: "discord-human-gate"
      })
    );
    const report = createHumanGateReportFromDryRunReport(dryRunReport);

    expect(report.gateId).toBe("human-gate:shikishima.test-goal:discord-human-gate");
    expect(report.goalId).toBe("shikishima.test-goal");
    expect(report.taskId).toBe("discord-human-gate");
    expect(report.requiredHumanGates).toContain("Discord Send GO");
    expect(report.sourceDecision).toBe(dryRunReport.status);
    expect(report.reasons.length).toBeGreaterThan(0);
  });

  it("does not mutate dry-run report input", () => {
    const dryRunReport = createGoalRunnerDryRunReport(
      dryRunGoalContract(makeDryRunInput(pushAttemptRejectedContract))
    );
    const before = JSON.stringify(dryRunReport);

    createHumanGateReportFromDryRunReport(dryRunReport);

    expect(JSON.stringify(dryRunReport)).toBe(before);
  });

  it("does not execute commands or require UI or IPC/preload", () => {
    const report = createHumanGateReportFromContract(makeDryRunInput(sourceAndTestsSafeContract));

    expect(report.safety.uiConnected).toBe(false);
    expect(report.safety.ipcConnected).toBe(false);
    expect(typeof report.summary).toBe("string");
  });
});
