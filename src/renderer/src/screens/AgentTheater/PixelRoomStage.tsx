/**
 * PixelRoomStage — CSS 2.5D pixel room stage.
 * PXR-05F: larger characters (size 96/82), ceiling spotlight cones,
 *          desk shadows, stronger carpets — outdoor/indoor separation
 *          is handled by PixelRoomWalls + PixelRoomFloor.
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
import { PixelRoomHandoffPath } from "./PixelRoomHandoffPath";
import { PixelRoomWorkScene } from "./PixelRoomWorkScene";

const STAGE_W = 940;
const STAGE_H = 500;

const Z = {
  floor: 2,
  spotlight: 3, // ceiling light cones (below carpets so carpets clip the foot)
  carpet: 4,
  wall: 5,
  wallProps: 6,
  backCarpet: 7,
  glow: 8,
  deskShadow: 9, // shadow pool at each desk front edge
  backDesk: 10,
  backProps: 11,
  backAgent: 13,
  frontDesk: 18,
  frontProps: 19,
  frontGlow: 20,
  frontAgent: 22,
} as const;

/* ── Station carpet (floor mat) ── */
interface CarpetProps {
  cx: number;
  cy: number;
  w: number;
  h: number;
  color: string;
  zIndex: number;
}

function StationCarpet({
  cx,
  cy,
  w,
  h,
  color,
  zIndex,
}: CarpetProps): React.JSX.Element {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: cx - w / 2,
        top: cy,
        width: w,
        height: h,
        background: `radial-gradient(ellipse at 50% 30%, ${color}28 0%, ${color}0e 60%, transparent 100%)`,
        border: `2px solid ${color}30`,
        borderRadius: 10,
        zIndex,
        boxShadow: `inset 0 0 20px ${color}16`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 5,
          border: `1px solid ${color}20`,
          borderRadius: 6,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 10,
          border: `1px dashed ${color}14`,
          borderRadius: 4,
        }}
      />
    </div>
  );
}

/* ── Ambient station glow ── */
interface GlowProps {
  cx: number;
  cy: number;
  color: string;
  zIndex: number;
  size?: number;
}

function StationGlow({
  cx,
  cy,
  color,
  zIndex,
  size = 120,
}: GlowProps): React.JSX.Element {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: cx - size,
        top: cy - size * 0.4,
        width: size * 2,
        height: size * 1.3,
        background: `radial-gradient(ellipse, ${color}2e 0%, ${color}0f 45%, transparent 70%)`,
        zIndex,
        pointerEvents: "none",
      }}
    />
  );
}

/*
 * ── Ceiling spotlight cone ──
 * Downward trapezoid of colored light: narrow at ceiling, wide at carpet.
 * bottomY = y-coordinate where the cone meets the station carpet.
 */
function CeilingSpotlight({
  cx,
  bottomY,
  color,
  zIndex,
}: {
  cx: number;
  bottomY: number;
  color: string;
  zIndex: number;
}): React.JSX.Element {
  const h = bottomY;
  const wBottom = Math.round(h * 0.46); // cone opens ~46° total
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: cx - wBottom / 2,
        top: 0,
        width: wBottom,
        height: h,
        zIndex,
        pointerEvents: "none",
        background: `linear-gradient(180deg, ${color}00 0%, ${color}07 60%, ${color}1c 100%)`,
        clipPath: "polygon(47% 0%, 53% 0%, 100% 100%, 0% 100%)",
      }}
    />
  );
}

/*
 * ── Desk shadow ──
 * Dark ellipse pool behind each desk's front edge, suggesting the desk
 * casts a shadow downward onto the floor/carpet.
 */
function DeskShadow({
  cx,
  y,
  w,
  zIndex,
}: {
  cx: number;
  y: number;
  w: number;
  zIndex: number;
}): React.JSX.Element {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: cx - w * 0.68,
        top: y - 6,
        width: w * 1.36,
        height: 26,
        zIndex,
        pointerEvents: "none",
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.24) 52%, transparent 72%)",
      }}
    />
  );
}

function derivePoses(decision: string): AgentPoseMap {
  switch (decision) {
    case "STOP":
      return {
        shikishima: "hold_stop_blocked",
        shizume: "hold_stop_blocked",
        hajime: "hold_stop_blocked",
        tsumugi: "hold_stop_blocked",
        shirube: "hold_stop_blocked",
      };
    case "PASS":
    case "PASS_WITH_CAVEAT":
      return {
        shikishima: "handoff_receive",
        shizume: "pass",
        hajime: "pass",
        tsumugi: "working",
        shirube: "working",
      };
    case "GO_READY":
      return {
        shikishima: "waiting_human_go",
        shizume: "working",
        hajime: "thinking",
        tsumugi: "working",
        shirube: "working",
      };
    default:
      return {
        shikishima: "waiting_human_go",
        shizume: "hold_stop_blocked",
        hajime: "idle",
        tsumugi: "idle",
        shirube: "idle",
      };
  }
}

