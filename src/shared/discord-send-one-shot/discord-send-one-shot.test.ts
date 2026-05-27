import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { createPassOperatorHandoffAssemblyFixture } from "../operator-handoff-fixtures/operator-handoff-fixtures";
import { createOperatorHandoffMarkdownSnapshot } from "../operator-handoff-markdown-snapshot/operator-handoff-markdown-snapshot";
import { createOperatorHandoffDailyQueuePreview } from "../operator-handoff-daily-queue-preview/operator-handoff-daily-queue-preview";
import { createOperatorHandoffDiscordDigest } from "../operator-handoff-discord-digest/operator-handoff-discord-digest";
import { createOperatorHandoffSnapshotIndex } from "../operator-handoff-snapshot-index/operator-handoff-snapshot-index";
import { createFinalOperatorReviewBundle } from "../final-operator-review-bundle/final-operator-review-bundle";
import {
  DEFAULT_TARGET_LABEL,
  createDiscordSendExecutorDryRun,
  createDiscordSendExecutorIntentFromFinalReviewBundle
} from "../discord-send-executor-dry-run/discord-send-executor-dry-run";
import {
  DEFAULT_ONE_SHOT_TARGET_LABEL,
  ONE_SHOT_CONTENT_HARD_MAX,
  buildDiscordOneShotSendMessageContent,
  createDiscordOneShotSendIntentFromDryRun,
  createDiscordOneShotSendPreflight,
  createDiscordOneShotSendResultFromApiOutcome,
  renderDiscordOneShotSendEvidence
} from "./discord-send-one-shot";

const __dirname = dirname(fileURLToPath(import.meta.url));
const HUMAN_GO = "Rally 4 one-shot Discord send validation";
const QUEUE_ENTRY_ID = "queue-operator-review-mvp-finalize-rally-001";

function buildPipeline() {
  const assembly = createPassOperatorHandoffAssemblyFixture();
  const snapshot = createOperatorHandoffMarkdownSnapshot({
    surface: "operator-handoff-markdown-snapshot-input",
    assembly,
    redacted: true
  });
  const snapshotIndex = createOperatorHandoffSnapshotIndex({
    surface: "operator-handoff-snapshot-index-input",
    snapshots: [snapshot],
    redacted: true
  });
  const dailyQueuePreview = createOperatorHandoffDailyQueuePreview({
    surface: "operator-handoff-daily-queue-preview-input",
    snapshotIndex,
    dateLabel: "2026-05-26",
    redacted: true
  });
  const discordDigest = createOperatorHandoffDiscordDigest({
    surface: "operator-handoff-discord-digest-input",
    dailyQueuePreview,
    redacted: true
  });
  const bundle = createFinalOperatorReviewBundle({
    surface: "final-operator-review-bundle-input",
    snapshotIndex,
    dailyQueuePreview,
    discordDigest,
    bundleId: "final-operator-review:2026-05-26:READY_FOR_HUMAN_REVIEW",
    generatedAtLabel: "2026-05-26",
    redacted: true
  });

  return { bundle, discordDigest };
}

function buildDryRunReady() {
  const { bundle } = buildPipeline();
  const intent = createDiscordSendExecutorIntentFromFinalReviewBundle({
    finalReviewBundle: bundle,
    targetLabel: DEFAULT_TARGET_LABEL,
    humanGoReference: HUMAN_GO,
    redacted: true
  });

  return createDiscordSendExecutorDryRun({
    surface: "discord-send-executor-dry-run-input",
    intent,
    preflightStatus: "READY_CANDIDATE",
    queueEntryId: QUEUE_ENTRY_ID,
    redacted: true
  });
}

function buildOneShotIntent(dryRun = buildDryRunReady()) {
  const { discordDigest } = buildPipeline();
  const messageMarkdown = buildDiscordOneShotSendMessageContent({
    digestMarkdown: discordDigest.markdown,
    humanGoReference: HUMAN_GO,
    redacted: true
  });

  return createDiscordOneShotSendIntentFromDryRun({
    dryRunResult: dryRun,
    messageMarkdown,
    targetLabel: DEFAULT_ONE_SHOT_TARGET_LABEL,
    humanGoReference: HUMAN_GO,
    redacted: true
  });
}

