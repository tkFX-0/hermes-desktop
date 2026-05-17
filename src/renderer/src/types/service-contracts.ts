/**
 * Command Center UI — per-page service data contracts.
 * These describe what the renderer receives after safe redaction.
 * All safety invariants are encoded as literal types.
 * Type-only. No runtime behavior. No imports.
 */

// ─── Universal Safety Invariants ────────────────────────────────────────────

/** All Command Center UI service responses must include these fields. */
export interface SafetyInvariants {
  readonly productionReady: false;
  readonly rawValuesReported: false;
}

// ─── Safe Snapshot (Operator / Inspector) ────────────────────────────────────

/** Redacted safety state summary — safe for UI display. */
export interface SafeSnapshotData extends SafetyInvariants {
  readonly generatedAtUnixMs: number;
  readonly decision: "HOLD" | "GO_READY" | "PASS" | "PASS_WITH_CAVEAT" | "STOP";
  readonly execution: "disabled";
  readonly komashikiState?: string;
  readonly phaseProgress?: string;
  readonly currentSession?: string;
  readonly caveats?: readonly string[];
  readonly nextHumanAction?: string;
  readonly stale: boolean;
  readonly dataSource: string;
}

// ─── Local Chat ──────────────────────────────────────────────────────────────

export type ChatMessageRole = "user" | "assistant";

/** A single message in the local chat history. */
export interface LocalChatMessage {
  readonly id: string;
  readonly role: ChatMessageRole;
  /** Display-safe text. No raw tokens, IPs, or secrets. */
  readonly content: string;
  readonly timestampUnixMs: number;
}

/** What the chat send action submits. */
export interface LocalChatSendPayload {
  readonly content: string;
  /**
   * Always local — never an external service.
   * Typed as a literal to prevent misuse.
   */
  readonly target: "local-chat-service";
}

// ─── Draft Outbox ────────────────────────────────────────────────────────────

/**
 * UI-layer view of a single draft item.
 * Safety invariants encoded as literals.
 * See mobile-console-types.ts for the full internal type.
 */
export interface UIDraftOutboxItem extends SafetyInvariants {
  readonly id: string;
  readonly category: string;
  readonly draftState:
    | "draft_only"
    | "waiting_human"
    | "held"
    | "rejected"
    | "expired"
    | "archived";
  /** Display-safe draft content. Raw values must be redacted before assignment. */
  readonly contentSafe: string;
  readonly externalWrite: false;
  readonly sent: false;
  readonly remoteCreated: false;
  readonly paymentOrReservation: false;
}

// ─── Approval Queue ──────────────────────────────────────────────────────────

/** UI-layer view of a single approval queue item. Display-only. */
export interface UIApprovalQueueItem {
  readonly id: string;
  readonly title: string;
  readonly statusLabel: string;
  readonly riskLevel: "low" | "medium" | "high";
  readonly requestedAtUnixMs: number;
  /** True = display-only; no interactive approve/reject action available. */
  readonly displayOnly: true;
}

// ─── Evidence ────────────────────────────────────────────────────────────────

/** A single evidence record for display. */
export interface UIEvidenceRecord {
  readonly id: string;
  readonly gate: string;
  readonly result: "PASS" | "PASS_WITH_CAVEAT" | "HOLD" | "REJECT";
  readonly dateLabel: string;
  readonly summaryLines: readonly string[];
}

// ─── Push Readiness ──────────────────────────────────────────────────────────

/**
 * Push readiness state for display.
 * The UI must NEVER trigger a git push. This is display-only.
 */
export interface PushReadinessData {
  readonly branch: string;
  readonly commitsAhead: number;
  readonly staged: number;
  readonly trackedDirty: number;
  /**
   * True when a human-initiated push GO has been received and verified.
   * The UI does not control this; it only displays the state.
   */
  readonly pushGoReceived: boolean;
  readonly stale: boolean;
}

// ─── StackChan Status ────────────────────────────────────────────────────────

/**
 * StackChan connection status. Display-only.
 * Physical operation remains HOLD.
 */
export interface StackChanStatusData {
  readonly connection: "not_arrived" | "arrived_not_connected" | "connected" | "unknown";
  /** Always false — physical operation is not approved. */
  readonly physicalOperation: false;
  /** Always false — voice is not activated. */
  readonly voiceActive: false;
  /** Always false — camera is not activated. */
  readonly cameraActive: false;
  /** Always false — mic is not activated. */
  readonly micActive: false;
  readonly faceState?: string;
  readonly stale: boolean;
}

// ─── Stop History ────────────────────────────────────────────────────────────

/** A STOP event record for display. */
export interface UIStopEvent {
  readonly id: string;
  readonly dateLabel: string;
  readonly trigger: string;
  readonly resolvedLabel: string;
}

// ─── Local Settings ──────────────────────────────────────────────────────────

/**
 * Local-only user preferences.
 * Changing these affects only the local device.
 */
export interface LocalSettingsData {
  readonly language: "ja" | "en";
  readonly theme: "light" | "dark" | "auto";
  readonly safetyStripDensity: "compact" | "normal" | "spacious";
  readonly defaultPage: string;
  readonly snapshotRefreshIntervalSeconds: 10 | 30 | 60 | null;
  readonly staleThresholdSeconds: 30 | 60 | 120;
  readonly onStale: "switch-to-hold" | "warn-only";
  readonly toastEnabled: boolean;
  readonly toastLingerSeconds: 3 | 5 | 8;
}
