import type { AutonomousGate } from "../../types/autonomous-gate-state";

const statusColor: Record<AutonomousGate["status"], string> = {
  PASS: "#3fb950",
  ONE_SHOT_PASS: "#7ee787",
  IMPLEMENTED: "#58a6ff",
  HOLD: "#f0883e",
  BLOCKED: "#f85149",
  DRAFT: "#a5d6ff",
  CRITICAL_HOLD: "#ff7b72",
};

const riskColor: Record<AutonomousGate["risk"], string> = {
  LOW: "#3fb950",
  MEDIUM: "#58a6ff",
  HIGH: "#f0883e",
  CRITICAL: "#f85149",
};

interface AutonomousGateCardProps {
  readonly gate: AutonomousGate;
}

export function AutonomousGateCard({
  gate,
}: AutonomousGateCardProps): React.JSX.Element {
  return (
    <article
      style={{
        background: "#0d1117",
        border: "1px solid #21262d",
        borderRadius: 6,
        padding: "10px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <strong style={{ color: "#c9d1d9", fontSize: 12 }}>{gate.id}</strong>
        <span
          style={{
            color: statusColor[gate.status],
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 10,
          }}
        >
          {gate.status}
        </span>
      </div>
      <div style={{ color: "#8b949e", fontSize: 11 }}>{gate.label}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        <span style={{ color: riskColor[gate.risk], fontSize: 10 }}>
          risk:{gate.risk}
        </span>
        <span style={{ color: "#8b949e", fontSize: 10 }}>Lv{gate.level}</span>
        <span style={{ color: "#8b949e", fontSize: 10 }}>
          run:{gate.allowedRunCount}
        </span>
      </div>
      <div style={{ color: "#c9d1d9", fontSize: 11 }}>{gate.nextAction}</div>
      <div style={{ color: "#6e7681", fontSize: 10 }}>
        forbidden: {gate.forbiddenActions.join(" / ")}
      </div>
    </article>
  );
}

