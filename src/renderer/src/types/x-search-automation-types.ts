/**
 * X Search Automation type definitions.
 * Read-only patrol watchlist and scheduler design.
 * Design spec: XS_AUTO_00_READ_ONLY_AUTOMATION_GATE_DESIGN.md
 *
 * No execution. No OAuth. No scheduler active.
 * All XS-AUTO gates remain HOLD until explicit human GO.
 */

export type XSearchWatchlistStatus =
  | "HOLD"
  | "READY"
  | "ACTIVE"
  | "COOLDOWN"
  | "CLOSED"
  | "BLOCKED";

export type XSearchScheduleMode =
  | "on_demand"
  | "daily_digest"
  | "weekly_digest"
  | "emergency_watch"
  | "hold";

export type XSearchGatePhase =
  | "XS-AUTO-00"
  | "XS-AUTO-01"
  | "XS-AUTO-02"
  | "XS-AUTO-03"
  | "XS-AUTO-04"
  | "XS-AUTO-05";

export interface XSearchWatchlistItem {
  readonly id: string;
  readonly title: string;
  readonly titleEn: string;
  readonly queryExample: string;
  readonly category: string;
  readonly status: XSearchWatchlistStatus;
  readonly runCountMax: number;
  readonly runCountUsed: number;
  readonly scheduleMode: XSearchScheduleMode;
  readonly humanGoRequired: true;
  readonly goForm: string;
  readonly riskLevel: "low" | "medium" | "high";
  readonly evidencePath: string;
}

export interface XSearchPatrolSummary {
  readonly phase: XSearchGatePhase;
  readonly status: XSearchWatchlistStatus;
  readonly label: string;
  readonly labelEn: string;
  readonly notes: readonly string[];
}
