/**
 * AgentStation — individual agent seat card in the 3D pixel room.
 * Renders GhostSvg + name + role + status + idle animation.
 * Display-only. No action buttons.
 * PXR-02: agent-specific idle CSS animations.
 * PXR-03: poseState prop wires state → animation class.
 */

import type { AgentId, PoseState } from "../../../types/agent-theater-types";
import { GhostSvg } from "../GhostSvg";

interface AgentStationProps {
  readonly agentId: AgentId;
  readonly nameJa: string;
  readonly roleJa: string;
  readonly roleEn: string;
  readonly statusJa: string;
  readonly poseState?: PoseState;
  readonly variant?: "default" | "command" | "gate";
  readonly lang?: "ja" | "en";
}

const STATION_ACCENT: Record<AgentId, string> = {
  shikishima: "#58a6ff",
  shizume:    "#f85149",
  hajime:     "#3fb950",
  tsumugi:    "#f0883e",
  shirube:    "#a371f7",
};

/* PXR-02: idle animation per agent */
const IDLE_ANIM_CLASS: Record<AgentId, string> = {
  shikishima: "pxr-anim-scan",
  shizume:    "pxr-anim-hold",
  hajime:     "pxr-anim-lean",
  tsumugi:    "pxr-anim-type",
  shirube:    "pxr-anim-pen",
};

/* PXR-03: pose state → animation class override */
function poseToAnimClass(agentId: AgentId, pose: PoseState): string {
  switch (pose) {
    case "hold_stop_blocked": return "pxr-anim-hold";
    case "waiting_human_go":  return agentId === "shikishima" ? "pxr-anim-scan" : "pxr-anim-float";
    case "working":           return agentId === "tsumugi" ? "pxr-anim-type" : "pxr-anim-float";
    case "pass":              return "pxr-anim-float";
    case "handoff_send":
    case "handoff_receive":   return "pxr-anim-float";
    case "thinking":          return "pxr-anim-scan";
    case "idle":
    default:                  return IDLE_ANIM_CLASS[agentId];
  }
}

/* PXR-03: pose → status label */
function poseToStatusLabel(pose: PoseState): { text: string; cls: string } {
  switch (pose) {
    case "hold_stop_blocked": return { text: "HOLD",    cls: "hold"   };
    case "waiting_human_go":  return { text: "GO待ち",  cls: "hold"   };
    case "working":           return { text: "作業中",  cls: "active" };
    case "pass":              return { text: "PASS",    cls: "pass"   };
    case "thinking":          return { text: "判断中",  cls: "think"  };
    case "handoff_send":      return { text: "引き渡し", cls: "active" };
    case "handoff_receive":   return { text: "受け取り", cls: "active" };
    case "idle":
    default:                  return { text: "idle",   cls: "idle"   };
  }
}

export function AgentStation({
  agentId,
  nameJa,
  roleJa,
  roleEn,
  statusJa,
  poseState,
  variant = "default",
  lang = "ja",
}: AgentStationProps): React.JSX.Element {
  const accentColor = STATION_ACCENT[agentId];
  const variantClass = variant === "command" ? " pxr-command"
    : variant === "gate" ? " pxr-gate"
    : "";

  const animClass = poseState ? poseToAnimClass(agentId, poseState) : IDLE_ANIM_CLASS[agentId];
  const statusInfo = poseState ? poseToStatusLabel(poseState) : { text: statusJa, cls: statusJa === "HOLD" ? "hold" : "idle" };

  return (
    <div className={`pxr-station${variantClass}`}>
      {/* Accent indicator dot */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 5,
          right: 5,
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: accentColor,
          opacity: 0.7,
          boxShadow: `0 0 4px ${accentColor}`,
        }}
        className={variant === "command" ? "pxr-blink" : undefined}
      />

      {/* Ghost avatar — animated */}
      <div className={animClass} aria-hidden style={{ display: "flex" }}>
        <GhostSvg agentId={agentId} size={variant === "command" ? 48 : 40} />
      </div>

      {/* Name */}
      <div className="pxr-station-name" style={{ color: accentColor }}>
        {nameJa}
      </div>

      {/* Role */}
      <div className="pxr-station-role">
        {lang === "ja" ? roleJa : roleEn}
      </div>

      {/* Status pill */}
      <div className={`pxr-station-state ${statusInfo.cls}`}>
        {statusInfo.text}
      </div>
    </div>
  );
}
