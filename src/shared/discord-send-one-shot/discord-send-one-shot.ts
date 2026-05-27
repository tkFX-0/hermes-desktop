import type { DiscordSendExecutorDryRunResult } from "../discord-send-executor-dry-run/discord-send-executor-dry-run-types";
import type {
  DiscordOneShotSendIntent,
  DiscordOneShotSendPreflight,
  DiscordOneShotSendPreflightInput,
  DiscordOneShotSendResult
} from "./discord-send-one-shot-types";

export const DEFAULT_ONE_SHOT_TARGET_LABEL = "operator-review";
export const ONE_SHOT_CONTENT_HARD_MAX = 2000;
export const ONE_SHOT_CONTENT_PREFERRED_MAX = 1900;
export const TRUNCATION_MARKER = "\n\n[truncated]";

const FORBIDDEN_TARGET_PATTERNS = [
  /^https?:\/\//i,
  /discord\.com\/api\/webhooks/i,
  /\bBearer\s+/i,
  /\bsk-[A-Za-z0-9]/,
  /^\d{10,}$/,
  /\bchannel_id:\s*\d+/i,
  /[A-Za-z]:\\Users\\/
];

function validateTargetLabel(targetLabel: string): string | undefined {
  const trimmed = targetLabel.trim();
  if (!trimmed) {
    return "targetLabel is required";
  }
  if (FORBIDDEN_TARGET_PATTERNS.some((pattern) => pattern.test(trimmed))) {
    return "targetLabel must be a label only (no URL, token, channel ID, or local path)";
  }
  return undefined;
}

function validateHumanGoReference(humanGoReference: string): string | undefined {
  if (!humanGoReference.trim()) {
    return "humanGoReference is required";
  }
  return undefined;
}

function validateMessageMarkdown(messageMarkdown: string): string | undefined {
  if (!messageMarkdown.trim()) {
    return "messageMarkdown is required";
  }
  return undefined;
}

export function buildDiscordOneShotSendMessageContent(input: {
  digestMarkdown: string;
  humanGoReference: string;
  redacted: true;
}): string {
  const header = [
    "## Rally 4 One-shot Send Validation",
    "",
    `- status: supervised one-shot send`,
    `- humanGoReference: ${input.humanGoReference.trim()}`,
    `- recommendedHumanAction: explicit Human GO required before any further external send`,
    `- oneShotOnly: true`,
    `- productionReady: false`,
    `- execution: disabled`,
    "",
    "---",
    ""
  ].join("\n");

  const footer = [
    "",
    "---",
    "",
    "Discord send was **one-shot only**. Gate restored HOLD after send.",
    "productionReady: false | execution: disabled"
  ].join("\n");

  const combined = `${header}${input.digestMarkdown.trim()}${footer}`;

  if (combined.length <= ONE_SHOT_CONTENT_HARD_MAX) {
    return combined;
  }

  const budget =
    ONE_SHOT_CONTENT_PREFERRED_MAX - header.length - footer.length - TRUNCATION_MARKER.length;
  const truncatedDigest =
    budget > 0
      ? `${input.digestMarkdown.trim().slice(0, budget)}${TRUNCATION_MARKER}`
      : `${input.digestMarkdown.trim().slice(0, ONE_SHOT_CONTENT_PREFERRED_MAX)}${TRUNCATION_MARKER}`;

  const result = `${header}${truncatedDigest}${footer}`;
  return result.length <= ONE_SHOT_CONTENT_HARD_MAX
    ? result
    : result.slice(0, ONE_SHOT_CONTENT_HARD_MAX - TRUNCATION_MARKER.length) + TRUNCATION_MARKER;
}

