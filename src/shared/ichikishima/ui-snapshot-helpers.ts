/**
 * Command Center UI — safe snapshot helpers.
 * Converts ControlCenterShellSnapshot to a safe summary for renderer display.
 * All raw values are stripped or blocked before the summary is returned.
 */

import type { ControlCenterShellSnapshot } from "./control-center-shell-ui-contract.js";
import { isStale } from "./ui-freshness-helpers.js";

const DEFAULT_STALE_THRESHOLD_SEC = 60;

// ─── Safe Snapshot Summary ────────────────────────────────────────────────────

/**
 * A minimal safe snapshot summary for renderer display.
 * All fields are safe for display: no raw tokens, IPs, paths, or secrets.
 * productionReady and rawValuesReported are always literal false.
 */
export interface SafeSnapshotSummary {
  readonly productionReady: false;
  readonly rawValuesReported: false;
  readonly generatedAtUnixMs: number;
  readonly decision: "HOLD" | "GO_READY" | "PASS" | "PASS_WITH_CAVEAT" | "STOP";
  readonly execution: "disabled";
  readonly stale: boolean;
  readonly dataSource: string;
}

// ─── Redaction Check ─────────────────────────────────────────────────────────

/**
 * Returns "omit" if any line matches a pattern that looks like a raw/leaked value.
 * Returns "clean" if all lines appear safe.
 * Does NOT guarantee safety — it is a defense-in-depth check.
 */
export function checkRedaction(lines: readonly string[]): "clean" | "omit" {
  for (const line of lines) {
    if (looksLikeRawValue(line)) return "omit";
  }
  return "clean";
}

function looksLikeRawValue(line: string): boolean {
  return (
    // Windows absolute paths
    /[A-Za-z]:\\/.test(line) ||
    // UNC paths
    /\\{2}/.test(line) ||
    // Unix home/system paths
    /\/(?:Users|home|tmp|var|etc)\//i.test(line) ||
    // LAN IP addresses
    /192\.168\.\d{1,3}\.\d{1,3}/.test(line) ||
    // API key-like patterns (sk- prefix, 16+ chars)
    /sk-[A-Za-z0-9]{16,}/.test(line)
  );
}

// ─── Snapshot Conversion ─────────────────────────────────────────────────────

/**
 * Converts a validated ControlCenterShellSnapshot to a safe display summary.
 *
 * Decision is "HOLD" during Limited Manual Operation.
 * This will be refined in later UI phases as gate-state tracking matures.
 */
export function snapshotToSafeSummary(
  snapshot: ControlCenterShellSnapshot,
  thresholdSec: number = DEFAULT_STALE_THRESHOLD_SEC,
): SafeSnapshotSummary {
  // Defense-in-depth: if productionReady is somehow not false, return HOLD.
  if (snapshot.productionReady !== false) {
    return holdSummary(0, "invariant_failed_production_ready");
  }

  const stale = isStale(snapshot.generatedAtUnixMs, thresholdSec);

  return {
    productionReady: false,
    rawValuesReported: false,
    generatedAtUnixMs: snapshot.generatedAtUnixMs,
    decision: "HOLD",
    execution: "disabled",
    stale,
    dataSource: snapshot.snapshotSourceLabel,
  };
}

/**
 * Returns a HOLD summary for when the snapshot is unavailable (null, error, missing).
 * stale is always true for a hold summary.
 */
export function holdSummary(
  generatedAtUnixMs: number,
  dataSource: string,
): SafeSnapshotSummary {
  return {
    productionReady: false,
    rawValuesReported: false,
    generatedAtUnixMs,
    decision: "HOLD",
    execution: "disabled",
    stale: true,
    dataSource,
  };
}
