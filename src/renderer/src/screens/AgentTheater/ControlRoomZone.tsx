/**
 * ControlRoomZone — individual agent station in the control room.
 * Dark-themed zone card with CSS-only ambient desk decorations.
 * Display-only. No execute/push/send/OAuth buttons.
 * Design spec: AT_07_CONTROL_ROOM_ENVIRONMENT_LAYOUT_EVIDENCE.md
 */

import type { AgentId, PoseState } from "../../types/agent-theater-types";
import { GhostSvg } from "./GhostSvg";

const ZONE_CONFIG: Readonly<Record<AgentId, {
  nameJa: string; nameEn: string;
  labelJa: string; labelEn: string;
  subJa: string; subEn: string;
  accentColor: string;
}>> = {
  shikishima: {
    nameJa: "しきしま", nameEn: "Shikishima",
    labelJa: "管制デスク", labelEn: "Command Desk",
    subJa: "人間GO待ち", subEn: "Awaiting GO",
    accentColor: "#3b82f6",
  },
  shizume: {
    nameJa: "しずめ", nameEn: "Shizume",
    labelJa: "安全ゲート", labelEn: "Safety Gate",
    subJa: "HOLD確認", subEn: "HOLD Check",
    accentColor: "#f59e0b",
  },
  hajime: {
    nameJa: "はじめ", nameEn: "Hajime",
    labelJa: "計画デスク", labelEn: "Planning Desk",
    subJa: "scope draft", subEn: "scope draft",
    accentColor: "#22c55e",
  },
  tsumugi: {
    nameJa: "つむぎ", nameEn: "Tsumugi",
    labelJa: "開発ベンチ", labelEn: "Dev Bench",
    subJa: "draft / check", subEn: "draft / check",
    accentColor: "#f97316",
  },
  shirube: {
    nameJa: "しるべ", nameEn: "Shirube",
    labelJa: "記録ログ", labelEn: "Record Log",
    subJa: "evidence", subEn: "evidence",
    accentColor: "#a855f7",
  },
};

const POSE_LABELS: Readonly<Record<PoseState, { ja: string; en: string }>> = {
  idle:              { ja: "待機",       en: "Idle" },
  thinking:          { ja: "確認中",     en: "Checking" },
  working:           { ja: "作業中",     en: "Working" },
  handoff_send:      { ja: "引き渡し",   en: "Sending" },
  handoff_receive:   { ja: "受け取り",   en: "Receiving" },
  waiting_human_go:  { ja: "GO待ち",     en: "Await GO" },
  pass:              { ja: "通過",       en: "Pass" },
  hold_stop_blocked: { ja: "HOLD",       en: "HOLD" },
};

const POSE_COLOR: Readonly<Record<PoseState, string>> = {
  idle:              "#6e7681",
  thinking:          "#58a6ff",
  working:           "#58a6ff",
  handoff_send:      "#3fb950",
  handoff_receive:   "#3fb950",
  waiting_human_go:  "#f0883e",
  pass:              "#3fb950",
  hold_stop_blocked: "#f85149",
};

// ── CSS-only ambient desk decorations ──

function CommandDeskAmbient({ color }: { color: string }) {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "flex-end" }}>
      {([30, 22] as const).map((w, i) => (
        <div key={i} style={{ width: w, height: 16, border: `1.5px solid ${color}`, borderRadius: 2, background: "#040d21", flexShrink: 0 }}>
          <div style={{ margin: "3px 3px 0", height: 1, background: color, opacity: 0.6 }} />
          <div style={{ margin: "2px 3px 0", height: 1, background: color, opacity: 0.35 }} />
        </div>
      ))}
      <div style={{ display: "flex", gap: 2, marginLeft: 3 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: i === 0 ? color : "#1c2333" }} />
        ))}
      </div>
    </div>
  );
}

function SafetyGateAmbient({ color }: { color: string }) {
  return (
    <div style={{ display: "flex", gap: 3, alignItems: "flex-end" }}>
      {([14, 20, 14] as const).map((h, i) => (
        <div key={i} style={{ width: 5, height: h, background: i === 1 ? color : "#1c2333", borderRadius: 1, opacity: i === 1 ? 0.9 : 0.55 }} />
      ))}
      <div style={{ marginLeft: 5, fontFamily: '"IBM Plex Mono", monospace', fontSize: 7, color, border: `1px solid ${color}`, padding: "1px 3px", borderRadius: 2, flexShrink: 0, opacity: 0.85 }}>
        HOLD
      </div>
    </div>
  );
}

