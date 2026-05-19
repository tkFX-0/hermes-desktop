/**
 * PixelRoomStage — CSS 2.5D pixel room stage.
 * PXR-05C: station carpets, ambient glows, larger agents, room depth.
 * Reference: ３D部屋イメージ.png
 * No image assets. No Three.js. Display-only.
 */

import type { AgentPoseMap, PoseState } from "../../types/agent-theater-types";
import "./PixelRoom/pixel-room.css";

import { PixelRoomSafetyHud }    from "./PixelRoomSafetyHud";
import { PixelRoomFloor }        from "./PixelRoomFloor";
import { PixelRoomWalls }        from "./PixelRoomWalls";
import { PixelRoomDesk }         from "./PixelRoomDesk";
import { PixelRoomAgent }        from "./PixelRoomAgent";
import {
  CommandMonitor, SafetyGate, PlanBoard, ToolBox, BookShelf, DeskLamp,
} from "./PixelRoomProps";
import { PixelRoomHandoffRail }  from "./PixelRoomHandoffRail";
import { PixelRoomLogStrip }     from "./PixelRoomLogStrip";

/* ── Stage dimensions (PXR-05C) ── */
const STAGE_W = 940;
const STAGE_H = 500;

/*
 * Room coordinate layout (940×500):
 *
 * Back wall: 0 → ~220px (44%)
 * Floor: ~200px → 500px
 *
 * Station carpets (center x, top y, w, h):
 *   しずめ  carpet: cx=92,  cy=308, 140×120
 *   むすび  carpet: cx=252, cy=296, 128×115
 *   しきしま carpet: cx=470, cy=208, 160×130  (back, smaller)
 *   つむぐ  carpet: cx=686, cy=296, 128×115
 *   しるべ  carpet: cx=848, cy=308, 140×120
 *
 * Agents (center x, top y):
 *   しずめ  : x=92,  y=284, size=62
 *   むすび  : x=252, y=272, size=60
 *   しきしま: x=470, y=184, size=58  (back)
 *   つむぐ  : x=686, y=272, size=60
 *   しるべ  : x=848, y=278, size=60
 *
 * Desks (left edge x, top y, width):
 *   しずめ  : x=32,  y=352, w=124
 *   むすび  : x=194, y=340, w=116
 *   しきしま: x=408, y=244, w=124
 *   つむぐ  : x=628, y=340, w=116
 *   しるべ  : x=790, y=350, w=120
 */

const Z = {
  floor:       2,
  carpet:      4,
  wall:        5,
  wallProps:   6,
  backCarpet:  7,
  glow:        8,
  backDesk:    10,
  backProps:   11,
  backAgent:   13,
  frontDesk:   18,
  frontProps:  19,
  frontGlow:   20,
  frontAgent:  22,
} as const;

/* ── Station carpet (floor mat) ── */
interface CarpetProps {
  cx: number; cy: number; w: number; h: number;
  color: string; zIndex: number;
}

function StationCarpet({ cx, cy, w, h, color, zIndex }: CarpetProps): React.JSX.Element {
  return (
    <div aria-hidden style={{
      position: "absolute",
      left: cx - w / 2, top: cy,
      width: w, height: h,
      background: `radial-gradient(ellipse at 50% 30%, ${color}20 0%, ${color}08 60%, transparent 100%)`,
      border: `1.5px solid ${color}28`,
      borderRadius: 8,
      zIndex,
      boxShadow: `inset 0 0 12px ${color}10`,
    }}>
      {/* Carpet edge pattern */}
      <div style={{
        position: "absolute",
        inset: 4,
        border: `1px solid ${color}18`,
        borderRadius: 5,
      }} />
      <div style={{
        position: "absolute",
        inset: 8,
        border: `1px dashed ${color}12`,
        borderRadius: 3,
      }} />
    </div>
  );
}

/* ── Ambient station glow ── */
interface GlowProps { cx: number; cy: number; color: string; zIndex: number; size?: number }

function StationGlow({ cx, cy, color, zIndex, size = 110 }: GlowProps): React.JSX.Element {
  return (
    <div aria-hidden style={{
      position: "absolute",
      left: cx - size, top: cy - size * 0.4,
      width: size * 2, height: size * 1.2,
      background: `radial-gradient(ellipse, ${color}22 0%, ${color}0a 45%, transparent 70%)`,
      zIndex,
      pointerEvents: "none",
    }} />
  );
}

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

export interface PixelRoomStageProps {
  readonly decision?: string;
  readonly poses?: AgentPoseMap;
  readonly lang?: "ja" | "en";
}

