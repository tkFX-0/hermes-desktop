/**
 * PixelGhostSprite — kawaii ghost characters for Pixel Room.
 * PXR-05E fidelity pass v4 — "compact-cute" design matching the approved sheet:
 *   • body: near-circle (44×44px) + short wispy tail
 *   • eyes: SMALL pixel squares (8×10px) — not dominant
 *   • cheeks: LARGE ovals (rx=7.5 ry=5.5) — main cuteness signal
 *   • smile: wide happy arc (span 26px)
 *   • accessories: bigger, clearer
 * ViewBox 0 0 64 80. Inline SVG only. No image assets.
 *
 * Character reference (design sheet #1-#10):
 *   しきしま #1/#6 : headset + mic + blue flag
 *   しずめ   #2/#7 : flat cap + vest + HOLD sign
 *   はじめ   #3/#8 : green map spread + "?" bubble
 *   つむぎ   #4/#9 : yellow hardhat + toolbox + wrench
 *   しるべ   #5/#10: headphones + open logbook + pen
 */

import type { AgentId } from "../../types/agent-theater-types";

interface PixelGhostSpriteProps {
  readonly agentId: AgentId;
  readonly size?: number;
}

/* ── Palette ── */
const WHITE = "#f0f4ff";
const SHADOW = "#becce8";
const INK = "#0e1e4a";
const BLUSH = "#ff9090";
const MONO = '"IBM Plex Mono", monospace';

/*
 * Rounder body path — near-circle 44×44px (x=10-54, y=8-52) + 3 short bumps.
 * Wider than the previous path for more "pudgy mascot" feel.
 */
const BODY_PATH =
  "M32,8 C16,8 10,17 10,31 C10,45 17,52 23,52 Q26,61 29,54 Q32,64 35,54 Q38,61 41,52 C47,52 54,45 54,31 C54,17 48,8 32,8 Z";

/* ── Shared body ── */
function Body({ edge }: { readonly edge: string }): React.JSX.Element {
  return (
    <>
      {/* Floor shadow */}
      <ellipse cx="33" cy="70" rx="19" ry="4" fill="rgba(0,0,0,0.20)" />
      {/* Drop shadow */}
      <path
        d={BODY_PATH}
        fill={SHADOW}
        transform="translate(1.4,1.6)"
        opacity="0.80"
      />
      {/* Main white body */}
      <path
        d={BODY_PATH}
        fill={WHITE}
        stroke={edge}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* Upper-left gloss arc — three-dimensional round feel */}
      <path
        d="M19,13 C13,19 11,29 13,38"
        stroke="rgba(255,255,255,0.78)"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
    </>
  );
}

/*
 * Compact-cute face.
 *   smile  : open eyes (8×10px square) — small, not dominant
 *   focus  : open eyes, flatter mouth (determined)
 *   calm   : closed gentle arcs (relaxed / transcribing)
 * Cheeks are always the largest face element.
 */
function Face({
  mood = "smile",
}: {
  readonly mood?: "smile" | "focus" | "calm";
}): React.JSX.Element {
  return (
    <>
      {/* Eyes */}
      {mood === "calm" ? (
        <>
          <path
            d="M20,27 Q25,23 30,27"
            stroke={INK}
            strokeWidth="3.2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M37,27 Q42,23 47,27"
            stroke={INK}
            strokeWidth="3.2"
            fill="none"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          {/* Left eye — compact pixel square */}
          <rect x="20" y="22" width="8" height="10" rx="2" fill={INK} />
          <rect
            x="21"
            y="23"
            width="2.5"
            height="2.5"
            rx="0.4"
            fill="white"
            opacity="0.92"
          />
          {/* Right eye */}
          <rect x="37" y="22" width="8" height="10" rx="2" fill={INK} />
          <rect
            x="38"
            y="23"
            width="2.5"
            height="2.5"
            rx="0.4"
            fill="white"
            opacity="0.92"
          />
        </>
      )}
      {/* Cheeks — large, warm pink, the "cuteness" anchor */}
      <ellipse cx="13" cy="33" rx="7.5" ry="5.5" fill={BLUSH} opacity="0.62" />
      <ellipse cx="51" cy="33" rx="7.5" ry="5.5" fill={BLUSH} opacity="0.62" />
      {/* Smile */}
      {mood === "focus" ? (
        <path
          d="M22,37 Q32,44 42,37"
          stroke={INK}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M19,37 Q32,50 45,37"
          stroke={INK}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      )}
    </>
  );
}