export function createDiscordOneShotSendIntentFromDryRun(input: {
  dryRunResult: DiscordSendExecutorDryRunResult;
  messageMarkdown: string;
  targetLabel: string;
  humanGoReference: string;
  redacted: true;
}): DiscordOneShotSendIntent {
  return {
    surface: "discord-one-shot-send-intent",
    source: input.dryRunResult.evidence.source as DiscordOneShotSendIntent["source"],
    messageMarkdown: input.messageMarkdown,
    targetLabel: input.targetLabel.trim(),
    transport: "bot_token_rest",
    sendCountLimit: 1,
    humanGoReference: input.humanGoReference.trim(),
    redacted: true
  };
}

export function createDiscordOneShotSendPreflight(
  input: DiscordOneShotSendPreflightInput
): DiscordOneShotSendPreflight {
  const reasons: string[] = [];
  const intent = input.intent;

  const targetError = validateTargetLabel(intent.targetLabel);
  if (targetError) reasons.push(targetError);

  const humanGoError = validateHumanGoReference(intent.humanGoReference);
  if (humanGoError) reasons.push(humanGoError);

  const messageError = validateMessageMarkdown(intent.messageMarkdown);
  if (messageError) reasons.push(messageError);

  if (intent.sendCountLimit !== 1) {
    reasons.push("sendCountLimit must be 1");
  }

  if (input.dryRunStatus === "BLOCKED") {
    reasons.push("dryRunStatus is BLOCKED");
  }

  if (input.dryRunStatus === "HOLD") {
    reasons.push("dryRunStatus is HOLD");
  }

  if (!input.localCredentialPresence.botTokenPresent) {
    reasons.push("missing SHIKISHIMA_DISCORD_BOT_TOKEN");
  }

  if (!input.localCredentialPresence.channelIdPresent) {
    reasons.push("missing SHIKISHIMA_DISCORD_OPERATOR_REVIEW_CHANNEL_ID");
  }

  if (!input.localCredentialPresence.targetLabelPresent) {
    reasons.push("missing SHIKISHIMA_DISCORD_OPERATOR_REVIEW_TARGET_LABEL");
  }

  const credentialMissing =
    !input.localCredentialPresence.botTokenPresent ||
    !input.localCredentialPresence.channelIdPresent ||
    !input.localCredentialPresence.targetLabelPresent;

  const hardBlockers = reasons.filter(
    (reason) => !reason.startsWith("dryRunStatus is") && !reason.startsWith("missing SHIKISHIMA_")
  );

  let status: DiscordOneShotSendPreflight["status"] = "READY_TO_SEND_ONCE";
  if (hardBlockers.length > 0 || input.dryRunStatus === "BLOCKED") {
    status = "BLOCKED";
  } else if (credentialMissing || input.dryRunStatus === "HOLD") {
    status = "HOLD";
  }

  const maySendExactlyOnce = status === "READY_TO_SEND_ONCE";

  const messagePreview =
    intent.messageMarkdown.length > 1200
      ? `${intent.messageMarkdown.slice(0, 1200)}\n\n(truncated for preflight preview)`
      : intent.messageMarkdown;

  if (maySendExactlyOnce) {
    reasons.push("READY_TO_SEND_ONCE permits one POST only inside Rally 4 GO");
  }

  return {
    surface: "discord-one-shot-send-preflight",
    oneShotOnly: true,
    status,
    maySendExactlyOnce,
    sendCountLimit: 1,
    targetLabel: intent.targetLabel,
    messagePreview,
    reasons,
    safety: {
      oneShotOnly: true,
      actualDiscordSendAuthorized: maySendExactlyOnce,
      actualSendCountBeforeExecution: 0,
      maxActualSendCount: 1,
      webhookUsed: false,
      botRuntimeStarted: false,
      gatewayUsed: false,
      autoRetry: false,
      autoReply: false,
      tokenPrinted: false,
      channelIdPrinted: false,
      networkCallAllowed: maySendExactlyOnce,
      externalApiWriteAllowed: maySendExactlyOnce,
      productionReady: false,
      execution: "disabled",
      rawValuesReported: false,
      redacted: true
    }
  };
}