function PlanningDeskAmbient({ color }: { color: string }) {
  return (
    <div style={{ position: "relative", width: 46, height: 28, border: `1px solid ${color}`, borderRadius: 2, background: "#040d21", overflow: "hidden", opacity: 0.9 }}>
      <div style={{ position: "absolute", top: "33%", left: 0, right: 0, height: 1, background: color, opacity: 0.3 }} />
      <div style={{ position: "absolute", top: "66%", left: 0, right: 0, height: 1, background: color, opacity: 0.3 }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 1, background: color, opacity: 0.3 }} />
      <svg style={{ position: "absolute", bottom: 3, left: 3 }} width="40" height="8" viewBox="0 0 40 8">
        <path d="M1,6 C8,2 22,7 30,3 C35,1 38,4 39,5" stroke={color} strokeWidth="1.5" fill="none" strokeDasharray="2 1.5" />
        <circle cx="1" cy="6" r="2" fill={color} />
        <circle cx="39" cy="5" r="2" fill={color} />
      </svg>
    </div>
  );
}

function DevBenchAmbient({ color }: { color: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {[36, 30, 24].map((w, row) => (
        <div key={row} style={{ display: "flex", gap: 2 }}>
          {Array.from({ length: Math.floor(w / 7) }).map((_, j) => (
            <div key={j} style={{ width: 5, height: 4, borderRadius: 1, background: (j + row) % 4 === 0 ? color : "#1c2333", opacity: 0.9 }} />
          ))}
        </div>
      ))}
      <div style={{ marginTop: 2, width: 28, height: 7, border: `1px solid ${color}`, borderRadius: 1, background: "#040d21", opacity: 0.8 }}>
        <div style={{ margin: "2px 3px 0", height: 1, background: color, opacity: 0.5 }} />
      </div>
    </div>
  );
}

function RecordLogAmbient({ color }: { color: string }) {
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "flex-end" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {[28, 22, 16].map((w, i) => (
          <div key={i} style={{ height: 5, width: w, background: i === 0 ? color : "#1c2333", borderRadius: 1, opacity: i === 0 ? 0.85 : 0.5 }} />
        ))}
        <div style={{ borderBottom: `1.5px solid ${color}`, width: 32, opacity: 0.7 }} />
      </div>
      <div style={{ width: 14, height: 20, border: `1px solid ${color}`, borderRadius: "1px 3px 3px 1px", background: "#040d21", opacity: 0.85 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ margin: "2.5px 2px 0", height: 1, background: color, opacity: 0.5 }} />
        ))}
      </div>
    </div>
  );
}

const AMBIENT_MAP: Readonly<Record<AgentId, (props: { color: string }) => React.JSX.Element>> = {
  shikishima: CommandDeskAmbient,
  shizume:    SafetyGateAmbient,
  hajime:     PlanningDeskAmbient,
  tsumugi:    DevBenchAmbient,
  shirube:    RecordLogAmbient,
};

// ── Main component ──

export interface ControlRoomZoneProps {
  readonly agentId: AgentId;
  readonly pose: PoseState;
  readonly lang?: "ja" | "en";
}

export function ControlRoomZone({ agentId, pose, lang = "ja" }: ControlRoomZoneProps) {
  const config = ZONE_CONFIG[agentId];
  const Ambient = AMBIENT_MAP[agentId];
  const poseLabel = lang === "ja" ? POSE_LABELS[pose].ja : POSE_LABELS[pose].en;
  const poseColor = POSE_COLOR[pose];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "10px 8px",
        background: "#161b22",
        borderRadius: 6,
        border: "1px solid #21262d",
        borderTop: `3px solid ${config.accentColor}`,
        gap: 5,
        minWidth: 0,
      }}
    >
      {/* Zone label */}
      <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9, letterSpacing: 0.8, color: config.accentColor, textTransform: "uppercase" as const }}>
        {lang === "ja" ? config.labelJa : config.labelEn}
      </span>

      {/* Agent SVG */}
      <GhostSvg agentId={agentId} size={42} />

      {/* Agent name */}
      <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10, fontWeight: 700, color: "#c9d1d9" }}>
        {lang === "ja" ? config.nameJa : config.nameEn}
      </span>

      {/* Pose badge */}
      <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 8, color: poseColor, border: `1px solid ${poseColor}`, borderRadius: 2, padding: "1px 5px", letterSpacing: 0.4 }}>
        {poseLabel}
      </span>

      {/* Ambient decoration */}
      <div style={{ marginTop: 4 }}>
        <Ambient color={config.accentColor} />
      </div>
    </div>
  );
}
