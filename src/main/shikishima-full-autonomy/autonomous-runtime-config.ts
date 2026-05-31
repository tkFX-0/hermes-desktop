/**
 * Phase E2 — runtime cycle caps (in-memory; optional local file later).
 */

export interface AutonomousRuntimeCaps {
  maxCyclesPerHour: number;
  maxCyclesPerDay: number;
  minIntervalMs: number;
}

export const DEFAULT_RUNTIME_CAPS: AutonomousRuntimeCaps = {
  maxCyclesPerHour: 12,
  maxCyclesPerDay: 48,
  minIntervalMs: 60_000
};

export interface RuntimeCycleCounter {
  hourStartedAtMs: number;
  dayStartedAtMs: number;
  hourCount: number;
  dayCount: number;
  lastCycleAtMs: number;
}

export function createRuntimeCycleCounter(nowMs: number): RuntimeCycleCounter {
  return {
    hourStartedAtMs: nowMs,
    dayStartedAtMs: nowMs,
    hourCount: 0,
    dayCount: 0,
    lastCycleAtMs: 0
  };
}

export function canRunAutonomousCycle(
  counter: RuntimeCycleCounter,
  nowMs: number,
  caps: AutonomousRuntimeCaps = DEFAULT_RUNTIME_CAPS
): { allowed: boolean; reasons: readonly string[] } {
  const reasons: string[] = [];
  const hourMs = 3_600_000;
  const dayMs = 86_400_000;

  if (nowMs - counter.hourStartedAtMs >= hourMs) {
    counter.hourStartedAtMs = nowMs;
    counter.hourCount = 0;
  }
  if (nowMs - counter.dayStartedAtMs >= dayMs) {
    counter.dayStartedAtMs = nowMs;
    counter.dayCount = 0;
  }

  if (counter.lastCycleAtMs > 0 && nowMs - counter.lastCycleAtMs < caps.minIntervalMs) {
    reasons.push("min_interval_not_elapsed");
  }
  if (counter.hourCount >= caps.maxCyclesPerHour) reasons.push("hourly_cap_exceeded");
  if (counter.dayCount >= caps.maxCyclesPerDay) reasons.push("daily_cap_exceeded");

  return { allowed: reasons.length === 0, reasons };
}

export function recordAutonomousCycle(counter: RuntimeCycleCounter, nowMs: number): void {
  counter.lastCycleAtMs = nowMs;
  counter.hourCount += 1;
  counter.dayCount += 1;
}
