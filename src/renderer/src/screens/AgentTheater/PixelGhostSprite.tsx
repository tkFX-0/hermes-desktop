/**
 * PixelGhostSprite — Pixel Room specific ghost character designs.
 * ViewBox 64×80. Larger, bolder, role-identity focused.
 * Inline SVG only. No image assets. No packages.
 * Designed for PixelRoomStage (60-70px render size).
 * PXR-05E Character Redesign.
 */

import type { AgentId } from "../../types/agent-theater-types";

interface PixelGhostSpriteProps {
  readonly agentId: AgentId;
  readonly size?: number;
}

/* ── Shared body path (64×80 viewBox) ── */
const BODY_PATH =
  "M32,7 C16,7 9,19 9,30 L9,46 Q14,56 20,47 Q26,57 32,47 Q38,57 44,47 Q50,56 55,46 L55,30 C55,19 48,7 32,7 Z";

/* ─────────────────────────────────────────────────────────────── */
/* しきしま — command controller                                     */
/* ─────────────────────────────────────────────────────────────── */
function ShikishimaSprite({ size }: { size: number }): React.JSX.Element {
  return (
    <svg width={size} height={Math.round(size * 1.25)} viewBox="0 0 64 80" fill="none" aria-hidden>
      {/* Body */}
      <path d={BODY_PATH} fill="#eef2ff" stroke="#2563eb" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Shoulder highlight */}
      <path d="M14,16 Q24,10 40,16" fill="#dbeafe" opacity="0.7" />

      {/* Headset arc */}
      <path d="M11,26 Q11,6 32,6 Q53,6 53,26"
        stroke="#1e3a8a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      {/* Left ear cup */}
      <rect x="6" y="22" width="7" height="10" rx="3.5" fill="#1e3a8a" />
      {/* Right ear cup */}
      <rect x="51" y="22" width="7" height="10" rx="3.5" fill="#1e3a8a" />
      {/* Mic boom (right side) */}
      <path d="M55,28 Q60,34 57,40" stroke="#1e3a8a" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Mic capsule */}
      <circle cx="57" cy="40" r="2.5" fill="#1e3a8a" />
      <circle cx="57" cy="40" r="1.2" fill="#60a5fa" />

      {/* Eyes — attentive rectangles */}
      <rect x="17" y="24" width="8" height="10" rx="2" fill="#1d4ed8" />
      <rect x="39" y="24" width="8" height="10" rx="2" fill="#1d4ed8" />
      {/* Eye highlights */}
      <circle cx="20" cy="27" r="2" fill="#ffffff" />
      <circle cx="42" cy="27" r="2" fill="#ffffff" />

      {/* Smile */}
      <path d="M22,38 Q32,44 42,38" stroke="#1d4ed8" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Cheeks */}
      <circle cx="13" cy="36" r="4" fill="#fca5a5" opacity="0.5" />
      <circle cx="51" cy="36" r="4" fill="#fca5a5" opacity="0.5" />

      {/* Blue command flag (upper right) */}
      <line x1="56" y1="8" x2="56" y2="34" stroke="#1e3a8a" strokeWidth="2" strokeLinecap="round" />
      <path d="M56,9 H64 V22 H56 Z" fill="#2563eb" stroke="#1e40af" strokeWidth="1" />
      <text x="57.5" y="18" fontSize="7" fontWeight="800" fill="#ffffff">し</text>

      {/* Command badge on chest */}
      <rect x="26" y="38" width="12" height="6" rx="1.5"
        fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.6" />
      <text x="28" y="43.5" fontSize="4.5" fill="#3b82f6" opacity="0.8">CMD</text>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/* しずめ — safety gate guard                                       */
