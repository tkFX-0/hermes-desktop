/**
 * PixelGhostSprite — CSS/SVG character approximations for the Pixel Room.
 * Based on the approved ghost design sheet:
 * #1/#6 command headset, #2/#7 safety HOLD, #3/#8 planning map,
 * #4/#9 development hardhat, #5/#10 record headphones/book.
 * Inline SVG only. No image assets. Display-only.
 */

import type { AgentId } from "../../types/agent-theater-types";

interface PixelGhostSpriteProps {
  readonly agentId: AgentId;
  readonly size?: number;
}

const WHITE = "#f6fbff";
const EDGE = "#7aa7f6";
const SHADOW = "#c5d8ff";
const INK = "#102052";
const BLUSH = "#ff8f8f";
const MONO = '"IBM Plex Mono", monospace';

const BODY_PATH =
  "M32,9 C18,9 10,19 10,34 C10,45 15,53 22,54 Q25,62 29,55 Q32,63 35,55 Q39,62 42,54 C50,53 56,45 56,34 C56,19 46,9 32,9 Z";

function Body({ edge = EDGE }: { readonly edge?: string }): React.JSX.Element {
  return (
    <>
      <ellipse cx="34" cy="70" rx="20" ry="4.5" fill="rgba(0,0,0,0.18)" />
      <path d={BODY_PATH} fill={SHADOW} transform="translate(1.6,2)" opacity="0.82" />
      <path d={BODY_PATH} fill={WHITE} stroke={edge} strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M22,15 C16,20 14,28 15,36" stroke="rgba(255,255,255,0.85)" strokeWidth="4" strokeLinecap="round" />
      <path d="M41,11 C38,17 37,24 42,30" stroke={SHADOW} strokeWidth="2.6" strokeLinecap="round" opacity="0.9" />
    </>
  );
}

function Face({ mood = "smile" }: { readonly mood?: "smile" | "focus" | "calm" }): React.JSX.Element {
  const leftEye = mood === "calm" ? "M18,31 Q23,27 28,31" : undefined;
  const rightEye = mood === "calm" ? "M38,31 Q43,27 48,31" : undefined;

  return (
    <>
      {leftEye ? (
        <path d={leftEye} stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      ) : (
        <rect x="20" y="28" width="8" height="11" rx="2" fill={INK} />
      )}
      {rightEye ? (
        <path d={rightEye} stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      ) : (
        <rect x="38" y="28" width="8" height="11" rx="2" fill={INK} />
      )}
      {mood !== "calm" ? (
        <>
          <rect x="21" y="29" width="2.4" height="2.4" rx="0.5" fill="white" opacity="0.9" />
          <rect x="39" y="29" width="2.4" height="2.4" rx="0.5" fill="white" opacity="0.9" />
        </>
      ) : null}
      <ellipse cx="15" cy="40" rx="4.8" ry="3.5" fill={BLUSH} opacity="0.58" />
      <ellipse cx="51" cy="40" rx="4.8" ry="3.5" fill={BLUSH} opacity="0.58" />
      {mood === "focus" ? (
        <path d="M26,44 Q33,48 40,44" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M24,43 Q33,50 42,43" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
      )}
    </>
  );
}

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
      <rect x={x} y={y} width="2.2" height="32" rx="1" fill={pole} />
      <rect x={x + 2} y={y + 1} width="15" height="11" rx="1.4" fill={color} />
      <text
        x={x + 9.5}
        y={y + 9.2}
        textAnchor="middle"
        fontFamily={MONO}
        fontSize="5.2"
        fill="white"
        fontWeight="900"
      >
        {text}
      </text>
    </>
  );
}

function ShikishimaSprite(): React.JSX.Element {
  return (
    <g>
      <Body edge="#4f8dff" />
      <path d="M11,35 Q13,9 33,9 Q52,9 55,35" stroke="#142858" strokeWidth="4.8" fill="none" strokeLinecap="round" />
      <ellipse cx="11" cy="36" rx="6.6" ry="9" fill="#132552" />
      <ellipse cx="11" cy="36" rx="3.4" ry="5.4" fill="#35549a" />
      <ellipse cx="55" cy="36" rx="6.6" ry="9" fill="#132552" />
      <ellipse cx="55" cy="36" rx="3.4" ry="5.4" fill="#35549a" />
      <Face />
      <path d="M8,42 Q7,52 16,56" stroke="#132552" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <rect x="13" y="54" width="7" height="4" rx="2" fill="#132552" />
      <MiniFlag x={56} y={14} color="#1f57df" text="しき" />
    </g>
  );
}

function ShizumeSprite(): React.JSX.Element {
  return (
    <g>
      <Body edge="#f0b429" />
      <path d="M13,22 Q31,5 51,22" fill="#172448" />
      <path d="M17,18 Q32,7 48,18" fill="#263d78" />
      <rect x="12" y="22" width="40" height="5" rx="2.5" fill="#172448" />
      <circle cx="16" cy="19" r="5.2" fill="#f8bf1a" stroke="#9d6700" strokeWidth="1.2" />
      <circle cx="16" cy="19" r="2.8" fill="#ffe889" />
      <rect x="16" y="49" width="32" height="4.4" rx="1.8" fill="#f8bf1a" />
      <path d="M18,46 L27,57 M46,46 L37,57" stroke="#f8bf1a" strokeWidth="4" strokeLinecap="round" />
      <Face mood="focus" />
      <circle cx="31" cy="46" r="3.4" fill="#f8bf1a" stroke="#9d6700" strokeWidth="1" />
      <path d="M29,45 Q24,42 22,38" stroke="#172448" strokeWidth="2" fill="none" strokeLinecap="round" />
      <MiniFlag x={54} y={16} color="#dc1f1f" text="HOLD" pole="#522" />
    </g>
  );
}

