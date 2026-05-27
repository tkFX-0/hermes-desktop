import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { docsOnlySafeContract, missingVerificationHoldContract } from "../worker-task-contract/worker-task-contract-fixtures";
import type { WorkerTaskContract } from "../worker-task-contract/worker-task-contract-types";
import type { GoalRunnerDryRunInput } from "../goal-runner-dry-run/goal-runner-dry-run-types";
import { createHumanGateQueueDisplayTargetItemFromContract } from "../human-gate-queue-display-target/human-gate-queue-display-target";
import { createHumanGateQueueMarkdownRenderModel } from "../human-gate-queue-markdown-render/human-gate-queue-markdown-render";
import {
  createHumanGateQueueMutationPreflightIntentFromDisplayTarget,
  createHumanGateQueueMutationPreflightIntentFromMarkdownRenderModel,
  evaluateHumanGateQueueMutationPreflight,
  renderHumanGateQueueMutationPreflightPreview
} from "./human-gate-queue-mutation-preflight";
import type {
  HumanGateQueueMutationPreflightIntent,
  HumanGateQueueMutationPreflightResult
} from "./human-gate-queue-mutation-preflight-types";
import { HUMAN_GATE_QUEUE_TARGET_DOCUMENT } from "./human-gate-queue-mutation-preflight-types";

const __dirname = dirname(fileURLToPath(import.meta.url));

function makeDryRunInput(contract: WorkerTaskContract): GoalRunnerDryRunInput {
  return {
    goalId: contract.goalId,
    taskId: contract.taskId,
    title: contract.summary,
    contract,
    requestedBy: "composer"
  };
}

function validOptions() {
  return {
    exactMarkdownToAppend: "## Human Gate entry (preview)\n\n- review-only block",
    sourcePreviewCommit: "abc1234",
    humanGoReference: "Human Gate Queue Mutation GO / goal-example-001",
    requestedMutationCount: 1 as const
  };
}

function validIntent(): HumanGateQueueMutationPreflightIntent {
  const item = createHumanGateQueueDisplayTargetItemFromContract(
    makeDryRunInput(docsOnlySafeContract)
  );
  const model = createHumanGateQueueMarkdownRenderModel(item);
  return createHumanGateQueueMutationPreflightIntentFromMarkdownRenderModel(model, validOptions());
}

function expectResultInvariants(result: HumanGateQueueMutationPreflightResult): void {
  expect(result.fileWriteReady).toBe(false);
  expect(result.mayMutateNow).toBe(false);
  expect(result.actualQueueMutation).toBe(false);
  expect(result.humanGateQueueDocModified).toBe(false);
  expect(result.fileWritePerformed).toBe(false);
  expect(result.externalWrite).toBe(false);
  expect(result.discordSend).toBe(false);
  expect(result.obsidianActualWrite).toBe(false);
  expect(result.runtimeStarted).toBe(false);
  expect(result.networkCall).toBe(false);
  expect(result.productionReady).toBe(false);
  expect(result.execution).toBe("disabled");
  expect(result.rawValuesReported).toBe(false);
  expect(result.redacted).toBe(true);
  expect(result.actualMutationCount).toBe(0);
  expect(result.gateRestoredHoldRequired).toBe(true);
}

function intentWithOverrides(overrides: Record<string, unknown>): HumanGateQueueMutationPreflightIntent {
  return { ...validIntent(), ...overrides } as unknown as HumanGateQueueMutationPreflightIntent;
}

