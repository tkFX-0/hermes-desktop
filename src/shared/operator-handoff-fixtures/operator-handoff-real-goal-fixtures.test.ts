import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  REAL_GOAL_DISCORD_REVIEW_PACKET_ASSEMBLY,
  REAL_GOAL_OPERATOR_HANDOFF_ASSEMBLY,
  REAL_GOAL_OPERATOR_HANDOFF_MARKDOWN_SNAPSHOT,
  createDiscordReviewPacketAssemblyGoalFixture,
  createDiscordSendExecutorDesignGoalFixture,
  createHumanGateReportSnapshotAdapterGoalFixture,
  createOperatorHandoffAssemblyGoalFixture,
  createOperatorHandoffMarkdownSnapshotGoalFixture,
  realGoalOperatorHandoffFixtures
} from "./operator-handoff-real-goal-fixtures";
import type { RealGoalOperatorHandoffFixture } from "./operator-handoff-real-goal-fixtures-types";

const __dirname = dirname(fileURLToPath(import.meta.url));

function expectRealGoalFixtureInvariants(fixture: RealGoalOperatorHandoffFixture): void {
  expect(fixture.assembly.surface).toBe("operator-handoff-assembly-result");
  expect(fixture.markdownSnapshot.surface).toBe("operator-handoff-markdown-snapshot");
  expect(fixture.markdownSnapshot.markdown).toContain(fixture.goalName);
  expect(fixture.markdownSnapshot.markdown).toContain("## Status");
  expect(fixture.markdownSnapshot.markdown).toContain("## Summary");
  expect(fixture.markdownSnapshot.markdown).toContain("## Review Packet");
  expect(fixture.markdownSnapshot.markdown).toContain("## Decision Choices");
  expect(fixture.markdownSnapshot.markdown).toContain("## Safety Boundary");
  expect(fixture.markdownSnapshot.markdown).toContain("explicit Human GO required");
  expect(fixture.markdownSnapshot.safety.discordPasteReady).toBe(true);
  expect(fixture.markdownSnapshot.safety.obsidianCompatible).toBe(true);
  expect(fixture.markdownSnapshot.safety.obsidianWrite).toBe(false);
  expect(fixture.markdownSnapshot.safety.fileWrite).toBe(false);
  expect(fixture.assembly.safety.sendReady).toBe(false);
  expect(fixture.assembly.safety.maySendNow).toBe(false);
  expect(fixture.assembly.safety.actualDiscordSend).toBe(false);
  expect(fixture.assembly.safety.executorImplemented).toBe(false);
  expect(fixture.assembly.safety.webhookUsed).toBe(false);
  expect(fixture.assembly.safety.botStarted).toBe(false);
  expect(fixture.assembly.safety.tokenRead).toBe(false);
  expect(fixture.assembly.safety.networkCall).toBe(false);
  expect(fixture.assembly.safety.externalWrite).toBe(false);
  expect(fixture.assembly.safety.runtimeStarted).toBe(false);
  expect(fixture.assembly.safety.actualQueueMutation).toBe(false);
  expect(fixture.assembly.safety.humanGateQueueDocModified).toBe(false);
  expect(fixture.assembly.safety.productionReady).toBe(false);
  expect(fixture.assembly.safety.execution).toBe("disabled");
  expect(fixture.assembly.safety.rawValuesReported).toBe(false);
  expect(fixture.assembly.safety.redacted).toBe(true);
  expect(
    fixture.assembly.operatorHandoffSession.decisionChoices.some(
      (row) => row.choice === "APPROVE_NEXT_GOAL"
    )
  ).toBe(true);
}

