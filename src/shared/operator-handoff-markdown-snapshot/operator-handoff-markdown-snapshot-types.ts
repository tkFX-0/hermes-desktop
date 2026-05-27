import type { OperatorHandoffAssemblyResult } from "../operator-handoff-assembly/operator-handoff-assembly-types";

export type OperatorHandoffMarkdownSnapshotStatus =
  | "READY_FOR_HUMAN_REVIEW"
  | "HOLD"
  | "BLOCKED";

export type OperatorHandoffMarkdownSnapshotSection = {
  heading: string;
  lines: string[];
};

export type OperatorHandoffMarkdownSnapshotSafety = {
  snapshotOnly: true;
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

export type OperatorHandoffMarkdownSnapshotInput = {
  surface: "operator-handoff-markdown-snapshot-input";
  assembly: OperatorHandoffAssemblyResult;
  title?: string;
  generatedAtLabel?: string;
  includeSafetySection?: boolean;
  includeDecisionChoices?: boolean;
  includeRawPreview?: boolean;
  redacted: true;
};

export type OperatorHandoffMarkdownSnapshot = {
  surface: "operator-handoff-markdown-snapshot";
  snapshotOnly: true;
  markdownOnly: true;
  reviewOnly: true;
  draftOnly: true;
  status: OperatorHandoffMarkdownSnapshotStatus;
  title: string;
  markdown: string;
  sections: OperatorHandoffMarkdownSnapshotSection[];
  source: {
    assemblyStatus: string;
    handoffSessionStatus: string;
    goalName: string;
    goalResultStatus: string;
    sessionId: string;
  };
  safety: OperatorHandoffMarkdownSnapshotSafety;
};
