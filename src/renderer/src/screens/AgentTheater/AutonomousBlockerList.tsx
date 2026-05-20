const blockers = [
  "productionReady true remains HOLD",
  "execution enabled remains HOLD",
  "all Level 5 actions require explicit human GO",
  "no hidden retry loop or background daemon",
  "StackChan is deferred outside this core panel",
] as const;

export function AutonomousBlockerList(): React.JSX.Element {
  return (
    <section
      style={{
        background: "#161b22",
        border: "1px solid #30363d",
        borderRadius: 6,
        padding: 12,
      }}
    >
      <h3 style={{ margin: 0, color: "#c9d1d9", fontSize: 13 }}>
        Blockers Remaining
      </h3>
      <ul style={{ margin: "10px 0 0", paddingLeft: 18, color: "#8b949e" }}>
        {blockers.map((item) => (
          <li key={item} style={{ marginBottom: 4, fontSize: 11 }}>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

