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
import { createHumanGateQueueDisplayTargetItemFromContract } from "../human-gate-queue-display-target/human-gate-queue-display-target";
import { createHumanGateQueueMarkdownRenderModel } from "../human-gate-queue-markdown-render/human-gate-queue-markdown-render";
import {
  createHumanGateQueueMutationPreflightIntentFromMarkdownRenderModel,
  evaluateHumanGateQueueMutationPreflight
} from "../human-gate-queue-mutation-preflight/human-gate-queue-mutation-preflight";
import { createHumanGateStatusSnapshot } from "../human-gate-status-snapshot/human-gate-status-snapshot";
import type { HumanGateStatusSnapshot } from "../human-gate-status-snapshot/human-gate-status-snapshot-types";
import {
  createDiscordOperatorBrief,
  createDiscordOperatorBriefPreview,
  renderDiscordOperatorBriefPreview
} from "./discord-operator-brief";
import type { DiscordOperatorBrief, DiscordOperatorBriefInput } from "./discord-operator-brief-types";

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

function readySnapshot(): HumanGateStatusSnapshot {
  const draft = createDiscordHumanGateMessageDraft(
    createHumanGateQueueDisplayTargetItemFromContract(makeDryRunInput(docsOnlySafeContract))
  );
  const digest = createDiscordSendReadinessDigest({
    surface: "discord-send-readiness-digest-input",
    discordSendPreflightResult: evaluateDiscordSendPreflight(
      createDiscordSendPreflightIntentFromDraft(draft, {
        exactMessageText: "Review-only message.",
        targetChannelSummary: "#human-gate-review",
        humanGoReference: "Discord Send GO / example",
        requestedSendCount: 1
      })
    ),
    queueMutationPreflightResult: evaluateHumanGateQueueMutationPreflight(
      createHumanGateQueueMutationPreflightIntentFromMarkdownRenderModel(
        createHumanGateQueueMarkdownRenderModel(
          createHumanGateQueueDisplayTargetItemFromContract(makeDryRunInput(docsOnlySafeContract))
        ),
        {
          exactMarkdownToAppend: "## Queue entry",
          sourcePreviewCommit: "abc1234",
          humanGoReference: "Queue Mutation GO / example",
          requestedMutationCount: 1
        }
      )
    ),
    redacted: true
  });

  return createHumanGateStatusSnapshot({
    surface: "human-gate-status-snapshot-input",
    readinessDigest: digest,
    sourceOfTruth: "ledger",
    primaryDisplaySurface: "discord",
    fallbackDisplaySurface: "control-center",
    redacted: true
  });
}

