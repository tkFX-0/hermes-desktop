/**
 * Command Center UI — per-page display data mappers.
 * Maps SafeSnapshotSummary to page-specific display shapes.
 * Display-only. No IPC calls. No side effects. No runtime behavior.
 */

import type { SafeSnapshotSummary } from "../../../shared/ichikishima/ui-snapshot-helpers";
import {
  holdSummary,
} from "../../../shared/ichikishima/ui-snapshot-helpers";
import { getStaleBadge } from "../../../shared/ichikishima/ui-freshness-helpers";

// ─── Operator Page ────────────────────────────────────────────────────────────

export interface OperatorPageDisplayData {
  readonly decision: SafeSnapshotSummary["decision"];
  readonly productionReady: false;
  readonly execution: "disabled";
  readonly stale: boolean;
  readonly staleBadge: "STALE" | null;
  readonly dataSource: string;
}

export function toOperatorPageData(
  summary: SafeSnapshotSummary | null,
): OperatorPageDisplayData {
  const s = summary ?? holdSummary(0, "unavailable");
  return {
    decision: s.stale ? "HOLD" : s.decision,
    productionReady: false,
    execution: "disabled",
    stale: s.stale,
    staleBadge: s.stale ? getStaleBadge() : null,
    dataSource: s.dataSource,
  };
}

// ─── Chat Page ────────────────────────────────────────────────────────────────

export interface ChatPageDisplayData {
  readonly decisionStrip: SafeSnapshotSummary["decision"];
  readonly productionReady: false;
  readonly stale: boolean;
  readonly staleBadge: "STALE" | null;
}

export function toChatPageData(
  summary: SafeSnapshotSummary | null,
): ChatPageDisplayData {
  const s = summary ?? holdSummary(0, "unavailable");
  return {
    decisionStrip: s.stale ? "HOLD" : s.decision,
    productionReady: false,
    stale: s.stale,
    staleBadge: s.stale ? getStaleBadge() : null,
  };
}

// ─── StackChan Page ───────────────────────────────────────────────────────────

export interface StackChanPageDisplayData {
  readonly decisionStrip: SafeSnapshotSummary["decision"];
  readonly productionReady: false;
  /** Always false — physical operation is not approved. */
  readonly physicalOperation: false;
  /** Always false — voice is not activated. */
  readonly voiceActive: false;
  /** Always false — camera is not activated. */
  readonly cameraActive: false;
  /** Always false — mic is not activated. */
  readonly micActive: false;
  readonly stale: boolean;
  readonly staleBadge: "STALE" | null;
}

export function toStackChanPageData(
  summary: SafeSnapshotSummary | null,
): StackChanPageDisplayData {
  const s = summary ?? holdSummary(0, "unavailable");
  return {
    decisionStrip: s.stale ? "HOLD" : s.decision,
    productionReady: false,
    physicalOperation: false,
    voiceActive: false,
    cameraActive: false,
    micActive: false,
    stale: s.stale,
    staleBadge: s.stale ? getStaleBadge() : null,
  };
}

// ─── Push Page ────────────────────────────────────────────────────────────────

export interface PushPageDisplayData {
  readonly decisionStrip: SafeSnapshotSummary["decision"];
  readonly productionReady: false;
  readonly stale: boolean;
  readonly staleBadge: "STALE" | null;
}

export function toPushPageData(
  summary: SafeSnapshotSummary | null,
): PushPageDisplayData {
  const s = summary ?? holdSummary(0, "unavailable");
  return {
    decisionStrip: s.stale ? "HOLD" : s.decision,
    productionReady: false,
    stale: s.stale,
    staleBadge: s.stale ? getStaleBadge() : null,
  };
}

// ─── Generic Safety Strip ─────────────────────────────────────────────────────

/** Used by any page that only needs the safety strip. */
export interface SafetyStripDisplayData {
  readonly decision: SafeSnapshotSummary["decision"];
  readonly productionReady: false;
  readonly execution: "disabled";
  readonly stale: boolean;
  readonly staleBadge: "STALE" | null;
}

export function toSafetyStripData(
  summary: SafeSnapshotSummary | null,
): SafetyStripDisplayData {
  const s = summary ?? holdSummary(0, "unavailable");
  return {
    decision: s.stale ? "HOLD" : s.decision,
    productionReady: false,
    execution: "disabled",
    stale: s.stale,
    staleBadge: s.stale ? getStaleBadge() : null,
  };
}
