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
import type { OperatorHandoffAssemblyResult } from "../operator-handoff-assembly/operator-handoff-assembly-types";
import {
  createOperatorHandoffMarkdownSnapshot,
  createOperatorHandoffMarkdownSnapshotMarkdown,
  renderOperatorHandoffMarkdownSnapshot
} from "./operator-handoff-markdown-snapshot";
import type {
  OperatorHandoffMarkdownSnapshot,
  OperatorHandoffMarkdownSnapshotInput
} from "./operator-handoff-markdown-snapshot-types";

const __dirname = dirname(fileURLToPath(import.meta.url));

function snapshotInput(
  assembly: OperatorHandoffAssemblyResult,
  overrides: Partial<OperatorHandoffMarkdownSnapshotInput> = {}
): OperatorHandoffMarkdownSnapshotInput {
  return {
    surface: "operator-handoff-markdown-snapshot-input",
    assembly,
    redacted: true,
    ...overrides
  };
}

function expectSnapshotSafety(snapshot: OperatorHandoffMarkdownSnapshot): void {
  expect(snapshot.snapshotOnly).toBe(true);
  expect(snapshot.markdownOnly).toBe(true);
  expect(snapshot.reviewOnly).toBe(true);
  expect(snapshot.draftOnly).toBe(true);
  expect(snapshot.safety.discordPasteReady).toBe(true);
  expect(snapshot.safety.obsidianCompatible).toBe(true);
  expect(snapshot.safety.obsidianWrite).toBe(false);
  expect(snapshot.safety.fileWrite).toBe(false);
  expect(snapshot.safety.sendReady).toBe(false);
  expect(snapshot.safety.maySendNow).toBe(false);
  expect(snapshot.safety.actualDiscordSend).toBe(false);
  expect(snapshot.safety.executorImplemented).toBe(false);
  expect(snapshot.safety.webhookUsed).toBe(false);
  expect(snapshot.safety.botStarted).toBe(false);
  expect(snapshot.safety.tokenRead).toBe(false);
  expect(snapshot.safety.networkCall).toBe(false);
  expect(snapshot.safety.externalWrite).toBe(false);
  expect(snapshot.safety.runtimeStarted).toBe(false);
  expect(snapshot.safety.actualQueueMutation).toBe(false);
  expect(snapshot.safety.humanGateQueueDocModified).toBe(false);
  expect(snapshot.safety.productionReady).toBe(false);
  expect(snapshot.safety.execution).toBe("disabled");
  expect(snapshot.safety.rawValuesReported).toBe(false);
  expect(snapshot.safety.redacted).toBe(true);
}

function expectCanonicalMarkdownShape(markdown: string): void {
  expect(markdown).toContain("# しきしま Operator Handoff");
  expect(markdown).toContain("## Status");
  expect(markdown).toContain("## Summary");
  expect(markdown).toContain("## Review Packet");
  expect(markdown).toContain("## Decision Choices");
  expect(markdown).toContain("## Safety Boundary");
  expect(markdown).toContain("APPROVE_NEXT_GOAL");
  expect(markdown).toContain("explicit Human GO required");
}

