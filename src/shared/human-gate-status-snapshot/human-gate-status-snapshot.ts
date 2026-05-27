import type {
  DiscordSendReadinessDigest,
  DiscordSendReadinessDigestStatus
} from "../discord-send-readiness-digest/discord-send-readiness-digest-types";
import type {
  HumanGateStatusSnapshot,
  HumanGateStatusSnapshotCard,
  HumanGateStatusSnapshotInput,
  HumanGateStatusSnapshotSection,
  HumanGateStatusSnapshotStatus
} from "./human-gate-status-snapshot-types";

const FOOTER_NOTICE =
  "Review-only operator status snapshot. Ledger is source of truth. No Discord send. No queue mutation. No file write. Human GO required.";

const SAFETY_BLOCK: HumanGateStatusSnapshot["safety"] = {
  snapshotOnly: true,
  displayOnly: true,
  sendReady: false,
  maySendNow: false,
  mayMutateQueueNow: false,
  fileWriteReady: false,
  actualDiscordSend: false,
  actualQueueMutation: false,
  humanGateQueueDocModified: false,
  webhookUsed: false,
  botStarted: false,
  tokenRead: false,
  networkCall: false,
  externalWrite: false,
  runtimeStarted: false,
  obsidianActualWrite: false,
  productionReady: false,
  execution: "disabled",
  rawValuesReported: false,
  redacted: true
};

function mapDigestStatusToSnapshotStatus(
  digestStatus: DiscordSendReadinessDigestStatus
): HumanGateStatusSnapshotStatus {
  if (digestStatus === "BLOCKED") return "BLOCKED";
  if (digestStatus === "REVIEW_READY_CANDIDATE") return "REVIEW_READY_CANDIDATE";
  return "HOLD";
}

function buildSummary(
  snapshotStatus: HumanGateStatusSnapshotStatus,
  digest: DiscordSendReadinessDigest
): string {
  if (snapshotStatus === "BLOCKED") {
    return "Operator status: BLOCKED. Resolve preflight blockers before any external effect.";
  }
  if (snapshotStatus === "REVIEW_READY_CANDIDATE") {
    return "Operator status: REVIEW_READY_CANDIDATE. Safe to show human reviewer on Discord — not send, mutation, or runtime approval.";
  }
  return `Operator status: HOLD. ${digest.summary}`;
}

function buildCards(digest: DiscordSendReadinessDigest): HumanGateStatusSnapshotCard[] {
  return [
    ...digest.readinessRows.map((row) => ({
      label: row.label,
      status: row.status,
      description:
        row.reasons.length > 0 ? row.reasons.join("; ") : "No additional reasons listed."
    })),
    {
      label: "Discord display path",
      status:
        digest.status === "REVIEW_READY_CANDIDATE"
          ? "READY_CANDIDATE"
          : digest.status === "BLOCKED"
            ? "BLOCKED"
            : "HOLD",
      description: "Human Gate message/digest render contracts (preview only; no send)."
    },
    {
      label: "Queue display path",
      status:
        digest.source.queuePreflightStatus === "READY_CANDIDATE"
          ? "READY_CANDIDATE"
          : digest.source.queuePreflightStatus === "BLOCKED"
            ? "BLOCKED"
            : "HOLD",
      description: "Queue Markdown render + mutation preflight (preview only; no file write)."
    },
    {
      label: "Safety boundary",
      status: "HOLD",
      description:
        "productionReady: false | execution: disabled | Discord send HOLD | queue append HOLD"
    }
  ];
}

