import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  createBlockedOperatorHandoffAssemblyFixture,
  createHoldOperatorHandoffAssemblyFixture,
  createPassOperatorHandoffAssemblyFixture,
  createPassWithCaveatOperatorHandoffAssemblyFixture
} from "../operator-handoff-fixtures/operator-handoff-fixtures";
import {
  REAL_GOAL_DISCORD_REVIEW_PACKET_ASSEMBLY,
  REAL_GOAL_OPERATOR_HANDOFF_MARKDOWN_SNAPSHOT,
  createDiscordReviewPacketAssemblyGoalFixture,
  createOperatorHandoffAssemblyGoalFixture,
  createOperatorHandoffMarkdownSnapshotGoalFixture,
  realGoalOperatorHandoffFixtures
} from "../operator-handoff-fixtures/operator-handoff-real-goal-fixtures";
import { createOperatorHandoffMarkdownSnapshot } from "../operator-handoff-markdown-snapshot/operator-handoff-markdown-snapshot";
import {
  createOperatorHandoffSnapshotIndex,
  createOperatorHandoffSnapshotIndexMarkdown
} from "./operator-handoff-snapshot-index";
import type { OperatorHandoffSnapshotIndexInput } from "./operator-handoff-snapshot-index-types";

const __dirname = dirname(fileURLToPath(import.meta.url));

function indexInput(
  snapshots: OperatorHandoffSnapshotIndexInput["snapshots"],
  overrides: Partial<OperatorHandoffSnapshotIndexInput> = {}
): OperatorHandoffSnapshotIndexInput {
  return {
    surface: "operator-handoff-snapshot-index-input",
    snapshots,
    redacted: true,
    ...overrides
  };
}

function snapshotFromAssemblyFixture(
  fixture: { assembly: Parameters<typeof createOperatorHandoffMarkdownSnapshot>[0]["assembly"] }
) {
  return createOperatorHandoffMarkdownSnapshot({
    surface: "operator-handoff-markdown-snapshot-input",
    assembly: fixture.assembly,
    redacted: true
  });
}

function expectIndexSafety(index: ReturnType<typeof createOperatorHandoffSnapshotIndex>): void {
  expect(index.indexOnly).toBe(true);
  expect(index.safety.discordPasteReady).toBe(true);
  expect(index.safety.obsidianCompatible).toBe(true);
  expect(index.safety.obsidianWrite).toBe(false);
  expect(index.safety.fileWrite).toBe(false);
  expect(index.safety.sendReady).toBe(false);
  expect(index.safety.maySendNow).toBe(false);
  expect(index.safety.actualDiscordSend).toBe(false);
  expect(index.safety.executorImplemented).toBe(false);
  expect(index.safety.webhookUsed).toBe(false);
  expect(index.safety.botStarted).toBe(false);
  expect(index.safety.tokenRead).toBe(false);
  expect(index.safety.networkCall).toBe(false);
  expect(index.safety.externalWrite).toBe(false);
  expect(index.safety.runtimeStarted).toBe(false);
  expect(index.safety.actualQueueMutation).toBe(false);
  expect(index.safety.humanGateQueueDocModified).toBe(false);
  expect(index.safety.productionReady).toBe(false);
  expect(index.safety.execution).toBe("disabled");
  expect(index.safety.rawValuesReported).toBe(false);
  expect(index.safety.redacted).toBe(true);
}

