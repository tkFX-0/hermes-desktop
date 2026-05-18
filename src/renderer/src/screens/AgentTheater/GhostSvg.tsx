/**
 * GhostSvg — inline SVG pixel-ghost characters for each agent.
 * Original vector artwork. No external assets.
 * Design spec: PIXEL_GHOST_AGENT_CHARACTER_SPEC.md
 * Phase: AT-03 (replaces CSS div placeholder from AT-02)
 */

import type { AgentId } from "../../types/agent-theater-types";

interface GhostSvgProps {
  readonly agentId: AgentId;
  readonly size?: number;
}

/* ── Shared ghost body path (32×38 viewBox) ── */
const BODY_PATH =
  "M16,2 C3,2 3,14 3,20 L3,30 Q5.5,34 8,30 Q10.5,26 13,30 Q15.5,34 16,30 Q16.5,26 19,30 Q21.5,34 24,30 Q26.5,26 29,30 L29,20 C29,14 29,2 16,2 Z";

/* ── Per-agent definitions ── */

function ShikishimaGhost({ size }: { size: number }) {
  const s = size / 32;
  return (
    <svg
      width={size}
      height={Math.round(size * 1.25)}
      viewBox="0 0 32 40"
      fill="none"
      aria-hidden
    >
      {/* Body */}
      <path d={BODY_PATH} fill="#eef2ff" stroke="#3b82f6" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Calm sleepy eyes — thin horizontal dashes */}
      <rect x="10" y="16" width="4" height="2" rx="1" fill="#3b82f6" />
      <rect x="18" y="16" width="4" height="2" rx="1" fill="#3b82f6" />
      {/* Headset arc */}
      <path d="M8,13 Q16,8 24,13" stroke="#3b82f6" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="7.5" cy="14" r="2" fill="#3b82f6" />
      <circle cx="24.5" cy="14" r="2" fill="#3b82f6" />
      {/* Flag dot — blue */}
      <circle cx={28 * s + (size - 28 * s) } cy="3" r="3.5" fill="#2563eb" stroke="#eef2ff" strokeWidth="1" transform={`translate(${size * 0.72},0)`} />
    </svg>
  );
}

function ShizumeGhost({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.25)}
      viewBox="0 0 32 40"
      fill="none"
      aria-hidden
    >
      {/* Body */}
      <path d={BODY_PATH} fill="#fffbeb" stroke="#3b82f6" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Sharp half-lidded eyes — angled lines */}
      <line x1="9" y1="15" x2="13" y2="18" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
      <line x1="23" y1="15" x2="19" y2="18" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
      {/* Whistle — small rect + cord */}
      <rect x="13" y="22" width="6" height="3" rx="1" fill="#d97706" />
      <line x1="16" y1="22" x2="16" y2="19" stroke="#d97706" strokeWidth="1" />
      {/* Safety vest stripe */}
      <line x1="6" y1="24" x2="26" y2="24" stroke="#d97706" strokeWidth="1.5" strokeDasharray="2 2" />
      {/* Flag dot — yellow */}
      <circle cx="3" cy="3" r="3.5" fill="#d97706" stroke="#fffbeb" strokeWidth="1" transform="translate(20,0)" />
    </svg>
  );
}

function HajimeGhost({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.25)}
      viewBox="0 0 32 40"
      fill="none"
      aria-hidden
    >
      {/* Body */}
      <path d={BODY_PATH} fill="#f0fdf4" stroke="#3b82f6" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Wide curious eyes — large circles */}
      <circle cx="12" cy="17" r="3" fill="#3b82f6" />
      <circle cx="20" cy="17" r="3" fill="#3b82f6" />
      {/* Highlight in eyes */}
      <circle cx="13" cy="16" r="1" fill="#eef2ff" />
      <circle cx="21" cy="16" r="1" fill="#eef2ff" />
      {/* Open mouth — small O */}
      <circle cx="16" cy="22" r="2" stroke="#3b82f6" strokeWidth="1.2" fill="none" />
      {/* Sticky note */}
      <rect x="20" y="8" width="7" height="6" rx="0.5" fill="#bbf7d0" stroke="#16a34a" strokeWidth="0.8" />
      <line x1="21" y1="10" x2="26" y2="10" stroke="#16a34a" strokeWidth="0.7" />
      <line x1="21" y1="12" x2="25" y2="12" stroke="#16a34a" strokeWidth="0.7" />
      {/* Flag dot — green */}
      <circle cx="3" cy="3" r="3.5" fill="#16a34a" stroke="#f0fdf4" strokeWidth="1" transform="translate(20,0)" />
    </svg>
  );
}

function TsumugiGhost({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.25)}
      viewBox="0 0 32 40"
      fill="none"
      aria-hidden
    >
      {/* Body */}
      <path d={BODY_PATH} fill="#fff7ed" stroke="#3b82f6" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Focused narrow eyes — thin horizontal ovals */}
      <ellipse cx="12" cy="17" rx="3" ry="1.5" fill="#3b82f6" />
      <ellipse cx="20" cy="17" rx="3" ry="1.5" fill="#3b82f6" />
      {/* Determined mouth — straight line */}
      <line x1="13" y1="22" x2="19" y2="22" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
      {/* Construction helmet */}
      <path d="M7,12 Q16,5 25,12" fill="#f97316" stroke="#ea580c" strokeWidth="1" />
      <line x1="6" y1="12.5" x2="26" y2="12.5" stroke="#ea580c" strokeWidth="1" />
      {/* Flag dot — orange */}
      <circle cx="3" cy="3" r="3.5" fill="#f97316" stroke="#fff7ed" strokeWidth="1" transform="translate(20,0)" />
    </svg>
  );
}

function ShirubeGhost({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.25)}
      viewBox="0 0 32 40"
      fill="none"
      aria-hidden
    >
      {/* Body */}
      <path d={BODY_PATH} fill="#faf5ff" stroke="#3b82f6" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Serene closed eyes — gentle curves */}
      <path d="M9,17 Q12,15 15,17" stroke="#3b82f6" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M17,17 Q20,15 23,17" stroke="#3b82f6" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* Gentle smile */}
      <path d="M13,22 Q16,25 19,22" stroke="#3b82f6" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* Headphone arc */}
      <path d="M7,16 Q7,8 16,8 Q25,8 25,16" stroke="#a855f7" strokeWidth="2" fill="none" strokeLinecap="round" />
      <rect x="4" y="15" width="4" height="5" rx="2" fill="#a855f7" />
      <rect x="24" y="15" width="4" height="5" rx="2" fill="#a855f7" />
      {/* Flag dot — purple */}
      <circle cx="3" cy="3" r="3.5" fill="#a855f7" stroke="#faf5ff" strokeWidth="1" transform="translate(20,0)" />
    </svg>
  );
}

const GHOST_MAP: Readonly<Record<AgentId, (props: { size: number }) => React.JSX.Element>> = {
  shikishima: ShikishimaGhost,
  shizume:    ShizumeGhost,
  hajime:     HajimeGhost,
  tsumugi:    TsumugiGhost,
  shirube:    ShirubeGhost,
};

export function GhostSvg({ agentId, size = 40 }: GhostSvgProps) {
  const Ghost = GHOST_MAP[agentId];
  return <Ghost size={size} />;
}
