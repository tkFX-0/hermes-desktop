import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  docsOnlySafeContract,
  sourceAndTestsSafeContract,
  sourceWithPackageChangeHoldContract
} from "../worker-task-contract/worker-task-contract-fixtures";
import type { WorkerTaskContract } from "../worker-task-contract/worker-task-contract-types";
import type { GoalRunnerDryRunInput } from "../goal-runner-dry-run/goal-runner-dry-run-types";
import { createDiscordHumanGateMessageDraft } from "../discord-human-gate-message-render/discord-human-gate-message-render";
import { createHumanGateReportFromContract } from "../human-gate-report/human-gate-report";
import type { HumanGateReport } from "../human-gate-report/human-gate-report-types";
import { createHumanGateQueueDisplayTargetItemFromContract } from "../human-gate-queue-display-target/human-gate-queue-display-target";
import {
  createDiscordSendPreflightIntentFromDraft,
  evaluateDiscordSendPreflight
} from "../discord-send-preflight/discord-send-preflight";
import type { DiscordSendPreflightResult } from "../discord-send-preflight/discord-send-preflight-types";
import {
  createOperatorHandoffAssembly,
  createOperatorHandoffAssemblyPreview
} from "./operator-handoff-assembly";
import type {
  OperatorHandoffAssemblyInput,
  OperatorHandoffAssemblyResult
} from "./operator-handoff-assembly-types";

const __dirname = dirname(fileURLToPath(import.meta.url));

function makeDryRunInput(contract: WorkerTaskContract): GoalRunnerDryRunInput {
  return {
    goalId: contract.goalId,
    taskId: contract.taskId,
    title: contract.summary,
    contract,
    requestedBy: "composer"
  };
}

function humanGateReport(contract: WorkerTaskContract): HumanGateReport {
  return createHumanGateReportFromContract(makeDryRunInput(contract));
}

function readyPreflight(): DiscordSendPreflightResult {
  const draft = createDiscordHumanGateMessageDraft(
    createHumanGateQueueDisplayTargetItemFromContract(makeDryRunInput(docsOnlySafeContract))
  );
  return evaluateDiscordSendPreflight(
    createDiscordSendPreflightIntentFromDraft(draft, {
      exactMessageText: "Review-only message.",
      targetChannelSummary: "#human-gate-review",
      humanGoReference: "Discord Send GO / example",
      requestedSendCount: 1
    })
  );
}

function assemblyInput(
  report: HumanGateReport,
  preflight: DiscordSendPreflightResult,
  overrides: Partial<OperatorHandoffAssemblyInput> = {}
): OperatorHandoffAssemblyInput {
  return {
    surface: "operator-handoff-assembly-input",
    humanGateReport: report,
    sendPreflightResult: preflight,
    goalName: "shikishima.example-goal",
    goalResultStatus: "PASS",
    originMainAfter: "8a08b8c",
    localCommitsAhead: ["fed333c", "8a08b8c"],
    pushedCommits: ["fed333c", "8a08b8c"],
    nextRecommendedGoal: "/goal shikishima.push-operator-handoff-assembly-and-add-operator-handoff-fixtures",
    humanQuestion: "Approve next goal?",
    humanGoReference: "Human GO / assembly-test",
    redacted: true,
    ...overrides
  };
}

function expectAssemblyInvariants(result: OperatorHandoffAssemblyResult): void {
  expect(result.assemblyOnly).toBe(true);
  expect(result.snapshotAdapterResult.adapterOnly).toBe(true);
  expect(result.discordReviewPacketAssembly.assemblyOnly).toBe(true);
  expect(result.operatorHandoffSession.sessionOnly).toBe(true);
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
  expect(result.safety.rawValuesReported).toBe(false);
  expect(result.safety.redacted).toBe(true);
  expect(result.caveats.length).toBeGreaterThan(0);
}

