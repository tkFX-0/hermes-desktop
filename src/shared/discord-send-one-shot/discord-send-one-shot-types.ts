export type DiscordOneShotSendStatus =
  | "READY_TO_SEND_ONCE"
  | "SENT_ONCE"
  | "HOLD"
  | "BLOCKED"
  | "FAILED";

export type DiscordOneShotSendTransport = "bot_token_rest";

export type DiscordOneShotSendIntentSource =
  | "final-operator-review-bundle"
  | "operator-handoff-discord-digest";

export type DiscordOneShotSendIntent = {
  surface: "discord-one-shot-send-intent";
  source: DiscordOneShotSendIntentSource;
  messageMarkdown: string;
  targetLabel: string;
  transport: DiscordOneShotSendTransport;
  sendCountLimit: 1;
  humanGoReference: string;
  redacted: true;
};

export type DiscordOneShotSendPreflightInput = {
  surface: "discord-one-shot-send-preflight-input";
  intent: DiscordOneShotSendIntent;
  dryRunStatus: "DRY_RUN_READY" | "HOLD" | "BLOCKED";
  queueEntryId?: string;
  localCredentialPresence: {
    botTokenPresent: boolean;
    channelIdPresent: boolean;
    targetLabelPresent: boolean;
  };
  redacted: true;
};

export type DiscordOneShotSendPreflightSafety = {
  oneShotOnly: true;
  actualDiscordSendAuthorized: boolean;
  actualSendCountBeforeExecution: 0;
  maxActualSendCount: 1;
  webhookUsed: false;
  botRuntimeStarted: false;
  gatewayUsed: false;
  autoRetry: false;
  autoReply: false;
  tokenPrinted: false;
  channelIdPrinted: false;
  networkCallAllowed: boolean;
  externalApiWriteAllowed: boolean;
  productionReady: false;
  execution: "disabled";
  rawValuesReported: false;
  redacted: true;
};

export type DiscordOneShotSendPreflight = {
  surface: "discord-one-shot-send-preflight";
  oneShotOnly: true;
  status: "READY_TO_SEND_ONCE" | "HOLD" | "BLOCKED";
  maySendExactlyOnce: boolean;
  sendCountLimit: 1;
  targetLabel: string;
  messagePreview: string;
  reasons: string[];
  safety: DiscordOneShotSendPreflightSafety;
};

export type DiscordOneShotSendResultSafety = {
  oneShotOnly: true;
  actualDiscordSend: boolean;
  actualSendCount: 0 | 1;
  webhookUsed: false;
  botRuntimeStarted: false;
  gatewayUsed: false;
  autoRetry: false;
  autoReply: false;
  tokenPrinted: false;
  channelIdPrinted: false;
  rawMessageIdPrinted: false;
  networkCall: boolean;
  externalApiWrite: boolean;
  productionReady: false;
  execution: "disabled";
  rawValuesReported: false;
  redacted: true;
};

export type DiscordOneShotSendResult = {
  surface: "discord-one-shot-send-result";
  oneShotOnly: true;
  status: "SENT_ONCE" | "HOLD" | "BLOCKED" | "FAILED";
  actualSendCount: 0 | 1;
  targetLabel: string;
  messageReferenceRedacted: string;
  evidenceId: string;
  gateRestoredToHold: true;
  rateLimitedRedacted?: boolean;
  safety: DiscordOneShotSendResultSafety;
};
