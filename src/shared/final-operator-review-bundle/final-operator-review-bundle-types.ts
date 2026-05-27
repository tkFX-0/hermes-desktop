import type { OperatorHandoffDiscordDigest } from "../operator-handoff-discord-digest/operator-handoff-discord-digest-types";
import type { OperatorHandoffDailyQueuePreview } from "../operator-handoff-daily-queue-preview/operator-handoff-daily-queue-preview-types";
import type { OperatorHandoffSnapshotIndex } from "../operator-handoff-snapshot-index/operator-handoff-snapshot-index-types";

export type FinalOperatorReviewBundleStatus =
  | "READY_FOR_HUMAN_REVIEW"
  | "HOLD"
  | "BLOCKED"
  | "MIXED";

export type FinalOperatorReviewDecisionOption =
  | "APPROVE_ONE_NEXT_GOAL"
  | "REQUEST_REVISION"
  | "HOLD_ALL"
  | "REJECT_BLOCKED";

export type FinalOperatorReviewBundleSafety = {
  bundleOnly: true;
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

export type FinalOperatorReviewBundleInput = {
  surface: "final-operator-review-bundle-input";
  snapshotIndex: OperatorHandoffSnapshotIndex;
  dailyQueuePreview: OperatorHandoffDailyQueuePreview;
  discordDigest: OperatorHandoffDiscordDigest;
  bundleId?: string;
  title?: string;
  generatedAtLabel?: string;
  redacted: true;
};

export type FinalOperatorReviewChecklistItem = {
  label: string;
  required: boolean;
  passed: boolean;
};

export type FinalOperatorReviewDecisionChoice = {
  option: FinalOperatorReviewDecisionOption;
  label: string;
  requiresExplicitHumanGo: boolean;
};

export type FinalOperatorReviewBundle = {
  surface: "final-operator-review-bundle";
  bundleOnly: true;
  reviewOnly: true;
  draftOnly: true;
  markdownOnly: true;
  status: FinalOperatorReviewBundleStatus;
  bundleId: string;
  title: string;
  snapshotIndex: OperatorHandoffSnapshotIndex;
  dailyQueuePreview: OperatorHandoffDailyQueuePreview;
  discordDigest: OperatorHandoffDiscordDigest;
  recommendedHumanAction: string;
  reviewChecklist: FinalOperatorReviewChecklistItem[];
  decisionOptions: FinalOperatorReviewDecisionChoice[];
  markdown: string;
  safety: FinalOperatorReviewBundleSafety;
};
