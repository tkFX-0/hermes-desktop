/**
 * WorkerPromptPreview — display-only copy-only prompt block.
 * Shows a generated prompt for a worker task.
 * No send buttons. No external action. Human copies manually.
 * Design spec: WK_04_WORKER_PROMPT_EXPORT_PLAN.md
 */

import type { WorkerProvider } from "../../types/worker-environment-types";

const PROVIDER_COLOR: Record<WorkerProvider, string> = {
  human:       "#f0883e",
  claude_code: "#8b5cf6",
  codex:       "#3b82f6",
  cursor:      "#6e7681",
  gpt:         "#10b981",
  future:      "#6e7681",
};

interface WorkerPromptPreviewProps {
  readonly worker: WorkerProvider;
  readonly taskTitle: string;
  readonly promptText: string;
  readonly lang?: "ja" | "en";
}

export function WorkerPromptPreview({
  worker,
  taskTitle,
  promptText,
  lang = "ja",
}: WorkerPromptPreviewProps): React.JSX.Element {
  const color = PROVIDER_COLOR[worker];

  return (
    <div
      style={{
        background: "#0d1117",
        border: "1px solid #21262d",
        borderTop: `2px solid ${color}`,
        borderRadius: 4,
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column" as const,
        gap: 8,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, flexWrap: "wrap" as const }}>
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 11, fontWeight: 700, color }}>
          {worker} · {taskTitle}
        </span>
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#58a6ff", border: "1px solid #58a6ff44", borderRadius: 2, padding: "2px 6px" }}>
          copy-only
        </span>
      </div>

      {/* Prompt block */}
      <pre
        style={{
          fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
          fontSize: 10,
          color: "#8b949e",
          background: "#161b22",
          border: "1px solid #21262d",
          borderRadius: 3,
          padding: "10px 12px",
          margin: 0,
          whiteSpace: "pre-wrap" as const,
          wordBreak: "break-word" as const,
          lineHeight: 1.5,
          maxHeight: 160,
          overflowY: "auto" as const,
        }}
      >
        {promptText}
      </pre>

      {/* Human bridge notice */}
      <span style={{ fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif', fontSize: 10, color: "#6e7681", lineHeight: 1.4 }}>
        {lang === "ja"
          ? "このプロンプトは人間がコピーして渡すことを前提としています。Shikishima は自動的にワーカーを起動しません。"
          : "This prompt is for human copy/manual use only. Shikishima does not start the worker automatically."}
      </span>
    </div>
  );
}
