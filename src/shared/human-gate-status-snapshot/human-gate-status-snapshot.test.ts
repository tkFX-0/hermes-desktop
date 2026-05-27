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
import { createDiscordSendReadinessDigest } from "../discord-send-readiness-digest/discord-send-readiness-digest";
import type {
  DiscordSendReadinessDigest,
  DiscordSendReadinessDigestInput
} from "../discord-send-readiness-digest/discord-send-readiness-digest-types";
import { createHumanGateQueueDisplayTargetItemFromContract } from "../human-gate-queue-display-target/human-gate-queue-display-target";
import { createHumanGateQueueMarkdownRenderModel } from "../human-gate-queue-markdown-render/human-gate-queue-markdown-render";
import {
  createHumanGateQueueMutationPreflightIntentFromMarkdownRenderModel,
  evaluateHumanGateQueueMutationPreflight
} from "../human-gate-queue-mutation-preflight/human-gate-queue-mutation-preflight";
import {
  createHumanGateStatusSnapshot,
  createHumanGateStatusSnapshotPreview,
  renderHumanGateStatusSnapshotPreview
} from "./human-gate-status-snapshot";
import type {
  HumanGateStatusSnapshot,
  HumanGateStatusSnapshotInput
} from "./human-gate-status-snapshot-types";

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

function makeDigestInput(
  discordOverrides: Partial<DiscordSendReadinessDigestInput["discordSendPreflightResult"]> = {},
  queueOverrides: Partial<DiscordSendReadinessDigestInput["queueMutationPreflightResult"]> = {}
): DiscordSendReadinessDigestInput {
  const draft = createDiscordHumanGateMessageDraft(
    createHumanGateQueueDisplayTargetItemFromContract(makeDryRunInput(docsOnlySafeContract))
  );
  const discord = evaluateDiscordSendPreflight(
    createDiscordSendPreflightIntentFromDraft(draft, {
      exactMessageText: "Review-only message.",
      targetChannelSummary: "#human-gate-review",
      humanGoReference: "Discord Send GO / example",
      requestedSendCount: 1
    })
  );
  const item = createHumanGateQueueDisplayTargetItemFromContract(
    makeDryRunInput(docsOnlySafeContract)
  );
  const queue = evaluateHumanGateQueueMutationPreflight(
    createHumanGateQueueMutationPreflightIntentFromMarkdownRenderModel(
      createHumanGateQueueMarkdownRenderModel(item),
      {
        exactMarkdownToAppend: "## Queue entry preview",
        sourcePreviewCommit: "abc1234",
        humanGoReference: "Human Gate Queue Mutation GO / example",
        requestedMutationCount: 1
      }
    )
  );

  return {
    surface: "discord-send-readiness-digest-input",
    discordSendPreflightResult: { ...discord, ...discordOverrides },
    queueMutationPreflightResult: { ...queue, ...queueOverrides },
    redacted: true
  };
}

function readyDigest(): DiscordSendReadinessDigest {
  return createDiscordSendReadinessDigest(makeDigestInput());
}

