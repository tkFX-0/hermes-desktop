/**
 * PixelRoomHandoffPath — display-only agent handoff animation.
 * A working agent leaves its station, carries a document to the next agent,
 * pauses at the receiving station, then returns to its own workstation.
 * No route lines, arrows, station nodes, or third-party delivery ghost.
 */

import { useEffect, useState } from "react";

const W = 940;
const H = 500;
const CYCLE_SECONDS = 25;

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
  readonly beginSeconds: number;
  readonly color: string;
  readonly label: string;
}

const HANDOFF_STEPS: readonly HandoffStep[] = [
  {
    from: "hajime",
    to: "shizume",
    start: { x: 252, y: 348 },
    end: { x: 92, y: 358 },
    beginSeconds: 0,
    color: "#3fb950",
    label: "plan",
  },
  {
    from: "shizume",
    to: "tsumugi",
    start: { x: 92, y: 358 },
    end: { x: 686, y: 348 },
    beginSeconds: 5,
    color: "#f85149",
    label: "safety",
  },
  {
    from: "tsumugi",
    to: "shirube",
    start: { x: 686, y: 348 },
    end: { x: 848, y: 356 },
    beginSeconds: 10,
    color: "#f0883e",
    label: "dev",
  },
  {
    from: "shirube",
    to: "shikishima",
    start: { x: 848, y: 356 },
    end: { x: 470, y: 258 },
    beginSeconds: 15,
    color: "#b07fff",
    label: "record",
  },
  {
    from: "shikishima",
    to: "hajime",
    start: { x: 470, y: 258 },
    end: { x: 252, y: 348 },
    beginSeconds: 20,
    color: "#58a6ff",
    label: "return",
  },
] as const;

interface PixelRoomHandoffPathProps {
  readonly decision?: string;
  readonly zIndex?: number;
}

function createRoundTripPath(step: HandoffStep): string {
  const midX = (step.start.x + step.end.x) / 2;
  const midY = Math.min(step.start.y, step.end.y) - 42;
  return [
    `M${step.start.x},${step.start.y}`,
    `Q${midX},${midY} ${step.end.x},${step.end.y}`,
    `Q${midX},${midY} ${step.start.x},${step.start.y}`,
  ].join(" ");
}

function AgentMiniGhost({ agent, color }: { readonly agent: HandoffAgent; readonly color: string }): React.JSX.Element {
  const capColor = agent === "tsumugi" ? "#f5bc00" : agent === "shizume" ? "#1d2748" : undefined;
  const headsetColor = agent === "shikishima" ? "#1c2d5c" : agent === "shirube" ? "#201848" : undefined;

  return (
    <g transform="translate(0,-24)">
      <ellipse cx="0" cy="18" rx="14" ry="3.5" fill="rgba(0,0,0,0.22)" />
      <path
        d="M0,-16 C-10,-16 -14,-9 -14,-2 L-14,7 Q-11,13 -6,9 Q-3,15 0,9 Q3,15 6,9 Q11,13 14,7 L14,-2 C14,-9 10,-16 0,-16 Z"
        fill="rgba(237,242,255,0.96)"
        stroke={color}
        strokeWidth="1.5"
      />
      <ellipse cx="-2" cy="-10" rx="6" ry="4.5" fill="rgba(255,255,255,0.36)" />

      {capColor ? (
        <>
          <path d="M-12,-16 Q0,-25 12,-16" fill={capColor} />
          <rect x="-14" y="-16" width="28" height="3.5" rx="1.8" fill={capColor} />
        </>
      ) : null}

      {headsetColor ? (
        <>
          <path d="M-12,-5 Q0,-22 12,-5" stroke={headsetColor} strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <ellipse cx="-13" cy="-4" rx="3" ry="4" fill={headsetColor} />
          <ellipse cx="13" cy="-4" rx="3" ry="4" fill={headsetColor} />
        </>
      ) : null}

      {agent === "hajime" ? (
        <circle cx="12" cy="-18" r="5" fill="rgba(220,228,255,0.9)" stroke="#c4d4f0" strokeWidth="0.8" />
      ) : null}

      <rect x="-7" y="-8" width="5" height="6" rx="1.2" fill="#1a2852" />
      <rect x="2" y="-8" width="5" height="6" rx="1.2" fill="#1a2852" />
      <ellipse cx="-10" cy="-1" rx="3" ry="2" fill="rgba(255,130,130,0.5)" />
      <ellipse cx="10" cy="-1" rx="3" ry="2" fill="rgba(255,130,130,0.5)" />
      <path d="M-5,4 Q0,8 5,4" stroke="#1a2852" strokeWidth="1.4" fill="none" strokeLinecap="round" />

      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,0; 0,-1.8; 0,0"
          dur="1.1s"
          repeatCount="indefinite"
        />
        <rect x="-10" y="7" width="20" height="13" rx="2" fill="rgba(242,248,255,0.96)" stroke={color} strokeWidth="1" />
        <line x1="-6" y1="11" x2="6" y2="11" stroke={color} strokeWidth="0.9" opacity="0.7" />
        <line x1="-6" y1="15" x2="3" y2="15" stroke={color} strokeWidth="0.9" opacity="0.45" />
      </g>
    </g>
  );
}

function HandoffActor({ step, reducedMotion }: { readonly step: HandoffStep; readonly reducedMotion: boolean }): React.JSX.Element {
  const path = createRoundTripPath(step);
  const begin = `${step.beginSeconds}s`;

  if (reducedMotion) {
    return <g />;
  }

  return (
    <g filter="url(#pxr-agent-handoff-glow)">
      <g opacity="0">
        <animate
          attributeName="opacity"
          values="0;1;1;1;0"
          keyTimes="0;0.08;0.50;0.86;1"
          dur={`${CYCLE_SECONDS}s`}
          begin={begin}
          repeatCount="indefinite"
        />
        <animateMotion
          path={path}
          dur={`${CYCLE_SECONDS}s`}
          begin={begin}
          repeatCount="indefinite"
          calcMode="linear"
          keyPoints="0;0;0.5;0.5;1;1"
          keyTimes="0;0.08;0.42;0.58;0.92;1"
        />

        <AgentMiniGhost agent={step.from} color={step.color} />

        <text
          x="0"
          y="28"
          textAnchor="middle"
          fontFamily='"IBM Plex Mono", monospace'
          fontSize="7"
          fill={step.color}
          letterSpacing="0.6"
        >
          {step.label} -&gt; {step.to}
        </text>
      </g>
    </g>
  );
}

export function PixelRoomHandoffPath({ decision = "HOLD", zIndex = 14 }: PixelRoomHandoffPathProps): React.JSX.Element {
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
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
        <filter id="pxr-agent-handoff-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {!isStop && HANDOFF_STEPS.map((step) => (
        <HandoffActor key={`${step.from}-${step.to}`} step={step} reducedMotion={reducedMotion} />
      ))}

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
          -- HOLD: handoff suspended --
        </text>
      )}
    </svg>
  );
}
