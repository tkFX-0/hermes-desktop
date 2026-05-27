import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  createBlockedOperatorHandoffAssemblyFixture,
  createHoldOperatorHandoffAssemblyFixture,
  createPassOperatorHandoffAssemblyFixture
} from "../operator-handoff-fixtures/operator-handoff-fixtures";
import {
  REAL_GOAL_OPERATOR_HANDOFF_MARKDOWN_SNAPSHOT,
  realGoalOperatorHandoffFixtures
} from "../operator-handoff-fixtures/operator-handoff-real-goal-fixtures";
import { createOperatorHandoffMarkdownSnapshot } from "../operator-handoff-markdown-snapshot/operator-handoff-markdown-snapshot";
import { createOperatorHandoffSnapshotIndex } from "../operator-handoff-snapshot-index/operator-handoff-snapshot-index";
import {
  createOperatorHandoffDailyQueuePreview,
  createOperatorHandoffDailyQueuePreviewMarkdown
} from "./operator-handoff-daily-queue-preview";
import type { OperatorHandoffDailyQueuePreviewInput } from "./operator-handoff-daily-queue-preview-types";

const __dirname = dirname(fileURLToPath(import.meta.url));

const FIXTURE_DATE_LABEL = "2026-05-26";

function previewInput(
  snapshotIndex: OperatorHandoffDailyQueuePreviewInput["snapshotIndex"],
  overrides: Partial<OperatorHandoffDailyQueuePreviewInput> = {}
): OperatorHandoffDailyQueuePreviewInput {
  return {
    surface: "operator-handoff-daily-queue-preview-input",
    snapshotIndex,
    dateLabel: FIXTURE_DATE_LABEL,
    operatorName: "operator-preview",
    redacted: true,
    ...overrides
  };
}

function indexFromSnapshots(
  snapshots: Parameters<typeof createOperatorHandoffSnapshotIndex>[0]["snapshots"]
) {
  return createOperatorHandoffSnapshotIndex({
    surface: "operator-handoff-snapshot-index-input",
    snapshots,
    redacted: true
  });
}

function snapshotFromAssembly(
  assembly: Parameters<typeof createOperatorHandoffMarkdownSnapshot>[0]["assembly"]
) {
  return createOperatorHandoffMarkdownSnapshot({
    surface: "operator-handoff-markdown-snapshot-input",
    assembly,
    redacted: true
  });
}

function expectPreviewSafety(preview: ReturnType<typeof createOperatorHandoffDailyQueuePreview>): void {
  expect(preview.previewOnly).toBe(true);
  expect(preview.queuePreviewOnly).toBe(true);
  expect(preview.safety.discordPasteReady).toBe(true);
  expect(preview.safety.obsidianCompatible).toBe(true);
  expect(preview.safety.obsidianWrite).toBe(false);
  expect(preview.safety.fileWrite).toBe(false);
  expect(preview.safety.humanGateQueueMutation).toBe(false);
  expect(preview.safety.sendReady).toBe(false);
  expect(preview.safety.maySendNow).toBe(false);
  expect(preview.safety.actualDiscordSend).toBe(false);
  expect(preview.safety.executorImplemented).toBe(false);
  expect(preview.safety.webhookUsed).toBe(false);
  expect(preview.safety.botStarted).toBe(false);
  expect(preview.safety.tokenRead).toBe(false);
  expect(preview.safety.networkCall).toBe(false);
  expect(preview.safety.externalWrite).toBe(false);
  expect(preview.safety.runtimeStarted).toBe(false);
  expect(preview.safety.actualQueueMutation).toBe(false);
  expect(preview.safety.humanGateQueueDocModified).toBe(false);
  expect(preview.safety.productionReady).toBe(false);
  expect(preview.safety.execution).toBe("disabled");
  expect(preview.safety.rawValuesReported).toBe(false);
  expect(preview.safety.redacted).toBe(true);
}