describe("human gate queue mutation preflight", () => {
  it("does not import Node fs in implementation module", () => {
    const source = readFileSync(join(__dirname, "human-gate-queue-mutation-preflight.ts"), "utf8");

    expect(source).not.toMatch(/from\s+["']node:fs["']/);
    expect(source).not.toMatch(/from\s+["']fs["']/);
  });

  it("creates preflight intent from Markdown render model", () => {
    const item = createHumanGateQueueDisplayTargetItemFromContract(
      makeDryRunInput(docsOnlySafeContract)
    );
    const model = createHumanGateQueueMarkdownRenderModel(item);
    const intent = createHumanGateQueueMutationPreflightIntentFromMarkdownRenderModel(
      model,
      validOptions()
    );

    expect(intent.surface).toBe("human-gate-queue-mutation-preflight");
    expect(intent.targetDocument).toBe(HUMAN_GATE_QUEUE_TARGET_DOCUMENT);
    expect(intent.sourceGateId).toBe(model.source.gateId);
    expect(intent.rewriteRequested).toBe(false);
    expect(intent.allowedMutationCount).toBe(1);
  });

  it("creates preflight intent from display target via canonical pipeline", () => {
    const intent = createHumanGateQueueMutationPreflightIntentFromDisplayTarget(
      createHumanGateQueueDisplayTargetItemFromContract(makeDryRunInput(docsOnlySafeContract)),
      {
        sourcePreviewCommit: "def5678",
        humanGoReference: validOptions().humanGoReference
      }
    );

    expect(intent.exactMarkdownToAppend.length).toBeGreaterThan(0);
    expect(intent.exactMarkdownToAppend).toContain("review-only");
  });

  it("returns READY_CANDIDATE for valid one-shot metadata", () => {
    const result = evaluateHumanGateQueueMutationPreflight(validIntent());

    expect(result.status).toBe("READY_CANDIDATE");
    expectResultInvariants(result);
    expect(result.reasons.some((r) => r.includes("not mutation approval"))).toBe(true);
  });

  it("keeps fileWriteReady and mayMutateNow false for READY_CANDIDATE", () => {
    const result = evaluateHumanGateQueueMutationPreflight(validIntent());

    expect(result.fileWriteReady).toBe(false);
    expect(result.mayMutateNow).toBe(false);
  });

  it("returns HOLD when humanGoReference is missing", () => {
    const result = evaluateHumanGateQueueMutationPreflight(
      intentWithOverrides({ humanGoReference: undefined })
    );

    expect(result.status).toBe("HOLD");
    expect(result.missingRequirements).toContain("humanGoReference");
    expectResultInvariants(result);
  });

  it("returns HOLD when exactMarkdownToAppend is missing", () => {
    const result = evaluateHumanGateQueueMutationPreflight(
      intentWithOverrides({ exactMarkdownToAppend: "   " })
    );

    expect(result.status).toBe("HOLD");
    expect(result.missingRequirements).toContain("exactMarkdownToAppend");
  });

  it("returns HOLD when sourcePreviewCommit is missing", () => {
    const result = evaluateHumanGateQueueMutationPreflight(
      intentWithOverrides({ sourcePreviewCommit: undefined })
    );

    expect(result.status).toBe("HOLD");
    expect(result.missingRequirements).toContain("sourcePreviewCommit");
  });

  it("returns BLOCKED when requestedMutationCount > 1", () => {
    const result = evaluateHumanGateQueueMutationPreflight(
      intentWithOverrides({ requestedMutationCount: 2 })
    );

    expect(result.status).toBe("BLOCKED");
    expectResultInvariants(result);
  });

  it("returns BLOCKED when rewriteRequested is true", () => {
    expect(evaluateHumanGateQueueMutationPreflight(intentWithOverrides({ rewriteRequested: true })).status).toBe(
      "BLOCKED"
    );
  });

  it("returns BLOCKED when archiveRequested is true", () => {
    expect(evaluateHumanGateQueueMutationPreflight(intentWithOverrides({ archiveRequested: true })).status).toBe(
      "BLOCKED"
    );
  });

  it("returns BLOCKED when bulkEditRequested is true", () => {
    expect(evaluateHumanGateQueueMutationPreflight(intentWithOverrides({ bulkEditRequested: true })).status).toBe(
      "BLOCKED"
    );
  });

  it("returns BLOCKED when rawValuesReported is true", () => {
    expect(evaluateHumanGateQueueMutationPreflight(intentWithOverrides({ rawValuesReported: true })).status).toBe(
      "BLOCKED"
    );
  });

  it("returns BLOCKED when redacted is false", () => {
    expect(evaluateHumanGateQueueMutationPreflight(intentWithOverrides({ redacted: false })).status).toBe("BLOCKED");
  });

  it("returns BLOCKED for wrong target document", () => {
    expect(
      evaluateHumanGateQueueMutationPreflight(
        intentWithOverrides({ targetDocument: "other/path.md" })
      ).status
    ).toBe("BLOCKED");
  });

  it("renders preflight preview string only", () => {
    const preview = renderHumanGateQueueMutationPreflightPreview(
      evaluateHumanGateQueueMutationPreflight(validIntent())
    );

    expect(typeof preview).toBe("string");
    expect(preview).toContain("no queue mutation");
    expect(preview).toContain("does not approve file write");
  });

  it("does not mutate display target input", () => {
    const item = createHumanGateQueueDisplayTargetItemFromContract(
      makeDryRunInput(missingVerificationHoldContract)
    );
    const before = JSON.stringify(item);

    createHumanGateQueueMutationPreflightIntentFromDisplayTarget(item, validOptions());

    expect(JSON.stringify(item)).toBe(before);
  });
});
