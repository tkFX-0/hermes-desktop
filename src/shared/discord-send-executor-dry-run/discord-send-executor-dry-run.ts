import type { FinalOperatorReviewBundle } from "../final-operator-review-bundle/final-operator-review-bundle-types";
import type { OperatorHandoffDiscordDigest } from "../operator-handoff-discord-digest/operator-handoff-discord-digest-types";
import type {
  DiscordSendExecutorDryRunInput,
  DiscordSendExecutorDryRunResult,
  DiscordSendExecutorDryRunStatus,
  DiscordSendExecutorIntent,
  DiscordSendMockTransportResult
} from "./discord-send-executor-dry-run-types";
import type { DiscordSendExecutorDryRunSafety } from "./discord-send-executor-dry-run-types";

const SAFETY_BLOCK: DiscordSendExecutorDryRunSafety = {
  dryRunOnly: true,
  executorDryRunOnly: true,
  mockTransportOnly: true,
  displayOnly: true,
  actualDiscordSend: false,
  sendReady: false,
  maySendNow: false,
  webhookUsed: false,
  botStarted: false,
  tokenRead: false,
  networkCall: false,
  externalWrite: false,
  externalApiWrite: false,
  runtimeStarted: false,
  actualQueueMutation: false,
  fileWrite: false,
  humanGateQueueDocModified: false,
  productionReady: false,
  execution: "disabled",
  rawValuesReported: false,
  redacted: true
};

const FORBIDDEN_TARGET_PATTERNS = [
  /^https?:\/\//i,
  /discord\.com\/api\/webhooks/i,
  /\bBearer\s+/i,
  /\bsk-[A-Za-z0-9]/,
  /^\d{10,}$/,
  /\bchannel_id:\s*\d+/i,
  /[A-Za-z]:\\Users\\/
];

const DEFAULT_TARGET_LABEL = "#human-gate-review";

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
  if (messageMarkdown.length > 8000) {
    return "messageMarkdown exceeds dry-run preview limit";
  }
  return undefined;
}

export function createDiscordSendExecutorIntentFromFinalReviewBundle(input: {
  finalReviewBundle: FinalOperatorReviewBundle;
  targetLabel: string;
  humanGoReference: string;
  redacted: true;
}): DiscordSendExecutorIntent {
  return {
    surface: "discord-send-executor-intent",
    source: "final-operator-review-bundle",
    messageMarkdown: input.finalReviewBundle.discordDigest.markdown,
    targetLabel: input.targetLabel.trim(),
    sendCountLimit: 1,
    transportMode: "dry_run_only",
    humanGoReference: input.humanGoReference.trim(),
    redacted: true
  };
}

export function createDiscordSendExecutorIntentFromDigest(input: {
  discordDigest: OperatorHandoffDiscordDigest;
  targetLabel: string;
  humanGoReference: string;
  redacted: true;
}): DiscordSendExecutorIntent {
  return {
    surface: "discord-send-executor-intent",
    source: "operator-handoff-discord-digest",
    messageMarkdown: input.discordDigest.markdown,
    targetLabel: input.targetLabel.trim(),
    sendCountLimit: 1,
    transportMode: "mock",
    humanGoReference: input.humanGoReference.trim(),
    redacted: true
  };
}

function resolveDryRunStatus(
  input: DiscordSendExecutorDryRunInput,
  validationErrors: string[]
): { status: DiscordSendExecutorDryRunStatus; wouldSend: boolean; wouldSendCount: 0 | 1 } {
  if (validationErrors.length > 0) {
    return { status: "BLOCKED", wouldSend: false, wouldSendCount: 0 };
  }

  if (input.preflightStatus === "BLOCKED") {
    return { status: "BLOCKED", wouldSend: false, wouldSendCount: 0 };
  }

  if (input.preflightStatus === "HOLD") {
    return { status: "HOLD", wouldSend: false, wouldSendCount: 0 };
  }

  return { status: "DRY_RUN_READY", wouldSend: true, wouldSendCount: 1 };
}

function buildEvidenceId(intent: DiscordSendExecutorIntent, queueEntryId?: string): string {
  const slug = intent.source.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  const queueSuffix = queueEntryId ? `:${queueEntryId}` : "";
  return `discord-send-dry-run:${slug}${queueSuffix}`;
}

