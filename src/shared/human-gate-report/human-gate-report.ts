import {
  createGoalRunnerDryRunReport,
  createGoalRunnerDryRunReportFromContract
} from "../goal-runner-dry-run/goal-runner-dry-run-report";
import type {
  GoalRunnerDryRunInput,
  GoalRunnerDryRunResult
} from "../goal-runner-dry-run/goal-runner-dry-run-types";
import type { GoalRunnerDryRunReport } from "../goal-runner-dry-run/goal-runner-dry-run-report";
import type {
  HumanGateActionKind,
  HumanGateReport,
  HumanGateReportStatus
} from "./human-gate-report-types";

const SAFETY_BLOCK: HumanGateReport["safety"] = {
  productionReady: false,
  execution: "disabled",
  rawValuesReported: false,
  runtimeStarted: false,
  externalWrite: false,
  uiConnected: false,
  ipcConnected: false
};

function buildGateId(goalId: string, taskId: string): string {
  return `human-gate:${goalId}:${taskId}`;
}

function inferRequestedAction(
  report: GoalRunnerDryRunReport
): HumanGateActionKind {
  if (report.status === "REJECT") return "reject";
  if (report.status === "HOLD") return "hold";

  const gates = report.requiredHumanGates;

  if (gates.some((gate) => gate.includes("Push GO"))) return "approve_push";
  if (gates.some((gate) => gate.includes("Runtime GO"))) return "approve_runtime";
  if (
    gates.some(
      (gate) =>
        gate.includes("Discord Send GO") ||
        gate.includes("Obsidian Write GO") ||
        gate.includes("StackChan Connection GO") ||
        gate.includes("External")
    )
  ) {
    return "approve_external_write";
  }
  if (report.canCommit) return "approve_commit";

  return "review";
}

function mapDryRunStatusToHumanGateStatus(
  report: GoalRunnerDryRunReport
): HumanGateReportStatus {
  if (report.status === "REJECT") return "REJECTED";
  if (report.status === "HOLD") return "HOLD";

  if (report.requiresHumanGate) return "READY_FOR_HUMAN_REVIEW";

  return "PASS_PREVIEW_ONLY";
}

function buildHumanGateSummary(report: GoalRunnerDryRunReport, status: HumanGateReportStatus): string {
  if (status === "PASS_PREVIEW_ONLY") {
    return `Human Gate preview: dry-run PASS; awaiting explicit human review before any effect (${report.requiredHumanGates.length} gate reference(s)).`;
  }

  if (status === "READY_FOR_HUMAN_REVIEW") {
    return `Human Gate review required: dry-run PASS with gate references (${report.requiredHumanGates.join(", ") || "none listed"}).`;
  }

  if (status === "REJECTED") {
    return `Human Gate blocked: dry-run REJECTED (${report.reasons.length} reason(s)).`;
  }

  return `Human Gate HOLD: dry-run blocked pending human decision (${report.reasons.length} reason(s)).`;
}

export function createHumanGateReportFromDryRunReport(
  report: GoalRunnerDryRunReport
): HumanGateReport {
  const status = mapDryRunStatusToHumanGateStatus(report);
  const canHumanApproveProceed = status === "PASS_PREVIEW_ONLY" && report.canProceed;

  return {
    gateId: buildGateId(report.goalId, report.taskId),
    goalId: report.goalId,
    taskId: report.taskId,
    title: report.title,
    status,
    summary: buildHumanGateSummary(report, status),
    requestedAction: inferRequestedAction(report),
    canHumanApproveProceed,
    canHumanApproveCommit: report.canCommit && canHumanApproveProceed,
    canHumanApprovePush: false,
    canHumanApproveRuntime: false,
    canHumanApproveExternalWrite: false,
    requiredHumanGates: [...report.requiredHumanGates],
    reasons: [...report.reasons],
    sourceDecision: report.status,
    safety: { ...SAFETY_BLOCK },
    redacted: true
  };
}

export function createHumanGateReportFromContract(
  input: GoalRunnerDryRunInput
): HumanGateReport {
  return createHumanGateReportFromDryRunReport(createGoalRunnerDryRunReportFromContract(input));
}

export function createHumanGateReportFromDryRunResult(
  result: GoalRunnerDryRunResult
): HumanGateReport {
  return createHumanGateReportFromDryRunReport(createGoalRunnerDryRunReport(result));
}