describe("operator handoff snapshot index", () => {
  it("does not import Node fs in implementation module", () => {
    const source = readFileSync(join(__dirname, "operator-handoff-snapshot-index.ts"), "utf8");

    expect(source).not.toMatch(/from\s+["']node:fs["']/);
    expect(source).not.toMatch(/from\s+["']fs["']/);
  });

  it("renders index with all real goal-name fixtures", () => {
    const snapshots = Object.values(realGoalOperatorHandoffFixtures).map(
      (fixture) => fixture.markdownSnapshot
    );
    const index = createOperatorHandoffSnapshotIndex(indexInput(snapshots));

    expect(index.counts.total).toBe(4);
    expect(index.markdown).toContain(REAL_GOAL_OPERATOR_HANDOFF_MARKDOWN_SNAPSHOT);
    expect(index.markdown).toContain(REAL_GOAL_DISCORD_REVIEW_PACKET_ASSEMBLY);
    expect(index.entries.every((entry) => entry.requiresExplicitHumanGo)).toBe(true);
    expectIndexSafety(index);
  });

  it("produces MIXED status for READY + HOLD snapshots", () => {
    const snapshots = [
      createPassOperatorHandoffAssemblyFixture(),
      createHoldOperatorHandoffAssemblyFixture()
    ].map((assembly) =>
      createOperatorHandoffMarkdownSnapshot({
        surface: "operator-handoff-markdown-snapshot-input",
        assembly,
        redacted: true
      })
    );

    const index = createOperatorHandoffSnapshotIndex(indexInput(snapshots));

    expect(index.status).toBe("MIXED");
    expect(index.counts.readyForHumanReview).toBe(1);
    expect(index.counts.hold).toBe(1);
  });

  it("produces BLOCKED status when any snapshot is BLOCKED", () => {
    const snapshots = [
      createOperatorHandoffMarkdownSnapshotGoalFixture().markdownSnapshot,
      snapshotFromAssemblyFixture({ assembly: createBlockedOperatorHandoffAssemblyFixture() })
    ];
    const index = createOperatorHandoffSnapshotIndex(indexInput(snapshots));

    expect(index.status).toBe("BLOCKED");
    expect(index.counts.blocked).toBe(1);
  });

  it("produces READY_FOR_HUMAN_REVIEW when all snapshots are ready", () => {
    const snapshots = [
      createPassOperatorHandoffAssemblyFixture(),
      createPassWithCaveatOperatorHandoffAssemblyFixture()
    ].map((assembly) =>
      createOperatorHandoffMarkdownSnapshot({
        surface: "operator-handoff-markdown-snapshot-input",
        assembly,
        redacted: true
      })
    );

    const index = createOperatorHandoffSnapshotIndex(indexInput(snapshots));

    expect(index.status).toBe("READY_FOR_HUMAN_REVIEW");
    expect(index.counts.readyForHumanReview).toBe(2);
  });

  it("handles empty snapshots with HOLD status and No snapshots text", () => {
    const index = createOperatorHandoffSnapshotIndex(indexInput([]));

    expect(index.status).toBe("HOLD");
    expect(index.counts.total).toBe(0);
    expect(index.markdown).toContain("No snapshots");
    expect(index.markdown).toContain("## Safety Boundary");
    expect(index.markdown).toContain("Discord send: HOLD");
    expect(index.markdown).toContain("productionReady: false");
    expect(index.markdown).toContain("execution: disabled");
  });

  it("preserves next recommended goal and session metadata in entries", () => {
    const fixture = createOperatorHandoffMarkdownSnapshotGoalFixture();
    const index = createOperatorHandoffSnapshotIndex(indexInput([fixture.markdownSnapshot]));

    expect(index.entries[0]?.sessionId).toBe(fixture.assembly.operatorHandoffSession.sessionId);
    expect(index.entries[0]?.nextRecommendedGoal).toContain("snapshot-index");
  });

  it("includes explicit Human GO language in markdown", () => {
    const snapshots = [
      createOperatorHandoffAssemblyGoalFixture().markdownSnapshot,
      createDiscordReviewPacketAssemblyGoalFixture().markdownSnapshot
    ];
    const markdown = createOperatorHandoffSnapshotIndexMarkdown(indexInput(snapshots));

    expect(markdown).toContain("Human GO required: yes");
    expect(markdown).toContain("explicit Human GO required");
    expect(markdown).toContain("## Snapshot Entries");
    expect(markdown).toContain("## Next Actions");
  });

  it("produces deterministic output", () => {
    const snapshots = Object.values(realGoalOperatorHandoffFixtures).map(
      (fixture) => fixture.markdownSnapshot
    );
    const input = indexInput(snapshots);
    const first = createOperatorHandoffSnapshotIndex(input);
    const second = createOperatorHandoffSnapshotIndex(input);

    expect(first.markdown).toBe(second.markdown);
    expect(first.entries).toEqual(second.entries);
  });

  it("does not mutate input", () => {
    const snapshots = [createPassOperatorHandoffAssemblyFixture()].map((assembly) =>
      createOperatorHandoffMarkdownSnapshot({
        surface: "operator-handoff-markdown-snapshot-input",
        assembly,
        redacted: true
      })
    );
    const input = indexInput(snapshots);
    const before = JSON.stringify(input);

    createOperatorHandoffSnapshotIndex(input);

    expect(JSON.stringify(input)).toBe(before);
  });
});
