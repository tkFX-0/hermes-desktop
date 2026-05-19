/**
 * RunawayGuardPanel — display-only panel listing human-gated actions.
 * Shows what AI must not perform automatically.
 * No action buttons. No toggles. No clickable controls.
 * Design spec: AT_10_RUNAWAY_GUARD_PANEL_EVIDENCE.md
 */

import { HumanGateActionCard } from "./HumanGateActionCard";
import type { GuardedActionData } from "./HumanGateActionCard";

const GUARDED_ACTIONS: readonly GuardedActionData[] = [
  {
    id: "git-push",
    nameJa: "git push",
    nameEn: "git push",
    plainJa: "GitHubへ送るのは人間GO",
    plainEn: "Sending to GitHub requires human GO",
    status: "HUMAN_GO_REQUIRED",
  },
  {
    id: "runtime-start",
    nameJa: "runtime 起動",
    nameEn: "runtime start",
    plainJa: "アプリ起動はtime_window付きGO",
    plainEn: "App start requires time_window GO",
    status: "HUMAN_GO_REQUIRED",
  },
  {
    id: "oauth",
    nameJa: "OAuth ログイン",
    nameEn: "OAuth",
    plainJa: "ログイン連携は人間GO",
    plainEn: "Login integration requires human GO",
    status: "HUMAN_GO_REQUIRED",
  },
  {
    id: "x-search",
    nameJa: "x_search / SNS読み取り",
    nameEn: "x_search / social read",
    plainJa: "SNS読み取りはread-only GO",
    plainEn: "Social reading requires read-only GO",
    status: "READ_ONLY_GO",
  },
  {
    id: "obsidian",
    nameJa: "Obsidian ローカル記録",
    nameEn: "Obsidian local note write",
    plainJa: "Obsidian記録はlocal GO",
    plainEn: "Obsidian notes require local GO",
    status: "LOCAL_GO_REQUIRED",
  },
  {
    id: "ext-write",
    nameJa: "外部書き込み",
    nameEn: "external write",
    plainJa: "外部書き込みは明示GOなし禁止",
    plainEn: "External writes blocked without explicit GO",
    status: "BLOCKED",
  },
  {
    id: "production-ready",
    nameJa: "productionReady",
    nameEn: "productionReady",
    plainJa: "本番OK化は人間判断",
    plainEn: "Production readiness is human judgment",
    status: "LOCKED_FALSE",
  },
  {
    id: "execution-enabled",
    nameJa: "execution enabled",
    nameEn: "execution enabled",
    plainJa: "自動実行ONは禁止",
    plainEn: "Enabling execution is forbidden",
    status: "LOCKED_DISABLED",
  },
  {
    id: "api-auto",
    nameJa: "API 自動利用",
    nameEn: "API auto-use",
    plainJa: "API自動利用なし",
    plainEn: "No automatic API use",
    status: "DISABLED",
  },
] as const;

const PANEL_LABEL: React.CSSProperties = {
  fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
  fontSize: 12,
  letterSpacing: 1.2,
  color: "#6e7681",
  marginBottom: 10,
  textTransform: "uppercase" as const,
};

interface RunawayGuardPanelProps {
  readonly lang?: "ja" | "en";
}

export function RunawayGuardPanel({ lang = "ja" }: RunawayGuardPanelProps): React.JSX.Element {
  return (
    <div
      style={{
        background: "#0d1117",
        border: "1px solid #21262d",
        borderRadius: 8,
        padding: "16px",
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      {/* Panel header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
        <p style={{ ...PANEL_LABEL, marginBottom: 0 }}>
          {lang === "ja" ? "RUNAWAY GUARD · 監視境界" : "RUNAWAY GUARD · BOUNDARY"}
        </p>
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 10,
            color: "#f85149",
            border: "1px solid #f85149",
            borderRadius: 2,
            padding: "1px 4px",
            flexShrink: 0,
          }}
        >
          {lang === "ja" ? "AI自動実行禁止" : "NO AUTO-EXEC"}
        </span>
      </div>

      {/* Guarded actions grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
          gap: 6,
          marginBottom: 12,
        }}
      >
        {GUARDED_ACTIONS.map((action) => (
          <HumanGateActionCard key={action.id} action={action} lang={lang} />
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#21262d", marginBottom: 10 }} />

      {/* Level boundary */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 11,
            color: "#3fb950",
            border: "1px solid #3fb950",
            borderRadius: 2,
            padding: "3px 8px",
            whiteSpace: "nowrap" as const,
          }}
        >
          {lang === "ja" ? "Level 4まで: AI作業候補" : "Level 1-4: AI worker candidate"}
        </span>
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 11,
            color: "#f0883e",
            border: "1px solid #f0883e",
            borderRadius: 2,
            padding: "3px 8px",
            whiteSpace: "nowrap" as const,
          }}
        >
          {lang === "ja" ? "Level 5: 人間GO必須" : "Level 5: human GO required"}
        </span>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#21262d", marginBottom: 8 }} />

      {/* Plain language taglines */}
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 3 }}>
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 11,
            color: "#8b949e",
            fontStyle: "italic",
          }}
        >
          {lang === "ja" ? "AIは作るところまで。" : "AI builds, not deploys."}
        </span>
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 11,
            color: "#8b949e",
            fontStyle: "italic",
          }}
        >
          {lang === "ja" ? "鍵と発射ボタンは人間。" : "Humans hold the keys and the launch button."}
        </span>
      </div>
    </div>
  );
}
