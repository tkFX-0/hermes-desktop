/**
 * ControlRoomLayout — dark-themed night control room environment.
 * Contains: safety badge strip, 5 agent zones, handoff lane.
 * CSS-only ambient details (panels, monitor blocks, grid dots, night window).
 * Display-only. No execute/push/send buttons.
 * Design spec: AT_07_CONTROL_ROOM_ENVIRONMENT_LAYOUT_EVIDENCE.md
 */

import type { AgentId, AgentPoseMap } from "../../types/agent-theater-types";
import { ControlRoomZone } from "./ControlRoomZone";
import { HandoffLane } from "./HandoffLane";

const AGENT_IDS: readonly AgentId[] = [
  "shikishima",
  "shizume",
  "hajime",
  "tsumugi",
  "shirube",
];

// CSS-only night window panel
function NightWindow(): React.JSX.Element {
  return (
    <div
      style={{
        width: 52,
        height: 38,
        border: "1.5px solid #21262d",
        borderRadius: 2,
        background: "#040d21",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 2,
        padding: 3,
        flexShrink: 0,
      }}
    >
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            background: i === 1 || i === 2 ? "#0c1d3a" : "#040d21",
            border: "1px solid #1c2333",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {i === 1 && <div style={{ width: 3, height: 3, borderRadius: "50%", background: "#58a6ff", opacity: 0.6 }} />}
          {i === 2 && <div style={{ width: 2, height: 2, borderRadius: "50%", background: "#f59e0b", opacity: 0.5 }} />}
        </div>
      ))}
    </div>
  );
}

// Dot-grid decorative background strip
function DotGridStrip(): React.JSX.Element {
  return (
    <div
      style={{
        height: 6,
        backgroundImage: "radial-gradient(circle, #21262d 1px, transparent 1px)",
        backgroundSize: "8px 8px",
        opacity: 0.7,
        borderRadius: 2,
      }}
    />
  );
}

function decisionBadgeColor(decision: string): string {
  if (decision === "STOP") return "#f85149";
  if (decision === "PASS" || decision === "PASS_WITH_CAVEAT") return "#3fb950";
  if (decision === "GO_READY") return "#58a6ff";
  return "#f0883e";
}

const STATIC_BADGES = [
  { key: "execution",       value: "disabled" },
  { key: "productionReady", value: "false" },
  { key: "rawValues",       value: "hidden" },
  { key: "ext.write",       value: "false" },
  { key: "runtime",         value: "human GO" },
  { key: "push",            value: "human GO" },
] as const;

export interface ControlRoomLayoutProps {
  readonly decision: string;
  readonly poses: AgentPoseMap;
  readonly lang?: "ja" | "en";
}

export function ControlRoomLayout({ decision, poses, lang = "ja" }: ControlRoomLayoutProps): React.JSX.Element {
  const decColor = decisionBadgeColor(decision);

  return (
    <div
      style={{
        background: "#0d1117",
        borderRadius: 8,
        padding: "14px 12px 12px",
        border: "1px solid #21262d",
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      {/* Room header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        {/* Title + window */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flexWrap: "wrap" }}>
          <span
            style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: 9,
              letterSpacing: 1.5,
              color: "#58a6ff",
              textTransform: "uppercase" as const,
            }}
          >
            {lang === "ja" ? "🌙 CONTROL ROOM · 管制室" : "🌙 CONTROL ROOM"}
          </span>
          <NightWindow />
        </div>

        {/* Safety badge strip */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
          {/* Decision badge (dynamic) */}
          <span
            style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: 8,
              color: decColor,
              border: `1px solid ${decColor}`,
              borderRadius: 2,
              padding: "1px 5px",
              whiteSpace: "nowrap" as const,
            }}
          >
            decision: {decision}
          </span>
          {/* Static invariant badges */}
          {STATIC_BADGES.map((b) => (
            <span
              key={b.key}
              style={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: 8,
                color: "#6e7681",
                border: "1px solid #21262d",
                borderRadius: 2,
                padding: "1px 5px",
                whiteSpace: "nowrap" as const,
              }}
            >
              {b.key}: {b.value}
            </span>
          ))}
        </div>
      </div>

      {/* Dot grid accent */}
      <DotGridStrip />

      {/* Agent zone grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 128px), 1fr))",
          gap: 8,
          margin: "10px 0",
        }}
      >
        {AGENT_IDS.map((id) => (
          <ControlRoomZone key={id} agentId={id} pose={poses[id]} lang={lang} />
        ))}
      </div>

      {/* Dot grid accent */}
      <DotGridStrip />

      {/* Handoff lane */}
      <div style={{ marginTop: 10 }}>
        <div
          style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 9,
            letterSpacing: 1.2,
            color: "#6e7681",
            marginBottom: 6,
            textTransform: "uppercase" as const,
          }}
        >
          {lang === "ja" ? "引き渡しフロー" : "HANDOFF FLOW"}
        </div>
        <HandoffLane decision={decision} lang={lang} />
      </div>
    </div>
  );
}
