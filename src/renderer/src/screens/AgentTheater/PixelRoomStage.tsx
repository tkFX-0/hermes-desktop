/**
 * PixelRoomStage — CSS 2.5D pixel room stage.
 * Reference: ３D部屋イメージ.png
 * Layered: floor, walls, desks, agents, props, HUD overlays.
 * Absolutely positioned room coordinates. z-index for depth.
 * No image assets. No Three.js. Display-only.
 * PXR-05A.
 */

import type { AgentPoseMap, PoseState } from "../../types/agent-theater-types";

// Import pixel-room.css for the pxr-anim-* animation classes
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

/* ── Stage dimensions ── */
const STAGE_W = 880;  // px (min-width)
const STAGE_H = 440;  // px

/*
 * Room coordinate layout (px in 880×440 stage):
 *
 * Back wall: top 0 → 202px (46% of STAGE_H)
 * Floor: 188px → 440px
 *
 * Agents (centered on x):
 *   しずめ  : x=90,  y=275  (front-left, large)
 *   はじめ  : x=245, y=265  (front-center-left)
 *   しきしま: x=440, y=175  (back-center, smaller)
 *   つむぐ  : x=635, y=265  (front-center-right)
 *   しるべ  : x=790, y=270  (front-right)
 *
 * Desks (x = center of agent, y = just below agent base):
 *   しずめ  desk: x-center=90,  y=315, width=110
 *   はじめ  desk: x-center=245, y=305, width=100
 *   しきしま desk: x-center=440, y=210, width=130
 *   つむぐ  desk: x-center=635, y=305, width=100
 *   しるべ  desk: x-center=790, y=310, width=110
 */

/* ── z-index scheme ── */
const Z = {
  stars:        1,
  floor:        2,
  wall:         3,
  wallProps:    4,
  backDesk:     8,
  backProps:    9,
  backAgent:    10,
  frontDesk:    15,
  frontProps:   16,
  frontAgent:   20,
  hud:          100,
} as const;

/* ── Pose derivation ── */
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
export interface PixelRoomStageProps {
  readonly decision?: string;
  readonly poses?: AgentPoseMap;
  readonly lang?: "ja" | "en";
}

/* ── Main stage ── */
export function PixelRoomStage({ decision = "HOLD", poses, lang = "ja" }: PixelRoomStageProps): React.JSX.Element {
  const p: AgentPoseMap = poses ?? derivePoses(decision);

  return (
    <div style={{
      background: "#03060f",
      borderRadius: 10,
      border: "1px solid rgba(40,60,140,0.5)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* ── Top safety HUD ── */}
      <PixelRoomSafetyHud decision={decision} lang={lang} />

      {/* ── Room stage (scrollable wrapper for narrow screens) ── */}
      <div style={{ overflowX: "auto", flexShrink: 0 }}>
        <div style={{
          position: "relative",
          width: STAGE_W,
          height: STAGE_H,
          background: "linear-gradient(180deg, #01030a 0%, #030812 45%, #04091a 100%)",
          overflow: "hidden",
        }}>

          {/* ── Layer 1: Floor ── */}
          <PixelRoomFloor />

          {/* ── Layer 2: Walls ── */}
          <PixelRoomWalls />

          {/* ── Back center: しきしま desk + monitor + lamp ── */}
          <PixelRoomDesk kind="command" x={440 - 65} y={220} width={130} zIndex={Z.backDesk} />
          <CommandMonitor x={440} y={145} zIndex={Z.backProps} decision={decision} />
          <DeskLamp x={500} y={212} zIndex={Z.backProps} color="#58a6ff" />
          <DeskLamp x={382} y={214} zIndex={Z.backProps} color="#58a6ff" />

          {/* ── Back center agent: しきしま ── */}
          <PixelRoomAgent
            agentId="shikishima" nameJa="しきしま" roleJa="司令席"
            pose={p.shikishima as PoseState} x={440} y={172} zIndex={Z.backAgent} size={46}
          />

          {/* ── Front-left: しずめ ── */}
          <PixelRoomDesk kind="gate" x={90 - 55} y={318} width={110} zIndex={Z.frontDesk} />
          <SafetyGate x={90} y={244} zIndex={Z.frontProps} />

          <PixelRoomAgent
            agentId="shizume" nameJa="しずめ" roleJa="安全ゲート"
            pose={p.shizume as PoseState} x={90} y={272} zIndex={Z.frontAgent} size={48}
          />

          {/* ── Front center-left: はじめ ── */}
          <PixelRoomDesk kind="plan" x={245 - 50} y={308} width={100} zIndex={Z.frontDesk} />
          <PlanBoard x={245} y={254} zIndex={Z.frontProps} />
          <DeskLamp x={295} y={302} zIndex={Z.frontProps} color="#3fb950" />

          <PixelRoomAgent
            agentId="hajime" nameJa="むすび" roleJa="計画デスク"
            pose={p.hajime as PoseState} x={245} y={262} zIndex={Z.frontAgent} size={46}
          />

          {/* ── Front center-right: つむぐ ── */}
          <PixelRoomDesk kind="dev" x={635 - 50} y={308} width={100} zIndex={Z.frontDesk} />
          <ToolBox x={635} y={256} zIndex={Z.frontProps} />
          <DeskLamp x={588} y={302} zIndex={Z.frontProps} color="#f0883e" />

          <PixelRoomAgent
            agentId="tsumugi" nameJa="つむぐ" roleJa="開発ベンチ"
            pose={p.tsumugi as PoseState} x={635} y={262} zIndex={Z.frontAgent} size={46}
          />

          {/* ── Front-right: しるべ ── */}
          <PixelRoomDesk kind="record" x={790 - 55} y={314} width={110} zIndex={Z.frontDesk} />
          <BookShelf x={790} y={250} zIndex={Z.frontProps} />

          <PixelRoomAgent
            agentId="shirube" nameJa="しるべ" roleJa="記録棚"
            pose={p.shirube as PoseState} x={790} y={268} zIndex={Z.frontAgent} size={46}
          />

        </div>
      </div>

      {/* ── Handoff lane ── */}
      <PixelRoomHandoffRail decision={decision} lang={lang} />

      {/* ── Bottom log + gate panel ── */}
      <PixelRoomLogStrip />

      {/* ── Bottom safety invariant strip ── */}
      <div style={{
        display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center",
        padding: "6px 12px",
        borderTop: "1px solid rgba(248,81,73,0.4)",
        background: "rgba(2,3,10,0.97)",
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
            fontSize: 8, padding: "1px 6px", borderRadius: 2, whiteSpace: "nowrap",
            color: b.c, border: `1px solid ${b.c}35`,
          }}>
            {b.k}: {b.v}
          </span>
        ))}
      </div>
    </div>
  );
}
