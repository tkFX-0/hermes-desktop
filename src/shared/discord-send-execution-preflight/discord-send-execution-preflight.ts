import type { DiscordReviewPacket } from "../discord-review-packet/discord-review-packet-types";
import type {
  CreateDiscordSendExecutionPreflightIntentOptions,
  DiscordSendExecutionPreflightIntent,
  DiscordSendExecutionPreflightResult,
  DiscordSendExecutionPreflightStatus
} from "./discord-send-execution-preflight-types";

type ForbiddenExecutionFlags = {
  requestedSendCount: number;
  autoReply: boolean;
  continuousMode: boolean;
  webhookExecutionRequested: boolean;
  botRuntimeRequested: boolean;
  tokenReadRequested: boolean;
  rawValuesReported: boolean;
  tokenNotLogged: boolean;
  networkCallLimitedToDiscordSendOnly: boolean;
  redacted: boolean;
};

function readForbiddenFlags(intent: DiscordSendExecutionPreflightIntent): ForbiddenExecutionFlags {
  return intent as unknown as ForbiddenExecutionFlags;
}

function baseResult(
  status: DiscordSendExecutionPreflightStatus,
  intent: DiscordSendExecutionPreflightIntent,
  reasons: string[],
  missingRequirements: string[],
  blockedReasons: string[]
): DiscordSendExecutionPreflightResult {
  return {
    surface: "discord-send-execution-preflight-result",
    resultOnly: true,
    status,
    reasons,
    missingRequirements,
    blockedReasons,
    source: {
      reviewPacketStatus: intent.reviewPacket.status,
      reviewPacketId: intent.reviewPacketId,
      sourceReviewPacketCommit: intent.sourceReviewPacketCommit,
      humanGoReference: intent.humanGoReference
    },
    sendReady: false,
    maySendNow: false,
    actualDiscordSend: false,
    webhookUsed: false,
    botStarted: false,
    tokenRead: false,
    networkCall: false,
    externalWrite: false,
    runtimeStarted: false,
    actualQueueMutation: false,
    fileWriteReady: false,
    humanGateQueueDocModified: false,
    allowedSendCount: 1,
    actualSendCount: 0,
    gateRestoredHoldRequired: true,
    rollbackOrRemediationRequired: true,
    productionReady: false,
    execution: "disabled",
    rawValuesReported: false,
    redacted: true
  };
}

export function createDiscordSendExecutionPreflightIntent(
  reviewPacket: DiscordReviewPacket,
  options: CreateDiscordSendExecutionPreflightIntentOptions
): DiscordSendExecutionPreflightIntent {
  return {
    surface: "discord-send-execution-preflight-intent",
    intentOnly: true,
    reviewPacket,
    sourceReviewPacketCommit: options.sourceReviewPacketCommit,
    reviewPacketId: reviewPacket.packetId,
    exactPacketPreview: options.exactPacketPreview,
    exactMessageTextToSend: options.exactMessageTextToSend,
    targetChannelSummary: options.targetChannelSummary,
    targetUserOrRoleSummary: options.targetUserOrRoleSummary,
    humanGoReference: options.humanGoReference,
    allowedSendCount: 1,
    requestedSendCount: options.requestedSendCount ?? 1,
    oneShotOnly: true,
    preSendGitStatusClean: options.preSendGitStatusClean ?? false,
    preSendTestsOrReasonIfSkipped: options.preSendTestsOrReasonIfSkipped,
    tokenNotLogged: true,
    rawValuesReported: false,
    networkCallLimitedToDiscordSendOnly: true,
    autoReply: false,
    continuousMode: false,
    webhookExecutionRequested: false,
    botRuntimeRequested: false,
    tokenReadRequested: false,
    redacted: true
  };
}

