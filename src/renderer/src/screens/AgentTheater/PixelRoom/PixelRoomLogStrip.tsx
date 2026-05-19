/**
 * PixelRoomLogStrip — bottom message / news strip.
 * Reference: ３D部屋イメージ.png (bottom-left message area)
 * Display-only.
 */

const MONO = '"IBM Plex Mono", ui-monospace, monospace';
const SANS = '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif';

export function PixelRoomLogStrip(): React.JSX.Element {
  return (
    <div style={{
      background: "rgba(4,8,20,0.85)",
      border: "1px solid rgba(40,60,140,0.5)",
      borderRadius: 6,
      padding: "8px 12px",
      flex: "1 1 200px",
      minWidth: 180,
    }}>
      {/* Title */}
      <div style={{
        fontFamily: MONO, fontSize: 8, color: "#7eb8ff",
        letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 5,
        display: "flex", alignItems: "center", gap: 4,
      }}>
        <span style={{ fontSize: 10 }} aria-hidden>📢</span>
        おしらせ
      </div>

      {/* Messages */}
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {[
          { icon: "🌙", text: "夜間オペレーション中です" },
          { icon: "🤝", text: "みんなでつないで、いい舞台にしよう！" },
        ].map((msg, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 5 }}>
            <span style={{ fontSize: 10, flexShrink: 0, marginTop: 1 }} aria-hidden>{msg.icon}</span>
            <span style={{ fontFamily: SANS, fontSize: 10, color: "#8899cc", lineHeight: 1.4 }}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      {/* Safety note */}
      <div style={{
        marginTop: 7,
        paddingTop: 6,
        borderTop: "1px solid rgba(40,60,140,0.3)",
        fontFamily: MONO, fontSize: 7.5, color: "#484f70",
        letterSpacing: 0.3, lineHeight: 1.5,
      }}>
        AIは作るところまで。鍵と発射ボタンは人間。
      </div>
    </div>
  );
}
