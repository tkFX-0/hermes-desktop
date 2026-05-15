import MobileSafetyBanner from "./MobileSafetyBanner";

const card: React.CSSProperties = { background: "#161b22", border: "1px solid #30363d", borderRadius: 8, padding: 14, marginBottom: 12 };
const heading: React.CSSProperties = { fontSize: 15, fontWeight: 600, color: "#58a6ff", marginBottom: 12 };
const row: React.CSSProperties = { display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 };
const muted: React.CSSProperties = { color: "#8b949e" };
const chip = (color: string): React.CSSProperties => ({
  background: `${color}18`,
  border: `1px solid ${color}55`,
  borderRadius: 4,
  padding: "2px 8px",
  color,
  fontSize: 12,
  fontWeight: 600,
});

export default function MobileStatusCard(): React.JSX.Element {
  return (
    <div>
      <MobileSafetyBanner />
      <div style={card}>
        <div style={heading}>しきしま 状態</div>
        <div style={row}><span style={muted}>appStatus</span><span style={chip("#3fb950")}>initialized</span></div>
        <div style={row}><span style={muted}>bridgeReadiness</span><span style={{ color: "#d29922", fontSize: 13 }}>dry_run_only</span></div>
        <div style={row}><span style={muted}>ブロッカー</span><span style={{ color: "#f85149", fontWeight: 600 }}>0</span></div>
        <div style={row}><span style={muted}>警告</span><span style={{ color: "#d29922", fontWeight: 600 }}>0</span></div>
        <div style={{ ...row, marginBottom: 0 }}><span style={muted}>productionReady</span><span style={chip("#f85149")}>false</span></div>
      </div>
      <div style={{ ...card, background: "#0d1117", border: "1px solid #388bfd" }}>
        <div style={{ ...muted, fontSize: 11, marginBottom: 6 }}>次の推奨アクション</div>
        <div style={{ fontSize: 13, lineHeight: 1.5, color: "#c9d1d9" }}>
          iPhone Private Console Phase 1 実装確認 → Session-009 (iPhone観察) → B3 5/5 → Level 3 GO
        </div>
      </div>
      <div style={{ ...muted, fontSize: 11, textAlign: "center", padding: "8px 0" }}>
        Phase 1 — 静的表示のみ / 実データ未接続
      </div>
    </div>
  );
}
