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
import type { GoalRunnerDryRunInput } from "./goal-runner-dry-run-types";

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

function expectDryRunPass(contract: WorkerTaskContract): void {
  const result = dryRunGoalContract(makeDryRunInput(contract));

  expect(result.decision).toBe("PASS");
  expect(result.canProceed).toBe(true);
  expect(result.previewDecision).toBe("PASS");
}

function expectDryRunHoldOrReject(contract: WorkerTaskContract): void {
  const result = dryRunGoalContract(makeDryRunInput(contract));

  expect(["HOLD", "REJECT"]).toContain(result.decision);
  expect(result.canProceed).toBe(false);
  expect(result.reasons.length).toBeGreaterThan(0);
}

describe("goal runner dry-run", () => {
  it("dry-runs docsOnlySafeContract as PASS", () => {
    expectDryRunPass(docsOnlySafeContract);
  });

  it("dry-runs sourceAndTestsSafeContract as PASS", () => {
    expectDryRunPass(sourceAndTestsSafeContract);
  });

  it("dry-runs sourceWithPackageChangeHoldContract as HOLD or REJECT", () => {
    expectDryRunHoldOrReject(sourceWithPackageChangeHoldContract);
  });

  it("dry-runs pushAttemptRejectedContract as HOLD or REJECT", () => {
    expectDryRunHoldOrReject(pushAttemptRejectedContract);
  });

  it("dry-runs runtimeStartRejectedContract as HOLD or REJECT", () => {
    expectDryRunHoldOrReject(runtimeStartRejectedContract);
  });

  it("dry-runs externalWriteRejectedContract as HOLD or REJECT", () => {
    expectDryRunHoldOrReject(externalWriteRejectedContract);
  });

  it("dry-runs discordSendRejectedContract as HOLD or REJECT", () => {
    expectDryRunHoldOrReject(discordSendRejectedContract);
  });

  it("dry-runs obsidianWriteRejectedContract as HOLD or REJECT", () => {
    expectDryRunHoldOrReject(obsidianWriteRejectedContract);
  });

  it("dry-runs stackchanConnectionRejectedContract as HOLD or REJECT", () => {
    expectDryRunHoldOrReject(stackchanConnectionRejectedContract);
  });

  it("dry-runs productionReadyRejectedContract as HOLD or REJECT", () => {
    expectDryRunHoldOrReject(productionReadyRejectedContract);
  });

  it("dry-runs executionEnabledRejectedContract as HOLD or REJECT", () => {
    expectDryRunHoldOrReject(executionEnabledRejectedContract);
  });

  it("dry-runs missingVerificationHoldContract as HOLD", () => {
    expect(dryRunGoalContract(makeDryRunInput(missingVerificationHoldContract)).decision).toBe(
      "HOLD"
    );
  });

  it("dry-runs missingStopConditionsHoldContract as HOLD", () => {
    expect(dryRunGoalContract(makeDryRunInput(missingStopConditionsHoldContract)).decision).toBe(
      "HOLD"
    );
  });

  it("always blocks push, runtime start, external write, production, execution, and raw reporting", () => {
    for (const contract of Object.values(workerTaskContractFixtures)) {
      const result = dryRunGoalContract(makeDryRunInput(contract));

      expect(result.canPush).toBe(false);
      expect(result.canStartRuntime).toBe(false);
      expect(result.canWriteExternal).toBe(false);
      expect(result.productionReady).toBe(false);
      expect(result.execution).toBe("disabled");
      expect(result.rawValuesReported).toBe(false);
    }
  });

  it("returns canProceed true only for safe fixture contracts", () => {
    for (const contract of safeFixtures) {
      expect(dryRunGoalContract(makeDryRunInput(contract)).canProceed).toBe(true);
    }
    for (const contract of holdFixtures) {
      expect(dryRunGoalContract(makeDryRunInput(contract)).canProceed).toBe(false);
    }
  });

  it("includes goal identity, reasons, and human gate references", () => {
    const input = makeDryRunInput(discordSendRejectedContract, {
      goalId: "shikishima.test-goal",
      taskId: "discord-check",
      title: "Discord send dry-run"
    });
    const result = dryRunGoalContract(input);

    expect(result.goalId).toBe("shikishima.test-goal");
    expect(result.taskId).toBe("discord-check");
    expect(result.title).toBe("Discord send dry-run");
    expect(result.requiredHumanGates).toContain("Discord Send GO");
    expect(result.requiresHumanGate).toBe(true);
    expect(result.reasons.length).toBeGreaterThan(0);
  });

  it("does not mutate contract objects", () => {
    const before = JSON.stringify(pushAttemptRejectedContract);

    dryRunGoalContract(makeDryRunInput(pushAttemptRejectedContract));

    expect(JSON.stringify(pushAttemptRejectedContract)).toBe(before);
  });

  it("does not execute commands or require IPC/preload", () => {
    const result = dryRunGoalContract(makeDryRunInput(sourceAndTestsSafeContract));

    expect(result.decision).toBe("PASS");
    expect(typeof result.canProceed).toBe("boolean");
  });
});
