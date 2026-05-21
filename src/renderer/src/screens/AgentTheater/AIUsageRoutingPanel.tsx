/**
 * AIUsageRoutingPanel — displays current routing recommendation.
 * Display-only. No execution. No API.
 */

import type { AIUsageRoutingDecision } from "../../types/ai-usage-types";

interface AIUsageRoutingPanelProps {
  readonly routing: AIUsageRoutingDecision;
  readonly lang?: "ja" | "en";
}

export function AIUsageRoutingPanel({ routing, lang = "ja" }: AIUsageRoutingPanelProps): React.JSX.Element {
  return (
    <div style={{ background: "#0d2119", border: "1px solid #3fb95033", borderRadius: 4, padding: "8px 12px", display: "flex", flexDirection: "column" as const, gap: 5 }}>
      <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, color: "#3fb950", fontWeight: 700 }}>
        {lang === "ja" ? "ルーティング推奨" : "Routing Recommendation"}
      </span>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
        <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10 }}>
          <span style={{ color: "#8b949e" }}>worker: </span>
          <span style={{ color: "#3fb950" }}>{routing.recommendedWorker}</span>
        </span>
        {routing.fallbackWorker && (
          <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10 }}>
            <span style={{ color: "#8b949e" }}>fallback: </span>
            <span style={{ color: "#58a6ff" }}>{routing.fallbackWorker}</span>
          </span>
        )}
        {routing.cooldownWarning && (
          <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, color: "#f0883e" }}>
            ⚠ cooldown
          </span>
        )}
        {routing.requiresHumanCheck && (
          <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, color: "#bc8cff" }}>
            → 人間確認
          </span>
        )}
      </div>
      <span style={{ fontFamily: '"IBM Plex Sans", system-ui, sans-serif', fontSize: 10, color: "#8b949e" }}>
        {routing.reason}
      </span>
    </div>
  );
}
