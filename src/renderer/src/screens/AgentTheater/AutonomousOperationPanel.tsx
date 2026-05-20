import { autonomousGates } from "../../types/autonomous-gate-state";
import { autonomousOperationSummary } from "../../types/autonomous-operation-types";
import { AutonomousBlockerList } from "./AutonomousBlockerList";
import { AutonomousGateCard } from "./AutonomousGateCard";
import { AutonomousKillSwitchPanel } from "./AutonomousKillSwitchPanel";
import { AutonomousNextActionPanel } from "./AutonomousNextActionPanel";
import { AutonomousPhaseRoadmap } from "./AutonomousPhaseRoadmap";

export function AutonomousOperationPanel(): React.JSX.Element {
  return (
    <section
      style={{
        marginTop: 16,
        background: "#0b1220",
        border: "1px solid #26364f",
        borderRadius: 8,
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <header>
        <h2 style={{ margin: 0, color: "#c9d1d9", fontSize: 15 }}>
          Autonomous Operation Readiness
        </h2>
        <p style={{ margin: "6px 0 0", color: "#8b949e", fontSize: 11 }}>
          Display-only. No execution buttons, no connect buttons, no send
          buttons, no productionReady toggle, no execution toggle.
        </p>
      </header>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {[
          ["productionReady", String(autonomousOperationSummary.productionReady)],
          ["execution", autonomousOperationSummary.execution],
          ["rawValuesReported", String(autonomousOperationSummary.rawValuesReported)],
          ["completion", autonomousOperationSummary.estimatedCompletion],
          ["human-supervised v1", autonomousOperationSummary.humanSupervisedV1],
          ["limited autonomous v2", autonomousOperationSummary.limitedAutonomousV2],
        ].map(([key, value]) => (
          <span
            key={key}
            style={{
              border: "1px solid #30363d",
              borderRadius: 999,
              padding: "4px 8px",
              color: "#c9d1d9",
              fontSize: 10,
              fontFamily: '"IBM Plex Mono", monospace',
            }}
          >
            {key}: {value}
          </span>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 10,
        }}
      >
        {autonomousGates.map((gate) => (
          <AutonomousGateCard key={gate.id} gate={gate} />
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 10,
        }}
      >
        <AutonomousPhaseRoadmap />
        <AutonomousBlockerList />
        <AutonomousKillSwitchPanel />
        <AutonomousNextActionPanel />
      </div>
    </section>
  );
}