function HajimeSprite(): React.JSX.Element {
  return (
    <g>
      <Body edge="#5bbf6a" />
      <Face />
      <path d="M11,48 L24,43 L35,48 L48,43 L55,48 L55,63 L42,68 L31,63 L18,68 L11,63 Z" fill="#c8d96a" stroke="#4d8b35" strokeWidth="1.5" />
      <path d="M24,43 V63 M35,48 V68 M48,43 V63" stroke="#7da64a" strokeWidth="1" />
      <path d="M15,59 Q24,52 34,57 Q44,62 52,52" stroke="#2f7f44" strokeWidth="1.5" fill="none" strokeDasharray="3 2" />
      <circle cx="18" cy="58" r="2" fill="#e03838" />
      <circle cx="44" cy="54" r="2" fill="#e03838" />
      <rect x="50" y="41" width="10" height="12" rx="2" fill="#7b4a20" />
      <path d="M52,41 Q55,37 58,41" stroke="#7b4a20" strokeWidth="2" fill="none" />
      <circle cx="49" cy="16" r="7.5" fill="rgba(230,238,255,0.92)" stroke="#b9caff" strokeWidth="1.2" />
      <text x="49" y="20" textAnchor="middle" fontFamily={MONO} fontSize="8" fill={INK} fontWeight="900">
        ?
      </text>
    </g>
  );
}

function TsumugiSprite(): React.JSX.Element {
  return (
    <g>
      <Body edge="#f0a020" />
      <path d="M14,22 Q16,6 32,6 Q48,6 50,22" fill="#f5bd12" stroke="#b87500" strokeWidth="1.2" />
      <rect x="10" y="22" width="44" height="5.5" rx="2.6" fill="#d98a00" />
      <path d="M23,8 V22 M32,6 V22 M41,8 V22" stroke="#b87500" strokeWidth="1.4" opacity="0.7" />
      <Face mood="focus" />
      <rect x="43" y="48" width="17" height="14" rx="2" fill="#7a4820" />
      <rect x="43" y="46" width="17" height="5" rx="1.5" fill="#936130" />
      <path d="M48,46 Q51.5,41 55,46" stroke="#936130" strokeWidth="2.4" fill="none" />
      <rect x="46" y="54" width="3" height="2" rx="0.5" fill="#d9a049" />
      <rect x="54" y="54" width="3" height="2" rx="0.5" fill="#d9a049" />
      <path d="M9,49 L19,39" stroke="#56616f" strokeWidth="3" strokeLinecap="round" />
      <path d="M17,36 Q21,33 25,36 Q23,40 18,39 Z" fill="#56616f" />
    </g>
  );
}

function ShirubeSprite(): React.JSX.Element {
  return (
    <g>
      <Body edge="#6c82ff" />
      <path d="M11,35 Q13,9 33,9 Q52,9 55,35" stroke="#18224d" strokeWidth="4.8" fill="none" strokeLinecap="round" />
      <ellipse cx="11" cy="36" rx="6.6" ry="9" fill="#18224d" />
      <ellipse cx="11" cy="36" rx="3.4" ry="5.4" fill="#4557b8" />
      <ellipse cx="55" cy="36" rx="6.6" ry="9" fill="#18224d" />
      <ellipse cx="55" cy="36" rx="3.4" ry="5.4" fill="#4557b8" />
      <Face mood="calm" />
      <path d="M21,47 L33,47 L33,64 L21,64 Z" fill="#f7f1e7" stroke="#1b2a60" strokeWidth="1.3" />
      <path d="M33,47 L47,47 L47,64 L33,64 Z" fill="#fff8ee" stroke="#1b2a60" strokeWidth="1.3" />
      <rect x="31.5" y="47" width="3" height="17" rx="1" fill="#e24b2c" />
      <line x1="24" y1="52" x2="31" y2="52" stroke="#8c8c8c" strokeWidth="0.9" />
      <line x1="24" y1="56" x2="31" y2="56" stroke="#8c8c8c" strokeWidth="0.9" />
      <line x1="36" y1="52" x2="44" y2="52" stroke="#8c8c8c" strokeWidth="0.9" />
      <line x1="36" y1="56" x2="44" y2="56" stroke="#8c8c8c" strokeWidth="0.9" />
      <path d="M19,46 Q14,50 12,56" stroke="#18224d" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="12" cy="56" r="2" fill="#18224d" />
    </g>
  );
}

const SPRITE_MAP: Record<AgentId, () => React.JSX.Element> = {
  shikishima: ShikishimaSprite,
  shizume: ShizumeSprite,
  hajime: HajimeSprite,
  tsumugi: TsumugiSprite,
  shirube: ShirubeSprite,
};

export function PixelGhostSprite({ agentId, size = 64 }: PixelGhostSpriteProps): React.JSX.Element {
  const Sprite = SPRITE_MAP[agentId];
  return (
    <svg
      viewBox="0 0 70 78"
      width={size}
      height={Math.round(size * 1.12)}
      aria-hidden
      style={{ display: "block", overflow: "visible" }}
    >
      <Sprite />
    </svg>
  );
}
