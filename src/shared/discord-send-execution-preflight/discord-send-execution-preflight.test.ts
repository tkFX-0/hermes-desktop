import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { docsOnlySafeContract } from "../worker-task-contract/worker-task-contract-fixtures";
import type { WorkerTaskContract } from "../worker-task-contract/worker-task-contract-types";
import type { GoalRunnerDryRunInput } from "../goal-runner-dry-run/goal-runner-dry-run-types";
import { createDiscordHumanGateMessageDraft } from "../discord-human-gate-message-render/discord-human-gate-message-render";
import { createDiscordBriefSendPreflightJoin } from "../discord-brief-send-preflight-join/discord-brief-send-preflight-join";
import type {
  DiscordBriefSendPreflightJoinInput
} from "../discord-brief-send-preflight-join/discord-brief-send-preflight-join-types";
import { createDiscordOperatorBrief } from "../discord-operator-brief/discord-operator-brief";
import type { DiscordOperatorBrief } from "../discord-operator-brief/discord-operator-brief-types";
import {
  createDiscordReviewPacket,
  renderDiscordReviewPacketPreview
} from "../discord-review-packet/discord-review-packet";
import type { DiscordReviewPacket, DiscordReviewPacketInput } from "../discord-review-packet/discord-review-packet-types";
import {
  createDiscordSendPreflightIntentFromDraft,
  evaluateDiscordSendPreflight
} from "../discord-send-preflight/discord-send-preflight";
import type { DiscordSendPreflightResult } from "../discord-send-preflight/discord-send-preflight-types";
import { createDiscordSendReadinessDigest } from "../discord-send-readiness-digest/discord-send-readiness-digest";
import { createHumanGateQueueDisplayTargetItemFromContract } from "../human-gate-queue-display-target/human-gate-queue-display-target";
import { createHumanGateQueueMarkdownRenderModel } from "../human-gate-queue-markdown-render/human-gate-queue-markdown-render";
import {
  createHumanGateQueueMutationPreflightIntentFromMarkdownRenderModel,
  evaluateHumanGateQueueMutationPreflight
} from "../human-gate-queue-mutation-preflight/human-gate-queue-mutation-preflight";
import { createHumanGateStatusSnapshot } from "../human-gate-status-snapshot/human-gate-status-snapshot";
import {
  createDiscordSendExecutionPreflightIntent,
  createDiscordSendExecutionPreflightPreview,
  evaluateDiscordSendExecutionPreflight
} from "./discord-send-execution-preflight";
import type {
  CreateDiscordSendExecutionPreflightIntentOptions,
  DiscordSendExecutionPreflightIntent,
  DiscordSendExecutionPreflightResult
} from "./discord-send-execution-preflight-types";

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

