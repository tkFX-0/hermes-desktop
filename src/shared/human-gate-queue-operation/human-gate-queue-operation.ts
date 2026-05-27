import type { FinalOperatorReviewBundle } from "../final-operator-review-bundle/final-operator-review-bundle-types";
import type {
  HumanGateQueueEntry,
  HumanGateQueueEntryState,
  HumanGateQueueMutationPreflight,
  HumanGateQueueMutationPreflightSafety,
  HumanGateQueueOperationInput,
  HumanGateQueueOperationKind,
  HumanGateQueueOperationResult
} from "./human-gate-queue-operation-types";
import { HUMAN_GATE_QUEUE_TARGET_DOCUMENT } from "./human-gate-queue-operation-types";

const DEFAULT_ENTRY_ID = "queue-operator-review-mvp-finalize-rally-001";
const DEFAULT_NEXT_GOAL = "/goalmacro shikishima.queue-operation-mvp";

const SAFETY_BLOCK: HumanGateQueueMutationPreflightSafety = {
  repoLocalQueueMutationOnly: true,
  externalWrite: false,
  discordSend: false,
  webhookUsed: false,
  botStarted: false,
  tokenRead: false,
  networkCall: false,
  runtimeStarted: false,
  productionReady: false,
  execution: "disabled",
  rawValuesReported: false,
  redacted: true
};

const FORBIDDEN_MARKDOWN_PATTERNS = [
  /discord\.com\/api\/webhooks/i,
  /\bBearer\s+/i,
  /\bsk-[A-Za-z0-9]/,
  /[A-Za-z]:\\Users\\/,
  /\bchannel_id:\s*\d+/i
];

function containsForbiddenContent(text: string): boolean {
  return FORBIDDEN_MARKDOWN_PATTERNS.some((pattern) => pattern.test(text));
}

function resolveEntryId(input: HumanGateQueueOperationInput): string {
  return input.entryId?.trim() || input.targetEntryId?.trim() || DEFAULT_ENTRY_ID;
}

function pickGoalName(bundle: FinalOperatorReviewBundle): string {
  const firstEntry = bundle.dailyQueuePreview.items[0];
  return firstEntry?.goalName ?? "shikishima.operator-review-mvp-finalize";
}

function pickNextRecommendedGoal(bundle: FinalOperatorReviewBundle): string | undefined {
  const readyItem = bundle.dailyQueuePreview.items.find((item) => item.priority === "review_now");
  return readyItem?.nextRecommendedGoal ?? DEFAULT_NEXT_GOAL;
}

export function createHumanGateQueueEntryFromFinalReviewBundle(
  input: HumanGateQueueOperationInput,
  initialState: HumanGateQueueEntryState = "OPEN"
): HumanGateQueueEntry {
  const bundle = input.finalReviewBundle;

  return {
    surface: "human-gate-queue-entry",
    entryId: resolveEntryId(input),
    goalName: pickGoalName(bundle),
    status: bundle.status,
    state: initialState,
    recommendedHumanAction: bundle.recommendedHumanAction,
    nextRecommendedGoal: pickNextRecommendedGoal(bundle),
    requiresExplicitHumanGo: true,
    sourceBundleId: bundle.bundleId,
    createdBy: "shikishima-queue-operation-mvp",
    redacted: true
  };
}

export function createHumanGateQueueMutationPreflight(
  input: HumanGateQueueOperationInput
): HumanGateQueueMutationPreflight {
  const reasons: string[] = [];
  let readyCandidate = true;

  if (input.operationKind === "APPEND_ENTRY") {
    reasons.push("Controlled repo-local append to HUMAN_GATE_QUEUE.md");
    if (!input.finalReviewBundle.bundleId) {
      readyCandidate = false;
      reasons.push("Final review bundle id is required for append");
    }
  }

  if (input.operationKind === "UPDATE_ENTRY_STATE") {
    reasons.push("Controlled repo-local state update on HUMAN_GATE_QUEUE.md");
    if (!input.targetEntryId?.trim()) {
      readyCandidate = false;
      reasons.push("targetEntryId is required for update");
    }
    if (!input.nextState) {
      readyCandidate = false;
      reasons.push("nextState is required for update");
    }
    if (!input.humanDecisionReference?.trim()) {
      readyCandidate = false;
      reasons.push("humanDecisionReference is required for update");
    }
  }

  const entry = createHumanGateQueueEntryFromFinalReviewBundle(input);
  const entryMarkdown = renderHumanGateQueueEntryMarkdown(entry);
  if (containsForbiddenContent(entryMarkdown)) {
    readyCandidate = false;
    reasons.push("Entry markdown contains forbidden content patterns");
  }

  return {
    surface: "human-gate-queue-mutation-preflight",
    operationKind: input.operationKind,
    targetDocument: HUMAN_GATE_QUEUE_TARGET_DOCUMENT,
    mayMutateRepoLocalQueue: readyCandidate,
    mayMutateExternalQueue: false,
    mayWriteOtherFiles: false,
    requiresHumanGo: true,
    readyCandidate,
    reasons,
    safety: { ...SAFETY_BLOCK }
  };
}

