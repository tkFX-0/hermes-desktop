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
import type { OperatorHandoffGoalResultStatus } from "../operator-handoff-session/operator-handoff-session-types";
import {
  docsOnlySafeContract,
  sourceAndTestsSafeContract,
  sourceWithPackageChangeHoldContract
} from "../worker-task-contract/worker-task-contract-fixtures";
import type { WorkerTaskContract } from "../worker-task-contract/worker-task-contract-types";
import type {
  OperatorHandoffFixtureEntry,
  OperatorHandoffFixtureProfile,
  OperatorHandoffFixtureRegistry
} from "./operator-handoff-fixtures-types";

export const OPERATOR_HANDOFF_FIXTURE_GOAL_NAME = "shikishima.operator-handoff-fixture-reference";

export const OPERATOR_HANDOFF_FIXTURE_NEXT_RECOMMENDED_GOAL =
  "/goal shikishima.push-operator-handoff-fixtures-and-add-operator-handoff-markdown-snapshot";

export const OPERATOR_HANDOFF_FIXTURE_HUMAN_GO_REFERENCE =
  "Human GO / operator-handoff-fixture-reference";

const FIXTURE_ORIGIN_MAIN_AFTER = "509712a";

const FIXTURE_LOCAL_COMMITS_AHEAD = ["90643f2", "509712a"] as const;

const FIXTURE_PUSHED_COMMITS = ["90643f2", "509712a"] as const;

const FIXTURE_HUMAN_QUESTION =
  "Review this operator handoff preview and choose an explicit Human GO path.";

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

function readyPreflightFixture(): DiscordSendPreflightResult {
  const draft = createDiscordHumanGateMessageDraft(
    createHumanGateQueueDisplayTargetItemFromContract(makeDryRunInput(docsOnlySafeContract))
  );

  return evaluateDiscordSendPreflight(
    createDiscordSendPreflightIntentFromDraft(draft, {
      exactMessageText: "Operator handoff fixture — review-only message.",
      targetChannelSummary: "#human-gate-review",
      humanGoReference: OPERATOR_HANDOFF_FIXTURE_HUMAN_GO_REFERENCE,
      requestedSendCount: 1
    })
  );
}

function baseAssemblyInput(
  humanGateReport: HumanGateReport,
  goalResultStatus: OperatorHandoffGoalResultStatus,
  profile: OperatorHandoffFixtureProfile
): OperatorHandoffAssemblyInput {
  const profileSlug = profile.toLowerCase().replace(/_/g, "-");

  return {
    surface: "operator-handoff-assembly-input",
    humanGateReport,
    sendPreflightResult: readyPreflightFixture(),
    goalName: OPERATOR_HANDOFF_FIXTURE_GOAL_NAME,
    goalResultStatus,
    sessionId: `operator-handoff-fixture:${profileSlug}:001`,
    packetId: `operator-handoff-packet:${profileSlug}:001`,
    humanGoReference: OPERATOR_HANDOFF_FIXTURE_HUMAN_GO_REFERENCE,
    originMainAfter: FIXTURE_ORIGIN_MAIN_AFTER,
    localCommitsAhead: [...FIXTURE_LOCAL_COMMITS_AHEAD],
    pushedCommits: [...FIXTURE_PUSHED_COMMITS],
    nextRecommendedGoal: OPERATOR_HANDOFF_FIXTURE_NEXT_RECOMMENDED_GOAL,
    humanQuestion: FIXTURE_HUMAN_QUESTION,
    redacted: true
  };
}

function buildFixtureEntry(
  profile: OperatorHandoffFixtureProfile,
  input: OperatorHandoffAssemblyInput
): OperatorHandoffFixtureEntry {
  return {
    profile,
    input,
    result: createOperatorHandoffAssembly(input)
  };
}

export function createPassOperatorHandoffAssemblyInputFixture(): OperatorHandoffAssemblyInput {
  return baseAssemblyInput(
    humanGateReportFromContract(sourceAndTestsSafeContract),
    "PASS",
    "PASS"
  );
}

export function createPassWithCaveatOperatorHandoffAssemblyInputFixture(): OperatorHandoffAssemblyInput {
  return baseAssemblyInput(
    humanGateReportFromContract(sourceAndTestsSafeContract),
    "PASS_WITH_CAVEAT",
    "PASS_WITH_CAVEAT"
  );
}

export function createHoldOperatorHandoffAssemblyInputFixture(): OperatorHandoffAssemblyInput {
  return baseAssemblyInput(
    humanGateReportFromContract(sourceWithPackageChangeHoldContract),
    "HOLD",
    "HOLD"
  );
}

export function createBlockedOperatorHandoffAssemblyInputFixture(): OperatorHandoffAssemblyInput {
  const report: HumanGateReport = {
    ...humanGateReportFromContract(sourceAndTestsSafeContract),
    status: "REJECTED",
    sourceDecision: "REJECT"
  };

  return baseAssemblyInput(report, "STOP", "BLOCKED");
}

export function createPassOperatorHandoffAssemblyFixture(): OperatorHandoffAssemblyResult {
  return buildFixtureEntry("PASS", createPassOperatorHandoffAssemblyInputFixture()).result;
}

export function createPassWithCaveatOperatorHandoffAssemblyFixture(): OperatorHandoffAssemblyResult {
  return buildFixtureEntry(
    "PASS_WITH_CAVEAT",
    createPassWithCaveatOperatorHandoffAssemblyInputFixture()
  ).result;
}

export function createHoldOperatorHandoffAssemblyFixture(): OperatorHandoffAssemblyResult {
  return buildFixtureEntry("HOLD", createHoldOperatorHandoffAssemblyInputFixture()).result;
}

export function createBlockedOperatorHandoffAssemblyFixture(): OperatorHandoffAssemblyResult {
  return buildFixtureEntry("BLOCKED", createBlockedOperatorHandoffAssemblyInputFixture()).result;
}

export const operatorHandoffFixtures: OperatorHandoffFixtureRegistry = {
  pass: buildFixtureEntry("PASS", createPassOperatorHandoffAssemblyInputFixture()),
  passWithCaveat: buildFixtureEntry(
    "PASS_WITH_CAVEAT",
    createPassWithCaveatOperatorHandoffAssemblyInputFixture()
  ),
  hold: buildFixtureEntry("HOLD", createHoldOperatorHandoffAssemblyInputFixture()),
  blocked: buildFixtureEntry("BLOCKED", createBlockedOperatorHandoffAssemblyInputFixture())
};
