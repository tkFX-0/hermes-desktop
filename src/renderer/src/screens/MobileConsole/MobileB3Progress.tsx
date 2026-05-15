const card: React.CSSProperties = { background: "#161b22", border: "1px solid #30363d", borderRadius: 8, padding: 14, marginBottom: 12 };
const heading: React.CSSProperties = { fontSize: 15, fontWeight: 600, color: "#a371f7", marginBottom: 12 };
const muted: React.CSSProperties = { color: "#8b949e", fontSize: 12 };
const tag = (color: string): React.CSSProperties => ({
  display: "inline-block",
  background: `${color}18`,
  border: `1px solid ${color}55`,
  borderRadius: 4,
  padding: "1px 7px",
  color,
  fontSize: 11,
  fontWeight: 600,
});

const SESSIONS = [
  { id: "Session-007", result: "CLEAN_B3_PASS",            date: "05-14", color: "#3fb950" },
  { id: "Session-006", result: "CLEAN_B3_PASS",            date: "05-14", color: "#3fb950" },
  { id: "Session-008", result: "PASS_WITH_TIMING_CAVEAT",  date: "05-15", color: "#d29922" },
  { id: "Session-005", result: "CLEAN_B3_PASS",            date: "05-14", color: "#3fb950" },
  { id: "Session-003", result: "CLEAN_B3_PASS",            date: "05-15", color: "#3fb950" },
  { id: "Session-002", result: "STOP",                     date: "05-15", color: "#f85149" },
];

export default function MobileB3Progress(): React.JSX.Element {
  return (
    <div>
      <div style={card}>
        <div style={heading}>B3 セッション進捗</div>

        {/* Progress bar */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: "#c9d1d9" }}>CLEAN PASS</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#3fb950" }}>4 / 5</span>
          </div>
          <div style={{ height: 10, background: "#0d1117", borderRadius: 5, overflow: "hidden", border: "1px solid #30363d" }}>
            <div style={{ height: "100%", width: "80%", background: "#3fb950", borderRadius: 5 }} />
          </div>
        </div>

        {/* Next session */}
        <div style={{ background: "#0d1117", border: "1px solid #a371f7", borderRadius: 6, padding: "10px 12px", marginBottom: 12 }}>
          <div style={{ ...muted, marginBottom: 4 }}>次のセッション</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e6edf3" }}>Session-009</div>
          <div style={{ ...muted, marginTop: 4 }}>
            確認方法: iPhone Private Console safe display observation
          </div>
          <div style={{ ...muted, marginTop: 2 }}>
            タイミングルール: 時間窓開始 +30秒以降
          </div>
        </div>

        {/* Deprecated notice */}
        <div style={{ background: "rgba(248,81,73,0.07)", border: "1px solid rgba(248,81,73,0.3)", borderRadius: 6, padding: "8px 12px", marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: "#f85149" }}>
            旧Session-009 (PC/RustDesk Settings観察): 保留
          </div>
          <div style={{ fontSize: 11, color: "#8b949e", marginTop: 2 }}>
            iPhone Private Console Phase 2 完了後に再設定
          </div>
        </div>

        {/* Session history */}
        <div style={{ ...muted, marginBottom: 6 }}>最近のセッション</div>
        {SESSIONS.map((s) => (
          <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: "#8b949e" }}>{s.date} {s.id}</span>
            <span style={tag(s.color)}>{s.result}</span>
          </div>
        ))}
      </div>

      <div style={{ ...card, background: "#0d1117" }}>
        <div style={{ fontSize: 12, color: "#8b949e" }}>
          Level 3: 未承認 — B3 5/5 完了後に人間GOが必要
        </div>
      </div>
    </div>
  );
}
