/**
 * XSearchAutomationPanel — display-only x_search automation status.
 * Shows XS-01 PASS/closed, watchlist, patrol phases — all HOLD.
 * No run/search/connect/OAuth/post buttons.
 * Design spec: XS_AUTO_00_READ_ONLY_AUTOMATION_GATE_DESIGN.md
 */

import type { XSearchWatchlistItem } from "../../types/x-search-automation-types";
import { XSearchWatchlistCard } from "./XSearchWatchlistCard";
import { XSearchPatrolQueuePanel } from "./XSearchPatrolQueuePanel";

const WATCHLIST: readonly XSearchWatchlistItem[] = [
  {
    id: "WI-001",
    title: "AI / エージェントプラットフォーム",
    titleEn: "AI / Agent Platform News",
    queryExample: "Google I/O agent Gemini 2026",
    category: "AI / platform",
    status: "HOLD",
    runCountMax: 1,
    runCountUsed: 0,
    scheduleMode: "on_demand",
    humanGoRequired: true,
    goForm: "xs_read_go",
    riskLevel: "low",
    evidencePath: "docs/shikishima/XS_AUTO_RUN_WI001_*.md",
  },
  {
    id: "WI-002",
    title: "OpenAI / Codex 更新",
    titleEn: "OpenAI / Codex Updates",
    queryExample: "OpenAI Codex agent 2026",
    category: "AI / platform",
    status: "HOLD",
    runCountMax: 1,
    runCountUsed: 0,
    scheduleMode: "on_demand",
    humanGoRequired: true,
    goForm: "xs_read_go",
    riskLevel: "low",
    evidencePath: "docs/shikishima/XS_AUTO_RUN_WI002_*.md",
  },
  {
    id: "WI-003",
    title: "Anthropic Claude Code 更新",
    titleEn: "Anthropic Claude Code Updates",
    queryExample: "Anthropic Claude Code agent 2026",
    category: "AI / platform",
    status: "HOLD",
    runCountMax: 1,
    runCountUsed: 0,
    scheduleMode: "on_demand",
    humanGoRequired: true,
    goForm: "xs_read_go",
    riskLevel: "low",
    evidencePath: "docs/shikishima/XS_AUTO_RUN_WI003_*.md",
  },
  {
    id: "WI-004",
    title: "X / Discord ポリシー更新",
    titleEn: "X / Discord Policy Updates",
    queryExample: "X API Discord webhook policy 2026",
    category: "platform policy",
    status: "HOLD",
    runCountMax: 1,
    runCountUsed: 0,
    scheduleMode: "on_demand",
    humanGoRequired: true,
    goForm: "xs_read_go",
    riskLevel: "low",
    evidencePath: "docs/shikishima/XS_AUTO_RUN_WI004_*.md",
  },
  {
    id: "WI-005",
    title: "StackChan / ローカル音声UI",
    titleEn: "StackChan / Local Voice UI",
    queryExample: "StackChan voice robot 2026",
    category: "hardware / robot",
    status: "HOLD",
    runCountMax: 1,
    runCountUsed: 0,
    scheduleMode: "on_demand",
    humanGoRequired: true,
    goForm: "xs_read_go",
    riskLevel: "low",
    evidencePath: "docs/shikishima/XS_AUTO_RUN_WI005_*.md",
  },
];

interface XSearchAutomationPanelProps {
  readonly lang?: "ja" | "en";
}

export function XSearchAutomationPanel({ lang = "ja" }: XSearchAutomationPanelProps): React.JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column" as const,
        gap: 12,
        marginTop: 16,
      }}
    >
      {/* Section header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          flexWrap: "wrap" as const,
          borderBottom: "1px solid #21262d",
          paddingBottom: 8,
        }}
      >
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 12, fontWeight: 700, color: "#c9d1d9" }}>
          {lang === "ja" ? "X Search 自動化 · Read-only Patrol" : "X Search Automation · Read-only Patrol"}
        </span>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
          <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#3fb950", border: "1px solid #3fb95044", borderRadius: 2, padding: "2px 6px" }}>
            XS-01 PASS
          </span>
          <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#6e7681", border: "1px solid #6e768144", borderRadius: 2, padding: "2px 6px" }}>
            次回 HOLD
          </span>
        </div>
      </div>

      {/* Status summary row */}
      <div
        style={{
          background: "#161b22",
          border: "1px solid #21262d",
          borderRadius: 4,
          padding: "10px 14px",
          display: "flex",
          flexWrap: "wrap" as const,
          gap: 8,
        }}
      >
        {[
          { label: "XS-01", value: "PASS / closed", color: "#3fb950" },
          { label: "next x_search", value: "HOLD", color: "#6e7681" },
          { label: "scheduler", value: "HOLD", color: "#6e7681" },
          { label: "recurring patrol", value: "HOLD", color: "#6e7681" },
          { label: "OAuth", value: "HOLD", color: "#6e7681" },
          { label: "X account", value: "HOLD", color: "#6e7681" },
          { label: "write actions", value: "REJECT", color: "#f85149" },
        ].map(({ label, value, color }) => (
          <span key={label} style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10 }}>
            <span style={{ color: "#8b949e" }}>{label}: </span>
            <span style={{ color }}>{value}</span>
          </span>
        ))}
      </div>

      {/* Watchlist */}
      <div>
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 11, color: "#8b949e", display: "block", marginBottom: 6 }}>
          {lang === "ja" ? "ウォッチリスト (全 HOLD)" : "Watchlist (all HOLD)"}
        </span>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 6,
          }}
        >
          {WATCHLIST.map((item) => (
            <XSearchWatchlistCard key={item.id} item={item} lang={lang} />
          ))}
        </div>
      </div>

      {/* Gate sequence */}
      <XSearchPatrolQueuePanel lang={lang} />

      {/* Evidence notice */}
      <div style={{ background: "#161b22", border: "1px solid #6e768133", borderRadius: 4, padding: "8px 12px" }}>
        <span style={{ fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif', fontSize: 11, color: "#8b949e", lineHeight: 1.5 }}>
          {lang === "ja"
            ? "読み取り専用。書き込み・返信・DM・いいね・フォロー・アカウント操作はすべて Level 5。次回 x_search には xs_read_go が必要です。"
            : "Read-only only. Post, reply, DM, like, follow, account mutation: all Level 5. Next x_search requires xs_read_go."}
        </span>
      </div>
    </div>
  );
}