describe("operator handoff daily queue preview", () => {
  it("does not import Node fs in implementation module", () => {
    const source = readFileSync(join(__dirname, "operator-handoff-daily-queue-preview.ts"), "utf8");

    expect(source).not.toMatch(/from\s+["']node:fs["']/);
    expect(source).not.toMatch(/from\s+["']fs["']/);
  });

  it("renders daily preview from real goal-name snapshot index", () => {
    const snapshots = Object.values(realGoalOperatorHandoffFixtures).map(
      (fixture) => fixture.markdownSnapshot
    );
    const index = indexFromSnapshots(snapshots);
    const preview = createOperatorHandoffDailyQueuePreview(previewInput(index));

    expect(preview.markdown).toContain("# しきしま Daily Operator Queue Preview");
    expect(preview.markdown).toContain(REAL_GOAL_OPERATOR_HANDOFF_MARKDOWN_SNAPSHOT);
    expect(preview.markdown).toContain(`date: ${FIXTURE_DATE_LABEL}`);
    expect(preview.markdown).toContain("## Review Now");
    expect(preview.markdown).toContain("## HOLD");
    expect(preview.markdown).toContain("## BLOCKED");
    expect(preview.markdown).toContain("## Recommended Human Action");
    expect(preview.markdown).toContain("## Safety Boundary");
    expect(preview.markdown).toContain("Queue mutation: HOLD");
    expect(preview.items.every((item) => item.requiresExplicitHumanGo)).toBe(true);
    expectPreviewSafety(preview);
  });

  it("maps READY entries to review_now priority", () => {
    const index = indexFromSnapshots([snapshotFromAssembly(createPassOperatorHandoffAssemblyFixture())]);
    const preview = createOperatorHandoffDailyQueuePreview(previewInput(index));

    expect(preview.status).toBe("READY_FOR_HUMAN_REVIEW");
    expect(preview.counts.reviewNow).toBe(1);
    expect(preview.items[0]?.priority).toBe("review_now");
    expect(preview.recommendedHumanAction).toContain("explicit Human GO");
  });

  it("creates MIXED preview for READY + HOLD index", () => {
    const index = indexFromSnapshots([
      snapshotFromAssembly(createPassOperatorHandoffAssemblyFixture()),
      snapshotFromAssembly(createHoldOperatorHandoffAssemblyFixture())
    ]);
    const preview = createOperatorHandoffDailyQueuePreview(previewInput(index));

    expect(preview.status).toBe("MIXED");
    expect(preview.counts.reviewNow).toBe(1);
    expect(preview.counts.hold).toBe(1);
    expect(preview.recommendedHumanAction).toContain("Review READY items first");
  });

  it("creates BLOCKED preview when index is BLOCKED", () => {
    const index = indexFromSnapshots([
      snapshotFromAssembly(createBlockedOperatorHandoffAssemblyFixture())
    ]);
    const preview = createOperatorHandoffDailyQueuePreview(previewInput(index));

    expect(preview.status).toBe("BLOCKED");
    expect(preview.counts.blocked).toBe(1);
    expect(preview.items[0]?.priority).toBe("blocked");
    expect(preview.recommendedHumanAction).toContain("Resolve BLOCKED items");
  });

  it("creates HOLD preview for empty index", () => {
    const index = indexFromSnapshots([]);
    const preview = createOperatorHandoffDailyQueuePreview(previewInput(index));

    expect(preview.status).toBe("HOLD");
    expect(preview.counts.total).toBe(0);
    expect(preview.markdown).toContain("## Review Now");
    expect(preview.markdown).toContain("- (none)");
    expect(preview.recommendedHumanAction).toContain("No approval-ready item");
  });

  it("produces deterministic markdown", () => {
    const snapshots = Object.values(realGoalOperatorHandoffFixtures).map(
      (fixture) => fixture.markdownSnapshot
    );
    const input = previewInput(indexFromSnapshots(snapshots));
    const first = createOperatorHandoffDailyQueuePreview(input);
    const second = createOperatorHandoffDailyQueuePreview(input);

    expect(first.markdown).toBe(second.markdown);
    expect(first.recommendedHumanAction).toBe(second.recommendedHumanAction);
  });

  it("creates markdown via convenience helper", () => {
    const index = indexFromSnapshots([snapshotFromAssembly(createHoldOperatorHandoffAssemblyFixture())]);
    const markdown = createOperatorHandoffDailyQueuePreviewMarkdown(previewInput(index));

    expect(markdown).toContain("Discord send: HOLD");
    expect(markdown).toContain("productionReady: false");
    expect(markdown).toContain("execution: disabled");
    expect(markdown).toContain("Human GO required: yes");
  });

  it("does not mutate input", () => {
    const input = previewInput(indexFromSnapshots([]));
    const before = JSON.stringify(input);

    createOperatorHandoffDailyQueuePreview(input);

    expect(JSON.stringify(input)).toBe(before);
  });
});
