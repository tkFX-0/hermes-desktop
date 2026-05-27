import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { docsOnlySafeContract, missingVerificationHoldContract } from "../worker-task-contract/worker-task-contract-fixtures";
import type { WorkerTaskContract } from "../worker-task-contract/worker-task-contract-types";
import type { GoalRunnerDryRunInput } from "../goal-runner-dry-run/goal-runner-dry-run-types";
import { createDiscordHumanGateMessageDraft } from "../discord-human-gate-message-render/discord-human-gate-message-render";
import {
  createDiscordSendPreflightIntentFromDraft,
  evaluateDiscordSendPreflight
} from "../discord-send-preflight/discord-send-preflight";
import type { DiscordSendPreflightResult } from "../discord-send-preflight/discord-send-preflight-types";
import { createHumanGateQueueDisplayTargetItemFromContract } from "../human-gate-queue-display-target/human-gate-queue-display-target";
import { createHumanGateQueueMarkdownRenderModel } from "../human-gate-queue-markdown-render/human-gate-queue-markdown-render";
import {
  createHumanGateQueueMutationPreflightIntentFromMarkdownRenderModel,
  evaluateHumanGateQueueMutationPreflight
} from "../human-gate-queue-mutation-preflight/human-gate-queue-mutation-preflight";
import type { HumanGateQueueMutationPreflightResult } from "../human-gate-queue-mutation-preflight/human-gate-queue-mutation-preflight-types";
import {
  createDiscordSendReadinessDigest,
  createDiscordSendReadinessDigestPreview,
  renderDiscordSendReadinessDigestPreview
} from "./discord-send-readiness-digest";
import type {
  DiscordSendReadinessDigest,
  DiscordSendReadinessDigestInput
} from "./discord-send-readiness-digest-types";

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

function validDiscordPreflight(): DiscordSendPreflightResult {
  const draft = createDiscordHumanGateMessageDraft(
    createHumanGateQueueDisplayTargetItemFromContract(makeDryRunInput(docsOnlySafeContract))
  );
  return evaluateDiscordSendPreflight(
    createDiscordSendPreflightIntentFromDraft(draft, {
      exactMessageText: "Review-only message.",
      targetChannelSummary: "#human-gate-review",
      humanGoReference: "Discord Send GO / example",
      requestedSendCount: 1
    })
  );
}

function validQueuePreflight(): HumanGateQueueMutationPreflightResult {
  const item = createHumanGateQueueDisplayTargetItemFromContract(
    makeDryRunInput(docsOnlySafeContract)
  );
  const model = createHumanGateQueueMarkdownRenderModel(item);
  return evaluateHumanGateQueueMutationPreflight(
    createHumanGateQueueMutationPreflightIntentFromMarkdownRenderModel(model, {
      exactMarkdownToAppend: "## Queue entry preview",
      sourcePreviewCommit: "abc1234",
      humanGoReference: "Human Gate Queue Mutation GO / example",
      requestedMutationCount: 1
    })
  );
}

function holdDiscordPreflight(): DiscordSendPreflightResult {
  const draft = createDiscordHumanGateMessageDraft(
    createHumanGateQueueDisplayTargetItemFromContract(makeDryRunInput(docsOnlySafeContract))
  );
  return evaluateDiscordSendPreflight(
    createDiscordSendPreflightIntentFromDraft(draft, {
      exactMessageText: "text",
      targetChannelSummary: "#channel",
      humanGoReference: undefined
    })
  );
}

function blockedDiscordPreflight(): DiscordSendPreflightResult {
  const draft = createDiscordHumanGateMessageDraft(
    createHumanGateQueueDisplayTargetItemFromContract(makeDryRunInput(docsOnlySafeContract))
  );
  return evaluateDiscordSendPreflight(
    {
      ...createDiscordSendPreflightIntentFromDraft(draft, {
        exactMessageText: "text",
        targetChannelSummary: "#channel",
        humanGoReference: "GO",
        requestedSendCount: 2
      }),
      requestedSendCount: 2
    } as ReturnType<typeof createDiscordSendPreflightIntentFromDraft>
  );
}

function makeInput(
  discord: DiscordSendPreflightResult,
  queue: HumanGateQueueMutationPreflightResult
): DiscordSendReadinessDigestInput {
  return {
    surface: "discord-send-readiness-digest-input",
    discordSendPreflightResult: discord,
    queueMutationPreflightResult: queue,
    redacted: true
  };
}

function expectDigestInvariants(digest: DiscordSendReadinessDigest): void {
  expect(digest.digestOnly).toBe(true);
  expect(digest.safety.sendReady).toBe(false);
  expect(digest.safety.maySendNow).toBe(false);
  expect(digest.safety.mayMutateQueueNow).toBe(false);
  expect(digest.safety.fileWriteReady).toBe(false);
  expect(digest.safety.actualDiscordSend).toBe(false);
  expect(digest.safety.actualQueueMutation).toBe(false);
  expect(digest.safety.webhookUsed).toBe(false);
  expect(digest.safety.botStarted).toBe(false);
  expect(digest.safety.tokenRead).toBe(false);
  expect(digest.safety.networkCall).toBe(false);
  expect(digest.safety.externalWrite).toBe(false);
  expect(digest.safety.runtimeStarted).toBe(false);
  expect(digest.safety.productionReady).toBe(false);
  expect(digest.safety.execution).toBe("disabled");
  expect(digest.safety.rawValuesReported).toBe(false);
  expect(digest.safety.redacted).toBe(true);
  expect(digest.readinessRows.every((row) => row.mayProceedNow === false)).toBe(true);
}