function buildSections(
  input: HumanGateStatusSnapshotInput,
  digest: DiscordSendReadinessDigest
): HumanGateStatusSnapshotSection[] {
  return [
    {
      heading: "Source of truth",
      lines: [
        `sourceOfTruth: ${input.sourceOfTruth}`,
        `primaryDisplaySurface: ${input.primaryDisplaySurface}`,
        `fallbackDisplaySurface: ${input.fallbackDisplaySurface}`,
        "Ledger remains authoritative for goal status and Human GO records."
      ]
    },
    {
      heading: "Readiness digest",
      lines: [
        `digestStatus: ${digest.status}`,
        `discordPreflight: ${digest.source.discordPreflightStatus}`,
        `queuePreflight: ${digest.source.queuePreflightStatus}`,
        digest.summary
      ]
    },
    {
      heading: "Display surfaces",
      lines: [
        "Discord: primary operator viewing surface (preview/digest only)",
        "Control Center: fallback/debug/read-only local surface",
        "iPhone Private Console: mobile read-only future surface"
      ]
    },
    {
      heading: "Safety",
      lines: [
        "review-only",
        "no Discord send",
        "no queue mutation",
        "no file write",
        "no runtime start",
        "productionReady: false",
        "execution: disabled"
      ]
    }
  ];
}

function buildNextHumanActionLabel(
  snapshotStatus: HumanGateStatusSnapshotStatus,
  digest: DiscordSendReadinessDigest
): string {
  if (snapshotStatus === "BLOCKED") {
    return "Do not proceed; resolve BLOCKED preflight items before requesting Human GO.";
  }
  if (snapshotStatus === "REVIEW_READY_CANDIDATE") {
    return digest.nextHumanActionLabel;
  }
  return "Complete missing preflight evidence; remain on HOLD until explicit Human GO.";
}

export function createHumanGateStatusSnapshot(
  input: HumanGateStatusSnapshotInput
): HumanGateStatusSnapshot {
  const digest = input.readinessDigest;
  const status = mapDigestStatusToSnapshotStatus(digest.status);

  return {
    surface: "human-gate-status-snapshot",
    snapshotOnly: true,
    status,
    title: input.title ?? "Human Gate Operator Status Snapshot (review-only)",
    summary: buildSummary(status, digest),
    sourceOfTruth: input.sourceOfTruth,
    primaryDisplaySurface: input.primaryDisplaySurface,
    fallbackDisplaySurface: input.fallbackDisplaySurface,
    cards: buildCards(digest),
    sections: buildSections(input, digest),
    nextHumanActionLabel: buildNextHumanActionLabel(status, digest),
    footerNotice: FOOTER_NOTICE,
    source: {
      readinessDigestStatus: digest.status,
      humanGoReference: input.humanGoReference ?? digest.source.humanGoReference
    },
    safety: { ...SAFETY_BLOCK }
  };
}

export function renderHumanGateStatusSnapshotPreview(
  snapshot: HumanGateStatusSnapshot
): string {
  const cardLines = snapshot.cards.map(
    (card) => `- ${card.label}: ${card.status} — ${card.description}`
  );

  const sectionBlocks = snapshot.sections.map((section) => {
    const lines = section.lines.map((line) => `- ${line}`).join("\n");
    return `### ${section.heading}\n${lines}`;
  });

  return [
    "<!-- review-only / snapshot-only / no Discord send / no queue mutation -->",
    `**${snapshot.title}**`,
    `Snapshot status: ${snapshot.status}`,
    "",
    snapshot.summary,
    "",
    `**Source of truth:** ${snapshot.sourceOfTruth}`,
    `**Primary display:** ${snapshot.primaryDisplaySurface}`,
    `**Fallback display:** ${snapshot.fallbackDisplaySurface}`,
    "",
    "**Status cards:**",
    ...cardLines,
    "",
    ...sectionBlocks,
    "",
    `**Next human action:** ${snapshot.nextHumanActionLabel}`,
    "",
    snapshot.footerNotice,
    "",
    "REVIEW_READY_CANDIDATE is not Discord send, queue mutation, or runtime approval."
  ].join("\n");
}

export function createHumanGateStatusSnapshotPreview(
  input: HumanGateStatusSnapshotInput
): string {
  return renderHumanGateStatusSnapshotPreview(createHumanGateStatusSnapshot(input));
}
