import type { HumanGoTicket } from "./action-gate-kernel";
import {
  createSecretaryRoutineCheckinDraft,
  type SecretaryRoutineCheckinDraft,
  type SecretaryRoutineKind,
} from "./secretary-routine-checkin";
import type { ShikishimaAgentId } from "./model-assignment-registry";

export interface SecretaryRoutineSchedule {
  routineId: string;
  routineKind: SecretaryRoutineKind;
  agentId?: ShikishimaAgentId;
  message: string;
  minimumIntervalMinutes: number;
  maxRunsPerDay: number;
  enabled: boolean;
  runCountToday: number;
  lastRunAtMs?: number;
  humanGoTicket?: HumanGoTicket;
}

export interface SecretaryRoutineSchedulerState {
  paused: boolean;
  stopped: boolean;
  schedules: readonly SecretaryRoutineSchedule[];
  productionReady: false;
  execution: "disabled";
  rawValuesReported: false;
}

export function createSecretaryRoutineSchedulerState(
  schedules: readonly SecretaryRoutineSchedule[] = [],
): SecretaryRoutineSchedulerState {
  return {
    paused: true,
    stopped: false,
    schedules,
    productionReady: false,
    execution: "disabled",
    rawValuesReported: false,
  };
}

export function canRunSecretaryRoutine(
  state: SecretaryRoutineSchedulerState,
  routineId: string,
  nowMs: number,
): { allowed: boolean; reason: string } {
  if (state.stopped) return { allowed: false, reason: "scheduler_stopped" };
  if (state.paused) return { allowed: false, reason: "scheduler_paused" };
  const schedule = state.schedules.find((entry) => entry.routineId === routineId);
  if (!schedule) return { allowed: false, reason: "schedule_missing" };
  if (!schedule.enabled) return { allowed: false, reason: "schedule_disabled" };
  if (!schedule.humanGoTicket?.approvedByHuman) return { allowed: false, reason: "human_go_required" };
  if (schedule.runCountToday >= schedule.maxRunsPerDay) return { allowed: false, reason: "max_runs_reached" };
  const minMs = Math.max(15, schedule.minimumIntervalMinutes) * 60_000;
  if (schedule.lastRunAtMs !== undefined && nowMs - schedule.lastRunAtMs < minMs) {
    return { allowed: false, reason: "minimum_interval_not_elapsed" };
  }
  return { allowed: true, reason: "routine_allowed" };
}

export function draftScheduledRoutine(
  state: SecretaryRoutineSchedulerState,
  routineId: string,
  nowMs: number,
): { state: SecretaryRoutineSchedulerState; draft?: SecretaryRoutineCheckinDraft; reason: string } {
  const allowance = canRunSecretaryRoutine(state, routineId, nowMs);
  if (!allowance.allowed) return { state, reason: allowance.reason };
  const schedule = state.schedules.find((entry) => entry.routineId === routineId);
  if (!schedule) return { state, reason: "schedule_missing" };
  const nextSchedule: SecretaryRoutineSchedule = {
    ...schedule,
    runCountToday: schedule.runCountToday + 1,
    lastRunAtMs: nowMs,
  };
  return {
    state: {
      ...state,
      schedules: state.schedules.map((entry) =>
        entry.routineId === routineId ? nextSchedule : entry,
      ),
    },
    draft: createSecretaryRoutineCheckinDraft(nextSchedule),
    reason: "routine_drafted",
  };
}

