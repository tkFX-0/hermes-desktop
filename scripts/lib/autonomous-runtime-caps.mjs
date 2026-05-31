/**
 * Autonomous runtime cycle caps — persisted counter (plain Node).
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";

const COUNTER_REL = ".shikishima-memory/autonomous-runtime-counter.json";
const SESSION_REL = ".shikishima-memory/scheduler-route-cooldown.json";

export const DEFAULT_CAPS = {
  maxCyclesPerHour: 12,
  maxCyclesPerDay: 48,
  minIntervalMs: 60_000,
  routeCooldownMs: 60_000,
};

function counterPath(memoryDir) {
  return join(memoryDir, "autonomous-runtime-counter.json");
}

function sessionPath(memoryDir) {
  return join(memoryDir, "scheduler-route-cooldown.json");
}

export function readRuntimeCounter(memoryDir) {
  const path = counterPath(memoryDir);
  const nowMs = Date.now();
  if (!existsSync(path)) {
    return {
      hourStartedAtMs: nowMs,
      dayStartedAtMs: nowMs,
      hourCount: 0,
      dayCount: 0,
      lastCycleAtMs: 0,
    };
  }
  try {
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    return {
      hourStartedAtMs: nowMs,
      dayStartedAtMs: nowMs,
      hourCount: 0,
      dayCount: 0,
      lastCycleAtMs: 0,
    };
  }
}

export function writeRuntimeCounter(memoryDir, counter) {
  const path = counterPath(memoryDir);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(counter, null, 2), "utf-8");
}

/**
 * @param {object} counter
 * @param {number} nowMs
 * @param {typeof DEFAULT_CAPS} [caps]
 */
export function canRunAutonomousCycle(counter, nowMs, caps = DEFAULT_CAPS) {
  const reasons = [];
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

export function recordAutonomousCycle(counter, nowMs) {
  counter.lastCycleAtMs = nowMs;
  counter.hourCount += 1;
  counter.dayCount += 1;
}

export function readRouteCooldown(memoryDir) {
  const path = sessionPath(memoryDir);
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    return {};
  }
}

export function checkRouteCooldown(memoryDir, routeId, nowMs, cooldownMs = DEFAULT_CAPS.routeCooldownMs) {
  const map = readRouteCooldown(memoryDir);
  const last = map[routeId] ?? 0;
  if (last && nowMs - last < cooldownMs) {
    return { allowed: false, reason: "scheduler_cooldown" };
  }
  return { allowed: true, reason: null };
}

export function recordRouteCooldown(memoryDir, routeId, nowMs, _cooldownMs = DEFAULT_CAPS.routeCooldownMs) {
  const path = sessionPath(memoryDir);
  const map = readRouteCooldown(memoryDir);
  map[routeId] = nowMs;
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(map, null, 2), "utf-8");
}
