import { describe, expect, it } from "vitest";
import { docsOnlySafeContract } from "../worker-task-contract/worker-task-contract-fixtures";
import type { WorkerTaskContract } from "../worker-task-contract/worker-task-contract-types";
import type { GoalRunnerDryRunInput } from "../goal-runner-dry-run/goal-runner-dry-run-types";
import { createHumanGateQueueDisplayTargetItemFromContract } from "../human-gate-queue-display-target/human-gate-queue-display-target";
import { createDiscordHumanGateMessageDraft } from "../discord-human-gate-message-render/discord-human-gate-message-render";
import type { DiscordHumanGateMessageDraft } from "../discord-human-gate-message-render/discord-human-gate-message-render-types";
import {
  createDiscordSendPreflightIntentFromDraft,
  evaluateDiscordSendPreflight,
  renderDiscordSendPreflightPreview
} from "./discord-send-preflight";
import type { DiscordSendPreflightIntent, DiscordSendPreflightResult } from "./discord-send-preflight-types";

function makeDryRunInput(contract: WorkerTaskContract): GoalRunnerDryRunInput {
  return {
    goalId: contract.goalId,
    taskId: contract.taskId,
    title: contract.summary,
    contract,
    requestedBy: "composer"
  };
}

function makeDraft(): DiscordHumanGateMessageDraft {
  return createDiscordHumanGateMessageDraft(
    createHumanGateQueueDisplayTargetItemFromContract(makeDryRunInput(docsOnlySafeContract))
  );
}

function validOptions() {
  return {
    exactMessageText: "Review-only Human Gate summary for operator.",
    targetChannelSummary: "#human-gate-review (redacted)",
    targetUserOrRoleSummary: "@operator (redacted)",
    humanGoReference: "Discord Send GO / goal-example-001",
    requestedSendCount: 1 as const
  };
}

function validIntent(draft = makeDraft()): DiscordSendPreflightIntent {
  return createDiscordSendPreflightIntentFromDraft(draft, validOptions());
}

function expectResultInvariants(result: DiscordSendPreflightResult): void {
  expect(result.sendReady).toBe(false);
  expect(result.maySendNow).toBe(false);
  expect(result.discordSend).toBe(false);
  expect(result.externalWrite).toBe(false);
  expect(result.webhookUsed).toBe(false);
  expect(result.botStarted).toBe(false);
  expect(result.tokenRead).toBe(false);
  expect(result.networkCall).toBe(false);
  expect(result.productionReady).toBe(false);
  expect(result.execution).toBe("disabled");
  expect(result.rawValuesReported).toBe(false);
  expect(result.redacted).toBe(true);
  expect(result.actualSendCount).toBe(0);
  expect(result.gateRestoredHoldRequired).toBe(true);
}

function intentWithOverrides(overrides: Record<string, unknown>): DiscordSendPreflightIntent {
  return { ...validIntent(), ...overrides } as unknown as DiscordSendPreflightIntent;
}

