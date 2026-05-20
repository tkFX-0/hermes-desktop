export function AutonomousNextActionPanel(): React.JSX.Element {
  return (
    <section
      style={{
        background: "#101820",
        border: "1px solid #58a6ff44",
        borderRadius: 6,
        padding: 12,
      }}
    >
      <h3 style={{ margin: 0, color: "#a5d6ff", fontSize: 13 }}>
        Morning Human Checklist
      </h3>
      <ul style={{ margin: "10px 0 0", paddingLeft: 18, color: "#c9d1d9" }}>
        {[
          "check latest HEAD/origin",
          "check typecheck result",
          "review autonomous panel",
          "review GO forms",
          "choose XS-AUTO-03 or CC-03",
          "do not approve productionReady yet",
        ].map((item) => (
          <li key={item} style={{ marginBottom: 4, fontSize: 11 }}>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

