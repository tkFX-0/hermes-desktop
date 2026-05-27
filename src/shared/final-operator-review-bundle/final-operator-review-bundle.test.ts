import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  createBlockedOperatorHandoffAssemblyFixture,
  createHoldOperatorHandoffAssemblyFixture,
  createPassOperatorHandoffAssemblyFixture
} from "../operator-handoff-fixtures/operator-handoff-fixtures";
import { realGoalOperatorHandoffFixtures } from "../operator-handoff-fixtures/operator-handoff-real-goal-fixtures";
import { createOperatorHandoffMarkdownSnapshot } from "../operator-handoff-markdown-snapshot/operator-handoff-markdown-snapshot";
import { createOperatorHandoffDailyQueuePreview } from "../operator-handoff-daily-queue-preview/operator-handoff-daily-queue-preview";
import { createOperatorHandoffDiscordDigest } from "../operator-handoff-discord-digest/operator-handoff-discord-digest";
import { createOperatorHandoffSnapshotIndex } from "../operator-handoff-snapshot-index/operator-handoff-snapshot-index";
import {
  createFinalOperatorReviewBundle,
  createFinalOperatorReviewBundleMarkdown
} from "./final-operator-review-bundle";
import type { FinalOperatorReviewBundleInput } from "./final-operator-review-bundle-types";

const __dirname = dirname(fileURLToPath(import.meta.url));

const FIXTURE_DATE = "2026-05-26";

function snapshotFromAssembly(
  assembly: Parameters<typeof createOperatorHandoffMarkdownSnapshot>[0]["assembly"]
) {
  return createOperatorHandoffMarkdownSnapshot({
    surface: "operator-handoff-markdown-snapshot-input",
    assembly,
    redacted: true
  });
}

function buildPipelineBundle(
  snapshots: Parameters<typeof createOperatorHandoffSnapshotIndex>[0]["snapshots"],
  overrides: Partial<FinalOperatorReviewBundleInput> = {}
) {
  const snapshotIndex = createOperatorHandoffSnapshotIndex({
    surface: "operator-handoff-snapshot-index-input",
    snapshots,
    redacted: true
  });
  const dailyQueuePreview = createOperatorHandoffDailyQueuePreview({
    surface: "operator-handoff-daily-queue-preview-input",
    snapshotIndex,
    dateLabel: FIXTURE_DATE,
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
    generatedAtLabel: FIXTURE_DATE,
    redacted: true,
    ...overrides
  });
}

function expectBundleSafety(bundle: ReturnType<typeof createFinalOperatorReviewBundle>): void {
  expect(bundle.safety.discordPasteReady).toBe(true);
  expect(bundle.safety.obsidianCompatible).toBe(true);
  expect(bundle.safety.obsidianWrite).toBe(false);
  expect(bundle.safety.fileWrite).toBe(false);
  expect(bundle.safety.humanGateQueueMutation).toBe(false);
  expect(bundle.safety.sendReady).toBe(false);
  expect(bundle.safety.actualDiscordSend).toBe(false);
  expect(bundle.safety.productionReady).toBe(false);
  expect(bundle.safety.execution).toBe("disabled");
}