describe("operator handoff real goal fixtures", () => {
  it("does not import Node fs in implementation module", () => {
    const source = readFileSync(join(__dirname, "operator-handoff-real-goal-fixtures.ts"), "utf8");

    expect(source).not.toMatch(/from\s+["']node:fs["']/);
    expect(source).not.toMatch(/from\s+["']fs["']/);
  });

  it("creates PASS markdown snapshot goal fixture with READY_FOR_HUMAN_REVIEW", () => {
    const fixture = createOperatorHandoffMarkdownSnapshotGoalFixture();

    expect(fixture.goalName).toBe(REAL_GOAL_OPERATOR_HANDOFF_MARKDOWN_SNAPSHOT);
    expect(fixture.assembly.status).toBe("READY_FOR_HUMAN_REVIEW");
    expect(fixture.markdownSnapshot.status).toBe("READY_FOR_HUMAN_REVIEW");
    expect(fixture.assembly.operatorHandoffSession.source.originMainAfter).toBe("c3e95a9");
    expect(fixture.assembly.operatorHandoffSession.source.pushedCommits).toEqual(["d0121ea", "c3e95a9"]);
    expect(fixture.assembly.operatorHandoffSession.source.localCommitsAhead).toEqual(["ddf962d", "f33c894"]);
    expect(fixture.markdownSnapshot.markdown).toContain("## Next Recommended Goal");
    expectRealGoalFixtureInvariants(fixture);
  });

  it("creates PASS_WITH_CAVEAT operator handoff assembly goal fixture", () => {
    const fixture = createOperatorHandoffAssemblyGoalFixture();

    expect(fixture.goalName).toBe(REAL_GOAL_OPERATOR_HANDOFF_ASSEMBLY);
    expect(fixture.assembly.source.goalResultStatus).toBe("PASS_WITH_CAVEAT");
    expect(fixture.assembly.status).toBe("READY_FOR_HUMAN_REVIEW");
    expect(fixture.assembly.caveats.length).toBeGreaterThan(0);
    expectRealGoalFixtureInvariants(fixture);
  });

  it("creates PASS_WITH_CAVEAT snapshot adapter goal fixture with adapter commits", () => {
    const fixture = createHumanGateReportSnapshotAdapterGoalFixture();

    expect(fixture.goalName).toBe(REAL_GOAL_OPERATOR_HANDOFF_ASSEMBLY);
    expect(fixture.assembly.operatorHandoffSession.source.pushedCommits).toEqual(["fed333c", "8a08b8c"]);
    expect(fixture.assembly.operatorHandoffSession.sessionId).toBe(
      "operator-handoff-real:snapshot-adapter:001"
    );
    expectRealGoalFixtureInvariants(fixture);
  });

  it("creates HOLD discord review packet assembly goal fixture", () => {
    const fixture = createDiscordReviewPacketAssemblyGoalFixture();

    expect(fixture.goalName).toBe(REAL_GOAL_DISCORD_REVIEW_PACKET_ASSEMBLY);
    expect(fixture.assembly.status).toBe("HOLD");
    expect(fixture.markdownSnapshot.status).toBe("HOLD");
    expect(fixture.markdownSnapshot.markdown).toContain("status: HOLD");
    expectRealGoalFixtureInvariants(fixture);
  });

  it("creates HOLD executor design goal fixture", () => {
    const fixture = createDiscordSendExecutorDesignGoalFixture();

    expect(fixture.assembly.status).toBe("HOLD");
    expect(fixture.assembly.operatorHandoffSession.sessionId).toContain("executor-design");
    expectRealGoalFixtureInvariants(fixture);
  });

  it("produces deterministic sessionId and markdown", () => {
    const first = createOperatorHandoffMarkdownSnapshotGoalFixture();
    const second = createOperatorHandoffMarkdownSnapshotGoalFixture();

    expect(first.assembly.operatorHandoffSession.sessionId).toBe(
      second.assembly.operatorHandoffSession.sessionId
    );
    expect(first.markdownSnapshot.markdown).toBe(second.markdownSnapshot.markdown);
  });

  it("exposes registry with four real goal entries", () => {
    expect(realGoalOperatorHandoffFixtures.operatorHandoffMarkdownSnapshotGoal.goalName).toBe(
      REAL_GOAL_OPERATOR_HANDOFF_MARKDOWN_SNAPSHOT
    );
    expect(realGoalOperatorHandoffFixtures.discordReviewPacketAssemblyGoal.assembly.status).toBe("HOLD");
  });
});
