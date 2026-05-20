/**
 * WorkerTaskQueuePanel — display-only worker task queue.
 * Shows pending tasks with provider, level, status, and execution mode.
 * No launch buttons. No execution. Human bridge only.
 * Design spec: WK_03_WORKER_TASK_QUEUE_PLAN.md
 */

import type {
  ControlledWorkerTask,
  WorkerEnvironmentStatus,
  WorkerExecutionMode,
  WorkerProvider,
} from "../../types/worker-environment-types";

const STATUS_COLOR: Record<WorkerEnvironmentStatus, string> = {
  READY:       "#3fb950",
  BUSY:        "#58a6ff",
  COOLDOWN:    "#f59e0b",
  DEGRADED:    "#8b949e",
  BLOCKED:     "#6e7681",
  FAILED:      "#f85149",
  NEEDS_HUMAN: "#f0883e",
  HOLD:        "#6e7681",
};

const PROVIDER_COLOR: Record<WorkerProvider, string> = {
  human:       "#f0883e",
  claude_code: "#8b5cf6",
  codex:       "#3b82f6",
  cursor:      "#6e7681",
  gpt:         "#10b981",
  future:      "#6e7681",
};

const PROVIDER_LABEL: Record<WorkerProvider, string> = {
  human:       "Human Gate",
  claude_code: "ClaudeCode",
  codex:       "Codex",
  cursor:      "Cursor",
  gpt:         "GPT",
  future:      "Future",
};

const MODE_LABEL: Record<WorkerExecutionMode, string> = {
  copy_only:                  "copy-only",
  human_manual:               "human manual",
  future_remote_control_hold: "HOLD",
  forbidden:                  "forbidden",
};

const EXAMPLE_TASKS: readonly ControlledWorkerTask[] = [
  {
    id: "wk-q-01",
    title: "ドキュメント更新・証跡作成",
    titleEn: "docs update / evidence record",
    provider: "claude_code",
    status: "READY",
    autonomyLevel: 4,
    taskKind: "docs",
    executionMode: "copy_only",
    promptPreview: "docs/shikishima/*.md を更新し、証跡を記録してください。",
    requiredHumanAction: "内容確認 + push GO",
    forbiddenActions: ["push", "runtime", "外部接続"],
    evidenceTarget: "docs/shikishima/",
    gateStatus: "READY",
  },
  {
    id: "wk-q-02",
    title: "UI実装 / React / TypeScript",
    titleEn: "UI implementation (React/TypeScript)",
    provider: "claude_code",
    status: "NEEDS_HUMAN",
    autonomyLevel: 4,
    taskKind: "ui",
    executionMode: "human_manual",
    promptPreview: "表示専用コンポーネントを追加します。typecheck確認後コミット候補。",
    requiredHumanAction: "実装確認 + typecheck確認 + push GO",
    forbiddenActions: ["push", "runtime", "外部API"],
    evidenceTarget: "src/renderer/src/screens/",
    gateStatus: "NEEDS_HUMAN",
  },
  {
    id: "wk-q-03",
    title: "push to origin/main",
    titleEn: "push to origin/main",
    provider: "human",
    status: "NEEDS_HUMAN",
    autonomyLevel: 5,
    taskKind: "push",
    executionMode: "human_manual",
    promptPreview: "git push origin main — 人間GOが必要です。",
    requiredHumanAction: "明示的 push GO 必須",
    forbiddenActions: ["自動push", "force push"],
    evidenceTarget: "git log",
    gateStatus: "NEEDS_HUMAN · Level 5",
  },
  {
    id: "wk-q-04",
    title: "Codex audit / review",
    titleEn: "Codex audit / code review",
    provider: "codex",
    status: "COOLDOWN",
    autonomyLevel: 4,
    taskKind: "audit",
    executionMode: "copy_only",
    promptPreview: "コードレビューと型チェック候補の確認。rate limitに注意。",
    requiredHumanAction: "結果を手動でShikishimaに戻す",
    forbiddenActions: ["自動実行", "remote control", "token使用"],
    evidenceTarget: "review notes",
    gateStatus: "COOLDOWN (rate limit注意)",
  },
  {
    id: "wk-q-05",
    title: "Worker自動実行アダプター",
    titleEn: "Worker auto-execution adapter",
    provider: "future",
    status: "HOLD",
    autonomyLevel: 5,
    taskKind: "external",
    executionMode: "future_remote_control_hold",
    promptPreview: "MCP / hooks / daemon / remote control — 将来Gate。現在 HOLD。",
    requiredHumanAction: "WK-05 Gate GO (将来)",
    forbiddenActions: ["MCP接続", "hook実行", "daemon起動", "remote control"],
    evidenceTarget: "WK_WORKER_AUTOMATION_HOLD_POLICY.md",
    gateStatus: "HOLD",
  },
];

interface WorkerTaskQueuePanelProps {
  readonly tasks?: readonly ControlledWorkerTask[];
  readonly lang?: "ja" | "en";
}

export function WorkerTaskQueuePanel({
  tasks = EXAMPLE_TASKS,
  lang = "ja",
}: WorkerTaskQueuePanelProps): React.JSX.Element {
  return (
    <div
      style={{
        background: "#0d1117",
        border: "1px solid #21262d",
        borderRadius: 6,
        padding: "14px 16px",
        display: "flex",
        flexDirection: "column" as const,
        gap: 10,
      }}
    >
      {/* Panel header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" as const }}>
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 12, fontWeight: 700, color: "#c9d1d9" }}>
          {lang === "ja" ? "ワーカーキュー" : "Worker Queue"}
        </span>
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#58a6ff", border: "1px solid #58a6ff44", borderRadius: 2, padding: "2px 8px" }}>
          copy-only · human bridge
        </span>
      </div>

      {/* Task rows */}
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
        {tasks.map((task) => {
          const sc = STATUS_COLOR[task.status];
          const pc = PROVIDER_COLOR[task.provider];
          const pl = PROVIDER_LABEL[task.provider];
          const ml = MODE_LABEL[task.executionMode];
          return (
            <div
              key={task.id}
              style={{
                background: "#161b22",
                border: "1px solid #21262d",
                borderRadius: 3,
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap" as const,
              }}
            >
              {/* Provider chip */}
              <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: pc, border: `1px solid ${pc}44`, borderRadius: 2, padding: "1px 5px", flexShrink: 0 }}>
                {pl}
              </span>

              {/* Title */}
              <span style={{ fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif', fontSize: 11, color: "#c9d1d9", flex: 1, minWidth: 80 }}>
                {lang === "ja" ? task.title : task.titleEn}
              </span>

              {/* Level */}
              <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#8b949e", flexShrink: 0 }}>
                Lv{task.autonomyLevel}
              </span>

              {/* Mode */}
              <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#6e7681", flexShrink: 0 }}>
                {ml}
              </span>

              {/* Status */}
              <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: sc, border: `1px solid ${sc}44`, borderRadius: 2, padding: "1px 5px", flexShrink: 0 }}>
                {task.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
