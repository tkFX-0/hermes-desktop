/**
 * PixelRoomWalls — dense back wall with status board, windows, shelves, lamps.
 * PXR-05B: increased room density.
 * CSS-only. No image assets.
 */

const MONO = '"IBM Plex Mono", ui-monospace, monospace';
const SANS = '"Noto Sans JP", "Hiragino Sans", system-ui, sans-serif';

/* ── Detailed night window ── */
function NightWindow({ style }: { style?: React.CSSProperties }): React.JSX.Element {
  return (
    <div aria-hidden style={{
      width: 70, height: 50,
      border: "2px solid rgba(40,60,140,0.55)",
      borderRadius: 4, background: "#010410",
      overflow: "hidden", position: "relative",
      boxShadow: "inset 0 0 8px rgba(88,166,255,0.08)",
      ...style,
    }}>
      {/* Stars */}
      {[[7,5],[19,9],[36,4],[52,11],[14,17],[44,7],[60,14],[28,12]].map(([x,y],i) => (
        <div key={i} style={{
          position: "absolute", left: x, top: y,
          width: i%3===0 ? 2 : 1.5, height: i%3===0 ? 2 : 1.5,
          borderRadius: "50%", background: "#fff",
          opacity: 0.35 + (i%4)*0.12,
        }} />
      ))}
      {/* Moon */}
      <div style={{
        position: "absolute", right: 8, top: 5,
        width: 9, height: 9, borderRadius: "50%",
        background: "#e8e0c0", boxShadow: "0 0 5px rgba(232,224,192,0.5)",
      }} />
      {/* Frame dividers */}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 1.5, background: "rgba(40,60,140,0.4)" }} />
      <div style={{ position: "absolute", top: "45%", left: 0, right: 0, height: 1.5, background: "rgba(40,60,140,0.4)" }} />
      {/* City */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 14 }}>
        {[2,8,13,20,26,33,39,46,52,59,65].map((lx,i) => (
          <div key={i} style={{
            position: "absolute", left: lx, bottom: 0,
            width: i%2===0 ? 3 : 4, height: 5 + (i*3)%8,
            background: i%3===0 ? "#f0883e" : i%3===1 ? "#7eb8ff" : "#2a3860",
            opacity: i%3===2 ? 0.75 : 0.5,
          }} />
        ))}
      </div>
      {/* Window glow reflection */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(135deg, rgba(88,166,255,0.04) 0%, transparent 60%)",
      }} />
    </div>
  );
}

/* ── Wall control panel ── */
function WallControlPanel({ accent, style }: { accent: string; style?: React.CSSProperties }): React.JSX.Element {
  return (
    <div aria-hidden style={{
      width: 58, height: 46,
      border: `1.5px solid ${accent}50`,
      borderRadius: 3, background: "#02080e",
      display: "flex", flexDirection: "column",
      gap: 2, padding: 4, ...style,
    }}>
      <div style={{ fontSize: 6, fontFamily: MONO, color: `${accent}88`, marginBottom: 1, letterSpacing: 0.5 }}>SYS</div>
      {[
        { color: accent, lit: true  },
        { color: "#3fb950", lit: false },
        { color: "#f0883e", lit: true  },
        { color: "#f85149", lit: true  },
      ].map((row, i) => (
        <div key={i} style={{ display: "flex", gap: 3, alignItems: "center" }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            background: row.lit ? row.color : "transparent",
            border: `1px solid ${row.color}66`,
            boxShadow: row.lit ? `0 0 4px ${row.color}` : "none",
          }} className={row.lit ? "pxr-blink" : undefined} />
          <div style={{
            flex: 1, height: 3, borderRadius: 1,
            background: `${row.color}${row.lit ? "44" : "18"}`,
          }} />
        </div>
      ))}
    </div>
  );
}

