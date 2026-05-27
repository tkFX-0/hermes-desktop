export type DiscordSendExecutorDryRunStatus = "DRY_RUN_READY" | "HOLD" | "BLOCKED";

export type DiscordSendExecutorTransportMode = "mock" | "dry_run_only";

export type DiscordSendExecutorIntentSource =
  | "final-operator-review-bundle"
  | "operator-handoff-discord-digest";

export type DiscordSendExecutorIntent = {
  surface: "discord-send-executor-intent";
  source: DiscordSendExecutorIntentSource;
  messageMarkdown: string;
  targetLabel: string;
  sendCountLimit: 1;
  transportMode: DiscordSendExecutorTransportMode;
  humanGoReference: string;
  redacted: true;
};

export type DiscordSendExecutorDryRunInput = {
  surface: "discord-send-executor-dry-run-input";
  intent: DiscordSendExecutorIntent;
  preflightStatus: "READY_CANDIDATE" | "HOLD" | "BLOCKED";
  finalReviewBundleStatus?: string;
  queueEntryId?: string;
  redacted: true;
};

export type DiscordSendExecutorDryRunEvidence = {
  evidenceId: string;
  source: string;
  queueEntryId?: string;
  sendCountLimit: 1;
  actualSendCount: 0;
  humanGoReference: string;
  result: DiscordSendExecutorDryRunStatus;
  redacted: true;
};

export type DiscordSendExecutorDryRunSafety = {
  dryRunOnly: true;
  executorDryRunOnly: true;
  mockTransportOnly: true;
  displayOnly: true;
  actualDiscordSend: false;
  sendReady: false;
  maySendNow: false;
  webhookUsed: false;
  botStarted: false;
  tokenRead: false;
  networkCall: false;
  externalWrite: false;
  externalApiWrite: false;
  runtimeStarted: false;
  actualQueueMutation: false;
  fileWrite: false;
  humanGateQueueDocModified: false;
  productionReady: false;
  execution: "disabled";
  rawValuesReported: false;
  redacted: true;
};

export type DiscordSendExecutorDryRunResult = {
  surface: "discord-send-executor-dry-run-result";
  dryRunOnly: true;
  executorDryRunOnly: true;
  mockTransportOnly: true;
  reviewOnly: true;
  draftOnly: true;
  status: DiscordSendExecutorDryRunStatus;
  wouldSend: boolean;
  wouldSendCount: 0 | 1;
  messagePreview: string;
  targetLabel: string;
  evidence: DiscordSendExecutorDryRunEvidence;
  reasons: string[];
  safety: DiscordSendExecutorDryRunSafety;
};

export type DiscordSendMockTransportSafety = {
  mockOnly: true;
  actualDiscordSend: false;
  webhookUsed: false;
  botStarted: false;
  tokenRead: false;
  networkCall: false;
  externalWrite: false;
  productionReady: false;
  execution: "disabled";
  redacted: true;
};

export type DiscordSendMockTransportResult = {
  surface: "discord-send-mock-transport-result";
  mockOnly: true;
  acceptedByMockTransport: boolean;
  actualSendCount: 0;
  simulatedSendCount: 0 | 1;
  evidenceMarkdown: string;
  safety: DiscordSendMockTransportSafety;
};
