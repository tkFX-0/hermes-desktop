/**
 * PixelRoomAgent — agent character in the 2.5D stage.
 * PXR-05C: stronger character identity, larger presence, role-specific accessories.
 * GhostSvg + animations. Absolutely positioned.
 */

import type { AgentId, PoseState } from "../../types/agent-theater-types";
import { GhostSvg } from "./GhostSvg";

const MONO = '"IBM Plex Mono", ui-monospace, monospace';

const ACCENT: Record<AgentId, string> = {
  shikishima: "#7eb8ff",
  shizume:    "#f85149",
  hajime:     "#3fb950",
  tsumugi:    "#f0883e",
  shirube:    "#b07fff",
};

const IDLE_ANIM: Record<AgentId, string> = {
  shikishima: "pxr-anim-scan",
  shizume:    "pxr-anim-hold",
  hajime:     "pxr-anim-lean",
  tsumugi:    "pxr-anim-type",
  shirube:    "pxr-anim-pen",
};

/* Role identifiers matching sprite-sheet reference */
const ROLE_DATA: Record<AgentId, {
  icon: string;
  accessory: string;  /* small accessory shown above ghost */
  badge: string;      /* colored label */
}> = {
  shikishima: { icon: "🎧", accessory: "COMMAND",  badge: "管制デスク" },
  shizume:    { icon: "⛑️",  accessory: "HOLD GATE", badge: "安全ゲート" },
  hajime:     { icon: "🗺",  accessory: "PLANNING",  badge: "計画デスク" },
  tsumugi:    { icon: "🔧",  accessory: "DEV BENCH", badge: "開発ベンチ" },
  shirube:    { icon: "📚",  accessory: "ARCHIVE",   badge: "記録棚"   },
};

function poseAnim(id: AgentId, pose: PoseState): string {
  switch (pose) {
    case "hold_stop_blocked": return "pxr-anim-hold";
    case "working":           return id === "tsumugi" ? "pxr-anim-type" : "pxr-anim-float";
    case "thinking":          return "pxr-anim-scan";
    default:                  return IDLE_ANIM[id];
  }
}

function poseLabel(pose: PoseState): { text: string; color: string } {
  switch (pose) {
    case "hold_stop_blocked": return { text: "HOLD",     color: "#f85149" };
    case "waiting_human_go":  return { text: "GO待ち",   color: "#f0883e" };
    case "working":           return { text: "作業中",   color: "#3fb950" };
    case "pass":              return { text: "PASS",     color: "#3fb950" };
    case "thinking":          return { text: "判断中",   color: "#7eb8ff" };
    case "handoff_receive":   return { text: "受け取り", color: "#3fb950" };
    default:                  return { text: "待機",     color: "#6680aa" };
  }
}

export interface PixelRoomAgentProps {
  readonly agentId: AgentId;
  readonly nameJa: string;
  readonly roleJa: string;
  readonly pose: PoseState;
  readonly x: number;
  readonly y: number;
  readonly zIndex: number;
  readonly size?: number;
}

export function PixelRoomAgent({
  agentId, nameJa, roleJa, pose, x, y, zIndex, size = 56,
}: PixelRoomAgentProps): React.JSX.Element {
  const accent = ACCENT[agentId];
  const anim   = poseAnim(agentId, pose);
  const status = poseLabel(pose);
  const role   = ROLE_DATA[agentId];
  const isCommand = agentId === "shikishima";
  const isGate    = agentId === "shizume";

  return (
    <div style={{
      position: "absolute",
      left: x, top: y, zIndex,
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 3,
      transform: "translateX(-50%)",
    }}>
      {/* Accessory label */}
      <div style={{
        background: `${accent}20`,
        border: `1.5px solid ${accent}50`,
        borderRadius: 10,
        padding: "2px 8px",
        display: "flex", alignItems: "center", gap: 4,
        boxShadow: `0 0 8px ${accent}20`,
      }}>
        <span style={{ fontSize: 11 }} aria-hidden>{role.icon}</span>
        <span style={{ fontFamily: MONO, fontSize: 7.5, color: accent, letterSpacing: 0.5, fontWeight: 700 }}>
          {role.accessory}
        </span>
      </div>

      {/* Ghost with glow effect */}
      <div
        className={anim}
        style={{
          display: "flex",
          filter: [
            `drop-shadow(0 0 10px ${accent}77)`,
            `drop-shadow(0 5px 8px rgba(0,0,0,0.6))`,
            isGate && pose === "hold_stop_blocked" ? "drop-shadow(0 0 16px rgba(248,81,73,0.6))" : "",
            isCommand ? "drop-shadow(0 0 12px rgba(88,166,255,0.5))" : "",
          ].filter(Boolean).join(" "),
        }}
      >
        <GhostSvg agentId={agentId} size={size} />
      </div>

      {/* Name + status tag */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 2.5,
        background: "rgba(1,3,14,0.92)",
        border: `2px solid ${accent}55`,
        borderRadius: 5,
        padding: "3px 10px",
        whiteSpace: "nowrap",
        boxShadow: `0 0 10px ${accent}25`,
      }}>
        {/* Name */}
        <span style={{
          fontFamily: MONO, fontSize: 11, fontWeight: 700,
          color: accent, letterSpacing: 1,
        }}>
          {nameJa}
        </span>
        {/* Role */}
        <span style={{ fontFamily: MONO, fontSize: 7.5, color: "#5566aa" }}>
          {roleJa}
        </span>
        {/* Status */}
        <span style={{
          fontFamily: MONO, fontSize: 7.5,
          color: status.color,
          border: `1px solid ${status.color}44`,
          borderRadius: 3,
          padding: "0 6px",
          background: `${status.color}10`,
        }}>
          {status.text}
        </span>
      </div>
    </div>
  );
}
