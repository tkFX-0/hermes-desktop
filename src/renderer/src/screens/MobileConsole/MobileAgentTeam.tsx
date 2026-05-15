const card: React.CSSProperties = { background: "#161b22", border: "1px solid #30363d", borderRadius: 8, padding: 14, marginBottom: 12 };
const heading: React.CSSProperties = { fontSize: 15, fontWeight: 600, color: "#a371f7", marginBottom: 12 };
const muted: React.CSSProperties = { color: "#8b949e", fontSize: 11 };
const badge = (color: string): React.CSSProperties => ({
  fontSize: 10,
  color,
  background: `${color}18`,
  border: `1px solid ${color}44`,
  borderRadius: 3,
  padding: "1px 6px",
  whiteSpace: "nowrap" as const,
});

const AGENTS = [
  { id: "supervisor",             labelJa: "統括スーパーバイザ",    color: "#a371f7", category: "統括" },
  { id: "hermes_worker",          labelJa: "Hermes 作業",           color: "#58a6ff", category: "作業" },
  { id: "ichikishima_reviewer",   labelJa: "イツキシマ審査",         color: "#3fb950", category: "審査" },
  { id: "approval_guardian",      labelJa: "承認の門番",             color: "#fb923c", category: "承認" },
  { id: "audit_keeper",           labelJa: "監査保管",               color: "#39d353", category: "監査" },
  { id: "memory_curator",         labelJa: "メモリ候補",             color: "#f778ba", category: "記憶" },
  { id: "visualization_observer", labelJa: "可視化オブザーバ",       color: "#79c0ff", category: "観察" },
  { id: "suppressive_agent",      labelJa: "抑止エージェント",       color: "#f85149", category: "抑止" },
  { id: "research_agent",         labelJa: "調査エージェント",       color: "#d29922", category: "調査" },
  { id: "execution_planner",      labelJa: "実行計画（設計のみ）",   color: "#8b949e", category: "計画" },
];

export default function MobileAgentTeam(): React.JSX.Element {
  return (
    <div>
      <div style={card}>
        <div style={heading}>エージェントチーム</div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={muted}>スケジューラー</span>
          <span style={{ fontSize: 11, color: "#f85149", fontWeight: 600 }}>無効</span>
        </div>

        {AGENTS.map((ag) => (
          <div
            key={ag.id}
            style={{
              background: "#0d1117",
              borderLeft: `3px solid ${ag.color}`,
              borderRadius: "0 6px 6px 0",
              padding: "8px 10px",
              marginBottom: 6,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#e6edf3" }}>{ag.labelJa}</span>
              <span style={badge(ag.color)}>{ag.category}</span>
            </div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" as const }}>
              <span style={badge("#f85149")}>無効化中</span>
              <span style={badge("#8b949e")}>ドライランのみ</span>
              <span style={badge("#fb923c")}>承認必須</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
