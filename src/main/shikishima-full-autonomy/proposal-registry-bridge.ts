/**
 * Phase 4 — proposal engine ↔ goal registry.
 */

import type { AutonomousProposal } from "./proposal-engine";
import { generateAutonomousProposal } from "./proposal-engine";
import {
  getActivePhaseGoal,
  type GoalRegistryOptions,
  type RegistryGoal
} from "./goal-registry";
import type { ShikishimaUnifiedStateSnapshot } from "./snapshot-types";
import type { UnifiedOutputBundle } from "./output-policy-integration";

export interface RegistryLinkedProposal extends AutonomousProposal {
  activeGoalId: string;
  activeGoalTitle: string;
  registryGoalIds: readonly string[];
  suggestedNextGoalId: string | null;
}

export function generateProposalFromRegistry(
  registry: readonly RegistryGoal[],
  snapshot: ShikishimaUnifiedStateSnapshot,
  options: GoalRegistryOptions,
  outputBundle?: UnifiedOutputBundle
): RegistryLinkedProposal {
  const active = getActivePhaseGoal(registry, options);
  const base = generateAutonomousProposal(snapshot);

  const suggestedNext =
    options.stackchanDeferred
      ? findNextNotStarted(registry, active.id)
      : base.nextRallyGoalId;

  const humanGoDraft =
    snapshot.globalDecision === "HOLD"
      ? `次のラリー: ${active.id} — ${active.doneCriteria[0] ?? "criteria in registry"}`
      : base.humanGoDraft;

  return {
    ...base,
    nextRallyGoalId: suggestedNext,
    humanGoDraft,
    activeGoalId: active.id,
    activeGoalTitle: active.title,
    registryGoalIds: registry.map((g) => g.id),
    suggestedNextGoalId: suggestedNext,
    surfaceHints: outputBundle
      ? outputBundle.outputs.map((o) => ({ surface: o.surface, preview: o.body.slice(0, 40) }))
      : base.surfaceHints
  };
}

function findNextNotStarted(
  registry: readonly RegistryGoal[],
  afterGoalId: string
): string | null {
  const idx = registry.findIndex((g) => g.id === afterGoalId);
  for (let i = idx; idx >= 0 ? i < registry.length : 0; i++) {
    const g = registry[i];
    if (g && g.status === "NOT_STARTED" && g.id.startsWith("shikishima.phase")) {
      return g.id;
    }
  }
  return registry.find((g) => g.status === "IN_PROGRESS")?.id ?? null;
}
