/**
 * LibrarySafetyStrip — library-specific safety state display.
 * Always shows: productionReady:false, execution:disabled,
 * rawValuesReported:false, local write:HOLD, cloud:disabled.
 * Design spec: OBS_LIB_04_LOCAL_WRITE_GATE_POLICY.md
 */

interface LibrarySafetyStripProps {
  readonly localWriteEnabled: false;
}

export function LibrarySafetyStrip({ localWriteEnabled }: LibrarySafetyStripProps): React.JSX.Element {
  const chips = [
    { label: "productionReady", value: "false", color: "#f85149" },
    { label: "execution", value: "disabled", color: "#f85149" },
    { label: "rawValues", value: "hidden", color: "#6e7681" },
    { label: "local write", value: localWriteEnabled ? "enabled" : "HOLD", color: localWriteEnabled ? "#3fb950" : "#f0883e" },
    { label: "external sync", value: "disabled", color: "#6e7681" },
    { label: "cloud", value: "disabled", color: "#6e7681" },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        flexWrap: "wrap" as const,
        padding: "5px 16px",
        borderBottom: "1px solid #21262d",
        background: "#080c14",
        flexShrink: 0,
      }}
    >
      <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 9, color: "#484f58", letterSpacing: 0.5, flexShrink: 0 }}>
        記録庫 · Library
      </span>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" as const }}>
        {chips.map(({ label, value, color }) => (
          <span key={label} style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 9, color: "#484f58" }}>
            {label}:
            <span style={{ color, marginLeft: 3 }}>{value}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
