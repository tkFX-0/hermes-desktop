/**
 * CooldownBadge — compact status badge for ResumeTaskStatus.
 * Display-only. Design spec: AT_09_RESUME_QUEUE_AND_COOLDOWN_PANEL_EVIDENCE.md
 */

import type { ResumeTaskStatus } from "../../types/agent-theater-types";

const STATUS_CONFIG: Record<
  ResumeTaskStatus,
  { color: string; labelJa: string; labelEn: string }
> = {
  ACTIVE:        { color: "#3fb950", labelJa: "作業中",        labelEn: "ACTIVE"        },
  PAUSED:        { color: "#f59e0b", labelJa: "一時停止",      labelEn: "PAUSED"        },
  COOLDOWN:      { color: "#f59e0b", labelJa: "クールダウン",  labelEn: "COOLDOWN"      },
  HANDOFF_READY: { color: "#58a6ff", labelJa: "引継ぎ準備",    labelEn: "HANDOFF READY" },
  NEEDS_HUMAN:   { color: "#f0883e", labelJa: "人間GO待ち",    labelEn: "NEEDS HUMAN"   },
  COMPLETED:     { color: "#8b949e", labelJa: "完了",          labelEn: "COMPLETED"     },
  FAILED:        { color: "#f85149", labelJa: "エラー終了",    labelEn: "FAILED"        },
};

interface CooldownBadgeProps {
  readonly status: ResumeTaskStatus;
  readonly lang?: "ja" | "en";
}

export function CooldownBadge({ status, lang = "ja" }: CooldownBadgeProps): React.JSX.Element {
  const { color, labelJa, labelEn } = STATUS_CONFIG[status];
  return (
    <span
      style={{
        fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
        fontSize: 10,
        fontWeight: 700,
        color,
        border: `1px solid ${color}`,
        borderRadius: 2,
        padding: "2px 6px",
        whiteSpace: "nowrap" as const,
        flexShrink: 0,
      }}
    >
      {lang === "ja" ? labelJa : labelEn}
    </span>
  );
}
