/**
 * PixelGhostSprite — Pixel Room specific ghost character designs.
 * PXR-05E redesign: rounded bodies, unified face, role-faithful accessories.
 * Inline SVG only. No image assets. Display-only.
 */

import type { AgentId } from "../../types/agent-theater-types";

interface PixelGhostSpriteProps {
  readonly agentId: AgentId;
  readonly size?: number;
}

const BODY_FILL = "#edf2ff";
const BODY_SHADOW = "#c4d4f0";
const INK = "#1a2852";
const MONO = '"IBM Plex Mono", monospace';

const BODY_PATH =
  "M32,12 C15,12 7,23 7,37 C7,51 14,58 20,55 Q23,63 27,55 Q30,63 32,57 Q34,63 37,55 Q41,63 44,55 C50,58 57,51 57,37 C57,23 49,12 32,12 Z";

function GhostBase(): React.JSX.Element {
  return (
    <>
      <ellipse cx="33" cy="68" rx="17" ry="4" fill="rgba(40,60,200,0.09)" />
      <path d={BODY_PATH} fill={BODY_SHADOW} transform="translate(1,1.5)" />
      <path d={BODY_PATH} fill={BODY_FILL} />
      <ellipse cx="29" cy="26" rx="15" ry="10" fill="rgba(255,255,255,0.38)" />
    </>
  );
}

function GhostFace(): React.JSX.Element {
  return (
    <>
      <rect x="19" y="27" width="10" height="12" rx="2.5" fill={INK} />
      <rect x="20" y="28" width="3" height="3" rx="0.5" fill="white" opacity="0.9" />
      <rect x="35" y="27" width="10" height="12" rx="2.5" fill={INK} />
      <rect x="36" y="28" width="3" height="3" rx="0.5" fill="white" opacity="0.9" />
      <ellipse cx="13" cy="38" rx="5.5" ry="4" fill="rgba(255,115,115,0.46)" />
      <ellipse cx="51" cy="38" rx="5.5" ry="4" fill="rgba(255,115,115,0.46)" />
      <path d="M22,42 Q32,51 42,42" stroke={INK} strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </>
  );
}

function ShikishimaSprite(): React.JSX.Element {
  return (
    <g>
      <GhostBase />
      <path d="M12,34 Q32,9 52,34" stroke="#1c2d5c" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <ellipse cx="11" cy="35" rx="6" ry="7" fill="#1c2d5c" />
      <ellipse cx="11" cy="35" rx="3.5" ry="4.5" fill="#2e4a90" />
      <ellipse cx="53" cy="35" rx="6" ry="7" fill="#1c2d5c" />
      <ellipse cx="53" cy="35" rx="3.5" ry="4.5" fill="#2e4a90" />
      <GhostFace />
      <path d="M6,39 Q4,50 13,54" stroke="#1c2d5c" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="13" cy="55" r="2.5" fill="#1c2d5c" />
      <rect x="54" y="8" width="2" height="30" rx="1" fill="#223355" />
      <rect x="56" y="8" width="12" height="9" rx="1.5" fill="#2255dd" />
      <text x="62" y="15.5" textAnchor="middle" fontFamily={MONO} fontSize="5" fill="white" fontWeight="bold">
        しき
      </text>
    </g>
  );
}

function ShizumeSprite(): React.JSX.Element {
  return (
    <g>
      <GhostBase />
      <ellipse cx="32" cy="14" rx="20" ry="8" fill="#192440" />
      <path d="M12,14 Q32,5 52,14 L52,18 Q32,11 12,18 Z" fill="#243060" />
      <rect x="10" y="19" width="44" height="5" rx="2.5" fill="#192440" />
      <rect x="18" y="46" width="28" height="4" rx="1.5" fill="#f5c020" />
      <rect x="18" y="52" width="28" height="3.5" rx="1.5" fill="#f5c020" />
      <GhostFace />
      <rect x="54" y="18" width="2" height="30" rx="1" fill="#443322" />
      <rect x="56" y="18" width="12" height="9" rx="1.5" fill="#cc1111" />
      <text x="62" y="25.5" textAnchor="middle" fontFamily={MONO} fontSize="4" fill="white" fontWeight="bold">
        HOLD
      </text>
    </g>
  );
}

