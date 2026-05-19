/**
 * PixelRoomView — Night operations pixel art control room.
 * Reference: ３D部屋イメージ.png
 * Dark blue-purple night sky + desk decorations + 5 agents + workflow lane.
 * No image assets. CSS + GhostSvg. Display-only.
 * PXR-01~03 + style refresh.
 */

import React from "react";
import "./pixel-room.css";
import type { AgentId, AgentPoseMap, PoseState } from "../../../types/agent-theater-types";
import { GhostSvg } from "../GhostSvg";
import { RoomHUD } from "./RoomHUD";

/* ── Pose → animation class ── */
const IDLE_ANIM: Record<AgentId, string> = {
  shikishima: "pxr-anim-scan",
  shizume:    "pxr-anim-hold",
  hajime:     "pxr-anim-lean",
  tsumugi:    "pxr-anim-type",
  shirube:    "pxr-anim-pen",
};

const ACCENT: Record<AgentId, string> = {
  shikishima: "#7eb8ff",
  shizume:    "#f85149",
  hajime:     "#3fb950",
  tsumugi:    "#f0883e",
  shirube:    "#b07fff",
};

function poseAnim(id: AgentId, pose: PoseState): string {
  switch (pose) {
    case "hold_stop_blocked": return "pxr-anim-hold";
    case "working":           return id === "tsumugi" ? "pxr-anim-type" : "pxr-anim-float";
    case "thinking":          return "pxr-anim-scan";
    default:                  return IDLE_ANIM[id];
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

/* ── Desk decorations per agent ── */
const DESK_ICONS: Record<AgentId, string[]> = {
  shikishima: ["🖥", "🎧", "📡"],
  shizume:    ["🛑", "🚧", "⚠️"],
  hajime:     ["🗺", "📌", "✏️"],
  tsumugi:    ["⌨️", "🔧", "💻"],
  shirube:    ["📓", "🖊", "📚"],
};

/* ── Agent station card ── */
interface StationProps {
  id: AgentId;
  nameJa: string;
  roleJa: string;
  pose: PoseState;
  variant?: "command" | "gate" | "default";
  size?: number;
  lang?: "ja" | "en";
}

function AgentStation({ id, nameJa, roleJa, pose, variant = "default", size = 42, lang = "ja" }: StationProps): React.JSX.Element {
  const accent = ACCENT[id];
  const anim = poseAnim(id, pose);
  const status = poseLabel(pose);
  const variantClass = variant === "command" ? " pxr-command" : variant === "gate" ? " pxr-gate" : "";

  return (
    <div className={`pxr-station${variantClass}`}>
      {/* Accent dot */}
      <div aria-hidden style={{
        position: "absolute", top: 5, right: 5,
        width: 5, height: 5, borderRadius: "50%",
        background: accent, opacity: 0.8,
        boxShadow: `0 0 5px ${accent}`,
      }} className={variant === "command" || variant === "gate" ? "pxr-blink" : undefined} />

      {/* Desk decor icons */}
      <div className="pxr-desk-decor" aria-hidden>
        {DESK_ICONS[id].map((icon, i) => (
          <span key={i} className="pxr-desk-icon" style={{ color: accent }}>{icon}</span>
        ))}
      </div>

      {/* Ghost avatar with animation */}
      <div className={anim} style={{ display: "flex" }} aria-hidden>
        <GhostSvg agentId={id} size={size} />
      </div>

      {/* Name */}
      <div className="pxr-station-name" style={{ color: accent }}>{nameJa}</div>

      {/* Role */}
      <div className="pxr-station-role">{lang === "ja" ? roleJa : roleJa}</div>

      {/* Status */}
      <div className={`pxr-station-state ${status.cls}`}>{status.text}</div>
    </div>
  );
}

/* ── Gate lamp ── */
function GateLamp({ pose }: { pose: PoseState }): React.JSX.Element {
  const isHold = pose === "hold_stop_blocked" || pose === "idle" || pose === "waiting_human_go";
  return (
    <div className="pxr-gate-wrap" aria-hidden>
      <div className={isHold ? "pxr-blink" : undefined} style={{
        width: 9, height: 9, borderRadius: "50%",
        background: isHold ? "#f85149" : "#3fb950",
        boxShadow: isHold ? "0 0 7px rgba(248,81,73,0.9)" : "0 0 7px rgba(63,185,80,0.7)",
      }} />
      <span style={{ fontSize: 6, fontFamily: '"IBM Plex Mono", monospace', color: isHold ? "#f85149" : "#3fb950", letterSpacing: 0.5 }}>
        {isHold ? "HOLD" : "GO"}
      </span>
    </div>
  );
}

/* ── Monitor / wall panel ── */
function WallMonitor(): React.JSX.Element {
  return (
    <div className="pxr-wall-panel" aria-hidden>
      <div className="pxr-wall-panel-cell lit-blue" />
      <div className="pxr-wall-panel-cell" />
      <div className="pxr-wall-panel-cell lit-green" />
      <div className="pxr-wall-panel-cell lit-amber" />
    </div>
  );
}

/* ── Whiteboard (むすび's desk backdrop) ── */
function Whiteboard(): React.JSX.Element {
  return (
    <div aria-hidden style={{
      width: 76, height: 40, border: "1.5px solid rgba(40,60,140,0.5)",
      borderRadius: 3, background: "#060d22", position: "relative",
      overflow: "hidden", flexShrink: 0,
    }}>
      <div style={{ position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(88,166,255,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(88,166,255,0.06) 1px,transparent 1px)",
        backgroundSize: "12px 12px" }} />
      <svg style={{ position: "absolute", inset: 0 }} width="76" height="40" aria-hidden>
        <polyline points="12,30 24,18 38,24 52,12 64,20" stroke="#3fb950" strokeWidth="1" fill="none" strokeDasharray="2 2" opacity="0.6" />
        {[[12,30],[24,18],[38,24],[52,12],[64,20]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r="2" fill="#3fb950" opacity="0.7" />
        ))}
      </svg>
      <span style={{ position: "absolute", bottom: 3, right: 4, fontSize: 6, fontFamily: '"IBM Plex Mono",monospace', color: "#3fb950", opacity: 0.7 }}>PLAN</span>
    </div>
  );
}

/* ── Legend panel (管制ボード) ── */
function LegendPanel(): React.JSX.Element {
  const items: [string, AgentId, string][] = [
    ["安全第一", "shizume", ACCENT.shizume],
    ["あわてない", "hajime", ACCENT.hajime],
    ["つなげる", "tsumugi", ACCENT.tsumugi],
    ["記録する", "shirube", ACCENT.shirube],
  ];
  return (
    <div className="pxr-legend" aria-label="管制ボード">
      <div className="pxr-legend-title">管制ボード</div>
      {items.map(([label, , color]) => (
        <div key={label} className="pxr-legend-item">
          <div className="pxr-legend-dot" style={{ background: color, boxShadow: `0 0 3px ${color}` }} />
          {label}
        </div>
      ))}
    </div>
  );
}

/* ── Workflow lane (bottom) ── */
const WORKFLOW_STEPS = [
  { num: "1", ja: "ユーザー依頼", status: "active" },
  { num: "2", ja: "計画する",     status: "active" },
  { num: "3", ja: "安全チェック", status: "hold"   },
  { num: "4", ja: "実装する",     status: "idle"   },
  { num: "5", ja: "記録する",     status: "idle"   },
] as const;

function WorkflowLane({ decision }: { decision: string }): React.JSX.Element {
  const isStop = decision === "STOP";
  return (
    <div className="pxr-workflow" aria-label="ワークフロー">
      {WORKFLOW_STEPS.map((step, i) => {
        const cls = isStop ? "hold" : step.status === "hold" ? "hold" : step.status === "active" ? "active" : "";
        return (
          <React.Fragment key={step.num}>
            <div className="pxr-workflow-step">
              <div className={`pxr-workflow-circle ${cls}`}>{step.num}</div>
              <div className="pxr-workflow-label">{step.ja}</div>
            </div>
            {i < WORKFLOW_STEPS.length - 1 && <div className="pxr-workflow-arrow" />}
          </React.Fragment>
        );
      })}
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
      {/* Header */}
      <div className="pxr-header">
        <span className="pxr-header-title">🌙 {lang === "ja" ? "管制室 · NIGHT OPS" : "COMMAND · NIGHT OPS"}</span>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          <span className="pxr-header-badge">display-only</span>
          <span className="pxr-header-badge">夜間オペレーション中</span>
        </div>
      </div>

      {/* Back wall */}
      <div className="pxr-wall-back">
        <div className="pxr-wall-decor">
          <LegendPanel />
          <Whiteboard />
          <WallMonitor />
        </div>
      </div>

      <div className="pxr-dot-strip" />

      {/* Side walls + floor */}
      <div className="pxr-side-walls">
        <div className="pxr-wall-left-strip" aria-hidden />

        <div className="pxr-floor-area">
          <div className="pxr-stations">

            {/* TOP: むすび */}
            <div className="pxr-row-top">
              <AgentStation id="hajime" nameJa="むすび" roleJa="計画デスク" pose={p.hajime} lang={lang} />
            </div>

            {/* MID: しずめ | ★しきしま | つむぐ */}
            <div className="pxr-row-mid">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <GateLamp pose={p.shizume} />
                <AgentStation id="shizume" nameJa="しずめ" roleJa="安全ゲート" pose={p.shizume} variant="gate" lang={lang} />
              </div>

              <div className="pxr-command-wrap">
                <div className="pxr-command-label">★ COMMAND</div>
                <AgentStation id="shikishima" nameJa="しきしま" roleJa="司令席" pose={p.shikishima} variant="command" size={50} lang={lang} />
              </div>

              <AgentStation id="tsumugi" nameJa="つむぐ" roleJa="開発ベンチ" pose={p.tsumugi} lang={lang} />
            </div>

            {/* BOT: しるべ */}
            <div className="pxr-row-bot">
              <AgentStation id="shirube" nameJa="しるべ" roleJa="記録棚" pose={p.shirube} lang={lang} />
            </div>
          </div>

          {/* Workflow lane */}
          <WorkflowLane decision={decision} />

          {/* Floor strip */}
          <div className="pxr-floor-strip" aria-hidden />
        </div>

        <div className="pxr-wall-right-strip" aria-hidden />
      </div>

      <div className="pxr-dot-strip" />

      {/* Safety HUD */}
      <RoomHUD decision={decision} lang={lang} />
    </div>
  );
}
