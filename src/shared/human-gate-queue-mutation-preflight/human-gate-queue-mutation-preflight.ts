import type { HumanGateQueueDisplayTargetItem } from "../human-gate-queue-display-target/human-gate-queue-display-target-types";
import {
  createHumanGateQueueMarkdownRenderModel,
  renderHumanGateQueueMarkdownPreview
} from "../human-gate-queue-markdown-render/human-gate-queue-markdown-render";
import type { HumanGateQueueMarkdownRenderModel } from "../human-gate-queue-markdown-render/human-gate-queue-markdown-render-types";
import type {
  CreateHumanGateQueueMutationPreflightIntentOptions,
  HumanGateQueueMutationPreflightIntent,
  HumanGateQueueMutationPreflightResult,
  HumanGateQueueMutationPreflightStatus
} from "./human-gate-queue-mutation-preflight-types";
import { HUMAN_GATE_QUEUE_TARGET_DOCUMENT } from "./human-gate-queue-mutation-preflight-types";

type ForbiddenMutationFlags = {
  requestedMutationCount: number;
  rewriteRequested: boolean;
  archiveRequested: boolean;
  bulkEditRequested: boolean;
  targetDocument: string;
  rawValuesReported: boolean;
  redacted: boolean;
};

function readForbiddenFlags(intent: HumanGateQueueMutationPreflightIntent): ForbiddenMutationFlags {
  return intent as unknown as ForbiddenMutationFlags;
}

function buildSourceRenderId(model: HumanGateQueueMarkdownRenderModel): string {
  return `queue-markdown:${model.source.gateId}:${model.source.goalId}:${model.source.taskId}`;
}

function baseResult(
  status: HumanGateQueueMutationPreflightStatus,
  reasons: string[],
  missingRequirements: string[]
): HumanGateQueueMutationPreflightResult {
  return {
    surface: "human-gate-queue-mutation-preflight-result",
    status,
    reasons,
    missingRequirements,
    fileWriteReady: false,
    mayMutateNow: false,
    actualQueueMutation: false,
    humanGateQueueDocModified: false,
    fileWritePerformed: false,
    externalWrite: false,
    discordSend: false,
    obsidianActualWrite: false,
    runtimeStarted: false,
    networkCall: false,
    oneShotOnly: true,
    allowedMutationCount: 1,
    actualMutationCount: 0,
    gateRestoredHoldRequired: true,
    productionReady: false,
    execution: "disabled",
    rawValuesReported: false,
    redacted: true
  };
}

export function createHumanGateQueueMutationPreflightIntentFromMarkdownRenderModel(
  model: HumanGateQueueMarkdownRenderModel,
  options: CreateHumanGateQueueMutationPreflightIntentOptions
): HumanGateQueueMutationPreflightIntent {
  return {
    surface: "human-gate-queue-mutation-preflight",
    intentOnly: true,
    sourceRenderId: buildSourceRenderId(model),
    sourcePreviewTitle: model.title,
    sourceGateId: model.source.gateId,
    exactMarkdownToAppend: options.exactMarkdownToAppend,
    targetDocument: HUMAN_GATE_QUEUE_TARGET_DOCUMENT,
    sourcePreviewCommit: options.sourcePreviewCommit,
    humanGoReference: options.humanGoReference,
    allowedMutationCount: 1,
    requestedMutationCount: options.requestedMutationCount ?? 1,
    oneShotOnly: true,
    rewriteRequested: false,
    archiveRequested: false,
    bulkEditRequested: false,
    rawValuesReported: false,
    redacted: true
  };
}

export function createHumanGateQueueMutationPreflightIntentFromDisplayTarget(
  item: HumanGateQueueDisplayTargetItem,
  options: Omit<CreateHumanGateQueueMutationPreflightIntentOptions, "exactMarkdownToAppend"> & {
    exactMarkdownToAppend?: string;
  } = {}
): HumanGateQueueMutationPreflightIntent {
  const model = createHumanGateQueueMarkdownRenderModel(item);
  const exactMarkdownToAppend =
    options.exactMarkdownToAppend ?? renderHumanGateQueueMarkdownPreview(model);

  return createHumanGateQueueMutationPreflightIntentFromMarkdownRenderModel(model, {
    exactMarkdownToAppend,
    sourcePreviewCommit: options.sourcePreviewCommit,
    humanGoReference: options.humanGoReference,
    requestedMutationCount: options.requestedMutationCount
  });
}

export function evaluateHumanGateQueueMutationPreflight(
  intent: HumanGateQueueMutationPreflightIntent
): HumanGateQueueMutationPreflightResult {
  const flags = readForbiddenFlags(intent);
  const blockedReasons: string[] = [];

  if (flags.requestedMutationCount > 1) {
    blockedReasons.push("requestedMutationCount exceeds one-shot limit");
  }
  if (flags.rewriteRequested === true) {
    blockedReasons.push("queue rewrite is NOT_APPROVED");
  }
  if (flags.archiveRequested === true) {
    blockedReasons.push("queue archive requires separate GO");
  }
  if (flags.bulkEditRequested === true) {
    blockedReasons.push("bulk edit is NOT_APPROVED");
  }
  if (flags.targetDocument !== HUMAN_GATE_QUEUE_TARGET_DOCUMENT) {
    blockedReasons.push("targetDocument must be docs/shikishima/HUMAN_GATE_QUEUE.md");
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

  if (!intent.exactMarkdownToAppend.trim()) {
    missingRequirements.push("exactMarkdownToAppend");
  }
  if (!intent.humanGoReference?.trim()) {
    missingRequirements.push("humanGoReference");
  }
  if (!intent.sourcePreviewCommit?.trim()) {
    missingRequirements.push("sourcePreviewCommit");
  }
  if (intent.allowedMutationCount !== 1) {
    missingRequirements.push("allowedMutationCount must be 1");
  }
  if (intent.requestedMutationCount !== 1) {
    missingRequirements.push("requestedMutationCount must be 1");
  }
  if (intent.oneShotOnly !== true) {
    missingRequirements.push("oneShotOnly must be true");
  }

  if (missingRequirements.length > 0) {
    return baseResult(
      "HOLD",
      ["One-shot queue mutation preflight requirements are not satisfied"],
      missingRequirements
    );
  }

  return baseResult(
    "READY_CANDIDATE",
    [
      "Documentation-level one-shot queue append metadata is present",
      "READY_CANDIDATE is not mutation approval; fileWriteReady and mayMutateNow remain false"
    ],
    []
  );
}

export function renderHumanGateQueueMutationPreflightPreview(
  result: HumanGateQueueMutationPreflightResult
): string {
  return [
    "<!-- review-only / preflight-only / no queue mutation -->",
    `**Human Gate Queue Mutation Preflight**`,
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
    "fileWriteReady: false | mayMutateNow: false | humanGateQueueDocModified: false",
    "READY_CANDIDATE does not approve file write or queue append."
  ].join("\n");
}