describe("discord one shot send", () => {
  it("does not import Node fs in implementation module", () => {
    const source = readFileSync(join(__dirname, "discord-send-one-shot.ts"), "utf8");

    expect(source).not.toMatch(/from\s+["']node:fs["']/);
    expect(source).not.toMatch(/from\s+["']fs["']/);
  });

  it("builds rally message within Discord content limits", () => {
    const { discordDigest } = buildPipeline();
    const content = buildDiscordOneShotSendMessageContent({
      digestMarkdown: discordDigest.markdown,
      humanGoReference: HUMAN_GO,
      redacted: true
    });

    expect(content.length).toBeLessThanOrEqual(ONE_SHOT_CONTENT_HARD_MAX);
    expect(content).toContain("Rally 4 One-shot Send Validation");
    expect(content).toContain("productionReady: false");
  });

  it("creates READY_TO_SEND_ONCE preflight when credentials present", () => {
    const intent = buildOneShotIntent();
    const preflight = createDiscordOneShotSendPreflight({
      surface: "discord-one-shot-send-preflight-input",
      intent,
      dryRunStatus: "DRY_RUN_READY",
      queueEntryId: QUEUE_ENTRY_ID,
      localCredentialPresence: {
        botTokenPresent: true,
        channelIdPresent: true,
        targetLabelPresent: true
      },
      redacted: true
    });

    expect(preflight.status).toBe("READY_TO_SEND_ONCE");
    expect(preflight.maySendExactlyOnce).toBe(true);
    expect(preflight.sendCountLimit).toBe(1);
  });

  it("creates HOLD preflight when credentials are missing", () => {
    const intent = buildOneShotIntent();
    const preflight = createDiscordOneShotSendPreflight({
      surface: "discord-one-shot-send-preflight-input",
      intent,
      dryRunStatus: "DRY_RUN_READY",
      localCredentialPresence: {
        botTokenPresent: false,
        channelIdPresent: false,
        targetLabelPresent: false
      },
      redacted: true
    });

    expect(preflight.status).toBe("HOLD");
    expect(preflight.maySendExactlyOnce).toBe(false);
    expect(preflight.safety.actualSendCountBeforeExecution).toBe(0);
  });

  it("blocks invalid target labels", () => {
    const dryRun = buildDryRunReady();
    const intent = createDiscordOneShotSendIntentFromDryRun({
      dryRunResult: dryRun,
      messageMarkdown: "safe message",
      targetLabel: "https://discord.com/api/webhooks/example",
      humanGoReference: HUMAN_GO,
      redacted: true
    });
    const preflight = createDiscordOneShotSendPreflight({
      surface: "discord-one-shot-send-preflight-input",
      intent,
      dryRunStatus: "DRY_RUN_READY",
      localCredentialPresence: {
        botTokenPresent: true,
        channelIdPresent: true,
        targetLabelPresent: true
      },
      redacted: true
    });

    expect(preflight.status).toBe("BLOCKED");
    expect(preflight.maySendExactlyOnce).toBe(false);
  });

  it("creates SENT_ONCE result with redacted message reference", () => {
    const intent = buildOneShotIntent();
    const preflight = createDiscordOneShotSendPreflight({
      surface: "discord-one-shot-send-preflight-input",
      intent,
      dryRunStatus: "DRY_RUN_READY",
      localCredentialPresence: {
        botTokenPresent: true,
        channelIdPresent: true,
        targetLabelPresent: true
      },
      redacted: true
    });
    const result = createDiscordOneShotSendResultFromApiOutcome({
      preflight,
      apiOutcome: "SENT",
      messageReferenceRedacted: "REDACTED_MESSAGE_ID_PRESENT",
      evidenceId: "discord-one-shot:operator-review",
      redacted: true
    });

    expect(result.status).toBe("SENT_ONCE");
    expect(result.actualSendCount).toBe(1);
    expect(result.gateRestoredToHold).toBe(true);
    expect(result.messageReferenceRedacted).toBe("REDACTED_MESSAGE_ID_PRESENT");
    expect(result.safety.tokenPrinted).toBe(false);
  });

  it("renders one-shot evidence markdown", () => {
    const intent = buildOneShotIntent();
    const preflight = createDiscordOneShotSendPreflight({
      surface: "discord-one-shot-send-preflight-input",
      intent,
      dryRunStatus: "DRY_RUN_READY",
      localCredentialPresence: {
        botTokenPresent: true,
        channelIdPresent: true,
        targetLabelPresent: true
      },
      redacted: true
    });
    const result = createDiscordOneShotSendResultFromApiOutcome({
      preflight,
      apiOutcome: "SENT",
      messageReferenceRedacted: "REDACTED_MESSAGE_ID_PRESENT",
      evidenceId: "discord-one-shot:operator-review",
      redacted: true
    });
    const evidence = renderDiscordOneShotSendEvidence(result);

    expect(evidence).toContain("actualSendCount: 1");
    expect(evidence).toContain("gateRestoredToHold: true");
  });

  it("writes tool payload when SHIKISHIMA_WRITE_ONE_SHOT_PAYLOAD_TO is set", () => {
    const outputPath = process.env.SHIKISHIMA_WRITE_ONE_SHOT_PAYLOAD_TO;
    if (!outputPath) {
      expect(true).toBe(true);
      return;
    }

    const { discordDigest } = buildPipeline();
    const messageMarkdown = buildDiscordOneShotSendMessageContent({
      digestMarkdown: discordDigest.markdown,
      humanGoReference: HUMAN_GO,
      redacted: true
    });

    writeFileSync(
      outputPath,
      JSON.stringify({
        messageMarkdown,
        targetLabel: DEFAULT_ONE_SHOT_TARGET_LABEL,
        humanGoReference: HUMAN_GO,
        dryRunStatus: "DRY_RUN_READY",
        queueEntryId: QUEUE_ENTRY_ID,
        evidenceId: "discord-one-shot:operator-review"
      }),
      "utf8"
    );

    expect(messageMarkdown.length).toBeGreaterThan(0);
  });
});
