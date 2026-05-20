import { autonomousNextActionOrder } from "../../types/autonomous-gate-state";

export function AutonomousPhaseRoadmap(): React.JSX.Element {
  return (
    <section
      style={{
        background: "#161b22",
        border: "1px solid #21262d",
        borderRadius: 6,
        padding: 12,
      }}
    >
      <h3 style={{ margin: 0, color: "#c9d1d9", fontSize: 13 }}>
        Next Gate Order
      </h3>
      <ol style={{ margin: "10px 0 0", paddingLeft: 20, color: "#8b949e" }}>
        {autonomousNextActionOrder.map((item) => (
          <li key={item} style={{ marginBottom: 4, fontSize: 11 }}>
            {item}
          </li>
        ))}
      </ol>
    </section>
  );
}

