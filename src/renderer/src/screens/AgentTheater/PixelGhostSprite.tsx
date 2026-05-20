/**
 * PixelGhostSprite — kawaii ghost characters for Pixel Room.
 * Design reference: Shikishima character sheet (approved visual spec, image #8/#9).
 * PNG未使用 — inline SVG only. Display-only. No image assets.
 * ViewBox 0 0 64 80.
 *
 * Character summary:
 *   しきしま : navy headset + mic boom + blue "しき" flag
 *   しずめ   : dark flat cap (NOT yellow hardhat) + yellow vest + red HOLD sign
 *   はじめ   : no hat + green terrain map + "?" thought bubble
 *   つむぎ   : yellow hard hat + brown toolbox + wrench
 *   しるべ   : dark headphones + open logbook + pen
 */

import type { AgentId } from "../../types/agent-theater-types";

interface PixelGhostSpriteProps {
  readonly agentId: AgentId;
  readonly size?: number;
}

/* ── Palette ── */
const WHITE = "#f6fbff";
const SHADOW = "#c5d8ff";
const INK = "#102052";
const BLUSH = "#ff9090";
const MONO = '"IBM Plex Mono", monospace';

/*
 * Shared body path (64×80 viewBox).
 * Round on top (y=9), 3-bump ghost tail at bottom (~y=63).
 * Width: x=10 to x=56.
 */
const BODY_PATH =
  "M32,9 C18,9 10,19 10,34 C10,45 15,53 22,54 Q25,62 29,55 Q32,63 35,55 Q39,62 42,54 C50,53 56,45 56,34 C56,19 46,9 32,9 Z";

/* ── Shared body component ── */
function Body({ edge }: { readonly edge: string }): React.JSX.Element {
  return (
    <>
      {/* Floor shadow */}
      <ellipse cx="34" cy="70" rx="20" ry="4.5" fill="rgba(0,0,0,0.18)" />
      {/* Drop shadow */}
      <path
        d={BODY_PATH}
        fill={SHADOW}
        transform="translate(1.6,2)"
        opacity="0.82"
      />
      {/* Main white body */}
      <path
        d={BODY_PATH}
        fill={WHITE}
        stroke={edge}
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      {/* Upper-left highlight arc */}
      <path
        d="M22,15 C16,20 14,28 15,36"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
    </>
  );
}

/*
 * Shared face component.
 * mood="smile" : open square pixel eyes, big curve smile (default)
 * mood="focus" : open eyes, slightly flatter smile (determined look)
 * mood="calm"  : closed-arc eyes, gentle smile (relaxed)
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
            d="M19,32 Q24,27 29,32"
            stroke={INK}
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M37,32 Q42,27 47,32"
            stroke={INK}
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          {/* Left eye */}
          <rect x="19" y="27" width="10" height="12" rx="2.5" fill={INK} />
          <rect
            x="20"
            y="28"
            width="3"
            height="3"
            rx="0.5"
            fill="white"
            opacity="0.9"
          />
          {/* Right eye */}
          <rect x="37" y="27" width="10" height="12" rx="2.5" fill={INK} />
          <rect
            x="38"
            y="28"
            width="3"
            height="3"
            rx="0.5"
            fill="white"
            opacity="0.9"
          />
        </>
      )}
      {/* Cheeks */}
      <ellipse cx="13" cy="38" rx="5.5" ry="4" fill={BLUSH} opacity="0.55" />
      <ellipse cx="51" cy="38" rx="5.5" ry="4" fill={BLUSH} opacity="0.55" />
      {/* Smile */}
      {mood === "focus" ? (
        <path
          d="M24,43 Q32,47 40,43"
          stroke={INK}
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M22,42 Q32,51 42,42"
          stroke={INK}
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
        />
      )}
    </>
  );
}

/*
 * Mini flag helper.
 * x,y = top-left of stick.  Stick: 2.5×34px.  Flag rect: 17×12px.
 * Text at 5.8px — readable from ~60px render distance.
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
      {/* Flagpole */}
      <rect x={x} y={y} width="2.5" height="34" rx="1" fill={pole} />
      {/* Flag rectangle */}
      <rect x={x + 2} y={y + 1} width="17" height="12" rx="1.5" fill={color} />
      {/* Flag text — centered in rect */}
      <text
        x={x + 10.5}
        y={y + 10}
        textAnchor="middle"
        fontFamily={MONO}
        fontSize="5.8"
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
   Navy headset (thick band + oval pads) + mic boom + blue "しき" flag