function HajimeSprite(): React.JSX.Element {
  return (
    <g>
      <GhostBase />
      <circle cx="50" cy="15" r="8" fill="rgba(220,228,255,0.82)" stroke={BODY_SHADOW} strokeWidth="1" />
      <circle cx="43" cy="24" r="3.5" fill="rgba(220,228,255,0.82)" stroke={BODY_SHADOW} strokeWidth="0.8" />
      <circle cx="40" cy="30" r="2" fill="rgba(220,228,255,0.82)" stroke={BODY_SHADOW} strokeWidth="0.8" />
      <text x="50" y="19" textAnchor="middle" fontFamily={MONO} fontSize="9" fill={INK} fontWeight="bold">
        ?
      </text>
      <GhostFace />
      <rect x="12" y="48" width="24" height="16" rx="3" fill="#c8b458" />
      <rect x="13" y="49" width="22" height="14" rx="2" fill="#d8c468" />
      <path d="M15,53 Q18,51 21,53 Q24,55 27,53" stroke="#2e6020" strokeWidth="1.3" fill="none" />
      <path d="M15,57 Q19,59 23,57" stroke="#2e6020" strokeWidth="1.3" fill="none" />
      <path d="M15,61 Q18,59 22,61 Q25,63 29,61" stroke="#3a7030" strokeWidth="1.3" fill="none" />
      <circle cx="18" cy="54" r="2" fill="#dd2020" />
      <circle cx="26" cy="58" r="1.5" fill="#dd2020" />
      <rect x="40" y="8" width="2" height="24" rx="1" fill="#1e4e1e" />
      <rect x="42" y="8" width="12" height="9" rx="1.5" fill="#28a828" />
      <text x="48" y="15.5" textAnchor="middle" fontFamily={MONO} fontSize="5" fill="white" fontWeight="bold">
        はじ
      </text>
    </g>
  );
}

function TsumugiSprite(): React.JSX.Element {
  return (
    <g>
      <GhostBase />
      <ellipse cx="32" cy="16" rx="24" ry="5.5" fill="#d49000" />
      <path d="M15,16 Q15,4 32,4 Q49,4 49,16" fill="#f5bc00" />
      <path
        d="M21,6 Q32,3 43,6 Q47,10 47,15 Q41,10 32,10 Q23,10 17,15 Q17,10 21,6"
        fill="rgba(255,245,130,0.50)"
      />
      <rect x="30" y="4" width="4" height="12" rx="2" fill="#d49000" opacity="0.4" />
      <GhostFace />
      <rect x="42" y="51" width="17" height="12" rx="2" fill="#7a4820" />
      <rect x="42" y="49" width="17" height="5" rx="1.5" fill="#8a5830" />
      <path d="M47,49 Q50.5,44 54,49" stroke="#8a5830" strokeWidth="2.5" fill="none" />
      <rect x="44" y="55" width="3" height="2" rx="0.5" fill="#c89040" />
      <rect x="53" y="55" width="3" height="2" rx="0.5" fill="#c89040" />
      <rect x="4" y="22" width="2" height="28" rx="1" fill="#a04800" />
      <rect x="6" y="22" width="12" height="9" rx="1.5" fill="#f07000" />
      <text x="12" y="29.5" textAnchor="middle" fontFamily={MONO} fontSize="5" fill="white" fontWeight="bold">
        つむ
      </text>
    </g>
  );
}

function ShirubeSprite(): React.JSX.Element {
  return (
    <g>
      <GhostBase />
      <path d="M12,34 Q32,9 52,34" stroke="#201848" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <ellipse cx="11" cy="35" rx="6" ry="7" fill="#201848" />
      <ellipse cx="11" cy="35" rx="3.5" ry="4.5" fill="#3828a0" />
      <ellipse cx="53" cy="35" rx="6" ry="7" fill="#201848" />
      <ellipse cx="53" cy="35" rx="3.5" ry="4.5" fill="#3828a0" />
      <GhostFace />
      <rect x="29" y="48" width="3" height="17" rx="1" fill="#201848" />
      <rect x="11" y="49" width="18" height="15" rx="2" fill="#f8f4ec" />
      <line x1="13" y1="53" x2="27" y2="53" stroke="rgba(140,140,140,0.6)" strokeWidth="0.9" />
      <line x1="13" y1="57" x2="27" y2="57" stroke="rgba(140,140,140,0.6)" strokeWidth="0.9" />
      <line x1="13" y1="61" x2="22" y2="61" stroke="rgba(140,140,140,0.6)" strokeWidth="0.9" />
      <rect x="32" y="49" width="18" height="15" rx="2" fill="#f8f4ec" />
      <line x1="34" y1="53" x2="48" y2="53" stroke="rgba(140,140,140,0.6)" strokeWidth="0.9" />
      <line x1="34" y1="57" x2="48" y2="57" stroke="rgba(140,140,140,0.6)" strokeWidth="0.9" />
      <line x1="34" y1="61" x2="44" y2="61" stroke="rgba(140,140,140,0.6)" strokeWidth="0.9" />
      <path d="M41,59 L46,53 L47,54 L42,60 Z" fill="#2a2060" />
      <circle cx="41" cy="60" r="1.2" fill="#2a2060" />
      <rect x="54" y="8" width="2" height="26" rx="1" fill="#40206a" />
      <rect x="56" y="8" width="12" height="9" rx="1.5" fill="#7040c0" />
      <text x="62" y="15.5" textAnchor="middle" fontFamily={MONO} fontSize="5" fill="white" fontWeight="bold">
        しる
      </text>
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
