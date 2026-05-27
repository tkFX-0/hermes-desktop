import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  docsOnlySafeContract,
  missingVerificationHoldContract,
  productionReadyRejectedContract,
  workerTaskContractFixtures
} from "../worker-task-contract/worker-task-contract-fixtures";
import type { WorkerTaskContract } from "../worker-task-contract/worker-task-contract-types";
import type { GoalRunnerDryRunInput } from "../goal-runner-dry-run/goal-runner-dry-run-types";
import { createHumanGateQueueDisplayTargetItemFromContract } from "../human-gate-queue-display-target/human-gate-queue-display-target";
import {
  createHumanGateQueueMarkdownPreview,
  createHumanGateQueueMarkdownRenderModel,
  renderHumanGateQueueMarkdownPreview
} from "./human-gate-queue-markdown-render";
import type { HumanGateQueueMarkdownRenderModel } from "./human-gate-queue-markdown-render-types";

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

function expectModelInvariants(model: HumanGateQueueMarkdownRenderModel): void {
  expect(model.surface).toBe("human-gate-queue-markdown");
  expect(model.previewOnly).toBe(true);
  expect(model.fileWriteReady).toBe(false);
  expect(model.actualQueueMutation).toBe(false);
  expect(model.targetDocument).toBe("docs/shikishima/HUMAN_GATE_QUEUE.md");
  expect(model.safety.displayOnly).toBe(true);
  expect(model.safety.fileWritePerformed).toBe(false);
  expect(model.safety.humanGateQueueDocModified).toBe(false);
  expect(model.safety.discordSend).toBe(false);
  expect(model.safety.webhookUsed).toBe(false);
  expect(model.safety.botStarted).toBe(false);
  expect(model.safety.tokenRead).toBe(false);
  expect(model.safety.obsidianActualWrite).toBe(false);
  expect(model.safety.runtimeStarted).toBe(false);
  expect(model.safety.networkCall).toBe(false);
  expect(model.safety.externalWrite).toBe(false);
  expect(model.safety.productionReady).toBe(false);
  expect(model.safety.execution).toBe("disabled");
  expect(model.safety.rawValuesReported).toBe(false);
  expect(model.safety.redacted).toBe(true);
}

describe("human gate queue markdown render", () => {
  it("does not import Node fs in implementation module", () => {
    const source = readFileSync(join(__dirname, "human-gate-queue-markdown-render.ts"), "utf8");

    expect(source).not.toMatch(/from\s+["']node:fs["']/);
    expect(source).not.toMatch(/from\s+["']fs["']/);
    expect(source).not.toMatch(/require\s*\(\s*["']fs["']\s*\)/);
  });

  it("creates Markdown render model for safe queue item", () => {
    const item = createHumanGateQueueDisplayTargetItemFromContract(
      makeDryRunInput(docsOnlySafeContract)
    );
    const model = createHumanGateQueueMarkdownRenderModel(item);

    expect(["preview", "review"]).toContain(model.statusTone);
    expect(model.title).toBe(item.title);
    expect(model.markdownSections.length).toBeGreaterThan(0);
    expectModelInvariants(model);
  });

  it("creates HOLD Markdown render model", () => {
    const item = createHumanGateQueueDisplayTargetItemFromContract(
      makeDryRunInput(missingVerificationHoldContract)
    );
    const model = createHumanGateQueueMarkdownRenderModel(item);

    expect(item.status).toBe("HOLD");
    expect(model.statusTone).toBe("hold");
    expect(model.statusLabel).toBe("HOLD");
    expectModelInvariants(model);
  });

  it("creates rejected Markdown render model", () => {
    const item = createHumanGateQueueDisplayTargetItemFromContract(
      makeDryRunInput(productionReadyRejectedContract)
    );
    const model = createHumanGateQueueMarkdownRenderModel(item);

    expect(["hold", "rejected"]).toContain(model.statusTone);
    expectModelInvariants(model);
  });

  it("maps statusLabel and statusTone deterministically", () => {
    const item = createHumanGateQueueDisplayTargetItemFromContract(
      makeDryRunInput(missingVerificationHoldContract)
    );
    const first = createHumanGateQueueMarkdownRenderModel(item);
    const second = createHumanGateQueueMarkdownRenderModel(item);

    expect(first.statusLabel).toBe(second.statusLabel);
    expect(first.statusTone).toBe(second.statusTone);
  });

  it("renders Markdown preview with review-only and no mutation language", () => {
    const preview = createHumanGateQueueMarkdownPreview(
      createHumanGateQueueDisplayTargetItemFromContract(makeDryRunInput(docsOnlySafeContract))
    );

    expect(typeof preview).toBe("string");
    expect(preview).toContain("review-only");
    expect(preview).toContain("no queue mutation");
    expect(preview).toContain("no file write");
    expect(preview).toContain("execution: disabled");
    expect(preview).toContain("does not approve");
    expect(preview).toContain("HUMAN_GATE_QUEUE.md unmodified");
  });

  it("preserves goalId taskId gateId summary gates and reasons in model", () => {
    const item = createHumanGateQueueDisplayTargetItemFromContract(
      makeDryRunInput(docsOnlySafeContract)
    );
    const model = createHumanGateQueueMarkdownRenderModel(item);

    expect(model.source.goalId).toBe(item.goalId);
    expect(model.source.taskId).toBe(item.taskId);
    expect(model.source.gateId).toBe(item.gateId);
    expect(model.markdownSections.some((s) => s.heading === "Summary")).toBe(true);
    expect(model.markdownSections.some((s) => s.heading === "Required human gates")).toBe(true);
    expect(model.markdownSections.some((s) => s.heading === "Reasons")).toBe(true);
  });

  it("renders preview from model via renderHumanGateQueueMarkdownPreview", () => {
    const model = createHumanGateQueueMarkdownRenderModel(
      createHumanGateQueueDisplayTargetItemFromContract(makeDryRunInput(docsOnlySafeContract))
    );
    const preview = renderHumanGateQueueMarkdownPreview(model);

    expect(preview).toContain(model.title);
    expect(preview).toContain(model.targetDocument);
  });

  it("records invariants on every fixture", () => {
    for (const contract of Object.values(workerTaskContractFixtures)) {
      expectModelInvariants(
        createHumanGateQueueMarkdownRenderModel(
          createHumanGateQueueDisplayTargetItemFromContract(makeDryRunInput(contract))
        )
      );
    }
  });

  it("does not mutate queue display target input", () => {
    const item = createHumanGateQueueDisplayTargetItemFromContract(
      makeDryRunInput(docsOnlySafeContract)
    );
    const before = JSON.stringify(item);

    createHumanGateQueueMarkdownRenderModel(item);
    createHumanGateQueueMarkdownPreview(item);

    expect(JSON.stringify(item)).toBe(before);
  });
});
