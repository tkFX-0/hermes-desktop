/**
 * AIUsageProviderCard — displays one AI provider's current status.
 * Display-only. No connect/login/token/API button.
 */

import type { AIUsageProviderState, AIUsageStatus, AIUsageDataSource } from "../../types/ai-usage-types";

function statusColor(s: AIUsageStatus): string {
  switch (s) {
    case "READY":                return "#3fb950";
    case "BUSY":                 return "#58a6ff";
    case "COOLDOWN":             return "#f0883e";
    case "LIMITED":              return "#d29922";
    case "BLOCKED":              return "#f85149";
    case "NEEDS_MANUAL_UPDATE":  return "#8b949e";
    case "NEEDS_HUMAN":          return "#bc8cff";
    case "UNKNOWN":              return "#484f58";
  }
}

function sourceLabel(s: AIUsageDataSource): string {
  switch (s) {
    case "official_api":  return "API";
    case "cli_manual":    return "CLI/手動";
    case "screen_manual": return "画面/手動";
    case "user_reported": return "報告値";
    case "estimated":     return "推定";
    case "unknown":       return "不明";
  }
}

interface AIUsageProviderCardProps {
  readonly state: AIUsageProviderState;
}

export function AIUsageProviderCard({ state }: AIUsageProviderCardProps): React.JSX.Element {
  const dim = state.isFutureAdapter || state.status === "UNKNOWN";

  return (
    <div style={{
      background: dim ? "#0d1117" : "#161b22",
      border: `1px solid ${dim ? "#21262d" : "#30363d"}`,
      borderRadius: 4,
      padding: "10px 12px",
      display: "flex",
      flexDirection: "column" as const,
      gap: 6,
      opacity: dim ? 0.6 : 1,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
        <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11, fontWeight: 700, color: "#c9d1d9" }}>
          {state.label}
        </span>
        <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, color: statusColor(state.status) }}>
          {state.status}
        </span>
      </div>

      {/* Data source + cooldown */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
        <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, color: "#6e7681", border: "1px solid #30363d", borderRadius: 2, padding: "1px 5px" }}>
          {sourceLabel(state.dataSource)}
        </span>
        {state.cooldownWarning && (
          <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, color: "#f0883e", border: "1px solid #f0883e44", borderRadius: 2, padding: "1px 5px" }}>
            クールダウン中
          </span>
        )}
        {state.isFutureAdapter && (
          <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, color: "#484f58", border: "1px solid #21262d", borderRadius: 2, padding: "1px 5px" }}>
            future adapter
          </span>
        )}
      </div>

      {/* Routing */}
      <span style={{ fontFamily: '"IBM Plex Sans", system-ui, sans-serif', fontSize: 10, color: "#8b949e", lineHeight: 1.4 }}>
        {state.routingRecommendation}
      </span>

      {/* Usage + reset hint */}
      {state.usageSummary && (
        <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, color: "#6e7681" }}>
          {state.usageSummary}
          {state.resetHint && <span style={{ color: "#484f58" }}> · {state.resetHint}</span>}
        </span>
      )}

      {/* Forbidden */}
      {state.forbiddenFor.length > 0 && (
        <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, color: "#f85149" }}>
          ✕ {state.forbiddenFor.join(" / ")}
        </span>
      )}
    </div>
  );
}
