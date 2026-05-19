/**
 * PixelRoomAgent — agent character positioned in the 2.5D stage.
 * Uses GhostSvg. Absolutely positioned within stage.
 * PXR-02/03 animations applied.
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
    case "hold_stop_blocked": return { text: "HOLD",   color: "#f85149" };
    case "waiting_human_go":  return { text: "GO待ち", color: "#f0883e" };
    case "working":           return { text: "作業中", color: "#3fb950" };
    case "pass":              return { text: "PASS",   color: "#3fb950" };
    case "thinking":          return { text: "判断中", color: "#7eb8ff" };
    case "handoff_receive":   return { text: "受け取り", color: "#3fb950" };
    default:                  return { text: "待機",   color: "#6680aa" };
  }
}

export interface PixelRoomAgentProps {
  readonly agentId: AgentId;
  readonly nameJa: string;
  readonly roleJa: string;
  readonly pose: PoseState;
  readonly x: number;     // left px
  readonly y: number;     // top px (placed to sit on desk top)
  readonly zIndex: number;
  readonly size?: number;
}

export function PixelRoomAgent({
  agentId, nameJa, roleJa, pose, x, y, zIndex, size = 46,
}: PixelRoomAgentProps): React.JSX.Element {
  const accent = ACCENT[agentId];
  const anim   = poseAnim(agentId, pose);
  const status = poseLabel(pose);

  return (
    <div style={{
      position: "absolute",
      left: x,
      top: y,
      zIndex,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 2,
      transform: "translateX(-50%)",  /* center on x coord */
    }}>
      {/* Ghost */}
      <div className={anim} style={{ display: "flex", filter: `drop-shadow(0 0 6px ${accent}55)` }}>
        <GhostSvg agentId={agentId} size={size} />
      </div>

      {/* Name tag */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
        background: "rgba(4,8,20,0.85)",
        border: `1px solid ${accent}44`,
        borderRadius: 3,
        padding: "2px 7px",
        whiteSpace: "nowrap",
      }}>
        <span style={{ fontFamily: MONO, fontSize: 9, fontWeight: 700, color: accent, letterSpacing: 0.8 }}>
          {nameJa}
        </span>
        <span style={{ fontFamily: MONO, fontSize: 7, color: "#5566aa" }}>
          {roleJa}
        </span>
        <span style={{
          fontFamily: MONO, fontSize: 7,
          color: status.color,
          border: `1px solid ${status.color}44`,
          borderRadius: 2,
          padding: "0 4px",
        }}>
          {status.text}
        </span>
      </div>
    </div>
  );
}
