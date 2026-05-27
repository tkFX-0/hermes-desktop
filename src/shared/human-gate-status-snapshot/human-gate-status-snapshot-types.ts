import type { DiscordSendReadinessDigest } from "../discord-send-readiness-digest/discord-send-readiness-digest-types";

export type HumanGateStatusSnapshotStatus = "REVIEW_READY_CANDIDATE" | "HOLD" | "BLOCKED";

export type HumanGateStatusSnapshotCardStatus = "READY_CANDIDATE" | "HOLD" | "BLOCKED";

export type HumanGateStatusSnapshotCard = {
  label: string;
  status: HumanGateStatusSnapshotCardStatus;
  description: string;
};

export type HumanGateStatusSnapshotSection = {
  heading: string;
  lines: string[];
};

export type HumanGateStatusSnapshotSafety = {
  snapshotOnly: true;
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

export type HumanGateStatusSnapshotInput = {
  surface: "human-gate-status-snapshot-input";
  readinessDigest: DiscordSendReadinessDigest;
  title?: string;
  sourceOfTruth: "ledger";
  primaryDisplaySurface: "discord";
  fallbackDisplaySurface: "control-center";
  humanGoReference?: string;
  redacted: true;
};

export type HumanGateStatusSnapshot = {
  surface: "human-gate-status-snapshot";
  snapshotOnly: true;
  status: HumanGateStatusSnapshotStatus;
  title: string;
  summary: string;
  sourceOfTruth: "ledger";
  primaryDisplaySurface: "discord";
  fallbackDisplaySurface: "control-center";
  cards: HumanGateStatusSnapshotCard[];
  sections: HumanGateStatusSnapshotSection[];
  nextHumanActionLabel: string;
  footerNotice: string;
  source: {
    readinessDigestStatus: string;
    humanGoReference?: string;
  };
  safety: HumanGateStatusSnapshotSafety;
};
