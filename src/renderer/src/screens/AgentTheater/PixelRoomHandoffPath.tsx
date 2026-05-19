/**
 * PixelRoomHandoffPath — SVG overlay showing handoff route + animated token.
 * Route: むすび → しずめ → つむぐ → しるべ → しきしま
 * Token moves along the path with station pauses.
 * prefers-reduced-motion: token is static.
 * Display-only. No execution.
 */

import { useEffect, useState } from "react";

/* ── Stage dimensions (must match PixelRoomStage) ── */
const W = 940;
const H = 500;

/* ── Handoff station positions (desk-top level in px) ── */
const STATIONS = [
  { id: "hajime",    x: 252, y: 348, color: "#3fb950", label: "① 計画する",    labelX: 220, labelY: 335 },
  { id: "shizume",   x: 92,  y: 358, color: "#f85149", label: "② 安全チェック", labelX: 18,  labelY: 345 },
  { id: "tsumugi",   x: 686, y: 348, color: "#f0883e", label: "③ 実装する",    labelX: 654, labelY: 335 },
  { id: "shirube",   x: 848, y: 356, color: "#b07fff", label: "④ 記録する",    labelX: 816, labelY: 343 },
  { id: "shikishima",x: 470, y: 258, color: "#7eb8ff", label: "⑤ 確認・GO待ち", labelX: 390, labelY: 244 },
] as const;

/* ── SVG path for animateMotion ── */
const TOKEN_PATH = `M252,348 L92,358 L686,348 L848,356 L470,258 Z`;

/* ── Path segments between stations ── */
const SEGMENTS = [
  { x1: 252, y1: 348, x2: 92,  y2: 358, color: "#3fb950" },
  { x1: 92,  y1: 358, x2: 686, y2: 348, color: "#f0883e" },
  { x1: 686, y1: 348, x2: 848, y2: 356, color: "#b07fff" },
  { x1: 848, y1: 356, x2: 470, y2: 258, color: "#7eb8ff" },
];

interface PixelRoomHandoffPathProps {
  readonly decision?: string;
  readonly zIndex?: number;
}

export function PixelRoomHandoffPath({ decision = "HOLD", zIndex = 14 }: PixelRoomHandoffPathProps): React.JSX.Element {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (): void => setReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const isStop = decision === "STOP";

  return (
    <svg
      aria-hidden
      style={{
        position: "absolute",
        top: 0, left: 0,
        width: W, height: H,
        zIndex,
        pointerEvents: "none",
        overflow: "visible",
      }}
      viewBox={`0 0 ${W} ${H}`}
    >
      <defs>
        {/* Glow filter for token */}
        <filter id="pxr-token-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Path segment lines ── */}
      {SEGMENTS.map((seg, i) => (
        <g key={i}>
          {/* Shadow line */}
          <line
            x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2}
            stroke="rgba(0,0,0,0.4)" strokeWidth="3"
            strokeDasharray="6 5"
          />
          {/* Colored dashed line */}
          <line
            x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2}
            stroke={isStop ? "#f85149" : seg.color}
            strokeWidth="1.5"
            strokeOpacity="0.35"
            strokeDasharray="6 5"
          />
        </g>
      ))}

      {/* ── Arrowheads between stations ── */}
      {SEGMENTS.map((seg, i) => {
        const angle = Math.atan2(seg.y2 - seg.y1, seg.x2 - seg.x1);
        const midX = (seg.x1 + seg.x2) / 2;
        const midY = (seg.y1 + seg.y2) / 2;
        const deg = angle * (180 / Math.PI);
        return (
          <g key={`arrow-${i}`} transform={`translate(${midX},${midY}) rotate(${deg})`}>
            <polygon
              points="-5,-3 5,0 -5,3"
              fill={isStop ? "#f85149" : seg.color}
              fillOpacity="0.55"
            />
          </g>
        );
      })}

      {/* ── Station node circles ── */}
      {STATIONS.map((s) => (
        <g key={s.id}>
          {/* Outer ring */}
          <circle cx={s.x} cy={s.y} r="8"
            fill="rgba(1,2,10,0.7)"
            stroke={isStop ? "#f85149" : s.color}
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />
          {/* Inner dot */}
          <circle cx={s.x} cy={s.y} r="3"
            fill={isStop ? "#f85149" : s.color}
            fillOpacity="0.7"
          />
          {/* Station workflow label */}
          <text
            x={s.labelX} y={s.labelY}
            fontFamily='"IBM Plex Mono", monospace'
            fontSize="7.5"
            fill={isStop ? "#f85149" : s.color}
            fillOpacity="0.65"
          >
            {s.label}
          </text>
        </g>
      ))}

      {/* ── Animated handoff token ── */}
      {!isStop && (
        <g filter="url(#pxr-token-glow)">
          {/* Token: small glowing document card */}
          <rect x="-9" y="-7" width="18" height="14" rx="3"
            fill="rgba(88,166,255,0.85)"
            stroke="rgba(200,230,255,0.9)"
            strokeWidth="1"
          >
            <animateMotion
              path={TOKEN_PATH}
              dur="14s"
              repeatCount="indefinite"
              calcMode="linear"
              keyPoints="0;0;0.22;0.22;0.44;0.44;0.66;0.66;0.88;1"
              keyTimes="0;0.07;0.19;0.26;0.38;0.45;0.57;0.64;0.76;1"
              begin={reducedMotion ? "indefinite" : "0s"}
            />
          </rect>
          {/* Doc lines inside token */}
          <line x1="-5" y1="-2" x2="5" y2="-2" stroke="rgba(255,255,255,0.8)" strokeWidth="1">
            <animateMotion
              path={TOKEN_PATH}
              dur="14s"
              repeatCount="indefinite"
              calcMode="linear"
              keyPoints="0;0;0.22;0.22;0.44;0.44;0.66;0.66;0.88;1"
              keyTimes="0;0.07;0.19;0.26;0.38;0.45;0.57;0.64;0.76;1"
              begin={reducedMotion ? "indefinite" : "0s"}
            />
          </line>
          <line x1="-5" y1="1" x2="3" y2="1" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8">
            <animateMotion
              path={TOKEN_PATH}
              dur="14s"
              repeatCount="indefinite"
              calcMode="linear"
              keyPoints="0;0;0.22;0.22;0.44;0.44;0.66;0.66;0.88;1"
              keyTimes="0;0.07;0.19;0.26;0.38;0.45;0.57;0.64;0.76;1"
              begin={reducedMotion ? "indefinite" : "0s"}
            />
          </line>
          <line x1="-5" y1="4" x2="4" y2="4" stroke="rgba(255,255,255,0.5)" strokeWidth="0.7">
            <animateMotion
              path={TOKEN_PATH}
              dur="14s"
              repeatCount="indefinite"
              calcMode="linear"
              keyPoints="0;0;0.22;0.22;0.44;0.44;0.66;0.66;0.88;1"
              keyTimes="0;0.07;0.19;0.26;0.38;0.45;0.57;0.64;0.76;1"
              begin={reducedMotion ? "indefinite" : "0s"}
            />
          </line>
        </g>
      )}

      {/* ── STOP overlay: all paths turn red ── */}
      {isStop && (
        <text x={W/2} y={H*0.55}
          textAnchor="middle"
          fontFamily='"IBM Plex Mono", monospace'
          fontSize="11"
          fill="rgba(248,81,73,0.4)"
          letterSpacing="3"
        >
          ── HOLD: handoff suspended ──
        </text>
      )}
    </svg>
  );
}
