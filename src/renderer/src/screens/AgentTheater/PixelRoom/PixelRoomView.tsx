/**
 * PixelRoomView — Night operations pixel art control room.
 * Reference: ３D部屋イメージ.png
 * Wide horizontal layout: しずめ|はじめ|★しきしま|つむぐ|しるべ
 * No image assets. CSS + GhostSvg only. Display-only.
 */

import React from "react";
import "./pixel-room.css";
import type { AgentId, AgentPoseMap, PoseState } from "../../../types/agent-theater-types";
import { GhostSvg } from "../GhostSvg";
import { RoomHUD } from "./RoomHUD";
import { PixelRoomHud } from "./PixelRoomHud";
import { PixelRoomHandoffRail } from "./PixelRoomHandoffRail";
import { PixelRoomGatePanel } from "./PixelRoomGatePanel";
import { PixelRoomLogStrip } from "./PixelRoomLogStrip";

/* ── Constants ── */
const MONO = '"IBM Plex Mono", ui-monospace, monospace';

const ACCENT: Record<AgentId, string> = {
  shikishima: "#7eb8ff",
  shizume:    "#f85149",
  hajime:     "#3fb950",
  tsumugi:    "#f0883e",
  shirube:    "#b07fff",
};

/* ── Pose helpers ── */
function poseAnim(id: AgentId, pose: PoseState): string {
  switch (pose) {
    case "hold_stop_blocked": return "pxr-anim-hold";
    case "working":           return id === "tsumugi" ? "pxr-anim-type" : "pxr-anim-float";
    case "thinking":          return "pxr-anim-scan";
    case "idle":
    default: return {
      shikishima: "pxr-anim-scan",
      shizume:    "pxr-anim-hold",
      hajime:     "pxr-anim-lean",
      tsumugi:    "pxr-anim-type",
      shirube:    "pxr-anim-pen",
    }[id];
  }
}

function poseLabel(pose: PoseState): { text: string; cls: string } {
  switch (pose) {
    case "hold_stop_blocked": return { text: "HOLD",   cls: "hold"   };
    case "waiting_human_go":  return { text: "GO待ち", cls: "hold"   };
    case "working":           return { text: "作業中", cls: "active" };
    case "pass":              return { text: "PASS",   cls: "pass"   };
    case "thinking":          return { text: "判断中", cls: "think"  };
    case "handoff_receive":   return { text: "受け取り", cls: "active" };
    default:                  return { text: "待機",   cls: "idle"   };
  }
}

