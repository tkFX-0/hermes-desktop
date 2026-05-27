import { createDiscordSendReadinessDigest } from "../discord-send-readiness-digest/discord-send-readiness-digest";
import type { DiscordSendReadinessDigestStatus } from "../discord-send-readiness-digest/discord-send-readiness-digest-types";
import type { DiscordSendPreflightResult } from "../discord-send-preflight/discord-send-preflight-types";
import type { HumanGateReport } from "../human-gate-report/human-gate-report-types";
import type { HumanGateQueueMutationPreflightResult } from "../human-gate-queue-mutation-preflight/human-gate-queue-mutation-preflight-types";
import { createHumanGateStatusSnapshot } from "../human-gate-status-snapshot/human-gate-status-snapshot";
import type {
  HumanGateReportStatusSnapshotAdapterInput,
  HumanGateReportStatusSnapshotAdapterResult,
  HumanGateReportStatusSnapshotAdapterSafety,
  HumanGateReportStatusSnapshotAdapterStatus
} from "./human-gate-report-status-snapshot-adapter-types";

const ADAPTER_CAVEAT =
  "Snapshot derived from HumanGateReport; Discord/queue preflight rows are synthesized for operator display — not live preflight evaluation.";

const SAFETY_BLOCK: HumanGateReportStatusSnapshotAdapterSafety = {
  adapterOnly: true,
  reviewOnly: true,
  draftOnly: true,
  displayOnly: true,
  sendReady: false,
  maySendNow: false,
  actualDiscordSend: false,
  executorImplemented: false,
  webhookUsed: false,
  botStarted: false,
  tokenRead: false,
  networkCall: false,
  externalWrite: false,
  runtimeStarted: false,
  actualQueueMutation: false,
  fileWriteReady: false,
  humanGateQueueDocModified: false,
  productionReady: false,
  execution: "disabled",
  rawValuesReported: false,
  redacted: true
};

type PreflightRowStatus = DiscordSendPreflightResult["status"];

function mapReportToDigestStatus(report: HumanGateReport): DiscordSendReadinessDigestStatus {
  if (report.status === "REJECTED" || report.sourceDecision === "REJECT") {
    return "BLOCKED";
  }
  if (report.status === "HOLD") {
    return "HOLD";
  }
  if (report.status === "READY_FOR_HUMAN_REVIEW" || report.status === "PASS_PREVIEW_ONLY") {
    return "REVIEW_READY_CANDIDATE";
  }
  return "HOLD";
}

function mapDigestStatusToAdapterStatus(
  digestStatus: DiscordSendReadinessDigestStatus
): HumanGateReportStatusSnapshotAdapterStatus {
  if (digestStatus === "BLOCKED") return "BLOCKED";
  if (digestStatus === "REVIEW_READY_CANDIDATE") return "REVIEW_READY_CANDIDATE";
  return "HOLD";
}

function buildCaveats(report: HumanGateReport): string[] {
  const caveats = [ADAPTER_CAVEAT];

  if (report.sourceDecision === "REJECT" && report.status !== "REJECTED") {
    caveats.push("sourceDecision REJECT mapped to BLOCKED snapshot.");
  }
  if (report.status === "PASS_PREVIEW_ONLY") {
    caveats.push("PASS_PREVIEW_ONLY mapped to REVIEW_READY_CANDIDATE for operator review display only.");
  }
  if (!report.canHumanApproveProceed) {
    caveats.push("canHumanApproveProceed is false; operator must not infer automatic approval.");
  }

  return caveats;
}

