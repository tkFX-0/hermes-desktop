import type { DiscordBriefSendPreflightJoin } from "../discord-brief-send-preflight-join/discord-brief-send-preflight-join-types";
import type { DiscordOperatorBrief } from "../discord-operator-brief/discord-operator-brief-types";
import type { DiscordReviewPacket } from "../discord-review-packet/discord-review-packet-types";
import type { DiscordSendPreflightResult } from "../discord-send-preflight/discord-send-preflight-types";
import type { HumanGateStatusSnapshot } from "../human-gate-status-snapshot/human-gate-status-snapshot-types";

export type DiscordReviewPacketAssemblyStatus = "REVIEW_READY_CANDIDATE" | "HOLD" | "BLOCKED";

export type DiscordReviewPacketAssemblySafety = {
  assemblyOnly: true;
  reviewOnly: true;
  draftOnly: true;
  displayOnly: true;
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
  productionReady: false;
  execution: "disabled";
  rawValuesReported: false;
  redacted: true;
};

export type DiscordReviewPacketAssemblyInput = {
  surface: "discord-review-packet-assembly-input";
  snapshot: HumanGateStatusSnapshot;
  sendPreflightResult: DiscordSendPreflightResult;
  packetId?: string;
  humanGoReference?: string;
  redacted: true;
};

export type DiscordReviewPacketAssemblyResult = {
  surface: "discord-review-packet-assembly-result";
  assemblyOnly: true;
  reviewOnly: true;
  draftOnly: true;
  status: DiscordReviewPacketAssemblyStatus;
  operatorBrief: DiscordOperatorBrief;
  joinedReview: DiscordBriefSendPreflightJoin;
  reviewPacket: DiscordReviewPacket;
  preview: string;
  source: {
    snapshotStatus: string;
    sendPreflightStatus: string;
    packetId: string;
    humanGoReference?: string;
  };
  safety: DiscordReviewPacketAssemblySafety;
};
