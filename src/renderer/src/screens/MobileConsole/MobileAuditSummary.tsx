const card: React.CSSProperties = { background: "#161b22", border: "1px solid #30363d", borderRadius: 8, padding: 14, marginBottom: 12 };
const heading: React.CSSProperties = { fontSize: 15, fontWeight: 600, color: "#3fb950", marginBottom: 12 };
const muted: React.CSSProperties = { color: "#8b949e", fontSize: 12 };
const row: React.CSSProperties = { display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 };

const RECENT = [
  { time: "11:20", event: "iPhone Private Console 設計完了", type: "docs" },
  { time: "11:07", event: "Session-009 STOP (外部インストーラー検出)", type: "stop" },
  { time: "01:48", event: "Control Center redesign commit + push", type: "commit" },
  { time: "01:35", event: "SSRF修正 + research/suppressive agent追加", type: "commit" },
  { time: "01:03", event: "日本語ロケール + StackChan + CI/CD", type: "commit" },
];

const TYPE_COLOR: Record<string, string> = {
  docs: "#58a6ff",
  stop: "#f85149",
  commit: "#3fb950",
  pass: "#a371f7",
};

export default function MobileAuditSummary(): React.JSX.Element {
  return (
    <div>
      <div style={card}>
        <div style={heading}>証跡サマリー</div>

        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          {[
            { label: "承認待ち", value: "0", color: "#8b949e" },
            { label: "監査件数", value: "≈12", color: "#d29922" },
            { label: "メモリ候補", value: "≈3", color: "#a371f7" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ flex: 1, background: "#0d1117", border: `1px solid ${color}44`, borderRadius: 6, padding: "8px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color }}>{value}</div>
              <div style={{ ...muted, fontSize: 11 }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ ...muted, marginBottom: 8 }}>最近の操作 (2026-05-15)</div>
        {RECENT.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
            <span style={{ ...muted, fontSize: 11, minWidth: 36, paddingTop: 2 }}>{item.time}</span>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: TYPE_COLOR[item.type] ?? "#8b949e", marginTop: 5, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "#c9d1d9", lineHeight: 1.4 }}>{item.event}</span>
          </div>
        ))}
      </div>

      <div style={row}>
        <span style={muted}>B3 CLEAN PASS</span>
        <span style={{ color: "#3fb950", fontWeight: 600 }}>4 / 5</span>
      </div>
    </div>
  );
}
