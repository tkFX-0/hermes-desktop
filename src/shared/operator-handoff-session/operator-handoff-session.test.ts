import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { docsOnlySafeContract } from "../worker-task-contract/worker-task-contract-fixtures";
import type { WorkerTaskContract } from "../worker-task-contract/worker-task-contract-types";
import type { GoalRunnerDryRunInput } from "../goal-runner-dry-run/goal-runner-dry-run-types";
import { createDiscordHumanGateMessageDraft } from "../discord-human-gate-message-render/discord-human-gate-message-render";
import { createDiscordReviewPacketAssembly } from "../discord-review-packet-assembly/discord-review-packet-assembly";
import type { DiscordReviewPacketAssemblyInput } from "../discord-review-packet-assembly/discord-review-packet-assembly-types";
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
  createOperatorHandoffSession,
  createOperatorHandoffSessionPreview
} from "./operator-handoff-session";
import type {
  OperatorHandoffSession,
  OperatorHandoffSessionInput
} from "./operator-handoff-session-types";

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

function snapshotInput(preflight: DiscordSendPreflightResult): HumanGateStatusSnapshotInput {
  const item = createHumanGateQueueDisplayTargetItemFromContract(
    makeDryRunInput(docsOnlySafeContract)
  );
  return {
    surface: "human-gate-status-snapshot-input",
    readinessDigest: createDiscordSendReadinessDigest({
      surface: "discord-send-readiness-digest-input",
      discordSendPreflightResult: preflight,
      queueMutationPreflightResult: evaluateHumanGateQueueMutationPreflight(
        createHumanGateQueueMutationPreflightIntentFromMarkdownRenderModel(
          createHumanGateQueueMarkdownRenderModel(item),
          {
            exactMarkdownToAppend: "## Queue",
            sourcePreviewCommit: "abc1234",
            humanGoReference: "GO",
            requestedMutationCount: 1
          }
        )
      ),
      redacted: true
    }),
    sourceOfTruth: "ledger",
    primaryDisplaySurface: "discord",
    fallbackDisplaySurface: "control-center",
    redacted: true
  };
}

function readySnapshot(): HumanGateStatusSnapshot {
  return createHumanGateStatusSnapshot(snapshotInput(readyPreflight()));
}

function blockedSnapshot(): HumanGateStatusSnapshot {
  return createHumanGateStatusSnapshot(snapshotInput(blockedPreflight()));
}

function readyAssembly(): ReturnType<typeof createDiscordReviewPacketAssembly> {
  const input: DiscordReviewPacketAssemblyInput = {
    surface: "discord-review-packet-assembly-input",
    snapshot: readySnapshot(),
    sendPreflightResult: readyPreflight(),
    redacted: true
  };
  return createDiscordReviewPacketAssembly(input);
}

function handoffInput(
  assembly: ReturnType<typeof createDiscordReviewPacketAssembly>,
  overrides: Partial<OperatorHandoffSessionInput> = {}
): OperatorHandoffSessionInput {
  return {
    surface: "operator-handoff-session-input",
    assembly,
    goalName: "shikishima.example-goal",
    goalResultStatus: "PASS",
    originMainAfter: "179034b",
    localCommitsAhead: ["da0166e", "179034b"],
    pushedCommits: ["da0166e", "179034b"],
    nextRecommendedGoal: "/goal shikishima.push-operator-handoff-session-and-add-human-gate-report-to-snapshot-adapter",
    humanQuestion: "Approve next goal or request revision?",
    redacted: true,
    ...overrides
  };
}

function expectSessionInvariants(session: OperatorHandoffSession): void {
  expect(session.sessionOnly).toBe(true);
  expect(session.handoffOnly).toBe(true);
  expect(session.safety.sendReady).toBe(false);
  expect(session.safety.maySendNow).toBe(false);
  expect(session.safety.actualDiscordSend).toBe(false);
  expect(session.safety.executorImplemented).toBe(false);
  expect(session.safety.webhookUsed).toBe(false);
  expect(session.safety.botStarted).toBe(false);
  expect(session.safety.tokenRead).toBe(false);
  expect(session.safety.networkCall).toBe(false);
  expect(session.safety.externalWrite).toBe(false);
  expect(session.safety.runtimeStarted).toBe(false);
  expect(session.safety.actualQueueMutation).toBe(false);
  expect(session.safety.humanGateQueueDocModified).toBe(false);
  expect(session.safety.productionReady).toBe(false);
  expect(session.safety.execution).toBe("disabled");
  expect(session.safety.rawValuesReported).toBe(false);
  expect(session.safety.redacted).toBe(true);
}

