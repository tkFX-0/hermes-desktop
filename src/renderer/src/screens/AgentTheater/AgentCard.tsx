/**
 * AgentCard — single pixel ghost agent card (CSS placeholder, no sprite).
 * Shows: ghost shape + flag dot + name + pose badge.
 * Display-only. No execute/push buttons.
 * Design spec: PIXEL_GHOST_AGENT_CHARACTER_SPEC.md
 */

import type { AgentId, PoseState } from "../../types/agent-theater-types";

interface AgentSpec {
  readonly nameJa: string;
  readonly nameEn: string;
  readonly flagColor: string;
}

const AGENT_SPECS: Readonly<Record<AgentId, AgentSpec>> = {
  shikishima: { nameJa: "しきしま", nameEn: "Shikishima", flagColor: "var(--go, #2563eb)" },
  shizume:    { nameJa: "しずめ",   nameEn: "Shizume",    flagColor: "var(--hold, #d97706)" },
  hajime:     { nameJa: "はじめ",   nameEn: "Hajime",     flagColor: "var(--pass, #16a34a)" },
  tsumugi:    { nameJa: "つむぎ",   nameEn: "Tsumugi",    flagColor: "#f97316" },
  shirube:    { nameJa: "しるべ",   nameEn: "Shirube",    flagColor: "#a855f7" },
};

const POSE_LABELS: Readonly<Record<PoseState, { ja: string; en: string }>> = {
  idle:              { ja: "待機",       en: "Idle" },
  thinking:          { ja: "確認中",     en: "Checking" },
  working:           { ja: "作業中",     en: "Working" },
  handoff_send:      { ja: "引き渡し",   en: "Sending" },
  handoff_receive:   { ja: "受け取り",   en: "Receiving" },
  waiting_human_go:  { ja: "GO待ち",     en: "Await GO" },
  pass:              { ja: "通過",       en: "Pass" },
  hold_stop_blocked: { ja: "HOLD",       en: "HOLD" },
};

const POSE_COLOR: Readonly<Record<PoseState, string>> = {
  idle:              "var(--ink3, #9ca3af)",
  thinking:          "var(--go, #2563eb)",
  working:           "var(--go, #2563eb)",
  handoff_send:      "var(--pass, #16a34a)",
  handoff_receive:   "var(--pass, #16a34a)",
  waiting_human_go:  "var(--hold, #d97706)",
  pass:              "var(--pass, #16a34a)",
  hold_stop_blocked: "var(--stop, #dc2626)",
};

interface AgentCardProps {
  readonly agentId: AgentId;
  readonly pose: PoseState;
  readonly lang?: "ja" | "en";
}

export function AgentCard({ agentId, pose, lang = "ja" }: AgentCardProps) {
  const spec = AGENT_SPECS[agentId];
  const poseLabel = lang === "ja" ? POSE_LABELS[pose].ja : POSE_LABELS[pose].en;
  const poseColor = POSE_COLOR[pose];
  const name = lang === "ja" ? spec.nameJa : spec.nameEn;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        padding: "12px 10px",
        background: "var(--paper, #ffffff)",
        border: "1px solid var(--rule, #e5e7eb)",
        borderRadius: 6,
        minWidth: 88,
      }}
    >
      {/* CSS ghost placeholder */}
      <div
        style={{
          width: 38,
          height: 46,
          background: "var(--paper, #ffffff)",
          border: "2px solid var(--go, #2563eb)",
          borderRadius: "50% 50% 46% 46%",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-hidden
      >
        {/* Flag color dot */}
        <span
          style={{
            position: "absolute",
            top: -4,
            right: -5,
            width: 9,
            height: 9,
            borderRadius: "50%",
            background: spec.flagColor,
            border: "1.5px solid var(--paper, #ffffff)",
          }}
        />
        {/* Eyes */}
        <div style={{ display: "flex", gap: 5, marginTop: -4 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--go, #2563eb)" }} />
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--go, #2563eb)" }} />
        </div>
      </div>

      {/* Name */}
      <span
        style={{
          fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
          fontSize: 11,
          fontWeight: 700,
          color: "var(--ink, #111827)",
          letterSpacing: 0.3,
        }}
      >
        {name}
      </span>

      {/* Pose badge */}
      <span
        style={{
          fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
          fontSize: 9,
          color: poseColor,
          border: `1px solid ${poseColor}`,
          borderRadius: 2,
          padding: "1px 5px",
          letterSpacing: 0.5,
        }}
      >
        {poseLabel}
      </span>
    </div>
  );
}
