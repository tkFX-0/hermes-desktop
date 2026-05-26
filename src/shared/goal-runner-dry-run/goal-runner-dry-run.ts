import { previewWorkerTaskContract } from "../worker-task-contract/worker-task-contract-preview";
import type {
  GoalRunnerDryRunDecision,
  GoalRunnerDryRunInput,
  GoalRunnerDryRunResult
} from "./goal-runner-dry-run-types";

function toDryRunDecision(previewDecision: string): GoalRunnerDryRunDecision {
  if (previewDecision === "PASS") return "PASS";
  if (previewDecision === "REJECT") return "REJECT";
  return "HOLD";
}

export function dryRunGoalContract(input: GoalRunnerDryRunInput): GoalRunnerDryRunResult {
  const preview = previewWorkerTaskContract(input.contract);
  const decision = toDryRunDecision(preview.decision);

  return {
    goalId: input.goalId,
    taskId: input.taskId,
    title: input.title,
    decision,
    canProceed: preview.canProceed,
    canCommit: preview.canCommit,
    canPush: false,
    canStartRuntime: false,
    canWriteExternal: false,
    requiresHumanGate: preview.requiresHumanGate,
    requiredHumanGates: preview.requiredHumanGates.map(String),
    reasons: [...preview.reasons],
    previewDecision: preview.decision,
    productionReady: false,
    execution: "disabled",
    rawValuesReported: false
  };
}
