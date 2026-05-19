/**
 * ResumeTaskCard — display-only card for one paused/active/human-gated task.
 * No action buttons. No execute/push/send.
 * Design spec: AT_09_RESUME_QUEUE_AND_COOLDOWN_PANEL_EVIDENCE.md
 */

import type { ResumeTask } from "../../types/agent-theater-types";
import { CooldownBadge } from "./CooldownBadge";

const STATUS_ACCENT: Record<string, string> = {
  ACTIVE:        "#3fb950",
  PAUSED:        "#f59e0b",
  COOLDOWN:      "#f59e0b",
  HANDOFF_READY: "#58a6ff",
  NEEDS_HUMAN:   "#f0883e",
  COMPLETED:     "#8b949e",
  FAILED:        "#f85149",
};

interface ResumeTaskCardProps {
  readonly task: ResumeTask;
  readonly lang?: "ja" | "en";
}

export function ResumeTaskCard({ task, lang = "ja" }: ResumeTaskCardProps): React.JSX.Element {
  const accent = STATUS_ACCENT[task.workerStatus] ?? "#6e7681";
  const isHuman = task.humanGoRequired;
  const levelColor = task.autonomyLevel <= 4 ? "#3fb950" : "#f0883e";

  return (
    <div
      style={{
        background: "#161b22",
        border: "1px solid #21262d",
        borderLeft: `3px solid ${accent}`,
        borderRadius: 4,
        padding: "8px 10px",
        display: "flex",
        flexDirection: "column" as const,
        gap: 5,
        minWidth: 0,
      }}
    >
      {/* Top row: task ID + status badge */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4 }}>
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 8,
            color: "#6e7681",
            letterSpacing: 0.5,
          }}
        >
          {task.taskId}
        </span>
        <CooldownBadge status={task.workerStatus} lang={lang} />
      </div>

      {/* Title */}
      <span
        style={{
          fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif',
          fontSize: 11,
          fontWeight: 600,
          color: "#e6edf3",
          lineHeight: 1.3,
        }}
      >
        {lang === "ja" ? task.titleJa : task.titleEn}
      </span>

      {/* Worker + level row */}
      <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 8,
            color: "#8b949e",
          }}
        >
          {lang === "ja" ? "Worker:" : "Worker:"}
        </span>
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 8,
            color: "#c9d1d9",
          }}
        >
          {task.worker}
        </span>
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 7,
            color: levelColor,
            border: `1px solid ${levelColor}`,
            borderRadius: 2,
            padding: "0 3px",
            whiteSpace: "nowrap" as const,
          }}
        >
          Lv {task.autonomyLevel}
        </span>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#21262d" }} />

      {/* Last completed step */}
      <div style={{ display: "flex", gap: 4 }}>
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 8,
            color: "#6e7681",
            whiteSpace: "nowrap" as const,
            flexShrink: 0,
          }}
        >
          {lang === "ja" ? "完了:" : "Done:"}
        </span>
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 8,
            color: "#8b949e",
          }}
        >
          {lang === "ja" ? task.lastCompletedStepJa : task.lastCompletedStepEn}
        </span>
      </div>

      {/* Next action */}
      <div style={{ display: "flex", gap: 4 }}>
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 8,
            color: "#6e7681",
            whiteSpace: "nowrap" as const,
            flexShrink: 0,
          }}
        >
          {lang === "ja" ? "次:" : "Next:"}
        </span>
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 8,
            color: isHuman ? "#f0883e" : "#c9d1d9",
          }}
        >
          {lang === "ja" ? task.nextActionJa : task.nextActionEn}
        </span>
      </div>

      {/* Human GO required note */}
      {isHuman && (
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 7,
            color: "#f0883e",
            border: "1px solid #f0883e",
            borderRadius: 2,
            padding: "1px 4px",
            alignSelf: "flex-start" as const,
          }}
        >
          {lang === "ja" ? "Level 5 / 人間GO必須" : "Level 5 / HUMAN GO"}
        </span>
      )}

      {/* Stop reason (if present) */}
      {(task.stopReasonJa ?? task.stopReasonEn) && (
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 7,
            color: "#6e7681",
            fontStyle: "italic",
          }}
        >
          {lang === "ja" ? (task.stopReasonJa ?? "") : (task.stopReasonEn ?? "")}
        </span>
      )}
    </div>
  );
}
