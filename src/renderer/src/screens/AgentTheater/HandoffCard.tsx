/**
 * HandoffCard — floating task-stage indicator shown above the active handoff step.
 * Display-only. CSS animation class "at-handoff-card" applied by HandoffLane styles.
 * Design spec: AT_07_CONTROL_ROOM_ENVIRONMENT_LAYOUT_EVIDENCE.md
 */

import type { HandoffStage } from "../../types/agent-theater-types";

const STAGE_LABEL: Record<HandoffStage, { ja: string; en: string; color: string }> = {
  request_received: { ja: "依頼受付",   en: "Request In",   color: "#3b82f6" },
  planning:         { ja: "計画中",     en: "Planning",     color: "#22c55e" },
  safety_check:     { ja: "安全確認中", en: "Safety Check", color: "#f59e0b" },
  dev_prepare:      { ja: "作業準備中", en: "Preparing",    color: "#f97316" },
  recording:        { ja: "記録中",     en: "Recording",    color: "#a855f7" },
  waiting_human_go: { ja: "GO待ち",    en: "Await GO",     color: "#f0883e" },
  hold_blocked:     { ja: "HOLD",      en: "HOLD",         color: "#f0883e" },
  stopped:          { ja: "STOP",      en: "STOP",         color: "#f85149" },
};

interface HandoffCardProps {
  readonly stage: HandoffStage;
  readonly lang?: "ja" | "en";
}

export function HandoffCard({ stage, lang = "ja" }: HandoffCardProps) {
  const { color, ja, en } = STAGE_LABEL[stage];
  return (
    <div
      className="at-handoff-card"
      style={{
        background: "#161b22",
        border: `1px solid ${color}`,
        borderRadius: 3,
        padding: "2px 5px 1px",
        fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
        fontSize: 7,
        fontWeight: 700,
        color,
        whiteSpace: "nowrap" as const,
        textAlign: "center" as const,
      }}
    >
      {lang === "ja" ? ja : en}
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: "3px solid transparent",
          borderRight: "3px solid transparent",
          borderTop: `3px solid ${color}`,
          margin: "1px auto 0",
        }}
      />
    </div>
  );
}
