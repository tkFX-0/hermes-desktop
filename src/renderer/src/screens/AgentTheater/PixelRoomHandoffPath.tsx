/**
 * PixelRoomHandoffPath — display-only agent handoff animation.
 * Each agent leaves its station, carries a document along an arc to the
 * receiving station, pauses, then returns home. No route lines drawn.
 * Route: むすび → しずめ → つむぎ → しるべ → しきしま → (loop)
 * prefers-reduced-motion: agents are hidden (no animation).
 */

import { useEffect, useState } from "react";

const W = 940;
const H = 500;

/* Total cycle length for each actor (all share the same duration). */
const CYCLE_S = 26;

type HandoffAgent = "hajime" | "shizume" | "tsumugi" | "shirube" | "shikishima";

interface StationPoint {
  readonly x: number;
  readonly y: number;
}

interface HandoffStep {
  readonly from: HandoffAgent;
  readonly to: HandoffAgent;
  readonly start: StationPoint;
  readonly end: StationPoint;
  readonly beginSeconds: number; /* staggered start within CYCLE_S */
  readonly color: string;
}

/*
 * Station desk-top positions (matching PixelRoomStage layout).
 * The mini ghost is offset 24px above each point so it floats over the desk.
 */
const HANDOFF_STEPS: readonly HandoffStep[] = [
  {
    from: "hajime",
    to: "shizume",
    start: { x: 252, y: 348 },
    end: { x: 92, y: 358 },
    beginSeconds: 0,
    color: "#3fb950",
  },
  {
    from: "shizume",
    to: "tsumugi",
    start: { x: 92, y: 358 },
    end: { x: 686, y: 348 },
    beginSeconds: 5,
    color: "#f85149",
  },
  {
    from: "tsumugi",
    to: "shirube",
    start: { x: 686, y: 348 },
    end: { x: 848, y: 356 },
    beginSeconds: 10,
    color: "#f0883e",
  },
  {
    from: "shirube",
    to: "shikishima",
    start: { x: 848, y: 356 },
    end: { x: 470, y: 258 },
    beginSeconds: 15,
    color: "#b07fff",
  },
  {
    from: "shikishima",
    to: "hajime",
    start: { x: 470, y: 258 },
    end: { x: 252, y: 348 },
    beginSeconds: 20,
    color: "#58a6ff",
  },
] as const;

/* Arc path: out via parabola, back via same parabola. */
function arcPath(step: HandoffStep): string {
  const midX = (step.start.x + step.end.x) / 2;
  const midY = Math.min(step.start.y, step.end.y) - 44;
  return [
    `M${step.start.x},${step.start.y}`,
    `Q${midX},${midY} ${step.end.x},${step.end.y}`,
    `Q${midX},${midY} ${step.start.x},${step.start.y}`,
  ].join(" ");
}

