/**
 * PixelRoomWalls — back wall, side accents, panels, windows for the 2.5D stage.
 * CSS-only. No image assets.
 */

const MONO = '"IBM Plex Mono", ui-monospace, monospace';

/* ── Pixel night window ── */
function NightWindow({ style }: { style?: React.CSSProperties }): React.JSX.Element {
  return (
    <div aria-hidden style={{
      width: 62, height: 44,
      border: "1.5px solid rgba(40,60,140,0.5)",
      borderRadius: 3,
      background: "#020510",
      overflow: "hidden",
      position: "relative",
      ...style,
    }}>
      {/* Stars */}
      {[[6,5],[18,9],[34,4],[48,12],[12,16],[42,7]].map(([x,y],i) => (
        <div key={i} style={{
          position: "absolute", left: x, top: y,
          width: 1.5, height: 1.5, borderRadius: "50%",
          background: "#ffffff", opacity: 0.45 + (i%3)*0.15,
        }} />
      ))}
      {/* Moon */}
      <div style={{
        position: "absolute", right: 7, top: 4,
        width: 8, height: 8, borderRadius: "50%",
        background: "#e8e0c0", boxShadow: "0 0 4px rgba(232,224,192,0.6)",
      }} />
      {/* City silhouette */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 13 }}>
        {[3,8,14,21,27,34,40,47,52,58].map((lx,i) => (
          <div key={i} style={{
            position: "absolute", left: lx, bottom: 0,
            width: 3 + i%2, height: 5 + (i*3)%7,
            background: i%3===0 ? "#f0883e" : i%3===1 ? "#7eb8ff" : "#2a3860",
            opacity: i%3===2 ? 0.8 : 0.5,
          }} />
        ))}
      </div>
    </div>
  );
}

/* ── Wall control panel ── */
function WallPanel({ accent, style }: { accent: string; style?: React.CSSProperties }): React.JSX.Element {
  return (
    <div aria-hidden style={{
      width: 52, height: 38,
      border: `1.5px solid ${accent}44`,
      borderRadius: 3, background: "#030a18",
      display: "grid", gridTemplateColumns: "1fr 1fr",
      gap: 2, padding: 3, ...style,
    }}>
      <div style={{ borderRadius: 1, background: "#0c1d4a", boxShadow: `inset 0 0 5px ${accent}66` }} />
      <div style={{ borderRadius: 1, background: "#030a18", border: "1px solid rgba(40,60,140,0.3)" }} />
      <div style={{ borderRadius: 1, background: "#030a18", border: "1px solid rgba(40,60,140,0.3)" }} />
      <div style={{ borderRadius: 1, background: "#1a1000", boxShadow: "inset 0 0 4px rgba(245,158,11,0.4)" }} />
    </div>
  );
}

/* ── Main wall export ── */
export function PixelRoomWalls(): React.JSX.Element {
  return (
    <>
      {/* Back wall surface */}
      <div aria-hidden style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "46%",
        zIndex: 3,
        background: "linear-gradient(180deg, #02050f 0%, #060d20 60%, #080e24 100%)",
        backgroundImage:
          "linear-gradient(rgba(30,50,120,0.18) 1px, transparent 1px)," +
          "linear-gradient(90deg, rgba(30,50,120,0.18) 1px, transparent 1px)",
        backgroundSize: "48px 32px",
        borderBottom: "2px solid rgba(40,60,140,0.4)",
      }} />

      {/* Wall/floor junction line */}
      <div aria-hidden style={{
        position: "absolute",
        top: "44%",
        left: 0, right: 0,
        height: 3,
        zIndex: 4,
        background: "linear-gradient(90deg, rgba(40,60,140,0.3), rgba(88,166,255,0.2), rgba(40,60,140,0.3))",
      }} />

      {/* Left wall accent panel */}
      <div aria-hidden style={{
        position: "absolute",
        top: "4%", left: "2%",
        zIndex: 4,
      }}>
        <WallPanel accent="#f85149" />
      </div>

      {/* Left night window */}
      <div aria-hidden style={{
        position: "absolute",
        top: "6%", left: "14%",
        zIndex: 4,
      }}>
        <NightWindow />
      </div>

      {/* Center top label */}
      <div style={{
        position: "absolute",
        top: "5%", left: "50%",
        transform: "translateX(-50%)",
        zIndex: 4,
        fontFamily: MONO,
        fontSize: 10, letterSpacing: 2,
        color: "rgba(126,184,255,0.55)",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        textShadow: "0 0 8px rgba(88,166,255,0.3)",
      }}>
        🌙 管制室 · NIGHT OPS
      </div>

      {/* Right night window */}
      <div aria-hidden style={{
        position: "absolute",
        top: "6%", right: "14%",
        zIndex: 4,
      }}>
        <NightWindow />
      </div>

      {/* Right wall accent panel */}
      <div aria-hidden style={{
        position: "absolute",
        top: "4%", right: "2%",
        zIndex: 4,
      }}>
        <WallPanel accent="#b07fff" />
      </div>

      {/* Left side wall sliver */}
      <div aria-hidden style={{
        position: "absolute",
        top: 0, left: 0,
        width: 14,
        bottom: 0,
        zIndex: 3,
        background: "linear-gradient(90deg, #020408 0%, #040810 100%)",
        borderRight: "1px solid rgba(30,50,120,0.4)",
      }} />

      {/* Right side wall sliver */}
      <div aria-hidden style={{
        position: "absolute",
        top: 0, right: 0,
        width: 14,
        bottom: 0,
        zIndex: 3,
        background: "linear-gradient(270deg, #020408 0%, #040810 100%)",
        borderLeft: "1px solid rgba(30,50,120,0.4)",
      }} />

      {/* Stars on back wall */}
      {[[5,4],[15,9],[28,5],[55,7],[70,3],[82,9],[92,5],[35,12],[60,14],[45,6]].map(([x,y],i) => (
        <div key={i} aria-hidden style={{
          position: "absolute",
          left: `${x}%`, top: `${y}%`,
          width: 1.5, height: 1.5, borderRadius: "50%",
          background: "#fff",
          opacity: 0.2 + (i%4)*0.1,
          zIndex: 3,
          pointerEvents: "none",
        }} />
      ))}
    </>
  );
}
