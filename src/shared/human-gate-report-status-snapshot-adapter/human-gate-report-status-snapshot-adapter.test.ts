import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  docsOnlySafeContract,
  productionReadyRejectedContract,
  sourceAndTestsSafeContract,
  sourceWithPackageChangeHoldContract
} from "../worker-task-contract/worker-task-contract-fixtures";
import type { WorkerTaskContract } from "../worker-task-contract/worker-task-contract-types";
import type { GoalRunnerDryRunInput } from "../goal-runner-dry-run/goal-runner-dry-run-types";
import { createHumanGateReportFromContract } from "../human-gate-report/human-gate-report";
import type { HumanGateReport } from "../human-gate-report/human-gate-report-types";
import {
  createHumanGateStatusSnapshotFromHumanGateReport,
  renderHumanGateReportStatusSnapshotAdapterPreview
} from "./human-gate-report-status-snapshot-adapter";
import type {
  HumanGateReportStatusSnapshotAdapterInput,
  HumanGateReportStatusSnapshotAdapterResult
} from "./human-gate-report-status-snapshot-adapter-types";

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

function adapterInput(
  report: HumanGateReport,
  overrides: Partial<HumanGateReportStatusSnapshotAdapterInput> = {}
): HumanGateReportStatusSnapshotAdapterInput {
  return {
    surface: "human-gate-report-status-snapshot-adapter-input",
    humanGateReport: report,
    humanGoReference: "Human GO / adapter-test",
    redacted: true,
    ...overrides
  };
}

function expectAdapterInvariants(result: HumanGateReportStatusSnapshotAdapterResult): void {
  expect(result.adapterOnly).toBe(true);
  expect(result.snapshot.surface).toBe("human-gate-status-snapshot");
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

describe("human gate report status snapshot adapter", () => {
  it("does not import Node fs in implementation module", () => {
    const source = readFileSync(
      join(__dirname, "human-gate-report-status-snapshot-adapter.ts"),
      "utf8"
    );

    expect(source).not.toMatch(/from\s+["']node:fs["']/);
    expect(source).not.toMatch(/from\s+["']fs["']/);
  });

  it("creates REVIEW_READY_CANDIDATE snapshot from READY_FOR_HUMAN_REVIEW-like report", () => {
    const report = humanGateReport(sourceAndTestsSafeContract);
    const result = createHumanGateStatusSnapshotFromHumanGateReport(adapterInput(report));

    expect(["READY_FOR_HUMAN_REVIEW", "PASS_PREVIEW_ONLY"]).toContain(report.status);
    expect(result.status).toBe("REVIEW_READY_CANDIDATE");
    expect(result.snapshot.status).toBe("REVIEW_READY_CANDIDATE");
    expect(result.status).toBe(result.snapshot.status);
    expectAdapterInvariants(result);
  });

  it("creates REVIEW_READY_CANDIDATE from docs-only safe report when review-ready", () => {
    const report = humanGateReport(docsOnlySafeContract);
    const result = createHumanGateStatusSnapshotFromHumanGateReport(adapterInput(report));

    if (report.status === "READY_FOR_HUMAN_REVIEW" || report.status === "PASS_PREVIEW_ONLY") {
      expect(result.status).toBe("REVIEW_READY_CANDIDATE");
    }
  });

  it("creates HOLD snapshot from HOLD-like report", () => {
    const report = humanGateReport(sourceWithPackageChangeHoldContract);
    const result = createHumanGateStatusSnapshotFromHumanGateReport(adapterInput(report));

    expect(["HOLD", "REJECTED"]).toContain(report.status);
    if (report.status === "HOLD") {
      expect(result.status).toBe("HOLD");
      expect(result.snapshot.status).toBe("HOLD");
    }
    expectAdapterInvariants(result);
  });

  it("creates BLOCKED snapshot from REJECTED-like report", () => {
    const report: HumanGateReport = {
      ...humanGateReport(productionReadyRejectedContract),
      status: "REJECTED",
      sourceDecision: "REJECT"
    };
    const result = createHumanGateStatusSnapshotFromHumanGateReport(adapterInput(report));

    expect(result.status).toBe("BLOCKED");
    expect(result.snapshot.status).toBe("BLOCKED");
    expectAdapterInvariants(result);
  });

  it("defaults sourceOfTruth to ledger and display surfaces", () => {
    const result = createHumanGateStatusSnapshotFromHumanGateReport(
      adapterInput(humanGateReport(sourceAndTestsSafeContract))
    );

    expect(result.source.sourceOfTruth).toBe("ledger");
    expect(result.source.primaryDisplaySurface).toBe("discord");
    expect(result.source.fallbackDisplaySurface).toBe("control-center");
    expect(result.snapshot.sourceOfTruth).toBe("ledger");
    expect(result.snapshot.primaryDisplaySurface).toBe("discord");
  });

  it("preserves humanGoReference", () => {
    const result = createHumanGateStatusSnapshotFromHumanGateReport(
      adapterInput(humanGateReport(sourceAndTestsSafeContract), {
        humanGoReference: "Human GO / override"
      })
    );

    expect(result.source.humanGoReference).toBe("Human GO / override");
    expect(result.snapshot.source.humanGoReference).toBe("Human GO / override");
  });

  it("builds deterministic caveats", () => {
    const input = adapterInput(humanGateReport(sourceAndTestsSafeContract));
    const first = createHumanGateStatusSnapshotFromHumanGateReport(input);
    const second = createHumanGateStatusSnapshotFromHumanGateReport(input);

    expect(first.caveats).toEqual(second.caveats);
  });

  it("renders preview string", () => {
    const result = createHumanGateStatusSnapshotFromHumanGateReport(
      adapterInput(humanGateReport(sourceAndTestsSafeContract))
    );
    const preview = renderHumanGateReportStatusSnapshotAdapterPreview(result);

    expect(typeof preview).toBe("string");
    expect(preview).toContain("adapter-only");
    expect(preview).toContain("review-only");
    expect(preview).toContain("not Discord send approval");
  });

  it("does not mutate input", () => {
    const input = adapterInput(humanGateReport(sourceAndTestsSafeContract));
    const before = JSON.stringify(input);

    createHumanGateStatusSnapshotFromHumanGateReport(input);

    expect(JSON.stringify(input)).toBe(before);
  });
});
