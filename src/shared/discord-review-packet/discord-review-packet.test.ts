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
  DiscordBriefSendPreflightJoin,
  DiscordBriefSendPreflightJoinInput
} from "../discord-brief-send-preflight-join/discord-brief-send-preflight-join-types";
import { createDiscordOperatorBrief } from "../discord-operator-brief/discord-operator-brief";
import type { DiscordOperatorBrief } from "../discord-operator-brief/discord-operator-brief-types";
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
  createDiscordReviewPacket,
  createDiscordReviewPacketPreview,
  renderDiscordReviewPacketPreview
} from "./discord-review-packet";
import type { DiscordReviewPacket, DiscordReviewPacketInput } from "./discord-review-packet-types";

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
  const snapshot = createHumanGateStatusSnapshot({
    surface: "human-gate-status-snapshot-input",
    readinessDigest: digest,
    sourceOfTruth: "ledger",
    primaryDisplaySurface: "discord",
    fallbackDisplaySurface: "control-center",
    redacted: true
  });
  return createDiscordOperatorBrief({
    surface: "discord-operator-brief-input",
    snapshot,
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
    humanGoReference: "Discord Send GO / packet-test",
    redacted: true
  };
}

function joinedReview(
  brief: DiscordOperatorBrief,
  preflight: DiscordSendPreflightResult
): DiscordBriefSendPreflightJoin {
  return createDiscordBriefSendPreflightJoin(joinInput(brief, preflight));
}

function packetInput(joined: DiscordBriefSendPreflightJoin): DiscordReviewPacketInput {
  return {
    surface: "discord-review-packet-input",
    joinedReview: joined,
    redacted: true
  };
}

function expectPacketInvariants(packet: DiscordReviewPacket): void {
  expect(packet.packetOnly).toBe(true);
  expect(packet.reviewOnly).toBe(true);
  expect(packet.draftOnly).toBe(true);
  expect(packet.safety.packetOnly).toBe(true);
  expect(packet.safety.reviewOnly).toBe(true);
  expect(packet.safety.draftOnly).toBe(true);
  expect(packet.safety.displayOnly).toBe(true);
  expect(packet.safety.sendReady).toBe(false);
  expect(packet.safety.maySendNow).toBe(false);
  expect(packet.safety.actualDiscordSend).toBe(false);
  expect(packet.safety.webhookUsed).toBe(false);
  expect(packet.safety.botStarted).toBe(false);
  expect(packet.safety.tokenRead).toBe(false);
  expect(packet.safety.networkCall).toBe(false);
  expect(packet.safety.externalWrite).toBe(false);
  expect(packet.safety.runtimeStarted).toBe(false);
  expect(packet.safety.actualQueueMutation).toBe(false);
  expect(packet.safety.fileWriteReady).toBe(false);
  expect(packet.safety.humanGateQueueDocModified).toBe(false);
  expect(packet.safety.productionReady).toBe(false);
  expect(packet.safety.execution).toBe("disabled");
  expect(packet.safety.rawValuesReported).toBe(false);
  expect(packet.safety.redacted).toBe(true);
  expect(packet.reviewRows.every((row) => row.mayProceedNow === false)).toBe(true);
}

