import type { MobileConsoleSnapshot } from "../../../../shared/mobile-console";

const card: React.CSSProperties = { background: "#161b22", border: "1px solid #30363d", borderRadius: 8, padding: 14, marginBottom: 12 };
const heading: React.CSSProperties = { fontSize: 15, fontWeight: 600, color: "#a371f7", marginBottom: 12 };
const muted: React.CSSProperties = { color: "#8b949e", fontSize: 11 };
const badge = (color: string): React.CSSProperties => ({
  fontSize: 10, color, background: `${color}18`, border: `1px solid ${color}44`,
  borderRadius: 3, padding: "1px 6px", whiteSpace: "nowrap" as const,
});

interface Props { snapshot: MobileConsoleSnapshot }

export default function MobileAgentTeam({ snapshot }: Props): React.JSX.Element {
  const { agentTeam } = snapshot;
  return (
    <div>
      <div style={card}>
        <div style={heading}>エージェントチーム</div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={muted}>スケジューラー</span>
          <span style={{ fontSize: 11, color: "#f85149", fontWeight: 600 }}>
            {agentTeam.schedulerEnabled ? "有効 (警告)" : "無効"}
          </span>
        </div>
        {agentTeam.agents.map((ag) => (
          <div key={ag.id} style={{ background: "#0d1117", borderLeft: `3px solid ${ag.color}`, borderRadius: "0 6px 6px 0", padding: "8px 10px", marginBottom: 6 }}>
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
