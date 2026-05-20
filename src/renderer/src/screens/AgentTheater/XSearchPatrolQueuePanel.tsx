/**
 * XSearchPatrolQueuePanel — display-only patrol phase status.
 * Shows XS-AUTO gate phases and current HOLD state.
 * No execute/search/connect buttons.
 * Design spec: XS_AUTO_02_PATROL_SCHEDULER_HOLD_PLAN.md
 */

import type { XSearchPatrolSummary } from "../../types/x-search-automation-types";

const PATROL_PHASES: readonly XSearchPatrolSummary[] = [
  {
    phase: "XS-AUTO-00",
    status: "CLOSED",
    label: "設計書作成",
    labelEn: "Design docs",
    notes: ["完了 · DESIGN COMPLETE"],
  },
  {
    phase: "XS-AUTO-01",
    status: "HOLD",
    label: "ウォッチリスト定義",
    labelEn: "Watchlist definition",
    notes: ["5 watch items defined · all HOLD"],
  },
  {
    phase: "XS-AUTO-02",
    status: "HOLD",
    label: "スケジューラー計画",
    labelEn: "Scheduler HOLD plan",
    notes: ["xs_auto_schedule_go required"],
  },
  {
    phase: "XS-AUTO-03",
    status: "HOLD",
    label: "単発スケジュール実行",
    labelEn: "One-shot scheduled run",
    notes: ["xs_auto_read_go required · run_count fixed"],
  },
  {
    phase: "XS-AUTO-04",
    status: "HOLD",
    label: "定期パトロール",
    labelEn: "Recurring patrol",
    notes: ["xs_auto_schedule_go required · future gate"],
  },
  {
    phase: "XS-AUTO-05",
    status: "HOLD",
    label: "Xアカウント連携",
    labelEn: "X Account (XACC gate)",
    notes: ["separate XACC gate · HOLD"],
  },
];

const STATUS_COLOR: Record<string, string> = {
  HOLD:     "#6e7681",
  CLOSED:   "#8b949e",
  READY:    "#3fb950",
  ACTIVE:   "#58a6ff",
  COOLDOWN: "#f59e0b",
  BLOCKED:  "#6e7681",
};

interface XSearchPatrolQueuePanelProps {
  readonly lang?: "ja" | "en";
}

export function XSearchPatrolQueuePanel({ lang = "ja" }: XSearchPatrolQueuePanelProps): React.JSX.Element {
  return (
    <div
      style={{
        background: "#0d1117",
        border: "1px solid #21262d",
        borderRadius: 4,
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column" as const,
        gap: 8,
      }}
    >
      <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 11, fontWeight: 700, color: "#c9d1d9" }}>
        {lang === "ja" ? "XS-AUTO ゲートシーケンス" : "XS-AUTO Gate Sequence"}
      </span>

      <div style={{ display: "flex", flexDirection: "column" as const, gap: 5 }}>
        {PATROL_PHASES.map((p) => {
          const sc = STATUS_COLOR[p.status] ?? "#6e7681";
          return (
            <div
              key={p.phase}
              style={{
                background: "#161b22",
                border: "1px solid #21262d",
                borderRadius: 3,
                padding: "7px 10px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap" as const,
              }}
            >
              <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#1f6feb", flexShrink: 0 }}>
                {p.phase}
              </span>
              <span style={{ fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif', fontSize: 11, color: "#c9d1d9", flex: 1, minWidth: 80 }}>
                {lang === "ja" ? p.label : p.labelEn}
              </span>
              <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#6e7681" }}>
                {p.notes[0]}
              </span>
              <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: sc, border: `1px solid ${sc}44`, borderRadius: 2, padding: "1px 5px", flexShrink: 0 }}>
                {p.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