/*
 * Flag on a pole — 20×14px rect, 6.5px bold text.
 * pole goes from (x,y) downward 36px; flag extends rightward from x+2.
 */
function MiniFlag({
  x,
  y,
  color,
  text,
  pole = "#263554",
}: {
  readonly x: number;
  readonly y: number;
  readonly color: string;
  readonly text: string;
  readonly pole?: string;
}): React.JSX.Element {
  return (
    <>
      <rect x={x} y={y} width="2.5" height="36" rx="1" fill={pole} />
      <rect x={x + 2} y={y + 1} width="20" height="14" rx="2" fill={color} />
      <text
        x={x + 12}
        y={y + 12}
        textAnchor="middle"
        fontFamily={MONO}
        fontSize="6.5"
        fill="white"
        fontWeight="900"
      >
        {text}
      </text>
    </>
  );
}

/* ──────────────────────────────────────────────────────────────────
   1. しきしま — Commander
   Navy headset (thick band + large oval pads) + mic boom + blue "しき" flag.
   Alert, monitoring, awaiting human GO.
────────────────────────────────────────────────────────────────── */
function ShikishimaSprite(): React.JSX.Element {
  return (
    <g>
      <Body edge="#4f8dff" />
      {/* Headset band — thick arc high over head */}
      <path
        d="M10,30 Q13,6 33,6 Q52,6 54,30"
        stroke="#142858"
        strokeWidth="5.5"
        fill="none"
        strokeLinecap="round"
      />
      <Face />
      {/* Left earpad — large oval on top of face edge */}
      <ellipse cx="9" cy="31" rx="9" ry="11" fill="#142858" />
      <ellipse cx="9" cy="31" rx="5.2" ry="6.5" fill="#2e4898" />
      {/* Right earpad */}
      <ellipse cx="55" cy="31" rx="9" ry="11" fill="#142858" />
      <ellipse cx="55" cy="31" rx="5.2" ry="6.5" fill="#2e4898" />
      {/* Mic boom */}
      <path
        d="M4,38 Q2,54 15,58"
        stroke="#142858"
        strokeWidth="2.8"
        fill="none"
        strokeLinecap="round"
      />
      <rect x="12" y="56" width="11" height="7" rx="3.5" fill="#142858" />
      {/* Blue "しき" flag (right, past earpad) */}
      <MiniFlag x={55} y={8} color="#1f57df" text="しき" />
    </g>
  );
}

/* ──────────────────────────────────────────────────────────────────
   2. しずめ — Safety Gate
   Dark flat officer cap + yellow vest stripes + whistle + red HOLD sign.
   Determined, safety-checking (focus mood).
────────────────────────────────────────────────────────────────── */
function ShizumeSprite(): React.JSX.Element {
  return (
    <g>
      <Body edge="#f0b429" />
      {/* Flat cap dome — dark navy */}
      <path d="M11,20 Q31,2 53,20" fill="#172448" />
      {/* Cap dome highlight */}
      <path d="M15,16 Q32,5 49,16" fill="#263d78" />
      {/* Cap brim — wide, clearly indoor officer cap */}
      <rect x="8" y="20" width="48" height="7" rx="3" fill="#172448" />
      {/* Yellow safety vest — 2 bold horizontal stripes */}
      <rect x="13" y="44" width="38" height="6.5" rx="2.5" fill="#f8bf1a" />
      <rect x="13" y="52" width="38" height="6" rx="2.5" fill="#f8bf1a" />
      {/* Vest diagonal accent stripes */}
      <path
        d="M15,41 L24,59 M49,41 L40,59"
        stroke="#f8bf1a"
        strokeWidth="5.5"
        strokeLinecap="round"
        opacity="0.52"
      />
      <Face mood="focus" />
      {/* Whistle — large gold circle */}
      <circle
        cx="32"
        cy="45"
        r="6"
        fill="#f8bf1a"
        stroke="#9d6700"
        strokeWidth="1.6"
      />
      <circle cx="32" cy="45" r="2.8" fill="#ffe889" />
      {/* Whistle cord */}
      <path
        d="M30,43 Q25,38 22,34"
        stroke="#172448"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Red HOLD sign flag */}
      <MiniFlag x={55} y={12} color="#dc1f1f" text="HOLD" pole="#552222" />
    </g>
  );
}

