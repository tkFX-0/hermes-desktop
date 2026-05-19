/**
 * PixelRoomLogStrip — bottom message strip + compact gate panel.
 * Display-only.
 */

const MONO = '"IBM Plex Mono", ui-monospace, monospace';
const SANS = '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif';

const GATES = [
  { label: "Git Push",        status: "HOLD",     color: "#f0883e" },
  { label: "runtime Start",   status: "HOLD",     color: "#f0883e" },
  { label: "Command Chat",    status: "HOLD",     color: "#f0883e" },
  { label: "Hermes Bridge",   status: "HOLD",     color: "#f0883e" },
  { label: "x_search Read",   status: "HOLD",     color: "#f0883e" },
  { label: "Obsidian Write",  status: "HOLD",     color: "#f0883e" },
  { label: "productionReady", status: "false",    color: "#f85149" },
  { label: "execution",       status: "disabled", color: "#f85149" },
] as const;

export function PixelRoomLogStrip(): React.JSX.Element {
  return (
    <div style={{
      display: "flex", gap: 8,
      padding: "7px 12px",
      background: "rgba(2,4,14,0.88)",
      flexWrap: "wrap",
      flexShrink: 0,
    }}>
      {/* Log / news */}
      <div style={{
        background: "rgba(8,14,36,0.7)",
        border: "1px solid rgba(40,60,140,0.4)",
        borderRadius: 5,
        padding: "7px 10px",
        flex: "1 1 180px", minWidth: 160,
      }}>
        <div style={{ fontFamily: MONO, fontSize: 7.5, color: "#7eb8ff", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
          <span aria-hidden>📢</span> おしらせ
        </div>
        {[{ icon: "🌙", text: "夜間オペレーション中です" }, { icon: "🤝", text: "みんなでつないで、いい舞台にしよう！" }].map((m,i) => (
          <div key={i} style={{ display: "flex", gap: 4, marginBottom: 2, alignItems: "flex-start" }}>
            <span style={{ fontSize: 9, flexShrink: 0 }} aria-hidden>{m.icon}</span>
            <span style={{ fontFamily: SANS, fontSize: 9.5, color: "#8899cc", lineHeight: 1.4 }}>{m.text}</span>
          </div>
        ))}
        <div style={{ marginTop: 5, paddingTop: 4, borderTop: "1px solid rgba(40,60,140,0.3)", fontFamily: MONO, fontSize: 7, color: "#404060", letterSpacing: 0.3, lineHeight: 1.5 }}>
          AIは作るところまで。鍵と発射ボタンは人間。
        </div>
      </div>

      {/* Gate panel */}
      <div style={{
        background: "rgba(8,14,36,0.7)",
        border: "1px solid rgba(40,60,140,0.4)",
        borderRadius: 5,
        padding: "7px 10px",
        flex: "0 0 auto", minWidth: 148,
      }}>
        <div style={{ fontFamily: MONO, fontSize: 7.5, color: "#7eb8ff", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 5 }}>
          Gate Status
        </div>
        {GATES.map((g) => (
          <div key={g.label} style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 2 }}>
            <span style={{ fontFamily: MONO, fontSize: 7.5, color: "#6680aa", whiteSpace: "nowrap" }}>{g.label}</span>
            <span style={{ fontFamily: MONO, fontSize: 7, fontWeight: 700, color: g.color, border: `1px solid ${g.color}44`, borderRadius: 2, padding: "0 4px", whiteSpace: "nowrap" }}>{g.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