describe("operator handoff assembly", () => {
  it("does not import Node fs in implementation module", () => {
    const source = readFileSync(join(__dirname, "operator-handoff-assembly.ts"), "utf8");

    expect(source).not.toMatch(/from\s+["']node:fs["']/);
    expect(source).not.toMatch(/from\s+["']fs["']/);
  });

  it("creates READY_FOR_HUMAN_REVIEW from PASS goal and ready preflight", () => {
    const result = createOperatorHandoffAssembly(
      assemblyInput(humanGateReport(sourceAndTestsSafeContract), readyPreflight())
    );

    expect(result.status).toBe("READY_FOR_HUMAN_REVIEW");
    expect(result.status).toBe(result.operatorHandoffSession.status);
    expectAssemblyInvariants(result);
  });

  it("creates HOLD assembly from HOLD-like report", () => {
    const result = createOperatorHandoffAssembly(
      assemblyInput(humanGateReport(sourceWithPackageChangeHoldContract), readyPreflight(), {
        goalResultStatus: "HOLD"
      })
    );

    if (humanGateReport(sourceWithPackageChangeHoldContract).status === "HOLD") {
      expect(result.status).toBe("HOLD");
    }
    expectAssemblyInvariants(result);
  });

  it("creates BLOCKED assembly from BLOCKED-like report", () => {
    const report: HumanGateReport = {
      ...humanGateReport(sourceAndTestsSafeContract),
      status: "REJECTED",
      sourceDecision: "REJECT"
    };
    const result = createOperatorHandoffAssembly(
      assemblyInput(report, readyPreflight(), { goalResultStatus: "PASS" })
    );

    expect(result.status).toBe("BLOCKED");
    expectAssemblyInvariants(result);
  });

  it("creates BLOCKED assembly from STOP goal", () => {
    const result = createOperatorHandoffAssembly(
      assemblyInput(humanGateReport(sourceAndTestsSafeContract), readyPreflight(), {
        goalResultStatus: "STOP"
      })
    );

    expect(result.status).toBe("BLOCKED");
  });

  it("creates snapshot adapter, discord assembly, and handoff session", () => {
    const result = createOperatorHandoffAssembly(
      assemblyInput(humanGateReport(docsOnlySafeContract), readyPreflight())
    );

    expect(result.snapshotAdapterResult.surface).toBe(
      "human-gate-report-status-snapshot-adapter-result"
    );
    expect(result.discordReviewPacketAssembly.surface).toBe("discord-review-packet-assembly-result");
    expect(result.operatorHandoffSession.surface).toBe("operator-handoff-session");
    expect(typeof result.preview).toBe("string");
    expect(result.preview.length).toBeGreaterThan(100);
    expect(result.preview).toContain(result.operatorHandoffSession.sessionId);
  });

  it("preserves metadata fields", () => {
    const result = createOperatorHandoffAssembly(
      assemblyInput(humanGateReport(sourceAndTestsSafeContract), readyPreflight(), {
        sessionId: "custom-session-001",
        packetId: "custom-packet-001",
        humanGoReference: "Human GO / override"
      })
    );

    expect(result.source.goalName).toBe("shikishima.example-goal");
    expect(result.source.goalResultStatus).toBe("PASS");
    expect(result.source.humanGoReference).toBe("Human GO / override");
    expect(result.operatorHandoffSession.sessionId).toBe("custom-session-001");
    expect(result.discordReviewPacketAssembly.reviewPacket.packetId).toBe("custom-packet-001");
    expect(result.operatorHandoffSession.source.originMainAfter).toBe("8a08b8c");
    expect(result.operatorHandoffSession.source.localCommitsAhead).toEqual(["fed333c", "8a08b8c"]);
    expect(result.operatorHandoffSession.nextRecommendedGoal).toContain("operator-handoff-fixtures");
    expect(result.operatorHandoffSession.humanQuestion).toBe("Approve next goal?");
  });

  it("includes adapter caveat about synthesized readiness digest", () => {
    const result = createOperatorHandoffAssembly(
      assemblyInput(humanGateReport(sourceAndTestsSafeContract), readyPreflight())
    );

    expect(result.caveats.some((item) => item.includes("synthesized"))).toBe(true);
  });

  it("creates preview via createOperatorHandoffAssemblyPreview", () => {
    const preview = createOperatorHandoffAssemblyPreview(
      assemblyInput(humanGateReport(sourceAndTestsSafeContract), readyPreflight())
    );

    expect(preview).toContain("handoff-only");
    expect(preview).toContain("not Discord send approval");
  });

  it("does not mutate input", () => {
    const input = assemblyInput(humanGateReport(sourceAndTestsSafeContract), readyPreflight());
    const before = JSON.stringify(input);

    createOperatorHandoffAssembly(input);

    expect(JSON.stringify(input)).toBe(before);
  });
});