/* ──────────────────────────────────────────────────────────────────
   3. はじめ / むすび — Planning
   No hat. Large "?" thought bubble + green terrain map spread wide.
   Character is actively studying / planning.
────────────────────────────────────────────────────────────────── */
function HajimeSprite(): React.JSX.Element {
  return (
    <g>
      <Body edge="#5bbf6a" />
      {/* "?" thought bubble — large, upper right */}
      <circle
        cx="50"
        cy="11"
        r="11"
        fill="rgba(222,232,255,0.90)"
        stroke="#b9caff"
        strokeWidth="1.4"
      />
      <circle
        cx="43"
        cy="22"
        r="5"
        fill="rgba(222,232,255,0.90)"
        stroke="#b9caff"
        strokeWidth="1.1"
      />
      <circle
        cx="39"
        cy="29"
        r="3"
        fill="rgba(222,232,255,0.90)"
        stroke="#b9caff"
        strokeWidth="0.9"
      />
      <text
        x="50"
        y="16"
        textAnchor="middle"
        fontFamily={MONO}
        fontSize="13"
        fill={INK}
        fontWeight="900"
      >
        ?
      </text>
      <Face />
      {/* Green terrain map — full-width, character spreads it open */}
      <path
        d="M6,43 L20,37 L37,43 L54,37 L60,43 L60,62 L46,68 L29,62 L13,68 L6,62 Z"
        fill="#c8d96a"
        stroke="#4d8b35"
        strokeWidth="1.8"
      />
      {/* Map fold lines */}
      <path
        d="M20,37 V61 M37,43 V67 M54,37 V61"
        stroke="#7da64a"
        strokeWidth="1.3"
      />
      {/* Route path */}
      <path
        d="M10,57 Q21,50 33,55 Q44,61 54,51"
        stroke="#2f7f44"
        strokeWidth="2.2"
        fill="none"
        strokeDasharray="4 2.5"
      />
      {/* Route dots — large red markers */}
      <circle cx="13" cy="56" r="4" fill="#e03838" />
      <circle cx="50" cy="52" r="3.5" fill="#e03838" />
    </g>
  );
}

/* ──────────────────────────────────────────────────────────────────
   4. つむぎ — Developer / Builder
   Yellow hard hat + brown toolbox (right) + wrench (left).
   Ready to build, determined (focus mood).
────────────────────────────────────────────────────────────────── */
function TsumugiSprite(): React.JSX.Element {
  return (
    <g>
      <Body edge="#f0a020" />
      {/* Hard hat dome */}
      <path
        d="M12,22 Q15,3 32,3 Q49,3 52,22"
        fill="#f5bd12"
        stroke="#b87500"
        strokeWidth="1.5"
      />
      {/* Hat dome highlight */}
      <path
        d="M19,5 Q32,2 45,5 Q50,10 50,19 Q43,13 32,13 Q21,13 14,19 Q14,10 19,5"
        fill="rgba(255,245,130,0.45)"
      />
      {/* Hat brim */}
      <rect x="8" y="22" width="48" height="7" rx="3" fill="#d98a00" />
      {/* Dome vertical ribs */}
      <path
        d="M22,6 V22 M32,3 V22 M42,6 V22"
        stroke="#b87500"
        strokeWidth="2"
        opacity="0.60"
      />
      <Face mood="focus" />
      {/* Toolbox — large, right side */}
      <rect x="39" y="45" width="22" height="17" rx="3" fill="#7a4820" />
      <rect x="39" y="43" width="22" height="8" rx="2.5" fill="#936130" />
      {/* Handle */}
      <path
        d="M44,43 Q50,35 56,43"
        stroke="#936130"
        strokeWidth="4"
        fill="none"
      />
      {/* Clasps */}
      <rect x="42" y="55" width="6" height="4.5" rx="1.5" fill="#d9a049" />
      <rect x="54" y="55" width="6" height="4.5" rx="1.5" fill="#d9a049" />
      {/* Wrench — left side */}
      <path
        d="M4,44 L19,29"
        stroke="#56616f"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path d="M17,25 Q23,20 29,23 Q26,30 19,29 Z" fill="#56616f" />
    </g>
  );
}