────────────────────────────────────────────────────────────────── */
function ShikishimaSprite(): React.JSX.Element {
  return (
    <g>
      <Body edge="#4f8dff" />
      {/* Headset band (arches high over head) */}
      <path
        d="M11,35 Q13,9 33,9 Q52,9 55,35"
        stroke="#142858"
        strokeWidth="5.2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Left earpad — outer */}
      <ellipse cx="10" cy="36" rx="7.5" ry="9.5" fill="#142858" />
      {/* Left earpad — inner highlight */}
      <ellipse cx="10" cy="36" rx="4.5" ry="6" fill="#2e4898" />
      {/* Right earpad — outer */}
      <ellipse cx="54" cy="36" rx="7.5" ry="9.5" fill="#142858" />
      {/* Right earpad — inner highlight */}
      <ellipse cx="54" cy="36" rx="4.5" ry="6" fill="#2e4898" />
      <Face />
      {/* Mic boom arm */}
      <path
        d="M5,42 Q3,55 14,59"
        stroke="#142858"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Mic capsule */}
      <rect x="11" y="57" width="9" height="5.5" rx="2.5" fill="#142858" />
      {/* Blue "しき" flag */}
      <MiniFlag x={55} y={12} color="#1f57df" text="しき" />
    </g>
  );
}

/* ──────────────────────────────────────────────────────────────────
   2. しずめ — Safety Gate
   Dark flat officer cap + yellow vest stripes + red HOLD sign flag
   NOTE: flat cap (NOT yellow hardhat — see design sheet reference)
────────────────────────────────────────────────────────────────── */
function ShizumeSprite(): React.JSX.Element {
  return (
    <g>
      <Body edge="#f0b429" />
      {/* Flat cap — dome (dark navy) */}
      <path d="M13,22 Q31,4 51,22" fill="#172448" />
      {/* Cap dome highlight */}
      <path d="M17,18 Q32,7 48,18" fill="#263d78" />
      {/* Cap brim (wide, flat) */}
      <rect x="9" y="22" width="46" height="5.5" rx="2.5" fill="#172448" />
      {/* Yellow safety vest — 2 horizontal stripes on body */}
      <rect x="16" y="47" width="32" height="5" rx="2" fill="#f8bf1a" />
      <rect x="16" y="54" width="32" height="4.5" rx="2" fill="#f8bf1a" />
      {/* Vest diagonal accent stripes */}
      <path
        d="M18,44 L26,58 M46,44 L38,58"
        stroke="#f8bf1a"
        strokeWidth="4.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <Face mood="focus" />
      {/* Whistle (gold circle + cord) */}
      <circle
        cx="32"
        cy="47"
        r="4.5"
        fill="#f8bf1a"
        stroke="#9d6700"
        strokeWidth="1.3"
      />
      <circle cx="32" cy="47" r="2" fill="#ffe889" />
      <path
        d="M30,45 Q25,41 22,37"
        stroke="#172448"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Red HOLD sign flag */}
      <MiniFlag x={55} y={16} color="#dc1f1f" text="HOLD" pole="#552222" />
    </g>
  );
}

/* ──────────────────────────────────────────────────────────────────
   3. はじめ / むすび — Planning
   No hat + green terrain map (route dots) + "?" thought bubble
────────────────────────────────────────────────────────────────── */
function HajimeSprite(): React.JSX.Element {
  return (
    <g>
      <Body edge="#5bbf6a" />
      {/* Thought bubble — large circle (upper right) */}
      <circle
        cx="49"
        cy="15"
        r="9.5"
        fill="rgba(228,236,255,0.92)"
        stroke="#b9caff"
        strokeWidth="1.3"
      />
      {/* Bubble connector dots */}
      <circle
        cx="42"
        cy="25"
        r="4"
        fill="rgba(228,236,255,0.92)"
        stroke="#b9caff"
        strokeWidth="0.9"
      />
      <circle
        cx="39"
        cy="31"
        r="2.5"
        fill="rgba(228,236,255,0.92)"
        stroke="#b9caff"
        strokeWidth="0.8"
      />
      {/* "?" inside bubble — large enough to read at distance */}
      <text
        x="49"
        y="20"
        textAnchor="middle"
        fontFamily={MONO}
        fontSize="11"
        fill={INK}
        fontWeight="900"
      >
        ?
      </text>
      <Face />
      {/* Green terrain map (folded, large) */}
      <path
        d="M11,47 L23,42 L36,47 L50,42 L56,47 L56,63 L44,68 L31,63 L18,68 L11,63 Z"
        fill="#c8d96a"
        stroke="#4d8b35"
        strokeWidth="1.6"
      />
      {/* Map fold lines */}
      <path
        d="M23,42 V62 M36,47 V67 M50,42 V62"
        stroke="#7da64a"
        strokeWidth="1.2"
      />
      {/* Route path */}
      <path
        d="M15,60 Q24,53 35,58 Q44,63 52,53"
        stroke="#2f7f44"
        strokeWidth="2"
        fill="none"
        strokeDasharray="3.5 2.5"
      />
      {/* Route dots — red, large enough to see */}
      <circle cx="18" cy="59" r="3.2" fill="#e03838" />
      <circle cx="48" cy="55" r="2.8" fill="#e03838" />
    </g>
  );
}

