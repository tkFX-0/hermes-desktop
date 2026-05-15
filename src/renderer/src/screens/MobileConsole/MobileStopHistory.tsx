import type { MobileConsoleSnapshot } from "../../../../shared/mobile-console";

const card: React.CSSProperties = { background: "#161b22", border: "1px solid #30363d", borderRadius: 8, padding: 14, marginBottom: 12 };
const heading: React.CSSProperties = { fontSize: 15, fontWeight: 600, color: "#f85149", marginBottom: 12 };
const muted: React.CSSProperties = { color: "#8b949e", fontSize: 12 };

interface Props { snapshot: MobileConsoleSnapshot }

export default function MobileStopHistory({ snapshot }: Props): React.JSX.Element {
  return (
    <div>
      <div style={card}>
        <div style={heading}>STOP 履歴</div>
        {snapshot.stopHistory.map((s) => (
          <div key={s.sessionId} style={{ background: "#0d1117", border: `1px solid ${s.remediated ? "#30363d" : "rgba(248,81,73,0.4)"}`, borderRadius: 6, padding: "10px 12px", marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: "#8b949e" }}>{s.date}</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: s.remediated ? "#3fb950" : "#f85149", background: s.remediated ? "rgba(63,185,80,0.1)" : "rgba(248,81,73,0.1)", border: `1px solid ${s.remediated ? "#3fb950" : "#f85149"}44`, borderRadius: 3, padding: "1px 6px" }}>
                {s.remediated ? "対処済み" : "調査中"}
              </span>
            </div>
            <div style={{ fontSize: 12, color: "#f85149", marginBottom: 4 }}>{s.stopType}</div>
            <div style={muted}>{s.note}</div>
          </div>
        ))}
        {snapshot.stopHistory.length === 0 && (
          <div style={muted}>STOPなし</div>
        )}
      </div>
      <div style={{ ...muted, textAlign: "center", padding: "4px 0" }}>
        STOP後は分類 → 安全対処 → 新GO発行の順で再開
      </div>
    </div>
  );
}
