import { describe, expect, it } from "vitest";
import {
  docsOnlySafeContract,
  missingVerificationHoldContract,
  workerTaskContractFixtures
} from "../worker-task-contract/worker-task-contract-fixtures";
import type { WorkerTaskContract } from "../worker-task-contract/worker-task-contract-types";
import type { GoalRunnerDryRunInput } from "../goal-runner-dry-run/goal-runner-dry-run-types";
import { createIphoneHumanGateDisplayItemFromContract } from "../iphone-human-gate-display/iphone-human-gate-display";
import { createIphoneHumanGateDisplayRenderModel } from "./iphone-human-gate-display-render";
import type { IphoneHumanGateDisplayRenderModel } from "./iphone-human-gate-display-render-types";

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

function expectRenderInvariants(model: IphoneHumanGateDisplayRenderModel): void {
  expect(model.surface).toBe("iphone-private-console-readonly");
  expect(model.displayOnly).toBe(true);
  expect(model.mobileReady).toBe(true);
  expect(model.uiConnected).toBe(false);
  expect(model.ipcConnected).toBe(false);
  expect(model.networkExposed).toBe(false);
  expect(model.actualQueueMutation).toBe(false);
  expect(model.canApprovePush).toBe(false);
  expect(model.canApproveRuntime).toBe(false);
  expect(model.canApproveExternalWrite).toBe(false);
  expect(model.productionReady).toBe(false);
  expect(model.execution).toBe("disabled");
  expect(model.rawValuesReported).toBe(false);
  expect(model.redacted).toBe(true);
}

describe("iphone human gate display render", () => {
  it("creates render model for safe item", () => {
    const model = createIphoneHumanGateDisplayRenderModel(
      createIphoneHumanGateDisplayItemFromContract(makeDryRunInput(docsOnlySafeContract))
    );

    expect(["preview", "review"]).toContain(model.statusTone);
    expectRenderInvariants(model);
  });

  it("creates HOLD render model", () => {
    const model = createIphoneHumanGateDisplayRenderModel(
      createIphoneHumanGateDisplayItemFromContract(makeDryRunInput(missingVerificationHoldContract))
    );

    expect(model.statusTone).toBe("hold");
    expectRenderInvariants(model);
  });

  it("records invariants on every fixture", () => {
    for (const contract of Object.values(workerTaskContractFixtures)) {
      expectRenderInvariants(
        createIphoneHumanGateDisplayRenderModel(
          createIphoneHumanGateDisplayItemFromContract(makeDryRunInput(contract))
        )
      );
    }
  });

  it("does not mutate iPhone display item input", () => {
    const item = createIphoneHumanGateDisplayItemFromContract(
      makeDryRunInput(docsOnlySafeContract)
    );
    const before = JSON.stringify(item);

    createIphoneHumanGateDisplayRenderModel(item);

    expect(JSON.stringify(item)).toBe(before);
  });
});
