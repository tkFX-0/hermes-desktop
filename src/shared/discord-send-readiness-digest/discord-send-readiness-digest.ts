import type { DiscordSendPreflightResult } from "../discord-send-preflight/discord-send-preflight-types";
import type { HumanGateQueueMutationPreflightResult } from "../human-gate-queue-mutation-preflight/human-gate-queue-mutation-preflight-types";
import type {
  DiscordSendReadinessDigest,
  DiscordSendReadinessDigestInput,
  DiscordSendReadinessDigestReadinessRow,
  DiscordSendReadinessDigestSection,
  DiscordSendReadinessDigestStatus,
  PreflightRowStatus
} from "./discord-send-readiness-digest-types";

const FOOTER_NOTICE =
  "Review-only readiness digest. No Discord send. No queue mutation. No file write. Human GO required for any effect.";

const SAFETY_BLOCK: DiscordSendReadinessDigest["safety"] = {
  digestOnly: true,
  sendReady: false,
  maySendNow: false,
  mayMutateQueueNow: false,
  fileWriteReady: false,
  actualDiscordSend: false,
  actualQueueMutation: false,
  webhookUsed: false,
  botStarted: false,
  tokenRead: false,
  networkCall: false,
  externalWrite: false,
  runtimeStarted: false,
  productionReady: false,
  execution: "disabled",
  rawValuesReported: false,
  redacted: true
};

function mapPreflightStatus(
  result: DiscordSendPreflightResult | HumanGateQueueMutationPreflightResult
): PreflightRowStatus {
  return result.status;
}

function buildReadinessRow(
  label: string,
  result: DiscordSendPreflightResult | HumanGateQueueMutationPreflightResult
): DiscordSendReadinessDigestReadinessRow {
  const reasons = [...result.reasons];
  if (result.missingRequirements.length > 0) {
    reasons.push(
      ...result.missingRequirements.map((item) => `missing: ${item}`)
    );
  }

  return {
    label,
    status: mapPreflightStatus(result),
    mayProceedNow: false,
    reasons
  };
}

function resolveDigestStatus(
  discordStatus: PreflightRowStatus,
  queueStatus: PreflightRowStatus
): DiscordSendReadinessDigestStatus {
  if (discordStatus === "BLOCKED" || queueStatus === "BLOCKED") {
    return "BLOCKED";
  }
  if (discordStatus === "READY_CANDIDATE" && queueStatus === "READY_CANDIDATE") {
    return "REVIEW_READY_CANDIDATE";
  }
  return "HOLD";
}

function buildSummary(digestStatus: DiscordSendReadinessDigestStatus): string {
  if (digestStatus === "BLOCKED") {
    return "One or more preflight gates are BLOCKED. Do not proceed until blockers are resolved.";
  }
  if (digestStatus === "REVIEW_READY_CANDIDATE") {
    return "Both Discord send and queue mutation preflights are READY_CANDIDATE for human review only — not execution approval.";
  }
  return "Preflight requirements are not fully satisfied. Remain on HOLD until human GO and evidence are complete.";
}

function buildNextHumanActionLabel(status: DiscordSendReadinessDigestStatus): string {
  if (status === "BLOCKED") {
    return "Resolve BLOCKED preflight reasons; do not request send or queue append.";
  }
  if (status === "REVIEW_READY_CANDIDATE") {
    return "Review both preflight rows and issue separate explicit Human GO for send and/or queue append — no automated approval.";
  }
  return "Complete missing preflight requirements; wait for explicit human GO.";
}

function buildSections(
  discord: DiscordSendPreflightResult,
  queue: HumanGateQueueMutationPreflightResult
): DiscordSendReadinessDigestSection[] {
  return [
    {
      heading: "Discord send preflight",
      lines: [
        `status: ${discord.status}`,
        `sendReady: false`,
        `maySendNow: false`,
        ...discord.reasons.map((reason) => `reason: ${reason}`),
        ...discord.missingRequirements.map((item) => `missing: ${item}`)
      ]
    },
    {
      heading: "Human Gate queue mutation preflight",
      lines: [
        `status: ${queue.status}`,
        `fileWriteReady: false`,
        `mayMutateNow: false`,
        ...queue.reasons.map((reason) => `reason: ${reason}`),
        ...queue.missingRequirements.map((item) => `missing: ${item}`)
      ]
    },
    {
      heading: "Safety",
      lines: [
        "digestOnly: true",
        "no Discord send",
        "no queue mutation",
        "no file write",
        "productionReady: false",
        "execution: disabled"
      ]
    }
  ];
}

export function createDiscordSendReadinessDigest(
  input: DiscordSendReadinessDigestInput
): DiscordSendReadinessDigest {
  const discord = input.discordSendPreflightResult;
  const queue = input.queueMutationPreflightResult;
  const readinessRows: DiscordSendReadinessDigestReadinessRow[] = [
    buildReadinessRow("Discord send preflight", discord),
    buildReadinessRow("Human Gate queue mutation preflight", queue)
  ];
  const status = resolveDigestStatus(
    readinessRows[0].status,
    readinessRows[1].status
  );

  return {
    surface: "discord-send-readiness-digest",
    digestOnly: true,
    status,
    title: input.title ?? "Discord Send Readiness Digest (review-only)",
    summary: buildSummary(status),
    sections: buildSections(discord, queue),
    readinessRows,
    nextHumanActionLabel: buildNextHumanActionLabel(status),
    footerNotice: FOOTER_NOTICE,
    source: {
      discordPreflightStatus: discord.status,
      queuePreflightStatus: queue.status,
      humanGoReference: input.humanGoReference
    },
    safety: { ...SAFETY_BLOCK }
  };
}

export function renderDiscordSendReadinessDigestPreview(
  digest: DiscordSendReadinessDigest
): string {
  const rowLines = digest.readinessRows.map(
    (row) =>
      `- ${row.label}: ${row.status} (mayProceedNow: false)${
        row.reasons.length > 0 ? `\n  - ${row.reasons.join("\n  - ")}` : ""
      }`
  );

  const sectionBlocks = digest.sections.map((section) => {
    const lines = section.lines.map((line) => `- ${line}`).join("\n");
    return `### ${section.heading}\n${lines}`;
  });

  return [
    "<!-- review-only / digest-only / no Discord send / no queue mutation -->",
    `**${digest.title}**`,
    `Digest status: ${digest.status}`,
    "",
    digest.summary,
    "",
    "**Readiness rows:**",
    ...rowLines,
    "",
    ...sectionBlocks,
    "",
    `**Next human action:** ${digest.nextHumanActionLabel}`,
    "",
    digest.footerNotice,
    "",
    "REVIEW_READY_CANDIDATE is not send or queue mutation approval."
  ].join("\n");
}

export function createDiscordSendReadinessDigestPreview(
  input: DiscordSendReadinessDigestInput
): string {
  return renderDiscordSendReadinessDigestPreview(createDiscordSendReadinessDigest(input));
}
