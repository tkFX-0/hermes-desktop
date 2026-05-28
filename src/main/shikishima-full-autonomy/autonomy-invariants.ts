/** Chapter 1 — global invariants (pilot default; Track D release overrides via local file). */

import { resolveOperationalRelease } from "./operational-release-state";

export const AUTONOMY_GLOBAL_INVARIANTS = {
  productionReady: false as const,
  executionEnabled: false as const,
  rawValuesReported: false as const,
  retryLoopDefault: false as const
};

export interface InvariantCheckInput {
  productionReady: boolean;
  executionEnabled: boolean;
  rawValuesReported: boolean;
}

export function getEffectiveInvariantTargets(): InvariantCheckInput {
  const release = resolveOperationalRelease();
  if (release.activated) {
    return {
      productionReady: release.productionReady,
      executionEnabled: release.executionEnabled,
      rawValuesReported: false
    };
  }
  return {
    productionReady: false,
    executionEnabled: false,
    rawValuesReported: false
  };
}

export function verifyGlobalInvariants(input: InvariantCheckInput): {
  ok: boolean;
  violations: readonly string[];
} {
  const target = getEffectiveInvariantTargets();
  const violations: string[] = [];
  if (input.productionReady !== target.productionReady) {
    violations.push("production_ready_invariant");
  }
  if (input.executionEnabled !== target.executionEnabled) {
    violations.push("execution_enabled_invariant");
  }
  if (input.rawValuesReported !== target.rawValuesReported) {
    violations.push("raw_values_invariant");
  }
  return { ok: violations.length === 0, violations };
}