/* ──────────────────────────────────────────────────────────────────
   4. つむぎ — Developer / Builder
   Yellow hard hat (dome + brim + ribs) + brown toolbox + wrench
────────────────────────────────────────────────────────────────── */
function TsumugiSprite(): React.JSX.Element {
  return (
    <g>
      <Body edge="#f0a020" />
      {/* Hard hat dome — yellow */}
      <path
        d="M14,22 Q16,5 32,5 Q48,5 50,22"
        fill="#f5bd12"
        stroke="#b87500"
        strokeWidth="1.4"
      />
      {/* Hat brim */}
      <rect x="9" y="22" width="46" height="5.5" rx="2.7" fill="#d98a00" />
      {/* Dome vertical ribs */}
      <path
        d="M23,8 V22 M32,5 V22 M41,8 V22"
        stroke="#b87500"
        strokeWidth="1.5"
        opacity="0.7"
      />
      <Face mood="focus" />
      {/* Toolbox (right side, large) */}
      <rect x="42" y="49" width="19" height="14" rx="2.5" fill="#7a4820" />
      <rect x="42" y="47" width="19" height="6" rx="2" fill="#936130" />
      {/* Toolbox handle */}
      <path
        d="M47,47 Q51.5,40 56,47"
        stroke="#936130"
        strokeWidth="3"
        fill="none"
      />
      {/* Clasps */}
      <rect x="45" y="56" width="4.5" height="3" rx="1" fill="#d9a049" />
      <rect x="54" y="56" width="4.5" height="3" rx="1" fill="#d9a049" />
      {/* Wrench (left side) */}
      <path
        d="M8,49 L19,38"
        stroke="#56616f"
        strokeWidth="3.8"
        strokeLinecap="round"
      />
      <path d="M17,34 Q22,30 27,33 Q24,39 18,38 Z" fill="#56616f" />
      {/* Orange "つむ" flag */}
      <MiniFlag x={55} y={20} color="#f07000" text="つむ" pole="#a04800" />
    </g>
  );
}

/* ──────────────────────────────────────────────────────────────────
   5. しるべ — Record Keeper
   Dark headphones (thick band + oval pads) + open logbook + pen
────────────────────────────────────────────────────────────────── */
function ShirubeSprite(): React.JSX.Element {
  return (
    <g>
      <Body edge="#6c82ff" />
      {/* Headphone band (same arc as しきしま but darker purple) */}
      <path
        d="M11,35 Q13,9 33,9 Q52,9 55,35"
        stroke="#18224d"
        strokeWidth="5.2"
        fill="none"
        strokeLinecap="round"
      />
      {/* Left earpad — outer */}
      <ellipse cx="10" cy="36" rx="7.5" ry="10" fill="#18224d" />
      {/* Left earpad — inner highlight */}
      <ellipse cx="10" cy="36" rx="4.5" ry="6.5" fill="#4557b8" />
      {/* Right earpad — outer */}
      <ellipse cx="54" cy="36" rx="7.5" ry="10" fill="#18224d" />
      {/* Right earpad — inner highlight */}
      <ellipse cx="54" cy="36" rx="4.5" ry="6.5" fill="#4557b8" />
      <Face mood="calm" />
      {/* Open logbook — two pages + spine */}
      {/* Spine */}
      <rect x="29" y="47" width="4.5" height="19" rx="1.5" fill="#18224d" />
      {/* Left page */}
      <rect x="10" y="48" width="19" height="17" rx="2" fill="#f7f1e7" />
      <line
        x1="12"
        y1="53"
        x2="27"
        y2="53"
        stroke="rgba(60,60,100,0.45)"
        strokeWidth="1.3"
      />
      <line
        x1="12"
        y1="57"
        x2="27"
        y2="57"
        stroke="rgba(60,60,100,0.45)"
        strokeWidth="1.3"
      />
      <line
        x1="12"
        y1="61"
        x2="22"
        y2="61"
        stroke="rgba(60,60,100,0.35)"
        strokeWidth="1.1"
      />
      {/* Right page */}
      <rect x="33" y="48" width="19" height="17" rx="2" fill="#f7f1e7" />
      <line
        x1="35"
        y1="53"
        x2="50"
        y2="53"
        stroke="rgba(60,60,100,0.45)"
        strokeWidth="1.3"
      />
      <line
        x1="35"
        y1="57"
        x2="50"
        y2="57"
        stroke="rgba(60,60,100,0.45)"
        strokeWidth="1.3"
      />
      <line
        x1="35"
        y1="61"
        x2="46"
        y2="61"
        stroke="rgba(60,60,100,0.35)"
        strokeWidth="1.1"
      />
      {/* Pen (writing on right page) — diagonal stroke */}
      <path d="M41,59 L47,51 L49,53 L43,61 Z" fill="#2a2060" />
      <circle cx="41.5" cy="59.5" r="1.8" fill="#2a2060" />
      {/* Purple "しる" flag */}
      <MiniFlag x={55} y={12} color="#7040c0" text="しる" pole="#40206a" />
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
