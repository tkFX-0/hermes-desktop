/**
 * Command Center UI — safety type contracts.
 * Encodes button policy, locked settings, and safety fallback semantics.
 * Type-only. No runtime behavior. No imports.
 */

// ─── Button Category ─────────────────────────────────────────────────────────

/**
 * What kind of action a button or control performs.
 * All categories map to COMMAND_CENTER_UI_BUTTON_WORDING_POLICY.md.
 */
export type ButtonCategory =
  /** Copies text to clipboard. No side effects. */
  | "copy-only"
  /** Navigates between pages. No side effects. */
  | "navigate"
  /** Requests a fresh data snapshot from a local service. */
  | "refresh-snapshot"
  /** Sends a message to local-chat-service ONLY. Never external. */
  | "local-chat-send"
  /** Marks an item as reviewed in local state only. No external effect. */
  | "mark-reviewed-local"
  /**
   * The action is locked: requires an explicit ClaudeCode GO before it
   * can be enabled. Must display lock icon and cursor:not-allowed.
   */
  | "locked-requires-go"
  /**
   * The action is permanently forbidden in the Command Center UI.
   * Must not exist as an interactive element.
   */
  | "forbidden";

/** The safe default for any new button not yet explicitly categorized. */
export const DEFAULT_BUTTON_CATEGORY = "copy-only" as const;

// ─── Locked Settings ─────────────────────────────────────────────────────────

/**
 * Settings that are permanently locked in the UI.
 * These must display a lock icon and be non-interactive.
 * Changing them requires a separate explicit ClaudeCode GO.
 */
export type LockedSetting =
  | "productionReady"
  | "execution"
  | "externalWrite"
  | "stackChanPhysical"
  | "voiceCameraMic";

export const ALL_LOCKED_SETTINGS: readonly LockedSetting[] = [
  "productionReady",
  "execution",
  "externalWrite",
  "stackChanPhysical",
  "voiceCameraMic",
] as const;

// ─── Safety Fallback ─────────────────────────────────────────────────────────

/**
 * Any page or lamp in one of these data states must fall back to HOLD.
 * Never show GO_READY or PASS when data source is in these states.
 */
export type DataUnavailableReason =
  | "stale"
  | "unknown"
  | "error"
  | "loading"
  | "redaction-uncertain"
  | "device-connection-uncertain"
  | "external-write-uncertain";

/** The universal fallback lamp state when data is unavailable. */
export type SafetyFallbackState = "HOLD";
export const SAFETY_FALLBACK: SafetyFallbackState = "HOLD";

// ─── Safety Invariant Brand Types ────────────────────────────────────────────

/**
 * A marker type for productionReady.
 * Any interface that claims productionReady must use this literal.
 */
export type ProductionReadyFalse = false;

/**
 * A marker type for execution.
 * Any interface that claims execution must use this literal string.
 */
export type ExecutionDisabled = "disabled";

/**
 * A marker type for rawValuesReported.
 * Any interface that carries rawValuesReported must use this literal.
 */
export type RawValuesReportedFalse = false;

// ─── Redaction ────────────────────────────────────────────────────────────────

/**
 * A string that has been confirmed safe for display (no raw tokens, IPs,
 * passwords, or secrets). Values typed as SafeDisplayString must have
 * been validated before assignment.
 */
export type SafeDisplayString = string & { readonly __brand: "SafeDisplayString" };

/**
 * Placeholder text shown in place of a redacted value.
 * Must be used wherever a raw value would otherwise appear.
 */
export const REDACTED_PLACEHOLDER = "[REDACTED]" as const;
export type RedactedPlaceholder = typeof REDACTED_PLACEHOLDER;