describe("discord send readiness digest", () => {
  it("does not import Node fs in implementation module", () => {
    const source = readFileSync(join(__dirname, "discord-send-readiness-digest.ts"), "utf8");

    expect(source).not.toMatch(/from\s+["']node:fs["']/);
    expect(source).not.toMatch(/from\s+["']fs["']/);
  });

  it("creates REVIEW_READY_CANDIDATE when both preflights are READY_CANDIDATE", () => {
    const digest = createDiscordSendReadinessDigest(
      makeInput(validDiscordPreflight(), validQueuePreflight())
    );

    expect(digest.status).toBe("REVIEW_READY_CANDIDATE");
    expect(digest.readinessRows[0].status).toBe("READY_CANDIDATE");
    expect(digest.readinessRows[1].status).toBe("READY_CANDIDATE");
    expectDigestInvariants(digest);
    expect(digest.summary).toContain("not execution approval");
  });

  it("keeps send and mutation flags false for REVIEW_READY_CANDIDATE", () => {
    const digest = createDiscordSendReadinessDigest(
      makeInput(validDiscordPreflight(), validQueuePreflight())
    );

    expect(digest.status).toBe("REVIEW_READY_CANDIDATE");
    expect(digest.safety.sendReady).toBe(false);
    expect(digest.safety.maySendNow).toBe(false);
    expect(digest.safety.mayMutateQueueNow).toBe(false);
    expect(digest.safety.fileWriteReady).toBe(false);
  });

  it("creates HOLD digest when one preflight is HOLD", () => {
    const digest = createDiscordSendReadinessDigest(
      makeInput(holdDiscordPreflight(), validQueuePreflight())
    );

    expect(digest.status).toBe("HOLD");
    expectDigestInvariants(digest);
  });

  it("creates BLOCKED digest when any preflight is BLOCKED", () => {
    const digest = createDiscordSendReadinessDigest(
      makeInput(blockedDiscordPreflight(), validQueuePreflight())
    );

    expect(digest.status).toBe("BLOCKED");
    expectDigestInvariants(digest);
  });

  it("creates BLOCKED when queue preflight is BLOCKED", () => {
    const item = createHumanGateQueueDisplayTargetItemFromContract(
      makeDryRunInput(missingVerificationHoldContract)
    );
    const model = createHumanGateQueueMarkdownRenderModel(item);
    const queueBlocked = evaluateHumanGateQueueMutationPreflight(
      {
        ...createHumanGateQueueMutationPreflightIntentFromMarkdownRenderModel(model, {
          exactMarkdownToAppend: "x",
          sourcePreviewCommit: "abc",
          humanGoReference: "GO",
          requestedMutationCount: 2
        }),
        requestedMutationCount: 2
      } as ReturnType<typeof createHumanGateQueueMutationPreflightIntentFromMarkdownRenderModel>
    );

    expect(
      createDiscordSendReadinessDigest(makeInput(validDiscordPreflight(), queueBlocked)).status
    ).toBe("BLOCKED");
  });

  it("preserves reasons in readiness rows", () => {
    const discord = holdDiscordPreflight();
    const digest = createDiscordSendReadinessDigest(makeInput(discord, validQueuePreflight()));

    expect(digest.readinessRows[0].reasons.length).toBeGreaterThan(0);
    expect(digest.readinessRows[0].reasons.some((r) => r.includes("missing") || r.length > 0)).toBe(
      true
    );
  });

  it("builds deterministic readiness rows", () => {
    const input = makeInput(validDiscordPreflight(), validQueuePreflight());
    const first = createDiscordSendReadinessDigest(input);
    const second = createDiscordSendReadinessDigest(input);

    expect(first.readinessRows).toEqual(second.readinessRows);
    expect(first.status).toBe(second.status);
  });

  it("renders preview with review-only and no send/mutation language", () => {
    const preview = createDiscordSendReadinessDigestPreview(
      makeInput(validDiscordPreflight(), validQueuePreflight())
    );

    expect(typeof preview).toBe("string");
    expect(preview).toContain("review-only");
    expect(preview).toContain("no Discord send");
    expect(preview).toContain("no queue mutation");
    expect(preview).toContain("not send or queue mutation approval");
  });

  it("renders preview from digest via renderDiscordSendReadinessDigestPreview", () => {
    const digest = createDiscordSendReadinessDigest(
      makeInput(validDiscordPreflight(), validQueuePreflight())
    );
    const preview = renderDiscordSendReadinessDigestPreview(digest);

    expect(preview).toContain(digest.status);
    expect(preview).toContain("REVIEW_READY_CANDIDATE");
  });

  it("does not mutate input", () => {
    const input = makeInput(validDiscordPreflight(), validQueuePreflight());
    const before = JSON.stringify(input);

    createDiscordSendReadinessDigest(input);
    createDiscordSendReadinessDigestPreview(input);

    expect(JSON.stringify(input)).toBe(before);
  });
});
