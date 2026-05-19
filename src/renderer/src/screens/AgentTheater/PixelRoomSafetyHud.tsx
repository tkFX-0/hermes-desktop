/**
 * PixelRoomSafetyHud — game-UI style top safety status bar.
 * Reference: ３D部屋イメージ.png top HUD.
 * Large pixel boxes: HOLD / execution / productionReady / raw / standby.
 * Display-only. No toggles. No buttons.
 */

const MONO = '"IBM Plex Mono", ui-monospace, monospace';
const SANS = '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif';

function decColor(d: string) {
  if (d === "STOP") return "#f85149";
  if (d === "PASS" || d === "PASS_WITH_CAVEAT") return "#3fb950";
  if (d === "GO_READY") return "#58a6ff";
  return "#f0883e";
}

interface PixelRoomSafetyHudProps {
  decision?: string;
  lang?: "ja" | "en";
}

interface Box {
  icon: string;
  value: string;
  label: string;
  color: string;
  big?: boolean;
}

export function PixelRoomSafetyHud({ decision = "HOLD", lang = "ja" }: PixelRoomSafetyHudProps): React.JSX.Element {
  const dc = decColor(decision);

  const boxes: Box[] = [
    { icon: "🛡", value: decision, label: lang === "ja" ? "管制ステータス" : "DECISION", color: dc, big: true },
    { icon: "🔒", value: "実行無効",  label: "execution: disabled", color: "#f85149" },
    { icon: "🔒", value: "false",     label: "productionReady",      color: "#f85149" },
    { icon: "👁", value: "hidden",    label: "raw values",           color: "#6680aa" },
    { icon: "💤", value: lang === "ja" ? "ただいま待機中..." : "on standby", label: lang === "ja" ? "現在の状態" : "status", color: "#6680aa" },
  ];

  return (
    <div style={{
      display: "flex",
      alignItems: "stretch",
      gap: 4,
      padding: "6px 10px",
      background: "rgba(1,2,10,0.96)",
      borderBottom: "2px solid rgba(40,60,140,0.6)",
      flexShrink: 0,
      flexWrap: "wrap",
    }}>
      {boxes.map((b, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            padding: b.big ? "8px 14px" : "6px 10px",
            background: `${b.color}${b.big ? "20" : "10"}`,
            border: `${b.big ? 2 : 1.5}px solid ${b.color}${b.big ? "88" : "44"}`,
            borderRadius: 5,
            flex: b.big ? "0 0 auto" : "1 1 80px",
            minWidth: b.big ? 110 : 80,
            maxWidth: b.big ? 140 : 160,
            boxShadow: b.big ? `0 0 12px ${b.color}25` : "none",
          }}
          className={b.big && decision === "HOLD" ? "pxr-blink" : undefined}
        >
          <span style={{ fontSize: b.big ? 16 : 13 }} aria-hidden>{b.icon}</span>
          <span style={{
            fontFamily: MONO,
            fontSize: b.big ? 13 : 11,
            fontWeight: 700,
            color: b.color,
            letterSpacing: b.big ? 1 : 0.5,
            textAlign: "center",
            lineHeight: 1.2,
          }}>
            {b.value}
          </span>
          <span style={{
            fontFamily: b.big ? SANS : MONO,
            fontSize: b.big ? 9 : 7.5,
            color: `${b.color}88`,
            textAlign: "center",
            letterSpacing: 0.3,
          }}>
            {b.label}
          </span>
        </div>
      ))}
    </div>
  );
}