describe("operator handoff session", () => {
  it("does not import Node fs in implementation module", () => {
    const source = readFileSync(join(__dirname, "operator-handoff-session.ts"), "utf8");

    expect(source).not.toMatch(/from\s+["']node:fs["']/);
    expect(source).not.toMatch(/from\s+["']fs["']/);
  });

  it("creates READY_FOR_HUMAN_REVIEW from REVIEW_READY_CANDIDATE assembly and PASS", () => {
    const session = createOperatorHandoffSession(handoffInput(readyAssembly()));

    expect(session.status).toBe("READY_FOR_HUMAN_REVIEW");
    expectSessionInvariants(session);
  });

  it("creates READY_FOR_HUMAN_REVIEW from PASS_WITH_CAVEAT", () => {
    const session = createOperatorHandoffSession(
      handoffInput(readyAssembly(), { goalResultStatus: "PASS_WITH_CAVEAT" })
    );

    expect(session.status).toBe("READY_FOR_HUMAN_REVIEW");
  });

  it("creates HOLD session from HOLD goal result", () => {
    const session = createOperatorHandoffSession(
      handoffInput(readyAssembly(), { goalResultStatus: "HOLD" })
    );

    expect(session.status).toBe("HOLD");
    expectSessionInvariants(session);
  });

  it("creates BLOCKED session from STOP goal result", () => {
    const session = createOperatorHandoffSession(
      handoffInput(readyAssembly(), { goalResultStatus: "STOP" })
    );

    expect(session.status).toBe("BLOCKED");
  });

  it("creates BLOCKED session from BLOCKED assembly", () => {
    const blockedAssembly = createDiscordReviewPacketAssembly({
      surface: "discord-review-packet-assembly-input",
      snapshot: blockedSnapshot(),
      sendPreflightResult: readyPreflight(),
      redacted: true
    });
    const session = createOperatorHandoffSession(handoffInput(blockedAssembly));

    expect(session.status).toBe("BLOCKED");
  });

  it("generates deterministic sessionId when omitted", () => {
    const input = handoffInput(readyAssembly());
    const first = createOperatorHandoffSession(input);
    const second = createOperatorHandoffSession(input);

    expect(first.sessionId).toBe(second.sessionId);
    expect(first.sessionId).toContain("operator-handoff:");
  });

  it("preserves provided sessionId", () => {
    const session = createOperatorHandoffSession(
      handoffInput(readyAssembly(), { sessionId: "custom-session-001" })
    );

    expect(session.sessionId).toBe("custom-session-001");
  });

  it("preserves goal metadata and commit fields", () => {
    const session = createOperatorHandoffSession(handoffInput(readyAssembly()));

    expect(session.goalName).toBe("shikishima.example-goal");
    expect(session.goalResultStatus).toBe("PASS");
    expect(session.source.originMainAfter).toBe("179034b");
    expect(session.source.localCommitsAhead).toEqual(["da0166e", "179034b"]);
    expect(session.source.pushedCommits).toEqual(["da0166e", "179034b"]);
    expect(session.nextRecommendedGoal).toContain("push-operator-handoff-session");
    expect(session.humanQuestion).toContain("Approve next goal");
  });

  it("preserves reviewPacketPreview from assembly", () => {
    const assembly = readyAssembly();
    const session = createOperatorHandoffSession(handoffInput(assembly));

    expect(session.reviewPacketPreview).toBe(assembly.preview);
  });

  it("includes APPROVE_NEXT_GOAL with explicit Human GO required", () => {
    const session = createOperatorHandoffSession(handoffInput(readyAssembly()));
    const approve = session.decisionChoices.find((row) => row.choice === "APPROVE_NEXT_GOAL");

    expect(approve).toBeDefined();
    expect(approve?.requiresExplicitHumanGo).toBe(true);
  });

  it("renders preview with human review language", () => {
    const preview = createOperatorHandoffSessionPreview(handoffInput(readyAssembly()));

    expect(typeof preview).toBe("string");
    expect(preview).toContain("handoff-only");
    expect(preview).toContain("human review");
    expect(preview).toContain("not Discord send approval");
    expect(preview).toContain("not next goal approval");
  });

  it("does not mutate input", () => {
    const input = handoffInput(readyAssembly());
    const before = JSON.stringify(input);

    createOperatorHandoffSession(input);
    createOperatorHandoffSessionPreview(input);

    expect(JSON.stringify(input)).toBe(before);
  });
});
