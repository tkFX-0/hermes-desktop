/**
 * PixelRoomAgent — agent character in the 2.5D stage.
 * PXR-05B: larger ghost, stronger name tag, role badge.
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

const ROLE_ICONS: Record<AgentId, string> = {
  shikishima: "🎧",
  shizume:    "⛑️",
  hajime:     "🗺",
  tsumugi:    "🔧",
  shirube:    "📚",
};

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
  agentId, nameJa, roleJa, pose, x, y, zIndex, size = 54,
}: PixelRoomAgentProps): React.JSX.Element {
  const accent = ACCENT[agentId];
  const anim   = poseAnim(agentId, pose);
  const status = poseLabel(pose);
  const icon   = ROLE_ICONS[agentId];

  return (
    <div style={{
      position: "absolute",
      left: x, top: y, zIndex,
      display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
      transform: "translateX(-50%)",
    }}>
      {/* Role icon (small, above ghost) */}
      <div style={{
        background: `${accent}22`,
        border: `1px solid ${accent}44`,
        borderRadius: 10,
        padding: "1px 6px",
        fontFamily: MONO, fontSize: 7.5,
        color: accent, letterSpacing: 0.5,
        display: "flex", alignItems: "center", gap: 3,
      }}>
        <span style={{ fontSize: 9 }} aria-hidden>{icon}</span>
        {roleJa}
      </div>

      {/* Ghost with glow */}
      <div
        className={anim}
        style={{
          display: "flex",
          filter: `drop-shadow(0 0 8px ${accent}66) drop-shadow(0 4px 6px rgba(0,0,0,0.5))`,
        }}
      >
        <GhostSvg agentId={agentId} size={size} />
      </div>

      {/* Name tag */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
        background: "rgba(2,5,18,0.9)",
        border: `1.5px solid ${accent}55`,
        borderRadius: 4,
        padding: "3px 9px",
        whiteSpace: "nowrap",
        boxShadow: `0 0 8px ${accent}22`,
      }}>
        <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, color: accent, letterSpacing: 1 }}>
          {nameJa}
        </span>
        <span style={{
          fontFamily: MONO, fontSize: 7.5,
          color: status.color,
          border: `1px solid ${status.color}44`,
          borderRadius: 2,
          padding: "0 5px",
        }}>
          {status.text}
        </span>
      </div>
    </div>
  );
}
