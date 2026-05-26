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
} from "./worker-task-contract-fixtures";
import { previewWorkerTaskContract } from "./worker-task-contract-preview";
import type { WorkerTaskContract } from "./worker-task-contract-types";

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

function expectPreviewPass(contract: WorkerTaskContract): void {
  const preview = previewWorkerTaskContract(contract);

  expect(preview.decision).toBe("PASS");
  expect(preview.canProceed).toBe(true);
}

function expectPreviewHoldOrReject(contract: WorkerTaskContract): void {
  const preview = previewWorkerTaskContract(contract);

  expect(["HOLD", "REJECT"]).toContain(preview.decision);
  expect(preview.canProceed).toBe(false);
  expect(preview.reasons.length).toBeGreaterThan(0);
}

describe("worker task contract preview", () => {
  it("previews docsOnlySafeContract as PASS", () => {
    expectPreviewPass(docsOnlySafeContract);
  });

  it("previews sourceAndTestsSafeContract as PASS", () => {
    expectPreviewPass(sourceAndTestsSafeContract);
  });

  it("previews sourceWithPackageChangeHoldContract as HOLD or REJECT", () => {
    expectPreviewHoldOrReject(sourceWithPackageChangeHoldContract);
  });

  it("previews pushAttemptRejectedContract as HOLD or REJECT", () => {
    expectPreviewHoldOrReject(pushAttemptRejectedContract);
  });

  it("previews runtimeStartRejectedContract as HOLD or REJECT", () => {
    expectPreviewHoldOrReject(runtimeStartRejectedContract);
  });

  it("previews externalWriteRejectedContract as HOLD or REJECT", () => {
    expectPreviewHoldOrReject(externalWriteRejectedContract);
  });

  it("previews discordSendRejectedContract as HOLD or REJECT", () => {
    expectPreviewHoldOrReject(discordSendRejectedContract);
  });

  it("previews obsidianWriteRejectedContract as HOLD or REJECT", () => {
    expectPreviewHoldOrReject(obsidianWriteRejectedContract);
  });

  it("previews stackchanConnectionRejectedContract as HOLD or REJECT", () => {
    expectPreviewHoldOrReject(stackchanConnectionRejectedContract);
  });

  it("previews productionReadyRejectedContract as HOLD or REJECT", () => {
    expectPreviewHoldOrReject(productionReadyRejectedContract);
  });

  it("previews executionEnabledRejectedContract as HOLD or REJECT", () => {
    expectPreviewHoldOrReject(executionEnabledRejectedContract);
  });

  it("previews missingVerificationHoldContract as HOLD", () => {
    expect(previewWorkerTaskContract(missingVerificationHoldContract).decision).toBe("HOLD");
  });

  it("previews missingStopConditionsHoldContract as HOLD", () => {
    expect(previewWorkerTaskContract(missingStopConditionsHoldContract).decision).toBe("HOLD");
  });

  it("always blocks push, runtime start, external write, production, execution, and raw reporting", () => {
    for (const contract of Object.values(workerTaskContractFixtures)) {
      const preview = previewWorkerTaskContract(contract);

      expect(preview.canPush).toBe(false);
      expect(preview.canStartRuntime).toBe(false);
      expect(preview.canWriteExternal).toBe(false);
      expect(preview.productionReady).toBe(false);
      expect(preview.execution).toBe("disabled");
      expect(preview.rawValuesReported).toBe(false);
    }
  });

  it("returns canProceed true only for safe fixture contracts", () => {
    for (const contract of safeFixtures) {
      expect(previewWorkerTaskContract(contract).canProceed).toBe(true);
    }
    for (const contract of holdFixtures) {
      expect(previewWorkerTaskContract(contract).canProceed).toBe(false);
    }
  });

  it("includes contract identity, reasons, and human gate references", () => {
    const preview = previewWorkerTaskContract(discordSendRejectedContract);

    expect(preview.contractId).toBe(
      `${discordSendRejectedContract.goalId}:${discordSendRejectedContract.taskId}`
    );
    expect(preview.goalId).toBe(discordSendRejectedContract.goalId);
    expect(preview.taskId).toBe(discordSendRejectedContract.taskId);
    expect(preview.requiredHumanGates).toContain("Discord Send GO");
    expect(preview.requiresHumanGate).toBe(true);
    expect(preview.reasons.length).toBeGreaterThan(0);
  });

  it("does not mutate contract objects", () => {
    const before = JSON.stringify(pushAttemptRejectedContract);

    previewWorkerTaskContract(pushAttemptRejectedContract);

    expect(JSON.stringify(pushAttemptRejectedContract)).toBe(before);
  });
});
