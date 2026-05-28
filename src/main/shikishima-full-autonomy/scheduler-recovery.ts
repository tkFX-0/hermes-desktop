/**
 * Phase 8 — Scheduler / Recovery (in-memory session; no daemon).
 */

export type GovernorOperationalState =
  | "READY"
  | "BUSY"
  | "COOLDOWN"
  | "DEGRADED"
  | "BLOCKED"
  | "FAILED"
  | "NEEDS_HUMAN";

export interface RouteAttemptState {
  routeId: string;
  attemptCount: number;
  lastAttemptAtMs: number;
  cooldownUntilMs: number;
}

export interface SchedulerSession {
  state: GovernorOperationalState;
  routes: Map<string, RouteAttemptState>;
  manualOverrideActive: boolean;
  maxAttemptsPerRoute: number;
  defaultCooldownMs: number;
}

export function createSchedulerSession(
  maxAttemptsPerRoute = 3,
  defaultCooldownMs = 60_000
): SchedulerSession {
  return {
    state: "READY",
    routes: new Map(),
    manualOverrideActive: false,
    maxAttemptsPerRoute,
    defaultCooldownMs
  };
}

export function enforceCooldown(
  session: SchedulerSession,
  routeId: string,
  nowMs: number
): { allowed: boolean; state: GovernorOperationalState; reason?: string } {
  if (session.manualOverrideActive) {
    return { allowed: true, state: "NEEDS_HUMAN" };
  }

  const route = session.routes.get(routeId);
  if (route && nowMs < route.cooldownUntilMs) {
    session.state = "COOLDOWN";
    return { allowed: false, state: "COOLDOWN", reason: "cooldown_active" };
  }

  if (route && route.attemptCount >= session.maxAttemptsPerRoute) {
    session.state = "DEGRADED";
    return { allowed: false, state: "DEGRADED", reason: "max_attempts_exceeded" };
  }

  return { allowed: true, state: session.state };
}

export function recordRouteAttempt(
  session: SchedulerSession,
  routeId: string,
  nowMs: number
): RouteAttemptState {
  const prev = session.routes.get(routeId);
  const attemptCount = (prev?.attemptCount ?? 0) + 1;
  const next: RouteAttemptState = {
    routeId,
    attemptCount,
    lastAttemptAtMs: nowMs,
    cooldownUntilMs: nowMs + session.defaultCooldownMs
  };
  session.routes.set(routeId, next);
  if (attemptCount >= session.maxAttemptsPerRoute) session.state = "DEGRADED";
  else session.state = "BUSY";
  return next;
}

export function preventRetryLoop(session: SchedulerSession, routeId: string): boolean {
  const route = session.routes.get(routeId);
  if (!route) return true;
  return route.attemptCount < session.maxAttemptsPerRoute;
}

export function activateManualOverride(session: SchedulerSession): void {
  session.manualOverrideActive = true;
  session.state = "NEEDS_HUMAN";
}

export function restoreHold(session: SchedulerSession, routeId: string): void {
  session.routes.delete(routeId);
  if (session.routes.size === 0) session.state = "READY";
}
