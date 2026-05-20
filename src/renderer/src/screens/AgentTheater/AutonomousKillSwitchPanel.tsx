const rules = [
  "all gates return to HOLD after run",
  "one action at a time",
  "no retry loop",
  "no background daemon",
  "no auto-escalation",
  "human can stop all gates",
] as const;

export function AutonomousKillSwitchPanel(): React.JSX.Element {
  return (
    <section
      style={{
        background: "#1c1414",
        border: "1px solid #f8514944",
        borderRadius: 6,
        padding: 12,
      }}
    >
      <h3 style={{ margin: 0, color: "#ff7b72", fontSize: 13 }}>
        Kill Switch / Runaway Guard
      </h3>
      <div style={{ marginTop: 8, color: "#8b949e", fontSize: 11 }}>
        Display only. No stop button is wired here.
      </div>
      <ul style={{ margin: "10px 0 0", paddingLeft: 18, color: "#c9d1d9" }}>
        {rules.map((item) => (
          <li key={item} style={{ marginBottom: 4, fontSize: 11 }}>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

