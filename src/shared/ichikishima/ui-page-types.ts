/**
 * Command Center UI — page IDs, lamp states, and page-level contracts.
 * Type-only. No runtime behavior. No imports.
 */

// ─── Page IDs ───────────────────────────────────────────────────────────────

/** 13 primary pages in the Command Center. */
export type PageId =
  | "theater"
  | "operator"
  | "chat"
  | "stackchan"
  | "outbox"
  | "queue"
  | "go"
  | "evidence"
  | "stop"
  | "push"
  | "inspector"
  | "settings"
  | "help";

export const ALL_PAGE_IDS: readonly PageId[] = [
  "theater",
  "operator",
  "chat",
  "stackchan",
  "outbox",
  "queue",
  "go",
  "evidence",
  "stop",
  "push",
  "inspector",
  "settings",
  "help",
] as const;

// ─── Lamp States ─────────────────────────────────────────────────────────────

/**
 * All canonical lamp/state values for the Command Center.
 * Maps to COMMAND_CENTER_UI_STATE_LABEL_POLICY.md.
 */
export type LampState =
  | "HOLD"
  | "GO_READY"
  | "PASS"
  | "PASS_WITH_CAVEAT"
  | "STOP"
  | "REJECT"
  | "STALE"
  | "DISPLAY_ONLY"
  | "DRAFT_ONLY"
  | "COPY_ONLY"
  | "NOT_APPROVED"
  | "DISABLED"
  | "READ_ONLY"
  | "REDACTED";

/**
 * States that represent normal operational states (not error/fallback).
 * Used to determine whether fallback is needed.
 */
export type PositiveLampState = "PASS" | "PASS_WITH_CAVEAT" | "GO_READY";

/**
 * States that must never be shown when data source is unavailable.
 * Any STALE / UNKNOWN / ERROR must fall back to HOLD.
 */
export const HOLD_FALLBACK = "HOLD" as const;

// ─── Page Contract ───────────────────────────────────────────────────────────

/** Metadata describing a single Command Center page. */
export interface PageContract {
  readonly id: PageId;
  readonly labelJa: string;
  readonly labelEn: string;
  /**
   * Primary services this page depends on.
   * Components should request these on mount.
   */
  readonly primaryServices: readonly string[];
  /**
   * What to display when all services are unavailable.
   * Always HOLD — never GO_READY or PASS.
   */
  readonly unavailableFallback: "HOLD";
}

export const PAGE_CONTRACTS: readonly PageContract[] = [
  {
    id: "theater",
    labelJa: "管制室",
    labelEn: "Theater",
    primaryServices: ["safe-snapshot-service"],
    unavailableFallback: "HOLD",
  },
  {
    id: "operator",
    labelJa: "操作室",
    labelEn: "Operator",
    primaryServices: ["safe-snapshot-service", "local-chat-service"],
    unavailableFallback: "HOLD",
  },
  {
    id: "chat",
    labelJa: "チャット",
    labelEn: "Chat",
    primaryServices: ["local-chat-service", "safe-snapshot-service"],
    unavailableFallback: "HOLD",
  },
  {
    id: "stackchan",
    labelJa: "StackChan",
    labelEn: "StackChan",
    primaryServices: ["stackchan-status-service", "safe-snapshot-service"],
    unavailableFallback: "HOLD",
  },
  {
    id: "outbox",
    labelJa: "下書き",
    labelEn: "Outbox",
    primaryServices: ["draft-outbox-service"],
    unavailableFallback: "HOLD",
  },
  {
    id: "queue",
    labelJa: "承認待ち",
    labelEn: "Queue",
    primaryServices: ["approval-queue-service"],
    unavailableFallback: "HOLD",
  },
  {
    id: "go",
    labelJa: "GO",
    labelEn: "GO",
    primaryServices: [
      "runtime-observation-status-service",
      "evidence-service",
    ],
    unavailableFallback: "HOLD",
  },
  {
    id: "evidence",
    labelJa: "証跡",
    labelEn: "Evidence",
    primaryServices: ["evidence-service"],
    unavailableFallback: "HOLD",
  },
  {
    id: "stop",
    labelJa: "STOP",
    labelEn: "STOP",
    primaryServices: ["stop-history-service", "audit-incident-service"],
    unavailableFallback: "HOLD",
  },
  {
    id: "push",
    labelJa: "Push",
    labelEn: "Push",
    primaryServices: ["push-readiness-service"],
    unavailableFallback: "HOLD",
  },
  {
    id: "inspector",
    labelJa: "詳細",
    labelEn: "Inspector",
    primaryServices: [
      "safe-snapshot-service",
      "evidence-service",
      "stackchan-status-service",
      "push-readiness-service",
    ],
    unavailableFallback: "HOLD",
  },
  {
    id: "settings",
    labelJa: "設定",
    labelEn: "Settings",
    primaryServices: ["local-settings-service"],
    unavailableFallback: "HOLD",
  },
  {
    id: "help",
    labelJa: "ヘルプ",
    labelEn: "Help",
    primaryServices: [],
    unavailableFallback: "HOLD",
  },
] as const;
