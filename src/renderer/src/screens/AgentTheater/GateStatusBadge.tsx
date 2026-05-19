/**
 * GateStatusBadge - compact display-only gate status badge.
 * No toggles. No clickable controls.
 * Design spec: AT_12_GATE_DASHBOARD_PANEL_EVIDENCE.md
 */

import type { GateStatus } from "../../types/agent-theater-types";

const STATUS_CONFIG: Record<GateStatus, { color: string; label: string }> = {
  PASS:            { color: "#3fb950", label: "PASS" },
  READY:           { color: "#58a6ff", label: "READY" },
  HOLD:            { color: "#f59e0b", label: "HOLD" },
  NEEDS_HUMAN:     { color: "#f0883e", label: "NEEDS HUMAN" },
  FUTURE:          { color: "#8b5cf6", label: "FUTURE" },
  BLOCKED:         { color: "#f85149", label: "BLOCKED" },
  STOP:            { color: "#f85149", label: "STOP" },
  LOCKED_FALSE:    { color: "#8b949e", label: "LOCKED FALSE" },
  LOCKED_DISABLED: { color: "#8b949e", label: "LOCKED DISABLED" },
};

interface GateStatusBadgeProps {
  readonly status: GateStatus;
}

export function GateStatusBadge({ status }: GateStatusBadgeProps): React.JSX.Element {
  const { color, label } = STATUS_CONFIG[status];
  return (
    <span
      style={{
        fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
        fontSize: 7,
        fontWeight: 700,
        color,
        border: `1px solid ${color}`,
        borderRadius: 2,
        padding: "1px 4px",
        whiteSpace: "nowrap" as const,
        flexShrink: 0,
        letterSpacing: 0.3,
      }}
    >
      {label}
    </span>
  );
}
