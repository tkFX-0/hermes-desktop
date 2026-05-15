import type { MobileConsoleSnapshot, MobileAuditEvent } from "../../../../shared/mobile-console";

const card: React.CSSProperties = { background: "#161b22", border: "1px solid #30363d", borderRadius: 8, padding: 14, marginBottom: 12 };
const heading: React.CSSProperties = { fontSize: 15, fontWeight: 600, color: "#3fb950", marginBottom: 12 };
const muted: React.CSSProperties = { color: "#8b949e", fontSize: 12 };

const TYPE_COLOR: Record<MobileAuditEvent["type"], string> = {
  docs: "#58a6ff", stop: "#f85149", commit: "#3fb950", pass: "#a371f7", info: "#8b949e",
};

interface Props { snapshot: MobileConsoleSnapshot }

export default function MobileAuditSummary({ snapshot }: Props): React.JSX.Element {
  const { auditSummary, b3Progress } = snapshot;
  return (
    <div>
      <div style={card}>
        <div style={heading}>証跡サマリー</div>
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          {[
            { label: "承認待ち",   value: String(auditSummary.approvalQueueCount), color: "#8b949e" },
            { label: "監査件数",   value: auditSummary.auditLogCountLabel,          color: "#d29922" },
            { label: "メモリ候補", value: String(auditSummary.memoryCandidateCount), color: "#a371f7" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ flex: 1, background: "#0d1117", border: `1px solid ${color}44`, borderRadius: 6, padding: "8px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color }}>{value}</div>
              <div style={{ ...muted, fontSize: 11 }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ ...muted, marginBottom: 8 }}>最近の操作</div>
        {auditSummary.recentEvents.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
            <span style={{ ...muted, fontSize: 11, minWidth: 36, paddingTop: 2 }}>{item.time}</span>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: TYPE_COLOR[item.type], marginTop: 5, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "#c9d1d9", lineHeight: 1.4 }}>{item.event}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
        <span style={muted}>B3 CLEAN PASS</span>
        <span style={{ color: "#3fb950", fontWeight: 600 }}>{b3Progress.current} / {b3Progress.required}</span>
      </div>
    </div>
  );
}
