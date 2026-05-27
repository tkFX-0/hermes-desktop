import { readFileSync } from "node:fs";
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
  createDiscordSendExecutorIntentFromDigest,
  createDiscordSendExecutorIntentFromFinalReviewBundle,
  executeDiscordSendMockTransport,
  renderDiscordSendExecutorDryRunEvidence
} from "./discord-send-executor-dry-run";
import type { DiscordSendExecutorDryRunInput } from "./discord-send-executor-dry-run-types";

const __dirname = dirname(fileURLToPath(import.meta.url));
const HUMAN_GO = "Discord Send Unlock 1 / executor dry-run validation";
const QUEUE_ENTRY_ID = "queue-operator-review-mvp-finalize-rally-001";

function buildFinalReviewBundle() {
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

  return createFinalOperatorReviewBundle({
    surface: "final-operator-review-bundle-input",
    snapshotIndex,
    dailyQueuePreview,
    discordDigest,
    bundleId: "final-operator-review:2026-05-26:READY_FOR_HUMAN_REVIEW",
    generatedAtLabel: "2026-05-26",
    redacted: true
  });
}

function dryRunInput(
  intent: DiscordSendExecutorDryRunInput["intent"],
  preflightStatus: DiscordSendExecutorDryRunInput["preflightStatus"],
  overrides: Partial<DiscordSendExecutorDryRunInput> = {}
): DiscordSendExecutorDryRunInput {
  return {
    surface: "discord-send-executor-dry-run-input",
    intent,
    preflightStatus,
    queueEntryId: QUEUE_ENTRY_ID,
    redacted: true,
    ...overrides
  };
}

describe("discord send executor dry run", () => {
  it("does not import Node fs in implementation module", () => {
    const source = readFileSync(join(__dirname, "discord-send-executor-dry-run.ts"), "utf8");

    expect(source).not.toMatch(/from\s+["']node:fs["']/);
    expect(source).not.toMatch(/from\s+["']fs["']/);
  });

  it("creates DRY_RUN_READY from final review bundle intent", () => {
    const bundle = buildFinalReviewBundle();
    const intent = createDiscordSendExecutorIntentFromFinalReviewBundle({
      finalReviewBundle: bundle,
      targetLabel: DEFAULT_TARGET_LABEL,
      humanGoReference: HUMAN_GO,
      redacted: true
    });
    const result = createDiscordSendExecutorDryRun(dryRunInput(intent, "READY_CANDIDATE"));

    expect(result.status).toBe("DRY_RUN_READY");
    expect(result.wouldSend).toBe(true);
    expect(result.wouldSendCount).toBe(1);
    expect(result.safety.actualDiscordSend).toBe(false);
    expect(result.safety.tokenRead).toBe(false);
    expect(result.safety.networkCall).toBe(false);
    expect(result.evidence.actualSendCount).toBe(0);
    expect(result.evidence.sendCountLimit).toBe(1);
  });

  it("creates HOLD dry run", () => {
    const bundle = buildFinalReviewBundle();
    const intent = createDiscordSendExecutorIntentFromDigest({
      discordDigest: bundle.discordDigest,
      targetLabel: DEFAULT_TARGET_LABEL,
      humanGoReference: HUMAN_GO,
      redacted: true
    });
    const result = createDiscordSendExecutorDryRun(dryRunInput(intent, "HOLD"));

    expect(result.status).toBe("HOLD");
    expect(result.wouldSend).toBe(false);
    expect(result.wouldSendCount).toBe(0);
  });

  it("blocks invalid target labels", () => {
    const bundle = buildFinalReviewBundle();
    const intent = createDiscordSendExecutorIntentFromFinalReviewBundle({
      finalReviewBundle: bundle,
      targetLabel: "https://discord.com/api/webhooks/example",
      humanGoReference: HUMAN_GO,
      redacted: true
    });
    const result = createDiscordSendExecutorDryRun(dryRunInput(intent, "READY_CANDIDATE"));

    expect(result.status).toBe("BLOCKED");
    expect(result.wouldSend).toBe(false);
  });

  it("blocks BLOCKED preflight", () => {
    const bundle = buildFinalReviewBundle();
    const intent = createDiscordSendExecutorIntentFromFinalReviewBundle({
      finalReviewBundle: bundle,
      targetLabel: DEFAULT_TARGET_LABEL,
      humanGoReference: HUMAN_GO,
      redacted: true
    });
    const result = createDiscordSendExecutorDryRun(dryRunInput(intent, "BLOCKED"));

    expect(result.status).toBe("BLOCKED");
    expect(result.wouldSendCount).toBe(0);
  });

  it("executes mock transport with simulated send count 1 and actual 0", () => {
    const bundle = buildFinalReviewBundle();
    const intent = createDiscordSendExecutorIntentFromFinalReviewBundle({
      finalReviewBundle: bundle,
      targetLabel: DEFAULT_TARGET_LABEL,
      humanGoReference: HUMAN_GO,
      redacted: true
    });
    const dryRun = createDiscordSendExecutorDryRun(dryRunInput(intent, "READY_CANDIDATE"));
    const transport = executeDiscordSendMockTransport(dryRun);

    expect(transport.acceptedByMockTransport).toBe(true);
    expect(transport.actualSendCount).toBe(0);
    expect(transport.simulatedSendCount).toBe(1);
    expect(transport.safety.networkCall).toBe(false);
    expect(transport.safety.tokenRead).toBe(false);
  });

  it("renders dry-run evidence markdown", () => {
    const bundle = buildFinalReviewBundle();
    const intent = createDiscordSendExecutorIntentFromFinalReviewBundle({
      finalReviewBundle: bundle,
      targetLabel: DEFAULT_TARGET_LABEL,
      humanGoReference: HUMAN_GO,
      redacted: true
    });
    const dryRun = createDiscordSendExecutorDryRun(dryRunInput(intent, "READY_CANDIDATE"));
    const evidence = renderDiscordSendExecutorDryRunEvidence(dryRun);

    expect(evidence).toContain("actualDiscordSend: false");
    expect(evidence).toContain(`queueEntryId: ${QUEUE_ENTRY_ID}`);
    expect(evidence).toContain("DRY_RUN_READY is not actual send approval");
  });

  it("produces deterministic dry-run output", () => {
    const bundle = buildFinalReviewBundle();
    const intent = createDiscordSendExecutorIntentFromFinalReviewBundle({
      finalReviewBundle: bundle,
      targetLabel: DEFAULT_TARGET_LABEL,
      humanGoReference: HUMAN_GO,
      redacted: true
    });
    const input = dryRunInput(intent, "READY_CANDIDATE");
    const first = createDiscordSendExecutorDryRun(input);
    const second = createDiscordSendExecutorDryRun(input);

    expect(first.evidence.evidenceId).toBe(second.evidence.evidenceId);
    expect(first.status).toBe(second.status);
  });
});