export function createDiscordOneShotSendResultFromApiOutcome(input: {
  preflight: DiscordOneShotSendPreflight;
  apiOutcome: "SENT" | "FAILED";
  messageReferenceRedacted?: string;
  evidenceId: string;
  rateLimitedRedacted?: boolean;
  redacted: true;
}): DiscordOneShotSendResult {
  const sent = input.apiOutcome === "SENT";
  const status: DiscordOneShotSendResult["status"] = sent ? "SENT_ONCE" : "FAILED";
  const actualSendCount: 0 | 1 = sent ? 1 : 0;

  return {
    surface: "discord-one-shot-send-result",
    oneShotOnly: true,
    status,
    actualSendCount,
    targetLabel: input.preflight.targetLabel,
    messageReferenceRedacted:
      input.messageReferenceRedacted ?? "REDACTED_MESSAGE_ID_ABSENT",
    evidenceId: input.evidenceId,
    gateRestoredToHold: true,
    rateLimitedRedacted: input.rateLimitedRedacted,
    safety: {
      oneShotOnly: true,
      actualDiscordSend: sent,
      actualSendCount,
      webhookUsed: false,
      botRuntimeStarted: false,
      gatewayUsed: false,
      autoRetry: false,
      autoReply: false,
      tokenPrinted: false,
      channelIdPrinted: false,
      rawMessageIdPrinted: false,
      networkCall: sent,
      externalApiWrite: sent,
      productionReady: false,
      execution: "disabled",
      rawValuesReported: false,
      redacted: true
    }
  };
}

export function createDiscordOneShotSendHoldResult(input: {
  preflight: DiscordOneShotSendPreflight;
  evidenceId: string;
  redacted: true;
}): DiscordOneShotSendResult {
  return {
    surface: "discord-one-shot-send-result",
    oneShotOnly: true,
    status: "HOLD",
    actualSendCount: 0,
    targetLabel: input.preflight.targetLabel,
    messageReferenceRedacted: "REDACTED_MESSAGE_ID_ABSENT",
    evidenceId: input.evidenceId,
    gateRestoredToHold: true,
    safety: {
      oneShotOnly: true,
      actualDiscordSend: false,
      actualSendCount: 0,
      webhookUsed: false,
      botRuntimeStarted: false,
      gatewayUsed: false,
      autoRetry: false,
      autoReply: false,
      tokenPrinted: false,
      channelIdPrinted: false,
      rawMessageIdPrinted: false,
      networkCall: false,
      externalApiWrite: false,
      productionReady: false,
      execution: "disabled",
      rawValuesReported: false,
      redacted: true
    }
  };
}

export function renderDiscordOneShotSendEvidence(result: DiscordOneShotSendResult): string {
  const rateLine = result.rateLimitedRedacted
    ? "- rate_limited_redacted: true"
    : "- rate_limited_redacted: false";

  return [
    "# Discord One-shot Send Evidence",
    "",
    "## Summary",
    `- evidenceId: ${result.evidenceId}`,
    `- status: ${result.status}`,
    `- actualSendCount: ${result.actualSendCount}`,
    `- targetLabel: ${result.targetLabel}`,
    `- messageReferenceRedacted: ${result.messageReferenceRedacted}`,
    `- gateRestoredToHold: ${result.gateRestoredToHold}`,
    rateLine,
    "",
    "## Safety Boundary",
    `- actualDiscordSend: ${result.safety.actualDiscordSend}`,
    `- networkCall: ${result.safety.networkCall}`,
    `- externalApiWrite: ${result.safety.externalApiWrite}`,
    `- webhookUsed: false`,
    `- botRuntimeStarted: false`,
    `- gatewayUsed: false`,
    `- autoRetry: false`,
    `- autoReply: false`,
    `- tokenPrinted: false`,
    `- channelIdPrinted: false`,
    `- rawMessageIdPrinted: false`,
    `- productionReady: false`,
    `- execution: disabled`,
    "- Discord send gate: HOLD (restored after one-shot)"
  ].join("\n");
}
