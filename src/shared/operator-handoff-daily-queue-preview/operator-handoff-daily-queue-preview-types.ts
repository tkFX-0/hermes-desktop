import type { OperatorHandoffSnapshotIndex } from "../operator-handoff-snapshot-index/operator-handoff-snapshot-index-types";

export type OperatorHandoffDailyQueuePreviewStatus =
  | "READY_FOR_HUMAN_REVIEW"
  | "HOLD"
  | "BLOCKED"
  | "MIXED";

export type OperatorHandoffDailyQueuePreviewPriority = "review_now" | "hold" | "blocked";

export type OperatorHandoffDailyQueuePreviewSafety = {
  previewOnly: true;
  queuePreviewOnly: true;
  markdownOnly: true;
  reviewOnly: true;
  draftOnly: true;
  displayOnly: true;
  discordPasteReady: true;
  obsidianCompatible: true;
  obsidianWrite: false;
  fileWrite: false;
  humanGateQueueMutation: false;
  sendReady: false;
  maySendNow: false;
  actualDiscordSend: false;
  executorImplemented: false;
  webhookUsed: false;
  botStarted: false;
  tokenRead: false;
  networkCall: false;
  externalWrite: false;
  runtimeStarted: false;
  actualQueueMutation: false;
  humanGateQueueDocModified: false;
  productionReady: false;
  execution: "disabled";
  rawValuesReported: false;
  redacted: true;
};

export type OperatorHandoffDailyQueuePreviewInput = {
  surface: "operator-handoff-daily-queue-preview-input";
  snapshotIndex: OperatorHandoffSnapshotIndex;
  dateLabel: string;
  title?: string;
  operatorName?: string;
  includeSafetySection?: boolean;
  includeNextActions?: boolean;
  redacted: true;
};

export type OperatorHandoffDailyQueuePreviewItem = {
  goalName: string;
  status: string;
  result: string;
  sessionId: string;
  nextRecommendedGoal?: string;
  priority: OperatorHandoffDailyQueuePreviewPriority;
  requiresExplicitHumanGo: true;
};

export type OperatorHandoffDailyQueuePreviewCounts = {
  total: number;
  reviewNow: number;
  hold: number;
  blocked: number;
};

export type OperatorHandoffDailyQueuePreview = {
  surface: "operator-handoff-daily-queue-preview";
  previewOnly: true;
  queuePreviewOnly: true;
  markdownOnly: true;
  reviewOnly: true;
  draftOnly: true;
  status: OperatorHandoffDailyQueuePreviewStatus;
  title: string;
  dateLabel: string;
  operatorName?: string;
  items: OperatorHandoffDailyQueuePreviewItem[];
  counts: OperatorHandoffDailyQueuePreviewCounts;
  recommendedHumanAction: string;
  markdown: string;
  safety: OperatorHandoffDailyQueuePreviewSafety;
};