function buildSyntheticPreflightResult(
  report: HumanGateReport,
  rowStatus: PreflightRowStatus,
  label: string
): DiscordSendPreflightResult {
  const reasons = [
    `derived from HumanGateReport (${report.status})`,
    `gateId: ${report.gateId}`,
    ...report.reasons.slice(0, 3).map((reason) => `report: ${reason}`)
  ];

  const missingRequirements =
    rowStatus === "READY_CANDIDATE"
      ? []
      : [`${label}: complete goal-contract preflight before external effects`];

  return {
    surface: "discord-send-preflight-result",
    status: rowStatus,
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

function buildSyntheticQueuePreflightResult(
  report: HumanGateReport,
  rowStatus: PreflightRowStatus
): HumanGateQueueMutationPreflightResult {
  const reasons = [
    `derived from HumanGateReport (${report.status})`,
    `requestedAction: ${report.requestedAction}`,
    ...report.requiredHumanGates.slice(0, 2).map((gate) => `gate: ${gate}`)
  ];

  const missingRequirements =
    rowStatus === "READY_CANDIDATE"
      ? []
      : ["queue mutation preflight not evaluated from report alone"];

  return {
    surface: "human-gate-queue-mutation-preflight-result",
    status: rowStatus,
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

function digestStatusToRowStatus(
  digestStatus: DiscordSendReadinessDigestStatus
): PreflightRowStatus {
  if (digestStatus === "BLOCKED") return "BLOCKED";
  if (digestStatus === "REVIEW_READY_CANDIDATE") return "READY_CANDIDATE";
  return "HOLD";
}

export function createHumanGateStatusSnapshotFromHumanGateReport(
  input: HumanGateReportStatusSnapshotAdapterInput
): HumanGateReportStatusSnapshotAdapterResult {
  const report = input.humanGateReport;
  const sourceOfTruth = input.sourceOfTruth ?? "ledger";
  const primaryDisplaySurface = input.primaryDisplaySurface ?? "discord";
  const fallbackDisplaySurface = input.fallbackDisplaySurface ?? "control-center";
  const humanGoReference = input.humanGoReference;

  const digestStatus = mapReportToDigestStatus(report);
  const rowStatus = digestStatusToRowStatus(digestStatus);

  const discordPreflight = buildSyntheticPreflightResult(
    report,
    rowStatus,
    "Discord send preflight"
  );
  const queuePreflight = buildSyntheticQueuePreflightResult(report, rowStatus);

  const readinessDigest = createDiscordSendReadinessDigest({
    surface: "discord-send-readiness-digest-input",
    discordSendPreflightResult: discordPreflight,
    queueMutationPreflightResult: queuePreflight,
    title: input.title ?? `Readiness digest — ${report.title}`,
    humanGoReference,
    redacted: true
  });

  const snapshot = createHumanGateStatusSnapshot({
    surface: "human-gate-status-snapshot-input",
    readinessDigest,
    title: input.title ?? `Operator snapshot — ${report.title}`,
    sourceOfTruth,
    primaryDisplaySurface,
    fallbackDisplaySurface,
    humanGoReference,
    redacted: true
  });

  const status = mapDigestStatusToAdapterStatus(readinessDigest.status);
  const caveats = buildCaveats(report);

  return {
    surface: "human-gate-report-status-snapshot-adapter-result",
    adapterOnly: true,
    reviewOnly: true,
    draftOnly: true,
    status,
    snapshot,
    source: {
      humanGateReportStatus: report.status,
      snapshotStatus: snapshot.status,
      sourceOfTruth,
      primaryDisplaySurface,
      fallbackDisplaySurface,
      humanGoReference
    },
    caveats,
    safety: { ...SAFETY_BLOCK }
  };
}

export function renderHumanGateReportStatusSnapshotAdapterPreview(
  result: HumanGateReportStatusSnapshotAdapterResult
): string {
  const caveatLines = result.caveats.map((item) => `- ${item}`);

  return [
    "<!-- adapter-only / review-only / no Discord send -->",
    "**Human Gate Report → Status Snapshot Adapter**",
    `Adapter status: ${result.status}`,
    `HumanGateReport status: ${result.source.humanGateReportStatus}`,
    `Snapshot status: ${result.source.snapshotStatus}`,
    "",
    "**Caveats:**",
    ...caveatLines,
    "",
    `sourceOfTruth: ${result.source.sourceOfTruth}`,
    `primaryDisplaySurface: ${result.source.primaryDisplaySurface}`,
    `fallbackDisplaySurface: ${result.source.fallbackDisplaySurface}`,
    "",
    result.snapshot.summary,
    "",
    "REVIEW_READY_CANDIDATE is not Discord send approval.",
    "Adapter output is review-only."
  ].join("\n");
}