function holdDigest(): DiscordSendReadinessDigest {
  const draft = createDiscordHumanGateMessageDraft(
    createHumanGateQueueDisplayTargetItemFromContract(makeDryRunInput(docsOnlySafeContract))
  );
  return createDiscordSendReadinessDigest({
    surface: "discord-send-readiness-digest-input",
    discordSendPreflightResult: evaluateDiscordSendPreflight(
      createDiscordSendPreflightIntentFromDraft(draft, {
        exactMessageText: "text",
        targetChannelSummary: "#ch",
        humanGoReference: undefined
      })
    ),
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
}

function blockedDigest(): DiscordSendReadinessDigest {
  const draft = createDiscordHumanGateMessageDraft(
    createHumanGateQueueDisplayTargetItemFromContract(makeDryRunInput(docsOnlySafeContract))
  );
  return createDiscordSendReadinessDigest({
    surface: "discord-send-readiness-digest-input",
    discordSendPreflightResult: evaluateDiscordSendPreflight({
      ...createDiscordSendPreflightIntentFromDraft(draft, {
        exactMessageText: "t",
        targetChannelSummary: "#c",
        humanGoReference: "GO",
        requestedSendCount: 2
      }),
      requestedSendCount: 2
    } as ReturnType<typeof createDiscordSendPreflightIntentFromDraft>),
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
}

function baseInput(digest: DiscordSendReadinessDigest): HumanGateStatusSnapshotInput {
  return {
    surface: "human-gate-status-snapshot-input",
    readinessDigest: digest,
    sourceOfTruth: "ledger",
    primaryDisplaySurface: "discord",
    fallbackDisplaySurface: "control-center",
    redacted: true
  };
}

function expectSnapshotInvariants(snapshot: HumanGateStatusSnapshot): void {
  expect(snapshot.snapshotOnly).toBe(true);
  expect(snapshot.sourceOfTruth).toBe("ledger");
  expect(snapshot.primaryDisplaySurface).toBe("discord");
  expect(snapshot.fallbackDisplaySurface).toBe("control-center");
  expect(snapshot.safety.sendReady).toBe(false);
  expect(snapshot.safety.maySendNow).toBe(false);
  expect(snapshot.safety.mayMutateQueueNow).toBe(false);
  expect(snapshot.safety.fileWriteReady).toBe(false);
  expect(snapshot.safety.actualDiscordSend).toBe(false);
  expect(snapshot.safety.actualQueueMutation).toBe(false);
  expect(snapshot.safety.humanGateQueueDocModified).toBe(false);
  expect(snapshot.safety.webhookUsed).toBe(false);
  expect(snapshot.safety.botStarted).toBe(false);
  expect(snapshot.safety.tokenRead).toBe(false);
  expect(snapshot.safety.networkCall).toBe(false);
  expect(snapshot.safety.externalWrite).toBe(false);
  expect(snapshot.safety.runtimeStarted).toBe(false);
  expect(snapshot.safety.obsidianActualWrite).toBe(false);
  expect(snapshot.safety.productionReady).toBe(false);
  expect(snapshot.safety.execution).toBe("disabled");
  expect(snapshot.safety.rawValuesReported).toBe(false);
  expect(snapshot.safety.redacted).toBe(true);
}

describe("human gate status snapshot", () => {
  it("does not import Node fs in implementation module", () => {
    const source = readFileSync(join(__dirname, "human-gate-status-snapshot.ts"), "utf8");

    expect(source).not.toMatch(/from\s+["']node:fs["']/);
    expect(source).not.toMatch(/from\s+["']fs["']/);
  });

  it("creates REVIEW_READY_CANDIDATE snapshot from REVIEW_READY_CANDIDATE digest", () => {
    const snapshot = createHumanGateStatusSnapshot(baseInput(readyDigest()));

    expect(snapshot.status).toBe("REVIEW_READY_CANDIDATE");
    expectSnapshotInvariants(snapshot);
    expect(snapshot.summary).toContain("not send");
  });

  it("keeps safety flags false for REVIEW_READY_CANDIDATE snapshot", () => {
    const snapshot = createHumanGateStatusSnapshot(baseInput(readyDigest()));

    expect(snapshot.safety.sendReady).toBe(false);
    expect(snapshot.safety.maySendNow).toBe(false);
    expect(snapshot.safety.mayMutateQueueNow).toBe(false);
    expect(snapshot.safety.fileWriteReady).toBe(false);
  });

  it("creates HOLD snapshot from HOLD digest", () => {
    expect(createHumanGateStatusSnapshot(baseInput(holdDigest())).status).toBe("HOLD");
  });

  it("creates BLOCKED snapshot from BLOCKED digest", () => {
    expect(createHumanGateStatusSnapshot(baseInput(blockedDigest())).status).toBe("BLOCKED");
  });

  it("builds deterministic cards", () => {
    const input = baseInput(readyDigest());
    const first = createHumanGateStatusSnapshot(input);
    const second = createHumanGateStatusSnapshot(input);

    expect(first.cards).toEqual(second.cards);
    expect(first.cards.length).toBeGreaterThan(2);
  });

  it("renders preview with review-only and no send/mutation language", () => {
    const preview = createHumanGateStatusSnapshotPreview(baseInput(readyDigest()));

    expect(typeof preview).toBe("string");
    expect(preview).toContain("review-only");
    expect(preview).toContain("no Discord send");
    expect(preview).toContain("no queue mutation");
    expect(preview).toContain("source of truth");
    expect(preview).toContain("discord");
    expect(preview).toContain("control-center");
  });

  it("renders preview from snapshot via renderHumanGateStatusSnapshotPreview", () => {
    const snapshot = createHumanGateStatusSnapshot(baseInput(readyDigest()));
    const preview = renderHumanGateStatusSnapshotPreview(snapshot);

    expect(preview).toContain(snapshot.status);
  });

  it("does not mutate input", () => {
    const input = baseInput(readyDigest());
    const before = JSON.stringify(input);

    createHumanGateStatusSnapshot(input);
    createHumanGateStatusSnapshotPreview(input);

    expect(JSON.stringify(input)).toBe(before);
  });
});
