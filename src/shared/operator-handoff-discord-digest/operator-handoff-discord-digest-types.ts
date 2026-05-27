import type { OperatorHandoffDailyQueuePreview } from "../operator-handoff-daily-queue-preview/operator-handoff-daily-queue-preview-types";

export type OperatorHandoffDiscordDigestStatus =
  | "READY_FOR_HUMAN_REVIEW"
  | "HOLD"
  | "BLOCKED"
  | "MIXED";

export type OperatorHandoffDiscordDigestPriority = "review_now" | "hold" | "blocked";

export type OperatorHandoffDiscordDigestSafety = {
  digestOnly: true;
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

export type OperatorHandoffDiscordDigestInput = {
  surface: "operator-handoff-discord-digest-input";
  dailyQueuePreview: OperatorHandoffDailyQueuePreview;
  title?: string;
  maxItems?: number;
  maxLength?: number;
  includeSafetySummary?: boolean;
  redacted: true;
};

export type OperatorHandoffDiscordDigestItem = {
  goalName: string;
  status: string;
  priority: OperatorHandoffDiscordDigestPriority;
  nextRecommendedGoal?: string;
  requiresExplicitHumanGo: true;
};

export type OperatorHandoffDiscordDigestCounts = {
  total: number;
  reviewNow: number;
  hold: number;
  blocked: number;
};

export type OperatorHandoffDiscordDigest = {
  surface: "operator-handoff-discord-digest";
  digestOnly: true;
  markdownOnly: true;
  reviewOnly: true;
  draftOnly: true;
  status: OperatorHandoffDiscordDigestStatus;
  title: string;
  summaryLine: string;
  items: OperatorHandoffDiscordDigestItem[];
  counts: OperatorHandoffDiscordDigestCounts;
  recommendedHumanAction: string;
  markdown: string;
  truncated: boolean;
  safety: OperatorHandoffDiscordDigestSafety;
};