/* ─────────────────────────────────────────────────────────────── */
function ShizumeSprite({ size }: { size: number }): React.JSX.Element {
  return (
    <svg width={size} height={Math.round(size * 1.25)} viewBox="0 0 64 80" fill="none" aria-hidden>
      {/* Body */}
      <path d={BODY_PATH} fill="#fffbeb" stroke="#d97706" strokeWidth="2.5" strokeLinejoin="round" />

      {/* Safety helmet */}
      <path d="M8,26 Q32,8 56,26" fill="#fde68a" stroke="#b45309" strokeWidth="2" />
      <rect x="7" y="26" width="50" height="4" rx="2" fill="#b45309" />
      {/* Helmet lamp */}
      <circle cx="16" cy="22" r="5" fill="#facc15" stroke="#b45309" strokeWidth="1.5" />
      <circle cx="16" cy="22" r="3" fill="#fef08a" />
      {/* Lamp glow lines */}
      <line x1="16" y1="16" x2="16" y2="13" stroke="#fde68a" strokeWidth="1" />
      <line x1="20" y1="18" x2="23" y2="15" stroke="#fde68a" strokeWidth="1" />

      {/* Eyes — serious half-lids */}
      <line x1="18" y1="32" x2="24" y2="34" stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round" />
      <line x1="46" y1="32" x2="40" y2="34" stroke="#1d4ed8" strokeWidth="3" strokeLinecap="round" />
      {/* Serious flat mouth */}
      <line x1="24" y1="40" x2="40" y2="40" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" />

      {/* Cheeks */}
      <circle cx="14" cy="38" r="3.5" fill="#fca5a5" opacity="0.5" />
      <circle cx="50" cy="38" r="3.5" fill="#fca5a5" opacity="0.5" />

      {/* HOLD sign with pole */}
      <line x1="56" y1="10" x2="56" y2="40" stroke="#7c3f00" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="48" y="9" width="16" height="11" rx="2"
        fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
      <text x="49.5" y="17.5" fontSize="5.5" fontWeight="900" fill="#ffffff" letterSpacing="0.3">HOLD</text>

      {/* Safety vest diagonal lines */}
      <path d="M10,40 L20,32 M54,40 L44,32"
        stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" opacity="0.75" />

      {/* Whistle */}
      <circle cx="32" cy="38" r="3.5" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
      <line x1="32" y1="34" x2="32" y2="30" stroke="#b45309" strokeWidth="1.5" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/* はじめ / むすび — planning thinker                               */
/* ─────────────────────────────────────────────────────────────── */
function HajimeSprite({ size }: { size: number }): React.JSX.Element {
  return (
    <svg width={size} height={Math.round(size * 1.25)} viewBox="0 0 64 80" fill="none" aria-hidden>
      {/* Body */}
      <path d={BODY_PATH} fill="#f0fdf4" stroke="#16a34a" strokeWidth="2.5" strokeLinejoin="round" />

      {/* Eyes — wide curious circles */}
      <circle cx="21" cy="27" r="5.5" fill="#15803d" />
      <circle cx="43" cy="27" r="5.5" fill="#15803d" />
      <circle cx="22.5" cy="25.5" r="2" fill="#ffffff" />
      <circle cx="44.5" cy="25.5" r="2" fill="#ffffff" />

      {/* Open smile */}
      <path d="M22,36 Q32,44 42,36" stroke="#15803d" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Cheeks (green tinted) */}
      <circle cx="13" cy="34" r="4" fill="#86efac" opacity="0.55" />
      <circle cx="51" cy="34" r="4" fill="#86efac" opacity="0.55" />

      {/* Folded MAP (held left-side) */}
      <path d="M2,30 L15,25 L24,30 L36,25 L45,30 V44 L36,48 L24,44 L15,48 L2,44 Z"
        fill="#bbf7d0" stroke="#16a34a" strokeWidth="1.5" />
      <path d="M15,25 V44 M24,30 V48 M36,25 V44"
        stroke="#4ade80" strokeWidth="1" opacity="0.8" />
      {/* Map dots */}
      <circle cx="5" cy="41" r="2.5" fill="#15803d" />
      <circle cx="20" cy="28" r="2" fill="#15803d" />
      <circle cx="40" cy="28" r="2" fill="#15803d" />
      {/* Map route */}
      <path d="M5,41 C10,33 22,36 40,28"
        stroke="#15803d" strokeWidth="1.5" fill="none" strokeDasharray="3 2" opacity="0.8" />

      {/* Thought bubble */}
      <circle cx="54" cy="12" r="6" fill="#ffffff" stroke="#16a34a" strokeWidth="1.5" />
      <text x="52" y="15.5" fontSize="8" fontWeight="900" fill="#16a34a">?</text>
      {/* Bubble connector dots */}
      <circle cx="48" cy="18" r="1.5" fill="#16a34a" opacity="0.6" />
      <circle cx="44" cy="22" r="1" fill="#16a34a" opacity="0.4" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/* つむぐ / つむぎ — developer / builder                            */
/* ─────────────────────────────────────────────────────────────── */
function TsumugiSprite({ size }: { size: number }): React.JSX.Element {
  return (
    <svg width={size} height={Math.round(size * 1.25)} viewBox="0 0 64 80" fill="none" aria-hidden>
      {/* Body */}
      <path d={BODY_PATH} fill="#fff7ed" stroke="#ea580c" strokeWidth="2.5" strokeLinejoin="round" />

      {/* Construction helmet */}
      <path d="M8,26 Q32,8 56,26" fill="#facc15" stroke="#b45309" strokeWidth="2" />
      <line x1="7" y1="26" x2="57" y2="26" stroke="#b45309" strokeWidth="2" />
      {/* Helmet stripes */}
      <line x1="20" y1="14" x2="20" y2="25" stroke="#b45309" strokeWidth="1.2" />
      <line x1="32" y1="10" x2="32" y2="25" stroke="#b45309" strokeWidth="1.2" />
      <line x1="44" y1="14" x2="44" y2="25" stroke="#b45309" strokeWidth="1.2" />

      {/* Eyes — focused narrow ellipses */}
      <ellipse cx="21" cy="30" rx="5" ry="3" fill="#ea580c" />
      <ellipse cx="43" cy="30" rx="5" ry="3" fill="#ea580c" />
      <ellipse cx="22" cy="29.5" rx="1.5" ry="1" fill="#ffffff" />
      <ellipse cx="44" cy="29.5" rx="1.5" ry="1" fill="#ffffff" />

      {/* Determined mouth */}
      <line x1="24" y1="38" x2="40" y2="38" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" />

      {/* Cheeks */}
      <circle cx="13" cy="36" r="3.5" fill="#fca5a5" opacity="0.5" />
      <circle cx="51" cy="36" r="3.5" fill="#fca5a5" opacity="0.5" />

      {/* Tool box (right side) */}
      <rect x="47" y="28" width="14" height="11" rx="1.5"
        fill="#92400e" stroke="#451a03" strokeWidth="1.5" />
      {/* Box handle */}
      <path d="M51,28 Q54,24 57,28" stroke="#451a03" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Box divider */}
      <line x1="47" y1="33" x2="61" y2="33" stroke="#5c2d0a" strokeWidth="1" />

      {/* Wrench (left) */}
      <path d="M8,32 L18,22" stroke="#6b7280" strokeWidth="3" strokeLinecap="round" />
      <path d="M15,19 Q20,15 24,18 Q21,22 17,22 Z"
        fill="#6b7280" stroke="#374151" strokeWidth="1" />

      {/* Keyboard hint at bottom */}
      <rect x="19" y="42" width="26" height="5" rx="1.5"
        fill="#1a0e00" stroke="#b45309" strokeWidth="1" />
      <rect x="21" y="43.5" width="4" height="2" rx="0.5" fill="#b45309" opacity="0.6" />
      <rect x="27" y="43.5" width="4" height="2" rx="0.5" fill="#b45309" opacity="0.6" />
      <rect x="33" y="43.5" width="4" height="2" rx="0.5" fill="#b45309" opacity="0.6" />
      <rect x="39" y="43.5" width="4" height="2" rx="0.5" fill="#b45309" opacity="0.6" />

      {/* Orange flag */}
      <line x1="0" y1="10" x2="0" y2="30" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
      <path d="M0,10 H8 V20 H0 Z" fill="#f97316" stroke="#ea580c" strokeWidth="1" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/* しるべ — record / log keeper                                     */
/* ─────────────────────────────────────────────────────────────── */
function ShirubeSprite({ size }: { size: number }): React.JSX.Element {
  return (
    <svg width={size} height={Math.round(size * 1.25)} viewBox="0 0 64 80" fill="none" aria-hidden>
      {/* Body */}
      <path d={BODY_PATH} fill="#faf5ff" stroke="#9333ea" strokeWidth="2.5" strokeLinejoin="round" />

      {/* Headphones arc */}
      <path d="M11,28 Q11,6 32,6 Q53,6 53,28"
        stroke="#7e22ce" strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Left ear pad */}
      <rect x="5" y="24" width="8" height="11" rx="4" fill="#9333ea" />
      {/* Right ear pad */}
      <rect x="51" y="24" width="8" height="11" rx="4" fill="#9333ea" />
      {/* Mic/cable right */}
      <path d="M56,32 Q60,38 57,44" stroke="#7e22ce" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="57" cy="44" r="2" fill="#9333ea" />

      {/* Eyes — serene closed curves */}
      <path d="M17,27 Q21,23 25,27" stroke="#9333ea" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M39,27 Q43,23 47,27" stroke="#9333ea" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Gentle smile */}
      <path d="M22,36 Q32,43 42,36" stroke="#9333ea" strokeWidth="2" fill="none" strokeLinecap="round" />

      {/* Cheeks (purple tinted) */}
      <circle cx="13" cy="34" r="4" fill="#d8b4fe" opacity="0.55" />
      <circle cx="51" cy="34" r="4" fill="#d8b4fe" opacity="0.55" />

      {/* Open log book (right side) */}
      <path d="M44,28 H57 Q58,28 58,29.5 V44 H44 Z"
        fill="#ffffff" stroke="#7e22ce" strokeWidth="1.5" />
      <path d="M44,28 H31 Q30,28 30,29.5 V44 H44 Z"
        fill="#ede9fe" stroke="#7e22ce" strokeWidth="1.5" />
      {/* Page spine */}
      <line x1="44" y1="28" x2="44" y2="44" stroke="#f97316" strokeWidth="2" />
      {/* Log lines */}
      <line x1="33" y1="32" x2="42" y2="32" stroke="#9333ea" strokeWidth="1" />
      <line x1="33" y1="36" x2="42" y2="36" stroke="#9333ea" strokeWidth="1" />
      <line x1="33" y1="40" x2="40" y2="40" stroke="#9333ea" strokeWidth="0.8" />
      <line x1="47" y1="32" x2="56" y2="32" stroke="#9333ea" strokeWidth="1" />
      <line x1="47" y1="36" x2="56" y2="36" stroke="#9333ea" strokeWidth="1" />
      <line x1="47" y1="40" x2="54" y2="40" stroke="#9333ea" strokeWidth="0.8" />

      {/* Pen (left hand) */}
      <line x1="10" y1="30" x2="26" y2="44" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="10" cy="30" r="2.5" fill="#f97316" />

      {/* Purple record flag */}
      <line x1="0" y1="9" x2="0" y2="28" stroke="#7e22ce" strokeWidth="2" strokeLinecap="round" />
      <path d="M0,9 H9 V18 H0 Z" fill="#a855f7" stroke="#7e22ce" strokeWidth="1" />
    </svg>
  );
}

/* ── Sprite map ── */
const SPRITE_MAP: Record<AgentId, (props: { size: number }) => React.JSX.Element> = {
  shikishima: ShikishimaSprite,
  shizume:    ShizumeSprite,
  hajime:     HajimeSprite,
  tsumugi:    TsumugiSprite,
  shirube:    ShirubeSprite,
};

export function PixelGhostSprite({ agentId, size = 64 }: PixelGhostSpriteProps): React.JSX.Element {
  const Sprite = SPRITE_MAP[agentId];
  return <Sprite size={size} />;
}
