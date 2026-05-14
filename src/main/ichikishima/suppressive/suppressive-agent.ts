export type SuppressionReason =
  | "execution_escape_detected"
  | "raw_value_detected"
  | "secret_detected"
  | "unauthorized_network"
  | "level_boundary_violation"
  | "robot_motion_unauthorized"
  | "voice_unauthorized";

export interface SuppressionEvent {
  reason: SuppressionReason;
  context: string;
  suppressedAt: string;
  rawValuesReported: false;
}

export interface SuppressionResult {
  suppressed: boolean;
  reason?: SuppressionReason;
  event?: SuppressionEvent;
}

const SUPPRESSION_PATTERNS: Array<{ pattern: RegExp; reason: SuppressionReason }> = [
  { pattern: /productionReady.*true/i, reason: "level_boundary_violation" },
  { pattern: /execution.*enabled/i, reason: "execution_escape_detected" },
  { pattern: /(api_key|token|secret|password)\s*[:=]\s*\S+/i, reason: "secret_detected" },
  { pattern: /raw_values_reported.*true/i, reason: "raw_value_detected" },
  { pattern: /robot.*motion.*start/i, reason: "robot_motion_unauthorized" },
  { pattern: /voice.*activate.*auto/i, reason: "voice_unauthorized" },
];

export function checkSuppression(text: string): SuppressionResult {
  for (const { pattern, reason } of SUPPRESSION_PATTERNS) {
    if (pattern.test(text)) {
      return {
        suppressed: true,
        reason,
        event: {
          reason,
          context: "[redacted]",
          suppressedAt: new Date().toISOString(),
          rawValuesReported: false,
        },
      };
    }
  }
  return { suppressed: false };
}

export function buildSuppressionSummary(events: SuppressionEvent[]): {
  count: number;
  reasons: SuppressionReason[];
  rawValuesReported: false;
} {
  return {
    count: events.length,
    reasons: [...new Set(events.map((e) => e.reason))],
    rawValuesReported: false,
  };
}
