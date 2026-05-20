/**
 * WorkerEnvironmentCard — display-only card for one controlled worker environment.
 * Shows provider, execution mode, max autonomy level, and safety notes.
 * No launch buttons. No execution controls. Copy-only / human-bridge only.
 * Design spec: WK_00_CONTROLLED_WORKER_ENVIRONMENT_DESIGN.md
 */

import type {
  ControlledWorkerEnvironment,
  WorkerEnvironmentStatus,
  WorkerExecutionMode,
} from "../../types/worker-environment-types";

const STATUS_STYLE: Record<WorkerEnvironmentStatus, { color: string; label: string }> = {
  READY:       { color: "#3fb950", label: "READY"       },
  BUSY:        { color: "#58a6ff", label: "BUSY"        },
  COOLDOWN:    { color: "#f59e0b", label: "COOLDOWN"    },
  DEGRADED:    { color: "#8b949e", label: "DEGRADED"    },
  BLOCKED:     { color: "#6e7681", label: "BLOCKED"     },
  FAILED:      { color: "#f85149", label: "FAILED"      },
  NEEDS_HUMAN: { color: "#f0883e", label: "NEEDS HUMAN" },
  HOLD:        { color: "#6e7681", label: "HOLD"        },
};

const MODE_LABEL: Record<WorkerExecutionMode, { label: string; color: string }> = {
  copy_only:                   { label: "copy-only",      color: "#58a6ff" },
  human_manual:                { label: "human manual",   color: "#f59e0b" },
  future_remote_control_hold:  { label: "remote — HOLD",  color: "#6e7681" },
  forbidden:                   { label: "forbidden",      color: "#f85149" },
};

interface WorkerEnvironmentCardProps {
  readonly env: ControlledWorkerEnvironment;
  readonly lang?: "ja" | "en";
}

export function WorkerEnvironmentCard({
  env,
  lang = "ja",
}: WorkerEnvironmentCardProps): React.JSX.Element {
  const st = STATUS_STYLE[env.currentStatus];
  const mode = MODE_LABEL[env.executionMode];

  return (
    <div
      style={{
        background: "#161b22",
        border: "1px solid #21262d",
        borderLeft: `3px solid ${env.accentColor}`,
        borderRadius: 4,
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column" as const,
        gap: 7,
        minWidth: 0,
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, flexWrap: "wrap" as const }}>
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 13, fontWeight: 700, color: env.accentColor }}>
          {lang === "ja" ? env.label : env.labelEn}
        </span>
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: st.color, border: `1px solid ${st.color}`, borderRadius: 2, padding: "2px 6px", whiteSpace: "nowrap" as const }}>
          {st.label}
        </span>
      </div>

      {/* Execution mode + level */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" as const }}>
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: mode.color, border: `1px solid ${mode.color}44`, borderRadius: 2, padding: "2px 6px" }}>
          {mode.label}
        </span>
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#8b949e" }}>
          max Level {env.maxAutonomyLevel}{env.maxAutonomyLevel < 5 ? " · Level 5: HOLD" : ""}
        </span>
      </div>

      {/* Allowed scope */}
      <span style={{ fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif', fontSize: 11, color: "#8b949e", lineHeight: 1.4 }}>
        {env.allowedScope}
      </span>

      {/* Notes */}
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 2 }}>
        {env.notes.map((note) => (
          <span key={note} style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#6e7681" }}>
            · {note}
          </span>
        ))}
      </div>

      {/* Human bridge notice */}
      {env.requiresHumanBridge && (
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#f0883e", borderTop: "1px solid #21262d", paddingTop: 6, marginTop: 2 }}>
          人間がコピーして渡す · human bridge required
        </span>
      )}
    </div>
  );
}