export interface PixelRoomStageProps {
  readonly decision?: string;
  readonly poses?: AgentPoseMap;
  readonly lang?: "ja" | "en";
}

export function PixelRoomStage({
  decision = "HOLD",
  poses,
  lang = "ja",
}: PixelRoomStageProps): React.JSX.Element {
  const p: AgentPoseMap = poses ?? derivePoses(decision);

  return (
    <div
      style={{
        background: "#01020a",
        borderRadius: 10,
        border: "1px solid rgba(40,60,140,0.55)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Top HUD ── */}
      <PixelRoomSafetyHud decision={decision} lang={lang} />

      {/* ── Room stage ── */}
      <div style={{ overflowX: "auto", flexShrink: 0 }}>
        <div
          style={{
            position: "relative",
            width: STAGE_W,
            height: STAGE_H,
            background:
              "linear-gradient(180deg, #010309 0%, #030910 42%, #04091a 100%)",
            overflow: "hidden",
          }}
        >
          {/* Layer 1: Floor tiles */}
          <PixelRoomFloor />

          {/* Layer 2: Back wall + windows */}
          <PixelRoomWalls />

          {/* Layer 3: Handoff delivery ghosts */}
          <PixelRoomHandoffPath decision={decision} zIndex={Z.carpet - 1} />

          {/* ── Ceiling spotlight cones (below carpets) ── */}
          <CeilingSpotlight
            cx={470}
            bottomY={212}
            color="#58a6ff"
            zIndex={Z.spotlight}
          />
          <CeilingSpotlight
            cx={92}
            bottomY={312}
            color="#f85149"
            zIndex={Z.spotlight}
          />
          <CeilingSpotlight
            cx={252}
            bottomY={300}
            color="#3fb950"
            zIndex={Z.spotlight}
          />
          <CeilingSpotlight
            cx={686}
            bottomY={300}
            color="#f0883e"
            zIndex={Z.spotlight}
          />
          <CeilingSpotlight
            cx={848}
            bottomY={312}
            color="#b07fff"
            zIndex={Z.spotlight}
          />

          {/* ── Station carpets ── */}
          {/* しきしま — blue command carpet (back, perspective-smaller) */}
          <StationCarpet
            cx={470}
            cy={210}
            w={200}
            h={148}
            color="#58a6ff"
            zIndex={Z.backCarpet}
          />
          {/* しずめ — red safety mat */}
          <StationCarpet
            cx={92}
            cy={308}
            w={176}
            h={145}
            color="#f85149"
            zIndex={Z.carpet}
          />
          {/* むすび — green plan mat */}
          <StationCarpet
            cx={252}
            cy={296}
            w={158}
            h={132}
            color="#3fb950"
            zIndex={Z.carpet}
          />
          {/* つむぎ — orange work mat */}
          <StationCarpet
            cx={686}
            cy={296}
            w={158}
            h={132}
            color="#f0883e"
            zIndex={Z.carpet}
          />
          {/* しるべ — purple record mat */}
          <StationCarpet
            cx={848}
            cy={308}
            w={176}
            h={145}
            color="#b07fff"
            zIndex={Z.carpet}
          />

          {/* ── Ambient glows ── */}
          <StationGlow
            cx={470}
            cy={232}
            color="#58a6ff"
            zIndex={Z.glow}
            size={108}
          />
          <StationGlow
            cx={92}
            cy={322}
            color="#f85149"
            zIndex={Z.frontGlow}
            size={104}
          />
          <StationGlow
            cx={252}
            cy={310}
            color="#3fb950"
            zIndex={Z.frontGlow}
            size={98}
          />
          <StationGlow
            cx={686}
            cy={310}
            color="#f0883e"
            zIndex={Z.frontGlow}
            size={98}
          />
          <StationGlow
            cx={848}
            cy={322}
            color="#b07fff"
            zIndex={Z.frontGlow}
            size={104}
          />

          {/* ── Desk shadows (dark pool at front edge of each desk) ── */}
          <DeskShadow cx={470} y={252} w={124} zIndex={Z.deskShadow} />
          <DeskShadow cx={92} y={358} w={124} zIndex={Z.deskShadow} />
          <DeskShadow cx={252} y={344} w={116} zIndex={Z.deskShadow} />
          <DeskShadow cx={686} y={344} w={116} zIndex={Z.deskShadow} />
          <DeskShadow cx={848} y={354} w={120} zIndex={Z.deskShadow} />

          {/* ── BACK CENTER: しきしま (司令席) ── */}
          <PixelRoomDesk
            kind="command"
            x={408}
            y={250}
            width={124}
            zIndex={Z.backDesk}
          />
          <CommandMonitor
            x={470}
            y={162}
            zIndex={Z.backProps}
            decision={decision}
          />
          <DeskLamp x={544} y={242} zIndex={Z.backProps} color="#58a6ff" />
          <DeskLamp x={396} y={244} zIndex={Z.backProps} color="#58a6ff" />
          <PixelRoomAgent
            agentId="shikishima"
            nameJa="しきしま"
            roleJa="司令席"
            pose={p.shikishima as PoseState}
            x={470}
            y={148}
            zIndex={Z.backAgent}
            size={82}
          />

          {/* ── FRONT LEFT: しずめ (安全ゲート) ── */}
          <PixelRoomDesk
            kind="gate"
            x={32}
            y={358}
            width={124}
            zIndex={Z.frontDesk}
          />
          <SafetyGate x={92} y={262} zIndex={Z.frontProps} />
          <PixelRoomAgent
            agentId="shizume"
            nameJa="しずめ"
            roleJa="安全ゲート"
            pose={p.shizume as PoseState}
            x={92}
            y={236}
            zIndex={Z.frontAgent}
            size={96}
          />

          {/* ── FRONT CENTER-LEFT: むすび (計画デスク) ── */}
          <PixelRoomDesk
            kind="plan"
            x={194}
            y={344}
            width={116}
            zIndex={Z.frontDesk}
          />
          <PlanBoard x={252} y={278} zIndex={Z.frontProps} />
          <DeskLamp x={308} y={338} zIndex={Z.frontProps} color="#3fb950" />
          <PixelRoomAgent
            agentId="hajime"
            nameJa="むすび"
            roleJa="計画デスク"
            pose={p.hajime as PoseState}
            x={252}
            y={224}
            zIndex={Z.frontAgent}
            size={96}
          />

          {/* ── FRONT CENTER-RIGHT: つむぎ (開発ベンチ) ── */}
          <PixelRoomDesk
            kind="dev"
            x={628}
            y={344}
            width={116}
            zIndex={Z.frontDesk}
          />
          <ToolBox x={686} y={278} zIndex={Z.frontProps} />
          <DeskLamp x={632} y={338} zIndex={Z.frontProps} color="#f0883e" />
          <PixelRoomAgent
            agentId="tsumugi"
            nameJa="つむぎ"
            roleJa="開発ベンチ"
            pose={p.tsumugi as PoseState}
            x={686}
            y={224}
            zIndex={Z.frontAgent}
            size={96}
          />

          {/* ── Work status bubbles (above each agent) ── */}
          <PixelRoomWorkScene
            poses={{
              shikishima: p.shikishima as PoseState,
              shizume: p.shizume as PoseState,
              hajime: p.hajime as PoseState,
              tsumugi: p.tsumugi as PoseState,
              shirube: p.shirube as PoseState,
            }}
            lang={lang}
            zIndex={Z.frontAgent + 5}
          />

          {/* ── FRONT RIGHT: しるべ (記録棚) ── */}
          <PixelRoomDesk
            kind="record"
            x={790}
            y={354}
            width={120}
            zIndex={Z.frontDesk}
          />
          <BookShelf x={848} y={270} zIndex={Z.frontProps} />
          <PixelRoomAgent
            agentId="shirube"
            nameJa="しるべ"
            roleJa="記録棚"
            pose={p.shirube as PoseState}
            x={848}
            y={230}
            zIndex={Z.frontAgent}
            size={96}
          />
        </div>
      </div>

      {/* ── Handoff lane ── */}
      <PixelRoomHandoffRail decision={decision} lang={lang} />

      {/* ── Bottom log strip ── */}
      <PixelRoomLogStrip />

      {/* ── Safety invariants strip ── */}
      <div
        style={{
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
          alignItems: "center",
          padding: "6px 14px",
          borderTop: "1px solid rgba(248,81,73,0.4)",
          background: "rgba(1,2,8,0.97)",
          flexShrink: 0,
          fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
        }}
      >
        <span style={{ fontSize: 8, color: "#5566aa", letterSpacing: 1 }}>
          SAFETY
        </span>
        {[
          { k: "execution", v: "disabled", c: "#f85149" },
          { k: "productionReady", v: "false", c: "#f85149" },
          { k: "Gate", v: "HOLD", c: "#d29922" },
          { k: "ext.write", v: "blocked", c: "#f85149" },
          { k: "Level 5", v: "human GO", c: "#6680aa" },
        ].map((b) => (
          <span
            key={b.k}
            style={{
              fontSize: 8,
              padding: "1px 7px",
              borderRadius: 2,
              whiteSpace: "nowrap",
              color: b.c,
              border: `1px solid ${b.c}35`,
            }}
          >
            {b.k}: {b.v}
          </span>
        ))}
      </div>
    </div>
  );
}
