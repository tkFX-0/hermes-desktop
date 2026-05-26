import { describe, expect, it } from "vitest";
import {
  discordSendRejectedContract,
  docsOnlySafeContract,
  missingVerificationHoldContract,
  productionReadyRejectedContract,
  workerTaskContractFixtures
} from "../worker-task-contract/worker-task-contract-fixtures";
import type { WorkerTaskContract } from "../worker-task-contract/worker-task-contract-types";
import type { GoalRunnerDryRunInput } from "../goal-runner-dry-run/goal-runner-dry-run-types";
import { createControlCenterHumanGateDisplayRenderModelFromContract } from "../control-center-human-gate-display-render/control-center-human-gate-display-render";
import { createHumanGateQueueDisplayTargetItemFromContract } from "../human-gate-queue-display-target/human-gate-queue-display-target";
import {
  createDiscordHumanGateMessageDraft,
  createDiscordHumanGateMessageDraftFromControlCenterRenderModel,
  renderDiscordHumanGateMessagePreview
} from "./discord-human-gate-message-render";
import type { DiscordHumanGateMessageDraft } from "./discord-human-gate-message-render-types";

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

function expectDraftInvariants(draft: DiscordHumanGateMessageDraft): void {
  expect(draft.surface).toBe("discord-human-gate-message");
  expect(draft.draftOnly).toBe(true);
  expect(draft.sendReady).toBe(false);
  expect(draft.externalWrite).toBe(false);
  expect(draft.webhookRequired).toBe(false);
  expect(draft.botRequired).toBe(false);
  expect(draft.tokenRequired).toBe(false);
  expect(draft.safety.discordSend).toBe(false);
  expect(draft.safety.webhookUsed).toBe(false);
  expect(draft.safety.botStarted).toBe(false);
  expect(draft.safety.tokenRead).toBe(false);
  expect(draft.safety.productionReady).toBe(false);
  expect(draft.safety.execution).toBe("disabled");
  expect(draft.safety.rawValuesReported).toBe(false);
  expect(draft.safety.redacted).toBe(true);
  expect(draft.safetyChips.some((chip) => chip.includes("review-only"))).toBe(true);
  expect(draft.safetyChips.some((chip) => chip.includes("no-discord-send"))).toBe(true);
  expect(draft.recommendedHumanActionLabel).not.toMatch(/auto-?approve/i);
  expect(draft.footerNotice).toContain("No Discord send");
}

describe("discord human gate message render", () => {
  it("creates Discord message draft for safe queue item", () => {
    const item = createHumanGateQueueDisplayTargetItemFromContract(
      makeDryRunInput(docsOnlySafeContract)
    );
    const draft = createDiscordHumanGateMessageDraft(item);

    expect(["preview", "review"]).toContain(draft.statusTone);
    expect(draft.contentPreview.length).toBeGreaterThan(0);
    expect(draft.sections.length).toBeGreaterThan(0);
    expectDraftInvariants(draft);
  });

  it("creates HOLD Discord message draft", () => {
    const item = createHumanGateQueueDisplayTargetItemFromContract(
      makeDryRunInput(missingVerificationHoldContract)
    );
    const draft = createDiscordHumanGateMessageDraft(item);

    expect(item.status).toBe("HOLD");
    expect(draft.statusTone).toBe("hold");
    expect(draft.statusLabel).toBe("HOLD");
    expectDraftInvariants(draft);
  });

  it("creates rejected Discord message draft", () => {
    const item = createHumanGateQueueDisplayTargetItemFromContract(
      makeDryRunInput(productionReadyRejectedContract)
    );
    const draft = createDiscordHumanGateMessageDraft(item);

    expect(["hold", "rejected"]).toContain(draft.statusTone);
    expectDraftInvariants(draft);
  });

  it("maps statusTone deterministically", () => {
    const item = createHumanGateQueueDisplayTargetItemFromContract(
      makeDryRunInput(missingVerificationHoldContract)
    );
    const first = createDiscordHumanGateMessageDraft(item);
    const second = createDiscordHumanGateMessageDraft(item);

    expect(first.statusTone).toBe(second.statusTone);
    expect(first.statusLabel).toBe(second.statusLabel);
  });

  it("renders preview string only", () => {
    const draft = createDiscordHumanGateMessageDraft(
      createHumanGateQueueDisplayTargetItemFromContract(makeDryRunInput(docsOnlySafeContract))
    );
    const preview = renderDiscordHumanGateMessagePreview(draft);

    expect(typeof preview).toBe("string");
    expect(preview).toContain("no Discord send");
    expect(preview).toContain(draft.title);
  });

  it("creates draft from Control Center render model when simple", () => {
    const model = createControlCenterHumanGateDisplayRenderModelFromContract(
      makeDryRunInput(discordSendRejectedContract)
    );
    const draft = createDiscordHumanGateMessageDraftFromControlCenterRenderModel(model);

    expect(draft.source.gateId).toBe(model.gateId);
    expectDraftInvariants(draft);
  });

  it("records invariants on every fixture", () => {
    for (const contract of Object.values(workerTaskContractFixtures)) {
      expectDraftInvariants(
        createDiscordHumanGateMessageDraft(
          createHumanGateQueueDisplayTargetItemFromContract(makeDryRunInput(contract))
        )
      );
    }
  });

  it("does not mutate queue display target input", () => {
    const item = createHumanGateQueueDisplayTargetItemFromContract(
      makeDryRunInput(discordSendRejectedContract)
    );
    const before = JSON.stringify(item);

    createDiscordHumanGateMessageDraft(item);

    expect(JSON.stringify(item)).toBe(before);
  });

  it("preserves goalId taskId gateId title status summary reasons gates", () => {
    const item = createHumanGateQueueDisplayTargetItemFromContract(
      makeDryRunInput(docsOnlySafeContract)
    );
    const draft = createDiscordHumanGateMessageDraft(item);

    expect(draft.source.goalId).toBe(item.goalId);
    expect(draft.source.taskId).toBe(item.taskId);
    expect(draft.source.gateId).toBe(item.gateId);
    expect(draft.title).toBe(item.title);
    expect(draft.source.sourceStatus).toBe(item.status);
    expect(draft.requiredHumanGateLabels).toEqual(item.requiredHumanGates);
    expect(draft.sections.some((s) => s.heading === "Summary")).toBe(true);
  });
});
