import { createDiscordHumanGateMessageDraft } from "../discord-human-gate-message-render/discord-human-gate-message-render";
import {
  createDiscordSendPreflightIntentFromDraft,
  evaluateDiscordSendPreflight
} from "../discord-send-preflight/discord-send-preflight";
import type { DiscordSendPreflightResult } from "../discord-send-preflight/discord-send-preflight-types";
import type { GoalRunnerDryRunInput } from "../goal-runner-dry-run/goal-runner-dry-run-types";
import { createHumanGateReportFromContract } from "../human-gate-report/human-gate-report";
import type { HumanGateReport } from "../human-gate-report/human-gate-report-types";
import { createHumanGateQueueDisplayTargetItemFromContract } from "../human-gate-queue-display-target/human-gate-queue-display-target";
import { createOperatorHandoffAssembly } from "../operator-handoff-assembly/operator-handoff-assembly";
import type {
  OperatorHandoffAssemblyInput,
  OperatorHandoffAssemblyResult
} from "../operator-handoff-assembly/operator-handoff-assembly-types";
import { createOperatorHandoffMarkdownSnapshot } from "../operator-handoff-markdown-snapshot/operator-handoff-markdown-snapshot";
import type { OperatorHandoffMarkdownSnapshot } from "../operator-handoff-markdown-snapshot/operator-handoff-markdown-snapshot-types";
import type { OperatorHandoffGoalResultStatus } from "../operator-handoff-session/operator-handoff-session-types";
import {
  docsOnlySafeContract,
  sourceAndTestsSafeContract,
  sourceWithPackageChangeHoldContract
} from "../worker-task-contract/worker-task-contract-fixtures";
import type { WorkerTaskContract } from "../worker-task-contract/worker-task-contract-types";
import type {
  RealGoalOperatorHandoffFixture,
  RealGoalOperatorHandoffFixtureRegistry
} from "./operator-handoff-real-goal-fixtures-types";

export const REAL_GOAL_OPERATOR_HANDOFF_MARKDOWN_SNAPSHOT =
  "shikishima.push-operator-handoff-fixtures-and-add-operator-handoff-markdown-snapshot";

export const REAL_GOAL_OPERATOR_HANDOFF_ASSEMBLY =
  "shikishima.push-human-gate-report-to-snapshot-adapter-and-add-operator-handoff-assembly-contract";

export const REAL_GOAL_DISCORD_REVIEW_PACKET_ASSEMBLY =
  "shikishima.push-discord-review-packet-assembly-and-add-operator-handoff-session-contract";

export const REAL_GOAL_DISCORD_SEND_EXECUTOR_DESIGN =
  "shikishima.push-discord-send-executor-design-and-add-discord-review-packet-assembly-contract";

export const REAL_GOAL_NEXT_RECOMMENDED_SNAPSHOT_INDEX =
  "/goal shikishima.push-real-goal-fixtures-and-add-operator-handoff-snapshot-index";

const REAL_GOAL_HUMAN_GO_REFERENCE = "Human GO / real-goal-operator-handoff-fixture";

function makeDryRunInput(contract: WorkerTaskContract): GoalRunnerDryRunInput {
  return {
    goalId: contract.goalId,
    taskId: contract.taskId,
    title: contract.summary,
    contract,
    requestedBy: "composer"
  };
}

function humanGateReportFromContract(contract: WorkerTaskContract): HumanGateReport {
  return createHumanGateReportFromContract(makeDryRunInput(contract));
}

function readyPreflightForRealGoal(goalName: string): DiscordSendPreflightResult {
  const draft = createDiscordHumanGateMessageDraft(
    createHumanGateQueueDisplayTargetItemFromContract(makeDryRunInput(docsOnlySafeContract))
  );

  return evaluateDiscordSendPreflight(
    createDiscordSendPreflightIntentFromDraft(draft, {
      exactMessageText: `Real goal operator handoff — ${goalName}`,
      targetChannelSummary: "#human-gate-review",
      humanGoReference: REAL_GOAL_HUMAN_GO_REFERENCE,
      requestedSendCount: 1
    })
  );
}