/* ── Desk-specific CSS decorations ── */
function DeskDecor({ id }: { id: AgentId }): React.JSX.Element {
  const accent = ACCENT[id];

  if (id === "shikishima") return (
    <div className="pxr-desk-decor" aria-hidden>
      {/* Dual monitors */}
      <div style={{ display: "flex", gap: 3, alignItems: "flex-end" }}>
        <div style={{ width: 22, height: 16, border: `1.5px solid ${accent}88`, borderRadius: 2, background: "#040d22", boxShadow: `0 0 5px ${accent}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 12, height: 7, background: `${accent}33`, borderRadius: 1 }} />
        </div>
        <div style={{ width: 18, height: 13, border: `1.5px solid ${accent}66`, borderRadius: 2, background: "#040d22", boxShadow: `0 0 4px ${accent}33` }} />
      </div>
      {/* Headset icon */}
      <span style={{ fontSize: 11, filter: `drop-shadow(0 0 3px ${accent})` }}>🎧</span>
    </div>
  );

  if (id === "shizume") return (
    <div className="pxr-desk-decor" aria-hidden>
      {/* HOLD wooden sign */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
        <div style={{ background: "#f85149", border: "1.5px solid #991b1b", borderRadius: 2, padding: "1px 5px", fontFamily: MONO, fontSize: 7, fontWeight: 800, color: "#fff", letterSpacing: 0.5, boxShadow: "0 0 6px rgba(248,81,73,0.6)" }}>HOLD</div>
        <div style={{ width: 2, height: 6, background: "#7c3f00" }} />
      </div>
      {/* Warning light */}
      <span style={{ fontSize: 10 }} className="pxr-blink">🚨</span>
      {/* Traffic cone */}
      <span style={{ fontSize: 10 }}>🚧</span>
    </div>
  );

  if (id === "hajime") return (
    <div className="pxr-desk-decor" aria-hidden>
      {/* Mini map */}
      <div style={{ width: 28, height: 20, border: `1.5px solid ${ACCENT.hajime}66`, borderRadius: 2, background: "#040f08", position: "relative", overflow: "hidden" }}>
        <svg width="28" height="20" style={{ position: "absolute", inset: 0 }}>
          <polyline points="4,16 10,10 16,13 22,6" stroke="#3fb950" strokeWidth="1" fill="none" strokeDasharray="2 1" opacity="0.7" />
          <circle cx="4" cy="16" r="1.5" fill="#3fb950" opacity="0.9" />
          <circle cx="22" cy="6" r="1.5" fill="#f0883e" opacity="0.9" />
        </svg>
      </div>
      <span style={{ fontSize: 10 }}>📌</span>
      <span style={{ fontSize: 10 }}>✏️</span>
    </div>
  );

  if (id === "tsumugi") return (
    <div className="pxr-desk-decor" aria-hidden>
      {/* Keyboard */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
        <div style={{ width: 28, height: 9, border: `1.5px solid ${ACCENT.tsumugi}66`, borderRadius: 2, background: "#1a0a00",
          backgroundImage: "repeating-linear-gradient(90deg, transparent 0px, transparent 4px, rgba(240,136,62,0.2) 4px, rgba(240,136,62,0.2) 5px)",
          boxShadow: `0 0 4px ${ACCENT.tsumugi}33` }} />
      </div>
      <span style={{ fontSize: 10 }}>🔧</span>
      <span style={{ fontSize: 10 }}>💻</span>
    </div>
  );

  /* shirube */
  return (
    <div className="pxr-desk-decor" aria-hidden>
      {/* Bookshelf */}
      <div style={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
        {["#b07fff", "#3fb950", "#f0883e", "#7eb8ff"].map((c, i) => (
          <div key={i} style={{ width: 5, height: 10 + i * 2, background: c, borderRadius: "1px 1px 0 0", opacity: 0.8 }} />
        ))}
      </div>
      <span style={{ fontSize: 10 }}>🖊</span>
      <span style={{ fontSize: 10 }}>📓</span>
    </div>
  );
}

/* ── Monitor for しきしま's back wall ── */
function CommandMonitor({ decision }: { decision: string }): React.JSX.Element {
  const isHold = decision !== "GO_READY" && decision !== "PASS";
  return (
    <div aria-hidden style={{
      width: 90, height: 55,
      border: "2px solid rgba(88,166,255,0.4)",
      borderRadius: 4,
      background: "#030a18",
      boxShadow: "0 0 12px rgba(88,166,255,0.15)",
      display: "flex", flexDirection: "column",
      overflow: "hidden",
      flexShrink: 0,
    }}>
      {/* Monitor title bar */}
      <div style={{ background: "rgba(88,166,255,0.12)", padding: "2px 5px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: MONO, fontSize: 6, color: "#7eb8ff", letterSpacing: 0.5 }}>本日のレーン状況</span>
        <div style={{ display: "flex", gap: 2 }}>
          {["#f85149","#f0883e","#3fb950"].map((c,i) => (
            <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: c, opacity: 0.7 }} />
          ))}
        </div>
      </div>
      {/* Monitor content — simple bars */}
      <div style={{ flex: 1, padding: "4px 5px", display: "flex", flexDirection: "column", gap: 3 }}>
        {[
          { label: "SAFETY", pct: 100, color: "#3fb950" },
          { label: "DEV",    pct: isHold ? 0 : 60, color: "#7eb8ff" },
          { label: "PLAN",   pct: 80,  color: "#f0883e" },
        ].map((bar) => (
          <div key={bar.label} style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <span style={{ fontFamily: MONO, fontSize: 5, color: "#6680aa", width: 30, flexShrink: 0 }}>{bar.label}</span>
            <div style={{ flex: 1, height: 4, background: "rgba(40,60,140,0.3)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ width: `${bar.pct}%`, height: "100%", background: bar.color, borderRadius: 2, transition: "width 0.5s" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Agent station card ── */
interface AgentStationProps {
  id: AgentId;
  nameJa: string;
  roleJa: string;
  pose: PoseState;
  isCommand?: boolean;
  isGate?: boolean;
  decision?: string;
  lang?: "ja" | "en";
}

function AgentStation({ id, nameJa, roleJa, pose, isCommand, isGate, decision = "HOLD" }: AgentStationProps): React.JSX.Element {
  const accent = ACCENT[id];
  const anim = poseAnim(id, pose);
  const status = poseLabel(pose);
  const size = isCommand ? 52 : 40;

  return (
    <div className={`pxr-station${isCommand ? " pxr-command" : isGate ? " pxr-gate" : ""}`}
      style={{ minWidth: isCommand ? 130 : 100 }}>

      {/* Accent dot */}
      <div aria-hidden style={{
        position: "absolute", top: 5, right: 5,
        width: 5, height: 5, borderRadius: "50%",
        background: accent, opacity: 0.85,
        boxShadow: `0 0 6px ${accent}`,
      }} className={(isCommand || isGate) ? "pxr-blink" : undefined} />

      {/* Command monitor above shikishima */}
      {isCommand && <CommandMonitor decision={decision} />}

      {/* Desk decorations */}
      <DeskDecor id={id} />

      {/* Ghost with animation */}
      <div className={anim} style={{ display: "flex" }} aria-hidden>
        <GhostSvg agentId={id} size={size} />
      </div>

      {/* Name */}
      <div className="pxr-station-name" style={{ color: accent, fontSize: isCommand ? 12 : 11 }}>{nameJa}</div>

      {/* Role */}
      <div className="pxr-station-role">{roleJa}</div>

      {/* Status */}
      <div className={`pxr-station-state ${status.cls}`}>{status.text}</div>
    </div>
  );
}

/* ── Gate lamp ── */
function GateLamp({ pose }: { pose: PoseState }): React.JSX.Element {
  const isHold = pose === "hold_stop_blocked" || pose === "idle" || pose === "waiting_human_go";
  return (
    <div aria-hidden style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, marginBottom: 2 }}>
      <div className={isHold ? "pxr-blink" : undefined} style={{
        width: 10, height: 10, borderRadius: "50%",
        background: isHold ? "#f85149" : "#3fb950",
        boxShadow: isHold ? "0 0 8px rgba(248,81,73,0.9)" : "0 0 8px rgba(63,185,80,0.7)",
      }} />
      <span style={{ fontFamily: MONO, fontSize: 6, color: isHold ? "#f85149" : "#3fb950", letterSpacing: 0.5 }}>
        {isHold ? "HOLD" : "GO"}
      </span>
    </div>
  );
}

/* ── Wall panel ── */
function WallPanel({ accent }: { accent?: string }): React.JSX.Element {
  const c = accent ?? "#7eb8ff";
  return (
    <div aria-hidden style={{
      width: 50, height: 35, border: `1.5px solid ${c}44`,
      borderRadius: 3, background: "#030a18",
      display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, padding: 3,
    }}>
      <div style={{ borderRadius: 1, background: "#0c1d4a", boxShadow: `inset 0 0 4px ${c}66` }} />
      <div style={{ borderRadius: 1, background: "#030a18", border: "1px solid rgba(40,60,140,0.3)" }} />
      <div style={{ borderRadius: 1, background: "#030a18", border: "1px solid rgba(40,60,140,0.3)" }} />
      <div style={{ borderRadius: 1, background: "#1a1000", boxShadow: "inset 0 0 4px rgba(245,158,11,0.35)" }} />
    </div>
  );
}

/* ── Night window ── */
function NightWindow(): React.JSX.Element {
  return (
    <div aria-hidden style={{
      width: 60, height: 40, border: "1.5px solid rgba(40,60,140,0.5)",
      borderRadius: 3, background: "#020510", overflow: "hidden", position: "relative",
    }}>
      {/* Stars */}
      {[[8,6],[22,10],[38,4],[50,14],[14,18],[44,8]].map(([x,y],i) => (
        <div key={i} style={{ position: "absolute", left: x, top: y, width: 1.5, height: 1.5, borderRadius: "50%", background: "#ffffff", opacity: 0.5 + (i%3)*0.15 }} />
      ))}
      {/* City lights */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 12,
        background: "linear-gradient(180deg, transparent 0%, rgba(4,10,30,0.8) 100%)" }}>
        {[4,10,18,25,32,40,48,55].map((lx,i) => (
          <div key={i} style={{ position: "absolute", left: lx, bottom: 1, width: 2, height: 4 + (i%3)*2,
            background: i%2===0 ? "#f0883e" : "#7eb8ff", opacity: 0.6 }} />
        ))}
      </div>
      {/* Moon */}
      <div style={{ position: "absolute", right: 8, top: 4, width: 8, height: 8, borderRadius: "50%", background: "#e8e0c0", boxShadow: "0 0 4px rgba(232,224,192,0.6)" }} />
    </div>
  );
}

/* ── Derive poses ── */
function derivePoses(decision: string): AgentPoseMap {
  switch (decision) {
    case "STOP":
      return { shikishima: "hold_stop_blocked", shizume: "hold_stop_blocked", hajime: "hold_stop_blocked", tsumugi: "hold_stop_blocked", shirube: "hold_stop_blocked" };
    case "PASS": case "PASS_WITH_CAVEAT":
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
  const p = poses ?? derivePoses(decision);

  return (
    <div className="pxr-root">
      {/* ── Top HUD (large status boxes) ── */}
      <PixelRoomHud decision={decision} lang={lang} />

      {/* ── Back wall with decorations ── */}
      <div className="pxr-wall-back">
        <div className="pxr-wall-decor">
          <WallPanel accent={ACCENT.shizume} />
          <NightWindow />
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontFamily: MONO, fontSize: 9, color: "#7eb8ff", letterSpacing: 1.5, textTransform: "uppercase" }}>
              🌙 {lang === "ja" ? "管制室 · NIGHT OPS" : "COMMAND · NIGHT OPS"}
            </span>
          </div>
          <NightWindow />
          <WallPanel accent={ACCENT.shirube} />
        </div>
      </div>

      <div className="pxr-dot-strip" />

      {/* ── Room body (side walls + agent floor) ── */}
      <div className="pxr-side-walls">
        <div className="pxr-wall-left-strip" aria-hidden />

        <div className="pxr-floor-area">
          {/* ── Horizontal agent row ── */}
          <div className="pxr-agents-row">

            {/* しずめ — left safety gate */}
            <div className="pxr-agent-col pxr-agent-col-side">
              <GateLamp pose={p.shizume} />
              <AgentStation id="shizume" nameJa="しずめ" roleJa="安全ゲート" pose={p.shizume} isGate decision={decision} lang={lang} />
            </div>

            {/* はじめ — left-center planning */}
            <div className="pxr-agent-col">
              <AgentStation id="hajime" nameJa="むすび" roleJa="計画デスク" pose={p.hajime} decision={decision} lang={lang} />
            </div>

            {/* ★ しきしま — command center */}
            <div className="pxr-agent-col pxr-agent-col-command">
              <div className="pxr-command-label">★ COMMAND</div>
              <AgentStation id="shikishima" nameJa="しきしま" roleJa="司令席" pose={p.shikishima} isCommand decision={decision} lang={lang} />
            </div>

            {/* つむぐ — right dev bench */}
            <div className="pxr-agent-col">
              <AgentStation id="tsumugi" nameJa="つむぐ" roleJa="開発ベンチ" pose={p.tsumugi} decision={decision} lang={lang} />
            </div>

            {/* しるべ — right record shelf */}
            <div className="pxr-agent-col pxr-agent-col-side">
              <AgentStation id="shirube" nameJa="しるべ" roleJa="記録棚" pose={p.shirube} decision={decision} lang={lang} />
            </div>
          </div>

          {/* Floor strip */}
          <div className="pxr-floor-strip" aria-hidden />
        </div>

        <div className="pxr-wall-right-strip" aria-hidden />
      </div>

      <div className="pxr-dot-strip" />

      {/* ── Handoff rail ── */}
      <PixelRoomHandoffRail decision={decision} lang={lang} />

      {/* ── Bottom: log strip + gate panel ── */}
      <div style={{ display: "flex", gap: 8, padding: "8px 12px", background: "rgba(4,8,20,0.7)", flexWrap: "wrap" }}>
        <PixelRoomLogStrip />
        <PixelRoomGatePanel />
      </div>

      {/* ── Safety HUD strip ── */}
      <RoomHUD decision={decision} lang={lang} />
    </div>
  );
}