function readyPreflight(): DiscordSendPreflightResult {
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

function holdPreflight(): DiscordSendPreflightResult {
  const draft = createDiscordHumanGateMessageDraft(
    createHumanGateQueueDisplayTargetItemFromContract(makeDryRunInput(docsOnlySafeContract))
  );
  return evaluateDiscordSendPreflight(
    createDiscordSendPreflightIntentFromDraft(draft, {
      exactMessageText: "text",
      targetChannelSummary: "#ch",
      humanGoReference: undefined
    })
  );
}

function blockedPreflight(): DiscordSendPreflightResult {
  const draft = createDiscordHumanGateMessageDraft(
    createHumanGateQueueDisplayTargetItemFromContract(makeDryRunInput(docsOnlySafeContract))
  );
  return evaluateDiscordSendPreflight({
    ...createDiscordSendPreflightIntentFromDraft(draft, {
      exactMessageText: "t",
      targetChannelSummary: "#c",
      humanGoReference: "GO",
      requestedSendCount: 2
    }),
    requestedSendCount: 2
  } as ReturnType<typeof createDiscordSendPreflightIntentFromDraft>);
}

function readyBrief(): DiscordOperatorBrief {
  const digest = createDiscordSendReadinessDigest({
    surface: "discord-send-readiness-digest-input",
    discordSendPreflightResult: readyPreflight(),
    queueMutationPreflightResult: evaluateHumanGateQueueMutationPreflight(
      createHumanGateQueueMutationPreflightIntentFromMarkdownRenderModel(
        createHumanGateQueueMarkdownRenderModel(
          createHumanGateQueueDisplayTargetItemFromContract(makeDryRunInput(docsOnlySafeContract))
        ),
        {
          exactMarkdownToAppend: "## Queue",
          sourcePreviewCommit: "abc1234",
          humanGoReference: "GO",
          requestedMutationCount: 1
        }
      )
    ),
    redacted: true
  });
  return createDiscordOperatorBrief({
    surface: "discord-operator-brief-input",
    snapshot: createHumanGateStatusSnapshot({
      surface: "human-gate-status-snapshot-input",
      readinessDigest: digest,
      sourceOfTruth: "ledger",
      primaryDisplaySurface: "discord",
      fallbackDisplaySurface: "control-center",
      redacted: true
    }),
    redacted: true
  });
}

function holdBrief(): DiscordOperatorBrief {
  const digest = createDiscordSendReadinessDigest({
    surface: "discord-send-readiness-digest-input",
    discordSendPreflightResult: holdPreflight(),
    queueMutationPreflightResult: evaluateHumanGateQueueMutationPreflight(
      createHumanGateQueueMutationPreflightIntentFromMarkdownRenderModel(
        createHumanGateQueueMarkdownRenderModel(
          createHumanGateQueueDisplayTargetItemFromContract(makeDryRunInput(docsOnlySafeContract))
        ),
        {
          exactMarkdownToAppend: "## x",
          sourcePreviewCommit: "abc",
          humanGoReference: "GO",
          requestedMutationCount: 1
        }
      )
    ),
    redacted: true
  });
  return createDiscordOperatorBrief({
    surface: "discord-operator-brief-input",
    snapshot: createHumanGateStatusSnapshot({
      surface: "human-gate-status-snapshot-input",
      readinessDigest: digest,
      sourceOfTruth: "ledger",
      primaryDisplaySurface: "discord",
      fallbackDisplaySurface: "control-center",
      redacted: true
    }),
    redacted: true
  });
}

function blockedBrief(): DiscordOperatorBrief {
  const digest = createDiscordSendReadinessDigest({
    surface: "discord-send-readiness-digest-input",
    discordSendPreflightResult: blockedPreflight(),
    queueMutationPreflightResult: evaluateHumanGateQueueMutationPreflight(
      createHumanGateQueueMutationPreflightIntentFromMarkdownRenderModel(
        createHumanGateQueueMarkdownRenderModel(
          createHumanGateQueueDisplayTargetItemFromContract(makeDryRunInput(docsOnlySafeContract))
        ),
        {
          exactMarkdownToAppend: "## x",
          sourcePreviewCommit: "abc",
          humanGoReference: "GO",
          requestedMutationCount: 1
        }
      )
    ),
    redacted: true
  });
  return createDiscordOperatorBrief({
    surface: "discord-operator-brief-input",
    snapshot: createHumanGateStatusSnapshot({
      surface: "human-gate-status-snapshot-input",
      readinessDigest: digest,
      sourceOfTruth: "ledger",
      primaryDisplaySurface: "discord",
      fallbackDisplaySurface: "control-center",
      redacted: true
    }),
    redacted: true
  });
}

function joinInput(
  brief: DiscordOperatorBrief,
  preflight: DiscordSendPreflightResult
): DiscordBriefSendPreflightJoinInput {
  return {
    surface: "discord-brief-send-preflight-join-input",
    operatorBrief: brief,
    sendPreflightResult: preflight,
    humanGoReference: "Discord Send GO / execution-preflight-test",
    redacted: true
  };
}

function reviewPacket(
  brief: DiscordOperatorBrief,
  preflight: DiscordSendPreflightResult
): DiscordReviewPacket {
  const joined = createDiscordBriefSendPreflightJoin(joinInput(brief, preflight));
  const input: DiscordReviewPacketInput = {
    surface: "discord-review-packet-input",
    joinedReview: joined,
    redacted: true
  };
  return createDiscordReviewPacket(input);
}

function readyReviewPacket(): DiscordReviewPacket {
  return reviewPacket(readyBrief(), readyPreflight());
}

function completeOptions(
  packet: DiscordReviewPacket
): CreateDiscordSendExecutionPreflightIntentOptions {
  return {
    sourceReviewPacketCommit: "95cfe3e",
    exactPacketPreview: renderDiscordReviewPacketPreview(packet),
    exactMessageTextToSend: "Review-only message for one-shot send candidate.",
    targetChannelSummary: "#human-gate-review",
    humanGoReference: "Discord One-Shot Send GO / test",
    requestedSendCount: 1,
    preSendGitStatusClean: true,
    preSendTestsOrReasonIfSkipped: "vitest full suite PASS"
  };
}

function readyIntent(
  overrides: Partial<CreateDiscordSendExecutionPreflightIntentOptions> = {}
): DiscordSendExecutionPreflightIntent {
  const packet = readyReviewPacket();
  return createDiscordSendExecutionPreflightIntent(packet, {
    ...completeOptions(packet),
    ...overrides
  });
}

function withForbiddenOverrides(
  intent: DiscordSendExecutionPreflightIntent,
  overrides: Record<string, unknown>
): DiscordSendExecutionPreflightIntent {
  return { ...intent, ...overrides } as DiscordSendExecutionPreflightIntent;
}

function expectResultInvariants(result: DiscordSendExecutionPreflightResult): void {
  expect(result.resultOnly).toBe(true);
  expect(result.sendReady).toBe(false);
  expect(result.maySendNow).toBe(false);
  expect(result.actualDiscordSend).toBe(false);
  expect(result.webhookUsed).toBe(false);
  expect(result.botStarted).toBe(false);
  expect(result.tokenRead).toBe(false);
  expect(result.networkCall).toBe(false);
  expect(result.externalWrite).toBe(false);
  expect(result.runtimeStarted).toBe(false);
  expect(result.actualQueueMutation).toBe(false);
  expect(result.fileWriteReady).toBe(false);
  expect(result.humanGateQueueDocModified).toBe(false);
  expect(result.productionReady).toBe(false);
  expect(result.execution).toBe("disabled");
  expect(result.rawValuesReported).toBe(false);
  expect(result.redacted).toBe(true);
  expect(result.allowedSendCount).toBe(1);
  expect(result.actualSendCount).toBe(0);
  expect(result.gateRestoredHoldRequired).toBe(true);
  expect(result.rollbackOrRemediationRequired).toBe(true);
}

describe("discord send execution preflight", () => {
  it("does not import Node fs in implementation module", () => {
    const source = readFileSync(join(__dirname, "discord-send-execution-preflight.ts"), "utf8");

    expect(source).not.toMatch(/from\s+["']node:fs["']/);
    expect(source).not.toMatch(/from\s+["']fs["']/);
  });

  it("creates EXECUTION_READY_CANDIDATE from REVIEW_READY_CANDIDATE packet with complete metadata", () => {
    const result = evaluateDiscordSendExecutionPreflight(readyIntent());

    expect(result.status).toBe("EXECUTION_READY_CANDIDATE");
    expectResultInvariants(result);
    expect(result.source.reviewPacketStatus).toBe("REVIEW_READY_CANDIDATE");
  });

  it("keeps send flags false for EXECUTION_READY_CANDIDATE", () => {
    const result = evaluateDiscordSendExecutionPreflight(readyIntent());

    expect(result.sendReady).toBe(false);
    expect(result.maySendNow).toBe(false);
    expect(result.actualDiscordSend).toBe(false);
  });

  it("creates HOLD from HOLD review packet", () => {
    const packet = reviewPacket(holdBrief(), readyPreflight());
    const result = evaluateDiscordSendExecutionPreflight(
      createDiscordSendExecutionPreflightIntent(packet, completeOptions(packet))
    );

    expect(result.status).toBe("HOLD");
    expect(result.missingRequirements).toContain(
      "reviewPacket.status must be REVIEW_READY_CANDIDATE"
    );
    expectResultInvariants(result);
  });

  it("creates BLOCKED from BLOCKED review packet", () => {
    const packet = reviewPacket(blockedBrief(), readyPreflight());
    const result = evaluateDiscordSendExecutionPreflight(
      createDiscordSendExecutionPreflightIntent(packet, completeOptions(packet))
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.blockedReasons).toContain("reviewPacket.status is BLOCKED");
    expectResultInvariants(result);
  });

  it("returns HOLD when humanGoReference is missing", () => {
    const result = evaluateDiscordSendExecutionPreflight(
      readyIntent({ humanGoReference: undefined })
    );

    expect(result.status).toBe("HOLD");
    expect(result.missingRequirements).toContain("humanGoReference");
  });

  it("returns HOLD when exactPacketPreview is missing", () => {
    const result = evaluateDiscordSendExecutionPreflight(readyIntent({ exactPacketPreview: "" }));

    expect(result.status).toBe("HOLD");
    expect(result.missingRequirements).toContain("exactPacketPreview");
  });

  it("returns HOLD when exactMessageTextToSend is missing", () => {
    const result = evaluateDiscordSendExecutionPreflight(
      readyIntent({ exactMessageTextToSend: "" })
    );

    expect(result.status).toBe("HOLD");
    expect(result.missingRequirements).toContain("exactMessageTextToSend");
  });

  it("returns HOLD when targetChannelSummary is missing", () => {
    const result = evaluateDiscordSendExecutionPreflight(readyIntent({ targetChannelSummary: "" }));

    expect(result.status).toBe("HOLD");
    expect(result.missingRequirements).toContain("targetChannelSummary");
  });

  it("returns BLOCKED when requestedSendCount exceeds one", () => {
    const intent = withForbiddenOverrides(readyIntent(), { requestedSendCount: 2 });
    const result = evaluateDiscordSendExecutionPreflight(intent);

    expect(result.status).toBe("BLOCKED");
    expect(result.blockedReasons).toContain("requestedSendCount exceeds one-shot limit");
  });

  it("returns BLOCKED when autoReply is true", () => {
    const result = evaluateDiscordSendExecutionPreflight(
      withForbiddenOverrides(readyIntent(), { autoReply: true })
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.blockedReasons).toContain("autoReply is NOT_APPROVED");
  });

  it("returns BLOCKED when continuousMode is true", () => {
    const result = evaluateDiscordSendExecutionPreflight(
      withForbiddenOverrides(readyIntent(), { continuousMode: true })
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.blockedReasons).toContain("continuousMode is NOT_APPROVED");
  });

  it("returns BLOCKED when webhookExecutionRequested is true", () => {
    const result = evaluateDiscordSendExecutionPreflight(
      withForbiddenOverrides(readyIntent(), { webhookExecutionRequested: true })
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.blockedReasons).toContain("webhookExecutionRequested is not allowed");
  });

  it("returns BLOCKED when botRuntimeRequested is true", () => {
    const result = evaluateDiscordSendExecutionPreflight(
      withForbiddenOverrides(readyIntent(), { botRuntimeRequested: true })
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.blockedReasons).toContain("botRuntimeRequested is not allowed");
  });

  it("returns BLOCKED when tokenReadRequested is true", () => {
    const result = evaluateDiscordSendExecutionPreflight(
      withForbiddenOverrides(readyIntent(), { tokenReadRequested: true })
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.blockedReasons).toContain("tokenReadRequested is not allowed");
  });

  it("returns BLOCKED when rawValuesReported is true", () => {
    const result = evaluateDiscordSendExecutionPreflight(
      withForbiddenOverrides(readyIntent(), { rawValuesReported: true })
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.blockedReasons).toContain("rawValuesReported must remain false");
  });

  it("returns BLOCKED when tokenNotLogged is false", () => {
    const result = evaluateDiscordSendExecutionPreflight(
      withForbiddenOverrides(readyIntent(), { tokenNotLogged: false })
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.blockedReasons).toContain("tokenNotLogged must remain true");
  });

  it("returns BLOCKED when networkCallLimitedToDiscordSendOnly is false", () => {
    const result = evaluateDiscordSendExecutionPreflight(
      withForbiddenOverrides(readyIntent(), { networkCallLimitedToDiscordSendOnly: false })
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.blockedReasons).toContain(
      "networkCallLimitedToDiscordSendOnly must remain true"
    );
  });

  it("returns BLOCKED when redacted is false", () => {
    const result = evaluateDiscordSendExecutionPreflight(
      withForbiddenOverrides(readyIntent(), { redacted: false })
    );

    expect(result.status).toBe("BLOCKED");
    expect(result.blockedReasons).toContain("redacted must remain true");
  });

  it("builds deterministic reasons and requirement lists", () => {
    const intent = readyIntent({ humanGoReference: undefined });
    const first = evaluateDiscordSendExecutionPreflight(intent);
    const second = evaluateDiscordSendExecutionPreflight(intent);

    expect(first).toEqual(second);
  });

  it("renders preview with not-send-approval language", () => {
    const preview = createDiscordSendExecutionPreflightPreview(readyIntent());

    expect(typeof preview).toBe("string");
    expect(preview).toContain("preflight-only");
    expect(preview).toContain("no Discord send");
    expect(preview).toContain("does not approve Discord send");
    expect(preview).toContain("no webhook");
    expect(preview).toContain("no bot");
    expect(preview).toContain("no token read");
  });

  it("does not mutate input", () => {
    const intent = readyIntent();
    const before = JSON.stringify(intent);

    evaluateDiscordSendExecutionPreflight(intent);
    createDiscordSendExecutionPreflightPreview(intent);

    expect(JSON.stringify(intent)).toBe(before);
  });
});