type RealGoalFixtureSpec = {
  fixtureName: string;
  goalName: string;
  goalResultStatus: OperatorHandoffGoalResultStatus;
  fixtureSlug: string;
  humanGateReport: HumanGateReport;
  originMainAfter: string;
  localCommitsAhead: string[];
  pushedCommits: string[];
  nextRecommendedGoal: string;
  humanQuestion: string;
};

function buildRealGoalAssemblyInput(spec: RealGoalFixtureSpec): OperatorHandoffAssemblyInput {
  return {
    surface: "operator-handoff-assembly-input",
    humanGateReport: spec.humanGateReport,
    sendPreflightResult: readyPreflightForRealGoal(spec.goalName),
    goalName: spec.goalName,
    goalResultStatus: spec.goalResultStatus,
    sessionId: `operator-handoff-real:${spec.fixtureSlug}:001`,
    packetId: `operator-handoff-packet-real:${spec.fixtureSlug}:001`,
    humanGoReference: REAL_GOAL_HUMAN_GO_REFERENCE,
    originMainAfter: spec.originMainAfter,
    localCommitsAhead: [...spec.localCommitsAhead],
    pushedCommits: [...spec.pushedCommits],
    nextRecommendedGoal: spec.nextRecommendedGoal,
    humanQuestion: spec.humanQuestion,
    redacted: true
  };
}

function buildRealGoalFixture(spec: RealGoalFixtureSpec): RealGoalOperatorHandoffFixture {
  const assembly = createOperatorHandoffAssembly(buildRealGoalAssemblyInput(spec));
  const markdownSnapshot = createOperatorHandoffMarkdownSnapshot({
    surface: "operator-handoff-markdown-snapshot-input",
    assembly,
    redacted: true
  });

  return {
    fixtureName: spec.fixtureName,
    goalName: spec.goalName,
    assembly,
    markdownSnapshot
  };
}

const MARKDOWN_SNAPSHOT_GOAL_SPEC: RealGoalFixtureSpec = {
  fixtureName: "operatorHandoffMarkdownSnapshotGoal",
  goalName: REAL_GOAL_OPERATOR_HANDOFF_MARKDOWN_SNAPSHOT,
  goalResultStatus: "PASS",
  fixtureSlug: "markdown-snapshot",
  humanGateReport: humanGateReportFromContract(sourceAndTestsSafeContract),
  originMainAfter: "c3e95a9",
  localCommitsAhead: ["ddf962d", "f33c894"],
  pushedCommits: ["d0121ea", "c3e95a9"],
  nextRecommendedGoal: REAL_GOAL_NEXT_RECOMMENDED_SNAPSHOT_INDEX,
  humanQuestion: "Approve push of markdown snapshot and add real goal name fixtures?"
};

const ASSEMBLY_CONTRACT_GOAL_SPEC: RealGoalFixtureSpec = {
  fixtureName: "operatorHandoffAssemblyGoal",
  goalName: REAL_GOAL_OPERATOR_HANDOFF_ASSEMBLY,
  goalResultStatus: "PASS_WITH_CAVEAT",
  fixtureSlug: "assembly-contract",
  humanGateReport: humanGateReportFromContract(sourceAndTestsSafeContract),
  originMainAfter: "8a08b8c",
  localCommitsAhead: ["90643f2", "509712a"],
  pushedCommits: ["fed333c", "8a08b8c"],
  nextRecommendedGoal:
    "/goal shikishima.push-operator-handoff-fixtures-and-add-operator-handoff-markdown-snapshot",
  humanQuestion:
    "Review synthesized snapshot digest caveat and approve operator handoff assembly path?"
};

const SNAPSHOT_ADAPTER_GOAL_SPEC: RealGoalFixtureSpec = {
  fixtureName: "humanGateReportSnapshotAdapterGoal",
  goalName: REAL_GOAL_OPERATOR_HANDOFF_ASSEMBLY,
  goalResultStatus: "PASS_WITH_CAVEAT",
  fixtureSlug: "snapshot-adapter",
  humanGateReport: humanGateReportFromContract(sourceAndTestsSafeContract),
  originMainAfter: "5c56352",
  localCommitsAhead: ["fed333c", "8a08b8c"],
  pushedCommits: ["fed333c", "8a08b8c"],
  nextRecommendedGoal: REAL_GOAL_OPERATOR_HANDOFF_ASSEMBLY,
  humanQuestion: "Approve HumanGateReport-to-Snapshot adapter push with explicit Human GO?"
};

