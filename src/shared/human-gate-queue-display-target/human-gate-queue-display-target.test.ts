import { readFileSync } from "node:fs";
import { resolve } from "node:path";
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
import type { GoalRunnerDryRunInput } from "../goal-runner-dry-run/goal-runner-dry-run-types";
import { createHumanGateReportFromContract } from "../human-gate-report/human-gate-report";
import {
  createHumanGateQueueDisplayTargetItem,
  createHumanGateQueueDisplayTargetItemFromContract,
  renderHumanGateQueueDisplayTargetMarkdownPreview
} from "./human-gate-queue-display-target";

const HUMAN_GATE_QUEUE_DOC = resolve(
  process.cwd(),
  "docs/shikishima/HUMAN_GATE_QUEUE.md"
);

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

function expectQueueDisplayTargetCreated(contract: WorkerTaskContract): void {
  const item = createHumanGateQueueDisplayTargetItemFromContract(makeDryRunInput(contract));

  expect(item.queueItemId).toContain(item.gateId);
  expect(item.goalId).toBe(contract.goalId);
  expect(item.taskId).toBe(contract.taskId);
  expect(item.display.target).toBe("repo-local-human-gate-queue-markdown");
}

function expectQueueDisplayTargetHoldOrRejected(contract: WorkerTaskContract): void {
  const item = createHumanGateQueueDisplayTargetItemFromContract(makeDryRunInput(contract));

  expect(["HOLD", "REJECTED"]).toContain(item.status);
  expect(item.canApproveProceed).toBe(false);
  expect(item.reasons.length).toBeGreaterThan(0);
}

function expectQueueDisplayTargetInvariants(
  item: ReturnType<typeof createHumanGateQueueDisplayTargetItem>
): void {
  expect(item.canApprovePush).toBe(false);
  expect(item.canApproveRuntime).toBe(false);
  expect(item.canApproveExternalWrite).toBe(false);
  expect(item.display.actualQueueMutation).toBe(false);
  expect(item.display.uiReady).toBe(false);
  expect(item.display.ipcReady).toBe(false);
  expect(item.safety.productionReady).toBe(false);
  expect(item.safety.execution).toBe("disabled");
  expect(item.safety.rawValuesReported).toBe(false);
  expect(item.safety.runtimeStarted).toBe(false);
  expect(item.safety.externalWrite).toBe(false);
  expect(item.safety.uiConnected).toBe(false);
  expect(item.safety.ipcConnected).toBe(false);
  expect(item.safety.obsidianActualWrite).toBe(false);
  expect(item.safety.discordSend).toBe(false);
  expect(item.safety.stackchanConnection).toBe(false);
  expect(item.redacted).toBe(true);
}

