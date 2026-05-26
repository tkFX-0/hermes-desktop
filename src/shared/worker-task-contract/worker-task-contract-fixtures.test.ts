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
import { validateWorkerTaskContract } from "./worker-task-contract-validator";
import type { WorkerTaskContract } from "./worker-task-contract-types";

const allFixtures = Object.values(workerTaskContractFixtures);

function expectSafe(contract: WorkerTaskContract): void {
  expect(validateWorkerTaskContract(contract).status).toBe("PASS");
}

function expectHold(contract: WorkerTaskContract): void {
  expect(validateWorkerTaskContract(contract).status).toBe("HOLD");
}

describe("worker task contract fixtures", () => {
  it("exports every representative fixture", () => {
    expect(Object.keys(workerTaskContractFixtures).sort()).toEqual(
      [
        "discordSendRejectedContract",
        "docsOnlySafeContract",
        "executionEnabledRejectedContract",
        "externalWriteRejectedContract",
        "missingStopConditionsHoldContract",
        "missingVerificationHoldContract",
        "obsidianWriteRejectedContract",
        "productionReadyRejectedContract",
        "pushAttemptRejectedContract",
        "runtimeStartRejectedContract",
        "sourceAndTestsSafeContract",
        "sourceWithPackageChangeHoldContract",
        "stackchanConnectionRejectedContract"
      ].sort()
    );
  });

  it("validates docsOnlySafeContract safely", () => {
    expectSafe(docsOnlySafeContract);
  });

  it("validates sourceAndTestsSafeContract safely", () => {
    expectSafe(sourceAndTestsSafeContract);
  });

  it("holds sourceWithPackageChangeHoldContract", () => {
    expectHold(sourceWithPackageChangeHoldContract);
  });

  it("holds pushAttemptRejectedContract", () => {
    expectHold(pushAttemptRejectedContract);
  });

  it("holds runtimeStartRejectedContract", () => {
    expectHold(runtimeStartRejectedContract);
  });

  it("holds externalWriteRejectedContract", () => {
    expectHold(externalWriteRejectedContract);
  });

  it("holds discordSendRejectedContract", () => {
    expectHold(discordSendRejectedContract);
  });

  it("holds obsidianWriteRejectedContract", () => {
    expectHold(obsidianWriteRejectedContract);
  });

  it("holds stackchanConnectionRejectedContract", () => {
    expectHold(stackchanConnectionRejectedContract);
  });

  it("holds productionReadyRejectedContract", () => {
    expectHold(productionReadyRejectedContract);
  });

  it("holds executionEnabledRejectedContract", () => {
    expectHold(executionEnabledRejectedContract);
  });

  it("holds missingVerificationHoldContract", () => {
    expectHold(missingVerificationHoldContract);
  });

  it("holds missingStopConditionsHoldContract", () => {
    expectHold(missingStopConditionsHoldContract);
  });

  it("does not allow runtime start safely in any fixture", () => {
    for (const fixture of allFixtures) {
      if (fixture.permissions.canStartRuntime) {
        expectHold(fixture);
      }
    }
  });

  it("does not allow git push safely in any fixture", () => {
    for (const fixture of allFixtures) {
      if (fixture.permissions.canPush) {
        expectHold(fixture);
      }
    }
  });

  it("does not allow external write safely in any fixture", () => {
    for (const fixture of allFixtures) {
      if (fixture.permissions.canWriteExternal) {
        expectHold(fixture);
      }
    }
  });
});
