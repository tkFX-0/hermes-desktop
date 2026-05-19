/**
 * GateStatusCard - display-only card for one future/human-gated capability.
 * No enable buttons. No approve buttons. No external actions.
 * Design spec: AT_12_GATE_DASHBOARD_PANEL_EVIDENCE.md
 */

import type { GateDashboardItem } from "../../types/agent-theater-types";
import { GateStatusBadge } from "./GateStatusBadge";

const CATEGORY_ACCENT: Record<GateDashboardItem["category"], string> = {
  push:           "#3b82f6",
  runtime:        "#f0883e",
  auth:           "#8b5cf6",
  social:         "#f59e0b",
  local_note:     "#58a6ff",
  external_write: "#f85149",
  production:     "#8b949e",
  execution:      "#8b949e",
  device:         "#f59e0b",
  media:          "#f59e0b",
  asset:          "#8b5cf6",
  review:         "#3fb950",
};

interface GateStatusCardProps {
  readonly item: GateDashboardItem;
}

export function GateStatusCard({ item }: GateStatusCardProps): React.JSX.Element {
  const accent = CATEGORY_ACCENT[item.category];
  return (
    <div
      style={{
        background: "#161b22",
        border: "1px solid #21262d",
        borderLeft: `3px solid ${accent}`,
        borderRadius: 4,
        padding: "12px 15px",
        display: "flex",
        flexDirection: "column" as const,
        gap: 8,
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, flexWrap: "wrap" }}>
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 13,
            fontWeight: 700,
            color: accent,
            overflowWrap: "anywhere" as const,
          }}
        >
          {item.gateId}
        </span>
        <GateStatusBadge status={item.status} />
      </div>

      <span
        style={{
          fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif',
          fontSize: 13,
          color: "#c9d1d9",
          lineHeight: 1.3,
          overflowWrap: "anywhere" as const,
        }}
      >
        {item.title}
      </span>

      <span
        style={{
          fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif',
          fontSize: 12,
          color: "#8b949e",
          lineHeight: 1.35,
          overflowWrap: "anywhere" as const,
        }}
      >
        {item.plainLabel}
      </span>

      <div style={{ height: 1, background: "#21262d" }} />

      <div style={{ display: "flex", flexDirection: "column" as const, gap: 3 }}>
        <GateFact label="state" value={item.currentState} color="#8b949e" />
        <GateFact label="human" value={item.requiredHumanAction} color="#f0883e" />
        <GateFact label="evidence" value={item.evidenceTarget} color="#58a6ff" />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {item.allowedNow.map((allowed) => (
          <span
            key={allowed}
            style={{
              fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
              fontSize: 10,
              color: "#3fb950",
              border: "1px solid #21262d",
              borderRadius: 2,
              padding: "1px 5px",
              whiteSpace: "nowrap" as const,
            }}
          >
            ok: {allowed}
          </span>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {item.forbiddenNow.map((forbidden) => (
          <span
            key={forbidden}
            style={{
              fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
              fontSize: 10,
              color: "#f85149",
              border: "1px solid #21262d",
              borderRadius: 2,
              padding: "1px 5px",
              whiteSpace: "nowrap" as const,
            }}
          >
            no: {forbidden}
          </span>
        ))}
      </div>

      <span
        style={{
          fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
          fontSize: 10,
          color: item.autonomyLevel === 5 ? "#f0883e" : "#3fb950",
          border: `1px solid ${item.autonomyLevel === 5 ? "#f0883e" : "#3fb950"}`,
          borderRadius: 2,
          padding: "2px 6px",
          alignSelf: "flex-start" as const,
        }}
      >
        Lv {item.autonomyLevel}
      </span>
    </div>
  );
}

interface GateFactProps {
  readonly label: string;
  readonly value: string;
  readonly color: string;
}

function GateFact({ label, value, color }: GateFactProps): React.JSX.Element {
  return (
    <span
      style={{
        fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
        fontSize: 11,
        color: "#6e7681",
        lineHeight: 1.3,
        overflowWrap: "anywhere" as const,
      }}
    >
      <span style={{ color }}>{label}</span>: {value}
    </span>
  );
}
