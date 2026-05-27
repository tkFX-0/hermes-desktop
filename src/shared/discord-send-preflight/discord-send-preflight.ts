import type { DiscordHumanGateMessageDraft } from "../discord-human-gate-message-render/discord-human-gate-message-render-types";
import type {
  CreateDiscordSendPreflightIntentFromDraftOptions,
  DiscordSendPreflightIntent,
  DiscordSendPreflightResult,
  DiscordSendPreflightStatus
} from "./discord-send-preflight-types";

type ForbiddenSendFlags = {
  requestedSendCount: number;
  autoReply: boolean;
  continuousMode: boolean;
  tokenProvided: boolean;
  webhookProvided: boolean;
  botRuntimeRequired: boolean;
  rawValuesReported: boolean;
  redacted: boolean;
};

function readForbiddenFlags(intent: DiscordSendPreflightIntent): ForbiddenSendFlags {
  return intent as unknown as ForbiddenSendFlags;
}

function buildSourceDraftId(draft: DiscordHumanGateMessageDraft): string {
  return `discord-draft:${draft.source.gateId}:${draft.source.goalId}:${draft.source.taskId}`;
}

function baseResult(
  status: DiscordSendPreflightStatus,
  reasons: string[],
  missingRequirements: string[]
): DiscordSendPreflightResult {
  return {
    surface: "discord-send-preflight-result",
    status,
    reasons,
    missingRequirements,
    sendReady: false,
    maySendNow: false,
    externalWrite: false,
    discordSend: false,
    webhookUsed: false,
    botStarted: false,
    tokenRead: false,
    networkCall: false,
    oneShotOnly: true,
    allowedSendCount: 1,
    actualSendCount: 0,
    gateRestoredHoldRequired: true,
    productionReady: false,
    execution: "disabled",
    rawValuesReported: false,
    redacted: true
  };
}

export function createDiscordSendPreflightIntentFromDraft(
  draft: DiscordHumanGateMessageDraft,
  options: CreateDiscordSendPreflightIntentFromDraftOptions
): DiscordSendPreflightIntent {
  return {
    surface: "discord-send-preflight",
    intentOnly: true,
    sourceDraftId: buildSourceDraftId(draft),
    sourceDraftTitle: draft.title,
    sourceDraftStatus: draft.source.sourceStatus,
    exactMessageText: options.exactMessageText,
    targetChannelSummary: options.targetChannelSummary,
    targetUserOrRoleSummary: options.targetUserOrRoleSummary,
    humanGoReference: options.humanGoReference,
    allowedSendCount: 1,
    requestedSendCount: options.requestedSendCount ?? 1,
    oneShotOnly: true,
    tokenProvided: false,
    webhookProvided: false,
    botRuntimeRequired: false,
    autoReply: false,
    continuousMode: false,
    rawValuesReported: false,
    redacted: true
  };
}

export function evaluateDiscordSendPreflight(
  intent: DiscordSendPreflightIntent
): DiscordSendPreflightResult {
  const flags = readForbiddenFlags(intent);
  const blockedReasons: string[] = [];

  if (flags.requestedSendCount > 1) {
    blockedReasons.push("requestedSendCount exceeds one-shot limit");
  }
  if (flags.autoReply === true) {
    blockedReasons.push("autoReply is not approved");
  }
  if (flags.continuousMode === true) {
    blockedReasons.push("continuousMode is not approved");
  }
  if (flags.tokenProvided === true) {
    blockedReasons.push("tokenProvided is not allowed in preflight");
  }
  if (flags.webhookProvided === true) {
    blockedReasons.push("webhookProvided is not allowed in preflight");
  }
  if (flags.botRuntimeRequired === true) {
    blockedReasons.push("botRuntimeRequired is not allowed in preflight");
  }
  if (flags.rawValuesReported === true) {
    blockedReasons.push("rawValuesReported must remain false");
  }
  if (flags.redacted === false) {
    blockedReasons.push("redacted must remain true");
  }

  if (blockedReasons.length > 0) {
    return baseResult("BLOCKED", blockedReasons, []);
  }

  const missingRequirements: string[] = [];

  if (!intent.exactMessageText.trim()) {
    missingRequirements.push("exactMessageText");
  }
  if (!intent.targetChannelSummary.trim()) {
    missingRequirements.push("targetChannelSummary");
  }
  if (!intent.humanGoReference?.trim()) {
    missingRequirements.push("humanGoReference");
  }
  if (intent.allowedSendCount !== 1) {
    missingRequirements.push("allowedSendCount must be 1");
  }
  if (intent.requestedSendCount !== 1) {
    missingRequirements.push("requestedSendCount must be 1");
  }
  if (intent.oneShotOnly !== true) {
    missingRequirements.push("oneShotOnly must be true");
  }

  if (missingRequirements.length > 0) {
    return baseResult(
      "HOLD",
      ["One-shot send preflight requirements are not satisfied"],
      missingRequirements
    );
  }

  return baseResult(
    "READY_CANDIDATE",
    [
      "Documentation-level one-shot send metadata is present",
      "READY_CANDIDATE is not send approval; sendReady and maySendNow remain false"
    ],
    []
  );
}

export function renderDiscordSendPreflightPreview(result: DiscordSendPreflightResult): string {
  return [
    "<!-- review-only / preflight-only / no Discord send -->",
    `**Discord Send Preflight**`,
    `Status: ${result.status}`,
    "",
    "**Reasons:**",
    ...(result.reasons.length > 0 ? result.reasons.map((reason) => `- ${reason}`) : ["- (none)"]),
    "",
    "**Missing requirements:**",
    ...(result.missingRequirements.length > 0
      ? result.missingRequirements.map((item) => `- ${item}`)
      : ["- (none)"]),
    "",
    "sendReady: false | maySendNow: false | discordSend: false | networkCall: false",
    "READY_CANDIDATE does not approve send."
  ].join("\n");
}