/* ──────────────────────────────────────────────────────────────────
   AgentMiniGhost — scaled-down version matching PixelGhostSprite.
   Origin (0,0) is at desk level; ghost is drawn -24px and above.

   Identity accessories (visible at mini scale):
     しきしま : thick navy headset band + oval earpads + mic arm
     しずめ   : dark flat cap (filled dome + wide brim)
     はじめ   : small "?" thought bubble (upper right)
     つむぎ   : bright yellow hard-hat dome + brim
     しるべ   : thick dark headphones (slightly taller pads than しきしま)
────────────────────────────────────────────────────────────────── */
function AgentMiniGhost({
  agent,
  color,
}: {
  readonly agent: HandoffAgent;
  readonly color: string;
}): React.JSX.Element {
  const hasHeadset = agent === "shikishima";
  const hasHeadphones = agent === "shirube";
  const hasYellowHelmet = agent === "tsumugi";
  const hasDarkCap = agent === "shizume";
  const hasBubble = agent === "hajime";

  const headgearStroke = hasHeadset
    ? "#142858"
    : hasHeadphones
      ? "#18224d"
      : null;
  const capFill = hasYellowHelmet ? "#f5bd12" : hasDarkCap ? "#172448" : null;

  return (
    /* Lifted 24px above path point so ghost floats over the desk surface */
    <g transform="translate(0,-24)">
      {/* Floor shadow */}
      <ellipse cx="0" cy="18" rx="14" ry="3.5" fill="rgba(0,0,0,0.22)" />

      {/* Ghost body */}
      <path
        d="M0,-16 C-10,-16 -14,-9 -14,-2 L-14,7 Q-11,13 -6,9 Q-3,15 0,9 Q3,15 6,9 Q11,13 14,7 L14,-2 C14,-9 10,-16 0,-16 Z"
        fill="rgba(237,242,255,0.97)"
        stroke={color}
        strokeWidth="1.8"
      />
      {/* Body highlight */}
      <ellipse cx="-2" cy="-10" rx="6" ry="4.5" fill="rgba(255,255,255,0.38)" />

      {/* ── Hat / Cap (drawn before face so face appears on top) ── */}
      {capFill != null ? (
        hasYellowHelmet ? (
          /* Yellow hard hat — dome + brim */
          <>
            <path
              d="M-13,-1 Q0,-23 13,-1"
              fill={capFill}
              stroke="#b87500"
              strokeWidth="0.8"
            />
            <rect x="-15" y="-2" width="30" height="4" rx="2" fill="#d98a00" />
          </>
        ) : (
          /* Dark flat officer cap — dome + wide brim */
          <>
            <path d="M-11,-1 Q0,-20 11,-1" fill={capFill} />
            <path d="M-8,-4 Q0,-14 8,-4" fill="#263d78" />
            <rect x="-14" y="-2" width="28" height="4" rx="2" fill="#111a30" />
          </>
        )
      ) : null}

      {/* ── Headset / Headphones (arc + earpads) ── */}
      {headgearStroke != null ? (
        <>
          {/* Band arc over head */}
          <path
            d="M-14,-2 Q0,-22 14,-2"
            stroke={headgearStroke}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          {/* Left earpad */}
          <ellipse cx="-15" cy="-1" rx="4" ry="5.5" fill={headgearStroke} />
          <ellipse
            cx="-15"
            cy="-1"
            rx="2.2"
            ry="3.2"
            fill={hasHeadset ? "#2e4898" : "#4557b8"}
          />
          {/* Right earpad */}
          <ellipse cx="15" cy="-1" rx="4" ry="5.5" fill={headgearStroke} />
          <ellipse
            cx="15"
            cy="-1"
            rx="2.2"
            ry="3.2"
            fill={hasHeadset ? "#2e4898" : "#4557b8"}
          />
          {/* Mic arm (しきしま only) */}
          {hasHeadset ? (
            <path
              d="M-18,2 Q-20,9 -13,12"
              stroke={headgearStroke}
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
          ) : null}
        </>
      ) : null}

      {/* ── はじめ: thought bubble (upper right) ── */}
      {hasBubble ? (
        <>
          <circle
            cx="14"
            cy="-18"
            r="6"
            fill="rgba(220,230,255,0.92)"
            stroke="#b9caff"
            strokeWidth="0.8"
          />
          <circle
            cx="9"
            cy="-12"
            r="2.5"
            fill="rgba(220,230,255,0.92)"
            stroke="#b9caff"
            strokeWidth="0.6"
          />
          <text
            x="14"
            y="-13.5"
            textAnchor="middle"
            fontFamily='"IBM Plex Mono", monospace'
            fontSize="7"
            fill="#102052"
            fontWeight="900"
          >
            ?
          </text>
        </>
      ) : null}

      {/* ── Face ── */}
      {/* Left eye */}
      <rect x="-8" y="-9" width="6" height="7.5" rx="1.5" fill="#102052" />
      <rect
        x="-7.5"
        y="-8.5"
        width="2"
        height="2"
        rx="0.3"
        fill="white"
        opacity="0.9"
      />
      {/* Right eye */}
      <rect x="2" y="-9" width="6" height="7.5" rx="1.5" fill="#102052" />
      <rect
        x="2.5"
        y="-8.5"
        width="2"
        height="2"
        rx="0.3"
        fill="white"
        opacity="0.9"
      />
      {/* Cheeks */}
      <ellipse
        cx="-11"
        cy="-1.5"
        rx="3.5"
        ry="2.5"
        fill="rgba(255,130,130,0.52)"
      />
      <ellipse
        cx="11"
        cy="-1.5"
        rx="3.5"
        ry="2.5"
        fill="rgba(255,130,130,0.52)"
      />
      {/* Smile */}
      <path
        d="M-6,3.5 Q0,8.5 6,3.5"
        stroke="#102052"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />

      {/* ── Document being carried (bobs gently) ── */}
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0,-2.5; 0,0"
          dur="1.15s"
          repeatCount="indefinite"
        />
        {/* Doc card */}
        <rect
          x="-12"
          y="8"
          width="24"
          height="15"
          rx="2.5"
          fill="rgba(242,248,255,0.97)"
          stroke={color}
          strokeWidth="1.3"
        />
        {/* Doc lines */}
        <line
          x1="-8"
          y1="13"
          x2="9"
          y2="13"
          stroke={color}
          strokeWidth="1.1"
          opacity="0.65"
        />
        <line
          x1="-8"
          y1="17"
          x2="5"
          y2="17"
          stroke={color}
          strokeWidth="1.1"
          opacity="0.40"
        />
        {/* Star sparkle at top-right corner */}
        <circle cx="10" cy="9.5" r="2" fill="rgba(255,218,70,0.85)" />
      </g>
    </g>
  );
}