const REVIEW_PACKET_ASSEMBLY_GOAL_SPEC: RealGoalFixtureSpec = {
  fixtureName: "discordReviewPacketAssemblyGoal",
  goalName: REAL_GOAL_DISCORD_REVIEW_PACKET_ASSEMBLY,
  goalResultStatus: "HOLD",
  fixtureSlug: "review-packet-assembly",
  humanGateReport: humanGateReportFromContract(sourceWithPackageChangeHoldContract),
  originMainAfter: "179034b",
  localCommitsAhead: ["5c56352"],
  pushedCommits: ["179034b"],
  nextRecommendedGoal: REAL_GOAL_OPERATOR_HANDOFF_ASSEMBLY,
  humanQuestion: "Resolve HOLD items before operator handoff session contract push?"
};

const EXECUTOR_DESIGN_GOAL_SPEC: RealGoalFixtureSpec = {
  fixtureName: "discordSendExecutorDesignGoal",
  goalName: REAL_GOAL_DISCORD_SEND_EXECUTOR_DESIGN,
  goalResultStatus: "HOLD",
  fixtureSlug: "executor-design",
  humanGateReport: humanGateReportFromContract(sourceWithPackageChangeHoldContract),
  originMainAfter: "1eda4c9",
  localCommitsAhead: ["179034b"],
  pushedCommits: ["1eda4c9"],
  nextRecommendedGoal: REAL_GOAL_DISCORD_REVIEW_PACKET_ASSEMBLY,
  humanQuestion:
    "Executor design path is deferred — keep on HOLD and continue practical operator handoff path?"
};

export function createOperatorHandoffMarkdownSnapshotGoalFixture(): RealGoalOperatorHandoffFixture {
  return buildRealGoalFixture(MARKDOWN_SNAPSHOT_GOAL_SPEC);
}

export function createOperatorHandoffAssemblyGoalFixture(): RealGoalOperatorHandoffFixture {
  return buildRealGoalFixture(ASSEMBLY_CONTRACT_GOAL_SPEC);
}

export function createHumanGateReportSnapshotAdapterGoalFixture(): RealGoalOperatorHandoffFixture {
  return buildRealGoalFixture(SNAPSHOT_ADAPTER_GOAL_SPEC);
}

export function createDiscordReviewPacketAssemblyGoalFixture(): RealGoalOperatorHandoffFixture {
  return buildRealGoalFixture(REVIEW_PACKET_ASSEMBLY_GOAL_SPEC);
}

export function createDiscordSendExecutorDesignGoalFixture(): RealGoalOperatorHandoffFixture {
  return buildRealGoalFixture(EXECUTOR_DESIGN_GOAL_SPEC);
}

export function createOperatorHandoffMarkdownSnapshotGoalAssembly(): OperatorHandoffAssemblyResult {
  return createOperatorHandoffMarkdownSnapshotGoalFixture().assembly;
}

export function createOperatorHandoffAssemblyGoalAssembly(): OperatorHandoffAssemblyResult {
  return createOperatorHandoffAssemblyGoalFixture().assembly;
}

export function createHumanGateReportSnapshotAdapterGoalAssembly(): OperatorHandoffAssemblyResult {
  return createHumanGateReportSnapshotAdapterGoalFixture().assembly;
}

export function createDiscordReviewPacketAssemblyGoalAssembly(): OperatorHandoffAssemblyResult {
  return createDiscordReviewPacketAssemblyGoalFixture().assembly;
}

export function createOperatorHandoffMarkdownSnapshotGoalMarkdownSnapshot(): OperatorHandoffMarkdownSnapshot {
  return createOperatorHandoffMarkdownSnapshotGoalFixture().markdownSnapshot;
}

export const realGoalOperatorHandoffFixtures: RealGoalOperatorHandoffFixtureRegistry = {
  operatorHandoffMarkdownSnapshotGoal: createOperatorHandoffMarkdownSnapshotGoalFixture(),
  operatorHandoffAssemblyGoal: createOperatorHandoffAssemblyGoalFixture(),
  humanGateReportSnapshotAdapterGoal: createHumanGateReportSnapshotAdapterGoalFixture(),
  discordReviewPacketAssemblyGoal: createDiscordReviewPacketAssemblyGoalFixture()
};
