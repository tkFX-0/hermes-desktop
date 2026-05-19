/**
 * AgentStation — individual agent seat card in the 3D pixel room.
 * Renders GhostSvg + name + role + status.
 * Display-only. No action buttons.
 * PXR-01 (static idle display; PXR-02 will add animations).
 */

import type { AgentId } from "../../../types/agent-theater-types";
import { GhostSvg } from "../GhostSvg";

interface AgentStationProps {
  readonly agentId: AgentId;
  readonly nameJa: string;
  readonly roleJa: string;
  readonly roleEn: string;
  readonly statusJa: string;
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

export function AgentStation({
  agentId,
  nameJa,
  roleJa,
  roleEn,
  statusJa,
  variant = "default",
  lang = "ja",
}: AgentStationProps): React.JSX.Element {
  const accentColor = STATION_ACCENT[agentId];
  const variantClass = variant === "command" ? " pxr-command"
    : variant === "gate" ? " pxr-gate"
    : "";

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

      {/* Ghost avatar */}
      <GhostSvg agentId={agentId} size={variant === "command" ? 48 : 40} />

      {/* Name */}
      <div
        className="pxr-station-name"
        style={{ color: accentColor }}
      >
        {nameJa}
      </div>

      {/* Role */}
      <div className="pxr-station-role">
        {lang === "ja" ? roleJa : roleEn}
      </div>

      {/* Status pill */}
      <div className={`pxr-station-state ${statusJa === "HOLD" ? "hold" : "idle"}`}>
        {statusJa}
      </div>
    </div>
  );
}