describe("discord review packet", () => {
  it("does not import Node fs in implementation module", () => {
    const source = readFileSync(join(__dirname, "discord-review-packet.ts"), "utf8");

    expect(source).not.toMatch(/from\s+["']node:fs["']/);
    expect(source).not.toMatch(/from\s+["']fs["']/);
  });

  it("creates REVIEW_READY_CANDIDATE packet from matching joined review", () => {
    const joined = joinedReview(readyBrief(), readyPreflight());
    const packet = createDiscordReviewPacket(packetInput(joined));

    expect(packet.status).toBe("REVIEW_READY_CANDIDATE");
    expect(packet.source.joinedReviewStatus).toBe("REVIEW_READY_CANDIDATE");
    expectPacketInvariants(packet);
  });

  it("keeps send flags false for REVIEW_READY_CANDIDATE packet", () => {
    const packet = createDiscordReviewPacket(
      packetInput(joinedReview(readyBrief(), readyPreflight()))
    );

    expect(packet.safety.sendReady).toBe(false);
    expect(packet.safety.maySendNow).toBe(false);
    expect(packet.safety.actualDiscordSend).toBe(false);
  });

  it("creates HOLD packet from HOLD joined review", () => {
    const packet = createDiscordReviewPacket(
      packetInput(joinedReview(holdBrief(), readyPreflight()))
    );

    expect(packet.status).toBe("HOLD");
    expectPacketInvariants(packet);
  });

  it("creates BLOCKED packet from BLOCKED joined review", () => {
    const packet = createDiscordReviewPacket(
      packetInput(joinedReview(blockedBrief(), readyPreflight()))
    );

    expect(packet.status).toBe("BLOCKED");
    expectPacketInvariants(packet);
  });

  it("generates deterministic packetId when omitted", () => {
    const joined = joinedReview(readyBrief(), readyPreflight());
    const input = packetInput(joined);
    const first = createDiscordReviewPacket(input);
    const second = createDiscordReviewPacket(input);

    expect(first.packetId).toBe(second.packetId);
    expect(first.packetId).toContain("discord-review-packet");
  });

  it("preserves provided packetId", () => {
    const packet = createDiscordReviewPacket({
      ...packetInput(joinedReview(readyBrief(), readyPreflight())),
      packetId: "custom-packet-id-001"
    });

    expect(packet.packetId).toBe("custom-packet-id-001");
  });

  it("preserves reviewRows from joined review", () => {
    const joined = joinedReview(readyBrief(), readyPreflight());
    const packet = createDiscordReviewPacket(packetInput(joined));

    expect(packet.reviewRows).toEqual(
      joined.reviewRows.map((row) => ({
        label: row.label,
        status: row.status,
        mayProceedNow: false,
        reasons: [...row.reasons]
      }))
    );
  });

  it("includes operator brief preview and send preflight preview", () => {
    const joined = joinedReview(readyBrief(), readyPreflight());
    const packet = createDiscordReviewPacket(packetInput(joined));

    expect(packet.operatorBriefPreview).toBe(joined.briefPreview);
    expect(packet.sendPreflightPreview).toBe(joined.sendPreflightSummary);
    expect(packet.bodyPreview).toContain(joined.briefPreview);
    expect(packet.bodyPreview).toContain(joined.sendPreflightSummary);
  });

  it("preserves humanGoReference from input when provided", () => {
    const joined = joinedReview(readyBrief(), readyPreflight());
    const packet = createDiscordReviewPacket({
      ...packetInput(joined),
      humanGoReference: "Human GO / packet-override"
    });

    expect(packet.source.humanGoReference).toBe("Human GO / packet-override");
  });

  it("renders preview with review-only language and no send/webhook/bot/token language", () => {
    const preview = createDiscordReviewPacketPreview(
      packetInput(joinedReview(readyBrief(), readyPreflight()))
    );

    expect(typeof preview).toBe("string");
    expect(preview).toContain("review-only");
    expect(preview).toContain("packet-only");
    expect(preview).toContain("no Discord send");
    expect(preview).toContain("not Discord send approval");
    expect(preview).toContain("No Discord send");
    expect(preview).toContain("No webhook");
    expect(preview).toContain("No bot");
    expect(preview).toContain("no token read");
  });

  it("renders preview via renderDiscordReviewPacketPreview", () => {
    const packet = createDiscordReviewPacket(
      packetInput(joinedReview(readyBrief(), readyPreflight()))
    );
    const preview = renderDiscordReviewPacketPreview(packet);

    expect(preview).toContain(packet.packetId);
    expect(preview).toContain(packet.status);
  });

  it("does not mutate input", () => {
    const input = packetInput(joinedReview(readyBrief(), readyPreflight()));
    const before = JSON.stringify(input);

    createDiscordReviewPacket(input);
    createDiscordReviewPacketPreview(input);

    expect(JSON.stringify(input)).toBe(before);
  });
});