describe("operator handoff markdown snapshot", () => {
  it("does not import Node fs in implementation module", () => {
    const source = readFileSync(join(__dirname, "operator-handoff-markdown-snapshot.ts"), "utf8");

    expect(source).not.toMatch(/from\s+["']node:fs["']/);
    expect(source).not.toMatch(/from\s+["']fs["']/);
  });

  it("renders READY_FOR_HUMAN_REVIEW snapshot for PASS fixture", () => {
    const assembly = createPassOperatorHandoffAssemblyFixture();
    const snapshot = createOperatorHandoffMarkdownSnapshot(snapshotInput(assembly));

    expect(snapshot.status).toBe("READY_FOR_HUMAN_REVIEW");
    expect(snapshot.source.goalResultStatus).toBe("PASS");
    expectCanonicalMarkdownShape(snapshot.markdown);
    expect(snapshot.markdown).toContain("## Next Recommended Goal");
    expectSnapshotSafety(snapshot);
  });

  it("renders READY_FOR_HUMAN_REVIEW snapshot with caveats for PASS_WITH_CAVEAT fixture", () => {
    const assembly = createPassWithCaveatOperatorHandoffAssemblyFixture();
    const snapshot = createOperatorHandoffMarkdownSnapshot(snapshotInput(assembly));

    expect(snapshot.status).toBe("READY_FOR_HUMAN_REVIEW");
    expect(snapshot.source.goalResultStatus).toBe("PASS_WITH_CAVEAT");
    expect(snapshot.markdown).toContain("## Caveats");
    expect(snapshot.markdown).toContain("synthesized");
    expectCanonicalMarkdownShape(snapshot.markdown);
    expectSnapshotSafety(snapshot);
  });

  it("renders HOLD snapshot for HOLD fixture", () => {
    const assembly = createHoldOperatorHandoffAssemblyFixture();
    const snapshot = createOperatorHandoffMarkdownSnapshot(snapshotInput(assembly));

    expect(snapshot.status).toBe("HOLD");
    expect(snapshot.markdown).toContain("status: HOLD");
    expectCanonicalMarkdownShape(snapshot.markdown);
    expectSnapshotSafety(snapshot);
  });

  it("renders BLOCKED snapshot for BLOCKED fixture", () => {
    const assembly = createBlockedOperatorHandoffAssemblyFixture();
    const snapshot = createOperatorHandoffMarkdownSnapshot(snapshotInput(assembly));

    expect(snapshot.status).toBe("BLOCKED");
    expect(snapshot.markdown).toContain("status: BLOCKED");
    expect(snapshot.source.goalResultStatus).toBe("STOP");
    expectCanonicalMarkdownShape(snapshot.markdown);
    expectSnapshotSafety(snapshot);
  });

  it("omits decision choices section content when disabled", () => {
    const assembly = createPassOperatorHandoffAssemblyFixture();
    const snapshot = createOperatorHandoffMarkdownSnapshot(
      snapshotInput(assembly, { includeDecisionChoices: false })
    );

    expect(snapshot.markdown).toContain("## Decision Choices");
    expect(snapshot.markdown).toContain("(decision choices omitted)");
    expect(snapshot.markdown).not.toContain("REQUEST_REVISION —");
  });

  it("omits safety boundary when disabled", () => {
    const assembly = createPassOperatorHandoffAssemblyFixture();
    const snapshot = createOperatorHandoffMarkdownSnapshot(
      snapshotInput(assembly, { includeSafetySection: false })
    );

    expect(snapshot.markdown).not.toContain("## Safety Boundary");
  });

  it("produces deterministic markdown", () => {
    const assembly = createPassOperatorHandoffAssemblyFixture();
    const input = snapshotInput(assembly);
    const first = createOperatorHandoffMarkdownSnapshot(input);
    const second = createOperatorHandoffMarkdownSnapshot(input);

    expect(first.markdown).toBe(second.markdown);
    expect(renderOperatorHandoffMarkdownSnapshot(first)).toBe(first.markdown);
  });

  it("creates markdown via convenience helper", () => {
    const assembly = createHoldOperatorHandoffAssemblyFixture();
    const markdown = createOperatorHandoffMarkdownSnapshotMarkdown(snapshotInput(assembly));

    expect(typeof markdown).toBe("string");
    expect(markdown.length).toBeGreaterThan(200);
    expectCanonicalMarkdownShape(markdown);
  });

  it("does not mutate input", () => {
    const assembly = createPassOperatorHandoffAssemblyFixture();
    const input = snapshotInput(assembly);
    const before = JSON.stringify(input);

    createOperatorHandoffMarkdownSnapshot(input);

    expect(JSON.stringify(input)).toBe(before);
  });
});
