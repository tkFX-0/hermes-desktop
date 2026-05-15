const card: React.CSSProperties = { background: "#161b22", border: "1px solid #30363d", borderRadius: 8, padding: 14, marginBottom: 12 };
const heading: React.CSSProperties = { fontSize: 15, fontWeight: 600, color: "#58a6ff", marginBottom: 12 };
const muted: React.CSSProperties = { color: "#8b949e", fontSize: 12 };
const row: React.CSSProperties = { display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 7 };

export default function MobilePushReadiness(): React.JSX.Element {
  return (
    <div>
      <div style={card}>
        <div style={heading}>Push 準備状態</div>

        <div style={{ background: "#0d1117", border: "1px solid #3fb950", borderRadius: 6, padding: "8px 12px", marginBottom: 12 }}>
          <div style={{ fontSize: 13, color: "#3fb950", fontWeight: 600 }}>✓ 同期済み — pushするものなし</div>
        </div>

        <div style={row}><span style={muted}>branch</span><span style={{ color: "#c9d1d9", fontFamily: "ui-monospace, monospace", fontSize: 12 }}>main</span></div>
        <div style={row}><span style={muted}>HEAD</span><span style={{ color: "#c9d1d9", fontFamily: "ui-monospace, monospace", fontSize: 12 }}>c9ff6df</span></div>
        <div style={row}><span style={muted}>origin/main</span><span style={{ color: "#c9d1d9", fontFamily: "ui-monospace, monospace", fontSize: 12 }}>c9ff6df</span></div>
        <div style={row}><span style={muted}>commits_ahead</span><span style={{ color: "#3fb950", fontWeight: 600 }}>0</span></div>
        <div style={row}><span style={muted}>staged_files</span><span style={{ color: "#3fb950", fontWeight: 600 }}>0</span></div>
        <div style={{ ...row, marginBottom: 0 }}><span style={muted}>dirty_tracked</span><span style={{ color: "#3fb950", fontWeight: 600 }}>0</span></div>
      </div>

      <div style={{ ...card, background: "#0d1117", border: "1px solid rgba(251,146,60,0.4)" }}>
        <div style={{ fontSize: 12, color: "#fb923c", lineHeight: 1.5 }}>
          ⚠ Push GO は別途発行が必要<br />
          このUIからpushは実行できません
        </div>
      </div>

      <div style={{ ...muted, textAlign: "center", padding: "4px 0" }}>
        Phase 1 — 静的表示 / 実データ未接続
      </div>
    </div>
  );
}
