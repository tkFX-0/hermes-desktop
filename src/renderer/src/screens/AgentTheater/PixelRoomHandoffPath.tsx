/**
 * PixelRoomHandoffPath — display-only delivery ghost animation.
 * Route: むすび -> しずめ -> つむぎ -> しるべ -> しきしま.
 * No visible route lines, arrows, or station nodes.
 * prefers-reduced-motion: the delivery ghost remains static.
 */

import { useEffect, useState } from "react";

const W = 940;
const H = 500;

/*
 * The path still defines movement geometry, but it is not rendered.
 * keyPoints are based on approximate cumulative segment lengths:
 * むすび=0, しずめ=0.10, つむぎ=0.49, しるべ=0.59, しきしま=0.85, return=1.
 */
const DELIVERY_PATH = "M252,348 L92,358 L686,348 L848,356 L470,258 Z";
const DELIVERY_KEY_POINTS = "0;0;0.10;0.10;0.49;0.49;0.59;0.59;0.85;1";
const DELIVERY_KEY_TIMES = "0;0.07;0.15;0.22;0.51;0.58;0.67;0.74;0.93;1";

interface PixelRoomHandoffPathProps {
  readonly decision?: string;
  readonly zIndex?: number;
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
        <filter id="pxr-delivery-ghost-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {!isStop && (
        <g filter="url(#pxr-delivery-ghost-glow)">
          <animateMotion
            path={DELIVERY_PATH}
            dur="16s"
            repeatCount="indefinite"
            calcMode="linear"
            keyPoints={DELIVERY_KEY_POINTS}
            keyTimes={DELIVERY_KEY_TIMES}
            begin={reducedMotion ? "indefinite" : "0s"}
          />

          <g transform="translate(0,-24)">
            <path
              d="M0,-14 C-8,-14 -11,-8 -11,-2 L-11,5 Q-9,11 -5,7 Q-2,13 1,7 Q4,13 7,7 Q11,11 11,5 L11,-2 C11,-8 8,-14 0,-14 Z"
              fill="rgba(100,168,255,0.93)"
            />
            <ellipse cx="-2" cy="-9" rx="5" ry="4" fill="rgba(255,255,255,0.28)" />
            <rect x="-7" y="-10" width="4" height="5" rx="1" fill="#1a2852" />
            <rect x="-6.5" y="-9.5" width="1.5" height="1.5" fill="white" opacity="0.9" />
            <rect x="2" y="-10" width="4" height="5" rx="1" fill="#1a2852" />
            <rect x="2.5" y="-9.5" width="1.5" height="1.5" fill="white" opacity="0.9" />
            <ellipse cx="-9" cy="-4" rx="2.5" ry="2" fill="rgba(255,130,130,0.52)" />
            <ellipse cx="8" cy="-4" rx="2.5" ry="2" fill="rgba(255,130,130,0.52)" />
            <path d="M-4,1 Q0,5 4,1" stroke="#1a2852" strokeWidth="1.3" fill="none" strokeLinecap="round" />

            <g>
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 0,-2; 0,0"
                dur="1.6s"
                repeatCount="indefinite"
                begin={reducedMotion ? "indefinite" : "0s"}
              />
              <rect
                x="-8"
                y="5"
                width="16"
                height="11"
                rx="2"
                fill="rgba(242,248,255,0.95)"
                stroke="rgba(88,150,255,0.60)"
                strokeWidth="0.9"
              />
              <line x1="-5" y1="8.5" x2="6" y2="8.5" stroke="rgba(88,166,255,0.60)" strokeWidth="0.9" />
              <line x1="-5" y1="11.5" x2="3" y2="11.5" stroke="rgba(88,166,255,0.40)" strokeWidth="0.9" />
              <circle cx="7" cy="6" r="1.5" fill="rgba(255,220,80,0.80)" />
            </g>
          </g>
        </g>
      )}

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
