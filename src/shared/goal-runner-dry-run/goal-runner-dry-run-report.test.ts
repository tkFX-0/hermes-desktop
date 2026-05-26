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
import { dryRunGoalContract } from "./goal-runner-dry-run";
import {
  createGoalRunnerDryRunReport,
  createGoalRunnerDryRunReportFromContract
} from "./goal-runner-dry-run-report";
import type { GoalRunnerDryRunInput, GoalRunnerDryRunResult } from "./goal-runner-dry-run-types";

const safeFixtures = [docsOnlySafeContract, sourceAndTestsSafeContract];

const holdFixtures = [
  sourceWithPackageChangeHoldContract,
  pushAttemptRejectedContract,
  runtimeStartRejectedContract,
  externalWriteRejectedContract,
  discordSendRejectedContract,
  obsidianWriteRejectedContract,
  stackchanConnectionRejectedContract,
  productionReadyRejectedContract,
  executionEnabledRejectedContract,
  missingVerificationHoldContract,
  missingStopConditionsHoldContract
];

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

function expectReportPass(contract: WorkerTaskContract): void {
  const report = createGoalRunnerDryRunReportFromContract(makeDryRunInput(contract));

  expect(report.status).toBe("PASS");
  expect(report.canProceed).toBe(true);
  expect(report.summary).toContain("PASS");
}

function expectReportHoldOrReject(contract: WorkerTaskContract): void {
  const report = createGoalRunnerDryRunReportFromContract(makeDryRunInput(contract));

  expect(["HOLD", "REJECT"]).toContain(report.status);
  expect(report.canProceed).toBe(false);
  expect(report.reasons.length).toBeGreaterThan(0);
}

function expectReportInvariants(report: ReturnType<typeof createGoalRunnerDryRunReport>): void {
  expect(report.canPush).toBe(false);
  expect(report.canStartRuntime).toBe(false);
  expect(report.canWriteExternal).toBe(false);
  expect(report.safety.productionReady).toBe(false);
  expect(report.safety.execution).toBe("disabled");
  expect(report.safety.rawValuesReported).toBe(false);
  expect(report.safety.runtimeStarted).toBe(false);
  expect(report.safety.externalWrite).toBe(false);
  expect(report.redacted).toBe(true);
}

describe("goal runner dry-run report", () => {
  it("creates PASS report for docsOnlySafeContract", () => {
    expectReportPass(docsOnlySafeContract);
  });

  it("creates PASS report for sourceAndTestsSafeContract", () => {
    expectReportPass(sourceAndTestsSafeContract);
  });

  it("creates HOLD or REJECT report for sourceWithPackageChangeHoldContract", () => {
    expectReportHoldOrReject(sourceWithPackageChangeHoldContract);
  });

  it("creates HOLD or REJECT report for pushAttemptRejectedContract", () => {
    expectReportHoldOrReject(pushAttemptRejectedContract);
  });

  it("creates HOLD or REJECT report for runtimeStartRejectedContract", () => {
    expectReportHoldOrReject(runtimeStartRejectedContract);
  });

  it("creates HOLD or REJECT report for externalWriteRejectedContract", () => {
    expectReportHoldOrReject(externalWriteRejectedContract);
  });

  it("creates HOLD or REJECT report for discordSendRejectedContract", () => {
    expectReportHoldOrReject(discordSendRejectedContract);
  });

  it("creates HOLD or REJECT report for obsidianWriteRejectedContract", () => {
    expectReportHoldOrReject(obsidianWriteRejectedContract);
  });

  it("creates HOLD or REJECT report for stackchanConnectionRejectedContract", () => {
    expectReportHoldOrReject(stackchanConnectionRejectedContract);
  });

  it("creates HOLD or REJECT report for productionReadyRejectedContract", () => {
    expectReportHoldOrReject(productionReadyRejectedContract);
  });

  it("creates HOLD or REJECT report for executionEnabledRejectedContract", () => {
    expectReportHoldOrReject(executionEnabledRejectedContract);
  });

  it("creates HOLD report for missingVerificationHoldContract", () => {
    expect(
      createGoalRunnerDryRunReportFromContract(makeDryRunInput(missingVerificationHoldContract))
        .status
    ).toBe("HOLD");
  });

  it("creates HOLD report for missingStopConditionsHoldContract", () => {
    expect(
      createGoalRunnerDryRunReportFromContract(makeDryRunInput(missingStopConditionsHoldContract))
        .status
    ).toBe("HOLD");
  });

  it("always records safety invariants on every fixture report", () => {
    for (const contract of Object.values(workerTaskContractFixtures)) {
      expectReportInvariants(
        createGoalRunnerDryRunReportFromContract(makeDryRunInput(contract))
      );
    }
  });

  it("returns canProceed true only for safe fixture reports", () => {
    for (const contract of safeFixtures) {
      expect(
        createGoalRunnerDryRunReportFromContract(makeDryRunInput(contract)).canProceed
      ).toBe(true);
    }
    for (const contract of holdFixtures) {
      expect(
        createGoalRunnerDryRunReportFromContract(makeDryRunInput(contract)).canProceed
      ).toBe(false);
    }
  });

  it("preserves goal identity, reasons, and human gate references", () => {
    const input = makeDryRunInput(discordSendRejectedContract, {
      goalId: "shikishima.test-goal",
      taskId: "discord-report",
      title: "Discord send report fixture"
    });
    const report = createGoalRunnerDryRunReportFromContract(input);

    expect(report.goalId).toBe("shikishima.test-goal");
    expect(report.taskId).toBe("discord-report");
    expect(report.title).toBe("Discord send report fixture");
    expect(report.requiredHumanGates).toContain("Discord Send GO");
    expect(report.requiresHumanGate).toBe(true);
    expect(report.reasons.length).toBeGreaterThan(0);
  });

  it("does not mutate dry-run input or result", () => {
    const input = makeDryRunInput(pushAttemptRejectedContract);
    const inputBefore = JSON.stringify(input);
    const result = dryRunGoalContract(input);
    const resultBefore = JSON.stringify(result);

    createGoalRunnerDryRunReport(result);
    createGoalRunnerDryRunReportFromContract(input);

    expect(JSON.stringify(input)).toBe(inputBefore);
    expect(JSON.stringify(result)).toBe(resultBefore);
  });

  it("does not execute commands or require IPC/preload", () => {
    const result: GoalRunnerDryRunResult = dryRunGoalContract(
      makeDryRunInput(sourceAndTestsSafeContract)
    );
    const report = createGoalRunnerDryRunReport(result);

    expect(report.status).toBe("PASS");
    expect(typeof report.summary).toBe("string");
  });
});
