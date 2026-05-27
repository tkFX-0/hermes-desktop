import type { DiscordReviewPacket } from "../discord-review-packet/discord-review-packet-types";

export type DiscordSendExecutionPreflightStatus =
  | "EXECUTION_READY_CANDIDATE"
  | "HOLD"
  | "BLOCKED";

export type DiscordSendExecutionPreflightIntent = {
  surface: "discord-send-execution-preflight-intent";
  intentOnly: true;
  reviewPacket: DiscordReviewPacket;
  sourceReviewPacketCommit: string;
  reviewPacketId: string;
  exactPacketPreview: string;
  exactMessageTextToSend: string;
  targetChannelSummary: string;
  targetUserOrRoleSummary?: string;
  humanGoReference?: string;
  allowedSendCount: 1;
  requestedSendCount: number;
  oneShotOnly: true;
  preSendGitStatusClean: boolean;
  preSendTestsOrReasonIfSkipped: string;
  tokenNotLogged: true;
  rawValuesReported: false;
  networkCallLimitedToDiscordSendOnly: true;
  autoReply: false;
  continuousMode: false;
  webhookExecutionRequested: false;
  botRuntimeRequested: false;
  tokenReadRequested: false;
  redacted: true;
};

export type DiscordSendExecutionPreflightResult = {
  surface: "discord-send-execution-preflight-result";
  resultOnly: true;
  status: DiscordSendExecutionPreflightStatus;
  reasons: string[];
  missingRequirements: string[];
  blockedReasons: string[];
  source: {
    reviewPacketStatus: string;
    reviewPacketId: string;
    sourceReviewPacketCommit: string;
    humanGoReference?: string;
  };
  sendReady: false;
  maySendNow: false;
  actualDiscordSend: false;
  webhookUsed: false;
  botStarted: false;
  tokenRead: false;
  networkCall: false;
  externalWrite: false;
  runtimeStarted: false;
  actualQueueMutation: false;
  fileWriteReady: false;
  humanGateQueueDocModified: false;
  allowedSendCount: 1;
  actualSendCount: 0;
  gateRestoredHoldRequired: true;
  rollbackOrRemediationRequired: true;
  productionReady: false;
  execution: "disabled";
  rawValuesReported: false;
  redacted: true;
};

export type CreateDiscordSendExecutionPreflightIntentOptions = {
  sourceReviewPacketCommit: string;
  exactPacketPreview: string;
  exactMessageTextToSend: string;
  targetChannelSummary: string;
  targetUserOrRoleSummary?: string;
  humanGoReference?: string;
  requestedSendCount?: number;
  preSendGitStatusClean?: boolean;
  preSendTestsOrReasonIfSkipped: string;
};