/* ──────────────────────────────────────────────────────────────────
   5. しるべ — Record Keeper
   Dark headphones + large open logbook (held open) + pen.
   Calm, transcribing (calm mood with gentle closed-arc eyes).
────────────────────────────────────────────────────────────────── */
function ShirubeSprite(): React.JSX.Element {
  return (
    <g>
      <Body edge="#6c82ff" />
      {/* Headphone band — same style as しきしま, darker purple */}
      <path
        d="M10,30 Q13,6 33,6 Q52,6 54,30"
        stroke="#18224d"
        strokeWidth="5.5"
        fill="none"
        strokeLinecap="round"
      />
      <Face mood="calm" />
      {/* Left earpad — slightly larger than しきしま for distinction */}
      <ellipse cx="9" cy="31" rx="9" ry="12" fill="#18224d" />
      <ellipse cx="9" cy="31" rx="5.2" ry="7.5" fill="#4557b8" />
      {/* Right earpad */}
      <ellipse cx="55" cy="31" rx="9" ry="12" fill="#18224d" />
      <ellipse cx="55" cy="31" rx="5.2" ry="7.5" fill="#4557b8" />
      {/* Open logbook — large, held open across body */}
      {/* Spine */}
      <rect x="29" y="45" width="6" height="22" rx="2" fill="#18224d" />
      {/* Left page */}
      <rect x="7" y="46" width="22" height="20" rx="2.5" fill="#f7f1e7" />
      <line
        x1="10"
        y1="52"
        x2="27"
        y2="52"
        stroke="rgba(50,50,90,0.52)"
        strokeWidth="1.5"
      />
      <line
        x1="10"
        y1="58"
        x2="27"
        y2="58"
        stroke="rgba(50,50,90,0.52)"
        strokeWidth="1.5"
      />
      <line
        x1="10"
        y1="64"
        x2="20"
        y2="64"
        stroke="rgba(50,50,90,0.38)"
        strokeWidth="1.2"
      />
      {/* Right page */}
      <rect x="35" y="46" width="22" height="20" rx="2.5" fill="#f7f1e7" />
      <line
        x1="38"
        y1="52"
        x2="55"
        y2="52"
        stroke="rgba(50,50,90,0.52)"
        strokeWidth="1.5"
      />
      <line
        x1="38"
        y1="58"
        x2="55"
        y2="58"
        stroke="rgba(50,50,90,0.52)"
        strokeWidth="1.5"
      />
      <line
        x1="38"
        y1="64"
        x2="50"
        y2="64"
        stroke="rgba(50,50,90,0.38)"
        strokeWidth="1.2"
      />
      {/* Pen — writing on right page */}
      <path d="M47,61 L54,53 L56,55 L49,63 Z" fill="#2a2060" />
      <circle cx="47.5" cy="61.5" r="2.2" fill="#2a2060" />
      {/* Purple "しる" flag (right side) */}
      <MiniFlag x={55} y={8} color="#7040c0" text="しる" pole="#40206a" />
    </g>
  );
}

/* ── Sprite map ── */
const SPRITE_MAP: Record<AgentId, () => React.JSX.Element> = {
  shikishima: ShikishimaSprite,
  shizume: ShizumeSprite,
  hajime: HajimeSprite,
  tsumugi: TsumugiSprite,
  shirube: ShirubeSprite,
};

export function PixelGhostSprite({
  agentId,
  size = 64,
}: PixelGhostSpriteProps): React.JSX.Element {
  const Sprite = SPRITE_MAP[agentId];
  return (
    <svg
      viewBox="0 0 64 80"
      width={size}
      height={Math.round(size * 1.25)}
      aria-hidden
      style={{ display: "block", overflow: "visible" }}
    >
      <Sprite />
    </svg>
  );
}
