/**
 * PixelRoomHud — Top-of-room large pixel-style status boxes.
 * Reference: ３D部屋イメージ.png (top status bar)
 * Shows HOLD / execution / productionReady / raw values / standby.
 * Display-only. No toggles. No buttons.
 */

interface PixelRoomHudProps {
  readonly decision?: string;
  readonly lang?: "ja" | "en";
}

const MONO = '"IBM Plex Mono", ui-monospace, monospace';

interface HudBox {
  label: string;
  value: string;
  color: string;
  bg: string;
  icon?: string;
}

function decisionColor(d: string): string {
  if (d === "STOP") return "#f85149";
  if (d === "PASS" || d === "PASS_WITH_CAVEAT") return "#3fb950";
  if (d === "GO_READY") return "#58a6ff";
  return "#f0883e";
}

export function PixelRoomHud({ decision = "HOLD", lang = "ja" }: PixelRoomHudProps): React.JSX.Element {
  const decColor = decisionColor(decision);

  const boxes: HudBox[] = [
    { label: lang === "ja" ? "管制ステータス" : "DECISION", value: decision, color: decColor, bg: `${decColor}18`, icon: "🛡" },
    { label: "execution", value: "disabled", color: "#f85149", bg: "rgba(248,81,73,0.1)", icon: "🔒" },
    { label: "productionReady", value: "false", color: "#f85149", bg: "rgba(248,81,73,0.1)", icon: "🔒" },
    { label: "raw values", value: "hidden", color: "#8899cc", bg: "rgba(40,60,140,0.2)", icon: "👁" },
    { label: lang === "ja" ? "現在の状態" : "standby", value: lang === "ja" ? "ただいま待機中..." : "on standby", color: "#8899cc", bg: "rgba(40,60,140,0.15)", icon: "💤" },
  ];

  return (
    <div style={{
      display: "flex",
      gap: 6,
      flexWrap: "wrap",
      padding: "8px 12px",
      background: "rgba(4,8,20,0.85)",
      borderBottom: "2px solid rgba(40,60,140,0.5)",
      flexShrink: 0,
    }}>
      {boxes.map((b) => (
        <div key={b.label} style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          padding: "6px 10px",
          background: b.bg,
          border: `1.5px solid ${b.color}55`,
          borderRadius: 5,
          minWidth: 90,
          flex: "1 1 90px",
          maxWidth: 160,
        }}>
          <span style={{ fontSize: 13 }} aria-hidden>{b.icon}</span>
          <span style={{
            fontFamily: MONO, fontSize: 11, fontWeight: 700,
            color: b.color, letterSpacing: 0.5, textAlign: "center",
            lineHeight: 1.2,
          }}>
            {b.value}
          </span>
          <span style={{
            fontFamily: MONO, fontSize: 8, color: "#6680aa",
            letterSpacing: 0.5, textAlign: "center",
          }}>
            {b.label}
          </span>
        </div>
      ))}
    </div>
  );
}
