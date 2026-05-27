import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { docsOnlySafeContract } from "../worker-task-contract/worker-task-contract-fixtures";
import type { WorkerTaskContract } from "../worker-task-contract/worker-task-contract-types";
import type { GoalRunnerDryRunInput } from "../goal-runner-dry-run/goal-runner-dry-run-types";
import { createDiscordHumanGateMessageDraft } from "../discord-human-gate-message-render/discord-human-gate-message-render";
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
import type {
  HumanGateStatusSnapshot,
  HumanGateStatusSnapshotInput
} from "../human-gate-status-snapshot/human-gate-status-snapshot-types";
import {
  createDiscordReviewPacketAssembly,
  createDiscordReviewPacketAssemblyPreview
} from "./discord-review-packet-assembly";
import type {
  DiscordReviewPacketAssemblyInput,
  DiscordReviewPacketAssemblyResult
} from "./discord-review-packet-assembly-types";

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

function snapshotInput(
  discordPreflight: DiscordSendPreflightResult,
  queueHumanGo = "GO"
): HumanGateStatusSnapshotInput {
  const item = createHumanGateQueueDisplayTargetItemFromContract(
    makeDryRunInput(docsOnlySafeContract)
  );
  const digest = createDiscordSendReadinessDigest({
    surface: "discord-send-readiness-digest-input",
    discordSendPreflightResult: discordPreflight,
    queueMutationPreflightResult: evaluateHumanGateQueueMutationPreflight(
      createHumanGateQueueMutationPreflightIntentFromMarkdownRenderModel(
        createHumanGateQueueMarkdownRenderModel(item),
        {
          exactMarkdownToAppend: "## Queue",
          sourcePreviewCommit: "abc1234",
          humanGoReference: queueHumanGo,
          requestedMutationCount: 1
        }
      )
    ),
    redacted: true
  });
  return {
    surface: "human-gate-status-snapshot-input",
    readinessDigest: digest,
    sourceOfTruth: "ledger",
    primaryDisplaySurface: "discord",
    fallbackDisplaySurface: "control-center",
    humanGoReference: "Human GO / assembly-test",
    redacted: true
  };
}

function readySnapshot(): HumanGateStatusSnapshot {
  return createHumanGateStatusSnapshot(snapshotInput(readyPreflight()));
}

function holdSnapshot(): HumanGateStatusSnapshot {
  return createHumanGateStatusSnapshot(snapshotInput(holdPreflight()));
}

function blockedSnapshot(): HumanGateStatusSnapshot {
  return createHumanGateStatusSnapshot(snapshotInput(blockedPreflight()));
}

function assemblyInput(
  snapshot: HumanGateStatusSnapshot,
  sendPreflight: DiscordSendPreflightResult,
  overrides: Partial<Pick<DiscordReviewPacketAssemblyInput, "packetId" | "humanGoReference">> = {}
): DiscordReviewPacketAssemblyInput {
  return {
    surface: "discord-review-packet-assembly-input",
    snapshot,
    sendPreflightResult: sendPreflight,
    redacted: true,
    ...overrides
  };
}

function expectAssemblyInvariants(result: DiscordReviewPacketAssemblyResult): void {
  expect(result.assemblyOnly).toBe(true);
  expect(result.reviewOnly).toBe(true);
  expect(result.draftOnly).toBe(true);
  expect(result.safety.assemblyOnly).toBe(true);
  expect(result.safety.sendReady).toBe(false);
  expect(result.safety.maySendNow).toBe(false);
  expect(result.safety.actualDiscordSend).toBe(false);
  expect(result.safety.webhookUsed).toBe(false);
  expect(result.safety.botStarted).toBe(false);
  expect(result.safety.tokenRead).toBe(false);
  expect(result.safety.networkCall).toBe(false);
  expect(result.safety.externalWrite).toBe(false);
  expect(result.safety.runtimeStarted).toBe(false);
  expect(result.safety.actualQueueMutation).toBe(false);
  expect(result.safety.fileWriteReady).toBe(false);
  expect(result.safety.humanGateQueueDocModified).toBe(false);
  expect(result.safety.productionReady).toBe(false);
  expect(result.safety.execution).toBe("disabled");
  expect(result.safety.rawValuesReported).toBe(false);
  expect(result.safety.redacted).toBe(true);
  expect(result.operatorBrief.briefOnly).toBe(true);
  expect(result.joinedReview.joinOnly).toBe(true);
  expect(result.reviewPacket.packetOnly).toBe(true);
}

