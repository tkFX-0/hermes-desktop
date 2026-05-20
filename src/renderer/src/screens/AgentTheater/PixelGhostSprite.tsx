/**
 * PixelGhostSprite — kawaii ghost characters for Pixel Room.
 * PXR-05E fidelity pass v5 — "pudgy mascot" design:
 *   • body: wider near-circle 48×44px — slightly squashed for pudgy feel
 *   • eyes: compact 8×10px squares, wider gap between them
 *   • cheeks: pushed wide (cx=11/53) — dominant "round face" signal
 *   • smile: wide happy arc
 *   • accessories: further refined per-character
 * ViewBox 0 0 64 80. Inline SVG only. No image assets.
 *
 * Character reference (design sheet #1–#10):
 *   しきしま #1/#6 : headset + mic boom + blue "しき" flag
 *   しずめ   #2/#7 : dark flat officer cap + yellow vest + red HOLD sign
 *   はじめ   #3/#8 : green terrain map spread wide + "?" thought bubble
 *   つむぎ   #4/#9 : yellow hard hat + brown toolbox + wrench
 *   しるべ   #5/#10: dark headphones + open logbook + pen
 */

import type { AgentId } from "../../types/agent-theater-types";

interface PixelGhostSpriteProps {
  readonly agentId: AgentId;
  readonly size?: number;
}

/* ── Palette ── */
const WHITE = "#f0f4ff";
const SHADOW = "#bccae6";
const INK = "#0e1e4a";
const BLUSH = "#ff9090";
const MONO = '"IBM Plex Mono", monospace';

/*
 * Pudgy body path — 48px wide × 44px tall near-circle + 3 bumps.
 * Wider than tall → "squashed ball" feel, matching the reference sprites.
 * x=8–56  y=8–52 (solid body)  y=52–65 (bumps)
 */
const BODY_PATH =
  "M32,8 C14,8 8,17 8,31 C8,45 15,52 21,52 Q24,62 28,54 Q32,66 36,54 Q40,62 43,52 C49,52 56,45 56,31 C56,17 50,8 32,8 Z";

/* ── Shared body ── */
function Body({ edge }: { readonly edge: string }): React.JSX.Element {
  return (
    <>
      {/* Floor shadow */}
      <ellipse cx="33" cy="72" rx="20" ry="4.5" fill="rgba(0,0,0,0.18)" />
      {/* Drop shadow */}
      <path
        d={BODY_PATH}
        fill={SHADOW}
        transform="translate(1.4,1.6)"
        opacity="0.78"
      />
      {/* Main white body */}
      <path
        d={BODY_PATH}
        fill={WHITE}
        stroke={edge}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      {/* Upper-left gloss arc */}
      <path
        d="M18,13 C12,20 10,30 12,40"
        stroke="rgba(255,255,255,0.76)"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </>
  );
}

/*
 * Compact-cute face — cheeks are the widest / most prominent element.
 *   smile : open pixel eyes, wide happy arc
 *   focus : open eyes, flatter mouth (determined)
 *   calm  : closed arc eyes, gentle smile (relaxed)
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
            d="M19,27 Q24,23 29,27"
            stroke={INK}
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M36,27 Q41,23 46,27"
            stroke={INK}
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          {/* Left eye — compact square, wider gap from right eye */}
          <rect x="18" y="22" width="9" height="11" rx="2.2" fill={INK} />
          <rect
            x="19"
            y="23"
            width="2.8"
            height="2.8"
            rx="0.5"
            fill="white"
            opacity="0.92"
          />
          {/* Right eye */}
          <rect x="37" y="22" width="9" height="11" rx="2.2" fill={INK} />
          <rect
            x="38"
            y="23"
            width="2.8"
            height="2.8"
            rx="0.5"
            fill="white"
            opacity="0.92"
          />
        </>
      )}
      {/* Cheeks — pushed wide, the defining "round face" signal */}
      <ellipse cx="11" cy="33" rx="7.5" ry="5.5" fill={BLUSH} opacity="0.60" />
      <ellipse cx="53" cy="33" rx="7.5" ry="5.5" fill={BLUSH} opacity="0.60" />
      {/* Smile */}
      {mood === "focus" ? (
        <path
          d="M22,37 Q32,44 42,37"
          stroke={INK}
          strokeWidth="2.6"
          fill="none"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M19,37 Q32,51 45,37"
          stroke={INK}
          strokeWidth="2.6"
          fill="none"
          strokeLinecap="round"
        />
      )}
    </>
  );
}

