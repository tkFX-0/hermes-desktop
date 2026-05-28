/**
 * Phase 5 — local autonomous work (dry-run plan only).
 */

import {
  evaluateLocalAutonomousWorkScope,
  type LocalWorkScopeInput,
  type LocalWorkScopeResult
} from "./local-autonomous-work";

export interface LocalWorkDryRunRequest {
  targetPath: string;
  operation: LocalWorkScopeInput["operation"];
  taskLabel: string;
}

export interface LocalWorkDryRunResult {
  execution: "disabled";
  productionReady: false;
  taskLabel: string;
  scope: LocalWorkScopeResult;
  wouldProceed: boolean;
  reasons: readonly string[];
}

export function runLocalWorkDryRun(request: LocalWorkDryRunRequest): LocalWorkDryRunResult {
  const scope = evaluateLocalAutonomousWorkScope({
    targetPath: request.targetPath,
    operation: request.operation
  });

  const reasons: string[] = [];
  if (!scope.allowed) reasons.push(scope.reason);
  reasons.push("dry_run_only_no_write");

  return {
    execution: "disabled",
    productionReady: false,
    taskLabel: request.taskLabel,
    scope,
    wouldProceed: scope.allowed && request.operation === "read",
    reasons
  };
}

export function planBoundedDocUpdate(taskLabel: string): LocalWorkDryRunResult {
  return runLocalWorkDryRun({
    targetPath: "docs/shikishima/AUTONOMY_GOAL_LEDGER.md",
    operation: "write",
    taskLabel
  });
}