describe("discord review packet assembly", () => {
  it("does not import Node fs in implementation module", () => {
    const source = readFileSync(join(__dirname, "discord-review-packet-assembly.ts"), "utf8");

    expect(source).not.toMatch(/from\s+["']node:fs["']/);
    expect(source).not.toMatch(/from\s+["']fs["']/);
  });

  it("creates REVIEW_READY_CANDIDATE assembly from matching snapshot and preflight", () => {
    const result = createDiscordReviewPacketAssembly(
      assemblyInput(readySnapshot(), readyPreflight())
    );

    expect(result.status).toBe("REVIEW_READY_CANDIDATE");
    expect(result.status).toBe(result.reviewPacket.status);
    expectAssemblyInvariants(result);
  });

  it("creates HOLD assembly from HOLD snapshot", () => {
    const result = createDiscordReviewPacketAssembly(
      assemblyInput(holdSnapshot(), readyPreflight())
    );

    expect(result.status).toBe("HOLD");
    expect(result.status).toBe(result.reviewPacket.status);
    expectAssemblyInvariants(result);
  });

  it("creates BLOCKED assembly from BLOCKED snapshot", () => {
    const result = createDiscordReviewPacketAssembly(
      assemblyInput(blockedSnapshot(), readyPreflight())
    );

    expect(result.status).toBe("BLOCKED");
    expectAssemblyInvariants(result);
  });

  it("creates BLOCKED assembly from BLOCKED send preflight", () => {
    const result = createDiscordReviewPacketAssembly(
      assemblyInput(readySnapshot(), blockedPreflight())
    );

    expect(result.status).toBe("BLOCKED");
    expectAssemblyInvariants(result);
  });

  it("creates operatorBrief, joinedReview, reviewPacket, and preview", () => {
    const result = createDiscordReviewPacketAssembly(
      assemblyInput(readySnapshot(), readyPreflight())
    );

    expect(result.operatorBrief.surface).toBe("discord-operator-brief");
    expect(result.joinedReview.surface).toBe("discord-brief-send-preflight-join");
    expect(result.reviewPacket.surface).toBe("discord-review-packet");
    expect(typeof result.preview).toBe("string");
    expect(result.preview.length).toBeGreaterThan(0);
    expect(result.preview).toContain(result.reviewPacket.packetId);
  });

  it("preserves provided packetId", () => {
    const result = createDiscordReviewPacketAssembly(
      assemblyInput(readySnapshot(), readyPreflight(), { packetId: "custom-assembly-packet-001" })
    );

    expect(result.reviewPacket.packetId).toBe("custom-assembly-packet-001");
    expect(result.source.packetId).toBe("custom-assembly-packet-001");
  });

  it("preserves provided humanGoReference", () => {
    const result = createDiscordReviewPacketAssembly(
      assemblyInput(readySnapshot(), readyPreflight(), {
        humanGoReference: "Human GO / assembly-override"
      })
    );

    expect(result.source.humanGoReference).toBe("Human GO / assembly-override");
    expect(result.reviewPacket.source.humanGoReference).toBe("Human GO / assembly-override");
  });

  it("keeps send flags false for REVIEW_READY_CANDIDATE assembly", () => {
    const result = createDiscordReviewPacketAssembly(
      assemblyInput(readySnapshot(), readyPreflight())
    );

    expect(result.safety.sendReady).toBe(false);
    expect(result.safety.maySendNow).toBe(false);
    expect(result.safety.actualDiscordSend).toBe(false);
  });

  it("preview includes review-only language", () => {
    const preview = createDiscordReviewPacketAssemblyPreview(
      assemblyInput(readySnapshot(), readyPreflight())
    );

    expect(preview).toContain("review-only");
    expect(preview).toContain("packet-only");
    expect(preview).toContain("no Discord send");
  });

  it("does not mutate input", () => {
    const input = assemblyInput(readySnapshot(), readyPreflight());
    const before = JSON.stringify(input);

    createDiscordReviewPacketAssembly(input);
    createDiscordReviewPacketAssemblyPreview(input);

    expect(JSON.stringify(input)).toBe(before);
  });
});