/*
 * Flag on a pole — 20×14px rect, 6.5px bold text.
 * Positioned past the body/earpad edge (overflow:visible renders it).
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
   Navy headset (thick band + large oval pads + mic) + blue "しき" flag.
   Flag placed past the right earpad (x=60) — clearly visible.
────────────────────────────────────────────────────────────────── */
function ShikishimaSprite(): React.JSX.Element {
  return (
    <g>
      <Body edge="#4f8dff" />
      {/* Headset band — high arc over the wider head */}
      <path
        d="M8,31 Q12,5 33,5 Q53,5 56,31"
        stroke="#142858"
        strokeWidth="5.5"
        fill="none"
        strokeLinecap="round"
      />
      <Face />
      {/* Left earpad — large oval */}
      <ellipse cx="7" cy="31" rx="9.5" ry="12" fill="#142858" />
      <ellipse cx="7" cy="31" rx="5.5" ry="7.5" fill="#2e4898" />
      {/* Right earpad */}
      <ellipse cx="57" cy="31" rx="9.5" ry="12" fill="#142858" />
      <ellipse cx="57" cy="31" rx="5.5" ry="7.5" fill="#2e4898" />
      {/* Mic boom + capsule */}
      <path
        d="M3,38 Q1,54 15,59"
        stroke="#142858"
        strokeWidth="2.8"
        fill="none"
        strokeLinecap="round"
      />
      <rect x="12" y="57" width="12" height="7.5" rx="3.5" fill="#142858" />
      {/* Blue "しき" flag — past right earpad */}
      <MiniFlag x={60} y={7} color="#1f57df" text="しき" />
    </g>
  );
}

/* ──────────────────────────────────────────────────────────────────
   2. しずめ — Safety Gate
   Dark flat officer cap + bold yellow vest + large whistle + HOLD sign.
   Focus mood (キリッとした表情).
────────────────────────────────────────────────────────────────── */
function ShizumeSprite(): React.JSX.Element {
  return (
    <g>
      <Body edge="#f0b429" />
      {/* Flat cap — dome */}
      <path d="M10,20 Q32,1 54,20" fill="#172448" />
      {/* Cap dome highlight */}
      <path d="M14,16 Q32,4 50,16" fill="#263d78" />
      {/* Cap brim — wide, officer style */}
      <rect x="7" y="20" width="50" height="7" rx="3" fill="#172448" />
      {/* Yellow safety vest — 2 bold horizontal stripes */}
      <rect x="12" y="43" width="40" height="7" rx="3" fill="#f8bf1a" />
      <rect x="12" y="52" width="40" height="6" rx="3" fill="#f8bf1a" />
      {/* Vest diagonal accent stripes */}
      <path
        d="M14,40 L23,60 M50,40 L41,60"
        stroke="#f8bf1a"
        strokeWidth="5.5"
        strokeLinecap="round"
        opacity="0.50"
      />
      <Face mood="focus" />
      {/* Whistle — large, prominent gold */}
      <circle
        cx="32"
        cy="44"
        r="6.5"
        fill="#f8bf1a"
        stroke="#9d6700"
        strokeWidth="1.8"
      />
      <circle cx="32" cy="44" r="3" fill="#ffe889" />
      {/* Whistle cord */}
      <path
        d="M29,42 Q24,37 21,32"
        stroke="#172448"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Red HOLD sign flag */}
      <MiniFlag x={57} y={12} color="#dc1f1f" text="HOLD" pole="#552222" />
    </g>
  );
}

/* ──────────────────────────────────────────────────────────────────
   3. はじめ / むすび — Planning
   Large "?" thought bubble + green terrain map spread wide.
   Character actively studies the map (map covers lower body).
────────────────────────────────────────────────────────────────── */
function HajimeSprite(): React.JSX.Element {
  return (
    <g>
      <Body edge="#5bbf6a" />
      {/* "?" thought bubble — upper right, large */}
      <circle
        cx="51"
        cy="11"
        r="12"
        fill="rgba(220,232,255,0.90)"
        stroke="#b9caff"
        strokeWidth="1.5"
      />
      <circle
        cx="43"
        cy="23"
        r="5.5"
        fill="rgba(220,232,255,0.90)"
        stroke="#b9caff"
        strokeWidth="1.2"
      />
      <circle
        cx="39"
        cy="30"
        r="3.2"
        fill="rgba(220,232,255,0.90)"
        stroke="#b9caff"
        strokeWidth="1"
      />
      <text
        x="51"
        y="17"
        textAnchor="middle"
        fontFamily={MONO}
        fontSize="14"
        fill={INK}
        fontWeight="900"
      >
        ?
      </text>
      <Face />
      {/* Green terrain map — full-width, character spreads it open */}
      <path
        d="M5,43 L19,37 L37,43 L55,37 L61,43 L61,63 L47,69 L29,63 L13,69 L5,63 Z"
        fill="#c8d96a"
        stroke="#4d8b35"
        strokeWidth="1.9"
      />
      {/* Map fold lines */}
      <path
        d="M19,37 V62 M37,43 V68 M55,37 V62"
        stroke="#7da64a"
        strokeWidth="1.4"
      />
      {/* Route path */}
      <path
        d="M9,58 Q20,51 32,56 Q43,62 54,52"
        stroke="#2f7f44"
        strokeWidth="2.4"
        fill="none"
        strokeDasharray="4 2.5"
      />
      {/* Route dots — large red markers */}
      <circle cx="12" cy="57" r="4.5" fill="#e03838" />
      <circle cx="51" cy="53" r="4" fill="#e03838" />
    </g>
  );
}

