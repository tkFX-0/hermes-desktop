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
  createIphoneHumanGateDisplayItem,
  createIphoneHumanGateDisplayItemFromContract
} from "./iphone-human-gate-display";

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

function expectIphoneDisplayInvariants(
  display: ReturnType<typeof createIphoneHumanGateDisplayItem>
): void {
  expect(display.displayOnly).toBe(true);
  expect(display.mobileReady).toBe(true);
  expect(display.uiConnected).toBe(false);
  expect(display.ipcConnected).toBe(false);
  expect(display.networkExposed).toBe(false);
  expect(display.actualQueueMutation).toBe(false);
  expect(display.canApprovePush).toBe(false);
  expect(display.canApproveRuntime).toBe(false);
  expect(display.canApproveExternalWrite).toBe(false);
  expect(display.productionReady).toBe(false);
  expect(display.execution).toBe("disabled");
  expect(display.rawValuesReported).toBe(false);
  expect(display.redacted).toBe(true);
  expect(display.safetyChips.length).toBeGreaterThan(0);
  expect(display.mobileSections.length).toBeGreaterThan(0);
  expect(display.recommendedHumanActionLabel.length).toBeGreaterThan(0);
}

describe("iphone human gate display", () => {
  it("creates iPhone display item for safe fixture", () => {
    const display = createIphoneHumanGateDisplayItemFromContract(makeDryRunInput(docsOnlySafeContract));

    expect(display.goalId).toBe(docsOnlySafeContract.goalId);
    expect(["PREVIEW_ONLY", "READY_FOR_REVIEW"]).toContain(display.status);
    expectIphoneDisplayInvariants(display);
  });

  it("creates iPhone display item for sourceAndTestsSafeContract", () => {
    expectIphoneDisplayInvariants(
      createIphoneHumanGateDisplayItemFromContract(makeDryRunInput(sourceAndTestsSafeContract))
    );
  });

  it("creates HOLD iPhone display item for sourceWithPackageChangeHoldContract", () => {
    const display = createIphoneHumanGateDisplayItemFromContract(
      makeDryRunInput(sourceWithPackageChangeHoldContract)
    );

    expect(display.status).toBe("HOLD");
    expect(display.primaryStatusLabel).toBe("HOLD");
    expect(display.canApproveProceed).toBe(false);
    expectIphoneDisplayInvariants(display);
  });

  it("creates HOLD or REJECTED iPhone display item for pushAttemptRejectedContract", () => {
    const display = createIphoneHumanGateDisplayItemFromContract(
      makeDryRunInput(pushAttemptRejectedContract)
    );

    expect(["HOLD", "REJECTED"]).toContain(display.status);
    expectIphoneDisplayInvariants(display);
  });

  it("creates HOLD or REJECTED iPhone display item for runtimeStartRejectedContract", () => {
    const display = createIphoneHumanGateDisplayItemFromContract(
      makeDryRunInput(runtimeStartRejectedContract)
    );

    expect(["HOLD", "REJECTED"]).toContain(display.status);
    expectIphoneDisplayInvariants(display);
  });

  it("creates HOLD or REJECTED iPhone display item for discordSendRejectedContract", () => {
    const display = createIphoneHumanGateDisplayItemFromContract(
      makeDryRunInput(discordSendRejectedContract)
    );

    expect(["HOLD", "REJECTED"]).toContain(display.status);
    expect(display.requiredHumanGates).toContain("Discord Send GO");
    expectIphoneDisplayInvariants(display);
  });

  it("creates HOLD or REJECTED iPhone display item for productionReadyRejectedContract", () => {
    const display = createIphoneHumanGateDisplayItemFromContract(
      makeDryRunInput(productionReadyRejectedContract)
    );

    expect(["HOLD", "REJECTED"]).toContain(display.status);
    expectIphoneDisplayInvariants(display);
  });

  it("creates HOLD or REJECTED iPhone display item for executionEnabledRejectedContract", () => {
    const display = createIphoneHumanGateDisplayItemFromContract(
      makeDryRunInput(executionEnabledRejectedContract)
    );

    expect(["HOLD", "REJECTED"]).toContain(display.status);
    expectIphoneDisplayInvariants(display);
  });

  it("creates HOLD iPhone display item for missingVerificationHoldContract", () => {
    expect(
      createIphoneHumanGateDisplayItemFromContract(makeDryRunInput(missingVerificationHoldContract))
        .status
    ).toBe("HOLD");
  });

  it("creates HOLD iPhone display item for missingStopConditionsHoldContract", () => {
    expect(
      createIphoneHumanGateDisplayItemFromContract(makeDryRunInput(missingStopConditionsHoldContract))
        .status
    ).toBe("HOLD");
  });

  it("always records display invariants on every fixture", () => {
    for (const contract of Object.values(workerTaskContractFixtures)) {
      expectIphoneDisplayInvariants(
        createIphoneHumanGateDisplayItemFromContract(makeDryRunInput(contract))
      );
    }
  });

  it("does not mutate queue display target input", () => {
    const queueItem = createHumanGateQueueDisplayTargetItemFromContract(
      makeDryRunInput(pushAttemptRejectedContract)
    );
    const before = JSON.stringify(queueItem);

    createIphoneHumanGateDisplayItem(queueItem);

    expect(JSON.stringify(queueItem)).toBe(before);
  });
});
