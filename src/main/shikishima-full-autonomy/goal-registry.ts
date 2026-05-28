/** Phase 4 — goal registry (in-memory; mirrors FULL_AUTONOMY_GOAL_REGISTRY.md). */

export type GoalStatus = "NOT_STARTED" | "IN_PROGRESS" | "HOLD" | "DEFERRED" | "COMPLETED";

export interface RegistryGoal {
  id: string;
  title: string;
  status: GoalStatus;
  dependsOn: readonly string[];
  doneCriteria: readonly string[];
}

export const STACKCHAN_DEFERRED_GOAL_IDS = [
  "shikishima.phase1.voice-completion",
  "shikishima.phase1.voice-one-shot-pilot",
  "shikishima.phase1.voice-acceptance"
] as const;

export const FULL_AUTONOMY_PHASE_GOALS: readonly RegistryGoal[] = [
  {
    id: "shikishima.phase2.unified-state-snapshot",
    title: "Unified State Snapshot",
    status: "IN_PROGRESS",
    dependsOn: [],
    doneCriteria: [
      "snapshot built from ledger context",
      "hold reason consistent across surfaces in tests"
    ]
  },
  {
    id: "shikishima.phase3.unified-output-policy",
    title: "Unified Output Policy",
    status: "NOT_STARTED",
    dependsOn: ["shikishima.phase2.unified-state-snapshot"],
    doneCriteria: ["stackchan/discord/electron/evidence outputs from one snapshot"]
  },
  {
    id: "shikishima.phase4.autonomous-proposal-engine",
    title: "Autonomous Proposal Engine",
    status: "NOT_STARTED",
    dependsOn: ["shikishima.phase3.unified-output-policy"],
    doneCriteria: ["proposal references active registry goal", "execution disabled"]
  },
  {
    id: "shikishima.phase5.local-autonomous-work",
    title: "Controlled Local Autonomous Work",
    status: "NOT_STARTED",
    dependsOn: ["shikishima.phase4.autonomous-proposal-engine"],
    doneCriteria: ["bounded path dry-run only"]
  },
  {
    id: "shikishima.phase6.external-action-controlled",
    title: "External Action Controlled Autonomy",
    status: "NOT_STARTED",
    dependsOn: ["shikishima.phase5.local-autonomous-work"],
    doneCriteria: ["dry-run evaluation for all registry routes", "no actual send"]
  },
  {
    id: "shikishima.phase7.secretary-planner",
    title: "StackChan Secretary Mode (planner only)",
    status: "NOT_STARTED",
    dependsOn: ["shikishima.phase6.external-action-controlled"],
    doneCriteria: ["secretary plan without discord wire or voice send"]
  },
  {
    id: "shikishima.phase8.scheduler-recovery",
    title: "Scheduler / Recovery",
    status: "NOT_STARTED",
    dependsOn: ["shikishima.phase7.secretary-planner"],
    doneCriteria: ["cooldown", "max_attempts", "manual override", "restoreHold"]
  },
  {
    id: "shikishima.phase9.burn-in",
    title: "Limited Burn-in",
    status: "NOT_STARTED",
    dependsOn: ["shikishima.phase8.scheduler-recovery"],
    doneCriteria: ["no runaway", "no raw leak", "no unapproved write in monitor"]
  },
  {
    id: "shikishima.phase10.full-operation-acceptance",
    title: "Full Autonomous Operation Acceptance",
    status: "NOT_STARTED",
    dependsOn: ["shikishima.phase9.burn-in"],
    doneCriteria: ["FA-01..12 evaluated", "level8Ready when all PASS"]
  },
  {
    id: "shikishima.phase1.voice-completion",
    title: "Voice Completion",
    status: "DEFERRED",
    dependsOn: [],
    doneCriteria: ["stackchan_resume gate"]
  }
] as const;

export interface GoalRegistryOptions {
  stackchanDeferred: boolean;
  voicePassCompleted?: boolean;
}

export function createDefaultGoalRegistry(
  options: GoalRegistryOptions
): readonly RegistryGoal[] {
  return FULL_AUTONOMY_PHASE_GOALS.map((g) => {
    if (
      options.voicePassCompleted &&
      (STACKCHAN_DEFERRED_GOAL_IDS as readonly string[]).includes(g.id)
    ) {
      return { ...g, status: "COMPLETED" as const };
    }
    if (
      options.stackchanDeferred &&
      (STACKCHAN_DEFERRED_GOAL_IDS as readonly string[]).includes(g.id)
    ) {
      return { ...g, status: "DEFERRED" as const };
    }
    return { ...g };
  });
}

export function getActivePhaseGoal(
  registry: readonly RegistryGoal[],
  options: GoalRegistryOptions
): RegistryGoal {
  if (options.stackchanDeferred) {
    const phase2 = registry.find((g) => g.id === "shikishima.phase2.unified-state-snapshot");
    if (phase2) return phase2;
  }
  const inProgress = registry.find((g) => g.status === "IN_PROGRESS");
  if (inProgress) return inProgress;
  const notStarted = registry.find((g) => g.status === "NOT_STARTED");
  return notStarted ?? registry[0];
}

export function advanceRegistryAfterPhaseComplete(
  registry: readonly RegistryGoal[],
  completedGoalId: string
): RegistryGoal[] {
  return registry.map((g) => {
    if (g.id === completedGoalId) return { ...g, status: "COMPLETED" as const };
    const depsMet = g.dependsOn.every((dep) => {
      const depGoal = registry.find((x) => x.id === dep);
      return depGoal?.status === "COMPLETED" || dep === completedGoalId;
    });
    if (g.status === "NOT_STARTED" && depsMet && g.dependsOn.includes(completedGoalId)) {
      return { ...g, status: "IN_PROGRESS" as const };
    }
    return { ...g };
  });
}
