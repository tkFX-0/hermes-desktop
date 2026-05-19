/**
 * PixelRoomView — 2.5D CSS pixel art isometric control room.
 * Renders 5-agent diamond layout with safety HUD strip.
 * No image assets. No Three.js. Display-only.
 * PXR-01: static idle display (no motion, no state wiring).
 * Design spec: PXR_00_3D_PIXEL_ROOM_VISION.md
 */

import "./pixel-room.css";
import type { AgentPoseMap } from "../../../types/agent-theater-types";
import { AgentStation } from "./AgentStation";
import { RoomHUD } from "./RoomHUD";

/* ── Wall panel decoration (pixel monitor) ── */
function WallPanel(): React.JSX.Element {
  return (
    <div className="pxr-wall-panel" aria-hidden>
      <div className="pxr-wall-panel-cell lit-blue" />
      <div className="pxr-wall-panel-cell" />
      <div className="pxr-wall-panel-cell" />
      <div className="pxr-wall-panel-cell lit-amber" />
    </div>
  );
}

/* ── Pixel whiteboard (むすび's planning desk) ── */
function Whiteboard(): React.JSX.Element {
  return (
    <div
      aria-hidden
      style={{
        width: 72,
        height: 36,
        border: "1.5px solid #1c2333",
        borderRadius: 2,
        background: "#080e1a",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {/* Grid lines on whiteboard */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(88,166,255,0.07) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(88,166,255,0.07) 1px, transparent 1px)",
          backgroundSize: "12px 12px",
        }}
      />
      {/* Route dots */}
      {[[14, 8], [28, 14], [42, 10], [56, 18], [62, 26]].map(([x, y], i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: 3,
            height: 3,
            borderRadius: "50%",
            background: "#3fb950",
            opacity: 0.7,
          }}
        />
      ))}
      {/* Dashed route line approximation */}
      <svg
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
        width="72"
        height="36"
        viewBox="0 0 72 36"
        aria-hidden
      >
        <polyline
          points="14,8 28,14 42,10 56,18 62,26"
          stroke="#3fb950"
          strokeWidth="0.8"
          fill="none"
          strokeDasharray="2 2"
          opacity="0.5"
        />
      </svg>
      {/* Label */}
      <span
        style={{
          position: "absolute",
          bottom: 3,
          right: 4,
          fontSize: 6,
          fontFamily: "IBM Plex Mono, monospace",
          color: "#3fb950",
          opacity: 0.6,
          letterSpacing: 0.5,
        }}
      >
        PLAN
      </span>
    </div>
  );
}

/* ── Gate indicator (しずめ's security lamp) ── */
function GateLamp(): React.JSX.Element {
  return (
    <div
      aria-hidden
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        flexShrink: 0,
      }}
    >
      {/* Red HOLD lamp */}
      <div
        className="pxr-blink"
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#f85149",
          boxShadow: "0 0 6px rgba(248,81,73,0.8)",
        }}
      />
      <span
        style={{
          fontSize: 6,
          fontFamily: "IBM Plex Mono, monospace",
          color: "#f85149",
          letterSpacing: 0.5,
        }}
      >
        HOLD
      </span>
    </div>
  );
}

/* ── PXR-03: decision → pose map ── */
function derivePoses(decision: string): AgentPoseMap {
  switch (decision) {
    case "STOP":
      return { shikishima: "hold_stop_blocked", shizume: "hold_stop_blocked", hajime: "hold_stop_blocked", tsumugi: "hold_stop_blocked", shirube: "hold_stop_blocked" };
    case "PASS":
    case "PASS_WITH_CAVEAT":
      return { shikishima: "handoff_receive", shizume: "pass", hajime: "pass", tsumugi: "working", shirube: "working" };
    case "GO_READY":
      return { shikishima: "waiting_human_go", shizume: "working", hajime: "thinking", tsumugi: "working", shirube: "working" };
    default:
      return { shikishima: "waiting_human_go", shizume: "hold_stop_blocked", hajime: "idle", tsumugi: "idle", shirube: "idle" };
  }
}

