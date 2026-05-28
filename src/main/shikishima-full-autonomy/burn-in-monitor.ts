/**
 * Phase 9 — Limited burn-in monitor (simulation / dry-run; no long-running daemon).
 */

export interface BurnInEvent {
  atMs: number;
  kind: string;
  routeId: string | null;
  redacted: true;
}

export interface BurnInConfig {
  maxEventsPerWindow: number;
  windowMs: number;
  maxDurationMs: number;
}

export interface BurnInMonitor {
  startedAtMs: number;
  config: BurnInConfig;
  events: BurnInEvent[];
  rawLeakDetected: boolean;
  unapprovedWriteDetected: boolean;
}

export function createBurnInMonitor(
  startedAtMs: number,
  config: Partial<BurnInConfig> = {}
): BurnInMonitor {
  return {
    startedAtMs,
    config: {
      maxEventsPerWindow: config.maxEventsPerWindow ?? 50,
      windowMs: config.windowMs ?? 3_600_000,
      maxDurationMs: config.maxDurationMs ?? 7_200_000
    },
    events: [],
    rawLeakDetected: false,
    unapprovedWriteDetected: false
  };
}

export function recordBurnInEvent(
  monitor: BurnInMonitor,
  atMs: number,
  kind: string,
  routeId: string | null = null
): void {
  monitor.events.push({ atMs, kind, routeId, redacted: true });
}

export function flagBurnInViolation(
  monitor: BurnInMonitor,
  violation: "raw_leak" | "unapproved_write"
): void {
  if (violation === "raw_leak") monitor.rawLeakDetected = true;
  if (violation === "unapproved_write") monitor.unapprovedWriteDetected = true;
}

export interface BurnInEvaluation {
  pass: boolean;
  reasons: readonly string[];
  eventCount: number;
  runawayDetected: boolean;
}

export function evaluateBurnInMonitor(
  monitor: BurnInMonitor,
  nowMs: number
): BurnInEvaluation {
  const reasons: string[] = [];
  const elapsed = nowMs - monitor.startedAtMs;

  if (elapsed > monitor.config.maxDurationMs) reasons.push("duration_exceeded");

  const windowStart = nowMs - monitor.config.windowMs;
  const recent = monitor.events.filter((e) => e.atMs >= windowStart);
  const runaway = recent.length > monitor.config.maxEventsPerWindow;

  if (runaway) reasons.push("runaway_event_rate");
  if (monitor.rawLeakDetected) reasons.push("raw_leak");
  if (monitor.unapprovedWriteDetected) reasons.push("unapproved_write");

  return {
    pass: reasons.length === 0,
    reasons,
    eventCount: monitor.events.length,
    runawayDetected: runaway
  };
}

/** Preset durations for evidence templates (labels only). */
export const BURN_IN_PRESETS = ["2h", "6h", "24h", "3d"] as const;
