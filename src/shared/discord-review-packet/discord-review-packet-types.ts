import type { DiscordBriefSendPreflightJoin } from "../discord-brief-send-preflight-join/discord-brief-send-preflight-join-types";

export type DiscordReviewPacketStatus = "REVIEW_READY_CANDIDATE" | "HOLD" | "BLOCKED";

export type DiscordReviewPacketRowStatus = "READY_CANDIDATE" | "HOLD" | "BLOCKED";

export type DiscordReviewPacketSection = {
  heading: string;
  lines: string[];
};

export type DiscordReviewPacketReviewRow = {
  label: string;
  status: DiscordReviewPacketRowStatus;
  mayProceedNow: false;
  reasons: string[];
};

export type DiscordReviewPacketSafety = {
  packetOnly: true;
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

export type DiscordReviewPacketInput = {
  surface: "discord-review-packet-input";
  joinedReview: DiscordBriefSendPreflightJoin;
  title?: string;
  packetId?: string;
  humanGoReference?: string;
  redacted: true;
};

export type DiscordReviewPacket = {
  surface: "discord-review-packet";
  packetOnly: true;
  reviewOnly: true;
  draftOnly: true;
  status: DiscordReviewPacketStatus;
  packetId: string;
  title: string;
  headline: string;
  bodyPreview: string;
  operatorBriefPreview: string;
  sendPreflightPreview: string;
  sections: DiscordReviewPacketSection[];
  reviewRows: DiscordReviewPacketReviewRow[];
  nextHumanActionLabel: string;
  footerNotice: string;
  source: {
    joinedReviewStatus: string;
    humanGoReference?: string;
  };
  safety: DiscordReviewPacketSafety;
};