function holdSnapshot(): HumanGateStatusSnapshot {
  const draft = createDiscordHumanGateMessageDraft(
    createHumanGateQueueDisplayTargetItemFromContract(makeDryRunInput(docsOnlySafeContract))
  );
  const digest = createDiscordSendReadinessDigest({
    surface: "discord-send-readiness-digest-input",
    discordSendPreflightResult: evaluateDiscordSendPreflight(
      createDiscordSendPreflightIntentFromDraft(draft, {
        exactMessageText: "t",
        targetChannelSummary: "#c",
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

  return createHumanGateStatusSnapshot({
    surface: "human-gate-status-snapshot-input",
    readinessDigest: digest,
    sourceOfTruth: "ledger",
    primaryDisplaySurface: "discord",
    fallbackDisplaySurface: "control-center",
    redacted: true
  });
}

function blockedSnapshot(): HumanGateStatusSnapshot {
  const draft = createDiscordHumanGateMessageDraft(
    createHumanGateQueueDisplayTargetItemFromContract(makeDryRunInput(docsOnlySafeContract))
  );
  const digest = createDiscordSendReadinessDigest({
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

  return createHumanGateStatusSnapshot({
    surface: "human-gate-status-snapshot-input",
    readinessDigest: digest,
    sourceOfTruth: "ledger",
    primaryDisplaySurface: "discord",
    fallbackDisplaySurface: "control-center",
    redacted: true
  });
}

function briefInput(snapshot: HumanGateStatusSnapshot, maxLines?: number): DiscordOperatorBriefInput {
  return {
    surface: "discord-operator-brief-input",
    snapshot,
    maxLines,
    redacted: true
  };
}

function expectBriefInvariants(brief: DiscordOperatorBrief): void {
  expect(brief.briefOnly).toBe(true);
  expect(brief.draftOnly).toBe(true);
  expect(brief.source.sourceOfTruth).toBe("ledger");
  expect(brief.source.primaryDisplaySurface).toBe("discord");
  expect(brief.source.fallbackDisplaySurface).toBe("control-center");
  expect(brief.safety.sendReady).toBe(false);
  expect(brief.safety.maySendNow).toBe(false);
  expect(brief.safety.mayMutateQueueNow).toBe(false);
  expect(brief.safety.fileWriteReady).toBe(false);
  expect(brief.safety.actualDiscordSend).toBe(false);
  expect(brief.safety.actualQueueMutation).toBe(false);
  expect(brief.safety.humanGateQueueDocModified).toBe(false);
  expect(brief.safety.webhookUsed).toBe(false);
  expect(brief.safety.botStarted).toBe(false);
  expect(brief.safety.tokenRead).toBe(false);
  expect(brief.safety.networkCall).toBe(false);
  expect(brief.safety.externalWrite).toBe(false);
  expect(brief.safety.runtimeStarted).toBe(false);
  expect(brief.safety.obsidianActualWrite).toBe(false);
  expect(brief.safety.productionReady).toBe(false);
  expect(brief.safety.execution).toBe("disabled");
  expect(brief.safety.rawValuesReported).toBe(false);
  expect(brief.safety.redacted).toBe(true);
}

describe("discord operator brief", () => {
  it("does not import Node fs in implementation module", () => {
    const source = readFileSync(join(__dirname, "discord-operator-brief.ts"), "utf8");

    expect(source).not.toMatch(/from\s+["']node:fs["']/);
    expect(source).not.toMatch(/from\s+["']fs["']/);
  });

  it("creates REVIEW_READY_CANDIDATE brief from REVIEW_READY_CANDIDATE snapshot", () => {
    const brief = createDiscordOperatorBrief(briefInput(readySnapshot()));

    expect(brief.status).toBe("REVIEW_READY_CANDIDATE");
    expectBriefInvariants(brief);
    expect(brief.headline).toContain("not approved");
  });

  it("keeps safety flags false for REVIEW_READY_CANDIDATE brief", () => {
    const brief = createDiscordOperatorBrief(briefInput(readySnapshot()));

    expect(brief.safety.sendReady).toBe(false);
    expect(brief.safety.maySendNow).toBe(false);
    expect(brief.safety.mayMutateQueueNow).toBe(false);
    expect(brief.safety.fileWriteReady).toBe(false);
  });

  it("creates HOLD brief from HOLD snapshot", () => {
    expect(createDiscordOperatorBrief(briefInput(holdSnapshot())).status).toBe("HOLD");
  });

  it("creates BLOCKED brief from BLOCKED snapshot", () => {
    expect(createDiscordOperatorBrief(briefInput(blockedSnapshot())).status).toBe("BLOCKED");
  });

  it("builds deterministic lines", () => {
    const input = briefInput(readySnapshot());
    const first = createDiscordOperatorBrief(input);
    const second = createDiscordOperatorBrief(input);

    expect(first.lines).toEqual(second.lines);
    expect(first.lines.length).toBeGreaterThan(0);
  });

  it("respects maxLines", () => {
    const brief = createDiscordOperatorBrief(briefInput(readySnapshot(), 3));

    expect(brief.lines.length).toBe(3);
  });

  it("renders preview with review-only and no send/mutation language", () => {
    const preview = createDiscordOperatorBriefPreview(briefInput(readySnapshot()));

    expect(typeof preview).toBe("string");
    expect(preview).toContain("review-only");
    expect(preview).toContain("no Discord send");
    expect(preview).toContain("no queue mutation");
    expect(preview).toContain("ledger");
  });

  it("renders preview from brief via renderDiscordOperatorBriefPreview", () => {
    const brief = createDiscordOperatorBrief(briefInput(readySnapshot()));
    const preview = renderDiscordOperatorBriefPreview(brief);

    expect(preview).toContain(brief.status);
  });

  it("does not mutate snapshot input", () => {
    const snapshot = readySnapshot();
    const input = briefInput(snapshot);
    const before = JSON.stringify(input);

    createDiscordOperatorBrief(input);
    createDiscordOperatorBriefPreview(input);

    expect(JSON.stringify(input)).toBe(before);
  });
});
