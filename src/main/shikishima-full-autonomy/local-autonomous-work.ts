/** Phase 5 — bounded local autonomous work scope evaluator. */

export const LOCAL_WORK_ALLOWED_PREFIXES = [
  "docs/shikishima/",
  "docs/ichikishima/",
  "src/main/ichikishima/autonomy-zone/",
  "src/main/shikishima-full-autonomy/",
  "tests/hermes/zone/"
] as const;

export const LOCAL_WORK_DENIED_PATTERNS = [
  ".env",
  "memory/",
  "mt5",
  "ea/",
  "git push",
  "production",
  "api_key",
  "secret"
] as const;

export interface LocalWorkScopeInput {
  targetPath: string;
  operation: "read" | "write" | "delete" | "execute";
}

export type LocalWorkScopeResult =
  | { allowed: true; matchedPrefix: string }
  | { allowed: false; reason: string };

export function evaluateLocalAutonomousWorkScope(
  input: LocalWorkScopeInput
): LocalWorkScopeResult {
  const normalized = input.targetPath.replace(/\\/g, "/").toLowerCase();

  for (const denied of LOCAL_WORK_DENIED_PATTERNS) {
    if (normalized.includes(denied)) {
      return { allowed: false, reason: `denied_pattern:${denied}` };
    }
  }

  if (input.operation === "execute" || input.operation === "delete") {
    return { allowed: false, reason: "operation_not_in_phase5_scope" };
  }

  const prefix = LOCAL_WORK_ALLOWED_PREFIXES.find((p) => normalized.startsWith(p));
  if (!prefix) {
    return { allowed: false, reason: "outside_bounded_prefix" };
  }

  return { allowed: true, matchedPrefix: prefix };
}
