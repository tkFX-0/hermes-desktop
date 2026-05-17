import type { MobileConsoleSnapshot, MobileDataSource } from "./mobile-console-types";
import { MOBILE_CONSOLE_DEFAULT_SNAPSHOT } from "./mobile-console-snapshot";

const FORBIDDEN_FIELD_PATTERNS = [
  /apikey/i, /api_key/i, /token/i, /secret/i, /password/i,
  /private.?key/i, /credential/i, /absolutepath/i, /localpath/i,
  /wslslot/i, /distroname/i, /rawconfig/i, /envvalue/i,
  /localonly/i, /placeholder.*value/i,
];

/** Returns true if a field name looks like it may carry sensitive data. */
function isForbiddenField(key: string): boolean {
  return FORBIDDEN_FIELD_PATTERNS.some((re) => re.test(key));
}

/**
 * Scrub an unknown value so it is safe to surface in the mobile UI.
 * - Objects: recurse, dropping forbidden fields.
 * - Strings: return as-is (no path patterns checked — callers must not pass raw paths).
 * - Unknown / null / undefined: return the supplied fallback.
 */
function scrub(value: unknown, fallback: string = "redacted"): unknown {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "boolean" || typeof value === "number") return value;
  if (typeof value === "string") return value.length > 0 ? value : fallback;
  if (Array.isArray(value)) return value.map((v) => scrub(v, fallback));
  if (typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (isForbiddenField(k)) {
        out[k] = fallback;
      } else {
        out[k] = scrub(v, fallback);
      }
    }
    return out;
  }
  return fallback;
}

/**
 * Build a safe MobileConsoleSnapshot from partial/unknown runtime data.
 *
 * Phase 2A: `source` is "redacted_snapshot_phase2a" only when a real
 * ControlCenter snapshot is wired up. Until then, callers pass nothing
 * and receive the static default with dataSource="static_phase1".
 *
 * INVARIANTS that can never be overridden:
 *   productionReady: false
 *   rawValuesReported: false
 *   execution: "disabled"
 *   level3: "not_approved"  (until explicit separate gate)
 */
export function buildMobileSnapshot(
  partial?: Partial<Omit<MobileConsoleSnapshot, "productionReady" | "rawValuesReported">>,
  dataSource: MobileDataSource = "static_phase1",
): MobileConsoleSnapshot {
  if (!partial) {
    return { ...MOBILE_CONSOLE_DEFAULT_SNAPSHOT, dataSource };
  }

  const base = MOBILE_CONSOLE_DEFAULT_SNAPSHOT;

  return {
    // safety invariants — never overridden
    productionReady: false,
    rawValuesReported: false,
    execution: "disabled",
    level3: "not_approved",
    robotMotion: "HOLD",

    // decision: only "HOLD" or "stop" allowed
    decision: partial.decision === "stop" ? "stop" : "HOLD",

    appStatus: typeof partial.appStatus === "string" ? (scrub(partial.appStatus) as string) : base.appStatus,
    phase: typeof partial.phase === "string" ? (scrub(partial.phase) as string) : base.phase,

    b3Progress: partial.b3Progress ?? base.b3Progress,
    pushReadiness: partial.pushReadiness ?? base.pushReadiness,
    agentTeam: partial.agentTeam ?? base.agentTeam,
    auditSummary: partial.auditSummary ?? base.auditSummary,
    stopHistory: partial.stopHistory ?? base.stopHistory,

    generatedAt: partial.generatedAt ?? new Date().toISOString(),
    dataSource,

    // Display-only companion and action fields — no raw values allowed.
    komashikiState: partial.komashikiState ?? base.komashikiState,
    caveats: partial.caveats ?? base.caveats,
    nextHumanAction:
      typeof partial.nextHumanAction === "string"
        ? (scrub(partial.nextHumanAction) as string)
        : base.nextHumanAction,
    phaseProgress:
      typeof partial.phaseProgress === "string"
        ? (scrub(partial.phaseProgress) as string)
        : base.phaseProgress,
    currentSession:
      typeof partial.currentSession === "string"
        ? (scrub(partial.currentSession) as string)
        : base.currentSession,
  };
}

export { isForbiddenField };