export function PixelRoomStage({ decision = "HOLD", poses, lang = "ja" }: PixelRoomStageProps): React.JSX.Element {
  const p: AgentPoseMap = poses ?? derivePoses(decision);

  return (
    <div style={{
      background: "#01020a",
      borderRadius: 10,
      border: "1px solid rgba(40,60,140,0.55)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* ── Top HUD ── */}
      <PixelRoomSafetyHud decision={decision} lang={lang} />

      {/* ── Room stage ── */}
      <div style={{ overflowX: "auto", flexShrink: 0 }}>
        <div style={{
          position: "relative",
          width: STAGE_W, height: STAGE_H,
          background: "linear-gradient(180deg, #010309 0%, #030910 42%, #04091a 100%)",
          overflow: "hidden",
        }}>

          {/* Layer 1: Floor */}
          <PixelRoomFloor />

          {/* Layer 2: Walls */}
          <PixelRoomWalls />

          {/* ── Station carpets (behind desks) ── */}
          {/* しきしま — blue command carpet */}
          <StationCarpet cx={470} cy={210} w={180} h={140} color="#58a6ff" zIndex={Z.backCarpet} />
          {/* しずめ — red safety mat */}
          <StationCarpet cx={92}  cy={310} w={150} h={130} color="#f85149" zIndex={Z.carpet} />
          {/* むすび — green plan mat */}
          <StationCarpet cx={252} cy={298} w={138} h={125} color="#3fb950" zIndex={Z.carpet} />
          {/* つむぐ — orange work mat */}
          <StationCarpet cx={686} cy={298} w={138} h={125} color="#f0883e" zIndex={Z.carpet} />
          {/* しるべ — purple record mat */}
          <StationCarpet cx={848} cy={308} w={150} h={130} color="#b07fff" zIndex={Z.carpet} />

          {/* ── Ambient glows ── */}
          <StationGlow cx={470} cy={230} color="#58a6ff" zIndex={Z.glow} size={100} />
          <StationGlow cx={92}  cy={320} color="#f85149" zIndex={Z.frontGlow} size={85} />
          <StationGlow cx={252} cy={308} color="#3fb950" zIndex={Z.frontGlow} size={80} />
          <StationGlow cx={686} cy={308} color="#f0883e" zIndex={Z.frontGlow} size={80} />
          <StationGlow cx={848} cy={318} color="#b07fff" zIndex={Z.frontGlow} size={85} />

          {/* ── BACK CENTER: しきしま ── */}
          <PixelRoomDesk kind="command" x={408} y={250} width={124} zIndex={Z.backDesk} />
          <CommandMonitor x={470} y={162} zIndex={Z.backProps} decision={decision} />
          <DeskLamp x={544} y={242} zIndex={Z.backProps} color="#58a6ff" />
          <DeskLamp x={396} y={244} zIndex={Z.backProps} color="#58a6ff" />
          <PixelRoomAgent
            agentId="shikishima" nameJa="しきしま" roleJa="司令席"
            pose={p.shikishima as PoseState} x={470} y={183} zIndex={Z.backAgent} size={58}
          />

          {/* ── FRONT LEFT: しずめ ── */}
          <PixelRoomDesk kind="gate" x={32}  y={358} width={124} zIndex={Z.frontDesk} />
          <SafetyGate x={92} y={262} zIndex={Z.frontProps} />
          <PixelRoomAgent
            agentId="shizume" nameJa="しずめ" roleJa="安全ゲート"
            pose={p.shizume as PoseState} x={92} y={282} zIndex={Z.frontAgent} size={62}
          />

          {/* ── FRONT CENTER-LEFT: むすび ── */}
          <PixelRoomDesk kind="plan" x={194} y={344} width={116} zIndex={Z.frontDesk} />
          <PlanBoard x={252} y={278} zIndex={Z.frontProps} />
          <DeskLamp x={308} y={338} zIndex={Z.frontProps} color="#3fb950" />
          <PixelRoomAgent
            agentId="hajime" nameJa="むすび" roleJa="計画デスク"
            pose={p.hajime as PoseState} x={252} y={270} zIndex={Z.frontAgent} size={60}
          />

          {/* ── FRONT CENTER-RIGHT: つむぐ ── */}
          <PixelRoomDesk kind="dev" x={628} y={344} width={116} zIndex={Z.frontDesk} />
          <ToolBox x={686} y={278} zIndex={Z.frontProps} />
          <DeskLamp x={632} y={338} zIndex={Z.frontProps} color="#f0883e" />
          <PixelRoomAgent
            agentId="tsumugi" nameJa="つむぐ" roleJa="開発ベンチ"
            pose={p.tsumugi as PoseState} x={686} y={270} zIndex={Z.frontAgent} size={60}
          />

          {/* ── FRONT RIGHT: しるべ ── */}
          <PixelRoomDesk kind="record" x={790} y={354} width={120} zIndex={Z.frontDesk} />
          <BookShelf x={848} y={270} zIndex={Z.frontProps} />
          <PixelRoomAgent
            agentId="shirube" nameJa="しるべ" roleJa="記録棚"
            pose={p.shirube as PoseState} x={848} y={276} zIndex={Z.frontAgent} size={60}
          />

        </div>
      </div>

      {/* ── Handoff lane ── */}
      <PixelRoomHandoffRail decision={decision} lang={lang} />

      {/* ── Bottom log + gate panel ── */}
      <PixelRoomLogStrip />

      {/* ── Safety invariants strip ── */}
      <div style={{
        display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center",
        padding: "6px 14px",
        borderTop: "1px solid rgba(248,81,73,0.4)",
        background: "rgba(1,2,8,0.97)",
        flexShrink: 0,
        fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
      }}>
        <span style={{ fontSize: 8, color: "#5566aa", letterSpacing: 1 }}>SAFETY</span>
        {[
          { k: "execution",       v: "disabled", c: "#f85149" },
          { k: "productionReady", v: "false",    c: "#f85149" },
          { k: "Gate",            v: "HOLD",     c: "#d29922" },
          { k: "ext.write",       v: "blocked",  c: "#f85149" },
          { k: "Level 5",         v: "human GO", c: "#6680aa" },
        ].map((b) => (
          <span key={b.k} style={{
            fontSize: 8, padding: "1px 7px", borderRadius: 2, whiteSpace: "nowrap",
            color: b.c, border: `1px solid ${b.c}35`,
          }}>
            {b.k}: {b.v}
          </span>
        ))}
      </div>
    </div>
  );
}