describe("human gate queue display target", () => {
  it("creates queue display target item for docsOnlySafeContract", () => {
    expectQueueDisplayTargetCreated(docsOnlySafeContract);
    const item = createHumanGateQueueDisplayTargetItemFromContract(
      makeDryRunInput(docsOnlySafeContract)
    );
    expect(["PREVIEW_ONLY", "READY_FOR_REVIEW"]).toContain(item.status);
  });

  it("creates queue display target item for sourceAndTestsSafeContract", () => {
    expectQueueDisplayTargetCreated(sourceAndTestsSafeContract);
  });

  it("creates HOLD queue display target item for sourceWithPackageChangeHoldContract", () => {
    expectQueueDisplayTargetHoldOrRejected(sourceWithPackageChangeHoldContract);
    expect(
      createHumanGateQueueDisplayTargetItemFromContract(
        makeDryRunInput(sourceWithPackageChangeHoldContract)
      ).status
    ).toBe("HOLD");
  });

  it("creates HOLD or REJECTED queue display target item for pushAttemptRejectedContract", () => {
    expectQueueDisplayTargetHoldOrRejected(pushAttemptRejectedContract);
  });

  it("creates HOLD or REJECTED queue display target item for runtimeStartRejectedContract", () => {
    expectQueueDisplayTargetHoldOrRejected(runtimeStartRejectedContract);
  });

  it("creates HOLD or REJECTED queue display target item for externalWriteRejectedContract", () => {
    expectQueueDisplayTargetHoldOrRejected(externalWriteRejectedContract);
  });

  it("creates HOLD or REJECTED queue display target item for discordSendRejectedContract", () => {
    expectQueueDisplayTargetHoldOrRejected(discordSendRejectedContract);
  });

  it("creates HOLD or REJECTED queue display target item for obsidianWriteRejectedContract", () => {
    expectQueueDisplayTargetHoldOrRejected(obsidianWriteRejectedContract);
  });

  it("creates HOLD or REJECTED queue display target item for stackchanConnectionRejectedContract", () => {
    expectQueueDisplayTargetHoldOrRejected(stackchanConnectionRejectedContract);
  });

  it("creates HOLD or REJECTED queue display target item for productionReadyRejectedContract", () => {
    expectQueueDisplayTargetHoldOrRejected(productionReadyRejectedContract);
  });

  it("creates HOLD or REJECTED queue display target item for executionEnabledRejectedContract", () => {
    expectQueueDisplayTargetHoldOrRejected(executionEnabledRejectedContract);
  });

  it("creates HOLD queue display target item for missingVerificationHoldContract", () => {
    expect(
      createHumanGateQueueDisplayTargetItemFromContract(
        makeDryRunInput(missingVerificationHoldContract)
      ).status
    ).toBe("HOLD");
  });

  it("creates HOLD queue display target item for missingStopConditionsHoldContract", () => {
    expect(
      createHumanGateQueueDisplayTargetItemFromContract(
        makeDryRunInput(missingStopConditionsHoldContract)
      ).status
    ).toBe("HOLD");
  });

  it("always records safety invariants on every fixture queue display target item", () => {
    for (const contract of Object.values(workerTaskContractFixtures)) {
      expectQueueDisplayTargetInvariants(
        createHumanGateQueueDisplayTargetItemFromContract(makeDryRunInput(contract))
      );
    }
  });

  it("does not mutate Human Gate report input", () => {
    const report = createHumanGateReportFromContract(makeDryRunInput(pushAttemptRejectedContract));
    const before = JSON.stringify(report);

    createHumanGateQueueDisplayTargetItem(report);

    expect(JSON.stringify(report)).toBe(before);
  });

  it("does not write or modify HUMAN_GATE_QUEUE.md", () => {
    const before = readFileSync(HUMAN_GATE_QUEUE_DOC, "utf8");

    const item = createHumanGateQueueDisplayTargetItemFromContract(
      makeDryRunInput(discordSendRejectedContract)
    );
    const preview = renderHumanGateQueueDisplayTargetMarkdownPreview(item);

    const after = readFileSync(HUMAN_GATE_QUEUE_DOC, "utf8");

    expect(after).toBe(before);
    expect(typeof preview).toBe("string");
    expect(preview).toContain("review-only");
    expect(preview).toContain("HOLD");
    expect(preview).not.toContain("APPROVED");
  });

  it("does not execute commands or require UI or IPC/preload", () => {
    const item = createHumanGateQueueDisplayTargetItemFromContract(
      makeDryRunInput(sourceAndTestsSafeContract)
    );

    expect(item.display.uiReady).toBe(false);
    expect(item.display.ipcReady).toBe(false);
    expect(item.safety.uiConnected).toBe(false);
    expect(item.safety.ipcConnected).toBe(false);
  });

  it("renders markdown preview without implying approval", () => {
    const item = createHumanGateQueueDisplayTargetItemFromContract(
      makeDryRunInput(runtimeStartRejectedContract)
    );
    const preview = renderHumanGateQueueDisplayTargetMarkdownPreview(item);

    expect(preview).toContain("not an approval");
    expect(preview).toContain("human GO required");
    expect(preview).toContain("actualQueueMutation: false");
    expect(preview).not.toMatch(/productionReady:\s*true/i);
  });
});
