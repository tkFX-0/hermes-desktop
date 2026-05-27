import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  OPERATOR_HANDOFF_FIXTURE_GOAL_NAME,
  createBlockedOperatorHandoffAssemblyFixture,
  createBlockedOperatorHandoffAssemblyInputFixture,
  createHoldOperatorHandoffAssemblyFixture,
  createPassOperatorHandoffAssemblyFixture,
  createPassWithCaveatOperatorHandoffAssemblyFixture,
  operatorHandoffFixtures
} from "./operator-handoff-fixtures";
import type { OperatorHandoffAssemblyResult } from "../operator-handoff-assembly/operator-handoff-assembly-types";

const __dirname = dirname(fileURLToPath(import.meta.url));

function expectFixtureSafetyInvariants(result: OperatorHandoffAssemblyResult): void {
  expect(result.assemblyOnly).toBe(true);
  expect(result.handoffOnly).toBe(true);
  expect(result.reviewOnly).toBe(true);
  expect(result.draftOnly).toBe(true);
  expect(result.safety.sendReady).toBe(false);
  expect(result.safety.maySendNow).toBe(false);
  expect(result.safety.actualDiscordSend).toBe(false);
  expect(result.safety.executorImplemented).toBe(false);
  expect(result.safety.webhookUsed).toBe(false);
  expect(result.safety.botStarted).toBe(false);
  expect(result.safety.tokenRead).toBe(false);
  expect(result.safety.networkCall).toBe(false);
  expect(result.safety.externalWrite).toBe(false);
  expect(result.safety.runtimeStarted).toBe(false);
  expect(result.safety.actualQueueMutation).toBe(false);
  expect(result.safety.humanGateQueueDocModified).toBe(false);
  expect(result.safety.productionReady).toBe(false);
  expect(result.safety.execution).toBe("disabled");
  expect(result.safety.redacted).toBe(true);
}

function expectCommonFixtureFields(result: OperatorHandoffAssemblyResult): void {
  expect(typeof result.preview).toBe("string");
  expect(result.preview.length).toBeGreaterThan(100);
  expect(result.source.goalName).toBe(OPERATOR_HANDOFF_FIXTURE_GOAL_NAME);
  expect(result.operatorHandoffSession.goalName).toBe(OPERATOR_HANDOFF_FIXTURE_GOAL_NAME);
  expect(result.operatorHandoffSession.decisionChoices.length).toBeGreaterThan(0);
  expect(result.operatorHandoffSession.nextRecommendedGoal).toContain("markdown-snapshot");
  expect(result.operatorHandoffSession.humanQuestion).toContain("explicit Human GO");
  expect(result.preview).toContain("APPROVE_NEXT_GOAL");
  expect(result.preview).toContain("requires explicit Human GO");
}

describe("operator handoff fixtures", () => {
  it("does not import Node fs in implementation module", () => {
    const source = readFileSync(join(__dirname, "operator-handoff-fixtures.ts"), "utf8");

    expect(source).not.toMatch(/from\s+["']node:fs["']/);
    expect(source).not.toMatch(/from\s+["']fs["']/);
  });

  it("creates READY_FOR_HUMAN_REVIEW PASS fixture", () => {
    const result = createPassOperatorHandoffAssemblyFixture();

    expect(result.status).toBe("READY_FOR_HUMAN_REVIEW");
    expect(result.operatorHandoffSession.status).toBe("READY_FOR_HUMAN_REVIEW");
    expect(result.source.goalResultStatus).toBe("PASS");
    expect(result.preview).toContain("ready for human review");
    expectCommonFixtureFields(result);
    expectFixtureSafetyInvariants(result);
  });

  it("creates READY_FOR_HUMAN_REVIEW PASS_WITH_CAVEAT fixture with caveats", () => {
    const result = createPassWithCaveatOperatorHandoffAssemblyFixture();

    expect(result.status).toBe("READY_FOR_HUMAN_REVIEW");
    expect(result.operatorHandoffSession.status).toBe("READY_FOR_HUMAN_REVIEW");
    expect(result.source.goalResultStatus).toBe("PASS_WITH_CAVEAT");
    expect(result.caveats.length).toBeGreaterThan(0);
    expect(result.caveats.some((item) => item.includes("synthesized"))).toBe(true);
    expect(result.preview).toContain("ready for human review");
    expect(result.preview).toContain("PASS_WITH_CAVEAT");
    expect(result.preview).toContain("not send approval");
    expectCommonFixtureFields(result);
    expectFixtureSafetyInvariants(result);
  });

  it("creates HOLD fixture", () => {
    const result = createHoldOperatorHandoffAssemblyFixture();

    expect(result.status).toBe("HOLD");
    expect(result.operatorHandoffSession.status).toBe("HOLD");
    expect(result.source.goalResultStatus).toBe("HOLD");
    expect(result.preview).toContain("HOLD");
    expectCommonFixtureFields(result);
    expectFixtureSafetyInvariants(result);
  });

  it("creates BLOCKED fixture", () => {
    const result = createBlockedOperatorHandoffAssemblyFixture();

    expect(result.status).toBe("BLOCKED");
    expect(result.operatorHandoffSession.status).toBe("BLOCKED");
    expect(result.source.goalResultStatus).toBe("STOP");
    expect(result.preview).toContain("BLOCKED");
    expect(result.preview).toContain("STOP");
    expectCommonFixtureFields(result);
    expectFixtureSafetyInvariants(result);
  });

  it("includes APPROVE_NEXT_GOAL requiring explicit Human GO", () => {
    const result = createPassOperatorHandoffAssemblyFixture();
    const approveChoice = result.operatorHandoffSession.decisionChoices.find(
      (row) => row.choice === "APPROVE_NEXT_GOAL"
    );

    expect(approveChoice).toBeDefined();
    expect(approveChoice?.requiresExplicitHumanGo).toBe(true);
    expect(result.preview).toContain("APPROVE_NEXT_GOAL requires explicit Human GO");
  });

  it("produces deterministic fixture outputs", () => {
    const first = createPassOperatorHandoffAssemblyFixture();
    const second = createPassOperatorHandoffAssemblyFixture();

    expect(first.operatorHandoffSession.sessionId).toBe(second.operatorHandoffSession.sessionId);
    expect(first.preview).toBe(second.preview);
    expect(first.discordReviewPacketAssembly.reviewPacket.packetId).toBe(
      second.discordReviewPacketAssembly.reviewPacket.packetId
    );
  });

  it("does not mutate blocked input fixture", () => {
    const input = createBlockedOperatorHandoffAssemblyInputFixture();
    const before = JSON.stringify(input);

    createBlockedOperatorHandoffAssemblyFixture();

    expect(JSON.stringify(input)).toBe(before);
  });

  it("exposes registry entries for all four profiles", () => {
    expect(operatorHandoffFixtures.pass.profile).toBe("PASS");
    expect(operatorHandoffFixtures.passWithCaveat.profile).toBe("PASS_WITH_CAVEAT");
    expect(operatorHandoffFixtures.hold.profile).toBe("HOLD");
    expect(operatorHandoffFixtures.blocked.profile).toBe("BLOCKED");
  });
});
