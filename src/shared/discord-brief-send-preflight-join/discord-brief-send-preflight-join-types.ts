import type { DiscordOperatorBrief } from "../discord-operator-brief/discord-operator-brief-types";
import type { DiscordSendPreflightResult } from "../discord-send-preflight/discord-send-preflight-types";

export type DiscordBriefSendPreflightJoinStatus = "REVIEW_READY_CANDIDATE" | "HOLD" | "BLOCKED";

export type DiscordBriefSendPreflightJoinRowStatus = "READY_CANDIDATE" | "HOLD" | "BLOCKED";

export type DiscordBriefSendPreflightJoinReviewRow = {
  label: string;
  status: DiscordBriefSendPreflightJoinRowStatus;
  mayProceedNow: false;
  reasons: string[];
};

export type DiscordBriefSendPreflightJoinSafety = {
  joinOnly: true;
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
  productionReady: false;
  execution: "disabled";
  rawValuesReported: false;
  redacted: true;
};

export type DiscordBriefSendPreflightJoinInput = {
  surface: "discord-brief-send-preflight-join-input";
  operatorBrief: DiscordOperatorBrief;
  sendPreflightResult: DiscordSendPreflightResult;
  humanGoReference?: string;
  redacted: true;
};

export type DiscordBriefSendPreflightJoin = {
  surface: "discord-brief-send-preflight-join";
  joinOnly: true;
  reviewOnly: true;
  draftOnly: true;
  status: DiscordBriefSendPreflightJoinStatus;
  title: string;
  headline: string;
  briefPreview: string;
  sendPreflightSummary: string;
  reviewRows: DiscordBriefSendPreflightJoinReviewRow[];
  nextHumanActionLabel: string;
  footerNotice: string;
  source: {
    briefStatus: string;
    sendPreflightStatus: string;
    humanGoReference?: string;
  };
  safety: DiscordBriefSendPreflightJoinSafety;
};
