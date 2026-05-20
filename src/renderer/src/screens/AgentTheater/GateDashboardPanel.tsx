/**
 * GateDashboardPanel (AT-12) — compact gate status dashboard.
 * Groups all active gates by series. Color-coded status. Display-only.
 * Design spec: FUTURE_GATE_REGISTRY.md — AT-12
 */

interface GateEntry { readonly id: string; readonly status: string; readonly color: string }
interface GateGroup { readonly series: string; readonly gates: readonly GateEntry[] }

const GATE_GROUPS: readonly GateGroup[] = [
  { series: "DIS", gates: [
    { id: "DIS-01", status: "ONE_SHOT_PASS", color: "#3fb950" },
    { id: "DIS-02", status: "IMPLEMENTED",   color: "#58a6ff" },
    { id: "DIS-03", status: "HOLD",          color: "#f0883e" },
    { id: "DIS-04", status: "DEFERRED",      color: "#6e7681" },
  ]},
  { series: "OB / LIB", gates: [
    { id: "OB-01",       status: "ONE_SHOT_PASS", color: "#3fb950" },
    { id: "OBS-LIB-02",  status: "DRY-RUN IMPL",  color: "#58a6ff" },
    { id: "OBS-LIB-04",  status: "ONE_SHOT_PASS", color: "#3fb950" },
    { id: "OBS-LIB-05",  status: "HOLD",          color: "#f0883e" },
  ]},
  { series: "XS / AUTO", gates: [
    { id: "XS-01",       status: "PASS (closed)", color: "#3fb950" },
    { id: "XS-AUTO-00",  status: "DISPLAY",       color: "#58a6ff" },
    { id: "XS-AUTO-03",  status: "HOLD",          color: "#f0883e" },
  ]},
  { series: "SC", gates: [
    { id: "SC-PC-02",    status: "PASS_CAND",  color: "#58a6ff" },
    { id: "SC-FACE-01",  status: "PARTIAL",    color: "#f0883e" },
    { id: "SC-FACE-03",  status: "RESEARCH",   color: "#58a6ff" },
    { id: "SC-DISP-01",  status: "HOLD",       color: "#f0883e" },
  ]},
  { series: "AT", gates: [
    { id: "AT-09",  status: "COMPLETE",    color: "#3fb950" },
    { id: "AT-10",  status: "IMPLEMENTED", color: "#58a6ff" },
    { id: "AT-11",  status: "IMPLEMENTED", color: "#58a6ff" },
    { id: "AT-12",  status: "IMPLEMENTED", color: "#58a6ff" },
    { id: "AT-15",  status: "PASS",        color: "#3fb950" },
  ]},
  { series: "HB / CC", gates: [
    { id: "HB-01", status: "HOLD", color: "#f0883e" },
    { id: "CC-03", status: "HOLD", color: "#f0883e" },
  ]},
  { series: "Critical", gates: [
    { id: "productionReady", status: "HOLD", color: "#f85149" },
    { id: "execution",       status: "HOLD", color: "#f85149" },
  ]},
];

interface GateDashboardPanelProps {
  readonly lang?: "ja" | "en";
}

export function GateDashboardPanel({ lang = "ja" }: GateDashboardPanelProps): React.JSX.Element {
  const allGates = GATE_GROUPS.flatMap((g) => g.gates);
  const passCount = allGates.filter((g) => g.color === "#3fb950").length;

  return (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: 12, marginTop: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" as const, borderBottom: "1px solid #21262d", paddingBottom: 8 }}>
        <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 12, fontWeight: 700, color: "#c9d1d9" }}>
          {lang === "ja" ? "ゲート ダッシュボード · AT-12" : "Gate Dashboard · AT-12"}
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#3fb950", border: "1px solid #3fb95044", borderRadius: 2, padding: "2px 6px" }}>{passCount} PASS</span>
          <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, color: "#6e7681", border: "1px solid #6e768144", borderRadius: 2, padding: "2px 6px" }}>{allGates.length} total</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 8 }}>
        {GATE_GROUPS.map((group) => (
          <div key={group.series} style={{ background: "#161b22", border: "1px solid #21262d", borderRadius: 4, padding: "8px 12px", display: "flex", flexDirection: "column" as const, gap: 4 }}>
            <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 10, fontWeight: 700, color: "#8b949e", borderBottom: "1px solid #21262d", paddingBottom: 4, marginBottom: 2 }}>{group.series}</span>
            {group.gates.map((gate) => (
              <div key={gate.id} style={{ display: "flex", justifyContent: "space-between", gap: 4 }}>
                <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 9, color: "#6e7681" }}>{gate.id}</span>
                <span style={{ fontFamily: '"IBM Plex Mono", ui-monospace, monospace', fontSize: 9, color: gate.color }}>{gate.status}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ background: "#161b22", border: "1px solid #6e768133", borderRadius: 4, padding: "8px 12px" }}>
        <span style={{ fontFamily: '"IBM Plex Sans", "Inter", system-ui, sans-serif', fontSize: 11, color: "#8b949e" }}>
          {lang === "ja" ? "表示のみ。各ゲートの実行には個別の human GO が必要です。" : "Display only. Each gate requires individual human GO to execute."}
        </span>
      </div>
    </div>
  );
}
