/**
 * WorkerStatusCard — display-only card for one worker's current status.
 * No buttons. No execute/push/send. Purely informational.
 * Design spec: AT_08_SLOT_WORKER_STATUS_PANEL_EVIDENCE.md
 */

import type { SlotWorkerStatus } from "../../types/agent-theater-types";

export interface WorkerCardData {
  readonly id: string;
  readonly nameJa: string;
  readonly nameEn: string;
  readonly roleJa: string;
  readonly roleEn: string;
  readonly status: SlotWorkerStatus;
  readonly permissionJa: string;
  readonly permissionEn: string;
  readonly accentColor: string;
}

const STATUS_CONFIG: Record<SlotWorkerStatus, { color: string; labelJa: string; labelEn: string }> = {
  READY:       { color: "#3fb950", labelJa: "使用可能",         labelEn: "READY"       },
  BUSY:        { color: "#58a6ff", labelJa: "作業中",           labelEn: "BUSY"        },
  COOLDOWN:    { color: "#f59e0b", labelJa: "利用制限中",       labelEn: "COOLDOWN"    },
  DEGRADED:    { color: "#8b949e", labelJa: "軽作業のみ",       labelEn: "DEGRADED"    },
  BLOCKED:     { color: "#6e7681", labelJa: "操作待ち",         labelEn: "BLOCKED"     },
  FAILED:      { color: "#f85149", labelJa: "エラー終了",       labelEn: "FAILED"      },
  NEEDS_HUMAN: { color: "#f0883e", labelJa: "人間GO待ち",       labelEn: "NEEDS HUMAN" },
};

interface WorkerStatusCardProps {
  readonly worker: WorkerCardData;
  readonly lang?: "ja" | "en";
}

export function WorkerStatusCard({ worker, lang = "ja" }: WorkerStatusCardProps): React.JSX.Element {
  const st = STATUS_CONFIG[worker.status];
  return (
    <div
      style={{
        background: "#161b22",
        border: "1px solid #21262d",
        borderLeft: `3px solid ${worker.accentColor}`,
        borderRadius: 4,
        padding: "8px 10px",
        display: "flex",
        flexDirection: "column" as const,
        gap: 4,
        minWidth: 0,
      }}
    >
      {/* Name row + status badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 4,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 10,
            fontWeight: 700,
            color: worker.accentColor,
          }}
        >
          {lang === "ja" ? worker.nameJa : worker.nameEn}
        </span>
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 7,
            color: st.color,
            border: `1px solid ${st.color}`,
            borderRadius: 2,
            padding: "1px 4px",
            whiteSpace: "nowrap" as const,
            flexShrink: 0,
          }}
        >
          {lang === "ja" ? st.labelJa : st.labelEn}
        </span>
      </div>

      {/* Role */}
      <span
        style={{
          fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif',
          fontSize: 9,
          color: "#8b949e",
          lineHeight: 1.3,
        }}
      >
        {lang === "ja" ? worker.roleJa : worker.roleEn}
      </span>

      {/* Permission note */}
      <span
        style={{
          fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
          fontSize: 8,
          color: "#6e7681",
          lineHeight: 1.2,
        }}
      >
        {lang === "ja" ? worker.permissionJa : worker.permissionEn}
      </span>
    </div>
  );
}
