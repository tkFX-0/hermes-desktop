/**
 * XSearchWatchlistCard — display-only card for one x_search watchlist item.
 * Shows topic, status, run count, required GO. No execute buttons.
 * Design spec: XS_AUTO_01_WATCHLIST_AND_QUERY_POLICY.md
 */

import type { XSearchWatchlistItem, XSearchWatchlistStatus } from "../../types/x-search-automation-types";

const STATUS_STYLE: Record<XSearchWatchlistStatus, { color: string; label: string }> = {
  HOLD:     { color: "#6e7681", label: "HOLD"     },
  READY:    { color: "#3fb950", label: "READY"    },
  ACTIVE:   { color: "#58a6ff", label: "ACTIVE"   },
  COOLDOWN: { color: "#f59e0b", label: "COOLDOWN" },
  CLOSED:   { color: "#8b949e", label: "CLOSED"   },
  BLOCKED:  { color: "#6e7681", label: "BLOCKED"  },
};

const RISK_COLOR = { low: "#3fb950", medium: "#f59e0b", high: "#f85149" };

interface XSearchWatchlistCardProps {
  readonly item: XSearchWatchlistItem;
  readonly lang?: "ja" | "en";
}

export function XSearchWatchlistCard({ item, lang = "ja" }: XSearchWatchlistCardProps): React.JSX.Element {
  const st = STATUS_STYLE[item.status];
  const rc = RISK_COLOR[item.riskLevel];

  return (
    <div
      style={{
        background: "#161b22",
        border: "1px solid #21262d",
        borderLeft: "3px solid #1f6feb",
        borderRadius: 4,
        padding: "10px 13px",
        display: "flex",
        flexDirection: "column" as const,
        gap: 6,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, flexWrap: "wrap" as const }}>
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 12, fontWeight: 700, color: "#c9d1d9" }}>
          {lang === "ja" ? item.title : item.titleEn}
        </span>
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: st.color, border: `1px solid ${st.color}44`, borderRadius: 2, padding: "2px 6px", flexShrink: 0 }}>
          {st.label}
        </span>
      </div>

      {/* Category + risk */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#8b949e" }}>
          {item.category}
        </span>
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: rc }}>
          risk: {item.riskLevel}
        </span>
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#8b949e" }}>
          runs: {item.runCountUsed}/{item.runCountMax}
        </span>
      </div>

      {/* GO form */}
      <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#6e7681" }}>
        requires: {item.goForm}
      </span>
    </div>
  );
}
