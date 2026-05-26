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
import { createControlCenterHumanGateDisplayItemFromContract } from "../control-center-human-gate-display/control-center-human-gate-display";
import {
  createControlCenterHumanGateDisplayRenderModel,
  createControlCenterHumanGateDisplayRenderModelFromContract
} from "./control-center-human-gate-display-render";

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

function expectRenderInvariants(
  model: ReturnType<typeof createControlCenterHumanGateDisplayRenderModel>
): void {
  expect(model.surface).toBe("control-center-readonly");
  expect(model.layout).toBe("human-gate-review-panel");
  expect(model.displayOnly).toBe(true);
  expect(model.uiConnected).toBe(false);
  expect(model.ipcConnected).toBe(false);
  expect(model.actualQueueMutation).toBe(false);
  expect(model.canApprovePush).toBe(false);
  expect(model.canApproveRuntime).toBe(false);
  expect(model.canApproveExternalWrite).toBe(false);
  expect(model.productionReady).toBe(false);
  expect(model.execution).toBe("disabled");
  expect(model.rawValuesReported).toBe(false);
  expect(model.redacted).toBe(true);
  expect(model.safetyChips.some((chip) => chip.includes("HOLD"))).toBe(true);
  expect(model.footerNotice).toContain("Review-only");
}

describe("control center human gate display render", () => {
  it("creates render model for safe item", () => {
    const model = createControlCenterHumanGateDisplayRenderModelFromContract(
      makeDryRunInput(docsOnlySafeContract)
    );

    expect(["preview", "review"]).toContain(model.statusTone);
    expect(model.statusLabel.length).toBeGreaterThan(0);
    expectRenderInvariants(model);
  });

  it("creates render model for sourceAndTestsSafeContract", () => {
    expectRenderInvariants(
      createControlCenterHumanGateDisplayRenderModelFromContract(
        makeDryRunInput(sourceAndTestsSafeContract)
      )
    );
  });

  it("creates HOLD render model for sourceWithPackageChangeHoldContract", () => {
    const model = createControlCenterHumanGateDisplayRenderModelFromContract(
      makeDryRunInput(sourceWithPackageChangeHoldContract)
    );

    expect(model.status).toBe("HOLD");
    expect(model.statusTone).toBe("hold");
    expect(model.statusLabel).toBe("HOLD");
    expectRenderInvariants(model);
  });

  it("creates HOLD or rejected render model for pushAttemptRejectedContract", () => {
    const model = createControlCenterHumanGateDisplayRenderModelFromContract(
      makeDryRunInput(pushAttemptRejectedContract)
    );

    expect(["hold", "rejected"]).toContain(model.statusTone);
    expectRenderInvariants(model);
  });

  it("creates HOLD or rejected render model for runtimeStartRejectedContract", () => {
    const model = createControlCenterHumanGateDisplayRenderModelFromContract(
      makeDryRunInput(runtimeStartRejectedContract)
    );

    expect(["hold", "rejected"]).toContain(model.statusTone);
    expectRenderInvariants(model);
  });

  it("creates HOLD or rejected render model for discordSendRejectedContract", () => {
    const model = createControlCenterHumanGateDisplayRenderModelFromContract(
      makeDryRunInput(discordSendRejectedContract)
    );

    expect(model.requiredHumanGateLabels).toContain("Discord Send GO");
    expect(["hold", "rejected"]).toContain(model.statusTone);
    expectRenderInvariants(model);
  });

  it("creates HOLD or rejected render model for productionReadyRejectedContract", () => {
    const model = createControlCenterHumanGateDisplayRenderModelFromContract(
      makeDryRunInput(productionReadyRejectedContract)
    );

    expect(["hold", "rejected"]).toContain(model.statusTone);
    expectRenderInvariants(model);
  });

  it("creates HOLD or rejected render model for executionEnabledRejectedContract", () => {
    const model = createControlCenterHumanGateDisplayRenderModelFromContract(
      makeDryRunInput(executionEnabledRejectedContract)
    );

    expect(["hold", "rejected"]).toContain(model.statusTone);
    expectRenderInvariants(model);
  });

  it("creates HOLD render model for missingVerificationHoldContract", () => {
    const model = createControlCenterHumanGateDisplayRenderModelFromContract(
      makeDryRunInput(missingVerificationHoldContract)
    );

    expect(model.statusTone).toBe("hold");
    expect(model.statusLabel).toBe("HOLD");
  });

  it("creates HOLD render model for missingStopConditionsHoldContract", () => {
    const model = createControlCenterHumanGateDisplayRenderModelFromContract(
      makeDryRunInput(missingStopConditionsHoldContract)
    );

    expect(model.statusTone).toBe("hold");
  });

  it("uses deterministic statusLabel and statusTone for HOLD", () => {
    const item = createControlCenterHumanGateDisplayItemFromContract(
      makeDryRunInput(missingVerificationHoldContract)
    );
    const first = createControlCenterHumanGateDisplayRenderModel(item);
    const second = createControlCenterHumanGateDisplayRenderModel(item);

    expect(first.statusLabel).toBe(second.statusLabel);
    expect(first.statusTone).toBe(second.statusTone);
  });

  it("always records render invariants on every fixture", () => {
    for (const contract of Object.values(workerTaskContractFixtures)) {
      expectRenderInvariants(
        createControlCenterHumanGateDisplayRenderModelFromContract(makeDryRunInput(contract))
      );
    }
  });

  it("does not mutate Control Center display item input", () => {
    const item = createControlCenterHumanGateDisplayItemFromContract(
      makeDryRunInput(pushAttemptRejectedContract)
    );
    const before = JSON.stringify(item);

    createControlCenterHumanGateDisplayRenderModel(item);

    expect(JSON.stringify(item)).toBe(before);
  });
});
