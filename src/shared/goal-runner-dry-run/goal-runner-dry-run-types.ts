import type { WorkerTaskContract } from "../worker-task-contract/worker-task-contract-types";

export type GoalRunnerDryRunDecision = "PASS" | "HOLD" | "REJECT";

export type GoalRunnerDryRunRequestedBy =
  | "human"
  | "composer"
  | "codex"
  | "claude-code";

export type GoalRunnerDryRunInput = {
  goalId: string;
  taskId: string;
  title: string;
  contract: WorkerTaskContract;
  requestedBy: GoalRunnerDryRunRequestedBy;
};

export type GoalRunnerDryRunResult = {
  goalId: string;
  taskId: string;
  title: string;
  decision: GoalRunnerDryRunDecision;
  canProceed: boolean;
  canCommit: boolean;
  canPush: false;
  canStartRuntime: false;
  canWriteExternal: false;
  requiresHumanGate: boolean;
  requiredHumanGates: string[];
  reasons: string[];
  previewDecision: string;
  productionReady: false;
  execution: "disabled";
  rawValuesReported: false;
};
