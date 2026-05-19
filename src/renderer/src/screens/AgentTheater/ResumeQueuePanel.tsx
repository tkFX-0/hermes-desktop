/**
 * ResumeQueuePanel — display-only panel showing paused/active/gated task queue.
 * Shows who is working, who stopped, why, and what the next action is.
 * No action buttons. No execute/push/send/OAuth.
 * Design spec: AT_09_RESUME_QUEUE_AND_COOLDOWN_PANEL_EVIDENCE.md
 */

import type { ResumeTask } from "../../types/agent-theater-types";
import { ResumeTaskCard } from "./ResumeTaskCard";

const SAMPLE_TASKS: readonly ResumeTask[] = [
  {
    taskId: "AT-09",
    titleJa: "Resume Queue パネル",
    titleEn: "Resume Queue Panel",
    worker: "ClaudeCode",
    workerStatus: "ACTIVE",
    autonomyLevel: 4,
    lastCompletedStepJa: "UIコンポーネント実装",
    lastCompletedStepEn: "UI components implemented",
    nextActionJa: "typecheck / evidence 作成",
    nextActionEn: "typecheck / create evidence",
    humanGoRequired: false,
  },
  {
    taskId: "AT-07-RECHECK",
    titleJa: "管制室 視覚確認",
    titleEn: "Control Room Visual Recheck",
    worker: "Human Gate",
    workerStatus: "NEEDS_HUMAN",
    autonomyLevel: 5,
    lastCompletedStepJa: "origin/main へ push 済み",
    lastCompletedStepEn: "pushed to origin/main",
    nextActionJa: "runtime 視覚確認 (time_window 要)",
    nextActionEn: "runtime visual recheck (time_window required)",
    humanGoRequired: true,
    stopReasonJa: "Level 5 — human GO 待ち",
    stopReasonEn: "Level 5 — awaiting human GO",
  },
  {
    taskId: "XS-READ-GATE",
    titleJa: "Social Awareness 読み取りGate",
    titleEn: "Social Awareness Read-only Gate",
    worker: "GPT + x_search (将来)",
    workerStatus: "NEEDS_HUMAN",
    autonomyLevel: 5,
    lastCompletedStepJa: "docs 計画作成",
    lastCompletedStepEn: "docs plan created",
    nextActionJa: "read-only GO 明示承認",
    nextActionEn: "explicit read-only GO",
    humanGoRequired: true,
    stopReasonJa: "XS-READ gate 未開放",
    stopReasonEn: "XS-READ gate not yet opened",
  },
  {
    taskId: "CURSOR-WORKER",
    titleJa: "Cursor / Composer Worker",
    titleEn: "Cursor / Composer Worker",
    worker: "Cursor",
    workerStatus: "PAUSED",
    autonomyLevel: 5,
    lastCompletedStepJa: "オプションWorker — 未契約",
    lastCompletedStepEn: "optional worker — not contracted",
    nextActionJa: "必要時のみ有効化",
    nextActionEn: "enable only when needed",
    humanGoRequired: true,
    stopReasonJa: "未契約 / オプション",
    stopReasonEn: "not contracted / optional",
  },
] as const;

const SAFETY_BADGES = [
  { keyJa: "API自動利用", keyEn: "API auto-use", value: "disabled",     color: "#6e7681" },
  { keyJa: "runtime",    keyEn: "runtime",       value: "human GO",     color: "#f0883e" },
  { keyJa: "push",       keyEn: "push",           value: "human GO",     color: "#f0883e" },
  { keyJa: "OAuth",      keyEn: "OAuth",          value: "human GO",     color: "#f0883e" },
  { keyJa: "x_search",   keyEn: "x_search",       value: "read-only GO", color: "#f59e0b" },
  { keyJa: "Obsidian",   keyEn: "Obsidian",       value: "local GO",     color: "#f59e0b" },
  { keyJa: "外部write",  keyEn: "ext. write",     value: "blocked",      color: "#6e7681" },
] as const;

const PANEL_LABEL: React.CSSProperties = {
  fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
  fontSize: 9,
  letterSpacing: 1.2,
  color: "#6e7681",
  marginBottom: 8,
  textTransform: "uppercase" as const,
};

const TAGLINES_JA = [
  "止まっても、続きから再開できる",
  "Level 4まではAI作業候補",
  "Level 5は人間GO必須",
  "API自動利用なし",
  "外へ出す操作はしない",
] as const;

const TAGLINES_EN = [
  "Stopped tasks can resume where they left off",
  "Level 1-4: AI worker candidate",
  "Level 5: human GO required",
  "No automatic API use",
  "No outbound operations",
] as const;

interface ResumeQueuePanelProps {
  readonly lang?: "ja" | "en";
}

export function ResumeQueuePanel({ lang = "ja" }: ResumeQueuePanelProps): React.JSX.Element {
  const taglines = lang === "ja" ? TAGLINES_JA : TAGLINES_EN;

  return (
    <div
      style={{
        background: "#0d1117",
        border: "1px solid #21262d",
        borderRadius: 8,
        padding: "12px",
      }}
    >
      {/* Panel header */}
      <p style={PANEL_LABEL}>
        {lang === "ja" ? "再開キュー / クールダウン" : "RESUME QUEUE / COOLDOWN"}
      </p>

      {/* Task cards grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 8,
          marginBottom: 12,
        }}
      >
        {SAMPLE_TASKS.map((task) => (
          <ResumeTaskCard key={task.taskId} task={task} lang={lang} />
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#21262d", marginBottom: 10 }} />

      {/* Safety badge strip */}
      <p style={{ ...PANEL_LABEL, marginBottom: 6 }}>
        {lang === "ja" ? "安全境界" : "SAFETY BOUNDARY"}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
        {SAFETY_BADGES.map((b) => (
          <span
            key={b.keyEn}
            style={{
              fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
              fontSize: 8,
              color: b.color,
              border: `1px solid ${b.color}`,
              borderRadius: 2,
              padding: "1px 5px",
              whiteSpace: "nowrap" as const,
            }}
          >
            {lang === "ja" ? b.keyJa : b.keyEn}: {b.value}
          </span>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#21262d", marginBottom: 8 }} />

      {/* Plain language taglines */}
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 3 }}>
        {taglines.map((line) => (
          <span
            key={line}
            style={{
              fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
              fontSize: 8,
              color: "#6e7681",
              fontStyle: "italic",
            }}
          >
            — {line}
          </span>
        ))}
      </div>
    </div>
  );
}
