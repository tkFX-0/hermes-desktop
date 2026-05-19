/**
 * PixelRoomStage — CSS 2.5D pixel room stage.
 * PXR-05B: larger stage, denser room, larger agents.
 * Reference: ３D部屋イメージ.png
 * Layered: floor, walls, desks, agents, props, HUD overlays.
 * No image assets. No Three.js. Display-only.
 */

import type { AgentPoseMap, PoseState } from "../../types/agent-theater-types";
import "./PixelRoom/pixel-room.css";

import { PixelRoomSafetyHud } from "./PixelRoomSafetyHud";
import { PixelRoomFloor } from "./PixelRoomFloor";
import { PixelRoomWalls } from "./PixelRoomWalls";
import { PixelRoomDesk } from "./PixelRoomDesk";
import { PixelRoomAgent } from "./PixelRoomAgent";
import {
  CommandMonitor,
  SafetyGate,
  PlanBoard,
  ToolBox,
  BookShelf,
  DeskLamp,
} from "./PixelRoomProps";
import { PixelRoomHandoffRail } from "./PixelRoomHandoffRail";
import { PixelRoomLogStrip } from "./PixelRoomLogStrip";

/* ── Stage dimensions (PXR-05B enlarged) ── */
const STAGE_W = 920;
const STAGE_H = 480;

/*
 * Room layout (px) — PXR-05B
 *
 * Back wall: top 0 → ~213px (44% of 480)
 * Floor: ~195px → 480px
 *
 * Agents (x = center, translateX(-50%) applied):
 *   しずめ  : x=88,  y=290, size=56
 *   むすび  : x=246, y=278, size=54
 *   しきしま: x=460, y=185, size=54  (back-center)
 *   つむぐ  : x=672, y=278, size=54
 *   しるべ  : x=832, y=285, size=54
 *
 * Desks (x = left edge, y = desk top):
 *   しずめ  desk: x=32,  y=340, width=120
 *   むすび  desk: x=190, y=328, width=112
 *   しきしま desk: x=395, y=232, width=130
 *   つむぐ  desk: x=616, y=328, width=112
 *   しるべ  desk: x=776, y=334, width=120
 */

const Z = {
  floor:      2,
  wall:       3,
  wallProps:  4,
  backDesk:   8,
  backProps:  9,
  backAgent:  12,
  frontDesk:  16,
  frontProps: 18,
  frontAgent: 22,
} as const;

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
      {/* ── Top safety HUD (game-UI style) ── */}
      <PixelRoomSafetyHud decision={decision} lang={lang} />

      {/* ── Room stage ── */}
      <div style={{ overflowX: "auto", flexShrink: 0 }}>
        <div style={{
          position: "relative",
          width: STAGE_W,
          height: STAGE_H,
          background: "linear-gradient(180deg, #01030b 0%, #030914 45%, #040b1c 100%)",
          overflow: "hidden",
        }}>
          {/* Layer: floor */}
          <PixelRoomFloor />

          {/* Layer: walls + window + panels */}
          <PixelRoomWalls />

          {/* ─── BACK CENTER: しきしま ─── */}
          {/* Desk */}
          <PixelRoomDesk kind="command" x={395} y={240} width={130} zIndex={Z.backDesk} />
          {/* Monitors */}
          <CommandMonitor x={460} y={155} zIndex={Z.backProps} decision={decision} />
          {/* Lamps */}
          <DeskLamp x={530} y={232} zIndex={Z.backProps} color="#58a6ff" />
          <DeskLamp x={390} y={234} zIndex={Z.backProps} color="#58a6ff" />
          {/* Agent */}
          <PixelRoomAgent
            agentId="shikishima" nameJa="しきしま" roleJa="司令席"
            pose={p.shikishima as PoseState} x={460} y={183} zIndex={Z.backAgent} size={54}
          />

          {/* ─── FRONT LEFT: しずめ ─── */}
          <PixelRoomDesk kind="gate" x={32} y={345} width={120} zIndex={Z.frontDesk} />
          <SafetyGate x={88} y={252} zIndex={Z.frontProps} />
          <PixelRoomAgent
            agentId="shizume" nameJa="しずめ" roleJa="安全ゲート"
            pose={p.shizume as PoseState} x={92} y={288} zIndex={Z.frontAgent} size={56}
          />

          {/* ─── FRONT CENTER-LEFT: むすび ─── */}
          <PixelRoomDesk kind="plan" x={188} y={332} width={116} zIndex={Z.frontDesk} />
          <PlanBoard x={246} y={270} zIndex={Z.frontProps} />
          <DeskLamp x={300} y={326} zIndex={Z.frontProps} color="#3fb950" />
          <PixelRoomAgent
            agentId="hajime" nameJa="むすび" roleJa="計画デスク"
            pose={p.hajime as PoseState} x={246} y={276} zIndex={Z.frontAgent} size={54}
          />

          {/* ─── FRONT CENTER-RIGHT: つむぐ ─── */}
          <PixelRoomDesk kind="dev" x={618} y={332} width={116} zIndex={Z.frontDesk} />
          <ToolBox x={672} y={272} zIndex={Z.frontProps} />
          <DeskLamp x={620} y={326} zIndex={Z.frontProps} color="#f0883e" />
          <PixelRoomAgent
            agentId="tsumugi" nameJa="つむぐ" roleJa="開発ベンチ"
            pose={p.tsumugi as PoseState} x={676} y={276} zIndex={Z.frontAgent} size={54}
          />

          {/* ─── FRONT RIGHT: しるべ ─── */}
          <PixelRoomDesk kind="record" x={776} y={340} width={120} zIndex={Z.frontDesk} />
          <BookShelf x={836} y={264} zIndex={Z.frontProps} />
          <PixelRoomAgent
            agentId="shirube" nameJa="しるべ" roleJa="記録棚"
            pose={p.shirube as PoseState} x={836} y={282} zIndex={Z.frontAgent} size={54}
          />

        </div>
      </div>

      {/* ── Handoff lane (prominent) ── */}
      <PixelRoomHandoffRail decision={decision} lang={lang} />

      {/* ── Bottom: log + gate panel ── */}
      <PixelRoomLogStrip />

      {/* ── Bottom safety invariant strip ── */}
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