/* ──────────────────────────────────────────────────────────────────
   4. つむぎ — Developer / Builder
   Bright yellow hard hat + brown toolbox + wrench.
   Focus mood (やる気).
────────────────────────────────────────────────────────────────── */
function TsumugiSprite(): React.JSX.Element {
  return (
    <g>
      <Body edge="#f0a020" />
      {/* Hard hat dome */}
      <path
        d="M11,22 Q14,2 32,2 Q50,2 53,22"
        fill="#f5bd12"
        stroke="#b87500"
        strokeWidth="1.6"
      />
      {/* Dome highlight — shiny */}
      <path
        d="M18,4 Q32,1 46,4 Q51,9 51,19 Q44,12 32,12 Q20,12 13,19 Q13,9 18,4"
        fill="rgba(255,248,140,0.52)"
      />
      {/* Hat brim */}
      <rect x="7" y="22" width="50" height="7" rx="3" fill="#d98a00" />
      {/* Dome vertical ribs */}
      <path
        d="M21,5 V22 M32,2 V22 M43,5 V22"
        stroke="#b87500"
        strokeWidth="2"
        opacity="0.58"
      />
      <Face mood="focus" />
      {/* Toolbox — large, right side */}
      <rect x="38" y="45" width="23" height="18" rx="3" fill="#7a4820" />
      <rect x="38" y="43" width="23" height="8.5" rx="2.5" fill="#936130" />
      {/* Handle */}
      <path
        d="M43,43 Q49.5,35 56,43"
        stroke="#936130"
        strokeWidth="4"
        fill="none"
      />
      {/* Clasps */}
      <rect x="41" y="56" width="6.5" height="4.5" rx="1.5" fill="#d9a049" />
      <rect x="53" y="56" width="6.5" height="4.5" rx="1.5" fill="#d9a049" />
      {/* Wrench — left side */}
      <path
        d="M3,43 L19,28"
        stroke="#56616f"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      <path d="M17,24 Q24,19 30,22 Q27,30 19,28 Z" fill="#56616f" />
    </g>
  );
}

/* ──────────────────────────────────────────────────────────────────
   5. しるべ — Record Keeper
   Dark headphones (larger pads than しきしま) + wide open logbook + pen.
   Calm mood (穏やかな記録係).  Headphone pads are taller (ry=13) for distinction.
────────────────────────────────────────────────────────────────── */
function ShirubeSprite(): React.JSX.Element {
  return (
    <g>
      <Body edge="#6c82ff" />
      {/* Headphone band — same arc as しきしま, distinctly purple */}
      <path
        d="M8,31 Q12,5 33,5 Q53,5 56,31"
        stroke="#18224d"
        strokeWidth="5.5"
        fill="none"
        strokeLinecap="round"
      />
      <Face mood="calm" />
      {/* Left earpad — taller than しきしま (ry=13 vs 12) */}
      <ellipse cx="7" cy="31" rx="9.5" ry="13" fill="#18224d" />
      <ellipse cx="7" cy="31" rx="5.5" ry="8.5" fill="#4557b8" />
      {/* Right earpad */}
      <ellipse cx="57" cy="31" rx="9.5" ry="13" fill="#18224d" />
      <ellipse cx="57" cy="31" rx="5.5" ry="8.5" fill="#4557b8" />
      {/* Open logbook — wide, held open */}
      {/* Spine */}
      <rect x="28" y="45" width="8" height="23" rx="2.5" fill="#18224d" />
      {/* Left page */}
      <rect x="5" y="46" width="23" height="21" rx="2.5" fill="#f7f1e7" />
      <line
        x1="8"
        y1="52"
        x2="26"
        y2="52"
        stroke="rgba(50,50,90,0.52)"
        strokeWidth="1.5"
      />
      <line
        x1="8"
        y1="58"
        x2="26"
        y2="58"
        stroke="rgba(50,50,90,0.52)"
        strokeWidth="1.5"
      />
      <line
        x1="8"
        y1="64"
        x2="19"
        y2="64"
        stroke="rgba(50,50,90,0.38)"
        strokeWidth="1.2"
      />
      {/* Right page */}
      <rect x="36" y="46" width="23" height="21" rx="2.5" fill="#f7f1e7" />
      <line
        x1="39"
        y1="52"
        x2="57"
        y2="52"
        stroke="rgba(50,50,90,0.52)"
        strokeWidth="1.5"
      />
      <line
        x1="39"
        y1="58"
        x2="57"
        y2="58"
        stroke="rgba(50,50,90,0.52)"
        strokeWidth="1.5"
      />
      <line
        x1="39"
        y1="64"
        x2="51"
        y2="64"
        stroke="rgba(50,50,90,0.38)"
        strokeWidth="1.2"
      />
      {/* Pen — writing on right page */}
      <path d="M48,62 L55,53 L57,55 L50,64 Z" fill="#2a2060" />
      <circle cx="48.5" cy="62.5" r="2.4" fill="#2a2060" />
      {/* Purple "しる" flag — past right earpad */}
      <MiniFlag x={60} y={7} color="#7040c0" text="しる" pole="#40206a" />
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
