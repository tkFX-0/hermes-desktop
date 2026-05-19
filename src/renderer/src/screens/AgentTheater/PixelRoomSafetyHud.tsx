/**
 * PixelRoomSafetyHud — top-of-stage large pixel safety status boxes.
 * HOLD / execution / productionReady / raw values / standby.
 * Display-only. No toggles. No buttons.
 */

const MONO = '"IBM Plex Mono", ui-monospace, monospace';

interface Box { label: string; value: string; color: string; icon: string }

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

export function PixelRoomSafetyHud({ decision = "HOLD", lang = "ja" }: PixelRoomSafetyHudProps): React.JSX.Element {
  const dc = decColor(decision);
  const boxes: Box[] = [
    { label: lang === "ja" ? "管制ステータス" : "DECISION",      value: decision,                                 color: dc,        icon: "🛡" },
    { label: "execution",                                         value: "disabled",                               color: "#f85149", icon: "🔒" },
    { label: "productionReady",                                   value: "false",                                  color: "#f85149", icon: "🔒" },
    { label: "raw values",                                        value: "hidden",                                 color: "#6680aa", icon: "👁" },
    { label: lang === "ja" ? "現在の状態" : "status",             value: lang === "ja" ? "ただいま待機中..." : "on standby", color: "#6680aa", icon: "💤" },
  ];

  return (
    <div style={{
      display: "flex", gap: 5, flexWrap: "wrap",
      padding: "7px 12px",
      background: "rgba(2,4,14,0.92)",
      borderBottom: "2px solid rgba(40,60,140,0.5)",
      flexShrink: 0,
      zIndex: 200,
    }}>
      {boxes.map((b) => (
        <div key={b.label} style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
          padding: "5px 9px",
          background: `${b.color}12`,
          border: `1.5px solid ${b.color}44`,
          borderRadius: 4,
          flex: "1 1 80px", minWidth: 80, maxWidth: 145,
        }}>
          <span style={{ fontSize: 12 }} aria-hidden>{b.icon}</span>
          <span style={{ fontFamily: MONO, fontSize: 10, fontWeight: 700, color: b.color, letterSpacing: 0.5, textAlign: "center" }}>
            {b.value}
          </span>
          <span style={{ fontFamily: MONO, fontSize: 7.5, color: "#5566aa", textAlign: "center" }}>
            {b.label}
          </span>
        </div>
      ))}
    </div>
  );
}
