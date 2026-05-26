import { dryRunGoalContract } from "./goal-runner-dry-run";
import type {
  GoalRunnerDryRunInput,
  GoalRunnerDryRunResult
} from "./goal-runner-dry-run-types";

export type GoalRunnerDryRunReportStatus = "PASS" | "HOLD" | "REJECT";

export type GoalRunnerDryRunReport = {
  goalId: string;
  taskId: string;
  title: string;
  status: GoalRunnerDryRunReportStatus;
  summary: string;
  canProceed: boolean;
  canCommit: boolean;
  canPush: false;
  canStartRuntime: false;
  canWriteExternal: false;
  requiresHumanGate: boolean;
  requiredHumanGates: string[];
  reasons: string[];
  safety: {
    productionReady: false;
    execution: "disabled";
    rawValuesReported: false;
    runtimeStarted: false;
    externalWrite: false;
  };
  redacted: true;
};

const SAFETY_BLOCK: GoalRunnerDryRunReport["safety"] = {
  productionReady: false,
  execution: "disabled",
  rawValuesReported: false,
  runtimeStarted: false,
  externalWrite: false
};

function buildReportSummary(result: GoalRunnerDryRunResult): string {
  const reasonCount = result.reasons.length;

  if (result.decision === "PASS") {
    return "Dry-run PASS: goal may proceed within contract scope (preview only; no execution).";
  }

  if (result.decision === "REJECT") {
    return `Dry-run REJECT: goal blocked (${reasonCount} reason${reasonCount === 1 ? "" : "s"}).`;
  }

  return `Dry-run HOLD: goal blocked pending review (${reasonCount} reason${reasonCount === 1 ? "" : "s"}).`;
}

export function createGoalRunnerDryRunReport(
  result: GoalRunnerDryRunResult
): GoalRunnerDryRunReport {
  return {
    goalId: result.goalId,
    taskId: result.taskId,
    title: result.title,
    status: result.decision,
    summary: buildReportSummary(result),
    canProceed: result.canProceed,
    canCommit: result.canCommit,
    canPush: false,
    canStartRuntime: false,
    canWriteExternal: false,
    requiresHumanGate: result.requiresHumanGate,
    requiredHumanGates: [...result.requiredHumanGates],
    reasons: [...result.reasons],
    safety: { ...SAFETY_BLOCK },
    redacted: true
  };
}

export function createGoalRunnerDryRunReportFromContract(
  input: GoalRunnerDryRunInput
): GoalRunnerDryRunReport {
  return createGoalRunnerDryRunReport(dryRunGoalContract(input));
}
