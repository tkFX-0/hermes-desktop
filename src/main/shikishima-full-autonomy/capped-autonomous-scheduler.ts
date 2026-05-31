/**
 * Phase E4 — capped scheduler: runtime cycle caps + per-route cooldown (no external I/O).
 */

import {
  canRunAutonomousCycle,
  createRuntimeCycleCounter,
  type RuntimeCycleCounter
} from "./autonomous-runtime-config";
import { constitutionalGoEffectOverrides } from "./constitutional-go-state";
import { planDiscordReadIntake } from "./discord-read-intake-plan";
import {
  createSchedulerSession,
  enforceCooldown,
  recordRouteAttempt,
  type GovernorOperationalState,
  type SchedulerSession
} from "./scheduler-recovery";
import { runAutonomousMaintenanceCycle, type AutonomousCycleResult } from "./run-autonomous-cycle";
import type { DiscordReadIntakePlanResult } from "./discord-read-intake-plan";

export const CAPPED_SCHEDULER_ROUTES = [
  "autonomy.maintenance",
  "discord.read",
  "stackchan.voice"
] as const;

export type CappedSchedulerRouteId = (typeof CAPPED_SCHEDULER_ROUTES)[number];

export interface CappedSchedulerContext {
  session: SchedulerSession;
  cycleCounter: RuntimeCycleCounter;
}

export interface CappedSchedulerTickInput {
  routeId: CappedSchedulerRouteId;
  nowMs: number;
  humanGoApproved?: boolean;
  oneShotDeclared?: boolean;
  explicitPermittedGo?: boolean;
  channelConfigured?: boolean;
  discordReadLimit?: number;
}

export interface CappedSchedulerTickResult {
  routeId: CappedSchedulerRouteId;
  allowed: boolean;
  reasons: readonly string[];
  schedulerState: GovernorOperationalState;
  countsTowardCycleCap: boolean;
  maintenance: AutonomousCycleResult | null;
  discordReadPlan: DiscordReadIntakePlanResult | null;
}

export function createCappedSchedulerContext(nowMs: number): CappedSchedulerContext {
  return {
    session: createSchedulerSession(3, 60_000),
    cycleCounter: createRuntimeCycleCounter(nowMs)
  };
}

function usesCycleCap(routeId: CappedSchedulerRouteId): boolean {
  return routeId === "autonomy.maintenance";
}

export function evaluateCappedSchedulerGate(
  ctx: CappedSchedulerContext,
  input: Pick<CappedSchedulerTickInput, "routeId" | "nowMs">
): Pick<CappedSchedulerTickResult, "allowed" | "reasons" | "schedulerState" | "countsTowardCycleCap"> {
  const reasons: string[] = [];

  if (usesCycleCap(input.routeId)) {
    const cap = canRunAutonomousCycle(ctx.cycleCounter, input.nowMs);
    if (!cap.allowed) reasons.push(...cap.reasons);
  }

  const cooldown = enforceCooldown(ctx.session, input.routeId, input.nowMs);
  if (!cooldown.allowed) {
    reasons.push(cooldown.reason ?? "scheduler_cooldown");
  }

  return {
    allowed: reasons.length === 0,
    reasons,
    schedulerState: cooldown.state,
    countsTowardCycleCap: usesCycleCap(input.routeId)
  };
}

export function runCappedAutonomousTick(
  ctx: CappedSchedulerContext,
  input: CappedSchedulerTickInput
): CappedSchedulerTickResult {
  const gate = evaluateCappedSchedulerGate(ctx, input);

  const base: CappedSchedulerTickResult = {
    routeId: input.routeId,
    allowed: gate.allowed,
    reasons: gate.reasons,
    schedulerState: gate.schedulerState,
    countsTowardCycleCap: gate.countsTowardCycleCap,
    maintenance: null,
    discordReadPlan: null
  };

  if (!base.allowed) return base;

  recordRouteAttempt(ctx.session, input.routeId, input.nowMs);

  if (input.routeId === "autonomy.maintenance") {
    const maintenance = runAutonomousMaintenanceCycle(ctx.cycleCounter, input.nowMs);
    return {
      ...base,
      allowed: maintenance.allowed,
      reasons: maintenance.reasons,
      schedulerState: ctx.session.state,
      maintenance
    };
  }

  if (input.routeId === "discord.read") {
    const goFx = constitutionalGoEffectOverrides();
    const discordReadPlan = planDiscordReadIntake({
      channelConfigured: input.channelConfigured ?? false,
      humanGoApproved: input.humanGoApproved ?? goFx.humanGoApproved,
      oneShotDeclared: input.oneShotDeclared ?? goFx.oneShotDeclared,
      messageLimit: input.discordReadLimit ?? 10
    });
    const allowed = discordReadPlan.decision !== "BLOCKED";
    return {
      ...base,
      allowed,
      reasons: discordReadPlan.reasons,
      schedulerState: ctx.session.state,
      discordReadPlan
    };
  }

  const goFx = constitutionalGoEffectOverrides();
  if (!input.explicitPermittedGo && !goFx.explicitPermittedGo) {
    return {
      ...base,
      allowed: false,
      reasons: ["stackchan_voice_requires_explicit_permitted_go"],
      schedulerState: ctx.session.state
    };
  }

  return {
    ...base,
    allowed: true,
    reasons: ["voice_route_acknowledged_scheduler_only_no_device_send"],
    schedulerState: ctx.session.state
  };
}
