/**
 * Command Center UI — freshness and HOLD fallback helpers.
 * Pure functions. No side effects. No imports beyond shared types.
 */

import type { DataUnavailableReason, SafetyFallbackState } from "./ui-safety-types.js";

/**
 * Returns true if the snapshot timestamp is older than the threshold,
 * undefined, or non-finite. Any of these conditions indicates stale data.
 */
export function isStale(
  generatedAtUnixMs: number | undefined,
  thresholdSec: number,
): boolean {
  if (generatedAtUnixMs === undefined || !Number.isFinite(generatedAtUnixMs)) {
    return true;
  }
  // A timestamp in the future (clock skew) is treated as stale.
  if (generatedAtUnixMs > Date.now()) {
    return true;
  }
  return Date.now() - generatedAtUnixMs > thresholdSec * 1000;
}

/**
 * Returns "HOLD" for any data unavailability reason.
 * This is the universal fallback: HOLD is always the safe default.
 */
export function getHoldFallback(_reason: DataUnavailableReason): SafetyFallbackState {
  return "HOLD";
}

/** Returns the canonical STALE badge string for stale data display. */
export function getStaleBadge(): "STALE" {
  return "STALE";
}

/**
 * Returns "HOLD" when summary is null/stale, otherwise returns the provided decision.
 * Prevents GO_READY or PASS from being shown when data is unavailable.
 */
export function resolveDecision(
  decision: "HOLD" | "GO_READY" | "PASS" | "PASS_WITH_CAVEAT" | "STOP",
  stale: boolean,
): "HOLD" | "GO_READY" | "PASS" | "PASS_WITH_CAVEAT" | "STOP" {
  return stale ? "HOLD" : decision;
}
