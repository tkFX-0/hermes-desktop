/**
 * WorkerStatusPanel — display-only panel showing all workers and autonomy boundary.
 * No execute/push/send. Shows who can work, who needs human GO.
 * Design spec: AT_08_SLOT_WORKER_STATUS_PANEL_EVIDENCE.md
 */

import { WorkerStatusCard } from "./WorkerStatusCard";
import type { WorkerCardData } from "./WorkerStatusCard";
import { AutonomyLevelLegend } from "./AutonomyLevelLegend";

const WORKERS: readonly WorkerCardData[] = [
  {
    id: "gpt",
    nameJa: "GPT",
    nameEn: "GPT",
    roleJa: "設計 / GO文 / 判断整理",
    roleEn: "Design / GO drafting / decision review",
    status: "READY",
    permissionJa: "指示 / review / planning",
    permissionEn: "instruction / review / planning",
    accentColor: "#10b981",
  },
  {
    id: "claudecode",
    nameJa: "ClaudeCode",
    nameEn: "ClaudeCode",
    roleJa: "UI実装 / React / TypeScript",
    roleEn: "UI impl / React / TypeScript",
    status: "READY",
    permissionJa: "Level 4まで実装",
    permissionEn: "scoped impl up to Level 4",
    accentColor: "#8b5cf6",
  },
  {
    id: "codex",
    nameJa: "Codex",
    nameEn: "Codex",
    roleJa: "push readiness / lint / スコープパッチ",
    roleEn: "push readiness / lint / scoped fix",
    status: "READY",
    permissionJa: "review / scoped fix",
    permissionEn: "review / scoped fix",
    accentColor: "#3b82f6",
  },
  {
    id: "cursor",
    nameJa: "Cursor / Composer",
    nameEn: "Cursor / Composer",
    roleJa: "オプションIDE Worker",
    roleEn: "optional IDE worker",
    status: "BLOCKED",
    permissionJa: "将来オプション",
    permissionEn: "future optional worker",
    accentColor: "#6e7681",
  },
  {
    id: "human-gate",
    nameJa: "Human Gate",
    nameEn: "Human Gate",
    roleJa: "push / runtime / OAuth / 外部GO",
    roleEn: "push / runtime / OAuth / ext. GO",
    status: "NEEDS_HUMAN",
    permissionJa: "Level 5承認のみ",
    permissionEn: "Level 5 approval only",
    accentColor: "#f0883e",
  },
] as const;

const PANEL_LABEL: React.CSSProperties = {
  fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
  fontSize: 9,
  letterSpacing: 1.2,
  color: "#6e7681",
  marginBottom: 8,
  textTransform: "uppercase" as const,
};

interface WorkerStatusPanelProps {
  readonly lang?: "ja" | "en";
}

export function WorkerStatusPanel({ lang = "ja" }: WorkerStatusPanelProps): React.JSX.Element {
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
        {lang === "ja" ? "ワーカー状態" : "WORKER STATUS"}
      </p>

      {/* Worker cards grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))",
          gap: 8,
          marginBottom: 12,
        }}
      >
        {WORKERS.map((worker) => (
          <WorkerStatusCard key={worker.id} worker={worker} lang={lang} />
        ))}
      </div>

      {/* Autonomy level legend */}
      <p style={{ ...PANEL_LABEL, marginBottom: 6 }}>
        {lang === "ja" ? "自律レベル" : "AUTONOMY LEVELS"}
      </p>
      <AutonomyLevelLegend lang={lang} />
    </div>
  );
}