describe("final operator review bundle", () => {
  it("does not import Node fs in implementation module", () => {
    const source = readFileSync(join(__dirname, "final-operator-review-bundle.ts"), "utf8");

    expect(source).not.toMatch(/from\s+["']node:fs["']/);
    expect(source).not.toMatch(/from\s+["']fs["']/);
  });

  it("creates bundle from real goal fixture pipeline", () => {
    const snapshots = Object.values(realGoalOperatorHandoffFixtures).map(
      (fixture) => fixture.markdownSnapshot
    );
    const bundle = buildPipelineBundle(snapshots);

    expect(bundle.snapshotIndex.counts.total).toBe(4);
    expect(bundle.dailyQueuePreview.counts.total).toBe(4);
    expect(bundle.discordDigest.counts.total).toBe(4);
    expect(bundle.markdown).toContain("# しきしま Final Operator Review Bundle");
    expect(bundle.markdown).toContain("## Digest");
    expect(bundle.markdown).toContain("## Daily Queue");
    expect(bundle.markdown).toContain("## Snapshot Index");
    expect(bundle.markdown).toContain("## Review Checklist");
    expect(bundle.markdown).toContain("## Decision Options");
    expect(bundle.markdown).toContain("## Safety Boundary");
    expect(bundle.markdown).toContain("Queue mutation: HOLD");
    expectBundleSafety(bundle);
  });

  it("uses conservative BLOCKED status", () => {
    const bundle = buildPipelineBundle([
      snapshotFromAssembly(createBlockedOperatorHandoffAssemblyFixture())
    ]);

    expect(bundle.status).toBe("BLOCKED");
  });

  it("uses conservative MIXED status", () => {
    const bundle = buildPipelineBundle([
      snapshotFromAssembly(createPassOperatorHandoffAssemblyFixture()),
      snapshotFromAssembly(createHoldOperatorHandoffAssemblyFixture())
    ]);

    expect(bundle.status).toBe("MIXED");
  });

  it("uses READY_FOR_HUMAN_REVIEW when all inputs are ready", () => {
    const bundle = buildPipelineBundle([
      snapshotFromAssembly(createPassOperatorHandoffAssemblyFixture())
    ]);

    expect(bundle.status).toBe("READY_FOR_HUMAN_REVIEW");
  });

  it("uses HOLD when all inputs are hold", () => {
    const bundle = buildPipelineBundle([
      snapshotFromAssembly(createHoldOperatorHandoffAssemblyFixture())
    ]);

    expect(bundle.status).toBe("HOLD");
  });

  it("preserves provided bundleId and generates deterministic default", () => {
    const snapshots = [snapshotFromAssembly(createPassOperatorHandoffAssemblyFixture())];
    const defaultBundle = buildPipelineBundle(snapshots);
    const customBundle = buildPipelineBundle(snapshots, { bundleId: "bundle-custom-001" });

    expect(customBundle.bundleId).toBe("bundle-custom-001");
    expect(defaultBundle.bundleId).toBe(`final-operator-review:${FIXTURE_DATE}:READY_FOR_HUMAN_REVIEW`);
  });

  it("requires explicit Human GO for approve decision option", () => {
    const bundle = buildPipelineBundle([snapshotFromAssembly(createPassOperatorHandoffAssemblyFixture())]);
    const approve = bundle.decisionOptions.find((row) => row.option === "APPROVE_ONE_NEXT_GOAL");

    expect(approve?.requiresExplicitHumanGo).toBe(true);
    expect(bundle.markdown).toContain("APPROVE_ONE_NEXT_GOAL");
    expect(bundle.markdown).toContain("requires explicit Human GO");
  });

  it("produces deterministic markdown", () => {
    const snapshots = [snapshotFromAssembly(createPassOperatorHandoffAssemblyFixture())];
    const first = buildPipelineBundle(snapshots);
    const second = buildPipelineBundle(snapshots);

    expect(first.markdown).toBe(second.markdown);
    expect(first.bundleId).toBe(second.bundleId);
  });

  it("does not mutate input", () => {
    const snapshots = [snapshotFromAssembly(createPassOperatorHandoffAssemblyFixture())];
    const snapshotIndex = createOperatorHandoffSnapshotIndex({
      surface: "operator-handoff-snapshot-index-input",
      snapshots,
      redacted: true
    });
    const dailyQueuePreview = createOperatorHandoffDailyQueuePreview({
      surface: "operator-handoff-daily-queue-preview-input",
      snapshotIndex,
      dateLabel: FIXTURE_DATE,
      redacted: true
    });
    const discordDigest = createOperatorHandoffDiscordDigest({
      surface: "operator-handoff-discord-digest-input",
      dailyQueuePreview,
      redacted: true
    });
    const input: FinalOperatorReviewBundleInput = {
      surface: "final-operator-review-bundle-input",
      snapshotIndex,
      dailyQueuePreview,
      discordDigest,
      redacted: true
    };
    const before = JSON.stringify(input);

    createFinalOperatorReviewBundle(input);

    expect(JSON.stringify(input)).toBe(before);
  });

  it("creates markdown via convenience helper", () => {
    const bundle = buildPipelineBundle([snapshotFromAssembly(createPassOperatorHandoffAssemblyFixture())]);
    const markdown = createFinalOperatorReviewBundleMarkdown({
      surface: "final-operator-review-bundle-input",
      snapshotIndex: bundle.snapshotIndex,
      dailyQueuePreview: bundle.dailyQueuePreview,
      discordDigest: bundle.discordDigest,
      generatedAtLabel: FIXTURE_DATE,
      redacted: true
    });

    expect(markdown).toBe(bundle.markdown);
    expect(markdown).toContain("Discord send: HOLD");
    expect(markdown).toContain("execution: disabled");
  });
});
