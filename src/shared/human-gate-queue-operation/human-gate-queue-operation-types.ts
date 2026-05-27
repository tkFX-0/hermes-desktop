import type { FinalOperatorReviewBundle } from "../final-operator-review-bundle/final-operator-review-bundle-types";

export const HUMAN_GATE_QUEUE_TARGET_DOCUMENT = "docs/shikishima/HUMAN_GATE_QUEUE.md" as const;

export type HumanGateQueueEntryState =
  | "OPEN"
  | "READY_FOR_HUMAN_REVIEW"
  | "ACCEPTED"
  | "REJECTED"
  | "HOLD"
  | "BLOCKED"
  | "SUPERSEDED";

export type HumanGateQueueOperationKind = "APPEND_ENTRY" | "UPDATE_ENTRY_STATE";

export type HumanGateQueueOperationInput = {
  surface: "human-gate-queue-operation-input";
  finalReviewBundle: FinalOperatorReviewBundle;
  operationKind: HumanGateQueueOperationKind;
  entryId?: string;
  targetEntryId?: string;
  nextState?: HumanGateQueueEntryState;
  humanDecisionReference?: string;
  redacted: true;
};

export type HumanGateQueueEntry = {
  surface: "human-gate-queue-entry";
  entryId: string;
  goalName: string;
  status: string;
  state: HumanGateQueueEntryState;
  recommendedHumanAction: string;
  nextRecommendedGoal?: string;
  requiresExplicitHumanGo: true;
  sourceBundleId: string;
  createdBy: "shikishima-queue-operation-mvp";
  redacted: true;
};

export type HumanGateQueueMutationPreflightSafety = {
  repoLocalQueueMutationOnly: true;
  externalWrite: false;
  discordSend: false;
  webhookUsed: false;
  botStarted: false;
  tokenRead: false;
  networkCall: false;
  runtimeStarted: false;
  productionReady: false;
  execution: "disabled";
  rawValuesReported: false;
  redacted: true;
};

export type HumanGateQueueMutationPreflight = {
  surface: "human-gate-queue-mutation-preflight";
  operationKind: HumanGateQueueOperationKind;
  targetDocument: typeof HUMAN_GATE_QUEUE_TARGET_DOCUMENT;
  mayMutateRepoLocalQueue: boolean;
  mayMutateExternalQueue: false;
  mayWriteOtherFiles: false;
  requiresHumanGo: true;
  readyCandidate: boolean;
  reasons: string[];
  safety: HumanGateQueueMutationPreflightSafety;
};

export type HumanGateQueueOperationResult = {
  surface: "human-gate-queue-operation-result";
  operationKind: HumanGateQueueOperationKind;
  entry?: HumanGateQueueEntry;
  preflight: HumanGateQueueMutationPreflight;
  entryMarkdown?: string;
  updateMarkdown?: string;
  redacted: true;
};
