/**
 * Wall-clock burn-in evidence store (local gitignored JSON).
 * Does not enable execution — human GO still required for burnInWallClockPass.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import {
  evaluateBurnInMonitor,
  createBurnInMonitor,
  recordBurnInEvent
} from "./burn-in-monitor";

const REL = join(".shikishima-memory", "burn-in-wall-clock.json");

export interface BurnInWallClockStore {
  version: 1;
  startedAtIso: string;
  lastTickAtIso: string | null;
  tickCount: number;
  humanGoAcknowledged: boolean;
  events: readonly { atIso: string; kind: string; routeId: string | null }[];
}

function defaultStore(): BurnInWallClockStore {
  return {
    version: 1,
    startedAtIso: new Date().toISOString(),
    lastTickAtIso: null,
    tickCount: 0,
    humanGoAcknowledged: false,
    events: []
  };
}

function storePath(projectRoot: string): string {
  return join(projectRoot, REL);
}

export function readBurnInWallClockStore(projectRoot = process.cwd()): BurnInWallClockStore {
  const path = storePath(projectRoot);
  if (!existsSync(path)) return defaultStore();
  try {
    return JSON.parse(readFileSync(path, "utf8")) as BurnInWallClockStore;
  } catch {
    return defaultStore();
  }
}

export function writeBurnInWallClockStore(
  projectRoot: string,
  store: BurnInWallClockStore
): void {
  const path = storePath(projectRoot);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(store, null, 2), "utf8");
}

/** Append one capped tick (e.g. from autonomous-runtime-tick). */
export function recordBurnInWallClockTick(
  projectRoot: string,
  kind: string,
  routeId: string | null = null
): BurnInWallClockStore {
  const store = readBurnInWallClockStore(projectRoot);
  const atIso = new Date().toISOString();
  const events = [
    { atIso, kind, routeId },
    ...(store.events ?? [])
  ].slice(0, 200);
  const next: BurnInWallClockStore = {
    ...store,
    lastTickAtIso: atIso,
    tickCount: (store.tickCount ?? 0) + 1,
    events
  };
  writeBurnInWallClockStore(projectRoot, next);
  return next;
}

export interface BurnInWallClockEvaluation {
  simulationPass: boolean;
  humanGoAcknowledged: boolean;
  tickCount: number;
  reasons: readonly string[];
  /** True only when simulation passes AND human acknowledged in local file. */
  wallClockPass: boolean;
}

export function evaluateBurnInWallClock(projectRoot = process.cwd()): BurnInWallClockEvaluation {
  const store = readBurnInWallClockStore(projectRoot);
  const nowMs = Date.now();
  const monitor = createBurnInMonitor(nowMs - 3_600_000, {
    maxEventsPerWindow: 100,
    windowMs: 3_600_000,
    maxDurationMs: 72 * 3_600_000
  });
  for (const e of [...(store.events ?? [])].reverse()) {
    recordBurnInEvent(monitor, Date.parse(e.atIso) || nowMs, e.kind, e.routeId);
  }
  const sim = evaluateBurnInMonitor(monitor, nowMs);
  const minTicks = 3;
  const reasons = [...sim.reasons];
  if ((store.tickCount ?? 0) < minTicks) reasons.push("min_ticks_not_met");
  const simulationPass = sim.pass && (store.tickCount ?? 0) >= minTicks;
  const humanGoAcknowledged = store.humanGoAcknowledged === true;
  return {
    simulationPass,
    humanGoAcknowledged,
    tickCount: store.tickCount ?? 0,
    reasons,
    wallClockPass: simulationPass && humanGoAcknowledged
  };
}
