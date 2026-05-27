import type { DiscordSendPreflightResult } from "../discord-send-preflight/discord-send-preflight-types";
import type { HumanGateQueueMutationPreflightResult } from "../human-gate-queue-mutation-preflight/human-gate-queue-mutation-preflight-types";

export type DiscordSendReadinessDigestStatus = "REVIEW_READY_CANDIDATE" | "HOLD" | "BLOCKED";

export type PreflightRowStatus = "READY_CANDIDATE" | "HOLD" | "BLOCKED";

export type DiscordSendReadinessDigestSection = {
  heading: string;
  lines: string[];
};

export type DiscordSendReadinessDigestReadinessRow = {
  label: string;
  status: PreflightRowStatus;
  mayProceedNow: false;
  reasons: string[];
};

export type DiscordSendReadinessDigestSafety = {
  digestOnly: true;
  sendReady: false;
  maySendNow: false;
  mayMutateQueueNow: false;
  fileWriteReady: false;
  actualDiscordSend: false;
  actualQueueMutation: false;
  webhookUsed: false;
  botStarted: false;
  tokenRead: false;
  networkCall: false;
  externalWrite: false;
  runtimeStarted: false;
  productionReady: false;
  execution: "disabled";
  rawValuesReported: false;
  redacted: true;
};

export type DiscordSendReadinessDigestInput = {
  surface: "discord-send-readiness-digest-input";
  discordSendPreflightResult: DiscordSendPreflightResult;
  queueMutationPreflightResult: HumanGateQueueMutationPreflightResult;
  title?: string;
  humanGoReference?: string;
  redacted: true;
};

export type DiscordSendReadinessDigest = {
  surface: "discord-send-readiness-digest";
  digestOnly: true;
  status: DiscordSendReadinessDigestStatus;
  title: string;
  summary: string;
  sections: DiscordSendReadinessDigestSection[];
  readinessRows: DiscordSendReadinessDigestReadinessRow[];
  nextHumanActionLabel: string;
  footerNotice: string;
  source: {
    discordPreflightStatus: string;
    queuePreflightStatus: string;
    humanGoReference?: string;
  };
  safety: DiscordSendReadinessDigestSafety;
};
