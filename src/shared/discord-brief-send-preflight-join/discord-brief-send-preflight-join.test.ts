import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { docsOnlySafeContract } from "../worker-task-contract/worker-task-contract-fixtures";
import type { WorkerTaskContract } from "../worker-task-contract/worker-task-contract-types";
import type { GoalRunnerDryRunInput } from "../goal-runner-dry-run/goal-runner-dry-run-types";
import { createDiscordHumanGateMessageDraft } from "../discord-human-gate-message-render/discord-human-gate-message-render";
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
  createDiscordBriefSendPreflightJoin,
  createDiscordBriefSendPreflightJoinPreview,
  renderDiscordBriefSendPreflightJoinPreview
} from "./discord-brief-send-preflight-join";
import type {
  DiscordBriefSendPreflightJoin,
  DiscordBriefSendPreflightJoinInput
} from "./discord-brief-send-preflight-join-types";

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
    humanGoReference: "Discord Send GO / join-test",
    redacted: true
  };
}

function expectJoinInvariants(joined: DiscordBriefSendPreflightJoin): void {
  expect(joined.joinOnly).toBe(true);
  expect(joined.reviewOnly).toBe(true);
  expect(joined.draftOnly).toBe(true);
  expect(joined.safety.sendReady).toBe(false);
  expect(joined.safety.maySendNow).toBe(false);
  expect(joined.safety.actualDiscordSend).toBe(false);
  expect(joined.safety.webhookUsed).toBe(false);
  expect(joined.safety.botStarted).toBe(false);
  expect(joined.safety.tokenRead).toBe(false);
  expect(joined.safety.networkCall).toBe(false);
  expect(joined.safety.externalWrite).toBe(false);
  expect(joined.safety.runtimeStarted).toBe(false);
  expect(joined.safety.actualQueueMutation).toBe(false);
  expect(joined.safety.fileWriteReady).toBe(false);
  expect(joined.safety.productionReady).toBe(false);
  expect(joined.safety.execution).toBe("disabled");
  expect(joined.safety.rawValuesReported).toBe(false);
  expect(joined.safety.redacted).toBe(true);
  expect(joined.reviewRows.every((row) => row.mayProceedNow === false)).toBe(true);
}

describe("discord brief send preflight join", () => {
  it("does not import Node fs in implementation module", () => {
    const source = readFileSync(join(__dirname, "discord-brief-send-preflight-join.ts"), "utf8");

    expect(source).not.toMatch(/from\s+["']node:fs["']/);
    expect(source).not.toMatch(/from\s+["']fs["']/);
  });

  it("creates REVIEW_READY_CANDIDATE join from matching brief and preflight", () => {
    const joined = createDiscordBriefSendPreflightJoin(joinInput(readyBrief(), readyPreflight()));

    expect(joined.status).toBe("REVIEW_READY_CANDIDATE");
    expectJoinInvariants(joined);
    expect(joined.source.briefStatus).toBe("REVIEW_READY_CANDIDATE");
    expect(joined.source.sendPreflightStatus).toBe("READY_CANDIDATE");
  });

  it("keeps send flags false for REVIEW_READY_CANDIDATE join", () => {
    const joined = createDiscordBriefSendPreflightJoin(joinInput(readyBrief(), readyPreflight()));

    expect(joined.safety.sendReady).toBe(false);
    expect(joined.safety.maySendNow).toBe(false);
    expect(joined.safety.actualDiscordSend).toBe(false);
  });

  it("creates HOLD join when brief is HOLD", () => {
    expect(createDiscordBriefSendPreflightJoin(joinInput(holdBrief(), readyPreflight())).status).toBe(
      "HOLD"
    );
  });

  it("creates HOLD join when preflight is HOLD", () => {
    expect(createDiscordBriefSendPreflightJoin(joinInput(readyBrief(), holdPreflight())).status).toBe(
      "HOLD"
    );
  });

  it("creates BLOCKED join when brief is BLOCKED", () => {
    expect(
      createDiscordBriefSendPreflightJoin(joinInput(blockedBrief(), readyPreflight())).status
    ).toBe("BLOCKED");
  });

  it("creates BLOCKED join when preflight is BLOCKED", () => {
    expect(
      createDiscordBriefSendPreflightJoin(joinInput(readyBrief(), blockedPreflight())).status
    ).toBe("BLOCKED");
  });

  it("builds deterministic reviewRows", () => {
    const input = joinInput(readyBrief(), readyPreflight());
    const first = createDiscordBriefSendPreflightJoin(input);
    const second = createDiscordBriefSendPreflightJoin(input);

    expect(first.reviewRows).toEqual(second.reviewRows);
  });

  it("preserves preflight reasons in review rows", () => {
    const joined = createDiscordBriefSendPreflightJoin(joinInput(readyBrief(), readyPreflight()));
    const preflightRow = joined.reviewRows.find((row) => row.label === "Discord send preflight");

    expect(preflightRow?.reasons.length).toBeGreaterThan(0);
  });

  it("renders preview with review-only and no send/webhook/bot language", () => {
    const preview = createDiscordBriefSendPreflightJoinPreview(joinInput(readyBrief(), readyPreflight()));

    expect(typeof preview).toBe("string");
    expect(preview).toContain("review-only");
    expect(preview).toContain("no Discord send");
    expect(preview).toContain("no webhook");
    expect(preview).toContain("no bot");
    expect(preview).toContain("not Discord send approval");
  });

  it("renders preview from join via renderDiscordBriefSendPreflightJoinPreview", () => {
    const joined = createDiscordBriefSendPreflightJoin(joinInput(readyBrief(), readyPreflight()));
    const preview = renderDiscordBriefSendPreflightJoinPreview(joined);

    expect(preview).toContain(joined.status);
    expect(preview.length).toBeGreaterThan(joined.briefPreview.length);
  });

  it("does not mutate input", () => {
    const input = joinInput(readyBrief(), readyPreflight());
    const before = JSON.stringify(input);

    createDiscordBriefSendPreflightJoin(input);
    createDiscordBriefSendPreflightJoinPreview(input);

    expect(JSON.stringify(input)).toBe(before);
  });
});
