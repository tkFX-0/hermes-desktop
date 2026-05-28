/**
 * Chapter 6 — /goal done criteria validator.
 */

import type { RegistryGoal, GoalStatus } from "./goal-registry";

export interface GoalCompletionCheck {
  goalId: string;
  status: GoalStatus;
  criteriaMet: readonly boolean[];
  allMet: boolean;
  missing: readonly string[];
}

export function validateGoalCompletion(
  goal: RegistryGoal,
  criteriaResults: Record<string, boolean>
): GoalCompletionCheck {
  const criteriaMet = goal.doneCriteria.map((c) => criteriaResults[c] ?? false);
  const missing = goal.doneCriteria.filter((c) => !criteriaResults[c]);
  return {
    goalId: goal.id,
    status: goal.status,
    criteriaMet,
    allMet: missing.length === 0,
    missing
  };
}

export function canMarkGoalCompleted(check: GoalCompletionCheck): boolean {
  return check.allMet && check.status !== "DEFERRED";
}
