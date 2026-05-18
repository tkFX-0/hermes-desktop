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

function ShikishimaGhost({ size }: { size: number }): React.JSX.Element {
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
      <path d="M20,4 Q18,7 16,8 Q20,8 23,10" fill="#dbeafe" opacity="0.9" />
      {/* Attentive command eyes */}
      <rect x="10" y="16" width="3.6" height="5" rx="1" fill="#1d4ed8" />
      <rect x="19" y="16" width="3.6" height="5" rx="1" fill="#1d4ed8" />
      <path d="M13,25 Q16,27 19,25" stroke="#1d4ed8" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <circle cx="9" cy="22.5" r="1.3" fill="#fca5a5" opacity="0.9" />
      <circle cx="23" cy="22.5" r="1.3" fill="#fca5a5" opacity="0.9" />
      {/* Headset arc and mic boom */}
      <path d="M7,15 Q8,8 16,8 Q24,8 25,15" stroke="#1e3a8a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <rect x="4.8" y="13" width="4" height="7" rx="2" fill="#1e3a8a" />
      <rect x="23.2" y="13" width="4" height="7" rx="2" fill="#1e3a8a" />
      <path d="M23.5,20 Q22,23 19,23" stroke="#1e3a8a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <circle cx="18.5" cy="23" r="0.9" fill="#1e3a8a" />
      {/* Blue command flag */}
      <line x1="27" y1="8" x2="27" y2="28" stroke="#1e3a8a" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M27,9 H31 V16 H27 Z" fill="#2563eb" stroke="#1e40af" strokeWidth="0.8" />
      <text x="28.2" y="14.4" fontSize="4.8" fontWeight="700" fill="#ffffff">し</text>
    </svg>
  );
}

function ShizumeGhost({ size }: { size: number }): React.JSX.Element {
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
      {/* Safety cap with lamp */}
      <path d="M8,12 Q16,6 24,12" fill="#fde68a" stroke="#d97706" strokeWidth="1" />
      <rect x="6.5" y="12" width="19" height="2" rx="1" fill="#d97706" />
      <circle cx="8.5" cy="11.5" r="2.2" fill="#facc15" stroke="#b45309" strokeWidth="0.7" />
      {/* Sharp half-lidded stop-check eyes */}
      <line x1="9" y1="17" x2="13" y2="18.5" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" />
      <line x1="23" y1="17" x2="19" y2="18.5" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" />
      <path d="M13,24 Q16,22.5 19,24" stroke="#1d4ed8" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* Whistle and safety vest */}
      <circle cx="16" cy="25.2" r="2.1" fill="#f59e0b" stroke="#92400e" strokeWidth="0.8" />
      <path d="M14.8,25.2 H18.6" stroke="#fffbeb" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="16" y1="23" x2="16" y2="20" stroke="#d97706" strokeWidth="1" />
      <path d="M7,27 L13,22 M25,27 L19,22" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
      {/* HOLD sign */}
      <line x1="27" y1="9" x2="27" y2="28" stroke="#92400e" strokeWidth="1.1" strokeLinecap="round" />
      <rect x="21.5" y="8" width="10" height="6.5" rx="0.8" fill="#dc2626" stroke="#991b1b" strokeWidth="0.8" />
      <text x="22.5" y="12.8" fontSize="3.7" fontWeight="800" fill="#ffffff">HOLD</text>
    </svg>
  );
}