export function evaluateDiscordSendExecutionPreflight(
  intent: DiscordSendExecutionPreflightIntent
): DiscordSendExecutionPreflightResult {
  const flags = readForbiddenFlags(intent);
  const blockedReasons: string[] = [];

  if (intent.reviewPacket.status === "BLOCKED") {
    blockedReasons.push("reviewPacket.status is BLOCKED");
  }
  if (flags.requestedSendCount > 1) {
    blockedReasons.push("requestedSendCount exceeds one-shot limit");
  }
  if (flags.autoReply === true) {
    blockedReasons.push("autoReply is NOT_APPROVED");
  }
  if (flags.continuousMode === true) {
    blockedReasons.push("continuousMode is NOT_APPROVED");
  }
  if (flags.webhookExecutionRequested === true) {
    blockedReasons.push("webhookExecutionRequested is not allowed");
  }
  if (flags.botRuntimeRequested === true) {
    blockedReasons.push("botRuntimeRequested is not allowed");
  }
  if (flags.tokenReadRequested === true) {
    blockedReasons.push("tokenReadRequested is not allowed");
  }
  if (flags.rawValuesReported === true) {
    blockedReasons.push("rawValuesReported must remain false");
  }
  if (flags.tokenNotLogged === false) {
    blockedReasons.push("tokenNotLogged must remain true");
  }
  if (flags.networkCallLimitedToDiscordSendOnly === false) {
    blockedReasons.push("networkCallLimitedToDiscordSendOnly must remain true");
  }
  if (flags.redacted === false) {
    blockedReasons.push("redacted must remain true");
  }

  if (blockedReasons.length > 0) {
    return baseResult("BLOCKED", intent, blockedReasons, [], blockedReasons);
  }

  const missingRequirements: string[] = [];

  if (intent.reviewPacket.status !== "REVIEW_READY_CANDIDATE") {
    missingRequirements.push("reviewPacket.status must be REVIEW_READY_CANDIDATE");
  }
  if (!intent.sourceReviewPacketCommit.trim()) {
    missingRequirements.push("sourceReviewPacketCommit");
  }
  if (!intent.reviewPacketId.trim()) {
    missingRequirements.push("reviewPacketId");
  }
  if (intent.reviewPacketId !== intent.reviewPacket.packetId) {
    missingRequirements.push("reviewPacketId must match reviewPacket.packetId");
  }
  if (!intent.exactPacketPreview.trim()) {
    missingRequirements.push("exactPacketPreview");
  }
  if (!intent.exactMessageTextToSend.trim()) {
    missingRequirements.push("exactMessageTextToSend");
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
  if (intent.preSendGitStatusClean !== true) {
    missingRequirements.push("preSendGitStatusClean must be true");
  }
  if (!intent.preSendTestsOrReasonIfSkipped.trim()) {
    missingRequirements.push("preSendTestsOrReasonIfSkipped");
  }

  if (missingRequirements.length > 0) {
    return baseResult(
      "HOLD",
      intent,
      ["Discord send execution preflight requirements are not satisfied"],
      missingRequirements,
      []
    );
  }

  return baseResult(
    "EXECUTION_READY_CANDIDATE",
    intent,
    [
      "Documentation-level one-shot send execution metadata is present",
      "EXECUTION_READY_CANDIDATE is not send approval; sendReady and maySendNow remain false"
    ],
    [],
    []
  );
}

export function renderDiscordSendExecutionPreflightPreview(
  result: DiscordSendExecutionPreflightResult
): string {
  return [
    "<!-- preflight-only / no Discord send / no webhook / no bot / no token read -->",
    "**Discord Send Execution Preflight**",
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
    "**Blocked reasons:**",
    ...(result.blockedReasons.length > 0
      ? result.blockedReasons.map((item) => `- ${item}`)
      : ["- (none)"]),
    "",
    "sendReady: false | maySendNow: false | actualDiscordSend: false | networkCall: false",
    "EXECUTION_READY_CANDIDATE does not approve Discord send."
  ].join("\n");
}

export function createDiscordSendExecutionPreflightPreview(
  intent: DiscordSendExecutionPreflightIntent
): string {
  return renderDiscordSendExecutionPreflightPreview(evaluateDiscordSendExecutionPreflight(intent));
}
