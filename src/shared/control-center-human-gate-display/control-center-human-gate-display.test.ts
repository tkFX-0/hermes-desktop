import { describe, expect, it } from "vitest";
import {
  discordSendRejectedContract,
  docsOnlySafeContract,
  executionEnabledRejectedContract,
  missingStopConditionsHoldContract,
  missingVerificationHoldContract,
  productionReadyRejectedContract,
  pushAttemptRejectedContract,
  runtimeStartRejectedContract,
  sourceAndTestsSafeContract,
  sourceWithPackageChangeHoldContract,
  workerTaskContractFixtures
} from "../worker-task-contract/worker-task-contract-fixtures";
import type { WorkerTaskContract } from "../worker-task-contract/worker-task-contract-types";
import type { GoalRunnerDryRunInput } from "../goal-runner-dry-run/goal-runner-dry-run-types";
import { createHumanGateQueueDisplayTargetItemFromContract } from "../human-gate-queue-display-target/human-gate-queue-display-target";
import {
  createControlCenterHumanGateDisplayItem,
  createControlCenterHumanGateDisplayItemFromContract
} from "./control-center-human-gate-display";

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

function expectDisplayInvariants(
  display: ReturnType<typeof createControlCenterHumanGateDisplayItem>
): void {
  expect(display.displayOnly).toBe(true);
  expect(display.uiConnected).toBe(false);
  expect(display.ipcConnected).toBe(false);
  expect(display.actualQueueMutation).toBe(false);
  expect(display.canApprovePush).toBe(false);
  expect(display.canApproveRuntime).toBe(false);
  expect(display.canApproveExternalWrite).toBe(false);
  expect(display.productionReady).toBe(false);
  expect(display.execution).toBe("disabled");
  expect(display.rawValuesReported).toBe(false);
  expect(display.redacted).toBe(true);
}

describe("control center human gate display", () => {
  it("creates display item for safe fixture", () => {
    const display = createControlCenterHumanGateDisplayItemFromContract(
      makeDryRunInput(docsOnlySafeContract)
    );

    expect(display.goalId).toBe(docsOnlySafeContract.goalId);
    expect(display.gateId).toContain(docsOnlySafeContract.goalId);
    expect(["PREVIEW_ONLY", "READY_FOR_REVIEW"]).toContain(display.status);
    expectDisplayInvariants(display);
  });

  it("creates display item for sourceAndTestsSafeContract", () => {
    const display = createControlCenterHumanGateDisplayItemFromContract(
      makeDryRunInput(sourceAndTestsSafeContract)
    );

    expect(display.summary.length).toBeGreaterThan(0);
    expectDisplayInvariants(display);
  });

  it("creates HOLD display item for sourceWithPackageChangeHoldContract", () => {
    const display = createControlCenterHumanGateDisplayItemFromContract(
      makeDryRunInput(sourceWithPackageChangeHoldContract)
    );

    expect(display.status).toBe("HOLD");
    expect(display.canApproveProceed).toBe(false);
    expectDisplayInvariants(display);
  });

  it("creates HOLD or REJECTED display item for pushAttemptRejectedContract", () => {
    const display = createControlCenterHumanGateDisplayItemFromContract(
      makeDryRunInput(pushAttemptRejectedContract)
    );

    expect(["HOLD", "REJECTED"]).toContain(display.status);
    expect(display.canApproveProceed).toBe(false);
    expectDisplayInvariants(display);
  });

  it("creates HOLD or REJECTED display item for runtimeStartRejectedContract", () => {
    const display = createControlCenterHumanGateDisplayItemFromContract(
      makeDryRunInput(runtimeStartRejectedContract)
    );

    expect(["HOLD", "REJECTED"]).toContain(display.status);
    expectDisplayInvariants(display);
  });

  it("creates HOLD or REJECTED display item for discordSendRejectedContract", () => {
    const display = createControlCenterHumanGateDisplayItemFromContract(
      makeDryRunInput(discordSendRejectedContract)
    );

    expect(["HOLD", "REJECTED"]).toContain(display.status);
    expect(display.requiredHumanGates).toContain("Discord Send GO");
    expectDisplayInvariants(display);
  });

  it("creates HOLD or REJECTED display item for productionReadyRejectedContract", () => {
    const display = createControlCenterHumanGateDisplayItemFromContract(
      makeDryRunInput(productionReadyRejectedContract)
    );

    expect(["HOLD", "REJECTED"]).toContain(display.status);
    expectDisplayInvariants(display);
  });

  it("creates HOLD or REJECTED display item for executionEnabledRejectedContract", () => {
    const display = createControlCenterHumanGateDisplayItemFromContract(
      makeDryRunInput(executionEnabledRejectedContract)
    );

    expect(["HOLD", "REJECTED"]).toContain(display.status);
    expectDisplayInvariants(display);
  });

  it("creates HOLD display item for missingVerificationHoldContract", () => {
    expect(
      createControlCenterHumanGateDisplayItemFromContract(
        makeDryRunInput(missingVerificationHoldContract)
      ).status
    ).toBe("HOLD");
  });

  it("creates HOLD display item for missingStopConditionsHoldContract", () => {
    expect(
      createControlCenterHumanGateDisplayItemFromContract(
        makeDryRunInput(missingStopConditionsHoldContract)
      ).status
    ).toBe("HOLD");
  });

  it("always records display invariants on every fixture", () => {
    for (const contract of Object.values(workerTaskContractFixtures)) {
      expectDisplayInvariants(
        createControlCenterHumanGateDisplayItemFromContract(makeDryRunInput(contract))
      );
    }
  });

  it("does not mutate queue display target input", () => {
    const queueItem = createHumanGateQueueDisplayTargetItemFromContract(
      makeDryRunInput(pushAttemptRejectedContract)
    );
    const before = JSON.stringify(queueItem);

    createControlCenterHumanGateDisplayItem(queueItem);

    expect(JSON.stringify(queueItem)).toBe(before);
  });
});
