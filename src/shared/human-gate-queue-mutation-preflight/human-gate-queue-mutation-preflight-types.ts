export type HumanGateQueueMutationPreflightStatus = "HOLD" | "BLOCKED" | "READY_CANDIDATE";

export const HUMAN_GATE_QUEUE_TARGET_DOCUMENT = "docs/shikishima/HUMAN_GATE_QUEUE.md" as const;

export type HumanGateQueueMutationPreflightIntent = {
  surface: "human-gate-queue-mutation-preflight";
  intentOnly: true;
  sourceRenderId: string;
  sourcePreviewTitle: string;
  sourceGateId: string;
  exactMarkdownToAppend: string;
  targetDocument: typeof HUMAN_GATE_QUEUE_TARGET_DOCUMENT;
  sourcePreviewCommit?: string;
  humanGoReference?: string;
  allowedMutationCount: 1;
  requestedMutationCount: number;
  oneShotOnly: true;
  rewriteRequested: false;
  archiveRequested: false;
  bulkEditRequested: false;
  rawValuesReported: false;
  redacted: true;
};

export type HumanGateQueueMutationPreflightResult = {
  surface: "human-gate-queue-mutation-preflight-result";
  status: HumanGateQueueMutationPreflightStatus;
  reasons: string[];
  missingRequirements: string[];
  fileWriteReady: false;
  mayMutateNow: false;
  actualQueueMutation: false;
  humanGateQueueDocModified: false;
  fileWritePerformed: false;
  externalWrite: false;
  discordSend: false;
  obsidianActualWrite: false;
  runtimeStarted: false;
  networkCall: false;
  oneShotOnly: true;
  allowedMutationCount: 1;
  actualMutationCount: 0;
  gateRestoredHoldRequired: true;
  productionReady: false;
  execution: "disabled";
  rawValuesReported: false;
  redacted: true;
};

export type CreateHumanGateQueueMutationPreflightIntentOptions = {
  exactMarkdownToAppend: string;
  sourcePreviewCommit?: string;
  humanGoReference?: string;
  requestedMutationCount?: number;
};