function HajimeGhost({ size }: { size: number }): React.JSX.Element {
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
      {/* Wide curious planning eyes */}
      <circle cx="12" cy="16.5" r="2.6" fill="#1d4ed8" />
      <circle cx="20" cy="16.5" r="2.6" fill="#1d4ed8" />
      {/* Highlight in eyes */}
      <circle cx="12.8" cy="15.6" r="0.9" fill="#eef2ff" />
      <circle cx="20.8" cy="15.6" r="0.9" fill="#eef2ff" />
      <path d="M13,23 Q16,25 19,23" stroke="#1d4ed8" strokeWidth="1.1" fill="none" strokeLinecap="round" />
      {/* Folded map and route dots */}
      <path d="M5,24 L12,21 L19,24 L27,21 V29 L20,32 L13,29 L5,32 Z" fill="#bbf7d0" stroke="#16a34a" strokeWidth="0.9" />
      <path d="M12,21 V29 M19,24 V32" stroke="#22c55e" strokeWidth="0.7" />
      <path d="M8,28 C12,24 17,29 23,25" stroke="#15803d" strokeWidth="0.9" fill="none" strokeLinecap="round" strokeDasharray="1.4 1.4" />
      <circle cx="9" cy="27" r="1" fill="#16a34a" />
      <circle cx="23" cy="25" r="1" fill="#16a34a" />
      {/* Thinking bubble */}
      <circle cx="25" cy="10" r="3" fill="#ffffff" stroke="#16a34a" strokeWidth="0.8" />
      <text x="23.9" y="11.7" fontSize="4.5" fontWeight="800" fill="#16a34a">?</text>
    </svg>
  );
}

function TsumugiGhost({ size }: { size: number }): React.JSX.Element {
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
      <path d="M7,12 Q16,5 25,12" fill="#facc15" stroke="#d97706" strokeWidth="1" />
      <line x1="6" y1="12.5" x2="26" y2="12.5" stroke="#d97706" strokeWidth="1" />
      <line x1="12" y1="7.8" x2="12" y2="12.2" stroke="#d97706" strokeWidth="0.8" />
      <line x1="16" y1="6.6" x2="16" y2="12.4" stroke="#d97706" strokeWidth="0.8" />
      <line x1="20" y1="7.8" x2="20" y2="12.2" stroke="#d97706" strokeWidth="0.8" />
      {/* Tool case and wrench */}
      <rect x="20.5" y="24" width="8" height="5.5" rx="1" fill="#92400e" stroke="#451a03" strokeWidth="0.8" />
      <rect x="23" y="22.8" width="3" height="1.5" rx="0.6" fill="#451a03" />
      <path d="M8,27 L13,24 M12,24 L14,26" stroke="#64748b" strokeWidth="1.3" strokeLinecap="round" />
      {/* Orange work flag */}
      <line x1="27.5" y1="9" x2="27.5" y2="22" stroke="#ea580c" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M27.5,9 H31 V15 H27.5 Z" fill="#f97316" stroke="#ea580c" strokeWidth="0.8" />
    </svg>
  );
}

function ShirubeGhost({ size }: { size: number }): React.JSX.Element {
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
      <path d="M24,20 Q22.5,23 19,23" stroke="#a855f7" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* Log book */}
      <path d="M9,25 H16.2 Q17.5,25 17.5,26.3 V31 H10 Q8.5,31 8.5,29.5 V26.4 Q8.5,25 9,25 Z" fill="#ffffff" stroke="#7e22ce" strokeWidth="0.9" />
      <path d="M17.5,26.3 Q18.5,25 20,25 H24 V31 H17.5 Z" fill="#ede9fe" stroke="#7e22ce" strokeWidth="0.9" />
      <line x1="11" y1="27.2" x2="15.5" y2="27.2" stroke="#a855f7" strokeWidth="0.7" />
      <line x1="19" y1="27.2" x2="22.5" y2="27.2" stroke="#a855f7" strokeWidth="0.7" />
      <path d="M21.5,25 V30.8" stroke="#f97316" strokeWidth="0.8" />
      {/* Purple record flag */}
      <line x1="26.5" y1="7.5" x2="26.5" y2="20" stroke="#7e22ce" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M26.5,8 H31 V14 H26.5 Z" fill="#a855f7" stroke="#7e22ce" strokeWidth="0.8" />
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

export function GhostSvg({ agentId, size = 40 }: GhostSvgProps): React.JSX.Element {
  const Ghost = GHOST_MAP[agentId];
  return <Ghost size={size} />;
}