/* ── Status board (center back wall) ── */
function StatusBoard(): React.JSX.Element {
  const agents: [string, string, string][] = [
    ["しきしま", "管制デスク", "#7eb8ff"],
    ["しずめ",   "安全ゲート", "#f85149"],
    ["むすび",   "計画デスク", "#3fb950"],
    ["つむぐ",   "開発ベンチ", "#f0883e"],
    ["しるべ",   "記録ログ",   "#b07fff"],
  ];
  return (
    <div aria-hidden style={{
      width: 130, minHeight: 80,
      border: "1.5px solid rgba(88,166,255,0.35)",
      borderRadius: 5, background: "rgba(4,10,28,0.85)",
      padding: "6px 8px",
      boxShadow: "0 0 10px rgba(88,166,255,0.08)",
    }}>
      <div style={{ fontFamily: MONO, fontSize: 7, color: "#7eb8ff", letterSpacing: 1.5, marginBottom: 5, textTransform: "uppercase" }}>
        管制ボード
      </div>
      {agents.map(([name, role, color]) => (
        <div key={name} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3.5 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: color, boxShadow: `0 0 4px ${color}`, flexShrink: 0 }} />
          <span style={{ fontFamily: MONO, fontSize: 8, color, letterSpacing: 0.3 }}>{name}</span>
          <span style={{ fontFamily: SANS, fontSize: 7, color: "#5566aa", marginLeft: 2 }}>{role}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Back wall bookshelf (right side) ── */
function WallBookshelf(): React.JSX.Element {
  const colors = ["#b07fff","#3fb950","#f0883e","#7eb8ff","#f85149","#b07fff","#3fb950","#f0883e"];
  return (
    <div aria-hidden style={{
      width: 64,
      border: "1.5px solid rgba(176,127,255,0.35)",
      borderRadius: 3, background: "rgba(4,2,14,0.85)",
      padding: "4px 4px 2px",
    }}>
      <div style={{ fontFamily: MONO, fontSize: 6, color: "#b07fff88", marginBottom: 3, letterSpacing: 0.5 }}>ARCHIVE</div>
      {/* Three shelves */}
      {[
        colors.slice(0, 3),
        colors.slice(3, 6),
        colors.slice(6, 8),
      ].map((shelf, si) => (
        <div key={si} style={{ marginBottom: 4 }}>
          <div style={{ display: "flex", gap: 1.5, alignItems: "flex-end", marginBottom: 1.5 }}>
            {shelf.map((c, bi) => (
              <div key={bi} style={{
                width: 7, height: 10 + bi * 3,
                background: c, borderRadius: "1px 1px 0 0", opacity: 0.8,
              }} />
            ))}
          </div>
          <div style={{ height: 1.5, background: "rgba(176,127,255,0.25)" }} />
        </div>
      ))}
    </div>
  );
}

/* ── Wall lamp ── */
function WallLamp({ color = "#f0883e", style }: { color?: string; style?: React.CSSProperties }): React.JSX.Element {
  return (
    <div aria-hidden style={{ display: "flex", flexDirection: "column", alignItems: "center", ...style }}>
      {/* Arm */}
      <div style={{ width: 1.5, height: 10, background: "#444" }} />
      {/* Shade */}
      <div style={{ width: 16, height: 7, background: color, borderRadius: "2px 2px 6px 6px", opacity: 0.9, boxShadow: `0 2px 10px ${color}88, 0 0 16px ${color}44` }} />
      {/* Glow circle */}
      <div style={{ width: 28, height: 8, borderRadius: "50%", background: `radial-gradient(ellipse, ${color}30 0%, transparent 70%)`, marginTop: -2 }} />
    </div>
  );
}

/* ── Decorative plant ── */
function PixelPlant({ style }: { style?: React.CSSProperties }): React.JSX.Element {
  return (
    <div aria-hidden style={{ display: "flex", flexDirection: "column", alignItems: "center", ...style }}>
      {/* Leaves */}
      <div style={{ display: "flex", gap: 2, marginBottom: -2 }}>
        <div style={{ width: 10, height: 14, background: "#1a4d1a", borderRadius: "50% 50% 20% 20%", transform: "rotate(-15deg)", opacity: 0.85 }} />
        <div style={{ width: 10, height: 16, background: "#256025", borderRadius: "50% 50% 20% 20%", opacity: 0.9 }} />
        <div style={{ width: 10, height: 12, background: "#1a4d1a", borderRadius: "50% 50% 20% 20%", transform: "rotate(15deg)", opacity: 0.85 }} />
      </div>
      {/* Pot */}
      <div style={{ width: 18, height: 10, background: "#5c3d20", borderRadius: "2px 2px 4px 4px", border: "1px solid #3d2810" }} />
    </div>
  );
}

/* ── Main walls export ── */
export function PixelRoomWalls(): React.JSX.Element {
  return (
    <>
      {/* Back wall surface */}
      <div aria-hidden style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "44%",
        zIndex: 3,
        background: "linear-gradient(180deg, #010308 0%, #03091a 55%, #04091e 100%)",
        backgroundImage:
          "linear-gradient(rgba(30,50,120,0.15) 1px, transparent 1px)," +
          "linear-gradient(90deg, rgba(30,50,120,0.15) 1px, transparent 1px)",
        backgroundSize: "48px 32px",
        borderBottom: "3px solid rgba(40,60,140,0.5)",
      }} />

      {/* Wall/floor gradient shadow */}
      <div aria-hidden style={{
        position: "absolute",
        top: "41%", left: 0, right: 0, height: 50,
        zIndex: 4,
        background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 100%)",
        pointerEvents: "none",
      }} />

      {/* Wall/floor accent line */}
      <div aria-hidden style={{
        position: "absolute",
        top: "43.5%", left: 0, right: 0, height: 2,
        zIndex: 5,
        background: "linear-gradient(90deg, rgba(40,60,140,0.2), rgba(88,166,255,0.35), rgba(40,60,140,0.2))",
      }} />

      {/* LEFT: control panel */}
      <div aria-hidden style={{ position: "absolute", top: "4%", left: "2%", zIndex: 4 }}>
        <WallControlPanel accent="#f85149" />
      </div>

      {/* LEFT: wall lamp */}
      <div style={{ position: "absolute", top: "3%", left: "12%", zIndex: 4 }}>
        <WallLamp color="#f0883e" />
      </div>

      {/* LEFT: night window */}
      <div aria-hidden style={{ position: "absolute", top: "5%", left: "16%", zIndex: 4 }}>
        <NightWindow />
      </div>

      {/* LEFT: pixel plant */}
      <div style={{ position: "absolute", top: "21%", left: "12%", zIndex: 4 }}>
        <PixelPlant />
      </div>

      {/* CENTER: status board */}
      <div style={{ position: "absolute", top: "4%", left: "50%", transform: "translateX(-50%)", zIndex: 4 }}>
        <StatusBoard />
      </div>

      {/* CENTER: room label */}
      <div style={{
        position: "absolute", top: "1.5%", left: "50%", transform: "translateX(-50%)",
        zIndex: 5, fontFamily: MONO, fontSize: 9, letterSpacing: 2.5,
        color: "rgba(126,184,255,0.5)", textTransform: "uppercase", whiteSpace: "nowrap",
        textShadow: "0 0 8px rgba(88,166,255,0.3)",
      }}>
        🌙 管制室 · NIGHT OPS
      </div>

      {/* RIGHT: wall lamp */}
      <div style={{ position: "absolute", top: "3%", right: "12%", zIndex: 4 }}>
        <WallLamp color="#7eb8ff" />
      </div>

      {/* RIGHT: night window */}
      <div aria-hidden style={{ position: "absolute", top: "5%", right: "16%", zIndex: 4 }}>
        <NightWindow />
      </div>

      {/* RIGHT: bookshelf */}
      <div aria-hidden style={{ position: "absolute", top: "4%", right: "2%", zIndex: 4 }}>
        <WallBookshelf />
      </div>

      {/* RIGHT: pixel plant */}
      <div style={{ position: "absolute", top: "21%", right: "12%", zIndex: 4 }}>
        <PixelPlant />
      </div>

      {/* LEFT side wall sliver */}
      <div aria-hidden style={{
        position: "absolute", top: 0, left: 0, width: 14, bottom: 0, zIndex: 3,
        background: "linear-gradient(90deg, #010205 0%, #03060f 100%)",
        borderRight: "1px solid rgba(30,50,120,0.45)",
      }} />

      {/* RIGHT side wall sliver */}
      <div aria-hidden style={{
        position: "absolute", top: 0, right: 0, width: 14, bottom: 0, zIndex: 3,
        background: "linear-gradient(270deg, #010205 0%, #03060f 100%)",
        borderLeft: "1px solid rgba(30,50,120,0.45)",
      }} />

      {/* Stars across back wall */}
      {[[4,3],[11,8],[21,4],[32,11],[46,5],[58,8],[69,3],[80,9],[88,5],[93,12],[38,15],[62,16],[25,18],[72,13]].map(([x,y],i) => (
        <div key={i} aria-hidden style={{
          position: "absolute", left: `${x}%`, top: `${y}%`,
          width: i%3===0 ? 2 : 1.5, height: i%3===0 ? 2 : 1.5,
          borderRadius: "50%", background: "#fff",
          opacity: 0.15 + (i%4)*0.08, zIndex: 3, pointerEvents: "none",
        }} />
      ))}
    </>
  );
}
