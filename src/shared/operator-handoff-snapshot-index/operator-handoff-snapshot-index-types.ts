import type { OperatorHandoffMarkdownSnapshot } from "../operator-handoff-markdown-snapshot/operator-handoff-markdown-snapshot-types";

export type OperatorHandoffSnapshotIndexStatus =
  | "READY_FOR_HUMAN_REVIEW"
  | "HOLD"
  | "BLOCKED"
  | "MIXED";

export type OperatorHandoffSnapshotIndexSafety = {
  indexOnly: true;
  markdownOnly: true;
  reviewOnly: true;
  draftOnly: true;
  displayOnly: true;
  discordPasteReady: true;
  obsidianCompatible: true;
  obsidianWrite: false;
  fileWrite: false;
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

export type OperatorHandoffSnapshotIndexInput = {
  surface: "operator-handoff-snapshot-index-input";
  snapshots: OperatorHandoffMarkdownSnapshot[];
  title?: string;
  generatedAtLabel?: string;
  includeSafetySection?: boolean;
  includeSnapshotMarkdownLinks?: boolean;
  redacted: true;
};

export type OperatorHandoffSnapshotIndexEntry = {
  goalName: string;
  goalResultStatus: string;
  snapshotStatus: string;
  sessionId: string;
  nextRecommendedGoal?: string;
  requiresExplicitHumanGo: true;
};

export type OperatorHandoffSnapshotIndexCounts = {
  total: number;
  readyForHumanReview: number;
  hold: number;
  blocked: number;
};

export type OperatorHandoffSnapshotIndex = {
  surface: "operator-handoff-snapshot-index";
  indexOnly: true;
  markdownOnly: true;
  reviewOnly: true;
  draftOnly: true;
  status: OperatorHandoffSnapshotIndexStatus;
  title: string;
  entries: OperatorHandoffSnapshotIndexEntry[];
  counts: OperatorHandoffSnapshotIndexCounts;
  markdown: string;
  safety: OperatorHandoffSnapshotIndexSafety;
};