/* ──────────────────────────────────────────────────────────────────
   HandoffActor — one mini-ghost making a round trip per step.
   Timing:
     0–8%   : fade in at start station
     8–42%  : travel to destination (one-way arc)
     42–58% : pause at destination (delivery moment)
     58–92% : return home (same arc, reversed)
     92–100%: fade out at home station
────────────────────────────────────────────────────────────────── */
function HandoffActor({
  step,
  reducedMotion,
}: {
  readonly step: HandoffStep;
  readonly reducedMotion: boolean;
}): React.JSX.Element {
  if (reducedMotion) return <g />;

  const path = arcPath(step);
  const begin = `${step.beginSeconds}s`;
  const dur = `${CYCLE_S}s`;

  return (
    <g filter="url(#pxr-mini-ghost-glow)">
      <g opacity="0">
        {/* Fade in → visible → fade out */}
        <animate
          attributeName="opacity"
          values="0;1;1;1;0"
          keyTimes="0;0.08;0.50;0.86;1"
          dur={dur}
          begin={begin}
          repeatCount="indefinite"
        />
        {/* Move along arc (out) then return (back) */}
        <animateMotion
          path={path}
          dur={dur}
          begin={begin}
          repeatCount="indefinite"
          calcMode="linear"
          keyPoints="0;0;0.5;0.5;1;1"
          keyTimes="0;0.08;0.42;0.58;0.92;1"
        />
        <AgentMiniGhost agent={step.from} color={step.color} />
      </g>
    </g>
  );
}

/* ── Main component ── */
interface PixelRoomHandoffPathProps {
  readonly decision?: string;
  readonly zIndex?: number;
}

export function PixelRoomHandoffPath({
  decision = "HOLD",
  zIndex = 14,
}: PixelRoomHandoffPathProps): React.JSX.Element {
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  const isStop = decision === "STOP";

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (): void => setReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <svg
      aria-hidden
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: W,
        height: H,
        zIndex,
        pointerEvents: "none",
        overflow: "visible",
      }}
      viewBox={`0 0 ${W} ${H}`}
    >
      <defs>
        <filter
          id="pxr-mini-ghost-glow"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur stdDeviation="2.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Staggered delivery actors */}
      {!isStop &&
        HANDOFF_STEPS.map((step) => (
          <HandoffActor
            key={`${step.from}-${step.to}`}
            step={step}
            reducedMotion={reducedMotion}
          />
        ))}

      {/* STOP mode: no deliveries */}
      {isStop && (
        <text
          x={W / 2}
          y={H * 0.55}
          textAnchor="middle"
          fontFamily='"IBM Plex Mono", monospace'
          fontSize="11"
          fill="rgba(248,81,73,0.40)"
          letterSpacing="3"
        >
          ── HOLD: handoff suspended ──
        </text>
      )}
    </svg>
  );
}