export function renderHumanGateQueueEntryMarkdown(entry: HumanGateQueueEntry): string {
  const nextGoalLine = entry.nextRecommendedGoal
    ? `- nextRecommendedGoal: ${entry.nextRecommendedGoal}`
    : "- nextRecommendedGoal: (none recorded)";

  return [
    `## Queue Entry: ${entry.entryId}`,
    "",
    `- state: ${entry.state}`,
    `- goal: ${entry.goalName}`,
    `- status: ${entry.status}`,
    `- sourceBundle: ${entry.sourceBundleId}`,
    nextGoalLine,
    "- requiresExplicitHumanGo: true",
    "- redacted: true",
    "",
    "### Recommended Human Action",
    entry.recommendedHumanAction,
    "",
    "### Safety Boundary",
    "- Discord send: HOLD",
    "- External write: HOLD",
    "- Runtime: HOLD",
    "- productionReady: false",
    "- execution: disabled"
  ].join("\n");
}

export function renderHumanGateQueueUpdateMarkdown(
  entry: HumanGateQueueEntry,
  nextState: HumanGateQueueEntryState,
  humanDecisionReference: string
): string {
  return [
    `### Queue Update: ${entry.entryId}`,
    "",
    `- previousState: ${entry.state}`,
    `- nextState: ${nextState}`,
    `- humanDecisionReference: ${humanDecisionReference}`,
    "- requiresExplicitHumanGo: true",
    "- redacted: true",
    "",
    "### Safety Boundary",
    "- Discord send: HOLD",
    "- External write: HOLD",
    "- Runtime: HOLD",
    "- productionReady: false",
    "- execution: disabled"
  ].join("\n");
}

export function createHumanGateQueueOperationResult(
  input: HumanGateQueueOperationInput,
  initialState: HumanGateQueueEntryState = "OPEN"
): HumanGateQueueOperationResult {
  const preflight = createHumanGateQueueMutationPreflight(input);
  const entry = createHumanGateQueueEntryFromFinalReviewBundle(input, initialState);
  const entryMarkdown = renderHumanGateQueueEntryMarkdown(entry);

  const result: HumanGateQueueOperationResult = {
    surface: "human-gate-queue-operation-result",
    operationKind: input.operationKind,
    entry,
    preflight,
    entryMarkdown,
    redacted: true
  };

  if (input.operationKind === "UPDATE_ENTRY_STATE" && input.nextState && input.humanDecisionReference) {
    const previousState: HumanGateQueueEntryState = "OPEN";
    result.updateMarkdown = renderHumanGateQueueUpdateMarkdown(
      { ...entry, entryId: input.targetEntryId?.trim() || entry.entryId, state: previousState },
      input.nextState,
      input.humanDecisionReference
    );
  }

  return result;
}

export function buildAppendOperationInput(
  bundle: FinalOperatorReviewBundle,
  entryId: string = DEFAULT_ENTRY_ID
): HumanGateQueueOperationInput {
  return {
    surface: "human-gate-queue-operation-input",
    finalReviewBundle: bundle,
    operationKind: "APPEND_ENTRY",
    entryId,
    redacted: true
  };
}

export function buildUpdateOperationInput(
  bundle: FinalOperatorReviewBundle,
  targetEntryId: string,
  nextState: HumanGateQueueEntryState,
  humanDecisionReference: string
): HumanGateQueueOperationInput {
  return {
    surface: "human-gate-queue-operation-input",
    finalReviewBundle: bundle,
    operationKind: "UPDATE_ENTRY_STATE",
    targetEntryId,
    nextState,
    humanDecisionReference,
    redacted: true
  };
}

export type { HumanGateQueueOperationKind };
