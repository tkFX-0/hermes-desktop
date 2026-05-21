/**
 * AIUsageCockpitPanel — AI Model Usage Cockpit / Model Quota Dashboard.
 * Display-only. Shows provider status, routing recommendation, data source labels.
 * No API calls. No token fields. No connect/login/scrape buttons.
 * Design spec: AI_USAGE_00_MODEL_USAGE_COCKPIT_DESIGN.md
 */

import type { AIUsageCockpitState, AIUsageProviderState, AIUsageRoutingDecision } from "../../types/ai-usage-types";
import { AIUsageProviderCard } from "./AIUsageProviderCard";
import { AIUsageRoutingPanel } from "./AIUsageRoutingPanel";
import { AIUsageManualInputNotice } from "./AIUsageManualInputNotice";

// Static initial state — manual/estimated only
const INITIAL_PROVIDERS: readonly AIUsageProviderState[] = [
  {
    id: "claude-code",
    label: "ClaudeCode",
    provider: "claude_code",
    status: "READY",
    dataSource: "cli_manual",
    lastCheckedAt: null,
    resetHint: null,
    usageSummary: "状態: 手動確認が必要",
    routingRecommendation: "Shikishima 実装 / docs / typecheck / evidence",
    risk: "low",
    allowedFor: ["実装", "docs", "typecheck", "evidence", "commit"],
    forbiddenFor: [],
    notes: "ClaudeCode 共有クォータ — セッション毎に確認推奨",
    cooldownWarning: false,
    isFutureAdapter: false,
  },
  {
    id: "claude",
    label: "Claude",
    provider: "claude",
    status: "READY",
    dataSource: "user_reported",
    lastCheckedAt: null,
    resetHint: null,
    usageSummary: null,
    routingRecommendation: "設計相談 / レビュー / 計画立案",
    risk: "low",
    allowedFor: ["設計", "レビュー", "計画"],
    forbiddenFor: ["実装タスク → ClaudeCode に委譲"],
    notes: null,
    cooldownWarning: false,
    isFutureAdapter: false,
  },
  {
    id: "codex",
    label: "Codex",
    provider: "codex",
    status: "NEEDS_MANUAL_UPDATE",
    dataSource: "user_reported",
    lastCheckedAt: null,
    resetHint: null,
    usageSummary: "状態: ユーザー報告待ち",
    routingRecommendation: "StackChan 専用 — Shikishima core には使わない",
    risk: "low",
    allowedFor: ["StackChan review", "StackChan setup", "StackChan evidence"],
    forbiddenFor: ["Shikishima core タスク"],
    notes: "Codex は StackChan 専用に限定",
    cooldownWarning: false,
    isFutureAdapter: false,
  },
  {
    id: "chatgpt",
    label: "ChatGPT",
    provider: "chatgpt",
    status: "UNKNOWN",
    dataSource: "unknown",
    lastCheckedAt: null,
    resetHint: null,
    usageSummary: null,
    routingRecommendation: "future adapter — 現時点で未対応",
    risk: "high",
    allowedFor: [],
    forbiddenFor: ["自動接続", "スクレイピング", "セッション読取"],
    notes: "公式 usage API なし — screen_manual のみ将来対応",
    cooldownWarning: false,
    isFutureAdapter: true,
  },
  {
    id: "gemini",
    label: "Gemini",
    provider: "gemini",
    status: "UNKNOWN",
    dataSource: "unknown",
    lastCheckedAt: null,
    resetHint: null,
    usageSummary: null,
    routingRecommendation: "future adapter — API GO が必要",
    risk: "high",
    allowedFor: [],
    forbiddenFor: ["API key なしでの接続"],
    notes: "gemini_api_go が必要",
    cooldownWarning: false,
    isFutureAdapter: true,
  },
];

const INITIAL_ROUTING: AIUsageRoutingDecision = {
  recommendedWorker: "claude_code",
  reason: "ClaudeCode READY — Shikishima 実装に使用",
  fallbackWorker: "claude",
  cooldownWarning: false,
  requiresHumanCheck: false,
};

const COCKPIT_STATE: AIUsageCockpitState = {
  providers: INITIAL_PROVIDERS,
  routing: INITIAL_ROUTING,
  lastUpdated: null,
  dataSourceWarning: "全データは手動入力・推定値です。公式 API 接続は将来実装予定。",
  tokenStored: false,
  apiCalled: false,
  scrapingPerformed: false,
};

interface AIUsageCockpitPanelProps {
  readonly lang?: "ja" | "en";
}

export function AIUsageCockpitPanel({ lang = "ja" }: AIUsageCockpitPanelProps): React.JSX.Element {
  const activeProviders = COCKPIT_STATE.providers.filter((p) => !p.isFutureAdapter);
  const futureProviders = COCKPIT_STATE.providers.filter((p) => p.isFutureAdapter);

  return (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: 12, marginTop: 16 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" as const, borderBottom: "1px solid #21262d", paddingBottom: 8 }}>
        <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 12, fontWeight: 700, color: "#c9d1d9" }}>
          {lang === "ja" ? "AI 使用量 Cockpit" : "AI Usage Cockpit"}
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, color: "#58a6ff", border: "1px solid #58a6ff44", borderRadius: 2, padding: "2px 6px" }}>
            display-only
          </span>
          <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, color: "#6e7681", border: "1px solid #6e768144", borderRadius: 2, padding: "2px 6px" }}>
            manual/estimated
          </span>
        </div>
      </div>

      {/* Safety strip */}
      <AIUsageManualInputNotice lang={lang} />

      {/* Routing */}
      <AIUsageRoutingPanel routing={COCKPIT_STATE.routing} lang={lang} />

      {/* Active providers */}
      <div>
        <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, color: "#8b949e", display: "block", marginBottom: 6 }}>
          {lang === "ja" ? "アクティブプロバイダー" : "Active Providers"}
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8 }}>
          {activeProviders.map((p) => <AIUsageProviderCard key={p.id} state={p} />)}
        </div>
      </div>

      {/* Future adapters */}
      <div>
        <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, color: "#484f58", display: "block", marginBottom: 6 }}>
          {lang === "ja" ? "将来対応プロバイダー (未実装)" : "Future Adapters (not yet implemented)"}
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 6 }}>
          {futureProviders.map((p) => <AIUsageProviderCard key={p.id} state={p} />)}
        </div>
      </div>

      {/* Data source warning */}
      {COCKPIT_STATE.dataSourceWarning && (
        <div style={{ background: "#161b22", border: "1px solid #6e768133", borderRadius: 4, padding: "8px 12px" }}>
          <span style={{ fontFamily: '"IBM Plex Sans", system-ui, sans-serif', fontSize: 11, color: "#8b949e" }}>
            {COCKPIT_STATE.dataSourceWarning}
          </span>
        </div>
      )}
    </div>
  );
}
