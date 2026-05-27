import type { HumanGateStatusSnapshot } from "../human-gate-status-snapshot/human-gate-status-snapshot-types";

export type DiscordOperatorBriefStatus = "REVIEW_READY_CANDIDATE" | "HOLD" | "BLOCKED";

export type DiscordOperatorBriefInput = {
  surface: "discord-operator-brief-input";
  snapshot: HumanGateStatusSnapshot;
  title?: string;
  maxLines?: number;
  redacted: true;
};

export type DiscordOperatorBriefSafety = {
  briefOnly: true;
  draftOnly: true;
  displayOnly: true;
  sendReady: false;
  maySendNow: false;
  mayMutateQueueNow: false;
  fileWriteReady: false;
  actualDiscordSend: false;
  actualQueueMutation: false;
  humanGateQueueDocModified: false;
  webhookUsed: false;
  botStarted: false;
  tokenRead: false;
  networkCall: false;
  externalWrite: false;
  runtimeStarted: false;
  obsidianActualWrite: false;
  productionReady: false;
  execution: "disabled";
  rawValuesReported: false;
  redacted: true;
};

export type DiscordOperatorBrief = {
  surface: "discord-operator-brief";
  briefOnly: true;
  draftOnly: true;
  status: DiscordOperatorBriefStatus;
  title: string;
  headline: string;
  shortSummary: string;
  lines: string[];
  actionLine: string;
  footerNotice: string;
  source: {
    snapshotStatus: string;
    sourceOfTruth: "ledger";
    primaryDisplaySurface: "discord";
    fallbackDisplaySurface: "control-center";
  };
  safety: DiscordOperatorBriefSafety;
};