/* ── Props ── */
export interface PixelRoomViewProps {
  readonly decision?: string;
  readonly poses?: AgentPoseMap;
  readonly lang?: "ja" | "en";
}

/* ── Main room view ── */
export function PixelRoomView({ decision = "HOLD", poses, lang = "ja" }: PixelRoomViewProps): React.JSX.Element {
  const agentPoses = poses ?? derivePoses(decision);
  return (
    <div className="pxr-root">
      {/* ── Room header ── */}
      <div className="pxr-header">
        <span className="pxr-header-title">
          {lang === "ja" ? "🌙 PIXEL ROOM · 管制室" : "🌙 PIXEL ROOM · COMMAND"}
        </span>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          <span className="pxr-header-badge">PXR-01</span>
          <span className="pxr-header-badge">display-only</span>
          <span className="pxr-header-badge">CSS isometric</span>
        </div>
      </div>

      {/* ── Back wall ── */}
      <div className="pxr-wall-back">
        <div className="pxr-wall-decor">
          <WallPanel />
          <Whiteboard />
          <WallPanel />
        </div>
      </div>

      {/* ── Dot grid accent ── */}
      <div className="pxr-dot-strip" />

      {/* ── Side walls + floor area wrapper ── */}
      <div className="pxr-side-walls">
        <div className="pxr-wall-left-strip" aria-hidden />

        {/* ── Main floor ── */}
        <div className="pxr-floor-area">
          <div className="pxr-stations">

            {/* TOP ROW: むすび (planning desk) */}
            <div className="pxr-row-top">
              <AgentStation
                agentId="hajime"
                nameJa="むすび"
                roleJa="計画デスク"
                roleEn="Plan Desk"
                statusJa="idle"
                poseState={agentPoses.hajime}
                lang={lang}
              />
            </div>

            {/* MID ROW: しずめ | ★しきしま | つむぐ */}
            <div className="pxr-row-mid">
              {/* Left: しずめ + gate lamp */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <GateLamp />
                <AgentStation
                  agentId="shizume"
                  nameJa="しずめ"
                  roleJa="安全ゲート"
                  roleEn="Safety Gate"
                  statusJa="HOLD"
                  poseState={agentPoses.shizume}
                  variant="gate"
                  lang={lang}
                />
              </div>

              {/* Center: ★ しきしま command */}
              <div className="pxr-command-wrap">
                <div className="pxr-command-label">★ COMMAND</div>
                <AgentStation
                  agentId="shikishima"
                  nameJa="しきしま"
                  roleJa="司令席"
                  roleEn="Command"
                  statusJa="idle"
                  poseState={agentPoses.shikishima}
                  variant="command"
                  lang={lang}
                />
              </div>

              {/* Right: つむぐ */}
              <AgentStation
                agentId="tsumugi"
                nameJa="つむぐ"
                roleJa="開発ベンチ"
                roleEn="Dev Bench"
                statusJa="idle"
                poseState={agentPoses.tsumugi}
                lang={lang}
              />
            </div>

            {/* BOT ROW: しるべ (record shelf) */}
            <div className="pxr-row-bot">
              <AgentStation
                agentId="shirube"
                nameJa="しるべ"
                roleJa="記録棚"
                roleEn="Record"
                statusJa="idle"
                poseState={agentPoses.shirube}
                lang={lang}
              />
            </div>
          </div>

          {/* Floor perspective strip */}
          <div className="pxr-floor-strip" aria-hidden />
        </div>

        <div className="pxr-wall-right-strip" aria-hidden />
      </div>

      {/* ── Dot grid accent ── */}
      <div className="pxr-dot-strip" />

      {/* ── Safety HUD ── */}
      <RoomHUD decision={decision} lang={lang} />
    </div>
  );
}
