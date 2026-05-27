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
  applyHumanGateQueueAppendToMarkdown,
  applyHumanGateQueueStateUpdateToMarkdown
} from "./human-gate-queue-file-mutation";
import {
  buildAppendOperationInput,
  buildUpdateOperationInput,
  createHumanGateQueueEntryFromFinalReviewBundle,
  createHumanGateQueueMutationPreflight,
  renderHumanGateQueueEntryMarkdown,
  renderHumanGateQueueUpdateMarkdown
} from "./human-gate-queue-operation";
import { HUMAN_GATE_QUEUE_TARGET_DOCUMENT } from "./human-gate-queue-operation-types";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENTRY_ID = "queue-operator-review-mvp-finalize-rally-001";

function buildBundle() {
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

describe("human gate queue operation", () => {
  it("does not import Node fs in implementation modules", () => {
    for (const file of ["human-gate-queue-operation.ts", "human-gate-queue-file-mutation.ts"]) {
      const source = readFileSync(join(__dirname, file), "utf8");
      expect(source).not.toMatch(/from\s+["']node:fs["']/);
      expect(source).not.toMatch(/from\s+["']fs["']/);
    }
  });

  it("creates queue entry from final review bundle", () => {
    const input = buildAppendOperationInput(buildBundle(), ENTRY_ID);
    const entry = createHumanGateQueueEntryFromFinalReviewBundle(input);

    expect(entry.entryId).toBe(ENTRY_ID);
    expect(entry.requiresExplicitHumanGo).toBe(true);
    expect(entry.createdBy).toBe("shikishima-queue-operation-mvp");
    expect(entry.redacted).toBe(true);
  });

  it("creates mutation preflight for append", () => {
    const preflight = createHumanGateQueueMutationPreflight(buildAppendOperationInput(buildBundle(), ENTRY_ID));

    expect(preflight.targetDocument).toBe(HUMAN_GATE_QUEUE_TARGET_DOCUMENT);
    expect(preflight.mayMutateRepoLocalQueue).toBe(true);
    expect(preflight.mayMutateExternalQueue).toBe(false);
    expect(preflight.readyCandidate).toBe(true);
    expect(preflight.safety.discordSend).toBe(false);
    expect(preflight.safety.externalWrite).toBe(false);
  });

  it("renders append and update markdown", () => {
    const input = buildAppendOperationInput(buildBundle(), ENTRY_ID);
    const entry = createHumanGateQueueEntryFromFinalReviewBundle(input);
    const entryMarkdown = renderHumanGateQueueEntryMarkdown(entry);
    const updateMarkdown = renderHumanGateQueueUpdateMarkdown(
      entry,
      "READY_FOR_HUMAN_REVIEW",
      "Rally 2 controlled queue operation validation"
    );

    expect(entryMarkdown).toContain(`## Queue Entry: ${ENTRY_ID}`);
    expect(entryMarkdown).toContain("Discord send: HOLD");
    expect(updateMarkdown).toContain(`### Queue Update: ${ENTRY_ID}`);
    expect(updateMarkdown).toContain("requiresExplicitHumanGo: true");
  });

  it("requires target for update preflight", () => {
    const preflight = createHumanGateQueueMutationPreflight(
      buildUpdateOperationInput(buildBundle(), ENTRY_ID, "READY_FOR_HUMAN_REVIEW", "")
    );

    expect(preflight.readyCandidate).toBe(false);
  });

  it("applies append and update to markdown purely", () => {
    const input = buildAppendOperationInput(buildBundle(), ENTRY_ID);
    const entry = createHumanGateQueueEntryFromFinalReviewBundle(input);
    const entryMarkdown = renderHumanGateQueueEntryMarkdown(entry);
    const base = "# Human Gate Queue\n\n## 4. Current Pending Gates\n";

    const appended = applyHumanGateQueueAppendToMarkdown(base, entryMarkdown);
    expect(appended).toContain(`## Queue Entry: ${ENTRY_ID}`);
    expect(appended).toContain("- state: OPEN");

    const updateMarkdown = renderHumanGateQueueUpdateMarkdown(
      entry,
      "READY_FOR_HUMAN_REVIEW",
      "Rally 2 controlled queue operation validation"
    );
    const updated = applyHumanGateQueueStateUpdateToMarkdown(
      appended,
      ENTRY_ID,
      updateMarkdown,
      "OPEN",
      "READY_FOR_HUMAN_REVIEW"
    );

    expect(updated).toContain("- state: READY_FOR_HUMAN_REVIEW");
    expect(updated).toContain("### Queue Update:");
    expect(updated).not.toContain("- state: OPEN");
  });
});