export function createDiscordSendExecutorDryRun(
  input: DiscordSendExecutorDryRunInput
): DiscordSendExecutorDryRunResult {
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

  const validationErrors = [...reasons];

  if (input.preflightStatus === "READY_CANDIDATE") {
    reasons.push("Preflight READY_CANDIDATE — dry-run only, not actual send approval");
  }

  const { status, wouldSend, wouldSendCount } = resolveDryRunStatus(input, validationErrors);

  const messagePreview =
    intent.messageMarkdown.length > 1200
      ? `${intent.messageMarkdown.slice(0, 1200)}\n\n(truncated for dry-run preview)`
      : intent.messageMarkdown;

  const evidenceId = buildEvidenceId(intent, input.queueEntryId);

  return {
    surface: "discord-send-executor-dry-run-result",
    dryRunOnly: true,
    executorDryRunOnly: true,
    mockTransportOnly: true,
    reviewOnly: true,
    draftOnly: true,
    status,
    wouldSend,
    wouldSendCount,
    messagePreview,
    targetLabel: intent.targetLabel,
    evidence: {
      evidenceId,
      source: intent.source,
      queueEntryId: input.queueEntryId,
      sendCountLimit: 1,
      actualSendCount: 0,
      humanGoReference: intent.humanGoReference,
      result: status,
      redacted: true
    },
    reasons,
    safety: { ...SAFETY_BLOCK }
  };
}

export function renderDiscordSendExecutorDryRunEvidence(
  result: DiscordSendExecutorDryRunResult
): string {
  const queueLine = result.evidence.queueEntryId
    ? `- queueEntryId: ${result.evidence.queueEntryId}`
    : "- queueEntryId: (not recorded)";

  return [
    "# Discord Send Executor Dry-run Evidence",
    "",
    "## Summary",
    `- evidenceId: ${result.evidence.evidenceId}`,
    `- result: ${result.status}`,
    `- wouldSend: ${result.wouldSend}`,
    `- wouldSendCount: ${result.wouldSendCount}`,
    `- targetLabel: ${result.targetLabel}`,
    queueLine,
    `- humanGoReference: ${result.evidence.humanGoReference}`,
    "",
    "## Message Preview",
    result.messagePreview,
    "",
    "## Reasons",
    ...(result.reasons.length > 0 ? result.reasons.map((item) => `- ${item}`) : ["- (none)"]),
    "",
    "## Safety Boundary",
    "- actualDiscordSend: false",
    "- sendReady: false",
    "- maySendNow: false",
    "- webhookUsed: false",
    "- botStarted: false",
    "- tokenRead: false",
    "- networkCall: false",
    "- actualSendCount: 0",
    "- sendCountLimit: 1",
    "- productionReady: false",
    "- execution: disabled",
    "- DRY_RUN_READY is not actual send approval"
  ].join("\n");
}

export function executeDiscordSendMockTransport(
  dryRun: DiscordSendExecutorDryRunResult
): DiscordSendMockTransportResult {
  const accepted = dryRun.status === "DRY_RUN_READY" && dryRun.wouldSend;
  const simulatedSendCount: 0 | 1 = accepted ? 1 : 0;

  const evidenceMarkdown = [
    "# Discord Send Mock Transport Result",
    "",
    `- acceptedByMockTransport: ${accepted}`,
    `- actualSendCount: 0`,
    `- simulatedSendCount: ${simulatedSendCount}`,
    `- targetLabel: ${dryRun.targetLabel}`,
    `- evidenceId: ${dryRun.evidence.evidenceId}`,
    "",
    "## Safety",
    "- mockOnly: true",
    "- actualDiscordSend: false",
    "- webhookUsed: false",
    "- botStarted: false",
    "- tokenRead: false",
    "- networkCall: false"
  ].join("\n");

  return {
    surface: "discord-send-mock-transport-result",
    mockOnly: true,
    acceptedByMockTransport: accepted,
    actualSendCount: 0,
    simulatedSendCount,
    evidenceMarkdown,
    safety: {
      mockOnly: true,
      actualDiscordSend: false,
      webhookUsed: false,
      botStarted: false,
      tokenRead: false,
      networkCall: false,
      externalWrite: false,
      productionReady: false,
      execution: "disabled",
      redacted: true
    }
  };
}

export { DEFAULT_TARGET_LABEL };
