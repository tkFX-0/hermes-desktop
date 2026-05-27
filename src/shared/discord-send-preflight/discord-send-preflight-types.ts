export type DiscordSendPreflightStatus = "HOLD" | "BLOCKED" | "READY_CANDIDATE";

export type DiscordSendPreflightIntent = {
  surface: "discord-send-preflight";
  intentOnly: true;
  sourceDraftId: string;
  sourceDraftTitle: string;
  sourceDraftStatus: string;
  exactMessageText: string;
  targetChannelSummary: string;
  targetUserOrRoleSummary?: string;
  humanGoReference?: string;
  allowedSendCount: 1;
  requestedSendCount: number;
  oneShotOnly: true;
  tokenProvided: false;
  webhookProvided: false;
  botRuntimeRequired: false;
  autoReply: false;
  continuousMode: false;
  rawValuesReported: false;
  redacted: true;
};

export type DiscordSendPreflightResult = {
  surface: "discord-send-preflight-result";
  status: DiscordSendPreflightStatus;
  reasons: string[];
  missingRequirements: string[];
  sendReady: false;
  maySendNow: false;
  externalWrite: false;
  discordSend: false;
  webhookUsed: false;
  botStarted: false;
  tokenRead: false;
  networkCall: false;
  oneShotOnly: true;
  allowedSendCount: 1;
  actualSendCount: 0;
  gateRestoredHoldRequired: true;
  productionReady: false;
  execution: "disabled";
  rawValuesReported: false;
  redacted: true;
};

export type CreateDiscordSendPreflightIntentFromDraftOptions = {
  exactMessageText: string;
  targetChannelSummary: string;
  targetUserOrRoleSummary?: string;
  humanGoReference?: string;
  requestedSendCount?: number;
};
