/**
 * WorkerRouteCard — display-only card for one worker routing rule.
 * No auto-dispatch. No action buttons.
 * Design spec: AT_11_WORKER_ROUTING_HANDOFF_PROMPT_PANEL_EVIDENCE.md
 */

import type { WorkerRoute } from "../../types/agent-theater-types";
import { RouteWorkerBadge } from "./RouteWorkerBadge";

interface WorkerRouteCardProps {
  readonly route: WorkerRoute;
  readonly lang?: "ja" | "en";
}

export function WorkerRouteCard({ route, lang = "ja" }: WorkerRouteCardProps): React.JSX.Element {
  const levelColor = route.humanGoRequired ? "#f0883e" : "#3fb950";
  const allowed = lang === "ja" ? route.allowedJa : route.allowedEn;
  const forbidden = lang === "ja" ? route.forbiddenJa : route.forbiddenEn;

  return (
    <div
      style={{
        background: "#161b22",
        border: "1px solid #21262d",
        borderLeft: `3px solid ${route.accentColor}`,
        borderRadius: 4,
        padding: "9px 11px",
        display: "flex",
        flexDirection: "column" as const,
        gap: 5,
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      {/* Worker name + level badge */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4, flexWrap: "wrap" }}>
        <RouteWorkerBadge worker={route.recommendedWorker} accentColor={route.accentColor} humanGoRequired={route.humanGoRequired} />
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 7,
            color: levelColor,
            border: `1px solid ${levelColor}`,
            borderRadius: 2,
            padding: "0 3px",
            whiteSpace: "nowrap" as const,
            flexShrink: 0,
          }}
        >
          {route.autonomyLevelLabel}
        </span>
      </div>

      {/* Task type */}
      <span
        style={{
          fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif',
          fontSize: 9,
          color: "#c9d1d9",
          lineHeight: 1.3,
          overflowWrap: "anywhere" as const,
        }}
      >
        {lang === "ja" ? route.taskTypeJa : route.taskTypeEn}
      </span>

      {/* Handoff mode */}
      <span
        style={{
          fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
          fontSize: 8,
          color: "#6e7681",
          overflowWrap: "anywhere" as const,
        }}
      >
        {lang === "ja" ? route.handoffModeJa : route.handoffModeEn}
      </span>

      {/* Divider */}
      <div style={{ height: 1, background: "#21262d" }} />

      {/* Plain reason */}
      <span
        style={{
          fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif',
          fontSize: 8,
          color: "#8b949e",
          fontStyle: "italic",
          lineHeight: 1.3,
          overflowWrap: "anywhere" as const,
        }}
      >
        {lang === "ja" ? route.plainReasonJa : route.plainReasonEn}
      </span>

      {/* Allowed actions */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {allowed.map((a) => (
          <span
            key={a}
            style={{
              fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
              fontSize: 7,
              color: "#3fb950",
              border: "1px solid #21262d",
              borderRadius: 2,
              padding: "0 3px",
              whiteSpace: "nowrap" as const,
            }}
          >
            ✓ {a}
          </span>
        ))}
      </div>

      {/* Forbidden actions */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {forbidden.map((f) => (
          <span
            key={f}
            style={{
              fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
              fontSize: 7,
              color: "#f85149",
              border: "1px solid #21262d",
              borderRadius: 2,
              padding: "0 3px",
              whiteSpace: "nowrap" as const,
            }}
          >
            ✗ {f}
          </span>
        ))}
      </div>

      {/* Human GO badge if required */}
      {route.humanGoRequired && (
        <span
          style={{
            fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
            fontSize: 7,
            color: "#f0883e",
            border: "1px solid #f0883e",
            borderRadius: 2,
            padding: "1px 4px",
            alignSelf: "flex-start" as const,
          }}
        >
          {lang === "ja" ? "人間GO必須" : "HUMAN GO REQUIRED"}
        </span>
      )}
    </div>
  );
}
