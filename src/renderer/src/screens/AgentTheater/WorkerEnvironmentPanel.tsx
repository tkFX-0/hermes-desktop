/**
 * WorkerEnvironmentPanel — display-only controlled worker environment overview.
 * Shows ClaudeCode / Codex / Human Gate / Future Adapter with execution modes.
 * No launch buttons. No execution. Copy-only / human-bridge model.
 * Design spec: WK_00_CONTROLLED_WORKER_ENVIRONMENT_DESIGN.md
 */

import type { ControlledWorkerEnvironment } from "../../types/worker-environment-types";
import { WorkerEnvironmentCard } from "./WorkerEnvironmentCard";
import { WorkerTaskQueuePanel } from "./WorkerTaskQueuePanel";
import { WorkerPromptPreview } from "./WorkerPromptPreview";

const ENVIRONMENTS: readonly ControlledWorkerEnvironment[] = [
  {
    id: "claude_code_local",
    label: "ClaudeCode ローカル",
    labelEn: "ClaudeCode Local",
    provider: "claude_code",
    allowedScope: "UI実装 / React / TypeScript / docs / evidence commit候補 (Level 4 max)",
    currentStatus: "READY",
    maxAutonomyLevel: 4,
    requiresHumanBridge: true,
    executionMode: "copy_only",
    notes: [
      "自動起動なし · no auto-launch",
      "tokenなし · no token",
      "runtimeはGO必要 · runtime requires GO",
      "Level 5: HOLD (push / runtime / 外部接続)",
    ],
    accentColor: "#8b5cf6",
  },
  {
    id: "codex_worker",
    label: "Codex ワーカー",
    labelEn: "Codex Worker",
    provider: "codex",
    allowedScope: "audit / review / scoped source reasoning / lint候補 (Level 4 max)",
    currentStatus: "COOLDOWN",
    maxAutonomyLevel: 4,
    requiresHumanBridge: true,
    executionMode: "copy_only",
    notes: [
      "自動起動なし · no auto-launch",
      "remote control: HOLD",
      "cloud task: 別途GO必要",
      "rate limit/cooldown状態を表示 · bypass不可",
      "Level 5: HOLD (push / runtime / 外部接続)",
    ],
    accentColor: "#3b82f6",
  },
  {
    id: "human_gate",
    label: "Human Gate",
    labelEn: "Human Gate",
    provider: "human",
    allowedScope: "push / runtime / OAuth / 外部接続 / x_search / Discord返信 / X投稿 / Hermes/WSL / Command Chat送信",
    currentStatus: "NEEDS_HUMAN",
    maxAutonomyLevel: 5,
    requiresHumanBridge: true,
    executionMode: "human_manual",
    notes: [
      "Level 5アクションはすべてここ",
      "人間が明示的にGOを出す",
      "AIは指示書を作るところまで",
    ],
    accentColor: "#f0883e",
  },
  {
    id: "future_adapter",
    label: "将来アダプター",
    labelEn: "Future Adapter",
    provider: "future",
    allowedScope: "MCP / hooks / daemon / remote control — 将来Gate (現在 HOLD)",
    currentStatus: "HOLD",
    maxAutonomyLevel: 5,
    requiresHumanBridge: true,
    executionMode: "future_remote_control_hold",
    notes: [
      "MCP: HOLD",
      "shell hook実行: HOLD",
      "daemon / background session: HOLD",
      "remote control: HOLD",
      "API token worker実行: HOLD",
    ],
    accentColor: "#6e7681",
  },
];

const EXAMPLE_PROMPT = `# ClaudeCode Task — docs update

docs/shikishima/ 内の対象ファイルを更新してください。

安全制約:
  productionReady: false
  execution: disabled
  rawValuesReported: false
  push: 未実施 (push GO 別途)

このプロンプトは人間がコピーして渡すことを前提としています。
Shikishima は自動的に ClaudeCode を起動しません。`;

interface WorkerEnvironmentPanelProps {
  readonly lang?: "ja" | "en";
}

export function WorkerEnvironmentPanel({ lang = "ja" }: WorkerEnvironmentPanelProps): React.JSX.Element {
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
          {lang === "ja" ? "管制ワーカー環境" : "Controlled Worker Environment"}
        </span>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
          <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#58a6ff", border: "1px solid #58a6ff44", borderRadius: 2, padding: "2px 6px" }}>
            copy-only
          </span>
          <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#f0883e", border: "1px solid #f0883e44", borderRadius: 2, padding: "2px 6px" }}>
            自動実行 HOLD
          </span>
        </div>
      </div>

      {/* Safety notice */}
      <div style={{ background: "#161b22", border: "1px solid #f0883e33", borderRadius: 4, padding: "8px 12px" }}>
        <span style={{ fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif', fontSize: 11, color: "#8b949e", lineHeight: 1.5 }}>
          {lang === "ja"
            ? "AIは指示書を作るところまで。鍵と発射ボタンは人間。ワーカーの自動起動・remote control・MCP・hooks・daemonはすべて HOLD。"
            : "AI creates the prompt. Human holds the key and the launch button. Auto-execution, remote control, MCP, hooks, daemon: all HOLD."}
        </span>
      </div>

      {/* Environment cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 8,
        }}
      >
        {ENVIRONMENTS.map((env) => (
          <WorkerEnvironmentCard key={env.id} env={env} lang={lang} />
        ))}
      </div>

      {/* Task queue */}
      <WorkerTaskQueuePanel lang={lang} />

      {/* Prompt preview example */}
      <WorkerPromptPreview
        worker="claude_code"
        taskTitle={lang === "ja" ? "ドキュメント更新 (例)" : "docs update (example)"}
        promptText={EXAMPLE_PROMPT}
        lang={lang}
      />
    </div>
  );
}