describe("discord send preflight", () => {
  it("creates preflight intent from DiscordHumanGateMessageDraft", () => {
    const draft = makeDraft();
    const intent = createDiscordSendPreflightIntentFromDraft(draft, validOptions());

    expect(intent.surface).toBe("discord-send-preflight");
    expect(intent.intentOnly).toBe(true);
    expect(intent.sourceDraftTitle).toBe(draft.title);
    expect(intent.sourceDraftStatus).toBe(draft.source.sourceStatus);
    expect(intent.allowedSendCount).toBe(1);
    expect(intent.oneShotOnly).toBe(true);
    expect(intent.tokenProvided).toBe(false);
    expect(intent.webhookProvided).toBe(false);
    expect(intent.botRuntimeRequired).toBe(false);
  });

  it("returns READY_CANDIDATE for valid one-shot metadata", () => {
    const result = evaluateDiscordSendPreflight(validIntent());

    expect(result.status).toBe("READY_CANDIDATE");
    expectResultInvariants(result);
  });

  it("keeps sendReady and maySendNow false for READY_CANDIDATE", () => {
    const result = evaluateDiscordSendPreflight(validIntent());

    expect(result.status).toBe("READY_CANDIDATE");
    expect(result.sendReady).toBe(false);
    expect(result.maySendNow).toBe(false);
    expect(result.reasons.some((r) => r.includes("not send approval"))).toBe(true);
  });

  it("returns HOLD when humanGoReference is missing", () => {
    const intent = createDiscordSendPreflightIntentFromDraft(makeDraft(), {
      ...validOptions(),
      humanGoReference: undefined
    });
    const result = evaluateDiscordSendPreflight(intent);

    expect(result.status).toBe("HOLD");
    expect(result.missingRequirements).toContain("humanGoReference");
    expectResultInvariants(result);
  });

  it("returns HOLD when exactMessageText is missing", () => {
    const result = evaluateDiscordSendPreflight(
      createDiscordSendPreflightIntentFromDraft(makeDraft(), {
        ...validOptions(),
        exactMessageText: "   "
      })
    );

    expect(result.status).toBe("HOLD");
    expect(result.missingRequirements).toContain("exactMessageText");
    expectResultInvariants(result);
  });

  it("returns HOLD when targetChannelSummary is missing", () => {
    const result = evaluateDiscordSendPreflight(
      createDiscordSendPreflightIntentFromDraft(makeDraft(), {
        ...validOptions(),
        targetChannelSummary: ""
      })
    );

    expect(result.status).toBe("HOLD");
    expect(result.missingRequirements).toContain("targetChannelSummary");
    expectResultInvariants(result);
  });

  it("returns BLOCKED when requestedSendCount > 1", () => {
    const result = evaluateDiscordSendPreflight(intentWithOverrides({ requestedSendCount: 2 }));

    expect(result.status).toBe("BLOCKED");
    expectResultInvariants(result);
  });

  it("returns BLOCKED when autoReply is true", () => {
    const result = evaluateDiscordSendPreflight(intentWithOverrides({ autoReply: true }));

    expect(result.status).toBe("BLOCKED");
    expectResultInvariants(result);
  });

  it("returns BLOCKED when continuousMode is true", () => {
    const result = evaluateDiscordSendPreflight(intentWithOverrides({ continuousMode: true }));

    expect(result.status).toBe("BLOCKED");
    expectResultInvariants(result);
  });

  it("returns BLOCKED when tokenProvided is true", () => {
    const result = evaluateDiscordSendPreflight(intentWithOverrides({ tokenProvided: true }));

    expect(result.status).toBe("BLOCKED");
    expectResultInvariants(result);
  });

  it("returns BLOCKED when webhookProvided is true", () => {
    const result = evaluateDiscordSendPreflight(intentWithOverrides({ webhookProvided: true }));

    expect(result.status).toBe("BLOCKED");
    expectResultInvariants(result);
  });

  it("returns BLOCKED when botRuntimeRequired is true", () => {
    const result = evaluateDiscordSendPreflight(intentWithOverrides({ botRuntimeRequired: true }));

    expect(result.status).toBe("BLOCKED");
    expectResultInvariants(result);
  });

  it("returns BLOCKED when rawValuesReported is true", () => {
    const result = evaluateDiscordSendPreflight(intentWithOverrides({ rawValuesReported: true }));

    expect(result.status).toBe("BLOCKED");
    expectResultInvariants(result);
  });

  it("returns BLOCKED when redacted is false", () => {
    const result = evaluateDiscordSendPreflight(intentWithOverrides({ redacted: false }));

    expect(result.status).toBe("BLOCKED");
    expectResultInvariants(result);
  });

  it("renders preview string only", () => {
    const preview = renderDiscordSendPreflightPreview(evaluateDiscordSendPreflight(validIntent()));

    expect(typeof preview).toBe("string");
    expect(preview).toContain("no Discord send");
    expect(preview).toContain("READY_CANDIDATE does not approve send");
  });

  it("does not mutate draft input", () => {
    const draft = makeDraft();
    const before = JSON.stringify(draft);

    createDiscordSendPreflightIntentFromDraft(draft, validOptions());

    expect(JSON.stringify(draft)).toBe(before);
  });

  it("does not mutate intent input", () => {
    const intent = validIntent();
    const before = JSON.stringify(intent);

    evaluateDiscordSendPreflight(intent);

    expect(JSON.stringify(intent)).toBe(before);
  });
});
