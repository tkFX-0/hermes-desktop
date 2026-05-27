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
import { createOperatorHandoffSnapshotIndex } from "../operator-handoff-snapshot-index/operator-handoff-snapshot-index";
import {
  createOperatorHandoffDiscordDigest,
  createOperatorHandoffDiscordDigestMarkdown
} from "./operator-handoff-discord-digest";
import type { OperatorHandoffDiscordDigestInput } from "./operator-handoff-discord-digest-types";

const __dirname = dirname(fileURLToPath(import.meta.url));

const FIXTURE_DATE = "2026-05-26";

function digestInput(
  dailyQueuePreview: OperatorHandoffDiscordDigestInput["dailyQueuePreview"],
  overrides: Partial<OperatorHandoffDiscordDigestInput> = {}
): OperatorHandoffDiscordDigestInput {
  return {
    surface: "operator-handoff-discord-digest-input",
    dailyQueuePreview,
    redacted: true,
    ...overrides
  };
}

function dailyPreviewFromSnapshots(
  snapshots: Parameters<typeof createOperatorHandoffSnapshotIndex>[0]["snapshots"]
) {
  const index = createOperatorHandoffSnapshotIndex({
    surface: "operator-handoff-snapshot-index-input",
    snapshots,
    redacted: true
  });

  return createOperatorHandoffDailyQueuePreview({
    surface: "operator-handoff-daily-queue-preview-input",
    snapshotIndex: index,
    dateLabel: FIXTURE_DATE,
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

function expectDigestSafety(digest: ReturnType<typeof createOperatorHandoffDiscordDigest>): void {
  expect(digest.safety.discordPasteReady).toBe(true);
  expect(digest.safety.obsidianCompatible).toBe(true);
  expect(digest.safety.obsidianWrite).toBe(false);
  expect(digest.safety.fileWrite).toBe(false);
  expect(digest.safety.humanGateQueueMutation).toBe(false);
  expect(digest.safety.sendReady).toBe(false);
  expect(digest.safety.actualDiscordSend).toBe(false);
  expect(digest.safety.productionReady).toBe(false);
  expect(digest.safety.execution).toBe("disabled");
}

describe("operator handoff discord digest", () => {
  it("does not import Node fs in implementation module", () => {
    const source = readFileSync(join(__dirname, "operator-handoff-discord-digest.ts"), "utf8");

    expect(source).not.toMatch(/from\s+["']node:fs["']/);
    expect(source).not.toMatch(/from\s+["']fs["']/);
  });

  it("renders digest from real goal daily queue preview", () => {
    const snapshots = Object.values(realGoalOperatorHandoffFixtures).map(
      (fixture) => fixture.markdownSnapshot
    );
    const preview = dailyPreviewFromSnapshots(snapshots);
    const digest = createOperatorHandoffDiscordDigest(digestInput(preview));

    expect(digest.status).toBe(preview.status);
    expect(digest.counts).toEqual(preview.counts);
    expect(digest.markdown).toContain("# しきしま Operator Digest");
    expect(digest.markdown).toContain("**Status:**");
    expect(digest.markdown).toContain("## Top Items");
    expect(digest.markdown).toContain("## Recommended Human Action");
    expect(digest.markdown).toContain("## Safety");
    expect(digest.items.every((item) => item.requiresExplicitHumanGo)).toBe(true);
    expectDigestSafety(digest);
  });

  it("limits listed items by maxItems", () => {
    const snapshots = Object.values(realGoalOperatorHandoffFixtures).map(
      (fixture) => fixture.markdownSnapshot
    );
    const preview = dailyPreviewFromSnapshots(snapshots);
    const digest = createOperatorHandoffDiscordDigest(digestInput(preview, { maxItems: 2 }));

    expect(digest.items.length).toBe(2);
    expect(digest.truncated).toBe(true);
  });

  it("truncates markdown by maxLength", () => {
    const preview = dailyPreviewFromSnapshots([
      snapshotFromAssembly(createPassOperatorHandoffAssemblyFixture())
    ]);
    const digest = createOperatorHandoffDiscordDigest(digestInput(preview, { maxLength: 200 }));

    expect(digest.markdown.length).toBeLessThanOrEqual(200);
    expect(digest.truncated).toBe(true);
    expect(digest.markdown).toContain("truncated for Discord paste");
  });

  it("sets truncated false when under limits", () => {
    const preview = dailyPreviewFromSnapshots([
      snapshotFromAssembly(createPassOperatorHandoffAssemblyFixture())
    ]);
    const digest = createOperatorHandoffDiscordDigest(digestInput(preview));

    expect(digest.truncated).toBe(false);
  });

  it("mirrors BLOCKED HOLD READY MIXED statuses", () => {
    const blocked = createOperatorHandoffDiscordDigest(
      digestInput(
        dailyPreviewFromSnapshots([snapshotFromAssembly(createBlockedOperatorHandoffAssemblyFixture())])
      )
    );
    const hold = createOperatorHandoffDiscordDigest(
      digestInput(dailyPreviewFromSnapshots([snapshotFromAssembly(createHoldOperatorHandoffAssemblyFixture())]))
    );
    const ready = createOperatorHandoffDiscordDigest(
      digestInput(dailyPreviewFromSnapshots([snapshotFromAssembly(createPassOperatorHandoffAssemblyFixture())]))
    );
    const mixed = createOperatorHandoffDiscordDigest(
      digestInput(
        dailyPreviewFromSnapshots([
          snapshotFromAssembly(createPassOperatorHandoffAssemblyFixture()),
          snapshotFromAssembly(createHoldOperatorHandoffAssemblyFixture())
        ])
      )
    );

    expect(blocked.status).toBe("BLOCKED");
    expect(hold.status).toBe("HOLD");
    expect(ready.status).toBe("READY_FOR_HUMAN_REVIEW");
    expect(mixed.status).toBe("MIXED");
  });

  it("produces deterministic output", () => {
    const preview = dailyPreviewFromSnapshots([
      snapshotFromAssembly(createPassOperatorHandoffAssemblyFixture())
    ]);
    const input = digestInput(preview);
    const first = createOperatorHandoffDiscordDigest(input);
    const second = createOperatorHandoffDiscordDigest(input);

    expect(first.markdown).toBe(second.markdown);
  });

  it("does not mutate input", () => {
    const preview = dailyPreviewFromSnapshots([]);
    const input = digestInput(preview);
    const before = JSON.stringify(input);

    createOperatorHandoffDiscordDigest(input);

    expect(JSON.stringify(input)).toBe(before);
  });

  it("creates markdown via convenience helper", () => {
    const preview = dailyPreviewFromSnapshots([]);
    const markdown = createOperatorHandoffDiscordDigestMarkdown(digestInput(preview));

    expect(markdown).toContain("Discord send: HOLD");
    expect(markdown).toContain("explicit Human GO");
  });
});
